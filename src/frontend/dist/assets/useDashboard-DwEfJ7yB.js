import { v as useActor, w as useQuery, h as useQueryClient, x as useMutation, y as createActor } from "./index-DYFUyfbw.js";
function mapBackendGuest(g) {
  var _a, _b;
  const parts = g.name.trim().split(/\s+/);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ");
  return {
    id: g.id,
    firstName,
    lastName,
    email: g.email,
    phone: g.phone ?? void 0,
    tags: g.tags ?? [],
    visitCount: ((_a = g.reservationIds) == null ? void 0 : _a.length) ?? 0,
    vip: ((_b = g.tags) == null ? void 0 : _b.includes("VIP")) ?? false
  };
}
function mapBackendExperience(e) {
  const tagMap = {
    menu: "menu",
    event: "event",
    special: "special"
  };
  const rawTag = e.tag;
  return {
    id: e.id,
    name: e.name,
    description: e.description,
    price: Number(e.pricePerPerson),
    available: e.isActive,
    tag: rawTag ? tagMap[rawTag] ?? void 0 : void 0
  };
}
function mapBackendWaitlist(w) {
  return {
    id: w.id,
    guestId: w.guestId,
    guestName: "",
    guestEmail: "",
    guestPhone: void 0,
    date: w.date,
    preferredTime: w.requestedTime ?? "",
    partySize: Number(w.partySize),
    status: w.status === "offered" ? "notified" : w.status,
    position: 0,
    addedAt: new Date(Number(w.joinedAt) / 1e6).toISOString(),
    notes: w.notes ?? void 0
  };
}
function useGuests() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["guests"],
    queryFn: async () => {
      if (!actor) return [];
      const guests = await actor.listGuests();
      return guests.map(mapBackendGuest);
    },
    enabled: !!actor && !isFetching
  });
}
function useUpdateGuest() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      if (data.tags !== void 0) {
        await actor.updateGuestTags(data.id, data.tags);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    }
  });
}
function useExperiences() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      if (!actor) return [];
      const experiences = await actor.listExperiences();
      return experiences.map(mapBackendExperience);
    },
    enabled: !!actor && !isFetching
  });
}
function useWaitlist(date) {
  const { actor, isFetching } = useActor(createActor);
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const targetDate = date ?? today;
  return useQuery({
    queryKey: ["waitlist", targetDate],
    queryFn: async () => {
      if (!actor) return [];
      const entries = await actor.getWaitlist(targetDate);
      return entries.map(mapBackendWaitlist);
    },
    enabled: !!actor && !isFetching
  });
}
function useOfferWaitlistSpot() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      await actor.offerWaitlistSpot(data.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
    }
  });
}
function useReofferWaitlistSpot() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.reofferWaitlistSpot(data.id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
    }
  });
}
function useRemoveWaitlistEntry() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.removeWaitlistEntry(data.id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
    }
  });
}
function useUpdateWaitlistEntry() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.updateWaitlistEntry(
        data.id,
        BigInt(data.partySize),
        data.notes ?? null
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
    }
  });
}
function useAddToWaitlist() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      let guestId = data.guestId;
      if (!guestId) {
        const name = data.guestName ?? "";
        const existing = await actor.searchGuests(name);
        if (existing.length > 0) {
          guestId = existing[0].id;
        } else {
          const guest = await actor.createGuest(
            name,
            data.guestEmail ?? "",
            data.guestPhone ?? null
          );
          guestId = guest.id;
        }
      }
      await actor.addToWaitlist(
        guestId,
        data.date,
        BigInt(data.partySize),
        data.requestedTime ?? null,
        data.notes ?? null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    }
  });
}
export {
  useUpdateGuest as a,
  useExperiences as b,
  useUpdateWaitlistEntry as c,
  useAddToWaitlist as d,
  useWaitlist as e,
  useOfferWaitlistSpot as f,
  useReofferWaitlistSpot as g,
  useRemoveWaitlistEntry as h,
  useGuests as u
};
