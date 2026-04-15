import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  type ReservationRulesConfig,
  useReservationRules,
  useUpdateReservationRules,
} from "@/hooks/useSettings";
import {
  AlertCircle,
  Clock,
  CreditCard,
  ScrollText,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// ── Default fallback ──────────────────────────────────────────────────────────

const DEFAULT_RULES: ReservationRulesConfig = {
  advanceBookingDays: 90,
  cancellationHoursBeforeFree: 24,
  depositRequired: false,
  depositAmountEur: 25,
  depositRequiredAbovePartySize: 6,
  noShowFeeEur: 15,
  minPartySize: 1,
  maxPartySize: 20,
  maxStayMinutesLunch: 90,
  maxStayMinutesDinner: 120,
};

// ── Sub-components ────────────────────────────────────────────────────────────

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onSave: () => void;
  saveLabel: string;
  savingLabel: string;
  isSaving: boolean;
  ocid: string;
}

function Section({
  icon,
  title,
  subtitle,
  children,
  onSave,
  saveLabel,
  savingLabel,
  isSaving,
  ocid,
}: SectionProps) {
  return (
    <section
      className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden"
      data-ocid={ocid}
    >
      <div className="px-6 py-5 border-b border-border flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
      <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end">
        <Button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="gap-2"
          data-ocid={`${ocid}-save`}
        >
          {isSaving && (
            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          )}
          {isSaving ? savingLabel : saveLabel}
        </Button>
      </div>
    </section>
  );
}

interface NumberFieldProps {
  id: string;
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  suffix?: string;
  ocid: string;
}

function NumberField({
  id,
  label,
  hint,
  value,
  min,
  max,
  onChange,
  suffix,
  ocid,
}: NumberFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <div className="flex items-center gap-2">
        <Input
          id={id}
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="bg-background border-border w-32"
          data-ocid={ocid}
        />
        {suffix && (
          <span className="text-sm text-muted-foreground">{suffix}</span>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ReservationRulesSettingsPage() {
  const { t } = useTranslation("dashboard");
  const { data, isLoading } = useReservationRules();
  const updateRules = useUpdateReservationRules();

  const [config, setConfig] = useState<ReservationRulesConfig>(DEFAULT_RULES);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data) setConfig(data);
  }, [data]);

  const set = <K extends keyof ReservationRulesConfig>(
    key: K,
    value: ReservationRulesConfig[K],
  ) => setConfig((c) => ({ ...c, [key]: value }));

  const saveAll = async () => {
    setIsSaving(true);
    try {
      await updateRules.mutateAsync(config);
      toast.success(t("settings.saved"));
    } catch {
      toast.error(t("settings.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const rr = t("settings.reservationRules", { returnObjects: true }) as Record<
    string,
    string
  >;

  const sectionProps = {
    onSave: saveAll,
    saveLabel: t("settings.save"),
    savingLabel: t("settings.saving"),
    isSaving,
  };

  return (
    <div
      className="max-w-3xl space-y-8"
      data-ocid="reservation-rules-settings-page"
    >
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <ScrollText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {t("settings.nav.reservationRules")}
          </h1>
          <p className="text-sm text-muted-foreground">{rr.subtitle}</p>
        </div>
      </div>

      {/* Advance booking window */}
      <Section
        {...sectionProps}
        icon={<Clock className="h-4 w-4 text-primary" />}
        title={rr.advanceBookingTitle}
        subtitle={rr.advanceBookingSubtitle}
        ocid="advance-booking-section"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">
                {rr.advanceBookingDays}
              </Label>
              <span className="text-xl font-bold text-primary tabular-nums">
                {config.advanceBookingDays}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {rr.days}
                </span>
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={365}
              step={1}
              value={config.advanceBookingDays}
              onChange={(e) =>
                set("advanceBookingDays", Number(e.target.value))
              }
              className="w-full h-2 accent-primary cursor-pointer"
              aria-label={rr.advanceBookingDays}
              data-ocid="advance-booking-slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 {rr.day}</span>
              <span>30 {rr.days}</span>
              <span>90 {rr.days}</span>
              <span>365 {rr.days}</span>
            </div>
          </div>

          <NumberField
            id="cancellationHours"
            label={rr.cancellationHours}
            hint={rr.cancellationHoursHint}
            value={config.cancellationHoursBeforeFree}
            min={0}
            max={168}
            onChange={(v) => set("cancellationHoursBeforeFree", v)}
            suffix={rr.hours}
            ocid="cancellation-hours"
          />
        </div>
      </Section>

      {/* Deposit & no-show */}
      <Section
        {...sectionProps}
        icon={<CreditCard className="h-4 w-4 text-primary" />}
        title={rr.depositTitle}
        subtitle={rr.depositSubtitle}
        ocid="deposit-section"
      >
        <div className="space-y-6">
          {/* Deposit toggle */}
          <div className="flex items-center justify-between gap-4 py-2 px-4 rounded-xl border border-border bg-background">
            <div>
              <p className="text-sm font-medium text-foreground">
                {rr.depositRequired}
              </p>
              <p className="text-xs text-muted-foreground">
                {rr.depositRequiredHint}
              </p>
            </div>
            <Switch
              checked={config.depositRequired}
              onCheckedChange={(v) => set("depositRequired", v)}
              data-ocid="deposit-required-toggle"
            />
          </div>

          {/* Conditional deposit fields */}
          {config.depositRequired && (
            <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-primary/30">
              <NumberField
                id="depositAmount"
                label={rr.depositAmount}
                hint={rr.depositAmountHint}
                value={config.depositAmountEur}
                min={0}
                max={500}
                onChange={(v) => set("depositAmountEur", v)}
                suffix="€"
                ocid="deposit-amount"
              />
              <NumberField
                id="depositAboveParty"
                label={rr.depositAboveParty}
                hint={rr.depositAbovePartyHint}
                value={config.depositRequiredAbovePartySize}
                min={1}
                max={50}
                onChange={(v) => set("depositRequiredAbovePartySize", v)}
                suffix={rr.persons}
                ocid="deposit-above-party"
              />
            </div>
          )}

          {/* No-show fee */}
          <NumberField
            id="noShowFee"
            label={rr.noShowFee}
            hint={rr.noShowFeeHint}
            value={config.noShowFeeEur}
            min={0}
            max={500}
            onChange={(v) => set("noShowFeeEur", v)}
            suffix="€"
            ocid="no-show-fee"
          />

          {config.noShowFeeEur > 0 && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-500/90">{rr.noShowFeeNote}</p>
            </div>
          )}
        </div>
      </Section>

      {/* Party size */}
      <Section
        {...sectionProps}
        icon={<Users className="h-4 w-4 text-primary" />}
        title={rr.partySizeTitle}
        subtitle={rr.partySizeSubtitle}
        ocid="party-size-section"
      >
        <div className="grid grid-cols-2 gap-6">
          <NumberField
            id="minParty"
            label={rr.minPartySize}
            value={config.minPartySize}
            min={1}
            max={config.maxPartySize}
            onChange={(v) => set("minPartySize", v)}
            suffix={rr.persons}
            ocid="min-party-size"
          />
          <NumberField
            id="maxParty"
            label={rr.maxPartySize}
            value={config.maxPartySize}
            min={config.minPartySize}
            max={50}
            onChange={(v) => set("maxPartySize", v)}
            suffix={rr.persons}
            ocid="max-party-size"
          />
        </div>
      </Section>

      {/* Max stay duration */}
      <Section
        {...sectionProps}
        icon={<Clock className="h-4 w-4 text-primary" />}
        title={rr.maxStayTitle}
        subtitle={rr.maxStaySubtitle}
        ocid="max-stay-section"
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">
                {rr.maxStayLunch}
              </Label>
              <span className="text-lg font-bold text-primary tabular-nums">
                {config.maxStayMinutesLunch}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  {rr.minutes}
                </span>
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={240}
              step={15}
              value={config.maxStayMinutesLunch}
              onChange={(e) =>
                set("maxStayMinutesLunch", Number(e.target.value))
              }
              className="w-full h-2 accent-primary cursor-pointer"
              aria-label={rr.maxStayLunch}
              data-ocid="max-stay-lunch-slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>30 {rr.minutes}</span>
              <span>120 {rr.minutes}</span>
              <span>240 {rr.minutes}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">
                {rr.maxStayDinner}
              </Label>
              <span className="text-lg font-bold text-primary tabular-nums">
                {config.maxStayMinutesDinner}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  {rr.minutes}
                </span>
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={300}
              step={15}
              value={config.maxStayMinutesDinner}
              onChange={(e) =>
                set("maxStayMinutesDinner", Number(e.target.value))
              }
              className="w-full h-2 accent-primary cursor-pointer"
              aria-label={rr.maxStayDinner}
              data-ocid="max-stay-dinner-slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>30 {rr.minutes}</span>
              <span>150 {rr.minutes}</span>
              <span>300 {rr.minutes}</span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
