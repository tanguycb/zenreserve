import { useExperiences } from "@/hooks/useDashboard";
import { cn } from "@/lib/utils";
import type { ReservationFormData } from "@/types";
import {
  ArrowRight,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ConfirmationStepProps {
  date: string;
  time: string;
  partySize: number;
  form: Partial<ReservationFormData>;
  experienceId: string;
  restaurantName?: string;
  /** Contact info shown beneath the restaurant name (phone, email, or address) */
  restaurantAddress?: string;
  onReset: () => void;
}

// ── i18n locale map ───────────────────────────────────────────────────────────

const LOCALE_MAP: Record<string, string> = {
  nl: "nl-NL",
  en: "en-GB",
  fr: "fr-FR",
  de: "de-DE",
};

function generateBookingRef() {
  return `ZR-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
}

function generateICS(
  date: string,
  time: string,
  name: string,
  restaurant: string,
) {
  const dt = new Date(`${date}T${time}:00`);
  const endDt = new Date(dt.getTime() + 2 * 60 * 60 * 1000);
  const format = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ZenReserve//NL",
    "BEGIN:VEVENT",
    `DTSTART:${format(dt)}`,
    `DTEND:${format(endDt)}`,
    `SUMMARY:Reservering ${restaurant}`,
    `DESCRIPTION:Beste ${name}\\, uw tafel is gereserveerd.`,
    `LOCATION:${restaurant}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadICS(
  date: string,
  time: string,
  name: string,
  restaurant: string,
) {
  const ics = generateICS(date, time, name, restaurant);
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "zenreserve.ics";
  a.click();
  URL.revokeObjectURL(url);
}

// Status color mappings using CSS variables
const STATUS_COLORS = {
  green: "var(--color-success, oklch(0.65 0.15 150))",
  blue: "var(--color-info, oklch(0.60 0.15 230))",
  amber: "var(--color-warning, oklch(0.70 0.14 80))",
  muted: "var(--muted-foreground)",
} as const;

export function ConfirmationStep({
  date,
  time,
  partySize,
  form,
  experienceId,
  restaurantName = "",
  restaurantAddress = "",
  onReset,
}: ConfirmationStepProps) {
  const { t, i18n } = useTranslation("widget");
  const [visible, setVisible] = useState(false);
  const [bookingRef] = useState(() => generateBookingRef());

  // BUG-034: Load real experiences from backend to look up name by ID
  const { data: experiences } = useExperiences();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // BUG-035: Use current i18n language for date formatting, not browser locale
  const locale = LOCALE_MAP[i18n.language?.slice(0, 2) ?? "nl"] ?? "nl-NL";

  const formattedDate = date
    ? new Date(date).toLocaleDateString(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const guestName = `${form.firstName ?? ""} ${form.lastName ?? ""}`.trim();

  // BUG-034: Look up experience name from real backend data, not hardcoded map
  const experienceName = (() => {
    if (!experienceId) return null;
    const found = experiences?.find((e) => e.id === experienceId);
    if (found) return found.name;
    // Graceful fallback if backend hasn't loaded yet or ID not found
    if (experiences !== undefined) {
      // Experiences loaded but no match — show generic fallback
      return i18n.language?.startsWith("fr")
        ? "Expérience sélectionnée"
        : i18n.language?.startsWith("en")
          ? "Experience selected"
          : "Ervaring geselecteerd";
    }
    return null; // Still loading — show nothing
  })();

  const details = [
    {
      icon: CalendarPlus,
      label: t("confirmationStep.date"),
      value: formattedDate,
      colorKey: "green" as const,
    },
    {
      icon: Clock,
      label: t("confirmationStep.time"),
      value: time,
      colorKey: "blue" as const,
    },
    {
      icon: Users,
      label: t("confirmationStep.persons"),
      value: `${partySize} ${partySize === 1 ? t("confirmationStep.person") : t("confirmationStep.personsPlural")}`,
      colorKey: "amber" as const,
    },
    ...(experienceName
      ? [
          {
            icon: MapPin,
            label: t("confirmationStep.experience"),
            value: experienceName,
            colorKey: "amber" as const,
          },
        ]
      : []),
    {
      icon: Mail,
      label: t("confirmationStep.emailConfirm"),
      value: form.email ?? "",
      colorKey: "muted" as const,
    },
  ];

  return (
    <div className="space-y-5 text-center">
      {/* Animated checkmark */}
      <div
        className={cn(
          "mx-auto h-20 w-20 rounded-full flex items-center justify-center transition-all duration-500 bg-primary/10",
          visible ? "scale-100 opacity-100" : "scale-50 opacity-0",
        )}
      >
        <CheckCircle2
          className={cn(
            "h-10 w-10 text-primary transition-all duration-700 delay-200",
            visible ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
      </div>

      <div
        className={cn(
          "transition-all duration-500 delay-300",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
      >
        <h3 className="text-2xl font-bold text-foreground">
          {t("confirmationStep.title")}
        </h3>
        <p className="text-sm mt-1 text-muted-foreground">
          {t("confirmationStep.subtitle", { name: form.firstName })}
        </p>
      </div>

      {/* Booking reference */}
      <div
        className={cn(
          "rounded-xl p-3 bg-muted/50 transition-all duration-500 delay-400",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
      >
        <p className="text-xs text-muted-foreground">
          {t("confirmationStep.bookingRef")}
        </p>
        <p className="font-mono font-bold text-lg tracking-widest mt-0.5 text-foreground">
          {bookingRef}
        </p>
      </div>

      {/* Summary details */}
      <div
        className={cn(
          "rounded-xl overflow-hidden border border-border transition-all duration-500 delay-500",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
      >
        {details.map(({ icon: Icon, label, value, colorKey }, idx) => {
          const color = STATUS_COLORS[colorKey];
          return (
            <div
              key={label}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-left",
                idx < details.length - 1 && "border-b border-border",
              )}
            >
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `color-mix(in oklch, ${color} 15%, transparent)`,
                }}
              >
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold truncate capitalize text-foreground">
                  {value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Restaurant info — real data, no hardcoded fallback */}
      {(restaurantName || restaurantAddress) && (
        <div
          className={cn(
            "rounded-xl border border-border px-4 py-3 text-left transition-all duration-500 delay-500",
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0">
              {restaurantName && (
                <p className="text-sm font-semibold text-foreground truncate">
                  {restaurantName}
                </p>
              )}
              {restaurantAddress && (
                <p className="text-xs text-muted-foreground truncate">
                  {restaurantAddress}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div
        className={cn(
          "flex gap-3 transition-all duration-500 delay-500",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
      >
        <button
          type="button"
          onClick={() => downloadICS(date, time, guestName, restaurantName)}
          className="flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-1.5 transition-all hover:opacity-80 active:scale-95 bg-primary/10 text-primary"
          data-ocid="add-to-calendar-btn"
        >
          <CalendarPlus className="h-4 w-4" />
          {t("confirmationStep.addToCalendar")}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all hover:opacity-90 active:scale-95 bg-primary text-primary-foreground"
          data-ocid="book-another-btn"
        >
          {t("confirmationStep.newBooking")}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        {t("confirmationStep.confirmationSent", { email: form.email })}
      </p>
    </div>
  );
}
