import { j as jsxRuntimeExports, r as reactExports, u as useTranslation, J as ChefHat, N as LanguageSwitcher, C as CalendarDays, U as Users } from "./index-DYFUyfbw.js";
import { d as useAvailableSlots } from "./useReservation-4iWX_rcr.js";
import WidgetPage from "./WidgetPage-B3Fz8OBR.js";
import { A as AnimatePresence, m as motion } from "./proxy-Dqo1clYu.js";
import { C as ChevronLeft } from "./chevron-left-DZXs_YO1.js";
import "./map-pin-zd_x6WNr.js";
import "./mail-Dr9le5WV.js";
import "./circle-check-4uI1R4ln.js";
import "./arrow-right-2-gRcHxE.js";
import "./calendar-DuUx5-b9.js";
import "./chevron-right-LZZMkfeM.js";
import "./check-B47oZVza.js";
import "./user-BzH6B6oF.js";
import "./minus-hZf17MQi.js";
import "./plus-BLj3PxS_.js";
import "./shield-BJh4Xjjz.js";
import "./credit-card-COSlNMdU.js";
import "./circle-alert-DhAePUEQ.js";
function ExperienceCard({
  experience,
  isSelected,
  onSelect
}) {
  const tagColors = {
    menu: "#3B82F6",
    event: "#D97706",
    special: "#22C55E"
  };
  const tagColor = experience.tag ? tagColors[experience.tag] : "#3B82F6";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => onSelect(experience.id),
      className: "flex-shrink-0 text-left transition-all active:scale-[0.97]",
      style: {
        width: 200,
        backgroundColor: isSelected ? "#22C55E0D" : "#FFFFFF",
        border: `2px solid ${isSelected ? "#22C55E" : "#E2E8F0"}`,
        borderRadius: 12,
        padding: "14px 14px",
        cursor: "pointer"
      },
      "data-ocid": `experience-card-${experience.id}`,
      children: [
        experience.tag && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mb-2",
            style: { backgroundColor: `${tagColor}1A`, color: tagColor },
            children: experience.tag
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "font-semibold text-sm leading-snug mb-1",
            style: { color: "#1F2937" },
            children: experience.name
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs leading-snug mb-2 line-clamp-2",
            style: { color: "#6B7280" },
            children: experience.description
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-sm", style: { color: "#22C55E" }, children: [
          "€",
          (experience.price / 100).toFixed(0),
          " p.p."
        ] })
      ]
    }
  );
}
function useRestaurantConfig() {
  return {
    data: null,
    isLoading: false,
    experiences: []
  };
}
function useRestaurantAvailability(date, partySize) {
  const query = useAvailableSlots(date, partySize);
  return {
    ...query,
    data: query.data ?? [],
    isLoading: query.isLoading || !query.data && !!date && partySize > 0
  };
}
function useSearchFilters() {
  function readFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get("date") ?? "";
    const guestsParam = Number(params.get("guests")) || 2;
    const expParam = params.get("experience") ?? "";
    return { date: dateParam, guests: guestsParam, experienceId: expParam };
  }
  const [filters, setFilters] = reactExports.useState(readFromUrl);
  reactExports.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get("date") ?? "";
    const guestsParam = Number(params.get("guests")) || 2;
    const expParam = params.get("experience") ?? "";
    setFilters({
      date: dateParam,
      guests: guestsParam,
      experienceId: expParam
    });
  }, []);
  const updateFilters = reactExports.useCallback((updates) => {
    setFilters((prev) => {
      const next = { ...prev, ...updates };
      const params = new URLSearchParams();
      if (next.date) params.set("date", next.date);
      if (next.guests !== 2) params.set("guests", String(next.guests));
      if (next.experienceId) params.set("experience", next.experienceId);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, "", newUrl);
      return next;
    });
  }, []);
  return { filters, updateFilters };
}
function SkeletonSlot() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "animate-pulse rounded-xl",
      style: { height: 52, backgroundColor: "#E5E7EB", minWidth: 80 }
    }
  );
}
function getSlotStyle(slot) {
  if (!slot.available) {
    return {
      bg: "#F9FAFB",
      border: "#E2E8F0",
      text: "#9CA3AF",
      label: "vol"
    };
  }
  const ratio = slot.booked / slot.capacity;
  if (ratio >= 0.75) {
    return {
      bg: "#FFF7ED",
      border: "#D97706",
      text: "#D97706",
      label: "beperkt"
    };
  }
  return { bg: "#F0FDF4", border: "#22C55E", text: "#22C55E", label: "vrij" };
}
function GuestSearchPage() {
  const { t } = useTranslation(["app", "shared"]);
  const { filters, updateFilters } = useSearchFilters();
  const {
    data: restaurant,
    experiences
  } = useRestaurantConfig();
  const { data: slots, isLoading: slotsLoading } = useRestaurantAvailability(
    filters.date,
    filters.guests
  );
  const [selectedSlot, setSelectedSlot] = reactExports.useState(null);
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  function handleSlotClick(time) {
    setSelectedSlot({
      date: filters.date,
      time,
      partySize: filters.guests
    });
  }
  const showSlots = !!filters.date && filters.guests > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen flex flex-col",
      style: { backgroundColor: "#FAF7F0", fontFamily: "Inter, sans-serif" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "#main-content",
            className: "sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:rounded-md focus:font-medium",
            style: { backgroundColor: "#22C55E", color: "#FFFFFF" },
            children: t("shared:accessibility.skipToContent")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "header",
          {
            className: "sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b",
            style: {
              backgroundColor: "#FFFFFF",
              borderColor: "#E2E8F0",
              boxShadow: "0 1px 8px rgba(31,41,55,0.07)"
            },
            "data-ocid": "guest-app-header",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: "/app",
                  className: "flex items-center gap-2 no-underline transition-opacity hover:opacity-80",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        style: { backgroundColor: "#22C55E1A" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChefHat, { className: "h-4 w-4", style: { color: "#22C55E" } })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-bold text-base",
                        style: { color: "#1F2937", letterSpacing: "-0.01em" },
                        children: "ZenReserve"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageSwitcher, { variant: "header" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "main",
          {
            id: "main-content",
            className: "flex-1 w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: selectedSlot ? (
              /* ── Inline widget view ── */
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 24 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -16 },
                  transition: { duration: 0.28, ease: "easeOut" },
                  className: "flex flex-col gap-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => setSelectedSlot(null),
                        className: "flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70 self-start",
                        style: { color: "#6B7280" },
                        "data-ocid": "back-to-search-btn",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }),
                          t("app:booking.backToSearch")
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      WidgetPage,
                      {
                        initialDate: selectedSlot.date,
                        initialTime: selectedSlot.time,
                        initialPartySize: selectedSlot.partySize,
                        initialStep: selectedSlot.time ? 4 : 1
                      }
                    )
                  ]
                },
                "widget-inline"
              )
            ) : (
              /* ── Search view ── */
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -16 },
                  transition: { duration: 0.24, ease: "easeOut" },
                  className: "flex flex-col gap-6",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "h1",
                        {
                          className: "font-bold mb-1",
                          style: { fontSize: 28, color: "#1F2937", lineHeight: 1.25 },
                          children: t("app:search.title")
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: "#6B7280" }, children: t("app:search.subtitle") })
                    ] }),
                    null,
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "rounded-2xl p-4 flex flex-col sm:flex-row gap-3",
                        style: {
                          backgroundColor: "#FFFFFF",
                          boxShadow: "0 2px 12px rgba(31,41,55,0.08)"
                        },
                        "data-ocid": "search-bar",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex-1 flex flex-col gap-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "span",
                              {
                                className: "text-xs font-semibold flex items-center gap-1",
                                style: { color: "#6B7280" },
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-3.5 w-3.5" }),
                                  t("app:booking.selectedDate")
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "input",
                              {
                                type: "date",
                                value: filters.date,
                                min: today,
                                onChange: (e) => updateFilters({ date: e.target.value }),
                                className: "rounded-lg border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2",
                                style: {
                                  borderColor: "#E2E8F0",
                                  color: "#1F2937",
                                  backgroundColor: "#FAF7F0",
                                  height: 44
                                },
                                "data-ocid": "search-date-input"
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "label",
                            {
                              className: "flex flex-col gap-1",
                              style: { minWidth: 120 },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  "span",
                                  {
                                    className: "text-xs font-semibold flex items-center gap-1",
                                    style: { color: "#6B7280" },
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
                                      t("app:search.guestsLabel")
                                    ]
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "select",
                                  {
                                    value: filters.guests,
                                    onChange: (e) => updateFilters({ guests: Number(e.target.value) }),
                                    className: "rounded-lg border px-3 text-sm font-medium focus:outline-none focus:ring-2",
                                    style: {
                                      borderColor: "#E2E8F0",
                                      color: "#1F2937",
                                      backgroundColor: "#FAF7F0",
                                      height: 44
                                    },
                                    "data-ocid": "search-guests-select",
                                    children: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: n, children: [
                                      n,
                                      " ",
                                      n === 1 ? t("app:search.guest") : t("app:search.guests")
                                    ] }, n))
                                  }
                                )
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => {
                                var _a;
                                (_a = document.getElementById("availability-section")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
                              },
                              className: "rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-[0.97] flex items-center justify-center self-end",
                              style: {
                                height: 48,
                                minWidth: 100,
                                backgroundColor: "#22C55E",
                                color: "#FFFFFF",
                                paddingLeft: 20,
                                paddingRight: 20
                              },
                              "data-ocid": "search-submit-btn",
                              children: t("app:search.searchButton")
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "section",
                      {
                        id: "availability-section",
                        "data-ocid": "availability-section",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "h2",
                            {
                              className: "font-semibold mb-3 flex items-center gap-2",
                              style: { fontSize: 16, color: "#1F2937" },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  CalendarDays,
                                  {
                                    className: "h-4 w-4",
                                    style: { color: "#22C55E" }
                                  }
                                ),
                                t("app:restaurant.availability")
                              ]
                            }
                          ),
                          !showSlots ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: "text-sm py-4 text-center rounded-xl",
                              style: {
                                color: "#9CA3AF",
                                backgroundColor: "#FFFFFF",
                                border: "1px dashed #E2E8F0"
                              },
                              children: t("app:search.chooseDate")
                            }
                          ) : slotsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 gap-2", children: Array.from({ length: 6 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonSlot, {}, `slot-skel-${i + 1}`)) }) : slots && slots.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 gap-2", children: slots.map((slot) => {
                            const style = getSlotStyle(slot);
                            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "button",
                              {
                                type: "button",
                                disabled: !slot.available,
                                onClick: () => handleSlotClick(slot.time),
                                className: "rounded-xl text-sm font-bold flex flex-col items-center justify-center transition-all hover:opacity-90 active:scale-[0.97] disabled:cursor-not-allowed",
                                style: {
                                  height: 52,
                                  backgroundColor: style.bg,
                                  border: `1.5px solid ${style.border}`,
                                  color: style.text
                                },
                                "data-ocid": `time-slot-${slot.time.replace(":", "")}`,
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: slot.time }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, opacity: 0.8 }, children: style.label })
                                ]
                              },
                              slot.time
                            );
                          }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: "text-sm py-4 text-center rounded-xl",
                              style: {
                                color: "#9CA3AF",
                                backgroundColor: "#FFFFFF",
                                border: "1px dashed #E2E8F0"
                              },
                              "data-ocid": "no-slots-message",
                              children: t("app:search.noResults")
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "experiences-section", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "h2",
                        {
                          className: "font-semibold mb-3 flex items-center gap-2",
                          style: { fontSize: 16, color: "#1F2937" },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(ChefHat, { className: "h-4 w-4", style: { color: "#D97706" } }),
                            t("app:restaurant.experiences")
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "flex gap-3 overflow-x-auto pb-2",
                          style: { scrollbarWidth: "none" },
                          children: experiences.map((exp) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                            ExperienceCard,
                            {
                              experience: exp,
                              isSelected: filters.experienceId === exp.id,
                              onSelect: (id) => updateFilters({ experienceId: id })
                            },
                            exp.id
                          ))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "section",
                      {
                        className: "rounded-2xl p-5",
                        style: {
                          backgroundColor: "#FFFFFF",
                          boxShadow: "0 2px 12px rgba(31,41,55,0.06)"
                        },
                        "data-ocid": "opening-hours-section",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "h2",
                            {
                              className: "font-semibold mb-3",
                              style: { fontSize: 15, color: "#1F2937" },
                              children: t("app:restaurant.openingHours")
                            }
                          ),
                          restaurant == null ? void 0 : restaurant.openingHours
                        ]
                      }
                    )
                  ]
                },
                "search-view"
              )
            ) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "footer",
          {
            className: "py-5 px-4 flex flex-col items-center gap-2 border-t",
            style: { backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" },
            "data-ocid": "guest-app-footer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs", style: { color: "#9CA3AF" }, children: [
                "Aangedreven door",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "font-semibold hover:underline",
                    style: { color: "#22C55E" },
                    children: "caffeine.ai"
                  }
                ),
                " ",
                "· © ",
                (/* @__PURE__ */ new Date()).getFullYear()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageSwitcher, { variant: "footer" })
            ]
          }
        )
      ]
    }
  );
}
export {
  GuestSearchPage as default
};
