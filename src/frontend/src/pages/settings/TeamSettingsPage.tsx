import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import {
  type TeamRole,
  useAddTeamMember,
  useRemoveTeamMember,
  useTeamMembers,
  useUpdateTeamMemberRole,
} from "@/hooks/useTeam";
import {
  AlertTriangle,
  Crown,
  Loader2,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// ── Role badge colour map ─────────────────────────────────────────────────────
const roleBadgeClass: Record<string, string> = {
  owner: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  manager: "bg-primary/15 text-primary border border-primary/30",
  marketing: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  staff: "bg-muted text-muted-foreground border border-border",
};

const ASSIGNABLE_ROLES: TeamRole[] = ["manager", "marketing", "staff"];

function RoleBadge({ role }: { role: string }) {
  const { t } = useTranslation("dashboard");
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleBadgeClass[role] ?? roleBadgeClass.staff}`}
    >
      {role === "owner" && <Crown className="h-2.5 w-2.5" />}
      {t(`settings.team.roles.${role}`, { defaultValue: role })}
    </span>
  );
}

function RoleDescription({ role }: { role: string }) {
  const { t } = useTranslation("dashboard");
  return (
    <p className="text-xs text-muted-foreground">
      {t(`settings.team.roleDesc.${role}`, { defaultValue: "" })}
    </p>
  );
}

// ── Add member form ───────────────────────────────────────────────────────────
function AddMemberForm() {
  const { t } = useTranslation("dashboard");
  const addMember = useAddTeamMember();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("staff");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    try {
      await addMember.mutateAsync({
        principalId: `pending-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        role,
      });
      toast.success(t("settings.team.invited", { name: name.trim() }));
      setName("");
      setEmail("");
      setRole("staff");
    } catch {
      toast.error(t("settings.team.inviteError"));
    }
  };

  return (
    <section
      className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden"
      data-ocid="team-add-member-section"
    >
      <div className="px-6 py-5 border-b border-border flex items-center gap-2">
        <UserPlus className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">
          {t("settings.team.addMember")}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div className="space-y-2">
            <Label
              htmlFor="member-name"
              className="text-sm font-medium text-foreground"
            >
              {t("settings.team.form.name")}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="member-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("settings.team.form.namePlaceholder")}
              className="bg-background border-border"
              required
              data-ocid="team-member-name"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="member-email"
              className="text-sm font-medium text-foreground"
            >
              {t("settings.team.form.email")}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="member-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="medewerker@restaurant.be"
              className="bg-background border-border"
              required
              data-ocid="team-member-email"
            />
          </div>
        </div>

        {/* Role selector */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            {t("settings.team.form.role")}
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ASSIGNABLE_ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex flex-col gap-1 px-4 py-3 rounded-xl border text-left transition-colors ${
                  role === r
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background hover:border-primary/50"
                }`}
                data-ocid={`team-role-${r}`}
              >
                <RoleBadge role={r} />
                <RoleDescription role={r} />
              </button>
            ))}
          </div>
        </div>

        {/* II note */}
        <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-muted/30 border border-border">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            {t("settings.team.inviteNote")}
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!name.trim() || !email.trim() || addMember.isPending}
            className="gap-2"
            data-ocid="team-invite-btn"
          >
            {addMember.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            {addMember.isPending
              ? t("settings.saving")
              : t("settings.team.invite")}
          </Button>
        </div>
      </form>
    </section>
  );
}

// ── Role change dropdown ──────────────────────────────────────────────────────
function RoleSelect({
  memberId,
  currentRole,
}: {
  memberId: string;
  currentRole: string;
}) {
  const { t } = useTranslation("dashboard");
  const updateRole = useUpdateTeamMemberRole();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as TeamRole;
    try {
      await updateRole.mutateAsync({ memberId, newRole });
      toast.success(t("settings.team.roleUpdated"));
    } catch {
      toast.error(t("settings.team.roleUpdateError"));
    }
  };

  return (
    <select
      value={currentRole}
      onChange={handleChange}
      disabled={updateRole.isPending}
      className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
      data-ocid={`role-select-${memberId}`}
    >
      {ASSIGNABLE_ROLES.map((r) => (
        <option key={r} value={r}>
          {t(`settings.team.roles.${r}`)}
        </option>
      ))}
    </select>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function TeamSettingsPage() {
  const { t } = useTranslation("dashboard");
  const { role: currentUserRole, identity } = useAuth();
  const { data: members, isLoading } = useTeamMembers();
  const removeTeamMember = useRemoveTeamMember();

  const isOwner = currentUserRole === "owner";

  // Find current user in team list using principalId
  const currentPrincipal = identity?.getPrincipal().toText();
  const currentMember = members?.find(
    (m) => m.principalId === currentPrincipal,
  );

  const handleRemove = async (memberId: string, memberName: string) => {
    if (!confirm(t("settings.team.confirmRemove", { name: memberName })))
      return;
    try {
      await removeTeamMember.mutateAsync(memberId);
      toast.success(t("settings.team.removed", { name: memberName }));
    } catch {
      toast.error(t("settings.team.removeError"));
    }
  };

  return (
    <div className="max-w-3xl space-y-8" data-ocid="team-settings-page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {t("settings.nav.team")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("settings.team.subtitle")}
          </p>
        </div>
      </div>

      {/* Current user card */}
      <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5 flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Crown className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {currentMember?.name ?? t("settings.team.you")}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {currentMember?.email ?? t("settings.team.currentSession")}
          </p>
        </div>
        <RoleBadge role={currentUserRole} />
      </section>

      {/* Role descriptions */}
      <section className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {t("settings.team.rolesOverview")}
          </h2>
        </div>
        <div className="divide-y divide-border">
          {(["owner", "manager", "marketing", "staff"] as const).map((r) => (
            <div key={r} className="px-6 py-4 flex items-center gap-4">
              <div className="w-28 shrink-0">
                <RoleBadge role={r} />
              </div>
              <p className="text-sm text-muted-foreground">
                {t(`settings.team.roleDesc.${r}`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team members list */}
      <section className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {t("settings.team.members")}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("settings.team.membersCount", { count: members?.length ?? 0 })}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : !members || members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-6">
            <Users className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              {t("settings.team.empty")}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border" data-ocid="team-members-list">
            {members.map((member) => {
              const isCurrentUser = member.principalId === currentPrincipal;
              const joinedDate = new Date(
                Number(member.createdAt) / 1_000_000,
              ).toLocaleDateString("nl-BE", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={member.id}
                  className="px-6 py-4 flex items-center gap-4"
                  data-ocid={`team-member-row-${member.id}`}
                >
                  {/* Avatar */}
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-foreground">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground truncate">
                        {member.name}
                      </p>
                      {isCurrentUser && (
                        <Badge
                          variant="outline"
                          className="text-xs border-primary/30 text-primary"
                        >
                          {t("settings.team.you")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.email}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                      {t("settings.team.joined")} {joinedDate}
                    </p>
                  </div>

                  {/* Role */}
                  <div className="shrink-0">
                    {isOwner && member.role !== "owner" && !isCurrentUser ? (
                      <RoleSelect
                        memberId={member.id}
                        currentRole={member.role}
                      />
                    ) : (
                      <RoleBadge role={member.role} />
                    )}
                  </div>

                  {/* Remove */}
                  {isOwner && member.role !== "owner" && !isCurrentUser && (
                    <button
                      type="button"
                      onClick={() => handleRemove(member.id, member.name)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label={t("settings.team.removeMember", {
                        name: member.name,
                      })}
                      data-ocid={`team-remove-${member.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Add member form — owner only */}
      {isOwner && <AddMemberForm />}

      {/* Non-owner read-only notice */}
      {!isOwner && (
        <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-muted/30 border border-border">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            {t("settings.team.readOnlyNote")}
          </p>
        </div>
      )}
    </div>
  );
}
