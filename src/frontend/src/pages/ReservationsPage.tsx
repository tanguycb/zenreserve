import { MiniFloorPlan } from "@/components/dashboard/MiniFloorPlan";
import { NewReservationModal } from "@/components/dashboard/NewReservationModal";
import { ReservationCalendar } from "@/components/dashboard/ReservationCalendar";
import { ReservationDetailModal } from "@/components/dashboard/ReservationDetailModal";
import type { ActiveFilters } from "@/components/dashboard/ReservationFilters";
import { ReservationFilters } from "@/components/dashboard/ReservationFilters";
import { ReservationList } from "@/components/dashboard/ReservationList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useReservations,
  useUpdateReservation,
  useUpdateReservationStatus,
} from "@/hooks/useReservation";
import { useOpeningHoursConfig } from "@/hooks/useSettings";
import type { Reservation, ReservationStatus } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarDays, List, Plus, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type ViewMode = "calendar" | "list";
type DateRange = "today" | "week" | "next7";

/** Compute today's date string in LOCAL time (avoids UTC off-by-one issues) */
function localTodayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse "HH:MM" → minutes since midnight */
function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/** Check if a reservation time falls within a service window */
function matchesService(time: string, service: string): boolean {
  if (service === "all") return true;
  const mins = timeToMinutes(time);
  if (service === "lunch") return mins >= 11 * 60 && mins < 15 * 60;
  if (service === "dinner") return mins >= 17 * 60 && mins < 23 * 60;
  return true;
}

function getDateBounds(range: DateRange): { start: string; end: string } {
  const today = localTodayString();
  const now = new Date();

  if (range === "today") {
    return { start: today, end: today };
  }
  if (range === "week") {
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const mon = new Date(now);
    mon.setDate(now.getDate() + diff);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    function toLocal(d: Date) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day2 = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day2}`;
    }
    return { start: toLocal(mon), end: toLocal(sun) };
  }
  // next7
  const end = new Date(now);
  end.setDate(now.getDate() + 6);
  function toLocal(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day2 = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day2}`;
  }
  return { start: today, end: toLocal(end) };
}

export default function ReservationsPage() {
  const { t } = useTranslation(["dashboard"]);
  const queryClient = useQueryClient();
  const {
    data: allReservations = [],
    isLoading,
    isFetching,
  } = useReservations();
  const { data: openingHours } = useOpeningHoursConfig();
  const updateStatus = useUpdateReservationStatus();
  const updateReservation = useUpdateReservation();

  const [view, setView] = useState<ViewMode>("calendar");
  const [dateRange, setDateRange] = useState<DateRange>("today");
  const [filters, setFilters] = useState<ActiveFilters>({
    date: "",
    status: "all",
    search: "",
    service: "all",
  });
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [localOverrides, setLocalOverrides] = useState<
    Record<string, ReservationStatus>
  >({});

  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null);

  // Merge backend data with local optimistic status overrides
  const reservations = useMemo(() => {
    return allReservations.map((r) =>
      localOverrides[r.id] ? { ...r, status: localOverrides[r.id] } : r,
    );
  }, [allReservations, localOverrides]);

  const bounds = getDateBounds(dateRange);
  const TODAY = localTodayString();

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      const dateToCheck = filters.date || null;
      if (dateToCheck) {
        if (r.date !== dateToCheck) return false;
      } else {
        if (r.date < bounds.start || r.date > bounds.end) return false;
      }
      if (filters.status !== "all" && r.status !== filters.status) return false;
      if (!matchesService(r.time, filters.service)) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !r.guestName.toLowerCase().includes(q) &&
          !(r.guestEmail ?? "").toLowerCase().includes(q)
        )
          return false;
      }
      if (selectedTable !== null) {
        if (String(r.tableNumber) !== selectedTable) return false;
      }
      return true;
    });
  }, [reservations, filters, bounds, selectedTable]);

  const todayCount = useMemo(
    () =>
      reservations.filter((r) => r.date === TODAY && r.status !== "cancelled")
        .length,
    [reservations, TODAY],
  );

  function openDetail(r: Reservation) {
    setSelectedReservation(r);
    setDetailOpen(true);
  }

  function openNew() {
    setEditingReservation(null);
    setNewModalOpen(true);
  }

  function handleReservationSaved(_saved: Reservation) {
    queryClient.invalidateQueries({ queryKey: ["reservations"] });
    queryClient.invalidateQueries({ queryKey: ["floorState"] });
  }

  function handleStatusChange(id: string, status: ReservationStatus) {
    setLocalOverrides((prev) => ({ ...prev, [id]: status }));
    if (selectedReservation?.id === id) {
      setSelectedReservation((prev) => (prev ? { ...prev, status } : prev));
    }
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => {
          setLocalOverrides((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        },
        onError: () => {
          setLocalOverrides((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
          toast.error(t("dashboard:reservations.statusError"));
        },
      },
    );
  }

  function handleCheckIn(r: Reservation) {
    handleStatusChange(r.id, "seated");
    toast.success(t("dashboard:reservations.checkedIn", { name: r.guestName }));
  }

  function handleCancel(r: Reservation) {
    handleStatusChange(r.id, "cancelled");
    toast.success(t("dashboard:reservations.cancelled", { name: r.guestName }));
  }

  function handleSaveNotes(id: string, notes: string) {
    const reservation = allReservations.find((r) => r.id === id);
    if (!reservation) return;
    updateReservation.mutate(
      {
        id,
        date: reservation.date,
        time: reservation.time,
        partySize: reservation.partySize,
        specialRequests: notes,
      },
      {
        onSuccess: () => toast.success(t("dashboard:reservations.notesSaved")),
        onError: () => toast.error(t("dashboard:reservations.statusError")),
      },
    );
  }

  /**
   * Called when a service pill is clicked in the monthly calendar.
   * Switches to list view, filtered to the given date and (if possible) service.
   */
  function handleCalendarDayService(date: string, serviceId: string) {
    // Find the service to determine a service filter value
    const services = openingHours?.services ?? [];
    const service = services.find((s) => s.id === serviceId);

    // Map service name to a filter keyword (fallback to "all")
    let serviceFilter = "all";
    if (service) {
      const nameLower = service.name.toLowerCase();
      if (nameLower.includes("lunch")) serviceFilter = "lunch";
      else if (nameLower.includes("diner") || nameLower.includes("dinner"))
        serviceFilter = "dinner";
    }

    setView("list");
    setFilters((f) => ({
      ...f,
      date,
      service: serviceFilter,
      status: "all",
      search: "",
    }));
    setDateRange("today"); // reset range so date filter takes precedence
    setSelectedTable(null);
  }

  const DATE_RANGE_LABELS: Record<DateRange, string> = {
    today: t("dashboard:reservations.filterToday"),
    week: t("dashboard:reservations.filterThisWeek"),
    next7: t("dashboard:reservations.filterNext7"),
  };

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {t("dashboard:reservations.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("dashboard:reservations.total", { count: reservations.length })}{" "}
            ·{" "}
            <span className="text-primary font-medium">
              {todayCount}{" "}
              {t("dashboard:reservations.filterToday").toLowerCase()}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["reservations"] })
            }
            disabled={isFetching}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Vernieuwen"
            data-ocid="refresh-reservations"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md rounded-xl"
            data-ocid="new-reservation-btn"
            aria-label={t("dashboard:reservations.newReservation")}
            onClick={openNew}
          >
            <Plus className="h-4 w-4" />
            {t("dashboard:reservations.newReservation")}
          </Button>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setView("calendar")}
          data-ocid="toggle-calendar"
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            view === "calendar"
              ? "bg-gradient-to-r from-card to-background text-foreground border border-primary/30 shadow-md"
              : "bg-muted/40 text-muted-foreground border border-border hover:bg-muted hover:text-foreground"
          }`}
          aria-pressed={view === "calendar"}
        >
          <CalendarDays className="h-4 w-4" />
          {t("dashboard:reservations.tabCalendar")}
        </button>
        <button
          type="button"
          onClick={() => setView("list")}
          data-ocid="toggle-list"
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            view === "list"
              ? "bg-gradient-to-r from-card to-background text-foreground border border-primary/30 shadow-md"
              : "bg-muted/40 text-muted-foreground border border-border hover:bg-muted hover:text-foreground"
          }`}
          aria-pressed={view === "list"}
        >
          <List className="h-4 w-4" />
          {t("dashboard:reservations.tabList")}
        </button>
      </div>

      {/* Filter bar (list mode only) */}
      {view === "list" && (
        <div className="rounded-2xl bg-card border border-border shadow-sm p-4">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {(["today", "week", "next7"] as DateRange[]).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => {
                  setDateRange(range);
                  setFilters((f) => ({ ...f, date: "" }));
                }}
                data-ocid={`date-range-${range}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  dateRange === range && !filters.date
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
                }`}
              >
                {DATE_RANGE_LABELS[range]}
              </button>
            ))}
            {filters.date && (
              <button
                type="button"
                onClick={() => setFilters((f) => ({ ...f, date: "" }))}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30 transition-colors"
                data-ocid="clear-date-filter"
              >
                {filters.date} ×
              </button>
            )}
            {selectedTable && (
              <button
                type="button"
                onClick={() => setSelectedTable(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30 transition-colors"
                data-ocid="clear-table-filter"
              >
                Tafel {selectedTable} ×
              </button>
            )}
          </div>
          <ReservationFilters filters={filters} onChange={setFilters} />
        </div>
      )}

      {/* Mini floor plan (list mode only) */}
      {view === "list" && (
        <MiniFloorPlan
          reservations={filtered}
          selectedTable={selectedTable}
          onSelectTable={(tableId) =>
            setSelectedTable((prev) => (prev === tableId ? null : tableId))
          }
        />
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="rounded-2xl bg-card border border-border shadow-sm p-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Calendar or List */}
      {!isLoading &&
        (view === "calendar" ? (
          <div className="rounded-2xl bg-card border border-border shadow-sm p-4">
            <ReservationCalendar
              reservations={reservations}
              onSelectReservation={openDetail}
              onSelectDayService={handleCalendarDayService}
            />
          </div>
        ) : (
          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <ReservationList
              reservations={filtered}
              isLoading={isLoading}
              onView={openDetail}
              onCheckIn={handleCheckIn}
              onCancel={handleCancel}
              onStatusChange={handleStatusChange}
            />
          </div>
        ))}

      {/* Detail Modal */}
      <ReservationDetailModal
        reservation={selectedReservation}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onCheckIn={handleCheckIn}
        onCancel={handleCancel}
        onSaveNotes={handleSaveNotes}
        onStatusChange={handleStatusChange}
      />

      {/* New / Edit Reservation Modal */}
      <NewReservationModal
        open={newModalOpen}
        onClose={() => {
          setNewModalOpen(false);
          setEditingReservation(null);
        }}
        reservation={editingReservation}
        onReservationSaved={handleReservationSaved}
      />
    </div>
  );
}
