import { useAddToWaitlist } from "@/hooks/useDashboard";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Clock, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: string;
  partySize?: number;
}

const TIME_OPTIONS = [
  "12:00",
  "12:30",
  "13:00",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
] as const;

export function WaitlistModal({
  isOpen,
  onClose,
  selectedDate,
  partySize,
}: WaitlistModalProps) {
  const { t } = useTranslation(["widget", "shared"]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [size, setSize] = useState(partySize ?? 2);
  const [success, setSuccess] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const addToWaitlist = useAddToWaitlist();

  // Focus first input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset form state when modal re-opens
  const resetMutation = addToWaitlist.reset;
  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      resetMutation();
    }
  }, [isOpen, resetMutation]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;

    const date = selectedDate ?? new Date().toISOString().split("T")[0];

    await addToWaitlist.mutateAsync(
      {
        guestName: name,
        guestEmail: email,
        guestPhone: phone || undefined,
        partySize: size,
        date,
        requestedTime: preferredTime || undefined,
        notes: "",
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(onClose, 2200);
        },
      },
    );
  }

  if (!isOpen) return null;

  const inputClass =
    "w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#3B82F6]/30";

  return (
    <dialog
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent max-w-none w-full h-full m-0"
      open={isOpen}
      aria-labelledby="waitlist-title"
    >
      {/* Backdrop */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click-to-close is supplemental; Escape key handler covers keyboard */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl shadow-elevated overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            backgroundColor: "#FAF7F0",
            borderBottom: "1px solid #E2E8F0",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#3B82F61A" }}
            >
              <Clock className="h-4 w-4" style={{ color: "#3B82F6" }} />
            </div>
            <div>
              <h2
                id="waitlist-title"
                className="font-bold text-sm"
                style={{ color: "#1F2937" }}
              >
                {t("widget:waitlist.title")}
              </h2>
              <p className="text-xs" style={{ color: "#6B7280" }}>
                {t("widget:waitlist.subtitle")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("shared:actions.close")}
            className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors hover:bg-black/5"
            style={{ color: "#6B7280" }}
            data-ocid="waitlist.close_button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-5">
          {success ? (
            <div
              className="text-center py-6 space-y-4"
              data-ocid="waitlist.success_state"
            >
              <div
                className="mx-auto h-16 w-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#22C55E1A" }}
              >
                <CheckCircle2
                  className="h-9 w-9"
                  style={{ color: "#22C55E" }}
                />
              </div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: "#1F2937" }}>
                  {t("widget:waitlist.joinButton")}!
                </h3>
                <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                  {t("widget:confirmationStep.confirmationSent", { email })}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: "#22C55E", color: "#FFFFFF" }}
                data-ocid="waitlist.close_button"
              >
                {t("shared:actions.close")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              <div className="space-y-1">
                <label
                  htmlFor="wl-name"
                  className="block text-xs font-semibold"
                  style={{ color: "#374151" }}
                >
                  {t("widget:detailsStep.firstName")} *
                </label>
                <input
                  ref={firstInputRef}
                  id="wl-name"
                  type="text"
                  required
                  className={inputClass}
                  style={{ borderColor: "#E2E8F0", color: "#1F2937" }}
                  placeholder="Jan Jansen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-ocid="waitlist.input"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="wl-email"
                  className="block text-xs font-semibold"
                  style={{ color: "#374151" }}
                >
                  {t("widget:detailsStep.email")} *
                </label>
                <input
                  id="wl-email"
                  type="email"
                  required
                  className={inputClass}
                  style={{ borderColor: "#E2E8F0", color: "#1F2937" }}
                  placeholder={t("widget:detailsStep.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-ocid="waitlist.input"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="wl-phone"
                  className="block text-xs font-semibold"
                  style={{ color: "#374151" }}
                >
                  {t("widget:detailsStep.phone")}
                </label>
                <input
                  id="wl-phone"
                  type="tel"
                  className={inputClass}
                  style={{ borderColor: "#E2E8F0", color: "#1F2937" }}
                  placeholder={t("widget:detailsStep.phonePlaceholder")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  data-ocid="waitlist.input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="wl-time"
                    className="block text-xs font-semibold"
                    style={{ color: "#374151" }}
                  >
                    {t("widget:timeStep.title")}
                  </label>
                  <select
                    id="wl-time"
                    className={cn(inputClass, "appearance-none cursor-pointer")}
                    style={{
                      borderColor: "#E2E8F0",
                      color: preferredTime ? "#1F2937" : "#9CA3AF",
                    }}
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    data-ocid="waitlist.select"
                  >
                    <option value="">
                      {t("widget:experienceStep.noPreference")}
                    </option>
                    {TIME_OPTIONS.map((timeOpt) => (
                      <option key={timeOpt} value={timeOpt}>
                        {timeOpt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="wl-size"
                    className="block text-xs font-semibold"
                    style={{ color: "#374151" }}
                  >
                    {t("widget:partySizeStep.title")}
                  </label>
                  <select
                    id="wl-size"
                    className={cn(inputClass, "appearance-none cursor-pointer")}
                    style={{ borderColor: "#E2E8F0", color: "#1F2937" }}
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    data-ocid="waitlist.select"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Error state */}
              {addToWaitlist.isError && (
                <div
                  className="flex items-start gap-2 p-3 rounded-xl"
                  style={{ backgroundColor: "#FEF2F2" }}
                  role="alert"
                  data-ocid="waitlist.error_state"
                >
                  <AlertCircle
                    className="h-4 w-4 flex-shrink-0 mt-0.5"
                    style={{ color: "#EF4444" }}
                  />
                  <p className="text-sm" style={{ color: "#EF4444" }}>
                    {addToWaitlist.error?.message ??
                      t("shared:errors.genericError")}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border font-medium text-sm transition-all hover:bg-black/5"
                  style={{ borderColor: "#E2E8F0", color: "#6B7280" }}
                  data-ocid="waitlist.cancel_button"
                >
                  {t("shared:actions.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={!name || !email || addToWaitlist.isPending}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                    name && email && !addToWaitlist.isPending
                      ? "hover:opacity-90 active:scale-[0.98]"
                      : "opacity-50 cursor-not-allowed",
                  )}
                  style={{ backgroundColor: "#3B82F6", color: "#FFFFFF" }}
                  data-ocid="waitlist.submit_button"
                >
                  {addToWaitlist.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("shared:actions.loading")}
                    </>
                  ) : (
                    t("widget:waitlist.joinButton")
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}
