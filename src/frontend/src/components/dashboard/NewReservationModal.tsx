import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useExperiences } from "@/hooks/useDashboard";
import { useCreateReservation } from "@/hooks/useReservation";
import { useFloorState } from "@/hooks/useSeatingPlan";
import type { Experience, Reservation } from "@/types";
import { Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// ── Helpers ───────────────────────────────────────────────────────────────────
function generateTimeSlots(openHour = 11, closeHour = 23): string[] {
  const slots: string[] = [];
  for (let h = openHour; h < closeHour; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

/** Guess service ID from a time string (HH:MM). Returns "lunch" or "diner". */
function guessServiceFromTime(time: string): string {
  const hour = Number.parseInt(time.split(":")[0] ?? "0", 10);
  // Lunch = before 17:00, Diner = 17:00+
  return hour < 17 ? "lunch" : "diner";
}

/** Filter experiences for a given date + service. */
function filterExperiences(
  experiences: Experience[],
  date: string,
  time: string,
): Experience[] {
  if (!date && !time) return experiences;
  const dayOfWeek = date ? new Date(date).getDay() : -1;
  const serviceId = time ? guessServiceFromTime(time) : "";

  return experiences.filter((exp) => {
    const hasServiceRestriction = exp.serviceIds && exp.serviceIds.length > 0;
    const hasDayRestriction = exp.dayOfWeek && exp.dayOfWeek.length > 0;

    if (
      hasServiceRestriction &&
      serviceId &&
      !exp.serviceIds!.includes(serviceId)
    ) {
      return false;
    }
    if (
      hasDayRestriction &&
      dayOfWeek >= 0 &&
      !exp.dayOfWeek!.includes(dayOfWeek)
    ) {
      return false;
    }
    return true;
  });
}

/** Build a restriction note like "alleen tijdens lunch" */
function buildRestrictionNote(
  exp: Experience,
  t: (key: string, opts?: Record<string, unknown>) => string,
): string | null {
  const parts: string[] = [];
  if (exp.serviceIds && exp.serviceIds.length > 0) {
    parts.push(
      t("dashboard:newReservation.experienceOnlyDuring", {
        services: exp.serviceIds.join(", "),
        defaultValue: `alleen tijdens ${exp.serviceIds.join(", ")}`,
      }),
    );
  }
  return parts.length > 0 ? parts.join(" · ") : null;
}
const TODAY = new Date().toISOString().slice(0, 10);

interface FormState {
  partySize: number;
  date: string;
  time: string;
  experienceId: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  tableId: string;
  notes: string;
}

function blankForm(initial?: Partial<FormState>): FormState {
  return {
    partySize: 2,
    date: TODAY,
    time: "19:00",
    experienceId: "",
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    tableId: "auto",
    notes: "",
    ...initial,
  };
}

interface FieldErrors {
  guestName?: string;
  guestPhone?: string;
  date?: string;
  time?: string;
  partySize?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  /** Pre-fill to edit an existing reservation */
  reservation?: Reservation | null;
  onReservationSaved?: (r: Reservation) => void;
}

export function NewReservationModal({
  open,
  onClose,
  reservation,
  onReservationSaved,
}: Props) {
  const { t } = useTranslation(["dashboard"]);
  const createMutation = useCreateReservation();
  const { data: floorState } = useFloorState();
  const { data: experiences } = useExperiences();
  const isEdit = !!reservation;

  const [form, setForm] = useState<FormState>(blankForm());
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const partySizeRef = useRef<HTMLSpanElement>(null);

  // Active experiences for the selector, filtered by selected date + time/service
  const activeExperiences = useMemo(() => {
    const all = (experiences ?? []).filter((e): e is Experience => e.available);
    return filterExperiences(all, form.date, form.time);
  }, [experiences, form.date, form.time]);
  const hasExperiences = activeExperiences.length > 0;

  // Build table options from live floor state
  const tableOptions = [
    {
      id: "auto",
      label: t("dashboard:newReservation.autoAssign"),
      capacity: null,
    },
    ...(floorState?.tables ?? []).map((tbl) => ({
      id: tbl.id,
      label: `${tbl.name} (${Number(tbl.capacity)} pers.)`,
      capacity: Number(tbl.capacity),
    })),
  ];

  // Sync form when reservation or open changes
  useEffect(() => {
    if (open) {
      if (reservation) {
        setForm({
          partySize: reservation.partySize,
          date: reservation.date,
          time: reservation.time,
          experienceId: reservation.experienceId ?? "",
          guestName: reservation.guestName,
          guestPhone: reservation.guestPhone ?? "",
          guestEmail: reservation.guestEmail ?? "",
          tableId: reservation.tableNumber
            ? `t${reservation.tableNumber}`
            : "auto",
          notes: reservation.notes ?? "",
        });
      } else {
        setForm(blankForm());
      }
      setErrors({});
      setSubmitError(null);
    }
  }, [open, reservation]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: FieldErrors = {};
    if (!form.guestName.trim())
      errs.guestName = t("dashboard:newReservation.errors.nameRequired");
    if (!form.guestPhone.trim())
      errs.guestPhone = t("dashboard:newReservation.errors.phoneRequired");
    if (!form.date)
      errs.date = t("dashboard:newReservation.errors.dateInvalid");
    if (!form.time)
      errs.time = t("dashboard:newReservation.errors.timeRequired");
    if (form.partySize < 1)
      errs.partySize = t("dashboard:newReservation.errors.partySizeMin");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    const tableId = form.tableId !== "auto" ? form.tableId : null;

    try {
      const saved = await createMutation.mutateAsync({
        guestName: form.guestName.trim(),
        phone: form.guestPhone.trim(),
        email: form.guestEmail.trim(),
        partySize: form.partySize,
        date: form.date,
        time: form.time,
        tableId: tableId ?? undefined,
        notes: form.notes.trim() || undefined,
        experienceId: form.experienceId || undefined,
      });
      toast.success(
        isEdit
          ? t("dashboard:newReservation.updatedSuccess", {
              name: form.guestName,
            })
          : t("dashboard:newReservation.createdSuccess", {
              name: form.guestName,
            }),
      );
      onReservationSaved?.(saved);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Onbekende fout";
      setSubmitError(msg);
    }
  }

  const isSubmitting = createMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="dark bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="new-reservation-modal"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl font-semibold">
            {isEdit
              ? t("dashboard:newReservation.titleEdit")
              : t("dashboard:newReservation.title")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2" noValidate>
          {/* 1. Party size */}
          <div className="space-y-1.5">
            <Label className="text-foreground text-sm font-medium">
              {t("dashboard:newReservation.partySize")}{" "}
              <span className="text-destructive" aria-hidden="true">
                *
              </span>
            </Label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  set("partySize", Math.max(1, form.partySize - 1))
                }
                className="h-9 w-9 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={t("dashboard:newReservation.decreaseParty")}
                data-ocid="nr-party-minus"
              >
                <Minus className="h-4 w-4 text-foreground" />
              </button>
              <span
                ref={partySizeRef}
                className="w-12 text-center text-lg font-semibold text-foreground tabular-nums"
                aria-live="polite"
                aria-label={t("dashboard:newReservation.partySizeValue", {
                  count: form.partySize,
                })}
                data-ocid="nr-party-size"
              >
                {form.partySize}
              </span>
              <button
                type="button"
                onClick={() =>
                  set("partySize", Math.min(30, form.partySize + 1))
                }
                className="h-9 w-9 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={t("dashboard:newReservation.increaseParty")}
                data-ocid="nr-party-plus"
              >
                <Plus className="h-4 w-4 text-foreground" />
              </button>
              <span className="text-sm text-muted-foreground">
                {t("dashboard:newReservation.persons")}
              </span>
            </div>
            {errors.partySize && (
              <p className="text-xs text-destructive" role="alert">
                {errors.partySize}
              </p>
            )}
          </div>

          {/* 2. Date + Time row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="nr-date"
                className="text-foreground text-sm font-medium"
              >
                {t("dashboard:newReservation.date")}{" "}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </Label>
              <Input
                id="nr-date"
                type="date"
                value={form.date}
                min={TODAY}
                onChange={(e) => set("date", e.target.value)}
                className="bg-background border-border text-foreground"
                aria-required="true"
                aria-invalid={!!errors.date}
                aria-describedby={errors.date ? "nr-date-err" : undefined}
                data-ocid="nr-date"
              />
              {errors.date && (
                <p
                  id="nr-date-err"
                  className="text-xs text-destructive"
                  role="alert"
                >
                  {errors.date}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="nr-time"
                className="text-foreground text-sm font-medium"
              >
                {t("dashboard:newReservation.time")}{" "}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </Label>
              <Select value={form.time} onValueChange={(v) => set("time", v)}>
                <SelectTrigger
                  id="nr-time"
                  className="bg-background border-border text-foreground"
                  aria-required="true"
                  aria-invalid={!!errors.time}
                  data-ocid="nr-time"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark bg-card border-border max-h-64">
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem
                      key={slot}
                      value={slot}
                      className="text-foreground hover:bg-muted focus:bg-muted"
                    >
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.time && (
                <p className="text-xs text-destructive" role="alert">
                  {errors.time}
                </p>
              )}
            </div>
          </div>

          {/* 3. Experience selector (only when experiences exist) */}
          {hasExperiences && (
            <div className="space-y-1.5">
              <Label
                htmlFor="nr-experience"
                className="text-foreground text-sm font-medium"
              >
                {t("dashboard:newReservation.experience", {
                  defaultValue: "Ervaring (optioneel)",
                })}
              </Label>
              <Select
                value={form.experienceId || "none"}
                onValueChange={(v) =>
                  set("experienceId", v === "none" ? "" : v)
                }
              >
                <SelectTrigger
                  id="nr-experience"
                  className="bg-background border-border text-foreground"
                  data-ocid="nr-experience"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark bg-card border-border">
                  <SelectItem
                    value="none"
                    className="text-foreground hover:bg-muted focus:bg-muted"
                  >
                    {t("dashboard:newReservation.noExperience", {
                      defaultValue: "Geen ervaring",
                    })}
                  </SelectItem>
                  {activeExperiences.map((exp) => {
                    const note = buildRestrictionNote(exp, t);
                    return (
                      <SelectItem
                        key={exp.id}
                        value={exp.id}
                        className="text-foreground hover:bg-muted focus:bg-muted"
                      >
                        <span>
                          {exp.name}
                          {exp.price > 0 &&
                            ` — €${(exp.price / 100).toFixed(0)} p.p.`}
                          {note && (
                            <span className="ml-1 text-muted-foreground text-xs">
                              ({note})
                            </span>
                          )}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 4. Guest name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="nr-name"
              className="text-foreground text-sm font-medium"
            >
              {t("dashboard:newReservation.guestName")}{" "}
              <span className="text-destructive" aria-hidden="true">
                *
              </span>
            </Label>
            <Input
              id="nr-name"
              value={form.guestName}
              onChange={(e) => set("guestName", e.target.value)}
              placeholder={t("dashboard:newReservation.guestNamePlaceholder")}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              aria-required="true"
              aria-invalid={!!errors.guestName}
              aria-describedby={errors.guestName ? "nr-name-err" : undefined}
              data-ocid="nr-guest-name"
            />
            {errors.guestName && (
              <p
                id="nr-name-err"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.guestName}
              </p>
            )}
          </div>

          {/* 5. Phone + Email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="nr-phone"
                className="text-foreground text-sm font-medium"
              >
                {t("dashboard:newReservation.phone")}{" "}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </Label>
              <Input
                id="nr-phone"
                type="tel"
                value={form.guestPhone}
                onChange={(e) => set("guestPhone", e.target.value)}
                placeholder="+32 471 000 000"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                aria-required="true"
                aria-invalid={!!errors.guestPhone}
                aria-describedby={
                  errors.guestPhone ? "nr-phone-err" : undefined
                }
                data-ocid="nr-guest-phone"
              />
              {errors.guestPhone && (
                <p
                  id="nr-phone-err"
                  className="text-xs text-destructive"
                  role="alert"
                >
                  {errors.guestPhone}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="nr-email"
                className="text-foreground text-sm font-medium"
              >
                {t("dashboard:newReservation.email")}
              </Label>
              <Input
                id="nr-email"
                type="email"
                value={form.guestEmail}
                onChange={(e) => set("guestEmail", e.target.value)}
                placeholder="gast@email.com"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                data-ocid="nr-guest-email"
              />
            </div>
          </div>

          {/* 6. Table assignment */}
          <div className="space-y-1.5">
            <Label
              htmlFor="nr-table"
              className="text-foreground text-sm font-medium"
            >
              {t("dashboard:newReservation.table")}
            </Label>
            <Select
              value={form.tableId}
              onValueChange={(v) => set("tableId", v)}
            >
              <SelectTrigger
                id="nr-table"
                className="bg-background border-border text-foreground"
                data-ocid="nr-table"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark bg-card border-border">
                {tableOptions.map((tbl) => (
                  <SelectItem
                    key={tbl.id}
                    value={tbl.id}
                    className="text-foreground hover:bg-muted focus:bg-muted"
                  >
                    {tbl.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t("dashboard:newReservation.autoAssignHint", {
                defaultValue:
                  "Kies 'Automatisch toewijzen' voor slimme tafelselectie",
              })}
            </p>
          </div>

          {/* 7. Notes */}
          <div className="space-y-1.5">
            <Label
              htmlFor="nr-notes"
              className="text-foreground text-sm font-medium"
            >
              {t("dashboard:newReservation.notes")}
            </Label>
            <Textarea
              id="nr-notes"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder={t("dashboard:newReservation.notesPlaceholder")}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground resize-none"
              rows={3}
              data-ocid="nr-notes"
            />
          </div>

          {/* Submit error */}
          {submitError && (
            <p
              className="text-sm text-destructive rounded-lg bg-destructive/10 px-3 py-2"
              role="alert"
            >
              {submitError}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-muted"
              onClick={onClose}
              data-ocid="nr-cancel-btn"
            >
              {t("dashboard:newReservation.cancel")}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting}
              data-ocid="nr-submit-btn"
            >
              {isSubmitting
                ? t("dashboard:newReservation.saving")
                : isEdit
                  ? t("dashboard:newReservation.saveChanges")
                  : t("dashboard:newReservation.create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
