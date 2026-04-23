import { createActor } from "@/backend";
import type { AuditLogEntry } from "@/backend.d";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export interface AuditLogPage {
  entries: AuditLogEntry[];
  total: number;
}

const PAGE_SIZE = 20;

export function useAuditLog(page: number) {
  const { actor, isFetching } = useActor(createActor);
  const offset = BigInt(page * PAGE_SIZE);
  const limit = BigInt(PAGE_SIZE);

  return useQuery<AuditLogPage>({
    queryKey: ["auditLog", page],
    queryFn: async (): Promise<AuditLogPage> => {
      if (!actor) return { entries: [], total: 0 };
      try {
        const result = await actor.getAuditLogPaginated(offset, limit);
        if (result.__kind__ === "err") throw new Error(result.err);
        return {
          entries: result.ok.entries,
          total: Number(result.ok.total),
        };
      } catch {
        return { entries: [], total: 0 };
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}
