import { u as useTranslation, r as reactExports, j as jsxRuntimeExports, B as Button, a7 as Plus, w as Label, I as Input, X, t as ue } from "./index-BNayfcmF.js";
import { u as useZones, a as useUpdateZone, b as useDeleteZone, c as useAddZone, D as DEFAULT_COLORS } from "./useZones-tYmI7Ueo.js";
import { L as Layers } from "./layers-jY-i6yiE.js";
import { P as Pencil } from "./pencil-DouonZv5.js";
import { T as Trash2 } from "./trash-2-XAAtCYtx.js";
function ColorPicker({ value, onChange }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: DEFAULT_COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: () => onChange(c),
      className: "h-6 w-6 rounded-full border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      style: {
        backgroundColor: c,
        borderColor: value === c ? "white" : "transparent",
        boxShadow: value === c ? `0 0 0 2px ${c}` : void 0
      },
      "aria-label": c,
      "aria-pressed": value === c
    },
    c
  )) });
}
function AddZoneForm({ onClose }) {
  const { t } = useTranslation("dashboard");
  const addZone = useAddZone();
  const [name, setName] = reactExports.useState("");
  const [color, setColor] = reactExports.useState(DEFAULT_COLORS[0]);
  const [maxGuests, setMaxGuests] = reactExports.useState(30);
  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      await addZone.mutateAsync({ name: name.trim(), color, maxGuests });
      ue.success(t("settings.zones.added"));
      onClose();
    } catch (err) {
      ue.error(
        `${t("settings.saveError")}: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 space-y-4",
      "data-ocid": "zone-add-form",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: t("settings.zones.addTitle") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground",
              "aria-label": t("settings.zones.cancel"),
              "data-ocid": "zone-add-form-close",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: t("settings.zones.name") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: t("settings.zones.namePlaceholder"),
                className: "bg-card border-border",
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSave();
                  }
                },
                autoFocus: true,
                "data-ocid": "zone-add-name-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: t("settings.zones.maxGuests") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: 1,
                max: 999,
                value: maxGuests,
                onChange: (e) => setMaxGuests(Number(e.target.value)),
                className: "bg-card border-border",
                "data-ocid": "zone-add-max-input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: t("settings.zones.color") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ColorPicker, { value: color, onChange: setColor })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              onClick: handleSave,
              disabled: !name.trim() || addZone.isPending,
              className: "gap-2",
              "data-ocid": "zone-add-save-btn",
              children: [
                addZone.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" }),
                t(addZone.isPending ? "settings.saving" : "settings.save")
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              onClick: onClose,
              "data-ocid": "zone-add-cancel-btn",
              children: t("settings.zones.cancel")
            }
          )
        ] })
      ]
    }
  );
}
function ZoneRow({ zone, index }) {
  const { t } = useTranslation("dashboard");
  const updateZone = useUpdateZone();
  const deleteZone = useDeleteZone();
  const [editing, setEditing] = reactExports.useState(false);
  const [confirmDelete, setConfirmDelete] = reactExports.useState(false);
  const [name, setName] = reactExports.useState(zone.name);
  const [color, setColor] = reactExports.useState(zone.color);
  const [maxGuests, setMaxGuests] = reactExports.useState(zone.maxGuests);
  const handleSave = async () => {
    try {
      await updateZone.mutateAsync({
        id: zone.id,
        name: name.trim() || zone.name,
        color,
        maxGuests
      });
      ue.success(t("settings.zones.updated"));
      setEditing(false);
    } catch (err) {
      ue.error(
        `${t("settings.saveError")}: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };
  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    try {
      await deleteZone.mutateAsync(zone.id);
      ue.success(t("settings.zones.deleted"));
    } catch (err) {
      ue.error(
        `${t("settings.saveError")}: ${err instanceof Error ? err.message : String(err)}`
      );
      setConfirmDelete(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-border bg-background overflow-hidden",
      "data-ocid": `zone-row.item.${index + 1}`,
      children: [
        !editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-8 w-8 rounded-lg shrink-0 border border-border/50 shadow-sm",
              style: { backgroundColor: zone.color },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: zone.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.zones.maxGuestsLabel", { count: zone.maxGuests }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setName(zone.name);
                  setColor(zone.color);
                  setMaxGuests(zone.maxGuests);
                  setEditing(true);
                  setConfirmDelete(false);
                },
                className: "p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                "aria-label": t("settings.zones.edit"),
                "data-ocid": `zone-edit-btn.${index + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
              }
            ),
            confirmDelete ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 ml-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: handleDelete,
                  className: "px-2 py-1 rounded-lg text-xs font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 transition-colors",
                  "data-ocid": `zone-confirm-delete.${index + 1}`,
                  children: t("settings.zones.deleteConfirm")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setConfirmDelete(false),
                  className: "px-2 py-1 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors",
                  "data-ocid": `zone-cancel-delete.${index + 1}`,
                  children: t("settings.zones.cancel")
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleDelete,
                disabled: deleteZone.isPending,
                className: "p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                "aria-label": t("settings.zones.delete"),
                "data-ocid": `zone-delete-btn.${index + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] }),
        editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 space-y-4 border-t border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: t("settings.zones.name") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  className: "bg-background border-border",
                  autoFocus: true,
                  "data-ocid": `zone-edit-name.${index + 1}`
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: t("settings.zones.maxGuests") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 1,
                  max: 999,
                  value: maxGuests,
                  onChange: (e) => setMaxGuests(Number(e.target.value)),
                  className: "bg-background border-border",
                  "data-ocid": `zone-edit-max.${index + 1}`
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: t("settings.zones.color") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ColorPicker, { value: color, onChange: setColor })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                onClick: handleSave,
                disabled: updateZone.isPending,
                className: "gap-2",
                "data-ocid": `zone-save-btn.${index + 1}`,
                children: [
                  updateZone.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" }),
                  t(updateZone.isPending ? "settings.saving" : "settings.save")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "ghost",
                onClick: () => setEditing(false),
                "data-ocid": `zone-edit-cancel.${index + 1}`,
                children: t("settings.zones.cancel")
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function ZonesSettingsPage() {
  const { t } = useTranslation("dashboard");
  const { data: zones = [], isLoading } = useZones();
  const [showAddForm, setShowAddForm] = reactExports.useState(false);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[40vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl space-y-8", "data-ocid": "zones-settings-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-5 w-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-foreground", children: t("settings.nav.zones") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("settings.zones.subtitle") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.zones.listTitle") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("settings.zones.listHint") })
        ] }),
        zones.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground", children: zones.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-3", children: [
        zones.length === 0 && !showAddForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-10 text-center",
            "data-ocid": "zones-empty-state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-6 w-6 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-1", children: t("settings.zones.emptyTitle") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-xs", children: t("settings.zones.emptyHint") })
            ]
          }
        ),
        zones.map((zone, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ZoneRow, { zone, index: i }, zone.id)),
        showAddForm && /* @__PURE__ */ jsxRuntimeExports.jsx(AddZoneForm, { onClose: () => setShowAddForm(false) })
      ] }),
      !showAddForm && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-t border-border bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: () => setShowAddForm(true),
          className: "gap-2 border-border",
          "data-ocid": "zone-add-open-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            t("settings.zones.addZone")
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: t("settings.zones.infoNote") }) })
  ] });
}
export {
  ZonesSettingsPage as default
};
