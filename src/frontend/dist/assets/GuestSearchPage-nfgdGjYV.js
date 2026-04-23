import { i as createLucideIcon, u as useTranslation, j as jsxRuntimeExports, r as reactExports, aF as useExtendedConfig, aG as useExperiences, aH as useAvailableSlots, k as useOpeningHoursConfig, aC as ChefHat, aE as LanguageSwitcher, q as AnimatePresence, s as motion, C as CalendarDays, U as Users, g as Clock } from "./index-BNayfcmF.js";
import { S as Star } from "./star-h0dWBoX6.js";
import { M as MapPin } from "./map-pin-J80tkmZT.js";
import { S as Skeleton } from "./skeleton-D2EeOrWT.js";
import WidgetPage from "./WidgetPage-DmPTdFcI.js";
import { C as ChevronLeft } from "./chevron-left-BG38Auax.js";
import "./mail-Bhz2n6KZ.js";
import "./calendar-B7oSQFN-.js";
import "./chevron-right-6-wY6xfI.js";
import "./user-Bl52wv8_.js";
import "./circle-alert-dyy_CREt.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8", key: "n7qcjb" }],
  [
    "path",
    { d: "M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7", key: "d0u48b" }
  ],
  ["path", { d: "m2.1 21.8 6.4-6.3", key: "yn04lh" }],
  ["path", { d: "m19 5-7 7", key: "194lzd" }]
];
const UtensilsCrossed = createLucideIcon("utensils-crossed", __iconNode);
function RestaurantCard({ restaurant, onBookNow }) {
  const { t } = useTranslation("app");
  const filled = Math.floor(4.8);
  const stars = Array.from({ length: 5 }, (_, i) => ({
    id: `star-${i + 1}`,
    active: i < filled
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full overflow-hidden",
      style: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(31,41,55,0.10)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative w-full overflow-hidden",
            style: { height: 240, backgroundColor: "#F3E8D6" },
            children: [
              restaurant.coverUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: restaurant.coverUrl,
                  alt: restaurant.name,
                  className: "w-full h-full object-cover",
                  loading: "eager"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-full h-full flex items-center justify-center",
                  style: {
                    background: "linear-gradient(135deg, #FAF7F0 0%, #F3E8D6 50%, #D97706 100%)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    UtensilsCrossed,
                    {
                      className: "h-16 w-16 opacity-30",
                      style: { color: "#D97706" }
                    }
                  )
                }
              ),
              restaurant.cuisine && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "absolute bottom-3 left-3 px-3 py-1 text-xs font-semibold rounded-full",
                  style: {
                    backgroundColor: "rgba(255,255,255,0.92)",
                    color: "#D97706",
                    backdropFilter: "blur(4px)"
                  },
                  children: restaurant.cuisine
                }
              ),
              restaurant.priceRange && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full",
                  style: {
                    backgroundColor: "rgba(34,197,94,0.92)",
                    color: "#FFFFFF",
                    backdropFilter: "blur(4px)"
                  },
                  children: restaurant.priceRange
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-4 pb-5", style: { backgroundColor: "#FAF7F0" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h1",
              {
                className: "font-bold leading-tight",
                style: { fontSize: 22, color: "#1F2937" },
                children: restaurant.name
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-shrink-0 mt-0.5", children: [
              stars.map(({ id, active }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Star,
                {
                  className: "h-4 w-4",
                  style: {
                    fill: active ? "#D97706" : "transparent",
                    color: "#D97706",
                    strokeWidth: 1.5
                  }
                },
                id
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-xs font-semibold ml-1",
                  style: { color: "#D97706" },
                  children: "4.8"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MapPin,
              {
                className: "h-3.5 w-3.5 flex-shrink-0",
                style: { color: "#9CA3AF" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm truncate", style: { color: "#6B7280" }, children: restaurant.address })
          ] }),
          restaurant.description && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm leading-relaxed mb-4",
              style: { color: "#4B5563" },
              children: restaurant.description
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: onBookNow,
              className: "w-full font-bold rounded-xl transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2",
              style: {
                height: 48,
                backgroundColor: "#22C55E",
                color: "#FFFFFF",
                fontSize: 15
              },
              "data-ocid": "restaurant-book-now-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "h-4 w-4" }),
                t("restaurant.bookNow")
              ]
            }
          )
        ] })
      ]
    }
  );
}
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
  var _a, _b;
  const configQuery = useExtendedConfig();
  const experiencesQuery = useExperiences();
  const cfg = configQuery.data;
  const restaurant = cfg ? {
    id: "restaurant",
    name: cfg.restaurantName,
    address: cfg.contactPhone,
    // contactPhone used as address fallback; general address not exposed
    phone: cfg.contactPhone,
    email: cfg.contactEmail,
    logoUrl: cfg.logoUrl ?? void 0,
    timezone: cfg.timezone,
    maxPartySize: Number(((_a = cfg.reservationRules) == null ? void 0 : _a.maxPartySize) ?? 12),
    stripeEnabled: ((_b = cfg.integrations) == null ? void 0 : _b.stripeEnabled) ?? false
  } : null;
  return {
    data: restaurant,
    isLoading: configQuery.isLoading || experiencesQuery.isLoading,
    isError: configQuery.isError || experiencesQuery.isError,
    experiences: experiencesQuery.data ?? []
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
function SkeletonRestaurantCard() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full overflow-hidden rounded-2xl bg-card shadow-subtle", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[240px] w-full rounded-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-4 pb-5 bg-card space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-3/5 rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-2/5 rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-4/5 rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-xl" })
    ] })
  ] });
}
function SkeletonSlot() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[52px] rounded-xl", style: { minWidth: 80 } });
}
function SkeletonExperienceCard() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "flex-shrink-0 rounded-xl h-[130px] w-[200px]" });
}
function getSlotAvailability(slot) {
  if (!slot.available) return "full";
  const ratio = slot.booked / slot.capacity;
  if (ratio >= 0.75) return "limited";
  return "free";
}
function getSlotClassName(availability) {
  if (availability === "full") {
    return "bg-destructive/10 text-destructive border border-destructive/30 opacity-60 cursor-not-allowed";
  }
  if (availability === "limited") {
    return "bg-[oklch(var(--status-orange)/0.1)] text-[oklch(var(--status-orange))] border border-[oklch(var(--status-orange)/0.3)] hover:bg-[oklch(var(--status-orange)/0.2)]";
  }
  return "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20";
}
const DAY_KEYS = [
  "days.monday",
  "days.tuesday",
  "days.wednesday",
  "days.thursday",
  "days.friday",
  "days.saturday",
  "days.sunday"
];
function GuestSearchPage() {
  const { t } = useTranslation(["app", "shared"]);
  const { filters, updateFilters } = useSearchFilters();
  const {
    data: restaurant,
    isLoading: restaurantLoading,
    experiences
  } = useRestaurantConfig();
  const { data: slots, isLoading: slotsLoading } = useRestaurantAvailability(
    filters.date,
    filters.guests
  );
  const { data: openingHoursConfig } = useOpeningHoursConfig();
  const [selectedSlot, setSelectedSlot] = reactExports.useState(null);
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  function handleSlotClick(time) {
    setSelectedSlot({
      date: filters.date,
      time,
      partySize: filters.guests
    });
  }
  function handleBookNow() {
    setSelectedSlot({
      date: filters.date,
      time: "",
      partySize: filters.guests
    });
  }
  const showSlots = !!filters.date && filters.guests > 0;
  const openingHoursByDay = Array.from({ length: 7 }, (_, dayIndex) => {
    const isFixedClosed = (openingHoursConfig == null ? void 0 : openingHoursConfig.fixedClosingDays.includes(dayIndex)) ?? false;
    const activeSvcs = (openingHoursConfig == null ? void 0 : openingHoursConfig.services.filter(
      (svc) => svc.enabledDays.includes(dayIndex)
    )) ?? [];
    return {
      dayIndex,
      isClosed: isFixedClosed || activeSvcs.length === 0,
      times: activeSvcs.map((svc) => `${svc.openTime} – ${svc.closeTime}`)
    };
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href: "#main-content",
        className: "sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:rounded-md focus:font-medium bg-primary text-primary-foreground",
        children: t("shared:accessibility.skipToContent")
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "header",
      {
        className: "sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b bg-card shadow-subtle",
        "data-ocid": "guest-app-header",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: "/app",
              className: "flex items-center gap-2 no-underline transition-opacity hover:opacity-80",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChefHat, { className: "h-4 w-4 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-base text-foreground tracking-[-0.01em]", children: "ZenReserve" })
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
                    className: "flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70 self-start text-muted-foreground",
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
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[1.75rem] leading-tight font-bold mb-1 text-foreground", children: t("app:search.title") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("app:search.subtitle") })
                ] }),
                restaurantLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRestaurantCard, {}) : restaurant ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  RestaurantCard,
                  {
                    restaurant,
                    onBookNow: handleBookNow
                  }
                ) : null,
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "rounded-2xl p-4 flex flex-col sm:flex-row gap-3 bg-card shadow-soft",
                    "data-ocid": "search-bar",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex-1 flex flex-col gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold flex items-center gap-1 text-muted-foreground", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-3.5 w-3.5" }),
                          t("app:booking.selectedDate")
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "date",
                            value: filters.date,
                            min: today,
                            onChange: (e) => updateFilters({ date: e.target.value }),
                            className: "rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-11",
                            "data-ocid": "search-date-input"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex flex-col gap-1 min-w-[120px]", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold flex items-center gap-1 text-muted-foreground", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
                          t("app:search.guestsLabel")
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "select",
                          {
                            value: filters.guests,
                            onChange: (e) => updateFilters({ guests: Number(e.target.value) }),
                            className: "rounded-lg border border-input bg-background px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-11",
                            "data-ocid": "search-guests-select",
                            children: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: n, children: [
                              n,
                              " ",
                              n === 1 ? t("app:search.guest") : t("app:search.guests")
                            ] }, n))
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            var _a;
                            (_a = document.getElementById("availability-section")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
                          },
                          className: "h-12 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-[0.97] flex items-center justify-center self-end bg-primary text-primary-foreground px-5 min-w-[100px]",
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
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-semibold mb-3 flex items-center gap-2 text-foreground", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-4 w-4 text-primary" }),
                        t("app:restaurant.availability")
                      ] }),
                      !showSlots ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm py-4 text-center rounded-xl text-muted-foreground bg-card border border-dashed border-border", children: t("app:search.chooseDate") }) : slotsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 gap-2", children: Array.from({ length: 6 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonSlot, {}, `slot-skel-${i + 1}`)) }) : slots && slots.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 gap-2", children: slots.map((slot) => {
                        const availability = getSlotAvailability(slot);
                        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            type: "button",
                            disabled: !slot.available,
                            onClick: () => handleSlotClick(slot.time),
                            className: `h-[52px] rounded-xl text-sm font-bold flex flex-col items-center justify-center transition-all active:scale-[0.97] ${getSlotClassName(availability)}`,
                            "data-ocid": `time-slot-${slot.time.replace(":", "")}`,
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: slot.time }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] opacity-80", children: t(`app:availability.${availability}`) })
                            ]
                          },
                          slot.time
                        );
                      }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-sm py-4 text-center rounded-xl text-muted-foreground bg-card border border-dashed border-border",
                          "data-ocid": "no-slots-message",
                          children: t("app:search.noResults")
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "experiences-section", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-semibold mb-3 flex items-center gap-2 text-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChefHat, { className: "h-4 w-4 text-[oklch(var(--status-orange))]" }),
                    t("app:restaurant.experiences")
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "flex gap-3 overflow-x-auto pb-2",
                      style: { scrollbarWidth: "none" },
                      children: restaurantLoading ? Array.from({ length: 3 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonExperienceCard, {}, `exp-skel-${i + 1}`)) : experiences.map((exp) => /* @__PURE__ */ jsxRuntimeExports.jsx(
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
                    className: "rounded-2xl p-5 bg-card shadow-soft",
                    "data-ocid": "opening-hours-section",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold mb-3 flex items-center gap-2 text-foreground", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-primary" }),
                        t("app:restaurant.openingHours")
                      ] }),
                      openingHoursConfig ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: openingHoursByDay.map(({ dayIndex, isClosed, times }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "li",
                        {
                          className: "flex justify-between text-sm text-foreground",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: t(`app:${DAY_KEYS[dayIndex]}`) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: isClosed ? "text-muted-foreground" : "text-foreground",
                                children: isClosed ? t("app:restaurant.closed") : times.join(" · ")
                              }
                            )
                          ]
                        },
                        dayIndex
                      )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ["mon", "tue", "wed", "thu", "fri"].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-full rounded" }, d)) })
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
        className: "py-5 px-4 flex flex-col items-center gap-2 border-t bg-card",
        "data-ocid": "guest-app-footer",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            t("app:footer.poweredBy"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "font-semibold hover:underline text-primary",
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
  ] });
}
export {
  GuestSearchPage as default
};
