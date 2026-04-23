import { Skeleton } from "@/components/ui/skeleton";
import type { ServiceHours } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface TimeSlotData {
  time: string;
  status: "available" | "limited" | "full";
}

interface ServiceGroup {
  service: ServiceHours;
  slots: TimeSlotData[];
}

interface TimeSlotStepProps {
  selectedDate: string;
  selectedTime: string;
  partySize: number;
  onSelect: (time: string) => void;
  onWaitlist: () => void;
  /** Slot data fetched from backend by parent (useAvailableSlots) */
  availableSlots?: Array<{
    time: string;
    available: boolean;
    capacity: number;
    booked: number;
  }>;
  /** True while parent is fetching slots from backend */
  isLoading?: boolean;
  /** Service windows from opening hours config — used to group slots */
  services?: ServiceHours[];
}

/** Compare two "HH:MM" strings lexicographically (works because format is fixed-width). */
function timeGte(a: string, b: string) {
  return a >= b;
}
function timeLt(a: string, b: string) {
  return a < b;
}

/** Group a flat slot list into service buckets. Slots outside all windows are dropped. */
function groupByService(
  slots: TimeSlotData[],
  services: ServiceHours[],
): ServiceGroup[] {
  const groups: ServiceGroup[] = services
    .filter((svc) => svc.openTime && svc.closeTime)
    .map((svc) => ({ service: svc, slots: [] }));

  for (const slot of slots) {
    for (const group of groups) {
      const { openTime, closeTime } = group.service;
      if (timeGte(slot.time, openTime) && timeLt(slot.time, closeTime)) {
        group.slots.push(slot);
        break; // assign to first matching window only
      }
    }
    // slots outside every window are silently dropped per requirements
  }

  return groups.filter((g) => g.slots.length > 0);
}

export function TimeSlotStep({
  selectedDate,
  selectedTime,
  partySize,
  onSelect,
  onWaitlist,
  availableSlots,
  isLoading = false,
  services,
}: TimeSlotStepProps) {
  const { t, i18n } = useTranslation("widget");
  const [slots, setSlots] = useState<TimeSlotData[]>([]);

  // Only set allFull when data is loaded AND there are slots AND all are full
  const allFull =
    !isLoading && slots.length > 0 && slots.every((s) => s.status === "full");

  // Guard "no slots" message — only show after loading completes
  const showNoSlots = !isLoading && slots.length === 0;

  useEffect(() => {
    if (!selectedDate) return;
    if (availableSlots && availableSlots.length > 0) {
      const mapped: TimeSlotData[] = availableSlots.map((s) => {
        const remaining = s.capacity - s.booked;
        const status: TimeSlotData["status"] =
          !s.available || remaining === 0
            ? "full"
            : remaining < partySize
              ? "limited"
              : "available";
        return {
          time: s.time,
          status,
        };
      });
      setSlots(mapped);
    } else {
      setSlots([]);
    }
  }, [selectedDate, partySize, availableSlots]);

  // VIS-006: use current i18n locale so date renders in the correct language
  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString(i18n.language, {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  // Determine whether we should render grouped or flat
  const useGrouped =
    services && services.length > 0 && !allFull && slots.length > 0;
  const groups: ServiceGroup[] = useGrouped
    ? groupByService(slots, services!)
    : [];
  const hasVisibleGroups = groups.length > 0;

  if (isLoading) {
    return (
      <div
        className="space-y-3"
        aria-label={t("timeStep.loading")}
        aria-busy="true"
      >
        <Skeleton className="h-5 w-48 rounded" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
            <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
          <Clock className="h-4 w-4 text-primary" />
          {t("timeStep.title")}
        </p>
        {formattedDate && (
          <p className="text-xs mt-0.5 capitalize text-muted-foreground">
            {formattedDate}
          </p>
        )}
      </div>

      {/* No slots available — only shown after loading */}
      {showNoSlots && !allFull && (
        <div className="text-center py-8 space-y-2">
          <div className="mx-auto h-12 w-12 rounded-full flex items-center justify-center bg-muted">
            <Clock className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-semibold text-sm text-foreground">
            {t("timeStep.noSlots")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("timeStep.noSlotsSub")}
          </p>
          <button
            type="button"
            onClick={onWaitlist}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 bg-primary text-primary-foreground"
            data-ocid="waitlist-btn"
          >
            {t("timeStep.waitlistCta")}
          </button>
        </div>
      )}

      {allFull && (
        <div className="text-center py-6 space-y-3">
          <div className="mx-auto h-12 w-12 rounded-full flex items-center justify-center bg-destructive/10">
            <Clock className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {t("timeStep.allFull")}
            </p>
            <p className="text-sm mt-1 text-muted-foreground">
              {t("timeStep.allFullSub")}
            </p>
          </div>
          <button
            type="button"
            onClick={onWaitlist}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 bg-primary text-primary-foreground"
            data-ocid="waitlist-btn"
          >
            {t("timeStep.waitlistCta")}
          </button>
        </div>
      )}

      {/* Grouped by service (Lunch / Diner) */}
      {!allFull && hasVisibleGroups && (
        <div className="space-y-5">
          {groups.map((group) => (
            <div key={group.service.id}>
              {/* Service label */}
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wide text-primary">
                  {group.service.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {group.service.openTime}–{group.service.closeTime}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <SlotGrid
                slots={group.slots}
                selectedTime={selectedTime}
                onSelect={onSelect}
                t={t}
              />
            </div>
          ))}
        </div>
      )}

      {/* Flat grid fallback — shown when no services config is available */}
      {!allFull && !hasVisibleGroups && slots.length > 0 && (
        <SlotGrid
          slots={slots}
          selectedTime={selectedTime}
          onSelect={onSelect}
          t={t}
        />
      )}
    </div>
  );
}

// ── Shared slot grid ───────────────────────────────────────────────────────────

interface SlotGridProps {
  slots: TimeSlotData[];
  selectedTime: string;
  onSelect: (time: string) => void;
  t: (key: string) => string;
}

function SlotGrid({ slots, selectedTime, onSelect, t }: SlotGridProps) {
  return (
    <ul
      className="grid grid-cols-3 gap-2 list-none p-0 m-0"
      aria-label={t("timeStep.slots")}
    >
      {slots.map((slot) => {
        const isSelected = selectedTime === slot.time;
        const isFull = slot.status === "full";
        const isLimited = slot.status === "limited";
        const statusLabel =
          slot.status === "available"
            ? t("timeStep.available")
            : slot.status === "limited"
              ? t("timeStep.limited")
              : t("timeStep.full");

        return (
          <li key={slot.time}>
            <button
              type="button"
              disabled={isFull}
              onClick={() => !isFull && onSelect(slot.time)}
              aria-label={`${slot.time}, ${statusLabel}`}
              aria-pressed={isSelected}
              className={cn(
                "w-full py-3 px-2 rounded-xl border-2 text-center transition-all duration-200",
                isFull && "cursor-not-allowed opacity-50",
                !isFull &&
                  !isSelected &&
                  "hover:border-primary/40 hover:scale-[1.02]",
                isSelected && "scale-105 border-primary bg-primary/10",
                !isSelected &&
                  !isFull &&
                  isLimited &&
                  "border-amber-500/40 bg-amber-500/10",
                !isSelected && !isFull && !isLimited && "border-border bg-card",
                !isSelected && isFull && "border-border bg-muted",
              )}
            >
              <span
                className={cn(
                  "block text-sm font-bold leading-tight",
                  isSelected && "text-primary",
                  !isSelected && isFull && "text-muted-foreground",
                  !isSelected &&
                    !isFull &&
                    isLimited &&
                    "text-amber-600 dark:text-amber-400",
                  !isSelected && !isFull && !isLimited && "text-foreground",
                )}
              >
                {slot.time}
              </span>
              {isFull && (
                <span className="block text-[10px] mt-0.5 font-medium text-destructive">
                  {statusLabel}
                </span>
              )}
              {isLimited && !isFull && (
                <span className="block text-[10px] mt-0.5 font-medium text-amber-600 dark:text-amber-400">
                  {statusLabel}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
