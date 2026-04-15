import { k as createLucideIcon, v as useActor, w as useQuery, h as useQueryClient, x as useMutation, y as createActor, u as useTranslation, z as useAuth, j as jsxRuntimeExports, U as Users, i as Badge, b as ue, r as reactExports, B as Button } from "./index-DYFUyfbw.js";
import { I as Input } from "./input-Be5T95oX.js";
import { L as Label } from "./label-whBlDZv1.js";
import { L as LoaderCircle } from "./loader-circle-BzYpqiPm.js";
import { T as Trash2 } from "./trash-2-BocM61zf.js";
import { T as TriangleAlert } from "./triangle-alert-GVRwenOx.js";
import { U as UserPlus } from "./user-plus-DZ5a45bW.js";
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
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
];
const Crown = createLucideIcon("crown", __iconNode);
function useTeamMembers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["teamMembers"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listTeamMembers();
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 3e4
  });
}
function useAddTeamMember() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      if (!actor) {
        const mock = {
          id: Date.now().toString(),
          principalId: payload.principalId,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          createdAt: BigInt(Date.now())
        };
        return mock;
      }
      const result = await actor.addTeamMember(
        payload.principalId,
        payload.name,
        payload.email,
        payload.role
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    }
  });
}
function useUpdateTeamMemberRole() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ memberId, newRole }) => {
      if (!actor) return;
      const result = await actor.updateTeamMemberRole(memberId, newRole);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    }
  });
}
function useRemoveTeamMember() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (memberId) => {
      if (!actor) return;
      const result = await actor.removeTeamMember(memberId);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    }
  });
}
const roleBadgeClass = {
  owner: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  manager: "bg-primary/15 text-primary border border-primary/30",
  marketing: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  staff: "bg-muted text-muted-foreground border border-border"
};
const ASSIGNABLE_ROLES = ["manager", "marketing", "staff"];
function RoleBadge({ role }) {
  const { t } = useTranslation("dashboard");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleBadgeClass[role] ?? roleBadgeClass.staff}`,
      children: [
        role === "owner" && /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-2.5 w-2.5" }),
        t(`settings.team.roles.${role}`, { defaultValue: role })
      ]
    }
  );
}
function RoleDescription({ role }) {
  const { t } = useTranslation("dashboard");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t(`settings.team.roleDesc.${role}`, { defaultValue: "" }) });
}
function AddMemberForm() {
  const { t } = useTranslation("dashboard");
  const addMember = useAddTeamMember();
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("staff");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    try {
      await addMember.mutateAsync({
        principalId: `pending-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        role
      });
      ue.success(t("settings.team.invited", { name: name.trim() }));
      setName("");
      setEmail("");
      setRole("staff");
    } catch {
      ue.error(t("settings.team.inviteError"));
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden",
      "data-ocid": "team-add-member-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.team.addMember") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "px-6 py-6 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "member-name",
                  className: "text-sm font-medium text-foreground",
                  children: [
                    t("settings.team.form.name"),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive ml-1", children: "*" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "member-name",
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  placeholder: t("settings.team.form.namePlaceholder"),
                  className: "bg-background border-border",
                  required: true,
                  "data-ocid": "team-member-name"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "member-email",
                  className: "text-sm font-medium text-foreground",
                  children: [
                    t("settings.team.form.email"),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive ml-1", children: "*" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "member-email",
                  type: "email",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  placeholder: "medewerker@restaurant.be",
                  className: "bg-background border-border",
                  required: true,
                  "data-ocid": "team-member-email"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: t("settings.team.form.role") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: ASSIGNABLE_ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setRole(r),
                className: `flex flex-col gap-1 px-4 py-3 rounded-xl border text-left transition-colors ${role === r ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/50"}`,
                "data-ocid": `team-role-${r}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: r }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RoleDescription, { role: r })
                ]
              },
              r
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 px-4 py-3 rounded-xl bg-muted/30 border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-amber-400 shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.team.inviteNote") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              disabled: !name.trim() || !email.trim() || addMember.isPending,
              className: "gap-2",
              "data-ocid": "team-invite-btn",
              children: [
                addMember.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
                addMember.isPending ? t("settings.saving") : t("settings.team.invite")
              ]
            }
          ) })
        ] })
      ]
    }
  );
}
function RoleSelect({
  memberId,
  currentRole
}) {
  const { t } = useTranslation("dashboard");
  const updateRole = useUpdateTeamMemberRole();
  const handleChange = async (e) => {
    const newRole = e.target.value;
    try {
      await updateRole.mutateAsync({ memberId, newRole });
      ue.success(t("settings.team.roleUpdated"));
    } catch {
      ue.error(t("settings.team.roleUpdateError"));
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "select",
    {
      value: currentRole,
      onChange: handleChange,
      disabled: updateRole.isPending,
      className: "rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50",
      "data-ocid": `role-select-${memberId}`,
      children: ASSIGNABLE_ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r, children: t(`settings.team.roles.${r}`) }, r))
    }
  );
}
function TeamSettingsPage() {
  const { t } = useTranslation("dashboard");
  const { role: currentUserRole, identity } = useAuth();
  const { data: members, isLoading } = useTeamMembers();
  const removeTeamMember = useRemoveTeamMember();
  const isOwner = currentUserRole === "owner";
  const currentPrincipal = identity == null ? void 0 : identity.getPrincipal().toText();
  const currentMember = members == null ? void 0 : members.find(
    (m) => m.principalId === currentPrincipal
  );
  const handleRemove = async (memberId, memberName) => {
    if (!confirm(t("settings.team.confirmRemove", { name: memberName })))
      return;
    try {
      await removeTeamMember.mutateAsync(memberId);
      ue.success(t("settings.team.removed", { name: memberName }));
    } catch {
      ue.error(t("settings.team.removeError"));
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl space-y-8", "data-ocid": "team-settings-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-foreground", children: t("settings.nav.team") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("settings.team.subtitle") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-primary/30 bg-primary/5 p-5 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-5 w-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: (currentMember == null ? void 0 : currentMember.name) ?? t("settings.team.you") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: (currentMember == null ? void 0 : currentMember.email) ?? t("settings.team.currentSession") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: currentUserRole })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.team.rolesOverview") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: ["owner", "manager", "marketing", "staff"].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-28 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: r }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t(`settings.team.roleDesc.${r}`) })
      ] }, r)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border bg-card shadow-subtle overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-5 border-b border-border flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t("settings.team.members") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("settings.team.membersCount", { count: (members == null ? void 0 : members.length) ?? 0 }) })
      ] }) }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-primary" }) }) : !members || members.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-8 w-8 text-muted-foreground/40 mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("settings.team.empty") })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", "data-ocid": "team-members-list", children: members.map((member) => {
        const isCurrentUser = member.principalId === currentPrincipal;
        const joinedDate = new Date(
          Number(member.createdAt) / 1e6
        ).toLocaleDateString("nl-BE", {
          day: "numeric",
          month: "short",
          year: "numeric"
        });
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-6 py-4 flex items-center gap-4",
            "data-ocid": `team-member-row-${member.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: member.name.charAt(0).toUpperCase() }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: member.name }),
                  isCurrentUser && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-xs border-primary/30 text-primary",
                      children: t("settings.team.you")
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: member.email }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground/60 mt-0.5", children: [
                  t("settings.team.joined"),
                  " ",
                  joinedDate
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: isOwner && member.role !== "owner" && !isCurrentUser ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                RoleSelect,
                {
                  memberId: member.id,
                  currentRole: member.role
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: member.role }) }),
              isOwner && member.role !== "owner" && !isCurrentUser && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleRemove(member.id, member.name),
                  className: "p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                  "aria-label": t("settings.team.removeMember", {
                    name: member.name
                  }),
                  "data-ocid": `team-remove-${member.id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                }
              )
            ]
          },
          member.id
        );
      }) })
    ] }),
    isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx(AddMemberForm, {}),
    !isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 px-4 py-3 rounded-xl bg-muted/30 border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-amber-400 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("settings.team.readOnlyNote") })
    ] })
  ] });
}
export {
  TeamSettingsPage as default
};
