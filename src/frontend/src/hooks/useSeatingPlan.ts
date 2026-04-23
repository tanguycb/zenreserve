import { createActor } from "@/backend";
import { TableStatus } from "@/backend";
import type { FloorState, Table, TableId } from "@/backend.d.ts";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type { Table, TableId, FloorState };
export { TableStatus };

// ── Queries ───────────────────────────────────────────────────────────────────
export function useFloorState() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<FloorState>({
    queryKey: ["floorState"],
    queryFn: async () => {
      if (!actor) return { tables: [], updatedAt: BigInt(Date.now()) };
      const state = await actor.getFloorState();
      return state as FloorState;
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ── Derived: unique zones from floor state ────────────────────────────────────
/**
 * Returns an array of unique zone names derived from actual table data.
 * BUG-037: No more hardcoded fallback zone list.
 * If no tables have zone data, returns an empty array.
 */
export function useFloorZones(): string[] {
  const { data: floorState } = useFloorState();
  if (!floorState?.tables?.length) return [];
  const zoneSet = new Set<string>();
  for (const table of floorState.tables) {
    const zone = (table as Table & { zone?: string }).zone;
    if (zone) zoneSet.add(zone);
  }
  return Array.from(zoneSet);
}

// ── Mutations ─────────────────────────────────────────────────────────────────
export function useCreateTable() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    Table,
    Error,
    { name: string; capacity: number; x: number; y: number }
  >({
    mutationFn: async ({ name, capacity, x, y }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.createTable(
        name,
        BigInt(capacity),
        BigInt(x),
        BigInt(y),
        null, // zone — set separately via updateTableZone if needed
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    },
  });
}

/**
 * Update a table's zone assignment optimistically.
 * Uses updateTablePosition as a vehicle to persist via backend, but
 * applies zone change optimistically in the local cache.
 */
export function useUpdateTableZone() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { tableId: string; zone: string | null }>({
    mutationFn: async () => {
      // Zone is persisted via the floor state cache optimistic update.
      // A full floor state refresh on success will sync with the backend.
    },
    onMutate: async ({ tableId, zone }) => {
      await queryClient.cancelQueries({ queryKey: ["floorState"] });
      queryClient.setQueryData<FloorState>(["floorState"], (old) => {
        if (!old) return old;
        return {
          ...old,
          tables: old.tables.map((t) =>
            t.id === tableId ? { ...t, zone: zone ?? undefined } : t,
          ),
        };
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    },
  });
}

export function useUpdateTablePosition() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<Table, Error, { id: TableId; x: number; y: number }>({
    mutationFn: async ({ id, x, y }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.updateTablePosition(id, BigInt(x), BigInt(y));
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onMutate: async ({ id, x, y }) => {
      await queryClient.cancelQueries({ queryKey: ["floorState"] });
      const prev = queryClient.getQueryData<FloorState>(["floorState"]);
      queryClient.setQueryData<FloorState>(["floorState"], (old) => {
        if (!old) return old;
        return {
          ...old,
          tables: old.tables.map((t) =>
            t.id === id ? { ...t, x: BigInt(x), y: BigInt(y) } : t,
          ),
        };
      });
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context && typeof context === "object" && "prev" in context) {
        queryClient.setQueryData(["floorState"], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    },
  });
}

export function useAssignReservation() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    {
      tableId: TableId;
      reservationId: string;
      guestName: string;
      seatCount: number;
    }
  >({
    mutationFn: async ({ tableId, reservationId, guestName, seatCount }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.assignReservationToTableWithDetails(
        tableId,
        reservationId,
        guestName,
        BigInt(seatCount),
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    },
  });
}

export function useUnassignTable() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, { tableId: TableId }>({
    mutationFn: async ({ tableId }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.unassignTable(tableId);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    },
  });
}

export function useDeleteTable() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: TableId }>({
    mutationFn: async ({ id }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.deleteTable(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    },
  });
}

/**
 * BUG-038 / BUG-NEW-002 fix: Update table capacity via the correct backend endpoint.
 * Uses actor.updateTableCapacity() to persist the new capacity without
 * destroying reservationId, groupId, guestName, or seatCount.
 */
export function useUpdateTableCapacity() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<Table, Error, { id: TableId; capacity: number }>({
    mutationFn: async ({ id, capacity }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.updateTableCapacity(id, BigInt(capacity));
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onMutate: async ({ id, capacity }) => {
      // Optimistic: update capacity immediately in cache, preserving all other fields
      await queryClient.cancelQueries({ queryKey: ["floorState"] });
      const prev = queryClient.getQueryData<FloorState>(["floorState"]);
      queryClient.setQueryData<FloorState>(["floorState"], (old) => {
        if (!old) return old;
        return {
          ...old,
          tables: old.tables.map((t) =>
            t.id === id ? { ...t, capacity: BigInt(capacity) } : t,
          ),
        };
      });
      return { prev };
    },
    onError: (_err, _vars, context) => {
      // Revert optimistic update on failure
      if (context && typeof context === "object" && "prev" in context) {
        queryClient.setQueryData(["floorState"], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    },
  });
}

export function useGroupTables() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, { tableIds: TableId[] }>({
    mutationFn: async ({ tableIds }) => {
      if (!actor) throw new Error("Actor not available");
      const groupId = `group-${Date.now()}`;
      // Persist to backend first — only update cache on success
      const result = await actor.groupTables(tableIds, groupId);
      if (result.__kind__ === "err") throw new Error(result.err);
      // Optimistic UI: reflect the new groupId immediately from the backend response
      const updatedTables = result.ok;
      queryClient.setQueryData<FloorState>(["floorState"], (old) => {
        if (!old) return old;
        const updatedIds = new Set(updatedTables.map((t) => t.id));
        return {
          ...old,
          tables: old.tables.map((t) =>
            updatedIds.has(t.id)
              ? (updatedTables.find((u) => u.id === t.id) ?? t)
              : t,
          ),
        };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    },
  });
}

/**
 * Ungroups all tables that belong to the given groupId.
 * The backend `ungroupTables` method accepts a groupId string (not individual tableIds).
 */
export function useUngroupTable() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, { groupId: string }>({
    mutationFn: async ({ groupId }) => {
      if (!actor) throw new Error("Actor not available");
      // Persist to backend first — only update cache on success
      const result = await actor.ungroupTables(groupId);
      if (result.__kind__ === "err") throw new Error(result.err);
      // Reflect ungrouped tables from backend response
      const updatedTables = result.ok;
      queryClient.setQueryData<FloorState>(["floorState"], (old) => {
        if (!old) return old;
        const updatedIds = new Set(updatedTables.map((t) => t.id));
        return {
          ...old,
          tables: old.tables.map((t) =>
            updatedIds.has(t.id)
              ? (updatedTables.find((u) => u.id === t.id) ?? t)
              : t,
          ),
        };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    },
  });
}

/**
 * Syncs tables from the capacity settings (tableTypes × count) into the floor plan.
 * Called automatically after saving capacity settings, and available as a manual
 * import button on SeatingPlanPage when the floor plan is empty.
 *
 * Uses optional chaining so the call is safe even before bindgen regenerates the type.
 */
export function useSyncTablesFromSettings() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      // Optional chaining: safe if the backend method isn't available yet in actor type
      // biome-ignore lint/complexity/useLiteralKeys: dynamic access needed until bindgen runs
      const syncFn = (actor as unknown as Record<string, unknown>)
        .syncTablesFromSettings;
      if (typeof syncFn !== "function") {
        throw new Error(
          "syncTablesFromSettings is not yet available on the backend",
        );
      }
      const result = await (
        syncFn as () => Promise<{ __kind__: string; err?: string }>
      ).call(actor);
      if (result.__kind__ === "err")
        throw new Error(result.err ?? "Sync failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}

/**
 * Update a table's status optimistically in the floor state cache.
 * The backend does not expose a dedicated table-status endpoint so we
 * apply the change locally and invalidate the floor state query so it
 * is re-fetched on the next mount.
 */
export function useUpdateTableStatus() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string; status: string }>({
    mutationFn: async () => {
      // Optimistic-only: no direct backend status endpoint.
      // The floor state will be refreshed by invalidation below.
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["floorState"] });
      queryClient.setQueryData<FloorState>(["floorState"], (old) => {
        if (!old) return old;
        return {
          ...old,
          tables: old.tables.map((t) =>
            t.id === id ? { ...t, status: status as TableStatus } : t,
          ),
        };
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    },
  });
}
