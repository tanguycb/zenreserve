import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ExperienceCard, RestaurantCard } from "@/components/RestaurantCard";
import {
  useRestaurantAvailability,
  useRestaurantConfig,
  useSearchFilters,
} from "@/hooks/useRestaurantSearch";
import type { TimeSlot } from "@/types";
import { CalendarDays, ChefHat, ChevronLeft, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import WidgetPage from "./WidgetPage";

// ── Skeleton components ───────────────────────────────────────────────────────
function SkeletonRestaurantCard() {
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(31,41,55,0.10)",
      }}
    >
      <div
        className="w-full animate-pulse"
        style={{ height: 240, backgroundColor: "#F3F4F6" }}
      />
      <div className="px-5 pt-4 pb-5" style={{ backgroundColor: "#FAF7F0" }}>
        <div
          className="h-6 rounded-lg mb-2 animate-pulse"
          style={{ backgroundColor: "#E5E7EB", width: "60%" }}
        />
        <div
          className="h-4 rounded mb-3 animate-pulse"
          style={{ backgroundColor: "#E5E7EB", width: "40%" }}
        />
        <div
          className="h-3 rounded mb-1 animate-pulse"
          style={{ backgroundColor: "#E5E7EB" }}
        />
        <div
          className="h-3 rounded mb-4 animate-pulse"
          style={{ backgroundColor: "#E5E7EB", width: "80%" }}
        />
        <div
          className="h-12 rounded-xl animate-pulse"
          style={{ backgroundColor: "#E5E7EB" }}
        />
      </div>
    </div>
  );
}

function SkeletonSlot() {
  return (
    <div
      className="animate-pulse rounded-xl"
      style={{ height: 52, backgroundColor: "#E5E7EB", minWidth: 80 }}
    />
  );
}

function SkeletonExperienceCard() {
  return (
    <div
      className="flex-shrink-0 animate-pulse rounded-xl"
      style={{ width: 200, height: 130, backgroundColor: "#E5E7EB" }}
    />
  );
}

// ── Slot availability coloring ────────────────────────────────────────────────
function getSlotStyle(slot: TimeSlot): {
  bg: string;
  border: string;
  text: string;
  label: string;
} {
  if (!slot.available) {
    return {
      bg: "#F9FAFB",
      border: "#E2E8F0",
      text: "#9CA3AF",
      label: "vol",
    };
  }
  const ratio = slot.booked / slot.capacity;
  if (ratio >= 0.75) {
    return {
      bg: "#FFF7ED",
      border: "#D97706",
      text: "#D97706",
      label: "beperkt",
    };
  }
  return { bg: "#F0FDF4", border: "#22C55E", text: "#22C55E", label: "vrij" };
}

interface SelectedSlot {
  date: string;
  time: string;
  partySize: number;
}

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
    // Open widget inline from step 1 with no pre-fill
    setSelectedSlot({
      date: filters.date,
      time: "",
      partySize: filters.guests,
    });
  }

  const showSlots = !!filters.date && filters.guests > 0;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#FAF7F0", fontFamily: "Inter, sans-serif" }}
    >
      {/* Skip nav */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:rounded-md focus:font-medium"
        style={{ backgroundColor: "#22C55E", color: "#FFFFFF" }}
      >
        {t("shared:accessibility.skipToContent")}
      </a>

      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#E2E8F0",
          boxShadow: "0 1px 8px rgba(31,41,55,0.07)",
        }}
        data-ocid="guest-app-header"
      >
        <a
          href="/app"
          className="flex items-center gap-2 no-underline transition-opacity hover:opacity-80"
        >
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#22C55E1A" }}
          >
            <ChefHat className="h-4 w-4" style={{ color: "#22C55E" }} />
          </div>
          <span
            className="font-bold text-base"
            style={{ color: "#1F2937", letterSpacing: "-0.01em" }}
          >
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
                className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70 self-start"
                style={{ color: "#6B7280" }}
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
                <h1
                  className="font-bold mb-1"
                  style={{ fontSize: 28, color: "#1F2937", lineHeight: 1.25 }}
                >
                  {t("app:search.title")}
                </h1>
                <p className="text-sm" style={{ color: "#6B7280" }}>
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
                className="rounded-2xl p-4 flex flex-col sm:flex-row gap-3"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 2px 12px rgba(31,41,55,0.08)",
                }}
                data-ocid="search-bar"
              >
                {/* Date picker */}
                <label className="flex-1 flex flex-col gap-1">
                  <span
                    className="text-xs font-semibold flex items-center gap-1"
                    style={{ color: "#6B7280" }}
                  >
                    <CalendarDays className="h-3.5 w-3.5" />
                    {t("app:booking.selectedDate")}
                  </span>
                  <input
                    type="date"
                    value={filters.date}
                    min={today}
                    onChange={(e) => updateFilters({ date: e.target.value })}
                    className="rounded-lg border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2"
                    style={{
                      borderColor: "#E2E8F0",
                      color: "#1F2937",
                      backgroundColor: "#FAF7F0",
                      height: 44,
                    }}
                    data-ocid="search-date-input"
                  />
                </label>

                {/* Party size */}
                <label
                  className="flex flex-col gap-1"
                  style={{ minWidth: 120 }}
                >
                  <span
                    className="text-xs font-semibold flex items-center gap-1"
                    style={{ color: "#6B7280" }}
                  >
                    <Users className="h-3.5 w-3.5" />
                    {t("app:search.guestsLabel")}
                  </span>
                  <select
                    value={filters.guests}
                    onChange={(e) =>
                      updateFilters({ guests: Number(e.target.value) })
                    }
                    className="rounded-lg border px-3 text-sm font-medium focus:outline-none focus:ring-2"
                    style={{
                      borderColor: "#E2E8F0",
                      color: "#1F2937",
                      backgroundColor: "#FAF7F0",
                      height: 44,
                    }}
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
                  className="rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-[0.97] flex items-center justify-center self-end"
                  style={{
                    height: 48,
                    minWidth: 100,
                    backgroundColor: "#22C55E",
                    color: "#FFFFFF",
                    paddingLeft: 20,
                    paddingRight: 20,
                  }}
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
                <h2
                  className="font-semibold mb-3 flex items-center gap-2"
                  style={{ fontSize: 16, color: "#1F2937" }}
                >
                  <CalendarDays
                    className="h-4 w-4"
                    style={{ color: "#22C55E" }}
                  />
                  {t("app:restaurant.availability")}
                </h2>

                {!showSlots ? (
                  <p
                    className="text-sm py-4 text-center rounded-xl"
                    style={{
                      color: "#9CA3AF",
                      backgroundColor: "#FFFFFF",
                      border: "1px dashed #E2E8F0",
                    }}
                  >
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
                      const style = getSlotStyle(slot);
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => handleSlotClick(slot.time)}
                          className="rounded-xl text-sm font-bold flex flex-col items-center justify-center transition-all hover:opacity-90 active:scale-[0.97] disabled:cursor-not-allowed"
                          style={{
                            height: 52,
                            backgroundColor: style.bg,
                            border: `1.5px solid ${style.border}`,
                            color: style.text,
                          }}
                          data-ocid={`time-slot-${slot.time.replace(":", "")}`}
                        >
                          <span>{slot.time}</span>
                          <span style={{ fontSize: 10, opacity: 0.8 }}>
                            {style.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p
                    className="text-sm py-4 text-center rounded-xl"
                    style={{
                      color: "#9CA3AF",
                      backgroundColor: "#FFFFFF",
                      border: "1px dashed #E2E8F0",
                    }}
                    data-ocid="no-slots-message"
                  >
                    {t("app:search.noResults")}
                  </p>
                )}
              </section>

              {/* Experiences */}
              <section data-ocid="experiences-section">
                <h2
                  className="font-semibold mb-3 flex items-center gap-2"
                  style={{ fontSize: 16, color: "#1F2937" }}
                >
                  <ChefHat className="h-4 w-4" style={{ color: "#D97706" }} />
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
                className="rounded-2xl p-5"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 2px 12px rgba(31,41,55,0.06)",
                }}
                data-ocid="opening-hours-section"
              >
                <h2
                  className="font-semibold mb-3"
                  style={{ fontSize: 15, color: "#1F2937" }}
                >
                  {t("app:restaurant.openingHours")}
                </h2>
                {restaurant?.openingHours && (
                  <ul className="space-y-1.5">
                    {Object.entries(restaurant.openingHours).map(
                      ([day, hours]) => (
                        <li
                          key={day}
                          className="flex justify-between text-sm"
                          style={{ color: "#4B5563" }}
                        >
                          <span className="font-medium capitalize">{day}</span>
                          <span>
                            {hours.open} – {hours.close}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer
        className="py-5 px-4 flex flex-col items-center gap-2 border-t"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
        data-ocid="guest-app-footer"
      >
        <p className="text-xs" style={{ color: "#9CA3AF" }}>
          Aangedreven door{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
            style={{ color: "#22C55E" }}
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
