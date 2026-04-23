import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, ChefHat, Music, Star, Utensils } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ExperienceItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  required?: boolean;
  tag?: "menu" | "event" | "special";
  /** Optional note like "alleen tijdens lunch" shown in the card */
  restrictionNote?: string;
}

interface ExperienceStepProps {
  selectedExperienceId: string;
  onSelect: (id: string) => void;
  experiences?: ExperienceItem[];
  /** If true, hides the "No preference" card — guest must pick one */
  hasRequired?: boolean;
}

const TAG_ICONS = {
  menu: Utensils,
  event: Music,
  special: Star,
} as const;

const GRADIENT_COLORS = [
  "from-primary/20 to-accent/20",
  "from-secondary/20 to-primary/20",
  "from-accent/20 to-secondary/20",
];

export function ExperienceStep({
  selectedExperienceId,
  onSelect,
  experiences = [],
  hasRequired = false,
}: ExperienceStepProps) {
  const { t } = useTranslation("widget");

  const tagLabel = (tag: string) => {
    if (tag === "menu") return t("experienceStep.tagMenu");
    if (tag === "event") return t("experienceStep.tagEvent");
    return t("experienceStep.tagSpecial");
  };

  const noPreferenceSelected = selectedExperienceId === "";

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
        <ChefHat className="h-4 w-4 text-accent" />
        {t("experienceStep.title")}
        {!hasRequired && (
          <span className="font-normal text-xs ml-1 text-muted-foreground">
            {t("experienceStep.optional")}
          </span>
        )}
      </p>

      {/* No preference card — only shown when selection is optional */}
      {!hasRequired && (
        <button
          type="button"
          onClick={() => onSelect("")}
          aria-pressed={noPreferenceSelected}
          className={cn(
            "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
            noPreferenceSelected
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border bg-card hover:border-border/60",
          )}
          data-ocid="exp-no-preference"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-foreground">
                {t("experienceStep.noPreference")}
              </p>
              <p className="text-xs mt-0.5 text-muted-foreground">
                {t("experienceStep.noPreferenceSub")}
              </p>
            </div>
            {noPreferenceSelected && (
              <div className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 bg-primary">
                <Check
                  className="h-3.5 w-3.5 text-primary-foreground"
                  strokeWidth={3}
                />
              </div>
            )}
          </div>
        </button>
      )}

      {/* Empty state */}
      {experiences.length === 0 && (
        <p className="text-xs text-center py-4 text-muted-foreground">
          {t("experienceStep.noExperiences", "Geen ervaringen beschikbaar")}
        </p>
      )}

      {/* Experience cards */}
      {experiences.map((exp, idx) => {
        const isSelected = selectedExperienceId === exp.id;
        const Icon = exp.tag ? TAG_ICONS[exp.tag] : Star;
        const gradientClass = GRADIENT_COLORS[idx % GRADIENT_COLORS.length];

        return (
          <button
            key={exp.id}
            type="button"
            onClick={() => onSelect(isSelected && !hasRequired ? "" : exp.id)}
            aria-pressed={isSelected}
            aria-label={`${exp.name} — €${(exp.price / 100).toFixed(0)} ${t("experienceStep.perPerson")}`}
            className={cn(
              "w-full rounded-xl border-2 text-left transition-all duration-200 overflow-hidden",
              isSelected
                ? "border-primary scale-[1.01] shadow-elevated"
                : "border-border hover:shadow-soft",
            )}
            data-ocid={`exp-${exp.id}`}
          >
            {/* Image placeholder with gradient */}
            <div
              className={cn(
                "h-16 bg-gradient-to-br flex items-center justify-center",
                gradientClass,
              )}
            >
              <Icon className="h-8 w-8 opacity-40 text-accent" />
            </div>

            <div className={cn("p-3", isSelected ? "bg-primary/5" : "bg-card")}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-foreground">
                      {exp.name}
                    </p>
                    {exp.tag && (
                      <Badge
                        className="text-[10px] px-1.5 py-0 h-4 font-medium"
                        variant="secondary"
                      >
                        {tagLabel(exp.tag)}
                      </Badge>
                    )}
                    {exp.required && (
                      <Badge
                        className="text-[10px] px-1.5 py-0 h-4 font-medium bg-accent/10 text-accent border-accent/20"
                        variant="outline"
                      >
                        {t("experienceStep.required", "Verplicht")}
                      </Badge>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-xs mt-1 line-clamp-2 text-muted-foreground">
                      {exp.description}
                    </p>
                  )}
                  {exp.restrictionNote && (
                    <p className="text-[10px] mt-1 text-accent/80 font-medium">
                      {exp.restrictionNote}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
                  <p
                    className={cn(
                      "font-bold text-sm",
                      isSelected ? "text-primary" : "text-accent",
                    )}
                  >
                    €{(exp.price / 100).toFixed(0)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {t("experienceStep.perPerson")}
                  </p>
                  {isSelected && (
                    <div className="h-5 w-5 rounded-full flex items-center justify-center bg-primary">
                      <Check
                        className="h-3 w-3 text-primary-foreground"
                        strokeWidth={3}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
