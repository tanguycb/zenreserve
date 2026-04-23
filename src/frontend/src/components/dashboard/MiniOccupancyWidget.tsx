import { Skeleton } from "@/components/ui/skeleton";
import { useFloorState } from "@/hooks/useSeatingPlan";
import { cn } from "@/lib/utils";
import type { Reservation } from "@/types";
import { useTranslation } from "react-i18next";

// ── Helpers ───────────────────────────────────────────────────────────────────

type OccupancyLevel = "low" | "medium" | "high";

function getOccupancyLevel(pct: number): OccupancyLevel {
  if (pct >= 80) return "high";
  if (pct >= 45) return "medium";
  return "low";
}

interface LevelConfig {
  label: string;
  labelKey: string;
  color: string;
  glow: string;
  needleColor: string;
}

const LEVEL_CONFIG: Record<OccupancyLevel, LevelConfig> = {
  low: {
    label: "Rustig",
    labelKey: "barometerLow",
    color: "text-primary",
    glow: "drop-shadow-[0_0_8px_oklch(0.72_0.24_142)]",
    needleColor: "oklch(0.72 0.24 142)",
  },
  medium: {
    label: "Druk",
    labelKey: "barometerMedium",
    color: "text-[oklch(0.72_0.22_58)]",
    glow: "drop-shadow-[0_0_8px_oklch(0.72_0.22_58)]",
    needleColor: "oklch(0.72 0.22 58)",
  },
  high: {
    label: "Vol",
    labelKey: "barometerHigh",
    color: "text-destructive",
    glow: "drop-shadow-[0_0_8px_oklch(0.65_0.24_25)]",
    needleColor: "oklch(0.65 0.24 25)",
  },
};

// ── Gauge SVG ─────────────────────────────────────────────────────────────────

interface GaugeProps {
  pct: number;
  level: OccupancyLevel;
}

function OccupancyGauge({ pct, level }: GaugeProps) {
  const config = LEVEL_CONFIG[level];
  // Needle angle: -90° (left/0%) → 0° (top/50%) → +90° (right/100%)
  const clampedPct = Math.min(Math.max(pct, 0), 100);
  const needleAngle = -90 + (clampedPct / 100) * 180;

  // Arc path: semicircle split into 3 segments
  const cx = 80;
  const cy = 80;
  const r = 60;

  function polarToXY(angleDeg: number, radius: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.sin(rad),
      y: cy - radius * Math.cos(rad),
    };
  }

  function arcPath(startAngle: number, endAngle: number) {
    const start = polarToXY(startAngle, r);
    const end = polarToXY(endAngle, r);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
  }

  // Needle
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleTip = {
    x: cx + (r - 8) * Math.cos(needleRad),
    y: cy + (r - 8) * Math.sin(needleRad),
  };

  return (
    <svg
      viewBox="0 0 160 92"
      className="w-full max-w-[200px] mx-auto"
      aria-hidden="true"
    >
      {/* Track background */}
      <path
        d={arcPath(180, 360)}
        fill="none"
        stroke="oklch(0.25 0.01 240)"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Low zone — green */}
      <path
        d={arcPath(180, 240)}
        fill="none"
        stroke="oklch(0.72 0.24 142)"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* Medium zone — amber */}
      <path
        d={arcPath(240, 300)}
        fill="none"
        stroke="oklch(0.72 0.22 58)"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* High zone — red */}
      <path
        d={arcPath(300, 360)}
        fill="none"
        stroke="oklch(0.65 0.24 25)"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Needle */}
      <line
        x1={cx}
        y1={cy}
        x2={needleTip.x}
        y2={needleTip.y}
        stroke={config.needleColor}
        strokeWidth="3"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${config.needleColor})` }}
      />
      {/* Needle pivot */}
      <circle cx={cx} cy={cy} r="5" fill={config.needleColor} />
      <circle cx={cx} cy={cy} r="3" fill="oklch(0.15 0.01 240)" />
    </svg>
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

  // Total seating capacity derived from tables
  const totalCapacity =
    floorState?.tables?.reduce((sum, tbl) => sum + Number(tbl.capacity), 0) ??
    40;
  const capacity = totalCapacity > 0 ? totalCapacity : 40;

  // Total confirmed covers for today (all services combined)
  const totalReserved = reservations
    .filter((r) => r.status !== "cancelled" && r.status !== "departed")
    .reduce((sum, r) => sum + r.partySize, 0);

  const occupancyPct =
    capacity > 0 ? Math.round((totalReserved / capacity) * 100) : 0;
  const level = getOccupancyLevel(occupancyPct);
  const config = LEVEL_CONFIG[level];

  return (
    <div
      className={cn(
        "gradient-card rounded-2xl border border-border shadow-soft flex flex-col",
        className,
      )}
      data-ocid="mini-occupancy-widget"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-base font-semibold text-foreground">
          {t("dashboard:home.occupancyWidget", "Bezetting vandaag")}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("dashboard:home.barometerSubtitle", "Drukte barometer")}
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-5 gap-3">
        {floorLoading ? (
          <div className="space-y-3 w-full flex flex-col items-center">
            <Skeleton className="h-[92px] w-[200px] rounded-xl" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <>
            {/* Gauge */}
            <OccupancyGauge pct={occupancyPct} level={level} />

            {/* Status badge */}
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-semibold text-sm border",
                level === "low" &&
                  "bg-primary/10 border-primary/30 text-primary",
                level === "medium" &&
                  "bg-[oklch(0.72_0.22_58)]/10 border-[oklch(0.72_0.22_58)]/30 text-[oklch(0.72_0.22_58)]",
                level === "high" &&
                  "bg-destructive/10 border-destructive/30 text-destructive",
              )}
              data-ocid="occupancy-level-badge"
            >
              <span
                className={cn("h-2.5 w-2.5 rounded-full animate-pulse", {
                  "bg-primary": level === "low",
                  "bg-[oklch(0.72_0.22_58)]": level === "medium",
                  "bg-destructive": level === "high",
                })}
              />
              {t(`dashboard:home.${config.labelKey}`, config.label)}
            </div>

            {/* Numbers */}
            <div className="text-center">
              <p
                className={cn("text-3xl font-bold tabular-nums", config.color)}
              >
                {occupancyPct}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalReserved} / {capacity}{" "}
                {t("dashboard:home.barometerSeats", "plaatsen")}
              </p>
            </div>

            {/* Zone labels */}
            <div className="w-full flex justify-between text-[10px] text-muted-foreground mt-1 px-2">
              <span className="text-primary font-medium">
                {t("dashboard:home.barometerLow", "Rustig")}
              </span>
              <span className="text-[oklch(0.72_0.22_58)] font-medium">
                {t("dashboard:home.barometerMedium", "Druk")}
              </span>
              <span className="text-destructive font-medium">
                {t("dashboard:home.barometerHigh", "Vol")}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
