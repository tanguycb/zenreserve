import { i as createLucideIcon, u as useTranslation, r as reactExports, aG as useExperiences, g as Clock, U as Users, j as jsxRuntimeExports, ar as CircleCheck, c as cn, A as ArrowRight, aC as ChefHat, G as Check, O as Badge, aI as useReservationRules, aj as Minus, a7 as Plus, aJ as LoaderCircle, aK as useActor, aL as useMutation, aM as createActor, al as useAddToWaitlist, X, a8 as useQueryClient, k as useOpeningHoursConfig, aN as useGeneralInfo, aO as useGuestFormSettings, aH as useAvailableSlots } from "./index-BNayfcmF.js";
import { M as MapPin } from "./map-pin-J80tkmZT.js";
import { M as Mail } from "./mail-Bhz2n6KZ.js";
import { S as Skeleton } from "./skeleton-D2EeOrWT.js";
import { C as Calendar } from "./calendar-B7oSQFN-.js";
import { C as ChevronLeft } from "./chevron-left-BG38Auax.js";
import { C as ChevronRight } from "./chevron-right-6-wY6xfI.js";
import { S as Star } from "./star-h0dWBoX6.js";
import { U as User } from "./user-Bl52wv8_.js";
import { C as CircleAlert } from "./circle-alert-dyy_CREt.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "m9 16 2 2 4-4", key: "19s6y9" }]
];
const CalendarCheck = createLucideIcon("calendar-check", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M16 19h6", key: "xwg31i" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M19 16v6", key: "tddt3s" }],
  ["path", { d: "M21 12.598V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5", key: "1glfrc" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 2v4", key: "1cmpym" }]
];
const CalendarPlus = createLucideIcon("calendar-plus", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M9 18V5l12-2v13", key: "1jmyc2" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["circle", { cx: "18", cy: "16", r: "3", key: "1hluhg" }]
];
const Music = createLucideIcon("music", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2", key: "cjf0a3" }],
  ["path", { d: "M7 2v20", key: "1473qp" }],
  ["path", { d: "M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7", key: "j28e5" }]
];
const Utensils = createLucideIcon("utensils", __iconNode);
const LOCALE_MAP = {
  nl: "nl-NL",
  en: "en-GB",
  fr: "fr-FR",
  de: "de-DE"
};
function generateBookingRef() {
  return `ZR-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
}
function generateICS(date, time, name, restaurant) {
  const dt = /* @__PURE__ */ new Date(`${date}T${time}:00`);
  const endDt = new Date(dt.getTime() + 2 * 60 * 60 * 1e3);
  const format = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ZenReserve//NL",
    "BEGIN:VEVENT",
    `DTSTART:${format(dt)}`,
    `DTEND:${format(endDt)}`,
    `SUMMARY:Reservering ${restaurant}`,
    `DESCRIPTION:Beste ${name}\\, uw tafel is gereserveerd.`,
    `LOCATION:${restaurant}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}
function downloadICS(date, time, name, restaurant) {
  const ics = generateICS(date, time, name, restaurant);
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "zenreserve.ics";
  a.click();
  URL.revokeObjectURL(url);
}
const STATUS_COLORS = {
  green: "var(--color-success, oklch(0.65 0.15 150))",
  blue: "var(--color-info, oklch(0.60 0.15 230))",
  amber: "var(--color-warning, oklch(0.70 0.14 80))",
  muted: "var(--muted-foreground)"
};
function ConfirmationStep({
  date,
  time,
  partySize,
  form,
  experienceId,
  restaurantName = "",
  restaurantAddress = "",
  onReset
}) {
  var _a;
  const { t, i18n } = useTranslation("widget");
  const [visible, setVisible] = reactExports.useState(false);
  const [bookingRef] = reactExports.useState(() => generateBookingRef());
  const { data: experiences } = useExperiences();
  reactExports.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  const locale = LOCALE_MAP[((_a = i18n.language) == null ? void 0 : _a.slice(0, 2)) ?? "nl"] ?? "nl-NL";
  const formattedDate = date ? new Date(date).toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }) : "";
  const guestName = `${form.firstName ?? ""} ${form.lastName ?? ""}`.trim();
  const experienceName = (() => {
    var _a2, _b;
    if (!experienceId) return null;
    const found = experiences == null ? void 0 : experiences.find((e) => e.id === experienceId);
    if (found) return found.name;
    if (experiences !== void 0) {
      return ((_a2 = i18n.language) == null ? void 0 : _a2.startsWith("fr")) ? "Expérience sélectionnée" : ((_b = i18n.language) == null ? void 0 : _b.startsWith("en")) ? "Experience selected" : "Ervaring geselecteerd";
    }
    return null;
  })();
  const details = [
    {
      icon: CalendarPlus,
      label: t("confirmationStep.date"),
      value: formattedDate,
      colorKey: "green"
    },
    {
      icon: Clock,
      label: t("confirmationStep.time"),
      value: time,
      colorKey: "blue"
    },
    {
      icon: Users,
      label: t("confirmationStep.persons"),
      value: `${partySize} ${partySize === 1 ? t("confirmationStep.person") : t("confirmationStep.personsPlural")}`,
      colorKey: "amber"
    },
    ...experienceName ? [
      {
        icon: MapPin,
        label: t("confirmationStep.experience"),
        value: experienceName,
        colorKey: "amber"
      }
    ] : [],
    {
      icon: Mail,
      label: t("confirmationStep.emailConfirm"),
      value: form.email ?? "",
      colorKey: "muted"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "mx-auto h-20 w-20 rounded-full flex items-center justify-center transition-all duration-500 bg-primary/10",
          visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        ),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          CircleCheck,
          {
            className: cn(
              "h-10 w-10 text-primary transition-all duration-700 delay-200",
              visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
            )
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "transition-all duration-500 delay-300",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-foreground", children: t("confirmationStep.title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1 text-muted-foreground", children: t("confirmationStep.subtitle", { name: form.firstName }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "rounded-xl p-3 bg-muted/50 transition-all duration-500 delay-400",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("confirmationStep.bookingRef") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-bold text-lg tracking-widest mt-0.5 text-foreground", children: bookingRef })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "rounded-xl overflow-hidden border border-border transition-all duration-500 delay-500",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        ),
        children: details.map(({ icon: Icon, label, value, colorKey }, idx) => {
          const color = STATUS_COLORS[colorKey];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: cn(
                "flex items-center gap-3 px-4 py-3 text-left",
                idx < details.length - 1 && "border-b border-border"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    style: {
                      backgroundColor: `color-mix(in oklch, ${color} 15%, transparent)`
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4", style: { color } })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold truncate capitalize text-foreground", children: value })
                ] })
              ]
            },
            label
          );
        })
      }
    ),
    (restaurantName || restaurantAddress) && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "rounded-xl border border-border px-4 py-3 text-left transition-all duration-500 delay-500",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        ),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-muted-foreground flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            restaurantName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: restaurantName }),
            restaurantAddress && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: restaurantAddress })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "flex gap-3 transition-all duration-500 delay-500",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => downloadICS(date, time, guestName, restaurantName),
              className: "flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-1.5 transition-all hover:opacity-80 active:scale-95 bg-primary/10 text-primary",
              "data-ocid": "add-to-calendar-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarPlus, { className: "h-4 w-4" }),
                t("confirmationStep.addToCalendar")
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: onReset,
              className: "flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all hover:opacity-90 active:scale-95 bg-primary text-primary-foreground",
              "data-ocid": "book-another-btn",
              children: [
                t("confirmationStep.newBooking"),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("confirmationStep.confirmationSent", { email: form.email }) })
  ] });
}
function backendDayToJsDay(backendDay) {
  return (backendDay + 1) % 7;
}
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year, month) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}
function DatePickerStep({
  selectedDate,
  onSelect,
  fixedClosingDays = [],
  exceptionalClosingDays = []
}) {
  const { t } = useTranslation("widget");
  const [loading, setLoading] = reactExports.useState(true);
  const [availableDates, setAvailableDates] = reactExports.useState([]);
  const today = /* @__PURE__ */ new Date();
  const [viewYear, setViewYear] = reactExports.useState(today.getFullYear());
  const [viewMonth, setViewMonth] = reactExports.useState(today.getMonth());
  const WEEKDAYS = t("dateStep.weekdays", { returnObjects: true });
  const MONTHS = t("dateStep.months", { returnObjects: true });
  const closedJsDaysKey = fixedClosingDays.map(backendDayToJsDay).join(",");
  const exceptionalKey = exceptionalClosingDays.join(",");
  reactExports.useEffect(() => {
    const now = /* @__PURE__ */ new Date();
    const closedJs = closedJsDaysKey.split(",").filter(Boolean).map(Number);
    const exceptionalSet = new Set(exceptionalKey.split(",").filter(Boolean));
    const timer = setTimeout(() => {
      const dates = [];
      const d = new Date(now);
      d.setDate(d.getDate() + 1);
      const limit = d.getTime() + 1e3 * 60 * 60 * 24 * 90;
      while (dates.length < 60 && d.getTime() < limit) {
        const iso = d.toISOString().split("T")[0];
        const isFixedClosed = closedJs.includes(d.getDay());
        const isExceptionalClosed = exceptionalSet.has(iso);
        if (!isFixedClosed && !isExceptionalClosed) {
          dates.push(iso);
        }
        d.setDate(d.getDate() + 1);
      }
      setAvailableDates(dates);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [closedJsDaysKey, exceptionalKey]);
  reactExports.useEffect(() => {
    if (!loading && availableDates.length > 0 && !selectedDate) {
      const first = availableDates.find((d) => {
        const dt = new Date(d);
        return dt.getFullYear() === viewYear && dt.getMonth() === viewMonth;
      });
      if (first) onSelect(first);
    }
  }, [loading, availableDates, selectedDate, onSelect, viewYear, viewMonth]);
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
  const canGoPrev = viewYear > today.getFullYear() || viewYear === today.getFullYear() && viewMonth > today.getMonth();
  const canGoNext = viewYear < today.getFullYear() + 1 || viewYear === today.getFullYear() + 1 && viewMonth <= today.getMonth() + 2;
  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }
  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }
  function isoDate(day) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  function isAvailable(day) {
    const iso = isoDate(day);
    return availableDates.includes(iso);
  }
  function isPast(day) {
    const d = new Date(viewYear, viewMonth, day);
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    return d <= todayStart;
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "space-y-3 p-1",
        "aria-label": t("dateStep.loading"),
        "aria-busy": "true",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48 rounded-lg" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1", children: Array.from({ length: 35 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable id
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full rounded-lg" }, i)
          )) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold flex items-center gap-1.5 text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-primary" }),
      t("dateStep.title")
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: prevMonth,
          disabled: !canGoPrev,
          "aria-label": t("dateStep.prevMonth"),
          className: cn(
            "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
            canGoPrev ? "hover:bg-muted text-foreground" : "opacity-30 cursor-not-allowed text-muted-foreground"
          ),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-sm text-foreground", children: [
        MONTHS[viewMonth],
        " ",
        viewYear
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: nextMonth,
          disabled: !canGoNext,
          "aria-label": t("dateStep.nextMonth"),
          className: cn(
            "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
            canGoNext ? "hover:bg-muted text-foreground" : "opacity-30 cursor-not-allowed text-muted-foreground"
          ),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7 gap-1 text-center", children: [
      WEEKDAYS.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-[10px] font-semibold uppercase tracking-wide py-1 text-muted-foreground",
          children: w
        },
        w
      )),
      Array.from({ length: firstDay }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: positional grid cells with no id
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}, i)
      )),
      Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
        const past = isPast(day);
        const available = isAvailable(day);
        const iso = isoDate(day);
        const isSelected = selectedDate === iso;
        const disabled = past || !available;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            disabled,
            onClick: () => !disabled && onSelect(iso),
            "aria-label": `${day} ${MONTHS[viewMonth]} ${viewYear}${available ? `, ${t("dateStep.available")}` : ""}`,
            "aria-pressed": isSelected,
            className: cn(
              "relative h-9 w-full rounded-lg text-sm font-medium transition-all duration-200",
              isSelected && "scale-110 shadow-soft bg-primary text-primary-foreground",
              !disabled && !isSelected && "hover:bg-muted text-foreground",
              disabled && !isSelected && "opacity-25 cursor-not-allowed text-muted-foreground"
            ),
            children: day
          },
          day
        );
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-3 rounded-full bg-primary", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: t("dateStep.available") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-3 rounded-full bg-muted", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: t("dateStep.closed") })
      ] })
    ] })
  ] });
}
const TAG_ICONS = {
  menu: Utensils,
  event: Music,
  special: Star
};
const GRADIENT_COLORS = [
  "from-primary/20 to-accent/20",
  "from-secondary/20 to-primary/20",
  "from-accent/20 to-secondary/20"
];
function ExperienceStep({
  selectedExperienceId,
  onSelect,
  experiences = [],
  hasRequired = false
}) {
  const { t } = useTranslation("widget");
  const tagLabel = (tag) => {
    if (tag === "menu") return t("experienceStep.tagMenu");
    if (tag === "event") return t("experienceStep.tagEvent");
    return t("experienceStep.tagSpecial");
  };
  const noPreferenceSelected = selectedExperienceId === "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold flex items-center gap-1.5 text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChefHat, { className: "h-4 w-4 text-accent" }),
      t("experienceStep.title"),
      !hasRequired && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal text-xs ml-1 text-muted-foreground", children: t("experienceStep.optional") })
    ] }),
    !hasRequired && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => onSelect(""),
        "aria-pressed": noPreferenceSelected,
        className: cn(
          "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
          noPreferenceSelected ? "border-primary bg-primary/5 scale-[1.01]" : "border-border bg-card hover:border-border/60"
        ),
        "data-ocid": "exp-no-preference",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: t("experienceStep.noPreference") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-0.5 text-muted-foreground", children: t("experienceStep.noPreferenceSub") })
          ] }),
          noPreferenceSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 bg-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Check,
            {
              className: "h-3.5 w-3.5 text-primary-foreground",
              strokeWidth: 3
            }
          ) })
        ] })
      }
    ),
    experiences.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center py-4 text-muted-foreground", children: t("experienceStep.noExperiences", "Geen ervaringen beschikbaar") }),
    experiences.map((exp, idx) => {
      const isSelected = selectedExperienceId === exp.id;
      const Icon = exp.tag ? TAG_ICONS[exp.tag] : Star;
      const gradientClass = GRADIENT_COLORS[idx % GRADIENT_COLORS.length];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onSelect(isSelected && !hasRequired ? "" : exp.id),
          "aria-pressed": isSelected,
          "aria-label": `${exp.name} — €${(exp.price / 100).toFixed(0)} ${t("experienceStep.perPerson")}`,
          className: cn(
            "w-full rounded-xl border-2 text-left transition-all duration-200 overflow-hidden",
            isSelected ? "border-primary scale-[1.01] shadow-elevated" : "border-border hover:shadow-soft"
          ),
          "data-ocid": `exp-${exp.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "h-16 bg-gradient-to-br flex items-center justify-center",
                  gradientClass
                ),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-8 w-8 opacity-40 text-accent" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("p-3", isSelected ? "bg-primary/5" : "bg-card"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: exp.name }),
                  exp.tag && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      className: "text-[10px] px-1.5 py-0 h-4 font-medium",
                      variant: "secondary",
                      children: tagLabel(exp.tag)
                    }
                  ),
                  exp.required && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      className: "text-[10px] px-1.5 py-0 h-4 font-medium bg-accent/10 text-accent border-accent/20",
                      variant: "outline",
                      children: t("experienceStep.required", "Verplicht")
                    }
                  )
                ] }),
                exp.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1 line-clamp-2 text-muted-foreground", children: exp.description }),
                exp.restrictionNote && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] mt-1 text-accent/80 font-medium", children: exp.restrictionNote })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0 flex flex-col items-end gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: cn(
                      "font-bold text-sm",
                      isSelected ? "text-primary" : "text-accent"
                    ),
                    children: [
                      "€",
                      (exp.price / 100).toFixed(0)
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: t("experienceStep.perPerson") }),
                isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-5 rounded-full flex items-center justify-center bg-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Check,
                  {
                    className: "h-3 w-3 text-primary-foreground",
                    strokeWidth: 3
                  }
                ) })
              ] })
            ] }) })
          ]
        },
        exp.id
      );
    })
  ] });
}
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
const inputBase = "w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200";
function Field({ id, label, required, error, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "label",
      {
        htmlFor: id,
        className: "block text-xs font-semibold",
        style: { color: "#374151" },
        children: [
          label,
          required && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "ml-0.5",
              style: { color: "#EF4444" },
              "aria-hidden": "true",
              children: [
                " ",
                "*"
              ]
            }
          )
        ]
      }
    ),
    children,
    error && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        id: `${id}-error`,
        role: "alert",
        className: "text-xs font-medium",
        style: { color: "#EF4444" },
        children: error
      }
    )
  ] });
}
function GuestDetailsStep({ form, onChange }) {
  var _a, _b, _c;
  const { t } = useTranslation("widget");
  const [touched, setTouched] = reactExports.useState({});
  const [showBirthday, setShowBirthday] = reactExports.useState(false);
  function touch(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }
  const errors = {};
  if (touched.firstName && !((_a = form.firstName) == null ? void 0 : _a.trim())) {
    errors.firstName = t("detailsStep.errors.firstNameRequired");
  }
  if (touched.lastName && !((_b = form.lastName) == null ? void 0 : _b.trim())) {
    errors.lastName = t("detailsStep.errors.lastNameRequired");
  }
  if (touched.email) {
    if (!((_c = form.email) == null ? void 0 : _c.trim())) {
      errors.email = t("detailsStep.errors.emailRequired");
    } else if (!validateEmail(form.email)) {
      errors.email = t("detailsStep.errors.emailInvalid");
    }
  }
  function inputStyle(hasError, isTouched) {
    if (hasError) return { borderColor: "#EF4444", backgroundColor: "#FFF5F5" };
    if (isTouched && !hasError)
      return { borderColor: "#22C55E", backgroundColor: "#F0FFF4" };
    return { borderColor: "#E2E8F0", backgroundColor: "#FFFFFF" };
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "p",
      {
        className: "text-sm font-semibold flex items-center gap-1.5",
        style: { color: "#1F2937" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4", style: { color: "#22C55E" } }),
          t("detailsStep.title")
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Field,
        {
          id: "firstName",
          label: t("detailsStep.firstName"),
          required: true,
          error: errors.firstName,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "firstName",
              type: "text",
              autoComplete: "given-name",
              className: inputBase,
              style: inputStyle(!!errors.firstName, !!touched.firstName),
              value: form.firstName ?? "",
              onChange: (e) => onChange({ firstName: e.target.value }),
              onBlur: () => touch("firstName"),
              "aria-required": "true",
              "aria-describedby": errors.firstName ? "firstName-error" : void 0,
              "data-ocid": "input-firstname"
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Field,
        {
          id: "lastName",
          label: t("detailsStep.lastName"),
          required: true,
          error: errors.lastName,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "lastName",
              type: "text",
              autoComplete: "family-name",
              className: inputBase,
              style: inputStyle(!!errors.lastName, !!touched.lastName),
              value: form.lastName ?? "",
              onChange: (e) => onChange({ lastName: e.target.value }),
              onBlur: () => touch("lastName"),
              "aria-required": "true",
              "aria-describedby": errors.lastName ? "lastName-error" : void 0,
              "data-ocid": "input-lastname"
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Field,
      {
        id: "email",
        label: t("detailsStep.email"),
        required: true,
        error: errors.email,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "email",
            type: "email",
            autoComplete: "email",
            className: inputBase,
            style: inputStyle(!!errors.email, !!touched.email),
            value: form.email ?? "",
            onChange: (e) => onChange({ email: e.target.value }),
            onBlur: () => touch("email"),
            "aria-required": "true",
            "aria-describedby": errors.email ? "email-error" : void 0,
            placeholder: t("detailsStep.emailPlaceholder"),
            "data-ocid": "input-email"
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "phone", label: t("detailsStep.phone"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        id: "phone",
        type: "tel",
        autoComplete: "tel",
        className: inputBase,
        style: { borderColor: "#E2E8F0", color: "#1F2937" },
        value: form.phone ?? "",
        onChange: (e) => onChange({ phone: e.target.value }),
        placeholder: t("detailsStep.phonePlaceholder"),
        "data-ocid": "input-phone"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: "notes", label: t("detailsStep.notes"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        id: "notes",
        rows: 2,
        className: cn(inputBase, "resize-none"),
        style: { borderColor: "#E2E8F0", color: "#1F2937" },
        placeholder: t("detailsStep.notesPlaceholder"),
        value: form.notes ?? "",
        onChange: (e) => onChange({ notes: e.target.value }),
        "data-ocid": "input-notes"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "label",
      {
        className: "flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all",
        style: showBirthday ? { backgroundColor: "#22C55E0D" } : { backgroundColor: "#F9FAFB" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-5 w-9 rounded-full transition-all duration-300 relative flex-shrink-0 mt-0.5",
              style: { backgroundColor: showBirthday ? "#22C55E" : "#D1D5DB" },
              "aria-hidden": "true",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: cn(
                    "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-300",
                    showBirthday ? "translate-x-4" : "translate-x-0.5"
                  )
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: showBirthday,
              onChange: (e) => setShowBirthday(e.target.checked),
              className: "sr-only"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium", style: { color: "#1F2937" }, children: [
              "🎂 ",
              t("detailsStep.birthday")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-0.5", style: { color: "#6B7280" }, children: t("detailsStep.birthdaySub") }),
            showBirthday && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "birthday",
                  className: "block text-xs font-medium mb-1",
                  style: { color: "#374151" },
                  children: t("detailsStep.birthdayDate")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "birthday",
                  type: "date",
                  className: cn(inputBase, "text-sm"),
                  style: { borderColor: "#E2E8F0", color: "#1F2937" }
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs", style: { color: "#9CA3AF" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#EF4444" }, children: "*" }),
      " ",
      t("detailsStep.required")
    ] })
  ] });
}
function PartySizeStep({
  partySize,
  onSelect,
  showBabiesChildren = true
}) {
  const { t } = useTranslation("widget");
  const [hasBabies, setHasBabies] = reactExports.useState(false);
  const { data: rules } = useReservationRules();
  const minSize = (rules == null ? void 0 : rules.minPartySize) ?? 1;
  const maxSize = (rules == null ? void 0 : rules.maxPartySize) ?? 12;
  const SIZES = reactExports.useMemo(
    () => Array.from({ length: maxSize - minSize + 1 }, (_, i) => minSize + i),
    [minSize, maxSize]
  );
  function decrement() {
    if (partySize > minSize) onSelect(partySize - 1);
  }
  function increment() {
    if (partySize < maxSize) onSelect(partySize + 1);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold flex items-center gap-1.5 text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-primary" }),
      t("partySizeStep.title")
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-5 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: decrement,
          disabled: partySize <= minSize,
          "aria-label": t("partySizeStep.decreaseLabel"),
          className: cn(
            "h-11 w-11 rounded-full border-2 flex items-center justify-center transition-all duration-200 font-bold",
            partySize > minSize ? "border-primary text-primary hover:scale-110 active:scale-95" : "border-border text-muted-foreground opacity-30 cursor-not-allowed"
          ),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-5 w-5", strokeWidth: 2.5 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center min-w-[4rem]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-5xl font-bold transition-all duration-200 text-foreground", children: partySize }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: partySize === 1 ? t("partySizeStep.person") : t("partySizeStep.persons") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: increment,
          disabled: partySize >= maxSize,
          "aria-label": t("partySizeStep.increaseLabel"),
          className: cn(
            "h-11 w-11 rounded-full border-2 flex items-center justify-center transition-all duration-200 font-bold",
            partySize < maxSize ? "border-primary text-primary bg-primary/10 hover:scale-110 active:scale-95" : "border-border text-muted-foreground opacity-30 cursor-not-allowed"
          ),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5", strokeWidth: 2.5 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "grid grid-cols-6 gap-1.5 border-0 p-0 m-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: t("partySizeStep.quickSelect") }),
      SIZES.map((size) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onSelect(size),
          "aria-pressed": partySize === size,
          "aria-label": `${size} ${size === 1 ? t("partySizeStep.person") : t("partySizeStep.persons")}`,
          className: cn(
            "py-2.5 rounded-xl text-center font-bold text-sm transition-all duration-200",
            partySize === size ? "bg-primary text-primary-foreground scale-110 shadow-soft" : "bg-muted text-foreground hover:scale-105"
          ),
          children: size
        },
        size
      ))
    ] }),
    showBabiesChildren && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "label",
      {
        className: cn(
          "flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all",
          hasBabies ? "bg-primary/5" : "bg-muted/50"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "h-5 w-9 rounded-full transition-all duration-300 relative flex-shrink-0",
                hasBabies ? "bg-primary" : "bg-muted-foreground/30"
              ),
              "aria-hidden": "true",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: cn(
                    "absolute top-0.5 h-4 w-4 rounded-full bg-card shadow transition-all duration-300",
                    hasBabies ? "translate-x-4" : "translate-x-0.5"
                  )
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: hasBabies,
              onChange: (e) => setHasBabies(e.target.checked),
              className: "sr-only",
              "aria-label": t("partySizeStep.babies"),
              "data-ocid": "widget-babies-toggle"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: t("partySizeStep.babies") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("partySizeStep.babiesSub") })
          ] })
        ]
      }
    ),
    partySize > 8 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-center rounded-xl px-4 py-2.5 bg-[oklch(var(--status-orange)/0.12)] text-[oklch(var(--status-orange))]", children: t("partySizeStep.largeGroup") })
  ] });
}
function useCreateReservation() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (data) => {
      var _a;
      if (!actor) throw new Error("Actor not available");
      const fullName = [data.guestDetails.firstName, data.guestDetails.lastName].filter(Boolean).join(" ");
      const guest = await actor.createGuest(
        fullName,
        data.guestDetails.email,
        data.guestDetails.phone ?? null
      );
      const reservation = await actor.createReservation(
        guest.id,
        data.date,
        data.time,
        BigInt(data.partySize),
        data.experienceId ?? null,
        null,
        data.specialRequests ?? null
      );
      if (typeof reservation === "object" && reservation !== null && "__kind__" in reservation) {
        const r = reservation;
        if (r.__kind__ === "err") {
          throw new Error(r.err ?? "UNKNOWN");
        }
        return ((_a = r.ok) == null ? void 0 : _a.id) ?? "";
      }
      return reservation.id;
    }
  });
}
function PaymentStep({
  partySize,
  guestDetails,
  selectedDate,
  selectedTime,
  experienceId,
  specialRequests,
  onPaymentSuccess
}) {
  var _a, _b;
  const { t } = useTranslation("widget");
  const createReservation = useCreateReservation();
  const date = selectedDate ?? (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const time = selectedTime ?? "19:00";
  async function handleConfirm() {
    const guest = guestDetails ?? {
      firstName: "Gast",
      email: ""
    };
    await createReservation.mutateAsync(
      {
        guestDetails: guest,
        date,
        time,
        partySize,
        experienceId,
        specialRequests
      },
      {
        onSuccess: () => {
          setTimeout(onPaymentSuccess, 1400);
        }
      }
    );
  }
  if (createReservation.isSuccess) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-6 space-y-3",
        "data-ocid": "payment.success_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-14 w-14 rounded-full flex items-center justify-center bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-8 w-8 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-base text-foreground", children: t("paymentStep.successTitle") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-0.5 text-muted-foreground", children: t("confirmationStep.confirmationSent", {
              email: (guestDetails == null ? void 0 : guestDetails.email) ?? ""
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-24 mx-auto rounded-full overflow-hidden bg-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full rounded-full bg-primary",
              style: { animation: "grow 1.4s ease-out forwards" }
            }
          ) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl p-4 space-y-3 bg-muted/30 border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: t("confirmationStep.bookingSummary", "Boekingsoverzicht") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-secondary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { className: "h-3.5 w-3.5 text-secondary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("dateStep.title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: date })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-accent/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-accent" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("timeStep.title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: time })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("partySizeStep.title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
              partySize,
              " ",
              partySize === 1 ? t("partySizeStep.person", "persoon") : t("partySizeStep.persons", "personen")
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-2.5 rounded-lg mt-1 bg-primary/5 border border-primary/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 flex-shrink-0 mt-0.5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/80", children: t(
          "paymentStep.payAtVenueNote",
          "Geen vooruitbetaling vereist. Betaal ter plaatse."
        ) })
      ] })
    ] }),
    createReservation.isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20",
        role: "alert",
        "data-ocid": "payment.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 flex-shrink-0 mt-0.5 text-destructive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: ((_a = createReservation.error) == null ? void 0 : _a.message) === "RATE_LIMIT_WIDGET" ? t("paymentStep.errorRateLimit") : ((_b = createReservation.error) == null ? void 0 : _b.message) ?? t("paymentStep.errorDefault") })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: handleConfirm,
        disabled: createReservation.isPending,
        className: cn(
          "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200",
          "bg-primary text-primary-foreground",
          !createReservation.isPending ? "hover:opacity-90 active:scale-[0.98]" : "opacity-70 cursor-not-allowed"
        ),
        "data-ocid": "payment.submit_button",
        children: createReservation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          t("paymentStep.processing")
        ] }) : t("paymentStep.confirmButton", "Reservering bevestigen")
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: t(
      "paymentStep.freeNote",
      "Gratis annuleren tot 24 uur voor aankomst."
    ) })
  ] });
}
function StepIndicator({ steps, currentStep }) {
  const { t } = useTranslation("widget");
  const progress = (currentStep - 1) / (steps.length - 1) * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "nav",
    {
      className: "px-6 pt-6 pb-5",
      style: { backgroundColor: "#FAF7F0" },
      "aria-label": t("stepIndicator.progressLabel", {
        current: currentStep,
        total: steps.length
      }),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between mb-4 gap-1", children: steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center gap-1 flex-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: cn(
                      "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                      isCompleted && "scale-90",
                      isCurrent && "scale-110 shadow-soft"
                    ),
                    style: isCompleted ? { backgroundColor: "#22C55E", color: "#FFFFFF" } : isCurrent ? {
                      backgroundColor: "#22C55E",
                      color: "#FFFFFF",
                      boxShadow: "0 0 0 3px #22C55E33"
                    } : { backgroundColor: "#E2E8F0", color: "#9CA3AF" },
                    "aria-current": isCurrent ? "step" : void 0,
                    children: isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5", strokeWidth: 3 }) : step.id
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "text-[10px] font-medium text-center leading-tight hidden sm:block transition-colors"
                    ),
                    style: isCompleted || isCurrent ? { color: "#22C55E" } : { color: "#9CA3AF" },
                    children: step.label
                  }
                ),
                isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] font-semibold text-center leading-tight sm:hidden",
                    style: { color: "#22C55E" },
                    children: step.label
                  }
                )
              ]
            },
            step.id
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-1.5 rounded-full overflow-hidden",
            style: { backgroundColor: "#E2E8F0" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                role: "progressbar",
                tabIndex: 0,
                "aria-valuenow": Math.round(progress),
                "aria-valuemin": 0,
                "aria-valuemax": 100,
                "aria-label": t("stepIndicator.progressLabel", {
                  current: currentStep,
                  total: steps.length
                }),
                className: "h-full rounded-full transition-all duration-500 ease-out",
                style: { width: `${progress}%`, backgroundColor: "#22C55E" }
              }
            )
          }
        )
      ]
    }
  );
}
function timeGte(a, b) {
  return a >= b;
}
function timeLt(a, b) {
  return a < b;
}
function groupByService(slots, services) {
  const groups = services.filter((svc) => svc.openTime && svc.closeTime).map((svc) => ({ service: svc, slots: [] }));
  for (const slot of slots) {
    for (const group of groups) {
      const { openTime, closeTime } = group.service;
      if (timeGte(slot.time, openTime) && timeLt(slot.time, closeTime)) {
        group.slots.push(slot);
        break;
      }
    }
  }
  return groups.filter((g) => g.slots.length > 0);
}
function TimeSlotStep({
  selectedDate,
  selectedTime,
  partySize,
  onSelect,
  onWaitlist,
  availableSlots,
  isLoading = false,
  services
}) {
  const { t, i18n } = useTranslation("widget");
  const [slots, setSlots] = reactExports.useState([]);
  const allFull = !isLoading && slots.length > 0 && slots.every((s) => s.status === "full");
  const showNoSlots = !isLoading && slots.length === 0;
  reactExports.useEffect(() => {
    if (!selectedDate) return;
    if (availableSlots && availableSlots.length > 0) {
      const mapped = availableSlots.map((s) => {
        const remaining = s.capacity - s.booked;
        const status = !s.available || remaining === 0 ? "full" : remaining < partySize ? "limited" : "available";
        return {
          time: s.time,
          status
        };
      });
      setSlots(mapped);
    } else {
      setSlots([]);
    }
  }, [selectedDate, partySize, availableSlots]);
  const formattedDate = selectedDate ? new Date(selectedDate).toLocaleDateString(i18n.language, {
    weekday: "long",
    day: "numeric",
    month: "long"
  }) : "";
  const useGrouped = services && services.length > 0 && !allFull && slots.length > 0;
  const groups = useGrouped ? groupByService(slots, services) : [];
  const hasVisibleGroups = groups.length > 0;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "space-y-3",
        "aria-label": t("timeStep.loading"),
        "aria-busy": "true",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-48 rounded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: Array.from({ length: 9 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[72px] w-full rounded-xl" }, i)
          )) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold flex items-center gap-1.5 text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-primary" }),
        t("timeStep.title")
      ] }),
      formattedDate && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-0.5 capitalize text-muted-foreground", children: formattedDate })
    ] }),
    showNoSlots && !allFull && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-12 w-12 rounded-full flex items-center justify-center bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-6 w-6 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: t("timeStep.noSlots") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("timeStep.noSlotsSub") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onWaitlist,
          className: "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 bg-primary text-primary-foreground",
          "data-ocid": "waitlist-btn",
          children: t("timeStep.waitlistCta")
        }
      )
    ] }),
    allFull && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-12 w-12 rounded-full flex items-center justify-center bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-6 w-6 text-destructive" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: t("timeStep.allFull") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1 text-muted-foreground", children: t("timeStep.allFullSub") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onWaitlist,
          className: "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 bg-primary text-primary-foreground",
          "data-ocid": "waitlist-btn",
          children: t("timeStep.waitlistCta")
        }
      )
    ] }),
    !allFull && hasVisibleGroups && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-5", children: groups.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wide text-primary", children: group.service.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          group.service.openTime,
          "–",
          group.service.closeTime
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SlotGrid,
        {
          slots: group.slots,
          selectedTime,
          onSelect,
          t
        }
      )
    ] }, group.service.id)) }),
    !allFull && !hasVisibleGroups && slots.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SlotGrid,
      {
        slots,
        selectedTime,
        onSelect,
        t
      }
    )
  ] });
}
function SlotGrid({ slots, selectedTime, onSelect, t }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "ul",
    {
      className: "grid grid-cols-3 gap-2 list-none p-0 m-0",
      "aria-label": t("timeStep.slots"),
      children: slots.map((slot) => {
        const isSelected = selectedTime === slot.time;
        const isFull = slot.status === "full";
        const isLimited = slot.status === "limited";
        const statusLabel = slot.status === "available" ? t("timeStep.available") : slot.status === "limited" ? t("timeStep.limited") : t("timeStep.full");
        return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            disabled: isFull,
            onClick: () => !isFull && onSelect(slot.time),
            "aria-label": `${slot.time}, ${statusLabel}`,
            "aria-pressed": isSelected,
            className: cn(
              "w-full py-3 px-2 rounded-xl border-2 text-center transition-all duration-200",
              isFull && "cursor-not-allowed opacity-50",
              !isFull && !isSelected && "hover:border-primary/40 hover:scale-[1.02]",
              isSelected && "scale-105 border-primary bg-primary/10",
              !isSelected && !isFull && isLimited && "border-amber-500/40 bg-amber-500/10",
              !isSelected && !isFull && !isLimited && "border-border bg-card",
              !isSelected && isFull && "border-border bg-muted"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "block text-sm font-bold leading-tight",
                    isSelected && "text-primary",
                    !isSelected && isFull && "text-muted-foreground",
                    !isSelected && !isFull && isLimited && "text-amber-600 dark:text-amber-400",
                    !isSelected && !isFull && !isLimited && "text-foreground"
                  ),
                  children: slot.time
                }
              ),
              isFull && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[10px] mt-0.5 font-medium text-destructive", children: statusLabel }),
              isLimited && !isFull && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[10px] mt-0.5 font-medium text-amber-600 dark:text-amber-400", children: statusLabel })
            ]
          }
        ) }, slot.time);
      })
    }
  );
}
const TIME_OPTIONS = [
  "12:00",
  "12:30",
  "13:00",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00"
];
function WaitlistModal({
  isOpen,
  onClose,
  selectedDate,
  partySize
}) {
  var _a;
  const { t } = useTranslation(["widget", "shared"]);
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [preferredTime, setPreferredTime] = reactExports.useState("");
  const [size, setSize] = reactExports.useState(partySize ?? 2);
  const [success, setSuccess] = reactExports.useState(false);
  const firstInputRef = reactExports.useRef(null);
  const addToWaitlist = useAddToWaitlist();
  reactExports.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        var _a2;
        return (_a2 = firstInputRef.current) == null ? void 0 : _a2.focus();
      }, 100);
    }
  }, [isOpen]);
  const resetMutation = addToWaitlist.reset;
  reactExports.useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      resetMutation();
    }
  }, [isOpen, resetMutation]);
  reactExports.useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);
  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email) return;
    const date = selectedDate ?? (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    await addToWaitlist.mutateAsync(
      {
        guestName: name,
        guestEmail: email,
        guestPhone: phone || void 0,
        partySize: size,
        date,
        requestedTime: preferredTime || void 0,
        notes: ""
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(onClose, 2200);
        }
      }
    );
  }
  if (!isOpen) return null;
  const inputClass = "w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#3B82F6]/30";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "dialog",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent max-w-none w-full h-full m-0",
      open: isOpen,
      "aria-labelledby": "waitlist-title",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 bg-black/40 backdrop-blur-sm",
            onClick: onClose,
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative w-full max-w-md rounded-2xl shadow-elevated overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300",
            style: { backgroundColor: "#FFFFFF" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-between px-5 py-4",
                  style: {
                    backgroundColor: "#FAF7F0",
                    borderBottom: "1px solid #E2E8F0"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "h-8 w-8 rounded-lg flex items-center justify-center",
                          style: { backgroundColor: "#3B82F61A" },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4", style: { color: "#3B82F6" } })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "h2",
                          {
                            id: "waitlist-title",
                            className: "font-bold text-sm",
                            style: { color: "#1F2937" },
                            children: t("widget:waitlist.title")
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "#6B7280" }, children: t("widget:waitlist.subtitle") })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: onClose,
                        "aria-label": t("shared:actions.close"),
                        className: "h-8 w-8 rounded-lg flex items-center justify-center transition-colors hover:bg-black/5",
                        style: { color: "#6B7280" },
                        "data-ocid": "waitlist.close_button",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-5", children: success ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "text-center py-6 space-y-4",
                  "data-ocid": "waitlist.success_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "mx-auto h-16 w-16 rounded-full flex items-center justify-center",
                        style: { backgroundColor: "#22C55E1A" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CircleCheck,
                          {
                            className: "h-9 w-9",
                            style: { color: "#22C55E" }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-lg", style: { color: "#1F2937" }, children: [
                        t("widget:waitlist.joinButton"),
                        "!"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", style: { color: "#6B7280" }, children: t("widget:confirmationStep.confirmationSent", { email }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: onClose,
                        className: "px-8 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90",
                        style: { backgroundColor: "#22C55E", color: "#FFFFFF" },
                        "data-ocid": "waitlist.close_button",
                        children: t("shared:actions.close")
                      }
                    )
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", noValidate: true, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "label",
                    {
                      htmlFor: "wl-name",
                      className: "block text-xs font-semibold",
                      style: { color: "#374151" },
                      children: [
                        t("widget:detailsStep.firstName"),
                        " *"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: firstInputRef,
                      id: "wl-name",
                      type: "text",
                      required: true,
                      className: inputClass,
                      style: { borderColor: "#E2E8F0", color: "#1F2937" },
                      placeholder: "Jan Jansen",
                      value: name,
                      onChange: (e) => setName(e.target.value),
                      "data-ocid": "waitlist.input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "label",
                    {
                      htmlFor: "wl-email",
                      className: "block text-xs font-semibold",
                      style: { color: "#374151" },
                      children: [
                        t("widget:detailsStep.email"),
                        " *"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "wl-email",
                      type: "email",
                      required: true,
                      className: inputClass,
                      style: { borderColor: "#E2E8F0", color: "#1F2937" },
                      placeholder: t("widget:detailsStep.emailPlaceholder"),
                      value: email,
                      onChange: (e) => setEmail(e.target.value),
                      "data-ocid": "waitlist.input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "wl-phone",
                      className: "block text-xs font-semibold",
                      style: { color: "#374151" },
                      children: t("widget:detailsStep.phone")
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "wl-phone",
                      type: "tel",
                      className: inputClass,
                      style: { borderColor: "#E2E8F0", color: "#1F2937" },
                      placeholder: t("widget:detailsStep.phonePlaceholder"),
                      value: phone,
                      onChange: (e) => setPhone(e.target.value),
                      "data-ocid": "waitlist.input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        htmlFor: "wl-time",
                        className: "block text-xs font-semibold",
                        style: { color: "#374151" },
                        children: t("widget:timeStep.title")
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "select",
                      {
                        id: "wl-time",
                        className: cn(inputClass, "appearance-none cursor-pointer"),
                        style: {
                          borderColor: "#E2E8F0",
                          color: preferredTime ? "#1F2937" : "#9CA3AF"
                        },
                        value: preferredTime,
                        onChange: (e) => setPreferredTime(e.target.value),
                        "data-ocid": "waitlist.select",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("widget:experienceStep.noPreference") }),
                          TIME_OPTIONS.map((timeOpt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: timeOpt, children: timeOpt }, timeOpt))
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        htmlFor: "wl-size",
                        className: "block text-xs font-semibold",
                        style: { color: "#374151" },
                        children: t("widget:partySizeStep.title")
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "select",
                      {
                        id: "wl-size",
                        className: cn(inputClass, "appearance-none cursor-pointer"),
                        style: { borderColor: "#E2E8F0", color: "#1F2937" },
                        value: size,
                        onChange: (e) => setSize(Number(e.target.value)),
                        "data-ocid": "waitlist.select",
                        children: Array.from({ length: 12 }, (_, i) => i + 1).map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: n, children: n }, n))
                      }
                    )
                  ] })
                ] }),
                addToWaitlist.isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-start gap-2 p-3 rounded-xl",
                    style: { backgroundColor: "#FEF2F2" },
                    role: "alert",
                    "data-ocid": "waitlist.error_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        CircleAlert,
                        {
                          className: "h-4 w-4 flex-shrink-0 mt-0.5",
                          style: { color: "#EF4444" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: "#EF4444" }, children: ((_a = addToWaitlist.error) == null ? void 0 : _a.message) ?? t("shared:errors.genericError") })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: onClose,
                      className: "flex-1 py-3 rounded-xl border font-medium text-sm transition-all hover:bg-black/5",
                      style: { borderColor: "#E2E8F0", color: "#6B7280" },
                      "data-ocid": "waitlist.cancel_button",
                      children: t("shared:actions.cancel")
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "submit",
                      disabled: !name || !email || addToWaitlist.isPending,
                      className: cn(
                        "flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                        name && email && !addToWaitlist.isPending ? "hover:opacity-90 active:scale-[0.98]" : "opacity-50 cursor-not-allowed"
                      ),
                      style: { backgroundColor: "#3B82F6", color: "#FFFFFF" },
                      "data-ocid": "waitlist.submit_button",
                      children: addToWaitlist.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                        t("shared:actions.loading")
                      ] }) : t("widget:waitlist.joinButton")
                    }
                  )
                ] })
              ] }) })
            ]
          }
        )
      ]
    }
  );
}
function WidgetPage({
  initialDate = "",
  initialTime = "",
  initialPartySize = 2,
  initialStep = 1
}) {
  var _a, _b, _c, _d;
  const { t } = useTranslation("widget");
  const [step, setStep] = reactExports.useState(initialStep);
  const [selectedDate, setSelectedDate] = reactExports.useState(initialDate);
  const [selectedTime, setSelectedTime] = reactExports.useState(initialTime);
  const [partySize, setPartySize] = reactExports.useState(initialPartySize);
  const [selectedExperience, setSelectedExperience] = reactExports.useState("");
  const [form, setForm] = reactExports.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [confirmed, setConfirmed] = reactExports.useState(false);
  const [showWaitlist, setShowWaitlist] = reactExports.useState(false);
  const [slideDirection, setSlideDirection] = reactExports.useState(
    "forward"
  );
  const [animating, setAnimating] = reactExports.useState(false);
  const queryClient = useQueryClient();
  const { data: openingHoursConfig } = useOpeningHoursConfig();
  const { data: generalInfo } = useGeneralInfo();
  const { data: experiences } = useExperiences();
  const { data: guestFormSettings } = useGuestFormSettings();
  const restaurantName = (generalInfo == null ? void 0 : generalInfo.restaurantName) ?? "";
  const restaurantAddress = [
    generalInfo == null ? void 0 : generalInfo.contactPhone,
    generalInfo == null ? void 0 : generalInfo.contactEmail
  ].filter(Boolean).join(" · ");
  const activeExperiences = reactExports.useMemo(() => {
    const all = (experiences ?? []).filter((e) => e.available);
    if (!selectedDate && !selectedTime) return all;
    const dayOfWeek = selectedDate ? new Date(selectedDate).getDay() : -1;
    const hour = selectedTime ? Number.parseInt(selectedTime.split(":")[0] ?? "0", 10) : -1;
    const serviceId = hour >= 0 ? hour < 17 ? "lunch" : "diner" : "";
    return all.filter((exp) => {
      if (exp.serviceIds && exp.serviceIds.length > 0 && serviceId) {
        if (!exp.serviceIds.includes(serviceId)) return false;
      }
      if (exp.dayOfWeek && exp.dayOfWeek.length > 0 && dayOfWeek >= 0) {
        if (!exp.dayOfWeek.includes(dayOfWeek)) return false;
      }
      return true;
    });
  }, [experiences, selectedDate, selectedTime]);
  const hasExperiences = activeExperiences.length > 0;
  const hasRequiredExperience = activeExperiences.some((e) => e.required);
  const STEPS = reactExports.useMemo(() => {
    const base = [
      { id: 1, label: t("partySizeStep.title") },
      { id: 2, label: t("dateStep.title") },
      { id: 3, label: t("timeStep.title") }
    ];
    if (hasExperiences) {
      base.push({ id: 4, label: t("experienceStep.title") });
    }
    base.push(
      { id: 5, label: t("detailsStep.title") },
      { id: 6, label: t("paymentStep.title") }
    );
    return base;
  }, [hasExperiences, t]);
  const progressStep = reactExports.useMemo(() => {
    if (!hasExperiences && step >= 5) return step - 1;
    return step;
  }, [hasExperiences, step]);
  const { data: availableSlots, isFetching: slotsFetching } = useAvailableSlots(
    selectedDate,
    partySize
  );
  function getNextStep(current) {
    if (current === 3 && !hasExperiences) return 5;
    if (current < 6) return current + 1;
    return current;
  }
  function getPrevStep(current) {
    if (current === 5 && !hasExperiences) return 3;
    if (current > 1) return current - 1;
    return current;
  }
  function goNext() {
    const next = getNextStep(step);
    if (next !== step) {
      setSlideDirection("forward");
      setAnimating(true);
      setTimeout(() => {
        setStep(next);
        setAnimating(false);
      }, 120);
    }
  }
  function goBack() {
    const prev = getPrevStep(step);
    if (prev !== step) {
      setSlideDirection("back");
      setAnimating(true);
      setTimeout(() => {
        if (prev === 3) {
          queryClient.invalidateQueries({
            queryKey: ["availableSlots", selectedDate, partySize]
          });
        }
        setStep(prev);
        setAnimating(false);
      }, 120);
    }
  }
  function handleReset() {
    setStep(1);
    setSelectedDate("");
    setSelectedTime("");
    setPartySize(2);
    setSelectedExperience("");
    setForm({ firstName: "", lastName: "", email: "", phone: "", notes: "" });
    setConfirmed(false);
  }
  const experienceValid = step !== 4 || !hasRequiredExperience || selectedExperience !== "";
  const isNextDisabled = step === 1 && partySize < 1 || step === 2 && !selectedDate || step === 3 && !selectedTime || step === 4 && !experienceValid || step === 5 && (!((_a = form.firstName) == null ? void 0 : _a.trim()) || !((_b = form.lastName) == null ? void 0 : _b.trim()) || !((_c = form.email) == null ? void 0 : _c.trim()));
  const nextLabel = step === 5 ? t("nav.toPayment") : t("nav.next");
  if (confirmed) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl shadow-elevated overflow-hidden bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pt-6 pb-4 bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl flex items-center justify-center bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChefHat, { className: "h-5 w-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-lg text-foreground", children: restaurantName || t("nav.bookTable") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: (generalInfo == null ? void 0 : generalInfo.contactPhone) ?? "" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ConfirmationStep,
        {
          date: selectedDate,
          time: selectedTime,
          partySize,
          form,
          experienceId: selectedExperience,
          restaurantName,
          restaurantAddress,
          onReset: handleReset
        }
      ) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl shadow-elevated overflow-hidden bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-5 pb-4 bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChefHat, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold text-base leading-tight text-foreground", children: t("nav.bookTable") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs truncate text-muted-foreground", children: restaurantName })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StepIndicator, { steps: STEPS, currentStep: progressStep })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "px-6 py-5 min-h-[320px] transition-all duration-200",
            animating && (slideDirection === "forward" ? "opacity-0 translate-x-2" : "opacity-0 -translate-x-2"),
            !animating && "opacity-100 translate-x-0"
          ),
          children: [
            step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              PartySizeStep,
              {
                partySize,
                onSelect: setPartySize,
                showBabiesChildren: (guestFormSettings == null ? void 0 : guestFormSettings.showBabiesChildren) ?? true
              }
            ),
            step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              DatePickerStep,
              {
                selectedDate,
                fixedClosingDays: (openingHoursConfig == null ? void 0 : openingHoursConfig.fixedClosingDays) ?? [],
                exceptionalClosingDays: ((_d = openingHoursConfig == null ? void 0 : openingHoursConfig.exceptionalClosingDays) == null ? void 0 : _d.map(
                  (d) => d.date
                )) ?? [],
                onSelect: (date) => {
                  setSelectedDate(date);
                  setSelectedTime("");
                }
              }
            ),
            step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              TimeSlotStep,
              {
                selectedDate,
                selectedTime,
                partySize,
                onSelect: setSelectedTime,
                onWaitlist: () => setShowWaitlist(true),
                availableSlots,
                isLoading: slotsFetching,
                services: openingHoursConfig == null ? void 0 : openingHoursConfig.services
              }
            ),
            step === 4 && hasExperiences && /* @__PURE__ */ jsxRuntimeExports.jsx(
              ExperienceStep,
              {
                selectedExperienceId: selectedExperience,
                onSelect: setSelectedExperience,
                experiences: activeExperiences.map((e) => {
                  const parts = [];
                  if (e.serviceIds && e.serviceIds.length > 0) {
                    parts.push(
                      e.serviceIds.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")
                    );
                  }
                  return {
                    id: e.id,
                    name: e.name,
                    description: e.description,
                    price: e.price,
                    available: e.available,
                    required: e.required,
                    restrictionNote: parts.length > 0 ? parts.join(" · ") : void 0
                  };
                }),
                hasRequired: hasRequiredExperience
              }
            ),
            step === 5 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              GuestDetailsStep,
              {
                form,
                onChange: (updates) => setForm((f) => ({ ...f, ...updates }))
              }
            ),
            step === 6 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              PaymentStep,
              {
                partySize,
                selectedDate,
                selectedTime,
                experienceId: selectedExperience || void 0,
                guestDetails: form.firstName ? {
                  firstName: form.firstName,
                  lastName: form.lastName,
                  email: form.email ?? "",
                  phone: form.phone
                } : void 0,
                specialRequests: form.notes || void 0,
                onPaymentSuccess: () => setConfirmed(true)
              }
            )
          ]
        }
      ),
      step !== 6 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 px-6 py-4 border-t border-border", children: [
        step > 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: goBack,
            className: "flex items-center gap-1 px-4 py-3 rounded-xl border border-border font-medium text-sm transition-all hover:bg-muted active:scale-[0.97] text-muted-foreground",
            "data-ocid": "widget-back-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }),
              t("nav.back")
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: goNext,
            disabled: isNextDisabled,
            className: cn(
              "flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-sm transition-all bg-primary text-primary-foreground",
              !isNextDisabled ? "hover:opacity-90 active:scale-[0.98]" : "opacity-40 cursor-not-allowed"
            ),
            "data-ocid": "widget-next-btn",
            children: [
              nextLabel,
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
            ]
          }
        )
      ] }),
      step >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "px-6 py-2.5 flex items-center gap-3 flex-wrap bg-muted/30",
            step === 6 && "border-t border-border"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SummaryPill,
              {
                label: `${partySize} ${partySize === 1 ? t("partySizeStep.person") : t("partySizeStep.persons")}`
              }
            ),
            selectedDate && /* @__PURE__ */ jsxRuntimeExports.jsx(
              SummaryPill,
              {
                label: new Date(selectedDate).toLocaleDateString(void 0, {
                  day: "numeric",
                  month: "short"
                })
              }
            ),
            selectedTime && /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryPill, { label: selectedTime })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      WaitlistModal,
      {
        isOpen: showWaitlist,
        onClose: () => setShowWaitlist(false),
        partySize
      }
    )
  ] });
}
function SummaryPill({ label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary", children: label });
}
export {
  WidgetPage as default
};
