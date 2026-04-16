import { l as createLucideIcon, u as useTranslation, r as reactExports, e as Clock, U as Users, j as jsxRuntimeExports, w as CircleCheck, c as cn, S as Skeleton, O as ChefHat, f as Star, k as Badge, X } from "./index-OyrOOjf2.js";
import { M as MapPin } from "./map-pin-CKgIYdbH.js";
import { M as Mail } from "./mail-BV82Epa6.js";
import { A as ArrowRight } from "./arrow-right-Dz3hIXQ3.js";
import { C as Calendar } from "./calendar-BrHNFFQa.js";
import { C as ChevronLeft } from "./chevron-left-DT4sz5G1.js";
import { C as ChevronRight } from "./chevron-right-BzK7BR_W.js";
import { C as Check } from "./check-DfamBHMf.js";
import { U as User } from "./user-CPVCkYiF.js";
import { M as Minus } from "./minus-CELCch0C.js";
import { P as Plus } from "./plus-BpTLdwE7.js";
import { S as Shield } from "./shield-qw_ePJAQ.js";
import { C as CreditCard } from "./credit-card-C6Qonvnd.js";
import { C as CircleAlert } from "./circle-alert-C3kpdLXE.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M16 19h6", key: "xwg31i" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M19 16v6", key: "tddt3s" }],
  ["path", { d: "M21 12.598V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5", key: "1glfrc" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 2v4", key: "1cmpym" }]
];
const CalendarPlus = createLucideIcon("calendar-plus", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode$2);
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
const EXPERIENCE_NAMES = {
  e1: "Chef's Tasting Menu",
  e2: "Wijnproeverij Avond",
  e3: "Seizoensmenu Lente"
};
function generateBookingRef() {
  return `ZR-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
}
function generateICS(date, time, name) {
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
    "SUMMARY:Reservering Restaurant ZenReserve",
    `DESCRIPTION:Beste ${name}\\, uw tafel is gereserveerd.`,
    "LOCATION:Restaurant ZenReserve\\, Grote Markt 1\\, 2000 Antwerpen",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}
function downloadICS(date, time, name) {
  const ics = generateICS(date, time, name);
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "zenreserve.ics";
  a.click();
  URL.revokeObjectURL(url);
}
function ConfirmationStep({
  date,
  time,
  partySize,
  form,
  experienceId,
  onReset
}) {
  const { t } = useTranslation("widget");
  const [visible, setVisible] = reactExports.useState(false);
  const [bookingRef] = reactExports.useState(() => generateBookingRef());
  reactExports.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  const formattedDate = date ? new Date(date).toLocaleDateString(void 0, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }) : "";
  const guestName = `${form.firstName ?? ""} ${form.lastName ?? ""}`.trim();
  const experienceName = experienceId ? EXPERIENCE_NAMES[experienceId] : null;
  const details = [
    {
      icon: CalendarPlus,
      label: t("confirmationStep.date"),
      value: formattedDate,
      color: "#22C55E"
    },
    {
      icon: Clock,
      label: t("confirmationStep.time"),
      value: time,
      color: "#3B82F6"
    },
    {
      icon: Users,
      label: t("confirmationStep.persons"),
      value: `${partySize} ${partySize === 1 ? t("confirmationStep.person") : t("confirmationStep.personsPlural")}`,
      color: "#D97706"
    },
    ...experienceName ? [
      {
        icon: MapPin,
        label: t("confirmationStep.experience"),
        value: experienceName,
        color: "#D97706"
      }
    ] : [],
    {
      icon: Mail,
      label: t("confirmationStep.emailConfirm"),
      value: form.email ?? "",
      color: "#6B7280"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "mx-auto h-20 w-20 rounded-full flex items-center justify-center transition-all duration-500",
          visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        ),
        style: { backgroundColor: "#22C55E1A" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          CircleCheck,
          {
            className: cn(
              "h-10 w-10 transition-all duration-700 delay-200",
              visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
            ),
            style: { color: "#22C55E" }
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold", style: { color: "#1F2937" }, children: t("confirmationStep.title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", style: { color: "#6B7280" }, children: t("confirmationStep.subtitle", { name: form.firstName }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "rounded-xl p-3 transition-all duration-500 delay-400",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        ),
        style: { backgroundColor: "#F9FAFB" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "#9CA3AF" }, children: t("confirmationStep.bookingRef") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono font-bold text-lg tracking-widest mt-0.5",
              style: { color: "#1F2937" },
              children: bookingRef
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "rounded-xl overflow-hidden transition-all duration-500 delay-500",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        ),
        style: { border: "1px solid #E2E8F0" },
        children: details.map(({ icon: Icon, label, value, color }, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 px-4 py-3 text-left",
            style: idx < details.length - 1 ? { borderBottom: "1px solid #F3F4F6" } : {},
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  style: { backgroundColor: `${color}1A` },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4", style: { color } })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "#9CA3AF" }, children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-sm font-semibold truncate capitalize",
                    style: { color: "#1F2937" },
                    children: value
                  }
                )
              ] })
            ]
          },
          label
        ))
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
              onClick: () => downloadICS(date, time, guestName),
              className: "flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-1.5 transition-all hover:opacity-80 active:scale-95",
              style: { backgroundColor: "#22C55E1A", color: "#22C55E" },
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
              className: "flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all hover:opacity-90 active:scale-95",
              style: { backgroundColor: "#22C55E", color: "#FFFFFF" },
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "#9CA3AF" }, children: t("confirmationStep.confirmationSent", { email: form.email }) })
  ] });
}
function getAvailableDates() {
  const dates = [];
  const now = /* @__PURE__ */ new Date();
  const d = new Date(now);
  d.setDate(d.getDate() + 1);
  while (dates.length < 30) {
    if (d.getDay() !== 2) {
      dates.push(d.toISOString().split("T")[0]);
    }
    d.setDate(d.getDate() + 1);
  }
  return dates;
}
const FULLY_BOOKED = ["2026-04-13", "2026-04-17"];
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year, month) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}
function DatePickerStep({
  selectedDate,
  onSelect
}) {
  const { t } = useTranslation("widget");
  const [loading, setLoading] = reactExports.useState(true);
  const [availableDates, setAvailableDates] = reactExports.useState([]);
  const today = /* @__PURE__ */ new Date();
  const [viewYear, setViewYear] = reactExports.useState(today.getFullYear());
  const [viewMonth, setViewMonth] = reactExports.useState(today.getMonth());
  const WEEKDAYS = t("dateStep.weekdays", { returnObjects: true });
  const MONTHS = t("dateStep.months", { returnObjects: true });
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      setAvailableDates(getAvailableDates());
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);
  reactExports.useEffect(() => {
    if (!loading && availableDates.length > 0 && !selectedDate) {
      const first = availableDates.find(
        (d) => !FULLY_BOOKED.includes(d) && viewYear === new Date(d).getFullYear() && viewMonth === new Date(d).getMonth()
      );
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
  function isAvailable(day) {
    const d = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return availableDates.includes(d) && !FULLY_BOOKED.includes(d);
  }
  function isFullyBooked(day) {
    const d = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return FULLY_BOOKED.includes(d);
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
  function isoDate(day) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "p",
      {
        className: "text-sm font-semibold flex items-center gap-1.5",
        style: { color: "#1F2937" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4", style: { color: "#22C55E" } }),
          t("dateStep.title")
        ]
      }
    ),
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
            canGoPrev ? "hover:bg-black/5 text-[#1F2937]" : "opacity-30 cursor-not-allowed text-[#9CA3AF]"
          ),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-sm", style: { color: "#1F2937" }, children: [
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
            canGoNext ? "hover:bg-black/5 text-[#1F2937]" : "opacity-30 cursor-not-allowed text-[#9CA3AF]"
          ),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7 gap-1 text-center", children: [
      WEEKDAYS.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-[10px] font-semibold uppercase tracking-wide py-1",
          style: { color: "#9CA3AF" },
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
        const booked = isFullyBooked(day);
        const iso = isoDate(day);
        const isSelected = selectedDate === iso;
        const disabled = past || !available && !booked;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            disabled: disabled || booked,
            onClick: () => !disabled && !booked && onSelect(iso),
            "aria-label": `${day} ${MONTHS[viewMonth]} ${viewYear}${booked ? `, ${t("dateStep.fullyBooked")}` : available ? `, ${t("dateStep.available")}` : ""}`,
            "aria-pressed": isSelected,
            className: cn(
              "relative h-9 w-full rounded-lg text-sm font-medium transition-all duration-200",
              isSelected && "scale-110 shadow-soft",
              !disabled && !booked && !isSelected && "hover:bg-black/5",
              disabled && !booked && "opacity-25 cursor-not-allowed",
              booked && "cursor-not-allowed"
            ),
            style: isSelected ? { backgroundColor: "#22C55E", color: "#FFFFFF" } : booked ? { color: "#EF4444" } : available ? { color: "#1F2937" } : { color: "#D1D5DB" },
            children: [
              day,
              booked && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full",
                  style: { backgroundColor: "#EF4444" },
                  "aria-hidden": "true"
                }
              )
            ]
          },
          day
        );
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-3 w-3 rounded-full",
            style: { backgroundColor: "#22C55E" },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: { color: "#6B7280" }, children: t("dateStep.available") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-3 w-3 rounded-full relative flex items-center justify-center",
            style: { backgroundColor: "#FEE2E2" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-1.5 w-1.5 rounded-full",
                style: { backgroundColor: "#EF4444" },
                "aria-hidden": "true"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: { color: "#6B7280" }, children: t("dateStep.fullyBooked") })
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
  "from-[#22C55E]/20 to-[#D97706]/20",
  "from-[#3B82F6]/20 to-[#22C55E]/20",
  "from-[#D97706]/20 to-[#3B82F6]/20"
];
function ExperienceStep({
  selectedExperienceId,
  onSelect,
  experiences = []
}) {
  const { t } = useTranslation("widget");
  const tagLabel = (tag) => {
    if (tag === "menu") return t("experienceStep.tagMenu");
    if (tag === "event") return t("experienceStep.tagEvent");
    return t("experienceStep.tagSpecial");
  };
  const noPreferenceSelected = selectedExperienceId === "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "p",
      {
        className: "text-sm font-semibold flex items-center gap-1.5",
        style: { color: "#1F2937" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChefHat, { className: "h-4 w-4", style: { color: "#D97706" } }),
          t("experienceStep.title"),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal text-xs ml-1", style: { color: "#9CA3AF" }, children: t("experienceStep.optional") })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => onSelect(""),
        "aria-pressed": noPreferenceSelected,
        className: cn(
          "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
          noPreferenceSelected ? "scale-[1.01]" : "hover:border-[#E2E8F0]"
        ),
        style: noPreferenceSelected ? { borderColor: "#22C55E", backgroundColor: "#22C55E0D" } : { borderColor: "#E2E8F0", backgroundColor: "#FFFFFF" },
        "data-ocid": "exp-no-preference",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", style: { color: "#1F2937" }, children: t("experienceStep.noPreference") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-0.5", style: { color: "#6B7280" }, children: t("experienceStep.noPreferenceSub") })
          ] }),
          noPreferenceSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0",
              style: { backgroundColor: "#22C55E" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-white", strokeWidth: 3 })
            }
          )
        ] })
      }
    ),
    experiences.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center py-4", style: { color: "#9CA3AF" }, children: t("experienceStep.noExperiences", "Geen ervaringen beschikbaar") }),
    experiences.map((exp, idx) => {
      const isSelected = selectedExperienceId === exp.id;
      const Icon = exp.tag ? TAG_ICONS[exp.tag] : Star;
      const gradientClass = GRADIENT_COLORS[idx % GRADIENT_COLORS.length];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onSelect(isSelected ? "" : exp.id),
          "aria-pressed": isSelected,
          "aria-label": `${exp.name} — €${(exp.price / 100).toFixed(0)} ${t("experienceStep.perPerson")}`,
          className: cn(
            "w-full rounded-xl border-2 text-left transition-all duration-200 overflow-hidden",
            isSelected ? "scale-[1.01] shadow-elevated" : "hover:shadow-soft"
          ),
          style: isSelected ? { borderColor: "#22C55E" } : { borderColor: "#E2E8F0" },
          "data-ocid": `exp-${exp.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "h-16 bg-gradient-to-br flex items-center justify-center",
                  gradientClass
                ),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Icon,
                  {
                    className: "h-8 w-8 opacity-40",
                    style: { color: "#D97706" }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "p-3",
                style: { backgroundColor: isSelected ? "#22C55E0D" : "#FFFFFF" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "font-semibold text-sm",
                          style: { color: "#1F2937" },
                          children: exp.name
                        }
                      ),
                      exp.tag && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          className: "text-[10px] px-1.5 py-0 h-4 font-medium",
                          variant: "secondary",
                          children: tagLabel(exp.tag)
                        }
                      )
                    ] }),
                    exp.description && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs mt-1 line-clamp-2",
                        style: { color: "#6B7280" },
                        children: exp.description
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0 flex flex-col items-end gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "p",
                      {
                        className: "font-bold text-sm",
                        style: { color: isSelected ? "#22C55E" : "#D97706" },
                        children: [
                          "€",
                          (exp.price / 100).toFixed(0)
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px]", style: { color: "#9CA3AF" }, children: t("experienceStep.perPerson") }),
                    isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-5 w-5 rounded-full flex items-center justify-center",
                        style: { backgroundColor: "#22C55E" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-white", strokeWidth: 3 })
                      }
                    )
                  ] })
                ] })
              }
            )
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
const SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
function PartySizeStep({ partySize, onSelect }) {
  const { t } = useTranslation("widget");
  const [hasBabies, setHasBabies] = reactExports.useState(false);
  function decrement() {
    if (partySize > 1) onSelect(partySize - 1);
  }
  function increment() {
    if (partySize < 12) onSelect(partySize + 1);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "p",
      {
        className: "text-sm font-semibold flex items-center gap-1.5",
        style: { color: "#1F2937" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4", style: { color: "#22C55E" } }),
          t("partySizeStep.title")
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-5 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: decrement,
          disabled: partySize <= 1,
          "aria-label": t("partySizeStep.decreaseLabel"),
          className: cn(
            "h-11 w-11 rounded-full border-2 flex items-center justify-center transition-all duration-200 font-bold",
            partySize > 1 ? "hover:scale-110 active:scale-95" : "opacity-30 cursor-not-allowed"
          ),
          style: partySize > 1 ? { borderColor: "#22C55E", color: "#22C55E" } : { borderColor: "#E2E8F0", color: "#9CA3AF" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-5 w-5", strokeWidth: 2.5 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center min-w-[4rem]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "block text-5xl font-bold transition-all duration-200",
            style: { color: "#1F2937" },
            children: partySize
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: { color: "#6B7280" }, children: partySize === 1 ? t("partySizeStep.person") : t("partySizeStep.persons") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: increment,
          disabled: partySize >= 12,
          "aria-label": t("partySizeStep.increaseLabel"),
          className: cn(
            "h-11 w-11 rounded-full border-2 flex items-center justify-center transition-all duration-200 font-bold",
            partySize < 12 ? "hover:scale-110 active:scale-95" : "opacity-30 cursor-not-allowed"
          ),
          style: partySize < 12 ? {
            borderColor: "#22C55E",
            color: "#22C55E",
            backgroundColor: "#22C55E1A"
          } : { borderColor: "#E2E8F0", color: "#9CA3AF" },
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
            partySize === size ? "scale-110 shadow-soft" : "hover:scale-105"
          ),
          style: partySize === size ? { backgroundColor: "#22C55E", color: "#FFFFFF" } : { backgroundColor: "#F3F4F6", color: "#1F2937" },
          children: size
        },
        size
      ))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "label",
      {
        className: "flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all",
        style: hasBabies ? { backgroundColor: "#22C55E0D" } : { backgroundColor: "#F9FAFB" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "h-5 w-9 rounded-full transition-all duration-300 relative flex-shrink-0"
              ),
              style: { backgroundColor: hasBabies ? "#22C55E" : "#D1D5DB" },
              "aria-hidden": "true",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: cn(
                    "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-300",
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
              "aria-label": t("partySizeStep.babies")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", style: { color: "#1F2937" }, children: t("partySizeStep.babies") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "#6B7280" }, children: t("partySizeStep.babiesSub") })
          ] })
        ]
      }
    ),
    partySize > 8 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "text-sm text-center rounded-xl px-4 py-2.5",
        style: { backgroundColor: "#FEF3C7", color: "#D97706" },
        children: t("partySizeStep.largeGroup")
      }
    )
  ] });
}
const DEPOSIT_PER_PERSON = 20;
function formatEur(amount) {
  return `€${amount.toFixed(2).replace(".", ",")}`;
}
function PaymentStep({ partySize, onPaymentSuccess }) {
  const { t } = useTranslation("widget");
  const totalDeposit = partySize * DEPOSIT_PER_PERSON;
  const [cardNumber, setCardNumber] = reactExports.useState("");
  const [expiry, setExpiry] = reactExports.useState("");
  const [cvc, setCvc] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [success, setSuccess] = reactExports.useState(false);
  function formatCardNumber(value) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }
  function formatExpiry(value) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  }
  function formatCvc(value) {
    return value.replace(/\D/g, "").slice(0, 4);
  }
  const isFormValid = cardNumber.replace(/\s/g, "").length === 16 && expiry.length === 5 && cvc.length >= 3 && name.trim().length > 2;
  async function handlePay() {
    if (!isFormValid) return;
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 1800));
    if (Math.random() > 0.1) {
      setSuccess(true);
      setLoading(false);
      setTimeout(onPaymentSuccess, 1200);
    } else {
      setError(t("paymentStep.errorDefault"));
      setLoading(false);
    }
  }
  if (success) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "mx-auto h-14 w-14 rounded-full flex items-center justify-center",
          style: { backgroundColor: "#22C55E1A" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-8 w-8", style: { color: "#22C55E" } })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", style: { color: "#1F2937" }, children: t("paymentStep.successTitle") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-0.5", style: { color: "#6B7280" }, children: t("paymentStep.successSub", { amount: formatEur(totalDeposit) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-1 w-24 mx-auto rounded-full overflow-hidden",
          style: { backgroundColor: "#E2E8F0" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full rounded-full animate-[grow_1.2s_ease-out_forwards]",
              style: { backgroundColor: "#22C55E" }
            }
          )
        }
      )
    ] });
  }
  const inputClass = "w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl p-4 flex items-center justify-between",
        style: { backgroundColor: "#FAF7F0", borderLeft: "3px solid #D97706" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium", style: { color: "#6B7280" }, children: t("paymentStep.deposit") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg mt-0.5", style: { color: "#1F2937" }, children: formatEur(totalDeposit) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs mt-0.5", style: { color: "#9CA3AF" }, children: [
              partySize,
              " ",
              t("paymentStep.depositNote"),
              " ×",
              " ",
              formatEur(DEPOSIT_PER_PERSON)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0",
              style: { backgroundColor: "#D977061A" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-6 w-6", style: { color: "#D97706" } })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "card-name",
            className: "block text-xs font-semibold",
            style: { color: "#374151" },
            children: t("paymentStep.cardName")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "card-name",
            type: "text",
            className: inputClass,
            style: { borderColor: "#E2E8F0", color: "#1F2937" },
            placeholder: "Jan Jansen",
            value: name,
            onChange: (e) => setName(e.target.value),
            autoComplete: "cc-name",
            "data-ocid": "input-card-name"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "card-number",
            className: "block text-xs font-semibold",
            style: { color: "#374151" },
            children: t("paymentStep.cardNumber")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "card-number",
              type: "text",
              inputMode: "numeric",
              className: cn(inputClass, "pr-10"),
              style: { borderColor: "#E2E8F0", color: "#1F2937" },
              placeholder: "1234 5678 9012 3456",
              value: cardNumber,
              onChange: (e) => setCardNumber(formatCardNumber(e.target.value)),
              autoComplete: "cc-number",
              "data-ocid": "input-card-number"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CreditCard,
            {
              className: "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4",
              style: { color: "#9CA3AF" }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "card-expiry",
              className: "block text-xs font-semibold",
              style: { color: "#374151" },
              children: t("paymentStep.expiry")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "card-expiry",
              type: "text",
              inputMode: "numeric",
              className: inputClass,
              style: { borderColor: "#E2E8F0", color: "#1F2937" },
              placeholder: "MM/JJ",
              value: expiry,
              onChange: (e) => setExpiry(formatExpiry(e.target.value)),
              autoComplete: "cc-exp",
              "data-ocid": "input-card-expiry"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "card-cvc",
              className: "block text-xs font-semibold",
              style: { color: "#374151" },
              children: t("paymentStep.cvc")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "card-cvc",
              type: "text",
              inputMode: "numeric",
              className: inputClass,
              style: { borderColor: "#E2E8F0", color: "#1F2937" },
              placeholder: "123",
              value: cvc,
              onChange: (e) => setCvc(formatCvc(e.target.value)),
              autoComplete: "cc-csc",
              "data-ocid": "input-card-cvc"
            }
          )
        ] })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-2 p-3 rounded-xl",
        style: { backgroundColor: "#FEF2F2" },
        role: "alert",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CircleAlert,
            {
              className: "h-4 w-4 flex-shrink-0 mt-0.5",
              style: { color: "#EF4444" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: "#EF4444" }, children: error })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: handlePay,
        disabled: !isFormValid || loading,
        className: cn(
          "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200",
          isFormValid && !loading ? "hover:opacity-90 active:scale-[0.98]" : "opacity-50 cursor-not-allowed"
        ),
        style: { backgroundColor: "#22C55E", color: "#FFFFFF" },
        "data-ocid": "payment-submit-btn",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4" }),
          loading ? t("paymentStep.processing") : t("paymentStep.payButton", { amount: formatEur(totalDeposit) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "p",
      {
        className: "text-center text-xs flex items-center justify-center gap-1",
        style: { color: "#9CA3AF" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3" }),
          t("paymentStep.secureNote")
        ]
      }
    )
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
function TimeSlotStep({
  selectedDate,
  selectedTime,
  partySize,
  onSelect,
  onWaitlist,
  availableSlots
}) {
  const { t } = useTranslation("widget");
  const [loading, setLoading] = reactExports.useState(false);
  const [slots, setSlots] = reactExports.useState([]);
  const allFull = slots.length > 0 && slots.every((s) => s.status === "full");
  reactExports.useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    if (availableSlots && availableSlots.length > 0) {
      const mapped = availableSlots.map((s) => {
        const remaining = s.capacity - s.booked;
        const status = !s.available || remaining === 0 ? "full" : remaining < partySize ? "limited" : "available";
        return {
          time: s.time,
          seats: remaining,
          totalSeats: s.capacity,
          status
        };
      });
      setSlots(mapped);
      setLoading(false);
    } else {
      setSlots([]);
      setLoading(false);
    }
  }, [selectedDate, partySize, availableSlots]);
  const formattedDate = selectedDate ? new Date(selectedDate).toLocaleDateString(void 0, {
    weekday: "long",
    day: "numeric",
    month: "long"
  }) : "";
  if (loading) {
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "p",
        {
          className: "text-sm font-semibold flex items-center gap-1.5",
          style: { color: "#1F2937" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4", style: { color: "#22C55E" } }),
            t("timeStep.title")
          ]
        }
      ),
      formattedDate && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-0.5 capitalize", style: { color: "#6B7280" }, children: formattedDate })
    ] }),
    slots.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "mx-auto h-12 w-12 rounded-full flex items-center justify-center",
          style: { backgroundColor: "#F3F4F6" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-6 w-6", style: { color: "#9CA3AF" } })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", style: { color: "#1F2937" }, children: t("timeStep.noSlots", "Geen tijdsloten beschikbaar") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "#6B7280" }, children: t(
        "timeStep.noSlotsSub",
        "Kies een andere datum of schrijf je in op de wachtlijst."
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onWaitlist,
          className: "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90",
          style: { backgroundColor: "#3B82F6", color: "#FFFFFF" },
          "data-ocid": "waitlist-btn",
          children: t("timeStep.waitlistCta")
        }
      )
    ] }),
    allFull && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "mx-auto h-12 w-12 rounded-full flex items-center justify-center",
          style: { backgroundColor: "#FEE2E2" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-6 w-6", style: { color: "#EF4444" } })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", style: { color: "#1F2937" }, children: t("timeStep.allFull") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", style: { color: "#6B7280" }, children: t("timeStep.allFullSub") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onWaitlist,
          className: "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90",
          style: { backgroundColor: "#3B82F6", color: "#FFFFFF" },
          "data-ocid": "waitlist-btn",
          children: t("timeStep.waitlistCta")
        }
      )
    ] }),
    !allFull && slots.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
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
              "aria-label": `${slot.time}, ${statusLabel}, ${slot.seats} ${t("timeStep.places")}`,
              "aria-pressed": isSelected,
              className: cn(
                "w-full py-3 px-2 rounded-xl border-2 text-center transition-all duration-200",
                isFull && "cursor-not-allowed opacity-50",
                !isFull && !isSelected && "hover:border-primary/40 hover:scale-[1.02]",
                isSelected && "scale-105"
              ),
              style: isSelected ? { borderColor: "#22C55E", backgroundColor: "#22C55E1A" } : isFull ? {
                borderColor: "#E2E8F0",
                backgroundColor: "#F9FAFB"
              } : isLimited ? {
                borderColor: "#D9770640",
                backgroundColor: "#D977061A"
              } : {
                borderColor: "#E2E8F0",
                backgroundColor: "#FFFFFF"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "block text-sm font-bold leading-tight",
                    style: isSelected ? { color: "#22C55E" } : isFull ? { color: "#9CA3AF" } : isLimited ? { color: "#D97706" } : { color: "#1F2937" },
                    children: slot.time
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "block text-[10px] mt-0.5 font-medium",
                    style: isSelected ? { color: "#22C55E" } : isFull ? { color: "#EF4444" } : isLimited ? { color: "#D97706" } : { color: "#6B7280" },
                    children: statusLabel
                  }
                ),
                !isFull && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "block text-[9px] mt-0.5",
                    style: { color: "#9CA3AF" },
                    children: [
                      slot.seats,
                      " ",
                      t("timeStep.places")
                    ]
                  }
                )
              ]
            }
          ) }, slot.time);
        })
      }
    )
  ] });
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
  partySize
}) {
  const { t } = useTranslation(["widget", "shared"]);
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [preferredTime, setPreferredTime] = reactExports.useState("");
  const [size, setSize] = reactExports.useState(partySize ?? 2);
  const [loading, setLoading] = reactExports.useState(false);
  const [success, setSuccess] = reactExports.useState(false);
  const firstInputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        var _a;
        return (_a = firstInputRef.current) == null ? void 0 : _a.focus();
      }, 100);
    }
  }, [isOpen]);
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
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1e3));
    setSuccess(true);
    setLoading(false);
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
                        "data-ocid": "waitlist-close-btn",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-5", children: success ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6 space-y-4", children: [
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
                    "data-ocid": "waitlist-done-btn",
                    children: t("shared:actions.close")
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", noValidate: true, children: [
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
                      "data-ocid": "waitlist-input-name"
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
                      "data-ocid": "waitlist-input-email"
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
                      "data-ocid": "waitlist-input-phone"
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
                        "data-ocid": "waitlist-select-time",
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
                        "data-ocid": "waitlist-select-size",
                        children: Array.from({ length: 12 }, (_, i) => i + 1).map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: n, children: n }, n))
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: onClose,
                      className: "flex-1 py-3 rounded-xl border font-medium text-sm transition-all hover:bg-black/5",
                      style: { borderColor: "#E2E8F0", color: "#6B7280" },
                      children: t("shared:actions.cancel")
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "submit",
                      disabled: !name || !email || loading,
                      className: cn(
                        "flex-1 py-3 rounded-xl font-bold text-sm transition-all",
                        name && email && !loading ? "hover:opacity-90 active:scale-[0.98]" : "opacity-50 cursor-not-allowed"
                      ),
                      style: { backgroundColor: "#3B82F6", color: "#FFFFFF" },
                      "data-ocid": "waitlist-submit-btn",
                      children: loading ? t("shared:actions.loading") : t("widget:waitlist.joinButton")
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
  var _a, _b, _c;
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
  const EXTENDED_STEPS = [
    { id: 1, label: t("dateStep.title") },
    { id: 2, label: t("timeStep.title") },
    { id: 3, label: t("partySizeStep.title") },
    { id: 4, label: t("experienceStep.title") },
    { id: 5, label: t("detailsStep.title") },
    { id: 6, label: t("paymentStep.title") }
  ];
  function goNext() {
    if (step < 6) {
      setSlideDirection("forward");
      setAnimating(true);
      setTimeout(() => {
        setStep((s) => s + 1);
        setAnimating(false);
      }, 120);
    }
  }
  function goBack() {
    if (step > 1) {
      setSlideDirection("back");
      setAnimating(true);
      setTimeout(() => {
        setStep((s) => s - 1);
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
  const isNextDisabled = step === 1 && !selectedDate || step === 2 && !selectedTime || step === 5 && (!((_a = form.firstName) == null ? void 0 : _a.trim()) || !((_b = form.lastName) == null ? void 0 : _b.trim()) || !((_c = form.email) == null ? void 0 : _c.trim()));
  const nextLabel = step === 5 ? t("nav.toPayment") : t("nav.next");
  if (confirmed) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-2xl shadow-elevated overflow-hidden",
        style: { backgroundColor: "#FFFFFF" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pt-6 pb-4", style: { backgroundColor: "#FAF7F0" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-10 w-10 rounded-xl flex items-center justify-center",
                style: { backgroundColor: "#22C55E1A" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChefHat, { className: "h-5 w-5", style: { color: "#22C55E" } })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "font-semibold text-lg",
                  style: { color: "#1F2937" },
                  children: "Restaurant ZenReserve"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "#6B7280" }, children: "Antwerpen · Grote Markt 1" })
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
              onReset: handleReset
            }
          ) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-2xl shadow-elevated overflow-hidden",
        style: { backgroundColor: "#FFFFFF" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-5 pb-4", style: { backgroundColor: "#FAF7F0" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  style: { backgroundColor: "#22C55E1A" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChefHat, { className: "h-5 w-5", style: { color: "#22C55E" } })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h1",
                  {
                    className: "font-bold text-base leading-tight",
                    style: { color: "#1F2937" },
                    children: t("nav.bookTable")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs truncate", style: { color: "#6B7280" }, children: "Restaurant ZenReserve · Antwerpen" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StepIndicator, { steps: EXTENDED_STEPS, currentStep: step })
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
                  DatePickerStep,
                  {
                    selectedDate,
                    onSelect: (date) => {
                      setSelectedDate(date);
                      setSelectedTime("");
                    }
                  }
                ),
                step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TimeSlotStep,
                  {
                    selectedDate,
                    selectedTime,
                    partySize,
                    onSelect: setSelectedTime,
                    onWaitlist: () => setShowWaitlist(true)
                  }
                ),
                step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(PartySizeStep, { partySize, onSelect: setPartySize }),
                step === 4 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ExperienceStep,
                  {
                    selectedExperienceId: selectedExperience,
                    onSelect: setSelectedExperience
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
                    onPaymentSuccess: () => setConfirmed(true)
                  }
                )
              ]
            }
          ),
          step !== 6 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex gap-3 px-6 py-4",
              style: { borderTop: "1px solid #F3F4F6" },
              children: [
                step > 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: goBack,
                    className: "flex items-center gap-1 px-4 py-3 rounded-xl border font-medium text-sm transition-all hover:bg-black/5 active:scale-[0.97]",
                    style: { borderColor: "#E2E8F0", color: "#6B7280" },
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
                      "flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-sm transition-all",
                      !isNextDisabled ? "hover:opacity-90 active:scale-[0.98]" : "opacity-40 cursor-not-allowed"
                    ),
                    style: { backgroundColor: "#22C55E", color: "#FFFFFF" },
                    "data-ocid": "widget-next-btn",
                    children: [
                      nextLabel,
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
                    ]
                  }
                )
              ]
            }
          ),
          step >= 2 && selectedDate && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-6 py-2.5 flex items-center gap-3 flex-wrap",
              style: {
                backgroundColor: "#F9FAFB",
                borderTop: step === 6 ? "1px solid #F3F4F6" : void 0
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SummaryPill,
                  {
                    label: new Date(selectedDate).toLocaleDateString(void 0, {
                      day: "numeric",
                      month: "short"
                    })
                  }
                ),
                selectedTime && /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryPill, { label: selectedTime }),
                step >= 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SummaryPill,
                  {
                    label: `${partySize} ${partySize === 1 ? t("partySizeStep.person") : t("partySizeStep.persons")}`
                  }
                )
              ]
            }
          )
        ]
      }
    ),
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
      style: { backgroundColor: "#22C55E1A", color: "#22C55E" },
      children: label
    }
  );
}
export {
  WidgetPage as default
};
