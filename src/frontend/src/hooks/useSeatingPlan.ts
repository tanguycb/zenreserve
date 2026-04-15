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
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
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

export function useGroupTables() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, { tableIds: TableId[] }>({
    mutationFn: async ({ tableIds }) => {
      if (!actor) throw new Error("Actor not available");
      // Group tables by assigning them a shared groupId via optimistic local state update
      // The backend doesn't have a dedicated groupTables method, so we optimistically
      // update the query cache with a shared groupId
      const groupId = `group-${Date.now()}`;
      queryClient.setQueryData<FloorState>(["floorState"], (old) => {
        if (!old) return old;
        return {
          ...old,
          tables: old.tables.map((t) =>
            tableIds.includes(t.id) ? { ...t, groupId } : t,
          ),
        };
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    },
  });
}

export function useUngroupTable() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { tableId: TableId }>({
    mutationFn: async ({ tableId }) => {
      queryClient.setQueryData<FloorState>(["floorState"], (old) => {
        if (!old) return old;
        return {
          ...old,
          tables: old.tables.map((t) =>
            t.id === tableId ? { ...t, groupId: undefined } : t,
          ),
        };
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    },
  });
}
