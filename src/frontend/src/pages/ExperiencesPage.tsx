import { SkeletonCard } from "@/components/SkeletonCard";
import { ExperienceForm } from "@/components/dashboard/ExperienceForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  useDeleteExperience,
  useExperiences,
  useUpdateExperience,
} from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/utils";
import type { Experience } from "@/types";
import { Edit2, Package, Plus, Star, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const SKELETON_KEYS = ["e1", "e2", "e3"];

const TAG_STYLES: Record<string, string> = {
  menu: "bg-primary/15 text-primary border-primary/25",
  event:
    "bg-[oklch(var(--status-blue)/0.15)] text-[oklch(var(--status-blue))] border-[oklch(var(--status-blue)/0.25)]",
  special:
    "bg-[oklch(var(--status-orange)/0.15)] text-[oklch(var(--status-orange))] border-[oklch(var(--status-orange)/0.25)]",
};

export default function ExperiencesPage() {
  const { t } = useTranslation(["dashboard"]);
  const { data: experiences, isLoading } = useExperiences();
  const deleteExperience = useDeleteExperience();
  const updateExperience = useUpdateExperience();

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Experience | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);

  const tagLabel = (tag: string) => {
    if (tag === "menu") return t("dashboard:experiences.tagMenu");
    if (tag === "event") return t("dashboard:experiences.tagEvent");
    return t("dashboard:experiences.tagSpecial");
  };

  const handleAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const handleEdit = (exp: Experience) => {
    setEditTarget(exp);
    setFormOpen(true);
  };

  const handleDeleteRequest = (exp: Experience) => {
    setDeleteTarget(exp);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const name = deleteTarget.name;
    deleteExperience.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success(t("dashboard:experiences.deleted", { name }));
        setDeleteTarget(null);
      },
      onError: (err) => {
        toast.error(err.message ?? t("dashboard:common.errorGeneric"));
        setDeleteTarget(null);
      },
    });
  };

  const handleSave = (data: Omit<Experience, "id"> | Experience) => {
    if ("id" in data) {
      toast.success(t("dashboard:experiences.updated", { name: data.name }));
    } else {
      toast.success(t("dashboard:experiences.added", { name: data.name }));
    }
    setFormOpen(false);
  };

  const handleToggleRequired = (exp: Experience, required: boolean) => {
    updateExperience.mutate(
      { ...exp, required },
      {
        onSuccess: () => {
          toast.success(
            required
              ? t("dashboard:experiences.markedRequired", {
                  name: exp.name,
                  defaultValue: `"${exp.name}" gemarkeerd als verplicht`,
                })
              : t("dashboard:experiences.markedOptional", {
                  name: exp.name,
                  defaultValue: `"${exp.name}" gemarkeerd als optioneel`,
                }),
          );
        },
        onError: (err) => {
          toast.error(err.message ?? t("dashboard:common.errorGeneric"));
        },
      },
    );
  };

  // Only show active experiences in the grid (inactive = soft-deleted)
  const visibleExperiences = (experiences ?? []).filter((e) => e.available);
  const activeCount = visibleExperiences.length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-display text-foreground">
            {t("dashboard:experiences.title")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t("dashboard:experiences.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-primary/15 text-primary border border-primary/25 px-3 py-1.5">
            <Star className="h-3.5 w-3.5 mr-1.5" />
            {t("dashboard:experiences.activeCount", { count: activeCount })}
          </Badge>
          <Button
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleAdd}
            data-ocid="add-experience-btn"
          >
            <Plus className="h-4 w-4" />
            {t("dashboard:experiences.newExperience")}
          </Button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {SKELETON_KEYS.map((k) => (
            <SkeletonCard key={k} showImage lines={2} />
          ))}
        </div>
      ) : visibleExperiences.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="empty-experiences"
        >
          <Package className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="font-semibold text-foreground text-lg">
            {t("dashboard:experiences.empty")}
          </p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            {t("dashboard:experiences.emptyHint")}
          </p>
          <Button
            className="mt-5 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleAdd}
            data-ocid="empty-add-experience-btn"
          >
            <Plus className="h-4 w-4" />
            {t("dashboard:experiences.newExperience")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleExperiences.map((exp) => (
            <article
              key={exp.id}
              className="rounded-xl border border-primary/30 shadow-soft overflow-hidden bg-card transition-all hover:shadow-elevated"
              data-ocid="experience-card"
              aria-label={`${t("dashboard:experiences.title")}: ${exp.name}`}
            >
              {/* Visual band */}
              <div className="h-24 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 flex items-center justify-center relative">
                <Star className="h-10 w-10 text-accent/30" />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border bg-primary/15 text-primary border-primary/25">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {t("dashboard:experiences.active")}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {exp.name}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {exp.description}
                    </p>
                  </div>
                  {exp.tag && (
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-xs border ${TAG_STYLES[exp.tag] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {tagLabel(exp.tag)}
                    </Badge>
                  )}
                </div>

                {/* Required toggle */}
                <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 border border-border">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground">
                      {t("dashboard:experiences.requiredToggle", {
                        defaultValue: "Verplicht voor gasten",
                      })}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {exp.required
                        ? t("dashboard:experiences.requiredHint", {
                            defaultValue: "Gast moet een ervaring kiezen",
                          })
                        : t("dashboard:experiences.optionalHint", {
                            defaultValue: "Gast kan ervaring overslaan",
                          })}
                    </p>
                  </div>
                  <Switch
                    checked={exp.required}
                    onCheckedChange={(v) => handleToggleRequired(exp, v)}
                    disabled={updateExperience.isPending}
                    aria-label={t("dashboard:experiences.requiredToggle", {
                      defaultValue: "Verplicht voor gasten",
                    })}
                    data-ocid={`exp-required-toggle-${exp.id}`}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    <p className="text-lg font-bold text-foreground tabular-nums">
                      {formatCurrency(exp.price)}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      {t("dashboard:experiences.pricePerPerson")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-muted/40 transition-colors text-muted-foreground hover:text-primary"
                      onClick={() => handleEdit(exp)}
                      aria-label={t("dashboard:experiences.editLabel", {
                        name: exp.name,
                      })}
                      data-ocid="edit-experience-btn"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive disabled:opacity-40"
                      onClick={() => handleDeleteRequest(exp)}
                      disabled={deleteExperience.isPending}
                      aria-label={t("dashboard:experiences.deleteLabel", {
                        name: exp.name,
                      })}
                      data-ocid="delete-experience-btn"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Capacity placeholder */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{t("dashboard:experiences.unlimited")}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Add/Edit modal */}
      <ExperienceForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initial={editTarget}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent data-ocid="delete-experience-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("dashboard:experiences.deleteTitle", {
                defaultValue: "Ervaring verwijderen",
              })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard:experiences.deleteConfirm", {
                name: deleteTarget?.name ?? "",
                defaultValue: `Weet je zeker dat je "${deleteTarget?.name}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="delete-experience-cancel-btn"
              onClick={() => setDeleteTarget(null)}
            >
              {t("dashboard:common.cancel", { defaultValue: "Annuleren" })}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground focus-visible:ring-destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteExperience.isPending}
              data-ocid="delete-experience-confirm-btn"
            >
              {deleteExperience.isPending
                ? t("dashboard:common.deleting", {
                    defaultValue: "Verwijderen…",
                  })
                : t("dashboard:common.delete", { defaultValue: "Verwijderen" })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
