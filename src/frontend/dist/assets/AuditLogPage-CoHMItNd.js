import { i as createLucideIcon, aK as useActor, b4 as useQuery, aM as createActor, u as useTranslation, au as useAuth, av as useNavigate, r as reactExports, j as jsxRuntimeExports, B as Button, bc as ClipboardList, O as Badge } from "./index-BNayfcmF.js";
import { S as Skeleton } from "./skeleton-D2EeOrWT.js";
import { C as ChevronLeft } from "./chevron-left-BG38Auax.js";
import { C as ChevronRight } from "./chevron-right-6-wY6xfI.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  [
    "path",
    {
      d: "M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71",
      key: "1jlk70"
    }
  ],
  [
    "path",
    {
      d: "M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264",
      key: "18rp1v"
    }
  ]
];
const ShieldOff = createLucideIcon("shield-off", __iconNode);
const PAGE_SIZE$1 = 20;
function useAuditLog(page) {
  const { actor, isFetching } = useActor(createActor);
  const offset = BigInt(page * PAGE_SIZE$1);
  const limit = BigInt(PAGE_SIZE$1);
  return useQuery({
    queryKey: ["auditLog", page],
    queryFn: async () => {
      if (!actor) return { entries: [], total: 0 };
      try {
        const result = await actor.getAuditLogPaginated(offset, limit);
        if (result.__kind__ === "err") throw new Error(result.err);
        return {
          entries: result.ok.entries,
          total: Number(result.ok.total)
        };
      } catch {
        return { entries: [], total: 0 };
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
const PAGE_SIZE = 20;
function formatTimestamp(ts) {
  const ms = Number(ts) / 1e6;
  const d = new Date(ms);
  return d.toLocaleString(void 0, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
const ROLE_COLORS = {
  owner: "bg-primary/15 text-primary border-primary/25",
  manager: "bg-secondary/15 text-secondary border-secondary/25",
  marketing: "bg-accent/15 text-accent border-accent/25",
  staff: "bg-muted text-muted-foreground border-border"
};
function AuditLogPage() {
  const { t } = useTranslation("dashboard");
  const { role } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = reactExports.useState(0);
  const { data, isLoading } = useAuditLog(page);
  if (role !== "owner" && role !== "manager") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center",
        "data-ocid": "audit-log.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { className: "h-7 w-7 text-destructive" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-foreground", children: t("auditLog.forbidden") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: t("auditLog.forbiddenHint") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => void navigate({ to: "/dashboard" }),
              "data-ocid": "audit-log.back_button",
              children: t("auditLog.backToDashboard")
            }
          )
        ]
      }
    );
  }
  const entries = (data == null ? void 0 : data.entries) ?? [];
  const total = (data == null ? void 0 : data.total) ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "audit-log.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-5 w-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground", children: t("auditLog.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("auditLog.subtitle") })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide", children: t("auditLog.columns.timestamp") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide", children: t("auditLog.columns.who") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide", children: t("auditLog.columns.page") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide", children: t("auditLog.columns.action") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide", children: t("auditLog.columns.summary") })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? Array.from({ length: 6 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" }) })
          ] }, i)
        )) : entries.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border/50 hover:bg-muted/10 transition-colors",
            "data-ocid": `audit-log.item.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4 text-muted-foreground tabular-nums whitespace-nowrap", children: formatTimestamp(entry.timestamp) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground text-sm truncate max-w-[140px]", children: entry.callerName || `${entry.callerPrincipal.slice(0, 12)}…` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-xs w-fit px-1.5 py-0 h-4 border ${ROLE_COLORS[entry.callerRole] ?? ROLE_COLORS.staff}`,
                    children: entry.callerRole
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: entry.page }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-xs font-medium bg-secondary/10 text-secondary border-secondary/25",
                  children: entry.action
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-4 max-w-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-sm text-foreground truncate",
                    title: entry.summary,
                    children: entry.summary
                  }
                ),
                (entry.oldValue != null || entry.newValue != null) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-1 text-xs text-muted-foreground", children: [
                  entry.oldValue && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "line-through opacity-60 truncate max-w-[80px]",
                      title: entry.oldValue,
                      children: entry.oldValue
                    }
                  ),
                  entry.oldValue && entry.newValue && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "→" }),
                  entry.newValue && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-primary truncate max-w-[80px]",
                      title: entry.newValue,
                      children: entry.newValue
                    }
                  )
                ] })
              ] })
            ]
          },
          entry.id
        )) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden divide-y divide-border/50", children: isLoading ? Array.from({ length: 4 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-48" })
        ] }, i)
      )) : entries.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "p-4 space-y-2",
          "data-ocid": `audit-log.item.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-foreground", children: entry.callerName || `${entry.callerPrincipal.slice(0, 12)}…` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: formatTimestamp(entry.timestamp) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `text-xs border ${ROLE_COLORS[entry.callerRole] ?? ROLE_COLORS.staff}`,
                  children: entry.callerRole
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-xs bg-secondary/10 text-secondary border-secondary/25",
                  children: entry.action
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: entry.page })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: entry.summary })
          ]
        },
        entry.id
      )) }),
      !isLoading && entries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-16 gap-3 text-center",
          "data-ocid": "audit-log.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-muted/50 border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-6 w-6 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: t("auditLog.emptyTitle") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: t("auditLog.emptyHint") })
            ] })
          ]
        }
      )
    ] }),
    total > PAGE_SIZE && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between",
        "data-ocid": "audit-log.pagination",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("auditLog.paginationInfo", {
            from: page * PAGE_SIZE + 1,
            to: Math.min((page + 1) * PAGE_SIZE, total),
            total
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                disabled: !hasPrev,
                onClick: () => setPage((p) => p - 1),
                "data-ocid": "audit-log.pagination_prev",
                className: "gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }),
                  t("auditLog.prev")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
              page + 1,
              " / ",
              totalPages
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                disabled: !hasNext,
                onClick: () => setPage((p) => p + 1),
                "data-ocid": "audit-log.pagination_next",
                className: "gap-1",
                children: [
                  t("auditLog.next"),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
                ]
              }
            )
          ] })
        ]
      }
    )
  ] });
}
export {
  AuditLogPage as default
};
