import { SkeletonTableRow } from "@/components/SkeletonCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateShort, formatTime } from "@/lib/utils";
import type { WaitlistEntry } from "@/types";
import {
  Bell,
  Clock,
  Edit2,
  Mail,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export type WaitlistAction =
  | { type: "edit"; entry: WaitlistEntry }
  | { type: "offer"; entry: WaitlistEntry }
  | { type: "reoffer"; entry: WaitlistEntry }
  | { type: "remove"; entry: WaitlistEntry };

interface WaitlistTableProps {
  entries: WaitlistEntry[];
  isLoading: boolean;
  isOffering: boolean;
  onAction: (action: WaitlistAction) => void;
}

function waitTime(addedAt: string): string {
  const diff = Date.now() - new Date(addedAt).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hours}u ${rem}m` : `${hours}u`;
}

const SKELETON_KEYS = ["ws1", "ws2", "ws3"];

type StatusKey = WaitlistEntry["status"];

interface StatusMeta {
  label: string;
  cls: string;
  dot: string;
}

function StatusBadge({
  status,
  t,
}: { status: StatusKey; t: (k: string) => string }) {
  const map: Record<StatusKey, StatusMeta> = {
    waiting: {
      label: t("waitlist.statusWaiting"),
      cls: "bg-amber-500/15 text-amber-400 border-amber-500/25",
      dot: "bg-amber-400",
    },
    notified: {
      label: t("waitlist.statusNotified"),
      cls: "bg-blue-500/15 text-blue-400 border-blue-500/25",
      dot: "bg-blue-400",
    },
    confirmed: {
      label: t("waitlist.statusConfirmed"),
      cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
      dot: "bg-emerald-400",
    },
    expired: {
      label: t("waitlist.statusExpired"),
      cls: "bg-muted/60 text-muted-foreground border-border",
      dot: "bg-muted-foreground/40",
    },
  };
  const { label, cls, dot } = map[status] ?? map.waiting;
  return (
    <Badge
      variant="outline"
      className={`badge-pop text-xs border font-medium inline-flex items-center gap-1.5 ${cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dot}`} />
      {label}
    </Badge>
  );
}

export function WaitlistTable({
  entries,
  isLoading,
  isOffering,
  onAction,
}: WaitlistTableProps) {
  const { t } = useTranslation("dashboard");

  if (isLoading) {
    return (
      <div className="divide-y divide-border" aria-busy="true">
        {SKELETON_KEYS.map((k) => (
          <SkeletonTableRow key={k} />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center"
        data-ocid="empty-waitlist"
      >
        <div className="h-16 w-16 rounded-2xl gradient-card border border-border flex items-center justify-center mb-4 shadow-soft">
          <Clock className="h-7 w-7 text-muted-foreground/50" />
        </div>
        <p className="font-semibold text-foreground text-base">
          {t("waitlist.empty")}
        </p>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          {t("waitlist.emptyHint")}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" aria-label={t("waitlist.title")}>
        <thead>
          <tr className="border-b border-border bg-muted/10">
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-10"
            >
              {t("waitlist.columns.rank")}
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              {t("waitlist.columns.name")}
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell"
            >
              {t("waitlist.columns.email")}
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              {t("waitlist.columns.party")}
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell"
            >
              {t("waitlist.columns.desiredTime")}
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell"
            >
              {t("waitlist.columns.waitTime")}
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              {t("waitlist.columns.status")}
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              {t("waitlist.columns.action")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {entries.map((entry, idx) => (
            <tr
              key={entry.id}
              className={`hover:bg-muted/10 transition-colors group ${
                entry.status === "notified" ? "bg-blue-500/5" : ""
              }`}
              data-ocid="waitlist-row"
            >
              {/* Rank */}
              <td className="px-4 py-3">
                <span className="h-7 w-7 rounded-full gradient-card border border-border flex items-center justify-center text-xs font-bold text-muted-foreground shadow-soft">
                  {idx + 1}
                </span>
              </td>

              {/* Name */}
              <td className="px-4 py-3">
                <p className="font-medium text-foreground leading-tight">
                  {entry.guestName}
                </p>
                {entry.guestPhone && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {entry.guestPhone}
                  </p>
                )}
              </td>

              {/* Email */}
              <td className="px-4 py-3 hidden sm:table-cell">
                <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <Mail className="h-3 w-3 shrink-0" />
                  <span className="truncate max-w-[140px]">
                    {entry.guestEmail}
                  </span>
                </span>
              </td>

              {/* Party size */}
              <td className="px-4 py-3 text-center">
                <span className="inline-flex items-center gap-1 text-foreground font-medium">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  {entry.partySize}
                </span>
              </td>

              {/* Requested time */}
              <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                {formatDateShort(entry.date)} ·{" "}
                {entry.preferredTime
                  ? formatTime(entry.preferredTime)
                  : t("waitlist.flexible")}
              </td>

              {/* Wait time */}
              <td className="px-4 py-3 hidden lg:table-cell text-center text-muted-foreground text-xs tabular-nums">
                {waitTime(entry.addedAt)}
              </td>

              {/* Status */}
              <td className="px-4 py-3 text-center">
                <StatusBadge status={entry.status} t={t} />
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1.5">
                  {/* Edit */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 hover-scale-xs text-muted-foreground hover:text-foreground"
                    onClick={() => onAction({ type: "edit", entry })}
                    aria-label={t("waitlist.actions.edit")}
                    data-ocid="edit-waitlist-btn"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>

                  {/* Offer / Re-offer */}
                  {(entry.status === "waiting" ||
                    entry.status === "notified") && (
                    <Button
                      size="sm"
                      variant="outline"
                      className={`gap-1.5 text-xs h-7 px-2.5 hover-scale-xs ${
                        entry.status === "notified"
                          ? "border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                          : "border-primary/30 text-primary hover:bg-primary/10"
                      }`}
                      onClick={() =>
                        onAction({
                          type:
                            entry.status === "notified" ? "reoffer" : "offer",
                          entry,
                        })
                      }
                      disabled={isOffering}
                      data-ocid={
                        entry.status === "notified"
                          ? "reoffer-btn"
                          : "offer-spot-btn"
                      }
                      aria-label={t("waitlist.offerLabel", {
                        name: entry.guestName,
                      })}
                    >
                      {entry.status === "notified" ? (
                        <RefreshCw className="h-3 w-3" />
                      ) : (
                        <Bell className="h-3 w-3" />
                      )}
                      {entry.status === "notified"
                        ? t("waitlist.reofferButton")
                        : t("waitlist.offerButton")}
                    </Button>
                  )}

                  {/* Remove */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 hover-scale-xs text-muted-foreground hover:text-destructive"
                    onClick={() => onAction({ type: "remove", entry })}
                    aria-label={t("waitlist.actions.remove")}
                    data-ocid="remove-waitlist-btn"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
