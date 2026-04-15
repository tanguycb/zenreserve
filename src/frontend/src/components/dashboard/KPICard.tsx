import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";

export interface KPICardProps {
  title: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  trend?: number;
  trendPositive?: boolean;
  trendLabel?: string;
  className?: string;
}

export function KPICard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
  trendPositive = true,
  trendLabel,
  className,
}: KPICardProps) {
  const { t } = useTranslation("dashboard");
  const label = trendLabel ?? t("kpi.vsYesterday");

  return (
    <div
      className={cn(
        "gradient-card rounded-2xl border border-border p-6 shadow-soft",
        "hover-scale-sm cursor-default",
        className,
      )}
      aria-label={`${title}: ${value}`}
      data-ocid="kpi-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground truncate">
            {title}
          </p>
          <p className="mt-2 text-[32px] font-semibold leading-none text-foreground tracking-tight">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
            iconBg,
          )}
          aria-hidden="true"
        >
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      </div>

      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1.5">
          {trendPositive ? (
            <TrendingUp
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: "#22C55E" }}
              aria-hidden="true"
            />
          ) : (
            <TrendingDown
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: "#EF4444" }}
              aria-hidden="true"
            />
          )}
          <span
            className="text-xs font-semibold"
            style={{ color: trendPositive ? "#22C55E" : "#EF4444" }}
          >
            {trendPositive ? "+" : "-"}
            {trend}%
          </span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      )}
    </div>
  );
}

export function SkeletonKPICardFull({ className }: { className?: string }) {
  const { t } = useTranslation("dashboard");
  return (
    <div
      className={cn(
        "gradient-card rounded-2xl border border-border p-6 shadow-soft",
        className,
      )}
      aria-busy="true"
      aria-label={t("kpi.loading")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-20 mt-2" />
        </div>
        <Skeleton className="h-11 w-11 rounded-full shrink-0" />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Skeleton className="h-3.5 w-3.5 rounded" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
