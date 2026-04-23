import { u as useTranslation, ai as useUpdateWaitlistEntry, r as reactExports, j as jsxRuntimeExports, D as Dialog, n as DialogContent, o as DialogHeader, p as DialogTitle, w as Label, B as Button, aj as Minus, a7 as Plus, F as Textarea, ak as DialogFooter, t as ue, al as useAddToWaitlist, I as Input, g as Clock, U as Users, ae as formatDateShort, am as formatTime, aa as RefreshCw, an as Bell, O as Badge, f as useWaitlist, ao as useOfferWaitlistSpot, ap as useReofferWaitlistSpot, aq as useRemoveWaitlistEntry, ar as CircleCheck, C as CalendarDays } from "./index-BNayfcmF.js";
import { U as User } from "./user-Bl52wv8_.js";
import { S as SkeletonTableRow } from "./SkeletonCard-C6az2IVr.js";
import { M as Mail } from "./mail-Bhz2n6KZ.js";
import { P as Pen } from "./pen-iyqNy_U3.js";
import { T as Trash2 } from "./trash-2-XAAtCYtx.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-D5EHXLzH.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-soUA3Kor.js";
import "./skeleton-D2EeOrWT.js";
const TIME_SLOTS$1 = [];
for (let h = 11; h <= 23; h++) {
  TIME_SLOTS$1.push(`${String(h).padStart(2, "0")}:00`);
  TIME_SLOTS$1.push(`${String(h).padStart(2, "0")}:30`);
}
function EditWaitlistModal({
  entry,
  open,
  onClose
}) {
  const { t } = useTranslation("dashboard");
  const { mutate: updateEntry, isPending } = useUpdateWaitlistEntry();
  const [partySize, setPartySize] = reactExports.useState((entry == null ? void 0 : entry.partySize) ?? 2);
  const [notes, setNotes] = reactExports.useState((entry == null ? void 0 : entry.notes) ?? "");
  const [requestedTime, setRequestedTime] = reactExports.useState(
    (entry == null ? void 0 : entry.preferredTime) ?? ""
  );
  reactExports.useEffect(() => {
    if (entry) {
      setPartySize(entry.partySize);
      setNotes(entry.notes ?? "");
      setRequestedTime(entry.preferredTime ?? "");
    }
  }, [entry]);
  const handleSave = () => {
    if (!entry) return;
    updateEntry(
      {
        id: entry.id,
        partySize,
        notes: notes || void 0
      },
      {
        onSuccess: () => {
          ue.success(t("waitlist.editSuccess", { name: entry.guestName }));
          onClose();
        },
        onError: () => ue.error(t("waitlist.editError"))
      }
    );
  };
  const decreaseParty = () => setPartySize((p) => Math.max(1, p - 1));
  const increaseParty = () => setPartySize((p) => Math.min(20, p + 1));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "gradient-card border-border rounded-2xl max-w-md shadow-elevated", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "heading-h2 text-foreground", children: t("waitlist.editTitle") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/20 border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide", children: t("waitlist.guestLabel") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate", children: (entry == null ? void 0 : entry.guestName) ?? "—" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: t("waitlist.partySizeLabel") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              className: "h-9 w-9 p-0 rounded-xl border-border hover-scale-xs",
              onClick: decreaseParty,
              disabled: partySize <= 1,
              "aria-label": t("newReservation.decreaseParty"),
              "data-ocid": "edit-party-decrease",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-12 text-center font-bold text-xl tabular-nums text-foreground", children: partySize }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              className: "h-9 w-9 p-0 rounded-xl border-border hover-scale-xs",
              onClick: increaseParty,
              disabled: partySize >= 20,
              "aria-label": t("newReservation.increaseParty"),
              "data-ocid": "edit-party-increase",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: t("newReservation.persons") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "edit-wl-time",
            className: "text-sm font-medium text-foreground",
            children: t("waitlist.requestedTimeLabel")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            id: "edit-wl-time",
            value: requestedTime,
            onChange: (e) => setRequestedTime(e.target.value),
            className: "w-full h-10 rounded-xl border border-input bg-muted/20 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50",
            "data-ocid": "edit-wl-time",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("waitlist.flexible") }),
              TIME_SLOTS$1.map((slot) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: slot, children: slot }, slot))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "edit-wl-notes",
            className: "text-sm font-medium text-foreground",
            children: t("waitlist.notesLabel")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "edit-wl-notes",
            value: notes,
            onChange: (e) => setNotes(e.target.value),
            placeholder: t("waitlist.notesPlaceholder"),
            className: "bg-muted/20 border-border rounded-xl resize-none min-h-[80px]",
            maxLength: 500,
            "data-ocid": "edit-wl-notes"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
          notes.length,
          " / 500"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          className: "rounded-xl border-border hover-scale-xs",
          onClick: onClose,
          disabled: isPending,
          "data-ocid": "edit-wl-cancel",
          children: t("waitlist.cancel")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "rounded-xl hover-scale-xs",
          onClick: handleSave,
          disabled: isPending,
          "data-ocid": "edit-wl-save",
          children: isPending ? t("waitlist.saving") : t("waitlist.saveChanges")
        }
      )
    ] })
  ] }) });
}
const TODAY$1 = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
const TIME_SLOTS = [];
for (let h = 11; h <= 23; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:00`);
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:30`);
}
const INITIAL = {
  guestName: "",
  phone: "",
  email: "",
  partySize: 2,
  date: TODAY$1,
  requestedTime: "",
  notes: ""
};
function NewWaitlistModal({
  open,
  onClose,
  defaultDate
}) {
  const { t } = useTranslation("dashboard");
  const { mutate: addToWaitlist, isPending } = useAddToWaitlist();
  const [form, setForm] = reactExports.useState({
    ...INITIAL,
    date: defaultDate ?? TODAY$1
  });
  const [errors, setErrors] = reactExports.useState({});
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const validate = () => {
    const errs = {};
    if (!form.guestName.trim())
      errs.guestName = t("newReservation.errors.nameRequired");
    if (!form.phone.trim())
      errs.phone = t("newReservation.errors.phoneRequired");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleSubmit = () => {
    if (!validate()) return;
    addToWaitlist(
      {
        guestName: form.guestName.trim(),
        guestPhone: form.phone.trim(),
        guestEmail: form.email.trim() || void 0,
        partySize: form.partySize,
        date: form.date,
        requestedTime: form.requestedTime || void 0,
        notes: form.notes.trim() || void 0
      },
      {
        onSuccess: () => {
          ue.success(t("waitlist.addedSuccess", { name: form.guestName }));
          setForm({ ...INITIAL, date: defaultDate ?? TODAY$1 });
          setErrors({});
          onClose();
        },
        onError: () => ue.error(t("waitlist.addError"))
      }
    );
  };
  const handleClose = () => {
    setForm({ ...INITIAL, date: defaultDate ?? TODAY$1 });
    setErrors({});
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "gradient-card border-border rounded-2xl max-w-md shadow-elevated", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "heading-h2 text-foreground", children: t("waitlist.addTitle") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Label,
          {
            htmlFor: "new-wl-name",
            className: "text-sm font-medium text-foreground",
            children: [
              t("newReservation.guestName"),
              " *"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "new-wl-name",
            value: form.guestName,
            onChange: (e) => set("guestName", e.target.value),
            placeholder: t("newReservation.guestNamePlaceholder"),
            className: "bg-muted/20 border-border rounded-xl h-10",
            autoFocus: true,
            "data-ocid": "new-wl-name"
          }
        ),
        errors.guestName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.guestName })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Label,
          {
            htmlFor: "new-wl-phone",
            className: "text-sm font-medium text-foreground",
            children: [
              t("newReservation.phone"),
              " *"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "new-wl-phone",
            type: "tel",
            value: form.phone,
            onChange: (e) => set("phone", e.target.value),
            placeholder: "+32 470 000 000",
            className: "bg-muted/20 border-border rounded-xl h-10",
            "data-ocid": "new-wl-phone"
          }
        ),
        errors.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.phone })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "new-wl-email",
            className: "text-sm font-medium text-foreground",
            children: t("newReservation.email")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "new-wl-email",
            type: "email",
            value: form.email,
            onChange: (e) => set("email", e.target.value),
            placeholder: "gast@voorbeeld.be",
            className: "bg-muted/20 border-border rounded-xl h-10",
            "data-ocid": "new-wl-email"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: t("waitlist.partySizeLabel") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              className: "h-9 w-9 p-0 rounded-xl border-border hover-scale-xs",
              onClick: () => set("partySize", Math.max(1, form.partySize - 1)),
              disabled: form.partySize <= 1,
              "aria-label": t("newReservation.decreaseParty"),
              "data-ocid": "new-wl-party-decrease",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-12 text-center font-bold text-xl tabular-nums text-foreground", children: form.partySize }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              className: "h-9 w-9 p-0 rounded-xl border-border hover-scale-xs",
              onClick: () => set("partySize", Math.min(20, form.partySize + 1)),
              disabled: form.partySize >= 20,
              "aria-label": t("newReservation.increaseParty"),
              "data-ocid": "new-wl-party-increase",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: t("newReservation.persons") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "new-wl-date",
              className: "text-sm font-medium text-foreground",
              children: t("newReservation.date")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "new-wl-date",
              type: "date",
              value: form.date,
              onChange: (e) => set("date", e.target.value),
              min: TODAY$1,
              className: "bg-muted/20 border-border rounded-xl h-10",
              "data-ocid": "new-wl-date"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "new-wl-time",
              className: "text-sm font-medium text-foreground",
              children: t("waitlist.requestedTimeLabel")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              id: "new-wl-time",
              value: form.requestedTime,
              onChange: (e) => set("requestedTime", e.target.value),
              className: "w-full h-10 rounded-xl border border-input bg-muted/20 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50",
              "data-ocid": "new-wl-time",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("waitlist.flexible") }),
                TIME_SLOTS.map((slot) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: slot, children: slot }, slot))
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "new-wl-notes",
            className: "text-sm font-medium text-foreground",
            children: t("waitlist.notesLabel")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "new-wl-notes",
            value: form.notes,
            onChange: (e) => set("notes", e.target.value),
            placeholder: t("waitlist.notesPlaceholder"),
            className: "bg-muted/20 border-border rounded-xl resize-none min-h-[72px]",
            maxLength: 500,
            "data-ocid": "new-wl-notes"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          className: "rounded-xl border-border hover-scale-xs",
          onClick: handleClose,
          disabled: isPending,
          "data-ocid": "new-wl-cancel",
          children: t("waitlist.cancel")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "rounded-xl hover-scale-xs",
          onClick: handleSubmit,
          disabled: isPending,
          "data-ocid": "new-wl-submit",
          children: isPending ? t("waitlist.adding") : t("waitlist.addButton")
        }
      )
    ] })
  ] }) });
}
function waitTime(addedAt) {
  const diff = Date.now() - new Date(addedAt).getTime();
  const mins = Math.floor(diff / 6e4);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hours}u ${rem}m` : `${hours}u`;
}
const SKELETON_KEYS = ["ws1", "ws2", "ws3"];
function StatusBadge({
  status,
  t
}) {
  const map = {
    waiting: {
      label: t("waitlist.statusWaiting"),
      cls: "bg-amber-500/15 text-amber-400 border-amber-500/25",
      dot: "bg-amber-400"
    },
    offered: {
      label: t("waitlist.statusNotified"),
      cls: "bg-blue-500/15 text-blue-400 border-blue-500/25",
      dot: "bg-blue-400"
    },
    confirmed: {
      label: t("waitlist.statusConfirmed"),
      cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
      dot: "bg-emerald-400"
    },
    expired: {
      label: t("waitlist.statusExpired"),
      cls: "bg-muted/60 text-muted-foreground border-border",
      dot: "bg-muted-foreground/40"
    },
    removed_by_staff: {
      label: t("waitlist.statusExpired"),
      cls: "bg-muted/60 text-muted-foreground border-border",
      dot: "bg-muted-foreground/40"
    }
  };
  const { label, cls, dot } = map[status] ?? map.waiting;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      variant: "outline",
      className: `badge-pop text-xs border font-medium inline-flex items-center gap-1.5 ${cls}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-1.5 w-1.5 rounded-full shrink-0 ${dot}` }),
        label
      ]
    }
  );
}
function WaitlistTable({
  entries,
  isLoading,
  isOffering,
  onAction
}) {
  const { t } = useTranslation("dashboard");
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", "aria-busy": "true", children: SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonTableRow, {}, k)) });
  }
  if (entries.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "empty-waitlist",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl gradient-card border border-border flex items-center justify-center mb-4 shadow-soft", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-7 w-7 text-muted-foreground/50" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-base", children: t("waitlist.empty") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 max-w-xs", children: t("waitlist.emptyHint") })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", "aria-label": t("waitlist.title"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          scope: "col",
          className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-10",
          children: t("waitlist.columns.rank")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          scope: "col",
          className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide",
          children: t("waitlist.columns.name")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          scope: "col",
          className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell",
          children: t("waitlist.columns.email")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          scope: "col",
          className: "px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide",
          children: t("waitlist.columns.party")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          scope: "col",
          className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell",
          children: t("waitlist.columns.desiredTime")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          scope: "col",
          className: "px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell",
          children: t("waitlist.columns.waitTime")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          scope: "col",
          className: "px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide",
          children: t("waitlist.columns.status")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          scope: "col",
          className: "px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide",
          children: t("waitlist.columns.action")
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: entries.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "tr",
      {
        className: `hover:bg-muted/10 transition-colors group ${entry.status === "offered" ? "bg-blue-500/5" : ""}`,
        "data-ocid": "waitlist-row",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-7 w-7 rounded-full gradient-card border border-border flex items-center justify-center text-xs font-bold text-muted-foreground shadow-soft", children: idx + 1 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground leading-tight", children: entry.guestName }),
            entry.guestPhone && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: entry.guestPhone })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[140px]", children: entry.guestEmail })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-foreground font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            entry.partySize
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 hidden md:table-cell text-muted-foreground text-xs", children: [
            formatDateShort(entry.date),
            " ·",
            " ",
            entry.preferredTime ? formatTime(entry.preferredTime) : t("waitlist.flexible")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden lg:table-cell text-center text-muted-foreground text-xs tabular-nums", children: waitTime(entry.addedAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: entry.status, t }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                className: "h-7 w-7 p-0 hover-scale-xs text-muted-foreground hover:text-foreground",
                onClick: () => onAction({ type: "edit", entry }),
                "aria-label": t("waitlist.actions.edit"),
                "data-ocid": "edit-waitlist-btn",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3.5 w-3.5" })
              }
            ),
            (entry.status === "waiting" || entry.status === "offered") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: `gap-1.5 text-xs h-7 px-2.5 hover-scale-xs ${entry.status === "offered" ? "border-blue-500/30 text-blue-400 hover:bg-blue-500/10" : "border-primary/30 text-primary hover:bg-primary/10"}`,
                onClick: () => onAction({
                  type: entry.status === "offered" ? "reoffer" : "offer",
                  entry
                }),
                disabled: isOffering,
                "data-ocid": entry.status === "offered" ? "reoffer-btn" : "offer-spot-btn",
                "aria-label": t("waitlist.offerLabel", {
                  name: entry.guestName
                }),
                children: [
                  entry.status === "offered" ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-3 w-3" }),
                  entry.status === "offered" ? t("waitlist.reofferButton") : t("waitlist.offerButton")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                className: "h-7 w-7 p-0 hover-scale-xs text-muted-foreground hover:text-destructive",
                onClick: () => onAction({ type: "remove", entry }),
                "aria-label": t("waitlist.actions.remove"),
                "data-ocid": "remove-waitlist-btn",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
              }
            )
          ] }) })
        ]
      },
      entry.id
    )) })
  ] }) });
}
const TODAY = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
const SERVICES = ["lunch", "diner"];
function WaitlistPage() {
  const { t } = useTranslation("dashboard");
  const [dateFilter, setDateFilter] = reactExports.useState(TODAY);
  const [activeService, setActiveService] = reactExports.useState("diner");
  const [editEntry, setEditEntry] = reactExports.useState(null);
  const [removeTarget, setRemoveTarget] = reactExports.useState(null);
  const [showNewModal, setShowNewModal] = reactExports.useState(false);
  const {
    data: waitlist,
    isLoading,
    refetch
  } = useWaitlist(dateFilter || void 0);
  const { mutate: offerSpot, isPending: isOffering } = useOfferWaitlistSpot();
  const { mutate: reofferSpot, isPending: isReoffering } = useReofferWaitlistSpot();
  const { mutate: removeEntry } = useRemoveWaitlistEntry();
  const allEntries = waitlist ?? [];
  const filtered = allEntries;
  const waitingCount = filtered.filter((e) => e.status === "waiting").length;
  const offeredCount = filtered.filter((e) => e.status === "offered").length;
  const confirmedCount = filtered.filter(
    (e) => e.status === "confirmed"
  ).length;
  const statsData = [
    {
      key: "waiting",
      label: t("waitlist.totalWaiting"),
      value: waitingCount,
      icon: Clock,
      cls: "text-[oklch(var(--status-orange))]",
      bg: "bg-[oklch(var(--status-orange)/0.1)]"
    },
    {
      key: "offered",
      label: t("waitlist.totalOffered"),
      value: offeredCount,
      icon: Bell,
      cls: "text-[oklch(var(--status-blue))]",
      bg: "bg-[oklch(var(--status-blue)/0.1)]"
    },
    {
      key: "confirmed",
      label: t("waitlist.totalConfirmed"),
      value: confirmedCount,
      icon: CircleCheck,
      cls: "text-primary",
      bg: "bg-primary/10"
    }
  ];
  const handleAction = (action) => {
    const { type, entry } = action;
    if (type === "edit") {
      setEditEntry(entry);
    } else if (type === "offer") {
      offerSpot(
        { id: entry.id },
        {
          onSuccess: () => ue.success(t("waitlist.offerSent", { name: entry.guestName })),
          onError: () => ue.error(t("waitlist.offerError"))
        }
      );
    } else if (type === "reoffer") {
      reofferSpot(
        { id: entry.id },
        {
          onSuccess: () => ue.success(t("waitlist.reofferSent", { name: entry.guestName })),
          onError: () => ue.error(t("waitlist.offerError"))
        }
      );
    } else if (type === "remove") {
      setRemoveTarget(entry);
    }
  };
  const confirmRemove = () => {
    if (!removeTarget) return;
    removeEntry(
      { id: removeTarget.id },
      {
        onSuccess: () => {
          ue.success(
            t("waitlist.removeSuccess", { name: removeTarget.guestName })
          );
          setRemoveTarget(null);
        },
        onError: () => ue.error(t("waitlist.removeError"))
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between flex-wrap gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "heading-h1 text-foreground", children: t("waitlist.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: t("waitlist.subtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "gap-2 border-border hover-scale-xs",
            onClick: () => refetch(),
            "aria-label": t("waitlist.refresh"),
            "data-ocid": "refresh-waitlist-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
              t("waitlist.refresh")
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "gap-2 rounded-xl hover-scale-xs",
            onClick: () => setShowNewModal(true),
            "data-ocid": "add-to-waitlist-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              t("waitlist.addButton")
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: statsData.map(({ key, label, value, icon: Icon, cls, bg }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-2xl border border-border gradient-card p-4 text-center shadow-soft",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-9 w-9 rounded-xl ${bg} flex items-center justify-center mx-auto mb-2`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-[18px] w-[18px] ${cls}` })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold tabular-nums ${cls}`, children: value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mt-1", children: label })
        ]
      },
      key
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "date-filter",
            type: "date",
            value: dateFilter,
            onChange: (e) => setDateFilter(e.target.value),
            className: "w-44 bg-muted/20 border-border h-9 rounded-xl",
            "aria-label": t("waitlist.filterDate"),
            "data-ocid": "waitlist-date-filter"
          }
        )
      ] }),
      dateFilter !== TODAY && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setDateFilter(TODAY),
          className: "text-xs text-muted-foreground hover:text-foreground transition-colors underline",
          "data-ocid": "reset-date-filter",
          children: t("waitlist.today")
        }
      ),
      dateFilter && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setDateFilter(""),
          className: "text-xs text-muted-foreground hover:text-foreground transition-colors underline",
          "data-ocid": "clear-date-filter",
          children: t("waitlist.clearFilter")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 rounded-xl border border-border bg-muted/20 p-1 ml-auto", children: SERVICES.map((svc) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setActiveService(svc),
          className: [
            "px-3 py-1 text-xs font-medium rounded-lg transition-colors",
            activeService === svc ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
          ].join(" "),
          "data-ocid": `service-tab-${svc}`,
          children: t(`waitlist.service.${svc}`)
        },
        svc
      )) })
    ] }),
    filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 items-center text-sm text-muted-foreground", children: [
      waitingCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[oklch(var(--status-orange)/0.1)] text-[oklch(var(--status-orange))] border border-[oklch(var(--status-orange)/0.2)] gap-1.5 px-2.5 py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
        t("waitlist.waitingCountPlural", { count: waitingCount })
      ] }),
      offeredCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          className: "bg-[oklch(var(--status-blue)/0.1)] text-[oklch(var(--status-blue))] border border-[oklch(var(--status-blue)/0.2)] gap-1.5 px-2.5 py-1",
          "data-ocid": "waitlist-count",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-3 w-3" }),
            t("waitlist.offered", { count: offeredCount })
          ]
        }
      ),
      confirmedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-primary/10 text-primary border border-primary/20 gap-1.5 px-2.5 py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
        t("waitlist.confirmedCount", { count: confirmedCount })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-soft border-border overflow-hidden rounded-2xl gradient-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-semibold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-muted-foreground" }),
        t("waitlist.overview"),
        dateFilter && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-2 bg-secondary/15 text-secondary border border-secondary/25 text-xs badge-pop", children: (/* @__PURE__ */ new Date(`${dateFilter}T12:00:00`)).toLocaleDateString(
          void 0,
          {
            day: "numeric",
            month: "long"
          }
        ) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        WaitlistTable,
        {
          entries: filtered,
          isLoading,
          onAction: handleAction,
          isOffering: isOffering || isReoffering
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditWaitlistModal,
      {
        entry: editEntry,
        open: editEntry !== null,
        onClose: () => setEditEntry(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NewWaitlistModal,
      {
        open: showNewModal,
        onClose: () => setShowNewModal(false),
        defaultDate: dateFilter || TODAY
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: removeTarget !== null,
        onOpenChange: (v) => !v && setRemoveTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "gradient-card border-border rounded-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "text-foreground", children: t("waitlist.removeTitle") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { className: "text-muted-foreground", children: t("waitlist.removeConfirm", {
              name: (removeTarget == null ? void 0 : removeTarget.guestName) ?? ""
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogCancel,
              {
                className: "rounded-xl border-border hover-scale-xs",
                "data-ocid": "remove-cancel",
                children: t("waitlist.cancel")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                className: "rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 hover-scale-xs",
                onClick: confirmRemove,
                "data-ocid": "remove-confirm",
                children: t("waitlist.removeButton")
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  WaitlistPage as default
};
