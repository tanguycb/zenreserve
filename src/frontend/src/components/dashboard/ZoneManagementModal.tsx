import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deriveZoneColor, useAddZone, useDeleteZone } from "@/hooks/useZones";
import { Layers, Plus, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface ZoneManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  zones: string[];
  zoneColors: Record<string, string>;
  onZonesChange: (zones: string[]) => void;
}

export function ZoneManagementModal({
  isOpen,
  onClose,
  zones,
  zoneColors,
  onZonesChange: _onZonesChange,
}: ZoneManagementModalProps) {
  const { t } = useTranslation("dashboard");
  const [newZone, setNewZone] = useState("");
  const addZone = useAddZone();
  const deleteZone = useDeleteZone();

  if (!isOpen) return null;

  const handleAdd = () => {
    const trimmed = newZone.trim();
    if (!trimmed || zones.includes(trimmed)) return;
    addZone.mutate(
      { name: trimmed, color: deriveZoneColor(trimmed), maxGuests: 50 },
      {
        onSuccess: () => setNewZone(""),
        onError: () => toast.error(t("seating.zones.saveError")),
      },
    );
  };

  const handleDelete = (zone: string) => {
    deleteZone.mutate(`zone-${zones.indexOf(zone)}`, {
      onError: () => toast.error(t("seating.zones.saveError")),
    });
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
            {zones.map((zone) => {
              const color = zoneColors[zone] ?? "#94A3B8";
              return (
                <div
                  key={zone}
                  className="flex items-center justify-between rounded-xl bg-muted/30 border border-border px-4 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ background: color }}
                    />
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
              );
            })}
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
