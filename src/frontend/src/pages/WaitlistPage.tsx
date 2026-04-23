import { EditWaitlistModal } from "@/components/dashboard/EditWaitlistModal";
import { NewWaitlistModal } from "@/components/dashboard/NewWaitlistModal";
import {
  type WaitlistAction,
  WaitlistTable,
} from "@/components/dashboard/WaitlistTable";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useOfferWaitlistSpot,
  useRemoveWaitlistEntry,
  useReofferWaitlistSpot,
  useWaitlist,
} from "@/hooks/useDashboard";
import type { WaitlistEntry } from "@/types";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const TODAY = new Date().toISOString().split("T")[0];

const SERVICES = ["lunch", "diner"] as const;
type Service = (typeof SERVICES)[number];

export default function WaitlistPage() {
  const { t } = useTranslation("dashboard");

  const [dateFilter, setDateFilter] = useState(TODAY);
  const [activeService, setActiveService] = useState<Service>("diner");
  const [editEntry, setEditEntry] = useState<WaitlistEntry | null>(null);
  const [removeTarget, setRemoveTarget] = useState<WaitlistEntry | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const {
    data: waitlist,
    isLoading,
    refetch,
  } = useWaitlist(dateFilter || undefined);
  const { mutate: offerSpot, isPending: isOffering } = useOfferWaitlistSpot();
  const { mutate: reofferSpot, isPending: isReoffering } =
    useReofferWaitlistSpot();
  const { mutate: removeEntry } = useRemoveWaitlistEntry();

  const allEntries = waitlist ?? [];

  // Backend already filters by date; allEntries is the correct filtered set
  const filtered = allEntries;

  const waitingCount = filtered.filter((e) => e.status === "waiting").length;
  const offeredCount = filtered.filter((e) => e.status === "offered").length;
  const confirmedCount = filtered.filter(
    (e) => e.status === "confirmed",
  ).length;

  const statsData = [
    {
      key: "waiting",
      label: t("waitlist.totalWaiting"),
      value: waitingCount,
      icon: Clock,
      cls: "text-[oklch(var(--status-orange))]",
      bg: "bg-[oklch(var(--status-orange)/0.1)]",
    },
    {
      key: "offered",
      label: t("waitlist.totalOffered"),
      value: offeredCount,
      icon: Bell,
      cls: "text-[oklch(var(--status-blue))]",
      bg: "bg-[oklch(var(--status-blue)/0.1)]",
    },
    {
      key: "confirmed",
      label: t("waitlist.totalConfirmed"),
      value: confirmedCount,
      icon: CheckCircle2,
      cls: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  const handleAction = (action: WaitlistAction) => {
    const { type, entry } = action;
    if (type === "edit") {
      setEditEntry(entry);
    } else if (type === "offer") {
      offerSpot(
        { id: entry.id },
        {
          onSuccess: () =>
            toast.success(t("waitlist.offerSent", { name: entry.guestName })),
          onError: () => toast.error(t("waitlist.offerError")),
        },
      );
    } else if (type === "reoffer") {
      reofferSpot(
        { id: entry.id },
        {
          onSuccess: () =>
            toast.success(t("waitlist.reofferSent", { name: entry.guestName })),
          onError: () => toast.error(t("waitlist.offerError")),
        },
      );
    } else if (type === "remove") {
      setRemoveTarget(entry);
    }
  };

  const confirmRemove = () => {
    if (!removeTarget) return;
    removeEntry(
      { id: removeTarget.id },
      {
        onSuccess: () => {
          toast.success(
            t("waitlist.removeSuccess", { name: removeTarget.guestName }),
          );
          setRemoveTarget(null);
        },
        onError: () => toast.error(t("waitlist.removeError")),
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="heading-h1 text-foreground">{t("waitlist.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t("waitlist.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-border hover-scale-xs"
            onClick={() => refetch()}
            aria-label={t("waitlist.refresh")}
            data-ocid="refresh-waitlist-btn"
          >
            <RefreshCw className="h-4 w-4" />
            {t("waitlist.refresh")}
          </Button>
          <Button
            size="sm"
            className="gap-2 rounded-xl hover-scale-xs"
            onClick={() => setShowNewModal(true)}
            data-ocid="add-to-waitlist-btn"
          >
            <Plus className="h-4 w-4" />
            {t("waitlist.addButton")}
          </Button>
        </div>
      </div>

      {/* ── Stats strip ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {statsData.map(({ key, label, value, icon: Icon, cls, bg }) => (
          <div
            key={key}
            className="rounded-2xl border border-border gradient-card p-4 text-center shadow-soft"
          >
            <div
              className={`h-9 w-9 rounded-xl ${bg} flex items-center justify-center mx-auto mb-2`}
            >
              <Icon className={`h-[18px] w-[18px] ${cls}`} />
            </div>
            <p className={`text-2xl font-bold tabular-nums ${cls}`}>{value}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Date picker */}
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <Input
            id="date-filter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-44 bg-muted/20 border-border h-9 rounded-xl"
            aria-label={t("waitlist.filterDate")}
            data-ocid="waitlist-date-filter"
          />
        </div>
        {dateFilter !== TODAY && (
          <button
            type="button"
            onClick={() => setDateFilter(TODAY)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
            data-ocid="reset-date-filter"
          >
            {t("waitlist.today")}
          </button>
        )}
        {dateFilter && (
          <button
            type="button"
            onClick={() => setDateFilter("")}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
            data-ocid="clear-date-filter"
          >
            {t("waitlist.clearFilter")}
          </button>
        )}

        {/* Service tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/20 p-1 ml-auto">
          {SERVICES.map((svc) => (
            <button
              key={svc}
              type="button"
              onClick={() => setActiveService(svc)}
              className={[
                "px-3 py-1 text-xs font-medium rounded-lg transition-colors",
                activeService === svc
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
              data-ocid={`service-tab-${svc}`}
            >
              {t(`waitlist.service.${svc}`)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Summary row ──────────────────────────────────────────────── */}
      {filtered.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
          {waitingCount > 0 && (
            <Badge className="bg-[oklch(var(--status-orange)/0.1)] text-[oklch(var(--status-orange))] border border-[oklch(var(--status-orange)/0.2)] gap-1.5 px-2.5 py-1">
              <Users className="h-3 w-3" />
              {t("waitlist.waitingCountPlural", { count: waitingCount })}
            </Badge>
          )}
          {offeredCount > 0 && (
            <Badge
              className="bg-[oklch(var(--status-blue)/0.1)] text-[oklch(var(--status-blue))] border border-[oklch(var(--status-blue)/0.2)] gap-1.5 px-2.5 py-1"
              data-ocid="waitlist-count"
            >
              <Bell className="h-3 w-3" />
              {t("waitlist.offered", { count: offeredCount })}
            </Badge>
          )}
          {confirmedCount > 0 && (
            <Badge className="bg-primary/10 text-primary border border-primary/20 gap-1.5 px-2.5 py-1">
              <CheckCircle2 className="h-3 w-3" />
              {t("waitlist.confirmedCount", { count: confirmedCount })}
            </Badge>
          )}
        </div>
      )}

      {/* ── Table card ───────────────────────────────────────────────── */}
      <Card className="shadow-soft border-border overflow-hidden rounded-2xl gradient-card">
        <CardHeader className="pb-3 border-b border-border py-4">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {t("waitlist.overview")}
            {dateFilter && (
              <Badge className="ml-2 bg-secondary/15 text-secondary border border-secondary/25 text-xs badge-pop">
                {new Date(`${dateFilter}T12:00:00`).toLocaleDateString(
                  undefined,
                  {
                    day: "numeric",
                    month: "long",
                  },
                )}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <WaitlistTable
            entries={filtered}
            isLoading={isLoading}
            onAction={handleAction}
            isOffering={isOffering || isReoffering}
          />
        </CardContent>
      </Card>

      {/* ── Edit modal ───────────────────────────────────────────────── */}
      <EditWaitlistModal
        entry={editEntry}
        open={editEntry !== null}
        onClose={() => setEditEntry(null)}
      />

      {/* ── New waitlist modal ───────────────────────────────────────── */}
      <NewWaitlistModal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        defaultDate={dateFilter || TODAY}
      />

      {/* ── Remove confirmation dialog ───────────────────────────────── */}
      <AlertDialog
        open={removeTarget !== null}
        onOpenChange={(v) => !v && setRemoveTarget(null)}
      >
        <AlertDialogContent className="gradient-card border-border rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              {t("waitlist.removeTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {t("waitlist.removeConfirm", {
                name: removeTarget?.guestName ?? "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-xl border-border hover-scale-xs"
              data-ocid="remove-cancel"
            >
              {t("waitlist.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 hover-scale-xs"
              onClick={confirmRemove}
              data-ocid="remove-confirm"
            >
              {t("waitlist.removeButton")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
