import { i as createLucideIcon, u as useTranslation, r as reactExports, m as useUnassignTable, as as useDeleteTable, l as useAssignReservation, d as useReservations, j as jsxRuntimeExports, c as cn, O as Badge, X, w as Label, I as Input, aj as Minus, a7 as Plus, U as Users, at as TriangleAlert, B as Button, a as useFloorState, k as useOpeningHoursConfig, t as ue } from "./index-BNayfcmF.js";
import { u as useIsMobile, T as ThumbsUp, a as ThumbsDown, F as FloorPlanCanvas } from "./use-mobile-XF5ZC0el.js";
import { B as Brain } from "./brain-CnUEARvt.js";
import { T as Trash2 } from "./trash-2-XAAtCYtx.js";
import { M as MapPin } from "./map-pin-J80tkmZT.js";
import { S as Skeleton } from "./skeleton-D2EeOrWT.js";
import { u as useZones, d as deriveZoneColor } from "./useZones-tYmI7Ueo.js";
import { C as ChevronLeft } from "./chevron-left-BG38Auax.js";
import { C as ChevronRight } from "./chevron-right-6-wY6xfI.js";
import "./rotate-ccw-DUbkDf76.js";
import "./grip-vertical-anmQwo2Z.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 5.17-2.69", key: "1dl1wf" }],
  ["path", { d: "M19 12.859a10 10 0 0 0-2.007-1.523", key: "4k23kn" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 4.177-2.643", key: "1grhjp" }],
  ["path", { d: "M22 8.82a15 15 0 0 0-11.288-3.764", key: "z3jwby" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const WifiOff = createLucideIcon("wifi-off", __iconNode);
const STATUS_BADGE_CLASS = {
  empty: "border-[#22C55E] text-[#22C55E] bg-[#22C55E]/8",
  reserved: "border-[#F59E0B] text-[#F59E0B] bg-[#F59E0B]/8",
  occupied: "border-[#EF4444] text-[#EF4444] bg-[#EF4444]/8",
  unavailable: "border-[#64748B] text-[#64748B] bg-[#64748B]/8"
};
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
  { value: "completed", color: "#16A34A" }
];
const ZONES = ["Binnen", "Terras", "Bar", "Privézaal", "Rooftop"];
function TableDetailModal({
  table,
  isOpen,
  isEditMode,
  onClose,
  aiSuggestion,
  onAiAccept,
  onAiReject,
  zone: zoneProp,
  onZoneChange
}) {
  const { t } = useTranslation(["dashboard", "shared"]);
  const isMobile = useIsMobile();
  const dialogRef = reactExports.useRef(null);
  const [confirmDelete, setConfirmDelete] = reactExports.useState(false);
  const [selectedReservation, setSelectedReservation] = reactExports.useState("");
  const [capacity, setCapacity] = reactExports.useState(2);
  const [zone, setZone] = reactExports.useState(ZONES[0]);
  const [tableName, setTableName] = reactExports.useState("");
  const [isVisible, setIsVisible] = reactExports.useState(false);
  const [rejectReason, setRejectReason] = reactExports.useState("");
  const [showRejectForm, setShowRejectForm] = reactExports.useState(false);
  const [reservationStatus, setReservationStatus] = reactExports.useState("confirmed");
  const unassign = useUnassignTable();
  const deleteTable = useDeleteTable();
  const assignReservation = useAssignReservation();
  const { data: allReservations = [] } = useReservations();
  const tableReservations = table ? allReservations.filter(
    (r) => r.tableNumber == null || r.tableNumber === Number(table.id.replace("t", ""))
  ) : [];
  const isAiSuggested = !!aiSuggestion && aiSuggestion.suggestedTableIds.includes((table == null ? void 0 : table.id) ?? "");
  const REJECT_REASONS = [
    t("aiSuggestion.rejectReasonSize", { ns: "dashboard" }),
    t("aiSuggestion.rejectReasonZone", { ns: "dashboard" }),
    t("aiSuggestion.rejectReasonOther", { ns: "dashboard" })
  ];
  const RESERVATION_STATUS_LABELS = {
    confirmed: t("seating.status.confirmed"),
    pending: t("seating.status.pending"),
    not_arrived: t("seating.status.not_arrived"),
    late: t("seating.status.late"),
    seated: t("seating.status.seated"),
    departed: t("seating.status.departed"),
    cancelled: t("seating.status.cancelled"),
    waitlist: t("seating.status.waitlist"),
    no_show: t("seating.status.no_show"),
    completed: t("seating.status.completed")
  };
  reactExports.useEffect(() => {
    if (table) {
      setCapacity(Number(table.capacity));
      setTableName(table.name);
      setZone(zoneProp ?? ZONES[0]);
    }
  }, [table, zoneProp]);
  reactExports.useEffect(() => {
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
  reactExports.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || isMobile) return;
    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
      setConfirmDelete(false);
      setSelectedReservation("");
    }
  }, [isOpen, isMobile]);
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);
  if (!table) return null;
  const status = String(table.status);
  const badgeClass = STATUS_BADGE_CLASS[status] ?? STATUS_BADGE_CLASS.empty;
  const statusLabel = t(
    `seatingPlan.table${status.charAt(0).toUpperCase() + status.slice(1)}`,
    { defaultValue: status }
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
        seatCount: res.partySize
      },
      { onSuccess: onClose }
    );
  };
  const handleCopyTable = () => onClose();
  const handleZoneChange = (newZone) => {
    setZone(newZone);
    onZoneChange == null ? void 0 : onZoneChange(table.id, newZone);
  };
  const handleAiAccept = () => {
    if (aiSuggestion) {
      onAiAccept == null ? void 0 : onAiAccept(aiSuggestion.suggestionId);
      onClose();
    }
  };
  const handleAiRejectConfirm = () => {
    if (aiSuggestion) {
      onAiReject == null ? void 0 : onAiReject(aiSuggestion.suggestionId, rejectReason || void 0);
      setShowRejectForm(false);
      setRejectReason("");
    }
  };
  const AISuggestionSection = () => {
    if (!isAiSuggested || !aiSuggestion) return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "ai-suggestion-card suggestion-slide-in space-y-3",
        "data-ocid": "table-modal-ai-suggestion",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-3.5 w-3.5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: t("aiSuggestion.overlayTitle", { ns: "dashboard" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: t("aiSuggestion.confidence", { ns: "dashboard" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-bold text-foreground", children: [
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: aiSuggestion.reasoning }),
          !showRejectForm ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleAiAccept,
                className: "ai-suggestion-accept flex-1 justify-center text-xs py-2",
                "data-ocid": "table-modal-ai-accept",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbsUp, { className: "h-3.5 w-3.5 shrink-0" }),
                  t("aiSuggestion.accept", { ns: "dashboard" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setShowRejectForm(true),
                className: "ai-suggestion-reject flex-1 justify-center text-xs py-2",
                "data-ocid": "table-modal-ai-reject-trigger",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbsDown, { className: "h-3.5 w-3.5 shrink-0" }),
                  t("aiSuggestion.reject", { ns: "dashboard" })
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 suggestion-fade-in", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: rejectReason,
                onChange: (e) => setRejectReason(e.target.value),
                className: "w-full rounded-lg border border-input bg-background text-foreground text-xs px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                "data-ocid": "table-modal-reject-reason",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("aiSuggestion.rejectReasonPlaceholder", { ns: "dashboard" }) }),
                  REJECT_REASONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r, children: r }, r))
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowRejectForm(false),
                  className: "flex-1 h-8 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted/50 transition-colors",
                  children: t("actions.cancel", { ns: "shared" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: handleAiRejectConfirm,
                  className: "flex-1 h-8 rounded-lg bg-destructive/10 text-destructive border border-destructive/30 text-xs hover:bg-destructive/20 transition-colors",
                  "data-ocid": "table-modal-reject-confirm",
                  children: t("aiSuggestion.rejectConfirm", { ns: "dashboard" })
                }
              )
            ] })
          ] })
        ]
      }
    );
  };
  const ReservationStatusSection = () => {
    if (!table.guestName && !table.reservationId) return null;
    const currentCfg = RESERVATION_STATUS_OPTIONS.find(
      (o) => o.value === reservationStatus
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: t("seating.status.label") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: RESERVATION_STATUS_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setReservationStatus(opt.value),
          className: cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all",
            reservationStatus === opt.value ? "border-current shadow-sm scale-[1.02]" : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"
          ),
          style: reservationStatus === opt.value ? {
            color: opt.color,
            borderColor: opt.color,
            background: `${opt.color}12`
          } : {},
          "data-ocid": `reservation-status-${opt.value}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "h-2 w-2 rounded-full shrink-0",
                style: { background: opt.color },
                "aria-hidden": "true"
              }
            ),
            RESERVATION_STATUS_LABELS[opt.value] ?? opt.value
          ]
        },
        opt.value
      )) }),
      currentCfg && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 mt-1", children: t("seating.status.selectedHint", {
        status: RESERVATION_STATUS_LABELS[reservationStatus] ?? reservationStatus
      }) })
    ] });
  };
  if (isMobile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "fixed inset-0 z-50",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        ),
        children: [
          isOpen && // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop close
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "absolute inset-0 bg-black/60 transition-opacity duration-300",
                isVisible ? "opacity-100" : "opacity-0"
              ),
              onClick: onClose,
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "dialog",
            {
              open: isOpen,
              className: cn(
                "absolute bottom-0 left-0 right-0 m-0 p-0 w-full bg-card rounded-t-3xl border-0",
                "transition-transform duration-300 ease-out will-change-transform",
                "max-h-[92dvh] overflow-y-auto",
                isVisible ? "translate-y-0" : "translate-y-full"
              ),
              "aria-labelledby": "mobile-table-modal-title",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-3 pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-1.5 rounded-full bg-muted-foreground/30" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between px-5 pt-3 pb-4 border-b border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h2",
                      {
                        id: "mobile-table-modal-title",
                        className: "text-lg font-semibold text-foreground",
                        children: table.name
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: cn("text-xs", badgeClass), children: statusLabel }),
                      isAiSuggested && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Badge,
                        {
                          variant: "outline",
                          className: "text-xs border-primary/50 text-primary bg-primary/10",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-2.5 w-2.5 mr-1" }),
                            "AI"
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "h-11 w-11 rounded-full flex items-center justify-center bg-muted/50 text-muted-foreground hover:bg-muted transition-colors",
                      onClick: onClose,
                      "aria-label": t("actions.close", { ns: "shared" }),
                      "data-ocid": "table-mobile-modal-close",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-5 space-y-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AISuggestionSection, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: "mobile-table-name",
                        className: "text-sm font-medium",
                        children: t("seatingPlan.tableName")
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "mobile-table-name",
                        value: tableName,
                        onChange: (e) => setTableName(e.target.value),
                        className: "h-14 text-base rounded-xl",
                        "data-ocid": "mobile-table-name-input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: t("seatingPlan.tableCapacity") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setCapacity((c) => Math.max(1, c - 1)),
                          className: "h-14 w-14 rounded-xl bg-muted flex items-center justify-center text-foreground hover:bg-muted/70 active:scale-95 transition-all",
                          "aria-label": t("seatingPlan.decreaseCapacity"),
                          "data-ocid": "mobile-capacity-decrease",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-6 w-6" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-bold text-foreground w-10 text-center tabular-nums", children: capacity }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setCapacity((c) => Math.min(20, c + 1)),
                          className: "h-14 w-14 rounded-xl bg-muted flex items-center justify-center text-foreground hover:bg-muted/70 active:scale-95 transition-all",
                          "aria-label": t("seatingPlan.increaseCapacity"),
                          "data-ocid": "mobile-capacity-increase",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-6 w-6" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
                        t("seatingPlan.seats")
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mobile-zone", className: "text-sm font-medium", children: t("seatingPlan.zone") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "select",
                      {
                        id: "mobile-zone",
                        value: zone,
                        onChange: (e) => handleZoneChange(e.target.value),
                        className: "w-full h-14 rounded-xl border border-input bg-background text-foreground text-base px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        "data-ocid": "mobile-zone-select",
                        children: ZONES.map((z) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: z, children: z }, z))
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ReservationStatusSection, {}),
                  table.guestName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/40 p-4 space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wide", children: t("seatingPlan.assignedGuest") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground", children: table.guestName }),
                    table.seatCount && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                      String(table.seatCount),
                      " ",
                      t("seatingPlan.seats")
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2 border-t border-border", children: [
                    !confirmDelete ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => setConfirmDelete(true),
                        className: "w-full flex items-center gap-3 px-5 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/20 active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive",
                        style: { minHeight: 56 },
                        "data-ocid": "mobile-table-delete-trigger",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-5 w-5 shrink-0" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-medium", children: t("seatingPlan.deleteTable") })
                        ]
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-destructive/10 border border-destructive/30 p-4 space-y-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-destructive shrink-0 mt-0.5" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive font-medium", children: t("seatingPlan.confirmDelete", { name: table.name }) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setConfirmDelete(false),
                            className: "flex-1 h-12 rounded-xl border border-border text-foreground font-medium hover:bg-muted/50 transition-colors",
                            children: t("actions.cancel", { ns: "shared" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: handleDelete,
                            disabled: deleteTable.isPending,
                            className: "flex-1 h-12 rounded-xl bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 active:scale-95 transition-all disabled:opacity-60",
                            "data-ocid": "mobile-table-delete-confirm",
                            children: deleteTable.isPending ? t("seatingPlan.deleting") : t("seatingPlan.delete")
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: handleCopyTable,
                        className: "w-full flex items-center gap-3 px-5 rounded-2xl bg-secondary/10 border border-secondary/30 text-secondary hover:bg-secondary/20 active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary",
                        style: { minHeight: 56 },
                        "data-ocid": "mobile-table-copy",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-5 w-5 shrink-0" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-medium", children: t("seatingPlan.copyTable") })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          const nextIdx = (ZONES.indexOf(zone) + 1) % ZONES.length;
                          handleZoneChange(ZONES[nextIdx]);
                        },
                        className: "w-full flex items-center gap-3 px-5 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/20 active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]",
                        style: { minHeight: 56 },
                        "data-ocid": "mobile-table-change-zone",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5 shrink-0" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-base font-medium", children: [
                            t("seatingPlan.changeZone"),
                            ": ",
                            zone
                          ] })
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: { height: "max(24px, env(safe-area-inset-bottom, 24px))" }
                  }
                )
              ]
            }
          )
        ]
      }
    );
  }
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "fixed inset-0 z-50 flex items-center justify-center p-4",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        ),
        onClick: (e) => {
          if (e.target === e.currentTarget) onClose();
        },
        children: [
          isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 bg-background/80 backdrop-blur-sm",
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "dialog",
            {
              ref: dialogRef,
              className: cn(
                "relative z-50 w-full max-w-md rounded-2xl border border-border",
                "bg-gradient-to-br from-card to-background shadow-elevated",
                "p-0 m-0 text-foreground focus-visible:outline-none"
              ),
              "aria-labelledby": "table-modal-title",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between p-5 pb-4 border-b border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h2",
                      {
                        id: "table-modal-title",
                        className: "text-base font-semibold text-foreground truncate",
                        children: table.name
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5 flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          variant: "outline",
                          className: cn("text-xs px-2 py-0.5", badgeClass),
                          children: statusLabel
                        }
                      ),
                      isAiSuggested && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Badge,
                        {
                          variant: "outline",
                          className: "text-xs px-2 py-0.5 border-primary/50 text-primary bg-primary/10",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-2.5 w-2.5 mr-1" }),
                            "AI"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
                        String(table.capacity),
                        " ",
                        t("seatingPlan.seats")
                      ] }),
                      zone && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
                        zone
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-8 w-8 shrink-0 -mt-1 -mr-1",
                      onClick: onClose,
                      "aria-label": t("actions.close", { ns: "shared" }),
                      "data-ocid": "table-modal-close",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AISuggestionSection, {}),
                  table.guestName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/40 p-3 space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: t("seatingPlan.assignedGuest") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: table.guestName }),
                    table.reservationId && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono", children: [
                      "#",
                      table.reservationId
                    ] }),
                    table.seatCount && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      String(table.seatCount),
                      " ",
                      t("seatingPlan.seats")
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ReservationStatusSection, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: t("seatingPlan.zone") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: ZONES.map((z) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleZoneChange(z),
                        className: cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                          zone === z ? "bg-primary/15 border-primary/40 text-primary" : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"
                        ),
                        "data-ocid": `desktop-zone-${z}`,
                        children: z
                      },
                      z
                    )) })
                  ] }),
                  isEditMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    table.guestName && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        className: "w-full justify-start gap-2 text-sm",
                        onClick: handleUnassign,
                        disabled: unassign.isPending,
                        "data-ocid": "table-modal-unassign",
                        children: unassign.isPending ? t("seatingPlan.assigning") : t("seatingPlan.unassign")
                      }
                    ),
                    !table.guestName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "label",
                        {
                          htmlFor: "reservation-select",
                          className: "text-xs font-medium text-muted-foreground",
                          children: t("seatingPlan.assignReservation")
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "select",
                        {
                          id: "reservation-select",
                          className: "w-full rounded-lg border border-input bg-background text-foreground text-sm px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          value: selectedReservation,
                          onChange: (e) => setSelectedReservation(e.target.value),
                          "data-ocid": "table-modal-reservation-select",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("seatingPlan.chooseReservation") }),
                            tableReservations.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: r.id, children: [
                              r.guestName,
                              " — ",
                              r.time,
                              " (",
                              r.partySize,
                              " pers.)"
                            ] }, r.id))
                          ]
                        }
                      ),
                      selectedReservation && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          className: "w-full",
                          onClick: handleAssign,
                          disabled: assignReservation.isPending,
                          "data-ocid": "table-modal-assign-confirm",
                          children: assignReservation.isPending ? t("seatingPlan.assigning") : t("seatingPlan.assign")
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 border-t border-border", children: !confirmDelete ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        variant: "ghost",
                        className: "w-full justify-start gap-2 text-sm text-destructive hover:text-destructive hover:bg-destructive/10",
                        onClick: () => setConfirmDelete(true),
                        "data-ocid": "table-modal-delete-trigger",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
                          t("seatingPlan.deleteTable")
                        ]
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-destructive/10 border border-destructive/30 p-3 space-y-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-destructive shrink-0 mt-0.5" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive font-medium", children: t("seatingPlan.confirmDelete", { name: table.name }) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            variant: "outline",
                            size: "sm",
                            className: "flex-1 text-xs",
                            onClick: () => setConfirmDelete(false),
                            children: t("actions.cancel", { ns: "shared" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            variant: "destructive",
                            size: "sm",
                            className: "flex-1 text-xs",
                            onClick: handleDelete,
                            disabled: deleteTable.isPending,
                            "data-ocid": "table-modal-delete-confirm",
                            children: deleteTable.isPending ? t("seatingPlan.deleting") : t("seatingPlan.delete")
                          }
                        )
                      ] })
                    ] }) })
                  ] })
                ] })
              ]
            }
          )
        ]
      }
    )
  );
}
function WalkinBanner({ onDismiss }) {
  const { t } = useTranslation("dashboard");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400",
      "data-ocid": "walkin-banner",
      role: "alert",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "h-4 w-4 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium flex-1", children: t("seating.walkin.banner") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onDismiss,
            className: "text-xs underline underline-offset-2 hover:no-underline transition-all",
            "data-ocid": "walkin-banner-dismiss",
            children: t("seating.walkin.dismiss")
          }
        )
      ]
    }
  );
}
function SeatingPlanPage() {
  const { t } = useTranslation(["dashboard", "shared"]);
  const isWalkinMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("walkin") === "true";
  const [walkinDismissed, setWalkinDismissed] = reactExports.useState(false);
  const showWalkinBanner = isWalkinMode && !walkinDismissed;
  const { data: floorState, isLoading } = useFloorState();
  const tables = (floorState == null ? void 0 : floorState.tables) ?? [];
  const todayISO = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = reactExports.useState(todayISO);
  const [selectedServiceId, setSelectedServiceId] = reactExports.useState(
    null
  );
  const { data: openingHoursConfig } = useOpeningHoursConfig();
  const services = (openingHoursConfig == null ? void 0 : openingHoursConfig.services) ?? [];
  const shiftDate = (delta) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(d.toISOString().split("T")[0]);
  };
  const isToday = selectedDate === todayISO;
  const dateLabelFull = reactExports.useMemo(() => {
    const d = new Date(selectedDate);
    return d.toLocaleDateString("nl-BE", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });
  }, [selectedDate]);
  const { data: reservationsForDate = [] } = useReservations(selectedDate);
  const activeService = reactExports.useMemo(() => {
    if (!services.length) return null;
    if (selectedServiceId)
      return services.find((s) => s.id === selectedServiceId) ?? services[0];
    return services[0];
  }, [services, selectedServiceId]);
  const tableStatusOverride = reactExports.useMemo(() => {
    if (!activeService) return {};
    const overrides = {};
    for (const res of reservationsForDate) {
      if (res.status === "cancelled" || res.status === "no_show") continue;
      const resTime = res.time;
      if (resTime >= activeService.openTime && resTime < activeService.closeTime) {
        const tableId = res.tableId;
        if (tableId) {
          overrides[tableId] = res.status === "seated" ? "occupied" : "reserved";
        }
      }
    }
    return overrides;
  }, [reservationsForDate, activeService]);
  const { data: zoneData = [], isLoading: isLoadingZones } = useZones();
  const zones = zoneData.map((z) => z.name);
  const zoneColorMap = Object.fromEntries(
    zoneData.map((z) => [z.name, z.color ?? deriveZoneColor(z.name)])
  );
  const [activeZone, setActiveZone] = reactExports.useState(void 0);
  const tableZones = reactExports.useMemo(() => {
    const map = {};
    for (const tbl of tables) {
      const zone = tbl.zone;
      if (zone) map[tbl.id] = zone;
    }
    return map;
  }, [tables]);
  const [selectedTable, setSelectedTable] = reactExports.useState(null);
  const handleTableClick = reactExports.useCallback(
    (table) => {
      if (isWalkinMode) {
        const currentStatus = tableStatusOverride[table.id] ?? String(table.status);
        if (currentStatus === "occupied") {
          ue.info(t("seating.walkin.alreadyOccupied", { name: table.name }));
          return;
        }
        ue.success(t("seating.walkin.markedOccupied", { name: table.name }));
        return;
      }
      setSelectedTable(table);
    },
    [isWalkinMode, tableStatusOverride, t]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "heading-h1", "data-ocid": "seating-page-title", children: t("seatingPlan.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: isWalkinMode ? t("seating.walkin.subtitle") : t("seating.viewOnly.subtitle", { count: tables.length }) })
    ] }) }),
    showWalkinBanner && /* @__PURE__ */ jsxRuntimeExports.jsx(WalkinBanner, { onDismiss: () => setWalkinDismissed(true) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap print:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-card border border-border rounded-xl px-1 py-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => shiftDate(-1),
            className: "h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors",
            "aria-label": t("seating.datePrev"),
            "data-ocid": "seating-date-prev",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setSelectedDate(todayISO),
            className: cn(
              "px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors min-w-[96px] text-center",
              isToday ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"
            ),
            "aria-label": t("seating.goToToday"),
            "data-ocid": "seating-date-today",
            children: isToday ? t("seating.today") : dateLabelFull
          }
        ),
        !isToday && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60 font-medium leading-none select-none", children: dateLabelFull }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => shiftDate(1),
            className: "h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors",
            "aria-label": t("seating.dateNext"),
            "data-ocid": "seating-date-next",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
          }
        )
      ] }),
      services.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 rounded-xl border border-border bg-card px-1 py-0.5", children: services.map((svc) => {
        const isActive = (activeService == null ? void 0 : activeService.id) === svc.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setSelectedServiceId(svc.id),
            className: cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
              isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            ),
            "data-ocid": `seating-service-${svc.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    isActive ? "bg-primary" : "bg-muted-foreground/40"
                  )
                }
              ),
              svc.name,
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-60", children: [
                svc.openTime,
                "–",
                svc.closeTime
              ] })
            ]
          },
          svc.id
        );
      }) }),
      tables.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 ml-auto flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setActiveZone(void 0),
            className: cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150",
              !activeZone ? "bg-primary/10 text-primary border-primary/40 shadow-[0_0_8px_rgba(34,197,94,0.2)]" : "border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            ),
            "data-ocid": "zone-filter-all",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-foreground/40" }),
              isLoadingZones ? "..." : t("seating.zones.all")
            ]
          }
        ),
        zones.map((zone) => {
          const dotColor = zoneColorMap[zone] ?? "#94A3B8";
          const isActive = activeZone === zone;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActiveZone(activeZone === zone ? void 0 : zone),
              className: cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150",
                isActive ? "bg-card text-foreground border-border/80" : "border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              ),
              style: isActive ? {
                borderColor: `${dotColor}50`,
                boxShadow: `0 0 8px ${dotColor}30`
              } : {},
              "data-ocid": `zone-filter-${zone}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "h-2 w-2 rounded-full shrink-0",
                    style: {
                      background: dotColor,
                      boxShadow: isActive ? `0 0 5px ${dotColor}` : "none"
                    }
                  }
                ),
                zone
              ]
            },
            zone
          );
        })
      ] })
    ] }),
    isWalkinMode && tables.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/8 border border-amber-500/20",
        "data-ocid": "walkin-canvas-hint",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 text-amber-400 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-400/90", children: t("seating.walkin.clickHint") })
        ]
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full rounded-2xl", style: { minHeight: 580 } }) : tables.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-6 py-12 flex flex-col items-center text-center gap-4",
        "data-ocid": "seating-empty-state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-6 w-6 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 max-w-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: t("seatingPlan.noTablesYet") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("seating.viewOnly.noTablesHint") })
          ] })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      FloorPlanCanvas,
      {
        tables,
        isEditMode: false,
        onTableClick: handleTableClick,
        selectedTableIds: /* @__PURE__ */ new Set(),
        onSelectionChange: () => {
        },
        isBulkMode: false,
        onBulkModeChange: () => {
        },
        activeZone,
        tableZones,
        zoneColors: zoneColorMap,
        tableStatusOverride
      }
    ),
    !isWalkinMode && /* @__PURE__ */ jsxRuntimeExports.jsx(
      TableDetailModal,
      {
        table: selectedTable,
        isOpen: !!selectedTable,
        isEditMode: false,
        onClose: () => setSelectedTable(null),
        aiSuggestion: null,
        onAiAccept: () => {
        },
        onAiReject: () => {
        },
        zone: selectedTable ? tableZones[selectedTable.id] : void 0,
        onZoneChange: () => {
        }
      }
    )
  ] });
}
export {
  SeatingPlanPage as default
};
