import { cn } from "@/lib/utils";
import type { Reservation } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ReservationCalendarProps {
  reservations: Reservation[];
  onSelectReservation: (r: Reservation) => void;
}

function getWeekStart(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday = 0
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

const STATUS_BORDER: Record<string, string> = {
  confirmed: "border-l-primary",
  pending: "border-l-accent",
  waitlist: "border-l-secondary",
  cancelled: "border-l-destructive",
  seated: "border-l-primary",
  completed: "border-l-muted-foreground",
  no_show: "border-l-destructive",
};

const STATUS_BG: Record<string, string> = {
  confirmed: "bg-primary/10 hover:bg-primary/15",
  pending: "bg-accent/10 hover:bg-accent/15",
  waitlist: "bg-secondary/10 hover:bg-secondary/15",
  cancelled: "bg-destructive/10 hover:bg-destructive/15",
  seated: "bg-primary/15 hover:bg-primary/20",
  completed: "bg-muted/60 hover:bg-muted",
  no_show: "bg-destructive/10 hover:bg-destructive/15",
};

export function ReservationCalendar({
  reservations,
  onSelectReservation,
}: ReservationCalendarProps) {
  const { t } = useTranslation("dashboard");
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const today = isoDate(new Date());

  const DAY_NAMES = t("calendar.dayNames", { returnObjects: true }) as string[];

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const resByDay: Record<string, Reservation[]> = {};
  for (const day of days) {
    resByDay[isoDate(day)] = [];
  }
  for (const r of reservations) {
    if (resByDay[r.date]) resByDay[r.date].push(r);
  }
  for (const key of Object.keys(resByDay)) {
    resByDay[key].sort((a, b) => a.time.localeCompare(b.time));
  }

  const weekLabel = `${days[0].toLocaleDateString(undefined, { day: "numeric", month: "long" })} – ${days[6].toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}`;

  return (
    <div className="space-y-3">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setWeekStart((w) => addDays(w, -7))}
          className="p-2 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={t("calendar.prevWeek")}
          data-ocid="cal-prev-week"
        >
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        </button>

        <button
          type="button"
          onClick={() => setWeekStart(getWeekStart(new Date()))}
          className="text-sm font-medium text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1"
          aria-label={t("calendar.currentWeek")}
          data-ocid="cal-today"
        >
          {weekLabel}
        </button>

        <button
          type="button"
          onClick={() => setWeekStart((w) => addDays(w, 7))}
          className="p-2 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={t("calendar.nextWeek")}
          data-ocid="cal-next-week"
        >
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* 7-column grid */}
      <div
        className="grid grid-cols-7 gap-1.5"
        aria-label={t("reservations.tabCalendar")}
      >
        {days.map((day, i) => {
          const key = isoDate(day);
          const isToday = key === today;
          const dayRes = resByDay[key] ?? [];
          const countLabel =
            dayRes.length === 1
              ? t("calendar.reservationCount", { count: dayRes.length })
              : t("calendar.reservationCountPlural", { count: dayRes.length });

          return (
            <div
              key={key}
              className="flex flex-col gap-1"
              aria-label={`${DAY_NAMES[i]} ${day.toLocaleDateString(undefined, { day: "numeric", month: "long" })}, ${countLabel}`}
            >
              {/* Day header */}
              <div
                className={cn(
                  "flex flex-col items-center py-1.5 px-1 rounded-lg text-center",
                  isToday
                    ? "bg-primary/15 ring-1 ring-primary/40"
                    : "bg-muted/30",
                )}
              >
                <span
                  className={cn(
                    "text-xs font-medium",
                    isToday ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {DAY_NAMES[i]}
                </span>
                <span
                  className={cn(
                    "text-sm font-semibold mt-0.5",
                    isToday ? "text-primary" : "text-foreground",
                  )}
                >
                  {day.getDate()}
                </span>
                {dayRes.length > 0 && (
                  <span
                    className={cn(
                      "mt-1 text-xs rounded-full px-1.5 font-medium",
                      isToday
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {dayRes.length}
                  </span>
                )}
              </div>

              {/* Reservation cards */}
              <div className="flex flex-col gap-1 min-h-[120px]">
                {dayRes.slice(0, 4).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onSelectReservation(r)}
                    className={cn(
                      "w-full text-left rounded-md px-2 py-1.5 border-l-2 text-xs transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      STATUS_BORDER[r.status] ?? "border-l-border",
                      STATUS_BG[r.status] ?? "bg-muted/30",
                    )}
                    aria-label={t("calendar.cardLabel", {
                      name: r.guestName,
                      time: r.time,
                      count: r.partySize,
                    })}
                    data-ocid="cal-reservation-card"
                  >
                    <p className="font-medium text-foreground truncate leading-tight">
                      {r.guestName.split(" ")[0]}
                    </p>
                    <p className="text-muted-foreground tabular-nums">
                      {r.time} · {r.partySize}p
                    </p>
                  </button>
                ))}
                {dayRes.length > 4 && (
                  <p className="text-xs text-muted-foreground text-center py-0.5">
                    {t("reservations.moreItems", {
                      count: dayRes.length - 4,
                    })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
