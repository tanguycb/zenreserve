// ── Color palette constants ────────────────────────────────────────────────
export const COLOR_PALETTE = {
  primaryGreen: "#22C55E",
  secondaryBlue: "#3B82F6",
  accentOrange: "#D97706",
  dashboardBg: "#0F172A",
  widgetBg: "#FAF7F0",
  textDark: "#1F2937",
  textLight: "#F1F5F9",
  success: "#22C55E",
  danger: "#EF4444",
  cardLight: "#FFFFFF",
  cardDark: "#1E2937",
  borderLight: "#E2E8F0",
  borderDark: "#334155",
} as const;

// ── Reservation wizard steps ───────────────────────────────────────────────
// NOTE: These fallback labels are in Dutch. At runtime, step labels are
// provided via i18n using t('dateStep.title'), t('timeStep.title'), etc.
// in WidgetPage.tsx — these constants are only used as a static fallback.
export const WIZARD_STEPS = [
  { id: 1, label: "Datum & Tijd", key: "datetime" },
  { id: 2, label: "Aantal Gasten", key: "partySize" },
  { id: 3, label: "Ervaringen", key: "experiences" },
  { id: 4, label: "Uw Gegevens", key: "details" },
  { id: 5, label: "Bevestiging", key: "confirm" },
] as const;

// ── Guest tag options ──────────────────────────────────────────────────────
export const TAG_OPTIONS = [
  { value: "VIP", label: "VIP", color: "accent" },
  { value: "Stamgast", label: "Stamgast", color: "primary" },
  { value: "Zakelijk", label: "Zakelijk", color: "secondary" },
  { value: "Allergieën", label: "Allergieën", color: "destructive" },
  { value: "Verjaardag", label: "Verjaardag", color: "accent" },
  { value: "Huwelijksjubileum", label: "Huwelijksjubileum", color: "accent" },
  { value: "Nieuw", label: "Nieuw", color: "muted" },
] as const;

// ── Party size options ─────────────────────────────────────────────────────
export const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8] as const;

// ── Time slots ─────────────────────────────────────────────────────────────
export const TIME_SLOTS = [
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
] as const;

// ── Navigation items ───────────────────────────────────────────────────────
// NOTE: Labels are provided via i18n using t('shared:nav.*') in
// DashboardLayout.tsx. The label field here is a Dutch fallback only.
export const DASHBOARD_NAV = [
  {
    key: "home",
    label: "Dashboard",
    icon: "LayoutDashboard",
    href: "/dashboard",
  },
  {
    key: "reservations",
    label: "Reserveringen",
    icon: "CalendarDays",
    href: "/dashboard/reservations",
  },
  { key: "guests", label: "Gasten", icon: "Users", href: "/dashboard/guests" },
  {
    key: "experiences",
    label: "Ervaringen",
    icon: "Star",
    href: "/dashboard/experiences",
  },
  {
    key: "waitlist",
    label: "Wachtlijst",
    icon: "Clock",
    href: "/dashboard/waitlist",
  },
] as const;

// ── Date/time formatting ───────────────────────────────────────────────────
export const DATE_LOCALE = "nl-NL";
export const CURRENCY_LOCALE = "nl-NL";
export const CURRENCY_CODE = "EUR";
