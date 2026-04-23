import { i as createLucideIcon, u as useTranslation, a as useFloorState, j as jsxRuntimeExports, c as cn, k as useOpeningHoursConfig, r as reactExports, l as useAssignReservation, m as useUnassignTable, D as Dialog, n as DialogContent, o as DialogHeader, p as DialogTitle, X, q as AnimatePresence, s as motion, B as Button, T as TableStatus, t as ue, v as useUpdateReservation, w as Label, I as Input, g as Clock, U as Users, S as Select, x as SelectTrigger, y as SelectValue, z as SelectContent, E as SelectItem, F as Textarea, G as Check, H as Separator, J as Table2, K as ChevronUp, M as ChevronDown, N as useReservationChanges, O as Badge, P as useId, Q as useControllableState, R as Root2, V as useComposedRefs, W as Anchor, Y as Primitive, Z as composeEventHandlers, _ as Presence, $ as Portal$1, a0 as Arrow, a1 as createPopperScope, a2 as DismissableLayer, a3 as Content, a4 as Root, a5 as createContextScope, a6 as createSlottable, C as CalendarDays, a7 as Plus, a8 as useQueryClient, d as useReservations, a9 as useUpdateReservationStatus, aa as RefreshCw, ab as NewReservationModal } from "./index-BNayfcmF.js";
import { C as ChevronLeft } from "./chevron-left-BG38Auax.js";
import { C as ChevronRight } from "./chevron-right-6-wY6xfI.js";
import { S as StatusBadge } from "./StatusBadge-DHwE6svA.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-D5EHXLzH.js";
import { S as Skeleton } from "./skeleton-D2EeOrWT.js";
import { P as Pencil } from "./pencil-DouonZv5.js";
import { C as Calendar } from "./calendar-B7oSQFN-.js";
import { S as Star } from "./star-h0dWBoX6.js";
import { M as MessageSquare } from "./message-square-CN7hfjg6.js";
import { C as CreditCard } from "./credit-card-D26I8FF4.js";
import { S as Search } from "./search-bQuVyguO.js";
import { S as SkeletonTableRow } from "./SkeletonCard-C6az2IVr.js";
import { L as List } from "./list-Df0hlkMn.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
];
const History = createLucideIcon("history", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7", key: "10o201" }],
  ["path", { d: "M15 7h2a5 5 0 0 1 4 8", key: "1d3206" }],
  ["line", { x1: "8", x2: "12", y1: "12", y2: "12", key: "rvw6j4" }],
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22", key: "a6p6uj" }]
];
const Link2Off = createLucideIcon("link-2-off", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
];
const Link2 = createLucideIcon("link-2", __iconNode);
const OCCUPANCY_BG = {
  empty: {
    bg: "bg-[oklch(var(--color-status-free)/0.15)] hover:bg-[oklch(var(--color-status-free)/0.28)]",
    ring: "ring-1 ring-[oklch(var(--color-status-free)/0.5)]",
    dotColor: "bg-[oklch(var(--color-status-free)/0.5)]"
  },
  reserved: {
    bg: "bg-[oklch(var(--color-status-reserved)/0.15)] hover:bg-[oklch(var(--color-status-reserved)/0.28)]",
    ring: "ring-1 ring-[oklch(var(--color-status-reserved)/0.5)]",
    dotColor: "bg-[oklch(var(--color-status-reserved)/0.5)]"
  },
  occupied: {
    bg: "bg-destructive/20 hover:bg-destructive/35",
    ring: "ring-1 ring-destructive/50",
    dotColor: "bg-destructive/50"
  },
  unavailable: {
    bg: "bg-muted/40",
    ring: "ring-1 ring-border",
    dotColor: "bg-muted-foreground/30"
  }
};
function MiniFloorPlan({
  reservations,
  selectedTable,
  onSelectTable
}) {
  const { t } = useTranslation("dashboard");
  const { data: floorState } = useFloorState();
  if (!floorState || floorState.tables.length === 0) return null;
  const occupancyMap = {};
  for (const tbl of floorState.tables) {
    const status = String(tbl.status);
    if (status === "occupied") occupancyMap[tbl.id] = "occupied";
    else if (status === "reserved") occupancyMap[tbl.id] = "reserved";
    else if (status === "unavailable") occupancyMap[tbl.id] = "unavailable";
    else occupancyMap[tbl.id] = "empty";
  }
  for (const r of reservations) {
    if (r.tableNumber != null) {
      const tableId = `t${r.tableNumber}`;
      if (r.status === "seated") occupancyMap[tableId] = "occupied";
      else if (r.status === "confirmed") occupancyMap[tableId] = "reserved";
    }
  }
  const LEGEND_OCCUPANCIES = [
    "empty",
    "reserved",
    "occupied"
  ];
  const LEGEND_KEYS = {
    empty: "seating.legend.available",
    reserved: "seating.legend.reserved",
    occupied: "seating.legend.occupied",
    unavailable: "seating.legend.unavailable"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: t("reservations.mini_floor_plan.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: LEGEND_OCCUPANCIES.map((occ) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn(
              "w-2.5 h-2.5 rounded-sm inline-block",
              OCCUPANCY_BG[occ].dotColor
            )
          }
        ),
        t(LEGEND_KEYS[occ])
      ] }, occ)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: floorState.tables.map((tbl) => {
      const occ = occupancyMap[tbl.id] ?? "empty";
      const style = OCCUPANCY_BG[occ];
      const tableNum = tbl.id.replace("t", "");
      const isSelected = selectedTable === tableNum;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onSelectTable(tableNum),
          className: cn(
            "relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            style.bg,
            style.ring,
            isSelected && "scale-110 ring-2 ring-primary shadow-lg"
          ),
          title: `${tbl.name} (${Number(tbl.capacity)} pers.) — ${t(LEGEND_KEYS[occ])}`,
          "aria-pressed": isSelected,
          "data-ocid": "mini-table",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-foreground leading-tight", children: tbl.name.replace("Tafel ", "") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-muted-foreground leading-tight", children: [
              Number(tbl.capacity),
              "p"
            ] })
          ]
        },
        tbl.id
      );
    }) }),
    selectedTable && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: t("reservations.mini_floor_plan.filter_message", {
      table: selectedTable
    }) })
  ] });
}
function isoLocalDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function localToday() {
  return isoLocalDate(/* @__PURE__ */ new Date());
}
function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;
  const grid = [];
  for (let i = startDow; i > 0; i--) {
    grid.push(new Date(year, month, 1 - i));
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    grid.push(new Date(year, month, d));
  }
  while (grid.length % 7 !== 0) {
    grid.push(
      new Date(year, month + 1, grid.length - lastDay.getDate() - startDow + 1)
    );
  }
  return grid;
}
function pillColor(booked, capacity) {
  if (capacity === 0) return "bg-muted/60 text-muted-foreground";
  const ratio = booked / capacity;
  if (ratio > 0.8) return "bg-destructive/80 text-white";
  if (ratio >= 0.5) return "bg-amber-500/80 text-white";
  return "bg-primary/80 text-white";
}
function ReservationCalendar({
  reservations,
  onSelectDayService
}) {
  var _a, _b;
  const { t, i18n } = useTranslation("dashboard");
  const { data: openingHours } = useOpeningHoursConfig();
  const today = localToday();
  const nowDate = /* @__PURE__ */ new Date();
  const [year, setYear] = reactExports.useState(nowDate.getFullYear());
  const [month, setMonth] = reactExports.useState(nowDate.getMonth());
  const DAY_NAMES_SHORT = t("calendar.dayNamesShort", {
    returnObjects: true
  }) ?? ["Mo", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
  const grid = buildCalendarGrid(year, month);
  const resByDay = {};
  for (const r of reservations) {
    if (!resByDay[r.date]) resByDay[r.date] = [];
    resByDay[r.date].push(r);
  }
  const services = (openingHours == null ? void 0 : openingHours.services) ?? [];
  function getServiceBooking(date, service) {
    const dayRes = resByDay[date] ?? [];
    const [openH, openM] = service.openTime.split(":").map(Number);
    const [closeH, closeM] = service.closeTime.split(":").map(Number);
    const openMins = openH * 60 + openM;
    const closeMins = closeH * 60 + closeM;
    const booked = dayRes.filter((r) => {
      if (r.status === "cancelled") return false;
      const [rH, rM] = r.time.split(":").map(Number);
      const rMins = rH * 60 + rM;
      return rMins >= openMins && rMins < closeMins;
    });
    return { booked: booked.length, capacity: service.maxCapacity };
  }
  function prevMonth() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
  }
  function goToday() {
    setYear(nowDate.getFullYear());
    setMonth(nowDate.getMonth());
  }
  const monthLabel = new Date(year, month, 1).toLocaleDateString(
    ((_a = i18n.language) == null ? void 0 : _a.slice(0, 2)) === "fr" ? "fr-BE" : ((_b = i18n.language) == null ? void 0 : _b.slice(0, 2)) === "en" ? "en-GB" : "nl-BE",
    { month: "long", year: "numeric" }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: prevMonth,
          className: "p-2 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          "aria-label": t("calendar.prevMonth"),
          "data-ocid": "cal-prev-month",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5 text-muted-foreground" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: goToday,
          className: "text-sm font-semibold text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1 capitalize",
          "aria-label": t("calendar.currentMonth"),
          "data-ocid": "cal-month-label",
          children: monthLabel
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: nextMonth,
          className: "p-2 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          "aria-label": t("calendar.nextMonth"),
          "data-ocid": "cal-next-month",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5 text-muted-foreground" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-px", children: DAY_NAMES_SHORT.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "text-center text-xs font-medium text-muted-foreground py-1.5",
        children: name
      },
      name
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden border border-border", children: grid.map((day) => {
      const key = isoLocalDate(day);
      const isCurrentMonth = day.getMonth() === month;
      const isToday = key === today;
      const dayRes = resByDay[key] ?? [];
      const totalCount = dayRes.filter(
        (r) => r.status !== "cancelled"
      ).length;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "bg-card min-h-[90px] p-1.5 flex flex-col gap-1",
            !isCurrentMonth && "opacity-40"
          ),
          "data-ocid": `cal.day.${key}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold leading-none",
                    isToday ? "bg-primary text-primary-foreground" : "text-foreground"
                  ),
                  children: day.getDate()
                }
              ),
              totalCount > 0 && !isToday && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-medium", children: totalCount })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5 flex-1", children: [
              services.length === 0 && dayRes.length > 0 && // Fallback if no services configured: show total count pill
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => onSelectDayService == null ? void 0 : onSelectDayService(key, "all"),
                  className: "w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate bg-primary/70 text-white hover:bg-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                  "data-ocid": `cal.day.${key}.all`,
                  children: [
                    totalCount,
                    " res."
                  ]
                }
              ),
              services.map((service) => {
                const { booked, capacity } = getServiceBooking(key, service);
                if (!isCurrentMonth) return null;
                if (booked === 0 && capacity === 0) return null;
                const color = pillColor(booked, capacity);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => onSelectDayService == null ? void 0 : onSelectDayService(key, service.id),
                    className: cn(
                      "w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate transition-all",
                      "hover:brightness-110 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                      color
                    ),
                    "aria-label": `${service.name}: ${booked}/${capacity}`,
                    "data-ocid": `cal.day.${key}.service.${service.id}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: service.name.length > 8 ? `${service.name.slice(0, 7)}…` : service.name }),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-90", children: [
                        booked,
                        "/",
                        capacity
                      ] })
                    ]
                  },
                  service.id
                );
              })
            ] })
          ]
        },
        `${key}-cell`
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 text-xs text-muted-foreground justify-end px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-sm bg-primary/80 inline-block" }),
        t("calendar.legendAvailable")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-sm bg-amber-500/80 inline-block" }),
        t("calendar.legendBusy")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-sm bg-destructive/80 inline-block" }),
        t("calendar.legendFull")
      ] })
    ] })
  ] });
}
const OCCUPANCY_STYLES = {
  empty: {
    bg: "bg-[oklch(var(--color-status-free)/0.15)] hover:bg-[oklch(var(--color-status-free)/0.28)] cursor-pointer",
    ring: "ring-1 ring-[oklch(var(--color-status-free)/0.5)]",
    dot: "bg-[oklch(var(--color-status-free)/0.7)]",
    label: "available"
  },
  reserved: {
    bg: "bg-[oklch(var(--color-status-reserved)/0.15)]",
    ring: "ring-1 ring-[oklch(var(--color-status-reserved)/0.5)]",
    dot: "bg-[oklch(var(--color-status-reserved)/0.7)]",
    label: "reserved"
  },
  occupied: {
    bg: "bg-destructive/15",
    ring: "ring-1 ring-destructive/50",
    dot: "bg-destructive/70",
    label: "occupied"
  },
  unavailable: {
    bg: "bg-muted/30",
    ring: "ring-1 ring-border",
    dot: "bg-muted-foreground/30",
    label: "unavailable"
  }
};
const LEGEND_ITEMS = ["empty", "reserved", "occupied"];
const TRANSLATIONS = {
  nl: {
    title: "Tafel toewijzen",
    guestInfo: (name, size) => `${name} · ${size} personen`,
    noTables: "Geen tafels beschikbaar op het vloerplan.",
    unassign: "Tafel loskoppelen",
    close: "Sluiten",
    assigned: "Toegewezen",
    legend: { available: "Vrij", reserved: "Gereserveerd", occupied: "Bezet" },
    toast: {
      assigned: (table, name) => `${table} gekoppeld aan ${name}`,
      unassigned: "Tafelkoppeling verwijderd",
      error: "Kon tafel niet koppelen"
    }
  },
  en: {
    title: "Assign Table",
    guestInfo: (name, size) => `${name} · ${size} guests`,
    noTables: "No tables available on the floor plan.",
    unassign: "Unassign Table",
    close: "Close",
    assigned: "Assigned",
    legend: {
      available: "Available",
      reserved: "Reserved",
      occupied: "Occupied"
    },
    toast: {
      assigned: (table, name) => `${table} assigned to ${name}`,
      unassigned: "Table unassigned",
      error: "Could not assign table"
    }
  },
  fr: {
    title: "Assigner une table",
    guestInfo: (name, size) => `${name} · ${size} personnes`,
    noTables: "Aucune table disponible sur le plan de salle.",
    unassign: "Désassigner la table",
    close: "Fermer",
    assigned: "Assigné",
    legend: { available: "Libre", reserved: "Réservé", occupied: "Occupé" },
    toast: {
      assigned: (table, name) => `${table} assigné à ${name}`,
      unassigned: "Table désassignée",
      error: "Impossible d'assigner la table"
    }
  }
};
function useTr() {
  var _a;
  const { i18n } = useTranslation();
  const lang = ((_a = i18n.language) == null ? void 0 : _a.slice(0, 2)) ?? "nl";
  return TRANSLATIONS[lang] ?? TRANSLATIONS.nl;
}
function TableAssignmentOverlay({
  reservation,
  open,
  onClose
}) {
  const tr = useTr();
  const { data: floorState } = useFloorState();
  const assignReservation = useAssignReservation();
  const unassignTable = useUnassignTable();
  const assignedTable = floorState == null ? void 0 : floorState.tables.find(
    (t) => reservation && t.reservationId === reservation.id
  );
  const isAssigning = assignReservation.isPending || unassignTable.isPending;
  function getOccupancy(tableId) {
    const t = floorState == null ? void 0 : floorState.tables.find((x) => x.id === tableId);
    if (!t) return "unavailable";
    if ((assignedTable == null ? void 0 : assignedTable.id) === tableId) return "empty";
    const s = String(t.status);
    if (s === "occupied") return "occupied";
    if (s === "reserved") return "reserved";
    if (t.status === TableStatus.empty || s === "empty" || s === "available")
      return "empty";
    return "unavailable";
  }
  async function handleAssign(tableId, tableName) {
    if (!reservation) return;
    try {
      if (assignedTable && assignedTable.id !== tableId) {
        await unassignTable.mutateAsync({ tableId: assignedTable.id });
      }
      await assignReservation.mutateAsync({
        tableId,
        reservationId: reservation.id,
        guestName: reservation.guestName,
        seatCount: reservation.partySize
      });
      ue.success(tr.toast.assigned(tableName, reservation.guestName));
      onClose();
    } catch {
      ue.error(tr.toast.error);
    }
  }
  async function handleUnassign() {
    if (!assignedTable) return;
    try {
      await unassignTable.mutateAsync({ tableId: assignedTable.id });
      ue.success(tr.toast.unassigned);
      onClose();
    } catch {
      ue.error(tr.toast.error);
    }
  }
  const tables = (floorState == null ? void 0 : floorState.tables) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border text-foreground w-full max-w-md sm:max-w-lg",
      "aria-modal": "true",
      "data-ocid": "table-assignment.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base font-bold text-foreground", children: tr.title }),
            reservation && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              tr.guestInfo(reservation.guestName, reservation.partySize),
              reservation.date && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 opacity-70", children: [
                reservation.date,
                " ",
                reservation.time
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "text-muted-foreground hover:text-foreground transition-colors rounded-md p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              "aria-label": tr.close,
              "data-ocid": "table-assignment.close_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4 text-xs text-muted-foreground mt-3 mb-1", children: LEGEND_ITEMS.map((occ) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "w-2.5 h-2.5 rounded-sm inline-block",
                OCCUPANCY_STYLES[occ].dot
              )
            }
          ),
          tr.legend[occ]
        ] }, occ)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-background/50 p-4 min-h-[120px]", children: tables.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic text-center py-6", children: tr.noTables }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: tables.map((tbl, idx) => {
          const occ = getOccupancy(tbl.id);
          const style = OCCUPANCY_STYLES[occ];
          const isAssignedThis = (assignedTable == null ? void 0 : assignedTable.id) === tbl.id;
          const isClickable = occ === "empty";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.button,
            {
              type: "button",
              initial: { opacity: 0, scale: 0.85 },
              animate: { opacity: 1, scale: 1 },
              transition: { delay: idx * 0.025 },
              disabled: !isClickable || isAssigning,
              onClick: () => isClickable ? handleAssign(tbl.id, tbl.name) : void 0,
              className: cn(
                "relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                style.bg,
                style.ring,
                isAssignedThis && "ring-2 ring-primary shadow-md scale-105",
                !isClickable && "opacity-50 cursor-not-allowed",
                isAssigning && "pointer-events-none"
              ),
              title: `${tbl.name} · ${Number(tbl.capacity)}p`,
              "aria-pressed": isAssignedThis,
              "data-ocid": `table-assignment.table.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold text-foreground leading-tight", children: tbl.name.replace(/^Tafel\s*/i, "") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-muted-foreground leading-tight", children: [
                  Number(tbl.capacity),
                  "p"
                ] }),
                isAssignedThis && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center",
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "svg",
                      {
                        className: "w-2.5 h-2.5 text-primary-foreground",
                        viewBox: "0 0 10 10",
                        fill: "none",
                        "aria-hidden": "true",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "path",
                          {
                            d: "M2 5l2.5 2.5L8 3",
                            stroke: "currentColor",
                            strokeWidth: "1.5",
                            strokeLinecap: "round",
                            strokeLinejoin: "round"
                          }
                        )
                      }
                    )
                  }
                )
              ]
            },
            tbl.id
          );
        }) }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 mt-1", children: [
          assignedTable ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "ghost",
              className: "text-xs gap-1.5 text-destructive/80 hover:text-destructive hover:bg-destructive/10",
              onClick: handleUnassign,
              disabled: isAssigning,
              "data-ocid": "table-assignment.unassign_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link2Off, { className: "h-3.5 w-3.5" }),
                tr.unassign
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "ghost",
              className: "text-xs text-muted-foreground hover:text-foreground ml-auto",
              onClick: onClose,
              "data-ocid": "table-assignment.cancel_button",
              children: tr.close
            }
          )
        ] })
      ]
    }
  ) });
}
const ALL_STATUSES$1 = [
  { value: "confirmed", label: "Bevestigd" },
  { value: "not_arrived", label: "Niet aangekomen" },
  { value: "late", label: "Te laat" },
  { value: "seated", label: "Zit aan tafel" },
  { value: "departed", label: "Vertrokken" },
  { value: "cancelled", label: "Geannuleerd" },
  { value: "waitlist", label: "Wachtlijst" },
  { value: "completed", label: "Voltooid" },
  { value: "no_show", label: "Niet verschenen" }
];
const FIELD_LABELS = {
  date: { nl: "Datum", en: "Date", fr: "Date" },
  time: { nl: "Tijdstip", en: "Time", fr: "Heure" },
  partySize: {
    nl: "Aantal personen",
    en: "Party size",
    fr: "Nombre de personnes"
  },
  notes: { nl: "Opmerkingen", en: "Notes", fr: "Remarques" },
  specialRequests: { nl: "Opmerkingen", en: "Notes", fr: "Remarques" },
  status: { nl: "Status", en: "Status", fr: "Statut" },
  experienceId: { nl: "Ervaring", en: "Experience", fr: "Expérience" }
};
function getFieldLabel(field, locale = "nl") {
  const entry = FIELD_LABELS[field];
  if (!entry) return field;
  return entry[locale] ?? entry.nl;
}
function DetailRow({
  icon: Icon,
  label,
  value
}) {
  if (!value) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-muted-foreground", "aria-hidden": "true" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mt-0.5", children: value })
    ] })
  ] });
}
function formatFullDate(d, locale = "nl-BE") {
  if (!d) return "—";
  const dt = /* @__PURE__ */ new Date(`${d}T00:00:00`);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}
function formatChangeTimestamp(iso, locale = "nl-BE") {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function ChangeHistoryPanel({
  reservationId,
  locale
}) {
  const { data: changes, isLoading } = useReservationChanges(reservationId);
  const displayLocale = locale === "fr" ? "fr-FR" : locale === "en" ? "en-GB" : "nl-BE";
  const historyLabel = locale === "en" ? "Change history" : locale === "fr" ? "Historique" : "Wijzigingen";
  const noChangesLabel = locale === "en" ? "No changes yet" : locale === "fr" ? "Aucune modification" : "Geen wijzigingen";
  const changedByLabel = locale === "en" ? "Changed by" : locale === "fr" ? "Modifié par" : "Gewijzigd door";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4 text-muted-foreground", "aria-hidden": "true" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: historyLabel })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pl-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
    ] }) : !changes || changes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pl-6 text-sm text-muted-foreground italic", children: noChangesLabel }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "pl-6 space-y-3", "aria-label": historyLabel, children: changes.map((change, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "li",
      {
        className: "relative pl-4 border-l-2 border-border",
        "data-ocid": `reservation.change.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-primary/60" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            formatChangeTimestamp(change.changedAt, displayLocale),
            change.changedByName && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5", children: [
              "· ",
              changedByLabel,
              ":",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: change.changedByName })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex flex-wrap items-center gap-1.5 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: getFieldLabel(change.field, locale ?? "nl") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "→" }),
            change.oldValue && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "text-xs line-through text-muted-foreground border-border px-1.5 py-0",
                children: change.oldValue
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "text-xs text-primary border-primary/40 bg-primary/5 px-1.5 py-0",
                children: change.newValue
              }
            )
          ] })
        ]
      },
      change.id ?? i
    )) })
  ] });
}
function ReservationDetailModal({
  reservation,
  open,
  onClose,
  onCheckIn,
  onCancel,
  onSaveNotes,
  onStatusChange,
  experiences = [],
  locale
}) {
  const titleId = reactExports.useId();
  const [notes, setNotes] = reactExports.useState("");
  const [notesDirty, setNotesDirty] = reactExports.useState(false);
  const [showCancelDialog, setShowCancelDialog] = reactExports.useState(false);
  const [localStatus, setLocalStatus] = reactExports.useState(
    null
  );
  const [showAssignOverlay, setShowAssignOverlay] = reactExports.useState(false);
  const [showHistory, setShowHistory] = reactExports.useState(false);
  const [editMode, setEditMode] = reactExports.useState(false);
  const [editDate, setEditDate] = reactExports.useState("");
  const [editTime, setEditTime] = reactExports.useState("");
  const [editPartySize, setEditPartySize] = reactExports.useState(1);
  const [editNotes, setEditNotes] = reactExports.useState("");
  const [editStatus, setEditStatus] = reactExports.useState("confirmed");
  const [editExperienceId, setEditExperienceId] = reactExports.useState("");
  const [editErrors, setEditErrors] = reactExports.useState({});
  const { data: floorState } = useFloorState();
  const unassignTable = useUnassignTable();
  const updateReservation = useUpdateReservation();
  const assignedTable = floorState == null ? void 0 : floorState.tables.find(
    (t) => t.reservationId === (reservation == null ? void 0 : reservation.id)
  );
  reactExports.useEffect(() => {
    if (reservation) {
      setNotes(reservation.notes ?? "");
      setNotesDirty(false);
      setLocalStatus(reservation.status);
      setShowAssignOverlay(false);
      setEditMode(false);
      setShowHistory(false);
      setEditDate(reservation.date ?? "");
      setEditTime(reservation.time ?? "");
      setEditPartySize(reservation.partySize ?? 1);
      setEditNotes(reservation.notes ?? reservation.specialRequests ?? "");
      setEditStatus(reservation.status);
      setEditExperienceId(reservation.experienceId ?? "");
      setEditErrors({});
    }
  }, [reservation]);
  if (!reservation) return null;
  const currentStatus = localStatus ?? reservation.status;
  const canCheckIn = currentStatus !== "cancelled" && currentStatus !== "completed" && currentStatus !== "seated";
  const canCancel = currentStatus !== "cancelled";
  const displayLocale = locale === "fr" ? "fr-FR" : locale === "en" ? "en-GB" : "nl-BE";
  const editLabel = locale === "en" ? "Edit" : locale === "fr" ? "Modifier" : "Bewerken";
  const saveLabel = locale === "en" ? "Save changes" : locale === "fr" ? "Enregistrer les modifications" : "Wijzigingen opslaan";
  const cancelLabel = locale === "en" ? "Cancel" : locale === "fr" ? "Annuler" : "Annuleren";
  const historyLabel = locale === "en" ? "Change history" : locale === "fr" ? "Historique" : "Wijzigingen";
  function handleStatusChange(val) {
    const s = val;
    setLocalStatus(s);
    onStatusChange(reservation.id, s);
  }
  async function handleUnassignTable() {
    if (!assignedTable) return;
    await unassignTable.mutateAsync({ tableId: assignedTable.id });
    ue.success("Tafelkoppeling verwijderd");
  }
  function validateEdit() {
    const errs = {};
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const chosen = /* @__PURE__ */ new Date(`${editDate}T00:00:00`);
    if (!editDate) {
      errs.date = locale === "en" ? "Date is required" : locale === "fr" ? "La date est requise" : "Datum is verplicht";
    } else if (chosen < today) {
      errs.date = locale === "en" ? "Date cannot be in the past" : locale === "fr" ? "La date ne peut pas être dans le passé" : "Datum mag niet in het verleden liggen";
    }
    if (editPartySize < 1 || editPartySize > 500) {
      errs.partySize = locale === "en" ? "Party size must be between 1 and 500" : locale === "fr" ? "Le groupe doit être entre 1 et 500" : "Aantal personen moet tussen 1 en 500 zijn";
    }
    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  }
  async function handleSaveEdit() {
    if (!validateEdit()) return;
    const res = reservation;
    try {
      await updateReservation.mutateAsync({
        id: res.id,
        date: editDate,
        time: editTime,
        partySize: editPartySize,
        notes: editNotes || void 0,
        status: editStatus,
        experienceId: editExperienceId || void 0
      });
      setLocalStatus(editStatus);
      setNotes(editNotes);
      setEditMode(false);
      const successMsg = locale === "en" ? "Reservation updated" : locale === "fr" ? "Réservation mise à jour" : "Reservering bijgewerkt";
      ue.success(successMsg);
    } catch (_err) {
      const errMsg = locale === "en" ? "Failed to save changes. Please try again." : locale === "fr" ? "Échec de l'enregistrement. Veuillez réessayer." : "Opslaan mislukt. Probeer het opnieuw.";
      ue.error(errMsg);
    }
  }
  function handleCancelEdit() {
    const res = reservation;
    setEditMode(false);
    setEditDate(res.date ?? "");
    setEditTime(res.time ?? "");
    setEditPartySize(res.partySize ?? 1);
    setEditNotes(res.notes ?? res.specialRequests ?? "");
    setEditStatus(res.status);
    setEditExperienceId(res.experienceId ?? "");
    setEditErrors({});
  }
  const isUnassigning = unassignTable.isPending;
  const isSaving = updateReservation.isPending;
  const hasExperiences = experiences.length > 0;
  const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-card border-border text-foreground max-w-lg w-full max-h-[90vh] overflow-y-auto",
        "aria-labelledby": titleId,
        "aria-modal": "true",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DialogTitle,
              {
                id: titleId,
                className: "text-xl font-bold text-foreground",
                children: reservation.guestName
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              !editMode && /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: currentStatus }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: editMode ? "outline" : "ghost",
                  className: editMode ? "h-7 text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10" : "h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground",
                  onClick: () => {
                    if (editMode) {
                      handleCancelEdit();
                    } else {
                      setEditMode(true);
                    }
                  },
                  "data-ocid": "reservation.edit_button",
                  "aria-pressed": editMode,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3 w-3" }),
                    editMode ? cancelLabel : editLabel
                  ]
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
            editMode ? (
              /* ── Edit Mode ─────────────────────────────────────────────── */
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "reservation.edit_form", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: `edit-date-${reservation.id}`,
                      className: "text-sm font-medium text-foreground flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Calendar,
                          {
                            className: "h-4 w-4 text-muted-foreground",
                            "aria-hidden": "true"
                          }
                        ),
                        locale === "en" ? "Date" : locale === "fr" ? "Date" : "Datum"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: `edit-date-${reservation.id}`,
                      type: "date",
                      min: todayStr,
                      value: editDate,
                      onChange: (e) => {
                        setEditDate(e.target.value);
                        if (editErrors.date)
                          setEditErrors((p) => ({ ...p, date: "" }));
                      },
                      className: "bg-background border-border text-foreground",
                      "data-ocid": "reservation.edit_date_input",
                      "aria-invalid": !!editErrors.date
                    }
                  ),
                  editErrors.date && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs text-destructive",
                      "data-ocid": "reservation.date.field_error",
                      children: editErrors.date
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: `edit-time-${reservation.id}`,
                      className: "text-sm font-medium text-foreground flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Clock,
                          {
                            className: "h-4 w-4 text-muted-foreground",
                            "aria-hidden": "true"
                          }
                        ),
                        locale === "en" ? "Time" : locale === "fr" ? "Heure" : "Tijdstip"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: `edit-time-${reservation.id}`,
                      type: "time",
                      value: editTime,
                      onChange: (e) => setEditTime(e.target.value),
                      className: "bg-background border-border text-foreground",
                      "data-ocid": "reservation.edit_time_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: `edit-party-${reservation.id}`,
                      className: "text-sm font-medium text-foreground flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Users,
                          {
                            className: "h-4 w-4 text-muted-foreground",
                            "aria-hidden": "true"
                          }
                        ),
                        locale === "en" ? "Party size" : locale === "fr" ? "Nombre de personnes" : "Aantal personen"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: `edit-party-${reservation.id}`,
                      type: "number",
                      min: 1,
                      max: 500,
                      value: editPartySize,
                      onChange: (e) => {
                        setEditPartySize(
                          Number.parseInt(e.target.value, 10) || 1
                        );
                        if (editErrors.partySize)
                          setEditErrors((p) => ({ ...p, partySize: "" }));
                      },
                      className: "bg-background border-border text-foreground",
                      "data-ocid": "reservation.edit_party_input",
                      "aria-invalid": !!editErrors.partySize
                    }
                  ),
                  editErrors.partySize && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs text-destructive",
                      "data-ocid": "reservation.partySize.field_error",
                      children: editErrors.partySize
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: locale === "en" ? "Status" : locale === "fr" ? "Statut" : "Status" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: editStatus,
                      onValueChange: (v) => setEditStatus(v),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectTrigger,
                          {
                            className: "bg-background border-border text-foreground",
                            "data-ocid": "reservation.edit_status_select",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border z-50", children: ALL_STATUSES$1.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectItem,
                          {
                            value: s.value,
                            className: "text-foreground focus:bg-muted",
                            children: s.label
                          },
                          s.value
                        )) })
                      ]
                    }
                  )
                ] }),
                hasExperiences && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-foreground flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Star,
                      {
                        className: "h-4 w-4 text-muted-foreground",
                        "aria-hidden": "true"
                      }
                    ),
                    locale === "en" ? "Experience" : locale === "fr" ? "Expérience" : "Ervaring"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: editExperienceId || "__none__",
                      onValueChange: (v) => setEditExperienceId(v === "__none__" ? "" : v),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectTrigger,
                          {
                            className: "bg-background border-border text-foreground",
                            "data-ocid": "reservation.edit_experience_select",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-card border-border z-50", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            SelectItem,
                            {
                              value: "__none__",
                              className: "text-foreground focus:bg-muted",
                              children: locale === "en" ? "No experience" : locale === "fr" ? "Pas d'expérience" : "Geen ervaring"
                            }
                          ),
                          experiences.map((exp) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                            SelectItem,
                            {
                              value: exp.id,
                              className: "text-foreground focus:bg-muted",
                              children: exp.name
                            },
                            exp.id
                          ))
                        ] })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: `edit-notes-${reservation.id}`,
                      className: "text-sm font-medium text-foreground flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          MessageSquare,
                          {
                            className: "h-4 w-4 text-muted-foreground",
                            "aria-hidden": "true"
                          }
                        ),
                        locale === "en" ? "Notes" : locale === "fr" ? "Remarques" : "Opmerkingen"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: `edit-notes-${reservation.id}`,
                      value: editNotes,
                      onChange: (e) => setEditNotes(e.target.value),
                      placeholder: locale === "en" ? "Allergies, special requests, birthday…" : locale === "fr" ? "Allergies, demandes spéciales, anniversaire…" : "Allergieën, speciale verzoeken, verjaardag…",
                      rows: 3,
                      className: "bg-background border-border text-foreground placeholder:text-muted-foreground resize-none",
                      "data-ocid": "reservation.edit_notes_textarea"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      className: "bg-primary text-primary-foreground hover:bg-primary/90 gap-2 flex-1",
                      onClick: handleSaveEdit,
                      disabled: isSaving,
                      "data-ocid": "reservation.save_changes_button",
                      children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "h-3.5 w-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin",
                            "aria-hidden": "true"
                          }
                        ),
                        locale === "en" ? "Saving…" : locale === "fr" ? "Enregistrement…" : "Opslaan…"
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
                        saveLabel
                      ] })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "outline",
                      className: "border-border text-foreground hover:bg-muted gap-2",
                      onClick: handleCancelEdit,
                      disabled: isSaving,
                      "data-ocid": "reservation.cancel_edit_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
                        cancelLabel
                      ]
                    }
                  )
                ] })
              ] })
            ) : (
              /* ── View Mode ─────────────────────────────────────────────── */
              /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DetailRow,
                    {
                      icon: Calendar,
                      label: "Datum",
                      value: formatFullDate(reservation.date, displayLocale)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DetailRow,
                    {
                      icon: Clock,
                      label: "Tijd",
                      value: reservation.time
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DetailRow,
                    {
                      icon: Users,
                      label: "Aantal personen",
                      value: `${reservation.partySize} personen`
                    }
                  ),
                  reservation.experienceName && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DetailRow,
                    {
                      icon: Star,
                      label: "Ervaring",
                      value: reservation.experienceName
                    }
                  ),
                  reservation.stripePaymentIntentId && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DetailRow,
                    {
                      icon: CreditCard,
                      label: "Stripe betaling",
                      value: reservation.stripePaymentIntentId
                    }
                  ),
                  reservation.specialRequests && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DetailRow,
                    {
                      icon: MessageSquare,
                      label: "Speciale verzoeken",
                      value: reservation.specialRequests
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Table2,
                    {
                      className: "h-4 w-4 text-muted-foreground",
                      "aria-hidden": "true"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Tafel" }),
                    assignedTable ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
                      assignedTable.name,
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-xs font-normal text-muted-foreground", children: [
                        "(",
                        Number(assignedTable.capacity),
                        " plaatsen)"
                      ] })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: "Geen tafel toegewezen" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "h-7 text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10",
                        onClick: () => setShowAssignOverlay(true),
                        disabled: isUnassigning,
                        "data-ocid": "modal-assign-table-button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3 w-3" }),
                          assignedTable ? "Wijzigen" : "Koppelen"
                        ]
                      }
                    ),
                    assignedTable && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "ghost",
                        className: "h-7 text-xs gap-1.5 text-destructive/70 hover:text-destructive hover:bg-destructive/10",
                        onClick: handleUnassignTable,
                        disabled: isUnassigning,
                        "data-ocid": "modal-unassign-table-button",
                        "aria-label": "Tafelkoppeling verwijderen",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Link2Off, { className: "h-3 w-3" }),
                          "Ontkoppelen"
                        ]
                      }
                    )
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: "Status aanpassen" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: currentStatus,
                      onValueChange: handleStatusChange,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectTrigger,
                          {
                            className: "bg-background border-border text-foreground",
                            "data-ocid": "detail-status-dropdown",
                            "aria-label": "Status wijzigen",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border z-50", children: ALL_STATUSES$1.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectItem,
                          {
                            value: s.value,
                            className: "text-foreground focus:bg-muted",
                            children: s.label
                          },
                          s.value
                        )) })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "label",
                    {
                      htmlFor: `notes-${reservation.id}`,
                      className: "text-sm font-medium text-foreground flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          MessageSquare,
                          {
                            className: "h-4 w-4 text-muted-foreground",
                            "aria-hidden": "true"
                          }
                        ),
                        "Notities"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: `notes-${reservation.id}`,
                      value: notes,
                      onChange: (e) => {
                        setNotes(e.target.value);
                        setNotesDirty(true);
                      },
                      placeholder: "Voeg notities toe over deze reservering...",
                      rows: 3,
                      className: "bg-background border-border text-foreground placeholder:text-muted-foreground resize-none",
                      "data-ocid": "modal-notes",
                      "aria-label": "Notities voor reservering"
                    }
                  ),
                  notesDirty && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "border-primary text-primary hover:bg-primary/10",
                      onClick: () => {
                        onSaveNotes(reservation.id, notes);
                        setNotesDirty(false);
                      },
                      "data-ocid": "modal-save-notes",
                      children: "Notities opslaan"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  canCheckIn && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      className: "bg-primary text-primary-foreground hover:bg-primary/90 gap-2",
                      onClick: () => {
                        onCheckIn(reservation);
                        onClose();
                      },
                      "data-ocid": "modal-checkin",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
                        "Inchecken"
                      ]
                    }
                  ),
                  canCancel && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "outline",
                      className: "border-destructive text-destructive hover:bg-destructive/10 gap-2",
                      onClick: () => setShowCancelDialog(true),
                      "data-ocid": "modal-cancel",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
                        "Annuleren"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      className: "ml-auto text-muted-foreground hover:text-foreground",
                      onClick: onClose,
                      "data-ocid": "modal-close",
                      children: "Sluiten"
                    }
                  )
                ] })
              ] })
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "w-full flex items-center justify-between py-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
                  onClick: () => setShowHistory((v) => !v),
                  "aria-expanded": showHistory,
                  "data-ocid": "reservation.history_toggle",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4", "aria-hidden": "true" }),
                      historyLabel
                    ] }),
                    showHistory ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4", "aria-hidden": "true" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4", "aria-hidden": "true" })
                  ]
                }
              ),
              showHistory && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", "data-ocid": "reservation.history_panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChangeHistoryPanel,
                {
                  reservationId: reservation.id,
                  locale
                }
              ) })
            ] })
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: showCancelDialog, onOpenChange: setShowCancelDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-border text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "text-foreground", children: "Reservering annuleren?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "text-muted-foreground", children: [
          "Weet je zeker dat je de reservering van",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: reservation.guestName }),
          " ",
          "wilt annuleren? Deze actie kan niet ongedaan worden gemaakt."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogCancel,
          {
            className: "bg-muted border-border text-foreground hover:bg-muted/80",
            "data-ocid": "cancel-dialog-dismiss",
            children: "Terug"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            onClick: () => {
              onCancel(reservation);
              setShowCancelDialog(false);
              onClose();
            },
            "data-ocid": "cancel-dialog-confirm",
            children: "Ja, annuleer"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TableAssignmentOverlay,
      {
        reservation,
        open: showAssignOverlay,
        onClose: () => setShowAssignOverlay(false)
      }
    )
  ] });
}
const STATUS_OPTIONS = [
  { label: "Alle statussen", value: "all" },
  { label: "Bevestigd", value: "confirmed" },
  { label: "Niet aangekomen", value: "not_arrived" },
  { label: "Te laat", value: "late" },
  { label: "Zit aan tafel", value: "seated" },
  { label: "Vertrokken", value: "departed" },
  { label: "Wachtlijst", value: "waitlist" },
  { label: "Geannuleerd", value: "cancelled" },
  { label: "Voltooid", value: "completed" }
];
const SERVICE_OPTIONS = [
  { label: "Alle services", value: "all" },
  { label: "Lunch (12:00–15:00)", value: "lunch" },
  { label: "Diner (17:00–21:00)", value: "dinner" },
  { label: "Laat diner (21:00–23:00)", value: "late_dinner" }
];
const STATUS_LABELS = {
  all: "Alle",
  confirmed: "Bevestigd",
  pending: "In behandeling",
  waitlist: "Wachtlijst",
  cancelled: "Geannuleerd",
  completed: "Voltooid",
  seated: "Zit aan tafel",
  no_show: "Niet verschenen",
  not_arrived: "Niet aangekomen",
  late: "Te laat",
  departed: "Vertrokken"
};
function ReservationFilters({
  filters,
  onChange
}) {
  var _a;
  const hasActiveFilters = filters.date !== "" || filters.status !== "all" || filters.search !== "" || filters.service !== "all";
  function clear() {
    onChange({ date: "", status: "all", search: "", service: "all" });
  }
  const activeChips = [];
  if (filters.date)
    activeChips.push({ key: "date", label: `📅 ${filters.date}` });
  if (filters.status !== "all")
    activeChips.push({
      key: "status",
      label: STATUS_LABELS[filters.status] ?? filters.status
    });
  if (filters.search)
    activeChips.push({ key: "search", label: `"${filters.search}"` });
  if (filters.service !== "all")
    activeChips.push({
      key: "service",
      label: ((_a = SERVICE_OPTIONS.find((s) => s.value === filters.service)) == null ? void 0 : _a.label) ?? filters.service
    });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "aria-label": "Reserveringen filteren", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[160px] max-w-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Search,
          {
            className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none",
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "filter-search",
            type: "search",
            placeholder: "Zoek gast…",
            value: filters.search,
            onChange: (e) => onChange({ ...filters, search: e.target.value }),
            className: "w-full pl-8 pr-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors",
            "data-ocid": "filter-search",
            "aria-label": "Zoek op gastnaam"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: filters.service,
          onValueChange: (val) => onChange({ ...filters, service: val }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-[160px] h-8 text-xs bg-background border-border text-foreground",
                "data-ocid": "filter-service",
                "aria-label": "Filter op service",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Service" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border z-50", children: SERVICE_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectItem,
              {
                value: opt.value,
                className: "text-foreground focus:bg-muted text-xs",
                children: opt.label
              },
              opt.value
            )) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: filters.status,
          onValueChange: (val) => onChange({ ...filters, status: val }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-[160px] h-8 text-xs bg-background border-border text-foreground",
                "data-ocid": "filter-status",
                "aria-label": "Filter op status",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border z-50", children: STATUS_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectItem,
              {
                value: opt.value,
                className: "text-foreground focus:bg-muted text-xs",
                children: opt.label
              },
              opt.value
            )) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "date",
          value: filters.date,
          onChange: (e) => onChange({ ...filters, date: e.target.value }),
          className: "h-8 px-2 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary transition-colors",
          "data-ocid": "filter-date",
          "aria-label": "Filter op datum"
        }
      ),
      hasActiveFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: clear,
          className: "h-8 text-xs text-muted-foreground hover:text-foreground gap-1",
          "data-ocid": "filter-clear",
          "aria-label": "Filters wissen",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }),
            "Wissen"
          ]
        }
      )
    ] }),
    activeChips.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-wrap gap-1.5", "aria-label": "Actieve filters", children: activeChips.map((chip) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "li",
      {
        className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20",
        children: [
          chip.label,
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": `Verwijder filter ${chip.label}`,
              onClick: () => {
                if (chip.key === "date") onChange({ ...filters, date: "" });
                else if (chip.key === "status")
                  onChange({ ...filters, status: "all" });
                else if (chip.key === "service")
                  onChange({ ...filters, service: "all" });
                else onChange({ ...filters, search: "" });
              },
              className: "ml-0.5 rounded-full hover:bg-primary/20 transition-colors p-0.5",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-2.5 w-2.5" })
            }
          )
        ]
      },
      chip.key
    )) })
  ] });
}
var [createTooltipContext] = createContextScope("Tooltip", [
  createPopperScope
]);
var usePopperScope = createPopperScope();
var PROVIDER_NAME = "TooltipProvider";
var DEFAULT_DELAY_DURATION = 700;
var TOOLTIP_OPEN = "tooltip.open";
var [TooltipProviderContextProvider, useTooltipProviderContext] = createTooltipContext(PROVIDER_NAME);
var TooltipProvider$1 = (props) => {
  const {
    __scopeTooltip,
    delayDuration = DEFAULT_DELAY_DURATION,
    skipDelayDuration = 300,
    disableHoverableContent = false,
    children
  } = props;
  const isOpenDelayedRef = reactExports.useRef(true);
  const isPointerInTransitRef = reactExports.useRef(false);
  const skipDelayTimerRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    const skipDelayTimer = skipDelayTimerRef.current;
    return () => window.clearTimeout(skipDelayTimer);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    TooltipProviderContextProvider,
    {
      scope: __scopeTooltip,
      isOpenDelayedRef,
      delayDuration,
      onOpen: reactExports.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current);
        isOpenDelayedRef.current = false;
      }, []),
      onClose: reactExports.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current);
        skipDelayTimerRef.current = window.setTimeout(
          () => isOpenDelayedRef.current = true,
          skipDelayDuration
        );
      }, [skipDelayDuration]),
      isPointerInTransitRef,
      onPointerInTransitChange: reactExports.useCallback((inTransit) => {
        isPointerInTransitRef.current = inTransit;
      }, []),
      disableHoverableContent,
      children
    }
  );
};
TooltipProvider$1.displayName = PROVIDER_NAME;
var TOOLTIP_NAME = "Tooltip";
var [TooltipContextProvider, useTooltipContext] = createTooltipContext(TOOLTIP_NAME);
var Tooltip$1 = (props) => {
  const {
    __scopeTooltip,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    disableHoverableContent: disableHoverableContentProp,
    delayDuration: delayDurationProp
  } = props;
  const providerContext = useTooltipProviderContext(TOOLTIP_NAME, props.__scopeTooltip);
  const popperScope = usePopperScope(__scopeTooltip);
  const [trigger, setTrigger] = reactExports.useState(null);
  const contentId = useId();
  const openTimerRef = reactExports.useRef(0);
  const disableHoverableContent = disableHoverableContentProp ?? providerContext.disableHoverableContent;
  const delayDuration = delayDurationProp ?? providerContext.delayDuration;
  const wasOpenDelayedRef = reactExports.useRef(false);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: (open2) => {
      if (open2) {
        providerContext.onOpen();
        document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN));
      } else {
        providerContext.onClose();
      }
      onOpenChange == null ? void 0 : onOpenChange(open2);
    },
    caller: TOOLTIP_NAME
  });
  const stateAttribute = reactExports.useMemo(() => {
    return open ? wasOpenDelayedRef.current ? "delayed-open" : "instant-open" : "closed";
  }, [open]);
  const handleOpen = reactExports.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = 0;
    wasOpenDelayedRef.current = false;
    setOpen(true);
  }, [setOpen]);
  const handleClose = reactExports.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = 0;
    setOpen(false);
  }, [setOpen]);
  const handleDelayedOpen = reactExports.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = window.setTimeout(() => {
      wasOpenDelayedRef.current = true;
      setOpen(true);
      openTimerRef.current = 0;
    }, delayDuration);
  }, [delayDuration, setOpen]);
  reactExports.useEffect(() => {
    return () => {
      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current);
        openTimerRef.current = 0;
      }
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    TooltipContextProvider,
    {
      scope: __scopeTooltip,
      contentId,
      open,
      stateAttribute,
      trigger,
      onTriggerChange: setTrigger,
      onTriggerEnter: reactExports.useCallback(() => {
        if (providerContext.isOpenDelayedRef.current) handleDelayedOpen();
        else handleOpen();
      }, [providerContext.isOpenDelayedRef, handleDelayedOpen, handleOpen]),
      onTriggerLeave: reactExports.useCallback(() => {
        if (disableHoverableContent) {
          handleClose();
        } else {
          window.clearTimeout(openTimerRef.current);
          openTimerRef.current = 0;
        }
      }, [handleClose, disableHoverableContent]),
      onOpen: handleOpen,
      onClose: handleClose,
      disableHoverableContent,
      children
    }
  ) });
};
Tooltip$1.displayName = TOOLTIP_NAME;
var TRIGGER_NAME = "TooltipTrigger";
var TooltipTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTooltip, ...triggerProps } = props;
    const context = useTooltipContext(TRIGGER_NAME, __scopeTooltip);
    const providerContext = useTooltipProviderContext(TRIGGER_NAME, __scopeTooltip);
    const popperScope = usePopperScope(__scopeTooltip);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, context.onTriggerChange);
    const isPointerDownRef = reactExports.useRef(false);
    const hasPointerMoveOpenedRef = reactExports.useRef(false);
    const handlePointerUp = reactExports.useCallback(() => isPointerDownRef.current = false, []);
    reactExports.useEffect(() => {
      return () => document.removeEventListener("pointerup", handlePointerUp);
    }, [handlePointerUp]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { asChild: true, ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        "aria-describedby": context.open ? context.contentId : void 0,
        "data-state": context.stateAttribute,
        ...triggerProps,
        ref: composedRefs,
        onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
          if (event.pointerType === "touch") return;
          if (!hasPointerMoveOpenedRef.current && !providerContext.isPointerInTransitRef.current) {
            context.onTriggerEnter();
            hasPointerMoveOpenedRef.current = true;
          }
        }),
        onPointerLeave: composeEventHandlers(props.onPointerLeave, () => {
          context.onTriggerLeave();
          hasPointerMoveOpenedRef.current = false;
        }),
        onPointerDown: composeEventHandlers(props.onPointerDown, () => {
          if (context.open) {
            context.onClose();
          }
          isPointerDownRef.current = true;
          document.addEventListener("pointerup", handlePointerUp, { once: true });
        }),
        onFocus: composeEventHandlers(props.onFocus, () => {
          if (!isPointerDownRef.current) context.onOpen();
        }),
        onBlur: composeEventHandlers(props.onBlur, context.onClose),
        onClick: composeEventHandlers(props.onClick, context.onClose)
      }
    ) });
  }
);
TooltipTrigger$1.displayName = TRIGGER_NAME;
var PORTAL_NAME = "TooltipPortal";
var [PortalProvider, usePortalContext] = createTooltipContext(PORTAL_NAME, {
  forceMount: void 0
});
var TooltipPortal = (props) => {
  const { __scopeTooltip, forceMount, children, container } = props;
  const context = useTooltipContext(PORTAL_NAME, __scopeTooltip);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalProvider, { scope: __scopeTooltip, forceMount, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { asChild: true, container, children }) }) });
};
TooltipPortal.displayName = PORTAL_NAME;
var CONTENT_NAME = "TooltipContent";
var TooltipContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeTooltip);
    const { forceMount = portalContext.forceMount, side = "top", ...contentProps } = props;
    const context = useTooltipContext(CONTENT_NAME, props.__scopeTooltip);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: context.disableHoverableContent ? /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContentImpl, { side, ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContentHoverable, { side, ...contentProps, ref: forwardedRef }) });
  }
);
var TooltipContentHoverable = reactExports.forwardRef((props, forwardedRef) => {
  const context = useTooltipContext(CONTENT_NAME, props.__scopeTooltip);
  const providerContext = useTooltipProviderContext(CONTENT_NAME, props.__scopeTooltip);
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const [pointerGraceArea, setPointerGraceArea] = reactExports.useState(null);
  const { trigger, onClose } = context;
  const content = ref.current;
  const { onPointerInTransitChange } = providerContext;
  const handleRemoveGraceArea = reactExports.useCallback(() => {
    setPointerGraceArea(null);
    onPointerInTransitChange(false);
  }, [onPointerInTransitChange]);
  const handleCreateGraceArea = reactExports.useCallback(
    (event, hoverTarget) => {
      const currentTarget = event.currentTarget;
      const exitPoint = { x: event.clientX, y: event.clientY };
      const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());
      const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide);
      const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
      const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
      setPointerGraceArea(graceArea);
      onPointerInTransitChange(true);
    },
    [onPointerInTransitChange]
  );
  reactExports.useEffect(() => {
    return () => handleRemoveGraceArea();
  }, [handleRemoveGraceArea]);
  reactExports.useEffect(() => {
    if (trigger && content) {
      const handleTriggerLeave = (event) => handleCreateGraceArea(event, content);
      const handleContentLeave = (event) => handleCreateGraceArea(event, trigger);
      trigger.addEventListener("pointerleave", handleTriggerLeave);
      content.addEventListener("pointerleave", handleContentLeave);
      return () => {
        trigger.removeEventListener("pointerleave", handleTriggerLeave);
        content.removeEventListener("pointerleave", handleContentLeave);
      };
    }
  }, [trigger, content, handleCreateGraceArea, handleRemoveGraceArea]);
  reactExports.useEffect(() => {
    if (pointerGraceArea) {
      const handleTrackPointerGrace = (event) => {
        const target = event.target;
        const pointerPosition = { x: event.clientX, y: event.clientY };
        const hasEnteredTarget = (trigger == null ? void 0 : trigger.contains(target)) || (content == null ? void 0 : content.contains(target));
        const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea);
        if (hasEnteredTarget) {
          handleRemoveGraceArea();
        } else if (isPointerOutsideGraceArea) {
          handleRemoveGraceArea();
          onClose();
        }
      };
      document.addEventListener("pointermove", handleTrackPointerGrace);
      return () => document.removeEventListener("pointermove", handleTrackPointerGrace);
    }
  }, [trigger, content, pointerGraceArea, onClose, handleRemoveGraceArea]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContentImpl, { ...props, ref: composedRefs });
});
var [VisuallyHiddenContentContextProvider, useVisuallyHiddenContentContext] = createTooltipContext(TOOLTIP_NAME, { isInside: false });
var Slottable = createSlottable("TooltipContent");
var TooltipContentImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTooltip,
      children,
      "aria-label": ariaLabel,
      onEscapeKeyDown,
      onPointerDownOutside,
      ...contentProps
    } = props;
    const context = useTooltipContext(CONTENT_NAME, __scopeTooltip);
    const popperScope = usePopperScope(__scopeTooltip);
    const { onClose } = context;
    reactExports.useEffect(() => {
      document.addEventListener(TOOLTIP_OPEN, onClose);
      return () => document.removeEventListener(TOOLTIP_OPEN, onClose);
    }, [onClose]);
    reactExports.useEffect(() => {
      if (context.trigger) {
        const handleScroll = (event) => {
          const target = event.target;
          if (target == null ? void 0 : target.contains(context.trigger)) onClose();
        };
        window.addEventListener("scroll", handleScroll, { capture: true });
        return () => window.removeEventListener("scroll", handleScroll, { capture: true });
      }
    }, [context.trigger, onClose]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      DismissableLayer,
      {
        asChild: true,
        disableOutsidePointerEvents: false,
        onEscapeKeyDown,
        onPointerDownOutside,
        onFocusOutside: (event) => event.preventDefault(),
        onDismiss: onClose,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Content,
          {
            "data-state": context.stateAttribute,
            ...popperScope,
            ...contentProps,
            ref: forwardedRef,
            style: {
              ...contentProps.style,
              // re-namespace exposed content custom properties
              ...{
                "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
                "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
                "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
                "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
                "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
              }
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Slottable, { children }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(VisuallyHiddenContentContextProvider, { scope: __scopeTooltip, isInside: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { id: context.contentId, role: "tooltip", children: ariaLabel || children }) })
            ]
          }
        )
      }
    );
  }
);
TooltipContent$1.displayName = CONTENT_NAME;
var ARROW_NAME = "TooltipArrow";
var TooltipArrow = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTooltip, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopeTooltip);
    const visuallyHiddenContentContext = useVisuallyHiddenContentContext(
      ARROW_NAME,
      __scopeTooltip
    );
    return visuallyHiddenContentContext.isInside ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef });
  }
);
TooltipArrow.displayName = ARROW_NAME;
function getExitSideFromRect(point, rect) {
  const top = Math.abs(rect.top - point.y);
  const bottom = Math.abs(rect.bottom - point.y);
  const right = Math.abs(rect.right - point.x);
  const left = Math.abs(rect.left - point.x);
  switch (Math.min(top, bottom, right, left)) {
    case left:
      return "left";
    case right:
      return "right";
    case top:
      return "top";
    case bottom:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
  const paddedExitPoints = [];
  switch (exitSide) {
    case "top":
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y + padding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding }
      );
      break;
    case "bottom":
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x + padding, y: exitPoint.y - padding }
      );
      break;
    case "left":
      paddedExitPoints.push(
        { x: exitPoint.x + padding, y: exitPoint.y - padding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding }
      );
      break;
    case "right":
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x - padding, y: exitPoint.y + padding }
      );
      break;
  }
  return paddedExitPoints;
}
function getPointsFromRect(rect) {
  const { top, right, bottom, left } = rect;
  return [
    { x: left, y: top },
    { x: right, y: top },
    { x: right, y: bottom },
    { x: left, y: bottom }
  ];
}
function isPointInPolygon(point, polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const ii = polygon[i];
    const jj = polygon[j];
    const xi = ii.x;
    const yi = ii.y;
    const xj = jj.x;
    const yj = jj.y;
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function getHull(points) {
  const newPoints = points.slice();
  newPoints.sort((a, b) => {
    if (a.x < b.x) return -1;
    else if (a.x > b.x) return 1;
    else if (a.y < b.y) return -1;
    else if (a.y > b.y) return 1;
    else return 0;
  });
  return getHullPresorted(newPoints);
}
function getHullPresorted(points) {
  if (points.length <= 1) return points.slice();
  const upperHull = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    while (upperHull.length >= 2) {
      const q = upperHull[upperHull.length - 1];
      const r = upperHull[upperHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop();
      else break;
    }
    upperHull.push(p);
  }
  upperHull.pop();
  const lowerHull = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (lowerHull.length >= 2) {
      const q = lowerHull[lowerHull.length - 1];
      const r = lowerHull[lowerHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop();
      else break;
    }
    lowerHull.push(p);
  }
  lowerHull.pop();
  if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) {
    return upperHull;
  } else {
    return upperHull.concat(lowerHull);
  }
}
var Provider = TooltipProvider$1;
var Root3 = Tooltip$1;
var Trigger = TooltipTrigger$1;
var Portal = TooltipPortal;
var Content2 = TooltipContent$1;
var Arrow2 = TooltipArrow;
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
function Tooltip({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Root3, { "data-slot": "tooltip", ...props }) });
}
function TooltipTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content2,
    {
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow2, { className: "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    }
  ) });
}
const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5"];
const ALL_STATUSES = [
  "confirmed",
  "not_arrived",
  "late",
  "seated",
  "departed",
  "cancelled",
  "waitlist",
  "completed",
  "no_show"
];
const STATUS_LABELS_NL = {
  confirmed: "Bevestigd",
  not_arrived: "Niet aangekomen",
  late: "Te laat",
  seated: "Zit aan tafel",
  departed: "Vertrokken",
  cancelled: "Geannuleerd",
  waitlist: "Wachtlijst",
  completed: "Voltooid",
  no_show: "Niet verschenen",
  pending: "In behandeling"
};
const AVATAR_COLOR = {
  confirmed: "bg-[#16a34a]/20 text-[#22C55E]",
  not_arrived: "bg-amber-500/20 text-amber-400",
  late: "bg-orange-600/20 text-orange-400",
  seated: "bg-[#15803d]/20 text-[#22C55E]",
  departed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/20 text-destructive",
  waitlist: "bg-[#2563eb]/20 text-[#3B82F6]",
  completed: "bg-muted text-muted-foreground",
  no_show: "bg-destructive/20 text-destructive",
  pending: "bg-accent/20 text-accent"
};
function formatDate(d) {
  if (!d) return "—";
  const dt = /* @__PURE__ */ new Date(`${d}T00:00:00`);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("nl-BE", {
    day: "2-digit",
    month: "short"
  });
}
function ReservationList({
  reservations,
  isLoading,
  onView,
  onCheckIn,
  onCancel,
  onStatusChange
}) {
  var _a;
  const { t, i18n } = useTranslation(["dashboard"]);
  const lang = ((_a = i18n.language) == null ? void 0 : _a.slice(0, 2)) ?? "nl";
  const [sortKey, setSortKey] = reactExports.useState("date");
  const [sortDir, setSortDir] = reactExports.useState("asc");
  const [assignTarget, setAssignTarget] = reactExports.useState(null);
  const { data: floorState } = useFloorState();
  function getAssignedTableName(res) {
    if (!floorState) return res.tableNumber ? `T${res.tableNumber}` : null;
    const t2 = floorState.tables.find((tbl) => tbl.reservationId === res.id);
    if (t2) return t2.name.replace(/^Tafel\s*/i, "T");
    if (res.tableNumber) return `T${res.tableNumber}`;
    return null;
  }
  const tooltipAssign = lang === "en" ? "Assign table" : lang === "fr" ? "Assigner table" : "Tafel toewijzen";
  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }
  const sorted = [...reservations].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "date")
      cmp = a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
    else if (sortKey === "time") cmp = a.time.localeCompare(b.time);
    else cmp = a.partySize - b.partySize;
    return sortDir === "asc" ? cmp : -cmp;
  });
  const SortIcon = ({ k }) => sortKey === k ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", className: "ml-1 text-primary", children: sortDir === "asc" ? "↑" : "↓" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", className: "ml-1 text-muted-foreground/40", children: "↕" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(TooltipProvider, { delayDuration: 300, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "table",
      {
        className: "w-full text-sm",
        "aria-label": t("dashboard:reservations.title"),
        "aria-busy": isLoading,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                scope: "col",
                className: "px-4 py-3 text-left font-medium text-muted-foreground",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleSort("date"),
                    className: "flex items-center hover:text-foreground transition-colors focus-visible:outline-none focus-visible:text-primary",
                    "aria-sort": sortKey === "date" ? sortDir === "asc" ? "ascending" : "descending" : "none",
                    children: [
                      t("dashboard:reservations.columns.date"),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { k: "date" })
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                scope: "col",
                className: "px-4 py-3 text-left font-medium text-muted-foreground",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleSort("time"),
                    className: "flex items-center hover:text-foreground transition-colors focus-visible:outline-none focus-visible:text-primary",
                    "aria-sort": sortKey === "time" ? sortDir === "asc" ? "ascending" : "descending" : "none",
                    children: [
                      t("dashboard:reservations.columns.time"),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { k: "time" })
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                scope: "col",
                className: "px-4 py-3 text-left font-medium text-muted-foreground min-w-[160px]",
                children: t("dashboard:reservations.columns.guest")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                scope: "col",
                className: "px-4 py-3 text-left font-medium text-muted-foreground",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleSort("partySize"),
                    className: "flex items-center hover:text-foreground transition-colors focus-visible:outline-none focus-visible:text-primary",
                    "aria-sort": sortKey === "partySize" ? sortDir === "asc" ? "ascending" : "descending" : "none",
                    children: [
                      t("dashboard:reservations.columns.partyShort"),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { k: "partySize" })
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                scope: "col",
                className: "px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell",
                children: t("dashboard:reservations.columns.table", "Tafel")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                scope: "col",
                className: "px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell",
                children: t("dashboard:reservations.columns.experience")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                scope: "col",
                className: "px-4 py-3 text-left font-medium text-muted-foreground min-w-[160px]",
                children: t("dashboard:reservations.columns.status")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                scope: "col",
                className: "px-4 py-3 text-right font-medium text-muted-foreground",
                children: t("dashboard:reservations.columns.actions")
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonTableRow, {}) }) }, k)) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-16 text-center",
              "data-ocid": "reservations.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CalendarDays,
                  {
                    className: "h-10 w-10 text-muted-foreground/30 mb-3",
                    "aria-hidden": "true"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: t("dashboard:reservations.empty") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: t("dashboard:reservations.emptyHint") })
              ]
            }
          ) }) }) : sorted.map((res, rowIdx) => {
            const assignedTableName = getAssignedTableName(res);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border hover:bg-muted/20 transition-colors group",
                "data-ocid": `reservations.item.${rowIdx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground whitespace-nowrap text-sm", children: formatDate(res.date) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground whitespace-nowrap tabular-nums font-medium", children: res.time }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${AVATAR_COLOR[res.status] ?? "bg-muted text-muted-foreground"}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: res.guestName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          className: "text-sm font-semibold text-foreground truncate hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline text-left",
                          onClick: () => onView(res),
                          "aria-label": t(
                            "dashboard:reservations.actions.view",
                            { name: res.guestName }
                          ),
                          children: res.guestName
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: res.guestEmail })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground text-center tabular-nums font-medium", children: res.partySize }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: assignedTableName ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: (e) => {
                          e.stopPropagation();
                          setAssignTarget(res);
                        },
                        className: "inline-flex items-center gap-1 text-xs font-medium text-foreground bg-muted px-2 py-1 rounded-md hover:bg-primary/10 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        "aria-label": tooltipAssign,
                        "data-ocid": `reservations.assign_button.${rowIdx + 1}`,
                        children: [
                          assignedTableName,
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-2.5 w-2.5 opacity-60" })
                        ]
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: (e) => {
                          e.stopPropagation();
                          setAssignTarget(res);
                        },
                        className: "inline-flex items-center gap-1 text-xs font-medium text-muted-foreground border border-dashed border-border px-2 py-1 rounded-md hover:border-primary/50 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        "aria-label": tooltipAssign,
                        "data-ocid": `reservations.assign_button.${rowIdx + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-2.5 w-2.5" }),
                          lang === "en" ? "Table" : lang === "fr" ? "Table" : "Tafel"
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: tooltipAssign })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground truncate max-w-[140px] hidden md:table-cell text-xs", children: res.experienceName ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-purple-400", children: [
                    "✨ ",
                    res.experienceName
                  ] }) : "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: res.status,
                      onValueChange: (val) => onStatusChange(res.id, val),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectTrigger,
                          {
                            className: "h-7 text-xs border-border bg-transparent w-auto min-w-[130px] focus:ring-1 focus:ring-primary",
                            "data-ocid": `reservations.status_dropdown.${rowIdx + 1}`,
                            "aria-label": `Status voor ${res.guestName}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: res.status }) })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border z-50", children: ALL_STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectItem,
                          {
                            value: s,
                            className: "text-foreground focus:bg-muted text-xs",
                            children: STATUS_LABELS_NL[s] ?? s
                          },
                          s
                        )) })
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted",
                          onClick: (e) => {
                            e.stopPropagation();
                            onView(res);
                          },
                          "aria-label": t(
                            "dashboard:reservations.actions.view",
                            { name: res.guestName }
                          ),
                          "data-ocid": `reservations.view_button.${rowIdx + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" })
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Bekijken" })
                    ] }),
                    res.status !== "cancelled" && res.status !== "completed" && res.status !== "seated" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "h-7 w-7 text-primary/70 hover:text-primary hover:bg-primary/10",
                          onClick: (e) => {
                            e.stopPropagation();
                            onCheckIn(res);
                          },
                          "aria-label": t(
                            "dashboard:reservations.actions.checkIn",
                            { name: res.guestName }
                          ),
                          "data-ocid": `reservations.checkin_button.${rowIdx + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" })
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Inchecken" })
                    ] }),
                    res.status !== "cancelled" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10",
                          onClick: (e) => {
                            e.stopPropagation();
                            onCancel(res);
                          },
                          "aria-label": t(
                            "dashboard:reservations.actions.cancel",
                            { name: res.guestName }
                          ),
                          "data-ocid": `reservations.cancel_button.${rowIdx + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Annuleren" })
                    ] })
                  ] }) })
                ]
              },
              res.id
            );
          }) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TableAssignmentOverlay,
      {
        reservation: assignTarget,
        open: assignTarget !== null,
        onClose: () => setAssignTarget(null)
      }
    )
  ] });
}
function localTodayString() {
  const d = /* @__PURE__ */ new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function matchesService(time, service) {
  if (service === "all") return true;
  const mins = timeToMinutes(time);
  if (service === "lunch") return mins >= 11 * 60 && mins < 15 * 60;
  if (service === "dinner") return mins >= 17 * 60 && mins < 23 * 60;
  return true;
}
function getDateBounds(range) {
  const today = localTodayString();
  const now = /* @__PURE__ */ new Date();
  if (range === "today") {
    return { start: today, end: today };
  }
  if (range === "week") {
    let toLocal2 = function(d) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day2 = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day2}`;
    };
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const mon = new Date(now);
    mon.setDate(now.getDate() + diff);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    return { start: toLocal2(mon), end: toLocal2(sun) };
  }
  const end = new Date(now);
  end.setDate(now.getDate() + 6);
  function toLocal(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day2 = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day2}`;
  }
  return { start: today, end: toLocal(end) };
}
function ReservationsPage() {
  const { t } = useTranslation(["dashboard"]);
  const queryClient = useQueryClient();
  const {
    data: allReservations = [],
    isLoading,
    isFetching
  } = useReservations();
  const { data: openingHours } = useOpeningHoursConfig();
  const updateStatus = useUpdateReservationStatus();
  const updateReservation = useUpdateReservation();
  const [view, setView] = reactExports.useState("calendar");
  const [dateRange, setDateRange] = reactExports.useState("today");
  const [filters, setFilters] = reactExports.useState({
    date: "",
    status: "all",
    search: "",
    service: "all"
  });
  const [selectedTable, setSelectedTable] = reactExports.useState(null);
  const [localOverrides, setLocalOverrides] = reactExports.useState({});
  const [selectedReservation, setSelectedReservation] = reactExports.useState(null);
  const [detailOpen, setDetailOpen] = reactExports.useState(false);
  const [newModalOpen, setNewModalOpen] = reactExports.useState(false);
  const [editingReservation, setEditingReservation] = reactExports.useState(null);
  const reservations = reactExports.useMemo(() => {
    return allReservations.map(
      (r) => localOverrides[r.id] ? { ...r, status: localOverrides[r.id] } : r
    );
  }, [allReservations, localOverrides]);
  const bounds = getDateBounds(dateRange);
  const TODAY = localTodayString();
  const filtered = reactExports.useMemo(() => {
    return reservations.filter((r) => {
      const dateToCheck = filters.date || null;
      if (dateToCheck) {
        if (r.date !== dateToCheck) return false;
      } else {
        if (r.date < bounds.start || r.date > bounds.end) return false;
      }
      if (filters.status !== "all" && r.status !== filters.status) return false;
      if (!matchesService(r.time, filters.service)) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!r.guestName.toLowerCase().includes(q) && !(r.guestEmail ?? "").toLowerCase().includes(q))
          return false;
      }
      if (selectedTable !== null) {
        if (String(r.tableNumber) !== selectedTable) return false;
      }
      return true;
    });
  }, [reservations, filters, bounds, selectedTable]);
  const todayCount = reactExports.useMemo(
    () => reservations.filter((r) => r.date === TODAY && r.status !== "cancelled").length,
    [reservations, TODAY]
  );
  function openDetail(r) {
    setSelectedReservation(r);
    setDetailOpen(true);
  }
  function openNew() {
    setEditingReservation(null);
    setNewModalOpen(true);
  }
  function handleReservationSaved(_saved) {
    queryClient.invalidateQueries({ queryKey: ["reservations"] });
    queryClient.invalidateQueries({ queryKey: ["floorState"] });
  }
  function handleStatusChange(id, status) {
    setLocalOverrides((prev) => ({ ...prev, [id]: status }));
    if ((selectedReservation == null ? void 0 : selectedReservation.id) === id) {
      setSelectedReservation((prev) => prev ? { ...prev, status } : prev);
    }
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => {
          setLocalOverrides((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        },
        onError: () => {
          setLocalOverrides((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
          ue.error(t("dashboard:reservations.statusError"));
        }
      }
    );
  }
  function handleCheckIn(r) {
    handleStatusChange(r.id, "seated");
    ue.success(t("dashboard:reservations.checkedIn", { name: r.guestName }));
  }
  function handleCancel(r) {
    handleStatusChange(r.id, "cancelled");
    ue.success(t("dashboard:reservations.cancelled", { name: r.guestName }));
  }
  function handleSaveNotes(id, notes) {
    const reservation = allReservations.find((r) => r.id === id);
    if (!reservation) return;
    updateReservation.mutate(
      {
        id,
        date: reservation.date,
        time: reservation.time,
        partySize: reservation.partySize,
        specialRequests: notes
      },
      {
        onSuccess: () => ue.success(t("dashboard:reservations.notesSaved")),
        onError: () => ue.error(t("dashboard:reservations.statusError"))
      }
    );
  }
  function handleCalendarDayService(date, serviceId) {
    const services = (openingHours == null ? void 0 : openingHours.services) ?? [];
    const service = services.find((s) => s.id === serviceId);
    let serviceFilter = "all";
    if (service) {
      const nameLower = service.name.toLowerCase();
      if (nameLower.includes("lunch")) serviceFilter = "lunch";
      else if (nameLower.includes("diner") || nameLower.includes("dinner"))
        serviceFilter = "dinner";
    }
    setView("list");
    setFilters((f) => ({
      ...f,
      date,
      service: serviceFilter,
      status: "all",
      search: ""
    }));
    setDateRange("today");
    setSelectedTable(null);
  }
  const DATE_RANGE_LABELS = {
    today: t("dashboard:reservations.filterToday"),
    week: t("dashboard:reservations.filterThisWeek"),
    next7: t("dashboard:reservations.filterNext7")
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-foreground tracking-tight", children: t("dashboard:reservations.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          t("dashboard:reservations.total", { count: reservations.length }),
          " ",
          "·",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-medium", children: [
            todayCount,
            " ",
            t("dashboard:reservations.filterToday").toLowerCase()
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: () => queryClient.invalidateQueries({ queryKey: ["reservations"] }),
            disabled: isFetching,
            className: "text-muted-foreground hover:text-foreground",
            "aria-label": "Vernieuwen",
            "data-ocid": "refresh-reservations",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              RefreshCw,
              {
                className: `h-4 w-4 ${isFetching ? "animate-spin" : ""}`
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-md rounded-xl",
            "data-ocid": "new-reservation-btn",
            "aria-label": t("dashboard:reservations.newReservation"),
            onClick: openNew,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              t("dashboard:reservations.newReservation")
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setView("calendar"),
          "data-ocid": "toggle-calendar",
          className: `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${view === "calendar" ? "bg-gradient-to-r from-card to-background text-foreground border border-primary/30 shadow-md" : "bg-muted/40 text-muted-foreground border border-border hover:bg-muted hover:text-foreground"}`,
          "aria-pressed": view === "calendar",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-4 w-4" }),
            t("dashboard:reservations.tabCalendar")
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setView("list"),
          "data-ocid": "toggle-list",
          className: `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${view === "list" ? "bg-gradient-to-r from-card to-background text-foreground border border-primary/30 shadow-md" : "bg-muted/40 text-muted-foreground border border-border hover:bg-muted hover:text-foreground"}`,
          "aria-pressed": view === "list",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "h-4 w-4" }),
            t("dashboard:reservations.tabList")
          ]
        }
      )
    ] }),
    view === "list" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border shadow-sm p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-3", children: [
        ["today", "week", "next7"].map((range) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setDateRange(range);
              setFilters((f) => ({ ...f, date: "" }));
            },
            "data-ocid": `date-range-${range}`,
            className: `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${dateRange === range && !filters.date ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border"}`,
            children: DATE_RANGE_LABELS[range]
          },
          range
        )),
        filters.date && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setFilters((f) => ({ ...f, date: "" })),
            className: "px-3 py-1.5 rounded-lg text-xs font-medium bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30 transition-colors",
            "data-ocid": "clear-date-filter",
            children: [
              filters.date,
              " ×"
            ]
          }
        ),
        selectedTable && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setSelectedTable(null),
            className: "px-3 py-1.5 rounded-lg text-xs font-medium bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30 transition-colors",
            "data-ocid": "clear-table-filter",
            children: [
              "Tafel ",
              selectedTable,
              " ×"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ReservationFilters, { filters, onChange: setFilters })
    ] }),
    view === "list" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MiniFloorPlan,
      {
        reservations: filtered,
        selectedTable,
        onSelectTable: (tableId) => setSelectedTable((prev) => prev === tableId ? null : tableId)
      }
    ),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-card border border-border shadow-sm p-6 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-lg" }, i)) }),
    !isLoading && (view === "calendar" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-card border border-border shadow-sm p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReservationCalendar,
      {
        reservations,
        onSelectReservation: openDetail,
        onSelectDayService: handleCalendarDayService
      }
    ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-card border border-border shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReservationList,
      {
        reservations: filtered,
        isLoading,
        onView: openDetail,
        onCheckIn: handleCheckIn,
        onCancel: handleCancel,
        onStatusChange: handleStatusChange
      }
    ) })),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReservationDetailModal,
      {
        reservation: selectedReservation,
        open: detailOpen,
        onClose: () => setDetailOpen(false),
        onCheckIn: handleCheckIn,
        onCancel: handleCancel,
        onSaveNotes: handleSaveNotes,
        onStatusChange: handleStatusChange
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NewReservationModal,
      {
        open: newModalOpen,
        onClose: () => {
          setNewModalOpen(false);
          setEditingReservation(null);
        },
        reservation: editingReservation,
        onReservationSaved: handleReservationSaved
      }
    )
  ] });
}
export {
  ReservationsPage as default
};
