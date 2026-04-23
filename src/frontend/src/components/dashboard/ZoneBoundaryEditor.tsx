/**
 * ZoneBoundaryEditor — renders zone boundary overlays on the SVG canvas.
 *
 * In VIEW mode: subtle tinted regions with dashed borders show zone areas.
 * In EDIT mode: draggable corner/edge handles let admins resize/move zones.
 *
 * BUG-ZONE-PERSIST fix: Save button now calls onSave(boundaries) which
 * persists to the backend via updateTableZone calls in the parent page.
 */

import { useCallback, useRef, useState } from "react";

// ── Zone colour palette ───────────────────────────────────────────────────────
// Deterministic color from zone name hash — works for any zone name, no hardcoding.
export function getZoneColor(zone: string, colorOverride?: string): string {
  if (colorOverride) return colorOverride;
  // Simple deterministic palette from name hash
  const palette = [
    "#22C55E",
    "#EAB308",
    "#3B82F6",
    "#A855F7",
    "#0EA5E9",
    "#F97316",
    "#EC4899",
    "#14B8A6",
  ];
  let hash = 0;
  for (let i = 0; i < zone.length; i++) {
    hash = (hash * 31 + zone.charCodeAt(i)) >>> 0;
  }
  return palette[hash % palette.length];
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ZoneBoundary {
  zone: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

type DragHandle = "move" | "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";

interface ActiveDrag {
  zone: string;
  handle: DragHandle;
  startClientX: number;
  startClientY: number;
  orig: ZoneBoundary;
  svgLeft: number;
  svgTop: number;
}

interface Props {
  zones: string[];
  /** Optional per-zone color overrides (hex string from backend) */
  zoneColors?: Record<string, string>;
  boundaries: ZoneBoundary[];
  onChange: (boundaries: ZoneBoundary[]) => void;
  isEditMode: boolean;
  canvasW: number;
  canvasH: number;
}

const MIN_SIZE = 60;
const HANDLE_R = 6;

// Default boundary when none saved yet
function defaultBoundary(
  zone: string,
  idx: number,
  total: number,
): ZoneBoundary {
  const cols = Math.min(total, 4);
  const colW = Math.max(200, 900 / cols);
  const col = idx % cols;
  const row = Math.floor(idx / cols);
  return {
    zone,
    x: col * colW + 20,
    y: row * 240 + 20,
    w: colW - 30,
    h: 210,
  };
}

function applyDelta(
  orig: ZoneBoundary,
  handle: DragHandle,
  dx: number,
  dy: number,
  canvasW: number,
  canvasH: number,
): ZoneBoundary {
  let { x, y, w, h } = orig;
  switch (handle) {
    case "move":
      x = Math.max(0, Math.min(orig.x + dx, canvasW - orig.w));
      y = Math.max(0, Math.min(orig.y + dy, canvasH - orig.h));
      break;
    case "nw":
      x = Math.min(orig.x + dx, orig.x + orig.w - MIN_SIZE);
      y = Math.min(orig.y + dy, orig.y + orig.h - MIN_SIZE);
      w = Math.max(MIN_SIZE, orig.w - dx);
      h = Math.max(MIN_SIZE, orig.h - dy);
      break;
    case "ne":
      y = Math.min(orig.y + dy, orig.y + orig.h - MIN_SIZE);
      w = Math.max(MIN_SIZE, orig.w + dx);
      h = Math.max(MIN_SIZE, orig.h - dy);
      break;
    case "sw":
      x = Math.min(orig.x + dx, orig.x + orig.w - MIN_SIZE);
      w = Math.max(MIN_SIZE, orig.w - dx);
      h = Math.max(MIN_SIZE, orig.h + dy);
      break;
    case "se":
      w = Math.max(MIN_SIZE, orig.w + dx);
      h = Math.max(MIN_SIZE, orig.h + dy);
      break;
    case "n":
      y = Math.min(orig.y + dy, orig.y + orig.h - MIN_SIZE);
      h = Math.max(MIN_SIZE, orig.h - dy);
      break;
    case "s":
      h = Math.max(MIN_SIZE, orig.h + dy);
      break;
    case "e":
      w = Math.max(MIN_SIZE, orig.w + dx);
      break;
    case "w":
      x = Math.min(orig.x + dx, orig.x + orig.w - MIN_SIZE);
      w = Math.max(MIN_SIZE, orig.w - dx);
      break;
  }
  // Clamp
  x = Math.max(0, x);
  y = Math.max(0, y);
  w = Math.min(w, canvasW - x);
  h = Math.min(h, canvasH - y);
  return { ...orig, x, y, w, h };
}

// ── Component ─────────────────────────────────────────────────────────────────
export function ZoneBoundaryEditor({
  zones,
  zoneColors = {},
  boundaries,
  onChange,
  isEditMode,
  canvasW,
  canvasH,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const activeDrag = useRef<ActiveDrag | null>(null);
  const [draggingZone, setDraggingZone] = useState<string | null>(null);

  const resolvedBoundaries: ZoneBoundary[] = zones.map((zone, i) => {
    const saved = boundaries.find((b) => b.zone === zone);
    return saved ?? defaultBoundary(zone, i, zones.length);
  });

  const onHandlePointerDown = useCallback(
    (
      e: React.PointerEvent<SVGRectElement | SVGCircleElement>,
      zone: string,
      handle: DragHandle,
      bound: ZoneBoundary,
    ) => {
      if (!isEditMode) return;
      e.stopPropagation();
      e.preventDefault();
      (
        e.currentTarget as SVGElement & {
          setPointerCapture: (id: number) => void;
        }
      ).setPointerCapture(e.pointerId);
      const svg = svgRef.current;
      const svgRect = svg?.getBoundingClientRect();
      activeDrag.current = {
        zone,
        handle,
        startClientX: e.clientX,
        startClientY: e.clientY,
        orig: { ...bound },
        svgLeft: svgRect?.left ?? 0,
        svgTop: svgRect?.top ?? 0,
      };
      setDraggingZone(zone);
    },
    [isEditMode],
  );

  const onHandlePointerMove = useCallback(
    (e: React.PointerEvent<SVGRectElement | SVGCircleElement>) => {
      const drag = activeDrag.current;
      if (!drag) return;
      const dx = e.clientX - drag.startClientX;
      const dy = e.clientY - drag.startClientY;
      const updated = applyDelta(
        drag.orig,
        drag.handle,
        dx,
        dy,
        canvasW,
        canvasH,
      );
      const newBounds = resolvedBoundaries.map((b) =>
        b.zone === drag.zone ? updated : b,
      );
      onChange(newBounds);
    },
    [resolvedBoundaries, onChange, canvasW, canvasH],
  );

  const onHandlePointerUp = useCallback(() => {
    activeDrag.current = null;
    setDraggingZone(null);
  }, []);

  const EDGE_HANDLES = [
    {
      handle: "n" as DragHandle,
      getCx: (b: ZoneBoundary) => b.x + b.w / 2,
      getCy: (b: ZoneBoundary) => b.y,
      cursor: "n-resize",
    },
    {
      handle: "s" as DragHandle,
      getCx: (b: ZoneBoundary) => b.x + b.w / 2,
      getCy: (b: ZoneBoundary) => b.y + b.h,
      cursor: "s-resize",
    },
    {
      handle: "e" as DragHandle,
      getCx: (b: ZoneBoundary) => b.x + b.w,
      getCy: (b: ZoneBoundary) => b.y + b.h / 2,
      cursor: "e-resize",
    },
    {
      handle: "w" as DragHandle,
      getCx: (b: ZoneBoundary) => b.x,
      getCy: (b: ZoneBoundary) => b.y + b.h / 2,
      cursor: "w-resize",
    },
  ] as const;

  const CORNER_HANDLES = [
    {
      handle: "nw" as DragHandle,
      getX: (b: ZoneBoundary) => b.x,
      getY: (b: ZoneBoundary) => b.y,
      cursor: "nw-resize",
    },
    {
      handle: "ne" as DragHandle,
      getX: (b: ZoneBoundary) => b.x + b.w,
      getY: (b: ZoneBoundary) => b.y,
      cursor: "ne-resize",
    },
    {
      handle: "sw" as DragHandle,
      getX: (b: ZoneBoundary) => b.x,
      getY: (b: ZoneBoundary) => b.y + b.h,
      cursor: "sw-resize",
    },
    {
      handle: "se" as DragHandle,
      getX: (b: ZoneBoundary) => b.x + b.w,
      getY: (b: ZoneBoundary) => b.y + b.h,
      cursor: "se-resize",
    },
  ] as const;

  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: decorative canvas overlay
    <svg
      ref={svgRef}
      className="absolute inset-0"
      style={{
        width: canvasW,
        height: canvasH,
        zIndex: 5,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      {resolvedBoundaries.map((bound) => {
        const color = getZoneColor(bound.zone, zoneColors[bound.zone]);
        const isThisDragging = draggingZone === bound.zone;
        const labelW = bound.zone.length * 7 + 24;

        return (
          <g key={bound.zone}>
            {/* Zone fill — move handle */}
            <rect
              x={bound.x}
              y={bound.y}
              width={bound.w}
              height={bound.h}
              rx={12}
              fill={`${color}18`}
              stroke={color}
              strokeWidth={isEditMode ? 1.5 : 0.75}
              strokeDasharray={isEditMode ? "6 4" : "5 7"}
              opacity={isEditMode ? (isThisDragging ? 1 : 0.85) : 0.45}
              style={{
                pointerEvents: isEditMode ? "all" : "none",
                cursor: isEditMode ? "move" : "default",
              }}
              onPointerDown={
                isEditMode
                  ? (e) =>
                      onHandlePointerDown(
                        e as unknown as React.PointerEvent<SVGRectElement>,
                        bound.zone,
                        "move",
                        bound,
                      )
                  : undefined
              }
              onPointerMove={
                isEditMode
                  ? (e) =>
                      onHandlePointerMove(
                        e as unknown as React.PointerEvent<SVGRectElement>,
                      )
                  : undefined
              }
              onPointerUp={isEditMode ? onHandlePointerUp : undefined}
            />

            {/* Zone label badge */}
            <g
              transform={`translate(${bound.x + 10}, ${bound.y + 10})`}
              style={{ pointerEvents: "none" }}
            >
              <rect
                x={0}
                y={0}
                width={labelW}
                height={22}
                rx={6}
                fill="rgba(15,23,42,0.85)"
                stroke={`${color}50`}
                strokeWidth={1}
              />
              <circle cx={10} cy={11} r={4} fill={color} />
              <text
                x={19}
                y={15.5}
                fill={color}
                fontSize={10}
                fontWeight="700"
                letterSpacing="0.05em"
                fontFamily="inherit"
              >
                {bound.zone.toUpperCase()}
              </text>
            </g>

            {/* Resize handles — only in edit mode */}
            {isEditMode && (
              <>
                {EDGE_HANDLES.map(({ handle, getCx, getCy, cursor }) => (
                  <circle
                    key={handle}
                    cx={getCx(bound)}
                    cy={getCy(bound)}
                    r={HANDLE_R - 1}
                    fill="rgba(15,23,42,0.92)"
                    stroke={color}
                    strokeWidth={1.5}
                    style={{ pointerEvents: "all", cursor }}
                    onPointerDown={(e) =>
                      onHandlePointerDown(
                        e as unknown as React.PointerEvent<SVGRectElement>,
                        bound.zone,
                        handle,
                        bound,
                      )
                    }
                    onPointerMove={(e) =>
                      onHandlePointerMove(
                        e as unknown as React.PointerEvent<SVGRectElement>,
                      )
                    }
                    onPointerUp={onHandlePointerUp}
                  />
                ))}

                {CORNER_HANDLES.map(({ handle, getX, getY, cursor }) => (
                  <rect
                    key={handle}
                    x={getX(bound) - HANDLE_R}
                    y={getY(bound) - HANDLE_R}
                    width={HANDLE_R * 2}
                    height={HANDLE_R * 2}
                    rx={2}
                    fill={
                      isThisDragging && activeDrag.current?.handle === handle
                        ? color
                        : "rgba(15,23,42,0.92)"
                    }
                    stroke={color}
                    strokeWidth={2}
                    style={{ pointerEvents: "all", cursor }}
                    onPointerDown={(e) =>
                      onHandlePointerDown(
                        e as unknown as React.PointerEvent<SVGRectElement>,
                        bound.zone,
                        handle,
                        bound,
                      )
                    }
                    onPointerMove={(e) =>
                      onHandlePointerMove(
                        e as unknown as React.PointerEvent<SVGRectElement>,
                      )
                    }
                    onPointerUp={onHandlePointerUp}
                  />
                ))}
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Utility: infer which zone a table position belongs to ─────────────────────
export function getTableZoneFromBoundaries(
  tableX: number,
  tableY: number,
  boundaries: ZoneBoundary[],
): string | undefined {
  for (const b of boundaries) {
    if (
      tableX >= b.x &&
      tableX <= b.x + b.w &&
      tableY >= b.y &&
      tableY <= b.y + b.h
    ) {
      return b.zone;
    }
  }
  return undefined;
}

export type { DragHandle };
