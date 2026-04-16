import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

export type AppRole = "owner" | "manager" | "marketing" | "staff";

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
const LOGIN_TIMEOUT_MS = 10_000;

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
function clearAuthStorage(): void {
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
 * Called on useAuth mount to prevent LoginGuard from redirecting with ghost credentials.
 * (SEC-013: defensive check on login — different principal → clear role)
 */
function clearStaleSession(
  identityPresent: boolean,
  currentPrincipal?: string,
): void {
  if (!identityPresent) {
    clearAuthStorage();
    return;
  }
  // If a principal is stored and it doesn't match the current identity,
  // a different user logged in on the same device — clear the old role.
  if (currentPrincipal !== undefined) {
    const storedPrincipal = getStoredPrincipal();
    if (storedPrincipal !== null && storedPrincipal !== currentPrincipal) {
      clearAuthStorage();
    }
  }
}

export function useAuth() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Prevent concurrent login calls with a ref — avoids stale closure lock
  const loginInProgressRef = useRef(false);
  // Timeout ref so we can clear it on unmount
  const loginTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAuthenticated = loginStatus === "success" && !!identity;
  const isLoading = loginStatus === "logging-in";
  const storedRole = getStoredRole();
  // Provide a safe fallback for components that need a non-null role
  const role: AppRole = storedRole ?? "manager";

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

  // Stable refs for mount-only effect (avoids exhaustive-deps lint error)
  const releaseLockRef = useRef(releaseLock);
  releaseLockRef.current = releaseLock;
  const loginStatusRef = useRef(loginStatus);
  loginStatusRef.current = loginStatus;
  const identityRef = useRef(identity);
  identityRef.current = identity;

  /**
   * On mount: unconditionally reset the lock AND clear any stale localStorage
   * session data when II has no authenticated identity. This handles the
   * browser-with-history bug where loginInProgressRef stayed true from a
   * previous session and the button silently blocked all new login attempts.
   */
  useEffect(() => {
    // Always release any leftover lock on mount — regardless of loginStatus
    releaseLockRef.current();
    // If II has no identity (not authenticated), wipe stale localStorage
    // so LoginGuard never redirects based on ghost credentials.
    // If a different principal is now active, also wipe the old role. (SEC-013)
    const identityPresent =
      loginStatusRef.current === "success" && !!identityRef.current;
    const currentPrincipal = identityRef.current?.getPrincipal().toText();
    clearStaleSession(identityPresent, currentPrincipal);
  }, []); // intentionally runs once on mount only

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
  }, [loginStatus, releaseLock]);

  // Release lock on component unmount to prevent ghost locks
  useEffect(() => {
    return () => {
      releaseLock();
    };
  }, [releaseLock]);

  /**
   * Triggers Internet Identity login.
   * - Ref-based lock prevents concurrent calls.
   * - 10-second timeout auto-resets the lock if II hangs.
   * - Clears lock in ALL exit paths: success, error, timeout, retry error.
   * - After login, compares the new principal to any stored one; clears
   *   stale role if a different user is now authenticated. (SEC-013)
   */
  const handleLogin = useCallback(async () => {
    if (loginInProgressRef.current) return;
    loginInProgressRef.current = true;

    // Safety timeout: after LOGIN_TIMEOUT_MS, force-reset the lock so the
    // button becomes clickable again even if II never resolves.
    loginTimeoutRef.current = setTimeout(() => {
      loginInProgressRef.current = false;
      loginTimeoutRef.current = null;
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
      const err = error as { message?: string };
      if (err?.message === "User is already authenticated") {
        // Clear stale II session and retry once
        try {
          await clear();
          await new Promise((resolve) => setTimeout(resolve, 300));
          await login();
        } catch (retryError: unknown) {
          console.error("Login retry error:", retryError);
        }
      } else {
        console.error("Login error:", error);
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
    await clear();
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
    isLoading,
    identity,
    role,
    storedRole,
    login: handleLogin,
    logout: handleLogout,
    requireAuth,
    requireOwner,
    loginStatus,
  };
}
