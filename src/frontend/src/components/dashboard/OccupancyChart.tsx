import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface HourSlot {
  hour: string;
  label: string;
  count: number;
  pct: number;
}

const HOURS: { hour: string; label: string }[] = [
  { hour: "12", label: "12u" },
  { hour: "13", label: "13u" },
  { hour: "14", label: "14u" },
  { hour: "15", label: "15u" },
  { hour: "16", label: "16u" },
  { hour: "17", label: "17u" },
  { hour: "18", label: "18u" },
  { hour: "19", label: "19u" },
  { hour: "20", label: "20u" },
  { hour: "21", label: "21u" },
  { hour: "22", label: "22u" },
];

const MAX_CAPACITY = 20;

function getBarColor(pct: number): string {
  if (pct >= 90) return "bg-destructive/80";
  if (pct >= 70) return "bg-accent/80";
  return "bg-primary/75";
}

interface OccupancyChartProps {
  isLoading?: boolean;
  className?: string;
  /** Real reservation counts per hour, keyed by hour string ("12", "13", ...) */
  countsByHour?: Record<string, number>;
  maxCapacity?: number;
}

function buildSlots(
  countsByHour: Record<string, number>,
  capacity: number,
): HourSlot[] {
  return HOURS.map(({ hour, label }) => {
    const count = countsByHour[hour] ?? 0;
    return {
      hour,
      label,
      count,
      pct: Math.round((count / capacity) * 100),
    };
  });
}

export function OccupancyChart({
  isLoading = false,
  className,
  countsByHour = {},
  maxCapacity = MAX_CAPACITY,
}: OccupancyChartProps) {
  const slots = buildSlots(countsByHour, maxCapacity);
  const hasAnyData = slots.some((s) => s.count > 0);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card shadow-soft flex flex-col",
        className,
      )}
      data-ocid="occupancy-chart-card"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="text-base font-semibold text-foreground">
          Bezetting vandaag
        </h2>
        <span className="text-xs text-muted-foreground">
          Max {maxCapacity} tafels
        </span>
      </div>

      <div className="flex-1 px-5 pt-4 pb-5">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="flex justify-between gap-1">
              {HOURS.map(({ hour }) => (
                <Skeleton key={hour} className="h-3 w-6 rounded" />
              ))}
            </div>
          </div>
        ) : !hasAnyData ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <span className="text-muted-foreground text-sm">
              Nog geen reserveringen vandaag
            </span>
            <div className="flex gap-1.5 w-full items-end h-8">
              {HOURS.map(({ hour }) => (
                <div
                  key={hour}
                  className="flex-1 flex flex-col items-center justify-end gap-0.5"
                >
                  <div
                    className="w-full rounded-t-sm bg-muted opacity-30"
                    style={{ height: "4%" }}
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-1.5 w-full">
              {HOURS.map(({ hour, label }) => (
                <div
                  key={hour}
                  className="flex-1 text-center text-[10px] text-muted-foreground leading-none"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            role="img"
            aria-label="Bezettingsdiagram per uur vandaag"
            className="flex flex-col gap-2"
          >
            <div className="flex items-end gap-1.5 h-32" aria-hidden="true">
              {slots.map((slot) => (
                <div
                  key={slot.hour}
                  className="flex-1 flex flex-col items-center justify-end gap-0.5"
                >
                  {slot.count > 0 && (
                    <span className="text-[10px] font-semibold text-muted-foreground leading-none">
                      {slot.count}
                    </span>
                  )}
                  <div
                    className={cn(
                      "w-full rounded-t-sm transition-smooth",
                      getBarColor(slot.pct),
                      slot.count === 0 ? "opacity-20 bg-muted" : "",
                    )}
                    style={{ height: `${Math.max(slot.pct, 4)}%` }}
                    title={`${slot.label}: ${slot.count} reserveringen (${slot.pct}%)`}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-1.5">
              {slots.map((slot) => (
                <div
                  key={slot.hour}
                  className="flex-1 text-center text-[10px] text-muted-foreground leading-none"
                >
                  {slot.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && (
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <LegendItem color="bg-primary/75" label="Normaal" />
            <LegendItem color="bg-accent/80" label="Druk (>70%)" />
            <LegendItem color="bg-destructive/80" label="Vol (>90%)" />
          </div>
        )}
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn("h-2.5 w-2.5 rounded-sm shrink-0", color)}
        aria-hidden="true"
      />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
