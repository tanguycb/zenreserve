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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { Reservation, ReservationStatus } from "@/types";
import {
  Calendar,
  Check,
  Clock,
  CreditCard,
  MessageSquare,
  Star,
  Table2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useId, useState } from "react";

interface ReservationDetailModalProps {
  reservation: Reservation | null;
  open: boolean;
  onClose: () => void;
  onCheckIn: (r: Reservation) => void;
  onCancel: (r: Reservation) => void;
  onSaveNotes: (id: string, notes: string) => void;
  onStatusChange: (id: string, status: ReservationStatus) => void;
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

function formatFullDate(d: string) {
  if (!d) return "—";
  const dt = new Date(`${d}T00:00:00`);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ReservationDetailModal({
  reservation,
  open,
  onClose,
  onCheckIn,
  onCancel,
  onSaveNotes,
  onStatusChange,
}: ReservationDetailModalProps) {
  const titleId = useId();
  const [notes, setNotes] = useState("");
  const [notesDirty, setNotesDirty] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [localStatus, setLocalStatus] = useState<ReservationStatus | null>(
    null,
  );

  useEffect(() => {
    if (reservation) {
      setNotes(reservation.notes ?? "");
      setNotesDirty(false);
      setLocalStatus(reservation.status);
    }
  }, [reservation]);

  if (!reservation) return null;

  const currentStatus = localStatus ?? reservation.status;
  const canCheckIn =
    currentStatus !== "cancelled" &&
    currentStatus !== "completed" &&
    currentStatus !== "seated";
  const canCancel = currentStatus !== "cancelled";

  function handleStatusChange(val: string) {
    const s = val as ReservationStatus;
    setLocalStatus(s);
    onStatusChange(reservation!.id, s);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent
          className="bg-card border-border text-foreground max-w-lg w-full"
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
              <StatusBadge status={currentStatus} />
            </div>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Core details */}
            <div className="grid gap-3">
              <DetailRow
                icon={Calendar}
                label="Datum"
                value={formatFullDate(reservation.date)}
              />
              <DetailRow icon={Clock} label="Tijd" value={reservation.time} />
              <DetailRow
                icon={Users}
                label="Aantal personen"
                value={`${reservation.partySize} personen`}
              />
              <DetailRow
                icon={Table2}
                label="Tafel"
                value={
                  reservation.tableNumber
                    ? `Tafel ${reservation.tableNumber}`
                    : "Niet toegewezen"
                }
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

            {/* Status change */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Status aanpassen
              </Label>
              <Select value={currentStatus} onValueChange={handleStatusChange}>
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
    </>
  );
}
