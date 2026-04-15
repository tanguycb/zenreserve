import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  AVAILABLE_ZONES,
  type SeasonalPeriod,
  detectOverlap,
  useDeleteSeasonalPeriod,
  useSaveSeasonalPeriod,
  useSeasonalPeriods,
  useToggleSeasonalPeriod,
} from "@/hooks/useSeasonalAI";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Snowflake,
  Sun,
  Trash2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

const BLANK_FORM: Omit<SeasonalPeriod, "id"> = {
  name: "",
  dateFrom: "",
  dateTo: "",
  description: "",
  isActive: false,
  autoActivate: false,
  activatedZones: [],
  capacityOverride: null,
  serviceCapacities: {},
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("nl-BE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isCurrentlyActive(period: SeasonalPeriod): boolean {
  if (!period.isActive) return false;
  const now = Date.now();
  const from = new Date(period.dateFrom).getTime();
  const to = new Date(period.dateTo).getTime();
  return now >= from && now <= to;
}

function SeasonIcon({ zones }: { zones: string[] }) {
  if (zones.includes("terras") || zones.includes("rooftop"))
    return <Sun className="h-4 w-4 text-amber-400" />;
  return <Snowflake className="h-4 w-4 text-sky-400" />;
}

// ── SeasonForm ────────────────────────────────────────────────────────────────

interface SeasonFormProps {
  initial: Omit<SeasonalPeriod, "id">;
  existingPeriods: SeasonalPeriod[];
  editId?: string;
  onSave: (data: Omit<SeasonalPeriod, "id">) => void;
  onCancel: () => void;
}

const SERVICE_DEFAULTS = [
  { id: "lunch", label: "Lunch" },
  { id: "diner", label: "Diner" },
];

function SeasonForm({
  initial,
  existingPeriods,
  editId,
  onSave,
  onCancel,
}: SeasonFormProps) {
  const { t } = useTranslation("dashboard");
  const [form, setForm] = useState<Omit<SeasonalPeriod, "id">>(initial);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleZone = (zone: string) =>
    set(
      "activatedZones",
      form.activatedZones.includes(zone)
        ? form.activatedZones.filter((z) => z !== zone)
        : [...form.activatedZones, zone],
    );

  const handleSave = () => {
    if (!form.name.trim()) {
      setError(t("settings.seasonal.errorNameRequired"));
      return;
    }
    if (!form.dateFrom || !form.dateTo) {
      setError(t("settings.seasonal.errorDateRequired"));
      return;
    }
    if (new Date(form.dateFrom) >= new Date(form.dateTo)) {
      setError(t("settings.seasonal.errorDateOrder"));
      return;
    }
    const overlap = detectOverlap(existingPeriods, {
      dateFrom: form.dateFrom,
      dateTo: form.dateTo,
      id: editId,
    });
    if (overlap) {
      setError(t("settings.seasonal.errorOverlap", { name: overlap.name }));
      return;
    }
    setError(null);
    onSave(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-primary/30 bg-card shadow-elevated overflow-hidden"
      data-ocid="season-form"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-primary/5 flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          {form.name || t("settings.seasonal.newSeason")}
        </h3>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="season-name" className="text-sm font-medium">
            {t("settings.seasonal.name")}
          </Label>
          <Input
            id="season-name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder={t("settings.seasonal.namePlaceholder")}
            className="bg-background border-border"
            data-ocid="season-name-input"
          />
        </div>

        {/* Date range — visual calendar inputs */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("settings.seasonal.dateRange")}
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {t("settings.seasonal.dateFrom")}
              </span>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  id="season-from"
                  type="date"
                  value={form.dateFrom}
                  onChange={(e) => set("dateFrom", e.target.value)}
                  className="bg-background border-border pl-9"
                  data-ocid="season-date-from"
                />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {t("settings.seasonal.dateTo")}
              </span>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  id="season-to"
                  type="date"
                  value={form.dateTo}
                  min={form.dateFrom || undefined}
                  onChange={(e) => set("dateTo", e.target.value)}
                  className="bg-background border-border pl-9"
                  data-ocid="season-date-to"
                />
              </div>
            </div>
          </div>

          {/* Visual date range bar */}
          {form.dateFrom &&
            form.dateTo &&
            new Date(form.dateFrom) < new Date(form.dateTo) && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/15">
                <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                <span className="text-xs text-primary font-medium">
                  {formatDate(form.dateFrom)} → {formatDate(form.dateTo)}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {Math.ceil(
                    (new Date(form.dateTo).getTime() -
                      new Date(form.dateFrom).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}{" "}
                  {t("settings.seasonal.days")}
                </span>
              </div>
            )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="season-desc" className="text-sm font-medium">
            {t("settings.seasonal.description")}
            <span className="ml-1 text-xs text-muted-foreground font-normal">
              ({t("settings.seasonal.optional")})
            </span>
          </Label>
          <Input
            id="season-desc"
            value={form.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            placeholder={t("settings.seasonal.descriptionPlaceholder")}
            className="bg-background border-border"
            data-ocid="season-description-input"
          />
        </div>

        {/* Zone multi-select */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("settings.seasonal.activatedZones")}
          </Label>
          <p className="text-xs text-muted-foreground">
            {t("settings.seasonal.activatedZonesHint")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {AVAILABLE_ZONES.map((zone) => {
              const active = form.activatedZones.includes(zone);
              return (
                <button
                  key={zone}
                  type="button"
                  onClick={() => toggleZone(zone)}
                  data-ocid={`zone-toggle-${zone}`}
                  className={cn(
                    "px-3 py-2.5 rounded-xl text-xs font-medium border transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    "flex items-center gap-2",
                    active
                      ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
                      : "bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground",
                  )}
                  aria-pressed={active}
                >
                  <div
                    className={cn(
                      "h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                      active ? "bg-primary border-primary" : "border-border",
                    )}
                  >
                    {active && (
                      <Check className="h-2.5 w-2.5 text-primary-foreground" />
                    )}
                  </div>
                  <span className="capitalize">{zone}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Capacity override */}
        <div className="space-y-1.5">
          <Label htmlFor="capacity-override" className="text-sm font-medium">
            {t("settings.seasonal.capacityOverride")}
            <span className="ml-1 text-xs text-muted-foreground font-normal">
              ({t("settings.seasonal.optional")})
            </span>
          </Label>
          <p className="text-xs text-muted-foreground">
            {t("settings.seasonal.capacityOverrideHint")}
          </p>
          <div className="flex items-center gap-2">
            <Input
              id="capacity-override"
              type="number"
              min={0}
              max={1000}
              value={form.capacityOverride ?? ""}
              onChange={(e) =>
                set(
                  "capacityOverride",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              placeholder="—"
              className="bg-background border-border w-28"
              data-ocid="season-capacity-override"
            />
            <span className="text-sm text-muted-foreground">
              {t("settings.seasonal.guests")}
            </span>
          </div>
        </div>

        {/* Advanced: per-service capacity override */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="season-advanced-toggle"
          >
            {showAdvanced ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
            {t("settings.seasonal.perServiceCapacity")}
          </button>
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 pt-1">
                  {SERVICE_DEFAULTS.map((svc) => (
                    <div key={svc.id} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-20 shrink-0">
                        {svc.label}
                      </span>
                      <Input
                        type="number"
                        min={0}
                        max={500}
                        value={form.serviceCapacities?.[svc.id] ?? ""}
                        onChange={(e) =>
                          set("serviceCapacities", {
                            ...form.serviceCapacities,
                            [svc.id]:
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value),
                          })
                        }
                        placeholder="—"
                        className="bg-background border-border w-24 text-sm"
                        data-ocid={`season-service-cap-${svc.id}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {t("settings.seasonal.guests")}
                      </span>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground pt-1">
                    {t("settings.seasonal.perServiceCapacityHint")}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggles */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-4 py-2.5 px-4 rounded-xl border border-border bg-background">
            <div>
              <p className="text-sm font-medium text-foreground">
                {t("settings.seasonal.autoActivate")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("settings.seasonal.autoActivateHint")}
              </p>
            </div>
            <Switch
              checked={form.autoActivate}
              onCheckedChange={(v) => set("autoActivate", v)}
              data-ocid="season-auto-activate"
            />
          </div>
          <div className="flex items-center justify-between gap-4 py-2.5 px-4 rounded-xl border border-border bg-background">
            <div>
              <p className="text-sm font-medium text-foreground">
                {t("settings.seasonal.activeNow")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("settings.seasonal.activeNowHint")}
              </p>
            </div>
            <Switch
              checked={form.isActive}
              onCheckedChange={(v) => set("isActive", v)}
              data-ocid="season-active-toggle"
            />
          </div>
        </div>

        {/* Validation error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20"
            >
              <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
              <p className="text-xs text-destructive">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          data-ocid="season-form-cancel"
        >
          {t("settings.seasonal.cancel")}
        </Button>
        <Button type="button" onClick={handleSave} data-ocid="season-form-save">
          {t("settings.seasonal.save")}
        </Button>
      </div>
    </motion.div>
  );
}

// ── SeasonCard ────────────────────────────────────────────────────────────────

interface SeasonCardProps {
  period: SeasonalPeriod;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (active: boolean) => void;
}

function SeasonCard({ period, onEdit, onDelete, onToggle }: SeasonCardProps) {
  const { t } = useTranslation("dashboard");
  const live = isCurrentlyActive(period);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className={cn(
        "rounded-2xl border bg-card shadow-subtle overflow-hidden transition-colors duration-200",
        period.isActive
          ? "border-primary/30"
          : "border-border opacity-80 hover:opacity-100 hover:border-border/80",
      )}
      data-ocid={`season-card-${period.id}`}
    >
      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={cn(
              "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
              period.isActive ? "bg-primary/10" : "bg-muted",
            )}
          >
            <SeasonIcon zones={period.activatedZones} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {period.name}
              </h3>
              {live && (
                <span
                  className="seasonal-active-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                  data-ocid={`season-live-badge-${period.id}`}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  {t("settings.seasonal.statusLive")}
                </span>
              )}
              {!live && period.isActive && (
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-semibold px-2">
                  {t("settings.seasonal.statusActive")}
                </Badge>
              )}
              {!period.isActive && (
                <Badge
                  variant="outline"
                  className="text-muted-foreground text-[10px] font-medium px-2"
                >
                  {t("settings.seasonal.statusInactive")}
                </Badge>
              )}
              {period.autoActivate && (
                <Badge className="bg-sky-500/10 text-sky-400 border-sky-500/20 text-[10px] font-medium px-2 gap-1">
                  <Zap className="h-2.5 w-2.5" />
                  {t("settings.seasonal.autoLabel")}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              {formatDate(period.dateFrom)} → {formatDate(period.dateTo)}
            </p>
            {period.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {period.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Switch
            checked={period.isActive}
            onCheckedChange={onToggle}
            aria-label={t("settings.seasonal.toggleActive", {
              name: period.name,
            })}
            data-ocid={`season-toggle-${period.id}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onEdit}
            aria-label={t("settings.seasonal.editSeason", {
              name: period.name,
            })}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            data-ocid={`season-edit-${period.id}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onDelete}
            aria-label={t("settings.seasonal.deleteSeason", {
              name: period.name,
            })}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            data-ocid={`season-delete-${period.id}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Zones + capacity strip */}
      <div className="px-5 pb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <div className="flex flex-wrap gap-1.5">
          {period.activatedZones.length === 0 ? (
            <span className="text-xs text-muted-foreground italic">
              {t("settings.seasonal.noZones")}
            </span>
          ) : (
            period.activatedZones.map((z) => (
              <span
                key={z}
                className="px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground font-medium capitalize"
              >
                {z}
              </span>
            ))
          )}
        </div>
        <div className="ml-auto shrink-0 flex items-center gap-3">
          {period.capacityOverride !== null && (
            <span className="text-xs text-muted-foreground">
              {t("settings.seasonal.capacityLabel", {
                value: period.capacityOverride,
              })}
            </span>
          )}
          {period.serviceCapacities &&
            Object.keys(period.serviceCapacities).length > 0 && (
              <span className="text-xs text-muted-foreground">
                {Object.entries(period.serviceCapacities)
                  .filter(([, v]) => v !== undefined)
                  .map(([k, v]) => `${k}: ${String(v)}`)
                  .join(" · ")}
              </span>
            )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function SeasonalSettingsPage() {
  const { t } = useTranslation("dashboard");
  const { data: periods = [], isLoading } = useSeasonalPeriods();
  const saveMutation = useSaveSeasonalPeriod();
  const deleteMutation = useDeleteSeasonalPeriod();
  const toggleMutation = useToggleSeasonalPeriod();

  const [addingNew, setAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = (data: Omit<SeasonalPeriod, "id">) => {
    saveMutation.mutate(
      { data },
      {
        onSuccess: (saved) => {
          toast.success(
            t("settings.seasonal.toastAdded", { name: saved.name }),
          );
          setAddingNew(false);
        },
        onError: () => toast.error(t("settings.seasonal.toastSaveError")),
      },
    );
  };

  const handleEdit = (id: string, data: Omit<SeasonalPeriod, "id">) => {
    saveMutation.mutate(
      { data, id },
      {
        onSuccess: (saved) => {
          toast.success(
            t("settings.seasonal.toastUpdated", { name: saved.name }),
          );
          setEditingId(null);
        },
        onError: () => toast.error(t("settings.seasonal.toastSaveError")),
      },
    );
  };

  const handleDelete = (id: string, name: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () =>
        toast.success(t("settings.seasonal.toastDeleted", { name })),
      onError: () => toast.error(t("settings.seasonal.toastDeleteError")),
    });
  };

  const handleToggle = (id: string, active: boolean) => {
    toggleMutation.mutate(
      { id, active },
      {
        onSuccess: () =>
          toast.success(
            active
              ? t("settings.seasonal.toastActivated")
              : t("settings.seasonal.toastDeactivated"),
          ),
        onError: () => toast.error(t("settings.seasonal.toastSaveError")),
      },
    );
  };

  return (
    <div className="max-w-3xl space-y-8" data-ocid="seasonal-settings-page">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {t("settings.nav.seasonal")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("settings.seasonal.subtitle")}
            </p>
          </div>
        </div>

        {!addingNew && editingId === null && (
          <Button
            type="button"
            onClick={() => setAddingNew(true)}
            className="gap-2 shrink-0"
            data-ocid="add-season-btn"
          >
            <Plus className="h-4 w-4" />
            {t("settings.seasonal.addSeason")}
          </Button>
        )}
      </div>

      {/* Add form */}
      <AnimatePresence>
        {addingNew && (
          <SeasonForm
            initial={BLANK_FORM}
            existingPeriods={periods}
            onSave={handleAdd}
            onCancel={() => setAddingNew(false)}
          />
        )}
      </AnimatePresence>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {/* Seasons list */}
      {!isLoading && periods.length === 0 && !addingNew ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-dashed border-border bg-card/50 flex flex-col items-center justify-center py-16 px-6 text-center"
          data-ocid="seasonal-empty-state"
        >
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Sun className="h-7 w-7 text-primary/60" />
          </div>
          <h2 className="text-base font-semibold text-foreground mb-1">
            {t("settings.seasonal.emptyTitle")}
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs mb-5">
            {t("settings.seasonal.emptyHint")}
          </p>
          <Button
            type="button"
            onClick={() => setAddingNew(true)}
            className="gap-2"
            data-ocid="add-season-empty-btn"
          >
            <Plus className="h-4 w-4" />
            {t("settings.seasonal.addSeason")}
          </Button>
        </motion.div>
      ) : (
        !isLoading && (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {periods.map((period) =>
                editingId === period.id ? (
                  <SeasonForm
                    key={period.id}
                    editId={period.id}
                    initial={{
                      name: period.name,
                      dateFrom: period.dateFrom,
                      dateTo: period.dateTo,
                      description: period.description,
                      isActive: period.isActive,
                      autoActivate: period.autoActivate,
                      activatedZones: period.activatedZones,
                      capacityOverride: period.capacityOverride,
                      serviceCapacities: period.serviceCapacities ?? {},
                    }}
                    existingPeriods={periods}
                    onSave={(data) => handleEdit(period.id, data)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <SeasonCard
                    key={period.id}
                    period={period}
                    onEdit={() => setEditingId(period.id)}
                    onDelete={() => handleDelete(period.id, period.name)}
                    onToggle={(active) => handleToggle(period.id, active)}
                  />
                ),
              )}
            </AnimatePresence>
          </div>
        )
      )}

      {/* Info note */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/15">
        <CalendarDays className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          {t("settings.seasonal.infoNote")}
        </p>
      </div>
    </div>
  );
}
