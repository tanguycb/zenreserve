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
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ZoneBoundary } from "./ZoneBoundaryEditor";
import {
  ZoneBoundaryEditor,
  getZoneColor as getZoneColorFromEditor,
} from "./ZoneBoundaryEditor";

// ─── Status palette (hex values for direct SVG use) ──────────────────────────
const STATUS_COLORS = {
  empty: {
    fill: "rgba(34,197,94,0.13)",
    stroke: "#22C55E",
    glow: "rgba(34,197,94,0.55)",
    glowSoft: "rgba(34,197,94,0.22)",
    chairFill: "rgba(34,197,94,0.45)",
    label: "#22C55E",
    labelText: "BESCHIKBAAR",
    gradTop: "rgba(34,197,94,0.22)",
    gradBot: "rgba(34,197,94,0.05)",
  },
  reserved: {
    fill: "rgba(249,115,22,0.13)",
    stroke: "#F97316",
    glow: "rgba(249,115,22,0.55)",
    glowSoft: "rgba(249,115,22,0.22)",
    chairFill: "rgba(249,115,22,0.45)",
    label: "#F97316",
    labelText: "GERESERVEERD",
    gradTop: "rgba(249,115,22,0.22)",
    gradBot: "rgba(249,115,22,0.05)",
  },
  occupied: {
    fill: "rgba(239,68,68,0.13)",
    stroke: "#EF4444",
    glow: "rgba(239,68,68,0.55)",
    glowSoft: "rgba(239,68,68,0.22)",
    chairFill: "rgba(239,68,68,0.45)",
    label: "#EF4444",
    labelText: "BEZET",
    gradTop: "rgba(239,68,68,0.22)",
    gradBot: "rgba(239,68,68,0.05)",
  },
  unavailable: {
    fill: "rgba(100,116,139,0.12)",
    stroke: "#64748B",
    glow: "rgba(100,116,139,0.0)",
    glowSoft: "rgba(100,116,139,0.10)",
    chairFill: "rgba(100,116,139,0.35)",
    label: "#64748B",
    labelText: "NIET BESCHIKBAAR",
    gradTop: "rgba(100,116,139,0.18)",
    gradBot: "rgba(100,116,139,0.04)",
  },
} as const;

type StatusKey = keyof typeof STATUS_COLORS;

function getStatusColors(status: string): (typeof STATUS_COLORS)[StatusKey] {
  return STATUS_COLORS[status as StatusKey] ?? STATUS_COLORS.empty;
}

// ─── Zone tints — derived dynamically from zone color (no hardcoding) ──────────
function getZoneTint(
  zoneName: string,
  zoneColors: Record<string, string>,
): string {
  const color = zoneColors[zoneName] ?? getZoneColorFromEditor(zoneName);
  // Convert hex to rgba with very low alpha for a subtle tint
  const hex = color.replace("#", "");
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},0.04)`;
}

// ─── Table sizing (w × h in px) ───────────────────────────────────────────────
function getRectDims(capacity: number): { w: number; h: number } {
  if (capacity <= 2) return { w: 80, h: 60 };
  if (capacity <= 4) return { w: 100, h: 80 };
  if (capacity <= 6) return { w: 130, h: 90 };
  return { w: 160, h: 100 };
}

function getCircleRadius(capacity: number): number {
  if (capacity <= 2) return 35;
  if (capacity <= 4) return 45;
  if (capacity <= 6) return 55;
  return 65;
}

// ─── Chair placement helpers ──────────────────────────────────────────────────
const CHAIR_W = 14;
const CHAIR_H = 18;
const CHAIR_GAP = 16; // distance from table edge to chair centre

interface ChairTransform {
  cx: number;
  cy: number;
  angle: number; // rotation in degrees (faces table centre)
}

function getRectChairs(cap: number, w: number, h: number): ChairTransform[] {
  // Distribute chairs around a rectangle.
  // We alternate: top/bottom get ~half, sides get rest (minimum 1 each if cap allows).
  const chairs: ChairTransform[] = [];
  const total = cap;

  const topCount = Math.round(total / 2);
  const bottomCount = total - topCount;
  // short-side chairs (top + bottom rows)
  const placeRow = (
    count: number,
    yOff: number,
    rotDeg: number,
    edgeW: number,
  ) => {
    const spacing = edgeW / (count + 1);
    for (let i = 1; i <= count; i++) {
      chairs.push({ cx: -edgeW / 2 + spacing * i, cy: yOff, angle: rotDeg });
    }
  };

  placeRow(topCount, -h / 2 - CHAIR_GAP, 0, w * 0.85);
  placeRow(bottomCount, h / 2 + CHAIR_GAP, 180, w * 0.85);

  return chairs;
}

function getCircleChairs(cap: number, r: number): ChairTransform[] {
  const chairs: ChairTransform[] = [];
  for (let i = 0; i < cap; i++) {
    const angle = (360 / cap) * i - 90; // start at top
    const rad = (angle * Math.PI) / 180;
    const dist = r + CHAIR_GAP;
    chairs.push({
      cx: Math.cos(rad) * dist,
      cy: Math.sin(rad) * dist,
      angle: angle + 90, // face table centre
    });
  }
  return chairs;
}

// ─── SVG Chair component ──────────────────────────────────────────────────────
function Chair({
  cx,
  cy,
  angle,
  color,
  id,
}: ChairTransform & { color: string; id: string }) {
  return (
    <g transform={`translate(${cx},${cy}) rotate(${angle})`}>
      <defs>
        <radialGradient id={`chair-grad-${id}`} cx="50%" cy="30%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      {/* Seat */}
      <rect
        x={-CHAIR_W / 2}
        y={-CHAIR_H / 2 + 4}
        width={CHAIR_W}
        height={CHAIR_H - 4}
        rx={3}
        ry={3}
        fill={color}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={0.75}
      />
      <rect
        x={-CHAIR_W / 2}
        y={-CHAIR_H / 2 + 4}
        width={CHAIR_W}
        height={CHAIR_H - 4}
        rx={3}
        ry={3}
        fill={`url(#chair-grad-${id})`}
      />
      {/* Back */}
      <rect
        x={-CHAIR_W / 2}
        y={-CHAIR_H / 2}
        width={CHAIR_W}
        height={5}
        rx={2}
        ry={2}
        fill={color}
        opacity={0.85}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={0.75}
      />
    </g>
  );
}

// ─── Table-setting decorations ────────────────────────────────────────────────
function RectPlaceSettings({
  cap,
  w,
}: {
  cap: number;
  w: number;
  h: number;
}) {
  // Place small placemat decorations inside the rect — top row only to keep it subtle
  const count = Math.min(cap, 4);
  const spacing = w / (count + 1);
  const items: React.ReactNode[] = [];
  for (let i = 1; i <= count; i++) {
    const cx = -w / 2 + spacing * i;
    const cy = 0;
    const key = `ps-${i}`;
    items.push(
      <g key={key} transform={`translate(${cx},${cy})`}>
        {/* Placemat */}
        <ellipse
          cx={0}
          cy={0}
          rx={9}
          ry={7}
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={0.75}
        />
        {/* Fork */}
        <line
          x1={-6}
          y1={-5}
          x2={-6}
          y2={5}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={0.75}
          strokeLinecap="round"
        />
        {/* Knife */}
        <line
          x1={6}
          y1={-5}
          x2={6}
          y2={5}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={0.75}
          strokeLinecap="round"
        />
        {/* Glass */}
        <circle
          cx={0}
          cy={-10}
          r={3}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={0.75}
        />
      </g>,
    );
  }
  // Constrain to table surface
  return <g clipPath="inset(0 round 8px)">{items}</g>;
}

function CirclePlaceSettings({ cap, r }: { cap: number; r: number }) {
  const count = Math.min(cap, 6);
  const items: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const angle = ((360 / count) * i - 90) * (Math.PI / 180);
    const dist = r * 0.5;
    const cx = Math.cos(angle) * dist;
    const cy = Math.sin(angle) * dist;
    items.push(
      <g key={`cp-${i}`} transform={`translate(${cx},${cy})`}>
        <ellipse
          cx={0}
          cy={0}
          rx={6}
          ry={5}
          fill="rgba(255,255,255,0.07)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={0.75}
        />
        <circle
          cx={0}
          cy={-8}
          r={2}
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={0.75}
        />
      </g>,
    );
  }
  return <>{items}</>;
}

// ─── Premium table SVG ────────────────────────────────────────────────────────
interface TableSVGProps {
  table: Table;
  isHighlighted: boolean;
  isSuggested: boolean;
  isSelected: boolean;
  isDragging: boolean;
  isFocused: boolean;
  zone?: string;
  zoneColors: Record<string, string>;
}

function TableSVG({
  table,
  isHighlighted,
  isSuggested,
  isSelected,
  isDragging,
  isFocused,
  zone,
  zoneColors,
}: TableSVGProps) {
  const status = String(table.status);
  const col = getStatusColors(status);
  const cap = Number(table.capacity);
  const isRound = (table as Table & { shape?: string }).shape === "round";

  // Unique IDs for SVG defs (must be stable per table)
  const uid = `t-${table.id.replace(/[^a-zA-Z0-9]/g, "")}`;

  if (isRound) {
    const r = getCircleRadius(cap);
    const svgSize = (r + CHAIR_GAP + CHAIR_H + 40) * 2;
    const half = svgSize / 2;
    const chairs = getCircleChairs(cap, r);

    return (
      <svg
        width={svgSize}
        height={svgSize}
        style={{ overflow: "visible" }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`fill-${uid}`} cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor={col.gradTop} />
            <stop offset="100%" stopColor={col.gradBot} />
          </radialGradient>
          <filter
            id={`glow-${uid}`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id={`surface-${uid}`} cx="50%" cy="35%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.07)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        <g transform={`translate(${half},${half})`}>
          {/* Glow halo */}
          {status !== "unavailable" && (
            <circle
              cx={0}
              cy={0}
              r={r + 4}
              fill="none"
              stroke={col.glow}
              strokeWidth={8}
              opacity={isDragging ? 0.7 : 0.35}
              filter={`url(#glow-${uid})`}
            />
          )}

          {/* Zone tint */}
          {zone && (
            <circle cx={0} cy={0} r={r} fill={getZoneTint(zone, zoneColors)} />
          )}

          {/* Table fill */}
          <circle cx={0} cy={0} r={r} fill={`url(#fill-${uid})`} />
          <circle
            cx={0}
            cy={0}
            r={r}
            fill="none"
            stroke={col.stroke}
            strokeWidth={
              isDragging || isSelected || isSuggested || isHighlighted
                ? 2.5
                : 1.75
            }
            opacity={0.9}
          />
          {/* Surface gloss */}
          <circle cx={0} cy={0} r={r} fill={`url(#surface-${uid})`} />

          {/* Inner ring (selected/suggested) */}
          {(isSelected || isSuggested || isHighlighted || isFocused) && (
            <circle
              cx={0}
              cy={0}
              r={r - 4}
              fill="none"
              stroke={col.stroke}
              strokeWidth={1}
              strokeDasharray={isSuggested ? "4 3" : undefined}
              opacity={0.5}
            />
          )}

          {/* Place settings */}
          <CirclePlaceSettings cap={cap} r={r} />

          {/* Chairs */}
          {chairs.map((ch, i) => (
            <Chair
              // biome-ignore lint/suspicious/noArrayIndexKey: index is stable for static chair positions
              key={`${uid}-ch-${i}`}
              id={`${uid}-ch-${i}`}
              cx={ch.cx}
              cy={ch.cy}
              angle={ch.angle}
              color={col.chairFill}
            />
          ))}
        </g>
      </svg>
    );
  }

  // Rectangular table
  const { w, h } = getRectDims(cap);
  const svgW = w + (CHAIR_GAP + CHAIR_H) * 2 + 40;
  const svgH = h + (CHAIR_GAP + CHAIR_H) * 2 + 40;
  const ox = svgW / 2;
  const oy = svgH / 2;
  const chairs = getRectChairs(cap, w, h);

  return (
    <svg
      width={svgW}
      height={svgH}
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={col.gradTop} />
          <stop offset="100%" stopColor={col.gradBot} />
        </linearGradient>
        <filter id={`glow-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id={`surface-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <clipPath id={`clip-${uid}`}>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} ry={8} />
        </clipPath>
      </defs>

      <g transform={`translate(${ox},${oy})`}>
        {/* Glow halo */}
        {status !== "unavailable" && (
          <rect
            x={-w / 2 - 4}
            y={-h / 2 - 4}
            width={w + 8}
            height={h + 8}
            rx={10}
            fill="none"
            stroke={col.glow}
            strokeWidth={9}
            opacity={isDragging ? 0.7 : 0.32}
            filter={`url(#glow-${uid})`}
          />
        )}

        {/* Zone tint backdrop */}
        {zone && (
          <rect
            x={-w / 2 - 12}
            y={-h / 2 - 12}
            width={w + 24}
            height={h + 24}
            rx={12}
            fill={getZoneTint(zone, zoneColors)}
          />
        )}

        {/* Table body */}
        <rect
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h}
          rx={8}
          ry={8}
          fill={`url(#fill-${uid})`}
        />
        <rect
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h}
          rx={8}
          ry={8}
          fill="none"
          stroke={col.stroke}
          strokeWidth={
            isDragging || isSelected || isSuggested || isHighlighted
              ? 2.5
              : 1.75
          }
          opacity={0.9}
        />
        {/* Gloss overlay */}
        <rect
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h}
          rx={8}
          ry={8}
          fill={`url(#surface-${uid})`}
        />

        {/* Inner selection ring */}
        {(isSelected || isSuggested || isHighlighted || isFocused) && (
          <rect
            x={-w / 2 + 4}
            y={-h / 2 + 4}
            width={w - 8}
            height={h - 8}
            rx={5}
            fill="none"
            stroke={col.stroke}
            strokeWidth={1}
            strokeDasharray={isSuggested ? "4 3" : undefined}
            opacity={0.45}
          />
        )}

        {/* Place settings clipped to table */}
        <g clipPath={`url(#clip-${uid})`}>
          <RectPlaceSettings cap={cap} w={w} h={h} />
        </g>

        {/* Chairs */}
        {chairs.map((ch, i) => (
          <Chair
            // biome-ignore lint/suspicious/noArrayIndexKey: index is stable for static chair positions
            key={`${uid}-ch-${i}`}
            id={`${uid}-ch-${i}`}
            cx={ch.cx}
            cy={ch.cy}
            angle={ch.angle}
            color={col.chairFill}
          />
        ))}
      </g>
    </svg>
  );
}

// ─── Label badge below table ──────────────────────────────────────────────────
/**
 * LOW-001 fix: Shows actual guest name from table.guestName.
 * If guestName is purely numeric (old reservation ID leak), shows "Gereserveerd".
 * If no guest, shows the status label.
 */
function formatGuestName(rawName?: string): string | null {
  if (!rawName) return null;
  // Guard against numeric IDs leaking in as guest name
  if (/^\d+$/.test(rawName.trim())) return null;
  return rawName.trim();
}

function TableLabel({
  table,
  zone,
}: {
  table: Table;
  zone?: string;
}) {
  const status = String(table.status);
  const col = getStatusColors(status);
  const cap = Number(table.capacity);
  const isRound = (table as Table & { shape?: string }).shape === "round";
  const { w } = isRound ? { w: getCircleRadius(cap) * 2 } : getRectDims(cap);

  // LOW-001 fix: format guest name, fall back to "Reserved" text for reserved tables
  const guestName = formatGuestName(table.guestName ?? undefined);
  const statusLabel = guestName
    ? guestName
    : status === "reserved" || status === "occupied"
      ? "GERESERVEERD"
      : col.labelText;

  return (
    <div
      style={{
        position: "absolute",
        bottom: -32,
        left: "50%",
        transform: "translateX(-50%)",
        whiteSpace: "nowrap",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          background: "rgba(15,23,42,0.88)",
          border: `1px solid ${col.stroke}40`,
          borderRadius: 8,
          padding: "3px 8px",
          minWidth: Math.max(w * 0.8, 80),
          maxWidth: 160,
          backdropFilter: "blur(6px)",
        }}
      >
        <span
          style={{
            color: "#e2e8f0",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.02em",
            textAlign: "center",
            maxWidth: 140,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
          }}
        >
          {table.name} · {cap} pers
        </span>
        <span
          style={{
            color: col.label,
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {statusLabel}
        </span>
        {zone && (
          <span
            style={{
              color: "rgba(148,163,184,0.7)",
              fontSize: 8,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {zone}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
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
  bgImage?: string;
  activeZone?: string;
  tableZones?: Record<string, string>;
  /** LOW-003: zone colors from backend (hex string per zone name) */
  zoneColors?: Record<string, string>;
  undoRef?: React.MutableRefObject<(() => void) | null>;
  /** Override per-table status for day/service view filtering */
  tableStatusOverride?: Record<TableId, string>;
  /** Zone boundary overlay data */
  zoneBoundaries?: ZoneBoundary[];
  onZoneBoundariesChange?: (boundaries: ZoneBoundary[]) => void;
  /** When true, zone boundary handles are interactive */
  isZoneEditMode?: boolean;
  /** Zones list for the boundary editor */
  zonesForBoundaries?: string[];
}

// ─── Main canvas ──────────────────────────────────────────────────────────────
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
  zoneColors = {},
  undoRef,
  tableStatusOverride = {},
  zoneBoundaries = [],
  onZoneBoundariesChange,
  isZoneEditMode = false,
  zonesForBoundaries = [],
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
  const [hoveredId, setHoveredId] = useState<TableId | null>(null);

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

  useEffect(() => {
    if (undoRef) undoRef.current = handleUndo;
  }, [undoRef, handleUndo]);

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
      if (next.has(tableId)) next.delete(tableId);
      else next.add(tableId);
      onSelectionChange(next);
    },
    [selectedTableIds, onSelectionChange],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>, tableId: TableId) => {
      if (!isEditMode || isBulkMode) return;
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
    (e: React.PointerEvent<HTMLElement>) => {
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
    (_e: React.PointerEvent<HTMLElement>, tableId: TableId) => {
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
    (e: React.KeyboardEvent<HTMLElement>, tableId: TableId) => {
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

  const visibleTables = activeZone
    ? tables.filter((tbl) => (tableZones[tbl.id] ?? "Binnen") === activeZone)
    : tables;

  // Compute canvas min-size from table positions
  const canvasMinW = Math.max(
    900,
    ...visibleTables.map((t) => {
      const pos = positions[t.id] ?? { x: Number(t.x), y: Number(t.y) };
      const cap = Number(t.capacity);
      const isRound = (t as Table & { shape?: string }).shape === "round";
      const w = isRound ? getCircleRadius(cap) * 2 : getRectDims(cap).w;
      return pos.x + w + 120;
    }),
  );
  const canvasMinH = Math.max(
    580,
    ...visibleTables.map((t) => {
      const pos = positions[t.id] ?? { x: Number(t.x), y: Number(t.y) };
      const cap = Number(t.capacity);
      const isRound = (t as Table & { shape?: string }).shape === "round";
      const h = isRound ? getCircleRadius(cap) * 2 : getRectDims(cap).h;
      return pos.y + h + 120;
    }),
  );

  return (
    <div className="space-y-0">
      {/* Edit-mode mini toolbar */}
      {isEditMode && (
        <div className="flex items-center gap-2 flex-wrap pb-3">
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
              <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 text-[10px] font-bold rounded-full bg-muted/40">
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

      {/* ─── Canvas ─────────────────────────────────────────────────── */}
      <div
        className="relative w-full overflow-auto rounded-2xl border border-border"
        style={{
          minHeight: 580,
          background: "#0F172A",
        }}
        aria-label={t("seatingPlan.canvasAriaLabel")}
      >
        {/* SVG grid + bg image layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl"
          style={{ minWidth: canvasMinW, minHeight: canvasMinH }}
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="floor-grid"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#334155"
                strokeWidth={0.5}
                opacity={0.4}
              />
            </pattern>
            <pattern
              id="floor-grid-major"
              x={0}
              y={0}
              width={100}
              height={100}
              patternUnits="userSpaceOnUse"
            >
              <rect width={100} height={100} fill="url(#floor-grid)" />
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke="#334155"
                strokeWidth={1}
                opacity={0.25}
              />
            </pattern>
          </defs>

          {bgImage && (
            <image
              href={bgImage}
              x={0}
              y={0}
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
              opacity={0.22}
            />
          )}
          <rect width="100%" height="100%" fill="url(#floor-grid-major)" />
        </svg>

        {/* Zone boundary overlay */}
        {zonesForBoundaries.length > 0 && onZoneBoundariesChange && (
          <ZoneBoundaryEditor
            zones={zonesForBoundaries}
            zoneColors={zoneColors}
            boundaries={zoneBoundaries}
            onChange={onZoneBoundariesChange}
            isEditMode={isZoneEditMode}
            canvasW={canvasMinW}
            canvasH={canvasMinH}
          />
        )}

        {/* Table cards — absolutely positioned */}
        <div
          style={{
            position: "relative",
            minWidth: canvasMinW,
            minHeight: canvasMinH,
          }}
        >
          {visibleTables.map((table) => {
            const pos = positions[table.id] ?? {
              x: Number(table.x),
              y: Number(table.y),
            };
            // Use override status (from day/service filter) if available, else table's own status
            const status =
              tableStatusOverride[table.id] ?? String(table.status);
            const col = getStatusColors(status);
            const cap = Number(table.capacity);
            const isRound =
              (table as Table & { shape?: string }).shape === "round";
            const isDraggingThis = dragging === table.id;
            const isFocused = focusedId === table.id;
            const isSelected = selectedTableIds.has(table.id);
            const isHighlighted = highlightedTableIds?.has(table.id) ?? false;
            const isSuggested =
              aiSuggestion?.suggestedTableIds.includes(table.id) ?? false;
            const isHovered = hoveredId === table.id && !isDraggingThis;
            const zone = tableZones[table.id];

            // SVG bounding dimensions for positioning
            const svgPad = CHAIR_GAP + CHAIR_H + 20;
            const tableW = isRound
              ? getCircleRadius(cap) * 2 + svgPad * 2
              : getRectDims(cap).w + svgPad * 2;
            const tableH = isRound
              ? getCircleRadius(cap) * 2 + svgPad * 2
              : getRectDims(cap).h + svgPad * 2;

            return (
              <div
                key={table.id}
                style={{
                  position: "absolute",
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
                {/* Clickable/draggable table element */}
                <button
                  type="button"
                  style={{
                    position: "relative",
                    display: "block",
                    background: "none",
                    border: "none",
                    padding: 0,
                    transform: isDraggingThis
                      ? "scale(1.06)"
                      : isHovered
                        ? "scale(1.04)"
                        : "scale(1)",
                    transition: isDraggingThis
                      ? "none"
                      : "transform 0.18s ease, filter 0.18s ease",
                    filter: isDraggingThis
                      ? // biome-ignore lint/style/noUnusedTemplateLiteral: interpolation present
                        `drop-shadow(0 24px 40px rgba(0,0,0,0.8))`
                      : isHovered
                        ? `drop-shadow(0 0 14px ${col.glowSoft})`
                        : isSuggested
                          ? `drop-shadow(0 0 20px ${col.glow})`
                          : isHighlighted
                            ? `drop-shadow(0 0 16px ${col.glow})`
                            : "none",
                    cursor: isBulkMode
                      ? "pointer"
                      : isEditMode
                        ? isDraggingThis
                          ? "grabbing"
                          : "grab"
                        : "pointer",
                    outline: "none",
                  }}
                  aria-label={t("seatingPlan.tableAriaLabel", {
                    name: table.name,
                    status: STATUS_LABELS[status] ?? status,
                    capacity: String(table.capacity),
                  })}
                  aria-pressed={isSelected || isFocused}
                  data-ocid={`table-card-${table.id}`}
                  onPointerDown={(e) => onPointerDown(e, table.id)}
                  onPointerMove={onPointerMove}
                  onPointerUp={(e) => onPointerUp(e, table.id)}
                  onClick={() => onCardClick(table.id)}
                  onKeyDown={(e) => onKeyDown(e, table.id)}
                  onMouseEnter={() => setHoveredId(table.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Drag handle indicator (edit mode only) */}
                  {isEditMode && !isBulkMode && (
                    <div
                      style={{
                        position: "absolute",
                        top: svgPad - 14,
                        left: "50%",
                        transform: "translateX(-50%)",
                        color: col.label,
                        opacity: isHovered || isDraggingThis ? 0.9 : 0.4,
                        transition: "opacity 0.2s",
                        display: "flex",
                        pointerEvents: "none",
                        zIndex: 10,
                      }}
                    >
                      <GripVertical style={{ width: 12, height: 12 }} />
                    </div>
                  )}

                  {/* Bulk checkbox */}
                  {isBulkMode && (
                    <div
                      style={{
                        position: "absolute",
                        top: svgPad - 14,
                        left: "50%",
                        transform: "translateX(-50%)",
                        color: isSelected ? col.label : "rgba(148,163,184,0.6)",
                        pointerEvents: "none",
                        zIndex: 10,
                      }}
                    >
                      {isSelected ? (
                        <CheckSquare style={{ width: 14, height: 14 }} />
                      ) : (
                        <Square style={{ width: 14, height: 14 }} />
                      )}
                    </div>
                  )}

                  {/* Premium SVG table */}
                  <div style={{ width: tableW, height: tableH }}>
                    <TableSVG
                      table={table}
                      isHighlighted={isHighlighted}
                      isSuggested={isSuggested}
                      isSelected={isSelected}
                      isDragging={isDraggingThis}
                      isFocused={isFocused}
                      zone={zone}
                      zoneColors={zoneColors}
                    />
                  </div>

                  {/* Label badge */}
                  <TableLabel table={table} zone={zone} />
                </button>

                {/* AI Suggestion overlay — outside button to allow nested buttons */}
                {isSuggested && aiSuggestion && (
                  <div
                    className="ai-suggestion-card suggestion-fade-in"
                    style={{
                      position: "absolute",
                      top: tableH + 40,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 192,
                      zIndex: 40,
                    }}
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
        </div>

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

      {/* ─── Legend ─────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-1 flex-wrap px-2 pt-3 pb-1"
        aria-label={t("seating.legend.label")}
        data-ocid="seating-legend"
      >
        {(
          [
            {
              status: "empty",
              label: t("seating.legend.available"),
              color: "#22C55E",
            },
            {
              status: "reserved",
              label: t("seating.legend.reserved"),
              color: "#F97316",
            },
            {
              status: "occupied",
              label: t("seating.legend.occupied"),
              color: "#EF4444",
            },
            {
              status: "unavailable",
              label: t("seating.legend.unavailable"),
              color: "#64748B",
            },
          ] as const
        ).map(({ status, label, color }) => (
          <div
            key={status}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-muted-foreground"
            style={{
              background: "rgba(15,23,42,0.6)",
              border: `1px solid ${color}30`,
              backdropFilter: "blur(4px)",
            }}
          >
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{
                background: color,
                boxShadow: `0 0 6px ${color}80`,
              }}
              aria-hidden="true"
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
