import { useOpeningHoursConfig } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";
import type { Reservation } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ReservationCalendarProps {
  reservations: Reservation[];
  onSelectReservation: (r: Reservation) => void;
  /** Called when a service pill is clicked: navigates list view to that day+service */
  onSelectDayService?: (date: string, serviceId: string) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isoLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function localToday(): string {
  return isoLocalDate(new Date());
}

/** Returns all dates in a calendar grid for a given year/month (includes leading/trailing days). */
function buildCalendarGrid(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Start on Monday (ISO week)
  let startDow = firstDay.getDay(); // 0=Sun
  startDow = startDow === 0 ? 6 : startDow - 1; // convert to Mon=0

  const grid: Date[] = [];
  for (let i = startDow; i > 0; i--) {
    grid.push(new Date(year, month, 1 - i));
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    grid.push(new Date(year, month, d));
  }
  // Pad to complete last week row
  while (grid.length % 7 !== 0) {
    grid.push(
      new Date(year, month + 1, grid.length - lastDay.getDate() - startDow + 1),
    );
  }
  return grid;
}

/** Returns occupancy pill color class based on fill ratio */
function pillColor(booked: number, capacity: number): string {
  if (capacity === 0) return "bg-muted/60 text-muted-foreground";
  const ratio = booked / capacity;
  if (ratio > 0.8) return "bg-destructive/80 text-white";
  if (ratio >= 0.5) return "bg-amber-500/80 text-white";
  return "bg-primary/80 text-white";
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ReservationCalendar({
  reservations,
  onSelectDayService,
}: ReservationCalendarProps) {
  const { t, i18n } = useTranslation("dashboard");
  const { data: openingHours } = useOpeningHoursConfig();

  const today = localToday();
  const nowDate = new Date();
  const [year, setYear] = useState(nowDate.getFullYear());
  const [month, setMonth] = useState(nowDate.getMonth());

  const DAY_NAMES_SHORT = (t("calendar.dayNamesShort", {
    returnObjects: true,
  }) as string[]) ?? ["Mo", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

  const grid = buildCalendarGrid(year, month);

  // Build lookup: date → reservation[]
  const resByDay: Record<string, Reservation[]> = {};
  for (const r of reservations) {
    if (!resByDay[r.date]) resByDay[r.date] = [];
    resByDay[r.date].push(r);
  }

  // Services from settings (with fallback defaults)
  const services = openingHours?.services ?? [];

  // Get booked count for a service on a given date
  function getServiceBooking(
    date: string,
    service: {
      id: string;
      name: string;
      openTime: string;
      closeTime: string;
      maxCapacity: number;
    },
  ) {
    const dayRes = resByDay[date] ?? [];
    const [openH, openM] = service.openTime.split(":").map(Number);
    const [closeH, closeM] = service.closeTime.split(":").map(Number);
    const openMins = openH * 60 + openM;
    const closeMins = closeH * 60 + closeM;
    const booked = dayRes.filter((r) => {
      if (r.status === "cancelled") return false;
      const [rH, rM] = r.time.split(":").map(Number);
      const rMins = rH * 60 + rM;
      return rMins >= openMins && rMins < closeMins;
    });
    return { booked: booked.length, capacity: service.maxCapacity };
  }

  function prevMonth() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
  }
  function goToday() {
    setYear(nowDate.getFullYear());
    setMonth(nowDate.getMonth());
  }

  const monthLabel = new Date(year, month, 1).toLocaleDateString(
    i18n.language?.slice(0, 2) === "fr"
      ? "fr-BE"
      : i18n.language?.slice(0, 2) === "en"
        ? "en-GB"
        : "nl-BE",
    { month: "long", year: "numeric" },
  );

  return (
    <div className="space-y-3">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={t("calendar.prevMonth")}
          data-ocid="cal-prev-month"
        >
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        </button>

        <button
          type="button"
          onClick={goToday}
          className="text-sm font-semibold text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1 capitalize"
          aria-label={t("calendar.currentMonth")}
          data-ocid="cal-month-label"
        >
          {monthLabel}
        </button>

        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={t("calendar.nextMonth")}
          data-ocid="cal-next-month"
        >
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 gap-px">
        {DAY_NAMES_SHORT.map((name) => (
          <div
            key={name}
            className="text-center text-xs font-medium text-muted-foreground py-1.5"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden border border-border">
        {grid.map((day) => {
          const key = isoLocalDate(day);
          const isCurrentMonth = day.getMonth() === month;
          const isToday = key === today;
          const dayRes = resByDay[key] ?? [];
          const totalCount = dayRes.filter(
            (r) => r.status !== "cancelled",
          ).length;

          return (
            <div
              key={`${key}-cell`}
              className={cn(
                "bg-card min-h-[90px] p-1.5 flex flex-col gap-1",
                !isCurrentMonth && "opacity-40",
              )}
              data-ocid={`cal.day.${key}`}
            >
              {/* Date number */}
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold leading-none",
                    isToday
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground",
                  )}
                >
                  {day.getDate()}
                </span>
                {totalCount > 0 && !isToday && (
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {totalCount}
                  </span>
                )}
              </div>

              {/* Service pills */}
              <div className="flex flex-col gap-0.5 flex-1">
                {services.length === 0 && dayRes.length > 0 && (
                  // Fallback if no services configured: show total count pill
                  <button
                    type="button"
                    onClick={() => onSelectDayService?.(key, "all")}
                    className="w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate bg-primary/70 text-white hover:bg-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    data-ocid={`cal.day.${key}.all`}
                  >
                    {totalCount} res.
                  </button>
                )}
                {services.map((service) => {
                  const { booked, capacity } = getServiceBooking(key, service);
                  if (!isCurrentMonth) return null;
                  if (booked === 0 && capacity === 0) return null;
                  const color = pillColor(booked, capacity);

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => onSelectDayService?.(key, service.id)}
                      className={cn(
                        "w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate transition-all",
                        "hover:brightness-110 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                        color,
                      )}
                      aria-label={`${service.name}: ${booked}/${capacity}`}
                      data-ocid={`cal.day.${key}.service.${service.id}`}
                    >
                      <span className="font-semibold">
                        {service.name.length > 8
                          ? `${service.name.slice(0, 7)}…`
                          : service.name}
                      </span>{" "}
                      <span className="opacity-90">
                        {booked}/{capacity}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground justify-end px-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-primary/80 inline-block" />
          {t("calendar.legendAvailable")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/80 inline-block" />
          {t("calendar.legendBusy")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-destructive/80 inline-block" />
          {t("calendar.legendFull")}
        </span>
      </div>
    </div>
  );
}
