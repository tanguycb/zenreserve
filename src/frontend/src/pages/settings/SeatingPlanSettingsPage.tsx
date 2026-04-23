import { FloorPlanCanvas } from "@/components/dashboard/FloorPlanCanvas";
import type { ZoneBoundary } from "@/components/dashboard/ZoneBoundaryEditor";
import { ZoneManagementModal } from "@/components/dashboard/ZoneManagementModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import type { AISeatingSuggestion } from "@/hooks/useSeasonalAI";
import {
  useRecordSuggestionFeedback,
  useSuggestTable,
} from "@/hooks/useSeasonalAI";
import type { Table, TableId } from "@/hooks/useSeatingPlan";
import {
  useCreateTable,
  useDeleteTable,
  useFloorState,
  useSyncTablesFromSettings,
  useUpdateTableCapacity,
} from "@/hooks/useSeatingPlan";
import {
  deriveZoneColor,
  useUpdateTableZone,
  useZones,
} from "@/hooks/useZones";
import { cn } from "@/lib/utils";
import {
  Brain,
  ImagePlus,
  Layers,
  Loader2,
  MapPin,
  Plus,
  Printer,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface AddTableForm {
  name: string;
  capacity: string;
  zone: string;
}

type LocalZones = Record<TableId, string>;

// ── AI Suggestion Modal (re-used from main page logic) ─────────────────────────
interface AISuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: Table[];
  onHighlight: (ids: Set<string>) => void;
  onSuggestionReady: (suggestion: AISeatingSuggestion) => void;
}

function AISuggestionModal({
  isOpen,
  onClose,
  tables,
  onHighlight,
  onSuggestionReady,
}: AISuggestionModalProps) {
  const { t } = useTranslation("dashboard");
  const { suggest, isLoading, error, reset } = useSuggestTable();
  const [partySize, setPartySize] = useState("2");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("19:00");
  const [preferences, setPreferences] = useState("");
  const [result, setResult] = useState<AISeatingSuggestion | null>(null);

  const handleClose = useCallback(() => {
    setResult(null);
    reset();
    onHighlight(new Set());
    onClose();
  }, [onClose, onHighlight, reset]);

  const handleSubmit = async () => {
    setResult(null);
    const size = Number.parseInt(partySize, 10);
    if (!size || size < 1) return;
    const tableContext = tables
      .map(
        (tbl) =>
          `id=${tbl.id} name=${tbl.name} capacity=${Number(tbl.capacity)} status=${tbl.status}`,
      )
      .join("; ");
    const sug = await suggest({
      partySize: size,
      date,
      time,
      zonePreference: preferences || undefined,
      tableContext: `Tables: [${tableContext}]. Preferences: ${preferences || "none"}.`,
    });
    if (sug) {
      setResult(sug);
      onHighlight(new Set(sug.suggestedTableIds));
    }
  };

  const handleAccept = () => {
    if (result) onSuggestionReady(result);
    onClose();
  };

  const suggestedTableNames = result?.suggestedTableIds
    .map((id) => tables.find((tbl) => tbl.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative w-full sm:max-w-lg bg-card rounded-t-3xl sm:rounded-2xl",
          "shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden",
          "animate-in fade-in slide-in-from-bottom-4 duration-300",
        )}
        data-ocid="ai-suggestion-modal"
      >
        <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-border shrink-0">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary/10 text-primary shrink-0">
            <Brain className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-foreground">
              {t("aiSuggestion.title")}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t("aiSuggestion.subtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label={t("actions.close", { ns: "shared" })}
            className="h-9 w-9 rounded-full flex items-center justify-center bg-muted/50 text-muted-foreground hover:bg-muted transition-colors shrink-0"
            data-ocid="ai-modal-close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="ai-party-size"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                {t("aiSuggestion.partySize")}
              </Label>
              <Input
                id="ai-party-size"
                type="number"
                min={1}
                max={30}
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
                className="h-11"
                disabled={isLoading}
                data-ocid="ai-party-size-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="ai-time"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                {t("aiSuggestion.time")}
              </Label>
              <Input
                id="ai-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-11"
                disabled={isLoading}
                data-ocid="ai-time-input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="ai-date"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              {t("aiSuggestion.date")}
            </Label>
            <Input
              id="ai-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11"
              disabled={isLoading}
              data-ocid="ai-date-input"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="ai-preferences"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              {t("aiSuggestion.preferences")}
            </Label>
            <textarea
              id="ai-preferences"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder={t("aiSuggestion.preferencesPlaceholder")}
              rows={2}
              disabled={isLoading}
              className="w-full rounded-lg border border-input bg-background text-foreground text-sm px-3 py-2.5 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors placeholder:text-muted-foreground/50 disabled:opacity-60"
              data-ocid="ai-preferences-input"
            />
          </div>

          {isLoading && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
              <p className="text-sm font-medium text-foreground">
                {t("aiSuggestion.analyzing")}
              </p>
            </div>
          )}

          {error && !isLoading && (
            <div
              className="p-4 rounded-xl bg-destructive/10 border border-destructive/30"
              data-ocid="ai-error-message"
            >
              <p className="text-sm font-medium text-destructive">
                {error === "timeout"
                  ? t("aiSuggestion.errorTimeout")
                  : t("aiSuggestion.errorGeneral")}
              </p>
            </div>
          )}

          {result && !isLoading && !error && (
            <div
              className="p-4 rounded-xl bg-primary/8 border border-primary/25"
              data-ocid="ai-suggestion-result"
            >
              <p className="text-sm font-semibold text-foreground mb-1">
                {result.suggestedTableIds.length > 0
                  ? t("aiSuggestion.suggested", {
                      tables:
                        suggestedTableNames ||
                        result.suggestedTableIds.join(", "),
                    })
                  : t("aiSuggestion.noSuggestion")}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.reasoning}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-border shrink-0">
          {result && !isLoading ? (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                data-ocid="ai-dismiss-btn"
              >
                {t("aiSuggestion.dismiss")}
              </Button>
              {result.suggestedTableIds.length > 0 && (
                <Button
                  className="flex-1"
                  onClick={handleAccept}
                  data-ocid="ai-accept-btn"
                >
                  {t("aiSuggestion.accept")}
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={isLoading}
              >
                {t("actions.cancel", { ns: "shared" })}
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={handleSubmit}
                disabled={isLoading || !partySize || !date || !time}
                data-ocid="ai-calculate-btn"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
                {isLoading
                  ? t("aiSuggestion.calculating")
                  : t("aiSuggestion.calculate")}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── SeatingPlan Settings Page (full editor) ───────────────────────────────────
export default function SeatingPlanSettingsPage() {
  const { t } = useTranslation(["dashboard", "shared"]);
  const isMobile = useIsMobile();

  const { data: floorState, isLoading } = useFloorState();
  const createTable = useCreateTable();
  const deleteTable = useDeleteTable();
  const updateTableCapacity = useUpdateTableCapacity();
  const updateTableZone = useUpdateTableZone();
  const syncTables = useSyncTablesFromSettings();
  const { recordFeedback } = useRecordSuggestionFeedback();

  const tables = floorState?.tables ?? [];

  // Zones
  const { data: zoneData = [] } = useZones();
  const zones = zoneData.map((z) => z.name);
  const zoneColorMap: Record<string, string> = Object.fromEntries(
    zoneData.map((z) => [z.name, z.color ?? deriveZoneColor(z.name)]),
  );

  const [activeZone, setActiveZone] = useState<string | undefined>(undefined);
  const [localZones, setLocalZones] = useState<LocalZones>({});
  const [showZoneModal, setShowZoneModal] = useState(false);

  // Zone boundary editor
  const [isZoneEditMode, setIsZoneEditMode] = useState(false);
  const [zoneBoundaries, setZoneBoundaries] = useState<ZoneBoundary[]>([]);
  const [isSavingZones, setIsSavingZones] = useState(false);

  const handleSaveZoneBoundaries = async () => {
    setIsSavingZones(true);
    try {
      const updates = tables.map((table) => ({
        tableId: table.id,
        zone: localZones[table.id] ?? null,
      }));
      await Promise.all(updates.map((u) => updateTableZone.mutateAsync(u)));
      setIsZoneEditMode(false);
      toast.success(t("seating.zones.saved"));
    } catch {
      toast.error(t("seating.zones.saveError"));
    } finally {
      setIsSavingZones(false);
    }
  };

  // Add table form — edit mode is always active in settings
  const isEditMode = true;
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<AddTableForm>({
    name: "",
    capacity: "4",
    zone: "",
  });
  const [formError, setFormError] = useState("");

  const handleAddTable = () => {
    if (!form.name.trim()) {
      setFormError(t("seatingPlan.tableNameRequired"));
      return;
    }
    const capacity = Number.parseInt(form.capacity, 10);
    if (!capacity || capacity < 1 || capacity > 20) {
      setFormError(t("seatingPlan.capacityRange"));
      return;
    }
    const usedPositions = new Set(
      tables.map((tbl) => `${Number(tbl.x)},${Number(tbl.y)}`),
    );
    let x = 60;
    let y = 60;
    while (usedPositions.has(`${x},${y}`)) {
      x += 160;
      if (x > 600) {
        x = 60;
        y += 180;
      }
    }
    createTable.mutate(
      { name: form.name.trim(), capacity, x, y },
      {
        onSuccess: () => {
          setShowAddForm(false);
          setForm({ name: "", capacity: "4", zone: zones[0] ?? "" });
          setFormError("");
        },
        onError: (err) => setFormError(err.message),
      },
    );
  };

  // Background image
  const [bgImage, setBgImage] = useState<string | undefined>(undefined);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBgImage(URL.createObjectURL(file));
    toast.success(t("seating.bgImageSet"));
  };

  // Undo
  const undoRef = useRef<(() => void) | null>(null);

  // AI
  const [showAIModal, setShowAIModal] = useState(false);
  const [highlightedTableIds, setHighlightedTableIds] = useState<Set<string>>(
    new Set(),
  );
  const [activeSuggestion, setActiveSuggestion] =
    useState<AISeatingSuggestion | null>(null);

  // Bulk
  const [selectedTableIds, setSelectedTableIds] = useState<Set<TableId>>(
    new Set(),
  );
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkZonePicker, setBulkZonePicker] = useState(false);
  const [bulkCapacityInput, setBulkCapacityInput] = useState("");
  const [bulkCapacityMode, setBulkCapacityMode] = useState(false);
  const [bulkConfirmDelete, setBulkConfirmDelete] = useState(false);
  const selectedCount = selectedTableIds.size;

  const clearBulkState = () => {
    setSelectedTableIds(new Set());
    setIsBulkMode(false);
    setBulkZonePicker(false);
    setBulkCapacityInput("");
    setBulkCapacityMode(false);
    setBulkConfirmDelete(false);
  };

  const handleBulkZoneApply = async (zone: string) => {
    const updates: LocalZones = { ...localZones };
    for (const id of selectedTableIds) updates[id] = zone;
    setLocalZones(updates);
    clearBulkState();
    try {
      await Promise.all(
        [...selectedTableIds].map((id) =>
          updateTableZone.mutateAsync({ tableId: id, zone }),
        ),
      );
      toast.success(t("seating.bulk.zoneApplied"));
    } catch {
      toast.error(t("seating.bulk.zoneApplyError"));
    }
  };

  const handleBulkDelete = () => {
    for (const id of selectedTableIds) deleteTable.mutate({ id });
    clearBulkState();
  };

  const handleBulkCapacityApply = () => {
    const cap = Number.parseInt(bulkCapacityInput, 10);
    if (!cap || cap < 1 || cap > 20) return;
    for (const id of selectedTableIds)
      updateTableCapacity.mutate({ id, capacity: cap });
    clearBulkState();
  };

  const handleSuggestionReady = useCallback((sug: AISeatingSuggestion) => {
    setActiveSuggestion(sug);
    setHighlightedTableIds(new Set(sug.suggestedTableIds));
  }, []);

  const handleAiAccept = useCallback(
    (suggestionId: string) => {
      recordFeedback(suggestionId, true);
      setActiveSuggestion(null);
      setHighlightedTableIds(new Set());
    },
    [recordFeedback],
  );

  const handleAiReject = useCallback(
    (suggestionId: string, reason?: string) => {
      recordFeedback(suggestionId, false, reason);
      setActiveSuggestion(null);
      setHighlightedTableIds(new Set());
    },
    [recordFeedback],
  );

  const tableZones: Record<string, string> = {};
  for (const tbl of tables) {
    const zone = (tbl as Table & { zone?: string }).zone;
    if (zone) tableZones[tbl.id] = zone;
    if (localZones[tbl.id]) tableZones[tbl.id] = localZones[tbl.id];
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="heading-h1" data-ocid="seating-settings-page-title">
          {t("seating.seatingSettings.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("seating.seatingSettings.subtitle", { count: tables.length })}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap print:hidden">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
          onClick={() => setShowAIModal(true)}
          data-ocid="seating-settings-ai-btn"
        >
          <Brain className="h-4 w-4" />
          {t("aiSuggestion.buttonLabel")}
        </Button>

        <button
          type="button"
          onClick={() => setShowZoneModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
          data-ocid="seating-settings-zones-btn"
        >
          <Layers className="h-4 w-4 text-muted-foreground" />
          {t("seating.zones.manage")}
        </button>

        {!isMobile && (
          <button
            type="button"
            onClick={() => setIsZoneEditMode((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors",
              isZoneEditMode
                ? "bg-accent/10 border-accent/40 text-accent hover:bg-accent/20"
                : "border-border bg-card text-muted-foreground hover:bg-muted/60",
            )}
            aria-pressed={isZoneEditMode}
            data-ocid="seating-settings-zone-boundary-toggle"
          >
            <MapPin className="h-4 w-4" />
            {isZoneEditMode
              ? t("seating.zones.editingActive")
              : t("seating.zones.editBoundaries")}
          </button>
        )}

        {isZoneEditMode && (
          <button
            type="button"
            onClick={handleSaveZoneBoundaries}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/40 bg-primary/10 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
            data-ocid="seating-settings-zone-boundary-save"
          >
            {isSavingZones ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSavingZones
              ? t("seating.zones.saving")
              : t("seating.zones.save")}
          </button>
        )}

        <button
          type="button"
          onClick={() => toast.info(t("seating.aiReshuffleComingSoon"))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
          data-ocid="seating-settings-ai-reshuffle-btn"
        >
          <Sparkles className="h-4 w-4" />
          {t("seating.aiReshuffle")}
        </button>

        <input
          ref={bgInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleBgUpload}
          aria-label={t("seating.uploadBg")}
        />
        <button
          type="button"
          onClick={() => bgInputRef.current?.click()}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors",
            bgImage
              ? "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
              : "border-border bg-card text-muted-foreground hover:bg-muted/60",
          )}
          data-ocid="seating-settings-upload-bg-btn"
        >
          <ImagePlus className="h-4 w-4" />
          {bgImage ? t("seating.changeBg") : t("seating.uploadBg")}
        </button>

        {bgImage && (
          <button
            type="button"
            onClick={() => setBgImage(undefined)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted/60 transition-colors"
            data-ocid="seating-settings-remove-bg-btn"
          >
            <X className="h-3.5 w-3.5" />
            {t("seating.removeBg")}
          </button>
        )}

        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted/60 transition-colors"
          data-ocid="seating-settings-print-btn"
        >
          <Printer className="h-4 w-4" />
          {t("seating.print")}
        </button>

        {!isMobile && isEditMode && (
          <button
            type="button"
            onClick={() => undoRef.current?.()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted/60 transition-colors"
            data-ocid="seating-settings-undo-btn"
            title="Ctrl+Z"
          >
            <RotateCcw className="h-4 w-4" />
            {t("seating.undo")}
          </button>
        )}

        <Button
          size="sm"
          className="gap-1.5 ml-auto"
          onClick={() => setShowAddForm((v) => !v)}
          data-ocid="seating-settings-add-table-btn"
        >
          <Plus className="h-4 w-4" />
          {t("seatingPlan.addTable")}
        </Button>
      </div>

      {/* Zone filter tabs */}
      {tables.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveZone(undefined)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150",
              !activeZone
                ? "bg-primary/10 text-primary border-primary/40"
                : "border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
            data-ocid="zone-filter-all"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
            {t("seating.zones.all")}
          </button>
          {zones.map((zone) => {
            const dotColor = zoneColorMap[zone] ?? "#94A3B8";
            const isActive = activeZone === zone;
            return (
              <button
                key={zone}
                type="button"
                onClick={() =>
                  setActiveZone(activeZone === zone ? undefined : zone)
                }
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150",
                  isActive
                    ? "bg-card text-foreground border-border/80"
                    : "border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
                style={
                  isActive
                    ? {
                        borderColor: `${dotColor}50`,
                        boxShadow: `0 0 8px ${dotColor}30`,
                      }
                    : {}
                }
                data-ocid={`zone-filter-${zone}`}
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{
                    background: dotColor,
                    boxShadow: isActive ? `0 0 5px ${dotColor}` : "none",
                  }}
                />
                {zone}
              </button>
            );
          })}
        </div>
      )}

      {/* Add table form */}
      {showAddForm && (
        <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-background p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              {t("seatingPlan.addTableTitle")}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                setShowAddForm(false);
                setFormError("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5 sm:col-span-1">
              <Label htmlFor="table-name">{t("seatingPlan.tableName")}</Label>
              <Input
                id="table-name"
                placeholder={t("seatingPlan.tableNamePlaceholder")}
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                data-ocid="seating-add-table-name"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="table-capacity">
                {t("seatingPlan.tableCapacity")}
              </Label>
              <Input
                id="table-capacity"
                type="number"
                min={1}
                max={20}
                value={form.capacity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, capacity: e.target.value }))
                }
                data-ocid="seating-add-table-capacity"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="table-zone">{t("seatingPlan.zone")}</Label>
              <select
                id="table-zone"
                value={form.zone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, zone: e.target.value }))
                }
                className="w-full h-10 rounded-lg border border-input bg-background text-foreground text-sm px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                data-ocid="seating-add-table-zone"
              >
                {zones.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {formError && <p className="text-xs text-destructive">{formError}</p>}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAddForm(false);
                setFormError("");
              }}
            >
              {t("actions.cancel", { ns: "shared" })}
            </Button>
            <Button
              size="sm"
              onClick={handleAddTable}
              disabled={createTable.isPending}
              data-ocid="seating-add-table-submit"
            >
              {createTable.isPending
                ? t("seatingPlan.adding")
                : t("seatingPlan.add")}
            </Button>
          </div>
        </div>
      )}

      {/* AI highlight banner */}
      {highlightedTableIds.size > 0 && (
        <div
          className="flex items-center gap-3 p-3 rounded-xl bg-primary/8 border border-primary/25"
          data-ocid="ai-highlight-banner"
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary animate-pulse shrink-0" />
          <p className="text-sm text-foreground flex-1">
            {t("aiSuggestion.highlightBanner", {
              count: highlightedTableIds.size,
              tables: [...highlightedTableIds]
                .map((id) => tables.find((tbl) => tbl.id === id)?.name)
                .filter(Boolean)
                .join(", "),
            })}
          </p>
          <button
            type="button"
            onClick={() => {
              setHighlightedTableIds(new Set());
              setActiveSuggestion(null);
            }}
            aria-label={t("actions.close", { ns: "shared" })}
            className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted/60 transition-colors shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Bulk action bar */}
      {isBulkMode && selectedCount > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md shadow-[0_-4px_20px_oklch(0_0_0/0.3)]"
          data-ocid="bulk-action-bar"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="max-w-5xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-foreground">
                {t("seating.bulk.selectedCount", { count: selectedCount })}
              </span>
              <button
                type="button"
                onClick={clearBulkState}
                className="h-8 w-8 rounded-full flex items-center justify-center bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                data-ocid="bulk-bar-close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {bulkCapacityMode && (
              <div className="flex items-center gap-2 mb-3 p-3 rounded-xl bg-muted/40 border border-border">
                <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                <Input
                  type="number"
                  min={1}
                  max={20}
                  placeholder="1–20"
                  value={bulkCapacityInput}
                  onChange={(e) => setBulkCapacityInput(e.target.value)}
                  className="h-9 flex-1 text-sm"
                  autoFocus
                  data-ocid="bulk-capacity-input"
                />
                <Button
                  size="sm"
                  onClick={handleBulkCapacityApply}
                  disabled={
                    !bulkCapacityInput ||
                    Number(bulkCapacityInput) < 1 ||
                    Number(bulkCapacityInput) > 20
                  }
                  data-ocid="bulk-capacity-apply"
                >
                  {t("seating.bulk.apply")}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setBulkCapacityMode(false);
                    setBulkCapacityInput("");
                  }}
                >
                  {t("actions.cancel", { ns: "shared" })}
                </Button>
              </div>
            )}

            {bulkZonePicker && (
              <div className="mb-3 p-3 rounded-xl bg-muted/40 border border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  {t("seating.bulk.chooseZone")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {zones.map((zone) => (
                    <button
                      key={zone}
                      type="button"
                      onClick={() => handleBulkZoneApply(zone)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-foreground hover:bg-primary/10 hover:border-primary transition-colors"
                      data-ocid={`bulk-zone-${zone}`}
                    >
                      <MapPin className="h-3 w-3" />
                      {zone}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setBulkZonePicker(false)}
                    className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted/60 transition-colors"
                  >
                    {t("actions.cancel", { ns: "shared" })}
                  </button>
                </div>
              </div>
            )}

            {bulkConfirmDelete && (
              <div className="mb-3 p-3 rounded-xl bg-destructive/10 border border-destructive/30">
                <p className="text-sm text-destructive font-medium mb-2">
                  {t("seating.bulk.confirmDelete", { count: selectedCount })}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={deleteTable.isPending}
                    data-ocid="bulk-delete-confirm"
                  >
                    {deleteTable.isPending
                      ? t("seatingPlan.deleting")
                      : t("seating.bulk.deleteSelected")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBulkConfirmDelete(false)}
                  >
                    {t("actions.cancel", { ns: "shared" })}
                  </Button>
                </div>
              </div>
            )}

            {!bulkZonePicker && !bulkCapacityMode && !bulkConfirmDelete && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setBulkZonePicker(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                  data-ocid="bulk-zone-btn"
                >
                  <MapPin className="h-4 w-4" />
                  {t("seating.bulk.changeZone")}
                </button>
                <button
                  type="button"
                  onClick={() => setBulkCapacityMode(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/30 text-secondary text-sm font-medium hover:bg-secondary/20 transition-colors"
                  data-ocid="bulk-capacity-btn"
                >
                  <Users className="h-4 w-4" />
                  {t("seating.bulk.setCapacity")}
                </button>
                <button
                  type="button"
                  onClick={() => setBulkConfirmDelete(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors"
                  data-ocid="bulk-delete-btn"
                >
                  <Trash2 className="h-4 w-4" />
                  {t("seating.bulk.deleteSelected")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && tables.length === 0 && (
        <div
          className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-6 py-8 flex flex-col items-center text-center gap-4"
          data-ocid="seating-settings-empty-state"
        >
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-sm font-semibold text-foreground">
              {t("seatingPlan.noTablesYet")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("seatingPlan.noTablesYetHint")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              onClick={() =>
                syncTables.mutate(undefined, {
                  onSuccess: () => toast.success(t("seatingPlan.syncSuccess")),
                  onError: (err) =>
                    toast.error(
                      err.message.includes("not yet available")
                        ? t("seatingPlan.syncNotAvailable")
                        : err.message,
                    ),
                })
              }
              disabled={syncTables.isPending}
              data-ocid="seating-settings-import-btn"
            >
              {syncTables.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {syncTables.isPending
                ? t("seatingPlan.syncing")
                : t("seatingPlan.importFromSettings")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowAddForm(true)}
              data-ocid="seating-settings-add-empty-btn"
            >
              <Plus className="h-4 w-4" />
              {t("seatingPlan.addTable")}
            </Button>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <Skeleton className="w-full rounded-2xl" style={{ minHeight: 580 }} />
      )}

      {/* Canvas */}
      {!isLoading && tables.length > 0 && (
        <FloorPlanCanvas
          tables={tables}
          isEditMode={isEditMode}
          onTableClick={() => {}}
          selectedTableIds={selectedTableIds}
          onSelectionChange={setSelectedTableIds}
          isBulkMode={isBulkMode}
          onBulkModeChange={(active) => {
            setIsBulkMode(active);
            if (!active) setSelectedTableIds(new Set());
          }}
          highlightedTableIds={highlightedTableIds}
          aiSuggestion={activeSuggestion}
          onAiAccept={handleAiAccept}
          onAiReject={handleAiReject}
          bgImage={bgImage}
          activeZone={activeZone}
          tableZones={tableZones}
          undoRef={undoRef}
          zoneBoundaries={zoneBoundaries}
          onZoneBoundariesChange={setZoneBoundaries}
          isZoneEditMode={isZoneEditMode}
          zonesForBoundaries={zones}
          zoneColors={zoneColorMap}
        />
      )}

      {/* Modals */}
      <ZoneManagementModal
        isOpen={showZoneModal}
        onClose={() => setShowZoneModal(false)}
        zones={zones}
        zoneColors={zoneColorMap}
        onZonesChange={() => {}}
      />
      <AISuggestionModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        tables={tables}
        onHighlight={setHighlightedTableIds}
        onSuggestionReady={handleSuggestionReady}
      />
    </div>
  );
}
