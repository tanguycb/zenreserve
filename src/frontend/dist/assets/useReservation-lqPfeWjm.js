import { x as useActor, y as useQuery, i as useQueryClient, z as useMutation, an as ReservationStatus, A as createActor } from "./index-OyrOOjf2.js";
function mapBackendReservation(r) {
  return {
    id: r.id,
    guestId: r.guestId,
    guestName: "",
    guestEmail: "",
    date: r.date,
    time: r.time,
    partySize: Number(r.partySize),
    status: r.status,
    experienceId: r.experienceId ?? void 0,
    specialRequests: r.specialRequests ?? void 0,
    stripePaymentIntentId: r.stripePaymentIntentId ?? void 0,
    createdAt: new Date(Number(r.createdAt) / 1e6).toISOString(),
    updatedAt: new Date(Number(r.createdAt) / 1e6).toISOString()
  };
}
function useAvailableSlots(date, partySize) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["availableSlots", date, partySize],
    queryFn: async () => {
      if (!actor) return [];
      const slots = await actor.getAvailableSlots(date);
      return slots.map((s) => ({
        time: s.time,
        available: s.status !== "full",
        capacity: Number(s.totalSeats),
        booked: Number(s.totalSeats) - Number(s.availableSeats)
      }));
    },
    enabled: !!actor && !isFetching && !!date && partySize > 0
  });
}
function useReservations(date) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["reservations", "all"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const [results, guests] = await Promise.all([
          actor.listReservations(date ? { date } : {}),
          actor.listGuests().catch(() => [])
        ]);
        const guestMap = {};
        for (const g of guests) {
          guestMap[g.id] = {
            name: g.name,
            email: g.email,
            phone: g.phone ?? void 0
          };
        }
        return results.map((r) => {
          const guest = guestMap[r.guestId];
          return {
            ...mapBackendReservation(r),
            guestName: (guest == null ? void 0 : guest.name) ?? `Gast (${r.guestId.slice(0, 6)})`,
            guestEmail: (guest == null ? void 0 : guest.email) ?? "",
            guestPhone: guest == null ? void 0 : guest.phone
          };
        });
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useCreateReservation() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
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
        data.notes ?? null
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      const base = mapBackendReservation(result.ok);
      return {
        ...base,
        guestName: data.guestName,
        guestEmail: data.email,
        guestPhone: data.phone,
        notes: data.notes
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["kpis"] });
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    }
  });
}
function useUpdateReservationStatus() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (!actor) return;
      const validBackendStatuses = {
        confirmed: ReservationStatus.confirmed,
        cancelled: ReservationStatus.cancelled,
        seated: ReservationStatus.seated,
        waitlist: ReservationStatus.waitlist,
        departed: ReservationStatus.departed,
        not_arrived: ReservationStatus.not_arrived,
        late: ReservationStatus.late
      };
      const backendStatus = validBackendStatuses[data.status];
      if (backendStatus !== void 0) {
        await actor.updateReservationStatus(data.id, backendStatus);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    }
  });
}
function useKPIs() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
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
          returningGuests: 0
        };
      }
      const kpis = await actor.getKPIs();
      const totalCoversToday = kpis.todayCoversPerService.reduce(
        (sum, [, covers]) => sum + Number(covers),
        0
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
          covers: Number(covers)
        }))
      };
    },
    enabled: !!actor && !isFetching
  });
}
export {
  useReservations as a,
  useCreateReservation as b,
  useUpdateReservationStatus as c,
  useAvailableSlots as d,
  useKPIs as u
};
