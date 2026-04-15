import { ConfirmationStep } from "@/components/widget/ConfirmationStep";
import { DatePickerStep } from "@/components/widget/DatePickerStep";
import { ExperienceStep } from "@/components/widget/ExperienceStep";
import { GuestDetailsStep } from "@/components/widget/GuestDetailsStep";
import { PartySizeStep } from "@/components/widget/PartySizeStep";
import { PaymentStep } from "@/components/widget/PaymentStep";
import { StepIndicator } from "@/components/widget/StepIndicator";
import { TimeSlotStep } from "@/components/widget/TimeSlotStep";
import { WaitlistModal } from "@/components/widget/WaitlistModal";
import { cn } from "@/lib/utils";
import type { ReservationFormData } from "@/types";
import { ChefHat, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

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

  const EXTENDED_STEPS = [
    { id: 1 as const, label: t("dateStep.title") },
    { id: 2 as const, label: t("timeStep.title") },
    { id: 3 as const, label: t("partySizeStep.title") },
    { id: 4 as const, label: t("experienceStep.title") },
    { id: 5 as const, label: t("detailsStep.title") },
    { id: 6 as const, label: t("paymentStep.title") },
  ];

  function goNext() {
    if (step < 6) {
      setSlideDirection("forward");
      setAnimating(true);
      setTimeout(() => {
        setStep((s) => (s + 1) as ExtendedStepId);
        setAnimating(false);
      }, 120);
    }
  }

  function goBack() {
    if (step > 1) {
      setSlideDirection("back");
      setAnimating(true);
      setTimeout(() => {
        setStep((s) => (s - 1) as ExtendedStepId);
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

  const isNextDisabled =
    (step === 1 && !selectedDate) ||
    (step === 2 && !selectedTime) ||
    (step === 5 &&
      (!form.firstName?.trim() ||
        !form.lastName?.trim() ||
        !form.email?.trim()));

  const nextLabel = step === 5 ? t("nav.toPayment") : t("nav.next");

  if (confirmed) {
    return (
      <div
        className="rounded-2xl shadow-elevated overflow-hidden"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="px-6 pt-6 pb-4" style={{ backgroundColor: "#FAF7F0" }}>
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#22C55E1A" }}
            >
              <ChefHat className="h-5 w-5" style={{ color: "#22C55E" }} />
            </div>
            <div>
              <h2
                className="font-semibold text-lg"
                style={{ color: "#1F2937" }}
              >
                Restaurant ZenReserve
              </h2>
              <p className="text-xs" style={{ color: "#6B7280" }}>
                Antwerpen · Grote Markt 1
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
            onReset={handleReset}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="rounded-2xl shadow-elevated overflow-hidden"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        {/* Restaurant header */}
        <div className="px-6 pt-5 pb-4" style={{ backgroundColor: "#FAF7F0" }}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#22C55E1A" }}
            >
              <ChefHat className="h-5 w-5" style={{ color: "#22C55E" }} />
            </div>
            <div className="min-w-0">
              <h1
                className="font-bold text-base leading-tight"
                style={{ color: "#1F2937" }}
              >
                {t("nav.bookTable")}
              </h1>
              <p className="text-xs truncate" style={{ color: "#6B7280" }}>
                Restaurant ZenReserve · Antwerpen
              </p>
            </div>
          </div>

          <StepIndicator steps={EXTENDED_STEPS} currentStep={step} />
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
            <DatePickerStep
              selectedDate={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setSelectedTime("");
              }}
            />
          )}
          {step === 2 && (
            <TimeSlotStep
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              partySize={partySize}
              onSelect={setSelectedTime}
              onWaitlist={() => setShowWaitlist(true)}
            />
          )}
          {step === 3 && (
            <PartySizeStep partySize={partySize} onSelect={setPartySize} />
          )}
          {step === 4 && (
            <ExperienceStep
              selectedExperienceId={selectedExperience}
              onSelect={setSelectedExperience}
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
              onPaymentSuccess={() => setConfirmed(true)}
            />
          )}
        </div>

        {/* Navigation footer */}
        {step !== 6 && (
          <div
            className="flex gap-3 px-6 py-4"
            style={{ borderTop: "1px solid #F3F4F6" }}
          >
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-1 px-4 py-3 rounded-xl border font-medium text-sm transition-all hover:bg-black/5 active:scale-[0.97]"
                style={{ borderColor: "#E2E8F0", color: "#6B7280" }}
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
                "flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-sm transition-all",
                !isNextDisabled
                  ? "hover:opacity-90 active:scale-[0.98]"
                  : "opacity-40 cursor-not-allowed",
              )}
              style={{ backgroundColor: "#22C55E", color: "#FFFFFF" }}
              data-ocid="widget-next-btn"
            >
              {nextLabel}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Book Summary bar (steps 2+) */}
        {step >= 2 && selectedDate && (
          <div
            className="px-6 py-2.5 flex items-center gap-3 flex-wrap"
            style={{
              backgroundColor: "#F9FAFB",
              borderTop: step === 6 ? "1px solid #F3F4F6" : undefined,
            }}
          >
            <SummaryPill
              label={new Date(selectedDate).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
              })}
            />
            {selectedTime && <SummaryPill label={selectedTime} />}
            {step >= 3 && (
              <SummaryPill
                label={`${partySize} ${partySize === 1 ? t("partySizeStep.person") : t("partySizeStep.persons")}`}
              />
            )}
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
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: "#22C55E1A", color: "#22C55E" }}
    >
      {label}
    </span>
  );
}
