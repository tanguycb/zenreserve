import { SkeletonCard } from "@/components/SkeletonCard";
import { ExperienceForm } from "@/components/dashboard/ExperienceForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useExperiences } from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/utils";
import type { Experience } from "@/types";
import { Edit2, Package, Plus, Star, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const SKELETON_KEYS = ["e1", "e2", "e3"];

const TAG_STYLES: Record<string, string> = {
  menu: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  event: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  special: "bg-amber-500/15 text-amber-400 border-amber-500/25",
};

export default function ExperiencesPage() {
  const { t } = useTranslation(["dashboard"]);
  const { data: experiences, isLoading } = useExperiences();
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Experience | null>(null);

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

  const handleDelete = (exp: Experience) => {
    toast.success(t("dashboard:experiences.deleted", { name: exp.name }));
  };

  const handleSave = (data: Omit<Experience, "id"> | Experience) => {
    if ("id" in data) {
      toast.success(t("dashboard:experiences.updated", { name: data.name }));
    } else {
      toast.success(t("dashboard:experiences.added", { name: data.name }));
    }
    setFormOpen(false);
  };

  const activeCount = (experiences ?? []).filter((e) => e.available).length;

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
          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-3 py-1.5">
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
      ) : (experiences ?? []).length === 0 ? (
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
          {(experiences ?? []).map((exp) => (
            <article
              key={exp.id}
              className={`rounded-xl border shadow-soft overflow-hidden bg-card transition-all hover:shadow-elevated ${exp.available ? "border-emerald-500/30" : "border-border opacity-70"}`}
              data-ocid="experience-card"
              aria-label={`${t("dashboard:experiences.title")}: ${exp.name}`}
            >
              {/* Visual band */}
              <div className="h-24 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 flex items-center justify-center relative">
                <Star className="h-10 w-10 text-accent/30" />
                {/* Active badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${exp.available ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" : "bg-muted text-muted-foreground border-border"}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${exp.available ? "bg-emerald-400" : "bg-muted-foreground"}`}
                    />
                    {exp.available
                      ? t("dashboard:experiences.active")
                      : t("dashboard:experiences.inactive")}
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
                      className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400"
                      onClick={() => handleDelete(exp)}
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
    </div>
  );
}
