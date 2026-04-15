import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type ExceptionalClosingDay,
  type OpeningHoursConfig,
  type ServiceHours,
  useOpeningHoursConfig,
  useUpdateClosingDays,
  useUpdateServiceHours,
} from "@/hooks/useSettings";
import { CalendarX, Clock, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
const DAY_KEYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function DayCheckbox({
  day,
  checked,
  onChange,
  labelKey,
}: {
  day: number;
  checked: boolean;
  onChange: (day: number, checked: boolean) => void;
  labelKey: DayKey;
}) {
  const { t } = useTranslation("dashboard");
  const id = `day-check-${labelKey}`;
  return (
    <div className="flex flex-col items-center gap-1">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(day, e.target.checked)}
        className="sr-only"
        data-ocid={id}
      />
      <label
        htmlFor={id}
        className={`h-8 w-8 rounded-lg border-2 flex items-center justify-center text-xs font-semibold transition-all cursor-pointer ${
          checked
            ? "border-primary bg-primary/10 text-primary"
            : "border-border bg-background text-muted-foreground hover:border-primary/40"
        }`}
      >
        {t(`settings.days.${labelKey}`).charAt(0)}
      </label>
      <span className="text-[10px] font-medium text-muted-foreground">
        {t(`settings.days.${labelKey}`)}
      </span>
    </div>
  );
}

function ServiceRow({
  service,
  onChange,
  onDelete,
}: {
  service: ServiceHours;
  onChange: (s: ServiceHours) => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation("dashboard");

  const toggleDay = (day: number, isChecked: boolean) => {
    const days = isChecked
      ? [...service.enabledDays, day].sort()
      : service.enabledDays.filter((d) => d !== day);
    onChange({ ...service, enabledDays: days });
  };

  return (
    <div className="rounded-xl border border-border bg-background p-4 space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[160px] space-y-1">
          <Label className="text-xs text-muted-foreground">
            {t("settings.openingHours.serviceName")}
          </Label>
          <Input
            value={service.name}
            onChange={(e) => onChange({ ...service, name: e.target.value })}
            placeholder="Lunch"
            className="bg-card border-border h-8 text-sm"
            data-ocid={`service-name-${service.id}`}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            {t("settings.openingHours.openTime")}
          </Label>
          <input
            type="time"
            value={service.openTime}
            onChange={(e) => onChange({ ...service, openTime: e.target.value })}
            className="h-8 rounded-md border border-border bg-card px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            data-ocid={`service-open-${service.id}`}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            {t("settings.openingHours.closeTime")}
          </Label>
          <input
            type="time"
            value={service.closeTime}
            onChange={(e) =>
              onChange({ ...service, closeTime: e.target.value })
            }
            className="h-8 rounded-md border border-border bg-card px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            data-ocid={`service-close-${service.id}`}
          />
        </div>
        <div className="space-y-1 w-24">
          <Label className="text-xs text-muted-foreground">
            {t("settings.openingHours.maxCapacity")}
          </Label>
          <Input
            type="number"
            min={1}
            max={999}
            value={service.maxCapacity}
            onChange={(e) =>
              onChange({ ...service, maxCapacity: Number(e.target.value) })
            }
            className="bg-card border-border h-8 text-sm"
            data-ocid={`service-capacity-${service.id}`}
          />
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="self-end h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          aria-label={t("settings.openingHours.deleteService")}
          data-ocid={`service-delete-${service.id}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">
          {t("settings.openingHours.enabledDays")}
        </p>
        <div className="flex gap-2 flex-wrap">
          {DAY_KEYS.map((key, i) => (
            <DayCheckbox
              key={key}
              day={i}
              checked={service.enabledDays.includes(i)}
              onChange={toggleDay}
              labelKey={key}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OpeningHoursSettingsPage() {
  const { t } = useTranslation("dashboard");
  const { data, isLoading } = useOpeningHoursConfig();
  const updateServiceHours = useUpdateServiceHours();
  const updateClosingDays = useUpdateClosingDays();

  const [config, setConfig] = useState<OpeningHoursConfig>({
    services: [],
    fixedClosingDays: [],
    exceptionalClosingDays: [],
  });
  const [newServiceName, setNewServiceName] = useState("");
  const [newExDate, setNewExDate] = useState("");
  const [newExReason, setNewExReason] = useState("");

  useEffect(() => {
    if (data) setConfig(data);
  }, [data]);

  const updateService = (id: string, updated: ServiceHours) => {
    setConfig((c) => ({
      ...c,
      services: c.services.map((s) => (s.id === id ? updated : s)),
    }));
  };

  const addService = () => {
    const name = newServiceName.trim();
    if (!name) return;
    const id = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    setConfig((c) => ({
      ...c,
      services: [
        ...c.services,
        {
          id,
          name,
          openTime: "12:00",
          closeTime: "14:00",
          maxCapacity: 40,
          enabledDays: [0, 1, 2, 3, 4],
        },
      ],
    }));
    setNewServiceName("");
  };

  const deleteService = (id: string) => {
    setConfig((c) => ({
      ...c,
      services: c.services.filter((s) => s.id !== id),
    }));
  };

  const toggleFixedDay = (day: number, isChecked: boolean) => {
    setConfig((c) => ({
      ...c,
      fixedClosingDays: isChecked
        ? [...c.fixedClosingDays, day].sort()
        : c.fixedClosingDays.filter((d) => d !== day),
    }));
  };

  const addExceptionalDay = () => {
    if (!newExDate) return;
    const entry: ExceptionalClosingDay = {
      id: Date.now().toString(),
      date: newExDate,
      reason: newExReason.trim(),
    };
    setConfig((c) => ({
      ...c,
      exceptionalClosingDays: [...c.exceptionalClosingDays, entry],
    }));
    setNewExDate("");
    setNewExReason("");
  };

  const deleteExceptionalDay = (id: string) => {
    setConfig((c) => ({
      ...c,
      exceptionalClosingDays: c.exceptionalClosingDays.filter(
        (d) => d.id !== id,
      ),
    }));
  };

  const [isSaving, setIsSaving] = useState(false);

  const saveAll = async () => {
    setIsSaving(true);
    try {
      await updateServiceHours.mutateAsync(config.services);
      await updateClosingDays.mutateAsync({
        fixedClosingDays: config.fixedClosingDays,
        exceptionalClosingDays: config.exceptionalClosingDays,
      });
      toast.success(t("settings.saved"));
    } catch {
      toast.error(t("settings.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleServiceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addService();
    }
  };

  const handleExDayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addExceptionalDay();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8" data-ocid="opening-hours-page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {t("settings.nav.openingHours")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("settings.openingHours.subtitle")}
          </p>
        </div>
      </div>

      {/* Services */}
      <section className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {t("settings.openingHours.services")}
          </h2>
          <span className="text-xs text-muted-foreground">
            {config.services.length} {t("settings.openingHours.servicesCount")}
          </span>
        </div>

        <div className="px-6 py-5 space-y-4">
          {config.services.map((s) => (
            <ServiceRow
              key={s.id}
              service={s}
              onChange={(updated) => updateService(s.id, updated)}
              onDelete={() => deleteService(s.id)}
            />
          ))}

          <div className="flex items-center gap-2">
            <Input
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder={t("settings.openingHours.newServicePlaceholder")}
              className="bg-background border-border"
              onKeyDown={handleServiceKeyDown}
              data-ocid="new-service-name"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addService}
              disabled={!newServiceName.trim()}
              className="shrink-0 gap-2 border-border"
              data-ocid="add-service-btn"
            >
              <Plus className="h-4 w-4" />
              {t("settings.openingHours.addService")}
            </Button>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end">
          <Button
            type="button"
            onClick={saveAll}
            disabled={isSaving}
            className="gap-2"
            data-ocid="save-services-btn"
          >
            {isSaving && (
              <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            )}
            {t(isSaving ? "settings.saving" : "settings.save")}
          </Button>
        </div>
      </section>

      {/* Fixed closing days */}
      <section className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {t("settings.openingHours.fixedClosingDays")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("settings.openingHours.fixedClosingDaysHint")}
          </p>
        </div>

        <div className="px-6 py-5">
          <div className="flex gap-3 flex-wrap">
            {DAY_KEYS.map((key, i) => (
              <DayCheckbox
                key={key}
                day={i}
                checked={config.fixedClosingDays.includes(i)}
                onChange={toggleFixedDay}
                labelKey={key}
              />
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end">
          <Button
            type="button"
            onClick={saveAll}
            disabled={isSaving}
            className="gap-2"
            data-ocid="save-fixed-days-btn"
          >
            {isSaving && (
              <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            )}
            {t(isSaving ? "settings.saving" : "settings.save")}
          </Button>
        </div>
      </section>

      {/* Exceptional closing days */}
      <section className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {t("settings.openingHours.exceptionalDays")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("settings.openingHours.exceptionalDaysHint")}
          </p>
        </div>

        <div className="px-6 py-5 space-y-4">
          {config.exceptionalClosingDays.length === 0 && (
            <div className="flex items-center gap-3 py-4 text-sm text-muted-foreground">
              <CalendarX className="h-4 w-4 shrink-0" />
              {t("settings.openingHours.noExceptionalDays")}
            </div>
          )}

          {config.exceptionalClosingDays.map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background"
              data-ocid={`exceptional-day-${d.id}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{d.date}</p>
                {d.reason && (
                  <p className="text-xs text-muted-foreground truncate">
                    {d.reason}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => deleteExceptionalDay(d.id)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                aria-label={t("settings.openingHours.deleteExceptionalDay")}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {/* Add exceptional day */}
          <div className="flex items-end gap-2 flex-wrap">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                {t("settings.openingHours.exceptionalDate")}
              </Label>
              <input
                type="date"
                value={newExDate}
                onChange={(e) => setNewExDate(e.target.value)}
                className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                data-ocid="exceptional-date-input"
              />
            </div>
            <div className="flex-1 min-w-[160px] space-y-1">
              <Label className="text-xs text-muted-foreground">
                {t("settings.openingHours.exceptionalReason")}
              </Label>
              <Input
                value={newExReason}
                onChange={(e) => setNewExReason(e.target.value)}
                onKeyDown={handleExDayKeyDown}
                placeholder={t("settings.openingHours.reasonPlaceholder")}
                className="bg-background border-border"
                data-ocid="exceptional-reason-input"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addExceptionalDay}
              disabled={!newExDate}
              className="shrink-0 gap-2 border-border"
              data-ocid="add-exceptional-day-btn"
            >
              <Plus className="h-4 w-4" />
              {t("settings.openingHours.addExceptionalDay")}
            </Button>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end">
          <Button
            type="button"
            onClick={saveAll}
            disabled={isSaving}
            className="gap-2"
            data-ocid="save-exceptional-days-btn"
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
