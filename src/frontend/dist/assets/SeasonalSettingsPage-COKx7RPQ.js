import { i as createLucideIcon, u as useTranslation, e as useCapacityConfig, r as reactExports, j as jsxRuntimeExports, C as CalendarDays, B as Button, a7 as Plus, q as AnimatePresence, s as motion, t as ue, w as Label, I as Input, G as Check, c as cn, K as ChevronUp, M as ChevronDown, O as Badge, bg as Zap } from "./index-BNayfcmF.js";
import { S as Skeleton } from "./skeleton-D2EeOrWT.js";
import { S as Switch } from "./switch-Da4cPyDO.js";
import { u as useSeasonalPeriods, a as useSaveSeasonalPeriod, b as useDeleteSeasonalPeriod, c as useToggleSeasonalPeriod, F as FALLBACK_ZONES, d as detectOverlap } from "./useSeasonalAI-DpqQVWtM.js";
import { S as Sun } from "./sun-sQ0z6rjy.js";
import { C as CircleAlert } from "./circle-alert-dyy_CREt.js";
import { P as Pencil } from "./pencil-DouonZv5.js";
import { T as Trash2 } from "./trash-2-XAAtCYtx.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m10 20-1.25-2.5L6 18", key: "18frcb" }],
  ["path", { d: "M10 4 8.75 6.5 6 6", key: "7mghy3" }],
  ["path", { d: "m14 20 1.25-2.5L18 18", key: "1chtki" }],
  ["path", { d: "m14 4 1.25 2.5L18 6", key: "1b4wsy" }],
  ["path", { d: "m17 21-3-6h-4", key: "15hhxa" }],
  ["path", { d: "m17 3-3 6 1.5 3", key: "11697g" }],
  ["path", { d: "M2 12h6.5L10 9", key: "kv9z4n" }],
  ["path", { d: "m20 10-1.5 2 1.5 2", key: "1swlpi" }],
  ["path", { d: "M22 12h-6.5L14 15", key: "1mxi28" }],
  ["path", { d: "m4 10 1.5 2L4 14", key: "k9enpj" }],
  ["path", { d: "m7 21 3-6-1.5-3", key: "j8hb9u" }],
  ["path", { d: "m7 3 3 6h4", key: "1otusx" }]
];
const Snowflake = createLucideIcon("snowflake", __iconNode);
const BLANK_FORM = {
  name: "",
  dateFrom: "",
  dateTo: "",
  description: "",
  isActive: false,
  autoActivate: false,
  activatedZones: [],
  capacityOverride: null,
  serviceCapacities: {}
};
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("nl-BE", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function isCurrentlyActive(period) {
  if (!period.isActive) return false;
  const now = Date.now();
  const from = new Date(period.dateFrom).getTime();
  const to = new Date(period.dateTo).getTime();
  return now >= from && now <= to;
}
function SeasonIcon({ zones }) {
  if (zones.includes("terras") || zones.includes("rooftop"))
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-4 w-4 text-[oklch(var(--status-orange))]" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Snowflake, { className: "h-4 w-4 text-[oklch(var(--status-blue))]" });
}
const SERVICE_DEFAULTS = [
  { id: "lunch", label: "Lunch" },
  { id: "diner", label: "Diner" }
];
function SeasonForm({
  initial,
  existingPeriods,
  editId,
  availableZones,
  onSave,
  onCancel
}) {
  const { t } = useTranslation("dashboard");
  const [form, setForm] = reactExports.useState(initial);
  const [error, setError] = reactExports.useState(null);
  const [showAdvanced, setShowAdvanced] = reactExports.useState(false);
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const toggleZone = (zone) => set(
    "activatedZones",
    form.activatedZones.includes(zone) ? form.activatedZones.filter((z) => z !== zone) : [...form.activatedZones, zone]
  );
  const handleSave = () => {
    if (!form.name.trim()) {
      setError(t("settings.seasonal.errorNameRequired"));
      return;
    }
    if (!form.dateFrom || !form.dateTo) {
      setError(t("settings.seasonal.errorDateRequired"));
      return;
    }
    if (new Date(form.dateFrom) >= new Date(form.dateTo)) {
      setError(t("settings.seasonal.errorDateOrder"));
      return;
    }
    const overlap = detectOverlap(existingPeriods, {
      dateFrom: form.dateFrom,
      dateTo: form.dateTo,
      id: editId
    });
    if (overlap) {
      setError(t("settings.seasonal.errorOverlap", { name: overlap.name }));
      return;
    }
    setError(null);
    onSave(form);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: -12 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -8 },
      transition: { duration: 0.2 },
      className: "rounded-2xl border border-primary/30 bg-card shadow-elevated overflow-hidden",
      "data-ocid": "season-form",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-border bg-primary/5 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: form.name || t("settings.seasonal.newSeason") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "season-name", className: "text-sm font-medium", children: t("settings.seasonal.name") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "season-name",
                value: form.name,
                onChange: (e) => set("name", e.target.value),
                placeholder: t("settings.seasonal.namePlaceholder"),
                className: "bg-background border-border",
                "data-ocid": "season-name-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: t("settings.seasonal.dateRange") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wide", children: t("settings.seasonal.dateFrom") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "season-from",
                      type: "date",
                      value: form.dateFrom,
                      onChange: (e) => set("dateFrom", e.target.value),
                      className: "bg-background border-border pl-9",
                      "data-ocid": "season-date-from"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wide", children: t("settings.seasonal.dateTo") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "season-to",
                      type: "date",
                      value: form.dateTo,
                      min: form.dateFrom || void 0,
                      onChange: (e) => set("dateTo", e.target.value),
                      className: "bg-background border-border pl-9",
                      "data-ocid": "season-date-to"
                    }
                  )
                ] })
              ] })
            ] }),
            form.dateFrom && form.dateTo && new Date(form.dateFrom) < new Date(form.dateTo) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/15", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-primary shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-primary font-medium", children: [
                formatDate(form.dateFrom),
                " → ",
                formatDate(form.dateTo)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-auto", children: [
                Math.ceil(
                  (new Date(form.dateTo).getTime() - new Date(form.dateFrom).getTime()) / (1e3 * 60 * 60 * 24)
                ),
                " ",
                t("settings.seasonal.days")
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "season-desc", className: "text-sm font-medium", children: [
              t("settings.seasonal.description"),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-xs text-muted-foreground font-normal", children: [
                "(",
                t("settings.seasonal.optional"),
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "season-desc",
                value: form.description ?? "",
                onChange: (e) => set("description", e.target.value),
                placeholder: t("settings.seasonal.descriptionPlaceholder"),
                className: "bg-background border-border",
                "data-ocid": "season-description-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: t("settings.seasonal.activatedZones") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.seasonal.activatedZonesHint") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1", children: availableZones.map((zone) => {
              const active = form.activatedZones.includes(zone);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => toggleZone(zone),
                  "data-ocid": `zone-toggle-${zone}`,
                  className: cn(
                    "px-3 py-2.5 rounded-xl text-xs font-medium border transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    "flex items-center gap-2",
                    active ? "bg-primary/10 text-primary border-primary/30 shadow-sm" : "bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                  ),
                  "aria-pressed": active,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: cn(
                          "h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                          active ? "bg-primary border-primary" : "border-border"
                        ),
                        children: active && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-2.5 w-2.5 text-primary-foreground" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: zone })
                  ]
                },
                zone
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "capacity-override", className: "text-sm font-medium", children: [
              t("settings.seasonal.capacityOverride"),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-xs text-muted-foreground font-normal", children: [
                "(",
                t("settings.seasonal.optional"),
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.seasonal.capacityOverrideHint") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "capacity-override",
                  type: "number",
                  min: 0,
                  max: 1e3,
                  value: form.capacityOverride ?? "",
                  onChange: (e) => set(
                    "capacityOverride",
                    e.target.value === "" ? null : Number(e.target.value)
                  ),
                  placeholder: "—",
                  className: "bg-background border-border w-28",
                  "data-ocid": "season-capacity-override"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: t("settings.seasonal.guests") })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setShowAdvanced(!showAdvanced),
                className: "flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors",
                "data-ocid": "season-advanced-toggle",
                children: [
                  showAdvanced ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5" }),
                  t("settings.seasonal.perServiceCapacity")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showAdvanced && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, height: 0 },
                animate: { opacity: 1, height: "auto" },
                exit: { opacity: 0, height: 0 },
                transition: { duration: 0.2 },
                className: "overflow-hidden",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-1", children: [
                  SERVICE_DEFAULTS.map((svc) => {
                    var _a;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground w-20 shrink-0", children: svc.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          type: "number",
                          min: 0,
                          max: 500,
                          value: ((_a = form.serviceCapacities) == null ? void 0 : _a[svc.id]) ?? "",
                          onChange: (e) => set("serviceCapacities", {
                            ...form.serviceCapacities,
                            [svc.id]: e.target.value === "" ? 0 : Number(e.target.value)
                          }),
                          placeholder: "—",
                          className: "bg-background border-border w-24 text-sm",
                          "data-ocid": `season-service-cap-${svc.id}`
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: t("settings.seasonal.guests") })
                    ] }, svc.id);
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground pt-1", children: t("settings.seasonal.perServiceCapacityHint") })
                ] })
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 py-2.5 px-4 rounded-xl border border-border bg-background", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: t("settings.seasonal.autoActivate") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.seasonal.autoActivateHint") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: form.autoActivate,
                  onCheckedChange: (v) => set("autoActivate", v),
                  "data-ocid": "season-auto-activate"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 py-2.5 px-4 rounded-xl border border-border bg-background", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: t("settings.seasonal.activeNow") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.seasonal.activeNowHint") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: form.isActive,
                  onCheckedChange: (v) => set("isActive", v),
                  "data-ocid": "season-active-toggle"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: -4 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -4 },
              className: "flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-destructive shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: error })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              onClick: onCancel,
              "data-ocid": "season-form-cancel",
              children: t("settings.seasonal.cancel")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", onClick: handleSave, "data-ocid": "season-form-save", children: t("settings.seasonal.save") })
        ] })
      ]
    }
  );
}
function SeasonCard({ period, onEdit, onDelete, onToggle }) {
  const { t } = useTranslation("dashboard");
  const live = isCurrentlyActive(period);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, scale: 0.98 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.96 },
      transition: { duration: 0.18 },
      className: cn(
        "rounded-2xl border bg-card shadow-subtle overflow-hidden transition-colors duration-200",
        period.isActive ? "border-primary/30" : "border-border opacity-80 hover:opacity-100 hover:border-border/80"
      ),
      "data-ocid": `season-card-${period.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                  period.isActive ? "bg-primary/10" : "bg-muted"
                ),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SeasonIcon, { zones: period.activatedZones })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground truncate", children: period.name }),
                live && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "seasonal-active-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/15 text-primary border border-primary/25",
                    "data-ocid": `season-live-badge-${period.id}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-1.5 w-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" })
                      ] }),
                      t("settings.seasonal.statusLive")
                    ]
                  }
                ),
                !live && period.isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/10 text-primary border-primary/20 text-[10px] font-semibold px-2", children: t("settings.seasonal.statusActive") }),
                !period.isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-muted-foreground text-[10px] font-medium px-2",
                    children: t("settings.seasonal.statusInactive")
                  }
                ),
                period.autoActivate && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[oklch(var(--status-blue)/0.1)] text-[oklch(var(--status-blue))] border-[oklch(var(--status-blue)/0.2)] text-[10px] font-medium px-2 gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-2.5 w-2.5" }),
                  t("settings.seasonal.autoLabel")
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 font-medium", children: [
                formatDate(period.dateFrom),
                " → ",
                formatDate(period.dateTo)
              ] }),
              period.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-1", children: period.description })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: period.isActive,
                onCheckedChange: onToggle,
                "aria-label": t("settings.seasonal.toggleActive", {
                  name: period.name
                }),
                "data-ocid": `season-toggle-${period.id}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                onClick: onEdit,
                "aria-label": t("settings.seasonal.editSeason", {
                  name: period.name
                }),
                className: "h-8 w-8 text-muted-foreground hover:text-foreground",
                "data-ocid": `season-edit-${period.id}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                onClick: onDelete,
                "aria-label": t("settings.seasonal.deleteSeason", {
                  name: period.name
                }),
                className: "h-8 w-8 text-muted-foreground hover:text-destructive",
                "data-ocid": `season-delete-${period.id}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: period.activatedZones.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground italic", children: t("settings.seasonal.noZones") }) : period.activatedZones.map((z) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground font-medium capitalize",
              children: z
            },
            z
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto shrink-0 flex items-center gap-3", children: [
            period.capacityOverride !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: t("settings.seasonal.capacityLabel", {
              value: period.capacityOverride
            }) }),
            period.serviceCapacities && Object.keys(period.serviceCapacities).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: Object.entries(period.serviceCapacities).filter(([, v]) => v !== void 0).map(([k, v]) => `${k}: ${String(v)}`).join(" · ") })
          ] })
        ] })
      ]
    }
  );
}
function SeasonalSettingsPage() {
  const { t } = useTranslation("dashboard");
  const { data: periods = [], isLoading } = useSeasonalPeriods();
  const { data: capacityConfig } = useCapacityConfig();
  const saveMutation = useSaveSeasonalPeriod();
  const deleteMutation = useDeleteSeasonalPeriod();
  const toggleMutation = useToggleSeasonalPeriod();
  const availableZones = (capacityConfig == null ? void 0 : capacityConfig.zones) && capacityConfig.zones.length > 0 ? capacityConfig.zones.map((z) => z.name) : [...FALLBACK_ZONES];
  const [addingNew, setAddingNew] = reactExports.useState(false);
  const [editingId, setEditingId] = reactExports.useState(null);
  const handleAdd = (data) => {
    saveMutation.mutate(
      { data },
      {
        onSuccess: (saved) => {
          ue.success(
            t("settings.seasonal.toastAdded", { name: saved.name })
          );
          setAddingNew(false);
        },
        onError: () => ue.error(t("settings.seasonal.toastSaveError"))
      }
    );
  };
  const handleEdit = (id, data) => {
    saveMutation.mutate(
      { data, id },
      {
        onSuccess: (saved) => {
          ue.success(
            t("settings.seasonal.toastUpdated", { name: saved.name })
          );
          setEditingId(null);
        },
        onError: () => ue.error(t("settings.seasonal.toastSaveError"))
      }
    );
  };
  const handleDelete = (id, name) => {
    deleteMutation.mutate(id, {
      onSuccess: () => ue.success(t("settings.seasonal.toastDeleted", { name })),
      onError: () => ue.error(t("settings.seasonal.toastDeleteError"))
    });
  };
  const handleToggle = (id, active) => {
    toggleMutation.mutate(
      { id, active },
      {
        onSuccess: () => ue.success(
          active ? t("settings.seasonal.toastActivated") : t("settings.seasonal.toastDeactivated")
        ),
        onError: () => ue.error(t("settings.seasonal.toastSaveError"))
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl space-y-8", "data-ocid": "seasonal-settings-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-5 w-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-foreground", children: t("settings.nav.seasonal") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("settings.seasonal.subtitle") })
        ] })
      ] }),
      !addingNew && editingId === null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: () => setAddingNew(true),
          className: "gap-2 shrink-0",
          "data-ocid": "add-season-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            t("settings.seasonal.addSeason")
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: addingNew && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SeasonForm,
      {
        initial: BLANK_FORM,
        existingPeriods: periods,
        availableZones,
        onSave: handleAdd,
        onCancel: () => setAddingNew(false)
      }
    ) }),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full rounded-2xl" }, i)) }),
    !isLoading && periods.length === 0 && !addingNew ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "rounded-2xl border border-dashed border-border bg-card/50 flex flex-col items-center justify-center py-16 px-6 text-center",
        "data-ocid": "seasonal-empty-state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-7 w-7 text-primary/60" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground mb-1", children: t("settings.seasonal.emptyTitle") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs mb-5", children: t("settings.seasonal.emptyHint") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              onClick: () => setAddingNew(true),
              className: "gap-2",
              "data-ocid": "add-season-empty-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                t("settings.seasonal.addSeason")
              ]
            }
          )
        ]
      }
    ) : !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: periods.map(
      (period) => editingId === period.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        SeasonForm,
        {
          editId: period.id,
          initial: {
            name: period.name,
            dateFrom: period.dateFrom,
            dateTo: period.dateTo,
            description: period.description,
            isActive: period.isActive,
            autoActivate: period.autoActivate,
            activatedZones: period.activatedZones,
            capacityOverride: period.capacityOverride,
            serviceCapacities: period.serviceCapacities ?? {}
          },
          existingPeriods: periods,
          availableZones,
          onSave: (data) => handleEdit(period.id, data),
          onCancel: () => setEditingId(null)
        },
        period.id
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        SeasonCard,
        {
          period,
          onEdit: () => setEditingId(period.id),
          onDelete: () => handleDelete(period.id, period.name),
          onToggle: (active) => handleToggle(period.id, active)
        },
        period.id
      )
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/15", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-4 w-4 text-primary shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.seasonal.infoNote") })
    ] })
  ] });
}
export {
  SeasonalSettingsPage as default
};
