import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ExperienceCard, RestaurantCard } from "@/components/RestaurantCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useRestaurantAvailability,
  useRestaurantConfig,
  useSearchFilters,
} from "@/hooks/useRestaurantSearch";
import { useOpeningHoursConfig } from "@/hooks/useSettings";
import type { TimeSlot } from "@/types";
import { CalendarDays, ChefHat, ChevronLeft, Clock, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import WidgetPage from "./WidgetPage";

// ── Skeleton components ───────────────────────────────────────────────────────
function SkeletonRestaurantCard() {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-card shadow-subtle">
      <Skeleton className="h-[240px] w-full rounded-none" />
      <div className="px-5 pt-4 pb-5 bg-card space-y-3">
        <Skeleton className="h-6 w-3/5 rounded-lg" />
        <Skeleton className="h-4 w-2/5 rounded" />
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-4/5 rounded" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

function SkeletonSlot() {
  return <Skeleton className="h-[52px] rounded-xl" style={{ minWidth: 80 }} />;
}

function SkeletonExperienceCard() {
  return <Skeleton className="flex-shrink-0 rounded-xl h-[130px] w-[200px]" />;
}

// ── Slot availability coloring ────────────────────────────────────────────────
function getSlotAvailability(slot: TimeSlot): "full" | "limited" | "free" {
  if (!slot.available) return "full";
  const ratio = slot.booked / slot.capacity;
  if (ratio >= 0.75) return "limited";
  return "free";
}

function getSlotClassName(availability: "full" | "limited" | "free"): string {
  if (availability === "full") {
    return "bg-destructive/10 text-destructive border border-destructive/30 opacity-60 cursor-not-allowed";
  }
  if (availability === "limited") {
    return "bg-[oklch(var(--status-orange)/0.1)] text-[oklch(var(--status-orange))] border border-[oklch(var(--status-orange)/0.3)] hover:bg-[oklch(var(--status-orange)/0.2)]";
  }
  return "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20";
}

interface SelectedSlot {
  date: string;
  time: string;
  partySize: number;
}

// Day index (0=Mon…6=Sun) → translation key
const DAY_KEYS = [
  "days.monday",
  "days.tuesday",
  "days.wednesday",
  "days.thursday",
  "days.friday",
  "days.saturday",
  "days.sunday",
] as const;

// ── GuestSearchPage ───────────────────────────────────────────────────────────
export default function GuestSearchPage() {
  const { t } = useTranslation(["app", "shared"]);
  const { filters, updateFilters } = useSearchFilters();
  const {
    data: restaurant,
    isLoading: restaurantLoading,
    experiences,
  } = useRestaurantConfig();
  const { data: slots, isLoading: slotsLoading } = useRestaurantAvailability(
    filters.date,
    filters.guests,
  );
  const { data: openingHoursConfig } = useOpeningHoursConfig();

  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  const today = new Date().toISOString().split("T")[0];

  function handleSlotClick(time: string) {
    setSelectedSlot({
      date: filters.date,
      time,
      partySize: filters.guests,
    });
  }

  function handleBookNow() {
    setSelectedSlot({
      date: filters.date,
      time: "",
      partySize: filters.guests,
    });
  }

  const showSlots = !!filters.date && filters.guests > 0;

  // Build a per-day summary from services: for each day 0-6 (Mon-Sun), collect open services
  const openingHoursByDay: Array<{
    dayIndex: number;
    isClosed: boolean;
    times: string[];
  }> = Array.from({ length: 7 }, (_, dayIndex) => {
    const isFixedClosed =
      openingHoursConfig?.fixedClosingDays.includes(dayIndex) ?? false;
    const activeSvcs =
      openingHoursConfig?.services.filter((svc) =>
        svc.enabledDays.includes(dayIndex),
      ) ?? [];
    return {
      dayIndex,
      isClosed: isFixedClosed || activeSvcs.length === 0,
      times: activeSvcs.map((svc) => `${svc.openTime} – ${svc.closeTime}`),
    };
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Skip nav */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:rounded-md focus:font-medium bg-primary text-primary-foreground"
      >
        {t("shared:accessibility.skipToContent")}
      </a>

      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b bg-card shadow-subtle"
        data-ocid="guest-app-header"
      >
        <a
          href="/app"
          className="flex items-center gap-2 no-underline transition-opacity hover:opacity-80"
        >
          <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10">
            <ChefHat className="h-4 w-4 text-primary" />
          </div>
          <span className="font-bold text-base text-foreground tracking-[-0.01em]">
            ZenReserve
          </span>
        </a>
        <LanguageSwitcher variant="header" />
      </header>

      {/* Main */}
      <main
        id="main-content"
        className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6"
      >
        <AnimatePresence mode="wait">
          {selectedSlot ? (
            /* ── Inline widget view ── */
            <motion.div
              key="widget-inline"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex flex-col gap-4"
            >
              {/* Back button */}
              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
                className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70 self-start text-muted-foreground"
                data-ocid="back-to-search-btn"
              >
                <ChevronLeft className="h-4 w-4" />
                {t("app:booking.backToSearch")}
              </button>

              {/* Embedded widget */}
              <WidgetPage
                initialDate={selectedSlot.date}
                initialTime={selectedSlot.time}
                initialPartySize={selectedSlot.partySize}
                initialStep={selectedSlot.time ? 4 : 1}
              />
            </motion.div>
          ) : (
            /* ── Search view ── */
            <motion.div
              key="search-view"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              {/* Hero title */}
              <div>
                <h1 className="text-[1.75rem] leading-tight font-bold mb-1 text-foreground">
                  {t("app:search.title")}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("app:search.subtitle")}
                </p>
              </div>

              {/* Restaurant card */}
              {restaurantLoading ? (
                <SkeletonRestaurantCard />
              ) : restaurant ? (
                <RestaurantCard
                  restaurant={restaurant}
                  onBookNow={handleBookNow}
                />
              ) : null}

              {/* Search bar */}
              <div
                className="rounded-2xl p-4 flex flex-col sm:flex-row gap-3 bg-card shadow-soft"
                data-ocid="search-bar"
              >
                {/* Date picker */}
                <label className="flex-1 flex flex-col gap-1">
                  <span className="text-xs font-semibold flex items-center gap-1 text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {t("app:booking.selectedDate")}
                  </span>
                  <input
                    type="date"
                    value={filters.date}
                    min={today}
                    onChange={(e) => updateFilters({ date: e.target.value })}
                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-11"
                    data-ocid="search-date-input"
                  />
                </label>

                {/* Party size */}
                <label className="flex flex-col gap-1 min-w-[120px]">
                  <span className="text-xs font-semibold flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {t("app:search.guestsLabel")}
                  </span>
                  <select
                    value={filters.guests}
                    onChange={(e) =>
                      updateFilters({ guests: Number(e.target.value) })
                    }
                    className="rounded-lg border border-input bg-background px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-11"
                    data-ocid="search-guests-select"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n}{" "}
                        {n === 1
                          ? t("app:search.guest")
                          : t("app:search.guests")}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Search button */}
                <button
                  type="button"
                  onClick={() => {
                    document
                      .getElementById("availability-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="h-12 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-[0.97] flex items-center justify-center self-end bg-primary text-primary-foreground px-5 min-w-[100px]"
                  data-ocid="search-submit-btn"
                >
                  {t("app:search.searchButton")}
                </button>
              </div>

              {/* Availability grid */}
              <section
                id="availability-section"
                data-ocid="availability-section"
              >
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2 text-foreground">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {t("app:restaurant.availability")}
                </h2>

                {!showSlots ? (
                  <p className="text-sm py-4 text-center rounded-xl text-muted-foreground bg-card border border-dashed border-border">
                    {t("app:search.chooseDate")}
                  </p>
                ) : slotsLoading ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {Array.from({ length: 6 }, (_, i) => (
                      <SkeletonSlot key={`slot-skel-${i + 1}`} />
                    ))}
                  </div>
                ) : slots && slots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {slots.map((slot) => {
                      const availability = getSlotAvailability(slot);
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => handleSlotClick(slot.time)}
                          className={`h-[52px] rounded-xl text-sm font-bold flex flex-col items-center justify-center transition-all active:scale-[0.97] ${getSlotClassName(availability)}`}
                          data-ocid={`time-slot-${slot.time.replace(":", "")}`}
                        >
                          <span>{slot.time}</span>
                          <span className="text-[10px] opacity-80">
                            {t(`app:availability.${availability}`)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p
                    className="text-sm py-4 text-center rounded-xl text-muted-foreground bg-card border border-dashed border-border"
                    data-ocid="no-slots-message"
                  >
                    {t("app:search.noResults")}
                  </p>
                )}
              </section>

              {/* Experiences */}
              <section data-ocid="experiences-section">
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2 text-foreground">
                  <ChefHat className="h-4 w-4 text-[oklch(var(--status-orange))]" />
                  {t("app:restaurant.experiences")}
                </h2>
                <div
                  className="flex gap-3 overflow-x-auto pb-2"
                  style={{ scrollbarWidth: "none" }}
                >
                  {restaurantLoading
                    ? Array.from({ length: 3 }, (_, i) => (
                        <SkeletonExperienceCard key={`exp-skel-${i + 1}`} />
                      ))
                    : experiences.map((exp) => (
                        <ExperienceCard
                          key={exp.id}
                          experience={exp}
                          isSelected={filters.experienceId === exp.id}
                          onSelect={(id) => updateFilters({ experienceId: id })}
                        />
                      ))}
                </div>
              </section>

              {/* About / Opening hours */}
              <section
                className="rounded-2xl p-5 bg-card shadow-soft"
                data-ocid="opening-hours-section"
              >
                <h2 className="text-sm font-semibold mb-3 flex items-center gap-2 text-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  {t("app:restaurant.openingHours")}
                </h2>
                {openingHoursConfig ? (
                  <ul className="space-y-1.5">
                    {openingHoursByDay.map(({ dayIndex, isClosed, times }) => (
                      <li
                        key={dayIndex}
                        className="flex justify-between text-sm text-foreground"
                      >
                        <span className="font-medium">
                          {t(`app:${DAY_KEYS[dayIndex]}`)}
                        </span>
                        <span
                          className={
                            isClosed
                              ? "text-muted-foreground"
                              : "text-foreground"
                          }
                        >
                          {isClosed
                            ? t("app:restaurant.closed")
                            : times.join(" · ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-2">
                    {(["mon", "tue", "wed", "thu", "fri"] as const).map((d) => (
                      <Skeleton key={d} className="h-5 w-full rounded" />
                    ))}
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer
        className="py-5 px-4 flex flex-col items-center gap-2 border-t bg-card"
        data-ocid="guest-app-footer"
      >
        <p className="text-xs text-muted-foreground">
          {t("app:footer.poweredBy")}{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline text-primary"
          >
            caffeine.ai
          </a>{" "}
          · © {new Date().getFullYear()}
        </p>
        <LanguageSwitcher variant="footer" />
      </footer>
    </div>
  );
}
