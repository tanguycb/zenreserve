import { i as createLucideIcon, u as useTranslation, r as reactExports, j as jsxRuntimeExports, D as Dialog, n as DialogContent, o as DialogHeader, p as DialogTitle, w as Label, I as Input, F as Textarea, O as Badge, B as Button, aG as useExperiences, bh as useDeleteExperience, bi as useUpdateExperience, a7 as Plus, g as Clock, C as CalendarDays, ad as formatCurrency, U as Users, t as ue } from "./index-BNayfcmF.js";
import { a as SkeletonCard } from "./SkeletonCard-C6az2IVr.js";
import { S as Switch } from "./switch-Da4cPyDO.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-D5EHXLzH.js";
import { S as Star } from "./star-h0dWBoX6.js";
import { P as Pen } from "./pen-iyqNy_U3.js";
import { T as Trash2 } from "./trash-2-XAAtCYtx.js";
import "./skeleton-D2EeOrWT.js";
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
      d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
      key: "1a0edw"
    }
  ],
  ["path", { d: "M12 22V12", key: "d0xqtd" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }]
];
const Package = createLucideIcon("package", __iconNode);
const EMPTY = {
  name: "",
  description: "",
  price: "",
  available: true,
  required: false,
  serviceIds: [],
  dayOfWeek: []
};
const ALL_DAYS = [
  { value: 1, labelKey: "settings.days.mon" },
  { value: 2, labelKey: "settings.days.tue" },
  { value: 3, labelKey: "settings.days.wed" },
  { value: 4, labelKey: "settings.days.thu" },
  { value: 5, labelKey: "settings.days.fri" },
  { value: 6, labelKey: "settings.days.sat" },
  { value: 0, labelKey: "settings.days.sun" }
];
const DEFAULT_SERVICES = [
  { id: "lunch", labelKey: "experiences.serviceLunch" },
  { id: "diner", labelKey: "experiences.serviceDiner" }
];
function ExperienceForm({
  open,
  onClose,
  onSave,
  initial = null,
  isSaving = false,
  services
}) {
  const { t } = useTranslation("dashboard");
  const [form, setForm] = reactExports.useState(EMPTY);
  const [errors, setErrors] = reactExports.useState({});
  const titleId = "experience-form-title";
  const resolvedServices = services && services.length > 0 ? services : DEFAULT_SERVICES.map((s) => ({
    id: s.id,
    label: t(s.labelKey, { defaultValue: s.id })
  }));
  reactExports.useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          name: initial.name,
          description: initial.description,
          price: (initial.price / 100).toFixed(2),
          available: initial.available,
          required: initial.required,
          serviceIds: initial.serviceIds ?? [],
          dayOfWeek: initial.dayOfWeek ?? []
        });
      } else {
        setForm(EMPTY);
      }
      setErrors({});
    }
  }, [open, initial]);
  const validate = () => {
    const errs = {};
    if (!form.name.trim())
      errs.name = t("settings.experiences.nameRequired", {
        defaultValue: "Naam is verplicht"
      });
    if (!form.description.trim())
      errs.description = t("settings.experiences.descriptionRequired", {
        defaultValue: "Beschrijving is verplicht"
      });
    const priceNum = Number.parseFloat(form.price);
    if (Number.isNaN(priceNum) || priceNum < 0)
      errs.price = t("settings.experiences.priceInvalid", {
        defaultValue: "Voer een geldig bedrag in (bijv. 95.00)"
      });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleSave = () => {
    if (!validate()) return;
    const priceInCents = Math.round(Number.parseFloat(form.price) * 100);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: priceInCents,
      available: form.available,
      required: form.required,
      serviceIds: form.serviceIds,
      dayOfWeek: form.dayOfWeek
    };
    if (initial) {
      onSave({ ...payload, id: initial.id, tag: initial.tag });
    } else {
      onSave(payload);
    }
    onClose();
  };
  const field = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: void 0 }));
  };
  const toggleService = (id) => {
    setForm((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(id) ? prev.serviceIds.filter((s) => s !== id) : [...prev.serviceIds, id]
    }));
  };
  const toggleDay = (value) => {
    setForm((prev) => ({
      ...prev,
      dayOfWeek: prev.dayOfWeek.includes(value) ? prev.dayOfWeek.filter((d) => d !== value) : [...prev.dayOfWeek, value]
    }));
  };
  const allServices = form.serviceIds.length === 0;
  const allDays = form.dayOfWeek.length === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-md gap-0 p-0 overflow-hidden border-border bg-card max-h-[90vh] overflow-y-auto",
      "aria-labelledby": titleId,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "px-6 pt-6 pb-4 border-b border-border sticky top-0 bg-card z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          DialogTitle,
          {
            id: titleId,
            className: "text-lg font-semibold text-foreground",
            children: initial ? t("experiences.editTitle", {
              defaultValue: "Ervaring bewerken"
            }) : t("experiences.addTitle", {
              defaultValue: "Ervaring toevoegen"
            })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "exp-name",
                className: "text-sm font-medium text-foreground",
                children: [
                  t("experiences.nameLabel", { defaultValue: "Naam" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "exp-name",
                value: form.name,
                onChange: (e) => field("name", e.target.value),
                placeholder: "Chef's Tasting Menu",
                className: `bg-muted/20 border-border ${errors.name ? "border-destructive/60" : ""}`,
                "aria-invalid": !!errors.name,
                "aria-describedby": errors.name ? "exp-name-err" : void 0,
                "data-ocid": "exp-name-input"
              }
            ),
            errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                id: "exp-name-err",
                className: "text-xs text-destructive",
                role: "alert",
                children: errors.name
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "exp-desc",
                className: "text-sm font-medium text-foreground",
                children: [
                  t("experiences.descriptionLabel", {
                    defaultValue: "Beschrijving"
                  }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "exp-desc",
                value: form.description,
                onChange: (e) => field("description", e.target.value),
                placeholder: "Een culinaire reis van 7 gangen...",
                className: `bg-muted/20 border-border resize-none min-h-[80px] ${errors.description ? "border-destructive/60" : ""}`,
                "aria-invalid": !!errors.description,
                "aria-describedby": errors.description ? "exp-desc-err" : void 0,
                "data-ocid": "exp-desc-input"
              }
            ),
            errors.description && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                id: "exp-desc-err",
                className: "text-xs text-destructive",
                role: "alert",
                children: errors.description
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "exp-price",
                className: "text-sm font-medium text-foreground",
                children: t("experiences.priceLabel", {
                  defaultValue: "Prijs per persoon (EUR)"
                })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground", children: "€" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "exp-price",
                  type: "number",
                  min: "0",
                  step: "0.01",
                  value: form.price,
                  onChange: (e) => field("price", e.target.value),
                  placeholder: "95.00",
                  className: `pl-7 bg-muted/20 border-border ${errors.price ? "border-destructive/60" : ""}`,
                  "aria-invalid": !!errors.price,
                  "aria-describedby": errors.price ? "exp-price-err" : void 0,
                  "data-ocid": "exp-price-input"
                }
              )
            ] }),
            errors.price && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                id: "exp-price-err",
                className: "text-xs text-destructive",
                role: "alert",
                children: errors.price
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: t("experiences.servicesLabel", {
                defaultValue: "Van toepassing op service"
              }) }),
              allServices && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-[10px] bg-primary/10 text-primary border-primary/20 px-2",
                  children: t("experiences.allServices", {
                    defaultValue: "Alle services"
                  })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground -mt-1", children: t("experiences.servicesHint", {
              defaultValue: "Selecteer niets = van toepassing op alle services"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: resolvedServices.map((svc) => {
              const checked = form.serviceIds.includes(svc.id);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => toggleService(svc.id),
                  className: `flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors text-sm font-medium ${checked ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-muted/20 text-foreground hover:bg-muted/40"}`,
                  "aria-pressed": checked,
                  "data-ocid": `exp-service-${svc.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `h-3.5 w-3.5 rounded-sm border-2 flex items-center justify-center shrink-0 ${checked ? "bg-primary border-primary" : "border-muted-foreground"}`,
                        "aria-hidden": "true",
                        children: checked && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "svg",
                          {
                            viewBox: "0 0 10 8",
                            className: "h-2 w-2 fill-primary-foreground",
                            "aria-hidden": "true",
                            focusable: "false",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "path",
                              {
                                d: "M1 4l3 3 5-6",
                                stroke: "currentColor",
                                strokeWidth: "1.5",
                                fill: "none",
                                strokeLinecap: "round",
                                strokeLinejoin: "round"
                              }
                            )
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: svc.label })
                  ]
                },
                svc.id
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: t("experiences.daysLabel", {
                defaultValue: "Van toepassing op dagen"
              }) }),
              allDays && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-[10px] bg-primary/10 text-primary border-primary/20 px-2",
                  children: t("experiences.allDays", {
                    defaultValue: "Alle dagen"
                  })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground -mt-1", children: t("experiences.daysHint", {
              defaultValue: "Selecteer niets = van toepassing op alle dagen"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ALL_DAYS.map((day) => {
              const checked = form.dayOfWeek.includes(day.value);
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => toggleDay(day.value),
                  className: `flex items-center gap-1.5 rounded-lg border px-2.5 py-2 transition-colors text-xs font-medium ${checked ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-muted/20 text-foreground hover:bg-muted/40"}`,
                  "aria-pressed": checked,
                  "data-ocid": `exp-day-${day.value}`,
                  children: t(day.labelKey, { defaultValue: String(day.value) })
                },
                day.value
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg bg-muted/20 px-4 py-3 border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "exp-active",
                  className: "text-sm font-medium text-foreground cursor-pointer",
                  children: t("experiences.activeLabel", { defaultValue: "Actief" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("experiences.activeHint", {
                defaultValue: "Zichtbaar voor gasten in de widget"
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                id: "exp-active",
                checked: form.available,
                onCheckedChange: (v) => field("available", v),
                "data-ocid": "exp-active-toggle"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg bg-muted/20 px-4 py-3 border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "exp-required",
                  className: "text-sm font-medium text-foreground cursor-pointer",
                  children: t("experiences.requiredLabel", {
                    defaultValue: "Verplicht"
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: form.required ? t("experiences.requiredHintOn", {
                defaultValue: "Gast moet een ervaring kiezen — geen 'Geen voorkeur' optie"
              }) : t("experiences.requiredHintOff", {
                defaultValue: "Gast kan 'Geen voorkeur' kiezen of een ervaring overslaan"
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                id: "exp-required",
                checked: form.required,
                onCheckedChange: (v) => field("required", v),
                "data-ocid": "exp-required-toggle"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/10 sticky bottom-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: onClose,
              "data-ocid": "exp-form-cancel",
              children: t("common.cancel", { defaultValue: "Annuleren" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              onClick: handleSave,
              disabled: isSaving,
              className: "bg-primary text-primary-foreground hover:bg-primary/90",
              "data-ocid": "exp-form-save",
              children: isSaving ? t("common.saving", { defaultValue: "Opslaan..." }) : initial ? t("common.update", { defaultValue: "Bijwerken" }) : t("common.add", { defaultValue: "Toevoegen" })
            }
          )
        ] })
      ]
    }
  ) });
}
const SKELETON_KEYS = ["e1", "e2", "e3"];
const TAG_STYLES = {
  menu: "bg-primary/15 text-primary border-primary/25",
  event: "bg-[oklch(var(--status-blue)/0.15)] text-[oklch(var(--status-blue))] border-[oklch(var(--status-blue)/0.25)]",
  special: "bg-[oklch(var(--status-orange)/0.15)] text-[oklch(var(--status-orange))] border-[oklch(var(--status-orange)/0.25)]"
};
const DAY_LABELS = {
  0: "Zo",
  1: "Ma",
  2: "Di",
  3: "Wo",
  4: "Do",
  5: "Vr",
  6: "Za"
};
function SettingsExperiencesPage() {
  const { t } = useTranslation(["dashboard"]);
  const { data: experiences, isLoading } = useExperiences();
  const deleteExperience = useDeleteExperience();
  const updateExperience = useUpdateExperience();
  const [formOpen, setFormOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const tagLabel = (tag) => {
    if (tag === "menu") return t("dashboard:experiences.tagMenu");
    if (tag === "event") return t("dashboard:experiences.tagEvent");
    return t("dashboard:experiences.tagSpecial");
  };
  const handleAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };
  const handleEdit = (exp) => {
    setEditTarget(exp);
    setFormOpen(true);
  };
  const handleDeleteRequest = (exp) => {
    setDeleteTarget(exp);
  };
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const name = deleteTarget.name;
    deleteExperience.mutate(deleteTarget.id, {
      onSuccess: () => {
        ue.success(t("dashboard:experiences.deleted", { name }));
        setDeleteTarget(null);
      },
      onError: (err) => {
        ue.error(err.message ?? t("dashboard:common.errorGeneric"));
        setDeleteTarget(null);
      }
    });
  };
  const handleSave = (data) => {
    if ("id" in data) {
      ue.success(t("dashboard:experiences.updated", { name: data.name }));
    } else {
      ue.success(t("dashboard:experiences.added", { name: data.name }));
    }
    setFormOpen(false);
  };
  const handleToggleRequired = (exp, required) => {
    updateExperience.mutate(
      { ...exp, required },
      {
        onSuccess: () => {
          ue.success(
            required ? t("dashboard:experiences.markedRequired", { name: exp.name }) : t("dashboard:experiences.markedOptional", { name: exp.name })
          );
        },
        onError: (err) => {
          ue.error(err.message ?? t("dashboard:common.errorGeneric"));
        }
      }
    );
  };
  const visibleExperiences = (experiences ?? []).filter((e) => e.available);
  const activeCount = visibleExperiences.length;
  const getRestrictionBadges = (exp) => {
    const badges = [];
    if (exp.serviceIds && exp.serviceIds.length > 0) {
      badges.push(
        ...exp.serviceIds.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      );
    }
    if (exp.dayOfWeek && exp.dayOfWeek.length > 0) {
      const sortedDays = [...exp.dayOfWeek].sort((a, b) => {
        const normA = a === 0 ? 7 : a;
        const normB = b === 0 ? 7 : b;
        return normA - normB;
      }).map((d) => DAY_LABELS[d] ?? d);
      badges.push(sortedDays.join(", "));
    }
    return badges;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold text-display text-foreground", children: t("dashboard:experiences.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: t("dashboard:experiences.subtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-primary/15 text-primary border border-primary/25 px-3 py-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 mr-1.5" }),
          t("dashboard:experiences.activeCount", { count: activeCount })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "gap-2 bg-primary text-primary-foreground hover:bg-primary/90",
            onClick: handleAdd,
            "data-ocid": "add-experience-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              t("dashboard:experiences.newExperience")
            ]
          }
        )
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4", children: SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, { showImage: true, lines: 2 }, k)) }) : visibleExperiences.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "empty-experiences",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-12 w-12 text-muted-foreground/30 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-lg", children: t("dashboard:experiences.empty") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 max-w-xs", children: t("dashboard:experiences.emptyHint") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "mt-5 gap-2 bg-primary text-primary-foreground hover:bg-primary/90",
              onClick: handleAdd,
              "data-ocid": "empty-add-experience-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                t("dashboard:experiences.newExperience")
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4", children: visibleExperiences.map((exp) => {
      const restrictionBadges = getRestrictionBadges(exp);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "article",
        {
          className: "rounded-xl border border-primary/30 shadow-soft overflow-hidden bg-card transition-all hover:shadow-elevated",
          "data-ocid": "experience-card",
          "aria-label": `${t("dashboard:experiences.title")}: ${exp.name}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 flex items-center justify-center relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-8 w-8 text-accent/30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2 flex items-center gap-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border bg-primary/15 text-primary border-primary/25", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }),
                t("dashboard:experiences.active")
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate", children: exp.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 mt-0.5", children: exp.description })
                ] }),
                exp.tag && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `shrink-0 text-xs border ${TAG_STYLES[exp.tag] ?? "bg-muted text-muted-foreground"}`,
                    children: tagLabel(exp.tag)
                  }
                )
              ] }),
              restrictionBadges.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
                exp.serviceIds && exp.serviceIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-2.5 w-2.5" }),
                  exp.serviceIds.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")
                ] }),
                exp.dayOfWeek && exp.dayOfWeek.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary/10 text-secondary-foreground border border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-2.5 w-2.5" }),
                  [...exp.dayOfWeek].sort(
                    (a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b)
                  ).map((d) => DAY_LABELS[d] ?? d).join(", ")
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 border border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground", children: t("dashboard:experiences.requiredToggle", {
                    defaultValue: "Verplicht voor gasten"
                  }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: exp.required ? t("dashboard:experiences.requiredHint", {
                    defaultValue: "Gast moet een ervaring kiezen"
                  }) : t("dashboard:experiences.optionalHint", {
                    defaultValue: "Gast kan ervaring overslaan"
                  }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    checked: exp.required,
                    onCheckedChange: (v) => handleToggleRequired(exp, v),
                    disabled: updateExperience.isPending,
                    "aria-label": t("dashboard:experiences.requiredToggle", {
                      defaultValue: "Verplicht voor gasten"
                    }),
                    "data-ocid": `exp-required-toggle-${exp.id}`
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-foreground tabular-nums", children: formatCurrency(exp.price) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: t("dashboard:experiences.pricePerPerson") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "p-2 rounded-lg hover:bg-muted/40 transition-colors text-muted-foreground hover:text-primary",
                      onClick: () => handleEdit(exp),
                      "aria-label": t("dashboard:experiences.editLabel", {
                        name: exp.name
                      }),
                      "data-ocid": "edit-experience-btn",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-4 w-4" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive disabled:opacity-40",
                      onClick: () => handleDeleteRequest(exp),
                      disabled: deleteExperience.isPending,
                      "aria-label": t("dashboard:experiences.deleteLabel", {
                        name: exp.name
                      }),
                      "data-ocid": "delete-experience-btn",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("dashboard:experiences.unlimited") })
              ] })
            ] })
          ]
        },
        exp.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExperienceForm,
      {
        open: formOpen,
        onClose: () => setFormOpen(false),
        onSave: handleSave,
        initial: editTarget
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!deleteTarget,
        onOpenChange: (open) => {
          if (!open) setDeleteTarget(null);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "delete-experience-dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: t("dashboard:experiences.deleteTitle", {
              defaultValue: "Ervaring verwijderen"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: t("dashboard:experiences.deleteConfirm", {
              name: (deleteTarget == null ? void 0 : deleteTarget.name) ?? "",
              defaultValue: `Weet je zeker dat je "${deleteTarget == null ? void 0 : deleteTarget.name}" wilt verwijderen?`
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogCancel,
              {
                "data-ocid": "delete-experience-cancel-btn",
                onClick: () => setDeleteTarget(null),
                children: t("dashboard:common.cancel", { defaultValue: "Annuleren" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground focus-visible:ring-destructive",
                onClick: handleDeleteConfirm,
                disabled: deleteExperience.isPending,
                "data-ocid": "delete-experience-confirm-btn",
                children: deleteExperience.isPending ? t("dashboard:common.deleting", {
                  defaultValue: "Verwijderen…"
                }) : t("dashboard:common.delete", { defaultValue: "Verwijderen" })
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  SettingsExperiencesPage as default
};
