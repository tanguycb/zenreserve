import { createActor } from "@/backend";
import type {
  BrandingSettings as BackendBranding,
  GuestFormSettings as BackendGuestForm,
  IntegrationSettings as BackendIntegration,
  NotificationSettings as BackendNotifications,
  ReservationRules as BackendReservationRules,
  RestaurantExtendedConfig,
  ZoneCapacity,
} from "@/backend.d.ts";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Helper: unwrap the Result returned by getExtendedConfig()
async function fetchExtendedConfig(
  actor: Awaited<ReturnType<typeof createActor>>,
): Promise<RestaurantExtendedConfig> {
  const result = await actor.getExtendedConfig();
  if (result.__kind__ === "err") {
    throw new Error(`getExtendedConfig failed: ${result.err}`);
  }
  return result.ok;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface GeneralInfo {
  restaurantName: string;
  logoUrl: string;
  currency: "EUR" | "USD" | "GBP" | "CHF";
  timezone: string;
  contactPhone: string;
  contactEmail: string;
}

export interface ServiceHours {
  id: string;
  name: string;
  openTime: string; // "HH:MM"
  closeTime: string; // "HH:MM"
  maxCapacity: number;
  enabledDays: number[]; // 0=Mon, 6=Sun
}

export interface ExceptionalClosingDay {
  id: string;
  date: string; // ISO date
  reason: string;
  serviceId?: string;
}

export interface OpeningHoursConfig {
  services: ServiceHours[];
  fixedClosingDays: number[];
  exceptionalClosingDays: ExceptionalClosingDay[];
}

export interface Zone {
  id: string;
  name: string;
  maxGuests: number;
}

export interface TableType {
  id: string;
  name: string;
  seatsPerTable: number;
  count: number;
}

export interface CapacityConfig {
  serviceMaxGuests: Record<string, number>;
  minPartySize: number;
  maxPartySize: number;
  zones: Zone[];
  tableTypes: TableType[];
  occupancyCeiling: number;
  totalSeatsPerSlot: number;
}

export interface BrandingConfig {
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
  welcomeText: string;
  confirmationText: string;
  defaultLanguage: "nl" | "en" | "fr" | "de";
  sendConfirmationEmail: boolean;
  sendReminderEmail: boolean;
  reminderHoursBefore: number;
}

// ── Extended Config (full backend config) ─────────────────────────────────────

export function useExtendedConfig() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<RestaurantExtendedConfig>({
    queryKey: ["extendedConfig"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return fetchExtendedConfig(actor);
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ── General Info ──────────────────────────────────────────────────────────────

export function useGeneralInfo() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<GeneralInfo>({
    queryKey: ["generalInfo"],
    queryFn: async () => {
      if (!actor) {
        return {
          restaurantName: "",
          logoUrl: "",
          currency: "EUR" as const,
          timezone: "Europe/Brussels",
          contactPhone: "",
          contactEmail: "",
        };
      }
      const cfg = await fetchExtendedConfig(actor);
      return {
        restaurantName: cfg.restaurantName,
        logoUrl: cfg.logoUrl ?? "",
        currency: (cfg.currency as GeneralInfo["currency"]) ?? "EUR",
        timezone: cfg.timezone,
        contactPhone: cfg.contactPhone,
        contactEmail: cfg.contactEmail,
      };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateGeneralInfo() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, GeneralInfo>({
    mutationFn: async (info) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.updateGeneralInfo(
        info.restaurantName,
        info.currency,
        info.timezone,
        info.contactPhone,
        info.contactEmail,
        info.logoUrl || null,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generalInfo"] });
      queryClient.invalidateQueries({ queryKey: ["extendedConfig"] });
      queryClient.invalidateQueries({ queryKey: ["restaurantConfig"] });
    },
  });
}

// ── Opening Hours ─────────────────────────────────────────────────────────────

export function useOpeningHoursConfig() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<OpeningHoursConfig>({
    queryKey: ["openingHours"],
    queryFn: async () => {
      if (!actor) {
        return {
          services: [
            {
              id: "lunch",
              name: "Lunch",
              openTime: "12:00",
              closeTime: "14:30",
              maxCapacity: 40,
              enabledDays: [0, 1, 2, 3, 4],
            },
            {
              id: "diner",
              name: "Diner",
              openTime: "18:00",
              closeTime: "22:00",
              maxCapacity: 60,
              enabledDays: [0, 1, 2, 3, 4, 5, 6],
            },
          ],
          fixedClosingDays: [],
          exceptionalClosingDays: [],
        };
      }
      const cfg = await fetchExtendedConfig(actor);
      return {
        services: cfg.services.map((s) => ({
          id: s.id,
          name: s.name,
          openTime: s.openTime,
          closeTime: s.closeTime,
          maxCapacity: Number(s.maxCapacity),
          enabledDays: s.enabledDays.map(Number),
        })),
        fixedClosingDays: cfg.fixedClosingDays.map(Number),
        exceptionalClosingDays: cfg.exceptionalClosingDays.map((d) => ({
          id: d.date,
          date: d.date,
          reason: d.reason,
          serviceId: d.serviceId,
        })),
      };
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useUpdateServiceHours() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, ServiceHours[]>({
    mutationFn: async (services) => {
      if (!actor) throw new Error("Actor not available");
      const backendServices = services.map((s) => ({
        id: s.id,
        name: s.name,
        openTime: s.openTime,
        closeTime: s.closeTime,
        maxCapacity: BigInt(s.maxCapacity),
        enabledDays: s.enabledDays.map(BigInt),
      }));
      const result = await actor.updateServiceHours(backendServices);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["openingHours"] });
      queryClient.invalidateQueries({ queryKey: ["extendedConfig"] });
    },
  });
}

export function useUpdateClosingDays() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    {
      fixedClosingDays: number[];
      exceptionalClosingDays: ExceptionalClosingDay[];
    }
  >({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.updateExceptionalClosingDays(
        data.fixedClosingDays.map(BigInt),
        data.exceptionalClosingDays.map((d) => ({
          date: d.date,
          reason: d.reason,
          serviceId: d.serviceId,
        })),
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["openingHours"] });
      queryClient.invalidateQueries({ queryKey: ["extendedConfig"] });
    },
  });
}

// ── Capacity ──────────────────────────────────────────────────────────────────

export function useCapacityConfig() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CapacityConfig>({
    queryKey: ["capacityConfig"],
    queryFn: async () => {
      if (!actor) {
        return {
          serviceMaxGuests: { lunch: 40, diner: 60 },
          minPartySize: 1,
          maxPartySize: 12,
          zones: [
            { id: "indoor", name: "Indoor", maxGuests: 60 },
            { id: "terrace", name: "Terras", maxGuests: 30 },
            { id: "bar", name: "Bar", maxGuests: 10 },
          ],
          tableTypes: [
            { id: "t2", name: "2-persoons", seatsPerTable: 2, count: 8 },
            { id: "t4", name: "4-persoons", seatsPerTable: 4, count: 10 },
            { id: "t6", name: "6-persoons", seatsPerTable: 6, count: 4 },
          ],
          occupancyCeiling: 85,
          totalSeatsPerSlot: 20,
        };
      }
      const cfg = await fetchExtendedConfig(actor);
      // Read totalSeatsPerSlot directly from extendedConfig (same source that
      // updateCapacitySettings writes to), so the displayed value always
      // reflects what was last saved (fixes BUG-SETTINGS-SEATS).
      const totalSeatsPerSlot = Number(cfg.totalSeatsPerSlot ?? 20);
      return {
        serviceMaxGuests: Object.fromEntries(
          cfg.services.map((s) => [s.id, Number(s.maxCapacity)]),
        ),
        minPartySize: Number(
          cfg.occupancySettings?.maxGuestsPerReservationMin ?? 1,
        ),
        maxPartySize: Number(
          cfg.occupancySettings?.maxGuestsPerReservationMax ?? 12,
        ),
        zones: cfg.zones.map((z, i) => ({
          id: `zone-${i}`,
          name: z.zoneName,
          maxGuests: Number(z.maxGuests),
        })),
        tableTypes: cfg.tableTypes.map((t, i) => ({
          id: `type-${i}`,
          name: t.typeName,
          seatsPerTable: Number(t.capacity),
          count: Number(t.count),
        })),
        occupancyCeiling: Number(
          cfg.occupancySettings?.globalCeilingPercent ?? 85,
        ),
        totalSeatsPerSlot,
      };
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useUpdateCapacityConfig() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, CapacityConfig>({
    mutationFn: async (config) => {
      if (!actor) throw new Error("Actor not available");
      const zones: ZoneCapacity[] = config.zones.map((z) => ({
        zoneName: z.name,
        maxGuests: BigInt(z.maxGuests),
      }));
      const tableTypes = config.tableTypes.map((t) => ({
        typeName: t.name,
        capacity: BigInt(t.seatsPerTable),
        count: BigInt(t.count),
      }));
      const occupancySettings = {
        globalCeilingPercent: BigInt(config.occupancyCeiling),
        maxGuestsPerReservationMin: BigInt(config.minPartySize),
        maxGuestsPerReservationMax: BigInt(config.maxPartySize),
      };
      const result = await actor.updateCapacitySettings(
        zones,
        tableTypes,
        occupancySettings,
        BigInt(config.totalSeatsPerSlot ?? 20),
      );
      if (result.__kind__ === "err") throw new Error(result.err);

      // Auto-sync tables to the floor plan after saving capacity settings.
      try {
        const syncResult = await actor.syncTablesFromSettings();
        if (syncResult.__kind__ === "err") {
          console.warn("syncTablesFromSettings failed:", syncResult.err);
        }
      } catch {
        // Non-fatal: sync failure doesn't prevent settings from saving
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["capacityConfig"] });
      queryClient.invalidateQueries({ queryKey: ["extendedConfig"] });
      // Refresh floor plan so newly synced tables appear immediately
      queryClient.invalidateQueries({ queryKey: ["floorState"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}

// ── Branding ──────────────────────────────────────────────────────────────────

export function useBrandingConfig() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<BrandingConfig>({
    queryKey: ["brandingConfig"],
    queryFn: async () => {
      if (!actor) {
        return {
          primaryColor: "#22C55E",
          accentColor: "#3B82F6",
          logoUrl: "",
          welcomeText: "",
          confirmationText: "",
          defaultLanguage: "nl" as const,
          sendConfirmationEmail: true,
          sendReminderEmail: true,
          reminderHoursBefore: 24,
        };
      }
      const cfg = await fetchExtendedConfig(actor);
      return {
        primaryColor: cfg.branding.primaryColor,
        accentColor: cfg.branding.accentColor,
        logoUrl: cfg.branding.logoUrl ?? "",
        welcomeText: cfg.branding.welcomeText,
        confirmationText: cfg.branding.confirmationText,
        defaultLanguage: (cfg.branding.defaultLanguage ??
          "nl") as BrandingConfig["defaultLanguage"],
        sendConfirmationEmail: cfg.notifications.sendConfirmationEmail,
        sendReminderEmail: cfg.notifications.sendReminderEmail,
        reminderHoursBefore: Number(
          cfg.notifications.reminderHoursBefore[0] ?? 24,
        ),
      };
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useUpdateBrandingConfig() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, BrandingConfig>({
    mutationFn: async (config) => {
      if (!actor) throw new Error("Actor not available");
      const branding: BackendBranding = {
        primaryColor: config.primaryColor,
        accentColor: config.accentColor,
        logoUrl: config.logoUrl || undefined,
        welcomeText: config.welcomeText,
        confirmationText: config.confirmationText,
        defaultLanguage: config.defaultLanguage,
      };
      const brandingResult = await actor.updateBrandingSettings(branding);
      if (brandingResult.__kind__ === "err")
        throw new Error(brandingResult.err);

      const notifications: BackendNotifications = {
        sendConfirmationEmail: config.sendConfirmationEmail,
        sendReminderEmail: config.sendReminderEmail,
        reminderHoursBefore: [BigInt(config.reminderHoursBefore)],
        sendCancellationEmail: true,
        waitlistAutoActivate: true,
      };
      const notifResult = await actor.updateNotificationSettings(notifications);
      if (notifResult.__kind__ === "err") throw new Error(notifResult.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brandingConfig"] });
      queryClient.invalidateQueries({ queryKey: ["extendedConfig"] });
    },
  });
}

// ── Reservation Rules ─────────────────────────────────────────────────────────

export interface ReservationRulesConfig {
  advanceBookingDays: number;
  cancellationHoursBeforeFree: number;
  depositRequired: boolean;
  depositAmountEur: number;
  depositRequiredAbovePartySize: number;
  noShowFeeEur: number;
  minPartySize: number;
  maxPartySize: number;
  maxStayMinutesLunch: number;
  maxStayMinutesDinner: number;
}

export function useReservationRules() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ReservationRulesConfig>({
    queryKey: ["reservationRules"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const cfg = await fetchExtendedConfig(actor);
      const r = cfg.reservationRules;
      return {
        advanceBookingDays: Number(r.advanceBookingDays),
        cancellationHoursBeforeFree: Number(r.cancellationHoursBeforeFree),
        depositRequired: r.depositRequired,
        depositAmountEur: Number(r.depositAmountEur),
        depositRequiredAbovePartySize: Number(r.depositRequiredAbovePartySize),
        noShowFeeEur: Number(r.noShowFeeEur),
        minPartySize: Number(r.minPartySize),
        maxPartySize: Number(r.maxPartySize),
        maxStayMinutesLunch: Number(r.maxStayMinutesLunch),
        maxStayMinutesDinner: Number(r.maxStayMinutesDinner),
      };
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useUpdateReservationRules() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, ReservationRulesConfig>({
    mutationFn: async (config) => {
      if (!actor) throw new Error("Actor not available");
      const rules: BackendReservationRules = {
        advanceBookingDays: BigInt(config.advanceBookingDays),
        cancellationHoursBeforeFree: BigInt(config.cancellationHoursBeforeFree),
        depositRequired: config.depositRequired,
        depositAmountEur: BigInt(config.depositAmountEur),
        depositRequiredAbovePartySize: BigInt(
          config.depositRequiredAbovePartySize,
        ),
        noShowFeeEur: BigInt(config.noShowFeeEur),
        minPartySize: BigInt(config.minPartySize),
        maxPartySize: BigInt(config.maxPartySize),
        maxStayMinutesLunch: BigInt(config.maxStayMinutesLunch),
        maxStayMinutesDinner: BigInt(config.maxStayMinutesDinner),
      };
      const result = await actor.updateReservationRules(rules);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservationRules"] });
      queryClient.invalidateQueries({ queryKey: ["extendedConfig"] });
    },
  });
}

// ── Guest Form Settings ───────────────────────────────────────────────────────

export function useGuestFormSettings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<BackendGuestForm>({
    queryKey: ["guestFormSettings"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const cfg = await fetchExtendedConfig(actor);
      return cfg.guestForm;
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useUpdateGuestFormSettings() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, BackendGuestForm>({
    mutationFn: async (form) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.updateGuestFormSettings(form);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guestFormSettings"] });
      queryClient.invalidateQueries({ queryKey: ["extendedConfig"] });
    },
  });
}

// ── Integration Settings ──────────────────────────────────────────────────────

export function useIntegrationSettings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<BackendIntegration>({
    queryKey: ["integrationSettings"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const cfg = await fetchExtendedConfig(actor);
      return cfg.integrations;
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useUpdateIntegrationSettings() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, BackendIntegration>({
    mutationFn: async (integrations) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.updateIntegrationSettings(integrations);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrationSettings"] });
      queryClient.invalidateQueries({ queryKey: ["extendedConfig"] });
    },
  });
}

// ── Notification Settings ─────────────────────────────────────────────────────

export function useNotificationSettings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<BackendNotifications>({
    queryKey: ["notificationSettings"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const cfg = await fetchExtendedConfig(actor);
      return cfg.notifications;
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useUpdateNotificationSettings() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, BackendNotifications>({
    mutationFn: async (notifications) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.updateNotificationSettings(notifications);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationSettings"] });
      queryClient.invalidateQueries({ queryKey: ["extendedConfig"] });
    },
  });
}

// ── Table Group Definitions ───────────────────────────────────────────────────

export interface TableGroupDefinition {
  id: string;
  name: string;
  tableIds: string[];
  description: string;
  totalCapacity: number;
}

export function useTableGroupDefinitions() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TableGroupDefinition[]>({
    queryKey: ["tableGroupDefinitions"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getTableGroupDefinitions();
        if (result.__kind__ === "err") return [];
        return result.ok.map((g) => ({
          id: String(g.id),
          name: g.name,
          tableIds: Array.isArray(g.tableIds) ? g.tableIds.map(String) : [],
          description: g.description ?? "",
          totalCapacity: Number(g.totalCapacity ?? 0),
        }));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useCreateTableGroupDefinition() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { name: string; tableIds: string[]; description: string }
  >({
    mutationFn: async ({ name, tableIds, description }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.createTableGroupDefinition(
        name,
        tableIds,
        description,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tableGroupDefinitions"],
      });
    },
  });
}

export function useUpdateTableGroupDefinition() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    {
      id: string;
      name: string;
      tableIds: string[];
      description: string;
    }
  >({
    mutationFn: async ({ id, name, tableIds, description }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.updateTableGroupDefinition(
        id,
        name,
        tableIds,
        description,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tableGroupDefinitions"],
      });
    },
  });
}

export function useDeleteTableGroupDefinition() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.deleteTableGroupDefinition(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tableGroupDefinitions"],
      });
    },
  });
}

// ── Legacy compatibility ──────────────────────────────────────────────────────
// These save/load functions are kept for components that still reference them,
// but they now delegate to React Query cache rather than raw localStorage.

export function saveOpeningHours(_config: OpeningHoursConfig): void {
  // no-op: use useUpdateServiceHours mutation instead
}

export function saveCapacityConfig(_config: CapacityConfig): void {
  // no-op: use useUpdateCapacityConfig mutation instead
}

export function saveBrandingConfig(_config: BrandingConfig): void {
  // no-op: use useUpdateBrandingConfig mutation instead
}
