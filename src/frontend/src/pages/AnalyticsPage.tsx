import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { type DateRange, useAnalytics } from "@/hooks/useAnalytics";
import { useReservations } from "@/hooks/useReservation";
import { useSuggestionAccuracyStats } from "@/hooks/useSeasonalAI";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  Brain,
  CalendarDays,
  TrendingDown,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ── BUG-NEW-005 fix: Use oklch() wrapper for CSS custom properties ────────────
// CSS variables are defined as raw OKLCH values (e.g. "0.7 0.19 142").
// Recharts requires valid CSS color strings — oklch(var(--...)) is correct.
// hsl(var(--...)) produces invalid values because the CSS vars contain OKLCH data.
const GREEN = "oklch(var(--primary))";
const BLUE = "oklch(var(--accent))";
const AMBER = "oklch(var(--secondary))";
const PURPLE = "oklch(var(--ring))";
const GOLD = "oklch(var(--muted-foreground))";

// Chart structural colors — semantic tokens for grid lines and axis ticks
const CHART_GRID = "oklch(var(--border))";
const CHART_TICK = "oklch(var(--muted-foreground))";

// ── Recharts tooltip style (uses CSS vars via inline reference) ───────────────
const TOOLTIP_STYLE = {
  backgroundColor: "oklch(var(--card))",
  border: "1px solid oklch(var(--border))",
  borderRadius: "8px",
  color: "oklch(var(--card-foreground))",
  fontSize: "12px",
};

// ── Date range tabs ───────────────────────────────────────────────────────────
const RANGE_OPTIONS: { value: DateRange; labelKey: string }[] = [
  { value: "7d", labelKey: "analytics.range7d" },
  { value: "30d", labelKey: "analytics.range30d" },
  { value: "90d", labelKey: "analytics.range90d" },
  { value: "custom", labelKey: "analytics.rangeCustom" },
];

// ── KPI Card ──────────────────────────────────────────────────────────────────
interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  color: string;
  trend?: "up" | "down" | "neutral";
  badge?: string;
}

function KpiCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  badge,
}: KpiCardProps) {
  return (
    <Card className="bg-card border-border" data-ocid="analytics-kpi-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground truncate mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {badge && (
              <Badge
                variant="secondary"
                className="mt-2 text-xs bg-primary/10 text-primary border-0"
              >
                {badge}
              </Badge>
            )}
          </div>
          <div
            className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${color}18` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
        </div>
        {trend && (
          <div className="mt-3 flex items-center gap-1">
            {trend === "up" ? (
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
            ) : trend === "down" ? (
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h2>
      {children}
    </div>
  );
}

// ── Peak hour bar color (using CSS token-based oklch values) ─────────────────
function getPeakColor(pct: number): string {
  if (pct >= 80) return "oklch(var(--destructive))";
  if (pct >= 50) return AMBER;
  return GREEN;
}

// ── Main AnalyticsPage ────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { t, i18n } = useTranslation("dashboard");
  const lang = i18n.language?.slice(0, 2) ?? "nl";

  const { data: reservations, isLoading: resLoading } = useReservations();
  const { data: aiStats } = useSuggestionAccuracyStats(30);
  const [activeZones, setActiveZones] = useState<Set<string>>(new Set());

  const {
    analytics,
    range,
    setRange,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    zoneColors,
    hasData,
  } = useAnalytics({ reservations: reservations ?? undefined, lang });

  // Sync activeZones when zone list is first computed from real data
  const currentZoneKey = analytics.zoneNames.join(",");
  const [lastZoneKey, setLastZoneKey] = useState("");
  if (currentZoneKey !== lastZoneKey && analytics.zoneNames.length > 0) {
    setLastZoneKey(currentZoneKey);
    setActiveZones(new Set(analytics.zoneNames));
  }

  const isLoading = resLoading;

  function toggleZone(zone: string) {
    setActiveZones((prev) => {
      const next = new Set(prev);
      if (next.has(zone)) {
        if (next.size > 1) next.delete(zone);
      } else {
        next.add(zone);
      }
      return next;
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-1" data-ocid="analytics-loading">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!hasData) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4"
        data-ocid="analytics-empty"
      >
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <BarChart2 className="h-8 w-8 text-primary/60" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          {t("analytics.emptyTitle")}
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          {t("analytics.emptyHint")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8" data-ocid="analytics-page">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {t("analytics.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("analytics.subtitle")}
          </p>
        </div>
      </div>

      {/* ── Date range filter ──────────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
        data-ocid="analytics-range-selector"
      >
        <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border">
          {RANGE_OPTIONS.map(({ value, labelKey }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRange(value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                range === value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
              data-ocid={`range-btn-${value}`}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>

        {range === "custom" && (
          <div className="flex items-center gap-2 flex-wrap">
            <Input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="h-8 w-36 text-xs bg-muted/50 border-border"
              data-ocid="analytics-custom-start"
              aria-label={t("analytics.customStart")}
            />
            <span className="text-xs text-muted-foreground">–</span>
            <Input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="h-8 w-36 text-xs bg-muted/50 border-border"
              data-ocid="analytics-custom-end"
              aria-label={t("analytics.customEnd")}
            />
          </div>
        )}
      </div>

      {/* ── Section 1: Overview KPIs ───────────────────────────────────────── */}
      <Section title={t("analytics.sectionOverview")}>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard
            title={t("analytics.kpiTotalReservations")}
            value={analytics.totalReservations}
            icon={CalendarDays}
            color={GREEN}
          />
          <KpiCard
            title={t("analytics.kpiAvgPartySize")}
            value={analytics.avgPartySize}
            icon={Users}
            color={BLUE}
          />
          <KpiCard
            title={t("analytics.kpiCancellationRate")}
            value={`${analytics.cancellationRate}%`}
            icon={XCircle}
            color={AMBER}
            trend={analytics.cancellationRate > 10 ? "down" : "neutral"}
          />
          <KpiCard
            title={t("analytics.kpiPopularDay")}
            value={analytics.mostPopularDay}
            icon={TrendingUp}
            color={PURPLE}
            badge={t("analytics.mostPopular")}
          />
          {/* AI Accuracy KPI */}
          <KpiCard
            title={t("analytics.kpiAiAccuracy")}
            value={
              aiStats && aiStats.totalSuggestions > 0
                ? `${aiStats.acceptanceRatePct}%`
                : "—"
            }
            icon={Brain}
            color={GOLD}
            badge={
              aiStats && aiStats.totalSuggestions > 0
                ? t("analytics.aiSuggestionCount", {
                    count: aiStats.totalSuggestions,
                  })
                : t("analytics.aiNoData")
            }
          />
        </div>
      </Section>

      {/* ── Section 2: Occupancy per zone ─────────────────────────────────── */}
      <Section title={t("analytics.sectionOccupancy")}>
        <Card
          className="bg-card border-border"
          data-ocid="analytics-zone-chart"
        >
          <CardHeader className="pb-2 px-5 pt-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-sm font-semibold text-foreground">
                {t("analytics.zoneOccupancyTitle")}
              </CardTitle>
              {/* Zone toggles */}
              <div className="flex flex-wrap gap-2">
                {analytics.zoneNames.map((zone) => {
                  const active = activeZones.has(zone);
                  const color = zoneColors[zone] ?? GREEN;
                  return (
                    <button
                      key={zone}
                      type="button"
                      onClick={() => toggleZone(zone)}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
                        active
                          ? "border-transparent text-foreground"
                          : "border-border text-muted-foreground bg-transparent",
                      )}
                      style={
                        active
                          ? {
                              backgroundColor: `${color}25`,
                              borderColor: color,
                            }
                          : {}
                      }
                      data-ocid={`zone-toggle-${zone}`}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: active ? color : CHART_TICK }}
                      />
                      {zone}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={analytics.occupancyByZone}
                margin={{ top: 8, right: 16, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: CHART_TICK, fontSize: 10 }}
                  interval={Math.max(
                    1,
                    Math.floor(analytics.occupancyByZone.length / 8) - 1,
                  )}
                  tickLine={false}
                  axisLine={{ stroke: CHART_GRID }}
                />
                <YAxis
                  unit="%"
                  tick={{ fill: CHART_TICK, fontSize: 10 }}
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(val: number) => [`${val}%`]}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
                  formatter={(value) => (
                    <span style={{ color: CHART_TICK }}>{value}</span>
                  )}
                />
                {analytics.zoneNames
                  .filter((z) => activeZones.has(z))
                  .map((zone) => (
                    <Line
                      key={zone}
                      type="monotone"
                      dataKey={zone}
                      stroke={zoneColors[zone] ?? GREEN}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Section>

      {/* ── Section 3: Peak hours ──────────────────────────────────────────── */}
      <Section title={t("analytics.sectionPeakHours")}>
        <Card
          className="bg-card border-border"
          data-ocid="analytics-peak-hours"
        >
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-sm font-semibold text-foreground">
              {t("analytics.peakHoursTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={analytics.peakHours}
                margin={{ top: 4, right: 12, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={CHART_GRID}
                  vertical={false}
                />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: CHART_TICK, fontSize: 9 }}
                  tickLine={false}
                  axisLine={{ stroke: CHART_GRID }}
                  interval={1}
                />
                <YAxis
                  tick={{ fill: CHART_TICK, fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(val: number) => [
                    val,
                    t("analytics.avgReservations"),
                  ]}
                />
                <Bar dataKey="avg" radius={[3, 3, 0, 0]}>
                  {analytics.peakHours.map((entry) => (
                    <Cell
                      key={entry.hour}
                      fill={getPeakColor(entry.pct)}
                      opacity={0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* Color legend */}
            <div className="mt-3 flex items-center gap-4 flex-wrap px-3">
              {[
                { color: GREEN, label: t("analytics.peakLow") },
                { color: AMBER, label: t("analytics.peakMedium") },
                {
                  color: "oklch(var(--destructive))",
                  label: t("analytics.peakHigh"),
                },
              ].map(({ color, label }) => (
                <div key={color} className="flex items-center gap-1.5">
                  <div
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* ── Section 4: Reservation patterns ───────────────────────────────── */}
      <Section title={t("analytics.sectionPatterns")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Reservations per day of week */}
          <Card className="bg-card border-border" data-ocid="analytics-by-day">
            <CardHeader className="pb-2 px-5 pt-5">
              <CardTitle className="text-sm font-semibold text-foreground">
                {t("analytics.byDayTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={analytics.reservationsByDay}
                  margin={{ top: 4, right: 12, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_GRID}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: CHART_TICK, fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: CHART_GRID }}
                  />
                  <YAxis
                    tick={{ fill: CHART_TICK, fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(val: number) => [
                      val,
                      t("analytics.reservations"),
                    ]}
                  />
                  <Bar
                    dataKey="count"
                    fill={BLUE}
                    radius={[4, 4, 0, 0]}
                    opacity={0.85}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Party size distribution */}
          <Card
            className="bg-card border-border"
            data-ocid="analytics-party-size"
          >
            <CardHeader className="pb-2 px-5 pt-5">
              <CardTitle className="text-sm font-semibold text-foreground">
                {t("analytics.partySizeTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-4">
              {analytics.partySizeDistribution.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                  {t("analytics.emptyTitle")}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={analytics.partySizeDistribution}
                    margin={{ top: 4, right: 12, left: -16, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={CHART_GRID}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="size"
                      tick={{ fill: CHART_TICK, fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: CHART_GRID }}
                    />
                    <YAxis
                      tick={{ fill: CHART_TICK, fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                      formatter={(val: number) => [
                        val,
                        t("analytics.reservations"),
                      ]}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {analytics.partySizeDistribution.map((entry, idx) => (
                        <Cell
                          key={entry.size}
                          fill={
                            [
                              GREEN,
                              BLUE,
                              AMBER,
                              PURPLE,
                              GOLD,
                              "oklch(var(--secondary))",
                            ][idx % 6]
                          }
                          opacity={0.85}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  );
}
