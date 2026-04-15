import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useEffect, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ReviewRequestDelay = "hour1" | "hour2" | "hour24";

export interface ReviewRequestSettings {
  enabled: boolean;
  delay: ReviewRequestDelay;
  message: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "zenreserve_review_requests_v1";

const DEFAULT_SETTINGS: ReviewRequestSettings = {
  enabled: false,
  delay: "hour24",
  message:
    "Beste {{guest_name}}, bedankt voor uw bezoek aan {{restaurant_name}}! Wij hopen u snel weer te mogen verwelkomen. Zou u een moment de tijd willen nemen om uw ervaring te beoordelen?",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadFromStorage(): ReviewRequestSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ReviewRequestSettings;
  } catch {
    /* ignore */
  }
  return DEFAULT_SETTINGS;
}

function saveToStorage(settings: ReviewRequestSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export interface UseReviewRequestsReturn {
  settings: ReviewRequestSettings;
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  update: <K extends keyof ReviewRequestSettings>(
    key: K,
    value: ReviewRequestSettings[K],
  ) => void;
  save: () => Promise<{ ok: boolean; error?: string }>;
  reset: () => void;
}

export function useReviewRequests(): UseReviewRequestsReturn {
  const { actor, isFetching } = useActor(createActor);
  const [settings, setSettings] =
    useState<ReviewRequestSettings>(loadFromStorage);
  const [saved, setSaved] = useState<ReviewRequestSettings>(loadFromStorage);
  const [isSaving, setIsSaving] = useState(false);

  // Load from backend when available
  useEffect(() => {
    if (!actor || isFetching) return;
    let cancelled = false;
    (async () => {
      try {
        // biome-ignore lint/suspicious/noExplicitAny: dynamic backend method
        const backendActor = actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<unknown>
        >;
        if (typeof backendActor.getReviewRequestSettings === "function") {
          const result = await backendActor.getReviewRequestSettings();
          if (!cancelled && result) {
            // Map backend variant to frontend type
            // biome-ignore lint/suspicious/noExplicitAny: backend result shape
            const raw = result as Record<string, unknown>;
            const delayVariant = raw.delay as Record<string, null> | undefined;
            const delay: ReviewRequestDelay = delayVariant
              ? Object.keys(delayVariant)[0] === "hour1"
                ? "hour1"
                : Object.keys(delayVariant)[0] === "hour2"
                  ? "hour2"
                  : "hour24"
              : "hour24";
            const mapped: ReviewRequestSettings = {
              enabled: Boolean(raw.enabled),
              delay,
              message: String(raw.message ?? DEFAULT_SETTINGS.message),
            };
            setSettings(mapped);
            setSaved(mapped);
            saveToStorage(mapped);
          }
        }
      } catch {
        // Fallback to localStorage — already loaded in useState
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [actor, isFetching]);

  const isDirty =
    settings.enabled !== saved.enabled ||
    settings.delay !== saved.delay ||
    settings.message !== saved.message;

  const update = useCallback(
    <K extends keyof ReviewRequestSettings>(
      key: K,
      value: ReviewRequestSettings[K],
    ) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const save = useCallback(async (): Promise<{
    ok: boolean;
    error?: string;
  }> => {
    setIsSaving(true);
    try {
      // Try backend first
      if (actor && !isFetching) {
        // biome-ignore lint/suspicious/noExplicitAny: dynamic backend method
        const backendActor = actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<unknown>
        >;
        if (typeof backendActor.saveReviewRequestSettings === "function") {
          const delayVariant = { [settings.delay]: null };
          const result = await backendActor.saveReviewRequestSettings(
            settings.enabled,
            delayVariant,
            settings.message,
          );
          // biome-ignore lint/suspicious/noExplicitAny: backend result
          const res = result as Record<string, unknown>;
          if (res && "err" in res) {
            return { ok: false, error: String(res.err) };
          }
        }
      }
      // Always persist to localStorage as fallback
      saveToStorage(settings);
      setSaved({ ...settings });
      return { ok: true };
    } catch {
      // Fallback: save to localStorage only
      saveToStorage(settings);
      setSaved({ ...settings });
      return { ok: true };
    } finally {
      setIsSaving(false);
    }
  }, [actor, isFetching, settings]);

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    isLoading: isFetching && !actor,
    isSaving,
    isDirty,
    update,
    save,
    reset,
  };
}
