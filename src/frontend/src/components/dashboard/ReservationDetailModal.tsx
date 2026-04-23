import { TableAssignmentOverlay } from "@/components/dashboard/TableAssignmentOverlay";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  type ReservationChange,
  useReservationChanges,
  useUpdateReservation,
} from "@/hooks/useReservation";
import { useFloorState, useUnassignTable } from "@/hooks/useSeatingPlan";
import type { Experience, Reservation, ReservationStatus } from "@/types";
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  History,
  Link2,
  Link2Off,
  MessageSquare,
  Pencil,
  Star,
  Table2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useId, useState } from "react";
import { toast } from "sonner";

interface ReservationDetailModalProps {
  reservation: Reservation | null;
  open: boolean;
  onClose: () => void;
  onCheckIn: (r: Reservation) => void;
  onCancel: (r: Reservation) => void;
  onSaveNotes: (id: string, notes: string) => void;
  onStatusChange: (id: string, status: ReservationStatus) => void;
  experiences?: Experience[];
  locale?: string;
}

const ALL_STATUSES: Array<{ value: ReservationStatus; label: string }> = [
  { value: "confirmed", label: "Bevestigd" },
  { value: "not_arrived", label: "Niet aangekomen" },
  { value: "late", label: "Te laat" },
  { value: "seated", label: "Zit aan tafel" },
  { value: "departed", label: "Vertrokken" },
  { value: "cancelled", label: "Geannuleerd" },
  { value: "waitlist", label: "Wachtlijst" },
  { value: "completed", label: "Voltooid" },
  { value: "no_show", label: "Niet verschenen" },
];

const FIELD_LABELS: Record<string, { nl: string; en: string; fr: string }> = {
  date: { nl: "Datum", en: "Date", fr: "Date" },
  time: { nl: "Tijdstip", en: "Time", fr: "Heure" },
  partySize: {
    nl: "Aantal personen",
    en: "Party size",
    fr: "Nombre de personnes",
  },
  notes: { nl: "Opmerkingen", en: "Notes", fr: "Remarques" },
  specialRequests: { nl: "Opmerkingen", en: "Notes", fr: "Remarques" },
  status: { nl: "Status", en: "Status", fr: "Statut" },
  experienceId: { nl: "Ervaring", en: "Experience", fr: "Expérience" },
};

function getFieldLabel(field: string, locale = "nl"): string {
  const entry = FIELD_LABELS[field];
  if (!entry) return field;
  return entry[locale as keyof typeof entry] ?? entry.nl;
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function formatFullDate(d: string, locale = "nl-BE") {
  if (!d) return "—";
  const dt = new Date(`${d}T00:00:00`);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatChangeTimestamp(iso: string, locale = "nl-BE") {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Change History Timeline ───────────────────────────────────────────────────
function ChangeHistoryPanel({
  reservationId,
  locale,
}: {
  reservationId: string;
  locale?: string;
}) {
  const { data: changes, isLoading } = useReservationChanges(reservationId);
  const displayLocale =
    locale === "fr" ? "fr-FR" : locale === "en" ? "en-GB" : "nl-BE";

  const historyLabel =
    locale === "en"
      ? "Change history"
      : locale === "fr"
        ? "Historique"
        : "Wijzigingen";
  const noChangesLabel =
    locale === "en"
      ? "No changes yet"
      : locale === "fr"
        ? "Aucune modification"
        : "Geen wijzigingen";
  const changedByLabel =
    locale === "en"
      ? "Changed by"
      : locale === "fr"
        ? "Modifié par"
        : "Gewijzigd door";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span className="text-sm font-medium text-foreground">
          {historyLabel}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-2 pl-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : !changes || changes.length === 0 ? (
        <p className="pl-6 text-sm text-muted-foreground italic">
          {noChangesLabel}
        </p>
      ) : (
        <ol className="pl-6 space-y-3" aria-label={historyLabel}>
          {changes.map((change: ReservationChange, i: number) => (
            <li
              key={change.id ?? i}
              className="relative pl-4 border-l-2 border-border"
              data-ocid={`reservation.change.item.${i + 1}`}
            >
              {/* Dot */}
              <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-primary/60" />

              <p className="text-xs text-muted-foreground">
                {formatChangeTimestamp(change.changedAt, displayLocale)}
                {change.changedByName && (
                  <span className="ml-1.5">
                    · {changedByLabel}:{" "}
                    <span className="font-medium text-foreground">
                      {change.changedByName}
                    </span>
                  </span>
                )}
              </p>

              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-sm">
                <span className="font-medium text-foreground">
                  {getFieldLabel(change.field, locale ?? "nl")}
                </span>
                <span className="text-muted-foreground">→</span>
                {change.oldValue && (
                  <Badge
                    variant="outline"
                    className="text-xs line-through text-muted-foreground border-border px-1.5 py-0"
                  >
                    {change.oldValue}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="text-xs text-primary border-primary/40 bg-primary/5 px-1.5 py-0"
                >
                  {change.newValue}
                </Badge>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ── Main Modal ─────────────────────────────────────────────────────────────────
export function ReservationDetailModal({
  reservation,
  open,
  onClose,
  onCheckIn,
  onCancel,
  onSaveNotes,
  onStatusChange,
  experiences = [],
  locale,
}: ReservationDetailModalProps) {
  const titleId = useId();
  const [notes, setNotes] = useState("");
  const [notesDirty, setNotesDirty] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [localStatus, setLocalStatus] = useState<ReservationStatus | null>(
    null,
  );
  const [showAssignOverlay, setShowAssignOverlay] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editPartySize, setEditPartySize] = useState(1);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState<ReservationStatus>("confirmed");
  const [editExperienceId, setEditExperienceId] = useState<string>("");
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const { data: floorState } = useFloorState();
  const unassignTable = useUnassignTable();
  const updateReservation = useUpdateReservation();

  const assignedTable = floorState?.tables.find(
    (t) => t.reservationId === reservation?.id,
  );

  // Sync local state when reservation changes
  useEffect(() => {
    if (reservation) {
      setNotes(reservation.notes ?? "");
      setNotesDirty(false);
      setLocalStatus(reservation.status);
      setShowAssignOverlay(false);
      setEditMode(false);
      setShowHistory(false);
      // Pre-populate edit fields
      setEditDate(reservation.date ?? "");
      setEditTime(reservation.time ?? "");
      setEditPartySize(reservation.partySize ?? 1);
      setEditNotes(reservation.notes ?? reservation.specialRequests ?? "");
      setEditStatus(reservation.status);
      setEditExperienceId(reservation.experienceId ?? "");
      setEditErrors({});
    }
  }, [reservation]);

  if (!reservation) return null;

  const currentStatus = localStatus ?? reservation.status;
  const canCheckIn =
    currentStatus !== "cancelled" &&
    currentStatus !== "completed" &&
    currentStatus !== "seated";
  const canCancel = currentStatus !== "cancelled";

  const displayLocale =
    locale === "fr" ? "fr-FR" : locale === "en" ? "en-GB" : "nl-BE";

  // Labels based on locale
  const editLabel =
    locale === "en" ? "Edit" : locale === "fr" ? "Modifier" : "Bewerken";
  const saveLabel =
    locale === "en"
      ? "Save changes"
      : locale === "fr"
        ? "Enregistrer les modifications"
        : "Wijzigingen opslaan";
  const cancelLabel =
    locale === "en" ? "Cancel" : locale === "fr" ? "Annuler" : "Annuleren";
  const historyLabel =
    locale === "en"
      ? "Change history"
      : locale === "fr"
        ? "Historique"
        : "Wijzigingen";

  function handleStatusChange(val: string) {
    const s = val as ReservationStatus;
    setLocalStatus(s);
    onStatusChange(reservation!.id, s);
  }

  async function handleUnassignTable() {
    if (!assignedTable) return;
    await unassignTable.mutateAsync({ tableId: assignedTable.id });
    toast.success("Tafelkoppeling verwijderd");
  }

  function validateEdit(): boolean {
    const errs: Record<string, string> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const chosen = new Date(`${editDate}T00:00:00`);

    if (!editDate) {
      errs.date =
        locale === "en"
          ? "Date is required"
          : locale === "fr"
            ? "La date est requise"
            : "Datum is verplicht";
    } else if (chosen < today) {
      errs.date =
        locale === "en"
          ? "Date cannot be in the past"
          : locale === "fr"
            ? "La date ne peut pas être dans le passé"
            : "Datum mag niet in het verleden liggen";
    }

    if (editPartySize < 1 || editPartySize > 500) {
      errs.partySize =
        locale === "en"
          ? "Party size must be between 1 and 500"
          : locale === "fr"
            ? "Le groupe doit être entre 1 et 500"
            : "Aantal personen moet tussen 1 en 500 zijn";
    }

    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSaveEdit() {
    if (!validateEdit()) return;
    const res = reservation!;

    try {
      await updateReservation.mutateAsync({
        id: res.id,
        date: editDate,
        time: editTime,
        partySize: editPartySize,
        notes: editNotes || undefined,
        status: editStatus,
        experienceId: editExperienceId || undefined,
      });

      // Update local status to reflect the change
      setLocalStatus(editStatus);
      setNotes(editNotes);
      setEditMode(false);

      const successMsg =
        locale === "en"
          ? "Reservation updated"
          : locale === "fr"
            ? "Réservation mise à jour"
            : "Reservering bijgewerkt";
      toast.success(successMsg);
    } catch (_err) {
      const errMsg =
        locale === "en"
          ? "Failed to save changes. Please try again."
          : locale === "fr"
            ? "Échec de l'enregistrement. Veuillez réessayer."
            : "Opslaan mislukt. Probeer het opnieuw.";
      toast.error(errMsg);
    }
  }

  function handleCancelEdit() {
    const res = reservation!;
    setEditMode(false);
    setEditDate(res.date ?? "");
    setEditTime(res.time ?? "");
    setEditPartySize(res.partySize ?? 1);
    setEditNotes(res.notes ?? res.specialRequests ?? "");
    setEditStatus(res.status);
    setEditExperienceId(res.experienceId ?? "");
    setEditErrors({});
  }

  const isUnassigning = unassignTable.isPending;
  const isSaving = updateReservation.isPending;
  const hasExperiences = experiences.length > 0;

  // Today's date for date input min
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent
          className="bg-card border-border text-foreground max-w-lg w-full max-h-[90vh] overflow-y-auto"
          aria-labelledby={titleId}
          aria-modal="true"
        >
          <DialogHeader>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <DialogTitle
                id={titleId}
                className="text-xl font-bold text-foreground"
              >
                {reservation.guestName}
              </DialogTitle>
              <div className="flex items-center gap-2">
                {!editMode && <StatusBadge status={currentStatus} />}
                <Button
                  size="sm"
                  variant={editMode ? "outline" : "ghost"}
                  className={
                    editMode
                      ? "h-7 text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
                      : "h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                  }
                  onClick={() => {
                    if (editMode) {
                      handleCancelEdit();
                    } else {
                      setEditMode(true);
                    }
                  }}
                  data-ocid="reservation.edit_button"
                  aria-pressed={editMode}
                >
                  <Pencil className="h-3 w-3" />
                  {editMode ? cancelLabel : editLabel}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {editMode ? (
              /* ── Edit Mode ─────────────────────────────────────────────── */
              <div className="space-y-4" data-ocid="reservation.edit_form">
                {/* Date */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor={`edit-date-${reservation.id}`}
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <Calendar
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {locale === "en"
                      ? "Date"
                      : locale === "fr"
                        ? "Date"
                        : "Datum"}
                  </Label>
                  <Input
                    id={`edit-date-${reservation.id}`}
                    type="date"
                    min={todayStr}
                    value={editDate}
                    onChange={(e) => {
                      setEditDate(e.target.value);
                      if (editErrors.date)
                        setEditErrors((p) => ({ ...p, date: "" }));
                    }}
                    className="bg-background border-border text-foreground"
                    data-ocid="reservation.edit_date_input"
                    aria-invalid={!!editErrors.date}
                  />
                  {editErrors.date && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="reservation.date.field_error"
                    >
                      {editErrors.date}
                    </p>
                  )}
                </div>

                {/* Time */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor={`edit-time-${reservation.id}`}
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <Clock
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {locale === "en"
                      ? "Time"
                      : locale === "fr"
                        ? "Heure"
                        : "Tijdstip"}
                  </Label>
                  <Input
                    id={`edit-time-${reservation.id}`}
                    type="time"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="bg-background border-border text-foreground"
                    data-ocid="reservation.edit_time_input"
                  />
                </div>

                {/* Party size */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor={`edit-party-${reservation.id}`}
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <Users
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {locale === "en"
                      ? "Party size"
                      : locale === "fr"
                        ? "Nombre de personnes"
                        : "Aantal personen"}
                  </Label>
                  <Input
                    id={`edit-party-${reservation.id}`}
                    type="number"
                    min={1}
                    max={500}
                    value={editPartySize}
                    onChange={(e) => {
                      setEditPartySize(
                        Number.parseInt(e.target.value, 10) || 1,
                      );
                      if (editErrors.partySize)
                        setEditErrors((p) => ({ ...p, partySize: "" }));
                    }}
                    className="bg-background border-border text-foreground"
                    data-ocid="reservation.edit_party_input"
                    aria-invalid={!!editErrors.partySize}
                  />
                  {editErrors.partySize && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="reservation.partySize.field_error"
                    >
                      {editErrors.partySize}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">
                    {locale === "en"
                      ? "Status"
                      : locale === "fr"
                        ? "Statut"
                        : "Status"}
                  </Label>
                  <Select
                    value={editStatus}
                    onValueChange={(v) => setEditStatus(v as ReservationStatus)}
                  >
                    <SelectTrigger
                      className="bg-background border-border text-foreground"
                      data-ocid="reservation.edit_status_select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      {ALL_STATUSES.map((s) => (
                        <SelectItem
                          key={s.value}
                          value={s.value}
                          className="text-foreground focus:bg-muted"
                        >
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience (only when experiences exist) */}
                {hasExperiences && (
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Star
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      {locale === "en"
                        ? "Experience"
                        : locale === "fr"
                          ? "Expérience"
                          : "Ervaring"}
                    </Label>
                    <Select
                      value={editExperienceId || "__none__"}
                      onValueChange={(v) =>
                        setEditExperienceId(v === "__none__" ? "" : v)
                      }
                    >
                      <SelectTrigger
                        className="bg-background border-border text-foreground"
                        data-ocid="reservation.edit_experience_select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border z-50">
                        <SelectItem
                          value="__none__"
                          className="text-foreground focus:bg-muted"
                        >
                          {locale === "en"
                            ? "No experience"
                            : locale === "fr"
                              ? "Pas d'expérience"
                              : "Geen ervaring"}
                        </SelectItem>
                        {experiences.map((exp) => (
                          <SelectItem
                            key={exp.id}
                            value={exp.id}
                            className="text-foreground focus:bg-muted"
                          >
                            {exp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor={`edit-notes-${reservation.id}`}
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <MessageSquare
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {locale === "en"
                      ? "Notes"
                      : locale === "fr"
                        ? "Remarques"
                        : "Opmerkingen"}
                  </Label>
                  <Textarea
                    id={`edit-notes-${reservation.id}`}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder={
                      locale === "en"
                        ? "Allergies, special requests, birthday…"
                        : locale === "fr"
                          ? "Allergies, demandes spéciales, anniversaire…"
                          : "Allergieën, speciale verzoeken, verjaardag…"
                    }
                    rows={3}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground resize-none"
                    data-ocid="reservation.edit_notes_textarea"
                  />
                </div>

                {/* Save / Cancel actions */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 flex-1"
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    data-ocid="reservation.save_changes_button"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <span
                          className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin"
                          aria-hidden="true"
                        />
                        {locale === "en"
                          ? "Saving…"
                          : locale === "fr"
                            ? "Enregistrement…"
                            : "Opslaan…"}
                      </span>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        {saveLabel}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-border text-foreground hover:bg-muted gap-2"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    data-ocid="reservation.cancel_edit_button"
                  >
                    <X className="h-4 w-4" />
                    {cancelLabel}
                  </Button>
                </div>
              </div>
            ) : (
              /* ── View Mode ─────────────────────────────────────────────── */
              <>
                {/* Core details */}
                <div className="grid gap-3">
                  <DetailRow
                    icon={Calendar}
                    label="Datum"
                    value={formatFullDate(reservation.date, displayLocale)}
                  />
                  <DetailRow
                    icon={Clock}
                    label="Tijd"
                    value={reservation.time}
                  />
                  <DetailRow
                    icon={Users}
                    label="Aantal personen"
                    value={`${reservation.partySize} personen`}
                  />
                  {reservation.experienceName && (
                    <DetailRow
                      icon={Star}
                      label="Ervaring"
                      value={reservation.experienceName}
                    />
                  )}
                  {reservation.stripePaymentIntentId && (
                    <DetailRow
                      icon={CreditCard}
                      label="Stripe betaling"
                      value={reservation.stripePaymentIntentId}
                    />
                  )}
                  {reservation.specialRequests && (
                    <DetailRow
                      icon={MessageSquare}
                      label="Speciale verzoeken"
                      value={reservation.specialRequests}
                    />
                  )}
                </div>

                <Separator className="bg-border" />

                {/* Table assignment section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Table2
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Tafel</p>
                      {assignedTable ? (
                        <p className="text-sm font-semibold text-foreground">
                          {assignedTable.name}
                          <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                            ({Number(assignedTable.capacity)} plaatsen)
                          </span>
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          Geen tafel toegewezen
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
                        onClick={() => setShowAssignOverlay(true)}
                        disabled={isUnassigning}
                        data-ocid="modal-assign-table-button"
                      >
                        <Link2 className="h-3 w-3" />
                        {assignedTable ? "Wijzigen" : "Koppelen"}
                      </Button>
                      {assignedTable && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs gap-1.5 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                          onClick={handleUnassignTable}
                          disabled={isUnassigning}
                          data-ocid="modal-unassign-table-button"
                          aria-label="Tafelkoppeling verwijderen"
                        >
                          <Link2Off className="h-3 w-3" />
                          Ontkoppelen
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="bg-border" />

                {/* Status change */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">
                    Status aanpassen
                  </Label>
                  <Select
                    value={currentStatus}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger
                      className="bg-background border-border text-foreground"
                      data-ocid="detail-status-dropdown"
                      aria-label="Status wijzigen"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      {ALL_STATUSES.map((s) => (
                        <SelectItem
                          key={s.value}
                          value={s.value}
                          className="text-foreground focus:bg-muted"
                        >
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-border" />

                {/* Notes */}
                <div className="space-y-2">
                  <label
                    htmlFor={`notes-${reservation.id}`}
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <MessageSquare
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    Notities
                  </label>
                  <Textarea
                    id={`notes-${reservation.id}`}
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      setNotesDirty(true);
                    }}
                    placeholder="Voeg notities toe over deze reservering..."
                    rows={3}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground resize-none"
                    data-ocid="modal-notes"
                    aria-label="Notities voor reservering"
                  />
                  {notesDirty && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/10"
                      onClick={() => {
                        onSaveNotes(reservation.id, notes);
                        setNotesDirty(false);
                      }}
                      data-ocid="modal-save-notes"
                    >
                      Notities opslaan
                    </Button>
                  )}
                </div>

                <Separator className="bg-border" />

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  {canCheckIn && (
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                      onClick={() => {
                        onCheckIn(reservation);
                        onClose();
                      }}
                      data-ocid="modal-checkin"
                    >
                      <Check className="h-4 w-4" />
                      Inchecken
                    </Button>
                  )}
                  {canCancel && (
                    <Button
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive/10 gap-2"
                      onClick={() => setShowCancelDialog(true)}
                      data-ocid="modal-cancel"
                    >
                      <X className="h-4 w-4" />
                      Annuleren
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="ml-auto text-muted-foreground hover:text-foreground"
                    onClick={onClose}
                    data-ocid="modal-close"
                  >
                    Sluiten
                  </Button>
                </div>
              </>
            )}

            <Separator className="bg-border" />

            {/* Change history — collapsible */}
            <div>
              <button
                type="button"
                className="w-full flex items-center justify-between py-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowHistory((v) => !v)}
                aria-expanded={showHistory}
                data-ocid="reservation.history_toggle"
              >
                <span className="flex items-center gap-2">
                  <History className="h-4 w-4" aria-hidden="true" />
                  {historyLabel}
                </span>
                {showHistory ? (
                  <ChevronUp className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                )}
              </button>

              {showHistory && (
                <div className="mt-3" data-ocid="reservation.history_panel">
                  <ChangeHistoryPanel
                    reservationId={reservation.id}
                    locale={locale}
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel confirmation */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-card border-border text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Reservering annuleren?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Weet je zeker dat je de reservering van{" "}
              <strong className="text-foreground">
                {reservation.guestName}
              </strong>{" "}
              wilt annuleren? Deze actie kan niet ongedaan worden gemaakt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-muted border-border text-foreground hover:bg-muted/80"
              data-ocid="cancel-dialog-dismiss"
            >
              Terug
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onCancel(reservation);
                setShowCancelDialog(false);
                onClose();
              }}
              data-ocid="cancel-dialog-confirm"
            >
              Ja, annuleer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Table assignment overlay */}
      <TableAssignmentOverlay
        reservation={reservation}
        open={showAssignOverlay}
        onClose={() => setShowAssignOverlay(false)}
      />
    </>
  );
}
