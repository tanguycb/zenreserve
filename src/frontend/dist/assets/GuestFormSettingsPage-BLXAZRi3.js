import { l as createLucideIcon, u as useTranslation, r as reactExports, j as jsxRuntimeExports, B as Button, D as LoaderCircle, d as ue } from "./index-OyrOOjf2.js";
import { I as Input } from "./input-DotlNcOU.js";
import { L as Label } from "./label-DJEmRWLx.js";
import { S as Switch } from "./switch-DxzC5mQI.js";
import { P as Plus } from "./plus-BpTLdwE7.js";
import { S as Save } from "./save-DIItt2sh.js";
import { G as GripVertical } from "./grip-vertical-CVbVjk0n.js";
import { C as ChevronUp } from "./chevron-up-BoxKVSo1.js";
import { C as ChevronDown } from "./chevron-down-DPHz4usu.js";
import { T as Trash2 } from "./trash-2-BFb3cZ_S.js";
import "./index-DiPf0GnM.js";
import "./index-DRyULZ_M.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
];
const ClipboardList = createLucideIcon("clipboard-list", __iconNode);
const SPECIAL_REQUESTS = [
  "birthday",
  "anniversary",
  "highchair",
  "windowTable",
  "accessibleSeating",
  "quietTable"
];
const STORAGE_KEY = "zenreserve_guest_form";
function loadConfig() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
  }
  return {
    requirePhone: true,
    requireAllergies: false,
    requireDietPreferences: false,
    enabledSpecialRequests: ["birthday", "anniversary", "highchair"],
    customQuestions: []
  };
}
function saveConfig(cfg) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {
  }
}
function genId() {
  return `q_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
function SectionCard({ title, subtitle, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: subtitle })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-5", children })
  ] });
}
function ToggleRow({
  id,
  label,
  hint,
  checked,
  onCheckedChange,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 py-3 border-b border-border last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Label,
        {
          htmlFor: id,
          className: "text-sm font-medium text-foreground cursor-pointer",
          children: label
        }
      ),
      hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: hint })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Switch,
      {
        id,
        checked,
        onCheckedChange,
        "data-ocid": ocid
      }
    )
  ] });
}
function QuestionEditor({
  question,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown
}) {
  const { t } = useTranslation("dashboard");
  const [optionsInput, setOptionsInput] = reactExports.useState(question.options.join(", "));
  const set = (key, value) => {
    onChange({ ...question, [key]: value });
  };
  const handleOptionsBlur = () => {
    const opts = optionsInput.split(",").map((s) => s.trim()).filter(Boolean);
    set("options", opts);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-border bg-background p-4 space-y-3",
      "data-ocid": `custom-question-${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-4 w-4 text-muted-foreground/40 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5", children: t("settings.guestForm.questionLabel", { n: index + 1 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onMoveUp,
                disabled: index === 0,
                "aria-label": t("settings.guestForm.moveUp"),
                className: "p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-30 transition-colors",
                "data-ocid": `question-move-up-${index}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onMoveDown,
                disabled: index === total - 1,
                "aria-label": t("settings.guestForm.moveDown"),
                className: "p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-30 transition-colors",
                "data-ocid": `question-move-down-${index}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onDelete,
                "aria-label": t("settings.guestForm.deleteQuestion"),
                className: "p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                "data-ocid": `question-delete-${index}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: `q-label-${question.id}`,
              className: "text-xs font-medium text-muted-foreground",
              children: t("settings.guestForm.questionText")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: `q-label-${question.id}`,
              value: question.labelText,
              onChange: (e) => set("labelText", e.target.value),
              placeholder: t("settings.guestForm.questionTextPlaceholder"),
              className: "bg-card border-border text-sm",
              "data-ocid": `question-label-${index}`
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: `q-type-${question.id}`,
                className: "text-xs font-medium text-muted-foreground",
                children: t("settings.guestForm.questionType")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                id: `q-type-${question.id}`,
                value: question.type,
                onChange: (e) => set("type", e.target.value),
                className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                "data-ocid": `question-type-${index}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "text", children: t("settings.guestForm.typeText") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "dropdown", children: t("settings.guestForm.typeDropdown") })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end pb-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                id: `q-required-${question.id}`,
                checked: question.required,
                onCheckedChange: (v) => set("required", v),
                "data-ocid": `question-required-${index}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: `q-required-${question.id}`,
                className: "text-xs font-medium text-foreground cursor-pointer",
                children: t("settings.guestForm.required")
              }
            )
          ] }) })
        ] }),
        question.type === "dropdown" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: `q-opts-${question.id}`,
              className: "text-xs font-medium text-muted-foreground",
              children: t("settings.guestForm.dropdownOptions")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: `q-opts-${question.id}`,
              value: optionsInput,
              onChange: (e) => setOptionsInput(e.target.value),
              onBlur: handleOptionsBlur,
              placeholder: t("settings.guestForm.dropdownOptionsPlaceholder"),
              className: "bg-card border-border text-sm",
              "data-ocid": `question-options-${index}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.guestForm.dropdownOptionsHint") })
        ] })
      ]
    }
  );
}
function GuestFormSettingsPage() {
  const { t } = useTranslation("dashboard");
  const [config, setConfig] = reactExports.useState(loadConfig);
  const [isDirty, setIsDirty] = reactExports.useState(false);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setConfig(loadConfig());
    setIsDirty(false);
  }, []);
  const update = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };
  const toggleSpecialRequest = (key) => {
    const current = config.enabledSpecialRequests;
    const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
    update("enabledSpecialRequests", next);
  };
  const addQuestion = () => {
    const newQ = {
      id: genId(),
      labelText: "",
      type: "text",
      options: [],
      required: false
    };
    update("customQuestions", [...config.customQuestions, newQ]);
  };
  const updateQuestion = (index, q) => {
    const next = [...config.customQuestions];
    next[index] = q;
    update("customQuestions", next);
  };
  const deleteQuestion = (index) => {
    update(
      "customQuestions",
      config.customQuestions.filter((_, i) => i !== index)
    );
  };
  const moveQuestion = (index, direction) => {
    const next = [...config.customQuestions];
    const target = direction === "up" ? index - 1 : index + 1;
    [next[index], next[target]] = [next[target], next[index]];
    update("customQuestions", next);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      saveConfig(config);
      setIsDirty(false);
      ue.success(t("settings.saved"));
    } catch {
      ue.error(t("settings.saveError"));
    } finally {
      setIsSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl space-y-6", "data-ocid": "guest-form-settings-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-5 w-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-foreground", children: t("settings.nav.guestForm") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("settings.guestForm.subtitle") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        SectionCard,
        {
          title: t("settings.guestForm.requiredFieldsTitle"),
          subtitle: t("settings.guestForm.requiredFieldsSubtitle"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ToggleRow,
              {
                id: "req-phone",
                label: t("settings.guestForm.requirePhone"),
                hint: t("settings.guestForm.requirePhoneHint"),
                checked: config.requirePhone,
                onCheckedChange: (v) => update("requirePhone", v),
                ocid: "guest-form-require-phone"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ToggleRow,
              {
                id: "req-allergies",
                label: t("settings.guestForm.requireAllergies"),
                hint: t("settings.guestForm.requireAllergiesHint"),
                checked: config.requireAllergies,
                onCheckedChange: (v) => update("requireAllergies", v),
                ocid: "guest-form-require-allergies"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ToggleRow,
              {
                id: "req-diet",
                label: t("settings.guestForm.requireDietPreferences"),
                hint: t("settings.guestForm.requireDietHint"),
                checked: config.requireDietPreferences,
                onCheckedChange: (v) => update("requireDietPreferences", v),
                ocid: "guest-form-require-diet"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SectionCard,
        {
          title: t("settings.guestForm.specialRequestsTitle"),
          subtitle: t("settings.guestForm.specialRequestsSubtitle"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-y-1", children: SPECIAL_REQUESTS.map((key) => {
            const checked = config.enabledSpecialRequests.includes(key);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                className: "flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/40 cursor-pointer transition-colors",
                "data-ocid": `special-request-${key}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked,
                      onChange: () => toggleSpecialRequest(key),
                      className: "h-4 w-4 rounded border-border bg-background accent-primary"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: t(`settings.guestForm.specialRequest.${key}`) })
                ]
              },
              key
            );
          }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SectionCard,
        {
          title: t("settings.guestForm.customQuestionsTitle"),
          subtitle: t("settings.guestForm.customQuestionsSubtitle"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            config.customQuestions.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-center py-8 rounded-xl border border-dashed border-border",
                "data-ocid": "custom-questions-empty",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-8 w-8 text-muted-foreground/40 mx-auto mb-2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("settings.guestForm.noCustomQuestions") })
                ]
              }
            ),
            config.customQuestions.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              QuestionEditor,
              {
                question: q,
                index: i,
                total: config.customQuestions.length,
                onChange: (updated) => updateQuestion(i, updated),
                onDelete: () => deleteQuestion(i),
                onMoveUp: () => moveQuestion(i, "up"),
                onMoveDown: () => moveQuestion(i, "down")
              },
              q.id
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "w-full gap-2 border-dashed",
                onClick: addQuestion,
                "data-ocid": "add-custom-question-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                  t("settings.guestForm.addQuestion")
                ]
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card px-6 py-4 flex items-center justify-between gap-4", children: [
        isDirty && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.unsavedChanges") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "submit",
            disabled: isSaving || !isDirty,
            className: "gap-2",
            "data-ocid": "guest-form-save-btn",
            children: [
              isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
              isSaving ? t("settings.saving") : t("settings.save")
            ]
          }
        ) })
      ] })
    ] })
  ] });
}
export {
  GuestFormSettingsPage as default
};
