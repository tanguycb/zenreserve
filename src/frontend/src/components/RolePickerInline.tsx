import { Button } from "@/components/ui/button";
import {
  getSelectableRoles,
  markFirstLoginDone,
  setStoredRole,
  useAuth,
} from "@/hooks/useAuth";
import type { AppRole } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { ChefHat, Megaphone, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface RoleOption {
  id: AppRole;
  labelKey: string;
  descKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ALL_ROLE_OPTIONS: RoleOption[] = [
  {
    id: "owner",
    labelKey: "roles.owner",
    descKey: "roles.ownerDesc",
    icon: ShieldCheck,
  },
  {
    id: "manager",
    labelKey: "roles.manager",
    descKey: "roles.managerDesc",
    icon: Users,
  },
  {
    id: "marketing",
    labelKey: "roles.marketing",
    descKey: "roles.marketingDesc",
    icon: Megaphone,
  },
];

/**
 * Shown inside the dashboard shell when a user is authenticated but
 * their role has been cleared from localStorage (e.g. manual clear).
 * Lets them re-select without logging out.
 */
export function RolePickerInline() {
  const { t } = useTranslation(["dashboard", "shared"]);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(null);

  const selectableRoleIds = getSelectableRoles();
  const roleOptions = ALL_ROLE_OPTIONS.filter((r) =>
    selectableRoleIds.includes(r.id),
  );

  const handleConfirm = () => {
    if (!selectedRole) return;
    setStoredRole(selectedRole);
    markFirstLoginDone();
    void navigate({ to: "/dashboard" });
    // Force a page reload so DashboardLayout re-reads the role
    window.location.reload();
  };

  return (
    <div className="dark min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8 space-y-3">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-soft">
            <ChefHat className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-display text-foreground">
              ZenReserve
            </h1>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-elevated overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-foreground">
                {t("dashboard:login.chooseRole")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("dashboard:login.chooseRoleSub")}
              </p>
            </div>

            <fieldset className="space-y-3 border-0 p-0 m-0">
              <legend className="sr-only">
                {t("dashboard:login.roleSelect")}
              </legend>
              {roleOptions.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    data-ocid={`inline-role-option-${role.id}`}
                    aria-pressed={isSelected}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border text-left",
                      "transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/40 hover:bg-muted/50",
                    )}
                  >
                    <div
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                        isSelected ? "bg-primary/20" : "bg-muted",
                      )}
                      aria-hidden="true"
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          isSelected ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          isSelected ? "text-primary" : "text-foreground",
                        )}
                      >
                        {t(`dashboard:login.${role.labelKey}`)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t(`dashboard:login.${role.descKey}`)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </fieldset>

            <Button
              className="w-full h-12 text-base font-semibold"
              disabled={!selectedRole}
              onClick={handleConfirm}
              data-ocid="inline-role-confirm-btn"
            >
              {t("dashboard:login.continueAs", {
                role: selectedRole
                  ? t(
                      `dashboard:login.roles.${selectedRole}` as Parameters<
                        typeof t
                      >[0],
                    )
                  : "…",
              })}
            </Button>

            <div className="border-t border-border pt-3">
              <Button
                variant="ghost"
                className="w-full text-sm text-muted-foreground"
                onClick={logout}
                data-ocid="inline-role-logout-btn"
              >
                {t("shared:actions.logout")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
