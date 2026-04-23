import { u as useTranslation, aN as useGeneralInfo, aT as useUpdateGeneralInfo, r as reactExports, j as jsxRuntimeExports, aJ as LoaderCircle, w as Label, I as Input, B as Button, t as ue } from "./index-BNayfcmF.js";
import { B as Building2 } from "./building-2-1NoQxdbo.js";
import { S as Save } from "./save-DmaA-fW0.js";
const CURRENCIES = ["EUR", "USD", "GBP", "CHF"];
const TIMEZONES = [
  "Europe/Brussels",
  "Europe/Amsterdam",
  "Europe/Paris",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Madrid",
  "Europe/Rome",
  "Europe/Zurich",
  "Europe/Vienna",
  "Europe/Warsaw"
];
function GeneralSettingsPage() {
  const { t } = useTranslation("dashboard");
  const { data, isLoading } = useGeneralInfo();
  const updateMutation = useUpdateGeneralInfo();
  const [form, setForm] = reactExports.useState({
    restaurantName: "",
    logoUrl: "",
    currency: "EUR",
    timezone: "Europe/Brussels",
    contactPhone: "",
    contactEmail: ""
  });
  const [saved, setSaved] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (data) {
      setForm(data);
      setSaved(data);
    }
  }, [data]);
  const isDirty = saved === null || Object.keys(form).some(
    (k) => form[k] !== saved[k]
  );
  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(form);
      setSaved(form);
      ue.success(t("settings.saved"));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      ue.error(`${t("settings.saveError")}: ${message}`);
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[40vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl space-y-6", "data-ocid": "general-settings-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-foreground", children: t("settings.nav.general") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("settings.general.subtitle") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: handleSubmit,
        className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.general.section") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-6 space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "restaurantName",
                  className: "text-sm font-medium text-foreground",
                  children: [
                    t("settings.general.restaurantName"),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "restaurantName",
                  value: form.restaurantName,
                  onChange: (e) => set("restaurantName", e.target.value),
                  placeholder: "Restaurant ZenReserve",
                  className: "bg-background border-border",
                  "data-ocid": "general-restaurant-name",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "logoUrl",
                  className: "text-sm font-medium text-foreground",
                  children: t("settings.general.logoUrl")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "logoUrl",
                  type: "url",
                  value: form.logoUrl,
                  onChange: (e) => set("logoUrl", e.target.value),
                  placeholder: "https://example.com/logo.png",
                  className: "bg-background border-border",
                  "data-ocid": "general-logo-url"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.general.logoUrlHint") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "currency",
                    className: "text-sm font-medium text-foreground",
                    children: t("settings.general.currency")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    id: "currency",
                    value: form.currency,
                    onChange: (e) => set("currency", e.target.value),
                    className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                    "data-ocid": "general-currency",
                    children: CURRENCIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "timezone",
                    className: "text-sm font-medium text-foreground",
                    children: t("settings.general.timezone")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    id: "timezone",
                    value: form.timezone,
                    onChange: (e) => set("timezone", e.target.value),
                    className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                    "data-ocid": "general-timezone",
                    children: TIMEZONES.map((tz) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: tz, children: tz }, tz))
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "contactPhone",
                  className: "text-sm font-medium text-foreground",
                  children: [
                    t("settings.general.contactPhone"),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "contactPhone",
                  type: "tel",
                  value: form.contactPhone,
                  onChange: (e) => set("contactPhone", e.target.value),
                  placeholder: "+32 2 000 00 00",
                  className: "bg-background border-border",
                  "data-ocid": "general-contact-phone",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "contactEmail",
                  className: "text-sm font-medium text-foreground",
                  children: [
                    t("settings.general.contactEmail"),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "contactEmail",
                  type: "email",
                  value: form.contactEmail,
                  onChange: (e) => set("contactEmail", e.target.value),
                  placeholder: "info@restaurant.be",
                  className: "bg-background border-border",
                  "data-ocid": "general-contact-email",
                  required: true
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between gap-4", children: [
            isDirty && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.unsavedChanges") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                disabled: updateMutation.isPending || !isDirty,
                className: "gap-2",
                "data-ocid": "general-save-btn",
                children: [
                  updateMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
                  updateMutation.isPending ? t("settings.saving") : t("settings.save")
                ]
              }
            ) })
          ] })
        ]
      }
    )
  ] });
}
export {
  GeneralSettingsPage as default
};
