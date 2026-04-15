import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type GeneralInfo,
  useGeneralInfo,
  useUpdateGeneralInfo,
} from "@/hooks/useSettings";
import { Building2, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const CURRENCIES = ["EUR", "USD", "GBP", "CHF"] as const;

const TIMEZONES = [
  "Europe/Brussels",
  "Europe/Amsterdam",
  "Europe/Paris",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Madrid",
  "Europe/Rome",
  "Europe/Zurich",
  "Europe/Vienna",
  "Europe/Warsaw",
] as const;

export default function GeneralSettingsPage() {
  const { t } = useTranslation("dashboard");
  const { data, isLoading } = useGeneralInfo();
  const updateMutation = useUpdateGeneralInfo();

  const [form, setForm] = useState<GeneralInfo>({
    restaurantName: "",
    logoUrl: "",
    currency: "EUR",
    timezone: "Europe/Brussels",
    contactPhone: "",
    contactEmail: "",
  });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (data) {
      setForm(data);
      setIsDirty(false);
    }
  }, [data]);

  const set = <K extends keyof GeneralInfo>(key: K, value: GeneralInfo[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setIsDirty(true);
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
    <div className="max-w-2xl space-y-6" data-ocid="general-settings-page">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {t("settings.nav.general")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("settings.general.subtitle")}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {t("settings.general.section")}
          </h2>
        </div>

        <div className="px-6 py-6 space-y-5">
          {/* Restaurant name */}
          <div className="space-y-2">
            <Label
              htmlFor="restaurantName"
              className="text-sm font-medium text-foreground"
            >
              {t("settings.general.restaurantName")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="restaurantName"
              value={form.restaurantName}
              onChange={(e) => set("restaurantName", e.target.value)}
              placeholder="Restaurant ZenReserve"
              className="bg-background border-border"
              data-ocid="general-restaurant-name"
              required
            />
          </div>

          {/* Logo URL */}
          <div className="space-y-2">
            <Label
              htmlFor="logoUrl"
              className="text-sm font-medium text-foreground"
            >
              {t("settings.general.logoUrl")}
            </Label>
            <Input
              id="logoUrl"
              type="url"
              value={form.logoUrl}
              onChange={(e) => set("logoUrl", e.target.value)}
              placeholder="https://example.com/logo.png"
              className="bg-background border-border"
              data-ocid="general-logo-url"
            />
            <p className="text-xs text-muted-foreground">
              {t("settings.general.logoUrlHint")}
            </p>
          </div>

          {/* Currency + Timezone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="currency"
                className="text-sm font-medium text-foreground"
              >
                {t("settings.general.currency")}
              </Label>
              <select
                id="currency"
                value={form.currency}
                onChange={(e) =>
                  set("currency", e.target.value as GeneralInfo["currency"])
                }
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                data-ocid="general-currency"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="timezone"
                className="text-sm font-medium text-foreground"
              >
                {t("settings.general.timezone")}
              </Label>
              <select
                id="timezone"
                value={form.timezone}
                onChange={(e) => set("timezone", e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                data-ocid="general-timezone"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact phone */}
          <div className="space-y-2">
            <Label
              htmlFor="contactPhone"
              className="text-sm font-medium text-foreground"
            >
              {t("settings.general.contactPhone")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contactPhone"
              type="tel"
              value={form.contactPhone}
              onChange={(e) => set("contactPhone", e.target.value)}
              placeholder="+32 2 000 00 00"
              className="bg-background border-border"
              data-ocid="general-contact-phone"
              required
            />
          </div>

          {/* Contact email */}
          <div className="space-y-2">
            <Label
              htmlFor="contactEmail"
              className="text-sm font-medium text-foreground"
            >
              {t("settings.general.contactEmail")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contactEmail"
              type="email"
              value={form.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
              placeholder="info@restaurant.be"
              className="bg-background border-border"
              data-ocid="general-contact-email"
              required
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between gap-4">
          {isDirty && (
            <p className="text-xs text-muted-foreground">
              {t("settings.unsavedChanges")}
            </p>
          )}
          <div className="ml-auto">
            <Button
              type="submit"
              disabled={updateMutation.isPending || !isDirty}
              className="gap-2"
              data-ocid="general-save-btn"
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
