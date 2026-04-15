import { createActor } from "@/backend";
import { ReservationStatus as BackendReservationStatus } from "@/backend";
import type { Reservation as BackendReservation } from "@/backend.d.ts";
import type { KPIs, Reservation, TimeSlot } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    updatedAt: new Date(Number(r.createdAt) / 1_000_000).toISOString(),
  };
}

// ── Available Slots ────────────────────────────────────────────────────────────
export function useAvailableSlots(date: string, partySize: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TimeSlot[]>({
    queryKey: ["availableSlots", date, partySize],
    queryFn: async () => {
      if (!actor) return [];
      const slots = await actor.getAvailableSlots(date);
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
        const [results, guests] = await Promise.all([
          actor.listReservations(date ? { date } : {}),
          actor.listGuests().catch(() => []),
        ]);
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
      date: string;
      time: string;
      partySize: number;
      specialRequests?: string;
    }
  >({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.updateReservation(
        data.id,
        data.date,
        data.time,
        BigInt(data.partySize),
        data.specialRequests ?? null,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return mapBackendReservation(result.ok);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
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
      const kpis = await actor.getKPIs();
      const totalCoversToday = kpis.todayCoversPerService.reduce(
        (sum, [, covers]) => sum + Number(covers),
        0,
      );
      return {
        todayReservations: Number(kpis.todayReservationCount),
        todayCovers: totalCoversToday,
        weekReservations: 0,
        weekCovers: 0,
        monthReservations: 0,
        monthRevenue: 0,
        avgPartySize: Number(kpis.avgPartySize),
        cancellationRate: 0,
        waitlistCount: 0,
        newGuests: 0,
        returningGuests: 0,
        coversPerService: kpis.todayCoversPerService.map(([name, covers]) => ({
          name,
          covers: Number(covers),
        })),
      } as KPIs & { coversPerService: { name: string; covers: number }[] };
    },
    enabled: !!actor && !isFetching,
  });
}
