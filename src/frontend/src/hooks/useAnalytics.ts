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

// ── Constants ─────────────────────────────────────────────────────────────────

const DAYS_NL = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

/** Fallback zone label for reservations without zone data */
const NO_ZONE_LABEL: Record<string, string> = {
  nl: "Geen zone",
  en: "No zone",
  fr: "Sans zone",
};

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
  const noZoneLabel = NO_ZONE_LABEL[lang] ?? NO_ZONE_LABEL.nl;

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

  // ── BUG-029 fix: Zone occupancy from real reservation data ────────────────
  // Group reservations by zone field (r.zone or r.tableZone) to get real counts.
  // Derive the dynamic zone list from the actual reservation data.
  const days =
    range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 30;

  // Collect all unique zone names from the data
  const zoneSet = new Set<string>();
  for (const r of filtered) {
    const zone =
      (r as Reservation & { zone?: string }).zone ??
      (r as Reservation & { tableZone?: string }).tableZone ??
      null;
    zoneSet.add(zone ?? noZoneLabel);
  }
  // If no reservations, provide sensible empty state
  const zoneNames = zoneSet.size > 0 ? Array.from(zoneSet) : [];

  // Build a map: date -> zone -> total partySize booked
  const zoneDayMap: Record<string, Record<string, number>> = {};
  for (const r of filtered) {
    if (!zoneDayMap[r.date]) zoneDayMap[r.date] = {};
    const zone =
      (r as Reservation & { zone?: string }).zone ??
      (r as Reservation & { tableZone?: string }).tableZone ??
      noZoneLabel;
    zoneDayMap[r.date][zone] = (zoneDayMap[r.date][zone] ?? 0) + r.partySize;
  }

  // Compute total capacity per zone: sum all bookings per zone across all dates
  // to derive a relative max for percentage calculation
  const zoneMaxCapacity: Record<string, number> = {};
  for (const dateZones of Object.values(zoneDayMap)) {
    for (const [zone, count] of Object.entries(dateZones)) {
      zoneMaxCapacity[zone] = Math.max(zoneMaxCapacity[zone] ?? 0, count);
    }
  }

  const occupancyByZone: ZoneOccupancyPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const label = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;

    const point: ZoneOccupancyPoint = { date: label };
    for (const zone of zoneNames) {
      const booked = zoneDayMap[dateStr]?.[zone] ?? 0;
      // Use the observed max as the capacity ceiling for percentage calculation
      const maxCap = zoneMaxCapacity[zone] ?? 1;
      point[zone] = Math.min(100, Math.round((booked / maxCap) * 100));
    }
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

// ── Dynamic zone color palette ────────────────────────────────────────────────
// LOW-004 fix: Use direct hex colors instead of hsl(var(...)) which is not valid
// for charting libraries like Recharts that expect CSS color strings.
// Colors are deterministically derived from zone name via the same deriveZoneColor logic.

const TOKEN_PALETTE = [
  "#22C55E", // primary green
  "#3B82F6", // blue
  "#EAB308", // yellow
  "#A855F7", // purple
  "#0EA5E9", // sky
  "#F97316", // orange
  "#EC4899", // pink
  "#14B8A6", // teal
];

/**
 * Derive a deterministic chart color from zone name.
 * Works for any zone name — no hardcoding required.
 */
function deriveChartColor(zoneName: string): string {
  let hash = 0;
  for (let i = 0; i < zoneName.length; i++) {
    hash = (hash * 31 + zoneName.charCodeAt(i)) >>> 0;
  }
  return TOKEN_PALETTE[hash % TOKEN_PALETTE.length];
}

export function getZoneColor(zone: string, zoneNames: string[]): string {
  // First try position-based (for backwards compat), but prefer name-based hash
  const idx = zoneNames.indexOf(zone);
  if (idx !== -1) return TOKEN_PALETTE[idx % TOKEN_PALETTE.length];
  return deriveChartColor(zone);
}

export function buildZoneColorMap(zoneNames: string[]): Record<string, string> {
  return Object.fromEntries(
    zoneNames.map((zone) => [zone, deriveChartColor(zone)]),
  );
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

  const sourceData = useMemo(() => {
    return reservations ?? [];
  }, [reservations]);

  const analytics = useMemo(
    () => computeAnalytics(sourceData, range, customStart, customEnd, lang),
    [sourceData, range, customStart, customEnd, lang],
  );

  // BUG-012: Zone color map derived from dynamic zone list, using CSS tokens
  const zoneColors = useMemo(
    () => buildZoneColorMap(analytics.zoneNames),
    [analytics.zoneNames],
  );

  return {
    analytics,
    range,
    setRange,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    zoneColors,
    hasData: sourceData.length > 0,
  };
}
