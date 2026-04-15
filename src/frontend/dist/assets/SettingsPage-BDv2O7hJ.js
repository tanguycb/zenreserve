import { k as createLucideIcon, u as useTranslation, r as reactExports, O as useRouterState, d as Clock, U as Users, t as Bell, C as CalendarDays, j as jsxRuntimeExports, P as Navigate, X, L as Link, c as cn, Q as Menu, R as Outlet } from "./index-DYFUyfbw.js";
import { B as Building2 } from "./building-2-BVa1UzXL.js";
import { B as BookOpen } from "./book-open-DcXPLRmC.js";
import { P as Palette } from "./palette-CXpyoz9G.js";
import { C as CreditCard } from "./credit-card-COSlNMdU.js";
import { S as Shield } from "./shield-BJh4Xjjz.js";
import { C as ChevronRight } from "./chevron-right-LZZMkfeM.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 17h.01", key: "p32p05" }],
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z", key: "1mlx9k" }],
  ["path", { d: "M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3", key: "mhlwft" }]
];
const FileQuestion = createLucideIcon("file-question", __iconNode);
const CATEGORIES = [
  {
    id: "general",
    href: "/dashboard/settings/general",
    icon: Building2,
    labelKey: "settings.nav.general",
    active: true
  },
  {
    id: "opening-hours",
    href: "/dashboard/settings/opening-hours",
    icon: Clock,
    labelKey: "settings.nav.openingHours",
    active: true
  },
  {
    id: "capacity",
    href: "/dashboard/settings/capacity",
    icon: BookOpen,
    labelKey: "settings.nav.capacity",
    active: true
  },
  {
    id: "reservation-rules",
    href: "/dashboard/settings/reservation-rules",
    icon: FileQuestion,
    labelKey: "settings.nav.reservationRules",
    active: true
  },
  {
    id: "guest-form",
    href: "/dashboard/settings/guest-form",
    icon: Users,
    labelKey: "settings.nav.guestForm",
    active: true
  },
  {
    id: "branding",
    href: "/dashboard/settings/branding",
    icon: Palette,
    labelKey: "settings.nav.branding",
    active: true
  },
  {
    id: "notifications",
    href: "/dashboard/settings/notifications",
    icon: Bell,
    labelKey: "settings.nav.notifications",
    active: true
  },
  {
    id: "integrations",
    href: "/dashboard/settings/integrations",
    icon: CreditCard,
    labelKey: "settings.nav.integrations",
    active: true
  },
  {
    id: "team",
    href: "/dashboard/settings/team",
    icon: Shield,
    labelKey: "settings.nav.team",
    active: true
  },
  {
    id: "seasonal",
    href: "/dashboard/settings/seasonal",
    icon: CalendarDays,
    labelKey: "settings.nav.seasonal",
    active: true
  }
];
function ComingSoonPlaceholder({ categoryKey }) {
  const { t } = useTranslation("dashboard");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-[40vh] text-center px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-8 w-8 text-primary/60" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3", children: t("settings.comingSoon") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-foreground mb-2", children: t(`settings.nav.${categoryKey}`) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm", children: t("settings.comingSoonDesc") })
  ] });
}
function SettingsPage() {
  const { t } = useTranslation("dashboard");
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const isActive = (href) => currentPath.startsWith(href);
  const activeCategory = CATEGORIES.find((c) => isActive(c.href));
  if (currentPath === "/dashboard/settings" || currentPath === "/dashboard/settings/") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard/settings/general" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex gap-0 min-h-[calc(100vh-9rem)]",
      "data-ocid": "settings-hub",
      children: [
        drawerOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden",
            onClick: () => setDrawerOpen(false),
            onKeyDown: (e) => e.key === "Escape" && setDrawerOpen(false),
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "aside",
          {
            className: cn(
              "fixed top-0 left-0 z-40 h-full w-72 flex flex-col pt-0",
              "lg:static lg:w-64 lg:min-w-[16rem] lg:z-auto lg:h-auto",
              "bg-card border-r border-border",
              "transform transition-transform duration-300 ease-in-out",
              "lg:translate-x-0 lg:rounded-2xl",
              drawerOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            ),
            "data-ocid": "settings-sidebar",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-4 border-b border-border lg:hidden", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: t("settings.title") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setDrawerOpen(false),
                    className: "p-1.5 rounded-lg hover:bg-muted transition-colors",
                    "aria-label": t("layout.closeMenu"),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-3 hidden lg:block border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: t("settings.title") }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "nav",
                {
                  className: "flex-1 px-3 py-3 space-y-0.5 overflow-y-auto",
                  "aria-label": t("settings.title"),
                  children: CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const active = isActive(cat.href);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Link,
                      {
                        to: cat.href,
                        onClick: () => setDrawerOpen(false),
                        "data-ocid": `settings-nav-${cat.id}`,
                        className: cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        ),
                        "aria-current": active ? "page" : void 0,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Icon,
                            {
                              className: cn(
                                "h-4 w-4 shrink-0",
                                active ? "text-primary" : ""
                              )
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate", children: t(
                            `settings.nav.${cat.id === "opening-hours" ? "openingHours" : cat.id === "reservation-rules" ? "reservationRules" : cat.id === "guest-form" ? "guestForm" : cat.id}`
                          ) }),
                          !cat.active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground", children: t("settings.soon") }),
                          cat.active && active && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3 shrink-0 text-primary" })
                        ]
                      },
                      cat.id
                    );
                  })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-1 pb-4 lg:hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setDrawerOpen(true),
                className: "p-2 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                "aria-label": t("layout.openMenu"),
                "data-ocid": "settings-mobile-menu-btn",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: activeCategory ? t(
              `settings.nav.${activeCategory.id === "opening-hours" ? "openingHours" : activeCategory.id === "reservation-rules" ? "reservationRules" : activeCategory.id === "guest-form" ? "guestForm" : activeCategory.id}`
            ) : t("settings.title") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:pl-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
        ] })
      ]
    }
  );
}
export {
  ComingSoonPlaceholder,
  SettingsPage as default
};
