import type { Experience, Restaurant } from "@/types";
import { MapPin, Star, UtensilsCrossed } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onBookNow: () => void;
}

export function RestaurantCard({ restaurant, onBookNow }: RestaurantCardProps) {
  const { t } = useTranslation("app");

  const filled = Math.floor(4.8);
  const stars = Array.from({ length: 5 }, (_, i) => ({
    id: `star-${i + 1}`,
    active: i < filled,
  }));

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(31,41,55,0.10)",
      }}
    >
      {/* Hero image */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 240, backgroundColor: "#F3E8D6" }}
      >
        {restaurant.coverUrl ? (
          <img
            src={restaurant.coverUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            loading="eager"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, #FAF7F0 0%, #F3E8D6 50%, #D97706 100%)",
            }}
          >
            <UtensilsCrossed
              className="h-16 w-16 opacity-30"
              style={{ color: "#D97706" }}
            />
          </div>
        )}
        {/* Cuisine badge */}
        {restaurant.cuisine && (
          <span
            className="absolute bottom-3 left-3 px-3 py-1 text-xs font-semibold rounded-full"
            style={{
              backgroundColor: "rgba(255,255,255,0.92)",
              color: "#D97706",
              backdropFilter: "blur(4px)",
            }}
          >
            {restaurant.cuisine}
          </span>
        )}
        {/* Price range */}
        {restaurant.priceRange && (
          <span
            className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full"
            style={{
              backgroundColor: "rgba(34,197,94,0.92)",
              color: "#FFFFFF",
              backdropFilter: "blur(4px)",
            }}
          >
            {restaurant.priceRange}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pt-4 pb-5" style={{ backgroundColor: "#FAF7F0" }}>
        {/* Name + stars */}
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h1
            className="font-bold leading-tight"
            style={{ fontSize: 22, color: "#1F2937" }}
          >
            {restaurant.name}
          </h1>
          <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
            {stars.map(({ id, active }) => (
              <Star
                key={id}
                className="h-4 w-4"
                style={{
                  fill: active ? "#D97706" : "transparent",
                  color: "#D97706",
                  strokeWidth: 1.5,
                }}
              />
            ))}
            <span
              className="text-xs font-semibold ml-1"
              style={{ color: "#D97706" }}
            >
              4.8
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-3">
          <MapPin
            className="h-3.5 w-3.5 flex-shrink-0"
            style={{ color: "#9CA3AF" }}
          />
          <span className="text-sm truncate" style={{ color: "#6B7280" }}>
            {restaurant.address}
          </span>
        </div>

        {/* Description */}
        {restaurant.description && (
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "#4B5563" }}
          >
            {restaurant.description}
          </p>
        )}

        {/* CTA button */}
        <button
          type="button"
          onClick={onBookNow}
          className="w-full font-bold rounded-xl transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
          style={{
            height: 48,
            backgroundColor: "#22C55E",
            color: "#FFFFFF",
            fontSize: 15,
          }}
          data-ocid="restaurant-book-now-btn"
        >
          <UtensilsCrossed className="h-4 w-4" />
          {t("restaurant.bookNow")}
        </button>
      </div>
    </div>
  );
}

// ── Experience card ───────────────────────────────────────────────────────────
interface ExperienceCardProps {
  experience: Experience;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ExperienceCard({
  experience,
  isSelected,
  onSelect,
}: ExperienceCardProps) {
  const tagColors: Record<string, string> = {
    menu: "#3B82F6",
    event: "#D97706",
    special: "#22C55E",
  };
  const tagColor = experience.tag ? tagColors[experience.tag] : "#3B82F6";

  return (
    <button
      type="button"
      onClick={() => onSelect(experience.id)}
      className="flex-shrink-0 text-left transition-all active:scale-[0.97]"
      style={{
        width: 200,
        backgroundColor: isSelected ? "#22C55E0D" : "#FFFFFF",
        border: `2px solid ${isSelected ? "#22C55E" : "#E2E8F0"}`,
        borderRadius: 12,
        padding: "14px 14px",
        cursor: "pointer",
      }}
      data-ocid={`experience-card-${experience.id}`}
    >
      {experience.tag && (
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mb-2"
          style={{ backgroundColor: `${tagColor}1A`, color: tagColor }}
        >
          {experience.tag}
        </span>
      )}
      <p
        className="font-semibold text-sm leading-snug mb-1"
        style={{ color: "#1F2937" }}
      >
        {experience.name}
      </p>
      <p
        className="text-xs leading-snug mb-2 line-clamp-2"
        style={{ color: "#6B7280" }}
      >
        {experience.description}
      </p>
      <p className="font-bold text-sm" style={{ color: "#22C55E" }}>
        €{(experience.price / 100).toFixed(0)} p.p.
      </p>
    </button>
  );
}
