import { DashboardLayout } from "@/components/DashboardLayout";
import { SkeletonCard } from "@/components/SkeletonCard";
import { WidgetLayout } from "@/components/WidgetLayout";
import { useAuth } from "@/hooks/useAuth";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// ── Lazy pages ────────────────────────────────────────────────────────────────
const WidgetPage = lazy(() => import("@/pages/WidgetPage"));
const DashboardHome = lazy(() => import("@/pages/DashboardHome"));
const ReservationsPage = lazy(() => import("@/pages/ReservationsPage"));
const GuestsPage = lazy(() => import("@/pages/GuestsPage"));
const ExperiencesPage = lazy(() => import("@/pages/ExperiencesPage"));
const WaitlistPage = lazy(() => import("@/pages/WaitlistPage"));
const SeatingPlanPage = lazy(() => import("@/pages/SeatingPlanPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const GuestSearchPage = lazy(() => import("@/pages/GuestSearchPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const GeneralSettingsPage = lazy(
  () => import("@/pages/settings/GeneralSettingsPage"),
);
const OpeningHoursSettingsPage = lazy(
  () => import("@/pages/settings/OpeningHoursSettingsPage"),
);
const CapacitySettingsPage = lazy(
  () => import("@/pages/settings/CapacitySettingsPage"),
);
const NotificationsSettingsPage = lazy(
  () => import("@/pages/settings/NotificationsSettingsPage"),
);
const TeamSettingsPage = lazy(
  () => import("@/pages/settings/TeamSettingsPage"),
);
const BrandingSettingsPage = lazy(
  () => import("@/pages/settings/BrandingSettingsPage"),
);
const ReservationRulesSettingsPage = lazy(
  () => import("@/pages/settings/ReservationRulesSettingsPage"),
);
const GuestFormSettingsPage = lazy(
  () => import("@/pages/settings/GuestFormSettingsPage"),
);
const IntegrationsSettingsPage = lazy(
  () => import("@/pages/settings/IntegrationsSettingsPage"),
);
const SeasonalSettingsPage = lazy(
  () => import("@/pages/settings/SeasonalSettingsPage"),
);
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage"));

// ── Auth guard wrapper ────────────────────────────────────────────────────────
/**
 * Guards all /dashboard/* routes except /dashboard/login.
 * - While II is resolving: show skeleton loader.
 * - Not authenticated: redirect to /dashboard/login.
 * - Authenticated (with or without stored role): render DashboardLayout.
 *   DashboardLayout itself handles the missing-role case by showing RolePickerInline.
 */
function DashboardGuard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-4">
          <SkeletonCard lines={4} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/dashboard/login" />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

/**
 * Login route wrapper.
 * Only redirects to the dashboard when II confirms the identity is active
 * AND a stored role exists. If isAuthenticated is false (II says not logged in),
 * ALWAYS show the login page — never redirect based on stale localStorage alone.
 */
function LoginGuard() {
  const { isAuthenticated, isLoading, storedRole } = useAuth();

  if (isLoading) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-4">
          <SkeletonCard lines={4} />
        </div>
      </div>
    );
  }

  // Only redirect when II identity is confirmed AND a role is stored.
  // If isAuthenticated is false, always show the login page regardless of localStorage.
  if (isAuthenticated && storedRole !== null) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <LoginPage />
    </Suspense>
  );
}

// ── Page loading fallback ─────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-full max-w-md space-y-3 p-4">
        <SkeletonCard lines={3} />
      </div>
    </div>
  );
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

// ── Route tree ────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Navigate to="/widget" />,
});

const widgetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/widget",
  component: () => <WidgetLayout>{withSuspense(WidgetPage)}</WidgetLayout>,
});

// Dashboard parent — auth-guarded
const dashboardParentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardGuard,
});

const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardParentRoute,
  path: "/",
  component: () => withSuspense(DashboardHome),
});

const reservationsRoute = createRoute({
  getParentRoute: () => dashboardParentRoute,
  path: "/reservations",
  component: () => withSuspense(ReservationsPage),
});

const guestsRoute = createRoute({
  getParentRoute: () => dashboardParentRoute,
  path: "/guests",
  component: () => withSuspense(GuestsPage),
});

const experiencesRoute = createRoute({
  getParentRoute: () => dashboardParentRoute,
  path: "/experiences",
  component: () => withSuspense(ExperiencesPage),
});

const waitlistRoute = createRoute({
  getParentRoute: () => dashboardParentRoute,
  path: "/waitlist",
  component: () => withSuspense(WaitlistPage),
});

const seatingRoute = createRoute({
  getParentRoute: () => dashboardParentRoute,
  path: "/seating",
  component: () => withSuspense(SeatingPlanPage),
});

const analyticsRoute = createRoute({
  getParentRoute: () => dashboardParentRoute,
  path: "/analytics",
  component: () => withSuspense(AnalyticsPage),
});

// Settings parent — renders SettingsPage (sidebar layout)
const settingsParentRoute = createRoute({
  getParentRoute: () => dashboardParentRoute,
  path: "/settings",
  component: () => withSuspense(SettingsPage),
});

// Settings index — redirect to /general
const settingsIndexRoute = createRoute({
  getParentRoute: () => settingsParentRoute,
  path: "/",
  component: () => <Navigate to="/dashboard/settings/general" />,
});

const settingsGeneralRoute = createRoute({
  getParentRoute: () => settingsParentRoute,
  path: "/general",
  component: () => withSuspense(GeneralSettingsPage),
});

const settingsOpeningHoursRoute = createRoute({
  getParentRoute: () => settingsParentRoute,
  path: "/opening-hours",
  component: () => withSuspense(OpeningHoursSettingsPage),
});

const settingsCapacityRoute = createRoute({
  getParentRoute: () => settingsParentRoute,
  path: "/capacity",
  component: () => withSuspense(CapacitySettingsPage),
});

const settingsReservationRulesRoute = createRoute({
  getParentRoute: () => settingsParentRoute,
  path: "/reservation-rules",
  component: () => withSuspense(ReservationRulesSettingsPage),
});

const settingsGuestFormRoute = createRoute({
  getParentRoute: () => settingsParentRoute,
  path: "/guest-form",
  component: () => withSuspense(GuestFormSettingsPage),
});

const settingsBrandingRoute = createRoute({
  getParentRoute: () => settingsParentRoute,
  path: "/branding",
  component: () => withSuspense(BrandingSettingsPage),
});

const settingsNotificationsRoute = createRoute({
  getParentRoute: () => settingsParentRoute,
  path: "/notifications",
  component: () => withSuspense(NotificationsSettingsPage),
});

const settingsIntegrationsRoute = createRoute({
  getParentRoute: () => settingsParentRoute,
  path: "/integrations",
  component: () => withSuspense(IntegrationsSettingsPage),
});

const settingsTeamRoute = createRoute({
  getParentRoute: () => settingsParentRoute,
  path: "/team",
  component: () => withSuspense(TeamSettingsPage),
});

const settingsSeasonalRoute = createRoute({
  getParentRoute: () => settingsParentRoute,
  path: "/seasonal",
  component: () => withSuspense(SeasonalSettingsPage),
});

// Login route — outside auth guard, with smart redirect for already-logged-in users
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/login",
  component: LoginGuard,
});

// Guest search app — public, no auth
const guestAppRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app",
  component: () => withSuspense(GuestSearchPage),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  widgetRoute,
  loginRoute,
  guestAppRoute,
  dashboardParentRoute.addChildren([
    dashboardIndexRoute,
    reservationsRoute,
    guestsRoute,
    experiencesRoute,
    waitlistRoute,
    seatingRoute,
    analyticsRoute,
    settingsParentRoute.addChildren([
      settingsIndexRoute,
      settingsGeneralRoute,
      settingsOpeningHoursRoute,
      settingsCapacityRoute,
      settingsReservationRulesRoute,
      settingsGuestFormRoute,
      settingsBrandingRoute,
      settingsNotificationsRoute,
      settingsIntegrationsRoute,
      settingsTeamRoute,
      settingsSeasonalRoute,
    ]),
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
