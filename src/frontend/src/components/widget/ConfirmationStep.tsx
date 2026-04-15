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
  onReset: () => void;
}

const EXPERIENCE_NAMES: Record<string, string> = {
  e1: "Chef's Tasting Menu",
  e2: "Wijnproeverij Avond",
  e3: "Seizoensmenu Lente",
};

function generateBookingRef() {
  return `ZR-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
}

function generateICS(date: string, time: string, name: string) {
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
    "SUMMARY:Reservering Restaurant ZenReserve",
    `DESCRIPTION:Beste ${name}\\, uw tafel is gereserveerd.`,
    "LOCATION:Restaurant ZenReserve\\, Grote Markt 1\\, 2000 Antwerpen",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadICS(date: string, time: string, name: string) {
  const ics = generateICS(date, time, name);
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "zenreserve.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export function ConfirmationStep({
  date,
  time,
  partySize,
  form,
  experienceId,
  onReset,
}: ConfirmationStepProps) {
  const { t } = useTranslation("widget");
  const [visible, setVisible] = useState(false);
  const [bookingRef] = useState(() => generateBookingRef());

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const formattedDate = date
    ? new Date(date).toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const guestName = `${form.firstName ?? ""} ${form.lastName ?? ""}`.trim();
  const experienceName = experienceId ? EXPERIENCE_NAMES[experienceId] : null;

  const details = [
    {
      icon: CalendarPlus,
      label: t("confirmationStep.date"),
      value: formattedDate,
      color: "#22C55E",
    },
    {
      icon: Clock,
      label: t("confirmationStep.time"),
      value: time,
      color: "#3B82F6",
    },
    {
      icon: Users,
      label: t("confirmationStep.persons"),
      value: `${partySize} ${partySize === 1 ? t("confirmationStep.person") : t("confirmationStep.personsPlural")}`,
      color: "#D97706",
    },
    ...(experienceName
      ? [
          {
            icon: MapPin,
            label: t("confirmationStep.experience"),
            value: experienceName,
            color: "#D97706",
          },
        ]
      : []),
    {
      icon: Mail,
      label: t("confirmationStep.emailConfirm"),
      value: form.email ?? "",
      color: "#6B7280",
    },
  ];

  return (
    <div className="space-y-5 text-center">
      {/* Animated checkmark */}
      <div
        className={cn(
          "mx-auto h-20 w-20 rounded-full flex items-center justify-center transition-all duration-500",
          visible ? "scale-100 opacity-100" : "scale-50 opacity-0",
        )}
        style={{ backgroundColor: "#22C55E1A" }}
      >
        <CheckCircle2
          className={cn(
            "h-10 w-10 transition-all duration-700 delay-200",
            visible ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
          style={{ color: "#22C55E" }}
        />
      </div>

      <div
        className={cn(
          "transition-all duration-500 delay-300",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
      >
        <h3 className="text-2xl font-bold" style={{ color: "#1F2937" }}>
          {t("confirmationStep.title")}
        </h3>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          {t("confirmationStep.subtitle", { name: form.firstName })}
        </p>
      </div>

      {/* Booking reference */}
      <div
        className={cn(
          "rounded-xl p-3 transition-all duration-500 delay-400",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
        style={{ backgroundColor: "#F9FAFB" }}
      >
        <p className="text-xs" style={{ color: "#9CA3AF" }}>
          {t("confirmationStep.bookingRef")}
        </p>
        <p
          className="font-mono font-bold text-lg tracking-widest mt-0.5"
          style={{ color: "#1F2937" }}
        >
          {bookingRef}
        </p>
      </div>

      {/* Summary details */}
      <div
        className={cn(
          "rounded-xl overflow-hidden transition-all duration-500 delay-500",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
        style={{ border: "1px solid #E2E8F0" }}
      >
        {details.map(({ icon: Icon, label, value, color }, idx) => (
          <div
            key={label}
            className="flex items-center gap-3 px-4 py-3 text-left"
            style={
              idx < details.length - 1
                ? { borderBottom: "1px solid #F3F4F6" }
                : {}
            }
          >
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${color}1A` }}
            >
              <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs" style={{ color: "#9CA3AF" }}>
                {label}
              </p>
              <p
                className="text-sm font-semibold truncate capitalize"
                style={{ color: "#1F2937" }}
              >
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div
        className={cn(
          "flex gap-3 transition-all duration-500 delay-500",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
      >
        <button
          type="button"
          onClick={() => downloadICS(date, time, guestName)}
          className="flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-1.5 transition-all hover:opacity-80 active:scale-95"
          style={{ backgroundColor: "#22C55E1A", color: "#22C55E" }}
          data-ocid="add-to-calendar-btn"
        >
          <CalendarPlus className="h-4 w-4" />
          {t("confirmationStep.addToCalendar")}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#22C55E", color: "#FFFFFF" }}
          data-ocid="book-another-btn"
        >
          {t("confirmationStep.newBooking")}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs" style={{ color: "#9CA3AF" }}>
        {t("confirmationStep.confirmationSent", { email: form.email })}
      </p>
    </div>
  );
}
