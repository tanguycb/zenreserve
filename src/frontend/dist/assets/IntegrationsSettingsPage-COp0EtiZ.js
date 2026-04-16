import { l as createLucideIcon, u as useTranslation, i as useQueryClient, r as reactExports, j as jsxRuntimeExports, B as Button, d as ue } from "./index-OyrOOjf2.js";
import { I as Input } from "./input-DotlNcOU.js";
import { L as Label } from "./label-DJEmRWLx.js";
import { S as Switch } from "./switch-DxzC5mQI.js";
import { T as TriangleAlert } from "./triangle-alert-CrkZ39_W.js";
import { C as CreditCard } from "./credit-card-C6Qonvnd.js";
import { M as Monitor } from "./monitor-BY0f5XsM.js";
import { C as Calendar } from "./calendar-BrHNFFQa.js";
import { R as RefreshCw } from "./refresh-cw-BQIrQ6xR.js";
import { S as Save } from "./save-DIItt2sh.js";
import "./index-DiPf0GnM.js";
import "./index-DRyULZ_M.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m18 16 4-4-4-4", key: "1inbqp" }],
  ["path", { d: "m6 8-4 4 4 4", key: "15zrgr" }],
  ["path", { d: "m14.5 4-5 16", key: "e7oirm" }]
];
const CodeXml = createLucideIcon("code-xml", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode);
const STORAGE_KEY = "zenreserve_integrations";
function loadConfig() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
  }
  return {
    stripeEnabled: false,
    stripePublicKey: "",
    mollieEnabled: false,
    posSystem: "none",
    customPosName: "",
    calendarSyncEnabled: false,
    apiKey: generateUUID()
  };
}
function saveConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
  }
}
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
function SectionCard({
  icon,
  title,
  subtitle,
  children,
  onSave,
  saving
}) {
  const { t } = useTranslation("dashboard");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: title }),
        subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: subtitle })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-6 space-y-5", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-t border-border bg-muted/20 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        onClick: onSave,
        disabled: saving,
        className: "gap-2",
        children: [
          saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
          t("settings.save")
        ]
      }
    ) })
  ] });
}
function ToggleRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  "data-ocid": ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Label,
        {
          htmlFor: id,
          className: "text-sm font-medium text-foreground cursor-pointer",
          children: label
        }
      ),
      description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: description })
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
const POS_OPTIONS = [
  { value: "none", label: "None" },
  { value: "lightspeed", label: "Lightspeed" },
  { value: "square", label: "Square" },
  { value: "toast", label: "Toast" },
  { value: "custom", label: "Custom" }
];
function IntegrationsSettingsPage() {
  var _a;
  const { t } = useTranslation("dashboard");
  const queryClient = useQueryClient();
  const [config, setConfig] = reactExports.useState(loadConfig);
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setConfig(loadConfig());
  }, []);
  const set = (key, value) => {
    setConfig((c) => ({ ...c, [key]: value }));
  };
  const handleSave = async () => {
    setSaving(true);
    saveConfig(config);
    queryClient.invalidateQueries({ queryKey: ["integrationsConfig"] });
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    ue.success(t("settings.saved"));
  };
  const handleRegenerateApiKey = () => {
    const newKey = generateUUID();
    set("apiKey", newKey);
    const updated = { ...config, apiKey: newKey };
    saveConfig(updated);
    ue.success(t("settings.integrations.apiKeyRegenerated"));
  };
  const bothPaymentsActive = config.stripeEnabled && config.mollieEnabled;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl space-y-8", "data-ocid": "integrations-settings-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { className: "h-5 w-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-foreground", children: t("settings.nav.integrations") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("settings.integrations.subtitle") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      SectionCard,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4 text-primary" }),
        title: t("settings.integrations.payments.title"),
        subtitle: t("settings.integrations.payments.subtitle"),
        onSave: handleSave,
        saving,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ToggleRow,
            {
              id: "stripe-enabled",
              label: "Stripe",
              description: t("settings.integrations.payments.stripeDesc"),
              checked: config.stripeEnabled,
              onCheckedChange: (v) => set("stripeEnabled", v),
              "data-ocid": "stripe-enabled-toggle"
            }
          ),
          config.stripeEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pl-0 ml-0 animate-in fade-in slide-in-from-top-1 duration-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "stripe-key",
                className: "text-sm font-medium text-foreground",
                children: t("settings.integrations.payments.stripeKeyLabel")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "stripe-key",
                value: config.stripePublicKey,
                onChange: (e) => set("stripePublicKey", e.target.value),
                placeholder: "pk_live_...",
                className: "bg-background border-border font-mono text-sm",
                "data-ocid": "stripe-public-key-input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.integrations.payments.stripeKeyHint") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/50 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ToggleRow,
            {
              id: "mollie-enabled",
              label: "Mollie",
              description: t("settings.integrations.payments.mollieDesc"),
              checked: config.mollieEnabled,
              onCheckedChange: (v) => set("mollieEnabled", v),
              "data-ocid": "mollie-enabled-toggle"
            }
          ) }),
          bothPaymentsActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3",
              role: "alert",
              "data-ocid": "both-payments-warning",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-amber-400 mt-0.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-300", children: t("settings.integrations.payments.bothEnabledWarning") })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      SectionCard,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { className: "h-4 w-4 text-primary" }),
        title: t("settings.integrations.pos.title"),
        subtitle: t("settings.integrations.pos.subtitle"),
        onSave: handleSave,
        saving,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "pos-system",
                className: "text-sm font-medium text-foreground",
                children: t("settings.integrations.pos.label")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                id: "pos-system",
                value: config.posSystem,
                onChange: (e) => set("posSystem", e.target.value),
                className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                "data-ocid": "pos-system-select",
                children: POS_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.value, children: opt.value === "none" ? t("settings.integrations.pos.none") : opt.label }, opt.value))
              }
            )
          ] }),
          config.posSystem === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 animate-in fade-in slide-in-from-top-1 duration-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "custom-pos-name",
                className: "text-sm font-medium text-foreground",
                children: t("settings.integrations.pos.customLabel")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "custom-pos-name",
                value: config.customPosName,
                onChange: (e) => set("customPosName", e.target.value),
                placeholder: t("settings.integrations.pos.customPlaceholder"),
                className: "bg-background border-border",
                "data-ocid": "custom-pos-name-input"
              }
            )
          ] }),
          config.posSystem !== "none" && config.posSystem !== "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4 text-primary mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.integrations.pos.integrationNote", {
              pos: (_a = POS_OPTIONS.find((o) => o.value === config.posSystem)) == null ? void 0 : _a.label
            }) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      SectionCard,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-primary" }),
        title: t("settings.integrations.calendar.title"),
        subtitle: t("settings.integrations.calendar.subtitle"),
        onSave: handleSave,
        saving,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ToggleRow,
            {
              id: "calendar-sync",
              label: t("settings.integrations.calendar.enableLabel"),
              description: t("settings.integrations.calendar.enableDesc"),
              checked: config.calendarSyncEnabled,
              onCheckedChange: (v) => set("calendarSyncEnabled", v),
              "data-ocid": "calendar-sync-toggle"
            }
          ),
          config.calendarSyncEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 animate-in fade-in slide-in-from-top-1 duration-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground rounded-xl border border-border/50 bg-muted/30 px-4 py-3", children: t("settings.integrations.calendar.comingSoonNote") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-muted/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Google Calendar" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.integrations.calendar.notConnected") })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  disabled: true,
                  className: "border-border text-muted-foreground",
                  "data-ocid": "google-calendar-connect-btn",
                  children: t("settings.integrations.calendar.connect")
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-muted/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Microsoft Outlook" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.integrations.calendar.notConnected") })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  disabled: true,
                  className: "border-border text-muted-foreground",
                  "data-ocid": "outlook-connect-btn",
                  children: t("settings.integrations.calendar.connect")
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      SectionCard,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { className: "h-4 w-4 text-primary" }),
        title: t("settings.integrations.api.title"),
        subtitle: t("settings.integrations.api.subtitle"),
        onSave: handleSave,
        saving,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: t("settings.integrations.api.keyLabel") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: config.apiKey,
                  readOnly: true,
                  className: "bg-background border-border font-mono text-xs text-muted-foreground flex-1",
                  "data-ocid": "api-key-display",
                  "aria-label": t("settings.integrations.api.keyLabel")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: handleRegenerateApiKey,
                  className: "shrink-0 gap-2 border-border",
                  "data-ocid": "regenerate-api-key-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
                    t("settings.integrations.api.regenerate")
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.integrations.api.keyHint") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { className: "h-4 w-4 text-primary mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.integrations.api.usageNote") })
          ] })
        ]
      }
    )
  ] });
}
export {
  IntegrationsSettingsPage as default
};
