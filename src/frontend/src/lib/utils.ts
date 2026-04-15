import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CURRENCY_CODE, CURRENCY_LOCALE, DATE_LOCALE } from "./constants";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string or Date object to a human-readable Dutch date.
 * e.g. "maandag 10 april 2026"
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  },
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(DATE_LOCALE, options);
}

/**
 * Format a date string to short date: "10 apr. 2026"
 */
export function formatDateShort(date: string | Date): string {
  return formatDate(date, { day: "numeric", month: "short", year: "numeric" });
}

/**
 * Format a time string "HH:MM" to localized time: "19:30"
 */
export function formatTime(time: string): string {
  return time;
}

/**
 * Format a timestamp to a date + time string.
 */
export function formatDateTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleString(DATE_LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format cents to currency string. e.g. 9500 → "€ 95,00"
 */
export function formatCurrency(cents: number): string {
  return (cents / 100).toLocaleString(CURRENCY_LOCALE, {
    style: "currency",
    currency: CURRENCY_CODE,
  });
}

/**
 * Get initials from full name or first+last name.
 * "Sophie van den Berg" → "SB"
 */
export function getInitials(firstName: string, lastName?: string): string {
  if (lastName) {
    return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
  }
  const parts = firstName.trim().split(" ");
  if (parts.length === 1) return (parts[0]?.[0] ?? "").toUpperCase();
  return `${parts[0]?.[0] ?? ""}${parts[parts.length - 1]?.[0] ?? ""}`.toUpperCase();
}

/**
 * Pluralize a word based on count (simple Dutch helper).
 */
export function pluralize(
  count: number,
  singular: string,
  plural: string,
): string {
  return count === 1 ? singular : plural;
}

/**
 * Truncate a string to a maximum length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}
