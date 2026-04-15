import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Lock,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface PaymentStepProps {
  partySize: number;
  onPaymentSuccess: () => void;
}

const DEPOSIT_PER_PERSON = 20; // EUR

function formatEur(amount: number) {
  return `€${amount.toFixed(2).replace(".", ",")}`;
}

export function PaymentStep({ partySize, onPaymentSuccess }: PaymentStepProps) {
  const { t } = useTranslation("widget");
  const totalDeposit = partySize * DEPOSIT_PER_PERSON;
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  }

  function formatCvc(value: string) {
    return value.replace(/\D/g, "").slice(0, 4);
  }

  const isFormValid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiry.length === 5 &&
    cvc.length >= 3 &&
    name.trim().length > 2;

  async function handlePay() {
    if (!isFormValid) return;
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 1800));
    // Simulate success 90% of the time
    if (Math.random() > 0.1) {
      setSuccess(true);
      setLoading(false);
      setTimeout(onPaymentSuccess, 1200);
    } else {
      setError(t("paymentStep.errorDefault"));
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-6 space-y-3">
        <div
          className="mx-auto h-14 w-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#22C55E1A" }}
        >
          <CheckCircle2 className="h-8 w-8" style={{ color: "#22C55E" }} />
        </div>
        <div>
          <p className="font-bold" style={{ color: "#1F2937" }}>
            {t("paymentStep.successTitle")}
          </p>
          <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
            {t("paymentStep.successSub", { amount: formatEur(totalDeposit) })}
          </p>
        </div>
        <div
          className="h-1 w-24 mx-auto rounded-full overflow-hidden"
          style={{ backgroundColor: "#E2E8F0" }}
        >
          <div
            className="h-full rounded-full animate-[grow_1.2s_ease-out_forwards]"
            style={{ backgroundColor: "#22C55E" }}
          />
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200";

  return (
    <div className="space-y-4">
      {/* Deposit summary */}
      <div
        className="rounded-xl p-4 flex items-center justify-between"
        style={{ backgroundColor: "#FAF7F0", borderLeft: "3px solid #D97706" }}
      >
        <div>
          <p className="text-xs font-medium" style={{ color: "#6B7280" }}>
            {t("paymentStep.deposit")}
          </p>
          <p className="font-bold text-lg mt-0.5" style={{ color: "#1F2937" }}>
            {formatEur(totalDeposit)}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
            {partySize} {t("paymentStep.depositNote")} ×{" "}
            {formatEur(DEPOSIT_PER_PERSON)}
          </p>
        </div>
        <div
          className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "#D977061A" }}
        >
          <Shield className="h-6 w-6" style={{ color: "#D97706" }} />
        </div>
      </div>

      {/* Card form */}
      <div className="space-y-3">
        <div className="space-y-1">
          <label
            htmlFor="card-name"
            className="block text-xs font-semibold"
            style={{ color: "#374151" }}
          >
            {t("paymentStep.cardName")}
          </label>
          <input
            id="card-name"
            type="text"
            className={inputClass}
            style={{ borderColor: "#E2E8F0", color: "#1F2937" }}
            placeholder="Jan Jansen"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="cc-name"
            data-ocid="input-card-name"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="card-number"
            className="block text-xs font-semibold"
            style={{ color: "#374151" }}
          >
            {t("paymentStep.cardNumber")}
          </label>
          <div className="relative">
            <input
              id="card-number"
              type="text"
              inputMode="numeric"
              className={cn(inputClass, "pr-10")}
              style={{ borderColor: "#E2E8F0", color: "#1F2937" }}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              autoComplete="cc-number"
              data-ocid="input-card-number"
            />
            <CreditCard
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: "#9CA3AF" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label
              htmlFor="card-expiry"
              className="block text-xs font-semibold"
              style={{ color: "#374151" }}
            >
              {t("paymentStep.expiry")}
            </label>
            <input
              id="card-expiry"
              type="text"
              inputMode="numeric"
              className={inputClass}
              style={{ borderColor: "#E2E8F0", color: "#1F2937" }}
              placeholder="MM/JJ"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              autoComplete="cc-exp"
              data-ocid="input-card-expiry"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="card-cvc"
              className="block text-xs font-semibold"
              style={{ color: "#374151" }}
            >
              {t("paymentStep.cvc")}
            </label>
            <input
              id="card-cvc"
              type="text"
              inputMode="numeric"
              className={inputClass}
              style={{ borderColor: "#E2E8F0", color: "#1F2937" }}
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(formatCvc(e.target.value))}
              autoComplete="cc-csc"
              data-ocid="input-card-cvc"
            />
          </div>
        </div>
      </div>

      {error && (
        <div
          className="flex items-start gap-2 p-3 rounded-xl"
          style={{ backgroundColor: "#FEF2F2" }}
          role="alert"
        >
          <AlertCircle
            className="h-4 w-4 flex-shrink-0 mt-0.5"
            style={{ color: "#EF4444" }}
          />
          <p className="text-sm" style={{ color: "#EF4444" }}>
            {error}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handlePay}
        disabled={!isFormValid || loading}
        className={cn(
          "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200",
          isFormValid && !loading
            ? "hover:opacity-90 active:scale-[0.98]"
            : "opacity-50 cursor-not-allowed",
        )}
        style={{ backgroundColor: "#22C55E", color: "#FFFFFF" }}
        data-ocid="payment-submit-btn"
      >
        <Lock className="h-4 w-4" />
        {loading
          ? t("paymentStep.processing")
          : t("paymentStep.payButton", { amount: formatEur(totalDeposit) })}
      </button>

      <p
        className="text-center text-xs flex items-center justify-center gap-1"
        style={{ color: "#9CA3AF" }}
      >
        <Lock className="h-3 w-3" />
        {t("paymentStep.secureNote")}
      </p>
    </div>
  );
}
