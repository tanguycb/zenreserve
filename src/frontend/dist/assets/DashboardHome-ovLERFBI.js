import { u as useTranslation, j as jsxRuntimeExports, c as cn, a as useFloorState, L as Link, A as ArrowRight, C as CalendarDays, b as useKPIs, d as useReservations, e as useCapacityConfig, f as useWaitlist, U as Users, g as Clock, h as CircleX } from "./index-BNayfcmF.js";
import { S as Skeleton } from "./skeleton-D2EeOrWT.js";
import { T as TrendingUp, a as TrendingDown } from "./trending-up-BbNTaMPk.js";
import { S as SkeletonTableRow } from "./SkeletonCard-C6az2IVr.js";
import { S as StatusBadge } from "./StatusBadge-DHwE6svA.js";
import { C as CircleAlert } from "./circle-alert-dyy_CREt.js";
import { S as Sparkles } from "./sparkles-BJftqxYW.js";
function KPICard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
  trendPositive = true,
  trendLabel,
  className
}) {
  const { t } = useTranslation("dashboard");
  const label = trendLabel ?? t("kpi.vsYesterday");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "gradient-card rounded-2xl border border-border p-6 shadow-soft",
        "hover-scale-sm cursor-default",
        className
      ),
      "aria-label": `${title}: ${value}`,
      "data-ocid": "kpi-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground truncate", children: title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[32px] font-semibold leading-none text-foreground tracking-tight", children: value })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                iconBg
              ),
              "aria-hidden": "true",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-6 w-6", iconColor) })
            }
          )
        ] }),
        trend !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-1.5", children: [
          trendPositive ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            TrendingUp,
            {
              className: "h-3.5 w-3.5 shrink-0",
              style: { color: "#22C55E" },
              "aria-hidden": "true"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            TrendingDown,
            {
              className: "h-3.5 w-3.5 shrink-0",
              style: { color: "#EF4444" },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "text-xs font-semibold",
              style: { color: trendPositive ? "#22C55E" : "#EF4444" },
              children: [
                trendPositive ? "+" : "-",
                trend,
                "%"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: label })
        ] })
      ]
    }
  );
}
function SkeletonKPICardFull({ className }) {
  const { t } = useTranslation("dashboard");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "gradient-card rounded-2xl border border-border p-6 shadow-soft",
        className
      ),
      "aria-busy": "true",
      "aria-label": t("kpi.loading"),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20 mt-2" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-11 w-11 rounded-full shrink-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-3.5 rounded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
        ] })
      ]
    }
  );
}
function getOccupancyLevel(pct) {
  if (pct >= 80) return "high";
  if (pct >= 45) return "medium";
  return "low";
}
const LEVEL_CONFIG = {
  low: {
    label: "Rustig",
    labelKey: "barometerLow",
    color: "text-primary",
    glow: "drop-shadow-[0_0_8px_oklch(0.72_0.24_142)]",
    needleColor: "oklch(0.72 0.24 142)"
  },
  medium: {
    label: "Druk",
    labelKey: "barometerMedium",
    color: "text-[oklch(0.72_0.22_58)]",
    glow: "drop-shadow-[0_0_8px_oklch(0.72_0.22_58)]",
    needleColor: "oklch(0.72 0.22 58)"
  },
  high: {
    label: "Vol",
    labelKey: "barometerHigh",
    color: "text-destructive",
    glow: "drop-shadow-[0_0_8px_oklch(0.65_0.24_25)]",
    needleColor: "oklch(0.65 0.24 25)"
  }
};
function OccupancyGauge({ pct, level }) {
  const config = LEVEL_CONFIG[level];
  const clampedPct = Math.min(Math.max(pct, 0), 100);
  const needleAngle = -90 + clampedPct / 100 * 180;
  const cx = 80;
  const cy = 80;
  const r = 60;
  function polarToXY(angleDeg, radius) {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return {
      x: cx + radius * Math.sin(rad),
      y: cy - radius * Math.cos(rad)
    };
  }
  function arcPath(startAngle, endAngle) {
    const start = polarToXY(startAngle, r);
    const end = polarToXY(endAngle, r);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
  }
  const needleRad = needleAngle * Math.PI / 180;
  const needleTip = {
    x: cx + (r - 8) * Math.cos(needleRad),
    y: cy + (r - 8) * Math.sin(needleRad)
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      viewBox: "0 0 160 92",
      className: "w-full max-w-[200px] mx-auto",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: arcPath(180, 360),
            fill: "none",
            stroke: "oklch(0.25 0.01 240)",
            strokeWidth: "12",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: arcPath(180, 240),
            fill: "none",
            stroke: "oklch(0.72 0.24 142)",
            strokeWidth: "12",
            strokeLinecap: "round",
            opacity: "0.9"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: arcPath(240, 300),
            fill: "none",
            stroke: "oklch(0.72 0.22 58)",
            strokeWidth: "12",
            strokeLinecap: "round",
            opacity: "0.9"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: arcPath(300, 360),
            fill: "none",
            stroke: "oklch(0.65 0.24 25)",
            strokeWidth: "12",
            strokeLinecap: "round",
            opacity: "0.9"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: cx,
            y1: cy,
            x2: needleTip.x,
            y2: needleTip.y,
            stroke: config.needleColor,
            strokeWidth: "3",
            strokeLinecap: "round",
            style: { filter: `drop-shadow(0 0 4px ${config.needleColor})` }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx, cy, r: "5", fill: config.needleColor }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx, cy, r: "3", fill: "oklch(0.15 0.01 240)" })
      ]
    }
  );
}
function MiniOccupancyWidget({
  reservations,
  className
}) {
  var _a;
  const { t } = useTranslation("dashboard");
  const { data: floorState, isLoading: floorLoading } = useFloorState();
  const totalCapacity = ((_a = floorState == null ? void 0 : floorState.tables) == null ? void 0 : _a.reduce((sum, tbl) => sum + Number(tbl.capacity), 0)) ?? 40;
  const capacity = totalCapacity > 0 ? totalCapacity : 40;
  const totalReserved = reservations.filter((r) => r.status !== "cancelled" && r.status !== "departed").reduce((sum, r) => sum + r.partySize, 0);
  const occupancyPct = capacity > 0 ? Math.round(totalReserved / capacity * 100) : 0;
  const level = getOccupancyLevel(occupancyPct);
  const config = LEVEL_CONFIG[level];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "gradient-card rounded-2xl border border-border shadow-soft flex flex-col",
        className
      ),
      "data-ocid": "mini-occupancy-widget",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground", children: t("dashboard:home.occupancyWidget", "Bezetting vandaag") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("dashboard:home.barometerSubtitle", "Drukte barometer") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col items-center justify-center px-5 py-5 gap-3", children: floorLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 w-full flex flex-col items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[92px] w-[200px] rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-24 rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(OccupancyGauge, { pct: occupancyPct, level }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-semibold text-sm border",
                level === "low" && "bg-primary/10 border-primary/30 text-primary",
                level === "medium" && "bg-[oklch(0.72_0.22_58)]/10 border-[oklch(0.72_0.22_58)]/30 text-[oklch(0.72_0.22_58)]",
                level === "high" && "bg-destructive/10 border-destructive/30 text-destructive"
              ),
              "data-ocid": "occupancy-level-badge",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn("h-2.5 w-2.5 rounded-full animate-pulse", {
                      "bg-primary": level === "low",
                      "bg-[oklch(0.72_0.22_58)]": level === "medium",
                      "bg-destructive": level === "high"
                    })
                  }
                ),
                t(`dashboard:home.${config.labelKey}`, config.label)
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: cn("text-3xl font-bold tabular-nums", config.color),
                children: [
                  occupancyPct,
                  "%"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
              totalReserved,
              " / ",
              capacity,
              " ",
              t("dashboard:home.barometerSeats", "plaatsen")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex justify-between text-[10px] text-muted-foreground mt-1 px-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-medium", children: t("dashboard:home.barometerLow", "Rustig") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[oklch(0.72_0.22_58)] font-medium", children: t("dashboard:home.barometerMedium", "Druk") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive font-medium", children: t("dashboard:home.barometerHigh", "Vol") })
          ] })
        ] }) })
      ]
    }
  );
}
const SKELETON_KEYS = ["r-sk-1", "r-sk-2", "r-sk-3", "r-sk-4", "r-sk-5"];
function getInitials(name) {
  return name.split(" ").map((n) => n[0]).filter(Boolean).join("").slice(0, 2).toUpperCase();
}
function formatTime(time) {
  return time;
}
const STATUS_AVATAR_COLOR = {
  confirmed: "bg-primary/20 text-primary",
  pending: "bg-accent/20 text-accent",
  cancelled: "bg-destructive/20 text-destructive",
  waitlist: "bg-secondary/20 text-secondary",
  seated: "bg-primary/25 text-primary",
  completed: "bg-muted text-muted-foreground",
  no_show: "bg-destructive/15 text-destructive",
  not_arrived: "bg-muted/50 text-muted-foreground",
  late: "bg-[oklch(0.72_0.22_58)]/20 text-[oklch(0.72_0.22_58)]",
  departed: "bg-muted/30 text-muted-foreground"
};
function RecentReservations({
  reservations,
  isLoading,
  className
}) {
  const { t } = useTranslation("dashboard");
  const sorted = [...reservations].sort((a, b) => a.time.localeCompare(b.time)).slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "gradient-card rounded-2xl border border-border shadow-soft flex flex-col",
        className
      ),
      "data-ocid": "recent-reservations-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground", children: t("dashboard:home.recentReservations", "Reserveringen vandaag") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/dashboard/reservations",
              className: "flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded",
              "data-ocid": "reservations-view-all",
              children: [
                t("dashboard:home.viewAll", "Alles tonen"),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5", "aria-hidden": "true" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonTableRow, {}, k)) }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-12 text-center px-6",
            "data-ocid": "reservations-empty",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                CalendarDays,
                {
                  className: "h-5 w-5 text-muted-foreground",
                  "aria-hidden": "true"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: t("dashboard:home.noReservations", "Geen reserveringen vandaag") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: t(
                "dashboard:home.noReservationsSub",
                "Nieuwe reserveringen verschijnen hier zodra ze binnenkomen"
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/dashboard/reservations",
                  className: "mt-4 text-xs font-medium text-primary hover:text-primary/80 underline underline-offset-2 transition-colors",
                  "data-ocid": "reservations-empty-cta",
                  children: t("dashboard:home.addReservation", "Reservering toevoegen")
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ul",
          {
            className: "divide-y divide-border",
            "aria-label": t(
              "dashboard:home.recentReservations",
              "Reserveringen vandaag"
            ),
            children: sorted.map((res) => {
              const avatarClass = STATUS_AVATAR_COLOR[res.status] ?? "bg-muted text-muted-foreground";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "li",
                {
                  className: "flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer",
                  "data-ocid": "reservation-row",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: cn(
                          "h-9 w-9 rounded-full flex items-center justify-center shrink-0 shadow-sm font-bold text-xs",
                          avatarClass
                        ),
                        "aria-hidden": "true",
                        children: getInitials(res.guestName || "?")
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: res.guestName || t("dashboard:home.unknownGuest", "Onbekende gast") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: formatTime(res.time) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50", children: "·" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                          res.partySize,
                          " ",
                          res.partySize === 1 ? t("dashboard:home.person", "persoon") : t("dashboard:home.persons", "personen")
                        ] }),
                        res.experienceName && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50", children: "·" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent truncate", children: res.experienceName })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "badge-pop shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: res.status }) })
                  ]
                },
                res.id
              );
            })
          }
        ) })
      ]
    }
  );
}
const KPI_SKELETON_KEYS = ["kpi-sk-1", "kpi-sk-2", "kpi-sk-3", "kpi-sk-4"];
function CouvertsPerService({ services }) {
  const { t } = useTranslation("dashboard");
  if (services.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "gradient-card rounded-2xl border border-border p-5 shadow-soft flex items-center justify-center",
        "data-ocid": "couverts-per-service",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: t("dashboard:home.noCouverts", "Geen couverts vandaag") })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "gradient-card rounded-2xl border border-border p-5 shadow-soft",
      "data-ocid": "couverts-per-service",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: t("dashboard:home.couvertsPerService", "Couverts per dienst vandaag") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: services.map(({ name, covers }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 bg-muted/40 rounded-full px-4 py-1.5 border border-border",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-primary", children: covers }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: t("dashboard:home.covers", "cov.") })
            ]
          },
          name
        )) })
      ]
    }
  );
}
function AIInsightCallout({
  maxOccupancyPct,
  criticalSlotTime,
  totalCovers,
  totalCapacity
}) {
  const { t } = useTranslation("dashboard");
  const remaining = Math.max(totalCapacity - totalCovers, 0);
  let insight;
  if (maxOccupancyPct > 90 && criticalSlotTime) {
    insight = t(
      "dashboard:home.aiInsightOverbooking",
      `Mogelijk overboekingsrisico om ${criticalSlotTime} (${maxOccupancyPct}% bezet) — controleer beschikbaarheid`,
      { time: criticalSlotTime, pct: maxOccupancyPct }
    );
  } else if (maxOccupancyPct > 70) {
    insight = t(
      "dashboard:home.aiInsightBusy",
      `Drukke dienst verwacht — ${maxOccupancyPct}% bezet op piekmomenten`,
      { pct: maxOccupancyPct }
    );
  } else if (totalCovers === 0) {
    insight = t(
      "dashboard:home.aiInsightEmpty",
      "Nog geen reserveringen vandaag — widget en widget online?"
    );
  } else if (remaining > 0) {
    insight = t(
      "dashboard:home.aiInsightQuiet",
      `Rustige dag verwacht — nog ${remaining} plaatsen beschikbaar`,
      { remaining }
    );
  } else {
    insight = t(
      "dashboard:home.aiInsightNeutral",
      `Bezetting loopt goed — ${totalCovers} couverts bevestigd voor vandaag`,
      { covers: totalCovers }
    );
  }
  const borderColor = maxOccupancyPct > 90 ? "border-l-[oklch(0.65_0.24_25)]" : maxOccupancyPct > 70 ? "border-l-[oklch(0.72_0.22_58)]" : "border-l-primary";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "gradient-card rounded-2xl border border-border shadow-soft",
        "border-l-4 pl-4 pr-5 py-4 flex items-start gap-3",
        borderColor
      ),
      "data-ocid": "ai-insight-callout",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-accent", "aria-hidden": "true" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-accent uppercase tracking-wider mb-0.5", children: t("dashboard:home.aiInsightLabel", "AI Inzicht") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-snug", children: insight })
        ] })
      ]
    }
  );
}
function DashboardHome() {
  const { t } = useTranslation(["dashboard"]);
  const { data: kpis, isLoading: kpisLoading } = useKPIs();
  const { data: allReservations = [], isLoading: resLoading } = useReservations();
  const { data: capacityConfig } = useCapacityConfig();
  const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const { data: waitlistEntries = [] } = useWaitlist(todayStr);
  const realWaitlistCount = waitlistEntries.filter(
    (e) => e.status === "waiting" || e.status === "offered"
  ).length;
  const today = (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const todayReservations = allReservations.filter((r) => r.date === todayStr);
  const lunchCovers = todayReservations.filter(
    (r) => r.time >= "11:00" && r.time < "15:00" && r.status !== "cancelled" && r.status !== "departed"
  ).reduce((acc, r) => acc + r.partySize, 0);
  const dinerCovers = todayReservations.filter(
    (r) => r.time >= "17:00" && r.time < "23:00" && r.status !== "cancelled" && r.status !== "departed"
  ).reduce((acc, r) => acc + r.partySize, 0);
  const kpisExtended = kpis;
  const coversPerService = (kpisExtended == null ? void 0 : kpisExtended.coversPerService) ?? [
    { name: t("dashboard:home.serviceLunch", "Lunch"), covers: lunchCovers },
    { name: t("dashboard:home.serviceDiner", "Diner"), covers: dinerCovers }
  ].filter((s) => s.covers > 0);
  const totalCovers = (kpis == null ? void 0 : kpis.todayCovers) ?? lunchCovers + dinerCovers;
  const totalCapacity = (capacityConfig == null ? void 0 : capacityConfig.totalSeatsPerSlot) ?? 100;
  const cancelCount = todayReservations.filter(
    (r) => r.status === "cancelled"
  ).length;
  const totalToday = todayReservations.length;
  const cancellationRate = totalToday > 0 ? Math.round(cancelCount / totalToday * 100) : 0;
  const slotMap = /* @__PURE__ */ new Map();
  for (const r of todayReservations) {
    if (r.status === "cancelled" || r.status === "departed") continue;
    const prev = slotMap.get(r.time) ?? 0;
    slotMap.set(r.time, prev + r.partySize);
  }
  let maxSlotCovers = 0;
  let maxSlotTime;
  for (const [time, covers] of slotMap.entries()) {
    if (covers > maxSlotCovers) {
      maxSlotCovers = covers;
      maxSlotTime = time;
    }
  }
  const maxOccupancyPct = totalCapacity > 0 ? Math.round(maxSlotCovers / totalCapacity * 100) : 0;
  const kpiCards = [
    {
      key: "today",
      title: t("dashboard:home.todayReservations"),
      value: (kpis == null ? void 0 : kpis.todayReservations) ?? todayReservations.length,
      icon: CalendarDays,
      iconColor: "text-primary",
      iconBg: "bg-primary/15",
      trend: void 0
    },
    {
      key: "couverts",
      title: t("dashboard:home.couvertsToday", "Couverts vandaag"),
      value: totalCovers,
      icon: Users,
      iconColor: "text-secondary",
      iconBg: "bg-secondary/15",
      trend: void 0
    },
    {
      key: "waitlist",
      title: t("dashboard:home.waitlistCount", "Wachtlijst vandaag"),
      value: realWaitlistCount,
      icon: Clock,
      iconColor: realWaitlistCount > 0 ? "text-accent" : "text-muted-foreground",
      iconBg: realWaitlistCount > 0 ? "bg-accent/15" : "bg-muted/30",
      trend: void 0
    },
    {
      key: "cancellations",
      title: t("dashboard:home.cancellationRate", "Annuleringsgraad"),
      value: `${cancellationRate}%`,
      icon: cancellationRate > 20 ? CircleAlert : CircleX,
      iconColor: cancellationRate > 20 ? "text-destructive" : "text-muted-foreground",
      iconBg: cancellationRate > 20 ? "bg-destructive/15" : "bg-muted/30",
      trendPositive: cancellationRate <= 15,
      trend: void 0
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "heading-h1", children: t("dashboard:home.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1 capitalize", children: today })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        "aria-label": t("dashboard:home.kpiSection"),
        "aria-live": "polite",
        "aria-atomic": "false",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4", children: kpisLoading ? KPI_SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonKPICardFull, {}, k)) : kpiCards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          KPICard,
          {
            title: card.title,
            value: card.value,
            icon: card.icon,
            iconColor: card.iconColor,
            iconBg: card.iconBg,
            trend: card.trend,
            trendPositive: card.trendPositive
          },
          card.key
        )) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CouvertsPerService, { services: coversPerService }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AIInsightCallout,
        {
          maxOccupancyPct,
          criticalSlotTime: maxSlotTime,
          totalCovers,
          totalCapacity
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        RecentReservations,
        {
          reservations: todayReservations,
          isLoading: resLoading,
          className: "lg:col-span-3"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MiniOccupancyWidget,
        {
          reservations: todayReservations,
          className: "lg:col-span-2"
        }
      )
    ] })
  ] });
}
export {
  DashboardHome as default
};
