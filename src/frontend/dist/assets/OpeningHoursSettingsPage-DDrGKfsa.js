import { k as createLucideIcon, u as useTranslation, Y as useOpeningHoursConfig, Z as useUpdateServiceHours, _ as useUpdateClosingDays, r as reactExports, j as jsxRuntimeExports, d as Clock, B as Button, b as ue } from "./index-DYFUyfbw.js";
import { I as Input } from "./input-Be5T95oX.js";
import { L as Label } from "./label-whBlDZv1.js";
import { P as Plus } from "./plus-BLj3PxS_.js";
import { T as Trash2 } from "./trash-2-BocM61zf.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "m14 14-4 4", key: "rymu2i" }],
  ["path", { d: "m10 14 4 4", key: "3sz06r" }]
];
const CalendarX = createLucideIcon("calendar-x", __iconNode);
const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
function DayCheckbox({
  day,
  checked,
  onChange,
  labelKey
}) {
  const { t } = useTranslation("dashboard");
  const id = `day-check-${labelKey}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        id,
        checked,
        onChange: (e) => onChange(day, e.target.checked),
        className: "sr-only",
        "data-ocid": id
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "label",
      {
        htmlFor: id,
        className: `h-8 w-8 rounded-lg border-2 flex items-center justify-center text-xs font-semibold transition-all cursor-pointer ${checked ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:border-primary/40"}`,
        children: t(`settings.days.${labelKey}`).charAt(0)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-muted-foreground", children: t(`settings.days.${labelKey}`) })
  ] });
}
function ServiceRow({
  service,
  onChange,
  onDelete
}) {
  const { t } = useTranslation("dashboard");
  const toggleDay = (day, isChecked) => {
    const days = isChecked ? [...service.enabledDays, day].sort() : service.enabledDays.filter((d) => d !== day);
    onChange({ ...service, enabledDays: days });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-background p-4 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[160px] space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: t("settings.openingHours.serviceName") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: service.name,
            onChange: (e) => onChange({ ...service, name: e.target.value }),
            placeholder: "Lunch",
            className: "bg-card border-border h-8 text-sm",
            "data-ocid": `service-name-${service.id}`
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: t("settings.openingHours.openTime") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "time",
            value: service.openTime,
            onChange: (e) => onChange({ ...service, openTime: e.target.value }),
            className: "h-8 rounded-md border border-border bg-card px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
            "data-ocid": `service-open-${service.id}`
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: t("settings.openingHours.closeTime") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "time",
            value: service.closeTime,
            onChange: (e) => onChange({ ...service, closeTime: e.target.value }),
            className: "h-8 rounded-md border border-border bg-card px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
            "data-ocid": `service-close-${service.id}`
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 w-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: t("settings.openingHours.maxCapacity") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            min: 1,
            max: 999,
            value: service.maxCapacity,
            onChange: (e) => onChange({ ...service, maxCapacity: Number(e.target.value) }),
            className: "bg-card border-border h-8 text-sm",
            "data-ocid": `service-capacity-${service.id}`
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onDelete,
          className: "self-end h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
          "aria-label": t("settings.openingHours.deleteService"),
          "data-ocid": `service-delete-${service.id}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.openingHours.enabledDays") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: DAY_KEYS.map((key, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        DayCheckbox,
        {
          day: i,
          checked: service.enabledDays.includes(i),
          onChange: toggleDay,
          labelKey: key
        },
        key
      )) })
    ] })
  ] });
}
function OpeningHoursSettingsPage() {
  const { t } = useTranslation("dashboard");
  const { data, isLoading } = useOpeningHoursConfig();
  const updateServiceHours = useUpdateServiceHours();
  const updateClosingDays = useUpdateClosingDays();
  const [config, setConfig] = reactExports.useState({
    services: [],
    fixedClosingDays: [],
    exceptionalClosingDays: []
  });
  const [newServiceName, setNewServiceName] = reactExports.useState("");
  const [newExDate, setNewExDate] = reactExports.useState("");
  const [newExReason, setNewExReason] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (data) setConfig(data);
  }, [data]);
  const updateService = (id, updated) => {
    setConfig((c) => ({
      ...c,
      services: c.services.map((s) => s.id === id ? updated : s)
    }));
  };
  const addService = () => {
    const name = newServiceName.trim();
    if (!name) return;
    const id = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    setConfig((c) => ({
      ...c,
      services: [
        ...c.services,
        {
          id,
          name,
          openTime: "12:00",
          closeTime: "14:00",
          maxCapacity: 40,
          enabledDays: [0, 1, 2, 3, 4]
        }
      ]
    }));
    setNewServiceName("");
  };
  const deleteService = (id) => {
    setConfig((c) => ({
      ...c,
      services: c.services.filter((s) => s.id !== id)
    }));
  };
  const toggleFixedDay = (day, isChecked) => {
    setConfig((c) => ({
      ...c,
      fixedClosingDays: isChecked ? [...c.fixedClosingDays, day].sort() : c.fixedClosingDays.filter((d) => d !== day)
    }));
  };
  const addExceptionalDay = () => {
    if (!newExDate) return;
    const entry = {
      id: Date.now().toString(),
      date: newExDate,
      reason: newExReason.trim()
    };
    setConfig((c) => ({
      ...c,
      exceptionalClosingDays: [...c.exceptionalClosingDays, entry]
    }));
    setNewExDate("");
    setNewExReason("");
  };
  const deleteExceptionalDay = (id) => {
    setConfig((c) => ({
      ...c,
      exceptionalClosingDays: c.exceptionalClosingDays.filter(
        (d) => d.id !== id
      )
    }));
  };
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const saveAll = async () => {
    setIsSaving(true);
    try {
      await updateServiceHours.mutateAsync(config.services);
      await updateClosingDays.mutateAsync({
        fixedClosingDays: config.fixedClosingDays,
        exceptionalClosingDays: config.exceptionalClosingDays
      });
      ue.success(t("settings.saved"));
    } catch {
      ue.error(t("settings.saveError"));
    } finally {
      setIsSaving(false);
    }
  };
  const handleServiceKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addService();
    }
  };
  const handleExDayKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addExceptionalDay();
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[40vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl space-y-8", "data-ocid": "opening-hours-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-foreground", children: t("settings.nav.openingHours") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("settings.openingHours.subtitle") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.openingHours.services") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          config.services.length,
          " ",
          t("settings.openingHours.servicesCount")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-4", children: [
        config.services.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ServiceRow,
          {
            service: s,
            onChange: (updated) => updateService(s.id, updated),
            onDelete: () => deleteService(s.id)
          },
          s.id
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: newServiceName,
              onChange: (e) => setNewServiceName(e.target.value),
              placeholder: t("settings.openingHours.newServicePlaceholder"),
              className: "bg-background border-border",
              onKeyDown: handleServiceKeyDown,
              "data-ocid": "new-service-name"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: addService,
              disabled: !newServiceName.trim(),
              className: "shrink-0 gap-2 border-border",
              "data-ocid": "add-service-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                t("settings.openingHours.addService")
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
          "data-ocid": "save-services-btn",
          children: [
            isSaving && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" }),
            t(isSaving ? "settings.saving" : "settings.save")
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.openingHours.fixedClosingDays") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("settings.openingHours.fixedClosingDaysHint") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 flex-wrap", children: DAY_KEYS.map((key, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        DayCheckbox,
        {
          day: i,
          checked: config.fixedClosingDays.includes(i),
          onChange: toggleFixedDay,
          labelKey: key
        },
        key
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-t border-border bg-muted/20 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: saveAll,
          disabled: isSaving,
          className: "gap-2",
          "data-ocid": "save-fixed-days-btn",
          children: [
            isSaving && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" }),
            t(isSaving ? "settings.saving" : "settings.save")
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.openingHours.exceptionalDays") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("settings.openingHours.exceptionalDaysHint") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-4", children: [
        config.exceptionalClosingDays.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-4 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarX, { className: "h-4 w-4 shrink-0" }),
          t("settings.openingHours.noExceptionalDays")
        ] }),
        config.exceptionalClosingDays.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background",
            "data-ocid": `exceptional-day-${d.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: d.date }),
                d.reason && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: d.reason })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => deleteExceptionalDay(d.id),
                  className: "p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                  "aria-label": t("settings.openingHours.deleteExceptionalDay"),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                }
              )
            ]
          },
          d.id
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: t("settings.openingHours.exceptionalDate") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "date",
                value: newExDate,
                onChange: (e) => setNewExDate(e.target.value),
                className: "h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                "data-ocid": "exceptional-date-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[160px] space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: t("settings.openingHours.exceptionalReason") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: newExReason,
                onChange: (e) => setNewExReason(e.target.value),
                onKeyDown: handleExDayKeyDown,
                placeholder: t("settings.openingHours.reasonPlaceholder"),
                className: "bg-background border-border",
                "data-ocid": "exceptional-reason-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: addExceptionalDay,
              disabled: !newExDate,
              className: "shrink-0 gap-2 border-border",
              "data-ocid": "add-exceptional-day-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                t("settings.openingHours.addExceptionalDay")
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
          "data-ocid": "save-exceptional-days-btn",
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
  OpeningHoursSettingsPage as default
};
