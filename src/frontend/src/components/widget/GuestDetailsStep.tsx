import { cn } from "@/lib/utils";
import type { ReservationFormData } from "@/types";
import { User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface GuestDetailsStepProps {
  form: Partial<ReservationFormData>;
  onChange: (updates: Partial<ReservationFormData>) => void;
}

interface FieldError {
  firstName?: string;
  lastName?: string;
  email?: string;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const inputBase =
  "w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200";

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, required, error, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-xs font-semibold"
        style={{ color: "#374151" }}
      >
        {label}
        {required && (
          <span
            className="ml-0.5"
            style={{ color: "#EF4444" }}
            aria-hidden="true"
          >
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs font-medium"
          style={{ color: "#EF4444" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function GuestDetailsStep({ form, onChange }: GuestDetailsStepProps) {
  const { t } = useTranslation("widget");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showBirthday, setShowBirthday] = useState(false);

  function touch(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  const errors: FieldError = {};
  if (touched.firstName && !form.firstName?.trim()) {
    errors.firstName = t("detailsStep.errors.firstNameRequired");
  }
  if (touched.lastName && !form.lastName?.trim()) {
    errors.lastName = t("detailsStep.errors.lastNameRequired");
  }
  if (touched.email) {
    if (!form.email?.trim()) {
      errors.email = t("detailsStep.errors.emailRequired");
    } else if (!validateEmail(form.email)) {
      errors.email = t("detailsStep.errors.emailInvalid");
    }
  }

  function inputStyle(hasError: boolean, isTouched: boolean) {
    if (hasError) return { borderColor: "#EF4444", backgroundColor: "#FFF5F5" };
    if (isTouched && !hasError)
      return { borderColor: "#22C55E", backgroundColor: "#F0FFF4" };
    return { borderColor: "#E2E8F0", backgroundColor: "#FFFFFF" };
  }

  return (
    <div className="space-y-4">
      <p
        className="text-sm font-semibold flex items-center gap-1.5"
        style={{ color: "#1F2937" }}
      >
        <User className="h-4 w-4" style={{ color: "#22C55E" }} />
        {t("detailsStep.title")}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <Field
          id="firstName"
          label={t("detailsStep.firstName")}
          required
          error={errors.firstName}
        >
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            className={inputBase}
            style={inputStyle(!!errors.firstName, !!touched.firstName)}
            value={form.firstName ?? ""}
            onChange={(e) => onChange({ firstName: e.target.value })}
            onBlur={() => touch("firstName")}
            aria-required="true"
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            data-ocid="input-firstname"
          />
        </Field>

        <Field
          id="lastName"
          label={t("detailsStep.lastName")}
          required
          error={errors.lastName}
        >
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            className={inputBase}
            style={inputStyle(!!errors.lastName, !!touched.lastName)}
            value={form.lastName ?? ""}
            onChange={(e) => onChange({ lastName: e.target.value })}
            onBlur={() => touch("lastName")}
            aria-required="true"
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            data-ocid="input-lastname"
          />
        </Field>
      </div>

      <Field
        id="email"
        label={t("detailsStep.email")}
        required
        error={errors.email}
      >
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={inputBase}
          style={inputStyle(!!errors.email, !!touched.email)}
          value={form.email ?? ""}
          onChange={(e) => onChange({ email: e.target.value })}
          onBlur={() => touch("email")}
          aria-required="true"
          aria-describedby={errors.email ? "email-error" : undefined}
          placeholder={t("detailsStep.emailPlaceholder")}
          data-ocid="input-email"
        />
      </Field>

      <Field id="phone" label={t("detailsStep.phone")}>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          className={inputBase}
          style={{ borderColor: "#E2E8F0", color: "#1F2937" }}
          value={form.phone ?? ""}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder={t("detailsStep.phonePlaceholder")}
          data-ocid="input-phone"
        />
      </Field>

      <Field id="notes" label={t("detailsStep.notes")}>
        <textarea
          id="notes"
          rows={2}
          className={cn(inputBase, "resize-none")}
          style={{ borderColor: "#E2E8F0", color: "#1F2937" }}
          placeholder={t("detailsStep.notesPlaceholder")}
          value={form.notes ?? ""}
          onChange={(e) => onChange({ notes: e.target.value })}
          data-ocid="input-notes"
        />
      </Field>

      {/* Birthday toggle */}
      <label
        className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all"
        style={
          showBirthday
            ? { backgroundColor: "#22C55E0D" }
            : { backgroundColor: "#F9FAFB" }
        }
      >
        <div
          className="h-5 w-9 rounded-full transition-all duration-300 relative flex-shrink-0 mt-0.5"
          style={{ backgroundColor: showBirthday ? "#22C55E" : "#D1D5DB" }}
          aria-hidden="true"
        >
          <div
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-300",
              showBirthday ? "translate-x-4" : "translate-x-0.5",
            )}
          />
        </div>
        <input
          type="checkbox"
          checked={showBirthday}
          onChange={(e) => setShowBirthday(e.target.checked)}
          className="sr-only"
        />
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: "#1F2937" }}>
            🎂 {t("detailsStep.birthday")}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
            {t("detailsStep.birthdaySub")}
          </p>
          {showBirthday && (
            <div className="mt-2">
              <label
                htmlFor="birthday"
                className="block text-xs font-medium mb-1"
                style={{ color: "#374151" }}
              >
                {t("detailsStep.birthdayDate")}
              </label>
              <input
                id="birthday"
                type="date"
                className={cn(inputBase, "text-sm")}
                style={{ borderColor: "#E2E8F0", color: "#1F2937" }}
              />
            </div>
          )}
        </div>
      </label>

      <p className="text-xs" style={{ color: "#9CA3AF" }}>
        <span style={{ color: "#EF4444" }}>*</span> {t("detailsStep.required")}
      </p>
    </div>
  );
}
