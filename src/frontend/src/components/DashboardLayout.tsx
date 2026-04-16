import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import type { AppRole } from "@/hooks/useAuth";
import { useGeneralInfo } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  BarChart2,
  Bell,
  CalendarDays,
  ChefHat,
  Clock,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Star,
  Table2,
  Users,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { OnboardingModal } from "./OnboardingModal";
import { RolePickerInline } from "./RolePickerInline";

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
    key: "experiences",
    navKey: "experiences",
    href: "/dashboard/experiences",
    icon: Star,
    roles: ["owner"],
  },
  {
    key: "waitlist",
    navKey: "waitlist",
    href: "/dashboard/waitlist",
    icon: Clock,
    badge: 7,
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
  const { logout, isAuthenticated, role, storedRole, requireOwner } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { t } = useTranslation(["shared", "dashboard"]);
  const { data: generalInfo } = useGeneralInfo();

  const restaurantName = generalInfo?.restaurantName || "ZenReserve";
  const logoUrl = generalInfo?.logoUrl || "";

  useEffect(() => {
    if (
      storedRole === "owner" &&
      localStorage.getItem("zenreserve_owner_activated") !== "true"
    ) {
      setShowOnboarding(true);
    }
  }, [storedRole]);

  const isActive = (href: string) =>
    href === "/dashboard"
      ? currentPath === "/dashboard"
      : currentPath.startsWith(href);

  if (!isAuthenticated) return null;

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
    <div className="dark min-h-screen flex bg-background text-foreground">
      {/* Onboarding modal — shown on first owner login until setOwner is called */}
      {showOnboarding && (
        <OnboardingModal onComplete={() => setShowOnboarding(false)} />
      )}

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
          "bg-gradient-to-b from-[#1E2937] to-[#0F172A] border-r border-border/50 shadow-elevated",
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
                    : t(`shared:nav.${item.navKey}`)}
                </span>
                {item.badge && item.badge > 0 && (
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
        <header className="sticky top-0 z-20 flex items-center gap-3 px-4 h-16 bg-gradient-to-r from-[#1E2937] to-[#162030] border-b border-border/50 shadow-elevated lg:px-6">
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
                : t(`shared:nav.${activeItem.navKey}`)
              : t("shared:nav.dashboard")}
          </h1>

          {/* Right cluster: language + bell + user */}
          <div className="ml-auto flex items-center gap-1">
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
        <footer className="px-6 py-3 border-t border-border/40 bg-[#0F172A]/80 text-center text-xs text-muted-foreground">
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
