import { i as createLucideIcon, u as useTranslation, r as reactExports, j as jsxRuntimeExports, X, I as Input, B as Button, a7 as Plus, t as ue, a as useFloorState, bu as useCreateTable, as as useDeleteTable, bv as useUpdateTableCapacity, bw as useSyncTablesFromSettings, c as cn, aJ as LoaderCircle, w as Label, U as Users } from "./index-BNayfcmF.js";
import { u as useIsMobile, F as FloorPlanCanvas } from "./use-mobile-XF5ZC0el.js";
import { c as useAddZone, b as useDeleteZone, d as deriveZoneColor, e as useUpdateTableZone, u as useZones } from "./useZones-tYmI7Ueo.js";
import { L as Layers } from "./layers-jY-i6yiE.js";
import { S as Skeleton } from "./skeleton-D2EeOrWT.js";
import { e as useRecordSuggestionFeedback, f as useSuggestTable } from "./useSeasonalAI-DpqQVWtM.js";
import { B as Brain } from "./brain-CnUEARvt.js";
import { M as MapPin } from "./map-pin-J80tkmZT.js";
import { S as Save } from "./save-DmaA-fW0.js";
import { S as Sparkles } from "./sparkles-BJftqxYW.js";
import { R as RotateCcw } from "./rotate-ccw-DUbkDf76.js";
import { T as Trash2 } from "./trash-2-XAAtCYtx.js";
import "./grip-vertical-anmQwo2Z.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M16 5h6", key: "1vod17" }],
  ["path", { d: "M19 2v6", key: "4bpg5p" }],
  ["path", { d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5", key: "1ue2ih" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }]
];
const ImagePlus = createLucideIcon("image-plus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
      key: "143wyd"
    }
  ],
  ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6", key: "1itne7" }],
  ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1", key: "1ue0tg" }]
];
const Printer = createLucideIcon("printer", __iconNode);
function ZoneManagementModal({
  isOpen,
  onClose,
  zones,
  zoneColors,
  onZonesChange: _onZonesChange
}) {
  const { t } = useTranslation("dashboard");
  const [newZone, setNewZone] = reactExports.useState("");
  const addZone = useAddZone();
  const deleteZone = useDeleteZone();
  if (!isOpen) return null;
  const handleAdd = () => {
    const trimmed = newZone.trim();
    if (!trimmed || zones.includes(trimmed)) return;
    addZone.mutate(
      { name: trimmed, color: deriveZoneColor(trimmed), maxGuests: 50 },
      {
        onSuccess: () => setNewZone(""),
        onError: () => ue.error(t("seating.zones.saveError"))
      }
    );
  };
  const handleDelete = (zone) => {
    deleteZone.mutate(`zone-${zones.indexOf(zone)}`, {
      onError: () => ue.error(t("seating.zones.saveError"))
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
        onClick: onClose,
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-50 w-full max-w-sm rounded-2xl border border-border bg-gradient-to-br from-card to-background shadow-elevated p-0 animate-in fade-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-5 pb-4 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground", children: t("seating.zones.manageTitle") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted/60 transition-colors",
            "aria-label": t("actions.close", { ns: "shared" }),
            "data-ocid": "zone-modal-close",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: zones.map((zone) => {
          const color = zoneColors[zone] ?? "#94A3B8";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between rounded-xl bg-muted/30 border border-border px-4 py-2.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "h-3 w-3 rounded-full shrink-0",
                      style: { background: color }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: zone })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleDelete(zone),
                    className: "h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                    "aria-label": `${zone} verwijderen`,
                    "data-ocid": `zone-delete-${zone}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
                  }
                )
              ]
            },
            zone
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: t("seating.zones.newZonePlaceholder"),
              value: newZone,
              onChange: (e) => setNewZone(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && handleAdd(),
              className: "flex-1 h-10",
              "data-ocid": "zone-new-input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              onClick: handleAdd,
              disabled: !newZone.trim(),
              "data-ocid": "zone-add-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "w-full",
          onClick: onClose,
          "data-ocid": "zone-modal-save",
          children: t("actions.save", { ns: "shared" })
        }
      ) })
    ] })
  ] });
}
function AISuggestionModal({
  isOpen,
  onClose,
  tables,
  onHighlight,
  onSuggestionReady
}) {
  const { t } = useTranslation("dashboard");
  const { suggest, isLoading, error, reset } = useSuggestTable();
  const [partySize, setPartySize] = reactExports.useState("2");
  const [date, setDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [time, setTime] = reactExports.useState("19:00");
  const [preferences, setPreferences] = reactExports.useState("");
  const [result, setResult] = reactExports.useState(null);
  const handleClose = reactExports.useCallback(() => {
    setResult(null);
    reset();
    onHighlight(/* @__PURE__ */ new Set());
    onClose();
  }, [onClose, onHighlight, reset]);
  const handleSubmit = async () => {
    setResult(null);
    const size = Number.parseInt(partySize, 10);
    if (!size || size < 1) return;
    const tableContext = tables.map(
      (tbl) => `id=${tbl.id} name=${tbl.name} capacity=${Number(tbl.capacity)} status=${tbl.status}`
    ).join("; ");
    const sug = await suggest({
      partySize: size,
      date,
      time,
      zonePreference: preferences || void 0,
      tableContext: `Tables: [${tableContext}]. Preferences: ${preferences || "none"}.`
    });
    if (sug) {
      setResult(sug);
      onHighlight(new Set(sug.suggestedTableIds));
    }
  };
  const handleAccept = () => {
    if (result) onSuggestionReady(result);
    onClose();
  };
  const suggestedTableNames = result == null ? void 0 : result.suggestedTableIds.map((id) => {
    var _a;
    return (_a = tables.find((tbl) => tbl.id === id)) == null ? void 0 : _a.name;
  }).filter(Boolean).join(", ");
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
        onClick: handleClose,
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "relative w-full sm:max-w-lg bg-card rounded-t-3xl sm:rounded-2xl",
          "shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden",
          "animate-in fade-in slide-in-from-bottom-4 duration-300"
        ),
        "data-ocid": "ai-suggestion-modal",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 pt-4 pb-3 border-b border-border shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-9 w-9 rounded-xl bg-primary/10 text-primary shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground", children: t("aiSuggestion.title") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("aiSuggestion.subtitle") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleClose,
                "aria-label": t("actions.close", { ns: "shared" }),
                className: "h-9 w-9 rounded-full flex items-center justify-center bg-muted/50 text-muted-foreground hover:bg-muted transition-colors shrink-0",
                "data-ocid": "ai-modal-close",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-y-auto flex-1 px-5 py-4 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "ai-party-size",
                    className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
                    children: t("aiSuggestion.partySize")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "ai-party-size",
                    type: "number",
                    min: 1,
                    max: 30,
                    value: partySize,
                    onChange: (e) => setPartySize(e.target.value),
                    className: "h-11",
                    disabled: isLoading,
                    "data-ocid": "ai-party-size-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "ai-time",
                    className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
                    children: t("aiSuggestion.time")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "ai-time",
                    type: "time",
                    value: time,
                    onChange: (e) => setTime(e.target.value),
                    className: "h-11",
                    disabled: isLoading,
                    "data-ocid": "ai-time-input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "ai-date",
                  className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
                  children: t("aiSuggestion.date")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "ai-date",
                  type: "date",
                  value: date,
                  onChange: (e) => setDate(e.target.value),
                  className: "h-11",
                  disabled: isLoading,
                  "data-ocid": "ai-date-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "ai-preferences",
                  className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
                  children: t("aiSuggestion.preferences")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  id: "ai-preferences",
                  value: preferences,
                  onChange: (e) => setPreferences(e.target.value),
                  placeholder: t("aiSuggestion.preferencesPlaceholder"),
                  rows: 2,
                  disabled: isLoading,
                  className: "w-full rounded-lg border border-input bg-background text-foreground text-sm px-3 py-2.5 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors placeholder:text-muted-foreground/50 disabled:opacity-60",
                  "data-ocid": "ai-preferences-input"
                }
              )
            ] }),
            isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 text-primary animate-spin shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: t("aiSuggestion.analyzing") })
            ] }),
            error && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "p-4 rounded-xl bg-destructive/10 border border-destructive/30",
                "data-ocid": "ai-error-message",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-destructive", children: error === "timeout" ? t("aiSuggestion.errorTimeout") : t("aiSuggestion.errorGeneral") })
              }
            ),
            result && !isLoading && !error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "p-4 rounded-xl bg-primary/8 border border-primary/25",
                "data-ocid": "ai-suggestion-result",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-1", children: result.suggestedTableIds.length > 0 ? t("aiSuggestion.suggested", {
                    tables: suggestedTableNames || result.suggestedTableIds.join(", ")
                  }) : t("aiSuggestion.noSuggestion") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: result.reasoning })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 px-5 py-4 border-t border-border shrink-0", children: result && !isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "flex-1",
                onClick: handleClose,
                "data-ocid": "ai-dismiss-btn",
                children: t("aiSuggestion.dismiss")
              }
            ),
            result.suggestedTableIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "flex-1",
                onClick: handleAccept,
                "data-ocid": "ai-accept-btn",
                children: t("aiSuggestion.accept")
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "flex-1",
                onClick: handleClose,
                disabled: isLoading,
                children: t("actions.cancel", { ns: "shared" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "flex-1 gap-2",
                onClick: handleSubmit,
                disabled: isLoading || !partySize || !date || !time,
                "data-ocid": "ai-calculate-btn",
                children: [
                  isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-4 w-4" }),
                  isLoading ? t("aiSuggestion.calculating") : t("aiSuggestion.calculate")
                ]
              }
            )
          ] }) })
        ]
      }
    )
  ] });
}
function SeatingPlanSettingsPage() {
  const { t } = useTranslation(["dashboard", "shared"]);
  const isMobile = useIsMobile();
  const { data: floorState, isLoading } = useFloorState();
  const createTable = useCreateTable();
  const deleteTable = useDeleteTable();
  const updateTableCapacity = useUpdateTableCapacity();
  const updateTableZone = useUpdateTableZone();
  const syncTables = useSyncTablesFromSettings();
  const { recordFeedback } = useRecordSuggestionFeedback();
  const tables = (floorState == null ? void 0 : floorState.tables) ?? [];
  const { data: zoneData = [] } = useZones();
  const zones = zoneData.map((z) => z.name);
  const zoneColorMap = Object.fromEntries(
    zoneData.map((z) => [z.name, z.color ?? deriveZoneColor(z.name)])
  );
  const [activeZone, setActiveZone] = reactExports.useState(void 0);
  const [localZones, setLocalZones] = reactExports.useState({});
  const [showZoneModal, setShowZoneModal] = reactExports.useState(false);
  const [isZoneEditMode, setIsZoneEditMode] = reactExports.useState(false);
  const [zoneBoundaries, setZoneBoundaries] = reactExports.useState([]);
  const [isSavingZones, setIsSavingZones] = reactExports.useState(false);
  const handleSaveZoneBoundaries = async () => {
    setIsSavingZones(true);
    try {
      const updates = tables.map((table) => ({
        tableId: table.id,
        zone: localZones[table.id] ?? null
      }));
      await Promise.all(updates.map((u) => updateTableZone.mutateAsync(u)));
      setIsZoneEditMode(false);
      ue.success(t("seating.zones.saved"));
    } catch {
      ue.error(t("seating.zones.saveError"));
    } finally {
      setIsSavingZones(false);
    }
  };
  const isEditMode = true;
  const [showAddForm, setShowAddForm] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    name: "",
    capacity: "4",
    zone: ""
  });
  const [formError, setFormError] = reactExports.useState("");
  const handleAddTable = () => {
    if (!form.name.trim()) {
      setFormError(t("seatingPlan.tableNameRequired"));
      return;
    }
    const capacity = Number.parseInt(form.capacity, 10);
    if (!capacity || capacity < 1 || capacity > 20) {
      setFormError(t("seatingPlan.capacityRange"));
      return;
    }
    const usedPositions = new Set(
      tables.map((tbl) => `${Number(tbl.x)},${Number(tbl.y)}`)
    );
    let x = 60;
    let y = 60;
    while (usedPositions.has(`${x},${y}`)) {
      x += 160;
      if (x > 600) {
        x = 60;
        y += 180;
      }
    }
    createTable.mutate(
      { name: form.name.trim(), capacity, x, y },
      {
        onSuccess: () => {
          setShowAddForm(false);
          setForm({ name: "", capacity: "4", zone: zones[0] ?? "" });
          setFormError("");
        },
        onError: (err) => setFormError(err.message)
      }
    );
  };
  const [bgImage, setBgImage] = reactExports.useState(void 0);
  const bgInputRef = reactExports.useRef(null);
  const handleBgUpload = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setBgImage(URL.createObjectURL(file));
    ue.success(t("seating.bgImageSet"));
  };
  const undoRef = reactExports.useRef(null);
  const [showAIModal, setShowAIModal] = reactExports.useState(false);
  const [highlightedTableIds, setHighlightedTableIds] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const [activeSuggestion, setActiveSuggestion] = reactExports.useState(null);
  const [selectedTableIds, setSelectedTableIds] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const [isBulkMode, setIsBulkMode] = reactExports.useState(false);
  const [bulkZonePicker, setBulkZonePicker] = reactExports.useState(false);
  const [bulkCapacityInput, setBulkCapacityInput] = reactExports.useState("");
  const [bulkCapacityMode, setBulkCapacityMode] = reactExports.useState(false);
  const [bulkConfirmDelete, setBulkConfirmDelete] = reactExports.useState(false);
  const selectedCount = selectedTableIds.size;
  const clearBulkState = () => {
    setSelectedTableIds(/* @__PURE__ */ new Set());
    setIsBulkMode(false);
    setBulkZonePicker(false);
    setBulkCapacityInput("");
    setBulkCapacityMode(false);
    setBulkConfirmDelete(false);
  };
  const handleBulkZoneApply = async (zone) => {
    const updates = { ...localZones };
    for (const id of selectedTableIds) updates[id] = zone;
    setLocalZones(updates);
    clearBulkState();
    try {
      await Promise.all(
        [...selectedTableIds].map(
          (id) => updateTableZone.mutateAsync({ tableId: id, zone })
        )
      );
      ue.success(t("seating.bulk.zoneApplied"));
    } catch {
      ue.error(t("seating.bulk.zoneApplyError"));
    }
  };
  const handleBulkDelete = () => {
    for (const id of selectedTableIds) deleteTable.mutate({ id });
    clearBulkState();
  };
  const handleBulkCapacityApply = () => {
    const cap = Number.parseInt(bulkCapacityInput, 10);
    if (!cap || cap < 1 || cap > 20) return;
    for (const id of selectedTableIds)
      updateTableCapacity.mutate({ id, capacity: cap });
    clearBulkState();
  };
  const handleSuggestionReady = reactExports.useCallback((sug) => {
    setActiveSuggestion(sug);
    setHighlightedTableIds(new Set(sug.suggestedTableIds));
  }, []);
  const handleAiAccept = reactExports.useCallback(
    (suggestionId) => {
      recordFeedback(suggestionId, true);
      setActiveSuggestion(null);
      setHighlightedTableIds(/* @__PURE__ */ new Set());
    },
    [recordFeedback]
  );
  const handleAiReject = reactExports.useCallback(
    (suggestionId, reason) => {
      recordFeedback(suggestionId, false, reason);
      setActiveSuggestion(null);
      setHighlightedTableIds(/* @__PURE__ */ new Set());
    },
    [recordFeedback]
  );
  const tableZones = {};
  for (const tbl of tables) {
    const zone = tbl.zone;
    if (zone) tableZones[tbl.id] = zone;
    if (localZones[tbl.id]) tableZones[tbl.id] = localZones[tbl.id];
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "heading-h1", "data-ocid": "seating-settings-page-title", children: t("seating.seatingSettings.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: t("seating.seatingSettings.subtitle", { count: tables.length }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap print:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "gap-1.5 border-primary/30 text-primary hover:bg-primary/10",
          onClick: () => setShowAIModal(true),
          "data-ocid": "seating-settings-ai-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-4 w-4" }),
            t("aiSuggestion.buttonLabel")
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setShowZoneModal(true),
          className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-muted/60 transition-colors",
          "data-ocid": "seating-settings-zones-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-muted-foreground" }),
            t("seating.zones.manage")
          ]
        }
      ),
      !isMobile && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setIsZoneEditMode((v) => !v),
          className: cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors",
            isZoneEditMode ? "bg-accent/10 border-accent/40 text-accent hover:bg-accent/20" : "border-border bg-card text-muted-foreground hover:bg-muted/60"
          ),
          "aria-pressed": isZoneEditMode,
          "data-ocid": "seating-settings-zone-boundary-toggle",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
            isZoneEditMode ? t("seating.zones.editingActive") : t("seating.zones.editBoundaries")
          ]
        }
      ),
      isZoneEditMode && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleSaveZoneBoundaries,
          className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/40 bg-primary/10 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors",
          "data-ocid": "seating-settings-zone-boundary-save",
          children: [
            isSavingZones ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
            isSavingZones ? t("seating.zones.saving") : t("seating.zones.save")
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => ue.info(t("seating.aiReshuffleComingSoon")),
          className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors",
          "data-ocid": "seating-settings-ai-reshuffle-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
            t("seating.aiReshuffle")
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: bgInputRef,
          type: "file",
          accept: "image/*",
          className: "sr-only",
          onChange: handleBgUpload,
          "aria-label": t("seating.uploadBg")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            var _a;
            return (_a = bgInputRef.current) == null ? void 0 : _a.click();
          },
          className: cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors",
            bgImage ? "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20" : "border-border bg-card text-muted-foreground hover:bg-muted/60"
          ),
          "data-ocid": "seating-settings-upload-bg-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "h-4 w-4" }),
            bgImage ? t("seating.changeBg") : t("seating.uploadBg")
          ]
        }
      ),
      bgImage && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setBgImage(void 0),
          className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted/60 transition-colors",
          "data-ocid": "seating-settings-remove-bg-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }),
            t("seating.removeBg")
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => window.print(),
          className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted/60 transition-colors",
          "data-ocid": "seating-settings-print-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4" }),
            t("seating.print")
          ]
        }
      ),
      !isMobile && isEditMode && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            var _a;
            return (_a = undoRef.current) == null ? void 0 : _a.call(undoRef);
          },
          className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted/60 transition-colors",
          "data-ocid": "seating-settings-undo-btn",
          title: "Ctrl+Z",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4" }),
            t("seating.undo")
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "gap-1.5 ml-auto",
          onClick: () => setShowAddForm((v) => !v),
          "data-ocid": "seating-settings-add-table-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            t("seatingPlan.addTable")
          ]
        }
      )
    ] }),
    tables.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setActiveZone(void 0),
          className: cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150",
            !activeZone ? "bg-primary/10 text-primary border-primary/40" : "border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          ),
          "data-ocid": "zone-filter-all",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-foreground/40" }),
            t("seating.zones.all")
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
    ] }),
    showAddForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-gradient-to-br from-card to-background p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("seatingPlan.addTableTitle") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-7 w-7",
            onClick: () => {
              setShowAddForm(false);
              setFormError("");
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "table-name", children: t("seatingPlan.tableName") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "table-name",
              placeholder: t("seatingPlan.tableNamePlaceholder"),
              value: form.name,
              onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
              "data-ocid": "seating-add-table-name",
              autoFocus: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "table-capacity", children: t("seatingPlan.tableCapacity") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "table-capacity",
              type: "number",
              min: 1,
              max: 20,
              value: form.capacity,
              onChange: (e) => setForm((f) => ({ ...f, capacity: e.target.value })),
              "data-ocid": "seating-add-table-capacity"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "table-zone", children: t("seatingPlan.zone") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              id: "table-zone",
              value: form.zone,
              onChange: (e) => setForm((f) => ({ ...f, zone: e.target.value })),
              className: "w-full h-10 rounded-lg border border-input bg-background text-foreground text-sm px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              "data-ocid": "seating-add-table-zone",
              children: zones.map((z) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: z, children: z }, z))
            }
          )
        ] })
      ] }),
      formError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: formError }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => {
              setShowAddForm(false);
              setFormError("");
            },
            children: t("actions.cancel", { ns: "shared" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            onClick: handleAddTable,
            disabled: createTable.isPending,
            "data-ocid": "seating-add-table-submit",
            children: createTable.isPending ? t("seatingPlan.adding") : t("seatingPlan.add")
          }
        )
      ] })
    ] }),
    highlightedTableIds.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 p-3 rounded-xl bg-primary/8 border border-primary/25",
        "data-ocid": "ai-highlight-banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-2.5 w-2.5 rounded-full bg-primary animate-pulse shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground flex-1", children: t("aiSuggestion.highlightBanner", {
            count: highlightedTableIds.size,
            tables: [...highlightedTableIds].map((id) => {
              var _a;
              return (_a = tables.find((tbl) => tbl.id === id)) == null ? void 0 : _a.name;
            }).filter(Boolean).join(", ")
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setHighlightedTableIds(/* @__PURE__ */ new Set());
                setActiveSuggestion(null);
              },
              "aria-label": t("actions.close", { ns: "shared" }),
              className: "h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted/60 transition-colors shrink-0",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
            }
          )
        ]
      }
    ),
    isBulkMode && selectedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md shadow-[0_-4px_20px_oklch(0_0_0/0.3)]",
        "data-ocid": "bulk-action-bar",
        style: { paddingBottom: "env(safe-area-inset-bottom, 0px)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: t("seating.bulk.selectedCount", { count: selectedCount }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: clearBulkState,
                className: "h-8 w-8 rounded-full flex items-center justify-center bg-muted/50 text-muted-foreground hover:bg-muted transition-colors",
                "data-ocid": "bulk-bar-close",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
              }
            )
          ] }),
          bulkCapacityMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3 p-3 rounded-xl bg-muted/40 border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-muted-foreground shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: 1,
                max: 20,
                placeholder: "1–20",
                value: bulkCapacityInput,
                onChange: (e) => setBulkCapacityInput(e.target.value),
                className: "h-9 flex-1 text-sm",
                autoFocus: true,
                "data-ocid": "bulk-capacity-input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                onClick: handleBulkCapacityApply,
                disabled: !bulkCapacityInput || Number(bulkCapacityInput) < 1 || Number(bulkCapacityInput) > 20,
                "data-ocid": "bulk-capacity-apply",
                children: t("seating.bulk.apply")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                onClick: () => {
                  setBulkCapacityMode(false);
                  setBulkCapacityInput("");
                },
                children: t("actions.cancel", { ns: "shared" })
              }
            )
          ] }),
          bulkZonePicker && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 p-3 rounded-xl bg-muted/40 border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground mb-2", children: t("seating.bulk.chooseZone") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
              zones.map((zone) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleBulkZoneApply(zone),
                  className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-foreground hover:bg-primary/10 hover:border-primary transition-colors",
                  "data-ocid": `bulk-zone-${zone}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
                    zone
                  ]
                },
                zone
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setBulkZonePicker(false),
                  className: "px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted/60 transition-colors",
                  children: t("actions.cancel", { ns: "shared" })
                }
              )
            ] })
          ] }),
          bulkConfirmDelete && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 p-3 rounded-xl bg-destructive/10 border border-destructive/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive font-medium mb-2", children: t("seating.bulk.confirmDelete", { count: selectedCount }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "destructive",
                  size: "sm",
                  onClick: handleBulkDelete,
                  disabled: deleteTable.isPending,
                  "data-ocid": "bulk-delete-confirm",
                  children: deleteTable.isPending ? t("seatingPlan.deleting") : t("seating.bulk.deleteSelected")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => setBulkConfirmDelete(false),
                  children: t("actions.cancel", { ns: "shared" })
                }
              )
            ] })
          ] }),
          !bulkZonePicker && !bulkCapacityMode && !bulkConfirmDelete && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setBulkZonePicker(true),
                className: "flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-colors",
                "data-ocid": "bulk-zone-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
                  t("seating.bulk.changeZone")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setBulkCapacityMode(true),
                className: "flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/30 text-secondary text-sm font-medium hover:bg-secondary/20 transition-colors",
                "data-ocid": "bulk-capacity-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
                  t("seating.bulk.setCapacity")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setBulkConfirmDelete(true),
                className: "flex items-center gap-1.5 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors",
                "data-ocid": "bulk-delete-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
                  t("seating.bulk.deleteSelected")
                ]
              }
            )
          ] })
        ] })
      }
    ),
    !isLoading && tables.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-6 py-8 flex flex-col items-center text-center gap-4",
        "data-ocid": "seating-settings-empty-state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-6 w-6 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 max-w-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: t("seatingPlan.noTablesYet") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("seatingPlan.noTablesYetHint") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "default",
                size: "sm",
                className: "gap-2",
                onClick: () => syncTables.mutate(void 0, {
                  onSuccess: () => ue.success(t("seatingPlan.syncSuccess")),
                  onError: (err) => ue.error(
                    err.message.includes("not yet available") ? t("seatingPlan.syncNotAvailable") : err.message
                  )
                }),
                disabled: syncTables.isPending,
                "data-ocid": "seating-settings-import-btn",
                children: [
                  syncTables.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                  syncTables.isPending ? t("seatingPlan.syncing") : t("seatingPlan.importFromSettings")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "gap-2",
                onClick: () => setShowAddForm(true),
                "data-ocid": "seating-settings-add-empty-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                  t("seatingPlan.addTable")
                ]
              }
            )
          ] })
        ]
      }
    ),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full rounded-2xl", style: { minHeight: 580 } }),
    !isLoading && tables.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      FloorPlanCanvas,
      {
        tables,
        isEditMode,
        onTableClick: () => {
        },
        selectedTableIds,
        onSelectionChange: setSelectedTableIds,
        isBulkMode,
        onBulkModeChange: (active) => {
          setIsBulkMode(active);
          if (!active) setSelectedTableIds(/* @__PURE__ */ new Set());
        },
        highlightedTableIds,
        aiSuggestion: activeSuggestion,
        onAiAccept: handleAiAccept,
        onAiReject: handleAiReject,
        bgImage,
        activeZone,
        tableZones,
        undoRef,
        zoneBoundaries,
        onZoneBoundariesChange: setZoneBoundaries,
        isZoneEditMode,
        zonesForBoundaries: zones,
        zoneColors: zoneColorMap
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ZoneManagementModal,
      {
        isOpen: showZoneModal,
        onClose: () => setShowZoneModal(false),
        zones,
        zoneColors: zoneColorMap,
        onZonesChange: () => {
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AISuggestionModal,
      {
        isOpen: showAIModal,
        onClose: () => setShowAIModal(false),
        tables,
        onHighlight: setHighlightedTableIds,
        onSuggestionReady: handleSuggestionReady
      }
    )
  ] });
}
export {
  SeatingPlanSettingsPage as default
};
