import { createActor } from "@/backend";
import { NewReservationModal } from "@/components/dashboard/NewReservationModal";
import { WalkInModal } from "@/components/dashboard/WalkInModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import type { AppRole } from "@/hooks/useAuth";
import { useWaitlist } from "@/hooks/useDashboard";
import { useGeneralInfo } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart2,
  Bell,
  CalendarDays,
  ChefHat,
  ClipboardList,
  Clock,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  RefreshCw,
  Settings,
  Table2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { OnboardingModal } from "./OnboardingModal";
import { RolePickerInline } from "./RolePickerInline";

const THEME_KEY = "zenreserve_theme";

function readStoredTheme(): "dark" | "light" {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === "light") return "light";
  } catch {
    // ignore
  }
  return "dark";
}

interface NavItem {
  key: string;
  navKey: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  roles: AppRole[];
}

const NAV_ITEMS: NavItem[] = [
  {
    key: "home",
    navKey: "dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["owner", "manager", "marketing", "staff"],
  },
  {
    key: "reservations",
    navKey: "reservations",
    href: "/dashboard/reservations",
    icon: CalendarDays,
    roles: ["owner", "manager"],
  },
  {
    key: "guests",
    navKey: "guests",
    href: "/dashboard/guests",
    icon: Users,
    roles: ["owner", "manager", "marketing"],
  },
  {
    key: "waitlist",
    navKey: "waitlist",
    href: "/dashboard/waitlist",
    icon: Clock,
    roles: ["owner"],
  },
  {
    key: "seating",
    navKey: "seatingPlan",
    href: "/dashboard/seating",
    icon: Table2,
    roles: ["owner", "manager"],
  },
  {
    key: "analytics",
    navKey: "analytics",
    href: "/dashboard/analytics",
    icon: BarChart2,
    roles: ["owner", "manager"],
  },
  {
    key: "settings",
    navKey: "settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["owner"],
  },
  {
    key: "audit-log",
    navKey: "auditLog",
    href: "/dashboard/audit-log",
    icon: ClipboardList,
    roles: ["owner", "manager"],
  },
];

const ROLE_LABELS: Record<AppRole, string> = {
  owner: "Eigenaar",
  manager: "Manager",
  marketing: "Social Media",
  staff: "Medewerker",
};

const ROLE_INITIALS: Record<AppRole, string> = {
  owner: "EI",
  manager: "MG",
  marketing: "SM",
  staff: "MW",
};

interface DashboardLayoutProps {
  children?: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(readStoredTheme);
  const [actorInitError, setActorInitError] = useState<string | null>(null);
  const [newResOpen, setNewResOpen] = useState(false);
  const [walkInOpen, setWalkInOpen] = useState(false);
  const [newResDropdownOpen, setNewResDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout, isAuthenticated, role, storedRole, requireOwner } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { t } = useTranslation(["shared", "dashboard"]);
  const { data: generalInfo } = useGeneralInfo();

  // BUG-027: check backend hasOwner() instead of localStorage
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { data: ownerExists } = useQuery<boolean>({
    queryKey: ["hasOwner"],
    queryFn: async () => {
      if (!actor) return true; // assume owner exists if actor unavailable (safe default)
      try {
        return await actor.hasOwner();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setActorInitError(
          `Verbinding met de server mislukt: ${msg}. Probeer opnieuw in te loggen.`,
        );
        return true;
      }
    },
    enabled: !!actor && !actorFetching && storedRole === "owner",
    staleTime: 60_000,
  });

  // Surface actor initialization errors — if the actor itself fails, redirect to login
  // (actor init failures surface via hasOwner() query error handler above)

  // When actor init error is confirmed, redirect to login after a short delay
  useEffect(() => {
    if (!actorInitError) return;
    const timer = setTimeout(() => {
      void navigate({ to: "/dashboard/login" });
    }, 3000);
    return () => clearTimeout(timer);
  }, [actorInitError, navigate]);

  // BUG 3 fix: real waitlist badge count from backend
  const todayStr = new Date().toISOString().split("T")[0];
  const { data: waitlistEntries = [] } = useWaitlist(todayStr);
  const waitlistBadgeCount = waitlistEntries.filter(
    (e) => e.status === "waiting" || e.status === "offered",
  ).length;

  const restaurantName = generalInfo?.restaurantName || "ZenReserve";
  const logoUrl = generalInfo?.logoUrl || "";

  useEffect(() => {
    // BUG-027: only show onboarding if the backend confirms no owner is set yet
    if (storedRole === "owner" && ownerExists === false) {
      setShowOnboarding(true);
    } else if (ownerExists === true) {
      setShowOnboarding(false);
    }
  }, [storedRole, ownerExists]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!newResDropdownOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setNewResDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [newResDropdownOpen]);

  // VIS-015: listen for theme changes set by BrandingSettingsPage
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_KEY) {
        setTheme(e.newValue === "light" ? "light" : "dark");
      }
    };
    // Also poll on focus in case the settings page is in the same tab
    const onFocus = () => setTheme(readStoredTheme());
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const isActive = (href: string) =>
    href === "/dashboard"
      ? currentPath === "/dashboard"
      : currentPath.startsWith(href);

  if (!isAuthenticated) {
    // Redirect to login instead of silently returning null
    void navigate({ to: "/dashboard/login" });
    return null;
  }

  // If actor failed to initialize, show an error state instead of blank screen
  if (actorInitError) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center bg-background text-foreground p-6",
          theme === "dark" ? "dark" : "",
        )}
      >
        <div className="max-w-sm w-full space-y-4 text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Verbindingsfout
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {actorInitError}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              U wordt automatisch doorgestuurd naar de inlogpagina…
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => void navigate({ to: "/dashboard/login" })}
            data-ocid="actor-error-login-btn"
          >
            <RefreshCw className="h-4 w-4" />
            Nu opnieuw inloggen
          </Button>
        </div>
      </div>
    );
  }

  if (storedRole === null) {
    return <RolePickerInline />;
  }

  if (currentPath.startsWith("/dashboard/settings") && role !== "owner") {
    requireOwner();
    return null;
  }

  const visibleNavItems = NAV_ITEMS.filter((item) => item.roles.includes(role));
  const activeItem = visibleNavItems.find((item) => isActive(item.href));

  return (
    <div
      className={cn(
        "min-h-screen flex bg-background text-foreground",
        theme === "dark" ? "dark" : "",
      )}
    >
      {/* Onboarding modal — shown on first owner login until setOwner is called */}
      {showOnboarding && (
        <OnboardingModal onComplete={() => setShowOnboarding(false)} />
      )}

      {/* New Reservation & Walk-In modals */}
      <NewReservationModal
        open={newResOpen}
        onClose={() => setNewResOpen(false)}
      />
      <WalkInModal open={walkInOpen} onClose={() => setWalkInOpen(false)} />

      {/* Skip link */}
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-medium"
      >
        {t("dashboard:layout.skipToMain")}
      </a>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full flex flex-col",
          "bg-gradient-to-b from-card to-background border-r border-border/50 shadow-elevated",
          "transform transition-transform duration-300 ease-in-out",
          "w-[240px] lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label={t("shared:nav.dashboard")}
      >
        {/* Logo + brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border/40">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={restaurantName}
                className="h-7 w-7 rounded-lg object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const icon = document.createElement("span");
                    icon.className = "text-primary";
                    parent.appendChild(icon);
                  }
                }}
              />
            ) : (
              <ChefHat className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground tracking-tight truncate">
              {restaurantName}
            </p>
            <p className="text-xs text-primary font-medium truncate">
              {ROLE_LABELS[role]}
            </p>
          </div>
          <button
            type="button"
            className="ml-auto lg:hidden p-1.5 rounded-lg hover:bg-muted/30 transition-colors"
            onClick={() => setSidebarOpen(false)}
            aria-label={t("dashboard:layout.closeMenu")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav
          className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto"
          aria-label={t("dashboard:layout.restaurantManagement")}
        >
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.key}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                data-ocid={`nav-${item.key}`}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium",
                  "transition-all duration-200 min-h-[44px]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active
                    ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                    : "text-muted-foreground hover:bg-muted/20 hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span className="truncate">
                  {item.key === "settings"
                    ? t("dashboard:layout.settings")
                    : item.key === "audit-log"
                      ? t("dashboard:auditLog.title")
                      : t(`shared:nav.${item.navKey}`)}
                </span>
                {/* Dynamic waitlist badge; static badge fallback for other items */}
                {item.key === "waitlist"
                  ? waitlistBadgeCount > 0 && (
                      <Badge className="ml-auto h-5 px-1.5 text-xs bg-primary/20 text-primary border-0 badge-pop">
                        {waitlistBadgeCount}
                      </Badge>
                    )
                  : item.badge &&
                    item.badge > 0 && (
                      <Badge className="ml-auto h-5 px-1.5 text-xs bg-primary/20 text-primary border-0 badge-pop">
                        {item.badge}
                      </Badge>
                    )}
              </Link>
            );
          })}
        </nav>

        <Separator className="opacity-30" />

        {/* Logout */}
        <div className="p-3 pb-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-muted/20 min-h-[44px] rounded-xl"
            onClick={logout}
            data-ocid="nav-logout"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>{t("shared:actions.logout")}</span>
          </Button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header — 64px height, gradient for depth */}
        <header className="sticky top-0 z-20 flex items-center gap-3 px-4 h-16 bg-gradient-to-r from-card to-background border-b border-border/50 shadow-elevated lg:px-6">
          {/* Mobile hamburger */}
          <button
            type="button"
            className="p-2 rounded-xl hover:bg-muted/20 transition-colors lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setSidebarOpen(true)}
            aria-label={t("dashboard:layout.openMenu")}
            aria-expanded={sidebarOpen}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo + restaurant name — visible on desktop in header */}
          <div className="hidden lg:flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={restaurantName}
                  className="h-6 w-6 rounded-md object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              ) : (
                <ChefHat className="h-4 w-4 text-primary" />
              )}
            </div>
            <span className="text-sm font-semibold text-foreground truncate max-w-[180px]">
              {restaurantName}
            </span>
          </div>

          {/* Page title — mobile only */}
          <h1 className="text-sm font-semibold text-foreground truncate lg:hidden">
            {activeItem
              ? activeItem.key === "settings"
                ? t("dashboard:layout.settings")
                : activeItem.key === "audit-log"
                  ? t("dashboard:auditLog.title")
                  : t(`shared:nav.${activeItem.navKey}`)
              : t("shared:nav.dashboard")}
          </h1>

          {/* Right cluster: new reservation + language + bell + user */}
          <div className="ml-auto flex items-center gap-1">
            {/* New Reservation dropdown */}
            {(role === "owner" || role === "manager") && (
              <div className="relative" ref={dropdownRef}>
                <Button
                  type="button"
                  size="sm"
                  className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 rounded-xl font-medium shadow-sm"
                  onClick={() => setNewResDropdownOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={newResDropdownOpen}
                  data-ocid="header-new-reservation-btn"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {t("dashboard:home.newReservation", "Nieuwe reservatie")}
                  </span>
                </Button>

                {newResDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-card shadow-elevated z-50 overflow-hidden"
                    role="menu"
                    aria-label={t(
                      "dashboard:home.newReservation",
                      "Nieuwe reservatie",
                    )}
                    data-ocid="header-new-reservation-dropdown"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted/30 transition-colors"
                      onClick={() => {
                        setNewResDropdownOpen(false);
                        setNewResOpen(true);
                      }}
                      data-ocid="header-new-reservation-option"
                    >
                      <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                        <CalendarDays className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">
                          {t(
                            "dashboard:home.newReservationOption",
                            "Reservatie",
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t(
                            "dashboard:home.newReservationOptionHint",
                            "Gast uitnodigen",
                          )}
                        </p>
                      </div>
                    </button>
                    <div className="h-px bg-border/50 mx-2" />
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted/30 transition-colors"
                      onClick={() => {
                        setNewResDropdownOpen(false);
                        setWalkInOpen(true);
                      }}
                      data-ocid="header-walkin-option"
                    >
                      <div className="h-8 w-8 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
                        <UserRound className="h-4 w-4 text-accent" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">
                          {t("dashboard:home.walkInOption", "Walk-In")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t(
                            "dashboard:home.walkInOptionHint",
                            "Geen reservatie nodig",
                          )}
                        </p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}

            <LanguageSwitcher variant="header" />

            <button
              type="button"
              className="relative p-2.5 rounded-xl hover:bg-muted/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={t("dashboard:layout.notifications")}
              data-ocid="header-notifications"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span
                className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary"
                aria-hidden="true"
              />
            </button>

            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted/20 transition-colors cursor-pointer min-h-[44px]"
              data-ocid="header-user"
            >
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
                <span className="text-xs font-bold text-primary">
                  {ROLE_INITIALS[role]}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">
                {ROLE_LABELS[role]}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main id="dashboard-main" className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children ?? <Outlet />}
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-border/40 bg-background/80 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}. {t("shared:branding.builtWith")}{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
