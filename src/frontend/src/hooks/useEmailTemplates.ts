import { createActor } from "@/backend";
import type { EmailTemplate as BackendEmailTemplate } from "@/backend.d.ts";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

// ── LocalStorage helpers (migration fallback only) ────────────────────────────

function loadAllFromStorage(): Record<TemplateType, EmailTemplate> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Record<TemplateType, EmailTemplate>;
  } catch {
    // ignore
  }
  return null;
}

function getDefaultTemplates(): Record<TemplateType, EmailTemplate> {
  return Object.fromEntries(
    TEMPLATE_TYPES.map((t) => [t, { id: t, ...DEFAULT_TEMPLATES[t] }]),
  ) as Record<TemplateType, EmailTemplate>;
}

// ── Backend ↔ Frontend type mapping ──────────────────────────────────────────

function fromBackend(bt: BackendEmailTemplate): EmailTemplate {
  return {
    id: bt.id || (bt.templateType as TemplateType),
    templateType: bt.templateType as TemplateType,
    subject: bt.subject,
    heading: bt.heading,
    bodyHtml: bt.bodyHtml,
    footer: bt.footer,
    accentColor: bt.accentColor,
    backgroundColor: bt.backgroundColor,
    logoUrl: bt.logoUrl,
  };
}

function toBackend(t: EmailTemplate): BackendEmailTemplate {
  return {
    id: t.id,
    templateType: t.templateType,
    subject: t.subject,
    heading: t.heading,
    bodyHtml: t.bodyHtml,
    footer: t.footer,
    accentColor: t.accentColor,
    backgroundColor: t.backgroundColor,
    logoUrl: t.logoUrl,
  };
}

// ── Query key ─────────────────────────────────────────────────────────────────

const QK = ["emailTemplates"] as const;

// ── useEmailTemplates — load all ──────────────────────────────────────────────

export function useEmailTemplates() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Record<TemplateType, EmailTemplate>>({
    queryKey: QK,
    queryFn: async () => {
      if (!actor) return getDefaultTemplates();

      // Load from backend
      const backendTemplates = await actor.getEmailTemplates();

      if (backendTemplates.length > 0) {
        // Backend has data — build a map, fill missing types with defaults
        const result = getDefaultTemplates();
        for (const bt of backendTemplates) {
          const type = bt.templateType as TemplateType;
          if (TEMPLATE_TYPES.includes(type)) {
            result[type] = fromBackend(bt);
          }
        }
        return result;
      }

      // Backend is empty — attempt migration from localStorage
      const stored = loadAllFromStorage();
      if (stored) {
        // Migrate: push all localStorage templates to backend
        const templatesArray = Object.values(stored).map(toBackend);
        try {
          await actor.saveEmailTemplates(templatesArray);
          // Clear localStorage after successful migration
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // Migration failed — still return localStorage data
        }
        return stored;
      }

      // Neither backend nor localStorage has data — return defaults
      return getDefaultTemplates();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ── useSaveEmailTemplate ──────────────────────────────────────────────────────

export function useSaveEmailTemplate() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, EmailTemplate>({
    mutationFn: async (template) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.saveEmailTemplate(toBackend(template));
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onMutate: async (template) => {
      // Optimistic update: reflect changes immediately
      await queryClient.cancelQueries({ queryKey: QK });
      const prev =
        queryClient.getQueryData<Record<TemplateType, EmailTemplate>>(QK);
      queryClient.setQueryData<Record<TemplateType, EmailTemplate>>(
        QK,
        (old) => {
          if (!old) return old;
          return { ...old, [template.templateType]: template };
        },
      );
      return { prev };
    },
    onError: (_err, _template, context) => {
      // Revert optimistic update on failure
      if (context && typeof context === "object" && "prev" in context) {
        queryClient.setQueryData(QK, context.prev);
      }
      toast.error("Sjabloon opslaan mislukt. Probeer opnieuw.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK });
    },
  });
}

// ── useResetEmailTemplate ─────────────────────────────────────────────────────

export function useResetEmailTemplate() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, TemplateType>({
    mutationFn: async (templateType) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.resetEmailTemplate(templateType);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onMutate: async (templateType) => {
      await queryClient.cancelQueries({ queryKey: QK });
      const prev =
        queryClient.getQueryData<Record<TemplateType, EmailTemplate>>(QK);
      queryClient.setQueryData<Record<TemplateType, EmailTemplate>>(
        QK,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            [templateType]: {
              id: templateType,
              ...DEFAULT_TEMPLATES[templateType],
            },
          };
        },
      );
      return { prev };
    },
    onError: (_err, _type, context) => {
      if (context && typeof context === "object" && "prev" in context) {
        queryClient.setQueryData(QK, context.prev);
      }
      toast.error("Sjabloon resetten mislukt. Probeer opnieuw.");
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
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, HouseStylePayload>({
    mutationFn: async ({ accentColor, backgroundColor, logoUrl }) => {
      if (!actor) throw new Error("Actor not available");
      // Get current templates from cache and update all with house style
      const current =
        queryClient.getQueryData<Record<TemplateType, EmailTemplate>>(QK) ??
        getDefaultTemplates();
      const updated = TEMPLATE_TYPES.map((type) => ({
        ...current[type],
        accentColor,
        backgroundColor,
        logoUrl,
      }));
      const result = await actor.saveEmailTemplates(updated.map(toBackend));
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onMutate: async ({ accentColor, backgroundColor, logoUrl }) => {
      await queryClient.cancelQueries({ queryKey: QK });
      const prev =
        queryClient.getQueryData<Record<TemplateType, EmailTemplate>>(QK);
      queryClient.setQueryData<Record<TemplateType, EmailTemplate>>(
        QK,
        (old) => {
          if (!old) return old;
          const result = { ...old };
          for (const type of TEMPLATE_TYPES) {
            result[type] = {
              ...result[type],
              accentColor,
              backgroundColor,
              logoUrl,
            };
          }
          return result;
        },
      );
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context && typeof context === "object" && "prev" in context) {
        queryClient.setQueryData(QK, context.prev);
      }
      toast.error("Huisstijl toepassen mislukt. Probeer opnieuw.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK });
    },
  });
}
