import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface TimeSlotData {
  time: string;
  seats: number;
  totalSeats: number;
  status: "available" | "limited" | "full";
}

interface TimeSlotStepProps {
  selectedDate: string;
  selectedTime: string;
  partySize: number;
  onSelect: (time: string) => void;
  onWaitlist: () => void;
  /** Optional slot data passed from parent/backend */
  availableSlots?: Array<{
    time: string;
    available: boolean;
    capacity: number;
    booked: number;
  }>;
}

export function TimeSlotStep({
  selectedDate,
  selectedTime,
  partySize,
  onSelect,
  onWaitlist,
  availableSlots,
}: TimeSlotStepProps) {
  const { t } = useTranslation("widget");
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<TimeSlotData[]>([]);
  const allFull = slots.length > 0 && slots.every((s) => s.status === "full");

  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);

    if (availableSlots && availableSlots.length > 0) {
      // Use real slots from backend
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
          seats: remaining,
          totalSeats: s.capacity,
          status,
        };
      });
      setSlots(mapped);
      setLoading(false);
    } else {
      // No slots available from backend — show empty state
      setSlots([]);
      setLoading(false);
    }
  }, [selectedDate, partySize, availableSlots]);

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  if (loading) {
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
        <p
          className="text-sm font-semibold flex items-center gap-1.5"
          style={{ color: "#1F2937" }}
        >
          <Clock className="h-4 w-4" style={{ color: "#22C55E" }} />
          {t("timeStep.title")}
        </p>
        {formattedDate && (
          <p className="text-xs mt-0.5 capitalize" style={{ color: "#6B7280" }}>
            {formattedDate}
          </p>
        )}
      </div>

      {/* No slots available */}
      {slots.length === 0 && (
        <div className="text-center py-8 space-y-2">
          <div
            className="mx-auto h-12 w-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#F3F4F6" }}
          >
            <Clock className="h-6 w-6" style={{ color: "#9CA3AF" }} />
          </div>
          <p className="font-semibold text-sm" style={{ color: "#1F2937" }}>
            {t("timeStep.noSlots", "Geen tijdsloten beschikbaar")}
          </p>
          <p className="text-xs" style={{ color: "#6B7280" }}>
            {t(
              "timeStep.noSlotsSub",
              "Kies een andere datum of schrijf je in op de wachtlijst.",
            )}
          </p>
          <button
            type="button"
            onClick={onWaitlist}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: "#3B82F6", color: "#FFFFFF" }}
            data-ocid="waitlist-btn"
          >
            {t("timeStep.waitlistCta")}
          </button>
        </div>
      )}

      {allFull && (
        <div className="text-center py-6 space-y-3">
          <div
            className="mx-auto h-12 w-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#FEE2E2" }}
          >
            <Clock className="h-6 w-6" style={{ color: "#EF4444" }} />
          </div>
          <div>
            <p className="font-semibold" style={{ color: "#1F2937" }}>
              {t("timeStep.allFull")}
            </p>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              {t("timeStep.allFullSub")}
            </p>
          </div>
          <button
            type="button"
            onClick={onWaitlist}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: "#3B82F6", color: "#FFFFFF" }}
            data-ocid="waitlist-btn"
          >
            {t("timeStep.waitlistCta")}
          </button>
        </div>
      )}

      {!allFull && slots.length > 0 && (
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
                  aria-label={`${slot.time}, ${statusLabel}, ${slot.seats} ${t("timeStep.places")}`}
                  aria-pressed={isSelected}
                  className={cn(
                    "w-full py-3 px-2 rounded-xl border-2 text-center transition-all duration-200",
                    isFull && "cursor-not-allowed opacity-50",
                    !isFull &&
                      !isSelected &&
                      "hover:border-primary/40 hover:scale-[1.02]",
                    isSelected && "scale-105",
                  )}
                  style={
                    isSelected
                      ? { borderColor: "#22C55E", backgroundColor: "#22C55E1A" }
                      : isFull
                        ? {
                            borderColor: "#E2E8F0",
                            backgroundColor: "#F9FAFB",
                          }
                        : isLimited
                          ? {
                              borderColor: "#D9770640",
                              backgroundColor: "#D977061A",
                            }
                          : {
                              borderColor: "#E2E8F0",
                              backgroundColor: "#FFFFFF",
                            }
                  }
                >
                  <span
                    className="block text-sm font-bold leading-tight"
                    style={
                      isSelected
                        ? { color: "#22C55E" }
                        : isFull
                          ? { color: "#9CA3AF" }
                          : isLimited
                            ? { color: "#D97706" }
                            : { color: "#1F2937" }
                    }
                  >
                    {slot.time}
                  </span>
                  <span
                    className="block text-[10px] mt-0.5 font-medium"
                    style={
                      isSelected
                        ? { color: "#22C55E" }
                        : isFull
                          ? { color: "#EF4444" }
                          : isLimited
                            ? { color: "#D97706" }
                            : { color: "#6B7280" }
                    }
                  >
                    {statusLabel}
                  </span>
                  {!isFull && (
                    <span
                      className="block text-[9px] mt-0.5"
                      style={{ color: "#9CA3AF" }}
                    >
                      {slot.seats} {t("timeStep.places")}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
