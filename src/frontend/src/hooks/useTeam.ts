import { createActor } from "@/backend";
import type { TeamMember } from "@/backend.d";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type { TeamMember };

export type TeamRole = "owner" | "manager" | "marketing" | "staff";

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useTeamMembers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TeamMember[]>({
    queryKey: ["teamMembers"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listTeamMembers();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 30_000,
  });
}

export interface AddMemberPayload {
  principalId: string;
  name: string;
  email: string;
  role: TeamRole;
}

export function useAddTeamMember() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<
    TeamMember,
    Error,
    AddMemberPayload,
    { previousMembers: TeamMember[] | undefined }
  >({
    mutationFn: async (payload) => {
      if (!actor) {
        // localStorage mock
        const mock: TeamMember = {
          id: Date.now().toString(),
          principalId: payload.principalId,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          createdAt: BigInt(Date.now()),
        };
        return mock;
      }
      const result = await actor.addTeamMember(
        payload.principalId,
        payload.name,
        payload.email,
        payload.role,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    // Optimistic update: add a temporary entry immediately
    onMutate: async (payload) => {
      // Cancel any in-flight refetches so they don't overwrite optimistic data
      await queryClient.cancelQueries({ queryKey: ["teamMembers"] });

      // Snapshot the previous value for rollback
      const previousMembers = queryClient.getQueryData<TeamMember[]>([
        "teamMembers",
      ]);

      // Optimistically add the new member with a temp id
      const optimisticMember: TeamMember = {
        id: `pending-${Date.now()}`,
        principalId: payload.principalId,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        createdAt: BigInt(Date.now()),
      };
      queryClient.setQueryData<TeamMember[]>(["teamMembers"], (old) => [
        ...(old ?? []),
        optimisticMember,
      ]);

      return { previousMembers };
    },
    // On error: immediately roll back to the snapshot
    onError: (_err, _payload, context) => {
      if (context?.previousMembers !== undefined) {
        queryClient.setQueryData(["teamMembers"], context.previousMembers);
      }
    },
    // On success or error: refetch to get the real server state
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    },
  });
}

export function useUpdateTeamMemberRole() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, { memberId: string; newRole: TeamRole }>({
    mutationFn: async ({ memberId, newRole }) => {
      if (!actor) return;
      const result = await actor.updateTeamMemberRole(memberId, newRole);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    },
  });
}

export function useRemoveTeamMember() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (memberId) => {
      if (!actor) return;
      const result = await actor.removeTeamMember(memberId);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    },
  });
}
