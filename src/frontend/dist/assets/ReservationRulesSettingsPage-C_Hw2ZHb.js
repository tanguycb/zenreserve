import { i as createLucideIcon, u as useTranslation, aI as useReservationRules, ba as useUpdateReservationRules, r as reactExports, j as jsxRuntimeExports, w as Label, g as Clock, U as Users, t as ue, B as Button, I as Input } from "./index-BNayfcmF.js";
import { S as Switch } from "./switch-Da4cPyDO.js";
import { C as CircleAlert } from "./circle-alert-dyy_CREt.js";
import { C as CreditCard } from "./credit-card-D26I8FF4.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 12h-5", key: "r7krc0" }],
  ["path", { d: "M15 8h-5", key: "1khuty" }],
  ["path", { d: "M19 17V5a2 2 0 0 0-2-2H4", key: "zz82l3" }],
  [
    "path",
    {
      d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",
      key: "1ph1d7"
    }
  ]
];
const ScrollText = createLucideIcon("scroll-text", __iconNode);
const DEFAULT_RULES = {
  advanceBookingDays: 90,
  cancellationHoursBeforeFree: 24,
  depositRequired: false,
  depositAmountEur: 25,
  depositRequiredAbovePartySize: 6,
  noShowFeeEur: 15,
  minPartySize: 1,
  maxPartySize: 20,
  maxStayMinutesLunch: 90,
  maxStayMinutesDinner: 120
};
function Section({
  icon,
  title,
  subtitle,
  children,
  onSave,
  saveLabel,
  savingLabel,
  isSaving,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden",
      "data-ocid": ocid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: title }),
            subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: subtitle })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-5", children }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-t border-border bg-muted/20 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            onClick: onSave,
            disabled: isSaving,
            className: "gap-2",
            "data-ocid": `${ocid}-save`,
            children: [
              isSaving && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" }),
              isSaving ? savingLabel : saveLabel
            ]
          }
        ) })
      ]
    }
  );
}
function NumberField({
  id,
  label,
  hint,
  value,
  min,
  max,
  onChange,
  suffix,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: id, className: "text-sm font-medium text-foreground", children: label }),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: hint }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id,
          type: "number",
          min,
          max,
          value,
          onChange: (e) => onChange(Number(e.target.value)),
          className: "bg-background border-border w-32",
          "data-ocid": ocid
        }
      ),
      suffix && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: suffix })
    ] })
  ] });
}
function ReservationRulesSettingsPage() {
  const { t } = useTranslation("dashboard");
  const { data, isLoading } = useReservationRules();
  const updateRules = useUpdateReservationRules();
  const [config, setConfig] = reactExports.useState(DEFAULT_RULES);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [noShowFeeEnabled, setNoShowFeeEnabled] = reactExports.useState(
    DEFAULT_RULES.noShowFeeEur > 0
  );
  const [noShowFeeAmount, setNoShowFeeAmount] = reactExports.useState(
    DEFAULT_RULES.noShowFeeEur || 15
  );
  reactExports.useEffect(() => {
    if (data) {
      setConfig(data);
      setNoShowFeeEnabled(data.noShowFeeEur > 0);
      setNoShowFeeAmount(data.noShowFeeEur > 0 ? data.noShowFeeEur : 15);
    }
  }, [data]);
  const set = (key, value) => setConfig((c) => ({ ...c, [key]: value }));
  const handleNoShowToggle = (enabled) => {
    setNoShowFeeEnabled(enabled);
    if (enabled && noShowFeeAmount === 0) {
      setNoShowFeeAmount(15);
    }
  };
  const handleNoShowAmountChange = (v) => {
    setNoShowFeeAmount(v);
  };
  const saveAll = async () => {
    setIsSaving(true);
    try {
      const effectiveConfig = {
        ...config,
        noShowFeeEur: noShowFeeEnabled ? noShowFeeAmount : 0
      };
      await updateRules.mutateAsync(effectiveConfig);
      setConfig(effectiveConfig);
      ue.success(t("settings.saved"));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[ReservationRulesSettings] save failed:", err);
      ue.error(`${t("settings.saveError")}: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[40vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" }) });
  }
  const rr = t("settings.reservationRules", { returnObjects: true });
  const sectionProps = {
    onSave: saveAll,
    saveLabel: t("settings.save"),
    savingLabel: t("settings.saving"),
    isSaving
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-3xl space-y-8",
      "data-ocid": "reservation-rules-settings-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollText, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-foreground", children: t("settings.nav.reservationRules") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: rr.subtitle })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Section,
          {
            ...sectionProps,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-primary" }),
            title: rr.advanceBookingTitle,
            subtitle: rr.advanceBookingSubtitle,
            ocid: "advance-booking-section",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: rr.advanceBookingDays }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xl font-bold text-primary tabular-nums", children: [
                    config.advanceBookingDays,
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-normal text-muted-foreground ml-1", children: rr.days })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "range",
                    min: 1,
                    max: 365,
                    step: 1,
                    value: config.advanceBookingDays,
                    onChange: (e) => set("advanceBookingDays", Number(e.target.value)),
                    className: "w-full h-2 accent-primary cursor-pointer",
                    "aria-label": rr.advanceBookingDays,
                    "data-ocid": "advance-booking-slider"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "1 ",
                    rr.day
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "30 ",
                    rr.days
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "90 ",
                    rr.days
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "365 ",
                    rr.days
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                NumberField,
                {
                  id: "cancellationHours",
                  label: rr.cancellationHours,
                  hint: rr.cancellationHoursHint,
                  value: config.cancellationHoursBeforeFree,
                  min: 0,
                  max: 168,
                  onChange: (v) => set("cancellationHoursBeforeFree", v),
                  suffix: rr.hours,
                  ocid: "cancellation-hours"
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Section,
          {
            ...sectionProps,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4 text-primary" }),
            title: rr.depositTitle,
            subtitle: rr.depositSubtitle,
            ocid: "deposit-section",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 py-2 px-4 rounded-xl border border-border bg-background", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: rr.depositRequired }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: rr.depositRequiredHint })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    checked: config.depositRequired,
                    onCheckedChange: (v) => set("depositRequired", v),
                    "data-ocid": "deposit-required-toggle"
                  }
                )
              ] }),
              config.depositRequired && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 pl-4 border-l-2 border-primary/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NumberField,
                  {
                    id: "depositAmount",
                    label: rr.depositAmount,
                    hint: rr.depositAmountHint,
                    value: config.depositAmountEur,
                    min: 0,
                    max: 500,
                    onChange: (v) => set("depositAmountEur", v),
                    suffix: "€",
                    ocid: "deposit-amount"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NumberField,
                  {
                    id: "depositAboveParty",
                    label: rr.depositAboveParty,
                    hint: rr.depositAbovePartyHint,
                    value: config.depositRequiredAbovePartySize,
                    min: 1,
                    max: 50,
                    onChange: (v) => set("depositRequiredAbovePartySize", v),
                    suffix: rr.persons,
                    ocid: "deposit-above-party"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 py-2 px-4 rounded-xl border border-border bg-background", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: rr.noShowFee }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: rr.noShowFeeHint })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    checked: noShowFeeEnabled,
                    onCheckedChange: handleNoShowToggle,
                    "data-ocid": "no-show-fee-toggle"
                  }
                )
              ] }),
              noShowFeeEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-4 border-l-2 border-primary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                NumberField,
                {
                  id: "noShowFee",
                  label: rr.noShowFeeAmount ?? rr.noShowFee,
                  value: noShowFeeAmount,
                  min: 1,
                  max: 500,
                  onChange: handleNoShowAmountChange,
                  suffix: "€",
                  ocid: "no-show-fee-amount"
                }
              ) }),
              noShowFeeEnabled && noShowFeeAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 px-4 py-3 rounded-xl bg-[oklch(var(--status-orange)/0.1)] border border-[oklch(var(--status-orange)/0.2)]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-[oklch(var(--status-orange))] mt-0.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[oklch(var(--status-orange)/0.9)]", children: rr.noShowFeeNote })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Section,
          {
            ...sectionProps,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-primary" }),
            title: rr.partySizeTitle,
            subtitle: rr.partySizeSubtitle,
            ocid: "party-size-section",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                NumberField,
                {
                  id: "minParty",
                  label: rr.minPartySize,
                  value: config.minPartySize,
                  min: 1,
                  max: config.maxPartySize,
                  onChange: (v) => set("minPartySize", v),
                  suffix: rr.persons,
                  ocid: "min-party-size"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                NumberField,
                {
                  id: "maxParty",
                  label: rr.maxPartySize,
                  value: config.maxPartySize,
                  min: config.minPartySize,
                  max: 50,
                  onChange: (v) => set("maxPartySize", v),
                  suffix: rr.persons,
                  ocid: "max-party-size"
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Section,
          {
            ...sectionProps,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-primary" }),
            title: rr.maxStayTitle,
            subtitle: rr.maxStaySubtitle,
            ocid: "max-stay-section",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: rr.maxStayLunch }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold text-primary tabular-nums", children: [
                    config.maxStayMinutesLunch,
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-muted-foreground ml-1", children: rr.minutes })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "range",
                    min: 30,
                    max: 240,
                    step: 15,
                    value: config.maxStayMinutesLunch,
                    onChange: (e) => set("maxStayMinutesLunch", Number(e.target.value)),
                    className: "w-full h-2 accent-primary cursor-pointer",
                    "aria-label": rr.maxStayLunch,
                    "data-ocid": "max-stay-lunch-slider"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "30 ",
                    rr.minutes
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "120 ",
                    rr.minutes
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "240 ",
                    rr.minutes
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: rr.maxStayDinner }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold text-primary tabular-nums", children: [
                    config.maxStayMinutesDinner,
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-muted-foreground ml-1", children: rr.minutes })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "range",
                    min: 30,
                    max: 300,
                    step: 15,
                    value: config.maxStayMinutesDinner,
                    onChange: (e) => set("maxStayMinutesDinner", Number(e.target.value)),
                    className: "w-full h-2 accent-primary cursor-pointer",
                    "aria-label": rr.maxStayDinner,
                    "data-ocid": "max-stay-dinner-slider"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "30 ",
                    rr.minutes
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "150 ",
                    rr.minutes
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "300 ",
                    rr.minutes
                  ] })
                ] })
              ] })
            ] })
          }
        )
      ]
    }
  );
}
export {
  ReservationRulesSettingsPage as default
};
