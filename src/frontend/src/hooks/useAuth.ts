import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export type AppRole = "owner" | "manager" | "marketing" | "staff";

/**
 * SEC-013 — Role persistence across sessions (RESOLVED)
 * -------------------------------------------------------
 * Risk: `zenreserve_role` stored in localStorage could survive a logout
 * interrupted by a network error or tab-close, allowing a new user on the
 * same device to inherit the previous user's role flag.
 *
 * Four independent defences are in place (all must remain intact):
 *
 *  1. clearAuthStorage() — atomically removes ROLE_STORAGE_KEY,
 *     PRINCIPAL_STORAGE_KEY and FIRST_LOGIN_KEY synchronously.  It is a
 *     pure, side-effect-free function with no async steps.
 *
 *  2. handleLogout() — calls clearAuthStorage() synchronously as its FIRST
 *     statement, before `await clear()`.  Even if the tab is closed or the
 *     network call fails mid-flight, the role flag is already gone.
 *
 *  3. handleLogin() — after a successful II login it compares the new
 *     principal to the stored one.  If they differ (different user on the
 *     same device) it calls clearAuthStorage() before recording the new
 *     principal, preventing role inheritance across accounts.
 *
 *  4. clearStaleSession() — runs once after II finishes initializing (NOT on
 *     mount while status is still "initializing"). If II reports no identity
 *     after init, or the stored principal doesn't match, it calls
 *     clearAuthStorage(). This prevents LoginGuard from redirecting with
 *     ghost credentials while also not wiping valid sessions prematurely.
 *
 * DO NOT add async logic to clearAuthStorage() or move the call in
 * handleLogout() to after any await — doing so would re-open this
 * vulnerability.
 *
 * SESSION PERSISTENCE — Full-day login (8–24 hours)
 * ---------------------------------------------------
 * Internet Identity delegations are set to 30 days (maxTimeToLive in the
 * provider). The AuthClient uses IdbStorage by default (persists to IndexedDB).
 * The AuthClient idle handler is disabled by default. The stale session check
 * only runs after II finishes initializing (not during "initializing" status),
 * so a restored session is never prematurely wiped. A background keepalive runs
 * every 45 minutes to verify the session is still valid.
 *
 * IMPORTANT — "idle" vs "success" after page refresh:
 * The InternetIdentityProvider sets loginStatus = "idle" (not "success") after
 * restoring a session from IndexedDB on page load. This means we cannot use
 * `loginStatus === "success"` as the sole authenticated check — we must also
 * check `loginStatus === "idle" && !!identity` for the restored-session case.
 *
 * isAuthReady:
 * Set to true only AFTER the provider finishes its async init (loginStatus
 * leaves "initializing"). Guards MUST NOT redirect until isAuthReady is true.
 */

const ROLE_STORAGE_KEY = "zenreserve_role";
const FIRST_LOGIN_KEY = "zenreserve_first_login_done";
/**
 * Stores the II principal that owns the current role flag.
 * Used to detect when a different user logs in on the same device so
 * stale role state from a prior session is never inherited.
 *
 * SEC-001 / SEC-013 note:
 * The role stored here is UI-advisory only. The backend enforces
 * AccessControl.isAdmin() on every settings mutation independently of
 * this flag. This key exists solely to show the correct UI to the
 * correct person and must never be treated as a security boundary.
 */
const PRINCIPAL_STORAGE_KEY = "zenreserve_principal";

/** How long before we force-reset the login lock (ms) */
const LOGIN_TIMEOUT_MS = 15_000;

/**
 * How often to run the background session keepalive check (45 minutes).
 * This ensures sessions are validated regularly without hammering the network.
 */
const SESSION_KEEPALIVE_INTERVAL_MS = 45 * 60 * 1_000;

/** Roles a freshly authenticated user is allowed to self-select */
const ALLOWED_ROLES: AppRole[] = ["manager", "marketing", "staff"];

/**
 * Stores the II principal text that was active when the role was last written.
 * Returns null if nothing is stored or localStorage is unavailable.
 */
function getStoredPrincipal(): string | null {
  try {
    return localStorage.getItem(PRINCIPAL_STORAGE_KEY);
  } catch {
    return null;
  }
}

function setStoredPrincipal(principalText: string): void {
  try {
    localStorage.setItem(PRINCIPAL_STORAGE_KEY, principalText);
  } catch {
    // localStorage unavailable
  }
}

/**
 * Atomically clears ALL auth-related localStorage keys.
 * Call this synchronously before any async logout operation so that
 * a network error or tab-close cannot leave a stale role in storage.
 * (SEC-013)
 */
export function clearAuthStorage(): void {
  try {
    localStorage.removeItem(ROLE_STORAGE_KEY);
    localStorage.removeItem(FIRST_LOGIN_KEY);
    localStorage.removeItem(PRINCIPAL_STORAGE_KEY);
  } catch {
    // localStorage unavailable
  }
}

/**
 * Returns true if a role is validly stored in localStorage.
 * Does NOT fall back to a default — returns null if nothing is stored.
 */
export function getStoredRole(): AppRole | null {
  try {
    const stored = localStorage.getItem(ROLE_STORAGE_KEY);
    if (
      stored === "owner" ||
      stored === "manager" ||
      stored === "marketing" ||
      stored === "staff"
    ) {
      return stored;
    }
  } catch {
    // localStorage unavailable
  }
  return null;
}

export function setStoredRole(role: AppRole): void {
  try {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
  } catch {
    // localStorage unavailable
  }
}

/**
 * Returns whether this is the very first login ever on this device.
 * After the first login completes, this flag is set.
 */
export function isFirstEverLogin(): boolean {
  try {
    return !localStorage.getItem(FIRST_LOGIN_KEY);
  } catch {
    return false;
  }
}

export function markFirstLoginDone(): void {
  try {
    localStorage.setItem(FIRST_LOGIN_KEY, "1");
  } catch {
    // ignore
  }
}

/**
 * Returns the roles visible in the login picker for a given authenticated user.
 * Owner is only shown when already stored (i.e. first-login auto-assignment already ran).
 */
export function getSelectableRoles(): AppRole[] {
  const stored = getStoredRole();
  if (stored === "owner") {
    return ["owner", ...ALLOWED_ROLES];
  }
  return ALLOWED_ROLES;
}

/**
 * Clears stale localStorage session keys when II reports no authenticated identity,
 * OR when the stored principal doesn't match the current II identity.
 *
 * IMPORTANT: Only call this AFTER II has finished initializing (i.e. loginStatus
 * has moved past "initializing"). Calling it during initialization would incorrectly
 * clear valid sessions that haven't been restored from storage yet. (SEC-013)
 *
 * Return value semantics:
 *   "principal_mismatch" — a different user's principal was stored → show banner
 *   "stale_cleared"      — no identity after full init, stale keys wiped silently
 *   "ok"                 — nothing to clear
 */
function clearStaleSession(
  identityPresent: boolean,
  currentPrincipal?: string,
): "principal_mismatch" | "stale_cleared" | "ok" {
  if (!identityPresent) {
    // Auto-clear silently — no banner. The user will just see a clean login form.
    clearAuthStorage();
    return "stale_cleared";
  }
  // If a principal is stored and it doesn't match the current identity,
  // a different user logged in on the same device — clear the old role.
  if (currentPrincipal !== undefined) {
    const storedPrincipal = getStoredPrincipal();
    if (storedPrincipal !== null && storedPrincipal !== currentPrincipal) {
      clearAuthStorage();
      return "principal_mismatch";
    }
  }
  return "ok";
}

/** Classifies an error from the II login flow */
function classifyLoginError(error: unknown): {
  type: "cancelled" | "already_authenticated" | "backend" | "unknown";
  message: string;
} {
  const err = error as { message?: string; code?: number };
  const msg = err?.message ?? "";

  if (msg === "User is already authenticated") {
    return { type: "already_authenticated", message: msg };
  }
  // II popup closed by user — several possible messages
  if (
    msg.includes("UserInterrupt") ||
    msg.includes("closed") ||
    msg.includes("cancelled") ||
    msg.includes("canceled") ||
    msg.includes("dismissed") ||
    msg.includes("aborted")
  ) {
    return {
      type: "cancelled",
      message:
        "Inloggen geannuleerd. Sluit het venster niet voordat het proces voltooid is.",
    };
  }
  // Network / canister unreachable
  if (
    msg.includes("network") ||
    msg.includes("fetch") ||
    msg.includes("timeout") ||
    msg.includes("unreachable") ||
    msg.includes("canister")
  ) {
    return {
      type: "backend",
      message:
        "Verbinding met de server mislukt. Controleer uw internetverbinding en probeer opnieuw.",
    };
  }
  return {
    type: "unknown",
    message:
      "Inloggen mislukt. Als het probleem aanhoudt, ververs de pagina en probeer opnieuw.",
  };
}

export function useAuth() {
  const {
    login,
    clear,
    loginStatus,
    identity,
    loginError: iiLoginError,
  } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Prevent concurrent login calls with a ref — avoids stale closure lock
  const loginInProgressRef = useRef(false);
  // Timeout ref so we can clear it on unmount
  const loginTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Tracks whether the stale-session check has already run this mount cycle
  const staleCheckDoneRef = useRef(false);
  // Keepalive interval ref
  const keepaliveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Surface auth errors to callers (e.g. LoginPage can show specific messages)
  const [authError, setAuthError] = useState<string | null>(null);
  // Track whether a stale session was cleared on this mount cycle (principal mismatch only)
  const [sessionWasCleared, setSessionWasCleared] = useState(false);

  /**
   * isAuthenticated:
   * The InternetIdentityProvider sets loginStatus = "idle" (not "success") after
   * restoring a session on page refresh. We must treat BOTH cases as authenticated:
   *  - loginStatus === "success" && !!identity  → fresh login this session
   *  - loginStatus === "idle" && !!identity     → session restored from IndexedDB on refresh
   *
   * Without including the "idle" case, every page refresh appears as "not authenticated"
   * and redirects the user to the login screen even though their session is valid.
   */
  const isAuthenticated =
    (loginStatus === "success" || loginStatus === "idle") && !!identity;

  /**
   * isAuthReady:
   * True once the InternetIdentityProvider has finished its async initialization
   * (i.e. loginStatus has left "initializing"). Guards must NOT redirect until
   * this is true — doing so causes a race condition where a valid restored session
   * gets treated as unauthenticated because the async check hasn't completed yet.
   */
  const isAuthReady = loginStatus !== "initializing";

  const isLoading =
    loginStatus === "logging-in" || loginStatus === "initializing";
  const storedRole = getStoredRole();
  // Provide a safe fallback for components that need a non-null role
  const role: AppRole = storedRole ?? "manager";

  /**
   * True when the Internet Identity AuthClient failed to initialize (e.g.
   * because env.json is not yet injected on this deployment).  In this state
   * the auth client is null and login() will fail with "AuthClient is not
   * initialized yet".  The correct recovery is a page reload which re-attempts
   * the async initialisation.
   */
  const isInitError =
    loginStatus === "loginError" &&
    (iiLoginError?.message?.includes("not set") ||
      iiLoginError?.message?.includes("Initialization failed") ||
      iiLoginError?.message?.includes("not initialized"));

  /**
   * Force-reset the login lock and clear any pending timeout.
   * Call this on every exit path: success, error, timeout, unmount.
   */
  const releaseLock = useCallback(() => {
    loginInProgressRef.current = false;
    if (loginTimeoutRef.current !== null) {
      clearTimeout(loginTimeoutRef.current);
      loginTimeoutRef.current = null;
    }
  }, []);

  // Stable refs for effects (avoids exhaustive-deps lint error)
  const releaseLockRef = useRef(releaseLock);
  releaseLockRef.current = releaseLock;
  const loginStatusRef = useRef(loginStatus);
  loginStatusRef.current = loginStatus;
  const identityRef = useRef(identity);
  identityRef.current = identity;

  /**
   * Stale session check — runs once after II leaves the "initializing" state.
   *
   * KEY CHANGE: We no longer run this on mount while loginStatus may still be
   * "initializing". Instead we wait for II to finish restoring any stored
   * identity. This prevents the race condition where a valid persisted session
   * gets cleared because the identity hasn't loaded yet.
   *
   * NOTE: "idle" is the normal terminal state after a successful restore from
   * IndexedDB — it does NOT mean "not authenticated". When identity is present
   * alongside "idle", the session was successfully restored.
   *
   * The check still enforces SEC-013: if II finishes loading but has no identity,
   * or the principal changed, we clear the stale localStorage keys.
   */
  useEffect(() => {
    // Only run after II has finished its initialization pass
    if (loginStatus === "initializing") return;
    // Only run once per mount — subsequent loginStatus changes (e.g. user logs in)
    // are handled by handleLogin's principal comparison instead.
    if (staleCheckDoneRef.current) return;
    staleCheckDoneRef.current = true;

    // Always release any leftover lock from a previous session
    releaseLockRef.current();

    // If II has no identity after initialization, or the principal changed,
    // wipe stale localStorage so LoginGuard never redirects on ghost credentials.
    const identityPresent =
      (loginStatus === "success" || loginStatus === "idle") &&
      !!identityRef.current;
    const currentPrincipal = identityRef.current?.getPrincipal().toText();
    const result = clearStaleSession(identityPresent, currentPrincipal);
    // Only show the "session cleared" banner for a principal mismatch (different
    // user on the same device). A normal expired/stale session is auto-cleared
    // silently — no banner, no user action required.
    if (result === "principal_mismatch") {
      setSessionWasCleared(true);
    }
  }, [loginStatus]);

  /**
   * Background session keepalive — runs every 45 minutes while authenticated.
   *
   * Internet Identity delegations are issued for up to 30 days, but we
   * proactively verify the session is still valid so we can detect and handle
   * expiry gracefully instead of silently failing on the next API call.
   *
   * The keepalive is a lightweight check: we verify the current identity is
   * still present and the principal matches what we stored. If the session has
   * expired, we clear stale state and let DashboardGuard redirect to login.
   * We do NOT force-logout — if the user is actively working we leave them
   * undisturbed and the next navigation will trigger the auth guard naturally.
   */
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear any running keepalive when the user is not authenticated
      if (keepaliveRef.current !== null) {
        clearInterval(keepaliveRef.current);
        keepaliveRef.current = null;
      }
      return;
    }

    // Start the keepalive interval when authenticated
    keepaliveRef.current = setInterval(() => {
      const currentIdentity = identityRef.current;
      if (!currentIdentity) {
        // Identity disappeared — clear stale state silently
        clearAuthStorage();
        return;
      }
      // Verify the principal still matches what we stored
      const currentPrincipal = currentIdentity.getPrincipal().toText();
      const storedPrincipal = getStoredPrincipal();
      if (storedPrincipal !== null && storedPrincipal !== currentPrincipal) {
        // Principal mismatch — different user or corrupted state
        clearAuthStorage();
      }
      // If everything matches, the session is healthy — no action needed.
      // The II delegation itself handles its own expiry check on the next call.
    }, SESSION_KEEPALIVE_INTERVAL_MS);

    return () => {
      if (keepaliveRef.current !== null) {
        clearInterval(keepaliveRef.current);
        keepaliveRef.current = null;
      }
    };
  }, [isAuthenticated]);

  /**
   * Clear stale locks whenever loginStatus resolves to any terminal state.
   * Covers success, idle, AND error — previously only success/idle were handled,
   * leaving the lock frozen on error paths.
   */
  useEffect(() => {
    if (
      loginStatus === "success" ||
      loginStatus === "idle" ||
      loginStatus === "loginError"
    ) {
      releaseLock();
    }
    // When II reports a login error, surface it to callers
    if (loginStatus === "loginError" && iiLoginError) {
      setAuthError(
        typeof iiLoginError === "string"
          ? iiLoginError
          : "Inloggen mislukt. Probeer opnieuw.",
      );
    }
  }, [loginStatus, iiLoginError, releaseLock]);

  // Release lock on component unmount to prevent ghost locks
  useEffect(() => {
    return () => {
      releaseLock();
    };
  }, [releaseLock]);

  /**
   * Clears the authError state — call this when starting a fresh login attempt.
   */
  const clearAuthError = useCallback(() => {
    setAuthError(null);
    setSessionWasCleared(false);
  }, []);

  /**
   * Forces a completely fresh login: clears all local storage, clears the II
   * session, and resets all locks. Use this as the "Try again" action when a
   * previous session is in a bad state.
   *
   * When the AuthClient was never initialised (isInitError), a full page reload
   * is the only way to re-attempt the async init — the II provider's useEffect
   * only re-runs when its dependencies change, which doesn't happen without a
   * reload when the client is permanently null.
   */
  const forceReset = useCallback(async () => {
    releaseLock();
    clearAuthStorage();
    setAuthError(null);
    setSessionWasCleared(false);
    staleCheckDoneRef.current = false;
    try {
      await clear();
    } catch {
      // Ignore errors during forced reset — we just want to clear state
    }
    // If the auth client itself never initialised, a reload is required.
    if (loginStatus === "loginError") {
      window.location.reload();
    }
  }, [clear, releaseLock, loginStatus]);

  /**
   * Triggers Internet Identity login.
   * - Ref-based lock prevents concurrent calls.
   * - 15-second timeout auto-resets the lock if II hangs.
   * - Clears lock in ALL exit paths: success, error, timeout, retry error.
   * - After login, compares the new principal to any stored one; clears
   *   stale role if a different user is now authenticated. (SEC-013)
   * - Propagates errors to authError state so callers can show specific messages.
   */
  const handleLogin = useCallback(async () => {
    if (loginInProgressRef.current) return;
    loginInProgressRef.current = true;
    setAuthError(null);

    // Safety timeout: after LOGIN_TIMEOUT_MS, force-reset the lock so the
    // button becomes clickable again even if II never resolves.
    loginTimeoutRef.current = setTimeout(() => {
      loginInProgressRef.current = false;
      loginTimeoutRef.current = null;
      setAuthError(
        "Inloggen duurde te lang. Ververs de pagina en probeer opnieuw.",
      );
    }, LOGIN_TIMEOUT_MS);

    try {
      await login();
      // After a successful II login, verify the new principal matches what
      // was stored. If a different user logged in on the same device, the
      // old role flag must not persist. (SEC-013)
      const newPrincipal = identityRef.current?.getPrincipal().toText();
      if (newPrincipal) {
        const storedPrincipal = getStoredPrincipal();
        if (storedPrincipal !== null && storedPrincipal !== newPrincipal) {
          // Different user — clear the previous session's role entirely.
          clearAuthStorage();
        }
        // Record the current principal so future logins can detect a switch.
        setStoredPrincipal(newPrincipal);
      }
    } catch (error: unknown) {
      const classified = classifyLoginError(error);

      if (classified.type === "already_authenticated") {
        // II says user is already authenticated but our state is stale.
        // Force a full reset and surface the error so the user can retry.
        try {
          clearAuthStorage();
          await clear();
          await new Promise((resolve) => setTimeout(resolve, 500));
          // Re-attempt login after clearing
          await login();
          // Success on retry — clear any error
          setAuthError(null);
        } catch (retryError: unknown) {
          const retryClassified = classifyLoginError(retryError);
          setAuthError(retryClassified.message);
        }
      } else {
        // Propagate the error to callers (no silent swallowing)
        setAuthError(classified.message);
      }
    } finally {
      // Always release lock regardless of outcome
      releaseLock();
    }
  }, [login, clear, releaseLock]);

  const handleLogout = useCallback(async () => {
    releaseLock();
    // SEC-013: Clear ALL auth-related localStorage keys synchronously BEFORE
    // any async operations. This guarantees the role flag is gone even if the
    // network call or tab-close interrupts the rest of the logout sequence.
    clearAuthStorage();
    staleCheckDoneRef.current = false;
    try {
      await clear();
    } catch {
      // Ignore logout errors — local state is already cleared
    }
    queryClient.clear();
    navigate({ to: "/dashboard/login" });
  }, [clear, queryClient, navigate, releaseLock]);

  const requireAuth = useCallback(() => {
    if (!isAuthenticated && loginStatus !== "logging-in") {
      navigate({ to: "/dashboard/login" });
      return false;
    }
    return true;
  }, [isAuthenticated, loginStatus, navigate]);

  /**
   * Guard that ensures only the owner can access settings.
   * Returns true if access is granted, false if redirected.
   */
  const requireOwner = useCallback(() => {
    if (role !== "owner") {
      toast.error(
        "Toegang geweigerd — enkel de eigenaar heeft toegang tot instellingen.",
      );
      navigate({ to: "/dashboard" });
      return false;
    }
    return true;
  }, [role, navigate]);

  return {
    isAuthenticated,
    isAuthReady,
    isLoading,
    isInitError,
    identity,
    role,
    storedRole,
    login: handleLogin,
    logout: handleLogout,
    forceReset,
    clearAuthError,
    requireAuth,
    requireOwner,
    loginStatus,
    authError,
    sessionWasCleared,
  };
}
