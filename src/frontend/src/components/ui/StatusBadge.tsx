import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReservationStatus } from "@/types";

type StatusVariant =
  | ReservationStatus
  | "waiting"
  | "offered"
  | "expired"
  | "removed_by_staff";

const STATUS_CONFIG: Record<
  StatusVariant,
  { label: string; className: string }
> = {
  confirmed: {
    label: "Bevestigd",
    className:
      "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15",
  },
  pending: {
    label: "In behandeling",
    className: "bg-accent/10 text-accent border-accent/20 hover:bg-accent/15",
  },
  cancelled: {
    label: "Geannuleerd",
    className:
      "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15",
  },
  waitlist: {
    label: "Wachtlijst",
    className:
      "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/15",
  },
  seated: {
    label: "Zit aan tafel",
    className:
      "bg-primary/15 text-primary border-primary/30 hover:bg-primary/20",
  },
  completed: {
    label: "Voltooid",
    className: "bg-muted text-muted-foreground border-border hover:bg-muted",
  },
  no_show: {
    label: "Niet verschenen",
    className:
      "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15",
  },
  not_arrived: {
    label: "Niet aangekomen",
    className:
      "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/15",
  },
  late: {
    label: "Te laat",
    className:
      "bg-orange-600/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/15",
  },
  departed: {
    label: "Vertrokken",
    className: "bg-muted text-muted-foreground border-border hover:bg-muted",
  },
  waiting: {
    label: "Wacht",
    className: "bg-accent/10 text-accent border-accent/20 hover:bg-accent/15",
  },
  offered: {
    label: "Genotificeerd",
    className:
      "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/15",
  },
  expired: {
    label: "Verlopen",
    className: "bg-muted text-muted-foreground border-border hover:bg-muted",
  },
  removed_by_staff: {
    label: "Verwijderd",
    className: "bg-muted text-muted-foreground border-border hover:bg-muted",
  },
};

interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium px-2.5 py-0.5 rounded-full transition-colors",
        config.className,
        className,
      )}
    >
      {config.label}
    </Badge>
  );
}
