import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuditLog } from "@/hooks/useAuditLog";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ShieldOff,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 20;

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const d = new Date(ms);
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ROLE_COLORS: Record<string, string> = {
  owner: "bg-primary/15 text-primary border-primary/25",
  manager: "bg-secondary/15 text-secondary border-secondary/25",
  marketing: "bg-accent/15 text-accent border-accent/25",
  staff: "bg-muted text-muted-foreground border-border",
};

export default function AuditLogPage() {
  const { t } = useTranslation("dashboard");
  const { role } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const { data, isLoading } = useAuditLog(page);

  // Access control: only owner and manager
  if (role !== "owner" && role !== "manager") {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center"
        data-ocid="audit-log.error_state"
      >
        <div className="h-14 w-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
          <ShieldOff className="h-7 w-7 text-destructive" />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">
            {t("auditLog.forbidden")}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {t("auditLog.forbiddenHint")}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => void navigate({ to: "/dashboard" })}
          data-ocid="audit-log.back_button"
        >
          {t("auditLog.backToDashboard")}
        </Button>
      </div>
    );
  }

  const entries = data?.entries ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

  return (
    <div className="space-y-6" data-ocid="audit-log.page">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {t("auditLog.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("auditLog.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  {t("auditLog.columns.timestamp")}
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  {t("auditLog.columns.who")}
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  {t("auditLog.columns.page")}
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  {t("auditLog.columns.action")}
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  {t("auditLog.columns.summary")}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
                    <tr key={i} className="border-b border-border/50">
                      <td className="px-5 py-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="h-4 w-40" />
                      </td>
                    </tr>
                  ))
                : entries.map((entry, idx) => (
                    <tr
                      key={entry.id}
                      className="border-b border-border/50 hover:bg-muted/10 transition-colors"
                      data-ocid={`audit-log.item.${idx + 1}`}
                    >
                      <td className="px-5 py-4 text-muted-foreground tabular-nums whitespace-nowrap">
                        {formatTimestamp(entry.timestamp)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-foreground text-sm truncate max-w-[140px]">
                            {entry.callerName ||
                              `${entry.callerPrincipal.slice(0, 12)}…`}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs w-fit px-1.5 py-0 h-4 border ${ROLE_COLORS[entry.callerRole] ?? ROLE_COLORS.staff}`}
                          >
                            {entry.callerRole}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-muted-foreground text-sm">
                          {entry.page}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          variant="outline"
                          className="text-xs font-medium bg-secondary/10 text-secondary border-secondary/25"
                        >
                          {entry.action}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <p
                          className="text-sm text-foreground truncate"
                          title={entry.summary}
                        >
                          {entry.summary}
                        </p>
                        {(entry.oldValue != null || entry.newValue != null) && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            {entry.oldValue && (
                              <span
                                className="line-through opacity-60 truncate max-w-[80px]"
                                title={entry.oldValue}
                              >
                                {entry.oldValue}
                              </span>
                            )}
                            {entry.oldValue && entry.newValue && <span>→</span>}
                            {entry.newValue && (
                              <span
                                className="text-primary truncate max-w-[80px]"
                                title={entry.newValue}
                              >
                                {entry.newValue}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-border/50">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
                <div key={i} className="p-4 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              ))
            : entries.map((entry, idx) => (
                <div
                  key={entry.id}
                  className="p-4 space-y-2"
                  data-ocid={`audit-log.item.${idx + 1}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {entry.callerName ||
                          `${entry.callerPrincipal.slice(0, 12)}…`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatTimestamp(entry.timestamp)}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs border ${ROLE_COLORS[entry.callerRole] ?? ROLE_COLORS.staff}`}
                    >
                      {entry.callerRole}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className="text-xs bg-secondary/10 text-secondary border-secondary/25"
                    >
                      {entry.action}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {entry.page}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{entry.summary}</p>
                </div>
              ))}
        </div>

        {/* Empty state */}
        {!isLoading && entries.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-16 gap-3 text-center"
            data-ocid="audit-log.empty_state"
          >
            <div className="h-12 w-12 rounded-2xl bg-muted/50 border border-border flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {t("auditLog.emptyTitle")}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {t("auditLog.emptyHint")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div
          className="flex items-center justify-between"
          data-ocid="audit-log.pagination"
        >
          <p className="text-sm text-muted-foreground">
            {t("auditLog.paginationInfo", {
              from: page * PAGE_SIZE + 1,
              to: Math.min((page + 1) * PAGE_SIZE, total),
              total,
            })}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrev}
              onClick={() => setPage((p) => p - 1)}
              data-ocid="audit-log.pagination_prev"
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("auditLog.prev")}
            </Button>
            <span className="text-sm text-muted-foreground">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNext}
              onClick={() => setPage((p) => p + 1)}
              data-ocid="audit-log.pagination_next"
              className="gap-1"
            >
              {t("auditLog.next")}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
