import { ConfirmationStep } from "@/components/widget/ConfirmationStep";
import { DatePickerStep } from "@/components/widget/DatePickerStep";
import { ExperienceStep } from "@/components/widget/ExperienceStep";
import { GuestDetailsStep } from "@/components/widget/GuestDetailsStep";
import { PartySizeStep } from "@/components/widget/PartySizeStep";
import { PaymentStep } from "@/components/widget/PaymentStep";
import { StepIndicator } from "@/components/widget/StepIndicator";
import { TimeSlotStep } from "@/components/widget/TimeSlotStep";
import { WaitlistModal } from "@/components/widget/WaitlistModal";
import { useExperiences } from "@/hooks/useDashboard";
import { useAvailableSlots } from "@/hooks/useReservation";
import {
  useGeneralInfo,
  useGuestFormSettings,
  useOpeningHoursConfig,
} from "@/hooks/useSettings";
import { cn } from "@/lib/utils";
import type { ReservationFormData } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { ChefHat, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// Dynamic step IDs — experience step only exists when experiences are configured
type ExtendedStepId = 1 | 2 | 3 | 4 | 5 | 6;

interface WidgetPageProps {
  /** Pre-fill date and skip ahead (used when embedding in /app) */
  initialDate?: string;
  /** Pre-fill time (used when embedding in /app) */
  initialTime?: string;
  /** Pre-fill party size (used when embedding in /app) */
  initialPartySize?: number;
  /** Jump to a specific step (1-6). Defaults to 1. */
  initialStep?: ExtendedStepId;
}

export default function WidgetPage({
  initialDate = "",
  initialTime = "",
  initialPartySize = 2,
  initialStep = 1,
}: WidgetPageProps) {
  const { t } = useTranslation("widget");
  const [step, setStep] = useState<ExtendedStepId>(initialStep);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string>(initialTime);
  const [partySize, setPartySize] = useState<number>(initialPartySize);
  const [selectedExperience, setSelectedExperience] = useState<string>("");
  const [form, setForm] = useState<Partial<ReservationFormData>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [confirmed, setConfirmed] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"forward" | "back">(
    "forward",
  );
  const [animating, setAnimating] = useState(false);
  const queryClient = useQueryClient();

  // Fetch real closing days from backend
  const { data: openingHoursConfig } = useOpeningHoursConfig();
  // Fetch real restaurant info from backend (BUG-004 / VIS-003)
  const { data: generalInfo } = useGeneralInfo();
  // Fetch experiences to decide whether to show experience step
  const { data: experiences } = useExperiences();
  // Fetch guest form settings to know if babies/children toggle is visible
  const { data: guestFormSettings } = useGuestFormSettings();

  const restaurantName = generalInfo?.restaurantName ?? "";
  const restaurantAddress = [
    generalInfo?.contactPhone,
    generalInfo?.contactEmail,
  ]
    .filter(Boolean)
    .join(" · ");

  // Active experiences visible in widget, filtered by date + time/service
  const activeExperiences = useMemo(() => {
    const all = (experiences ?? []).filter((e) => e.available);
    if (!selectedDate && !selectedTime) return all;

    const dayOfWeek = selectedDate ? new Date(selectedDate).getDay() : -1;
    const hour = selectedTime
      ? Number.parseInt(selectedTime.split(":")[0] ?? "0", 10)
      : -1;
    const serviceId = hour >= 0 ? (hour < 17 ? "lunch" : "diner") : "";

    return all.filter((exp) => {
      if (exp.serviceIds && exp.serviceIds.length > 0 && serviceId) {
        if (!exp.serviceIds.includes(serviceId)) return false;
      }
      if (exp.dayOfWeek && exp.dayOfWeek.length > 0 && dayOfWeek >= 0) {
        if (!exp.dayOfWeek.includes(dayOfWeek)) return false;
      }
      return true;
    });
  }, [experiences, selectedDate, selectedTime]);
  const hasExperiences = activeExperiences.length > 0;
  // If any experience is required, guest must pick one (no skip)
  const hasRequiredExperience = activeExperiences.some((e) => e.required);

  // Build dynamic step list: steps 1-3 always present, step 4 (experience) only if needed
  const STEPS = useMemo(() => {
    const base: Array<{ id: ExtendedStepId; label: string }> = [
      { id: 1, label: t("partySizeStep.title") },
      { id: 2, label: t("dateStep.title") },
      { id: 3, label: t("timeStep.title") },
    ];
    if (hasExperiences) {
      base.push({ id: 4, label: t("experienceStep.title") });
    }
    base.push(
      { id: 5, label: t("detailsStep.title") },
      { id: 6, label: t("paymentStep.title") },
    );
    return base;
  }, [hasExperiences, t]);

  // Map real step position (1..N) for progress indicator
  // step IDs: 1=partySize, 2=date, 3=time, 4=experience(conditional), 5=details, 6=payment
  const progressStep = useMemo(() => {
    if (!hasExperiences && step >= 5) return step - 1; // shift down when no exp step
    return step;
  }, [hasExperiences, step]);

  // BUG 2 fix: fetch real available slots when date and partySize are set
  const { data: availableSlots, isFetching: slotsFetching } = useAvailableSlots(
    selectedDate,
    partySize,
  );

  // Navigate to next step, skipping step 4 if no experiences
  function getNextStep(current: ExtendedStepId): ExtendedStepId {
    if (current === 3 && !hasExperiences) return 5;
    if (current < 6) return (current + 1) as ExtendedStepId;
    return current;
  }

  function getPrevStep(current: ExtendedStepId): ExtendedStepId {
    if (current === 5 && !hasExperiences) return 3;
    if (current > 1) return (current - 1) as ExtendedStepId;
    return current;
  }

  function goNext() {
    const next = getNextStep(step);
    if (next !== step) {
      setSlideDirection("forward");
      setAnimating(true);
      setTimeout(() => {
        setStep(next);
        setAnimating(false);
      }, 120);
    }
  }

  function goBack() {
    const prev = getPrevStep(step);
    if (prev !== step) {
      setSlideDirection("back");
      setAnimating(true);
      setTimeout(() => {
        // When going back to step 3 (time slots), invalidate slots
        if (prev === 3) {
          queryClient.invalidateQueries({
            queryKey: ["availableSlots", selectedDate, partySize],
          });
        }
        setStep(prev);
        setAnimating(false);
      }, 120);
    }
  }

  function handleReset() {
    setStep(1);
    setSelectedDate("");
    setSelectedTime("");
    setPartySize(2);
    setSelectedExperience("");
    setForm({ firstName: "", lastName: "", email: "", phone: "", notes: "" });
    setConfirmed(false);
  }

  // Step 4 (experience): if required, guest must pick one; if all optional, can skip
  const experienceValid =
    step !== 4 || !hasRequiredExperience || selectedExperience !== "";

  const isNextDisabled =
    (step === 1 && partySize < 1) ||
    (step === 2 && !selectedDate) ||
    (step === 3 && !selectedTime) ||
    (step === 4 && !experienceValid) ||
    (step === 5 &&
      (!form.firstName?.trim() ||
        !form.lastName?.trim() ||
        !form.email?.trim()));

  const nextLabel = step === 5 ? t("nav.toPayment") : t("nav.next");

  if (confirmed) {
    return (
      <div className="rounded-2xl shadow-elevated overflow-hidden bg-card">
        <div className="px-6 pt-6 pb-4 bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-primary/10">
              <ChefHat className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-foreground">
                {restaurantName || t("nav.bookTable")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {generalInfo?.contactPhone ?? ""}
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-6">
          <ConfirmationStep
            date={selectedDate}
            time={selectedTime}
            partySize={partySize}
            form={form}
            experienceId={selectedExperience}
            restaurantName={restaurantName}
            restaurantAddress={restaurantAddress}
            onReset={handleReset}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl shadow-elevated overflow-hidden bg-card">
        {/* Restaurant header */}
        <div className="px-6 pt-5 pb-4 bg-muted/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10">
              <ChefHat className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-base leading-tight text-foreground">
                {t("nav.bookTable")}
              </h1>
              <p className="text-xs truncate text-muted-foreground">
                {restaurantName}
              </p>
            </div>
          </div>

          <StepIndicator steps={STEPS} currentStep={progressStep} />
        </div>

        {/* Step content */}
        <div
          className={cn(
            "px-6 py-5 min-h-[320px] transition-all duration-200",
            animating &&
              (slideDirection === "forward"
                ? "opacity-0 translate-x-2"
                : "opacity-0 -translate-x-2"),
            !animating && "opacity-100 translate-x-0",
          )}
        >
          {step === 1 && (
            <PartySizeStep
              partySize={partySize}
              onSelect={setPartySize}
              showBabiesChildren={guestFormSettings?.showBabiesChildren ?? true}
            />
          )}
          {step === 2 && (
            <DatePickerStep
              selectedDate={selectedDate}
              fixedClosingDays={openingHoursConfig?.fixedClosingDays ?? []}
              exceptionalClosingDays={
                openingHoursConfig?.exceptionalClosingDays?.map(
                  (d) => d.date,
                ) ?? []
              }
              onSelect={(date) => {
                setSelectedDate(date);
                setSelectedTime("");
              }}
            />
          )}
          {step === 3 && (
            <TimeSlotStep
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              partySize={partySize}
              onSelect={setSelectedTime}
              onWaitlist={() => setShowWaitlist(true)}
              availableSlots={availableSlots}
              isLoading={slotsFetching}
              services={openingHoursConfig?.services}
            />
          )}
          {step === 4 && hasExperiences && (
            <ExperienceStep
              selectedExperienceId={selectedExperience}
              onSelect={setSelectedExperience}
              experiences={activeExperiences.map((e) => {
                const parts: string[] = [];
                if (e.serviceIds && e.serviceIds.length > 0) {
                  parts.push(
                    e.serviceIds
                      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                      .join(", "),
                  );
                }
                return {
                  id: e.id,
                  name: e.name,
                  description: e.description,
                  price: e.price,
                  available: e.available,
                  required: e.required,
                  restrictionNote:
                    parts.length > 0 ? parts.join(" · ") : undefined,
                };
              })}
              hasRequired={hasRequiredExperience}
            />
          )}
          {step === 5 && (
            <GuestDetailsStep
              form={form}
              onChange={(updates) => setForm((f) => ({ ...f, ...updates }))}
            />
          )}
          {step === 6 && (
            <PaymentStep
              partySize={partySize}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              experienceId={selectedExperience || undefined}
              guestDetails={
                form.firstName
                  ? {
                      firstName: form.firstName,
                      lastName: form.lastName,
                      email: form.email ?? "",
                      phone: form.phone,
                    }
                  : undefined
              }
              specialRequests={form.notes || undefined}
              onPaymentSuccess={() => setConfirmed(true)}
            />
          )}
        </div>

        {/* Navigation footer */}
        {step !== 6 && (
          <div className="flex gap-3 px-6 py-4 border-t border-border">
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-1 px-4 py-3 rounded-xl border border-border font-medium text-sm transition-all hover:bg-muted active:scale-[0.97] text-muted-foreground"
                data-ocid="widget-back-btn"
              >
                <ChevronLeft className="h-4 w-4" />
                {t("nav.back")}
              </button>
            ) : (
              <div className="flex-1" />
            )}
            <button
              type="button"
              onClick={goNext}
              disabled={isNextDisabled}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-sm transition-all bg-primary text-primary-foreground",
                !isNextDisabled
                  ? "hover:opacity-90 active:scale-[0.98]"
                  : "opacity-40 cursor-not-allowed",
              )}
              data-ocid="widget-next-btn"
            >
              {nextLabel}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Book Summary bar (steps 2+) */}
        {step >= 2 && (
          <div
            className={cn(
              "px-6 py-2.5 flex items-center gap-3 flex-wrap bg-muted/30",
              step === 6 && "border-t border-border",
            )}
          >
            <SummaryPill
              label={`${partySize} ${partySize === 1 ? t("partySizeStep.person") : t("partySizeStep.persons")}`}
            />
            {selectedDate && (
              <SummaryPill
                label={new Date(selectedDate).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                })}
              />
            )}
            {selectedTime && <SummaryPill label={selectedTime} />}
          </div>
        )}
      </div>

      <WaitlistModal
        isOpen={showWaitlist}
        onClose={() => setShowWaitlist(false)}
        partySize={partySize}
      />
    </>
  );
}

function SummaryPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
      {label}
    </span>
  );
}
