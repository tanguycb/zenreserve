import { Badge } from "@/components/ui/badge";
import { TAG_OPTIONS } from "@/lib/constants";
import { formatCurrency, formatDateShort, getInitials } from "@/lib/utils";
import type { Guest } from "@/types";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

interface GuestCardProps {
  guest: Guest;
  onClick: (guest: Guest) => void;
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

export function GuestCard({ guest, onClick }: GuestCardProps) {
  const { t } = useTranslation("dashboard");
  const initials = getInitials(guest.firstName, guest.lastName);
  const hue = getAvatarHue(`${guest.firstName}${guest.lastName}`);

  return (
    <button
      type="button"
      className="w-full text-left rounded-xl shadow-soft border border-border hover:shadow-elevated hover:border-primary/30 transition-all cursor-pointer bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onClick={() => onClick(guest)}
      data-ocid="guest-card"
      aria-label={t("guests.guestLabel", {
        name: `${guest.firstName} ${guest.lastName}`,
      })}
    >
      <div className="p-4 space-y-3">
        {/* Header: avatar + name + email */}
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div
              className="h-11 w-11 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{
                background: `oklch(0.5 0.18 ${hue})`,
              }}
              aria-hidden="true"
            >
              {initials}
            </div>
            {guest.vip && (
              <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 flex items-center justify-center">
                <Star className="h-2.5 w-2.5 text-white" fill="white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate leading-tight">
              {guest.firstName} {guest.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {guest.email}
            </p>
            {guest.phone && (
              <p className="text-xs text-muted-foreground/70 truncate">
                {guest.phone}
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        {guest.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5" aria-label={t("guests.tags")}>
            {guest.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={`text-xs px-2 py-0.5 font-medium border ${getTagStyle(tag)}`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
          <div className="text-center">
            <p className="text-sm font-bold text-foreground tabular-nums">
              {guest.visitCount}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
              {t("guests.totalVisits")}
            </p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-sm font-bold text-foreground tabular-nums">
              {guest.totalSpend ? formatCurrency(guest.totalSpend) : "—"}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
              {t("guests.totalSpend")}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-foreground tabular-nums">
              {guest.lastVisit ? formatDateShort(guest.lastVisit) : "—"}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
              {t("guests.lastVisit")}
            </p>
          </div>
        </div>

        {guest.notes && (
          <p className="text-xs text-muted-foreground italic line-clamp-1 border-t border-border pt-2">
            {guest.notes}
          </p>
        )}
      </div>
    </button>
  );
}
