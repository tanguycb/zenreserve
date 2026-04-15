import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import type { Table, TableId } from "@/hooks/useSeatingPlan";
import { cn } from "@/lib/utils";
import { ChevronRight, Plus, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

const STATUS_STYLES: Record<
  string,
  { badge: string; dot: string; bg: string }
> = {
  empty: {
    badge: "border-[#22C55E] text-[#22C55E]",
    dot: "bg-[#22C55E]",
    bg: "bg-[#22C55E]/10",
  },
  reserved: {
    badge: "border-[#3B82F6] text-[#3B82F6]",
    dot: "bg-[#3B82F6]",
    bg: "bg-[#3B82F6]/10",
  },
  occupied: {
    badge: "border-[#D97706] text-[#D97706]",
    dot: "bg-[#D97706]",
    bg: "bg-[#D97706]/10",
  },
  unavailable: {
    badge: "border-[#94A3B8] text-[#94A3B8]",
    dot: "bg-[#94A3B8]",
    bg: "bg-[#94A3B8]/10",
  },
};

interface Props {
  tables: Table[];
  isLoading: boolean;
  onTableClick: (table: Table) => void;
  onAddTable: () => void;
  selectedTableIds: Set<TableId>;
  onSelectionChange: (ids: Set<TableId>) => void;
  isBulkMode: boolean;
}

const SKELETON_KEYS = ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4"];

export function TableListView({
  tables,
  isLoading,
  onTableClick,
  onAddTable,
  selectedTableIds,
  onSelectionChange,
  isBulkMode,
}: Props) {
  const { t } = useTranslation("dashboard");

  const STATUS_LABELS: Record<string, string> = {
    empty: t("seatingPlan.tableEmpty"),
    reserved: t("seatingPlan.tableReserved"),
    occupied: t("seatingPlan.tableOccupied"),
    unavailable: t("seatingPlan.tableUnavailable"),
  };

  const toggleOne = (id: TableId) => {
    const next = new Set(selectedTableIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {SKELETON_KEYS.map((k) => (
          <div
            key={k}
            className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border min-h-[80px]"
          >
            <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-muted-foreground"
        data-ocid="seating-list-empty"
      >
        <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center mb-4">
          <Users className="h-7 w-7 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-semibold text-foreground">
          {t("seatingPlan.noTables")}
        </p>
        <p className="text-xs mt-1">{t("seatingPlan.noTablesHint")}</p>
      </div>
    );
  }

  return (
    <div className="relative pb-28">
      <ul className="space-y-3" aria-label={t("seatingPlan.mobileListView")}>
        {tables.map((table) => {
          const status = String(table.status);
          const styles = STATUS_STYLES[status] ?? STATUS_STYLES.empty;
          const statusLabel = STATUS_LABELS[status] ?? status;
          const isChecked = selectedTableIds.has(table.id);

          return (
            <li key={table.id}>
              <div
                className={cn(
                  "w-full flex items-center gap-3 px-4 rounded-2xl bg-card border transition-all",
                  isChecked
                    ? "border-[#3B82F6] ring-1 ring-[#3B82F6]/40"
                    : "border-border",
                  "min-h-[80px]",
                )}
              >
                {/* Checkbox — shown in bulk mode */}
                {isBulkMode && (
                  <div className="shrink-0 flex items-center justify-center h-11 w-11">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleOne(table.id)}
                      aria-label={t("seating.bulk.selectTable", {
                        name: table.name,
                      })}
                      data-ocid={`table-list-checkbox-${table.id}`}
                      className="h-5 w-5 border-2"
                    />
                  </div>
                )}

                {/* Row button */}
                <button
                  type="button"
                  className={cn(
                    "flex-1 flex items-center gap-4 py-4 text-left",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl",
                    "active:scale-[0.99] transition-all",
                  )}
                  onClick={() =>
                    isBulkMode ? toggleOne(table.id) : onTableClick(table)
                  }
                  data-ocid={`table-list-row-${table.id}`}
                  aria-label={`${table.name}, ${statusLabel}${table.guestName ? `, ${table.guestName}` : ""}`}
                >
                  {/* Status icon */}
                  <div
                    className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
                      styles.bg,
                    )}
                  >
                    <span
                      className={cn("h-4 w-4 rounded-full", styles.dot)}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Table info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {table.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3 shrink-0" />
                        {String(table.capacity)} {t("seatingPlan.seats")}
                      </span>
                      {table.guestName && (
                        <>
                          <span className="text-muted-foreground/40 text-xs">
                            ·
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {table.guestName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status badge + chevron */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={cn("text-xs font-medium", styles.badge)}
                    >
                      {statusLabel}
                    </Badge>
                    {!isBulkMode && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                    )}
                  </div>
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* FAB — floating action button (hidden in bulk mode) */}
      {!isBulkMode && (
        <button
          type="button"
          className={cn(
            "fixed bottom-6 right-6 z-30",
            "h-14 w-14 rounded-full bg-[#22C55E] shadow-[0_8px_24px_rgba(34,197,94,0.4)]",
            "flex items-center justify-center",
            "hover:bg-[#16a34a] active:scale-95 transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2",
          )}
          onClick={onAddTable}
          data-ocid="seating-list-add-fab"
          aria-label={t("seatingPlan.addTable")}
          style={{ minHeight: 56, minWidth: 56 }}
        >
          <Plus className="h-6 w-6 text-white" />
        </button>
      )}
    </div>
  );
}
