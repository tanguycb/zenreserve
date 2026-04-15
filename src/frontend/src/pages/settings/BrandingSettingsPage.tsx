import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  type BrandingConfig,
  useBrandingConfig,
  useUpdateBrandingConfig,
} from "@/hooks/useSettings";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Monitor,
  Moon,
  Palette,
  Save,
  Sun,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const LANGUAGES = [
  { value: "nl", label: "Nederlands (NL)" },
  { value: "en", label: "English (EN)" },
  { value: "fr", label: "Français (FR)" },
  { value: "de", label: "Deutsch (DE)" },
] as const;

const THEME_KEY = "zenreserve_theme";

function loadTheme(): "dark" | "light" {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light") return "light";
  } catch {
    // ignore
  }
  return "dark";
}

function applyTheme(theme: "dark" | "light") {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
  const root = document.documentElement;
  if (theme === "light") {
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
  } else {
    root.classList.add("dark");
    root.removeAttribute("data-theme");
  }
}

// ── Live Preview ──────────────────────────────────────────────────────────────
function WidgetPreview({
  primaryColor,
  accentColor,
  logoUrl,
  welcomeText,
}: {
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
  welcomeText: string;
}) {
  const { t } = useTranslation("dashboard");
  return (
    <div
      className="rounded-xl border border-border overflow-hidden shadow-md w-full"
      style={{ background: "#FAF7F0" }}
      aria-label={t("settings.branding.previewAriaLabel")}
      data-ocid="branding-widget-preview"
    >
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ background: primaryColor }}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="logo"
            className="h-7 w-7 rounded-md object-contain bg-white/20"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div
            className="h-7 w-7 rounded-md flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "rgba(255,255,255,0.25)" }}
          >
            Z
          </div>
        )}
        <span className="text-white font-semibold text-sm truncate">
          {welcomeText || t("settings.branding.previewWelcome")}
        </span>
      </div>
      <div className="px-4 py-3 space-y-2">
        <p className="text-xs font-medium" style={{ color: "#1F2937" }}>
          {t("settings.branding.previewSelectDate")}
        </p>
        <div className="flex gap-1.5 flex-wrap">
          {["Vr 12", "Za 13", "Zo 14", "Ma 15"].map((day, i) => (
            <div
              key={day}
              className="px-2.5 py-1 rounded-lg text-xs font-medium"
              style={
                i === 1
                  ? { background: primaryColor, color: "#fff" }
                  : {
                      background: "#F3F4F6",
                      color: "#1F2937",
                      border: "1px solid #E2E8F0",
                    }
              }
            >
              {day}
            </div>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap mt-1">
          {["12:00", "12:30", "19:00", "20:00"].map((slot, i) => (
            <div
              key={slot}
              className="px-2.5 py-1 rounded-lg text-xs font-medium"
              style={
                i === 2
                  ? { background: accentColor, color: "#fff" }
                  : {
                      background: "#F3F4F6",
                      color: "#1F2937",
                      border: "1px solid #E2E8F0",
                    }
              }
            >
              {slot}
            </div>
          ))}
        </div>
        <button
          className="w-full mt-2 py-1.5 rounded-lg text-white text-xs font-semibold"
          style={{ background: primaryColor }}
          tabIndex={-1}
          aria-hidden="true"
          type="button"
        >
          {t("settings.branding.previewCta")}
        </button>
      </div>
    </div>
  );
}

// ── Color field ───────────────────────────────────────────────────────────────
function ColorField({
  id,
  label,
  value,
  onChange,
  "data-ocid": dataOcid,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  "data-ocid"?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            id={id}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
            aria-label={label}
          />
          <span
            role="button"
            tabIndex={0}
            onClick={() => document.getElementById(id)?.click()}
            onKeyDown={(e) =>
              e.key === "Enter" && document.getElementById(id)?.click()
            }
            className="block h-9 w-9 rounded-lg cursor-pointer border-2 border-border shadow-sm transition-transform hover:scale-105"
            style={{ background: value }}
            aria-label={label}
          />
        </div>
        <Input
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
          }}
          placeholder="#22C55E"
          className="bg-background border-border font-mono text-sm w-32"
          data-ocid={dataOcid}
          maxLength={7}
        />
      </div>
    </div>
  );
}

// ── Section card wrapper ──────────────────────────────────────────────────────
function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 gradient-card shadow-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-border/40 flex items-center gap-2.5">
        {Icon && <Icon className="h-4 w-4 text-primary" />}
        <h2 className="heading-h2 text-base">{title}</h2>
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BrandingSettingsPage() {
  const { t } = useTranslation("dashboard");
  const { data, isLoading } = useBrandingConfig();
  const updateMutation = useUpdateBrandingConfig();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<BrandingConfig>({
    primaryColor: "#22C55E",
    accentColor: "#3B82F6",
    logoUrl: "",
    welcomeText: "",
    confirmationText: "",
    defaultLanguage: "nl",
    sendConfirmationEmail: true,
    sendReminderEmail: true,
    reminderHoursBefore: 24,
  });
  const [isDirty, setIsDirty] = useState(false);
  const [darkMode, setDarkMode] = useState<"dark" | "light">(loadTheme);
  const [logoPreviewSrc, setLogoPreviewSrc] = useState("");

  useEffect(() => {
    if (data) {
      setForm(data);
      setIsDirty(false);
    }
  }, [data]);

  useEffect(() => {
    setLogoPreviewSrc(form.logoUrl);
  }, [form.logoUrl]);

  const set = <K extends keyof BrandingConfig>(
    key: K,
    value: BrandingConfig[K],
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
    setIsDirty(true);
  };

  const handleThemeToggle = (checked: boolean) => {
    const theme = checked ? "light" : "dark";
    setDarkMode(theme);
    applyTheme(theme);
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setLogoPreviewSrc(result);
      set("logoUrl", result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(form);
      setIsDirty(false);
      toast.success(t("settings.saved"));
    } catch {
      toast.error(t("settings.saveError"));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6" data-ocid="branding-settings-page">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Palette className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="heading-h1 text-xl md:text-2xl">
            {t("settings.nav.branding")}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
            {t("settings.branding.subtitle")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Section 1: Dark/Light Mode Toggle ── */}
        <SectionCard title={t("settings.branding.themeTitle")} icon={Monitor}>
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-1">
              <Label className="text-sm font-semibold text-foreground">
                {t("settings.branding.darkMode")}
              </Label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("settings.branding.darkModeHint")}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Moon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    darkMode === "dark"
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {t("settings.branding.darkModeLabel")}
                </span>
                <Switch
                  checked={darkMode === "light"}
                  onCheckedChange={handleThemeToggle}
                  data-ocid="branding-theme-toggle"
                  aria-label={t("settings.branding.darkMode")}
                  className="mx-1"
                />
                <Sun
                  className={cn(
                    "h-4 w-4 transition-colors",
                    darkMode === "light"
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {t("settings.branding.lightModeLabel")}
                </span>
              </div>
            </div>
            {/* Visual indicator */}
            <div className="shrink-0 flex gap-2">
              <div
                className={cn(
                  "h-12 w-12 rounded-xl border-2 flex items-center justify-center transition-all",
                  darkMode === "dark"
                    ? "border-primary bg-[#0F172A]"
                    : "border-border bg-muted/30",
                )}
              >
                <Moon
                  className={cn(
                    "h-5 w-5",
                    darkMode === "dark"
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                />
              </div>
              <div
                className={cn(
                  "h-12 w-12 rounded-xl border-2 flex items-center justify-center transition-all",
                  darkMode === "light"
                    ? "border-primary bg-card"
                    : "border-border bg-muted/30",
                )}
              >
                <Sun
                  className={cn(
                    "h-5 w-5",
                    darkMode === "light"
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── Section 2: Colors + Live Preview ── */}
        <SectionCard title={t("settings.branding.colorsTitle")} icon={Palette}>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-5">
              <ColorField
                id="primaryColor"
                label={t("settings.branding.primaryColor")}
                value={form.primaryColor}
                onChange={(v) => set("primaryColor", v)}
                data-ocid="branding-primary-color"
              />
              <ColorField
                id="accentColor"
                label={t("settings.branding.accentColor")}
                value={form.accentColor}
                onChange={(v) => set("accentColor", v)}
                data-ocid="branding-accent-color"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Monitor className="h-3.5 w-3.5" />
                {t("settings.branding.livePreview")}
              </div>
              <WidgetPreview
                primaryColor={form.primaryColor}
                accentColor={form.accentColor}
                logoUrl={logoPreviewSrc}
                welcomeText={form.welcomeText}
              />
            </div>
          </div>
        </SectionCard>

        {/* ── Section 3: Logo Upload ── */}
        <SectionCard title={t("settings.branding.logoTitle")} icon={Upload}>
          <div className="space-y-4">
            {/* File upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {t("settings.branding.logoUpload")}
              </Label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="sr-only"
                  onChange={handleLogoFileChange}
                  aria-label={t("settings.branding.logoUpload")}
                  data-ocid="branding-logo-file-input"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
                  data-ocid="branding-logo-upload-btn"
                >
                  <Upload className="h-4 w-4" />
                  {t("settings.branding.logoUploadBtn")}
                </Button>
                {logoPreviewSrc && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      setLogoPreviewSrc("");
                      set("logoUrl", "");
                    }}
                  >
                    {t("settings.branding.logoRemove")}
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("settings.branding.logoUploadHint")}
              </p>
            </div>

            {/* URL fallback */}
            <div className="space-y-2">
              <Label
                htmlFor="logoUrl"
                className="text-sm font-medium text-foreground"
              >
                {t("settings.branding.logoUrl")}
              </Label>
              <Input
                id="logoUrl"
                type="url"
                value={form.logoUrl.startsWith("data:") ? "" : form.logoUrl}
                onChange={(e) => set("logoUrl", e.target.value)}
                placeholder="https://example.com/logo.png"
                className="bg-background border-border"
                data-ocid="branding-logo-url"
              />
              <p className="text-xs text-muted-foreground">
                {t("settings.branding.logoUrlHint")}
              </p>
            </div>

            {/* Logo preview */}
            {logoPreviewSrc && (
              <div
                className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-muted/10"
                data-ocid="branding-logo-preview"
              >
                <img
                  src={logoPreviewSrc}
                  alt={t("settings.branding.logoPreviewAlt")}
                  className="h-14 w-14 rounded-xl object-contain border border-border/60 bg-muted/20 p-1"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/assets/images/placeholder.svg";
                  }}
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t("settings.branding.logoPreviewLabel")}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-xs">
                    {logoPreviewSrc.startsWith("data:")
                      ? t("settings.branding.logoUploadedFile")
                      : logoPreviewSrc}
                  </p>
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        {/* ── Section 4: Texts ── */}
        <SectionCard title={t("settings.branding.textsTitle")}>
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="welcomeText"
                  className="text-sm font-medium text-foreground"
                >
                  {t("settings.branding.welcomeText")}
                </Label>
                <span className="text-xs text-muted-foreground">
                  {form.welcomeText.length}/200
                </span>
              </div>
              <Textarea
                id="welcomeText"
                value={form.welcomeText}
                onChange={(e) => set("welcomeText", e.target.value)}
                placeholder={t("settings.branding.welcomeTextPlaceholder")}
                className="bg-background border-border resize-none leading-relaxed"
                rows={3}
                maxLength={200}
                data-ocid="branding-welcome-text"
              />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("settings.branding.welcomeTextHint")}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="confirmationText"
                  className="text-sm font-medium text-foreground"
                >
                  {t("settings.branding.confirmationText")}
                </Label>
                <span className="text-xs text-muted-foreground">
                  {form.confirmationText.length}/200
                </span>
              </div>
              <Textarea
                id="confirmationText"
                value={form.confirmationText}
                onChange={(e) => set("confirmationText", e.target.value)}
                placeholder={t("settings.branding.confirmationTextPlaceholder")}
                className="bg-background border-border resize-none leading-relaxed"
                rows={3}
                maxLength={200}
                data-ocid="branding-confirmation-text"
              />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("settings.branding.confirmationTextHint")}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* ── Section 5: Language ── */}
        <SectionCard title={t("settings.branding.languageTitle")}>
          <div className="space-y-2">
            <Label
              htmlFor="defaultLanguage"
              className="text-sm font-medium text-foreground"
            >
              {t("settings.branding.defaultLanguage")}
            </Label>
            <select
              id="defaultLanguage"
              value={form.defaultLanguage}
              onChange={(e) =>
                set(
                  "defaultLanguage",
                  e.target.value as BrandingConfig["defaultLanguage"],
                )
              }
              className="w-full max-w-xs rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              data-ocid="branding-default-language"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              {t("settings.branding.defaultLanguageHint")}
            </p>
          </div>
        </SectionCard>

        {/* ── Section 6: Automatic messages ── */}
        <SectionCard title={t("settings.branding.autoMessagesTitle")}>
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-foreground">
                  {t("settings.branding.sendConfirmationEmail")}
                </Label>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("settings.branding.sendConfirmationEmailHint")}
                </p>
              </div>
              <Switch
                checked={form.sendConfirmationEmail}
                onCheckedChange={(v) => set("sendConfirmationEmail", v)}
                data-ocid="branding-send-confirmation"
                aria-label={t("settings.branding.sendConfirmationEmail")}
              />
            </div>

            <div className="border-t border-border/40" />

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-foreground">
                  {t("settings.branding.sendReminderEmail")}
                </Label>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("settings.branding.sendReminderEmailHint")}
                </p>
              </div>
              <Switch
                checked={form.sendReminderEmail}
                onCheckedChange={(v) => set("sendReminderEmail", v)}
                data-ocid="branding-send-reminder"
                aria-label={t("settings.branding.sendReminderEmail")}
              />
            </div>

            {form.sendReminderEmail && (
              <div className="ml-0 pl-4 border-l-2 border-primary/20 space-y-2">
                <Label
                  htmlFor="reminderHoursBefore"
                  className="text-sm font-medium text-foreground"
                >
                  {t("settings.branding.reminderHoursBefore")}
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="reminderHoursBefore"
                    type="number"
                    min={1}
                    max={168}
                    value={form.reminderHoursBefore}
                    onChange={(e) =>
                      set("reminderHoursBefore", Number(e.target.value))
                    }
                    className="bg-background border-border w-24"
                    data-ocid="branding-reminder-hours"
                  />
                  <span className="text-sm text-muted-foreground">
                    {t("settings.branding.hours")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("settings.branding.reminderHoursHint")}
                </p>
              </div>
            )}
          </div>
        </SectionCard>

        {/* ── Save footer ── */}
        <div className="rounded-2xl border border-border/60 gradient-card shadow-lg px-6 py-4 flex items-center justify-between gap-4">
          {isDirty && (
            <p className="text-xs text-muted-foreground">
              {t("settings.unsavedChanges")}
            </p>
          )}
          <div className="ml-auto">
            <Button
              type="submit"
              disabled={updateMutation.isPending || !isDirty}
              className="gap-2 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
              data-ocid="branding-save-btn"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {updateMutation.isPending
                ? t("settings.saving")
                : t("settings.save")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
