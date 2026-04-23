import { createActor } from "@/backend";
import type {
  Experience as BackendExperience,
  Guest as BackendGuest,
  WaitlistEntry as BackendWaitlistEntry,
} from "@/backend.d";
import type { Experience, Guest, WaitlistEntry } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ── Mappers ────────────────────────────────────────────────────────────────────

function mapBackendGuest(g: BackendGuest): Guest {
  const parts = g.name.trim().split(/\s+/);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ");
  return {
    id: g.id,
    firstName,
    lastName,
    email: g.email,
    phone: g.phone ?? undefined,
    tags: g.tags ?? [],
    visitCount: g.reservationIds?.length ?? 0,
    vip: g.tags?.includes("VIP") ?? false,
  };
}

function mapBackendExperience(e: BackendExperience): Experience {
  const tagMap: Record<string, Experience["tag"]> = {
    menu: "menu",
    event: "event",
    special: "special",
  };
  const rawTag = (e as BackendExperience & { tag?: string }).tag;
  const ext = e as BackendExperience & {
    serviceIds?: string[];
    dayOfWeek?: number[];
  };
  return {
    id: e.id,
    name: e.name,
    description: e.description,
    price: Number(e.pricePerPerson),
    available: e.isActive,
    required: e.required,
    tag: rawTag ? (tagMap[rawTag] ?? undefined) : undefined,
    serviceIds: ext.serviceIds ?? [],
    dayOfWeek: ext.dayOfWeek ?? [],
  };
}

function mapBackendWaitlist(w: BackendWaitlistEntry): WaitlistEntry {
  return {
    id: w.id,
    guestId: w.guestId,
    guestName: "",
    guestEmail: "",
    guestPhone: undefined,
    date: w.date,
    preferredTime: w.requestedTime ?? "",
    partySize: Number(w.partySize),
    status: w.status as WaitlistEntry["status"],
    position: 0,
    addedAt: new Date(Number(w.joinedAt) / 1_000_000).toISOString(),
    notes: w.notes ?? undefined,
  };
}

// ── Guests ────────────────────────────────────────────────────────────────────
export function useGuests() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Guest[]>({
    queryKey: ["guests"],
    queryFn: async () => {
      if (!actor) return [];
      const guests = await actor.listGuests();
      return guests.map(mapBackendGuest);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGuest(id: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Guest | null>({
    queryKey: ["guest", id],
    queryFn: async () => {
      if (!actor) return null;
      const g = await actor.getGuest(id);
      if (!g) return null;
      return mapBackendGuest(g);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useSearchGuests(query: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Guest[]>({
    queryKey: ["guests", "search", query],
    queryFn: async () => {
      if (!actor) return [];
      // BUG-028: empty query must not load all guests at once (no pagination)
      if (!query.trim()) return [];
      const results = await actor.searchGuests(query, 100n, 0n);
      return results.guests.map(mapBackendGuest);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateGuest() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, Partial<Guest> & { id: string }>({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      if (data.tags !== undefined) {
        await actor.updateGuestTags(data.id, data.tags);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
  });
}

// ── Experiences ───────────────────────────────────────────────────────────────

/**
 * Soft-deletes an experience by setting isActive=false.
 * The backend has no deleteExperience method; this achieves the same UX result
 * (experience disappears from active list) without data loss.
 */
export function useDeleteExperience() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      // Fetch current experience data, then mark as inactive (soft delete)
      const experiences = await actor.listExperiences();
      const exp = experiences.find((e) => e.id === id);
      if (!exp) throw new Error("Experience not found");
      await actor.updateExperience({
        id: exp.id,
        name: exp.name,
        description: exp.description,
        pricePerPerson: exp.pricePerPerson,
        maxCapacity: exp.maxCapacity,
        isActive: false,
        required: exp.required,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
    },
  });
}

export function useExperiences() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Experience[]>({
    queryKey: ["experiences"],
    queryFn: async () => {
      if (!actor) return [];
      const experiences = await actor.listExperiences();
      return experiences.map(mapBackendExperience);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateExperience() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    Experience,
    Error,
    {
      name: string;
      description: string;
      price: number;
      maxCapacity?: number;
      required?: boolean;
      serviceIds?: string[];
      dayOfWeek?: number[];
    }
  >({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      const e = await actor.createExperience(
        data.name,
        data.description,
        BigInt(data.price),
        BigInt(data.maxCapacity ?? 0),
        data.required ?? false,
        data.serviceIds && data.serviceIds.length > 0 ? data.serviceIds : null,
        data.dayOfWeek && data.dayOfWeek.length > 0
          ? data.dayOfWeek.map(BigInt)
          : null,
      );
      const base = mapBackendExperience(e);
      // Persist service/day restrictions locally until backend supports them
      return {
        ...base,
        serviceIds: data.serviceIds ?? [],
        dayOfWeek: data.dayOfWeek ?? [],
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
    },
  });
}

export function useUpdateExperience() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, Experience>({
    mutationFn: async (exp) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateExperience({
        id: exp.id,
        name: exp.name,
        description: exp.description,
        pricePerPerson: BigInt(exp.price),
        // BUG-019: use actual maxCapacity, not hardcoded 0
        maxCapacity: BigInt(
          (exp as Experience & { maxCapacity?: number }).maxCapacity ?? 0,
        ),
        isActive: exp.available,
        required: exp.required,
      });
      // serviceIds and dayOfWeek are stored in query cache optimistically
      // until backend API is extended to support them
    },
    onSuccess: (_data, exp) => {
      // Optimistically update the experience in cache to preserve serviceIds/dayOfWeek
      queryClient.setQueryData<Experience[]>(["experiences"], (old) =>
        old
          ? old.map((e) =>
              e.id === exp.id
                ? {
                    ...e,
                    ...exp,
                    serviceIds: exp.serviceIds ?? e.serviceIds ?? [],
                    dayOfWeek: exp.dayOfWeek ?? e.dayOfWeek ?? [],
                  }
                : e,
            )
          : old,
      );
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
    },
  });
}

// ── Waitlist ──────────────────────────────────────────────────────────────────
export function useWaitlist(date?: string) {
  const { actor, isFetching } = useActor(createActor);
  const today = new Date().toISOString().split("T")[0];
  const targetDate = date ?? today;
  return useQuery<WaitlistEntry[]>({
    queryKey: ["waitlist", targetDate],
    queryFn: async () => {
      if (!actor) return [];
      // BUG-017: fetch waitlist and guests in parallel, then enrich with names/emails
      const [entries, guests] = await Promise.all([
        actor.getWaitlist(targetDate),
        actor.listGuests().catch(() => [] as BackendGuest[]),
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
      return entries.map((w, idx) => {
        const guest = guestMap[w.guestId];
        return {
          ...mapBackendWaitlist(w),
          guestName: guest?.name ?? `Gast ${idx + 1}`,
          guestEmail: guest?.email ?? "",
          guestPhone: guest?.phone,
          position: idx + 1,
        };
      });
    },
    enabled: !!actor && !isFetching,
  });
}

export function useNotifyWaitlistGuest() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      await actor.offerWaitlistSpot(data.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
    },
  });
}

export function useOfferWaitlistSpot() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      await actor.offerWaitlistSpot(data.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
    },
  });
}

export function useReofferWaitlistSpot() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.reofferWaitlistSpot(data.id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
    },
  });
}

export function useRemoveWaitlistEntry() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.removeWaitlistEntry(data.id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
    },
  });
}

interface UpdateWaitlistPayload {
  id: string;
  partySize: number;
  notes?: string;
}

export function useUpdateWaitlistEntry() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, UpdateWaitlistPayload>({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.updateWaitlistEntry(
        data.id,
        BigInt(data.partySize),
        data.notes ?? null,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
    },
  });
}

interface AddToWaitlistPayload {
  /** Provide guestId directly, or provide guestName + guestPhone to find/create */
  guestId?: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  partySize: number;
  date: string;
  requestedTime?: string;
  notes?: string;
}

export function useAddToWaitlist() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, AddToWaitlistPayload>({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      let guestId = data.guestId;
      if (!guestId) {
        const name = data.guestName ?? "";
        const existing = await actor.searchGuests(name || "", 10n, 0n);
        if (existing.guests.length > 0) {
          guestId = existing.guests[0].id;
        } else {
          const guest = await actor.createGuest(
            name,
            data.guestEmail ?? "",
            data.guestPhone ?? null,
          );
          guestId = guest.id;
        }
      }
      const waitlistResult = await actor.addToWaitlist(
        guestId,
        data.date,
        BigInt(data.partySize),
        data.requestedTime ?? null,
        data.notes ?? null,
      );
      if (waitlistResult.__kind__ === "err")
        throw new Error(waitlistResult.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
  });
}
