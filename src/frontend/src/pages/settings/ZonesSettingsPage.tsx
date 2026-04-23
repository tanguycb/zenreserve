import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEFAULT_COLORS,
  type ZoneWithColor,
  useAddZone,
  useDeleteZone,
  useUpdateZone,
  useZones,
} from "@/hooks/useZones";
import { Layers, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// ── Color Swatch Picker ───────────────────────────────────────────────────────
interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {DEFAULT_COLORS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className="h-6 w-6 rounded-full border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          style={{
            backgroundColor: c,
            borderColor: value === c ? "white" : "transparent",
            boxShadow: value === c ? `0 0 0 2px ${c}` : undefined,
          }}
          aria-label={c}
          aria-pressed={value === c}
        />
      ))}
    </div>
  );
}

// ── Add Zone Form ─────────────────────────────────────────────────────────────
interface AddZoneFormProps {
  onClose: () => void;
}

function AddZoneForm({ onClose }: AddZoneFormProps) {
  const { t } = useTranslation("dashboard");
  const addZone = useAddZone();
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_COLORS[0]);
  const [maxGuests, setMaxGuests] = useState(30);

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      await addZone.mutateAsync({ name: name.trim(), color, maxGuests });
      toast.success(t("settings.zones.added"));
      onClose();
    } catch (err) {
      toast.error(
        `${t("settings.saveError")}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  return (
    <div
      className="rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 space-y-4"
      data-ocid="zone-add-form"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {t("settings.zones.addTitle")}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          aria-label={t("settings.zones.cancel")}
          data-ocid="zone-add-form-close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-foreground">
            {t("settings.zones.name")}
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("settings.zones.namePlaceholder")}
            className="bg-card border-border"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSave();
              }
            }}
            autoFocus
            data-ocid="zone-add-name-input"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-foreground">
            {t("settings.zones.maxGuests")}
          </Label>
          <Input
            type="number"
            min={1}
            max={999}
            value={maxGuests}
            onChange={(e) => setMaxGuests(Number(e.target.value))}
            className="bg-card border-border"
            data-ocid="zone-add-max-input"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-foreground">
          {t("settings.zones.color")}
        </Label>
        <ColorPicker value={color} onChange={setColor} />
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button
          type="button"
          onClick={handleSave}
          disabled={!name.trim() || addZone.isPending}
          className="gap-2"
          data-ocid="zone-add-save-btn"
        >
          {addZone.isPending && (
            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          )}
          {t(addZone.isPending ? "settings.saving" : "settings.save")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          data-ocid="zone-add-cancel-btn"
        >
          {t("settings.zones.cancel")}
        </Button>
      </div>
    </div>
  );
}

// ── Zone Row ──────────────────────────────────────────────────────────────────
interface ZoneRowProps {
  zone: ZoneWithColor;
  index: number;
}

function ZoneRow({ zone, index }: ZoneRowProps) {
  const { t } = useTranslation("dashboard");
  const updateZone = useUpdateZone();
  const deleteZone = useDeleteZone();

  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [name, setName] = useState(zone.name);
  const [color, setColor] = useState(zone.color);
  const [maxGuests, setMaxGuests] = useState(zone.maxGuests);

  const handleSave = async () => {
    try {
      await updateZone.mutateAsync({
        id: zone.id,
        name: name.trim() || zone.name,
        color,
        maxGuests,
      });
      toast.success(t("settings.zones.updated"));
      setEditing(false);
    } catch (err) {
      toast.error(
        `${t("settings.saveError")}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    try {
      await deleteZone.mutateAsync(zone.id);
      toast.success(t("settings.zones.deleted"));
    } catch (err) {
      toast.error(
        `${t("settings.saveError")}: ${err instanceof Error ? err.message : String(err)}`,
      );
      setConfirmDelete(false);
    }
  };

  return (
    <div
      className="rounded-xl border border-border bg-background overflow-hidden"
      data-ocid={`zone-row.item.${index + 1}`}
    >
      {/* Collapsed row */}
      {!editing && (
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Color swatch */}
          <div
            className="h-8 w-8 rounded-lg shrink-0 border border-border/50 shadow-sm"
            style={{ backgroundColor: zone.color }}
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {zone.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("settings.zones.maxGuestsLabel", { count: zone.maxGuests })}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                setName(zone.name);
                setColor(zone.color);
                setMaxGuests(zone.maxGuests);
                setEditing(true);
                setConfirmDelete(false);
              }}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label={t("settings.zones.edit")}
              data-ocid={`zone-edit-btn.${index + 1}`}
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-1 ml-1">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-2 py-1 rounded-lg text-xs font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 transition-colors"
                  data-ocid={`zone-confirm-delete.${index + 1}`}
                >
                  {t("settings.zones.deleteConfirm")}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors"
                  data-ocid={`zone-cancel-delete.${index + 1}`}
                >
                  {t("settings.zones.cancel")}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteZone.isPending}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                aria-label={t("settings.zones.delete")}
                data-ocid={`zone-delete-btn.${index + 1}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Expanded edit form */}
      {editing && (
        <div className="px-4 py-4 space-y-4 border-t border-border bg-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-foreground">
                {t("settings.zones.name")}
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background border-border"
                autoFocus
                data-ocid={`zone-edit-name.${index + 1}`}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-foreground">
                {t("settings.zones.maxGuests")}
              </Label>
              <Input
                type="number"
                min={1}
                max={999}
                value={maxGuests}
                onChange={(e) => setMaxGuests(Number(e.target.value))}
                className="bg-background border-border"
                data-ocid={`zone-edit-max.${index + 1}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-foreground">
              {t("settings.zones.color")}
            </Label>
            <ColorPicker value={color} onChange={setColor} />
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={updateZone.isPending}
              className="gap-2"
              data-ocid={`zone-save-btn.${index + 1}`}
            >
              {updateZone.isPending && (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              )}
              {t(updateZone.isPending ? "settings.saving" : "settings.save")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setEditing(false)}
              data-ocid={`zone-edit-cancel.${index + 1}`}
            >
              {t("settings.zones.cancel")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ZonesSettingsPage() {
  const { t } = useTranslation("dashboard");
  const { data: zones = [], isLoading } = useZones();
  const [showAddForm, setShowAddForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8" data-ocid="zones-settings-page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Layers className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {t("settings.nav.zones")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("settings.zones.subtitle")}
          </p>
        </div>
      </div>

      {/* Zones list */}
      <section className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {t("settings.zones.listTitle")}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("settings.zones.listHint")}
            </p>
          </div>
          {zones.length > 0 && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              {zones.length}
            </span>
          )}
        </div>

        <div className="px-6 py-5 space-y-3">
          {/* Empty state */}
          {zones.length === 0 && !showAddForm && (
            <div
              className="flex flex-col items-center justify-center py-10 text-center"
              data-ocid="zones-empty-state"
            >
              <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <Layers className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                {t("settings.zones.emptyTitle")}
              </p>
              <p className="text-xs text-muted-foreground max-w-xs">
                {t("settings.zones.emptyHint")}
              </p>
            </div>
          )}

          {/* Zone rows */}
          {zones.map((zone, i) => (
            <ZoneRow key={zone.id} zone={zone} index={i} />
          ))}

          {/* Add form */}
          {showAddForm && <AddZoneForm onClose={() => setShowAddForm(false)} />}
        </div>

        {/* Footer CTA */}
        {!showAddForm && (
          <div className="px-6 py-4 border-t border-border bg-muted/20">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddForm(true)}
              className="gap-2 border-border"
              data-ocid="zone-add-open-btn"
            >
              <Plus className="h-4 w-4" />
              {t("settings.zones.addZone")}
            </Button>
          </div>
        )}
      </section>

      {/* Info note */}
      <div className="rounded-xl border border-border bg-card px-5 py-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t("settings.zones.infoNote")}
        </p>
      </div>
    </div>
  );
}
