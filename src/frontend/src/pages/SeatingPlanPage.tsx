import { FloorPlanCanvas } from "@/components/dashboard/FloorPlanCanvas";
import { TableDetailModal } from "@/components/dashboard/TableDetailModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useReservations } from "@/hooks/useReservation";
import type { Table } from "@/hooks/useSeatingPlan";
import { useFloorState } from "@/hooks/useSeatingPlan";
import { useOpeningHoursConfig } from "@/hooks/useSettings";
import { deriveZoneColor, useZones } from "@/hooks/useZones";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  WifiOff,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// ── Walk-in Banner ─────────────────────────────────────────────────────────────
function WalkinBanner({ onDismiss }: { onDismiss: () => void }) {
  const { t } = useTranslation("dashboard");
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400"
      data-ocid="walkin-banner"
      role="alert"
    >
      <WifiOff className="h-4 w-4 shrink-0" />
      <p className="text-sm font-medium flex-1">{t("seating.walkin.banner")}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="text-xs underline underline-offset-2 hover:no-underline transition-all"
        data-ocid="walkin-banner-dismiss"
      >
        {t("seating.walkin.dismiss")}
      </button>
    </div>
  );
}

// ── Main view-only SeatingPlanPage ─────────────────────────────────────────────
export default function SeatingPlanPage() {
  const { t } = useTranslation(["dashboard", "shared"]);

  // Walk-in mode: detect ?walkin=true in URL unconditionally
  const isWalkinMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("walkin") === "true";
  const [walkinDismissed, setWalkinDismissed] = useState(false);
  const showWalkinBanner = isWalkinMode && !walkinDismissed;

  // Floor state
  const { data: floorState, isLoading } = useFloorState();
  const tables = floorState?.tables ?? [];

  // Day / Service selector
  const todayISO = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayISO);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  );

  const { data: openingHoursConfig } = useOpeningHoursConfig();
  const services = openingHoursConfig?.services ?? [];

  const shiftDate = (delta: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const isToday = selectedDate === todayISO;

  const dateLabelFull = useMemo(() => {
    const d = new Date(selectedDate);
    return d.toLocaleDateString("nl-BE", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }, [selectedDate]);

  const { data: reservationsForDate = [] } = useReservations(selectedDate);

  const activeService = useMemo(() => {
    if (!services.length) return null;
    if (selectedServiceId)
      return services.find((s) => s.id === selectedServiceId) ?? services[0];
    return services[0];
  }, [services, selectedServiceId]);

  const tableStatusOverride = useMemo<Record<string, string>>(() => {
    if (!activeService) return {};
    const overrides: Record<string, string> = {};
    for (const res of reservationsForDate) {
      if (res.status === "cancelled" || res.status === "no_show") continue;
      const resTime = res.time;
      if (
        resTime >= activeService.openTime &&
        resTime < activeService.closeTime
      ) {
        const tableId = (res as typeof res & { tableId?: string }).tableId;
        if (tableId) {
          overrides[tableId] =
            res.status === "seated" ? "occupied" : "reserved";
        }
      }
    }
    return overrides;
  }, [reservationsForDate, activeService]);

  // Zones (for filter tabs)
  const { data: zoneData = [], isLoading: isLoadingZones } = useZones();
  const zones = zoneData.map((z) => z.name);
  const zoneColorMap: Record<string, string> = Object.fromEntries(
    zoneData.map((z) => [z.name, z.color ?? deriveZoneColor(z.name)]),
  );
  const [activeZone, setActiveZone] = useState<string | undefined>(undefined);

  // Table zone map (for canvas display)
  const tableZones: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    for (const tbl of tables) {
      const zone = (tbl as Table & { zone?: string }).zone;
      if (zone) map[tbl.id] = zone;
    }
    return map;
  }, [tables]);

  // Selected table (for reservation popup in non-walk-in mode)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  // Walk-in: clicking a table marks it occupied (uses toast feedback, no dedicated status mutation)
  const handleTableClick = useCallback(
    (table: Table) => {
      if (isWalkinMode) {
        const currentStatus =
          tableStatusOverride[table.id] ?? String(table.status);
        if (currentStatus === "occupied") {
          toast.info(t("seating.walkin.alreadyOccupied", { name: table.name }));
          return;
        }
        toast.success(t("seating.walkin.markedOccupied", { name: table.name }));
        return;
      }
      setSelectedTable(table);
    },
    [isWalkinMode, tableStatusOverride, t],
  );

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="heading-h1" data-ocid="seating-page-title">
            {t("seatingPlan.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isWalkinMode
              ? t("seating.walkin.subtitle")
              : t("seating.viewOnly.subtitle", { count: tables.length })}
          </p>
        </div>
      </div>

      {/* Walk-in banner */}
      {showWalkinBanner && (
        <WalkinBanner onDismiss={() => setWalkinDismissed(true)} />
      )}

      {/* Date + Service controls */}
      <div className="flex items-center gap-2 flex-wrap print:hidden">
        {/* Date selector */}
        <div className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-1 py-0.5">
          <button
            type="button"
            onClick={() => shiftDate(-1)}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
            aria-label={t("seating.datePrev")}
            data-ocid="seating-date-prev"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setSelectedDate(todayISO)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors min-w-[96px] text-center",
              isToday
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-muted/50",
            )}
            aria-label={t("seating.goToToday")}
            data-ocid="seating-date-today"
          >
            {isToday ? t("seating.today") : dateLabelFull}
          </button>
          {!isToday && (
            <span className="text-[10px] text-muted-foreground/60 font-medium leading-none select-none">
              {dateLabelFull}
            </span>
          )}
          <button
            type="button"
            onClick={() => shiftDate(1)}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
            aria-label={t("seating.dateNext")}
            data-ocid="seating-date-next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Service tabs */}
        {services.length > 0 && (
          <div className="flex items-center gap-1 rounded-xl border border-border bg-card px-1 py-0.5">
            {services.map((svc) => {
              const isActive = activeService?.id === svc.id;
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => setSelectedServiceId(svc.id)}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                  data-ocid={`seating-service-${svc.id}`}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full shrink-0",
                      isActive ? "bg-primary" : "bg-muted-foreground/40",
                    )}
                  />
                  {svc.name}
                  <span className="opacity-60">
                    {svc.openTime}–{svc.closeTime}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Zone filter tabs */}
        {tables.length > 0 && (
          <div className="flex items-center gap-1 ml-auto flex-wrap">
            <button
              type="button"
              onClick={() => setActiveZone(undefined)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150",
                !activeZone
                  ? "bg-primary/10 text-primary border-primary/40 shadow-[0_0_8px_rgba(34,197,94,0.2)]"
                  : "border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
              data-ocid="zone-filter-all"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
              {isLoadingZones ? "..." : t("seating.zones.all")}
            </button>
            {zones.map((zone) => {
              const dotColor = zoneColorMap[zone] ?? "#94A3B8";
              const isActive = activeZone === zone;
              return (
                <button
                  key={zone}
                  type="button"
                  onClick={() =>
                    setActiveZone(activeZone === zone ? undefined : zone)
                  }
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150",
                    isActive
                      ? "bg-card text-foreground border-border/80"
                      : "border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                  style={
                    isActive
                      ? {
                          borderColor: `${dotColor}50`,
                          boxShadow: `0 0 8px ${dotColor}30`,
                        }
                      : {}
                  }
                  data-ocid={`zone-filter-${zone}`}
                >
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{
                      background: dotColor,
                      boxShadow: isActive ? `0 0 5px ${dotColor}` : "none",
                    }}
                  />
                  {zone}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Walk-in canvas hint */}
      {isWalkinMode && tables.length > 0 && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/8 border border-amber-500/20"
          data-ocid="walkin-canvas-hint"
        >
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-400/90">
            {t("seating.walkin.clickHint")}
          </p>
        </div>
      )}

      {/* Floor plan canvas — read-only */}
      {isLoading ? (
        <Skeleton className="w-full rounded-2xl" style={{ minHeight: 580 }} />
      ) : tables.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-6 py-12 flex flex-col items-center text-center gap-4"
          data-ocid="seating-empty-state"
        >
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-sm font-semibold text-foreground">
              {t("seatingPlan.noTablesYet")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("seating.viewOnly.noTablesHint")}
            </p>
          </div>
        </div>
      ) : (
        <FloorPlanCanvas
          tables={tables}
          isEditMode={false}
          onTableClick={handleTableClick}
          selectedTableIds={new Set()}
          onSelectionChange={() => {}}
          isBulkMode={false}
          onBulkModeChange={() => {}}
          activeZone={activeZone}
          tableZones={tableZones}
          zoneColors={zoneColorMap}
          tableStatusOverride={tableStatusOverride}
        />
      )}

      {/* Table detail modal (non-walk-in mode only) */}
      {!isWalkinMode && (
        <TableDetailModal
          table={selectedTable}
          isOpen={!!selectedTable}
          isEditMode={false}
          onClose={() => setSelectedTable(null)}
          aiSuggestion={null}
          onAiAccept={() => {}}
          onAiReject={() => {}}
          zone={selectedTable ? tableZones[selectedTable.id] : undefined}
          onZoneChange={() => {}}
        />
      )}
    </div>
  );
}
