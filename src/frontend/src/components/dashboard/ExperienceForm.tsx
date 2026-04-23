import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Experience } from "@/types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ExperienceFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Experience, "id"> | Experience) => void;
  initial?: Experience | null;
  isSaving?: boolean;
  /** Available services from settings (id + label) */
  services?: Array<{ id: string; label: string }>;
}

interface FormState {
  name: string;
  description: string;
  price: string;
  available: boolean;
  required: boolean;
  serviceIds: string[];
  dayOfWeek: number[];
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
}

const EMPTY: FormState = {
  name: "",
  description: "",
  price: "",
  available: true,
  required: false,
  serviceIds: [],
  dayOfWeek: [],
};

const ALL_DAYS: Array<{ value: number; labelKey: string }> = [
  { value: 1, labelKey: "settings.days.mon" },
  { value: 2, labelKey: "settings.days.tue" },
  { value: 3, labelKey: "settings.days.wed" },
  { value: 4, labelKey: "settings.days.thu" },
  { value: 5, labelKey: "settings.days.fri" },
  { value: 6, labelKey: "settings.days.sat" },
  { value: 0, labelKey: "settings.days.sun" },
];

const DEFAULT_SERVICES = [
  { id: "lunch", labelKey: "experiences.serviceLunch" },
  { id: "diner", labelKey: "experiences.serviceDiner" },
];

export function ExperienceForm({
  open,
  onClose,
  onSave,
  initial = null,
  isSaving = false,
  services,
}: ExperienceFormProps) {
  const { t } = useTranslation("dashboard");
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const titleId = "experience-form-title";

  const resolvedServices =
    services && services.length > 0
      ? services
      : DEFAULT_SERVICES.map((s) => ({
          id: s.id,
          label: t(s.labelKey, { defaultValue: s.id }),
        }));

  useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          name: initial.name,
          description: initial.description,
          price: (initial.price / 100).toFixed(2),
          available: initial.available,
          required: initial.required,
          serviceIds: initial.serviceIds ?? [],
          dayOfWeek: initial.dayOfWeek ?? [],
        });
      } else {
        setForm(EMPTY);
      }
      setErrors({});
    }
  }, [open, initial]);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim())
      errs.name = t("settings.experiences.nameRequired", {
        defaultValue: "Naam is verplicht",
      });
    if (!form.description.trim())
      errs.description = t("settings.experiences.descriptionRequired", {
        defaultValue: "Beschrijving is verplicht",
      });
    const priceNum = Number.parseFloat(form.price);
    if (Number.isNaN(priceNum) || priceNum < 0)
      errs.price = t("settings.experiences.priceInvalid", {
        defaultValue: "Voer een geldig bedrag in (bijv. 95.00)",
      });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const priceInCents = Math.round(Number.parseFloat(form.price) * 100);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: priceInCents,
      available: form.available,
      required: form.required,
      serviceIds: form.serviceIds,
      dayOfWeek: form.dayOfWeek,
    };
    if (initial) {
      onSave({ ...payload, id: initial.id, tag: initial.tag });
    } else {
      onSave(payload);
    }
    onClose();
  };

  const field = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleService = (id: string) => {
    setForm((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(id)
        ? prev.serviceIds.filter((s) => s !== id)
        : [...prev.serviceIds, id],
    }));
  };

  const toggleDay = (value: number) => {
    setForm((prev) => ({
      ...prev,
      dayOfWeek: prev.dayOfWeek.includes(value)
        ? prev.dayOfWeek.filter((d) => d !== value)
        : [...prev.dayOfWeek, value],
    }));
  };

  const allServices = form.serviceIds.length === 0;
  const allDays = form.dayOfWeek.length === 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md gap-0 p-0 overflow-hidden border-border bg-card max-h-[90vh] overflow-y-auto"
        aria-labelledby={titleId}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border sticky top-0 bg-card z-10">
          <DialogTitle
            id={titleId}
            className="text-lg font-semibold text-foreground"
          >
            {initial
              ? t("experiences.editTitle", {
                  defaultValue: "Ervaring bewerken",
                })
              : t("experiences.addTitle", {
                  defaultValue: "Ervaring toevoegen",
                })}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="exp-name"
              className="text-sm font-medium text-foreground"
            >
              {t("experiences.nameLabel", { defaultValue: "Naam" })}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="exp-name"
              value={form.name}
              onChange={(e) => field("name", e.target.value)}
              placeholder="Chef's Tasting Menu"
              className={`bg-muted/20 border-border ${errors.name ? "border-destructive/60" : ""}`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "exp-name-err" : undefined}
              data-ocid="exp-name-input"
            />
            {errors.name && (
              <p
                id="exp-name-err"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="exp-desc"
              className="text-sm font-medium text-foreground"
            >
              {t("experiences.descriptionLabel", {
                defaultValue: "Beschrijving",
              })}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="exp-desc"
              value={form.description}
              onChange={(e) => field("description", e.target.value)}
              placeholder="Een culinaire reis van 7 gangen..."
              className={`bg-muted/20 border-border resize-none min-h-[80px] ${errors.description ? "border-destructive/60" : ""}`}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "exp-desc-err" : undefined}
              data-ocid="exp-desc-input"
            />
            {errors.description && (
              <p
                id="exp-desc-err"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.description}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <Label
              htmlFor="exp-price"
              className="text-sm font-medium text-foreground"
            >
              {t("experiences.priceLabel", {
                defaultValue: "Prijs per persoon (EUR)",
              })}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                €
              </span>
              <Input
                id="exp-price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => field("price", e.target.value)}
                placeholder="95.00"
                className={`pl-7 bg-muted/20 border-border ${errors.price ? "border-destructive/60" : ""}`}
                aria-invalid={!!errors.price}
                aria-describedby={errors.price ? "exp-price-err" : undefined}
                data-ocid="exp-price-input"
              />
            </div>
            {errors.price && (
              <p
                id="exp-price-err"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.price}
              </p>
            )}
          </div>

          {/* Service selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">
                {t("experiences.servicesLabel", {
                  defaultValue: "Van toepassing op service",
                })}
              </Label>
              {allServices && (
                <Badge
                  variant="outline"
                  className="text-[10px] bg-primary/10 text-primary border-primary/20 px-2"
                >
                  {t("experiences.allServices", {
                    defaultValue: "Alle services",
                  })}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground -mt-1">
              {t("experiences.servicesHint", {
                defaultValue:
                  "Selecteer niets = van toepassing op alle services",
              })}
            </p>
            <div className="flex flex-wrap gap-2">
              {resolvedServices.map((svc) => {
                const checked = form.serviceIds.includes(svc.id);
                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => toggleService(svc.id)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors text-sm font-medium ${checked ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-muted/20 text-foreground hover:bg-muted/40"}`}
                    aria-pressed={checked}
                    data-ocid={`exp-service-${svc.id}`}
                  >
                    <span
                      className={`h-3.5 w-3.5 rounded-sm border-2 flex items-center justify-center shrink-0 ${checked ? "bg-primary border-primary" : "border-muted-foreground"}`}
                      aria-hidden="true"
                    >
                      {checked && (
                        <svg
                          viewBox="0 0 10 8"
                          className="h-2 w-2 fill-primary-foreground"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            d="M1 4l3 3 5-6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="capitalize">{svc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day-of-week selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">
                {t("experiences.daysLabel", {
                  defaultValue: "Van toepassing op dagen",
                })}
              </Label>
              {allDays && (
                <Badge
                  variant="outline"
                  className="text-[10px] bg-primary/10 text-primary border-primary/20 px-2"
                >
                  {t("experiences.allDays", {
                    defaultValue: "Alle dagen",
                  })}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground -mt-1">
              {t("experiences.daysHint", {
                defaultValue: "Selecteer niets = van toepassing op alle dagen",
              })}
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_DAYS.map((day) => {
                const checked = form.dayOfWeek.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-2 transition-colors text-xs font-medium ${checked ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-muted/20 text-foreground hover:bg-muted/40"}`}
                    aria-pressed={checked}
                    data-ocid={`exp-day-${day.value}`}
                  >
                    {t(day.labelKey, { defaultValue: String(day.value) })}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between rounded-lg bg-muted/20 px-4 py-3 border border-border">
            <div>
              <Label
                htmlFor="exp-active"
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                {t("experiences.activeLabel", { defaultValue: "Actief" })}
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("experiences.activeHint", {
                  defaultValue: "Zichtbaar voor gasten in de widget",
                })}
              </p>
            </div>
            <Switch
              id="exp-active"
              checked={form.available}
              onCheckedChange={(v) => field("available", v)}
              data-ocid="exp-active-toggle"
            />
          </div>

          {/* Required toggle */}
          <div className="flex items-center justify-between rounded-lg bg-muted/20 px-4 py-3 border border-border">
            <div>
              <Label
                htmlFor="exp-required"
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                {t("experiences.requiredLabel", {
                  defaultValue: "Verplicht",
                })}
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {form.required
                  ? t("experiences.requiredHintOn", {
                      defaultValue:
                        "Gast moet een ervaring kiezen — geen 'Geen voorkeur' optie",
                    })
                  : t("experiences.requiredHintOff", {
                      defaultValue:
                        "Gast kan 'Geen voorkeur' kiezen of een ervaring overslaan",
                    })}
              </p>
            </div>
            <Switch
              id="exp-required"
              checked={form.required}
              onCheckedChange={(v) => field("required", v)}
              data-ocid="exp-required-toggle"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/10 sticky bottom-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            data-ocid="exp-form-cancel"
          >
            {t("common.cancel", { defaultValue: "Annuleren" })}
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="exp-form-save"
          >
            {isSaving
              ? t("common.saving", { defaultValue: "Opslaan..." })
              : initial
                ? t("common.update", { defaultValue: "Bijwerken" })
                : t("common.add", { defaultValue: "Toevoegen" })}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
