import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddToWaitlist } from "@/hooks/useDashboard";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface NewWaitlistModalProps {
  open: boolean;
  onClose: () => void;
  defaultDate?: string;
}

const TODAY = new Date().toISOString().split("T")[0];

const TIME_SLOTS: string[] = [];
for (let h = 11; h <= 23; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:00`);
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:30`);
}

interface FormState {
  guestName: string;
  phone: string;
  email: string;
  partySize: number;
  date: string;
  requestedTime: string;
  notes: string;
}

const INITIAL: FormState = {
  guestName: "",
  phone: "",
  email: "",
  partySize: 2,
  date: TODAY,
  requestedTime: "",
  notes: "",
};

interface FieldError {
  guestName?: string;
  phone?: string;
}

export function NewWaitlistModal({
  open,
  onClose,
  defaultDate,
}: NewWaitlistModalProps) {
  const { t } = useTranslation("dashboard");
  const { mutate: addToWaitlist, isPending } = useAddToWaitlist();
  const [form, setForm] = useState<FormState>({
    ...INITIAL,
    date: defaultDate ?? TODAY,
  });
  const [errors, setErrors] = useState<FieldError>({});

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const errs: FieldError = {};
    if (!form.guestName.trim())
      errs.guestName = t("newReservation.errors.nameRequired");
    if (!form.phone.trim())
      errs.phone = t("newReservation.errors.phoneRequired");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    addToWaitlist(
      {
        guestName: form.guestName.trim(),
        guestPhone: form.phone.trim(),
        guestEmail: form.email.trim() || undefined,
        partySize: form.partySize,
        date: form.date,
        requestedTime: form.requestedTime || undefined,
        notes: form.notes.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success(t("waitlist.addedSuccess", { name: form.guestName }));
          setForm({ ...INITIAL, date: defaultDate ?? TODAY });
          setErrors({});
          onClose();
        },
        onError: () => toast.error(t("waitlist.addError")),
      },
    );
  };

  const handleClose = () => {
    setForm({ ...INITIAL, date: defaultDate ?? TODAY });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="gradient-card border-border rounded-2xl max-w-md shadow-elevated">
        <DialogHeader>
          <DialogTitle className="heading-h2 text-foreground">
            {t("waitlist.addTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Guest name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="new-wl-name"
              className="text-sm font-medium text-foreground"
            >
              {t("newReservation.guestName")} *
            </Label>
            <Input
              id="new-wl-name"
              value={form.guestName}
              onChange={(e) => set("guestName", e.target.value)}
              placeholder={t("newReservation.guestNamePlaceholder")}
              className="bg-muted/20 border-border rounded-xl h-10"
              autoFocus
              data-ocid="new-wl-name"
            />
            {errors.guestName && (
              <p className="text-xs text-destructive">{errors.guestName}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label
              htmlFor="new-wl-phone"
              className="text-sm font-medium text-foreground"
            >
              {t("newReservation.phone")} *
            </Label>
            <Input
              id="new-wl-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+32 470 000 000"
              className="bg-muted/20 border-border rounded-xl h-10"
              data-ocid="new-wl-phone"
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Email (optional) */}
          <div className="space-y-1.5">
            <Label
              htmlFor="new-wl-email"
              className="text-sm font-medium text-foreground"
            >
              {t("newReservation.email")}
            </Label>
            <Input
              id="new-wl-email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="gast@voorbeeld.be"
              className="bg-muted/20 border-border rounded-xl h-10"
              data-ocid="new-wl-email"
            />
          </div>

          {/* Party size */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">
              {t("waitlist.partySizeLabel")}
            </Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-xl border-border hover-scale-xs"
                onClick={() =>
                  set("partySize", Math.max(1, form.partySize - 1))
                }
                disabled={form.partySize <= 1}
                aria-label={t("newReservation.decreaseParty")}
                data-ocid="new-wl-party-decrease"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-bold text-xl tabular-nums text-foreground">
                {form.partySize}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-xl border-border hover-scale-xs"
                onClick={() =>
                  set("partySize", Math.min(20, form.partySize + 1))
                }
                disabled={form.partySize >= 20}
                aria-label={t("newReservation.increaseParty")}
                data-ocid="new-wl-party-increase"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {t("newReservation.persons")}
              </span>
            </div>
          </div>

          {/* Date + Time in a 2-col grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="new-wl-date"
                className="text-sm font-medium text-foreground"
              >
                {t("newReservation.date")}
              </Label>
              <Input
                id="new-wl-date"
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                min={TODAY}
                className="bg-muted/20 border-border rounded-xl h-10"
                data-ocid="new-wl-date"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="new-wl-time"
                className="text-sm font-medium text-foreground"
              >
                {t("waitlist.requestedTimeLabel")}
              </Label>
              <select
                id="new-wl-time"
                value={form.requestedTime}
                onChange={(e) => set("requestedTime", e.target.value)}
                className="w-full h-10 rounded-xl border border-input bg-muted/20 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                data-ocid="new-wl-time"
              >
                <option value="">{t("waitlist.flexible")}</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label
              htmlFor="new-wl-notes"
              className="text-sm font-medium text-foreground"
            >
              {t("waitlist.notesLabel")}
            </Label>
            <Textarea
              id="new-wl-notes"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder={t("waitlist.notesPlaceholder")}
              className="bg-muted/20 border-border rounded-xl resize-none min-h-[72px]"
              maxLength={500}
              data-ocid="new-wl-notes"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button
            variant="outline"
            className="rounded-xl border-border hover-scale-xs"
            onClick={handleClose}
            disabled={isPending}
            data-ocid="new-wl-cancel"
          >
            {t("waitlist.cancel")}
          </Button>
          <Button
            className="rounded-xl hover-scale-xs"
            onClick={handleSubmit}
            disabled={isPending}
            data-ocid="new-wl-submit"
          >
            {isPending ? t("waitlist.adding") : t("waitlist.addButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
