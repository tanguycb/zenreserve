import { DashboardLayout } from "@/components/DashboardLayout";
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
import { Component, Suspense, lazy } from "react";
import type { ErrorInfo, ReactNode } from "react";

// ── Chunk Error Boundary ──────────────────────────────────────────────────────
/**
 * Catches failures from lazy-loaded route chunks (e.g. "Importing a module
 * script failed" when a JS asset is not served correctly on the IC).
 * Shows a simple reload prompt instead of a blank / crashed screen.
 */
interface ChunkErrorState {
  hasError: boolean;
}
class ChunkErrorBoundary extends Component<
  { children: ReactNode },
  ChunkErrorState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): ChunkErrorState {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    // Only log — never rethrow; keep the app alive.
    console.error("[ChunkErrorBoundary]", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="dark min-h-screen bg-background flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-sm">
            <p className="text-foreground font-semibold">
              De pagina kon niet worden geladen.
            </p>
            <p className="text-muted-foreground text-sm">
              Ververs de pagina om het opnieuw te proberen.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Pagina verversen
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Lazy pages ────────────────────────────────────────────────────────────────
const WidgetPage = lazy(() => import("@/pages/WidgetPage"));
const DashboardHome = lazy(() => import("@/pages/DashboardHome"));
const ReservationsPage = lazy(() => import("@/pages/ReservationsPage"));
const GuestsPage = lazy(() => import("@/pages/GuestsPage"));
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
const ZonesSettingsPage = lazy(
  () => import("@/pages/settings/ZonesSettingsPage"),
);
const SettingsExperiencesPage = lazy(
  () => import("@/pages/settings/SettingsExperiencesPage"),
);
const SeatingPlanSettingsPage = lazy(
  () => import("@/pages/settings/SeatingPlanSettingsPage"),
);
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage"));
const AuditLogPage = lazy(() => import("@/pages/AuditLogPage"));

// ── Auth loading spinner ──────────────────────────────────────────────────────
/**
 * Full-screen loading spinner shown while Internet Identity is resolving.
 * Used by both DashboardGuard and LoginGuard during the async init window.
 * A spinner (not a skeleton) is intentional — it clearly communicates that
 * the app is checking login state, not rendering content.
 */
function AuthLoadingSpinner() {
  return (
    <div className="dark min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground">
          Sessie wordt gecontroleerd…
        </p>
      </div>
    </div>
  );
}

// ── Auth guard wrapper ────────────────────────────────────────────────────────
/**
 * Guards all /dashboard/* routes except /dashboard/login.
 *
 * CRITICAL — isAuthReady gate:
 * The InternetIdentityProvider performs an async initialization to restore a
 * session from IndexedDB. During this window, loginStatus === "initializing"
 * and isAuthReady is false. We MUST NOT redirect until isAuthReady is true —
 * doing so causes a race condition where a valid session appears as
 * unauthenticated because the async check hasn't completed yet.
 *
 * After init, loginStatus becomes "idle" (session restored) or stays as an
 * error state. isAuthenticated accounts for BOTH the "success" case (fresh
 * login) and the "idle" case (session restored on refresh).
 */
function DashboardGuard() {
  const { isAuthenticated, isAuthReady } = useAuth();

  // Block all routing until II has finished its async init.
  // This is the ONLY correct way to prevent premature redirects on refresh.
  if (!isAuthReady) {
    return <AuthLoadingSpinner />;
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
 *
 * Uses the same isAuthReady gate as DashboardGuard.
 */
function LoginGuard() {
  const { isAuthenticated, isAuthReady, storedRole } = useAuth();

  // Block all routing until II has finished its async init.
  if (!isAuthReady) {
    return <AuthLoadingSpinner />;
  }

  // Only redirect when II identity is confirmed AND a role is stored.
  // If isAuthenticated is false, always show the login page regardless of localStorage.
  if (isAuthenticated && storedRole !== null) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <ChunkErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    </ChunkErrorBoundary>
  );
}

// ── Page loading fallback ─────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="h-8 w-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
    </div>
  );
}

function withSuspense(Component: React.ComponentType) {
  return (
    <ChunkErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    </ChunkErrorBoundary>
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

const auditLogRoute = createRoute({
  getParentRoute: () => dashboardParentRoute,
  path: "/audit-log",
  component: () => withSuspense(AuditLogPage),
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

const settingsZonesRoute = createRoute({
  getParentRoute: () => settingsParentRoute,
  path: "/zones",
  component: () => withSuspense(ZonesSettingsPage),
});

const settingsExperiencesRoute = createRoute({
  getParentRoute: () => settingsParentRoute,
  path: "/experiences",
  component: () => withSuspense(SettingsExperiencesPage),
});

const settingsSeatingPlanRoute = createRoute({
  getParentRoute: () => settingsParentRoute,
  path: "/seating-plan",
  component: () => withSuspense(SeatingPlanSettingsPage),
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
    waitlistRoute,
    seatingRoute,
    analyticsRoute,
    auditLogRoute,
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
      settingsZonesRoute,
      settingsExperiencesRoute,
      settingsSeatingPlanRoute,
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
