import { cn } from "@/lib/utils";
import { Minus, Plus, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface PartySizeStepProps {
  partySize: number;
  onSelect: (size: number) => void;
}

const SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export function PartySizeStep({ partySize, onSelect }: PartySizeStepProps) {
  const { t } = useTranslation("widget");
  const [hasBabies, setHasBabies] = useState(false);

  function decrement() {
    if (partySize > 1) onSelect(partySize - 1);
  }
  function increment() {
    if (partySize < 12) onSelect(partySize + 1);
  }

  return (
    <div className="space-y-5">
      <p
        className="text-sm font-semibold flex items-center gap-1.5"
        style={{ color: "#1F2937" }}
      >
        <Users className="h-4 w-4" style={{ color: "#22C55E" }} />
        {t("partySizeStep.title")}
      </p>

      {/* Large stepper control */}
      <div className="flex items-center justify-center gap-5 py-2">
        <button
          type="button"
          onClick={decrement}
          disabled={partySize <= 1}
          aria-label={t("partySizeStep.decreaseLabel")}
          className={cn(
            "h-11 w-11 rounded-full border-2 flex items-center justify-center transition-all duration-200 font-bold",
            partySize > 1
              ? "hover:scale-110 active:scale-95"
              : "opacity-30 cursor-not-allowed",
          )}
          style={
            partySize > 1
              ? { borderColor: "#22C55E", color: "#22C55E" }
              : { borderColor: "#E2E8F0", color: "#9CA3AF" }
          }
        >
          <Minus className="h-5 w-5" strokeWidth={2.5} />
        </button>

        <div className="text-center min-w-[4rem]">
          <span
            className="block text-5xl font-bold transition-all duration-200"
            style={{ color: "#1F2937" }}
          >
            {partySize}
          </span>
          <span className="text-xs" style={{ color: "#6B7280" }}>
            {partySize === 1
              ? t("partySizeStep.person")
              : t("partySizeStep.persons")}
          </span>
        </div>

        <button
          type="button"
          onClick={increment}
          disabled={partySize >= 12}
          aria-label={t("partySizeStep.increaseLabel")}
          className={cn(
            "h-11 w-11 rounded-full border-2 flex items-center justify-center transition-all duration-200 font-bold",
            partySize < 12
              ? "hover:scale-110 active:scale-95"
              : "opacity-30 cursor-not-allowed",
          )}
          style={
            partySize < 12
              ? {
                  borderColor: "#22C55E",
                  color: "#22C55E",
                  backgroundColor: "#22C55E1A",
                }
              : { borderColor: "#E2E8F0", color: "#9CA3AF" }
          }
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </div>

      {/* Grid of quick-select cards */}
      <fieldset className="grid grid-cols-6 gap-1.5 border-0 p-0 m-0">
        <legend className="sr-only">{t("partySizeStep.quickSelect")}</legend>
        {SIZES.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onSelect(size)}
            aria-pressed={partySize === size}
            aria-label={`${size} ${size === 1 ? t("partySizeStep.person") : t("partySizeStep.persons")}`}
            className={cn(
              "py-2.5 rounded-xl text-center font-bold text-sm transition-all duration-200",
              partySize === size ? "scale-110 shadow-soft" : "hover:scale-105",
            )}
            style={
              partySize === size
                ? { backgroundColor: "#22C55E", color: "#FFFFFF" }
                : { backgroundColor: "#F3F4F6", color: "#1F2937" }
            }
          >
            {size}
          </button>
        ))}
      </fieldset>

      {/* Children/babies toggle */}
      <label
        className="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all"
        style={
          hasBabies
            ? { backgroundColor: "#22C55E0D" }
            : { backgroundColor: "#F9FAFB" }
        }
      >
        <div
          className={cn(
            "h-5 w-9 rounded-full transition-all duration-300 relative flex-shrink-0",
          )}
          style={{ backgroundColor: hasBabies ? "#22C55E" : "#D1D5DB" }}
          aria-hidden="true"
        >
          <div
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-300",
              hasBabies ? "translate-x-4" : "translate-x-0.5",
            )}
          />
        </div>
        <input
          type="checkbox"
          checked={hasBabies}
          onChange={(e) => setHasBabies(e.target.checked)}
          className="sr-only"
          aria-label={t("partySizeStep.babies")}
        />
        <div>
          <p className="text-sm font-medium" style={{ color: "#1F2937" }}>
            {t("partySizeStep.babies")}
          </p>
          <p className="text-xs" style={{ color: "#6B7280" }}>
            {t("partySizeStep.babiesSub")}
          </p>
        </div>
      </label>

      {partySize > 8 && (
        <p
          className="text-sm text-center rounded-xl px-4 py-2.5"
          style={{ backgroundColor: "#FEF3C7", color: "#D97706" }}
        >
          {t("partySizeStep.largeGroup")}
        </p>
      )}
    </div>
  );
}
