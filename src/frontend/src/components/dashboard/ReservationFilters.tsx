import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReservationStatus } from "@/types";
import { Search, X } from "lucide-react";

export interface ActiveFilters {
  date: string;
  status: ReservationStatus | "all";
  search: string;
  service: string;
}

interface ReservationFiltersProps {
  filters: ActiveFilters;
  onChange: (filters: ActiveFilters) => void;
}

const STATUS_OPTIONS: Array<{
  label: string;
  value: ReservationStatus | "all";
}> = [
  { label: "Alle statussen", value: "all" },
  { label: "Bevestigd", value: "confirmed" },
  { label: "Niet aangekomen", value: "not_arrived" as ReservationStatus },
  { label: "Te laat", value: "late" as ReservationStatus },
  { label: "Zit aan tafel", value: "seated" },
  { label: "Vertrokken", value: "departed" as ReservationStatus },
  { label: "Wachtlijst", value: "waitlist" },
  { label: "Geannuleerd", value: "cancelled" },
  { label: "Voltooid", value: "completed" },
];

const SERVICE_OPTIONS = [
  { label: "Alle services", value: "all" },
  { label: "Lunch (12:00–15:00)", value: "lunch" },
  { label: "Diner (17:00–21:00)", value: "dinner" },
  { label: "Laat diner (21:00–23:00)", value: "late_dinner" },
];

const STATUS_LABELS: Record<ReservationStatus | "all", string> = {
  all: "Alle",
  confirmed: "Bevestigd",
  pending: "In behandeling",
  waitlist: "Wachtlijst",
  cancelled: "Geannuleerd",
  completed: "Voltooid",
  seated: "Zit aan tafel",
  no_show: "Niet verschenen",
  not_arrived: "Niet aangekomen",
  late: "Te laat",
  departed: "Vertrokken",
} as Record<ReservationStatus | "all", string>;

export function ReservationFilters({
  filters,
  onChange,
}: ReservationFiltersProps) {
  const hasActiveFilters =
    filters.date !== "" ||
    filters.status !== "all" ||
    filters.search !== "" ||
    filters.service !== "all";

  function clear() {
    onChange({ date: "", status: "all", search: "", service: "all" });
  }

  const activeChips: Array<{ key: string; label: string }> = [];
  if (filters.date)
    activeChips.push({ key: "date", label: `📅 ${filters.date}` });
  if (filters.status !== "all")
    activeChips.push({
      key: "status",
      label: STATUS_LABELS[filters.status] ?? filters.status,
    });
  if (filters.search)
    activeChips.push({ key: "search", label: `"${filters.search}"` });
  if (filters.service !== "all")
    activeChips.push({
      key: "service",
      label:
        SERVICE_OPTIONS.find((s) => s.value === filters.service)?.label ??
        filters.service,
    });

  return (
    <div className="space-y-2" aria-label="Reserveringen filteren">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="filter-search"
            type="search"
            placeholder="Zoek gast…"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            data-ocid="filter-search"
            aria-label="Zoek op gastnaam"
          />
        </div>

        {/* Service dropdown */}
        <Select
          value={filters.service}
          onValueChange={(val) => onChange({ ...filters, service: val })}
        >
          <SelectTrigger
            className="w-[160px] h-8 text-xs bg-background border-border text-foreground"
            data-ocid="filter-service"
            aria-label="Filter op service"
          >
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            {SERVICE_OPTIONS.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="text-foreground focus:bg-muted text-xs"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status dropdown */}
        <Select
          value={filters.status}
          onValueChange={(val) =>
            onChange({ ...filters, status: val as ReservationStatus | "all" })
          }
        >
          <SelectTrigger
            className="w-[160px] h-8 text-xs bg-background border-border text-foreground"
            data-ocid="filter-status"
            aria-label="Filter op status"
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="text-foreground focus:bg-muted text-xs"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date picker */}
        <input
          type="date"
          value={filters.date}
          onChange={(e) => onChange({ ...filters, date: e.target.value })}
          className="h-8 px-2 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          data-ocid="filter-date"
          aria-label="Filter op datum"
        />

        {/* Clear */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1"
            data-ocid="filter-clear"
            aria-label="Filters wissen"
          >
            <X className="h-3 w-3" />
            Wissen
          </Button>
        )}
      </div>

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Actieve filters">
          {activeChips.map((chip) => (
            <li
              key={chip.key}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
            >
              {chip.label}
              <button
                type="button"
                aria-label={`Verwijder filter ${chip.label}`}
                onClick={() => {
                  if (chip.key === "date") onChange({ ...filters, date: "" });
                  else if (chip.key === "status")
                    onChange({ ...filters, status: "all" });
                  else if (chip.key === "service")
                    onChange({ ...filters, service: "all" });
                  else onChange({ ...filters, search: "" });
                }}
                className="ml-0.5 rounded-full hover:bg-primary/20 transition-colors p-0.5"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
