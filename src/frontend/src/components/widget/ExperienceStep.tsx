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
  tag?: "menu" | "event" | "special";
}

interface ExperienceStepProps {
  selectedExperienceId: string;
  onSelect: (id: string) => void;
  experiences?: ExperienceItem[];
}

const TAG_ICONS = {
  menu: Utensils,
  event: Music,
  special: Star,
} as const;

const GRADIENT_COLORS = [
  "from-[#22C55E]/20 to-[#D97706]/20",
  "from-[#3B82F6]/20 to-[#22C55E]/20",
  "from-[#D97706]/20 to-[#3B82F6]/20",
];

export function ExperienceStep({
  selectedExperienceId,
  onSelect,
  experiences = [],
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
      <p
        className="text-sm font-semibold flex items-center gap-1.5"
        style={{ color: "#1F2937" }}
      >
        <ChefHat className="h-4 w-4" style={{ color: "#D97706" }} />
        {t("experienceStep.title")}
        <span className="font-normal text-xs ml-1" style={{ color: "#9CA3AF" }}>
          {t("experienceStep.optional")}
        </span>
      </p>

      {/* No preference card */}
      <button
        type="button"
        onClick={() => onSelect("")}
        aria-pressed={noPreferenceSelected}
        className={cn(
          "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
          noPreferenceSelected ? "scale-[1.01]" : "hover:border-[#E2E8F0]",
        )}
        style={
          noPreferenceSelected
            ? { borderColor: "#22C55E", backgroundColor: "#22C55E0D" }
            : { borderColor: "#E2E8F0", backgroundColor: "#FFFFFF" }
        }
        data-ocid="exp-no-preference"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm" style={{ color: "#1F2937" }}>
              {t("experienceStep.noPreference")}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
              {t("experienceStep.noPreferenceSub")}
            </p>
          </div>
          {noPreferenceSelected && (
            <div
              className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#22C55E" }}
            >
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </div>
          )}
        </div>
      </button>

      {/* Empty state */}
      {experiences.length === 0 && (
        <p className="text-xs text-center py-4" style={{ color: "#9CA3AF" }}>
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
            onClick={() => onSelect(isSelected ? "" : exp.id)}
            aria-pressed={isSelected}
            aria-label={`${exp.name} — €${(exp.price / 100).toFixed(0)} ${t("experienceStep.perPerson")}`}
            className={cn(
              "w-full rounded-xl border-2 text-left transition-all duration-200 overflow-hidden",
              isSelected ? "scale-[1.01] shadow-elevated" : "hover:shadow-soft",
            )}
            style={
              isSelected
                ? { borderColor: "#22C55E" }
                : { borderColor: "#E2E8F0" }
            }
            data-ocid={`exp-${exp.id}`}
          >
            {/* Image placeholder with gradient */}
            <div
              className={cn(
                "h-16 bg-gradient-to-br flex items-center justify-center",
                gradientClass,
              )}
            >
              <Icon
                className="h-8 w-8 opacity-40"
                style={{ color: "#D97706" }}
              />
            </div>

            <div
              className="p-3"
              style={{ backgroundColor: isSelected ? "#22C55E0D" : "#FFFFFF" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "#1F2937" }}
                    >
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
                  </div>
                  {exp.description && (
                    <p
                      className="text-xs mt-1 line-clamp-2"
                      style={{ color: "#6B7280" }}
                    >
                      {exp.description}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
                  <p
                    className="font-bold text-sm"
                    style={{ color: isSelected ? "#22C55E" : "#D97706" }}
                  >
                    €{(exp.price / 100).toFixed(0)}
                  </p>
                  <p className="text-[10px]" style={{ color: "#9CA3AF" }}>
                    {t("experienceStep.perPerson")}
                  </p>
                  {isSelected && (
                    <div
                      className="h-5 w-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#22C55E" }}
                    >
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
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
