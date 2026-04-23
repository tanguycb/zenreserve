import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

// ── AI Seating Suggestion Types ───────────────────────────────────────────────

export interface AISeatingSuggestion {
  suggestionId: string;
  suggestedTableIds: string[];
  reasoning: string;
  confidence: number;
  partySize: number;
  zonePreference?: string;
  date: string;
  createdAt: number;
}

export interface SuggestionAccuracyStats {
  totalSuggestions: number;
  acceptedCount: number;
  rejectedCount: number;
  acceptanceRatePct: number;
  periodDays: number;
}

interface SuggestTableParams {
  partySize: number;
  zonePreference?: string;
  date: string;
  time: string;
  tableContext: string;
}

// ── AI feedback localStorage helpers ─────────────────────────────────────────

const AI_FEEDBACK_KEY = "zenreserve_ai_feedback";

interface FeedbackRecord {
  id: string;
  accepted: boolean;
  rejectionReason?: string;
  timestamp: number;
}

function loadFeedback(): FeedbackRecord[] {
  try {
    return JSON.parse(
      localStorage.getItem(AI_FEEDBACK_KEY) ?? "[]",
    ) as FeedbackRecord[];
  } catch {
    return [];
  }
}

function saveFeedback(records: FeedbackRecord[]): void {
  try {
    localStorage.setItem(AI_FEEDBACK_KEY, JSON.stringify(records.slice(-200)));
  } catch {
    // storage full — ignore
  }
}

function buildFallbackSuggestion(
  tableContext: string,
  partySize: number,
): string {
  const entries = tableContext.matchAll(
    /id=([^\s]+)\s+name=[^\s]+\s+capacity=(\d+)\s+status=(\w+)/g,
  );
  let bestId: string | null = null;
  let bestCap = 999;
  for (const m of entries) {
    const id = m[1];
    const cap = Number(m[2]);
    const status = m[3];
    if (status === "empty" && cap >= partySize && cap < bestCap) {
      bestId = id;
      bestCap = cap;
    }
  }
  return JSON.stringify({
    suggestedTableIds: bestId ? [bestId] : [],
    reasoning: bestId
      ? `Table ${bestId} (${bestCap} seats) is available and fits a party of ${partySize}.`
      : `No available table found for ${partySize} persons.`,
    confidence: bestId ? 0.82 : 0,
  });
}

// ── Hook: suggest table ───────────────────────────────────────────────────────

export function useSuggestTable() {
  const { actor, isFetching } = useActor(createActor);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AISeatingSuggestion | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const suggest = useCallback(
    async (params: SuggestTableParams): Promise<AISeatingSuggestion | null> => {
      setIsLoading(true);
      setError(null);
      setSuggestion(null);

      const prompt = `You are a restaurant seating assistant. Suggest the best table for a party of ${params.partySize} on ${params.date} at ${params.time}. Zone preference: ${params.zonePreference ?? "none"}. Respond ONLY with valid JSON: {"suggestedTableIds": ["id1"], "reasoning": "short reason", "confidence": 0.85}`;

      try {
        let rawResponse: string;

        if (actor && !isFetching) {
          rawResponse = await Promise.race([
            actor.askAI(prompt, params.tableContext).then((r) => {
              if (r.__kind__ === "err") throw new Error(r.err);
              return r.ok;
            }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error("timeout")), 6000),
            ),
          ]);
        } else {
          await new Promise((r) => setTimeout(r, 800));
          rawResponse = buildFallbackSuggestion(
            params.tableContext,
            params.partySize,
          );
        }

        const match = rawResponse.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("invalid_response");

        const parsed = JSON.parse(match[0]) as {
          suggestedTableIds?: unknown;
          reasoning?: unknown;
          confidence?: unknown;
        };

        const result: AISeatingSuggestion = {
          suggestionId: `sug_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          suggestedTableIds: Array.isArray(parsed.suggestedTableIds)
            ? (parsed.suggestedTableIds as string[])
            : [],
          reasoning:
            typeof parsed.reasoning === "string"
              ? parsed.reasoning
              : "Best available table for your party.",
          confidence:
            typeof parsed.confidence === "number"
              ? Math.min(1, Math.max(0, parsed.confidence))
              : 0.75,
          partySize: params.partySize,
          zonePreference: params.zonePreference,
          date: params.date,
          createdAt: Date.now(),
        };

        setSuggestion(result);
        return result;
      } catch (err) {
        const msg =
          err instanceof Error && err.message === "timeout"
            ? "timeout"
            : "general";
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [actor, isFetching],
  );

  const reset = useCallback(() => {
    setSuggestion(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { suggest, suggestion, isLoading, error, reset };
}

// ── Hook: record feedback ─────────────────────────────────────────────────────

export function useRecordSuggestionFeedback() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const recordFeedback = useCallback(
    async (
      suggestionId: string,
      accepted: boolean,
      rejectionReason?: string,
    ): Promise<void> => {
      // Always update local cache first for instant UI response
      const records = loadFeedback();
      records.push({
        id: suggestionId,
        accepted,
        rejectionReason,
        timestamp: Date.now(),
      });
      saveFeedback(records);
      queryClient.invalidateQueries({ queryKey: ["ai-suggestion-accuracy"] });

      // Persist to backend so the learning loop survives browser clears
      if (actor && !isFetching) {
        try {
          const result = await actor.recordSuggestionFeedback(
            suggestionId,
            accepted,
            rejectionReason ?? null,
          );
          if (result.__kind__ === "err") {
            console.warn("AI feedback backend error:", result.err);
            // Don't show a toast — local save already succeeded, this is non-critical
          }
        } catch (err) {
          console.warn("AI feedback backend call failed:", err);
          // Non-critical: local feedback is saved, backend sync failed silently
        }
      }
    },
    [actor, isFetching, queryClient],
  );

  return { recordFeedback };
}

// ── Hook: accuracy stats ──────────────────────────────────────────────────────

export function useSuggestionAccuracyStats(days = 30) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<SuggestionAccuracyStats>({
    queryKey: ["ai-suggestion-accuracy", days],
    queryFn: async () => {
      // Try backend first for cross-device accuracy
      if (actor && !isFetching) {
        try {
          const stats = await actor.getSuggestionAccuracyStats(BigInt(days));
          return {
            totalSuggestions: Number(stats.totalSuggestions),
            acceptedCount: Number(stats.acceptedCount),
            rejectedCount: Number(stats.rejectedCount),
            acceptanceRatePct: stats.acceptanceRatePct,
            periodDays: Number(stats.periodDays),
          };
        } catch {
          // Fall through to local calculation
        }
      }

      // Fallback: compute from localStorage cache
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      const records = loadFeedback().filter((r) => r.timestamp >= cutoff);
      const total = records.length;
      const accepted = records.filter((r) => r.accepted).length;
      return {
        totalSuggestions: total,
        acceptedCount: accepted,
        rejectedCount: total - accepted,
        acceptanceRatePct: total > 0 ? Math.round((accepted / total) * 100) : 0,
        periodDays: days,
      };
    },
    enabled: !isFetching,
    staleTime: 30_000,
  });
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SeasonalPeriod {
  id: string;
  name: string;
  dateFrom: string;
  dateTo: string;
  description?: string;
  isActive: boolean;
  autoActivate: boolean;
  activatedZones: string[];
  capacityOverride: number | null;
  serviceCapacities?: Record<string, number>; // serviceId → override capacity (frontend-only)
}

/** @deprecated Use dynamic zones from useCapacityConfig() instead. Kept as fallback only. */
export const FALLBACK_ZONES = [
  "terras",
  "binnenzaal",
  "bar",
  "privézaal",
  "rooftop",
] as const;

// ── localStorage helpers (cache layer) ────────────────────────────────────────

const STORAGE_KEY = "zenreserve_seasonal_periods";

function localLoad(): SeasonalPeriod[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SeasonalPeriod[];
  } catch {
    /* ignore */
  }
  // Return empty array — no fake seed data
  return [];
}

function localSave(periods: SeasonalPeriod[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(periods));
  } catch {
    /* ignore */
  }
}

// ── Backend ↔ Frontend type mappers ──────────────────────────────────────────

interface BackendSeasonalPeriod {
  id: string;
  name: string;
  dateFrom: string;
  dateTo: string;
  isActive: boolean;
  autoActivate: boolean;
  activatedZones: string[];
  capacityOverride?: bigint;
}

function mapFromBackend(b: BackendSeasonalPeriod): SeasonalPeriod {
  return {
    id: b.id,
    name: b.name,
    dateFrom: b.dateFrom,
    dateTo: b.dateTo,
    isActive: b.isActive,
    autoActivate: b.autoActivate,
    activatedZones: b.activatedZones,
    capacityOverride:
      b.capacityOverride !== undefined ? Number(b.capacityOverride) : null,
  };
}

function mapToBackend(p: SeasonalPeriod): BackendSeasonalPeriod {
  return {
    id: p.id,
    name: p.name,
    dateFrom: p.dateFrom,
    dateTo: p.dateTo,
    isActive: p.isActive,
    autoActivate: p.autoActivate,
    activatedZones: p.activatedZones,
    ...(p.capacityOverride !== null && {
      capacityOverride: BigInt(p.capacityOverride),
    }),
  };
}

// ── Overlap detection ─────────────────────────────────────────────────────────

export function detectOverlap(
  periods: SeasonalPeriod[],
  incoming: { dateFrom: string; dateTo: string; id?: string },
): SeasonalPeriod | null {
  const from = new Date(incoming.dateFrom).getTime();
  const to = new Date(incoming.dateTo).getTime();
  for (const p of periods) {
    if (p.id === incoming.id) continue;
    const pFrom = new Date(p.dateFrom).getTime();
    const pTo = new Date(p.dateTo).getTime();
    if (from <= pTo && to >= pFrom) return p;
  }
  return null;
}

// ── Active season helper ──────────────────────────────────────────────────────

export function getActiveSeasonForDate(
  periods: SeasonalPeriod[],
  date: Date = new Date(),
): SeasonalPeriod | null {
  const t = date.getTime();
  return (
    periods.find((p) => {
      if (!p.isActive) return false;
      const from = new Date(p.dateFrom).getTime();
      const to = new Date(p.dateTo).getTime();
      return t >= from && t <= to;
    }) ?? null
  );
}

// ── React Query hooks ─────────────────────────────────────────────────────────

export function useSeasonalPeriods() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<SeasonalPeriod[]>({
    queryKey: ["seasonalPeriods"],
    queryFn: async () => {
      if (!actor || isFetching) return localLoad();

      try {
        const backendPeriods = await actor.getSeasonalPeriods();
        const mapped = backendPeriods.map((p) =>
          mapFromBackend(p as BackendSeasonalPeriod),
        );
        // Keep local cache in sync
        localSave(mapped);
        return mapped;
      } catch (err) {
        console.warn("Failed to load seasonal periods from backend:", err);
        // Fall back to local cache so UI stays functional
        return localLoad();
      }
    },
    enabled: !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useActiveSeason() {
  const { data: periods = [] } = useSeasonalPeriods();
  return getActiveSeasonForDate(periods);
}

export function useSaveSeasonalPeriod() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<
    SeasonalPeriod,
    Error,
    { data: Omit<SeasonalPeriod, "id">; id?: string }
  >({
    mutationFn: async ({ data, id }) => {
      const period: SeasonalPeriod = id
        ? { ...data, id }
        : { ...data, id: `s${Date.now()}` };

      if (actor && !isFetching) {
        const result = await actor.saveSeasonalPeriod(
          mapToBackend(period) as Parameters<
            typeof actor.saveSeasonalPeriod
          >[0],
        );
        if (result.__kind__ === "err") {
          throw new Error(result.err);
        }
      } else {
        // Offline: update local cache only as fallback
        const current = localLoad();
        if (id) {
          localSave(current.map((p) => (p.id === id ? period : p)));
        } else {
          localSave([...current, period]);
        }
      }

      return period;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasonalPeriods"] });
    },
    onError: (err) => {
      toast.error(`Seizoen opslaan mislukt: ${err.message}`);
    },
  });
}

export function useDeleteSeasonalPeriod() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (actor && !isFetching) {
        const result = await actor.deleteSeasonalPeriod(id);
        if (result.__kind__ === "err") {
          throw new Error(result.err);
        }
      } else {
        // Offline fallback
        const current = localLoad();
        localSave(current.filter((p) => p.id !== id));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasonalPeriods"] });
    },
    onError: (err) => {
      toast.error(`Seizoen verwijderen mislukt: ${err.message}`);
    },
  });
}

export function useToggleSeasonalPeriod() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; active: boolean }>({
    mutationFn: async ({ id, active }) => {
      if (actor && !isFetching) {
        const result = await actor.toggleSeasonalPeriod(id, active);
        if (result.__kind__ === "err") {
          throw new Error(result.err);
        }
      } else {
        // Offline fallback
        const current = localLoad();
        localSave(
          current.map((p) => (p.id === id ? { ...p, isActive: active } : p)),
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasonalPeriods"] });
    },
    onError: (err) => {
      toast.error(`Seizoen activeren mislukt: ${err.message}`);
    },
  });
}
