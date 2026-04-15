import { SkeletonTableRow } from "@/components/SkeletonCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import type { Reservation } from "@/types";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RecentReservationsProps {
  reservations: Reservation[];
  isLoading: boolean;
  className?: string;
}

const SKELETON_KEYS = ["r-sk-1", "r-sk-2", "r-sk-3", "r-sk-4", "r-sk-5"];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatTime(time: string): string {
  return time;
}

const STATUS_AVATAR_COLOR: Record<string, string> = {
  confirmed: "bg-primary/20 text-primary",
  pending: "bg-accent/20 text-accent",
  cancelled: "bg-destructive/20 text-destructive",
  waitlist: "bg-secondary/20 text-secondary",
  seated: "bg-primary/25 text-primary",
  completed: "bg-muted text-muted-foreground",
  no_show: "bg-destructive/15 text-destructive",
  not_arrived: "bg-muted/50 text-muted-foreground",
  late: "bg-[oklch(0.72_0.22_58)]/20 text-[oklch(0.72_0.22_58)]",
  departed: "bg-muted/30 text-muted-foreground",
};

export function RecentReservations({
  reservations,
  isLoading,
  className,
}: RecentReservationsProps) {
  const { t } = useTranslation("dashboard");

  // Sort by time ascending, show up to 5
  const sorted = [...reservations]
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 5);

  return (
    <div
      className={cn(
        "gradient-card rounded-2xl border border-border shadow-soft flex flex-col",
        className,
      )}
      data-ocid="recent-reservations-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="text-base font-semibold text-foreground">
          {t("dashboard:home.recentReservations", "Reserveringen vandaag")}
        </h2>
        <Link
          to="/dashboard/reservations"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          data-ocid="reservations-view-all"
        >
          {t("dashboard:home.viewAll", "Alles tonen")}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Body */}
      <div className="flex-1">
        {isLoading ? (
          <div className="divide-y divide-border">
            {SKELETON_KEYS.map((k) => (
              <SkeletonTableRow key={k} />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-12 text-center px-6"
            data-ocid="reservations-empty"
          >
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <CalendarDays
                className="h-5 w-5 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <p className="text-sm font-medium text-foreground">
              {t("dashboard:home.noReservations", "Geen reserveringen vandaag")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t(
                "dashboard:home.noReservationsSub",
                "Nieuwe reserveringen verschijnen hier zodra ze binnenkomen",
              )}
            </p>
            <Link
              to="/dashboard/reservations"
              className="mt-4 text-xs font-medium text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
              data-ocid="reservations-empty-cta"
            >
              {t("dashboard:home.addReservation", "Reservering toevoegen")}
            </Link>
          </div>
        ) : (
          <ul
            className="divide-y divide-border"
            aria-label={t(
              "dashboard:home.recentReservations",
              "Reserveringen vandaag",
            )}
          >
            {sorted.map((res) => {
              const avatarClass =
                STATUS_AVATAR_COLOR[res.status] ??
                "bg-muted text-muted-foreground";
              return (
                <li
                  key={res.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer"
                  data-ocid="reservation-row"
                >
                  {/* Avatar with initials */}
                  <div
                    className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center shrink-0 shadow-sm font-bold text-xs",
                      avatarClass,
                    )}
                    aria-hidden="true"
                  >
                    {getInitials(res.guestName || "?")}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {res.guestName ||
                        t("dashboard:home.unknownGuest", "Onbekende gast")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <span className="font-mono">{formatTime(res.time)}</span>
                      <span className="text-muted-foreground/50">·</span>
                      <span>
                        {res.partySize}{" "}
                        {res.partySize === 1
                          ? t("dashboard:home.person", "persoon")
                          : t("dashboard:home.persons", "personen")}
                      </span>
                      {res.experienceName && (
                        <>
                          <span className="text-muted-foreground/50">·</span>
                          <span className="text-accent truncate">
                            {res.experienceName}
                          </span>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Status badge */}
                  <div className="badge-pop shrink-0">
                    <StatusBadge status={res.status} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
