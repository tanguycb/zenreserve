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
import { useUpdateWaitlistEntry } from "@/hooks/useDashboard";
import type { WaitlistEntry } from "@/types";
import { Minus, Plus, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface EditWaitlistModalProps {
  entry: WaitlistEntry | null;
  open: boolean;
  onClose: () => void;
}

const TIME_SLOTS: string[] = [];
for (let h = 11; h <= 23; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:00`);
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:30`);
}

export function EditWaitlistModal({
  entry,
  open,
  onClose,
}: EditWaitlistModalProps) {
  const { t } = useTranslation("dashboard");
  const { mutate: updateEntry, isPending } = useUpdateWaitlistEntry();

  const [partySize, setPartySize] = useState(entry?.partySize ?? 2);
  const [notes, setNotes] = useState(entry?.notes ?? "");
  const [requestedTime, setRequestedTime] = useState(
    entry?.preferredTime ?? "",
  );

  useEffect(() => {
    if (entry) {
      setPartySize(entry.partySize);
      setNotes(entry.notes ?? "");
      setRequestedTime(entry.preferredTime ?? "");
    }
  }, [entry]);

  const handleSave = () => {
    if (!entry) return;
    updateEntry(
      {
        id: entry.id,
        partySize,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          toast.success(t("waitlist.editSuccess", { name: entry.guestName }));
          onClose();
        },
        onError: () => toast.error(t("waitlist.editError")),
      },
    );
  };

  const decreaseParty = () => setPartySize((p) => Math.max(1, p - 1));
  const increaseParty = () => setPartySize((p) => Math.min(20, p + 1));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="gradient-card border-border rounded-2xl max-w-md shadow-elevated">
        <DialogHeader>
          <DialogTitle className="heading-h2 text-foreground">
            {t("waitlist.editTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Guest name (read-only) */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/20 border border-border">
            <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {t("waitlist.guestLabel")}
              </p>
              <p className="font-semibold text-foreground truncate">
                {entry?.guestName ?? "—"}
              </p>
            </div>
          </div>

          {/* Party size stepper */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {t("waitlist.partySizeLabel")}
            </Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-xl border-border hover-scale-xs"
                onClick={decreaseParty}
                disabled={partySize <= 1}
                aria-label={t("newReservation.decreaseParty")}
                data-ocid="edit-party-decrease"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-bold text-xl tabular-nums text-foreground">
                {partySize}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-xl border-border hover-scale-xs"
                onClick={increaseParty}
                disabled={partySize >= 20}
                aria-label={t("newReservation.increaseParty")}
                data-ocid="edit-party-increase"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {t("newReservation.persons")}
              </span>
            </div>
          </div>

          {/* Requested time */}
          <div className="space-y-2">
            <Label
              htmlFor="edit-wl-time"
              className="text-sm font-medium text-foreground"
            >
              {t("waitlist.requestedTimeLabel")}
            </Label>
            <select
              id="edit-wl-time"
              value={requestedTime}
              onChange={(e) => setRequestedTime(e.target.value)}
              className="w-full h-10 rounded-xl border border-input bg-muted/20 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              data-ocid="edit-wl-time"
            >
              <option value="">{t("waitlist.flexible")}</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label
              htmlFor="edit-wl-notes"
              className="text-sm font-medium text-foreground"
            >
              {t("waitlist.notesLabel")}
            </Label>
            <Textarea
              id="edit-wl-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("waitlist.notesPlaceholder")}
              className="bg-muted/20 border-border rounded-xl resize-none min-h-[80px]"
              maxLength={500}
              data-ocid="edit-wl-notes"
            />
            <p className="text-xs text-muted-foreground text-right">
              {notes.length} / 500
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button
            variant="outline"
            className="rounded-xl border-border hover-scale-xs"
            onClick={onClose}
            disabled={isPending}
            data-ocid="edit-wl-cancel"
          >
            {t("waitlist.cancel")}
          </Button>
          <Button
            className="rounded-xl hover-scale-xs"
            onClick={handleSave}
            disabled={isPending}
            data-ocid="edit-wl-save"
          >
            {isPending ? t("waitlist.saving") : t("waitlist.saveChanges")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
