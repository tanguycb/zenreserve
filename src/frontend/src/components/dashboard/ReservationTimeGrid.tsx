import { cn } from "@/lib/utils";
import type { Reservation } from "@/types";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface ReservationTimeGridProps {
  reservations: Reservation[];
  dateRange: "today" | "week" | "next7";
  onSelectReservation: (r: Reservation) => void;
}

const TIME_START = 11; // 11:00 — covers both lunch and dinner services
const TIME_END = 23; // 23:00 (exclusive)
const SLOT_HEIGHT = 56; // px per 30-min slot
const SLOTS_PER_HOUR = 2;
const TOTAL_SLOTS = (TIME_END - TIME_START) * SLOTS_PER_HOUR;

/** Parse YYYY-MM-DD as local date (avoid UTC off-by-one) */
function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

/** Returns slot index (0-based) from HH:MM string. Returns -1 if out of range. */
function timeToSlotIndex(time: string): number {
  const [h, m] = time.split(":").map(Number);
  const slotIdx = (h - TIME_START) * SLOTS_PER_HOUR + Math.floor(m / 30);
  if (slotIdx < 0 || slotIdx >= TOTAL_SLOTS) return -1;
  return slotIdx;
}

const STATUS_BLOCK: Record<string, { bg: string; text: string; ring: string }> =
  {
    confirmed: {
      bg: "bg-[#16a34a]",
      text: "text-white",
      ring: "ring-1 ring-[#22C55E]/40",
    },
    pending: {
      bg: "bg-accent/80",
      text: "text-white",
      ring: "ring-1 ring-accent/40",
    },
    waitlist: {
      bg: "bg-[#2563eb]",
      text: "text-white",
      ring: "ring-1 ring-[#3B82F6]/40",
    },
    cancelled: {
      bg: "bg-[#b91c1c]",
      text: "text-white",
      ring: "ring-1 ring-[#EF4444]/40",
    },
    seated: {
      bg: "bg-[#15803d]",
      text: "text-white",
      ring: "ring-1 ring-[#22C55E]/60",
    },
    not_arrived: {
      bg: "bg-[#d97706]",
      text: "text-white",
      ring: "ring-1 ring-amber-400/40",
    },
    late: {
      bg: "bg-[#c2410c]",
      text: "text-white",
      ring: "ring-1 ring-orange-400/40",
    },
    departed: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      ring: "ring-1 ring-border",
    },
    completed: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      ring: "ring-1 ring-border",
    },
    no_show: {
      bg: "bg-[#7f1d1d]",
      text: "text-white",
      ring: "ring-1 ring-destructive/40",
    },
  };

function getBlockStyle(r: Reservation) {
  if (r.experienceId)
    return {
      bg: "bg-[#6d28d9]",
      text: "text-white",
      ring: "ring-1 ring-[#8B5CF6]/40",
    };
  return STATUS_BLOCK[r.status] ?? STATUS_BLOCK.pending;
}

export function ReservationTimeGrid({
  reservations,
  dateRange,
  onSelectReservation,
}: ReservationTimeGridProps) {
  const { t } = useTranslation("dashboard");
  const today = isoDate(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);

  const [weekOffset, setWeekOffset] = useState(0);

  // Compute visible days
  function getVisibleDays(): Date[] {
    const base = addDays(getWeekStart(new Date()), weekOffset * 7);
    if (dateRange === "today") {
      return [parseLocalDate(today)];
    }
    if (dateRange === "week") {
      return Array.from({ length: 7 }, (_, i) => addDays(base, i));
    }
    // next7: rolling from today
    const start = parseLocalDate(today);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }

  const days = getVisibleDays();
  const showNav = dateRange === "week";

  // Group reservations by date
  const resByDay: Record<string, Reservation[]> = {};
  for (const d of days) resByDay[isoDate(d)] = [];
  for (const r of reservations) {
    if (resByDay[r.date]) resByDay[r.date].push(r);
  }

  const DAY_NAMES_SHORT = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];

  const timeLabels = Array.from({ length: TOTAL_SLOTS + 1 }, (_, i) => {
    const totalMins = TIME_START * 60 + i * 30;
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  });

  const gridHeight = TOTAL_SLOTS * SLOT_HEIGHT;

  return (
    <div className="flex flex-col">
      {/* Navigation row */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-1">
          {showNav && (
            <>
              <button
                type="button"
                onClick={() => setWeekOffset((w) => w - 1)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={t("calendar.prevWeek")}
                data-ocid="grid-prev-week"
              >
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                type="button"
                onClick={() => setWeekOffset(0)}
                className="px-3 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={t("calendar.currentWeek")}
                data-ocid="grid-today"
              >
                {t("home.today")}
              </button>
              <button
                type="button"
                onClick={() => setWeekOffset((w) => w + 1)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={t("calendar.nextWeek")}
                data-ocid="grid-next-week"
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {days[0].toLocaleDateString("nl-BE", {
            day: "numeric",
            month: "long",
          })}{" "}
          {days.length > 1 &&
            `– ${days[days.length - 1].toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" })}`}
        </div>
        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#16a34a] inline-block" />
            {t("calendar.legendConfirmed")}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#2563eb] inline-block" />
            {t("calendar.legendWaitlist")}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#6d28d9] inline-block" />
            {t("calendar.legendExperience")}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#b91c1c] inline-block" />
            {t("calendar.legendCancelled")}
          </span>
        </div>
      </div>

      {/* Grid with sticky time labels */}
      <div
        ref={scrollRef}
        className="overflow-x-auto overflow-y-auto max-h-[600px]"
      >
        <div
          className="flex"
          style={{ minWidth: `${48 + days.length * 120}px` }}
        >
          {/* Time labels column */}
          <div className="w-12 shrink-0">
            {/* Header spacer */}
            <div className="h-10 border-b border-border" />
            {/* Time slots */}
            <div className="relative" style={{ height: gridHeight }}>
              {timeLabels.map((label, i) => (
                <div
                  key={label}
                  className="absolute left-0 right-0 flex justify-end pr-2"
                  style={{ top: i * SLOT_HEIGHT - 8 }}
                >
                  <span className="text-[10px] text-muted-foreground/60 font-mono select-none">
                    {i < timeLabels.length - 1 ? label : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Day columns */}
          {days.map((day) => {
            const key = isoDate(day);
            const isToday = key === today;
            const dayRes = resByDay[key] ?? [];
            const dow = day.getDay();

            return (
              <div key={key} className="flex-1 min-w-[110px]">
                {/* Day header */}
                <div
                  className={cn(
                    "h-10 border-b border-l border-border flex flex-col items-center justify-center",
                    isToday ? "bg-primary/10" : "bg-muted/20",
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] font-medium uppercase tracking-wide",
                      isToday ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {DAY_NAMES_SHORT[dow]}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-bold leading-tight",
                      isToday ? "text-primary" : "text-foreground",
                    )}
                  >
                    {day.getDate()}
                  </span>
                </div>

                {/* Time grid */}
                <div
                  className="relative border-l border-border"
                  style={{ height: gridHeight }}
                >
                  {/* Slot lines */}
                  {Array.from({ length: TOTAL_SLOTS }, (_, i) => {
                    const totalMins = TIME_START * 60 + i * 30;
                    const hh = String(Math.floor(totalMins / 60)).padStart(
                      2,
                      "0",
                    );
                    const mm = String(totalMins % 60).padStart(2, "0");
                    return (
                      <div
                        key={`slot-${hh}${mm}`}
                        className={cn(
                          "absolute left-0 right-0 border-t",
                          i % 2 === 0 ? "border-border/40" : "border-border/20",
                        )}
                        style={{ top: i * SLOT_HEIGHT }}
                      />
                    );
                  })}

                  {/* Reservation blocks */}
                  {dayRes.map((r) => {
                    const slotIdx = timeToSlotIndex(r.time);
                    if (slotIdx < 0) return null;
                    const style = getBlockStyle(r);
                    const durationSlots = 2; // default 1 hour
                    const blockHeight = durationSlots * SLOT_HEIGHT - 2;

                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => onSelectReservation(r)}
                        className={cn(
                          "absolute left-1 right-1 rounded-lg px-2 py-1 text-left",
                          "transition-all duration-150 hover:brightness-110 hover:scale-[1.01]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          style.bg,
                          style.text,
                          style.ring,
                        )}
                        style={{
                          top: slotIdx * SLOT_HEIGHT + 2,
                          height: blockHeight,
                          zIndex: 10,
                        }}
                        aria-label={`${r.guestName} ${r.time} ${r.partySize} personen`}
                        data-ocid="timegrid-block"
                      >
                        <p className="font-semibold text-xs leading-tight truncate">
                          {r.guestName.split(" ")[0]}
                        </p>
                        <p className="text-[10px] opacity-80 flex items-center gap-0.5 mt-0.5">
                          {r.time}
                          <span className="mx-0.5">·</span>
                          <Users className="h-2.5 w-2.5 inline" />
                          {r.partySize}
                        </p>
                        {r.experienceName && (
                          <p className="text-[9px] opacity-75 truncate mt-0.5 hidden sm:block">
                            ✨ {r.experienceName}
                          </p>
                        )}
                      </button>
                    );
                  })}

                  {/* Today's current time indicator */}
                  {isToday &&
                    (() => {
                      const now = new Date();
                      const h = now.getHours();
                      const m = now.getMinutes();
                      if (h < TIME_START || h >= TIME_END) return null;
                      const pos =
                        ((h - TIME_START) * 60 + m) * (SLOT_HEIGHT / 30);
                      return (
                        <div
                          className="absolute left-0 right-0 flex items-center pointer-events-none"
                          style={{ top: pos, zIndex: 20 }}
                        >
                          <div className="w-2 h-2 rounded-full bg-primary ml-0.5 shrink-0" />
                          <div className="flex-1 h-px bg-primary opacity-70" />
                        </div>
                      );
                    })()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
