import { aK as useActor, b4 as useQuery, a8 as useQueryClient, aL as useMutation, r as reactExports, t as ue, aM as createActor } from "./index-BNayfcmF.js";
const AI_FEEDBACK_KEY = "zenreserve_ai_feedback";
function loadFeedback() {
  try {
    return JSON.parse(
      localStorage.getItem(AI_FEEDBACK_KEY) ?? "[]"
    );
  } catch {
    return [];
  }
}
function saveFeedback(records) {
  try {
    localStorage.setItem(AI_FEEDBACK_KEY, JSON.stringify(records.slice(-200)));
  } catch {
  }
}
function buildFallbackSuggestion(tableContext, partySize) {
  const entries = tableContext.matchAll(
    /id=([^\s]+)\s+name=[^\s]+\s+capacity=(\d+)\s+status=(\w+)/g
  );
  let bestId = null;
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
    reasoning: bestId ? `Table ${bestId} (${bestCap} seats) is available and fits a party of ${partySize}.` : `No available table found for ${partySize} persons.`,
    confidence: bestId ? 0.82 : 0
  });
}
function useSuggestTable() {
  const { actor, isFetching } = useActor(createActor);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [suggestion, setSuggestion] = reactExports.useState(
    null
  );
  const [error, setError] = reactExports.useState(null);
  const suggest = reactExports.useCallback(
    async (params) => {
      setIsLoading(true);
      setError(null);
      setSuggestion(null);
      const prompt = `You are a restaurant seating assistant. Suggest the best table for a party of ${params.partySize} on ${params.date} at ${params.time}. Zone preference: ${params.zonePreference ?? "none"}. Respond ONLY with valid JSON: {"suggestedTableIds": ["id1"], "reasoning": "short reason", "confidence": 0.85}`;
      try {
        let rawResponse;
        if (actor && !isFetching) {
          rawResponse = await Promise.race([
            actor.askAI(prompt, params.tableContext).then((r) => {
              if (r.__kind__ === "err") throw new Error(r.err);
              return r.ok;
            }),
            new Promise(
              (_, reject) => setTimeout(() => reject(new Error("timeout")), 6e3)
            )
          ]);
        } else {
          await new Promise((r) => setTimeout(r, 800));
          rawResponse = buildFallbackSuggestion(
            params.tableContext,
            params.partySize
          );
        }
        const match = rawResponse.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("invalid_response");
        const parsed = JSON.parse(match[0]);
        const result = {
          suggestionId: `sug_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          suggestedTableIds: Array.isArray(parsed.suggestedTableIds) ? parsed.suggestedTableIds : [],
          reasoning: typeof parsed.reasoning === "string" ? parsed.reasoning : "Best available table for your party.",
          confidence: typeof parsed.confidence === "number" ? Math.min(1, Math.max(0, parsed.confidence)) : 0.75,
          partySize: params.partySize,
          zonePreference: params.zonePreference,
          date: params.date,
          createdAt: Date.now()
        };
        setSuggestion(result);
        return result;
      } catch (err) {
        const msg = err instanceof Error && err.message === "timeout" ? "timeout" : "general";
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [actor, isFetching]
  );
  const reset = reactExports.useCallback(() => {
    setSuggestion(null);
    setError(null);
    setIsLoading(false);
  }, []);
  return { suggest, suggestion, isLoading, error, reset };
}
function useRecordSuggestionFeedback() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const recordFeedback = reactExports.useCallback(
    async (suggestionId, accepted, rejectionReason) => {
      const records = loadFeedback();
      records.push({
        id: suggestionId,
        accepted,
        rejectionReason,
        timestamp: Date.now()
      });
      saveFeedback(records);
      queryClient.invalidateQueries({ queryKey: ["ai-suggestion-accuracy"] });
      if (actor && !isFetching) {
        try {
          const result = await actor.recordSuggestionFeedback(
            suggestionId,
            accepted,
            rejectionReason ?? null
          );
          if (result.__kind__ === "err") {
            console.warn("AI feedback backend error:", result.err);
          }
        } catch (err) {
          console.warn("AI feedback backend call failed:", err);
        }
      }
    },
    [actor, isFetching, queryClient]
  );
  return { recordFeedback };
}
function useSuggestionAccuracyStats(days = 30) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["ai-suggestion-accuracy", days],
    queryFn: async () => {
      if (actor && !isFetching) {
        try {
          const stats = await actor.getSuggestionAccuracyStats(BigInt(days));
          return {
            totalSuggestions: Number(stats.totalSuggestions),
            acceptedCount: Number(stats.acceptedCount),
            rejectedCount: Number(stats.rejectedCount),
            acceptanceRatePct: stats.acceptanceRatePct,
            periodDays: Number(stats.periodDays)
          };
        } catch {
        }
      }
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1e3;
      const records = loadFeedback().filter((r) => r.timestamp >= cutoff);
      const total = records.length;
      const accepted = records.filter((r) => r.accepted).length;
      return {
        totalSuggestions: total,
        acceptedCount: accepted,
        rejectedCount: total - accepted,
        acceptanceRatePct: total > 0 ? Math.round(accepted / total * 100) : 0,
        periodDays: days
      };
    },
    enabled: !isFetching,
    staleTime: 3e4
  });
}
const FALLBACK_ZONES = [
  "terras",
  "binnenzaal",
  "bar",
  "privézaal",
  "rooftop"
];
const STORAGE_KEY = "zenreserve_seasonal_periods";
function localLoad() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
  }
  return [];
}
function localSave(periods) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(periods));
  } catch {
  }
}
function mapFromBackend(b) {
  return {
    id: b.id,
    name: b.name,
    dateFrom: b.dateFrom,
    dateTo: b.dateTo,
    isActive: b.isActive,
    autoActivate: b.autoActivate,
    activatedZones: b.activatedZones,
    capacityOverride: b.capacityOverride !== void 0 ? Number(b.capacityOverride) : null
  };
}
function mapToBackend(p) {
  return {
    id: p.id,
    name: p.name,
    dateFrom: p.dateFrom,
    dateTo: p.dateTo,
    isActive: p.isActive,
    autoActivate: p.autoActivate,
    activatedZones: p.activatedZones,
    ...p.capacityOverride !== null && {
      capacityOverride: BigInt(p.capacityOverride)
    }
  };
}
function detectOverlap(periods, incoming) {
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
function useSeasonalPeriods() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["seasonalPeriods"],
    queryFn: async () => {
      if (!actor || isFetching) return localLoad();
      try {
        const backendPeriods = await actor.getSeasonalPeriods();
        const mapped = backendPeriods.map(
          (p) => mapFromBackend(p)
        );
        localSave(mapped);
        return mapped;
      } catch (err) {
        console.warn("Failed to load seasonal periods from backend:", err);
        return localLoad();
      }
    },
    enabled: !isFetching,
    staleTime: 5 * 60 * 1e3
  });
}
function useSaveSeasonalPeriod() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data, id }) => {
      const period = id ? { ...data, id } : { ...data, id: `s${Date.now()}` };
      if (actor && !isFetching) {
        const result = await actor.saveSeasonalPeriod(
          mapToBackend(period)
        );
        if (result.__kind__ === "err") {
          throw new Error(result.err);
        }
      } else {
        const current = localLoad();
        if (id) {
          localSave(current.map((p) => p.id === id ? period : p));
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
      ue.error(`Seizoen opslaan mislukt: ${err.message}`);
    }
  });
}
function useDeleteSeasonalPeriod() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (actor && !isFetching) {
        const result = await actor.deleteSeasonalPeriod(id);
        if (result.__kind__ === "err") {
          throw new Error(result.err);
        }
      } else {
        const current = localLoad();
        localSave(current.filter((p) => p.id !== id));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasonalPeriods"] });
    },
    onError: (err) => {
      ue.error(`Seizoen verwijderen mislukt: ${err.message}`);
    }
  });
}
function useToggleSeasonalPeriod() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, active }) => {
      if (actor && !isFetching) {
        const result = await actor.toggleSeasonalPeriod(id, active);
        if (result.__kind__ === "err") {
          throw new Error(result.err);
        }
      } else {
        const current = localLoad();
        localSave(
          current.map((p) => p.id === id ? { ...p, isActive: active } : p)
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasonalPeriods"] });
    },
    onError: (err) => {
      ue.error(`Seizoen activeren mislukt: ${err.message}`);
    }
  });
}
export {
  FALLBACK_ZONES as F,
  useSaveSeasonalPeriod as a,
  useDeleteSeasonalPeriod as b,
  useToggleSeasonalPeriod as c,
  detectOverlap as d,
  useRecordSuggestionFeedback as e,
  useSuggestTable as f,
  useSuggestionAccuracyStats as g,
  useSeasonalPeriods as u
};
