import { SkeletonCard } from "@/components/SkeletonCard";
import { GuestCard } from "@/components/dashboard/GuestCard";
import { GuestDetailModal } from "@/components/dashboard/GuestDetailModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGuests, useUpdateGuest } from "@/hooks/useDashboard";
import type { Guest } from "@/types";
import { LayoutGrid, List, Search, Star, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const SKELETON_KEYS = ["gs1", "gs2", "gs3", "gs4", "gs5", "gs6"];

type ViewMode = "grid" | "list";

function getTagStyle(tag: string): string {
  const lower = tag.toLowerCase();
  if (lower === "vip")
    return "bg-[oklch(var(--status-orange)/0.15)] text-[oklch(var(--status-orange))] border-[oklch(var(--status-orange)/0.25)]";
  if (lower === "allergieën")
    return "bg-destructive/15 text-destructive border-destructive/25";
  if (lower === "verjaardag")
    return "bg-[oklch(var(--status-blue)/0.15)] text-[oklch(var(--status-blue))] border-[oklch(var(--status-blue)/0.25)]";
  if (lower === "stamgast")
    return "bg-primary/15 text-primary border-primary/25";
  return "bg-muted text-muted-foreground border-border";
}

export default function GuestsPage() {
  const { t } = useTranslation(["dashboard"]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: guests, isLoading } = useGuests();
  const { mutate: updateGuest, isPending: isSaving } = useUpdateGuest();

  const filtered = (guests ?? []).filter((g) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      g.firstName.toLowerCase().includes(q) ||
      g.lastName.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q) ||
      g.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const handleOpenGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setModalOpen(true);
  };

  const handleSaveGuest = (data: Partial<Guest> & { id: string }) => {
    updateGuest(data, {
      onSuccess: () => toast.success(t("dashboard:guests.updated")),
      onError: () => toast.error(t("dashboard:guests.updateError")),
    });
  };

  const vipCount = (guests ?? []).filter((g) => g.vip).length;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-display text-foreground">
            {t("dashboard:guests.title")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t("dashboard:guests.count", { count: (guests ?? []).length })}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {vipCount > 0 && (
            <Badge className="bg-[oklch(var(--status-orange)/0.15)] text-[oklch(var(--status-orange))] border border-[oklch(var(--status-orange)/0.25)] px-3 py-1.5">
              <Star className="h-3.5 w-3.5 mr-1.5" fill="currentColor" />
              {vipCount} {t("dashboard:guests.vip")}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-dashed border-muted-foreground/30 text-muted-foreground"
            onClick={() => toast.info(t("dashboard:guests.addGuestSoon"))}
            data-ocid="add-guest-btn"
          >
            <UserPlus className="h-4 w-4" />
            {t("dashboard:guests.addGuest")}
          </Button>
        </div>
      </div>

      {/* Search + view toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("dashboard:guests.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/20 border-border"
            aria-label={t("dashboard:guests.searchPlaceholder")}
            data-ocid="guests-search"
          />
        </div>
        <div
          className="flex items-center border border-border rounded-lg overflow-hidden"
          role="toolbar"
          aria-label={t("dashboard:guests.viewToggle")}
        >
          <button
            type="button"
            className={`px-3 py-2 flex items-center gap-1.5 text-xs font-medium transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/40"}`}
            onClick={() => setViewMode("grid")}
            aria-pressed={viewMode === "grid"}
            data-ocid="view-grid-btn"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            {t("dashboard:guests.viewGrid")}
          </button>
          <button
            type="button"
            className={`px-3 py-2 flex items-center gap-1.5 text-xs font-medium transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/40"}`}
            onClick={() => setViewMode("list")}
            aria-pressed={viewMode === "list"}
            data-ocid="view-list-btn"
          >
            <List className="h-3.5 w-3.5" />
            {t("dashboard:guests.viewList")}
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {SKELETON_KEYS.map((k) => (
            <SkeletonCard key={k} showAvatar lines={2} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 text-center"
          data-ocid="empty-guests"
        >
          <Users className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="font-semibold text-foreground">
            {t("dashboard:guests.empty")}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {t("dashboard:guests.emptyHint")}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((guest) => (
            <GuestCard key={guest.id} guest={guest} onClick={handleOpenGuest} />
          ))}
        </div>
      ) : (
        /* List view table */
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-soft">
          <table
            className="w-full text-sm"
            aria-label={t("dashboard:guests.title")}
          >
            <thead>
              <tr className="border-b border-border bg-muted/20">
                {[
                  t("dashboard:guests.columns.name"),
                  t("dashboard:guests.columns.email"),
                  t("dashboard:guests.columns.phone"),
                  t("dashboard:guests.columns.visits"),
                  t("dashboard:guests.columns.tags"),
                  t("dashboard:guests.columns.lastVisit"),
                ].map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((guest) => (
                <tr
                  key={guest.id}
                  className="hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => handleOpenGuest(guest)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      handleOpenGuest(guest);
                  }}
                  tabIndex={0}
                  aria-label={t("dashboard:guests.guestRow", {
                    name: `${guest.firstName} ${guest.lastName}`,
                  })}
                  data-ocid="guest-list-row"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {guest.vip && (
                        <Star
                          className="h-3.5 w-3.5 text-[oklch(var(--status-orange))] shrink-0"
                          fill="currentColor"
                        />
                      )}
                      <span className="font-medium text-foreground">
                        {guest.firstName} {guest.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground truncate max-w-[160px]">
                    {guest.email}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {guest.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-foreground tabular-nums">
                    {guest.visitCount}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {guest.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className={`text-xs px-1.5 py-0 border ${getTagStyle(tag)}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                      {guest.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{guest.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {guest.lastVisit
                      ? new Date(guest.lastVisit).toLocaleDateString(
                          undefined,
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Guest detail modal */}
      <GuestDetailModal
        guest={selectedGuest}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveGuest}
        isSaving={isSaving}
      />
    </div>
  );
}
