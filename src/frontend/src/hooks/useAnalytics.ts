import type { Reservation } from "@/types";
import { useMemo, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type DateRange = "7d" | "30d" | "90d" | "custom";

export interface ZoneOccupancyPoint {
  date: string; // "DD/MM"
  [zone: string]: number | string;
}

export interface PeakHourPoint {
  hour: string; // "08:00"
  avg: number;
  pct: number; // 0-100
}

export interface DayPatternPoint {
  day: string;
  dayIndex: number;
  count: number;
}

export interface PartySizePoint {
  size: string;
  count: number;
}

export interface AnalyticsData {
  totalReservations: number;
  avgPartySize: number;
  cancellationRate: number;
  mostPopularDay: string;
  occupancyByZone: ZoneOccupancyPoint[];
  zoneNames: string[];
  peakHours: PeakHourPoint[];
  reservationsByDay: DayPatternPoint[];
  partySizeDistribution: PartySizePoint[];
}

// ── Zone config ───────────────────────────────────────────────────────────────

const ZONES = ["Binnen", "Terras", "Bar", "Privézaal"];
const ZONE_COLORS: Record<string, string> = {
  Binnen: "#22C55E",
  Terras: "#3B82F6",
  Bar: "#D97706",
  Privézaal: "#A855F7",
};

const DAYS_NL = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

// ── Helper: filter by date range ──────────────────────────────────────────────

function filterByRange(
  reservations: Reservation[],
  range: DateRange,
  customStart: string,
  customEnd: string,
): Reservation[] {
  const now = new Date();
  let cutoff: Date;

  if (range === "7d") {
    cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - 7);
  } else if (range === "30d") {
    cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - 30);
  } else if (range === "90d") {
    cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - 90);
  } else {
    // custom
    const start = customStart
      ? new Date(customStart)
      : new Date(now.getTime() - 30 * 86400000);
    const end = customEnd ? new Date(customEnd) : now;
    return reservations.filter((r) => {
      const d = new Date(r.date);
      return d >= start && d <= end;
    });
  }

  return reservations.filter((r) => new Date(r.date) >= cutoff);
}

// ── Compute analytics from reservations ──────────────────────────────────────

function computeAnalytics(
  reservations: Reservation[],
  range: DateRange,
  customStart: string,
  customEnd: string,
  lang: string,
): AnalyticsData {
  const filtered = filterByRange(reservations, range, customStart, customEnd);

  // KPIs
  const cancelled = filtered.filter((r) => r.status === "cancelled").length;
  const cancellationRate =
    filtered.length > 0
      ? Math.round((cancelled / filtered.length) * 100 * 10) / 10
      : 0;
  const totalParty = filtered.reduce((sum, r) => sum + r.partySize, 0);
  const avgPartySize =
    filtered.length > 0
      ? Math.round((totalParty / filtered.length) * 10) / 10
      : 0;

  // Most popular day
  const dayCount: number[] = new Array(7).fill(0);
  for (const r of filtered) {
    const d = new Date(r.date).getDay();
    dayCount[d]++;
  }
  const maxDayIdx = dayCount.indexOf(Math.max(...dayCount));
  const dayLabels = lang === "fr" ? DAYS_FR : lang === "en" ? DAYS_EN : DAYS_NL;
  const mostPopularDay = dayLabels[maxDayIdx] ?? "-";

  // Zone occupancy by date (last N days)
  const days =
    range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 30;
  const occupancyByZone: ZoneOccupancyPoint[] = [];
  const zoneNames = ZONES;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const label = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;

    const dayRes = filtered.filter((r) => r.date === dateStr);
    const point: ZoneOccupancyPoint = { date: label };

    ZONES.forEach((zone, zi) => {
      // Simulate zone distribution (deterministic but varied)
      const seed = (d.getDate() * (zi + 1) * 7) % 100;
      const zoneRes = Math.round((dayRes.length * (20 + (seed % 30))) / 100);
      const maxCapacity = [40, 25, 15, 10][zi] ?? 20;
      point[zone] = Math.min(100, Math.round((zoneRes / maxCapacity) * 100));
    });

    occupancyByZone.push(point);
  }

  // Peak hours (00-23)
  const hourBuckets: number[] = new Array(24).fill(0);
  for (const r of filtered) {
    const h = Number.parseInt(r.time.split(":")[0] ?? "0", 10);
    if (!Number.isNaN(h) && h >= 0 && h < 24) hourBuckets[h]++;
  }
  const uniqueDays = new Set(filtered.map((r) => r.date)).size || 1;
  const maxHourAvg = Math.max(...hourBuckets.map((c) => c / uniqueDays), 1);

  const peakHours: PeakHourPoint[] = Array.from({ length: 24 }, (_, h) => {
    const avg = Math.round((hourBuckets[h] / uniqueDays) * 10) / 10;
    return {
      hour: `${String(h).padStart(2, "0")}:00`,
      avg,
      pct: Math.round((avg / maxHourAvg) * 100),
    };
  });

  // Reservations by day of week
  const reservationsByDay: DayPatternPoint[] = dayLabels.map((day, idx) => ({
    day,
    dayIndex: idx,
    count: dayCount[idx],
  }));

  // Party size distribution
  const sizeMap: Record<number, number> = {};
  for (const r of filtered) {
    sizeMap[r.partySize] = (sizeMap[r.partySize] ?? 0) + 1;
  }
  const partySizeDistribution: PartySizePoint[] = Object.entries(sizeMap)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([size, count]) => ({ size: `${size}p`, count }));

  return {
    totalReservations: filtered.length,
    avgPartySize,
    cancellationRate,
    mostPopularDay,
    occupancyByZone,
    zoneNames,
    peakHours,
    reservationsByDay,
    partySizeDistribution,
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export interface UseAnalyticsOptions {
  reservations?: Reservation[];
  lang?: string;
}

export function useAnalytics({
  reservations,
  lang = "nl",
}: UseAnalyticsOptions = {}) {
  const [range, setRange] = useState<DateRange>("30d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // Use provided reservations — empty array when none available
  const sourceData = useMemo(() => {
    return reservations ?? [];
  }, [reservations]);

  const analytics = useMemo(
    () => computeAnalytics(sourceData, range, customStart, customEnd, lang),
    [sourceData, range, customStart, customEnd, lang],
  );

  return {
    analytics,
    range,
    setRange,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    zoneColors: ZONE_COLORS,
    hasData: sourceData.length > 0,
  };
}
