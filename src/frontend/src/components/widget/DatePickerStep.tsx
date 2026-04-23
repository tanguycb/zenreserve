import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface DatePickerStepProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  /**
   * Backend fixedClosingDays as numbers where the settings page uses
   * 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun.
   * We convert these to JS getDay() values (0=Sun, 1=Mon … 6=Sat).
   */
  fixedClosingDays?: number[];
  /** ISO date strings for exceptional (one-off) closing days */
  exceptionalClosingDays?: string[];
}

/**
 * Convert a backend day index (0=Mon … 6=Sun) to JS Date.getDay() value (0=Sun … 6=Sat).
 */
function backendDayToJsDay(backendDay: number): number {
  return (backendDay + 1) % 7;
}

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
  fixedClosingDays = [],
  exceptionalClosingDays = [],
}: DatePickerStepProps) {
  const { t } = useTranslation("widget");
  const [loading, setLoading] = useState(true);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const WEEKDAYS = t("dateStep.weekdays", { returnObjects: true }) as string[];
  const MONTHS = t("dateStep.months", { returnObjects: true }) as string[];

  // Convert backend closing day indices to JS getDay() values, memoize as string key for effect deps
  const closedJsDaysKey = fixedClosingDays.map(backendDayToJsDay).join(",");
  const exceptionalKey = exceptionalClosingDays.join(",");

  useEffect(() => {
    // Generate next 60 available dates based on real closing days from backend
    const now = new Date();
    const closedJs = closedJsDaysKey.split(",").filter(Boolean).map(Number);
    const exceptionalSet = new Set(exceptionalKey.split(",").filter(Boolean));

    const timer = setTimeout(() => {
      const dates: string[] = [];
      const d = new Date(now);
      d.setDate(d.getDate() + 1); // start from tomorrow
      const limit = d.getTime() + 1000 * 60 * 60 * 24 * 90; // 90 days window
      while (dates.length < 60 && d.getTime() < limit) {
        const iso = d.toISOString().split("T")[0];
        const isFixedClosed = closedJs.includes(d.getDay());
        const isExceptionalClosed = exceptionalSet.has(iso);
        if (!isFixedClosed && !isExceptionalClosed) {
          dates.push(iso);
        }
        d.setDate(d.getDate() + 1);
      }
      setAvailableDates(dates);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [closedJsDaysKey, exceptionalKey]);

  // Auto-select first available date in the viewed month
  useEffect(() => {
    if (!loading && availableDates.length > 0 && !selectedDate) {
      const first = availableDates.find((d) => {
        const dt = new Date(d);
        return dt.getFullYear() === viewYear && dt.getMonth() === viewMonth;
      });
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

  function isoDate(day: number) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function isAvailable(day: number) {
    const iso = isoDate(day);
    return availableDates.includes(iso);
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
      <p className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
        <Calendar className="h-4 w-4 text-primary" />
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
              ? "hover:bg-muted text-foreground"
              : "opacity-30 cursor-not-allowed text-muted-foreground",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="font-semibold text-sm text-foreground">
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
              ? "hover:bg-muted text-foreground"
              : "opacity-30 cursor-not-allowed text-muted-foreground",
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
            className="text-[10px] font-semibold uppercase tracking-wide py-1 text-muted-foreground"
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
          const iso = isoDate(day);
          const isSelected = selectedDate === iso;
          const disabled = past || !available;

          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelect(iso)}
              aria-label={`${day} ${MONTHS[viewMonth]} ${viewYear}${available ? `, ${t("dateStep.available")}` : ""}`}
              aria-pressed={isSelected}
              className={cn(
                "relative h-9 w-full rounded-lg text-sm font-medium transition-all duration-200",
                isSelected &&
                  "scale-110 shadow-soft bg-primary text-primary-foreground",
                !disabled && !isSelected && "hover:bg-muted text-foreground",
                disabled &&
                  !isSelected &&
                  "opacity-25 cursor-not-allowed text-muted-foreground",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-primary" aria-hidden="true" />
          <span className="text-xs text-muted-foreground">
            {t("dateStep.available")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-muted" aria-hidden="true" />
          {/* VIS-021: use i18n key, no hardcoded fallback */}
          <span className="text-xs text-muted-foreground">
            {t("dateStep.closed")}
          </span>
        </div>
      </div>
    </div>
  );
}
