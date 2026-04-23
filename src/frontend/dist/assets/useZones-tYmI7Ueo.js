import { aK as useActor, b4 as useQuery, a8 as useQueryClient, aL as useMutation, aM as createActor } from "./index-BNayfcmF.js";
const DEFAULT_COLORS = [
  "#22C55E",
  "#EAB308",
  "#3B82F6",
  "#A855F7",
  "#0EA5E9",
  "#F97316",
  "#EC4899",
  "#14B8A6"
];
function deriveZoneColor(zoneName) {
  let hash = 0;
  for (let i = 0; i < zoneName.length; i++) {
    hash = hash * 31 + zoneName.charCodeAt(i) >>> 0;
  }
  return DEFAULT_COLORS[hash % DEFAULT_COLORS.length];
}
function useZones() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["zones"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getExtendedConfig();
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok.zones.map((z) => ({
        id: z.zoneName,
        name: z.zoneName,
        maxGuests: Number(z.maxGuests),
        color: deriveZoneColor(z.zoneName)
      }));
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
async function writeZones(actor, zones) {
  const cfg = await actor.getExtendedConfig();
  if (cfg.__kind__ === "err") throw new Error(cfg.err);
  const ext = cfg.ok;
  const backendZones = zones.map((z) => ({
    zoneName: z.name,
    maxGuests: BigInt(z.maxGuests)
  }));
  const result = await actor.updateCapacitySettings(
    backendZones,
    ext.tableTypes ?? [],
    ext.occupancySettings ?? null,
    ext.totalSeatsPerSlot ?? BigInt(20)
  );
  if (result.__kind__ === "err") throw new Error(result.err);
}
function useAddZone() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, color, maxGuests }) => {
      if (!actor) throw new Error("Actor not available");
      const current = queryClient.getQueryData(["zones"]) ?? [];
      const newZone = { id: name, name, color, maxGuests };
      await writeZones(actor, [...current, newZone]);
      return newZone;
    },
    onMutate: async ({ name, color, maxGuests }) => {
      await queryClient.cancelQueries({ queryKey: ["zones"] });
      const previous = queryClient.getQueryData(["zones"]);
      const optimistic = {
        id: `${name}-optimistic`,
        name,
        color,
        maxGuests
      };
      queryClient.setQueryData(
        ["zones"],
        [...previous ?? [], optimistic]
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if ((ctx == null ? void 0 : ctx.previous) !== void 0) {
        queryClient.setQueryData(["zones"], ctx.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      queryClient.invalidateQueries({ queryKey: ["capacityConfig"] });
      queryClient.invalidateQueries({ queryKey: ["extendedConfig"] });
    }
  });
}
function useUpdateZone() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name, color, maxGuests }) => {
      if (!actor) throw new Error("Actor not available");
      const current = queryClient.getQueryData(["zones"]) ?? [];
      const updated = current.map(
        (z) => z.id === id ? { ...z, name, color, maxGuests } : z
      );
      await writeZones(actor, updated);
    },
    onMutate: async ({ id, name, color, maxGuests }) => {
      await queryClient.cancelQueries({ queryKey: ["zones"] });
      const previous = queryClient.getQueryData(["zones"]);
      queryClient.setQueryData(
        ["zones"],
        (old) => old ? old.map((z) => z.id === id ? { ...z, name, color, maxGuests } : z) : old
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if ((ctx == null ? void 0 : ctx.previous) !== void 0) {
        queryClient.setQueryData(["zones"], ctx.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      queryClient.invalidateQueries({ queryKey: ["capacityConfig"] });
      queryClient.invalidateQueries({ queryKey: ["extendedConfig"] });
    }
  });
}
function useDeleteZone() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      const current = queryClient.getQueryData(["zones"]) ?? [];
      await writeZones(
        actor,
        current.filter((z) => z.id !== id)
      );
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["zones"] });
      const previous = queryClient.getQueryData(["zones"]);
      queryClient.setQueryData(
        ["zones"],
        (old) => old ? old.filter((z) => z.id !== id) : old
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if ((ctx == null ? void 0 : ctx.previous) !== void 0) {
        queryClient.setQueryData(["zones"], ctx.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      queryClient.invalidateQueries({ queryKey: ["capacityConfig"] });
      queryClient.invalidateQueries({ queryKey: ["extendedConfig"] });
    }
  });
}
function useUpdateTableZone() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tableId, zone }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.updateTableZone(tableId, zone);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    }
  });
}
export {
  DEFAULT_COLORS as D,
  useUpdateZone as a,
  useDeleteZone as b,
  useAddZone as c,
  deriveZoneColor as d,
  useUpdateTableZone as e,
  useZones as u
};
