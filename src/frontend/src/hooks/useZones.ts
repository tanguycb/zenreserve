import { createActor } from "@/backend";
import type { Zone } from "@/hooks/useSettings";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Zones are stored inside extendedConfig.zones as ZoneCapacity[].
// We extend the base Zone type to include a UI-only color field.
export interface ZoneWithColor extends Zone {
  color: string;
}

type MutationCtx = { previous: ZoneWithColor[] | undefined };

const DEFAULT_COLORS = [
  "#22C55E",
  "#EAB308",
  "#3B82F6",
  "#A855F7",
  "#0EA5E9",
  "#F97316",
  "#EC4899",
  "#14B8A6",
];

/**
 * Derive a deterministic color from the zone name.
 * This way "Binnen" always gets the same color regardless of position.
 */
export function deriveZoneColor(zoneName: string): string {
  let hash = 0;
  for (let i = 0; i < zoneName.length; i++) {
    hash = (hash * 31 + zoneName.charCodeAt(i)) >>> 0;
  }
  return DEFAULT_COLORS[hash % DEFAULT_COLORS.length];
}

// ── Queries ───────────────────────────────────────────────────────────────────

export function useZones() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ZoneWithColor[]>({
    queryKey: ["zones"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getExtendedConfig();
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok.zones.map((z) => ({
        id: z.zoneName,
        name: z.zoneName,
        maxGuests: Number(z.maxGuests),
        color: deriveZoneColor(z.zoneName),
      }));
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ── Shared write helper ───────────────────────────────────────────────────────
// Writes the full zones array back via updateCapacitySettings,
// preserving all other capacity settings unchanged.

async function writeZones(
  actor: Awaited<ReturnType<typeof createActor>>,
  zones: ZoneWithColor[],
): Promise<void> {
  const cfg = await actor.getExtendedConfig();
  if (cfg.__kind__ === "err") throw new Error(cfg.err);
  const ext = cfg.ok;

  const backendZones = zones.map((z) => ({
    zoneName: z.name,
    maxGuests: BigInt(z.maxGuests),
  }));

  const result = await actor.updateCapacitySettings(
    backendZones,
    ext.tableTypes ?? [],
    ext.occupancySettings ?? null,
    ext.totalSeatsPerSlot ?? BigInt(20),
  );
  if (result.__kind__ === "err") throw new Error(result.err);
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useAddZone() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<
    ZoneWithColor,
    Error,
    { name: string; color: string; maxGuests: number },
    MutationCtx
  >({
    mutationFn: async ({ name, color, maxGuests }) => {
      if (!actor) throw new Error("Actor not available");
      const current =
        queryClient.getQueryData<ZoneWithColor[]>(["zones"]) ?? [];
      const newZone: ZoneWithColor = { id: name, name, color, maxGuests };
      await writeZones(actor, [...current, newZone]);
      return newZone;
    },
    onMutate: async ({ name, color, maxGuests }) => {
      await queryClient.cancelQueries({ queryKey: ["zones"] });
      const previous = queryClient.getQueryData<ZoneWithColor[]>(["zones"]);
      const optimistic: ZoneWithColor = {
        id: `${name}-optimistic`,
        name,
        color,
        maxGuests,
      };
      queryClient.setQueryData<ZoneWithColor[]>(
        ["zones"],
        [...(previous ?? []), optimistic],
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData(["zones"], ctx.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      queryClient.invalidateQueries({ queryKey: ["capacityConfig"] });
      queryClient.invalidateQueries({ queryKey: ["extendedConfig"] });
    },
  });
}

export function useUpdateZone() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { id: string; name: string; color: string; maxGuests: number },
    MutationCtx
  >({
    mutationFn: async ({ id, name, color, maxGuests }) => {
      if (!actor) throw new Error("Actor not available");
      const current =
        queryClient.getQueryData<ZoneWithColor[]>(["zones"]) ?? [];
      const updated = current.map((z) =>
        z.id === id ? { ...z, name, color, maxGuests } : z,
      );
      await writeZones(actor, updated);
    },
    onMutate: async ({ id, name, color, maxGuests }) => {
      await queryClient.cancelQueries({ queryKey: ["zones"] });
      const previous = queryClient.getQueryData<ZoneWithColor[]>(["zones"]);
      queryClient.setQueryData<ZoneWithColor[]>(["zones"], (old) =>
        old
          ? old.map((z) => (z.id === id ? { ...z, name, color, maxGuests } : z))
          : old,
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData(["zones"], ctx.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      queryClient.invalidateQueries({ queryKey: ["capacityConfig"] });
      queryClient.invalidateQueries({ queryKey: ["extendedConfig"] });
    },
  });
}

export function useDeleteZone() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, string, MutationCtx>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      const current =
        queryClient.getQueryData<ZoneWithColor[]>(["zones"]) ?? [];
      await writeZones(
        actor,
        current.filter((z) => z.id !== id),
      );
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["zones"] });
      const previous = queryClient.getQueryData<ZoneWithColor[]>(["zones"]);
      queryClient.setQueryData<ZoneWithColor[]>(["zones"], (old) =>
        old ? old.filter((z) => z.id !== id) : old,
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData(["zones"], ctx.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      queryClient.invalidateQueries({ queryKey: ["capacityConfig"] });
      queryClient.invalidateQueries({ queryKey: ["extendedConfig"] });
    },
  });
}

export { DEFAULT_COLORS };

// ── Table Zone Update ─────────────────────────────────────────────────────────
// Used by SeatingPlanPage to persist per-table zone assignments.

export function useUpdateTableZone() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, { tableId: string; zone: string | null }>({
    mutationFn: async ({ tableId, zone }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.updateTableZone(tableId, zone);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    },
  });
}
