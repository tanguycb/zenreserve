import { KPICard, SkeletonKPICardFull } from "@/components/dashboard/KPICard";
import { MiniOccupancyWidget } from "@/components/dashboard/MiniOccupancyWidget";
import { RecentReservations } from "@/components/dashboard/RecentReservations";
import { useWaitlist } from "@/hooks/useDashboard";
import { useKPIs, useReservations } from "@/hooks/useReservation";
import { useCapacityConfig } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CalendarDays,
  Clock,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const KPI_SKELETON_KEYS = ["kpi-sk-1", "kpi-sk-2", "kpi-sk-3", "kpi-sk-4"];

// ── Covers Per Service ────────────────────────────────────────────────────────

interface CouvertsPerServiceProps {
  services: Array<{ name: string; covers: number }>;
}

function CouvertsPerService({ services }: CouvertsPerServiceProps) {
  const { t } = useTranslation("dashboard");

  if (services.length === 0) {
    return (
      <div
        className="gradient-card rounded-2xl border border-border p-5 shadow-soft flex items-center justify-center"
        data-ocid="couverts-per-service"
      >
        <p className="text-sm text-muted-foreground italic">
          {t("dashboard:home.noCouverts", "Geen couverts vandaag")}
        </p>
      </div>
    );
  }

  return (
    <div
      className="gradient-card rounded-2xl border border-border p-5 shadow-soft"
      data-ocid="couverts-per-service"
    >
      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        {t("dashboard:home.couvertsPerService", "Couverts per dienst vandaag")}
      </p>
      <div className="flex flex-wrap gap-2">
        {services.map(({ name, covers }) => (
          <div
            key={name}
            className="flex items-center gap-2 bg-muted/40 rounded-full px-4 py-1.5 border border-border"
          >
            <span className="text-sm font-semibold text-foreground">
              {name}
            </span>
            <span className="text-sm font-bold text-primary">{covers}</span>
            <span className="text-xs text-muted-foreground">
              {t("dashboard:home.covers", "cov.")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AI Insight ────────────────────────────────────────────────────────────────

interface AIInsightProps {
  maxOccupancyPct: number;
  criticalSlotTime?: string;
  totalCovers: number;
  totalCapacity: number;
}

function AIInsightCallout({
  maxOccupancyPct,
  criticalSlotTime,
  totalCovers,
  totalCapacity,
}: AIInsightProps) {
  const { t } = useTranslation("dashboard");
  const remaining = Math.max(totalCapacity - totalCovers, 0);

  let insight: string;
  if (maxOccupancyPct > 90 && criticalSlotTime) {
    insight = t(
      "dashboard:home.aiInsightOverbooking",
      `Mogelijk overboekingsrisico om ${criticalSlotTime} (${maxOccupancyPct}% bezet) — controleer beschikbaarheid`,
      { time: criticalSlotTime, pct: maxOccupancyPct },
    );
  } else if (maxOccupancyPct > 70) {
    insight = t(
      "dashboard:home.aiInsightBusy",
      `Drukke dienst verwacht — ${maxOccupancyPct}% bezet op piekmomenten`,
      { pct: maxOccupancyPct },
    );
  } else if (totalCovers === 0) {
    insight = t(
      "dashboard:home.aiInsightEmpty",
      "Nog geen reserveringen vandaag — widget en widget online?",
    );
  } else if (remaining > 0) {
    insight = t(
      "dashboard:home.aiInsightQuiet",
      `Rustige dag verwacht — nog ${remaining} plaatsen beschikbaar`,
      { remaining },
    );
  } else {
    insight = t(
      "dashboard:home.aiInsightNeutral",
      `Bezetting loopt goed — ${totalCovers} couverts bevestigd voor vandaag`,
      { covers: totalCovers },
    );
  }

  const borderColor =
    maxOccupancyPct > 90
      ? "border-l-[oklch(0.65_0.24_25)]"
      : maxOccupancyPct > 70
        ? "border-l-[oklch(0.72_0.22_58)]"
        : "border-l-primary";

  return (
    <div
      className={cn(
        "gradient-card rounded-2xl border border-border shadow-soft",
        "border-l-4 pl-4 pr-5 py-4 flex items-start gap-3",
        borderColor,
      )}
      data-ocid="ai-insight-callout"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15">
        <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-0.5">
          {t("dashboard:home.aiInsightLabel", "AI Inzicht")}
        </p>
        <p className="text-sm text-foreground leading-snug">{insight}</p>
      </div>
    </div>
  );
}

// ── DashboardHome ─────────────────────────────────────────────────────────────

export default function DashboardHome() {
  const { t } = useTranslation(["dashboard"]);
  const { data: kpis, isLoading: kpisLoading } = useKPIs();
  const { data: allReservations = [], isLoading: resLoading } =
    useReservations();
  const { data: capacityConfig } = useCapacityConfig();

  const todayStr = new Date().toISOString().split("T")[0];

  // BUG 3 fix: real waitlist count from backend (only waiting + offered entries)
  const { data: waitlistEntries = [] } = useWaitlist(todayStr);
  const realWaitlistCount = waitlistEntries.filter(
    (e) => e.status === "waiting" || e.status === "offered",
  ).length;

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const todayReservations = allReservations.filter((r) => r.date === todayStr);

  // Derive confirmed covers per service directly from real reservations
  const lunchCovers = todayReservations
    .filter(
      (r) =>
        r.time >= "11:00" &&
        r.time < "15:00" &&
        r.status !== "cancelled" &&
        r.status !== "departed",
    )
    .reduce((acc, r) => acc + r.partySize, 0);

  const dinerCovers = todayReservations
    .filter(
      (r) =>
        r.time >= "17:00" &&
        r.time < "23:00" &&
        r.status !== "cancelled" &&
        r.status !== "departed",
    )
    .reduce((acc, r) => acc + r.partySize, 0);

  // Prefer backend coversPerService if available, otherwise derive from reservations
  const kpisExtended = kpis as
    | (typeof kpis & { coversPerService?: { name: string; covers: number }[] })
    | undefined;
  const coversPerService: Array<{ name: string; covers: number }> =
    kpisExtended?.coversPerService ??
    [
      { name: t("dashboard:home.serviceLunch", "Lunch"), covers: lunchCovers },
      { name: t("dashboard:home.serviceDiner", "Diner"), covers: dinerCovers },
    ].filter((s) => s.covers > 0);

  // Total confirmed covers for today
  const totalCovers = kpis?.todayCovers ?? lunchCovers + dinerCovers;
  // BUG-014: use real capacity from settings; fallback to 100 while loading
  const totalCapacity = capacityConfig?.totalSeatsPerSlot ?? 100;

  // Cancellation rate derived from today's reservations
  const cancelCount = todayReservations.filter(
    (r) => r.status === "cancelled",
  ).length;
  const totalToday = todayReservations.length;
  const cancellationRate =
    totalToday > 0 ? Math.round((cancelCount / totalToday) * 100) : 0;

  // Find most critical (highest occupancy) slot from today's reservations
  const slotMap = new Map<string, number>();
  for (const r of todayReservations) {
    if (r.status === "cancelled" || r.status === "departed") continue;
    const prev = slotMap.get(r.time) ?? 0;
    slotMap.set(r.time, prev + r.partySize);
  }
  let maxSlotCovers = 0;
  let maxSlotTime: string | undefined;
  for (const [time, covers] of slotMap.entries()) {
    if (covers > maxSlotCovers) {
      maxSlotCovers = covers;
      maxSlotTime = time;
    }
  }
  const maxOccupancyPct =
    totalCapacity > 0 ? Math.round((maxSlotCovers / totalCapacity) * 100) : 0;

  const kpiCards = [
    {
      key: "today",
      title: t("dashboard:home.todayReservations"),
      value: kpis?.todayReservations ?? todayReservations.length,
      icon: CalendarDays,
      iconColor: "text-primary",
      iconBg: "bg-primary/15",
      trend: undefined,
    },
    {
      key: "couverts",
      title: t("dashboard:home.couvertsToday", "Couverts vandaag"),
      value: totalCovers,
      icon: Users,
      iconColor: "text-secondary",
      iconBg: "bg-secondary/15",
      trend: undefined,
    },
    {
      key: "waitlist",
      title: t("dashboard:home.waitlistCount", "Wachtlijst vandaag"),
      value: realWaitlistCount,
      icon: Clock,
      iconColor:
        realWaitlistCount > 0 ? "text-accent" : "text-muted-foreground",
      iconBg: realWaitlistCount > 0 ? "bg-accent/15" : "bg-muted/30",
      trend: undefined,
    },
    {
      key: "cancellations",
      title: t("dashboard:home.cancellationRate", "Annuleringsgraad"),
      value: `${cancellationRate}%`,
      icon: cancellationRate > 20 ? AlertCircle : XCircle,
      iconColor:
        cancellationRate > 20 ? "text-destructive" : "text-muted-foreground",
      iconBg: cancellationRate > 20 ? "bg-destructive/15" : "bg-muted/30",
      trendPositive: cancellationRate <= 15,
      trend: undefined,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h1 className="heading-h1">{t("dashboard:home.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1 capitalize">{today}</p>
      </div>

      {/* KPI Cards */}
      <section
        aria-label={t("dashboard:home.kpiSection")}
        aria-live="polite"
        aria-atomic="false"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpisLoading
            ? KPI_SKELETON_KEYS.map((k) => <SkeletonKPICardFull key={k} />)
            : kpiCards.map((card) => (
                <KPICard
                  key={card.key}
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  iconColor={card.iconColor}
                  iconBg={card.iconBg}
                  trend={card.trend}
                  trendPositive={card.trendPositive}
                />
              ))}
        </div>
      </section>

      {/* Couverts per service + AI insight row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CouvertsPerService services={coversPerService} />
        <AIInsightCallout
          maxOccupancyPct={maxOccupancyPct}
          criticalSlotTime={maxSlotTime}
          totalCovers={totalCovers}
          totalCapacity={totalCapacity}
        />
      </div>

      {/* Lower section: recent reservations + mini occupancy widget */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <RecentReservations
          reservations={todayReservations}
          isLoading={resLoading}
          className="lg:col-span-3"
        />
        <MiniOccupancyWidget
          reservations={todayReservations}
          className="lg:col-span-2"
        />
      </div>
    </div>
  );
}
