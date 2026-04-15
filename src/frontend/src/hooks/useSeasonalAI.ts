import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

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
  const queryClient = useQueryClient();
  const recordFeedback = useCallback(
    (
      suggestionId: string,
      accepted: boolean,
      rejectionReason?: string,
    ): void => {
      const records = loadFeedback();
      records.push({
        id: suggestionId,
        accepted,
        rejectionReason,
        timestamp: Date.now(),
      });
      saveFeedback(records);
      queryClient.invalidateQueries({ queryKey: ["ai-suggestion-accuracy"] });
    },
    [queryClient],
  );
  return { recordFeedback };
}

// ── Hook: accuracy stats ──────────────────────────────────────────────────────

export function useSuggestionAccuracyStats(days = 30) {
  return useQuery<SuggestionAccuracyStats>({
    queryKey: ["ai-suggestion-accuracy", days],
    queryFn: () => {
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
  serviceCapacities?: Record<string, number>; // serviceId → override capacity
}

export const AVAILABLE_ZONES = [
  "terras",
  "binnenzaal",
  "bar",
  "privézaal",
  "rooftop",
] as const;

export type ZoneKey = (typeof AVAILABLE_ZONES)[number];

// ── localStorage helpers ──────────────────────────────────────────────────────

const STORAGE_KEY = "zenreserve_seasonal_periods";

const SEED_PERIODS: SeasonalPeriod[] = [
  {
    id: "s1",
    name: "Zomers terras",
    dateFrom: "2026-05-01",
    dateTo: "2026-09-30",
    description: "Terras open in de zomermaanden",
    isActive: true,
    autoActivate: true,
    activatedZones: ["terras", "rooftop"],
    capacityOverride: 120,
    serviceCapacities: { lunch: 50, diner: 80 },
  },
  {
    id: "s2",
    name: "Kerstvakantie",
    dateFrom: "2026-12-20",
    dateTo: "2027-01-05",
    description: "Beperkte service tijdens de feestdagen",
    isActive: false,
    autoActivate: false,
    activatedZones: ["binnenzaal", "privézaal"],
    capacityOverride: 60,
    serviceCapacities: { lunch: 25, diner: 40 },
  },
];

function localLoad(): SeasonalPeriod[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SeasonalPeriod[];
  } catch {
    /* ignore */
  }
  return SEED_PERIODS;
}

function localSave(periods: SeasonalPeriod[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(periods));
  } catch {
    /* ignore */
  }
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
      // Backend seasonal API not yet wired — use localStorage
      if (!actor || isFetching) return localLoad();
      try {
        // Attempt backend call when API becomes available
        // const periods = await actor.getSeasonalPeriods?.();
        // if (periods) return periods.map(mapBackendPeriod);
      } catch {
        /* fall through to localStorage */
      }
      return localLoad();
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
  const queryClient = useQueryClient();
  return useMutation<
    SeasonalPeriod,
    Error,
    { data: Omit<SeasonalPeriod, "id">; id?: string }
  >({
    mutationFn: async ({ data, id }) => {
      const current = localLoad();
      if (id) {
        const updated = current.map((p) => (p.id === id ? { ...data, id } : p));
        localSave(updated);
        return { ...data, id };
      }
      const newPeriod: SeasonalPeriod = { ...data, id: `s${Date.now()}` };
      localSave([...current, newPeriod]);
      return newPeriod;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasonalPeriods"] });
    },
  });
}

export function useDeleteSeasonalPeriod() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const current = localLoad();
      localSave(current.filter((p) => p.id !== id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasonalPeriods"] });
    },
  });
}

export function useToggleSeasonalPeriod() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string; active: boolean }>({
    mutationFn: async ({ id, active }) => {
      const current = localLoad();
      localSave(
        current.map((p) => (p.id === id ? { ...p, isActive: active } : p)),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasonalPeriods"] });
    },
  });
}
