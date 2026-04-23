import { i as createLucideIcon, u as useTranslation, ac as getInitials, j as jsxRuntimeExports, O as Badge, ad as formatCurrency, ae as formatDateShort, af as TAG_OPTIONS, r as reactExports, D as Dialog, n as DialogContent, o as DialogHeader, p as DialogTitle, C as CalendarDays, w as Label, X, S as Select, x as SelectTrigger, y as SelectValue, z as SelectContent, E as SelectItem, F as Textarea, B as Button, t as ue, ag as useGuests, ah as useUpdateGuest, I as Input, U as Users } from "./index-BNayfcmF.js";
import { a as SkeletonCard } from "./SkeletonCard-C6az2IVr.js";
import { S as Star } from "./star-h0dWBoX6.js";
import { M as Mail } from "./mail-Bhz2n6KZ.js";
import { U as UserPlus } from "./user-plus-kTq45Zhg.js";
import { S as Search } from "./search-bQuVyguO.js";
import { L as List } from "./list-Df0hlkMn.js";
import "./skeleton-D2EeOrWT.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }],
  ["path", { d: "M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662", key: "154egf" }]
];
const CircleUser = createLucideIcon("circle-user", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
];
const LayoutGrid = createLucideIcon("layout-grid", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode);
function getAvatarHue$1(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hues = [142, 258, 58, 25, 180, 300, 210];
  return hues[Math.abs(hash) % hues.length] ?? 142;
}
function getTagStyle$2(tag) {
  const tagDef = TAG_OPTIONS.find(
    (t) => t.value.toLowerCase() === tag.toLowerCase()
  );
  if (!tagDef) return "bg-muted text-muted-foreground border-border";
  switch (tagDef.color) {
    case "accent":
      return "bg-amber-500/15 text-amber-400 border-amber-500/25";
    case "destructive":
      return "bg-red-500/15 text-red-400 border-red-500/25";
    case "secondary":
      return "bg-blue-500/15 text-blue-400 border-blue-500/25";
    case "primary":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}
function GuestCard({ guest, onClick }) {
  const { t } = useTranslation("dashboard");
  const initials = getInitials(guest.firstName, guest.lastName);
  const hue = getAvatarHue$1(`${guest.firstName}${guest.lastName}`);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      className: "w-full text-left rounded-xl shadow-soft border border-border hover:shadow-elevated hover:border-primary/30 transition-all cursor-pointer bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      onClick: () => onClick(guest),
      "data-ocid": "guest-card",
      "aria-label": t("guests.guestLabel", {
        name: `${guest.firstName} ${guest.lastName}`
      }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-11 w-11 rounded-full flex items-center justify-center text-sm font-bold text-white",
                style: {
                  background: `oklch(0.5 0.18 ${hue})`
                },
                "aria-hidden": "true",
                children: initials
              }
            ),
            guest.vip && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-2.5 w-2.5 text-white", fill: "white" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground truncate leading-tight", children: [
              guest.firstName,
              " ",
              guest.lastName
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: guest.email }),
            guest.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 truncate", children: guest.phone })
          ] })
        ] }),
        guest.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", "aria-label": t("guests.tags"), children: guest.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: `text-xs px-2 py-0.5 font-medium border ${getTagStyle$2(tag)}`,
            children: tag
          },
          tag
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 pt-2 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground tabular-nums", children: guest.visitCount }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: t("guests.totalVisits") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center border-x border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground tabular-nums", children: guest.totalSpend ? formatCurrency(guest.totalSpend) : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: t("guests.totalSpend") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground tabular-nums", children: guest.lastVisit ? formatDateShort(guest.lastVisit) : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: t("guests.lastVisit") })
          ] })
        ] }),
        guest.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic line-clamp-1 border-t border-border pt-2", children: guest.notes })
      ] })
    }
  );
}
function getAvatarHue(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hues = [142, 258, 58, 25, 180, 300, 210];
  return hues[Math.abs(hash) % hues.length] ?? 142;
}
function getTagStyle$1(tag) {
  const tagDef = TAG_OPTIONS.find(
    (t) => t.value.toLowerCase() === tag.toLowerCase()
  );
  if (!tagDef) return "bg-muted text-muted-foreground border-border";
  switch (tagDef.color) {
    case "accent":
      return "bg-amber-500/15 text-amber-400 border-amber-500/25";
    case "destructive":
      return "bg-red-500/15 text-red-400 border-red-500/25";
    case "secondary":
      return "bg-blue-500/15 text-blue-400 border-blue-500/25";
    case "primary":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}
const STATUS_LABELS = {
  completed: "Voltooid",
  confirmed: "Bevestigd",
  cancelled: "Geannuleerd",
  no_show: "Niet verschenen"
};
const STATUS_STYLES = {
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  confirmed: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/25",
  no_show: "bg-muted text-muted-foreground border-border"
};
function GuestDetailModal({
  guest,
  open,
  onClose,
  onSave,
  isSaving = false
}) {
  const [tags, setTags] = reactExports.useState([]);
  const [notes, setNotes] = reactExports.useState("");
  const liveRef = reactExports.useRef(null);
  const titleId = "guest-modal-title";
  reactExports.useEffect(() => {
    if (guest) {
      setTags(guest.tags ?? []);
      setNotes(guest.notes ?? "");
    }
  }, [guest]);
  const handleAddTag = (value) => {
    if (!value || tags.includes(value)) return;
    setTags((prev) => [...prev, value]);
  };
  const handleRemoveTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };
  const handleSave = () => {
    if (!guest) return;
    onSave({ id: guest.id, tags, notes });
    if (liveRef.current) {
      liveRef.current.textContent = `Tags voor ${guest.firstName} ${guest.lastName} opgeslagen.`;
      setTimeout(() => {
        if (liveRef.current) liveRef.current.textContent = "";
      }, 3e3);
    }
    ue.success("Gastprofiel opgeslagen");
    onClose();
  };
  if (!guest) return null;
  const hue = getAvatarHue(`${guest.firstName}${guest.lastName}`);
  const initials = getInitials(guest.firstName, guest.lastName);
  const history = [];
  const availableTags = TAG_OPTIONS.filter((t) => !tags.includes(t.value));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-lg p-0 overflow-hidden gap-0 border-border bg-card",
      "aria-labelledby": titleId,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: liveRef,
            "aria-live": "polite",
            "aria-atomic": "true",
            className: "sr-only"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "p-6 pb-4 border-b border-border bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-elevated",
                  style: { background: `oklch(0.5 0.18 ${hue})` },
                  "aria-hidden": "true",
                  children: initials
                }
              ),
              guest.vip && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 text-white", fill: "white" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                DialogTitle,
                {
                  id: titleId,
                  className: "text-xl font-semibold text-foreground leading-tight",
                  children: [
                    guest.firstName,
                    " ",
                    guest.lastName
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-1 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3.5 w-3.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: guest.email })
              ] }),
              guest.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-0.5 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: guest.phone })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3 mt-4", children: [
            {
              icon: CircleUser,
              value: guest.visitCount,
              label: "Bezoeken"
            },
            {
              icon: CalendarDays,
              value: guest.totalSpend ? formatCurrency(guest.totalSpend) : "—",
              label: "Besteed"
            },
            {
              icon: CalendarDays,
              value: guest.lastVisit ? formatDateShort(guest.lastVisit) : "—",
              label: "Laatste bezoek"
            }
          ].map(({ value, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-muted/30 rounded-lg p-2.5 text-center",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground tabular-nums", children: value }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5", children: label })
              ]
            },
            label
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5 overflow-y-auto max-h-[50vh]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold text-foreground", children: "Tags" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-wrap gap-1.5 min-h-[2rem]",
                "aria-label": "Gast tags",
                children: [
                  tags.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground italic", children: "Geen tags" }),
                  tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      variant: "outline",
                      className: `text-xs px-2 py-0.5 pr-1 font-medium border flex items-center gap-1 ${getTagStyle$1(tag)}`,
                      children: [
                        tag,
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => handleRemoveTag(tag),
                            "aria-label": `Verwijder tag ${tag}`,
                            className: "hover:opacity-70 transition-opacity ml-0.5",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
                          }
                        )
                      ]
                    },
                    tag
                  ))
                ]
              }
            ),
            availableTags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: handleAddTag, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-8 text-xs w-48 bg-muted/20 border-border",
                  "aria-label": "Tag toevoegen",
                  "data-ocid": "add-tag-select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Tag toevoegen..." })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: availableTags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t.value, children: t.label }, t.value)) })
            ] })
          ] }),
          history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold text-foreground", children: "Reserveringsgeschiedenis" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", "aria-label": "Reserveringsgeschiedenis", children: history.map((res) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: "flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2 text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground", children: [
                    formatDateShort(res.date),
                    " · ",
                    res.time,
                    " ·",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                      res.partySize,
                      " pers."
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: `text-xs border ${STATUS_STYLES[res.status] ?? "bg-muted text-muted-foreground"}`,
                      children: STATUS_LABELS[res.status] ?? res.status
                    }
                  )
                ]
              },
              res.id
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "guest-notes",
                className: "text-sm font-semibold text-foreground",
                children: "Notities"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "guest-notes",
                value: notes,
                onChange: (e) => setNotes(e.target.value),
                placeholder: "Voeg een notitie toe over deze gast...",
                className: "bg-muted/20 border-border text-sm min-h-[80px] resize-none",
                "data-ocid": "guest-notes-input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: onClose,
              "data-ocid": "guest-modal-cancel",
              children: "Annuleren"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              onClick: handleSave,
              disabled: isSaving,
              className: "bg-primary text-primary-foreground hover:bg-primary/90",
              "data-ocid": "guest-modal-save",
              children: isSaving ? "Opslaan..." : "Opslaan"
            }
          )
        ] })
      ]
    }
  ) });
}
const SKELETON_KEYS = ["gs1", "gs2", "gs3", "gs4", "gs5", "gs6"];
function getTagStyle(tag) {
  const lower = tag.toLowerCase();
  if (lower === "vip")
    return "bg-[oklch(var(--status-orange)/0.15)] text-[oklch(var(--status-orange))] border-[oklch(var(--status-orange)/0.25)]";
  if (lower === "allergieën")
    return "bg-destructive/15 text-destructive border-destructive/25";
  if (lower === "verjaardag")
    return "bg-[oklch(var(--status-blue)/0.15)] text-[oklch(var(--status-blue))] border-[oklch(var(--status-blue)/0.25)]";
  if (lower === "stamgast")
    return "bg-primary/15 text-primary border-primary/25";
  return "bg-muted text-muted-foreground border-border";
}
function GuestsPage() {
  const { t } = useTranslation(["dashboard"]);
  const [search, setSearch] = reactExports.useState("");
  const [viewMode, setViewMode] = reactExports.useState("grid");
  const [selectedGuest, setSelectedGuest] = reactExports.useState(null);
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const { data: guests, isLoading } = useGuests();
  const { mutate: updateGuest, isPending: isSaving } = useUpdateGuest();
  const filtered = (guests ?? []).filter((g) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return g.firstName.toLowerCase().includes(q) || g.lastName.toLowerCase().includes(q) || g.email.toLowerCase().includes(q) || g.tags.some((tag) => tag.toLowerCase().includes(q));
  });
  const handleOpenGuest = (guest) => {
    setSelectedGuest(guest);
    setModalOpen(true);
  };
  const handleSaveGuest = (data) => {
    updateGuest(data, {
      onSuccess: () => ue.success(t("dashboard:guests.updated")),
      onError: () => ue.error(t("dashboard:guests.updateError"))
    });
  };
  const vipCount = (guests ?? []).filter((g) => g.vip).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold text-display text-foreground", children: t("dashboard:guests.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: t("dashboard:guests.count", { count: (guests ?? []).length }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        vipCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[oklch(var(--status-orange)/0.15)] text-[oklch(var(--status-orange))] border border-[oklch(var(--status-orange)/0.25)] px-3 py-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 mr-1.5", fill: "currentColor" }),
          vipCount,
          " ",
          t("dashboard:guests.vip")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "gap-2 border-dashed border-muted-foreground/30 text-muted-foreground",
            onClick: () => ue.info(t("dashboard:guests.addGuestSoon")),
            "data-ocid": "add-guest-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
              t("dashboard:guests.addGuest")
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px] max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "search",
            placeholder: t("dashboard:guests.searchPlaceholder"),
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-9 bg-muted/20 border-border",
            "aria-label": t("dashboard:guests.searchPlaceholder"),
            "data-ocid": "guests-search"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center border border-border rounded-lg overflow-hidden",
          role: "toolbar",
          "aria-label": t("dashboard:guests.viewToggle"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: `px-3 py-2 flex items-center gap-1.5 text-xs font-medium transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/40"}`,
                onClick: () => setViewMode("grid"),
                "aria-pressed": viewMode === "grid",
                "data-ocid": "view-grid-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "h-3.5 w-3.5" }),
                  t("dashboard:guests.viewGrid")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: `px-3 py-2 flex items-center gap-1.5 text-xs font-medium transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/40"}`,
                onClick: () => setViewMode("list"),
                "aria-pressed": viewMode === "list",
                "data-ocid": "view-list-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "h-3.5 w-3.5" }),
                  t("dashboard:guests.viewList")
                ]
              }
            )
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4", children: SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, { showAvatar: true, lines: 2 }, k)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-16 text-center",
        "data-ocid": "empty-guests",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10 text-muted-foreground/30 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: t("dashboard:guests.empty") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: t("dashboard:guests.emptyHint") })
        ]
      }
    ) : viewMode === "grid" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4", children: filtered.map((guest) => /* @__PURE__ */ jsxRuntimeExports.jsx(GuestCard, { guest, onClick: handleOpenGuest }, guest.id)) }) : (
      /* List view table */
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-hidden shadow-soft", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "table",
        {
          className: "w-full text-sm",
          "aria-label": t("dashboard:guests.title"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/20", children: [
              t("dashboard:guests.columns.name"),
              t("dashboard:guests.columns.email"),
              t("dashboard:guests.columns.phone"),
              t("dashboard:guests.columns.visits"),
              t("dashboard:guests.columns.tags"),
              t("dashboard:guests.columns.lastVisit")
            ].map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                scope: "col",
                className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide",
                children: col
              },
              col
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: filtered.map((guest) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "hover:bg-muted/20 transition-colors cursor-pointer",
                onClick: () => handleOpenGuest(guest),
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleOpenGuest(guest);
                },
                tabIndex: 0,
                "aria-label": t("dashboard:guests.guestRow", {
                  name: `${guest.firstName} ${guest.lastName}`
                }),
                "data-ocid": "guest-list-row",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    guest.vip && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Star,
                      {
                        className: "h-3.5 w-3.5 text-[oklch(var(--status-orange))] shrink-0",
                        fill: "currentColor"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
                      guest.firstName,
                      " ",
                      guest.lastName
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground truncate max-w-[160px]", children: guest.email }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: guest.phone ?? "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center font-medium text-foreground tabular-nums", children: guest.visitCount }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
                    guest.tags.slice(0, 2).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: `text-xs px-1.5 py-0 border ${getTagStyle(tag)}`,
                        children: tag
                      },
                      tag
                    )),
                    guest.tags.length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      "+",
                      guest.tags.length - 2
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: guest.lastVisit ? new Date(guest.lastVisit).toLocaleDateString(
                    void 0,
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    }
                  ) : "—" })
                ]
              },
              guest.id
            )) })
          ]
        }
      ) })
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      GuestDetailModal,
      {
        guest: selectedGuest,
        open: modalOpen,
        onClose: () => setModalOpen(false),
        onSave: handleSaveGuest,
        isSaving
      }
    )
  ] });
}
export {
  GuestsPage as default
};
