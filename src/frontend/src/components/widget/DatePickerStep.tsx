import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface DatePickerStepProps {
  selectedDate: string;
  onSelect: (date: string) => void;
}

// Generate next 30 available dates (Mon-Sun except Tuesday = closed)
function getAvailableDates(): string[] {
  const dates: string[] = [];
  const now = new Date();
  const d = new Date(now);
  d.setDate(d.getDate() + 1); // start from tomorrow
  while (dates.length < 30) {
    if (d.getDay() !== 2) {
      // closed on Tuesday
      dates.push(d.toISOString().split("T")[0]);
    }
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

const FULLY_BOOKED: string[] = ["2026-04-13", "2026-04-17"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday=0
}

export function DatePickerStep({
  selectedDate,
  onSelect,
}: DatePickerStepProps) {
  const { t } = useTranslation("widget");
  const [loading, setLoading] = useState(true);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const WEEKDAYS = t("dateStep.weekdays", { returnObjects: true }) as string[];
  const MONTHS = t("dateStep.months", { returnObjects: true }) as string[];

  useEffect(() => {
    const timer = setTimeout(() => {
      setAvailableDates(getAvailableDates());
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Auto-select first available date
  useEffect(() => {
    if (!loading && availableDates.length > 0 && !selectedDate) {
      const first = availableDates.find(
        (d) =>
          !FULLY_BOOKED.includes(d) &&
          viewYear === new Date(d).getFullYear() &&
          viewMonth === new Date(d).getMonth(),
      );
      if (first) onSelect(first);
    }
  }, [loading, availableDates, selectedDate, onSelect, viewYear, viewMonth]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());
  const canGoNext =
    viewYear < today.getFullYear() + 1 ||
    (viewYear === today.getFullYear() + 1 && viewMonth <= today.getMonth() + 2);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }
  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function isAvailable(day: number) {
    const d = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return availableDates.includes(d) && !FULLY_BOOKED.includes(d);
  }

  function isFullyBooked(day: number) {
    const d = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return FULLY_BOOKED.includes(d);
  }

  function isPast(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    return d <= todayStart;
  }

  function isoDate(day: number) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  if (loading) {
    return (
      <div
        className="space-y-3 p-1"
        aria-label={t("dateStep.loading")}
        aria-busy="true"
      >
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable id
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p
        className="text-sm font-semibold flex items-center gap-1.5"
        style={{ color: "#1F2937" }}
      >
        <Calendar className="h-4 w-4" style={{ color: "#22C55E" }} />
        {t("dateStep.title")}
      </p>

      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          aria-label={t("dateStep.prevMonth")}
          className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
            canGoPrev
              ? "hover:bg-black/5 text-[#1F2937]"
              : "opacity-30 cursor-not-allowed text-[#9CA3AF]",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="font-semibold text-sm" style={{ color: "#1F2937" }}>
          {MONTHS[viewMonth]} {viewYear}
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          disabled={!canGoNext}
          aria-label={t("dateStep.nextMonth")}
          className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
            canGoNext
              ? "hover:bg-black/5 text-[#1F2937]"
              : "opacity-30 cursor-not-allowed text-[#9CA3AF]",
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <span
            key={w}
            className="text-[10px] font-semibold uppercase tracking-wide py-1"
            style={{ color: "#9CA3AF" }}
          >
            {w}
          </span>
        ))}

        {/* Empty cells for first week offset */}
        {Array.from({ length: firstDay }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: positional grid cells with no id
          <div key={i} />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const past = isPast(day);
          const available = isAvailable(day);
          const booked = isFullyBooked(day);
          const iso = isoDate(day);
          const isSelected = selectedDate === iso;
          const disabled = past || (!available && !booked);

          return (
            <button
              key={day}
              type="button"
              disabled={disabled || booked}
              onClick={() => !disabled && !booked && onSelect(iso)}
              aria-label={`${day} ${MONTHS[viewMonth]} ${viewYear}${booked ? `, ${t("dateStep.fullyBooked")}` : available ? `, ${t("dateStep.available")}` : ""}`}
              aria-pressed={isSelected}
              className={cn(
                "relative h-9 w-full rounded-lg text-sm font-medium transition-all duration-200",
                isSelected && "scale-110 shadow-soft",
                !disabled && !booked && !isSelected && "hover:bg-black/5",
                disabled && !booked && "opacity-25 cursor-not-allowed",
                booked && "cursor-not-allowed",
              )}
              style={
                isSelected
                  ? { backgroundColor: "#22C55E", color: "#FFFFFF" }
                  : booked
                    ? { color: "#EF4444" }
                    : available
                      ? { color: "#1F2937" }
                      : { color: "#D1D5DB" }
              }
            >
              {day}
              {booked && (
                <span
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full"
                  style={{ backgroundColor: "#EF4444" }}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-1">
        <div className="flex items-center gap-1.5">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: "#22C55E" }}
            aria-hidden="true"
          />
          <span className="text-xs" style={{ color: "#6B7280" }}>
            {t("dateStep.available")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="h-3 w-3 rounded-full relative flex items-center justify-center"
            style={{ backgroundColor: "#FEE2E2" }}
          >
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "#EF4444" }}
              aria-hidden="true"
            />
          </div>
          <span className="text-xs" style={{ color: "#6B7280" }}>
            {t("dateStep.fullyBooked")}
          </span>
        </div>
      </div>
    </div>
  );
}
