import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ── Types ─────────────────────────────────────────────────────────────────────

export type TemplateType =
  | "confirmation"
  | "reminder_24h"
  | "reminder_2h"
  | "cancellation";

export interface EmailTemplate {
  id: string;
  templateType: TemplateType;
  subject: string;
  heading: string;
  bodyHtml: string;
  footer: string;
  accentColor: string;
  backgroundColor: string;
  logoUrl: string;
}

// ── Defaults ──────────────────────────────────────────────────────────────────

export const DEFAULT_TEMPLATES: Record<
  TemplateType,
  Omit<EmailTemplate, "id">
> = {
  confirmation: {
    templateType: "confirmation",
    subject: "Uw reservering bij {{restaurant_name}} is bevestigd",
    heading: "Reservering bevestigd! 🎉",
    bodyHtml:
      "<p>Beste <strong>{{guest_name}}</strong>,</p><p>Wij zijn verheugd uw reservering te bevestigen. We kijken ernaar uit u te verwelkomen.</p><p><strong>📅 Datum:</strong> {{date}}<br/><strong>⏰ Tijd:</strong> {{time}}<br/><strong>👥 Aantal personen:</strong> {{party_size}}<br/><strong>🔖 Reserveringsnummer:</strong> {{reservation_id}}</p>",
    footer: "Met vriendelijke groeten,\n{{restaurant_name}}",
    accentColor: "#c8a96e",
    backgroundColor: "#faf8f5",
    logoUrl: "",
  },
  reminder_24h: {
    templateType: "reminder_24h",
    subject: "Herinnering: uw reservering morgen bij {{restaurant_name}}",
    heading: "Tot morgen! 👋",
    bodyHtml:
      "<p>Beste <strong>{{guest_name}}</strong>,</p><p>Dit is een vriendelijke herinnering dat u morgen een tafel heeft gereserveerd.</p><p><strong>📅 Datum:</strong> {{date}}<br/><strong>⏰ Tijd:</strong> {{time}}<br/><strong>👥 Aantal personen:</strong> {{party_size}}</p><p>Heeft u aanpassingen nodig? Neem dan tijdig contact met ons op.</p>",
    footer: "Tot ziens,\n{{restaurant_name}}",
    accentColor: "#c8a96e",
    backgroundColor: "#faf8f5",
    logoUrl: "",
  },
  reminder_2h: {
    templateType: "reminder_2h",
    subject: "Over 2 uur zien we u bij {{restaurant_name}}",
    heading: "We zien u zo! ✨",
    bodyHtml:
      "<p>Beste <strong>{{guest_name}}</strong>,</p><p>Uw tafel staat klaar — over 2 uur verwachten we u!</p><p><strong>⏰ Tijd:</strong> {{time}}<br/><strong>👥 Aantal personen:</strong> {{party_size}}</p><p>Wij zijn er klaar voor. Tot zo!</p>",
    footer: "Tot straks,\n{{restaurant_name}}",
    accentColor: "#c8a96e",
    backgroundColor: "#faf8f5",
    logoUrl: "",
  },
  cancellation: {
    templateType: "cancellation",
    subject: "Uw reservering bij {{restaurant_name}} is geannuleerd",
    heading: "Reservering geannuleerd",
    bodyHtml:
      "<p>Beste <strong>{{guest_name}}</strong>,</p><p>Uw reservering op <strong>{{date}}</strong> om <strong>{{time}}</strong> is geannuleerd ({{reservation_id}}).</p><p>We hopen u binnenkort te mogen verwelkomen. Heeft u vragen, neem dan gerust contact met ons op.</p>",
    footer: "Met vriendelijke groeten,\n{{restaurant_name}}",
    accentColor: "#c8a96e",
    backgroundColor: "#faf8f5",
    logoUrl: "",
  },
};

const STORAGE_KEY = "zenreserve_email_templates_v2";
const TEMPLATE_TYPES: TemplateType[] = [
  "confirmation",
  "reminder_24h",
  "reminder_2h",
  "cancellation",
];

// ── LocalStorage helpers ──────────────────────────────────────────────────────

function loadAllFromStorage(): Record<TemplateType, EmailTemplate> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Record<TemplateType, EmailTemplate>;
  } catch {
    // ignore
  }
  return Object.fromEntries(
    TEMPLATE_TYPES.map((t) => [t, { id: t, ...DEFAULT_TEMPLATES[t] }]),
  ) as Record<TemplateType, EmailTemplate>;
}

function saveAllToStorage(all: Record<TemplateType, EmailTemplate>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

// ── Query key ─────────────────────────────────────────────────────────────────

const QK = ["emailTemplates"] as const;

// ── useEmailTemplates — load all ──────────────────────────────────────────────

export function useEmailTemplates() {
  // Actor available but backend has no email-template API yet — use localStorage.
  // When the backend exposes getEmailTemplates() we can wire it here.
  const { isFetching } = useActor(createActor);
  return useQuery<Record<TemplateType, EmailTemplate>>({
    queryKey: QK,
    queryFn: () => loadAllFromStorage(),
    enabled: !isFetching,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

// ── useSaveEmailTemplate ──────────────────────────────────────────────────────

export function useSaveEmailTemplate() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, EmailTemplate>({
    mutationFn: async (template) => {
      const all = loadAllFromStorage();
      all[template.templateType as TemplateType] = template;
      saveAllToStorage(all);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK });
    },
  });
}

// ── useResetEmailTemplate ─────────────────────────────────────────────────────

export function useResetEmailTemplate() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, TemplateType>({
    mutationFn: async (templateType) => {
      const all = loadAllFromStorage();
      all[templateType] = {
        id: templateType,
        ...DEFAULT_TEMPLATES[templateType],
      };
      saveAllToStorage(all);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK });
    },
  });
}

// ── useApplyHouseStyleToAll ───────────────────────────────────────────────────

export interface HouseStylePayload {
  accentColor: string;
  backgroundColor: string;
  logoUrl: string;
}

export function useApplyHouseStyleToAll() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, HouseStylePayload>({
    mutationFn: async ({ accentColor, backgroundColor, logoUrl }) => {
      const all = loadAllFromStorage();
      for (const type of TEMPLATE_TYPES) {
        all[type] = { ...all[type], accentColor, backgroundColor, logoUrl };
      }
      saveAllToStorage(all);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK });
    },
  });
}
