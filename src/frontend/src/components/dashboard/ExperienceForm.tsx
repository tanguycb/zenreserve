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

interface ExperienceFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Experience, "id"> | Experience) => void;
  initial?: Experience | null;
  isSaving?: boolean;
}

interface FormState {
  name: string;
  description: string;
  price: string;
  available: boolean;
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
};

export function ExperienceForm({
  open,
  onClose,
  onSave,
  initial = null,
  isSaving = false,
}: ExperienceFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const titleId = "experience-form-title";

  useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          name: initial.name,
          description: initial.description,
          price: (initial.price / 100).toFixed(2),
          available: initial.available,
        });
      } else {
        setForm(EMPTY);
      }
      setErrors({});
    }
  }, [open, initial]);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Naam is verplicht";
    if (!form.description.trim())
      errs.description = "Beschrijving is verplicht";
    const priceNum = Number.parseFloat(form.price);
    if (Number.isNaN(priceNum) || priceNum < 0)
      errs.price = "Voer een geldig bedrag in (bijv. 95.00)";
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

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md gap-0 p-0 overflow-hidden border-border bg-card"
        aria-labelledby={titleId}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle
            id={titleId}
            className="text-lg font-semibold text-foreground"
          >
            {initial ? "Ervaring bewerken" : "Ervaring toevoegen"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="exp-name"
              className="text-sm font-medium text-foreground"
            >
              Naam <span className="text-red-400">*</span>
            </Label>
            <Input
              id="exp-name"
              value={form.name}
              onChange={(e) => field("name", e.target.value)}
              placeholder="Chef's Tasting Menu"
              className={`bg-muted/20 border-border ${errors.name ? "border-red-500/60" : ""}`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "exp-name-err" : undefined}
              data-ocid="exp-name-input"
            />
            {errors.name && (
              <p
                id="exp-name-err"
                className="text-xs text-red-400"
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
              Beschrijving <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="exp-desc"
              value={form.description}
              onChange={(e) => field("description", e.target.value)}
              placeholder="Een culinaire reis van 7 gangen..."
              className={`bg-muted/20 border-border resize-none min-h-[80px] ${errors.description ? "border-red-500/60" : ""}`}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "exp-desc-err" : undefined}
              data-ocid="exp-desc-input"
            />
            {errors.description && (
              <p
                id="exp-desc-err"
                className="text-xs text-red-400"
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
              Prijs per persoon (EUR)
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
                className={`pl-7 bg-muted/20 border-border ${errors.price ? "border-red-500/60" : ""}`}
                aria-invalid={!!errors.price}
                aria-describedby={errors.price ? "exp-price-err" : undefined}
                data-ocid="exp-price-input"
              />
            </div>
            {errors.price && (
              <p
                id="exp-price-err"
                className="text-xs text-red-400"
                role="alert"
              >
                {errors.price}
              </p>
            )}
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between rounded-lg bg-muted/20 px-4 py-3 border border-border">
            <div>
              <Label
                htmlFor="exp-active"
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                Actief
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Zichtbaar voor gasten in de widget
              </p>
            </div>
            <Switch
              id="exp-active"
              checked={form.available}
              onCheckedChange={(v) => field("available", v)}
              data-ocid="exp-active-toggle"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/10">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            data-ocid="exp-form-cancel"
          >
            Annuleren
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="exp-form-save"
          >
            {isSaving ? "Opslaan..." : initial ? "Bijwerken" : "Toevoegen"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
