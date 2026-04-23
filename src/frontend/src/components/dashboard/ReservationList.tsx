import { SkeletonTableRow } from "@/components/SkeletonCard";
import { TableAssignmentOverlay } from "@/components/dashboard/TableAssignmentOverlay";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFloorState } from "@/hooks/useSeatingPlan";
import type { Reservation, ReservationStatus } from "@/types";
import { CalendarDays, Check, Eye, Pencil, Plus, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type SortKey = "date" | "time" | "partySize";
type SortDir = "asc" | "desc";

interface ReservationListProps {
  reservations: Reservation[];
  isLoading: boolean;
  onView: (r: Reservation) => void;
  onCheckIn: (r: Reservation) => void;
  onCancel: (r: Reservation) => void;
  onStatusChange: (id: string, status: ReservationStatus) => void;
}

const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5"];

const ALL_STATUSES: ReservationStatus[] = [
  "confirmed",
  "not_arrived",
  "late",
  "seated",
  "departed",
  "cancelled",
  "waitlist",
  "completed",
  "no_show",
];

const STATUS_LABELS_NL: Record<string, string> = {
  confirmed: "Bevestigd",
  not_arrived: "Niet aangekomen",
  late: "Te laat",
  seated: "Zit aan tafel",
  departed: "Vertrokken",
  cancelled: "Geannuleerd",
  waitlist: "Wachtlijst",
  completed: "Voltooid",
  no_show: "Niet verschenen",
  pending: "In behandeling",
};

const AVATAR_COLOR: Record<string, string> = {
  confirmed: "bg-[#16a34a]/20 text-[#22C55E]",
  not_arrived: "bg-amber-500/20 text-amber-400",
  late: "bg-orange-600/20 text-orange-400",
  seated: "bg-[#15803d]/20 text-[#22C55E]",
  departed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/20 text-destructive",
  waitlist: "bg-[#2563eb]/20 text-[#3B82F6]",
  completed: "bg-muted text-muted-foreground",
  no_show: "bg-destructive/20 text-destructive",
  pending: "bg-accent/20 text-accent",
};

function formatDate(d: string) {
  if (!d) return "—";
  const dt = new Date(`${d}T00:00:00`);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("nl-BE", {
    day: "2-digit",
    month: "short",
  });
}

export function ReservationList({
  reservations,
  isLoading,
  onView,
  onCheckIn,
  onCancel,
  onStatusChange,
}: ReservationListProps) {
  const { t, i18n } = useTranslation(["dashboard"]);
  const lang = i18n.language?.slice(0, 2) ?? "nl";
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [assignTarget, setAssignTarget] = useState<Reservation | null>(null);

  const { data: floorState } = useFloorState();

  function getAssignedTableName(res: Reservation): string | null {
    if (!floorState) return res.tableNumber ? `T${res.tableNumber}` : null;
    const t = floorState.tables.find((tbl) => tbl.reservationId === res.id);
    if (t) return t.name.replace(/^Tafel\s*/i, "T");
    if (res.tableNumber) return `T${res.tableNumber}`;
    return null;
  }

  const tooltipAssign =
    lang === "en"
      ? "Assign table"
      : lang === "fr"
        ? "Assigner table"
        : "Tafel toewijzen";

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = [...reservations].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "date")
      cmp = a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
    else if (sortKey === "time") cmp = a.time.localeCompare(b.time);
    else cmp = a.partySize - b.partySize;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      <span aria-hidden="true" className="ml-1 text-primary">
        {sortDir === "asc" ? "↑" : "↓"}
      </span>
    ) : (
      <span aria-hidden="true" className="ml-1 text-muted-foreground/40">
        ↕
      </span>
    );

  return (
    <TooltipProvider delayDuration={300}>
      <div className="overflow-x-auto">
        <table
          className="w-full text-sm"
          aria-label={t("dashboard:reservations.title")}
          aria-busy={isLoading}
        >
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th
                scope="col"
                className="px-4 py-3 text-left font-medium text-muted-foreground"
              >
                <button
                  type="button"
                  onClick={() => handleSort("date")}
                  className="flex items-center hover:text-foreground transition-colors focus-visible:outline-none focus-visible:text-primary"
                  aria-sort={
                    sortKey === "date"
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  {t("dashboard:reservations.columns.date")}{" "}
                  <SortIcon k="date" />
                </button>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left font-medium text-muted-foreground"
              >
                <button
                  type="button"
                  onClick={() => handleSort("time")}
                  className="flex items-center hover:text-foreground transition-colors focus-visible:outline-none focus-visible:text-primary"
                  aria-sort={
                    sortKey === "time"
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  {t("dashboard:reservations.columns.time")}{" "}
                  <SortIcon k="time" />
                </button>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left font-medium text-muted-foreground min-w-[160px]"
              >
                {t("dashboard:reservations.columns.guest")}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left font-medium text-muted-foreground"
              >
                <button
                  type="button"
                  onClick={() => handleSort("partySize")}
                  className="flex items-center hover:text-foreground transition-colors focus-visible:outline-none focus-visible:text-primary"
                  aria-sort={
                    sortKey === "partySize"
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  {t("dashboard:reservations.columns.partyShort")}{" "}
                  <SortIcon k="partySize" />
                </button>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell"
              >
                {t("dashboard:reservations.columns.table", "Tafel")}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell"
              >
                {t("dashboard:reservations.columns.experience")}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left font-medium text-muted-foreground min-w-[160px]"
              >
                {t("dashboard:reservations.columns.status")}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right font-medium text-muted-foreground"
              >
                {t("dashboard:reservations.columns.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              SKELETON_KEYS.map((k) => (
                <tr key={k}>
                  <td colSpan={8} className="p-0">
                    <SkeletonTableRow />
                  </td>
                </tr>
              ))
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div
                    className="flex flex-col items-center justify-center py-16 text-center"
                    data-ocid="reservations.empty_state"
                  >
                    <CalendarDays
                      className="h-10 w-10 text-muted-foreground/30 mb-3"
                      aria-hidden="true"
                    />
                    <p className="font-medium text-foreground">
                      {t("dashboard:reservations.empty")}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("dashboard:reservations.emptyHint")}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map((res, rowIdx) => {
                const assignedTableName = getAssignedTableName(res);
                return (
                  <tr
                    key={res.id}
                    className="border-b border-border hover:bg-muted/20 transition-colors group"
                    data-ocid={`reservations.item.${rowIdx + 1}`}
                  >
                    <td className="px-4 py-3 text-foreground whitespace-nowrap text-sm">
                      {formatDate(res.date)}
                    </td>
                    <td className="px-4 py-3 text-foreground whitespace-nowrap tabular-nums font-medium">
                      {res.time}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${AVATAR_COLOR[res.status] ?? "bg-muted text-muted-foreground"}`}
                        >
                          <span className="text-xs font-bold">
                            {res.guestName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <button
                            type="button"
                            className="text-sm font-semibold text-foreground truncate hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline text-left"
                            onClick={() => onView(res)}
                            aria-label={t(
                              "dashboard:reservations.actions.view",
                              { name: res.guestName },
                            )}
                          >
                            {res.guestName}
                          </button>
                          <p className="text-xs text-muted-foreground truncate">
                            {res.guestEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground text-center tabular-nums font-medium">
                      {res.partySize}
                    </td>

                    {/* Table column — quick assign button */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {assignedTableName ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAssignTarget(res);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-medium text-foreground bg-muted px-2 py-1 rounded-md hover:bg-primary/10 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              aria-label={tooltipAssign}
                              data-ocid={`reservations.assign_button.${rowIdx + 1}`}
                            >
                              {assignedTableName}
                              <Pencil className="h-2.5 w-2.5 opacity-60" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAssignTarget(res);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground border border-dashed border-border px-2 py-1 rounded-md hover:border-primary/50 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              aria-label={tooltipAssign}
                              data-ocid={`reservations.assign_button.${rowIdx + 1}`}
                            >
                              <Plus className="h-2.5 w-2.5" />
                              {lang === "en"
                                ? "Table"
                                : lang === "fr"
                                  ? "Table"
                                  : "Tafel"}
                            </button>
                          )}
                        </TooltipTrigger>
                        <TooltipContent>{tooltipAssign}</TooltipContent>
                      </Tooltip>
                    </td>

                    <td className="px-4 py-3 text-muted-foreground truncate max-w-[140px] hidden md:table-cell text-xs">
                      {res.experienceName ? (
                        <span className="text-purple-400">
                          ✨ {res.experienceName}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={res.status}
                        onValueChange={(val) =>
                          onStatusChange(res.id, val as ReservationStatus)
                        }
                      >
                        <SelectTrigger
                          className="h-7 text-xs border-border bg-transparent w-auto min-w-[130px] focus:ring-1 focus:ring-primary"
                          data-ocid={`reservations.status_dropdown.${rowIdx + 1}`}
                          aria-label={`Status voor ${res.guestName}`}
                        >
                          <SelectValue>
                            <StatusBadge status={res.status} />
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border z-50">
                          {ALL_STATUSES.map((s) => (
                            <SelectItem
                              key={s}
                              value={s}
                              className="text-foreground focus:bg-muted text-xs"
                            >
                              {STATUS_LABELS_NL[s] ?? s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-0.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                              onClick={(e) => {
                                e.stopPropagation();
                                onView(res);
                              }}
                              aria-label={t(
                                "dashboard:reservations.actions.view",
                                { name: res.guestName },
                              )}
                              data-ocid={`reservations.view_button.${rowIdx + 1}`}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Bekijken</TooltipContent>
                        </Tooltip>

                        {res.status !== "cancelled" &&
                          res.status !== "completed" &&
                          res.status !== "seated" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-primary/70 hover:text-primary hover:bg-primary/10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onCheckIn(res);
                                  }}
                                  aria-label={t(
                                    "dashboard:reservations.actions.checkIn",
                                    { name: res.guestName },
                                  )}
                                  data-ocid={`reservations.checkin_button.${rowIdx + 1}`}
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Inchecken</TooltipContent>
                            </Tooltip>
                          )}

                        {res.status !== "cancelled" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCancel(res);
                                }}
                                aria-label={t(
                                  "dashboard:reservations.actions.cancel",
                                  { name: res.guestName },
                                )}
                                data-ocid={`reservations.cancel_button.${rowIdx + 1}`}
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Annuleren</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table assignment overlay */}
      <TableAssignmentOverlay
        reservation={assignTarget}
        open={assignTarget !== null}
        onClose={() => setAssignTarget(null)}
      />
    </TooltipProvider>
  );
}
