import { createActor } from "@/backend";
import { FloorPlanCanvas } from "@/components/dashboard/FloorPlanCanvas";
import { TableDetailModal } from "@/components/dashboard/TableDetailModal";
import { TableListView } from "@/components/dashboard/TableListView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  type AISeatingSuggestion,
  useRecordSuggestionFeedback,
  useSuggestTable,
} from "@/hooks/useSeasonalAI";
import type { Table, TableId } from "@/hooks/useSeatingPlan";
import {
  useCreateTable,
  useDeleteTable,
  useFloorState,
} from "@/hooks/useSeatingPlan";
import { cn } from "@/lib/utils";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  Eye,
  ImagePlus,
  Layers,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Printer,
  RotateCcw,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const SKELETON_KEYS = ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4"];
const DEFAULT_ZONES = ["Binnen", "Terras", "Bar", "Privézaal", "Rooftop"];

interface AddTableForm {
  name: string;
  capacity: string;
  zone: string;
}

type LocalZones = Record<TableId, string>;

// ── Zone Management Modal ──────────────────────────────────────────────────────
interface ZoneManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  zones: string[];
  onZonesChange: (zones: string[]) => void;
}

function ZoneManagementModal({
  isOpen,
  onClose,
  zones,
  onZonesChange,
}: ZoneManagementModalProps) {
  const { t } = useTranslation("dashboard");
  const [newZone, setNewZone] = useState("");

  if (!isOpen) return null;

  const handleAdd = () => {
    const trimmed = newZone.trim();
    if (!trimmed || zones.includes(trimmed)) return;
    onZonesChange([...zones, trimmed]);
    setNewZone("");
  };

  const handleDelete = (zone: string) => {
    onZonesChange(zones.filter((z) => z !== zone));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-50 w-full max-w-sm rounded-2xl border border-border bg-gradient-to-br from-card to-background shadow-elevated p-0 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Layers className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-base font-semibold text-foreground">
              {t("seating.zones.manageTitle")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted/60 transition-colors"
            aria-label={t("actions.close", { ns: "shared" })}
            data-ocid="zone-modal-close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Zone list */}
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            {zones.map((zone) => (
              <div
                key={zone}
                className="flex items-center justify-between rounded-xl bg-muted/30 border border-border px-4 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {zone}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(zone)}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label={`${zone} verwijderen`}
                  data-ocid={`zone-delete-${zone}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add zone */}
          <div className="flex gap-2">
            <Input
              placeholder={t("seating.zones.newZonePlaceholder")}
              value={newZone}
              onChange={(e) => setNewZone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1 h-10"
              data-ocid="zone-new-input"
            />
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!newZone.trim()}
              data-ocid="zone-add-btn"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="px-5 pb-5">
          <Button
            className="w-full"
            onClick={onClose}
            data-ocid="zone-modal-save"
          >
            {t("actions.save", { ns: "shared" })}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── AI Suggestion Modal ───────────────────────────────────────────────────────
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
  useActor(createActor);

  const { suggest, isLoading, error, reset } = useSuggestTable();
  const [partySize, setPartySize] = useState("2");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("19:00");
  const [preferences, setPreferences] = useState("");
  const [result, setResult] = useState<AISeatingSuggestion | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
          "shadow-[0_-4px_40px_rgba(0,0,0,0.4)] sm:shadow-2xl",
          "flex flex-col max-h-[92dvh] overflow-hidden",
          "animate-in fade-in slide-in-from-bottom-4 duration-300",
        )}
        data-ocid="ai-suggestion-modal"
      >
        <div className="flex justify-center pt-3 pb-0 sm:hidden">
          <div className="w-10 h-1.5 rounded-full bg-muted-foreground/30" />
        </div>

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
              <span className="ml-1 normal-case font-normal text-muted-foreground/60">
                ({t("aiSuggestion.optional")})
              </span>
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
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t("aiSuggestion.analyzing")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("aiSuggestion.analyzingHint")}
                </p>
              </div>
            </div>
          )}

          {error && !isLoading && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30"
              data-ocid="ai-error-message"
            >
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">
                  {error === "timeout"
                    ? t("aiSuggestion.errorTimeout")
                    : t("aiSuggestion.errorGeneral")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("aiSuggestion.errorManualHint")}
                </p>
              </div>
            </div>
          )}

          {result && !isLoading && !error && (
            <div
              className="space-y-3 suggestion-slide-in"
              data-ocid="ai-suggestion-result"
            >
              <div className="p-4 rounded-xl bg-primary/8 border border-primary/25">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-semibold text-foreground">
                    {result.suggestedTableIds.length > 0
                      ? t("aiSuggestion.suggested", {
                          tables:
                            suggestedTableNames ||
                            result.suggestedTableIds.join(", "),
                        })
                      : t("aiSuggestion.noSuggestion")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.reasoning}
                </p>
              </div>
              {result.confidence > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {t("aiSuggestion.confidence")}
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                  <div className="confidence-meter">
                    <div
                      className="confidence-fill"
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className="flex gap-3 px-5 py-4 border-t border-border shrink-0"
          style={{
            paddingBottom: "max(1rem, env(safe-area-inset-bottom, 1rem))",
          }}
        >
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
                  <CheckCircle2 className="h-4 w-4 mr-1.5" />
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

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SeatingPlanPage() {
  const { t } = useTranslation(["dashboard", "shared"]);
  const isMobile = useIsMobile();

  const { data: floorState, isLoading } = useFloorState();
  const createTable = useCreateTable();
  const deleteTable = useDeleteTable();
  const { recordFeedback } = useRecordSuggestionFeedback();

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isMobileAddingTable, setIsMobileAddingTable] = useState(false);
  const [form, setForm] = useState<AddTableForm>({
    name: "",
    capacity: "4",
    zone: DEFAULT_ZONES[0],
  });
  const [formError, setFormError] = useState("");

  // Zone management
  const [zones, setZones] = useState<string[]>(DEFAULT_ZONES);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [activeZone, setActiveZone] = useState<string | undefined>(undefined);
  const [localZones, setLocalZones] = useState<LocalZones>({});

  // Background image
  const [bgImage, setBgImage] = useState<string | undefined>(undefined);
  const bgInputRef = useRef<HTMLInputElement>(null);

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

  const tables = floorState?.tables ?? [];
  const selectedCount = selectedTableIds.size;

  const clearBulkState = () => {
    setSelectedTableIds(new Set());
    setIsBulkMode(false);
    setBulkZonePicker(false);
    setBulkCapacityInput("");
    setBulkCapacityMode(false);
    setBulkConfirmDelete(false);
  };

  const closeMobileAddForm = () => {
    setIsMobileAddingTable(false);
    setForm({ name: "", capacity: "4", zone: zones[0] });
    setFormError("");
  };

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
          setIsMobileAddingTable(false);
          setForm({ name: "", capacity: "4", zone: zones[0] });
          setFormError("");
        },
        onError: (err) => setFormError(err.message),
      },
    );
  };

  // Background image upload
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBgImage(url);
    toast.success(t("seating.bgImageSet"));
  };

  const handleAIReshuffle = () => {
    toast.info(t("seating.aiReshuffleComingSoon"));
  };

  const handlePrint = () => {
    window.print();
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

  const handleBulkZoneApply = (zone: string) => {
    const updates: LocalZones = { ...localZones };
    for (const id of selectedTableIds) updates[id] = zone;
    setLocalZones(updates);
    clearBulkState();
  };

  const handleBulkDelete = () => {
    for (const id of selectedTableIds) deleteTable.mutate({ id });
    clearBulkState();
  };

  const handleBulkCapacityApply = () => {
    const cap = Number.parseInt(bulkCapacityInput, 10);
    if (!cap || cap < 1 || cap > 20) return;
    clearBulkState();
  };

  const handleZoneChange = (tableId: string, zone: string) => {
    setLocalZones((prev) => ({ ...prev, [tableId]: zone }));
  };

  const BulkActionBar = () => {
    if (!isBulkMode || selectedCount === 0) return null;
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
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
              aria-label={t("actions.close", { ns: "shared" })}
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
    );
  };

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="heading-h1">{t("seatingPlan.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isMobile
              ? t("seatingPlan.hintMobile", { count: tables.length })
              : t("seatingPlan.hint", { count: tables.length })}
          </p>
        </div>

        {/* Desktop controls */}
        {!isMobile && (
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
              onClick={() => setShowAIModal(true)}
              data-ocid="ai-suggestion-btn"
            >
              <Brain className="h-4 w-4" />
              {t("aiSuggestion.buttonLabel")}
            </Button>

            <fieldset className="flex rounded-xl border border-border overflow-hidden">
              <legend className="sr-only">Weergavemodus</legend>
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors",
                  !isEditMode
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => {
                  setIsEditMode(false);
                  clearBulkState();
                }}
                aria-pressed={!isEditMode}
                data-ocid="seating-view-mode-btn"
              >
                <Eye className="h-3.5 w-3.5" />
                {t("seatingPlan.viewMode")}
              </button>
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors",
                  isEditMode
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setIsEditMode(true)}
                aria-pressed={isEditMode}
                data-ocid="seating-edit-mode-btn"
              >
                <Pencil className="h-3.5 w-3.5" />
                {t("seatingPlan.editMode")}
              </button>
            </fieldset>

            {!isBulkMode && (
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => setShowAddForm(true)}
                data-ocid="seating-add-table-btn"
              >
                <Plus className="h-4 w-4" />
                {t("seatingPlan.addTable")}
              </Button>
            )}
          </div>
        )}

        {/* Mobile controls */}
        {isMobile && (
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
              onClick={() => setShowAIModal(true)}
              data-ocid="ai-suggestion-btn-mobile"
            >
              <Brain className="h-3.5 w-3.5" />
              {t("aiSuggestion.buttonLabelShort")}
            </Button>
            {tables.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (isBulkMode) clearBulkState();
                  else setIsBulkMode(true);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
                  isBulkMode
                    ? "bg-secondary border-secondary text-secondary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted/60",
                )}
                data-ocid="mobile-bulk-mode-btn"
              >
                {t("seating.bulk.selectMultiple")}
                {isBulkMode && selectedCount > 0 && (
                  <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 text-[10px] font-bold rounded-full bg-white/20">
                    {selectedCount}
                  </span>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Premium toolbar: Zones | AI-reshuffle | Upload bg | Print | (Undo on desktop) */}
      <div className="flex items-center gap-2 flex-wrap print:hidden">
        <button
          type="button"
          onClick={() => setShowZoneModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
          data-ocid="seating-zones-btn"
        >
          <Layers className="h-4 w-4 text-muted-foreground" />
          {t("seating.zones.manage")}
        </button>

        <button
          type="button"
          onClick={handleAIReshuffle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
          data-ocid="seating-ai-reshuffle-btn"
        >
          <Sparkles className="h-4 w-4" />
          {t("seating.aiReshuffle")}
        </button>

        {/* Hidden file input for background photo */}
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
          data-ocid="seating-upload-bg-btn"
        >
          <ImagePlus className="h-4 w-4" />
          {bgImage ? t("seating.changeBg") : t("seating.uploadBg")}
        </button>

        {bgImage && (
          <button
            type="button"
            onClick={() => setBgImage(undefined)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted/60 transition-colors"
            data-ocid="seating-remove-bg-btn"
          >
            <X className="h-3.5 w-3.5" />
            {t("seating.removeBg")}
          </button>
        )}

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted/60 transition-colors"
          data-ocid="seating-print-btn"
        >
          <Printer className="h-4 w-4" />
          {t("seating.print")}
        </button>

        {/* Undo (desktop only — also accessible via Ctrl+Z) */}
        {!isMobile && isEditMode && (
          <button
            type="button"
            onClick={() => {
              /* forwarded via keyboard event in canvas */
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted/60 transition-colors"
            data-ocid="seating-undo-toolbar-btn"
            title="Ctrl+Z"
          >
            <RotateCcw className="h-4 w-4" />
            {t("seating.undo")}
          </button>
        )}

        {/* Zone filter pills */}
        {!isMobile && tables.length > 0 && (
          <div className="flex items-center gap-1.5 ml-auto flex-wrap">
            <button
              type="button"
              onClick={() => setActiveZone(undefined)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors",
                !activeZone
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:bg-muted/50",
              )}
              data-ocid="zone-filter-all"
            >
              {t("seating.zones.all")}
            </button>
            {zones.map((zone) => (
              <button
                key={zone}
                type="button"
                onClick={() =>
                  setActiveZone(activeZone === zone ? undefined : zone)
                }
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors",
                  activeZone === zone
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:bg-muted/50",
                )}
                data-ocid={`zone-filter-${zone}`}
              >
                {zone}
              </button>
            ))}
          </div>
        )}
      </div>

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

      {/* Desktop add table form */}
      {!isMobile && showAddForm && (
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

      {/* Loading skeleton */}
      {isLoading ? (
        isMobile ? (
          <div className="space-y-3">
            {SKELETON_KEYS.map((k) => (
              <div
                key={k}
                className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border min-h-[80px]"
              >
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <Skeleton className="w-full rounded-2xl" style={{ minHeight: 580 }} />
        )
      ) : isMobile ? (
        <TableListView
          tables={tables}
          isLoading={isLoading}
          onTableClick={setSelectedTable}
          onAddTable={() => setIsMobileAddingTable(true)}
          selectedTableIds={selectedTableIds}
          onSelectionChange={setSelectedTableIds}
          isBulkMode={isBulkMode}
        />
      ) : (
        <FloorPlanCanvas
          tables={tables}
          isEditMode={isEditMode}
          onTableClick={setSelectedTable}
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
          tableZones={localZones}
        />
      )}

      {/* Bulk action bar */}
      {isBulkMode && selectedCount > 0 && <BulkActionBar />}

      {/* Table detail modal */}
      {!isBulkMode && (
        <TableDetailModal
          table={selectedTable}
          isOpen={!!selectedTable}
          isEditMode={isEditMode}
          onClose={() => setSelectedTable(null)}
          aiSuggestion={
            selectedTable &&
            activeSuggestion?.suggestedTableIds.includes(selectedTable.id)
              ? activeSuggestion
              : null
          }
          onAiAccept={handleAiAccept}
          onAiReject={handleAiReject}
          zone={selectedTable ? localZones[selectedTable.id] : undefined}
          onZoneChange={handleZoneChange}
        />
      )}

      {/* Mobile add-table sheet */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-0 z-50",
            isMobileAddingTable ? "pointer-events-auto" : "pointer-events-none",
          )}
        >
          {isMobileAddingTable && (
            // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop close
            <div
              className="absolute inset-0 bg-black/60"
              onClick={closeMobileAddForm}
              aria-hidden="true"
            />
          )}
          <dialog
            open={isMobileAddingTable}
            className={cn(
              "absolute bottom-0 left-0 right-0 m-0 p-0 w-full bg-card rounded-t-3xl border-0",
              "transition-transform duration-300 ease-out will-change-transform max-h-[90dvh] overflow-y-auto",
              isMobileAddingTable ? "translate-y-0" : "translate-y-full",
            )}
            aria-labelledby="mobile-add-table-title"
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1.5 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-border">
              <h2
                id="mobile-add-table-title"
                className="text-lg font-semibold text-foreground"
              >
                {t("seatingPlan.addTableTitle")}
              </h2>
              <button
                type="button"
                className="h-10 w-10 rounded-full flex items-center justify-center bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                onClick={closeMobileAddForm}
                aria-label={t("actions.close", { ns: "shared" })}
                data-ocid="mobile-add-table-close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 py-5 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="mobile-add-table-name">
                  {t("seatingPlan.tableName")}
                </Label>
                <Input
                  id="mobile-add-table-name"
                  placeholder={t("seatingPlan.tableNamePlaceholder")}
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="h-14 text-base rounded-xl"
                  data-ocid="mobile-add-table-name"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile-add-table-capacity">
                  {t("seatingPlan.tableCapacity")}
                </Label>
                <Input
                  id="mobile-add-table-capacity"
                  type="number"
                  min={1}
                  max={20}
                  value={form.capacity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, capacity: e.target.value }))
                  }
                  className="h-14 text-base rounded-xl"
                  data-ocid="mobile-add-table-capacity"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile-add-table-zone">
                  {t("seatingPlan.zone")}
                </Label>
                <select
                  id="mobile-add-table-zone"
                  value={form.zone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, zone: e.target.value }))
                  }
                  className="w-full h-14 rounded-xl border border-input bg-background text-foreground text-base px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  data-ocid="mobile-add-table-zone"
                >
                  {zones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>
              {formError && (
                <p className="text-sm text-destructive">{formError}</p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeMobileAddForm}
                  className="flex-1 h-14 rounded-xl border border-border text-foreground font-medium hover:bg-muted/50 transition-colors"
                >
                  {t("actions.cancel", { ns: "shared" })}
                </button>
                <button
                  type="button"
                  onClick={handleAddTable}
                  disabled={createTable.isPending}
                  className="flex-1 h-14 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-60"
                  data-ocid="mobile-add-table-submit"
                >
                  {createTable.isPending
                    ? t("seatingPlan.adding")
                    : t("seatingPlan.add")}
                </button>
              </div>
            </div>
            <div className="h-6" />
          </dialog>
        </div>
      )}

      {/* Modals */}
      <ZoneManagementModal
        isOpen={showZoneModal}
        onClose={() => setShowZoneModal(false)}
        zones={zones}
        onZonesChange={setZones}
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
