import { createActor } from "@/backend";
import { ReservationStatus as BackendReservationStatus } from "@/backend";
import type { Reservation as BackendReservation } from "@/backend.d.ts";
import type { KPIs, Reservation, TimeSlot } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ReservationChange {
  id: string;
  reservationId: string;
  changedAt: string; // ISO string
  changedBy: string; // principal or display name
  changedByName?: string;
  field: string;
  oldValue: string;
  newValue: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function mapBackendReservation(r: BackendReservation): Reservation {
  return {
    id: r.id,
    guestId: r.guestId,
    guestName: "",
    guestEmail: "",
    date: r.date,
    time: r.time,
    partySize: Number(r.partySize),
    status: r.status as Reservation["status"],
    experienceId: r.experienceId ?? undefined,
    specialRequests: r.specialRequests ?? undefined,
    stripePaymentIntentId: r.stripePaymentIntentId ?? undefined,
    createdAt: new Date(Number(r.createdAt) / 1_000_000).toISOString(),
    updatedAt: new Date(Number(r.updatedAt) / 1_000_000).toISOString(),
  };
}

// ── Available Slots ────────────────────────────────────────────────────────────
export function useAvailableSlots(date: string, partySize: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TimeSlot[]>({
    queryKey: ["availableSlots", date, partySize],
    queryFn: async () => {
      if (!actor) return [];
      const { slots } = await actor.getAvailableSlots(date);
      return slots.map((s) => ({
        time: s.time,
        available: s.status !== "full",
        capacity: Number(s.totalSeats),
        booked: Number(s.totalSeats) - Number(s.availableSeats),
      }));
    },
    enabled: !!actor && !isFetching && !!date && partySize > 0,
  });
}

// ── List Reservations ─────────────────────────────────────────────────────────
export function useReservations(date?: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Reservation[]>({
    queryKey: ["reservations", date ?? "all"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        // Fetch reservations and guests in parallel for name/email enrichment
        const [rawResult, guests] = await Promise.all([
          actor.listReservations(date ? { date } : {}),
          actor.listGuests().catch(() => []),
        ]);
        const results = rawResult.__kind__ === "ok" ? rawResult.ok : [];
        const guestMap: Record<
          string,
          { name: string; email: string; phone?: string }
        > = {};
        for (const g of guests) {
          guestMap[g.id] = {
            name: g.name,
            email: g.email,
            phone: g.phone ?? undefined,
          };
        }
        return results.map((r) => {
          const guest = guestMap[r.guestId];
          return {
            ...mapBackendReservation(r),
            guestName: guest?.name ?? `Gast (${r.guestId.slice(0, 6)})`,
            guestEmail: guest?.email ?? "",
            guestPhone: guest?.phone,
          };
        });
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ── Get Single Reservation ────────────────────────────────────────────────────
export function useReservation(id: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Reservation | null>({
    queryKey: ["reservation", id],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getReservation(id);
      if (!r) return null;
      return mapBackendReservation(r);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

// ── Create Reservation ────────────────────────────────────────────────────────
export function useCreateReservation() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    Reservation,
    Error,
    {
      guestName: string;
      phone: string;
      email: string;
      partySize: number;
      date: string;
      time: string;
      tableId?: string;
      notes?: string;
      experienceId?: string;
    }
  >({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.createReservationWithDetails(
        data.guestName,
        data.phone,
        data.email,
        BigInt(data.partySize),
        data.date,
        data.time,
        data.tableId ?? null,
        data.notes ?? null,
        data.experienceId ?? null,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      const base = mapBackendReservation(result.ok);
      return {
        ...base,
        guestName: data.guestName,
        guestEmail: data.email,
        guestPhone: data.phone,
        notes: data.notes,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["kpis"] });
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    },
    onError: (error: Error) => {
      if (error.message === "RATE_LIMIT_DASHBOARD") {
        toast.error(
          "Limiet bereikt: max 2 reserveringen per minuut. Probeer het over een minuut opnieuw.",
          { duration: 6000 },
        );
      }
    },
  });
}

// ── Update Reservation ────────────────────────────────────────────────────────
export function useUpdateReservation() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    Reservation,
    Error,
    {
      id: string;
      date?: string;
      time?: string;
      partySize?: number;
      specialRequests?: string;
      notes?: string;
      status?: Reservation["status"];
      experienceId?: string;
      tableId?: string;
    }
  >({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");

      // Get current reservation to fill in any missing fields
      const current = await actor.getReservation(data.id);
      if (!current) throw new Error("Reservering niet gevonden");

      const date = data.date ?? current.date;
      const time = data.time ?? current.time;
      const partySize = data.partySize ?? Number(current.partySize);
      const specialRequests =
        data.specialRequests ?? current.specialRequests ?? null;
      const notes = data.notes ?? current.notes ?? null;
      const experienceId = data.experienceId ?? current.experienceId ?? null;
      const tableId = data.tableId ?? null;

      // Map frontend status string to BackendReservationStatus enum
      const validBackendStatusMap: Partial<
        Record<string, BackendReservationStatus>
      > = {
        confirmed: BackendReservationStatus.confirmed,
        cancelled: BackendReservationStatus.cancelled,
        seated: BackendReservationStatus.seated,
        waitlist: BackendReservationStatus.waitlist,
        departed: BackendReservationStatus.departed,
        not_arrived: BackendReservationStatus.not_arrived,
        late: BackendReservationStatus.late,
      };
      const newStatus = data.status
        ? (validBackendStatusMap[data.status] ?? null)
        : null;

      const result = await actor.updateReservation(
        data.id,
        date,
        time,
        BigInt(partySize),
        specialRequests,
        newStatus,
        experienceId,
        notes,
        tableId,
      );
      if (result.__kind__ === "err") throw new Error(result.err);

      return {
        ...mapBackendReservation(result.ok),
        status: (data.status ?? result.ok.status) as Reservation["status"],
      };
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({
        queryKey: ["reservationChanges", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    },
  });
}

// ── Update Reservation Status ─────────────────────────────────────────────────
export function useUpdateReservationStatus() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { id: string; status: Reservation["status"] }
  >({
    mutationFn: async (data) => {
      if (!actor) return; // Optimistic-only if no actor
      // Map frontend status values to backend enum (only supported statuses)
      const validBackendStatuses: Partial<
        Record<string, BackendReservationStatus>
      > = {
        confirmed: BackendReservationStatus.confirmed,
        cancelled: BackendReservationStatus.cancelled,
        seated: BackendReservationStatus.seated,
        waitlist: BackendReservationStatus.waitlist,
        departed: BackendReservationStatus.departed,
        not_arrived: BackendReservationStatus.not_arrived,
        late: BackendReservationStatus.late,
      };
      const backendStatus = validBackendStatuses[data.status];
      if (backendStatus !== undefined) {
        await actor.updateReservationStatus(data.id, backendStatus);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    },
  });
}

// ── Reservation Change History ────────────────────────────────────────────────
export function useReservationChanges(reservationId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ReservationChange[]>({
    queryKey: ["reservationChanges", reservationId],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getReservationChanges(reservationId);
        if (result.__kind__ === "err") return [];
        return result.ok.map((c) => ({
          id: c.id,
          reservationId,
          changedAt: new Date(Number(c.timestamp) / 1_000_000).toISOString(),
          changedBy: c.changedBy,
          changedByName: c.changedByName,
          field: c.field,
          oldValue: c.oldValue,
          newValue: c.newValue,
        }));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!reservationId,
    staleTime: 30_000,
  });
}

// ── KPIs ──────────────────────────────────────────────────────────────────────
export function useKPIs() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<KPIs>({
    queryKey: ["kpis"],
    queryFn: async () => {
      if (!actor) {
        return {
          todayReservations: 0,
          todayCovers: 0,
          weekReservations: 0,
          weekCovers: 0,
          monthReservations: 0,
          monthRevenue: 0,
          avgPartySize: 0,
          cancellationRate: 0,
          waitlistCount: 0,
          newGuests: 0,
          returningGuests: 0,
        };
      }
      // Fetch KPIs and all reservations in parallel to compute derived metrics
      const emptyArr: import("@/backend.d.ts").Reservation[] = [];
      const [kpis, rawResult] = await Promise.all([
        actor.getKPIs(),
        actor
          .listReservations({})
          .catch(() => ({ __kind__: "ok" as const, ok: emptyArr })),
      ]);

      const reservations =
        rawResult.__kind__ === "ok" ? rawResult.ok : emptyArr;

      const now = Date.now();
      const msPerDay = 86_400_000;
      const weekAgo = now - 7 * msPerDay;
      const monthAgo = now - 30 * msPerDay;

      let weekRes = 0;
      let weekCovers = 0;
      let monthRes = 0;
      let cancelledCount = 0;
      const guestReservationCount: Record<string, number> = {};

      for (const r of reservations) {
        // createdAt is nanoseconds bigint
        const ts = Number(r.createdAt) / 1_000_000;
        const ps = Number(r.partySize);

        if (ts >= weekAgo) {
          weekRes += 1;
          weekCovers += ps;
        }
        if (ts >= monthAgo) {
          monthRes += 1;
        }
        if ((r.status as string) === "cancelled") {
          cancelledCount += 1;
        }
        guestReservationCount[r.guestId] =
          (guestReservationCount[r.guestId] ?? 0) + 1;
      }

      const totalCount = reservations.length;
      const cancellationRate =
        totalCount > 0 ? Math.round((cancelledCount / totalCount) * 100) : 0;

      const newGuests = Object.values(guestReservationCount).filter(
        (c) => c === 1,
      ).length;
      const returningGuests = Object.values(guestReservationCount).filter(
        (c) => c >= 2,
      ).length;

      const totalCoversToday = kpis.todayCoversPerService.reduce(
        (sum, [, covers]) => sum + Number(covers),
        0,
      );

      return {
        todayReservations: Number(kpis.todayReservationCount),
        todayCovers: totalCoversToday,
        weekReservations: weekRes,
        weekCovers,
        monthReservations: monthRes,
        monthRevenue: 0,
        avgPartySize: Number(kpis.avgPartySize),
        cancellationRate,
        // BUG-012: read real waitlistCount from backend KPIs
        waitlistCount: Number(kpis.waitlistCount),
        newGuests,
        returningGuests,
        coversPerService: kpis.todayCoversPerService.map(([name, covers]) => ({
          name,
          covers: Number(covers),
        })),
      } as KPIs & { coversPerService: { name: string; covers: number }[] };
    },
    enabled: !!actor && !isFetching,
  });
}
