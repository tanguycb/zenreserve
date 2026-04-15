import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { useReservations } from "@/hooks/useReservation";
import type { AISeatingSuggestion } from "@/hooks/useSeasonalAI";
import type { Table } from "@/hooks/useSeatingPlan";
import {
  useAssignReservation,
  useDeleteTable,
  useUnassignTable,
} from "@/hooks/useSeatingPlan";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Brain,
  Copy,
  MapPin,
  Minus,
  Plus,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// ── Status badge map ──────────────────────────────────────────────────────────
const STATUS_BADGE_CLASS: Record<string, string> = {
  empty: "border-[#22C55E] text-[#22C55E] bg-[#22C55E]/8",
  reserved: "border-[#F59E0B] text-[#F59E0B] bg-[#F59E0B]/8",
  occupied: "border-[#EF4444] text-[#EF4444] bg-[#EF4444]/8",
  unavailable: "border-[#64748B] text-[#64748B] bg-[#64748B]/8",
};

// ── Reservation status config ─────────────────────────────────────────────────
const RESERVATION_STATUS_OPTIONS = [
  { value: "confirmed", color: "#22C55E" },
  { value: "pending", color: "#60A5FA" },
  { value: "not_arrived", color: "#94A3B8" },
  { value: "late", color: "#F59E0B" },
  { value: "seated", color: "#3B82F6" },
  { value: "departed", color: "#8B5CF6" },
  { value: "cancelled", color: "#EF4444" },
  { value: "waitlist", color: "#2563EB" },
  { value: "no_show", color: "#991B1B" },
  { value: "completed", color: "#16A34A" },
] as const;

type ReservationStatusValue =
  (typeof RESERVATION_STATUS_OPTIONS)[number]["value"];

const ZONES = ["Binnen", "Terras", "Bar", "Privézaal", "Rooftop"];

interface Props {
  table: Table | null;
  isOpen: boolean;
  isEditMode: boolean;
  onClose: () => void;
  aiSuggestion?: AISeatingSuggestion | null;
  onAiAccept?: (suggestionId: string) => void;
  onAiReject?: (suggestionId: string, reason?: string) => void;
  /** Zone for this table (from parent zone map) */
  zone?: string;
  /** Callback when zone is changed in modal */
  onZoneChange?: (tableId: string, zone: string) => void;
}

export function TableDetailModal({
  table,
  isOpen,
  isEditMode,
  onClose,
  aiSuggestion,
  onAiAccept,
  onAiReject,
  zone: zoneProp,
  onZoneChange,
}: Props) {
  const { t } = useTranslation(["dashboard", "shared"]);
  const isMobile = useIsMobile();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [zone, setZone] = useState(ZONES[0]);
  const [tableName, setTableName] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reservationStatus, setReservationStatus] =
    useState<ReservationStatusValue>("confirmed");

  const unassign = useUnassignTable();
  const deleteTable = useDeleteTable();
  const assignReservation = useAssignReservation();
  const { data: allReservations = [] } = useReservations();

  // Reservations for this table or all unassigned ones (for assignment dropdown)
  const tableReservations = table
    ? allReservations.filter(
        (r) =>
          r.tableNumber == null ||
          r.tableNumber === Number(table.id.replace("t", "")),
      )
    : [];

  const isAiSuggested =
    !!aiSuggestion && aiSuggestion.suggestedTableIds.includes(table?.id ?? "");

  const REJECT_REASONS = [
    t("aiSuggestion.rejectReasonSize", { ns: "dashboard" }),
    t("aiSuggestion.rejectReasonZone", { ns: "dashboard" }),
    t("aiSuggestion.rejectReasonOther", { ns: "dashboard" }),
  ];

  // Reservation status labels
  const RESERVATION_STATUS_LABELS: Record<string, string> = {
    confirmed: t("seating.status.confirmed"),
    pending: t("seating.status.pending"),
    not_arrived: t("seating.status.not_arrived"),
    late: t("seating.status.late"),
    seated: t("seating.status.seated"),
    departed: t("seating.status.departed"),
    cancelled: t("seating.status.cancelled"),
    waitlist: t("seating.status.waitlist"),
    no_show: t("seating.status.no_show"),
    completed: t("seating.status.completed"),
  };

  // Sync form from prop
  useEffect(() => {
    if (table) {
      setCapacity(Number(table.capacity));
      setTableName(table.name);
      setZone(zoneProp ?? ZONES[0]);
    }
  }, [table, zoneProp]);

  // Mobile slide-up animation
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      setConfirmDelete(false);
      setSelectedReservation("");
      setShowRejectForm(false);
      setRejectReason("");
    }
  }, [isOpen]);

  // Desktop dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || isMobile) return;
    if (isOpen) dialog.showModal?.();
    else {
      dialog.close?.();
      setConfirmDelete(false);
      setSelectedReservation("");
    }
  }, [isOpen, isMobile]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!table) return null;

  const status = String(table.status);
  const badgeClass = STATUS_BADGE_CLASS[status] ?? STATUS_BADGE_CLASS.empty;
  const statusLabel = t(
    `seatingPlan.table${status.charAt(0).toUpperCase() + status.slice(1)}` as Parameters<
      typeof t
    >[0],
    { defaultValue: status },
  );

  const handleUnassign = () => {
    unassign.mutate({ tableId: table.id }, { onSuccess: onClose });
  };

  const handleDelete = () => {
    deleteTable.mutate({ id: table.id }, { onSuccess: onClose });
  };

  const handleAssign = () => {
    const res = tableReservations.find((r) => r.id === selectedReservation);
    if (!res) return;
    assignReservation.mutate(
      {
        tableId: table.id,
        reservationId: res.id,
        guestName: res.guestName,
        seatCount: res.partySize,
      },
      { onSuccess: onClose },
    );
  };

  const handleCopyTable = () => onClose();

  const handleZoneChange = (newZone: string) => {
    setZone(newZone);
    onZoneChange?.(table.id, newZone);
  };

  const handleAiAccept = () => {
    if (aiSuggestion) {
      onAiAccept?.(aiSuggestion.suggestionId);
      onClose();
    }
  };

  const handleAiRejectConfirm = () => {
    if (aiSuggestion) {
      onAiReject?.(aiSuggestion.suggestionId, rejectReason || undefined);
      setShowRejectForm(false);
      setRejectReason("");
    }
  };

  // ── Shared sections ────────────────────────────────────────────────────────

  const AISuggestionSection = () => {
    if (!isAiSuggested || !aiSuggestion) return null;
    return (
      <div
        className="ai-suggestion-card suggestion-slide-in space-y-3"
        data-ocid="table-modal-ai-suggestion"
      >
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
            <Brain className="h-3.5 w-3.5 text-primary" />
          </div>
          <p className="text-xs font-semibold text-foreground">
            {t("aiSuggestion.overlayTitle", { ns: "dashboard" })}
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              {t("aiSuggestion.confidence", { ns: "dashboard" })}
            </span>
            <span className="text-[11px] font-bold text-foreground">
              {Math.round(aiSuggestion.confidence * 100)}%
            </span>
          </div>
          <div className="confidence-meter">
            <div
              className="confidence-fill"
              style={{ width: `${aiSuggestion.confidence * 100}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {aiSuggestion.reasoning}
        </p>
        {!showRejectForm ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAiAccept}
              className="ai-suggestion-accept flex-1 justify-center text-xs py-2"
              data-ocid="table-modal-ai-accept"
            >
              <ThumbsUp className="h-3.5 w-3.5 shrink-0" />
              {t("aiSuggestion.accept", { ns: "dashboard" })}
            </button>
            <button
              type="button"
              onClick={() => setShowRejectForm(true)}
              className="ai-suggestion-reject flex-1 justify-center text-xs py-2"
              data-ocid="table-modal-ai-reject-trigger"
            >
              <ThumbsDown className="h-3.5 w-3.5 shrink-0" />
              {t("aiSuggestion.reject", { ns: "dashboard" })}
            </button>
          </div>
        ) : (
          <div className="space-y-2 suggestion-fade-in">
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-lg border border-input bg-background text-foreground text-xs px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              data-ocid="table-modal-reject-reason"
            >
              <option value="">
                {t("aiSuggestion.rejectReasonPlaceholder", { ns: "dashboard" })}
              </option>
              {REJECT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowRejectForm(false)}
                className="flex-1 h-8 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                {t("actions.cancel", { ns: "shared" })}
              </button>
              <button
                type="button"
                onClick={handleAiRejectConfirm}
                className="flex-1 h-8 rounded-lg bg-destructive/10 text-destructive border border-destructive/30 text-xs hover:bg-destructive/20 transition-colors"
                data-ocid="table-modal-reject-confirm"
              >
                {t("aiSuggestion.rejectConfirm", { ns: "dashboard" })}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Reservation status section (shown when table has an assignment)
  const ReservationStatusSection = () => {
    if (!table.guestName && !table.reservationId) return null;
    const currentCfg = RESERVATION_STATUS_OPTIONS.find(
      (o) => o.value === reservationStatus,
    );
    return (
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {t("seating.status.label")}
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {RESERVATION_STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setReservationStatus(opt.value)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all",
                reservationStatus === opt.value
                  ? "border-current shadow-sm scale-[1.02]"
                  : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40",
              )}
              style={
                reservationStatus === opt.value
                  ? {
                      color: opt.color,
                      borderColor: opt.color,
                      background: `${opt.color}12`,
                    }
                  : {}
              }
              data-ocid={`reservation-status-${opt.value}`}
            >
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ background: opt.color }}
                aria-hidden="true"
              />
              {RESERVATION_STATUS_LABELS[opt.value] ?? opt.value}
            </button>
          ))}
        </div>
        {currentCfg && (
          <p className="text-xs text-muted-foreground/60 mt-1">
            {t("seating.status.selectedHint", {
              status:
                RESERVATION_STATUS_LABELS[reservationStatus] ??
                reservationStatus,
            })}
          </p>
        )}
      </div>
    );
  };

  // ── Mobile bottom-sheet ────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-50",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        {isOpen && (
          // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop close
          <div
            className={cn(
              "absolute inset-0 bg-black/60 transition-opacity duration-300",
              isVisible ? "opacity-100" : "opacity-0",
            )}
            onClick={onClose}
            aria-hidden="true"
          />
        )}

        <dialog
          open={isOpen}
          className={cn(
            "absolute bottom-0 left-0 right-0 m-0 p-0 w-full bg-card rounded-t-3xl border-0",
            "transition-transform duration-300 ease-out will-change-transform",
            "max-h-[92dvh] overflow-y-auto",
            isVisible ? "translate-y-0" : "translate-y-full",
          )}
          aria-labelledby="mobile-table-modal-title"
        >
          {/* Pull handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1.5 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-3 pb-4 border-b border-border">
            <div>
              <h2
                id="mobile-table-modal-title"
                className="text-lg font-semibold text-foreground"
              >
                {table.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={cn("text-xs", badgeClass)}>
                  {statusLabel}
                </Badge>
                {isAiSuggested && (
                  <Badge
                    variant="outline"
                    className="text-xs border-primary/50 text-primary bg-primary/10"
                  >
                    <Brain className="h-2.5 w-2.5 mr-1" />
                    AI
                  </Badge>
                )}
              </div>
            </div>
            <button
              type="button"
              className="h-11 w-11 rounded-full flex items-center justify-center bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
              onClick={onClose}
              aria-label={t("actions.close", { ns: "shared" })}
              data-ocid="table-mobile-modal-close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-5 space-y-5">
            <AISuggestionSection />

            {/* Table name */}
            <div className="space-y-2">
              <Label
                htmlFor="mobile-table-name"
                className="text-sm font-medium"
              >
                {t("seatingPlan.tableName")}
              </Label>
              <Input
                id="mobile-table-name"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="h-14 text-base rounded-xl"
                data-ocid="mobile-table-name-input"
              />
            </div>

            {/* Capacity stepper */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("seatingPlan.tableCapacity")}
              </Label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setCapacity((c) => Math.max(1, c - 1))}
                  className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center text-foreground hover:bg-muted/70 active:scale-95 transition-all"
                  aria-label={t("seatingPlan.decreaseCapacity")}
                  data-ocid="mobile-capacity-decrease"
                >
                  <Minus className="h-6 w-6" />
                </button>
                <span className="text-3xl font-bold text-foreground w-10 text-center tabular-nums">
                  {capacity}
                </span>
                <button
                  type="button"
                  onClick={() => setCapacity((c) => Math.min(20, c + 1))}
                  className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center text-foreground hover:bg-muted/70 active:scale-95 transition-all"
                  aria-label={t("seatingPlan.increaseCapacity")}
                  data-ocid="mobile-capacity-increase"
                >
                  <Plus className="h-6 w-6" />
                </button>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {t("seatingPlan.seats")}
                </span>
              </div>
            </div>

            {/* Zone dropdown */}
            <div className="space-y-2">
              <Label htmlFor="mobile-zone" className="text-sm font-medium">
                {t("seatingPlan.zone")}
              </Label>
              <select
                id="mobile-zone"
                value={zone}
                onChange={(e) => handleZoneChange(e.target.value)}
                className="w-full h-14 rounded-xl border border-input bg-background text-foreground text-base px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                data-ocid="mobile-zone-select"
              >
                {ZONES.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>

            {/* Reservation status */}
            <ReservationStatusSection />

            {/* Guest info */}
            {table.guestName && (
              <div className="rounded-xl bg-muted/40 p-4 space-y-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  {t("seatingPlan.assignedGuest")}
                </p>
                <p className="text-base font-semibold text-foreground">
                  {table.guestName}
                </p>
                {table.seatCount && (
                  <p className="text-sm text-muted-foreground">
                    {String(table.seatCount)} {t("seatingPlan.seats")}
                  </p>
                )}
              </div>
            )}

            {/* Quick actions */}
            <div className="space-y-3 pt-2 border-t border-border">
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full flex items-center gap-3 px-5 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/20 active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                  style={{ minHeight: 56 }}
                  data-ocid="mobile-table-delete-trigger"
                >
                  <Trash2 className="h-5 w-5 shrink-0" />
                  <span className="text-base font-medium">
                    {t("seatingPlan.deleteTable")}
                  </span>
                </button>
              ) : (
                <div className="rounded-2xl bg-destructive/10 border border-destructive/30 p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive font-medium">
                      {t("seatingPlan.confirmDelete", { name: table.name })}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 h-12 rounded-xl border border-border text-foreground font-medium hover:bg-muted/50 transition-colors"
                    >
                      {t("actions.cancel", { ns: "shared" })}
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleteTable.isPending}
                      className="flex-1 h-12 rounded-xl bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 active:scale-95 transition-all disabled:opacity-60"
                      data-ocid="mobile-table-delete-confirm"
                    >
                      {deleteTable.isPending
                        ? t("seatingPlan.deleting")
                        : t("seatingPlan.delete")}
                    </button>
                  </div>
                </div>
              )}

              {/* Copy */}
              <button
                type="button"
                onClick={handleCopyTable}
                className="w-full flex items-center gap-3 px-5 rounded-2xl bg-secondary/10 border border-secondary/30 text-secondary hover:bg-secondary/20 active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                style={{ minHeight: 56 }}
                data-ocid="mobile-table-copy"
              >
                <Copy className="h-5 w-5 shrink-0" />
                <span className="text-base font-medium">
                  {t("seatingPlan.copyTable")}
                </span>
              </button>

              {/* Change zone — cycle */}
              <button
                type="button"
                onClick={() => {
                  const nextIdx = (ZONES.indexOf(zone) + 1) % ZONES.length;
                  handleZoneChange(ZONES[nextIdx]);
                }}
                className="w-full flex items-center gap-3 px-5 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/20 active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]"
                style={{ minHeight: 56 }}
                data-ocid="mobile-table-change-zone"
              >
                <MapPin className="h-5 w-5 shrink-0" />
                <span className="text-base font-medium">
                  {t("seatingPlan.changeZone")}: {zone}
                </span>
              </button>
            </div>
          </div>

          <div
            style={{ height: "max(24px, env(safe-area-inset-bottom, 24px))" }}
          />
        </dialog>
      </div>
    );
  }

  // ── Desktop dialog ─────────────────────────────────────────────────────────
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {isOpen && (
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}

      <dialog
        ref={dialogRef}
        open={isOpen}
        className={cn(
          "relative z-50 w-full max-w-md rounded-2xl border border-border",
          "bg-gradient-to-br from-card to-background shadow-elevated",
          "p-0 m-0 text-foreground focus-visible:outline-none",
        )}
        aria-labelledby="table-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-4 border-b border-border">
          <div className="min-w-0">
            <h2
              id="table-modal-title"
              className="text-base font-semibold text-foreground truncate"
            >
              {table.name}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge
                variant="outline"
                className={cn("text-xs px-2 py-0.5", badgeClass)}
              >
                {statusLabel}
              </Badge>
              {isAiSuggested && (
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 border-primary/50 text-primary bg-primary/10"
                >
                  <Brain className="h-2.5 w-2.5 mr-1" />
                  AI
                </Badge>
              )}
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                {String(table.capacity)} {t("seatingPlan.seats")}
              </span>
              {zone && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {zone}
                </span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 -mt-1 -mr-1"
            onClick={onClose}
            aria-label={t("actions.close", { ns: "shared" })}
            data-ocid="table-modal-close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <AISuggestionSection />

          {/* Guest info */}
          {table.guestName && (
            <div className="rounded-xl bg-muted/40 p-3 space-y-1">
              <p className="text-xs text-muted-foreground font-medium">
                {t("seatingPlan.assignedGuest")}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {table.guestName}
              </p>
              {table.reservationId && (
                <p className="text-xs text-muted-foreground font-mono">
                  #{table.reservationId}
                </p>
              )}
              {table.seatCount && (
                <p className="text-xs text-muted-foreground">
                  {String(table.seatCount)} {t("seatingPlan.seats")}
                </p>
              )}
            </div>
          )}

          {/* Reservation status */}
          <ReservationStatusSection />

          {/* Zone selector (desktop, always visible) */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("seatingPlan.zone")}
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {ZONES.map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => handleZoneChange(z)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    zone === z
                      ? "bg-primary/15 border-primary/40 text-primary"
                      : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40",
                  )}
                  data-ocid={`desktop-zone-${z}`}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>

          {isEditMode && (
            <div className="space-y-3">
              {table.guestName && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-sm"
                  onClick={handleUnassign}
                  disabled={unassign.isPending}
                  data-ocid="table-modal-unassign"
                >
                  {unassign.isPending
                    ? t("seatingPlan.assigning")
                    : t("seatingPlan.unassign")}
                </Button>
              )}

              {!table.guestName && (
                <div className="space-y-2">
                  <label
                    htmlFor="reservation-select"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    {t("seatingPlan.assignReservation")}
                  </label>
                  <select
                    id="reservation-select"
                    className="w-full rounded-lg border border-input bg-background text-foreground text-sm px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    value={selectedReservation}
                    onChange={(e) => setSelectedReservation(e.target.value)}
                    data-ocid="table-modal-reservation-select"
                  >
                    <option value="">
                      {t("seatingPlan.chooseReservation")}
                    </option>
                    {tableReservations.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.guestName} — {r.time} ({r.partySize} pers.)
                      </option>
                    ))}
                  </select>
                  {selectedReservation && (
                    <Button
                      className="w-full"
                      onClick={handleAssign}
                      disabled={assignReservation.isPending}
                      data-ocid="table-modal-assign-confirm"
                    >
                      {assignReservation.isPending
                        ? t("seatingPlan.assigning")
                        : t("seatingPlan.assign")}
                    </Button>
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-border">
                {!confirmDelete ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setConfirmDelete(true)}
                    data-ocid="table-modal-delete-trigger"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t("seatingPlan.deleteTable")}
                  </Button>
                ) : (
                  <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-3 space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <p className="text-xs text-destructive font-medium">
                        {t("seatingPlan.confirmDelete", { name: table.name })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => setConfirmDelete(false)}
                      >
                        {t("actions.cancel", { ns: "shared" })}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={handleDelete}
                        disabled={deleteTable.isPending}
                        data-ocid="table-modal-delete-confirm"
                      >
                        {deleteTable.isPending
                          ? t("seatingPlan.deleting")
                          : t("seatingPlan.delete")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
