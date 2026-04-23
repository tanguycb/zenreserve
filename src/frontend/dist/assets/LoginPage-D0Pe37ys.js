import { i as createLucideIcon, u as useTranslation, au as useAuth, av as useNavigate, r as reactExports, aw as getSelectableRoles, ax as ShieldCheck, U as Users, ay as Megaphone, az as isFirstEverLogin, aA as setStoredRole, aB as markFirstLoginDone, j as jsxRuntimeExports, aC as ChefHat, aD as ChartNoAxesColumn, B as Button, aa as RefreshCw, c as cn, aE as LanguageSwitcher } from "./index-BNayfcmF.js";
import { C as CircleAlert } from "./circle-alert-dyy_CREt.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 20 0", key: "dnpr2z" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 14 0", key: "1x1e6c" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }]
];
const Wifi = createLucideIcon("wifi", __iconNode);
const ALL_ROLE_OPTIONS = [
  {
    id: "owner",
    labelKey: "roles.owner",
    descKey: "roles.ownerDesc",
    icon: ShieldCheck
  },
  {
    id: "manager",
    labelKey: "roles.manager",
    descKey: "roles.managerDesc",
    icon: Users
  },
  {
    id: "marketing",
    labelKey: "roles.marketing",
    descKey: "roles.marketingDesc",
    icon: Megaphone
  }
];
const FEATURE_KEYS = [
  { icon: ChartNoAxesColumn, key: "features.kpi" },
  { icon: ChefHat, key: "features.experiences" },
  { icon: Users, key: "features.guests" }
];
function LoginPage() {
  const { t } = useTranslation(["dashboard", "shared"]);
  const {
    isAuthenticated,
    isLoading,
    isInitError,
    login,
    forceReset,
    clearAuthError,
    storedRole,
    loginStatus,
    authError,
    sessionWasCleared
  } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = reactExports.useState(null);
  const [loginError, setLoginError] = reactExports.useState(null);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [isResetting, setIsResetting] = reactExports.useState(false);
  const handledRef = reactExports.useRef(false);
  const selectableRoleIds = getSelectableRoles();
  const roleOptions = ALL_ROLE_OPTIONS.filter(
    (r) => selectableRoleIds.includes(r.id)
  );
  reactExports.useEffect(() => {
    if (!loginError) return;
    const timer = setTimeout(() => setLoginError(null), 8e3);
    return () => clearTimeout(timer);
  }, [loginError]);
  reactExports.useEffect(() => {
    if (sessionWasCleared) {
      setLoginError(
        "Een andere gebruiker heeft zich aangemeld op dit apparaat. Meld u opnieuw aan."
      );
    }
  }, [sessionWasCleared]);
  reactExports.useEffect(() => {
    if (authError) {
      setLoginError(authError);
      setIsSubmitting(false);
    }
  }, [authError]);
  reactExports.useEffect(() => {
    if (loginStatus === "loginError") {
      setIsSubmitting(false);
    }
  }, [loginStatus]);
  const isAuthenticatedRef = reactExports.useRef(isAuthenticated);
  isAuthenticatedRef.current = isAuthenticated;
  const loginStatusRef = reactExports.useRef(loginStatus);
  loginStatusRef.current = loginStatus;
  reactExports.useEffect(() => {
    setIsSubmitting(false);
    handledRef.current = false;
  }, []);
  reactExports.useEffect(() => {
    if (!isAuthenticated || handledRef.current) return;
    setIsSubmitting(false);
    setLoginError(null);
    const firstLogin = isFirstEverLogin();
    if (firstLogin) {
      handledRef.current = true;
      setStoredRole("owner");
      markFirstLoginDone();
      void navigate({ to: "/dashboard" });
      return;
    }
    if (storedRole !== null) {
      handledRef.current = true;
      void navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, storedRole, navigate]);
  const handleLogin = async () => {
    setLoginError(null);
    clearAuthError();
    setIsSubmitting(true);
    handledRef.current = false;
    try {
      await login();
      if (!isAuthenticatedRef.current) {
        setTimeout(() => {
          if (!isAuthenticatedRef.current) {
            setLoginError(
              (prev) => prev ? prev : t("dashboard:login.loginFailed")
            );
            setIsSubmitting(false);
          }
        }, 200);
      }
    } catch {
      setTimeout(() => {
        setLoginError(
          (prev) => prev ? prev : t("dashboard:login.loginFailed")
        );
        setIsSubmitting(false);
      }, 100);
    }
  };
  const handleForceReset = async () => {
    setIsResetting(true);
    setLoginError(null);
    handledRef.current = false;
    try {
      await forceReset();
    } finally {
      setIsResetting(false);
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
  const showRolePicker = isAuthenticated && storedRole === null && !isFirstEverLogin();
  const loginBusy = (isLoading || isSubmitting) && !isAuthenticated;
  const isConnectivityError = (loginError == null ? void 0 : loginError.includes("server")) || (loginError == null ? void 0 : loginError.includes("verbinding")) || (loginError == null ? void 0 : loginError.includes("internet"));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "dark min-h-screen bg-background flex items-center justify-center p-4",
      "data-ocid": "login-page",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-soft", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChefHat, { className: "h-8 w-8 text-primary", "aria-hidden": "true" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-display text-foreground", children: "ZenReserve" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: t("dashboard:login.subtitle2") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-card shadow-elevated overflow-hidden", children: !showRolePicker ? (
          /* ── Step 1: Login ── */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-foreground", children: t("dashboard:login.welcomeBack") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("dashboard:login.subtitle") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "ul",
              {
                className: "space-y-3",
                "aria-label": t("dashboard:login.subtitle2"),
                children: FEATURE_KEYS.map((feature) => {
                  const Icon = feature.icon;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "li",
                    {
                      className: "flex items-center gap-3 text-sm text-muted-foreground",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0",
                            "aria-hidden": "true",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-primary" })
                          }
                        ),
                        t(`dashboard:login.${feature.key}`)
                      ]
                    },
                    feature.key
                  );
                })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "w-full h-12 text-base font-semibold gap-2",
                  onClick: isInitError ? handleForceReset : handleLogin,
                  disabled: loginBusy || isResetting,
                  "data-ocid": "login-btn",
                  "aria-label": isInitError ? "Pagina verversen" : t("dashboard:login.loginButton"),
                  children: isResetting ? "Pagina wordt vernieuwd…" : loginBusy ? t("dashboard:login.loggingIn") : isInitError ? "Pagina verversen om in te loggen" : t("dashboard:login.loginButton")
                }
              ),
              loginError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-xl border border-destructive/30 bg-destructive/10 p-3 space-y-2",
                  role: "alert",
                  "data-ocid": "login-error",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                      isConnectivityError ? /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "h-4 w-4 text-destructive shrink-0 mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-destructive shrink-0 mt-0.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive leading-snug", children: loginError })
                    ] }),
                    sessionWasCleared && !isInitError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        className: "w-full h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 gap-1.5",
                        onClick: handleForceReset,
                        disabled: isResetting || loginBusy,
                        "data-ocid": "login-retry-btn",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            RefreshCw,
                            {
                              className: cn(
                                "h-3 w-3",
                                isResetting && "animate-spin"
                              )
                            }
                          ),
                          isResetting ? "Sessie wordt gewist…" : "Sessie wissen en opnieuw aanmelden"
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: t("dashboard:login.identityNote") })
            ] })
          ] })
        ) : (
          /* ── Step 2: Role selection (only for non-first, non-stored-role users) ── */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-foreground", children: t("dashboard:login.chooseRole") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("dashboard:login.chooseRoleSub") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "space-y-3 border-0 p-0 m-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: t("dashboard:login.roleSelect") }),
              roleOptions.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSelectedRole(role.id),
                    "data-ocid": `role-option-${role.id}`,
                    "aria-pressed": isSelected,
                    className: cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border text-left",
                      "transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/40 hover:bg-muted/50"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                            isSelected ? "bg-primary/20" : "bg-muted"
                          ),
                          "aria-hidden": "true",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Icon,
                            {
                              className: cn(
                                "h-5 w-5",
                                isSelected ? "text-primary" : "text-muted-foreground"
                              )
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: cn(
                              "text-sm font-semibold",
                              isSelected ? "text-primary" : "text-foreground"
                            ),
                            children: t(`dashboard:login.${role.labelKey}`)
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t(`dashboard:login.${role.descKey}`) })
                      ] }),
                      isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "ml-auto h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0",
                          "aria-hidden": "true",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "svg",
                            {
                              className: "h-3 w-3 text-primary-foreground",
                              fill: "none",
                              viewBox: "0 0 24 24",
                              stroke: "currentColor",
                              strokeWidth: 3,
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: t("shared:actions.confirm") }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "path",
                                  {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    d: "M5 13l4 4L19 7"
                                  }
                                )
                              ]
                            }
                          )
                        }
                      )
                    ]
                  },
                  role.id
                );
              })
            ] }),
            !selectableRoleIds.includes("owner") && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center px-2", children: t("dashboard:login.ownerLockedNote") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "w-full h-12 text-base font-semibold",
                disabled: !selectedRole,
                onClick: handleRoleConfirm,
                "data-ocid": "role-confirm-btn",
                children: t("dashboard:login.continueAs", {
                  role: selectedRole ? t(
                    `dashboard:login.roles.${selectedRole}`
                  ) : "…"
                })
              }
            )
          ] })
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageSwitcher, { variant: "footer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
            "© ",
            (/* @__PURE__ */ new Date()).getFullYear(),
            ". ",
            t("shared:branding.builtWith"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "underline hover:text-foreground transition-colors",
                children: "caffeine.ai"
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
export {
  LoginPage as default
};
