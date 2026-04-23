import { useReservationRules } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";
import { Minus, Plus, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface PartySizeStepProps {
  partySize: number;
  onSelect: (size: number) => void;
  /** Controls whether the babies/children toggle is shown in the widget */
  showBabiesChildren?: boolean;
}

export function PartySizeStep({
  partySize,
  onSelect,
  showBabiesChildren = true,
}: PartySizeStepProps) {
  const { t } = useTranslation("widget");
  const [hasBabies, setHasBabies] = useState(false);

  // BUG-007: read min/max from backend reservation rules; fallback 1–12
  const { data: rules } = useReservationRules();
  const minSize = rules?.minPartySize ?? 1;
  const maxSize = rules?.maxPartySize ?? 12;

  // Build dynamic size list based on configured min/max
  const SIZES = useMemo(
    () => Array.from({ length: maxSize - minSize + 1 }, (_, i) => minSize + i),
    [minSize, maxSize],
  );

  function decrement() {
    if (partySize > minSize) onSelect(partySize - 1);
  }
  function increment() {
    if (partySize < maxSize) onSelect(partySize + 1);
  }

  return (
    <div className="space-y-5">
      <p className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
        <Users className="h-4 w-4 text-primary" />
        {t("partySizeStep.title")}
      </p>

      {/* Large stepper control */}
      <div className="flex items-center justify-center gap-5 py-2">
        <button
          type="button"
          onClick={decrement}
          disabled={partySize <= minSize}
          aria-label={t("partySizeStep.decreaseLabel")}
          className={cn(
            "h-11 w-11 rounded-full border-2 flex items-center justify-center transition-all duration-200 font-bold",
            partySize > minSize
              ? "border-primary text-primary hover:scale-110 active:scale-95"
              : "border-border text-muted-foreground opacity-30 cursor-not-allowed",
          )}
        >
          <Minus className="h-5 w-5" strokeWidth={2.5} />
        </button>

        <div className="text-center min-w-[4rem]">
          <span className="block text-5xl font-bold transition-all duration-200 text-foreground">
            {partySize}
          </span>
          <span className="text-xs text-muted-foreground">
            {partySize === 1
              ? t("partySizeStep.person")
              : t("partySizeStep.persons")}
          </span>
        </div>

        <button
          type="button"
          onClick={increment}
          disabled={partySize >= maxSize}
          aria-label={t("partySizeStep.increaseLabel")}
          className={cn(
            "h-11 w-11 rounded-full border-2 flex items-center justify-center transition-all duration-200 font-bold",
            partySize < maxSize
              ? "border-primary text-primary bg-primary/10 hover:scale-110 active:scale-95"
              : "border-border text-muted-foreground opacity-30 cursor-not-allowed",
          )}
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
              partySize === size
                ? "bg-primary text-primary-foreground scale-110 shadow-soft"
                : "bg-muted text-foreground hover:scale-105",
            )}
          >
            {size}
          </button>
        ))}
      </fieldset>

      {/* Children/babies toggle — only shown when setting is enabled */}
      {showBabiesChildren && (
        <label
          className={cn(
            "flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all",
            hasBabies ? "bg-primary/5" : "bg-muted/50",
          )}
        >
          <div
            className={cn(
              "h-5 w-9 rounded-full transition-all duration-300 relative flex-shrink-0",
              hasBabies ? "bg-primary" : "bg-muted-foreground/30",
            )}
            aria-hidden="true"
          >
            <div
              className={cn(
                "absolute top-0.5 h-4 w-4 rounded-full bg-card shadow transition-all duration-300",
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
            data-ocid="widget-babies-toggle"
          />
          <div>
            <p className="text-sm font-medium text-foreground">
              {t("partySizeStep.babies")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("partySizeStep.babiesSub")}
            </p>
          </div>
        </label>
      )}

      {partySize > 8 && (
        <p className="text-sm text-center rounded-xl px-4 py-2.5 bg-[oklch(var(--status-orange)/0.12)] text-[oklch(var(--status-orange))]">
          {t("partySizeStep.largeGroup")}
        </p>
      )}
    </div>
  );
}
