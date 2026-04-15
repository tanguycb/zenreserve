import { h as useQueryClient, r as reactExports, v as useActor, w as useQuery, x as useMutation, y as createActor } from "./index-DYFUyfbw.js";
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
  const queryClient = useQueryClient();
  const recordFeedback = reactExports.useCallback(
    (suggestionId, accepted, rejectionReason) => {
      const records = loadFeedback();
      records.push({
        id: suggestionId,
        accepted,
        rejectionReason,
        timestamp: Date.now()
      });
      saveFeedback(records);
      queryClient.invalidateQueries({ queryKey: ["ai-suggestion-accuracy"] });
    },
    [queryClient]
  );
  return { recordFeedback };
}
function useSuggestionAccuracyStats(days = 30) {
  return useQuery({
    queryKey: ["ai-suggestion-accuracy", days],
    queryFn: () => {
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
    staleTime: 3e4
  });
}
const AVAILABLE_ZONES = [
  "terras",
  "binnenzaal",
  "bar",
  "privézaal",
  "rooftop"
];
const STORAGE_KEY = "zenreserve_seasonal_periods";
const SEED_PERIODS = [
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
    serviceCapacities: { lunch: 50, diner: 80 }
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
    serviceCapacities: { lunch: 25, diner: 40 }
  }
];
function localLoad() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
  }
  return SEED_PERIODS;
}
function localSave(periods) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(periods));
  } catch {
  }
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
      return localLoad();
    },
    enabled: !isFetching,
    staleTime: 5 * 60 * 1e3
  });
}
function useSaveSeasonalPeriod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data, id }) => {
      const current = localLoad();
      if (id) {
        const updated = current.map((p) => p.id === id ? { ...data, id } : p);
        localSave(updated);
        return { ...data, id };
      }
      const newPeriod = { ...data, id: `s${Date.now()}` };
      localSave([...current, newPeriod]);
      return newPeriod;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasonalPeriods"] });
    }
  });
}
function useDeleteSeasonalPeriod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const current = localLoad();
      localSave(current.filter((p) => p.id !== id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasonalPeriods"] });
    }
  });
}
function useToggleSeasonalPeriod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, active }) => {
      const current = localLoad();
      localSave(
        current.map((p) => p.id === id ? { ...p, isActive: active } : p)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasonalPeriods"] });
    }
  });
}
export {
  AVAILABLE_ZONES as A,
  useSuggestTable as a,
  useSeasonalPeriods as b,
  useSaveSeasonalPeriod as c,
  useDeleteSeasonalPeriod as d,
  useToggleSeasonalPeriod as e,
  detectOverlap as f,
  useSuggestionAccuracyStats as g,
  useRecordSuggestionFeedback as u
};
