import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type CapacityConfig,
  type TableGroupDefinition,
  type TableType,
  type Zone,
  useCapacityConfig,
  useCreateTableGroupDefinition,
  useDeleteTableGroupDefinition,
  useOpeningHoursConfig,
  useTableGroupDefinitions,
  useUpdateCapacityConfig,
  useUpdateTableGroupDefinition,
} from "@/hooks/useSettings";
import { BookOpen, Layers, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function CapacitySettingsPage() {
  const { t } = useTranslation("dashboard");
  const { data: capacityData, isLoading: capLoading } = useCapacityConfig();
  const { data: hoursData } = useOpeningHoursConfig();
  const updateCapacity = useUpdateCapacityConfig();

  // Table group definitions
  const { data: tableGroupsData } = useTableGroupDefinitions();
  const createGroupMutation = useCreateTableGroupDefinition();
  const updateGroupMutation = useUpdateTableGroupDefinition();
  const deleteGroupMutation = useDeleteTableGroupDefinition();

  const [config, setConfig] = useState<CapacityConfig>({
    serviceMaxGuests: {} as Record<string, number>,
    minPartySize: 1,
    maxPartySize: 12,
    zones: [] as Zone[],
    tableTypes: [] as TableType[],
    occupancyCeiling: 85,
    totalSeatsPerSlot: 20,
  });

  const [newZoneName, setNewZoneName] = useState("");
  const [newTableTypeName, setNewTableTypeName] = useState("");
  const [newTableTypeSeats, setNewTableTypeSeats] = useState(4);
  const [isSaving, setIsSaving] = useState(false);

  // Table groups local state
  const [tableGroups, setTableGroups] = useState<TableGroupDefinition[]>([]);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupTableIds, setNewGroupTableIds] = useState<string[]>([]);
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const [groupSaving, setGroupSaving] = useState(false);

  useEffect(() => {
    if (capacityData) setConfig(capacityData);
  }, [capacityData]);

  useEffect(() => {
    if (tableGroupsData) setTableGroups(tableGroupsData);
  }, [tableGroupsData]);

  // Compute total capacity for a set of selected table IDs
  const calcGroupCapacity = (tableIds: string[]) =>
    tableIds.reduce((sum, tid) => {
      const tt = config.tableTypes.find((t) => t.id === tid);
      return sum + (tt ? tt.seatsPerTable * tt.count : 0);
    }, 0);

  const toggleNewGroupTable = (tableId: string) => {
    setNewGroupTableIds((prev) =>
      prev.includes(tableId)
        ? prev.filter((id) => id !== tableId)
        : [...prev, tableId],
    );
  };

  const handleAddGroup = async () => {
    const name = newGroupName.trim();
    if (!name || newGroupTableIds.length < 2) return;
    setGroupSaving(true);
    try {
      await createGroupMutation.mutateAsync({
        name,
        tableIds: newGroupTableIds,
        description: newGroupDescription.trim(),
      });
      toast.success(t("settings.tableGroups.saved"));
      setShowAddGroup(false);
      setNewGroupName("");
      setNewGroupDescription("");
      setNewGroupTableIds([]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`${t("settings.saveError")}: ${msg}`);
    } finally {
      setGroupSaving(false);
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (deletingGroupId !== id) {
      setDeletingGroupId(id);
      return;
    }
    try {
      await deleteGroupMutation.mutateAsync(id);
      toast.success(t("settings.tableGroups.deleted"));
      setDeletingGroupId(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`${t("settings.saveError")}: ${msg}`);
    }
  };

  // Optimistically update a group's name or description in local state,
  // then persist to backend
  const handleUpdateGroup = async (
    group: TableGroupDefinition,
    updates: Partial<
      Pick<TableGroupDefinition, "name" | "tableIds" | "description">
    >,
  ) => {
    const updated = { ...group, ...updates };
    setTableGroups((prev) =>
      prev.map((g) => (g.id === group.id ? updated : g)),
    );
    try {
      await updateGroupMutation.mutateAsync({
        id: updated.id,
        name: updated.name,
        tableIds: updated.tableIds,
        description: updated.description,
      });
    } catch (err) {
      setTableGroups((prev) =>
        prev.map((g) => (g.id === group.id ? group : g)),
      );
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`${t("settings.saveError")}: ${msg}`);
    }
  };

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
      // Show enhanced message informing users that tables are also synced to the floor plan
      toast.success(t("settings.capacity.savedWithSync"));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[CapacitySettings] save failed:", err);
      toast.error(`${t("settings.saveError")}: ${message}`);
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
          {services.map((s) => {
            // Use serviceMaxGuests[s.id] first; fall back to s.maxCapacity if the key
            // doesn't exist (e.g. freshly loaded service with no override yet)
            const currentMax =
              config.serviceMaxGuests[s.id] !== undefined
                ? config.serviceMaxGuests[s.id]
                : s.maxCapacity;
            return (
              <div key={s.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {s.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {s.openTime} – {s.closeTime}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setServiceMax(s.id, Math.max(1, currentMax - 5))
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
                    value={currentMax}
                    onChange={(e) =>
                      setServiceMax(s.id, Number(e.target.value))
                    }
                    className="w-20 text-center bg-background border-border"
                    data-ocid={`service-max-${s.id}`}
                  />
                  <button
                    type="button"
                    onClick={() => setServiceMax(s.id, currentMax + 5)}
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
            );
          })}
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

      {/* Table Groups */}
      <section
        className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden"
        data-ocid="table-groups-section"
      >
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              {t("settings.tableGroups.title")}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("settings.tableGroups.description")}
          </p>
        </div>

        <div className="px-6 py-5 space-y-3">
          {tableGroups.length === 0 && !showAddGroup && (
            <p
              className="text-sm text-muted-foreground py-2"
              data-ocid="table-groups-empty-state"
            >
              {t("settings.tableGroups.noGroups")}
            </p>
          )}

          {tableGroups.map((group) => {
            const computedCapacity = calcGroupCapacity(group.tableIds);
            const isConfirmingDelete = deletingGroupId === group.id;
            return (
              <div
                key={group.id}
                className="rounded-xl border border-border bg-background px-4 py-3 space-y-3"
                data-ocid={`table-group-row-${group.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0 space-y-2">
                    <Input
                      value={group.name}
                      onChange={(e) =>
                        handleUpdateGroup(group, { name: e.target.value })
                      }
                      className="bg-card border-border h-8 text-sm font-medium"
                      data-ocid={`table-group-name-${group.id}`}
                      aria-label={t("settings.tableGroups.groupName")}
                    />
                    <Input
                      value={group.description}
                      onChange={(e) =>
                        handleUpdateGroup(group, {
                          description: e.target.value,
                        })
                      }
                      placeholder={t(
                        "settings.tableGroups.descriptionPlaceholder",
                      )}
                      className="bg-card border-border h-7 text-xs text-muted-foreground"
                      data-ocid={`table-group-desc-${group.id}`}
                    />
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="secondary"
                      className="text-xs font-semibold tabular-nums"
                      data-ocid={`table-group-capacity-${group.id}`}
                    >
                      {computedCapacity} {t("settings.capacity.guests")}
                    </Badge>
                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDeleteGroup(group.id)}
                          className="px-2 py-1 rounded-lg text-xs font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 transition-colors"
                          data-ocid={`table-group-confirm-delete-${group.id}`}
                        >
                          {t("settings.tableGroups.deleteConfirm")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingGroupId(null)}
                          className="px-2 py-1 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors"
                          data-ocid={`table-group-cancel-delete-${group.id}`}
                        >
                          {t("settings.tableGroups.cancel")}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDeleteGroup(group.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        aria-label={t("settings.tableGroups.deleteConfirm")}
                        data-ocid={`table-group-delete-${group.id}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Table selection chips */}
                <div className="flex flex-wrap gap-1.5">
                  {config.tableTypes.map((tt) => {
                    const selected = group.tableIds.includes(tt.id);
                    return (
                      <button
                        key={tt.id}
                        type="button"
                        onClick={() =>
                          handleUpdateGroup(group, {
                            tableIds: selected
                              ? group.tableIds.filter((id) => id !== tt.id)
                              : [...group.tableIds, tt.id],
                          })
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          selected
                            ? "bg-primary/10 border-primary/40 text-primary"
                            : "bg-muted/30 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                        data-ocid={`table-group-toggle-${group.id}-${tt.id}`}
                      >
                        {tt.name}
                        <span className="ml-1 opacity-60">
                          ({tt.seatsPerTable * tt.count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Add group inline form */}
          {showAddGroup && (
            <div
              className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-4 space-y-3"
              data-ocid="table-group-add-form"
            >
              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground">
                  {t("settings.tableGroups.groupName")}
                </Label>
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder={t("settings.tableGroups.groupNamePlaceholder")}
                  className="bg-card border-border"
                  data-ocid="new-group-name-input"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground">
                  {t("settings.tableGroups.selectTables")}
                  {newGroupTableIds.length > 0 && (
                    <span className="ml-2 text-muted-foreground font-normal">
                      ({t("settings.tableGroups.totalCapacity")}:{" "}
                      {calcGroupCapacity(newGroupTableIds)}{" "}
                      {t("settings.capacity.guests")})
                    </span>
                  )}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {config.tableTypes.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      {t("settings.tableGroups.noTablesHint")}
                    </p>
                  )}
                  {config.tableTypes.map((tt) => (
                    <label
                      key={tt.id}
                      className="flex items-center gap-2 cursor-pointer"
                      data-ocid={`new-group-table-${tt.id}`}
                      htmlFor={`new-group-table-checkbox-${tt.id}`}
                    >
                      <Checkbox
                        id={`new-group-table-checkbox-${tt.id}`}
                        checked={newGroupTableIds.includes(tt.id)}
                        onCheckedChange={() => toggleNewGroupTable(tt.id)}
                        className="border-border"
                      />
                      <span className="text-sm text-foreground">{tt.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({tt.seatsPerTable * tt.count}{" "}
                        {t("settings.capacity.guests")})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium text-foreground">
                  {t("settings.tableGroups.descriptionOptional")}
                </Label>
                <Input
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder={t("settings.tableGroups.descriptionPlaceholder")}
                  className="bg-card border-border"
                  data-ocid="new-group-description-input"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  onClick={handleAddGroup}
                  disabled={
                    !newGroupName.trim() ||
                    newGroupTableIds.length < 2 ||
                    groupSaving
                  }
                  className="gap-2"
                  data-ocid="save-new-group-btn"
                >
                  {groupSaving && (
                    <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  )}
                  {t(groupSaving ? "settings.saving" : "settings.save")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowAddGroup(false);
                    setNewGroupName("");
                    setNewGroupDescription("");
                    setNewGroupTableIds([]);
                  }}
                  data-ocid="cancel-add-group-btn"
                >
                  {t("settings.tableGroups.cancel")}
                </Button>
              </div>
            </div>
          )}

          {!showAddGroup && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddGroup(true)}
              className="gap-2 border-border mt-1"
              data-ocid="add-table-group-btn"
            >
              <Plus className="h-4 w-4" />
              {t("settings.tableGroups.addGroup")}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
