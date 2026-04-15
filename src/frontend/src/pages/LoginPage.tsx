import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import {
  getSelectableRoles,
  getStoredRole,
  isFirstEverLogin,
  markFirstLoginDone,
  setStoredRole,
  useAuth,
} from "@/hooks/useAuth";
import type { AppRole } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart2,
  ChefHat,
  Megaphone,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface RoleOption {
  id: AppRole;
  labelKey: string;
  descKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ALL_ROLE_OPTIONS: RoleOption[] = [
  {
    id: "owner",
    labelKey: "roles.owner",
    descKey: "roles.ownerDesc",
    icon: ShieldCheck,
  },
  {
    id: "manager",
    labelKey: "roles.manager",
    descKey: "roles.managerDesc",
    icon: Users,
  },
  {
    id: "marketing",
    labelKey: "roles.marketing",
    descKey: "roles.marketingDesc",
    icon: Megaphone,
  },
];

const FEATURE_KEYS = [
  { icon: BarChart2, key: "features.kpi" },
  { icon: ChefHat, key: "features.experiences" },
  { icon: Users, key: "features.guests" },
];

export default function LoginPage() {
  const { t } = useTranslation(["dashboard", "shared"]);
  const { isAuthenticated, isLoading, login, storedRole, loginStatus } =
    useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track whether we've already handled the post-login redirect to avoid double fires
  const handledRef = useRef(false);

  // Filter selectable roles — owner only shown when already stored
  const selectableRoleIds = getSelectableRoles();
  const roleOptions = ALL_ROLE_OPTIONS.filter((r) =>
    selectableRoleIds.includes(r.id),
  );

  // Auto-dismiss login error after 5 seconds
  useEffect(() => {
    if (!loginError) return;
    const timer = setTimeout(() => setLoginError(null), 5000);
    return () => clearTimeout(timer);
  }, [loginError]);

  const isAuthenticatedRef = useRef(isAuthenticated);
  isAuthenticatedRef.current = isAuthenticated;
  const loginStatusRef = useRef(loginStatus);
  loginStatusRef.current = loginStatus;

  /**
   * Unconditional mount reset — handles the browser-with-history bug:
   * 1. Always reset isSubmitting so the button is never frozen on arrival.
   * 2. If II reports no identity, clear stale localStorage role/first-login
   *    so LoginGuard never redirects with ghost credentials.
   */
  useEffect(() => {
    setIsSubmitting(false);
    handledRef.current = false;
    // Clear stale session when II has no identity
    const identityPresent =
      loginStatusRef.current === "success" && !!isAuthenticatedRef.current;
    if (!identityPresent) {
      const storedRoleValue = getStoredRole();
      if (storedRoleValue !== null) {
        try {
          localStorage.removeItem("zenreserve_role");
          localStorage.removeItem("zenreserve_first_login_done");
        } catch {
          // localStorage unavailable
        }
      }
    }
  }, []); // intentionally runs once on mount only

  /**
   * Core post-authentication logic:
   * - If already authenticated when this page loads → redirect immediately.
   * - First-ever login → auto-assign owner role and redirect.
   * - Subsequent logins with stored role → redirect directly.
   * - Subsequent logins without stored role → show role picker.
   */
  useEffect(() => {
    if (!isAuthenticated || handledRef.current) return;

    // Reset submitting lock now that auth has resolved
    setIsSubmitting(false);

    const firstLogin = isFirstEverLogin();

    if (firstLogin) {
      // First user to authenticate becomes the owner automatically — never see role picker
      handledRef.current = true;
      setStoredRole("owner");
      markFirstLoginDone();
      void navigate({ to: "/dashboard" });
      return;
    }

    // If a role is already stored (returning user), skip role picker
    if (storedRole !== null) {
      handledRef.current = true;
      void navigate({ to: "/dashboard" });
    }
    // Otherwise fall through to show the role picker (Step 2)
  }, [isAuthenticated, storedRole, navigate]);

  const handleLogin = async () => {
    setLoginError(null);
    setIsSubmitting(true);
    // Reset handledRef so a fresh login cycle can navigate
    handledRef.current = false;
    try {
      await login();
      // Navigation is handled in the useEffect above when isAuthenticated flips.
      // If login() resolves but isAuthenticated is still false (user cancelled II),
      // reset the submitting state so the button is clickable again.
      setIsSubmitting(false);
    } catch {
      setLoginError(t("dashboard:login.loginFailed"));
      setIsSubmitting(false);
    }
  };

  const handleRoleConfirm = () => {
    if (!selectedRole) return;
    setStoredRole(selectedRole);
    markFirstLoginDone();
    handledRef.current = true;
    void navigate({ to: "/dashboard" });
  };

  // Show role picker only when authenticated and no role stored yet (and not first login)
  const showRolePicker =
    isAuthenticated && storedRole === null && !isFirstEverLogin();

  // The login button is busy only when actively submitting AND not yet authenticated
  // Once isAuthenticated flips to true, the useEffect above will navigate — don't keep button frozen
  const loginBusy = (isLoading || isSubmitting) && !isAuthenticated;

  return (
    <div
      className="dark min-h-screen bg-background flex items-center justify-center p-4"
      data-ocid="login-page"
    >
      <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        {/* Brand header */}
        <div className="text-center mb-8 space-y-3">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-soft">
            <ChefHat className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-display text-foreground">
              ZenReserve
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("dashboard:login.subtitle2")}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card shadow-elevated overflow-hidden">
          {!showRolePicker ? (
            /* ── Step 1: Login ── */
            <div className="p-8 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-foreground">
                  {t("dashboard:login.welcomeBack")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("dashboard:login.subtitle")}
                </p>
              </div>

              <ul
                className="space-y-3"
                aria-label={t("dashboard:login.subtitle2")}
              >
                {FEATURE_KEYS.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <li
                      key={feature.key}
                      className="flex items-center gap-3 text-sm text-muted-foreground"
                    >
                      <div
                        className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"
                        aria-hidden="true"
                      >
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      {t(`dashboard:login.${feature.key}`)}
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-border" />

              <div className="space-y-3">
                <Button
                  className="w-full h-12 text-base font-semibold gap-2"
                  onClick={handleLogin}
                  disabled={loginBusy}
                  data-ocid="login-btn"
                  aria-label={t("dashboard:login.loginButton")}
                >
                  {loginBusy
                    ? t("dashboard:login.loggingIn")
                    : t("dashboard:login.loginButton")}
                </Button>

                {loginError && (
                  <p
                    className="text-sm text-destructive text-center"
                    role="alert"
                    data-ocid="login-error"
                  >
                    {loginError}
                  </p>
                )}

                <p className="text-center text-xs text-muted-foreground">
                  {t("dashboard:login.identityNote")}
                </p>
              </div>
            </div>
          ) : (
            /* ── Step 2: Role selection (only for non-first, non-stored-role users) ── */
            <div className="p-8 space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-foreground">
                  {t("dashboard:login.chooseRole")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("dashboard:login.chooseRoleSub")}
                </p>
              </div>

              <fieldset className="space-y-3 border-0 p-0 m-0">
                <legend className="sr-only">
                  {t("dashboard:login.roleSelect")}
                </legend>
                {roleOptions.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      data-ocid={`role-option-${role.id}`}
                      aria-pressed={isSelected}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl border text-left",
                        "transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/40 hover:bg-muted/50",
                      )}
                    >
                      <div
                        className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                          isSelected ? "bg-primary/20" : "bg-muted",
                        )}
                        aria-hidden="true"
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            isSelected
                              ? "text-primary"
                              : "text-muted-foreground",
                          )}
                        />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={cn(
                            "text-sm font-semibold",
                            isSelected ? "text-primary" : "text-foreground",
                          )}
                        >
                          {t(`dashboard:login.${role.labelKey}`)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t(`dashboard:login.${role.descKey}`)}
                        </p>
                      </div>
                      {isSelected && (
                        <div
                          className="ml-auto h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0"
                          aria-hidden="true"
                        >
                          <svg
                            className="h-3 w-3 text-primary-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <title>{t("shared:actions.confirm")}</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </fieldset>

              {/* Owner-locked notice for non-owner accounts */}
              {!selectableRoleIds.includes("owner") && (
                <p className="text-xs text-muted-foreground text-center px-2">
                  {t("dashboard:login.ownerLockedNote")}
                </p>
              )}

              <Button
                className="w-full h-12 text-base font-semibold"
                disabled={!selectedRole}
                onClick={handleRoleConfirm}
                data-ocid="role-confirm-btn"
              >
                {t("dashboard:login.continueAs", {
                  role: selectedRole
                    ? t(
                        `dashboard:login.roles.${selectedRole}` as Parameters<
                          typeof t
                        >[0],
                      )
                    : "…",
                })}
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <LanguageSwitcher variant="footer" />
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()}. {t("shared:branding.builtWith")}{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
