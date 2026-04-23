import { i as createLucideIcon, r as reactExports, j as jsxRuntimeExports, u as useTranslation, bx as useUpdateTablePosition, c as cn } from "./index-BNayfcmF.js";
import { R as RotateCcw } from "./rotate-ccw-DUbkDf76.js";
import { G as GripVertical } from "./grip-vertical-anmQwo2Z.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5", key: "1uzm8b" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const SquareCheckBig = createLucideIcon("square-check-big", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]
];
const Square = createLucideIcon("square", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M17 14V2", key: "8ymqnk" }],
  [
    "path",
    {
      d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z",
      key: "m61m77"
    }
  ]
];
const ThumbsDown = createLucideIcon("thumbs-down", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M7 10v12", key: "1qc93n" }],
  [
    "path",
    {
      d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z",
      key: "emmmcr"
    }
  ]
];
const ThumbsUp = createLucideIcon("thumbs-up", __iconNode);
function getZoneColor(zone, colorOverride) {
  if (colorOverride) return colorOverride;
  const palette = [
    "#22C55E",
    "#EAB308",
    "#3B82F6",
    "#A855F7",
    "#0EA5E9",
    "#F97316",
    "#EC4899",
    "#14B8A6"
  ];
  let hash = 0;
  for (let i = 0; i < zone.length; i++) {
    hash = hash * 31 + zone.charCodeAt(i) >>> 0;
  }
  return palette[hash % palette.length];
}
const MIN_SIZE = 60;
const HANDLE_R = 6;
function defaultBoundary(zone, idx, total) {
  const cols = Math.min(total, 4);
  const colW = Math.max(200, 900 / cols);
  const col = idx % cols;
  const row = Math.floor(idx / cols);
  return {
    zone,
    x: col * colW + 20,
    y: row * 240 + 20,
    w: colW - 30,
    h: 210
  };
}
function applyDelta(orig, handle, dx, dy, canvasW, canvasH) {
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
  x = Math.max(0, x);
  y = Math.max(0, y);
  w = Math.min(w, canvasW - x);
  h = Math.min(h, canvasH - y);
  return { ...orig, x, y, w, h };
}
function ZoneBoundaryEditor({
  zones,
  zoneColors = {},
  boundaries,
  onChange,
  isEditMode,
  canvasW,
  canvasH
}) {
  const svgRef = reactExports.useRef(null);
  const activeDrag = reactExports.useRef(null);
  const [draggingZone, setDraggingZone] = reactExports.useState(null);
  const resolvedBoundaries = zones.map((zone, i) => {
    const saved = boundaries.find((b) => b.zone === zone);
    return saved ?? defaultBoundary(zone, i, zones.length);
  });
  const onHandlePointerDown = reactExports.useCallback(
    (e, zone, handle, bound) => {
      if (!isEditMode) return;
      e.stopPropagation();
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      const svg = svgRef.current;
      const svgRect = svg == null ? void 0 : svg.getBoundingClientRect();
      activeDrag.current = {
        zone,
        handle,
        startClientX: e.clientX,
        startClientY: e.clientY,
        orig: { ...bound },
        svgLeft: (svgRect == null ? void 0 : svgRect.left) ?? 0,
        svgTop: (svgRect == null ? void 0 : svgRect.top) ?? 0
      };
      setDraggingZone(zone);
    },
    [isEditMode]
  );
  const onHandlePointerMove = reactExports.useCallback(
    (e) => {
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
        canvasH
      );
      const newBounds = resolvedBoundaries.map(
        (b) => b.zone === drag.zone ? updated : b
      );
      onChange(newBounds);
    },
    [resolvedBoundaries, onChange, canvasW, canvasH]
  );
  const onHandlePointerUp = reactExports.useCallback(() => {
    activeDrag.current = null;
    setDraggingZone(null);
  }, []);
  const EDGE_HANDLES = [
    {
      handle: "n",
      getCx: (b) => b.x + b.w / 2,
      getCy: (b) => b.y,
      cursor: "n-resize"
    },
    {
      handle: "s",
      getCx: (b) => b.x + b.w / 2,
      getCy: (b) => b.y + b.h,
      cursor: "s-resize"
    },
    {
      handle: "e",
      getCx: (b) => b.x + b.w,
      getCy: (b) => b.y + b.h / 2,
      cursor: "e-resize"
    },
    {
      handle: "w",
      getCx: (b) => b.x,
      getCy: (b) => b.y + b.h / 2,
      cursor: "w-resize"
    }
  ];
  const CORNER_HANDLES = [
    {
      handle: "nw",
      getX: (b) => b.x,
      getY: (b) => b.y,
      cursor: "nw-resize"
    },
    {
      handle: "ne",
      getX: (b) => b.x + b.w,
      getY: (b) => b.y,
      cursor: "ne-resize"
    },
    {
      handle: "sw",
      getX: (b) => b.x,
      getY: (b) => b.y + b.h,
      cursor: "sw-resize"
    },
    {
      handle: "se",
      getX: (b) => b.x + b.w,
      getY: (b) => b.y + b.h,
      cursor: "se-resize"
    }
  ];
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: decorative canvas overlay
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "svg",
      {
        ref: svgRef,
        className: "absolute inset-0",
        style: {
          width: canvasW,
          height: canvasH,
          zIndex: 5,
          pointerEvents: "none"
        },
        "aria-hidden": "true",
        children: resolvedBoundaries.map((bound) => {
          const color = getZoneColor(bound.zone, zoneColors[bound.zone]);
          const isThisDragging = draggingZone === bound.zone;
          const labelW = bound.zone.length * 7 + 24;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "rect",
              {
                x: bound.x,
                y: bound.y,
                width: bound.w,
                height: bound.h,
                rx: 12,
                fill: `${color}18`,
                stroke: color,
                strokeWidth: isEditMode ? 1.5 : 0.75,
                strokeDasharray: isEditMode ? "6 4" : "5 7",
                opacity: isEditMode ? isThisDragging ? 1 : 0.85 : 0.45,
                style: {
                  pointerEvents: isEditMode ? "all" : "none",
                  cursor: isEditMode ? "move" : "default"
                },
                onPointerDown: isEditMode ? (e) => onHandlePointerDown(
                  e,
                  bound.zone,
                  "move",
                  bound
                ) : void 0,
                onPointerMove: isEditMode ? (e) => onHandlePointerMove(
                  e
                ) : void 0,
                onPointerUp: isEditMode ? onHandlePointerUp : void 0
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "g",
              {
                transform: `translate(${bound.x + 10}, ${bound.y + 10})`,
                style: { pointerEvents: "none" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "rect",
                    {
                      x: 0,
                      y: 0,
                      width: labelW,
                      height: 22,
                      rx: 6,
                      fill: "rgba(15,23,42,0.85)",
                      stroke: `${color}50`,
                      strokeWidth: 1
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: 10, cy: 11, r: 4, fill: color }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "text",
                    {
                      x: 19,
                      y: 15.5,
                      fill: color,
                      fontSize: 10,
                      fontWeight: "700",
                      letterSpacing: "0.05em",
                      fontFamily: "inherit",
                      children: bound.zone.toUpperCase()
                    }
                  )
                ]
              }
            ),
            isEditMode && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              EDGE_HANDLES.map(({ handle, getCx, getCy, cursor }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: getCx(bound),
                  cy: getCy(bound),
                  r: HANDLE_R - 1,
                  fill: "rgba(15,23,42,0.92)",
                  stroke: color,
                  strokeWidth: 1.5,
                  style: { pointerEvents: "all", cursor },
                  onPointerDown: (e) => onHandlePointerDown(
                    e,
                    bound.zone,
                    handle,
                    bound
                  ),
                  onPointerMove: (e) => onHandlePointerMove(
                    e
                  ),
                  onPointerUp: onHandlePointerUp
                },
                handle
              )),
              CORNER_HANDLES.map(({ handle, getX, getY, cursor }) => {
                var _a;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "rect",
                  {
                    x: getX(bound) - HANDLE_R,
                    y: getY(bound) - HANDLE_R,
                    width: HANDLE_R * 2,
                    height: HANDLE_R * 2,
                    rx: 2,
                    fill: isThisDragging && ((_a = activeDrag.current) == null ? void 0 : _a.handle) === handle ? color : "rgba(15,23,42,0.92)",
                    stroke: color,
                    strokeWidth: 2,
                    style: { pointerEvents: "all", cursor },
                    onPointerDown: (e) => onHandlePointerDown(
                      e,
                      bound.zone,
                      handle,
                      bound
                    ),
                    onPointerMove: (e) => onHandlePointerMove(
                      e
                    ),
                    onPointerUp: onHandlePointerUp
                  },
                  handle
                );
              })
            ] })
          ] }, bound.zone);
        })
      }
    )
  );
}
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
    gradBot: "rgba(34,197,94,0.05)"
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
    gradBot: "rgba(249,115,22,0.05)"
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
    gradBot: "rgba(239,68,68,0.05)"
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
    gradBot: "rgba(100,116,139,0.04)"
  }
};
function getStatusColors(status) {
  return STATUS_COLORS[status] ?? STATUS_COLORS.empty;
}
function getZoneTint(zoneName, zoneColors) {
  const color = zoneColors[zoneName] ?? getZoneColor(zoneName);
  const hex = color.replace("#", "");
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},0.04)`;
}
function getRectDims(capacity) {
  if (capacity <= 2) return { w: 80, h: 60 };
  if (capacity <= 4) return { w: 100, h: 80 };
  if (capacity <= 6) return { w: 130, h: 90 };
  return { w: 160, h: 100 };
}
function getCircleRadius(capacity) {
  if (capacity <= 2) return 35;
  if (capacity <= 4) return 45;
  if (capacity <= 6) return 55;
  return 65;
}
const CHAIR_W = 14;
const CHAIR_H = 18;
const CHAIR_GAP = 16;
function getRectChairs(cap, w, h) {
  const chairs = [];
  const total = cap;
  const topCount = Math.round(total / 2);
  const bottomCount = total - topCount;
  const placeRow = (count, yOff, rotDeg, edgeW) => {
    const spacing = edgeW / (count + 1);
    for (let i = 1; i <= count; i++) {
      chairs.push({ cx: -edgeW / 2 + spacing * i, cy: yOff, angle: rotDeg });
    }
  };
  placeRow(topCount, -h / 2 - CHAIR_GAP, 0, w * 0.85);
  placeRow(bottomCount, h / 2 + CHAIR_GAP, 180, w * 0.85);
  return chairs;
}
function getCircleChairs(cap, r) {
  const chairs = [];
  for (let i = 0; i < cap; i++) {
    const angle = 360 / cap * i - 90;
    const rad = angle * Math.PI / 180;
    const dist = r + CHAIR_GAP;
    chairs.push({
      cx: Math.cos(rad) * dist,
      cy: Math.sin(rad) * dist,
      angle: angle + 90
      // face table centre
    });
  }
  return chairs;
}
function Chair({
  cx,
  cy,
  angle,
  color,
  id
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: `translate(${cx},${cy}) rotate(${angle})`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `chair-grad-${id}`, cx: "50%", cy: "30%", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#ffffff", stopOpacity: "0.2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#000000", stopOpacity: "0.1" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "rect",
      {
        x: -CHAIR_W / 2,
        y: -CHAIR_H / 2 + 4,
        width: CHAIR_W,
        height: CHAIR_H - 4,
        rx: 3,
        ry: 3,
        fill: color,
        stroke: "rgba(255,255,255,0.15)",
        strokeWidth: 0.75
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "rect",
      {
        x: -CHAIR_W / 2,
        y: -CHAIR_H / 2 + 4,
        width: CHAIR_W,
        height: CHAIR_H - 4,
        rx: 3,
        ry: 3,
        fill: `url(#chair-grad-${id})`
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "rect",
      {
        x: -CHAIR_W / 2,
        y: -CHAIR_H / 2,
        width: CHAIR_W,
        height: 5,
        rx: 2,
        ry: 2,
        fill: color,
        opacity: 0.85,
        stroke: "rgba(255,255,255,0.15)",
        strokeWidth: 0.75
      }
    )
  ] });
}
function RectPlaceSettings({
  cap,
  w
}) {
  const count = Math.min(cap, 4);
  const spacing = w / (count + 1);
  const items = [];
  for (let i = 1; i <= count; i++) {
    const cx = -w / 2 + spacing * i;
    const cy = 0;
    const key = `ps-${i}`;
    items.push(
      /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: `translate(${cx},${cy})`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: 0,
            cy: 0,
            rx: 9,
            ry: 7,
            fill: "rgba(255,255,255,0.08)",
            stroke: "rgba(255,255,255,0.18)",
            strokeWidth: 0.75
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: -6,
            y1: -5,
            x2: -6,
            y2: 5,
            stroke: "rgba(255,255,255,0.25)",
            strokeWidth: 0.75,
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: 6,
            y1: -5,
            x2: 6,
            y2: 5,
            stroke: "rgba(255,255,255,0.25)",
            strokeWidth: 0.75,
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: 0,
            cy: -10,
            r: 3,
            fill: "none",
            stroke: "rgba(255,255,255,0.3)",
            strokeWidth: 0.75
          }
        )
      ] }, key)
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("g", { clipPath: "inset(0 round 8px)", children: items });
}
function CirclePlaceSettings({ cap, r }) {
  const count = Math.min(cap, 6);
  const items = [];
  for (let i = 0; i < count; i++) {
    const angle = (360 / count * i - 90) * (Math.PI / 180);
    const dist = r * 0.5;
    const cx = Math.cos(angle) * dist;
    const cy = Math.sin(angle) * dist;
    items.push(
      /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: `translate(${cx},${cy})`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: 0,
            cy: 0,
            rx: 6,
            ry: 5,
            fill: "rgba(255,255,255,0.07)",
            stroke: "rgba(255,255,255,0.15)",
            strokeWidth: 0.75
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: 0,
            cy: -8,
            r: 2,
            fill: "none",
            stroke: "rgba(255,255,255,0.25)",
            strokeWidth: 0.75
          }
        )
      ] }, `cp-${i}`)
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: items });
}
function TableSVG({
  table,
  isHighlighted,
  isSuggested,
  isSelected,
  isDragging,
  isFocused,
  zone,
  zoneColors
}) {
  const status = String(table.status);
  const col = getStatusColors(status);
  const cap = Number(table.capacity);
  const isRound = table.shape === "round";
  const uid = `t-${table.id.replace(/[^a-zA-Z0-9]/g, "")}`;
  if (isRound) {
    const r = getCircleRadius(cap);
    const svgSize = (r + CHAIR_GAP + CHAIR_H + 40) * 2;
    const half = svgSize / 2;
    const chairs2 = getCircleChairs(cap, r);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        width: svgSize,
        height: svgSize,
        style: { overflow: "visible" },
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `fill-${uid}`, cx: "50%", cy: "35%", r: "60%", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: col.gradTop }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: col.gradBot })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "filter",
              {
                id: `glow-${uid}`,
                x: "-50%",
                y: "-50%",
                width: "200%",
                height: "200%",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "6", result: "blur" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("feComposite", { in: "SourceGraphic", in2: "blur", operator: "over" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `surface-${uid}`, cx: "50%", cy: "35%", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "rgba(255,255,255,0.07)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "rgba(0,0,0,0)" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: `translate(${half},${half})`, children: [
            status !== "unavailable" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: 0,
                cy: 0,
                r: r + 4,
                fill: "none",
                stroke: col.glow,
                strokeWidth: 8,
                opacity: isDragging ? 0.7 : 0.35,
                filter: `url(#glow-${uid})`
              }
            ),
            zone && /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: 0, cy: 0, r, fill: getZoneTint(zone, zoneColors) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: 0, cy: 0, r, fill: `url(#fill-${uid})` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: 0,
                cy: 0,
                r,
                fill: "none",
                stroke: col.stroke,
                strokeWidth: isDragging || isSelected || isSuggested || isHighlighted ? 2.5 : 1.75,
                opacity: 0.9
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: 0, cy: 0, r, fill: `url(#surface-${uid})` }),
            (isSelected || isSuggested || isHighlighted || isFocused) && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: 0,
                cy: 0,
                r: r - 4,
                fill: "none",
                stroke: col.stroke,
                strokeWidth: 1,
                strokeDasharray: isSuggested ? "4 3" : void 0,
                opacity: 0.5
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlaceSettings, { cap, r }),
            chairs2.map((ch, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Chair,
              {
                id: `${uid}-ch-${i}`,
                cx: ch.cx,
                cy: ch.cy,
                angle: ch.angle,
                color: col.chairFill
              },
              `${uid}-ch-${i}`
            ))
          ] })
        ]
      }
    );
  }
  const { w, h } = getRectDims(cap);
  const svgW = w + (CHAIR_GAP + CHAIR_H) * 2 + 40;
  const svgH = h + (CHAIR_GAP + CHAIR_H) * 2 + 40;
  const ox = svgW / 2;
  const oy = svgH / 2;
  const chairs = getRectChairs(cap, w, h);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: svgW,
      height: svgH,
      style: { overflow: "visible" },
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `fill-${uid}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: col.gradTop }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: col.gradBot })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `glow-${uid}`, x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "5", result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feComposite", { in: "SourceGraphic", in2: "blur", operator: "over" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `surface-${uid}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "rgba(255,255,255,0.08)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "rgba(255,255,255,0)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: `clip-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: -w / 2, y: -h / 2, width: w, height: h, rx: 8, ry: 8 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: `translate(${ox},${oy})`, children: [
          status !== "unavailable" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "rect",
            {
              x: -w / 2 - 4,
              y: -h / 2 - 4,
              width: w + 8,
              height: h + 8,
              rx: 10,
              fill: "none",
              stroke: col.glow,
              strokeWidth: 9,
              opacity: isDragging ? 0.7 : 0.32,
              filter: `url(#glow-${uid})`
            }
          ),
          zone && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "rect",
            {
              x: -w / 2 - 12,
              y: -h / 2 - 12,
              width: w + 24,
              height: h + 24,
              rx: 12,
              fill: getZoneTint(zone, zoneColors)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "rect",
            {
              x: -w / 2,
              y: -h / 2,
              width: w,
              height: h,
              rx: 8,
              ry: 8,
              fill: `url(#fill-${uid})`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "rect",
            {
              x: -w / 2,
              y: -h / 2,
              width: w,
              height: h,
              rx: 8,
              ry: 8,
              fill: "none",
              stroke: col.stroke,
              strokeWidth: isDragging || isSelected || isSuggested || isHighlighted ? 2.5 : 1.75,
              opacity: 0.9
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "rect",
            {
              x: -w / 2,
              y: -h / 2,
              width: w,
              height: h,
              rx: 8,
              ry: 8,
              fill: `url(#surface-${uid})`
            }
          ),
          (isSelected || isSuggested || isHighlighted || isFocused) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "rect",
            {
              x: -w / 2 + 4,
              y: -h / 2 + 4,
              width: w - 8,
              height: h - 8,
              rx: 5,
              fill: "none",
              stroke: col.stroke,
              strokeWidth: 1,
              strokeDasharray: isSuggested ? "4 3" : void 0,
              opacity: 0.45
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("g", { clipPath: `url(#clip-${uid})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RectPlaceSettings, { cap, w, h }) }),
          chairs.map((ch, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Chair,
            {
              id: `${uid}-ch-${i}`,
              cx: ch.cx,
              cy: ch.cy,
              angle: ch.angle,
              color: col.chairFill
            },
            `${uid}-ch-${i}`
          ))
        ] })
      ]
    }
  );
}
function formatGuestName(rawName) {
  if (!rawName) return null;
  if (/^\d+$/.test(rawName.trim())) return null;
  return rawName.trim();
}
function TableLabel({
  table,
  zone
}) {
  const status = String(table.status);
  const col = getStatusColors(status);
  const cap = Number(table.capacity);
  const isRound = table.shape === "round";
  const { w } = isRound ? { w: getCircleRadius(cap) * 2 } : getRectDims(cap);
  const guestName = formatGuestName(table.guestName ?? void 0);
  const statusLabel = guestName ? guestName : status === "reserved" || status === "occupied" ? "GERESERVEERD" : col.labelText;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        position: "absolute",
        bottom: -32,
        left: "50%",
        transform: "translateX(-50%)",
        whiteSpace: "nowrap",
        pointerEvents: "none"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
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
            backdropFilter: "blur(6px)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                style: {
                  color: "#e2e8f0",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  textAlign: "center",
                  maxWidth: 140,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block"
                },
                children: [
                  table.name,
                  " · ",
                  cap,
                  " pers"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: {
                  color: col.label,
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase"
                },
                children: statusLabel
              }
            ),
            zone && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: {
                  color: "rgba(148,163,184,0.7)",
                  fontSize: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em"
                },
                children: zone
              }
            )
          ]
        }
      )
    }
  );
}
const SNAP = 20;
const snapTo = (v) => Math.round(v / SNAP) * SNAP;
function FloorPlanCanvas({
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
  zonesForBoundaries = []
}) {
  const { t } = useTranslation("dashboard");
  const STATUS_LABELS = {
    empty: t("seatingPlan.tableEmpty"),
    reserved: t("seatingPlan.tableReserved"),
    occupied: t("seatingPlan.tableOccupied"),
    unavailable: t("seatingPlan.tableUnavailable")
  };
  const updatePosition = useUpdateTablePosition();
  const [positions, setPositions] = reactExports.useState({});
  const [dragging, setDragging] = reactExports.useState(null);
  const [focusedId, setFocusedId] = reactExports.useState(null);
  const [history, setHistory] = reactExports.useState([]);
  const [rejectReason, setRejectReason] = reactExports.useState("");
  const [showRejectDropdown, setShowRejectDropdown] = reactExports.useState(
    null
  );
  const [hoveredId, setHoveredId] = reactExports.useState(null);
  const dragMoved = reactExports.useRef(false);
  const pointerStartRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    setPositions((prev) => {
      const next = {};
      for (const tbl of tables) {
        next[tbl.id] = prev[tbl.id] ?? { x: Number(tbl.x), y: Number(tbl.y) };
      }
      return next;
    });
  }, [tables]);
  const pushHistory = reactExports.useCallback((snapshot) => {
    setHistory((h) => [...h.slice(-19), { ...snapshot }]);
  }, []);
  const handleUndo = reactExports.useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setPositions(prev);
    setHistory((h) => h.slice(0, -1));
    for (const [id, pos] of Object.entries(prev)) {
      updatePosition.mutate({ id, x: pos.x, y: pos.y });
    }
  }, [history, updatePosition]);
  reactExports.useEffect(() => {
    if (undoRef) undoRef.current = handleUndo;
  }, [undoRef, handleUndo]);
  reactExports.useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && isEditMode) {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleUndo, isEditMode]);
  const toggleSelectTable = reactExports.useCallback(
    (tableId) => {
      const next = new Set(selectedTableIds);
      if (next.has(tableId)) next.delete(tableId);
      else next.add(tableId);
      onSelectionChange(next);
    },
    [selectedTableIds, onSelectionChange]
  );
  const onPointerDown = reactExports.useCallback(
    (e, tableId) => {
      var _a, _b;
      if (!isEditMode || isBulkMode) return;
      if (e.pointerType === "touch") return;
      e.currentTarget.setPointerCapture(e.pointerId);
      dragMoved.current = false;
      pointerStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        tableX: ((_a = positions[tableId]) == null ? void 0 : _a.x) ?? 60,
        tableY: ((_b = positions[tableId]) == null ? void 0 : _b.y) ?? 60
      };
      setDragging(tableId);
    },
    [isEditMode, isBulkMode, positions]
  );
  const onPointerMove = reactExports.useCallback(
    (e) => {
      if (!dragging || !pointerStartRef.current) return;
      const dx = e.clientX - pointerStartRef.current.clientX;
      const dy = e.clientY - pointerStartRef.current.clientY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved.current = true;
      const newX = Math.max(0, snapTo(pointerStartRef.current.tableX + dx));
      const newY = Math.max(0, snapTo(pointerStartRef.current.tableY + dy));
      setPositions((prev) => ({ ...prev, [dragging]: { x: newX, y: newY } }));
    },
    [dragging]
  );
  const onPointerUp = reactExports.useCallback(
    (_e, tableId) => {
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
    [dragging, positions, tables, updatePosition, onTableClick, pushHistory]
  );
  const onCardClick = reactExports.useCallback(
    (tableId) => {
      if (isBulkMode) {
        toggleSelectTable(tableId);
        return;
      }
      if (isEditMode && dragging) return;
      const table = tables.find((tbl) => tbl.id === tableId);
      if (table) onTableClick(table);
    },
    [isBulkMode, isEditMode, dragging, tables, onTableClick, toggleSelectTable]
  );
  const onKeyDown = reactExports.useCallback(
    (e, tableId) => {
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
          [tableId]: { ...pos, x: Math.max(0, pos.x - SNAP) }
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
          [tableId]: { ...pos, y: Math.max(0, pos.y - SNAP) }
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
            [tableId]: { x: Number(original.x), y: Number(original.y) }
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
      toggleSelectTable
    ]
  );
  const handleAiRejectClick = reactExports.useCallback(
    (suggestionId) => {
      if (showRejectDropdown === suggestionId) {
        onAiReject == null ? void 0 : onAiReject(suggestionId, rejectReason || void 0);
        setShowRejectDropdown(null);
        setRejectReason("");
      } else {
        setShowRejectDropdown(suggestionId);
      }
    },
    [showRejectDropdown, onAiReject, rejectReason]
  );
  const REJECT_REASONS = [
    t("aiSuggestion.rejectReasonSize"),
    t("aiSuggestion.rejectReasonZone"),
    t("aiSuggestion.rejectReasonOther")
  ];
  const visibleTables = activeZone ? tables.filter((tbl) => (tableZones[tbl.id] ?? "Binnen") === activeZone) : tables;
  const canvasMinW = Math.max(
    900,
    ...visibleTables.map((t2) => {
      const pos = positions[t2.id] ?? { x: Number(t2.x), y: Number(t2.y) };
      const cap = Number(t2.capacity);
      const isRound = t2.shape === "round";
      const w = isRound ? getCircleRadius(cap) * 2 : getRectDims(cap).w;
      return pos.x + w + 120;
    })
  );
  const canvasMinH = Math.max(
    580,
    ...visibleTables.map((t2) => {
      const pos = positions[t2.id] ?? { x: Number(t2.x), y: Number(t2.y) };
      const cap = Number(t2.capacity);
      const isRound = t2.shape === "round";
      const h = isRound ? getCircleRadius(cap) * 2 : getRectDims(cap).h;
      return pos.y + h + 120;
    })
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0", children: [
    isEditMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleUndo,
          disabled: history.length === 0,
          className: cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
            history.length === 0 ? "opacity-40 cursor-not-allowed border-border text-muted-foreground" : "border-border bg-card text-foreground hover:bg-muted/60 cursor-pointer"
          ),
          "aria-label": t("seatingPlan.undo"),
          "data-ocid": "seating-undo-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3.5 w-3.5" }),
            t("seatingPlan.undo"),
            history.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center h-4 min-w-4 px-1 text-[10px] font-bold rounded-full bg-primary text-primary-foreground", children: history.length })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            onBulkModeChange(!isBulkMode);
            if (isBulkMode) onSelectionChange(/* @__PURE__ */ new Set());
          },
          className: cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
            isBulkMode ? "bg-secondary border-secondary text-secondary-foreground" : "border-border bg-card text-foreground hover:bg-muted/60 cursor-pointer"
          ),
          "aria-pressed": isBulkMode,
          "data-ocid": "seating-bulk-mode-btn",
          children: [
            isBulkMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "h-3.5 w-3.5" }),
            t("seating.bulk.selectMultiple"),
            isBulkMode && selectedTableIds.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center h-4 min-w-4 px-1 text-[10px] font-bold rounded-full bg-muted/40", children: selectedTableIds.size })
          ]
        }
      ),
      !isBulkMode && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground hidden sm:block", children: t("seatingPlan.editModeHint") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative w-full overflow-auto rounded-2xl border border-border",
        style: {
          minHeight: 580,
          background: "#0F172A"
        },
        "aria-label": t("seatingPlan.canvasAriaLabel"),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "svg",
            {
              className: "absolute inset-0 w-full h-full pointer-events-none rounded-2xl",
              style: { minWidth: canvasMinW, minHeight: canvasMinH },
              "aria-hidden": "true",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "pattern",
                    {
                      id: "floor-grid",
                      x: 0,
                      y: 0,
                      width: 20,
                      height: 20,
                      patternUnits: "userSpaceOnUse",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          d: "M 20 0 L 0 0 0 20",
                          fill: "none",
                          stroke: "#334155",
                          strokeWidth: 0.5,
                          opacity: 0.4
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "pattern",
                    {
                      id: "floor-grid-major",
                      x: 0,
                      y: 0,
                      width: 100,
                      height: 100,
                      patternUnits: "userSpaceOnUse",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: 100, height: 100, fill: "url(#floor-grid)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "path",
                          {
                            d: "M 100 0 L 0 0 0 100",
                            fill: "none",
                            stroke: "#334155",
                            strokeWidth: 1,
                            opacity: 0.25
                          }
                        )
                      ]
                    }
                  )
                ] }),
                bgImage && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "image",
                  {
                    href: bgImage,
                    x: 0,
                    y: 0,
                    width: "100%",
                    height: "100%",
                    preserveAspectRatio: "xMidYMid slice",
                    opacity: 0.22
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "100%", height: "100%", fill: "url(#floor-grid-major)" })
              ]
            }
          ),
          zonesForBoundaries.length > 0 && onZoneBoundariesChange && /* @__PURE__ */ jsxRuntimeExports.jsx(
            ZoneBoundaryEditor,
            {
              zones: zonesForBoundaries,
              zoneColors,
              boundaries: zoneBoundaries,
              onChange: onZoneBoundariesChange,
              isEditMode: isZoneEditMode,
              canvasW: canvasMinW,
              canvasH: canvasMinH
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                position: "relative",
                minWidth: canvasMinW,
                minHeight: canvasMinH
              },
              children: visibleTables.map((table) => {
                const pos = positions[table.id] ?? {
                  x: Number(table.x),
                  y: Number(table.y)
                };
                const status = tableStatusOverride[table.id] ?? String(table.status);
                const col = getStatusColors(status);
                const cap = Number(table.capacity);
                const isRound = table.shape === "round";
                const isDraggingThis = dragging === table.id;
                const isFocused = focusedId === table.id;
                const isSelected = selectedTableIds.has(table.id);
                const isHighlighted = (highlightedTableIds == null ? void 0 : highlightedTableIds.has(table.id)) ?? false;
                const isSuggested = (aiSuggestion == null ? void 0 : aiSuggestion.suggestedTableIds.includes(table.id)) ?? false;
                const isHovered = hoveredId === table.id && !isDraggingThis;
                const zone = tableZones[table.id];
                const svgPad = CHAIR_GAP + CHAIR_H + 20;
                const tableW = isRound ? getCircleRadius(cap) * 2 + svgPad * 2 : getRectDims(cap).w + svgPad * 2;
                const tableH = isRound ? getCircleRadius(cap) * 2 + svgPad * 2 : getRectDims(cap).h + svgPad * 2;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      left: pos.x,
                      top: pos.y,
                      zIndex: isDraggingThis ? 50 : isSuggested ? 30 : isHighlighted ? 20 : isSelected ? 10 : 1
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          style: {
                            position: "relative",
                            display: "block",
                            background: "none",
                            border: "none",
                            padding: 0,
                            transform: isDraggingThis ? "scale(1.06)" : isHovered ? "scale(1.04)" : "scale(1)",
                            transition: isDraggingThis ? "none" : "transform 0.18s ease, filter 0.18s ease",
                            filter: isDraggingThis ? (
                              // biome-ignore lint/style/noUnusedTemplateLiteral: interpolation present
                              `drop-shadow(0 24px 40px rgba(0,0,0,0.8))`
                            ) : isHovered ? `drop-shadow(0 0 14px ${col.glowSoft})` : isSuggested ? `drop-shadow(0 0 20px ${col.glow})` : isHighlighted ? `drop-shadow(0 0 16px ${col.glow})` : "none",
                            cursor: isBulkMode ? "pointer" : isEditMode ? isDraggingThis ? "grabbing" : "grab" : "pointer",
                            outline: "none"
                          },
                          "aria-label": t("seatingPlan.tableAriaLabel", {
                            name: table.name,
                            status: STATUS_LABELS[status] ?? status,
                            capacity: String(table.capacity)
                          }),
                          "aria-pressed": isSelected || isFocused,
                          "data-ocid": `table-card-${table.id}`,
                          onPointerDown: (e) => onPointerDown(e, table.id),
                          onPointerMove,
                          onPointerUp: (e) => onPointerUp(e, table.id),
                          onClick: () => onCardClick(table.id),
                          onKeyDown: (e) => onKeyDown(e, table.id),
                          onMouseEnter: () => setHoveredId(table.id),
                          onMouseLeave: () => setHoveredId(null),
                          children: [
                            isEditMode && !isBulkMode && /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                style: {
                                  position: "absolute",
                                  top: svgPad - 14,
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  color: col.label,
                                  opacity: isHovered || isDraggingThis ? 0.9 : 0.4,
                                  transition: "opacity 0.2s",
                                  display: "flex",
                                  pointerEvents: "none",
                                  zIndex: 10
                                },
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { style: { width: 12, height: 12 } })
                              }
                            ),
                            isBulkMode && /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                style: {
                                  position: "absolute",
                                  top: svgPad - 14,
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  color: isSelected ? col.label : "rgba(148,163,184,0.6)",
                                  pointerEvents: "none",
                                  zIndex: 10
                                },
                                children: isSelected ? /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { style: { width: 14, height: 14 } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { style: { width: 14, height: 14 } })
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: tableW, height: tableH }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              TableSVG,
                              {
                                table,
                                isHighlighted,
                                isSuggested,
                                isSelected,
                                isDragging: isDraggingThis,
                                isFocused,
                                zone,
                                zoneColors
                              }
                            ) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(TableLabel, { table, zone })
                          ]
                        }
                      ),
                      isSuggested && aiSuggestion && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "ai-suggestion-card suggestion-fade-in",
                          style: {
                            position: "absolute",
                            top: tableH + 40,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 192,
                            zIndex: 40
                          },
                          "data-ocid": `ai-overlay-${table.id}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-muted-foreground", children: t("aiSuggestion.confidence") }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-foreground", children: [
                                  Math.round(aiSuggestion.confidence * 100),
                                  "%"
                                ] })
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "confidence-meter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  className: "confidence-fill",
                                  style: { width: `${aiSuggestion.confidence * 100}%` }
                                }
                              ) })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground leading-relaxed mb-2 line-clamp-2", children: aiSuggestion.reasoning }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "button",
                                {
                                  type: "button",
                                  onClick: (e) => {
                                    e.stopPropagation();
                                    onAiAccept == null ? void 0 : onAiAccept(aiSuggestion.suggestionId);
                                  },
                                  className: "ai-suggestion-accept flex-1 justify-center text-[11px] px-2 py-1.5",
                                  "data-ocid": `ai-accept-${table.id}`,
                                  "aria-label": t("aiSuggestion.accept"),
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbsUp, { className: "h-3 w-3 shrink-0" }),
                                    t("aiSuggestion.accept")
                                  ]
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "button",
                                {
                                  type: "button",
                                  onClick: (e) => {
                                    e.stopPropagation();
                                    handleAiRejectClick(aiSuggestion.suggestionId);
                                  },
                                  className: "ai-suggestion-reject flex-1 justify-center text-[11px] px-2 py-1.5",
                                  "data-ocid": `ai-reject-${table.id}`,
                                  "aria-label": t("aiSuggestion.reject"),
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbsDown, { className: "h-3 w-3 shrink-0" }),
                                    t("aiSuggestion.reject")
                                  ]
                                }
                              )
                            ] }),
                            showRejectDropdown === aiSuggestion.suggestionId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1.5 suggestion-fade-in", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "select",
                                {
                                  value: rejectReason,
                                  onChange: (e) => setRejectReason(e.target.value),
                                  className: "w-full rounded-md border border-border bg-background text-foreground text-[11px] px-2 py-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                                  "data-ocid": "ai-reject-reason-select",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("aiSuggestion.rejectReasonPlaceholder") }),
                                    REJECT_REASONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r, children: r }, r))
                                  ]
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "button",
                                {
                                  type: "button",
                                  onClick: (e) => {
                                    e.stopPropagation();
                                    onAiReject == null ? void 0 : onAiReject(
                                      aiSuggestion.suggestionId,
                                      rejectReason || void 0
                                    );
                                    setShowRejectDropdown(null);
                                    setRejectReason("");
                                  },
                                  className: "w-full text-[11px] py-1.5 rounded-md bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 transition-colors",
                                  "data-ocid": "ai-reject-confirm",
                                  children: t("aiSuggestion.rejectConfirm")
                                }
                              )
                            ] })
                          ]
                        }
                      )
                    ]
                  },
                  table.id
                );
              })
            }
          ),
          visibleTables.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: t("seatingPlan.noTables") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1 opacity-60", children: t("seatingPlan.noTablesHint") })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center gap-1 flex-wrap px-2 pt-3 pb-1",
        "aria-label": t("seating.legend.label"),
        "data-ocid": "seating-legend",
        children: [
          {
            status: "empty",
            label: t("seating.legend.available"),
            color: "#22C55E"
          },
          {
            status: "reserved",
            label: t("seating.legend.reserved"),
            color: "#F97316"
          },
          {
            status: "occupied",
            label: t("seating.legend.occupied"),
            color: "#EF4444"
          },
          {
            status: "unavailable",
            label: t("seating.legend.unavailable"),
            color: "#64748B"
          }
        ].map(({ status, label, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-muted-foreground",
            style: {
              background: "rgba(15,23,42,0.6)",
              border: `1px solid ${color}30`,
              backdropFilter: "blur(4px)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "h-2.5 w-2.5 rounded-full shrink-0",
                  style: {
                    background: color,
                    boxShadow: `0 0 6px ${color}80`
                  },
                  "aria-hidden": "true"
                }
              ),
              label
            ]
          },
          status
        ))
      }
    )
  ] });
}
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < breakpoint);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoint]);
  return isMobile;
}
export {
  FloorPlanCanvas as F,
  ThumbsUp as T,
  ThumbsDown as a,
  useIsMobile as u
};
