import { l as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, u as useTranslation, k as Badge, f as Star, q as SkeletonCard, n as formatCurrency, U as Users, d as ue } from "./index-OyrOOjf2.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-N-OH02Kl.js";
import { I as Input } from "./input-DotlNcOU.js";
import { L as Label } from "./label-DJEmRWLx.js";
import { S as Switch } from "./switch-DxzC5mQI.js";
import { T as Textarea } from "./textarea-D-9tW-LO.js";
import { b as useExperiences } from "./useDashboard-c2qMpjWH.js";
import { P as Plus } from "./plus-BpTLdwE7.js";
import { P as Pen } from "./pen-Dhg7xp_A.js";
import { T as Trash2 } from "./trash-2-BFb3cZ_S.js";
import "./index-Bx7gVB10.js";
import "./index-DiPf0GnM.js";
import "./index-D_6YQFNs.js";
import "./index-DRyULZ_M.js";
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
  available: true
};
function ExperienceForm({
  open,
  onClose,
  onSave,
  initial = null,
  isSaving = false
}) {
  const [form, setForm] = reactExports.useState(EMPTY);
  const [errors, setErrors] = reactExports.useState({});
  const titleId = "experience-form-title";
  reactExports.useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          name: initial.name,
          description: initial.description,
          price: (initial.price / 100).toFixed(2),
          available: initial.available
        });
      } else {
        setForm(EMPTY);
      }
      setErrors({});
    }
  }, [open, initial]);
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Naam is verplicht";
    if (!form.description.trim())
      errs.description = "Beschrijving is verplicht";
    const priceNum = Number.parseFloat(form.price);
    if (Number.isNaN(priceNum) || priceNum < 0)
      errs.price = "Voer een geldig bedrag in (bijv. 95.00)";
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
      available: form.available
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-md gap-0 p-0 overflow-hidden border-border bg-card",
      "aria-labelledby": titleId,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "px-6 pt-6 pb-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          DialogTitle,
          {
            id: titleId,
            className: "text-lg font-semibold text-foreground",
            children: initial ? "Ervaring bewerken" : "Ervaring toevoegen"
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
                  "Naam ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: "*" })
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
                className: `bg-muted/20 border-border ${errors.name ? "border-red-500/60" : ""}`,
                "aria-invalid": !!errors.name,
                "aria-describedby": errors.name ? "exp-name-err" : void 0,
                "data-ocid": "exp-name-input"
              }
            ),
            errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                id: "exp-name-err",
                className: "text-xs text-red-400",
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
                  "Beschrijving ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: "*" })
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
                className: `bg-muted/20 border-border resize-none min-h-[80px] ${errors.description ? "border-red-500/60" : ""}`,
                "aria-invalid": !!errors.description,
                "aria-describedby": errors.description ? "exp-desc-err" : void 0,
                "data-ocid": "exp-desc-input"
              }
            ),
            errors.description && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                id: "exp-desc-err",
                className: "text-xs text-red-400",
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
                children: "Prijs per persoon (EUR)"
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
                  className: `pl-7 bg-muted/20 border-border ${errors.price ? "border-red-500/60" : ""}`,
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
                className: "text-xs text-red-400",
                role: "alert",
                children: errors.price
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg bg-muted/20 px-4 py-3 border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "exp-active",
                  className: "text-sm font-medium text-foreground cursor-pointer",
                  children: "Actief"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Zichtbaar voor gasten in de widget" })
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
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: onClose,
              "data-ocid": "exp-form-cancel",
              children: "Annuleren"
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
              children: isSaving ? "Opslaan..." : initial ? "Bijwerken" : "Toevoegen"
            }
          )
        ] })
      ]
    }
  ) });
}
const SKELETON_KEYS = ["e1", "e2", "e3"];
const TAG_STYLES = {
  menu: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  event: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  special: "bg-amber-500/15 text-amber-400 border-amber-500/25"
};
function ExperiencesPage() {
  const { t } = useTranslation(["dashboard"]);
  const { data: experiences, isLoading } = useExperiences();
  const [formOpen, setFormOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
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
  const handleDelete = (exp) => {
    ue.success(t("dashboard:experiences.deleted", { name: exp.name }));
  };
  const handleSave = (data) => {
    if ("id" in data) {
      ue.success(t("dashboard:experiences.updated", { name: data.name }));
    } else {
      ue.success(t("dashboard:experiences.added", { name: data.name }));
    }
    setFormOpen(false);
  };
  const activeCount = (experiences ?? []).filter((e) => e.available).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold text-display text-foreground", children: t("dashboard:experiences.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: t("dashboard:experiences.subtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-3 py-1.5", children: [
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
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4", children: SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, { showImage: true, lines: 2 }, k)) }) : (experiences ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4", children: (experiences ?? []).map((exp) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "article",
      {
        className: `rounded-xl border shadow-soft overflow-hidden bg-card transition-all hover:shadow-elevated ${exp.available ? "border-emerald-500/30" : "border-border opacity-70"}`,
        "data-ocid": "experience-card",
        "aria-label": `${t("dashboard:experiences.title")}: ${exp.name}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-24 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 flex items-center justify-center relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-10 w-10 text-accent/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 right-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${exp.available ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" : "bg-muted text-muted-foreground border-border"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `h-1.5 w-1.5 rounded-full ${exp.available ? "bg-emerald-400" : "bg-muted-foreground"}`
                    }
                  ),
                  exp.available ? t("dashboard:experiences.active") : t("dashboard:experiences.inactive")
                ]
              }
            ) })
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
                    className: "p-2 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400",
                    onClick: () => handleDelete(exp),
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
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExperienceForm,
      {
        open: formOpen,
        onClose: () => setFormOpen(false),
        onSave: handleSave,
        initial: editTarget
      }
    )
  ] });
}
export {
  ExperiencesPage as default
};
