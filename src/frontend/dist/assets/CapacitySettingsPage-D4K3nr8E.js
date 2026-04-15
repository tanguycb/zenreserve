import { u as useTranslation, $ as useCapacityConfig, Y as useOpeningHoursConfig, a0 as useUpdateCapacityConfig, r as reactExports, j as jsxRuntimeExports, B as Button, b as ue } from "./index-DYFUyfbw.js";
import { I as Input } from "./input-Be5T95oX.js";
import { L as Label } from "./label-whBlDZv1.js";
import { B as BookOpen } from "./book-open-DcXPLRmC.js";
import { M as Minus } from "./minus-hZf17MQi.js";
import { P as Plus } from "./plus-BLj3PxS_.js";
import { T as Trash2 } from "./trash-2-BocM61zf.js";
function CapacitySettingsPage() {
  const { t } = useTranslation("dashboard");
  const { data: capacityData, isLoading: capLoading } = useCapacityConfig();
  const { data: hoursData } = useOpeningHoursConfig();
  const updateCapacity = useUpdateCapacityConfig();
  const [config, setConfig] = reactExports.useState({
    serviceMaxGuests: {},
    minPartySize: 1,
    maxPartySize: 12,
    zones: [],
    tableTypes: [],
    occupancyCeiling: 85
  });
  const [newZoneName, setNewZoneName] = reactExports.useState("");
  const [newTableTypeName, setNewTableTypeName] = reactExports.useState("");
  const [newTableTypeSeats, setNewTableTypeSeats] = reactExports.useState(4);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (capacityData) setConfig(capacityData);
  }, [capacityData]);
  const setServiceMax = (serviceId, value) => {
    setConfig((c) => ({
      ...c,
      serviceMaxGuests: { ...c.serviceMaxGuests, [serviceId]: value }
    }));
  };
  const addZone = () => {
    const name = newZoneName.trim();
    if (!name) return;
    const zone = { id: Date.now().toString(), name, maxGuests: 20 };
    setConfig((c) => ({ ...c, zones: [...c.zones, zone] }));
    setNewZoneName("");
  };
  const updateZone = (id, updates) => {
    setConfig((c) => ({
      ...c,
      zones: c.zones.map((z) => z.id === id ? { ...z, ...updates } : z)
    }));
  };
  const deleteZone = (id) => {
    setConfig((c) => ({ ...c, zones: c.zones.filter((z) => z.id !== id) }));
  };
  const addTableType = () => {
    const name = newTableTypeName.trim();
    if (!name) return;
    const tt = {
      id: Date.now().toString(),
      name,
      seatsPerTable: newTableTypeSeats,
      count: 1
    };
    setConfig((c) => ({ ...c, tableTypes: [...c.tableTypes, tt] }));
    setNewTableTypeName("");
    setNewTableTypeSeats(4);
  };
  const updateTableType = (id, updates) => {
    setConfig((c) => ({
      ...c,
      tableTypes: c.tableTypes.map(
        (tt) => tt.id === id ? { ...tt, ...updates } : tt
      )
    }));
  };
  const deleteTableType = (id) => {
    setConfig((c) => ({
      ...c,
      tableTypes: c.tableTypes.filter((tt) => tt.id !== id)
    }));
  };
  const saveAll = async () => {
    setIsSaving(true);
    try {
      await updateCapacity.mutateAsync(config);
      ue.success(t("settings.saved"));
    } catch {
      ue.error(t("settings.saveError"));
    } finally {
      setIsSaving(false);
    }
  };
  if (capLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[40vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" }) });
  }
  const services = (hoursData == null ? void 0 : hoursData.services) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl space-y-8", "data-ocid": "capacity-settings-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-5 w-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-foreground", children: t("settings.nav.capacity") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("settings.capacity.subtitle") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.capacity.perService") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("settings.capacity.perServiceHint") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-3", children: [
        services.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("settings.capacity.noServicesHint") }),
        services.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: s.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              s.openTime,
              " – ",
              s.closeTime
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setServiceMax(
                  s.id,
                  Math.max(1, (config.serviceMaxGuests[s.id] ?? 40) - 5)
                ),
                className: "h-7 w-7 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors",
                "aria-label": t("settings.capacity.decreaseMax"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3 w-3" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: 1,
                max: 999,
                value: config.serviceMaxGuests[s.id] ?? s.maxCapacity,
                onChange: (e) => setServiceMax(s.id, Number(e.target.value)),
                className: "w-20 text-center bg-background border-border",
                "data-ocid": `service-max-${s.id}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setServiceMax(
                  s.id,
                  (config.serviceMaxGuests[s.id] ?? 40) + 5
                ),
                className: "h-7 w-7 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors",
                "aria-label": t("settings.capacity.increaseMax"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground w-12", children: t("settings.capacity.guests") })
          ] })
        ] }, s.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-t border-border bg-muted/20 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: saveAll,
          disabled: isSaving,
          className: "gap-2",
          "data-ocid": "save-service-max-btn",
          children: [
            isSaving && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" }),
            t(isSaving ? "settings.saving" : "settings.save")
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.capacity.partySize") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "minParty",
              className: "text-sm font-medium text-foreground",
              children: t("settings.capacity.minParty")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "minParty",
              type: "number",
              min: 1,
              max: config.maxPartySize,
              value: config.minPartySize,
              onChange: (e) => setConfig((c) => ({
                ...c,
                minPartySize: Number(e.target.value)
              })),
              className: "bg-background border-border",
              "data-ocid": "min-party-size"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "maxParty",
              className: "text-sm font-medium text-foreground",
              children: t("settings.capacity.maxParty")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "maxParty",
              type: "number",
              min: config.minPartySize,
              max: 100,
              value: config.maxPartySize,
              onChange: (e) => setConfig((c) => ({
                ...c,
                maxPartySize: Number(e.target.value)
              })),
              className: "bg-background border-border",
              "data-ocid": "max-party-size"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-t border-border bg-muted/20 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: saveAll,
          disabled: isSaving,
          className: "gap-2",
          "data-ocid": "save-party-size-btn",
          children: [
            isSaving && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" }),
            t(isSaving ? "settings.saving" : "settings.save")
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.capacity.zones") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("settings.capacity.zonesHint") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-3", children: [
        config.zones.map((z) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background",
            "data-ocid": `zone-row-${z.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: z.name,
                  onChange: (e) => updateZone(z.id, { name: e.target.value }),
                  className: "flex-1 bg-card border-border h-8 text-sm",
                  "data-ocid": `zone-name-${z.id}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: 1,
                    max: 999,
                    value: z.maxGuests,
                    onChange: (e) => updateZone(z.id, { maxGuests: Number(e.target.value) }),
                    className: "w-20 text-center bg-card border-border h-8 text-sm",
                    "data-ocid": `zone-max-${z.id}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground shrink-0", children: t("settings.capacity.guests") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => deleteZone(z.id),
                  className: "p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                  "aria-label": t("settings.capacity.deleteZone"),
                  "data-ocid": `zone-delete-${z.id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                }
              )
            ]
          },
          z.id
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: newZoneName,
              onChange: (e) => setNewZoneName(e.target.value),
              placeholder: t("settings.capacity.newZonePlaceholder"),
              className: "bg-background border-border",
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addZone();
                }
              },
              "data-ocid": "new-zone-name"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: addZone,
              disabled: !newZoneName.trim(),
              className: "shrink-0 gap-2 border-border",
              "data-ocid": "add-zone-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                t("settings.capacity.addZone")
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-t border-border bg-muted/20 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: saveAll,
          disabled: isSaving,
          className: "gap-2",
          "data-ocid": "save-zones-btn",
          children: [
            isSaving && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" }),
            t(isSaving ? "settings.saving" : "settings.save")
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.capacity.tableTypes") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("settings.capacity.tableTypesHint") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-3 px-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: t("settings.capacity.tableTypeName") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground text-center", children: t("settings.capacity.seatsPerTable") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground text-center", children: t("settings.capacity.tableCount") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: t("settings.capacity.actions") })
        ] }),
        config.tableTypes.map((tt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "grid grid-cols-4 gap-3 items-center px-2 py-2 rounded-xl border border-border bg-background",
            "data-ocid": `table-type-row-${tt.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: tt.name,
                  onChange: (e) => updateTableType(tt.id, { name: e.target.value }),
                  className: "bg-card border-border h-8 text-sm",
                  "data-ocid": `tt-name-${tt.id}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 1,
                  max: 20,
                  value: tt.seatsPerTable,
                  onChange: (e) => updateTableType(tt.id, {
                    seatsPerTable: Number(e.target.value)
                  }),
                  className: "text-center bg-card border-border h-8 text-sm",
                  "data-ocid": `tt-seats-${tt.id}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 0,
                  max: 999,
                  value: tt.count,
                  onChange: (e) => updateTableType(tt.id, { count: Number(e.target.value) }),
                  className: "text-center bg-card border-border h-8 text-sm",
                  "data-ocid": `tt-count-${tt.id}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => deleteTableType(tt.id),
                  className: "justify-self-end p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                  "aria-label": t("settings.capacity.deleteTableType"),
                  "data-ocid": `tt-delete-${tt.id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                }
              )
            ]
          },
          tt.id
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[140px] space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: t("settings.capacity.tableTypeName") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: newTableTypeName,
                onChange: (e) => setNewTableTypeName(e.target.value),
                placeholder: t("settings.capacity.newTableTypePlaceholder"),
                className: "bg-background border-border",
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTableType();
                  }
                },
                "data-ocid": "new-tt-name"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 w-24", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: t("settings.capacity.seatsPerTable") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: 1,
                max: 20,
                value: newTableTypeSeats,
                onChange: (e) => setNewTableTypeSeats(Number(e.target.value)),
                className: "bg-background border-border",
                "data-ocid": "new-tt-seats"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: addTableType,
              disabled: !newTableTypeName.trim(),
              className: "shrink-0 gap-2 border-border",
              "data-ocid": "add-table-type-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                t("settings.capacity.addTableType")
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-t border-border bg-muted/20 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: saveAll,
          disabled: isSaving,
          className: "gap-2",
          "data-ocid": "save-table-types-btn",
          children: [
            isSaving && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" }),
            t(isSaving ? "settings.saving" : "settings.save")
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.capacity.occupancyCeiling") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("settings.capacity.occupancyCeilingHint") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              min: 50,
              max: 100,
              step: 5,
              value: config.occupancyCeiling,
              onChange: (e) => setConfig((c) => ({
                ...c,
                occupancyCeiling: Number(e.target.value)
              })),
              className: "flex-1 h-2 accent-primary cursor-pointer",
              "data-ocid": "occupancy-ceiling-slider",
              "aria-label": t("settings.capacity.occupancyCeiling")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-16 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-primary", children: config.occupancyCeiling }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "%" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground px-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "50%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "75%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "100%" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("settings.capacity.occupancyCeilingLabel", {
          value: config.occupancyCeiling
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-t border-border bg-muted/20 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: saveAll,
          disabled: isSaving,
          className: "gap-2",
          "data-ocid": "save-occupancy-btn",
          children: [
            isSaving && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" }),
            t(isSaving ? "settings.saving" : "settings.save")
          ]
        }
      ) })
    ] })
  ] });
}
export {
  CapacitySettingsPage as default
};
