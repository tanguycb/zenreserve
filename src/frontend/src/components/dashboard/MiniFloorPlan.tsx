import { useFloorState } from "@/hooks/useSeatingPlan";
import { cn } from "@/lib/utils";
import type { Reservation } from "@/types";
import { useTranslation } from "react-i18next";

interface MiniFloorPlanProps {
  reservations: Reservation[];
  selectedTable: string | null;
  onSelectTable: (tableId: string) => void;
}

type TableOccupancy = "empty" | "reserved" | "occupied" | "unavailable";

const OCCUPANCY_BG: Record<
  TableOccupancy,
  { bg: string; ring: string; dotColor: string }
> = {
  empty: {
    bg: "bg-[#16a34a]/20 hover:bg-[#16a34a]/35",
    ring: "ring-1 ring-[#22C55E]/50",
    dotColor: "bg-[#22C55E]/50",
  },
  reserved: {
    bg: "bg-amber-500/20 hover:bg-amber-500/35",
    ring: "ring-1 ring-amber-400/50",
    dotColor: "bg-amber-400/50",
  },
  occupied: {
    bg: "bg-destructive/20 hover:bg-destructive/35",
    ring: "ring-1 ring-destructive/50",
    dotColor: "bg-destructive/50",
  },
  unavailable: {
    bg: "bg-muted/40",
    ring: "ring-1 ring-border",
    dotColor: "bg-muted-foreground/30",
  },
};

export function MiniFloorPlan({
  reservations,
  selectedTable,
  onSelectTable,
}: MiniFloorPlanProps) {
  const { t } = useTranslation("dashboard");
  const { data: floorState } = useFloorState();

  if (!floorState || floorState.tables.length === 0) return null;

  // Determine occupancy per table based on floorState + active reservations
  const occupancyMap: Record<string, TableOccupancy> = {};
  for (const tbl of floorState.tables) {
    const status = String(tbl.status);
    if (status === "occupied") occupancyMap[tbl.id] = "occupied";
    else if (status === "reserved") occupancyMap[tbl.id] = "reserved";
    else if (status === "unavailable") occupancyMap[tbl.id] = "unavailable";
    else occupancyMap[tbl.id] = "empty";
  }

  // Overlay with today's active reservations
  for (const r of reservations) {
    if (r.tableNumber != null) {
      const tableId = `t${r.tableNumber}`;
      if (r.status === "seated") occupancyMap[tableId] = "occupied";
      else if (r.status === "confirmed") occupancyMap[tableId] = "reserved";
    }
  }

  const LEGEND_OCCUPANCIES: TableOccupancy[] = [
    "empty",
    "reserved",
    "occupied",
  ];
  const LEGEND_KEYS: Record<TableOccupancy, string> = {
    empty: "seating.legend.available",
    reserved: "seating.legend.reserved",
    occupied: "seating.legend.occupied",
    unavailable: "seating.legend.unavailable",
  };

  return (
    <div className="rounded-2xl bg-card border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">
          {t("reservations.mini_floor_plan.title")}
        </h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {LEGEND_OCCUPANCIES.map((occ) => (
            <span key={occ} className="flex items-center gap-1">
              <span
                className={cn(
                  "w-2.5 h-2.5 rounded-sm inline-block",
                  OCCUPANCY_BG[occ].dotColor,
                )}
              />
              {t(LEGEND_KEYS[occ])}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {floorState.tables.map((tbl) => {
          const occ = occupancyMap[tbl.id] ?? "empty";
          const style = OCCUPANCY_BG[occ];
          const tableNum = tbl.id.replace("t", "");
          const isSelected = selectedTable === tableNum;

          return (
            <button
              key={tbl.id}
              type="button"
              onClick={() => onSelectTable(tableNum)}
              className={cn(
                "relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                style.bg,
                style.ring,
                isSelected && "scale-110 ring-2 ring-primary shadow-lg",
              )}
              title={`${tbl.name} (${Number(tbl.capacity)} pers.) — ${t(LEGEND_KEYS[occ])}`}
              aria-pressed={isSelected}
              data-ocid="mini-table"
            >
              <span className="text-[10px] font-bold text-foreground leading-tight">
                {tbl.name.replace("Tafel ", "")}
              </span>
              <span className="text-[9px] text-muted-foreground leading-tight">
                {Number(tbl.capacity)}p
              </span>
            </button>
          );
        })}
      </div>

      {selectedTable && (
        <p className="text-xs text-muted-foreground mt-2">
          {t("reservations.mini_floor_plan.filter_message", {
            table: selectedTable,
          })}
        </p>
      )}
    </div>
  );
}
