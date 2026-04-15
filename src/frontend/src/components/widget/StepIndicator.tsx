import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Step {
  id: number;
  label: string;
}

interface StepIndicatorProps {
  steps: readonly Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const { t } = useTranslation("widget");
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <nav
      className="px-6 pt-6 pb-5"
      style={{ backgroundColor: "#FAF7F0" }}
      aria-label={t("stepIndicator.progressLabel", {
        current: currentStep,
        total: steps.length,
      })}
    >
      {/* Step numbers + labels */}
      <div className="flex items-start justify-between mb-4 gap-1">
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-1 flex-1"
            >
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                  isCompleted && "scale-90",
                  isCurrent && "scale-110 shadow-soft",
                )}
                style={
                  isCompleted
                    ? { backgroundColor: "#22C55E", color: "#FFFFFF" }
                    : isCurrent
                      ? {
                          backgroundColor: "#22C55E",
                          color: "#FFFFFF",
                          boxShadow: "0 0 0 3px #22C55E33",
                        }
                      : { backgroundColor: "#E2E8F0", color: "#9CA3AF" }
                }
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium text-center leading-tight hidden sm:block transition-colors",
                )}
                style={
                  isCompleted || isCurrent
                    ? { color: "#22C55E" }
                    : { color: "#9CA3AF" }
                }
              >
                {step.label}
              </span>
              {/* Mobile: only show current */}
              {isCurrent && (
                <span
                  className="text-[10px] font-semibold text-center leading-tight sm:hidden"
                  style={{ color: "#22C55E" }}
                >
                  {step.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: "#E2E8F0" }}
      >
        <div
          role="progressbar"
          tabIndex={0}
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t("stepIndicator.progressLabel", {
            current: currentStep,
            total: steps.length,
          })}
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%`, backgroundColor: "#22C55E" }}
        />
      </div>
    </nav>
  );
}
