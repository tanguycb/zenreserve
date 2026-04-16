import { u as useTranslation, j as jsxRuntimeExports, c as cn, r as reactExports, B as Button, d as ue, e as Clock, U as Users, T as Table2, f as Star, g as Separator, X, h as useComposedRefs, a as SkeletonTableRow, C as CalendarDays, i as useQueryClient, S as Skeleton } from "./index-OyrOOjf2.js";
import { u as useFloorState } from "./useSeatingPlan-DvjY5ciG.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-N-OH02Kl.js";
import { I as Input } from "./input-DotlNcOU.js";
import { L as Label } from "./label-DJEmRWLx.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, e as Search, R as Root2, A as Anchor, f as Arrow, g as createPopperScope, C as Content, h as Root } from "./select-HzP1b7-A.js";
import { T as Textarea } from "./textarea-D-9tW-LO.js";
import { b as useCreateReservation, a as useReservations, c as useUpdateReservationStatus } from "./useReservation-lqPfeWjm.js";
import { M as Minus } from "./minus-CELCch0C.js";
import { P as Plus } from "./plus-BpTLdwE7.js";
import { S as StatusBadge } from "./StatusBadge-zyRgD_8J.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-DzIgG8Xe.js";
import { C as Calendar } from "./calendar-BrHNFFQa.js";
import { C as CreditCard } from "./credit-card-C6Qonvnd.js";
import { M as MessageSquare } from "./message-square-sTv39GEm.js";
import { C as Check } from "./check-DfamBHMf.js";
import { u as useControllableState, P as Primitive, c as composeEventHandlers, a as createContextScope, b as createSlottable } from "./index-DiPf0GnM.js";
import { u as useId, P as Portal$1, D as DismissableLayer } from "./index-Bx7gVB10.js";
import { P as Presence } from "./index-D_6YQFNs.js";
import { E as Eye } from "./eye-CYaJcTwJ.js";
import { C as ChevronLeft } from "./chevron-left-DT4sz5G1.js";
import { C as ChevronRight } from "./chevron-right-BzK7BR_W.js";
import { R as RefreshCw } from "./refresh-cw-BQIrQ6xR.js";
import { L as List } from "./index-DhJnf9wk.js";
import "./index-DRyULZ_M.js";
import "./chevron-down-DPHz4usu.js";
import "./chevron-up-BoxKVSo1.js";
const OCCUPANCY_BG = {
  empty: {
    bg: "bg-[#16a34a]/20 hover:bg-[#16a34a]/35",
    ring: "ring-1 ring-[#22C55E]/50",
    dotColor: "bg-[#22C55E]/50"
  },
  reserved: {
    bg: "bg-amber-500/20 hover:bg-amber-500/35",
    ring: "ring-1 ring-amber-400/50",
    dotColor: "bg-amber-400/50"
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
function generateTimeSlots(openHour = 11, closeHour = 23) {
  const slots = [];
  for (let h = openHour; h < closeHour; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}
const TIME_SLOTS = generateTimeSlots();
const TODAY$1 = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
function blankForm(initial) {
  return {
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    partySize: 2,
    date: TODAY$1,
    time: "19:00",
    tableId: "auto",
    notes: "",
    ...initial
  };
}
function NewReservationModal({
  open,
  onClose,
  reservation,
  onReservationSaved
}) {
  const { t } = useTranslation(["dashboard"]);
  const createMutation = useCreateReservation();
  const { data: floorState } = useFloorState();
  const isEdit = !!reservation;
  const [form, setForm] = reactExports.useState(blankForm());
  const [errors, setErrors] = reactExports.useState({});
  const [submitError, setSubmitError] = reactExports.useState(null);
  const nameInputRef = reactExports.useRef(null);
  const tableOptions = [
    {
      id: "auto",
      label: t("dashboard:newReservation.autoAssign"),
      capacity: null
    },
    ...((floorState == null ? void 0 : floorState.tables) ?? []).map((tbl) => ({
      id: tbl.id,
      label: `${tbl.name} (${Number(tbl.capacity)} pers.)`,
      capacity: Number(tbl.capacity)
    }))
  ];
  reactExports.useEffect(() => {
    if (open) {
      if (reservation) {
        setForm({
          guestName: reservation.guestName,
          guestPhone: reservation.guestPhone ?? "",
          guestEmail: reservation.guestEmail ?? "",
          partySize: reservation.partySize,
          date: reservation.date,
          time: reservation.time,
          tableId: reservation.tableNumber ? `t${reservation.tableNumber}` : "auto",
          notes: reservation.notes ?? ""
        });
      } else {
        setForm(blankForm());
      }
      setErrors({});
      setSubmitError(null);
      setTimeout(() => {
        var _a;
        return (_a = nameInputRef.current) == null ? void 0 : _a.focus();
      }, 50);
    }
  }, [open, reservation]);
  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: void 0 }));
  }
  function validate() {
    const errs = {};
    if (!form.guestName.trim())
      errs.guestName = t("dashboard:newReservation.errors.nameRequired");
    if (!form.guestPhone.trim())
      errs.guestPhone = t("dashboard:newReservation.errors.phoneRequired");
    if (!form.date)
      errs.date = t("dashboard:newReservation.errors.dateInvalid");
    if (!form.time)
      errs.time = t("dashboard:newReservation.errors.timeRequired");
    if (form.partySize < 1)
      errs.partySize = t("dashboard:newReservation.errors.partySizeMin");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;
    const tableId = form.tableId !== "auto" ? form.tableId : null;
    try {
      const saved = await createMutation.mutateAsync({
        guestName: form.guestName.trim(),
        phone: form.guestPhone.trim(),
        email: form.guestEmail.trim(),
        partySize: form.partySize,
        date: form.date,
        time: form.time,
        tableId: tableId ?? void 0,
        notes: form.notes.trim() || void 0
      });
      ue.success(
        isEdit ? t("dashboard:newReservation.updatedSuccess", {
          name: form.guestName
        }) : t("dashboard:newReservation.createdSuccess", {
          name: form.guestName
        })
      );
      onReservationSaved == null ? void 0 : onReservationSaved(saved);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Onbekende fout";
      setSubmitError(msg);
    }
  }
  const isSubmitting = createMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "dark bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto",
      "data-ocid": "new-reservation-modal",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-foreground text-xl font-semibold", children: isEdit ? t("dashboard:newReservation.titleEdit") : t("dashboard:newReservation.title") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 mt-2", noValidate: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "nr-name",
                className: "text-foreground text-sm font-medium",
                children: [
                  t("dashboard:newReservation.guestName"),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "nr-name",
                ref: nameInputRef,
                value: form.guestName,
                onChange: (e) => set("guestName", e.target.value),
                placeholder: t("dashboard:newReservation.guestNamePlaceholder"),
                className: "bg-background border-border text-foreground placeholder:text-muted-foreground",
                "aria-required": "true",
                "aria-invalid": !!errors.guestName,
                "aria-describedby": errors.guestName ? "nr-name-err" : void 0,
                "data-ocid": "nr-guest-name"
              }
            ),
            errors.guestName && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                id: "nr-name-err",
                className: "text-xs text-destructive",
                role: "alert",
                children: errors.guestName
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "nr-phone",
                  className: "text-foreground text-sm font-medium",
                  children: [
                    t("dashboard:newReservation.phone"),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "nr-phone",
                  type: "tel",
                  value: form.guestPhone,
                  onChange: (e) => set("guestPhone", e.target.value),
                  placeholder: "+32 471 000 000",
                  className: "bg-background border-border text-foreground placeholder:text-muted-foreground",
                  "aria-required": "true",
                  "aria-invalid": !!errors.guestPhone,
                  "aria-describedby": errors.guestPhone ? "nr-phone-err" : void 0,
                  "data-ocid": "nr-guest-phone"
                }
              ),
              errors.guestPhone && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  id: "nr-phone-err",
                  className: "text-xs text-destructive",
                  role: "alert",
                  children: errors.guestPhone
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "nr-email",
                  className: "text-foreground text-sm font-medium",
                  children: t("dashboard:newReservation.email")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "nr-email",
                  type: "email",
                  value: form.guestEmail,
                  onChange: (e) => set("guestEmail", e.target.value),
                  placeholder: "gast@email.com",
                  className: "bg-background border-border text-foreground placeholder:text-muted-foreground",
                  "data-ocid": "nr-guest-email"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "nr-date",
                  className: "text-foreground text-sm font-medium",
                  children: [
                    t("dashboard:newReservation.date"),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "nr-date",
                  type: "date",
                  value: form.date,
                  min: TODAY$1,
                  onChange: (e) => set("date", e.target.value),
                  className: "bg-background border-border text-foreground",
                  "aria-required": "true",
                  "aria-invalid": !!errors.date,
                  "aria-describedby": errors.date ? "nr-date-err" : void 0,
                  "data-ocid": "nr-date"
                }
              ),
              errors.date && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  id: "nr-date-err",
                  className: "text-xs text-destructive",
                  role: "alert",
                  children: errors.date
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "nr-time",
                  className: "text-foreground text-sm font-medium",
                  children: [
                    t("dashboard:newReservation.time"),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.time, onValueChange: (v) => set("time", v), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    id: "nr-time",
                    className: "bg-background border-border text-foreground",
                    "aria-required": "true",
                    "aria-invalid": !!errors.time,
                    "data-ocid": "nr-time",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "dark bg-card border-border max-h-64", children: TIME_SLOTS.map((slot) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectItem,
                  {
                    value: slot,
                    className: "text-foreground hover:bg-muted focus:bg-muted",
                    children: slot
                  },
                  slot
                )) })
              ] }),
              errors.time && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", role: "alert", children: errors.time })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-foreground text-sm font-medium", children: [
              t("dashboard:newReservation.partySize"),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", "aria-hidden": "true", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => set("partySize", Math.max(1, form.partySize - 1)),
                  className: "h-9 w-9 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  "aria-label": t("dashboard:newReservation.decreaseParty"),
                  "data-ocid": "nr-party-minus",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4 text-foreground" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "w-12 text-center text-lg font-semibold text-foreground tabular-nums",
                  "aria-live": "polite",
                  "aria-label": t("dashboard:newReservation.partySizeValue", {
                    count: form.partySize
                  }),
                  "data-ocid": "nr-party-size",
                  children: form.partySize
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => set("partySize", Math.min(30, form.partySize + 1)),
                  className: "h-9 w-9 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  "aria-label": t("dashboard:newReservation.increaseParty"),
                  "data-ocid": "nr-party-plus",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 text-foreground" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: t("dashboard:newReservation.persons") })
            ] }),
            errors.partySize && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", role: "alert", children: errors.partySize })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "nr-table",
                className: "text-foreground text-sm font-medium",
                children: t("dashboard:newReservation.table")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.tableId,
                onValueChange: (v) => set("tableId", v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      id: "nr-table",
                      className: "bg-background border-border text-foreground",
                      "data-ocid": "nr-table",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "dark bg-card border-border", children: tableOptions.map((tbl) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectItem,
                    {
                      value: tbl.id,
                      className: "text-foreground hover:bg-muted focus:bg-muted",
                      children: tbl.label
                    },
                    tbl.id
                  )) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("dashboard:newReservation.autoAssignHint", {
              defaultValue: "Kies 'Automatisch toewijzen' voor slimme tafelselectie"
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "nr-notes",
                className: "text-foreground text-sm font-medium",
                children: t("dashboard:newReservation.notes")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "nr-notes",
                value: form.notes,
                onChange: (e) => set("notes", e.target.value),
                placeholder: t("dashboard:newReservation.notesPlaceholder"),
                className: "bg-background border-border text-foreground placeholder:text-muted-foreground resize-none",
                rows: 3,
                "data-ocid": "nr-notes"
              }
            )
          ] }),
          submitError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm text-destructive rounded-lg bg-destructive/10 px-3 py-2",
              role: "alert",
              children: submitError
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "flex-1 border-border text-foreground hover:bg-muted",
                onClick: onClose,
                "data-ocid": "nr-cancel-btn",
                children: t("dashboard:newReservation.cancel")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                className: "flex-1 bg-primary text-primary-foreground hover:bg-primary/90",
                disabled: isSubmitting,
                "data-ocid": "nr-submit-btn",
                children: isSubmitting ? t("dashboard:newReservation.saving") : isEdit ? t("dashboard:newReservation.saveChanges") : t("dashboard:newReservation.create")
              }
            )
          ] })
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
function formatFullDate(d) {
  if (!d) return "—";
  const dt = /* @__PURE__ */ new Date(`${d}T00:00:00`);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("nl-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}
function ReservationDetailModal({
  reservation,
  open,
  onClose,
  onCheckIn,
  onCancel,
  onSaveNotes,
  onStatusChange
}) {
  const titleId = reactExports.useId();
  const [notes, setNotes] = reactExports.useState("");
  const [notesDirty, setNotesDirty] = reactExports.useState(false);
  const [showCancelDialog, setShowCancelDialog] = reactExports.useState(false);
  const [localStatus, setLocalStatus] = reactExports.useState(
    null
  );
  reactExports.useEffect(() => {
    if (reservation) {
      setNotes(reservation.notes ?? "");
      setNotesDirty(false);
      setLocalStatus(reservation.status);
    }
  }, [reservation]);
  if (!reservation) return null;
  const currentStatus = localStatus ?? reservation.status;
  const canCheckIn = currentStatus !== "cancelled" && currentStatus !== "completed" && currentStatus !== "seated";
  const canCancel = currentStatus !== "cancelled";
  function handleStatusChange(val) {
    const s = val;
    setLocalStatus(s);
    onStatusChange(reservation.id, s);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-card border-border text-foreground max-w-lg w-full",
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: currentStatus })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                DetailRow,
                {
                  icon: Calendar,
                  label: "Datum",
                  value: formatFullDate(reservation.date)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { icon: Clock, label: "Tijd", value: reservation.time }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                DetailRow,
                {
                  icon: Users,
                  label: "Aantal personen",
                  value: `${reservation.partySize} personen`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                DetailRow,
                {
                  icon: Table2,
                  label: "Tafel",
                  value: reservation.tableNumber ? `Tafel ${reservation.tableNumber}` : "Niet toegewezen"
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
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: "Status aanpassen" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: currentStatus, onValueChange: handleStatusChange, children: [
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
              ] })
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
    ] }) })
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
  const { t } = useTranslation(["dashboard"]);
  const [sortKey, setSortKey] = reactExports.useState("date");
  const [sortDir, setSortDir] = reactExports.useState("asc");
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { delayDuration: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
              className: "px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell",
              children: "Tafel"
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
            "data-ocid": "empty-reservations",
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
        ) }) }) : sorted.map((res) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border hover:bg-muted/20 transition-colors group",
            "data-ocid": "reservation-row",
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
                      "aria-label": t("dashboard:reservations.actions.view", {
                        name: res.guestName
                      }),
                      children: res.guestName
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: res.guestEmail })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground text-center tabular-nums font-medium", children: res.partySize }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden lg:table-cell", children: res.tableNumber ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-foreground bg-muted px-2 py-0.5 rounded-md", children: [
                "Tafel ",
                res.tableNumber
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground italic", children: "Niet toegewezen" }) }),
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
                        "data-ocid": "status-dropdown",
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
                      "data-ocid": "action-view",
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
                      "data-ocid": "action-checkin",
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
                      "data-ocid": "action-cancel",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Annuleren" })
                ] })
              ] }) })
            ]
          },
          res.id
        )) })
      ]
    }
  ) }) });
}
const TIME_START = 11;
const TIME_END = 23;
const SLOT_HEIGHT = 56;
const SLOTS_PER_HOUR = 2;
const TOTAL_SLOTS = (TIME_END - TIME_START) * SLOTS_PER_HOUR;
function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function isoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function getWeekStart(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function timeToSlotIndex(time) {
  const [h, m] = time.split(":").map(Number);
  const slotIdx = (h - TIME_START) * SLOTS_PER_HOUR + Math.floor(m / 30);
  if (slotIdx < 0 || slotIdx >= TOTAL_SLOTS) return -1;
  return slotIdx;
}
const STATUS_BLOCK = {
  confirmed: {
    bg: "bg-[#16a34a]",
    text: "text-white",
    ring: "ring-1 ring-[#22C55E]/40"
  },
  pending: {
    bg: "bg-accent/80",
    text: "text-white",
    ring: "ring-1 ring-accent/40"
  },
  waitlist: {
    bg: "bg-[#2563eb]",
    text: "text-white",
    ring: "ring-1 ring-[#3B82F6]/40"
  },
  cancelled: {
    bg: "bg-[#b91c1c]",
    text: "text-white",
    ring: "ring-1 ring-[#EF4444]/40"
  },
  seated: {
    bg: "bg-[#15803d]",
    text: "text-white",
    ring: "ring-1 ring-[#22C55E]/60"
  },
  not_arrived: {
    bg: "bg-[#d97706]",
    text: "text-white",
    ring: "ring-1 ring-amber-400/40"
  },
  late: {
    bg: "bg-[#c2410c]",
    text: "text-white",
    ring: "ring-1 ring-orange-400/40"
  },
  departed: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    ring: "ring-1 ring-border"
  },
  completed: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    ring: "ring-1 ring-border"
  },
  no_show: {
    bg: "bg-[#7f1d1d]",
    text: "text-white",
    ring: "ring-1 ring-destructive/40"
  }
};
function getBlockStyle(r) {
  if (r.experienceId)
    return {
      bg: "bg-[#6d28d9]",
      text: "text-white",
      ring: "ring-1 ring-[#8B5CF6]/40"
    };
  return STATUS_BLOCK[r.status] ?? STATUS_BLOCK.pending;
}
function ReservationTimeGrid({
  reservations,
  dateRange,
  onSelectReservation
}) {
  const { t } = useTranslation("dashboard");
  const today = isoDate(/* @__PURE__ */ new Date());
  const scrollRef = reactExports.useRef(null);
  const [weekOffset, setWeekOffset] = reactExports.useState(0);
  function getVisibleDays() {
    const base = addDays(getWeekStart(/* @__PURE__ */ new Date()), weekOffset * 7);
    if (dateRange === "today") {
      return [parseLocalDate(today)];
    }
    if (dateRange === "week") {
      return Array.from({ length: 7 }, (_, i) => addDays(base, i));
    }
    const start = parseLocalDate(today);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }
  const days = getVisibleDays();
  const showNav = dateRange === "week";
  const resByDay = {};
  for (const d of days) resByDay[isoDate(d)] = [];
  for (const r of reservations) {
    if (resByDay[r.date]) resByDay[r.date].push(r);
  }
  const DAY_NAMES_SHORT = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
  const timeLabels = Array.from({ length: TOTAL_SLOTS + 1 }, (_, i) => {
    const totalMins = TIME_START * 60 + i * 30;
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  });
  const gridHeight = TOTAL_SLOTS * SLOT_HEIGHT;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: showNav && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setWeekOffset((w) => w - 1),
            className: "p-1.5 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            "aria-label": t("calendar.prevWeek"),
            "data-ocid": "grid-prev-week",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4 text-muted-foreground" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setWeekOffset(0),
            className: "px-3 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            "aria-label": t("calendar.currentWeek"),
            "data-ocid": "grid-today",
            children: t("home.today")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setWeekOffset((w) => w + 1),
            className: "p-1.5 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            "aria-label": t("calendar.nextWeek"),
            "data-ocid": "grid-next-week",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
        days[0].toLocaleDateString("nl-BE", {
          day: "numeric",
          month: "long"
        }),
        " ",
        days.length > 1 && `– ${days[days.length - 1].toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" })}`
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-3 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-sm bg-[#16a34a] inline-block" }),
          t("calendar.legendConfirmed")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-sm bg-[#2563eb] inline-block" }),
          t("calendar.legendWaitlist")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-sm bg-[#6d28d9] inline-block" }),
          t("calendar.legendExperience")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-sm bg-[#b91c1c] inline-block" }),
          t("calendar.legendCancelled")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: scrollRef,
        className: "overflow-x-auto overflow-y-auto max-h-[600px]",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex",
            style: { minWidth: `${48 + days.length * 120}px` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-12 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 border-b border-border" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", style: { height: gridHeight }, children: timeLabels.map((label, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute left-0 right-0 flex justify-end pr-2",
                    style: { top: i * SLOT_HEIGHT - 8 },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60 font-mono select-none", children: i < timeLabels.length - 1 ? label : "" })
                  },
                  label
                )) })
              ] }),
              days.map((day) => {
                const key = isoDate(day);
                const isToday = key === today;
                const dayRes = resByDay[key] ?? [];
                const dow = day.getDay();
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[110px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: cn(
                        "h-10 border-b border-l border-border flex flex-col items-center justify-center",
                        isToday ? "bg-primary/10" : "bg-muted/20"
                      ),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: cn(
                              "text-[10px] font-medium uppercase tracking-wide",
                              isToday ? "text-primary" : "text-muted-foreground"
                            ),
                            children: DAY_NAMES_SHORT[dow]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: cn(
                              "text-sm font-bold leading-tight",
                              isToday ? "text-primary" : "text-foreground"
                            ),
                            children: day.getDate()
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "relative border-l border-border",
                      style: { height: gridHeight },
                      children: [
                        Array.from({ length: TOTAL_SLOTS }, (_, i) => {
                          const totalMins = TIME_START * 60 + i * 30;
                          const hh = String(Math.floor(totalMins / 60)).padStart(
                            2,
                            "0"
                          );
                          const mm = String(totalMins % 60).padStart(2, "0");
                          return /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: cn(
                                "absolute left-0 right-0 border-t",
                                i % 2 === 0 ? "border-border/40" : "border-border/20"
                              ),
                              style: { top: i * SLOT_HEIGHT }
                            },
                            `slot-${hh}${mm}`
                          );
                        }),
                        dayRes.map((r) => {
                          const slotIdx = timeToSlotIndex(r.time);
                          if (slotIdx < 0) return null;
                          const style = getBlockStyle(r);
                          const durationSlots = 2;
                          const blockHeight = durationSlots * SLOT_HEIGHT - 2;
                          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "button",
                            {
                              type: "button",
                              onClick: () => onSelectReservation(r),
                              className: cn(
                                "absolute left-1 right-1 rounded-lg px-2 py-1 text-left",
                                "transition-all duration-150 hover:brightness-110 hover:scale-[1.01]",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                style.bg,
                                style.text,
                                style.ring
                              ),
                              style: {
                                top: slotIdx * SLOT_HEIGHT + 2,
                                height: blockHeight,
                                zIndex: 10
                              },
                              "aria-label": `${r.guestName} ${r.time} ${r.partySize} personen`,
                              "data-ocid": "timegrid-block",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-xs leading-tight truncate", children: r.guestName.split(" ")[0] }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] opacity-80 flex items-center gap-0.5 mt-0.5", children: [
                                  r.time,
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-0.5", children: "·" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-2.5 w-2.5 inline" }),
                                  r.partySize
                                ] }),
                                r.experienceName && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] opacity-75 truncate mt-0.5 hidden sm:block", children: [
                                  "✨ ",
                                  r.experienceName
                                ] })
                              ]
                            },
                            r.id
                          );
                        }),
                        isToday && (() => {
                          const now = /* @__PURE__ */ new Date();
                          const h = now.getHours();
                          const m = now.getMinutes();
                          if (h < TIME_START || h >= TIME_END) return null;
                          const pos = ((h - TIME_START) * 60 + m) * (SLOT_HEIGHT / 30);
                          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              className: "absolute left-0 right-0 flex items-center pointer-events-none",
                              style: { top: pos, zIndex: 20 },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-primary ml-0.5 shrink-0" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-primary opacity-70" })
                              ]
                            }
                          );
                        })()
                      ]
                    }
                  )
                ] }, key);
              })
            ]
          }
        )
      }
    )
  ] });
}
const TODAY = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
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
  const now = /* @__PURE__ */ new Date();
  const startOfDay = (d) => {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy;
  };
  if (range === "today") {
    const s = startOfDay(now).toISOString().slice(0, 10);
    return { start: s, end: s };
  }
  if (range === "week") {
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const mon = new Date(now);
    mon.setDate(now.getDate() + diff);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    return {
      start: startOfDay(mon).toISOString().slice(0, 10),
      end: startOfDay(sun).toISOString().slice(0, 10)
    };
  }
  const end = new Date(now);
  end.setDate(now.getDate() + 6);
  return {
    start: startOfDay(now).toISOString().slice(0, 10),
    end: startOfDay(end).toISOString().slice(0, 10)
  };
}
function ReservationsPage() {
  const { t } = useTranslation(["dashboard"]);
  const queryClient = useQueryClient();
  const {
    data: allReservations = [],
    isLoading,
    isFetching
  } = useReservations();
  const updateStatus = useUpdateReservationStatus();
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
    [reservations]
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
    ue.success(t("dashboard:reservations.notesSaved"));
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
          className: `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${view === "calendar" ? "bg-gradient-to-r from-[#1E2937] to-[#0F172A] text-foreground border border-primary/30 shadow-md" : "bg-muted/40 text-muted-foreground border border-border hover:bg-muted hover:text-foreground"}`,
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
          className: `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${view === "list" ? "bg-gradient-to-r from-[#1E2937] to-[#0F172A] text-foreground border border-primary/30 shadow-md" : "bg-muted/40 text-muted-foreground border border-border hover:bg-muted hover:text-foreground"}`,
          "aria-pressed": view === "list",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "h-4 w-4" }),
            t("dashboard:reservations.tabList")
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border shadow-sm p-4", children: [
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MiniFloorPlan,
      {
        reservations: filtered,
        selectedTable,
        onSelectTable: (tableId) => setSelectedTable((prev) => prev === tableId ? null : tableId)
      }
    ),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-card border border-border shadow-sm p-6 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-lg" }, i)) }),
    !isLoading && (view === "calendar" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-card border border-border shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReservationTimeGrid,
      {
        reservations: filtered,
        dateRange,
        onSelectReservation: openDetail
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
