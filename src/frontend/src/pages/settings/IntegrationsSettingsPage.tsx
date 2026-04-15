import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Calendar,
  Code2,
  CreditCard,
  ExternalLink,
  Monitor,
  RefreshCw,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────

type PosSystem = "none" | "lightspeed" | "square" | "toast" | "custom";

interface IntegrationsConfig {
  stripeEnabled: boolean;
  stripePublicKey: string;
  mollieEnabled: boolean;
  posSystem: PosSystem;
  customPosName: string;
  calendarSyncEnabled: boolean;
  apiKey: string;
}

// ── Persistence ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "zenreserve_integrations";

function loadConfig(): IntegrationsConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as IntegrationsConfig;
  } catch {
    // ignore
  }
  return {
    stripeEnabled: false,
    stripePublicKey: "",
    mollieEnabled: false,
    posSystem: "none",
    customPosName: "",
    calendarSyncEnabled: false,
    apiKey: generateUUID(),
  };
}

function saveConfig(config: IntegrationsConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionCard({
  icon,
  title,
  subtitle,
  children,
  onSave,
  saving,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onSave: () => void;
  saving?: boolean;
}) {
  const { t } = useTranslation("dashboard");
  return (
    <section className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden">
      <div className="px-6 py-5 border-b border-border flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="px-6 py-6 space-y-5">{children}</div>
      <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end">
        <Button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="gap-2"
        >
          {saving ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {t("settings.save")}
        </Button>
      </div>
    </section>
  );
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  "data-ocid": ocid,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  "data-ocid"?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-0.5">
        <Label
          htmlFor={id}
          className="text-sm font-medium text-foreground cursor-pointer"
        >
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        data-ocid={ocid}
      />
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

const POS_OPTIONS: { value: PosSystem; label: string }[] = [
  { value: "none", label: "None" },
  { value: "lightspeed", label: "Lightspeed" },
  { value: "square", label: "Square" },
  { value: "toast", label: "Toast" },
  { value: "custom", label: "Custom" },
];

export default function IntegrationsSettingsPage() {
  const { t } = useTranslation("dashboard");
  const queryClient = useQueryClient();
  const [config, setConfig] = useState<IntegrationsConfig>(loadConfig);
  const [saving, setSaving] = useState(false);

  // Keep config in sync if storage was updated elsewhere
  useEffect(() => {
    setConfig(loadConfig());
  }, []);

  const set = <K extends keyof IntegrationsConfig>(
    key: K,
    value: IntegrationsConfig[K],
  ) => {
    setConfig((c) => ({ ...c, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    saveConfig(config);
    queryClient.invalidateQueries({ queryKey: ["integrationsConfig"] });
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    toast.success(t("settings.saved"));
  };

  const handleRegenerateApiKey = () => {
    const newKey = generateUUID();
    set("apiKey", newKey);
    const updated = { ...config, apiKey: newKey };
    saveConfig(updated);
    toast.success(t("settings.integrations.apiKeyRegenerated"));
  };

  const bothPaymentsActive = config.stripeEnabled && config.mollieEnabled;

  return (
    <div className="max-w-2xl space-y-8" data-ocid="integrations-settings-page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Code2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {t("settings.nav.integrations")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("settings.integrations.subtitle")}
          </p>
        </div>
      </div>

      {/* ── Section 1: Payments ─────────────────────────────────────────────── */}
      <SectionCard
        icon={<CreditCard className="h-4 w-4 text-primary" />}
        title={t("settings.integrations.payments.title")}
        subtitle={t("settings.integrations.payments.subtitle")}
        onSave={handleSave}
        saving={saving}
      >
        {/* Stripe */}
        <ToggleRow
          id="stripe-enabled"
          label="Stripe"
          description={t("settings.integrations.payments.stripeDesc")}
          checked={config.stripeEnabled}
          onCheckedChange={(v) => set("stripeEnabled", v)}
          data-ocid="stripe-enabled-toggle"
        />

        {config.stripeEnabled && (
          <div className="space-y-2 pl-0 ml-0 animate-in fade-in slide-in-from-top-1 duration-200">
            <Label
              htmlFor="stripe-key"
              className="text-sm font-medium text-foreground"
            >
              {t("settings.integrations.payments.stripeKeyLabel")}
            </Label>
            <Input
              id="stripe-key"
              value={config.stripePublicKey}
              onChange={(e) => set("stripePublicKey", e.target.value)}
              placeholder="pk_live_..."
              className="bg-background border-border font-mono text-sm"
              data-ocid="stripe-public-key-input"
            />
            <p className="text-xs text-muted-foreground">
              {t("settings.integrations.payments.stripeKeyHint")}
            </p>
          </div>
        )}

        <div className="border-t border-border/50 pt-4">
          {/* Mollie */}
          <ToggleRow
            id="mollie-enabled"
            label="Mollie"
            description={t("settings.integrations.payments.mollieDesc")}
            checked={config.mollieEnabled}
            onCheckedChange={(v) => set("mollieEnabled", v)}
            data-ocid="mollie-enabled-toggle"
          />
        </div>

        {/* Warning: both enabled */}
        {bothPaymentsActive && (
          <div
            className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3"
            role="alert"
            data-ocid="both-payments-warning"
          >
            <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-300">
              {t("settings.integrations.payments.bothEnabledWarning")}
            </p>
          </div>
        )}
      </SectionCard>

      {/* ── Section 2: POS System ───────────────────────────────────────────── */}
      <SectionCard
        icon={<Monitor className="h-4 w-4 text-primary" />}
        title={t("settings.integrations.pos.title")}
        subtitle={t("settings.integrations.pos.subtitle")}
        onSave={handleSave}
        saving={saving}
      >
        <div className="space-y-2">
          <Label
            htmlFor="pos-system"
            className="text-sm font-medium text-foreground"
          >
            {t("settings.integrations.pos.label")}
          </Label>
          <select
            id="pos-system"
            value={config.posSystem}
            onChange={(e) => set("posSystem", e.target.value as PosSystem)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            data-ocid="pos-system-select"
          >
            {POS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.value === "none"
                  ? t("settings.integrations.pos.none")
                  : opt.label}
              </option>
            ))}
          </select>
        </div>

        {config.posSystem === "custom" && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <Label
              htmlFor="custom-pos-name"
              className="text-sm font-medium text-foreground"
            >
              {t("settings.integrations.pos.customLabel")}
            </Label>
            <Input
              id="custom-pos-name"
              value={config.customPosName}
              onChange={(e) => set("customPosName", e.target.value)}
              placeholder={t("settings.integrations.pos.customPlaceholder")}
              className="bg-background border-border"
              data-ocid="custom-pos-name-input"
            />
          </div>
        )}

        {config.posSystem !== "none" && config.posSystem !== "custom" && (
          <div className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <ExternalLink className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              {t("settings.integrations.pos.integrationNote", {
                pos: POS_OPTIONS.find((o) => o.value === config.posSystem)
                  ?.label,
              })}
            </p>
          </div>
        )}
      </SectionCard>

      {/* ── Section 3: Calendar Sync ────────────────────────────────────────── */}
      <SectionCard
        icon={<Calendar className="h-4 w-4 text-primary" />}
        title={t("settings.integrations.calendar.title")}
        subtitle={t("settings.integrations.calendar.subtitle")}
        onSave={handleSave}
        saving={saving}
      >
        <ToggleRow
          id="calendar-sync"
          label={t("settings.integrations.calendar.enableLabel")}
          description={t("settings.integrations.calendar.enableDesc")}
          checked={config.calendarSyncEnabled}
          onCheckedChange={(v) => set("calendarSyncEnabled", v)}
          data-ocid="calendar-sync-toggle"
        />

        {config.calendarSyncEnabled && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <p className="text-xs text-muted-foreground rounded-xl border border-border/50 bg-muted/30 px-4 py-3">
              {t("settings.integrations.calendar.comingSoonNote")}
            </p>

            {/* Google Calendar */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted/40 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Google Calendar
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("settings.integrations.calendar.notConnected")}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-border text-muted-foreground"
                data-ocid="google-calendar-connect-btn"
              >
                {t("settings.integrations.calendar.connect")}
              </Button>
            </div>

            {/* Outlook */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted/40 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Microsoft Outlook
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("settings.integrations.calendar.notConnected")}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-border text-muted-foreground"
                data-ocid="outlook-connect-btn"
              >
                {t("settings.integrations.calendar.connect")}
              </Button>
            </div>
          </div>
        )}
      </SectionCard>

      {/* ── Section 4: API Access ───────────────────────────────────────────── */}
      <SectionCard
        icon={<Code2 className="h-4 w-4 text-primary" />}
        title={t("settings.integrations.api.title")}
        subtitle={t("settings.integrations.api.subtitle")}
        onSave={handleSave}
        saving={saving}
      >
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            {t("settings.integrations.api.keyLabel")}
          </Label>
          <div className="flex items-center gap-2">
            <Input
              value={config.apiKey}
              readOnly
              className="bg-background border-border font-mono text-xs text-muted-foreground flex-1"
              data-ocid="api-key-display"
              aria-label={t("settings.integrations.api.keyLabel")}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleRegenerateApiKey}
              className="shrink-0 gap-2 border-border"
              data-ocid="regenerate-api-key-btn"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {t("settings.integrations.api.regenerate")}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("settings.integrations.api.keyHint")}
          </p>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <Code2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            {t("settings.integrations.api.usageNote")}
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
