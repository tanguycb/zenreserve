import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type CapacityConfig,
  type TableType,
  type Zone,
  useCapacityConfig,
  useOpeningHoursConfig,
  useUpdateCapacityConfig,
} from "@/hooks/useSettings";
import { BookOpen, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function CapacitySettingsPage() {
  const { t } = useTranslation("dashboard");
  const { data: capacityData, isLoading: capLoading } = useCapacityConfig();
  const { data: hoursData } = useOpeningHoursConfig();
  const updateCapacity = useUpdateCapacityConfig();

  const [config, setConfig] = useState<CapacityConfig>({
    serviceMaxGuests: {},
    minPartySize: 1,
    maxPartySize: 12,
    zones: [],
    tableTypes: [],
    occupancyCeiling: 85,
  });

  const [newZoneName, setNewZoneName] = useState("");
  const [newTableTypeName, setNewTableTypeName] = useState("");
  const [newTableTypeSeats, setNewTableTypeSeats] = useState(4);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (capacityData) setConfig(capacityData);
  }, [capacityData]);

  const setServiceMax = (serviceId: string, value: number) => {
    setConfig((c) => ({
      ...c,
      serviceMaxGuests: { ...c.serviceMaxGuests, [serviceId]: value },
    }));
  };

  const addZone = () => {
    const name = newZoneName.trim();
    if (!name) return;
    const zone: Zone = { id: Date.now().toString(), name, maxGuests: 20 };
    setConfig((c) => ({ ...c, zones: [...c.zones, zone] }));
    setNewZoneName("");
  };

  const updateZone = (id: string, updates: Partial<Zone>) => {
    setConfig((c) => ({
      ...c,
      zones: c.zones.map((z) => (z.id === id ? { ...z, ...updates } : z)),
    }));
  };

  const deleteZone = (id: string) => {
    setConfig((c) => ({ ...c, zones: c.zones.filter((z) => z.id !== id) }));
  };

  const addTableType = () => {
    const name = newTableTypeName.trim();
    if (!name) return;
    const tt: TableType = {
      id: Date.now().toString(),
      name,
      seatsPerTable: newTableTypeSeats,
      count: 1,
    };
    setConfig((c) => ({ ...c, tableTypes: [...c.tableTypes, tt] }));
    setNewTableTypeName("");
    setNewTableTypeSeats(4);
  };

  const updateTableType = (id: string, updates: Partial<TableType>) => {
    setConfig((c) => ({
      ...c,
      tableTypes: c.tableTypes.map((tt) =>
        tt.id === id ? { ...tt, ...updates } : tt,
      ),
    }));
  };

  const deleteTableType = (id: string) => {
    setConfig((c) => ({
      ...c,
      tableTypes: c.tableTypes.filter((tt) => tt.id !== id),
    }));
  };

  const saveAll = async () => {
    setIsSaving(true);
    try {
      await updateCapacity.mutateAsync(config);
      toast.success(t("settings.saved"));
    } catch {
      toast.error(t("settings.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  if (capLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const services = hoursData?.services ?? [];

  return (
    <div className="max-w-3xl space-y-8" data-ocid="capacity-settings-page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {t("settings.nav.capacity")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("settings.capacity.subtitle")}
          </p>
        </div>
      </div>

      {/* Max guests per service */}
      <section className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {t("settings.capacity.perService")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("settings.capacity.perServiceHint")}
          </p>
        </div>
        <div className="px-6 py-5 space-y-3">
          {services.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {t("settings.capacity.noServicesHint")}
            </p>
          )}
          {services.map((s) => (
            <div key={s.id} className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">
                  {s.openTime} – {s.closeTime}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setServiceMax(
                      s.id,
                      Math.max(1, (config.serviceMaxGuests[s.id] ?? 40) - 5),
                    )
                  }
                  className="h-7 w-7 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label={t("settings.capacity.decreaseMax")}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <Input
                  type="number"
                  min={1}
                  max={999}
                  value={config.serviceMaxGuests[s.id] ?? s.maxCapacity}
                  onChange={(e) => setServiceMax(s.id, Number(e.target.value))}
                  className="w-20 text-center bg-background border-border"
                  data-ocid={`service-max-${s.id}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setServiceMax(
                      s.id,
                      (config.serviceMaxGuests[s.id] ?? 40) + 5,
                    )
                  }
                  className="h-7 w-7 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label={t("settings.capacity.increaseMax")}
                >
                  <Plus className="h-3 w-3" />
                </button>
                <span className="text-xs text-muted-foreground w-12">
                  {t("settings.capacity.guests")}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end">
          <Button
            type="button"
            onClick={saveAll}
            disabled={isSaving}
            className="gap-2"
            data-ocid="save-service-max-btn"
          >
            {isSaving && (
              <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            )}
            {t(isSaving ? "settings.saving" : "settings.save")}
          </Button>
        </div>
      </section>

      {/* Min/max party size */}
      <section className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {t("settings.capacity.partySize")}
          </h2>
        </div>
        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="minParty"
              className="text-sm font-medium text-foreground"
            >
              {t("settings.capacity.minParty")}
            </Label>
            <Input
              id="minParty"
              type="number"
              min={1}
              max={config.maxPartySize}
              value={config.minPartySize}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  minPartySize: Number(e.target.value),
                }))
              }
              className="bg-background border-border"
              data-ocid="min-party-size"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="maxParty"
              className="text-sm font-medium text-foreground"
            >
              {t("settings.capacity.maxParty")}
            </Label>
            <Input
              id="maxParty"
              type="number"
              min={config.minPartySize}
              max={100}
              value={config.maxPartySize}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  maxPartySize: Number(e.target.value),
                }))
              }
              className="bg-background border-border"
              data-ocid="max-party-size"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end">
          <Button
            type="button"
            onClick={saveAll}
            disabled={isSaving}
            className="gap-2"
            data-ocid="save-party-size-btn"
          >
            {isSaving && (
              <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            )}
            {t(isSaving ? "settings.saving" : "settings.save")}
          </Button>
        </div>
      </section>

      {/* Zones */}
      <section className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {t("settings.capacity.zones")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("settings.capacity.zonesHint")}
          </p>
        </div>
        <div className="px-6 py-5 space-y-3">
          {config.zones.map((z) => (
            <div
              key={z.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background"
              data-ocid={`zone-row-${z.id}`}
            >
              <Input
                value={z.name}
                onChange={(e) => updateZone(z.id, { name: e.target.value })}
                className="flex-1 bg-card border-border h-8 text-sm"
                data-ocid={`zone-name-${z.id}`}
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={999}
                  value={z.maxGuests}
                  onChange={(e) =>
                    updateZone(z.id, { maxGuests: Number(e.target.value) })
                  }
                  className="w-20 text-center bg-card border-border h-8 text-sm"
                  data-ocid={`zone-max-${z.id}`}
                />
                <span className="text-xs text-muted-foreground shrink-0">
                  {t("settings.capacity.guests")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => deleteZone(z.id)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                aria-label={t("settings.capacity.deleteZone")}
                data-ocid={`zone-delete-${z.id}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <Input
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
              placeholder={t("settings.capacity.newZonePlaceholder")}
              className="bg-background border-border"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addZone();
                }
              }}
              data-ocid="new-zone-name"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addZone}
              disabled={!newZoneName.trim()}
              className="shrink-0 gap-2 border-border"
              data-ocid="add-zone-btn"
            >
              <Plus className="h-4 w-4" />
              {t("settings.capacity.addZone")}
            </Button>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end">
          <Button
            type="button"
            onClick={saveAll}
            disabled={isSaving}
            className="gap-2"
            data-ocid="save-zones-btn"
          >
            {isSaving && (
              <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            )}
            {t(isSaving ? "settings.saving" : "settings.save")}
          </Button>
        </div>
      </section>

      {/* Table types */}
      <section className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {t("settings.capacity.tableTypes")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("settings.capacity.tableTypesHint")}
          </p>
        </div>
        <div className="px-6 py-5 space-y-3">
          {/* Table header */}
          <div className="grid grid-cols-4 gap-3 px-2">
            <span className="text-xs font-medium text-muted-foreground">
              {t("settings.capacity.tableTypeName")}
            </span>
            <span className="text-xs font-medium text-muted-foreground text-center">
              {t("settings.capacity.seatsPerTable")}
            </span>
            <span className="text-xs font-medium text-muted-foreground text-center">
              {t("settings.capacity.tableCount")}
            </span>
            <span className="sr-only">{t("settings.capacity.actions")}</span>
          </div>

          {config.tableTypes.map((tt) => (
            <div
              key={tt.id}
              className="grid grid-cols-4 gap-3 items-center px-2 py-2 rounded-xl border border-border bg-background"
              data-ocid={`table-type-row-${tt.id}`}
            >
              <Input
                value={tt.name}
                onChange={(e) =>
                  updateTableType(tt.id, { name: e.target.value })
                }
                className="bg-card border-border h-8 text-sm"
                data-ocid={`tt-name-${tt.id}`}
              />
              <Input
                type="number"
                min={1}
                max={20}
                value={tt.seatsPerTable}
                onChange={(e) =>
                  updateTableType(tt.id, {
                    seatsPerTable: Number(e.target.value),
                  })
                }
                className="text-center bg-card border-border h-8 text-sm"
                data-ocid={`tt-seats-${tt.id}`}
              />
              <Input
                type="number"
                min={0}
                max={999}
                value={tt.count}
                onChange={(e) =>
                  updateTableType(tt.id, { count: Number(e.target.value) })
                }
                className="text-center bg-card border-border h-8 text-sm"
                data-ocid={`tt-count-${tt.id}`}
              />
              <button
                type="button"
                onClick={() => deleteTableType(tt.id)}
                className="justify-self-end p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                aria-label={t("settings.capacity.deleteTableType")}
                data-ocid={`tt-delete-${tt.id}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {/* Add table type */}
          <div className="flex items-end gap-2 flex-wrap">
            <div className="flex-1 min-w-[140px] space-y-1">
              <Label className="text-xs text-muted-foreground">
                {t("settings.capacity.tableTypeName")}
              </Label>
              <Input
                value={newTableTypeName}
                onChange={(e) => setNewTableTypeName(e.target.value)}
                placeholder={t("settings.capacity.newTableTypePlaceholder")}
                className="bg-background border-border"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTableType();
                  }
                }}
                data-ocid="new-tt-name"
              />
            </div>
            <div className="space-y-1 w-24">
              <Label className="text-xs text-muted-foreground">
                {t("settings.capacity.seatsPerTable")}
              </Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={newTableTypeSeats}
                onChange={(e) => setNewTableTypeSeats(Number(e.target.value))}
                className="bg-background border-border"
                data-ocid="new-tt-seats"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addTableType}
              disabled={!newTableTypeName.trim()}
              className="shrink-0 gap-2 border-border"
              data-ocid="add-table-type-btn"
            >
              <Plus className="h-4 w-4" />
              {t("settings.capacity.addTableType")}
            </Button>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end">
          <Button
            type="button"
            onClick={saveAll}
            disabled={isSaving}
            className="gap-2"
            data-ocid="save-table-types-btn"
          >
            {isSaving && (
              <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            )}
            {t(isSaving ? "settings.saving" : "settings.save")}
          </Button>
        </div>
      </section>

      {/* Occupancy ceiling */}
      <section className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {t("settings.capacity.occupancyCeiling")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("settings.capacity.occupancyCeilingHint")}
          </p>
        </div>
        <div className="px-6 py-6 space-y-4">
          <div className="flex items-center gap-6">
            <input
              type="range"
              min={50}
              max={100}
              step={5}
              value={config.occupancyCeiling}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  occupancyCeiling: Number(e.target.value),
                }))
              }
              className="flex-1 h-2 accent-primary cursor-pointer"
              data-ocid="occupancy-ceiling-slider"
              aria-label={t("settings.capacity.occupancyCeiling")}
            />
            <div className="w-16 text-center">
              <span className="text-2xl font-bold text-primary">
                {config.occupancyCeiling}
              </span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("settings.capacity.occupancyCeilingLabel", {
              value: config.occupancyCeiling,
            })}
          </p>
        </div>
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end">
          <Button
            type="button"
            onClick={saveAll}
            disabled={isSaving}
            className="gap-2"
            data-ocid="save-occupancy-btn"
          >
            {isSaving && (
              <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            )}
            {t(isSaving ? "settings.saving" : "settings.save")}
          </Button>
        </div>
      </section>
    </div>
  );
}
