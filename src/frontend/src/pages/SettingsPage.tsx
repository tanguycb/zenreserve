import { cn } from "@/lib/utils";
import { Link, Navigate, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronRight,
  Clock,
  CreditCard,
  FileQuestion,
  Layers,
  Menu,
  Palette,
  Shield,
  Star,
  Table2,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface SettingsCategory {
  id: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  active: boolean;
}

const CATEGORIES: SettingsCategory[] = [
  {
    id: "general",
    href: "/dashboard/settings/general",
    icon: Building2,
    labelKey: "settings.nav.general",
    active: true,
  },
  {
    id: "opening-hours",
    href: "/dashboard/settings/opening-hours",
    icon: Clock,
    labelKey: "settings.nav.openingHours",
    active: true,
  },
  {
    id: "capacity",
    href: "/dashboard/settings/capacity",
    icon: BookOpen,
    labelKey: "settings.nav.capacity",
    active: true,
  },
  {
    id: "reservation-rules",
    href: "/dashboard/settings/reservation-rules",
    icon: FileQuestion,
    labelKey: "settings.nav.reservationRules",
    active: true,
  },
  {
    id: "guest-form",
    href: "/dashboard/settings/guest-form",
    icon: Users,
    labelKey: "settings.nav.guestForm",
    active: true,
  },
  {
    id: "branding",
    href: "/dashboard/settings/branding",
    icon: Palette,
    labelKey: "settings.nav.branding",
    active: true,
  },
  {
    id: "notifications",
    href: "/dashboard/settings/notifications",
    icon: Bell,
    labelKey: "settings.nav.notifications",
    active: true,
  },
  {
    id: "integrations",
    href: "/dashboard/settings/integrations",
    icon: CreditCard,
    labelKey: "settings.nav.integrations",
    active: true,
  },
  {
    id: "team",
    href: "/dashboard/settings/team",
    icon: Shield,
    labelKey: "settings.nav.team",
    active: true,
  },
  {
    id: "seasonal",
    href: "/dashboard/settings/seasonal",
    icon: CalendarDays,
    labelKey: "settings.nav.seasonal",
    active: true,
  },
  {
    id: "zones",
    href: "/dashboard/settings/zones",
    icon: Layers,
    labelKey: "settings.nav.zones",
    active: true,
  },
  {
    id: "experiences",
    href: "/dashboard/settings/experiences",
    icon: Star,
    labelKey: "settings.nav.experiences",
    active: true,
  },
  {
    id: "seating-plan",
    href: "/dashboard/settings/seating-plan",
    icon: Table2,
    labelKey: "settings.nav.seatingPlan",
    active: true,
  },
];

function ComingSoonPlaceholder({ categoryKey }: { categoryKey: string }) {
  const { t } = useTranslation("dashboard");
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Clock className="h-8 w-8 text-primary/60" />
      </div>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
        {t("settings.comingSoon")}
      </span>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        {t(`settings.nav.${categoryKey}`)}
      </h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        {t("settings.comingSoonDesc")}
      </p>
    </div>
  );
}

export { ComingSoonPlaceholder };

export default function SettingsPage() {
  const { t } = useTranslation("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (href: string) => currentPath.startsWith(href);
  const activeCategory = CATEGORIES.find((c) => isActive(c.href));

  // Redirect /dashboard/settings → /dashboard/settings/general
  if (
    currentPath === "/dashboard/settings" ||
    currentPath === "/dashboard/settings/"
  ) {
    return <Navigate to="/dashboard/settings/general" />;
  }

  return (
    <div
      className="flex gap-0 min-h-[calc(100vh-9rem)]"
      data-ocid="settings-hub"
    >
      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setDrawerOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Settings sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-72 flex flex-col pt-0",
          "lg:static lg:w-64 lg:min-w-[16rem] lg:z-auto lg:h-auto",
          "bg-card border-r border-border",
          "transform transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:rounded-2xl",
          drawerOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        data-ocid="settings-sidebar"
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border lg:hidden">
          <span className="text-sm font-semibold text-foreground">
            {t("settings.title")}
          </span>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label={t("layout.closeMenu")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-3 py-3 hidden lg:block border-b border-border">
          <h2 className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("settings.title")}
          </h2>
        </div>

        <nav
          className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto"
          aria-label={t("settings.title")}
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = isActive(cat.href);
            return (
              <Link
                key={cat.id}
                to={cat.href}
                onClick={() => setDrawerOpen(false)}
                data-ocid={`settings-nav-${cat.id}`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-primary" : "",
                  )}
                />
                <span className="flex-1 truncate">{t(cat.labelKey)}</span>
                {!cat.active && (
                  <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {t("settings.soon")}
                  </span>
                )}
                {cat.active && active && (
                  <ChevronRight className="h-3 w-3 shrink-0 text-primary" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 px-1 pb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={t("layout.openMenu")}
            data-ocid="settings-mobile-menu-btn"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-foreground">
            {activeCategory ? t(activeCategory.labelKey) : t("settings.title")}
          </span>
        </div>

        <div className="lg:pl-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
