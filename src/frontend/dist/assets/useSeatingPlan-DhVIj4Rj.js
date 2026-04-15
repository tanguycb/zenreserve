import { v as useActor, w as useQuery, h as useQueryClient, x as useMutation, y as createActor } from "./index-DYFUyfbw.js";
function useFloorState() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["floorState"],
    queryFn: async () => {
      if (!actor) return { tables: [], updatedAt: BigInt(Date.now()) };
      const state = await actor.getFloorState();
      return state;
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useCreateTable() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, capacity, x, y }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.createTable(
        name,
        BigInt(capacity),
        BigInt(x),
        BigInt(y)
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    }
  });
}
function useUpdateTablePosition() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, x, y }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.updateTablePosition(id, BigInt(x), BigInt(y));
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onMutate: async ({ id, x, y }) => {
      await queryClient.cancelQueries({ queryKey: ["floorState"] });
      const prev = queryClient.getQueryData(["floorState"]);
      queryClient.setQueryData(["floorState"], (old) => {
        if (!old) return old;
        return {
          ...old,
          tables: old.tables.map(
            (t) => t.id === id ? { ...t, x: BigInt(x), y: BigInt(y) } : t
          )
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
    }
  });
}
function useAssignReservation() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tableId, reservationId, guestName, seatCount }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.assignReservationToTableWithDetails(
        tableId,
        reservationId,
        guestName,
        BigInt(seatCount)
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    }
  });
}
function useUnassignTable() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tableId }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.unassignTable(tableId);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    }
  });
}
function useDeleteTable() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.deleteTable(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
    }
  });
}
export {
  useUpdateTablePosition as a,
  useUnassignTable as b,
  useDeleteTable as c,
  useAssignReservation as d,
  useCreateTable as e,
  useFloorState as u
};
