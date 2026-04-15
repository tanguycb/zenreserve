import type { Table, TableId } from "@/hooks/useSeatingPlan";
import { useUpdateTablePosition } from "@/hooks/useSeatingPlan";
import { cn } from "@/lib/utils";
import {
  CheckSquare,
  GripVertical,
  RotateCcw,
  Square,
  ThumbsDown,
  ThumbsUp,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// Status config: colors match design spec exactly
const STATUS_CONFIG: Record<
  string,
  {
    ring: string; // border/ring color class
    bg: string;
    label: string;
    dot: string;
    handle: string;
    shadow: string;
  }
> = {
  empty: {
    ring: "border-[#22C55E] shadow-[0_0_0_1px_#22C55E22]",
    bg: "bg-[#22C55E]/8",
    label: "text-[#22C55E]",
    dot: "bg-[#22C55E]",
    handle: "text-[#22C55E]/70",
    shadow: "shadow-[0_4px_16px_rgba(34,197,94,0.15)]",
  },
  reserved: {
    ring: "border-[#F59E0B] shadow-[0_0_0_1px_#F59E0B22]",
    bg: "bg-[#F59E0B]/8",
    label: "text-[#F59E0B]",
    dot: "bg-[#F59E0B]",
    handle: "text-[#F59E0B]/70",
    shadow: "shadow-[0_4px_16px_rgba(245,158,11,0.15)]",
  },
  occupied: {
    ring: "border-[#EF4444] shadow-[0_0_0_1px_#EF444422]",
    bg: "bg-[#EF4444]/8",
    label: "text-[#EF4444]",
    dot: "bg-[#EF4444]",
    handle: "text-[#EF4444]/70",
    shadow: "shadow-[0_4px_16px_rgba(239,68,68,0.15)]",
  },
  unavailable: {
    ring: "border-[#64748B] shadow-[0_0_0_1px_#64748B22]",
    bg: "bg-[#64748B]/8",
    label: "text-[#64748B]",
    dot: "bg-[#64748B]",
    handle: "text-[#64748B]/70",
    shadow: "shadow-[0_4px_16px_rgba(100,116,139,0.08)]",
  },
};

const SNAP = 20;
const MAX_HISTORY = 20;
const snapTo = (v: number) => Math.round(v / SNAP) * SNAP;

interface PositionRecord {
  [key: string]: { x: number; y: number };
}

export interface AISuggestionOverlay {
  suggestionId: string;
  suggestedTableIds: string[];
  confidence: number;
  reasoning: string;
}

interface Props {
  tables: Table[];
  isEditMode: boolean;
  onTableClick: (table: Table) => void;
  selectedTableIds: Set<TableId>;
  onSelectionChange: (ids: Set<TableId>) => void;
  isBulkMode: boolean;
  onBulkModeChange: (active: boolean) => void;
  highlightedTableIds?: Set<string>;
  aiSuggestion?: AISuggestionOverlay | null;
  onAiAccept?: (suggestionId: string) => void;
  onAiReject?: (suggestionId: string, reason?: string) => void;
  /** Background image URL for canvas (optional) */
  bgImage?: string;
  /** Active zone filter — undefined = show all */
  activeZone?: string;
  /** Zone map (tableId -> zone) from parent */
  tableZones?: Record<string, string>;
}

export function FloorPlanCanvas({
  tables,
  isEditMode,
  onTableClick,
  selectedTableIds,
  onSelectionChange,
  isBulkMode,
  onBulkModeChange,
  highlightedTableIds,
  aiSuggestion,
  onAiAccept,
  onAiReject,
  bgImage,
  activeZone,
  tableZones = {},
}: Props) {
  const { t } = useTranslation("dashboard");

  const STATUS_LABELS: Record<string, string> = {
    empty: t("seatingPlan.tableEmpty"),
    reserved: t("seatingPlan.tableReserved"),
    occupied: t("seatingPlan.tableOccupied"),
    unavailable: t("seatingPlan.tableUnavailable"),
  };

  const updatePosition = useUpdateTablePosition();

  const [positions, setPositions] = useState<PositionRecord>({});
  const [dragging, setDragging] = useState<TableId | null>(null);
  const [focusedId, setFocusedId] = useState<TableId | null>(null);
  const [history, setHistory] = useState<PositionRecord[]>([]);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDropdown, setShowRejectDropdown] = useState<string | null>(
    null,
  );

  const dragMoved = useRef(false);
  const pointerStartRef = useRef<{
    clientX: number;
    clientY: number;
    tableX: number;
    tableY: number;
  } | null>(null);

  // Sync positions from props
  useEffect(() => {
    setPositions((prev) => {
      const next: PositionRecord = {};
      for (const tbl of tables) {
        next[tbl.id] = prev[tbl.id] ?? { x: Number(tbl.x), y: Number(tbl.y) };
      }
      return next;
    });
  }, [tables]);

  const pushHistory = useCallback((snapshot: PositionRecord) => {
    setHistory((h) => [...h.slice(-(MAX_HISTORY - 1)), { ...snapshot }]);
  }, []);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setPositions(prev);
    setHistory((h) => h.slice(0, -1));
    for (const [id, pos] of Object.entries(prev)) {
      updatePosition.mutate({ id, x: pos.x, y: pos.y });
    }
  }, [history, updatePosition]);

  // Expose undo via keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && isEditMode) {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleUndo, isEditMode]);

  const toggleSelectTable = useCallback(
    (tableId: TableId) => {
      const next = new Set(selectedTableIds);
      if (next.has(tableId)) {
        next.delete(tableId);
      } else {
        next.add(tableId);
      }
      onSelectionChange(next);
    },
    [selectedTableIds, onSelectionChange],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>, tableId: TableId) => {
      if (!isEditMode || isBulkMode) return;
      // Only drag with mouse (non-touch) pointer
      if (e.pointerType === "touch") return;
      e.currentTarget.setPointerCapture(e.pointerId);
      dragMoved.current = false;
      pointerStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        tableX: positions[tableId]?.x ?? 60,
        tableY: positions[tableId]?.y ?? 60,
      };
      setDragging(tableId);
    },
    [isEditMode, isBulkMode, positions],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!dragging || !pointerStartRef.current) return;
      const dx = e.clientX - pointerStartRef.current.clientX;
      const dy = e.clientY - pointerStartRef.current.clientY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved.current = true;
      const newX = Math.max(0, snapTo(pointerStartRef.current.tableX + dx));
      const newY = Math.max(0, snapTo(pointerStartRef.current.tableY + dy));
      setPositions((prev) => ({ ...prev, [dragging]: { x: newX, y: newY } }));
    },
    [dragging],
  );

  const onPointerUp = useCallback(
    (_e: React.PointerEvent<HTMLButtonElement>, tableId: TableId) => {
      if (!dragging || dragging !== tableId) return;
      const pos = positions[tableId];
      if (dragMoved.current && pos) {
        pushHistory({ ...positions });
        updatePosition.mutate({ id: tableId, x: pos.x, y: pos.y });
      } else {
        const table = tables.find((tbl) => tbl.id === tableId);
        if (table) onTableClick(table);
      }
      setDragging(null);
      dragMoved.current = false;
      pointerStartRef.current = null;
    },
    [dragging, positions, tables, updatePosition, onTableClick, pushHistory],
  );

  const onCardClick = useCallback(
    (tableId: TableId) => {
      if (isBulkMode) {
        toggleSelectTable(tableId);
        return;
      }
      if (isEditMode && dragging) return;
      const table = tables.find((tbl) => tbl.id === tableId);
      if (table) onTableClick(table);
    },
    [isBulkMode, isEditMode, dragging, tables, onTableClick, toggleSelectTable],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, tableId: TableId) => {
      if (isBulkMode) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleSelectTable(tableId);
        }
        return;
      }
      if (!isEditMode) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const table = tables.find((tbl) => tbl.id === tableId);
          if (table) onTableClick(table);
        }
        return;
      }

      const pos = positions[tableId] ?? { x: 60, y: 60 };
      let moved = false;

      if (e.key === "ArrowLeft") {
        pushHistory({ ...positions });
        setPositions((p) => ({
          ...p,
          [tableId]: { ...pos, x: Math.max(0, pos.x - SNAP) },
        }));
        moved = true;
      } else if (e.key === "ArrowRight") {
        pushHistory({ ...positions });
        setPositions((p) => ({ ...p, [tableId]: { ...pos, x: pos.x + SNAP } }));
        moved = true;
      } else if (e.key === "ArrowUp") {
        pushHistory({ ...positions });
        setPositions((p) => ({
          ...p,
          [tableId]: { ...pos, y: Math.max(0, pos.y - SNAP) },
        }));
        moved = true;
      } else if (e.key === "ArrowDown") {
        pushHistory({ ...positions });
        setPositions((p) => ({ ...p, [tableId]: { ...pos, y: pos.y + SNAP } }));
        moved = true;
      } else if (e.key === "Enter") {
        const finalPos = positions[tableId] ?? pos;
        updatePosition.mutate({ id: tableId, x: finalPos.x, y: finalPos.y });
        setFocusedId(null);
      } else if (e.key === "Escape") {
        const original = tables.find((tbl) => tbl.id === tableId);
        if (original) {
          setPositions((p) => ({
            ...p,
            [tableId]: { x: Number(original.x), y: Number(original.y) },
          }));
        }
        setFocusedId(null);
      }

      if (moved) {
        e.preventDefault();
        setFocusedId(tableId);
      }
    },
    [
      isBulkMode,
      isEditMode,
      positions,
      tables,
      updatePosition,
      onTableClick,
      pushHistory,
      toggleSelectTable,
    ],
  );

  const handleAiRejectClick = useCallback(
    (suggestionId: string) => {
      if (showRejectDropdown === suggestionId) {
        onAiReject?.(suggestionId, rejectReason || undefined);
        setShowRejectDropdown(null);
        setRejectReason("");
      } else {
        setShowRejectDropdown(suggestionId);
      }
    },
    [showRejectDropdown, onAiReject, rejectReason],
  );

  const REJECT_REASONS = [
    t("aiSuggestion.rejectReasonSize"),
    t("aiSuggestion.rejectReasonZone"),
    t("aiSuggestion.rejectReasonOther"),
  ];

  // Filter tables by active zone
  const visibleTables = activeZone
    ? tables.filter((tbl) => (tableZones[tbl.id] ?? "Binnen") === activeZone)
    : tables;

  return (
    <div className="space-y-0">
      {/* Edit-mode mini toolbar */}
      {isEditMode && (
        <div className="flex items-center gap-2 flex-wrap pb-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
              history.length === 0
                ? "opacity-40 cursor-not-allowed border-border text-muted-foreground"
                : "border-border bg-card text-foreground hover:bg-muted/60 cursor-pointer",
            )}
            aria-label={t("seatingPlan.undo")}
            data-ocid="seating-undo-btn"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t("seatingPlan.undo")}
            {history.length > 1 && (
              <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                {history.length}
              </span>
            )}
          </button>

          {/* Bulk select toggle */}
          <button
            type="button"
            onClick={() => {
              onBulkModeChange(!isBulkMode);
              if (isBulkMode) onSelectionChange(new Set());
            }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
              isBulkMode
                ? "bg-secondary border-secondary text-secondary-foreground"
                : "border-border bg-card text-foreground hover:bg-muted/60 cursor-pointer",
            )}
            aria-pressed={isBulkMode}
            data-ocid="seating-bulk-mode-btn"
          >
            {isBulkMode ? (
              <CheckSquare className="h-3.5 w-3.5" />
            ) : (
              <Square className="h-3.5 w-3.5" />
            )}
            {t("seating.bulk.selectMultiple")}
            {isBulkMode && selectedTableIds.size > 0 && (
              <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 text-[10px] font-bold rounded-full bg-white/20">
                {selectedTableIds.size}
              </span>
            )}
          </button>

          {!isBulkMode && (
            <p className="text-xs text-muted-foreground hidden sm:block">
              {t("seatingPlan.editModeHint")}
            </p>
          )}
        </div>
      )}

      {/* Canvas */}
      <div
        className="relative w-full overflow-auto rounded-2xl border border-border"
        style={{
          minHeight: 580,
          background: "#0D1520",
          backgroundImage: bgImage
            ? undefined
            : "linear-gradient(rgba(51,65,85,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(51,65,85,0.12) 1px, transparent 1px)",
          backgroundSize: bgImage ? undefined : "20px 20px",
        }}
        aria-label={t("seatingPlan.canvasAriaLabel")}
      >
        {/* Background photo overlay */}
        {bgImage && (
          <>
            <img
              src={bgImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-25 rounded-2xl"
            />
            {/* Grid overlay on top of photo */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(51,65,85,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(51,65,85,0.10) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
          </>
        )}

        {/* Table cards */}
        {visibleTables.map((table) => {
          const pos = positions[table.id] ?? {
            x: Number(table.x),
            y: Number(table.y),
          };
          const status = String(table.status);
          const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.empty;
          const isDraggingThis = dragging === table.id;
          const isFocused = focusedId === table.id;
          const isSelected = selectedTableIds.has(table.id);
          const isHighlighted = highlightedTableIds?.has(table.id) ?? false;
          const isSuggested =
            aiSuggestion?.suggestedTableIds.includes(table.id) ?? false;
          const zone = tableZones[table.id];

          return (
            <div
              key={table.id}
              className="absolute"
              style={{
                left: pos.x,
                top: pos.y,
                zIndex: isDraggingThis
                  ? 50
                  : isSuggested
                    ? 30
                    : isHighlighted
                      ? 20
                      : isSelected
                        ? 10
                        : 1,
              }}
            >
              <button
                type="button"
                data-ocid={`table-card-${table.id}`}
                className={cn(
                  // Base — gradient card with rounded-2xl (16px)
                  "select-none rounded-2xl border-2 text-left",
                  "bg-gradient-to-br from-[#1E2937] to-[#0F172A]",
                  "transition-[box-shadow,transform,border-color] duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-[#0D1520]",
                  // Status ring (border)
                  cfg.ring,
                  // Drag / cursor
                  isBulkMode
                    ? "cursor-pointer"
                    : isEditMode
                      ? "cursor-grab active:cursor-grabbing"
                      : "cursor-pointer hover:scale-[1.02]",
                  // Shadow
                  isDraggingThis
                    ? "shadow-[0_20px_48px_rgba(0,0,0,0.7)] scale-105"
                    : cfg.shadow,
                  // Selection / highlight overlays
                  isSelected
                    ? "ring-2 ring-secondary ring-offset-2 ring-offset-[#0D1520]"
                    : isSuggested
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-[#0D1520] shadow-[0_0_32px_8px_oklch(var(--primary)/0.5)] suggestion-slide-in"
                      : isHighlighted
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-[#0D1520] shadow-[0_0_24px_6px_oklch(var(--primary)/0.4)] animate-pulse"
                        : isFocused
                          ? "ring-2 ring-primary ring-offset-1 ring-offset-[#0D1520]"
                          : "",
                )}
                style={{ minWidth: 130 }}
                onPointerDown={(e) => onPointerDown(e, table.id)}
                onPointerMove={onPointerMove}
                onPointerUp={(e) => onPointerUp(e, table.id)}
                onClick={() => onCardClick(table.id)}
                onKeyDown={(e) => onKeyDown(e, table.id)}
                aria-label={t("seatingPlan.tableAriaLabel", {
                  name: table.name,
                  status: STATUS_LABELS[status] ?? status,
                  capacity: String(table.capacity),
                })}
                aria-pressed={isSelected || isFocused}
              >
                {/* Top bar: drag handle (edit) or checkbox (bulk) */}
                {isEditMode && (
                  <div
                    className={cn(
                      "flex items-center justify-between w-full px-2 py-1.5 border-b border-white/10 rounded-t-2xl",
                      isBulkMode
                        ? isSelected
                          ? "bg-secondary/20 text-secondary"
                          : "text-white/40"
                        : cfg.handle,
                    )}
                    aria-hidden="true"
                  >
                    {isBulkMode ? (
                      isSelected ? (
                        <CheckSquare className="h-4 w-4 mx-auto" />
                      ) : (
                        <Square className="h-4 w-4 mx-auto" />
                      )
                    ) : (
                      // Large drag handle — 24px icons side by side
                      <div className="flex items-center gap-0.5 mx-auto">
                        <GripVertical className="h-5 w-5 shrink-0" />
                        <GripVertical className="h-5 w-5 shrink-0 -ml-3" />
                      </div>
                    )}
                  </div>
                )}

                <div className="p-3">
                  {/* Status dot + name row */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={cn(
                        "h-2.5 w-2.5 rounded-full shrink-0 shadow-sm",
                        cfg.dot,
                      )}
                      aria-hidden="true"
                    />
                    <span className="text-xs font-semibold text-foreground truncate">
                      {table.name}
                    </span>
                  </div>

                  {/* Capacity */}
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3 w-3 shrink-0" />
                    <span className="text-xs">{String(table.capacity)}</span>
                  </div>

                  {/* Guest name (when occupied/reserved) */}
                  {table.guestName && (
                    <p className="text-xs mt-1.5 font-medium text-foreground/80 truncate max-w-[120px]">
                      {table.guestName}
                    </p>
                  )}

                  {/* Zone tag (optional) */}
                  {zone && (
                    <p className="text-[9px] mt-1 text-muted-foreground/60 uppercase tracking-wider truncate">
                      {zone}
                    </p>
                  )}

                  {/* Status label */}
                  <p
                    className={cn(
                      "text-[10px] mt-1 font-bold uppercase tracking-wide",
                      cfg.label,
                    )}
                  >
                    {STATUS_LABELS[status] ?? status}
                  </p>
                </div>
              </button>

              {/* AI Suggestion overlay */}
              {isSuggested && aiSuggestion && (
                <div
                  className="ai-suggestion-card suggestion-fade-in mt-2 w-48 z-40"
                  data-ocid={`ai-overlay-${table.id}`}
                >
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {t("aiSuggestion.confidence")}
                      </span>
                      <span className="text-[10px] font-bold text-foreground">
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
                  <p className="text-[10px] text-muted-foreground leading-relaxed mb-2 line-clamp-2">
                    {aiSuggestion.reasoning}
                  </p>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAiAccept?.(aiSuggestion.suggestionId);
                      }}
                      className="ai-suggestion-accept flex-1 justify-center text-[11px] px-2 py-1.5"
                      data-ocid={`ai-accept-${table.id}`}
                      aria-label={t("aiSuggestion.accept")}
                    >
                      <ThumbsUp className="h-3 w-3 shrink-0" />
                      {t("aiSuggestion.accept")}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAiRejectClick(aiSuggestion.suggestionId);
                      }}
                      className="ai-suggestion-reject flex-1 justify-center text-[11px] px-2 py-1.5"
                      data-ocid={`ai-reject-${table.id}`}
                      aria-label={t("aiSuggestion.reject")}
                    >
                      <ThumbsDown className="h-3 w-3 shrink-0" />
                      {t("aiSuggestion.reject")}
                    </button>
                  </div>
                  {showRejectDropdown === aiSuggestion.suggestionId && (
                    <div className="mt-2 space-y-1.5 suggestion-fade-in">
                      <select
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full rounded-md border border-border bg-background text-foreground text-[11px] px-2 py-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                        data-ocid="ai-reject-reason-select"
                      >
                        <option value="">
                          {t("aiSuggestion.rejectReasonPlaceholder")}
                        </option>
                        {REJECT_REASONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAiReject?.(
                            aiSuggestion.suggestionId,
                            rejectReason || undefined,
                          );
                          setShowRejectDropdown(null);
                          setRejectReason("");
                        }}
                        className="w-full text-[11px] py-1.5 rounded-md bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 transition-colors"
                        data-ocid="ai-reject-confirm"
                      >
                        {t("aiSuggestion.rejectConfirm")}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {visibleTables.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <p className="text-sm font-medium">{t("seatingPlan.noTables")}</p>
            <p className="text-xs mt-1 opacity-60">
              {t("seatingPlan.noTablesHint")}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div
        className="flex items-center gap-4 flex-wrap px-1 pt-2"
        aria-label={t("seating.legend.label")}
        data-ocid="seating-legend"
      >
        {(
          [
            {
              status: "empty",
              color: "#22C55E",
              key: "seating.legend.available",
            },
            {
              status: "reserved",
              color: "#F59E0B",
              key: "seating.legend.reserved",
            },
            {
              status: "occupied",
              color: "#EF4444",
              key: "seating.legend.occupied",
            },
            {
              status: "unavailable",
              color: "#64748B",
              key: "seating.legend.unavailable",
            },
          ] as const
        ).map(({ color, key }) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className="h-3 w-3 rounded-full shrink-0 shadow-sm"
              style={{ background: color }}
              aria-hidden="true"
            />
            <span className="text-xs text-muted-foreground">{t(key)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
