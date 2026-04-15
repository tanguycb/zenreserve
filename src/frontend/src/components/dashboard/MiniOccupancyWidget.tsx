import { Skeleton } from "@/components/ui/skeleton";
import { useFloorState } from "@/hooks/useSeatingPlan";
import { cn } from "@/lib/utils";
import type { Reservation } from "@/types";
import { useTranslation } from "react-i18next";

// ── Service slot definitions ──────────────────────────────────────────────────

interface ServiceDef {
  name: string;
  key: string;
  slots: string[];
}

const SERVICES: ServiceDef[] = [
  {
    name: "Lunch",
    key: "lunch",
    slots: ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30"],
  },
  {
    name: "Diner",
    key: "diner",
    slots: [
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
      "21:00",
      "21:30",
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns total reserved seats for a given 30-min slot window. */
function getSlotSeats(reservations: Reservation[], slotTime: string): number {
  const [slotHour, slotMin] = slotTime.split(":").map(Number);
  const slotStart = slotHour * 60 + slotMin;
  const slotEnd = slotStart + 30;

  return reservations
    .filter((r) => {
      if (r.status === "cancelled" || r.status === "departed") return false;
      const [rHour, rMin] = r.time.split(":").map(Number);
      const rMin60 = rHour * 60 + rMin;
      return rMin60 >= slotStart && rMin60 < slotEnd;
    })
    .reduce((sum, r) => sum + r.partySize, 0);
}

/** Compute fill color class based on occupancy ratio. */
function fillColorClass(pct: number): string {
  if (pct > 90) return "bg-destructive";
  if (pct > 70) return "bg-[oklch(0.72_0.22_58)]";
  return "bg-primary";
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface SlotBarProps {
  time: string;
  reserved: number;
  capacity: number;
}

function SlotBar({ time, reserved, capacity }: SlotBarProps) {
  const pct = capacity > 0 ? Math.round((reserved / capacity) * 100) : 0;
  const color = fillColorClass(pct);
  const fillW = Math.min(pct, 100);

  return (
    <div
      className="flex items-center gap-2"
      data-ocid="occupancy-slot"
      aria-label={`${time}: ${reserved}/${capacity}`}
    >
      {/* Time label */}
      <span className="text-xs text-muted-foreground w-10 shrink-0 font-mono">
        {time}
      </span>

      {/* Progress bar */}
      <div className="flex-1 h-2 rounded-full bg-muted/50 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            color,
          )}
          style={{ width: `${fillW}%` }}
          aria-hidden="true"
        />
      </div>

      {/* Count */}
      <span
        className={cn(
          "text-xs font-medium w-12 text-right shrink-0",
          pct > 90
            ? "text-destructive"
            : pct > 70
              ? "text-[oklch(0.72_0.22_58)]"
              : "text-muted-foreground",
        )}
      >
        {reserved}/{capacity}
      </span>
    </div>
  );
}

// ── Main widget ───────────────────────────────────────────────────────────────

interface MiniOccupancyWidgetProps {
  reservations: Reservation[];
  className?: string;
}

export function MiniOccupancyWidget({
  reservations,
  className,
}: MiniOccupancyWidgetProps) {
  const { t } = useTranslation("dashboard");
  const { data: floorState, isLoading: floorLoading } = useFloorState();

  // Total seating capacity derived from tables (sum of capacity bigints)
  const totalCapacity =
    floorState?.tables?.reduce((sum, tbl) => sum + Number(tbl.capacity), 0) ??
    0;

  // Per-slot capacity: use total capacity as the baseline for each slot
  // (each slot can seat up to totalCapacity guests simultaneously)
  const slotCapacity = totalCapacity > 0 ? totalCapacity : 40; // fallback: 40 default

  return (
    <div
      className={cn(
        "gradient-card rounded-2xl border border-border shadow-soft flex flex-col",
        className,
      )}
      data-ocid="mini-occupancy-widget"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            {t("dashboard:home.occupancyWidget", "Bezetting vandaag")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("dashboard:home.allTimeslots", "Alle tijdsloten per dienst")}
          </p>
        </div>
        {/* Legend */}
        <div className="flex flex-col gap-1 items-end text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-primary inline-block" />
            {"<70%"}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[oklch(0.72_0.22_58)] inline-block" />
            {"70-90%"}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-destructive inline-block" />
            {">90%"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto max-h-80 px-5 py-4 space-y-5">
        {floorLoading ? (
          <div className="space-y-4">
            {[1, 2].map((s) => (
              <div key={s} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((sl) => (
                    <div key={sl} className="flex items-center gap-2">
                      <Skeleton className="h-3 w-10" />
                      <Skeleton className="h-2 flex-1 rounded-full" />
                      <Skeleton className="h-3 w-10" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          SERVICES.map((service) => (
            <div key={service.key}>
              {/* Service heading */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                {t(
                  `dashboard:home.service${service.key.charAt(0).toUpperCase() + service.key.slice(1)}`,
                  service.name,
                )}
              </p>

              {/* Slots */}
              <div className="space-y-2">
                {service.slots.map((slot) => {
                  const reserved = getSlotSeats(reservations, slot);
                  return (
                    <SlotBar
                      key={slot}
                      time={slot}
                      reserved={reserved}
                      capacity={slotCapacity}
                    />
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
