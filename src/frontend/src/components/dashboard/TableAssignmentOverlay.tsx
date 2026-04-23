import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TableStatus,
  useAssignReservation,
  useFloorState,
  useUnassignTable,
} from "@/hooks/useSeatingPlan";
import { cn } from "@/lib/utils";
import type { Reservation } from "@/types";
import { Link2Off, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface TableAssignmentOverlayProps {
  reservation: Reservation | null;
  open: boolean;
  onClose: () => void;
}

type TableOccupancy = "empty" | "reserved" | "occupied" | "unavailable";

const OCCUPANCY_STYLES: Record<
  TableOccupancy,
  { bg: string; ring: string; dot: string; label: string }
> = {
  empty: {
    bg: "bg-[oklch(var(--color-status-free)/0.15)] hover:bg-[oklch(var(--color-status-free)/0.28)] cursor-pointer",
    ring: "ring-1 ring-[oklch(var(--color-status-free)/0.5)]",
    dot: "bg-[oklch(var(--color-status-free)/0.7)]",
    label: "available",
  },
  reserved: {
    bg: "bg-[oklch(var(--color-status-reserved)/0.15)]",
    ring: "ring-1 ring-[oklch(var(--color-status-reserved)/0.5)]",
    dot: "bg-[oklch(var(--color-status-reserved)/0.7)]",
    label: "reserved",
  },
  occupied: {
    bg: "bg-destructive/15",
    ring: "ring-1 ring-destructive/50",
    dot: "bg-destructive/70",
    label: "occupied",
  },
  unavailable: {
    bg: "bg-muted/30",
    ring: "ring-1 ring-border",
    dot: "bg-muted-foreground/30",
    label: "unavailable",
  },
};

const LEGEND_ITEMS: TableOccupancy[] = ["empty", "reserved", "occupied"];

const TRANSLATIONS = {
  nl: {
    title: "Tafel toewijzen",
    guestInfo: (name: string, size: number) => `${name} · ${size} personen`,
    noTables: "Geen tafels beschikbaar op het vloerplan.",
    unassign: "Tafel loskoppelen",
    close: "Sluiten",
    assigned: "Toegewezen",
    legend: { available: "Vrij", reserved: "Gereserveerd", occupied: "Bezet" },
    toast: {
      assigned: (table: string, name: string) =>
        `${table} gekoppeld aan ${name}`,
      unassigned: "Tafelkoppeling verwijderd",
      error: "Kon tafel niet koppelen",
    },
  },
  en: {
    title: "Assign Table",
    guestInfo: (name: string, size: number) => `${name} · ${size} guests`,
    noTables: "No tables available on the floor plan.",
    unassign: "Unassign Table",
    close: "Close",
    assigned: "Assigned",
    legend: {
      available: "Available",
      reserved: "Reserved",
      occupied: "Occupied",
    },
    toast: {
      assigned: (table: string, name: string) => `${table} assigned to ${name}`,
      unassigned: "Table unassigned",
      error: "Could not assign table",
    },
  },
  fr: {
    title: "Assigner une table",
    guestInfo: (name: string, size: number) => `${name} · ${size} personnes`,
    noTables: "Aucune table disponible sur le plan de salle.",
    unassign: "Désassigner la table",
    close: "Fermer",
    assigned: "Assigné",
    legend: { available: "Libre", reserved: "Réservé", occupied: "Occupé" },
    toast: {
      assigned: (table: string, name: string) => `${table} assigné à ${name}`,
      unassigned: "Table désassignée",
      error: "Impossible d'assigner la table",
    },
  },
};

function useTr() {
  const { i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) ??
    "nl") as keyof typeof TRANSLATIONS;
  return TRANSLATIONS[lang] ?? TRANSLATIONS.nl;
}

export function TableAssignmentOverlay({
  reservation,
  open,
  onClose,
}: TableAssignmentOverlayProps) {
  const tr = useTr();
  const { data: floorState } = useFloorState();
  const assignReservation = useAssignReservation();
  const unassignTable = useUnassignTable();

  const assignedTable = floorState?.tables.find(
    (t) => reservation && t.reservationId === reservation.id,
  );

  const isAssigning = assignReservation.isPending || unassignTable.isPending;

  function getOccupancy(tableId: string): TableOccupancy {
    const t = floorState?.tables.find((x) => x.id === tableId);
    if (!t) return "unavailable";
    // If this IS the currently assigned table, show as empty (reassignable)
    if (assignedTable?.id === tableId) return "empty";
    const s = String(t.status);
    if (s === "occupied") return "occupied";
    if (s === "reserved") return "reserved";
    if (t.status === TableStatus.empty || s === "empty" || s === "available")
      return "empty";
    return "unavailable";
  }

  async function handleAssign(tableId: string, tableName: string) {
    if (!reservation) return;
    try {
      if (assignedTable && assignedTable.id !== tableId) {
        await unassignTable.mutateAsync({ tableId: assignedTable.id });
      }
      await assignReservation.mutateAsync({
        tableId,
        reservationId: reservation.id,
        guestName: reservation.guestName,
        seatCount: reservation.partySize,
      });
      toast.success(tr.toast.assigned(tableName, reservation.guestName));
      onClose();
    } catch {
      toast.error(tr.toast.error);
    }
  }

  async function handleUnassign() {
    if (!assignedTable) return;
    try {
      await unassignTable.mutateAsync({ tableId: assignedTable.id });
      toast.success(tr.toast.unassigned);
      onClose();
    } catch {
      toast.error(tr.toast.error);
    }
  }

  const tables = floorState?.tables ?? [];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border-border text-foreground w-full max-w-md sm:max-w-lg"
        aria-modal="true"
        data-ocid="table-assignment.dialog"
      >
        <DialogHeader className="pb-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                {tr.title}
              </DialogTitle>
              {reservation && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {tr.guestInfo(reservation.guestName, reservation.partySize)}
                  {reservation.date && (
                    <span className="ml-2 opacity-70">
                      {reservation.date} {reservation.time}
                    </span>
                  )}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors rounded-md p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={tr.close}
              data-ocid="table-assignment.close_button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3 mb-1">
          {LEGEND_ITEMS.map((occ) => (
            <span key={occ} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "w-2.5 h-2.5 rounded-sm inline-block",
                  OCCUPANCY_STYLES[occ].dot,
                )}
              />
              {tr.legend[occ as keyof typeof tr.legend]}
            </span>
          ))}
        </div>

        {/* Table grid */}
        <div className="rounded-xl border border-border bg-background/50 p-4 min-h-[120px]">
          {tables.length === 0 ? (
            <p className="text-xs text-muted-foreground italic text-center py-6">
              {tr.noTables}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {tables.map((tbl, idx) => {
                  const occ = getOccupancy(tbl.id);
                  const style = OCCUPANCY_STYLES[occ];
                  const isAssignedThis = assignedTable?.id === tbl.id;
                  const isClickable = occ === "empty";

                  return (
                    <motion.button
                      key={tbl.id}
                      type="button"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.025 }}
                      disabled={!isClickable || isAssigning}
                      onClick={() =>
                        isClickable ? handleAssign(tbl.id, tbl.name) : undefined
                      }
                      className={cn(
                        "relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-150",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        style.bg,
                        style.ring,
                        isAssignedThis &&
                          "ring-2 ring-primary shadow-md scale-105",
                        !isClickable && "opacity-50 cursor-not-allowed",
                        isAssigning && "pointer-events-none",
                      )}
                      title={`${tbl.name} · ${Number(tbl.capacity)}p`}
                      aria-pressed={isAssignedThis}
                      data-ocid={`table-assignment.table.${idx + 1}`}
                    >
                      <span className="text-[11px] font-bold text-foreground leading-tight">
                        {tbl.name.replace(/^Tafel\s*/i, "")}
                      </span>
                      <span className="text-[9px] text-muted-foreground leading-tight">
                        {Number(tbl.capacity)}p
                      </span>
                      {isAssignedThis && (
                        <span
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                          aria-hidden="true"
                        >
                          <svg
                            className="w-2.5 h-2.5 text-primary-foreground"
                            viewBox="0 0 10 10"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M2 5l2.5 2.5L8 3"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-2 mt-1">
          {assignedTable ? (
            <Button
              size="sm"
              variant="ghost"
              className="text-xs gap-1.5 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
              onClick={handleUnassign}
              disabled={isAssigning}
              data-ocid="table-assignment.unassign_button"
            >
              <Link2Off className="h-3.5 w-3.5" />
              {tr.unassign}
            </Button>
          ) : (
            <span />
          )}
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-muted-foreground hover:text-foreground ml-auto"
            onClick={onClose}
            data-ocid="table-assignment.cancel_button"
          >
            {tr.close}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
