import { useExperiences } from "@/hooks/useDashboard";
import { useAvailableSlots } from "@/hooks/useReservation";
import { useExtendedConfig } from "@/hooks/useSettings";
import type { Experience, Restaurant } from "@/types";
import { useCallback, useEffect, useState } from "react";

// ── useRestaurantConfig ───────────────────────────────────────────────────────
export function useRestaurantConfig(): {
  data: Restaurant | null;
  isLoading: boolean;
  isError: boolean;
  experiences: Experience[];
} {
  const configQuery = useExtendedConfig();
  const experiencesQuery = useExperiences();

  const cfg = configQuery.data;
  const restaurant: Restaurant | null = cfg
    ? {
        id: "restaurant",
        name: cfg.restaurantName,
        address: cfg.contactPhone, // contactPhone used as address fallback; general address not exposed
        phone: cfg.contactPhone,
        email: cfg.contactEmail,
        logoUrl: cfg.logoUrl ?? undefined,
        timezone: cfg.timezone,
        maxPartySize: Number(cfg.reservationRules?.maxPartySize ?? 12),
        stripeEnabled: cfg.integrations?.stripeEnabled ?? false,
      }
    : null;

  return {
    data: restaurant,
    isLoading: configQuery.isLoading || experiencesQuery.isLoading,
    isError: configQuery.isError || experiencesQuery.isError,
    experiences: experiencesQuery.data ?? [],
  };
}

// ── useRestaurantAvailability ─────────────────────────────────────────────────
export function useRestaurantAvailability(date: string, partySize: number) {
  const query = useAvailableSlots(date, partySize);
  return {
    ...query,
    data: query.data ?? [],
    isLoading: query.isLoading || (!query.data && !!date && partySize > 0),
  };
}

// ── SearchFilters type ────────────────────────────────────────────────────────
export interface SearchFilters {
  date: string;
  guests: number;
  experienceId: string;
}

// ── useSearchFilters ──────────────────────────────────────────────────────────
export function useSearchFilters() {
  function readFromUrl(): SearchFilters {
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get("date") ?? "";
    const guestsParam = Number(params.get("guests")) || 2;
    const expParam = params.get("experience") ?? "";
    return { date: dateParam, guests: guestsParam, experienceId: expParam };
  }

  const [filters, setFilters] = useState<SearchFilters>(readFromUrl);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get("date") ?? "";
    const guestsParam = Number(params.get("guests")) || 2;
    const expParam = params.get("experience") ?? "";
    setFilters({
      date: dateParam,
      guests: guestsParam,
      experienceId: expParam,
    });
  }, []);

  const updateFilters = useCallback((updates: Partial<SearchFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...updates };
      const params = new URLSearchParams();
      if (next.date) params.set("date", next.date);
      if (next.guests !== 2) params.set("guests", String(next.guests));
      if (next.experienceId) params.set("experience", next.experienceId);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, "", newUrl);
      return next;
    });
  }, []);

  return { filters, updateFilters };
}
