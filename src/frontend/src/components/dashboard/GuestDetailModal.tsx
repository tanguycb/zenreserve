import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { TAG_OPTIONS } from "@/lib/constants";
import { formatCurrency, formatDateShort, getInitials } from "@/lib/utils";
import type { Guest } from "@/types";
import { CalendarDays, Mail, Phone, Star, UserCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface GuestDetailModalProps {
  guest: Guest | null;
  open: boolean;
  onClose: () => void;
  onSave: (updated: Partial<Guest> & { id: string }) => void;
  isSaving?: boolean;
}

function getAvatarHue(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hues = [142, 258, 58, 25, 180, 300, 210];
  return hues[Math.abs(hash) % hues.length] ?? 142;
}

function getTagStyle(tag: string): string {
  const tagDef = TAG_OPTIONS.find(
    (t) => t.value.toLowerCase() === tag.toLowerCase(),
  );
  if (!tagDef) return "bg-muted text-muted-foreground border-border";
  switch (tagDef.color) {
    case "accent":
      return "bg-amber-500/15 text-amber-400 border-amber-500/25";
    case "destructive":
      return "bg-red-500/15 text-red-400 border-red-500/25";
    case "secondary":
      return "bg-blue-500/15 text-blue-400 border-blue-500/25";
    case "primary":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

const STATUS_LABELS: Record<string, string> = {
  completed: "Voltooid",
  confirmed: "Bevestigd",
  cancelled: "Geannuleerd",
  no_show: "Niet verschenen",
};

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  confirmed: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/25",
  no_show: "bg-muted text-muted-foreground border-border",
};

export function GuestDetailModal({
  guest,
  open,
  onClose,
  onSave,
  isSaving = false,
}: GuestDetailModalProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const liveRef = useRef<HTMLDivElement>(null);
  const titleId = "guest-modal-title";

  useEffect(() => {
    if (guest) {
      setTags(guest.tags ?? []);
      setNotes(guest.notes ?? "");
    }
  }, [guest]);

  const handleAddTag = (value: string) => {
    if (!value || tags.includes(value)) return;
    setTags((prev) => [...prev, value]);
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSave = () => {
    if (!guest) return;
    onSave({ id: guest.id, tags, notes });
    // Announce to ARIA live region
    if (liveRef.current) {
      liveRef.current.textContent = `Tags voor ${guest.firstName} ${guest.lastName} opgeslagen.`;
      setTimeout(() => {
        if (liveRef.current) liveRef.current.textContent = "";
      }, 3000);
    }
    toast.success("Gastprofiel opgeslagen");
    onClose();
  };

  if (!guest) return null;

  const hue = getAvatarHue(`${guest.firstName}${guest.lastName}`);
  const initials = getInitials(guest.firstName, guest.lastName);
  const history: {
    id: string;
    date: string;
    time: string;
    partySize: number;
    status: string;
  }[] = [];
  const availableTags = TAG_OPTIONS.filter((t) => !tags.includes(t.value));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg p-0 overflow-hidden gap-0 border-border bg-card"
        aria-labelledby={titleId}
      >
        {/* ARIA live region */}
        <div
          ref={liveRef}
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />

        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-elevated"
                style={{ background: `oklch(0.5 0.18 ${hue})` }}
                aria-hidden="true"
              >
                {initials}
              </div>
              {guest.vip && (
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center">
                  <Star className="h-3 w-3 text-white" fill="white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle
                id={titleId}
                className="text-xl font-semibold text-foreground leading-tight"
              >
                {guest.firstName} {guest.lastName}
              </DialogTitle>
              <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{guest.email}</span>
              </div>
              {guest.phone && (
                <div className="flex items-center gap-1.5 mt-0.5 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{guest.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              {
                icon: UserCircle,
                value: guest.visitCount,
                label: "Bezoeken",
              },
              {
                icon: CalendarDays,
                value: guest.totalSpend
                  ? formatCurrency(guest.totalSpend)
                  : "—",
                label: "Besteed",
              },
              {
                icon: CalendarDays,
                value: guest.lastVisit ? formatDateShort(guest.lastVisit) : "—",
                label: "Laatste bezoek",
              },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="bg-muted/30 rounded-lg p-2.5 text-center"
              >
                <p className="text-sm font-bold text-foreground tabular-nums">
                  {value}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[50vh]">
          {/* Tags section */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-foreground">
              Tags
            </Label>
            <div
              className="flex flex-wrap gap-1.5 min-h-[2rem]"
              aria-label="Gast tags"
            >
              {tags.length === 0 && (
                <span className="text-xs text-muted-foreground italic">
                  Geen tags
                </span>
              )}
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={`text-xs px-2 py-0.5 pr-1 font-medium border flex items-center gap-1 ${getTagStyle(tag)}`}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    aria-label={`Verwijder tag ${tag}`}
                    className="hover:opacity-70 transition-opacity ml-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {availableTags.length > 0 && (
              <Select onValueChange={handleAddTag}>
                <SelectTrigger
                  className="h-8 text-xs w-48 bg-muted/20 border-border"
                  aria-label="Tag toevoegen"
                  data-ocid="add-tag-select"
                >
                  <SelectValue placeholder="Tag toevoegen..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTags.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Reservation history */}
          {history.length > 0 && (
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-foreground">
                Reserveringsgeschiedenis
              </Label>
              <ul className="space-y-1.5" aria-label="Reserveringsgeschiedenis">
                {history.map((res) => (
                  <li
                    key={res.id}
                    className="flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2 text-sm"
                  >
                    <span className="text-foreground">
                      {formatDateShort(res.date)} · {res.time} ·{" "}
                      <span className="text-muted-foreground">
                        {res.partySize} pers.
                      </span>
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-xs border ${STATUS_STYLES[res.status] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {STATUS_LABELS[res.status] ?? res.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label
              htmlFor="guest-notes"
              className="text-sm font-semibold text-foreground"
            >
              Notities
            </Label>
            <Textarea
              id="guest-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Voeg een notitie toe over deze gast..."
              className="bg-muted/20 border-border text-sm min-h-[80px] resize-none"
              data-ocid="guest-notes-input"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/10">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            data-ocid="guest-modal-cancel"
          >
            Annuleren
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="guest-modal-save"
          >
            {isSaving ? "Opslaan..." : "Opslaan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
