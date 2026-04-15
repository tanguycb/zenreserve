import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  ChevronDown,
  ChevronUp,
  ClipboardList,
  GripVertical,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CustomQuestion {
  id: string;
  labelText: string;
  type: "text" | "dropdown";
  options: string[];
  required: boolean;
}

export interface GuestFormConfig {
  requirePhone: boolean;
  requireAllergies: boolean;
  requireDietPreferences: boolean;
  enabledSpecialRequests: string[];
  customQuestions: CustomQuestion[];
}

const SPECIAL_REQUESTS = [
  "birthday",
  "anniversary",
  "highchair",
  "windowTable",
  "accessibleSeating",
  "quietTable",
] as const;

const STORAGE_KEY = "zenreserve_guest_form";

function loadConfig(): GuestFormConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as GuestFormConfig;
  } catch {
    // ignore
  }
  return {
    requirePhone: true,
    requireAllergies: false,
    requireDietPreferences: false,
    enabledSpecialRequests: ["birthday", "anniversary", "highchair"],
    customQuestions: [],
  };
}

function saveConfig(cfg: GuestFormConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {
    // ignore
  }
}

function genId() {
  return `q_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden">
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

interface ToggleRowProps {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
  ocid?: string;
}

function ToggleRow({
  id,
  label,
  hint,
  checked,
  onCheckedChange,
  ocid,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
      <div className="min-w-0">
        <Label
          htmlFor={id}
          className="text-sm font-medium text-foreground cursor-pointer"
        >
          {label}
        </Label>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        data-ocid={ocid}
      />
    </div>
  );
}

// ── Custom Question Editor ────────────────────────────────────────────────────

interface QuestionEditorProps {
  question: CustomQuestion;
  index: number;
  total: number;
  onChange: (q: CustomQuestion) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function QuestionEditor({
  question,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: QuestionEditorProps) {
  const { t } = useTranslation("dashboard");
  const [optionsInput, setOptionsInput] = useState(question.options.join(", "));

  const set = <K extends keyof CustomQuestion>(
    key: K,
    value: CustomQuestion[K],
  ) => {
    onChange({ ...question, [key]: value });
  };

  const handleOptionsBlur = () => {
    const opts = optionsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    set("options", opts);
  };

  return (
    <div
      className="rounded-xl border border-border bg-background p-4 space-y-3"
      data-ocid={`custom-question-${index}`}
    >
      {/* Header row */}
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
        <span className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5">
          {t("settings.guestForm.questionLabel", { n: index + 1 })}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            aria-label={t("settings.guestForm.moveUp")}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-30 transition-colors"
            data-ocid={`question-move-up-${index}`}
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            aria-label={t("settings.guestForm.moveDown")}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-30 transition-colors"
            data-ocid={`question-move-down-${index}`}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={t("settings.guestForm.deleteQuestion")}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            data-ocid={`question-delete-${index}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Label text */}
      <div className="space-y-1.5">
        <Label
          htmlFor={`q-label-${question.id}`}
          className="text-xs font-medium text-muted-foreground"
        >
          {t("settings.guestForm.questionText")}
        </Label>
        <Input
          id={`q-label-${question.id}`}
          value={question.labelText}
          onChange={(e) => set("labelText", e.target.value)}
          placeholder={t("settings.guestForm.questionTextPlaceholder")}
          className="bg-card border-border text-sm"
          data-ocid={`question-label-${index}`}
        />
      </div>

      {/* Type + Required */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label
            htmlFor={`q-type-${question.id}`}
            className="text-xs font-medium text-muted-foreground"
          >
            {t("settings.guestForm.questionType")}
          </Label>
          <select
            id={`q-type-${question.id}`}
            value={question.type}
            onChange={(e) =>
              set("type", e.target.value as CustomQuestion["type"])
            }
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            data-ocid={`question-type-${index}`}
          >
            <option value="text">{t("settings.guestForm.typeText")}</option>
            <option value="dropdown">
              {t("settings.guestForm.typeDropdown")}
            </option>
          </select>
        </div>

        <div className="flex items-end pb-0.5">
          <div className="flex items-center gap-2 w-full">
            <Switch
              id={`q-required-${question.id}`}
              checked={question.required}
              onCheckedChange={(v) => set("required", v)}
              data-ocid={`question-required-${index}`}
            />
            <Label
              htmlFor={`q-required-${question.id}`}
              className="text-xs font-medium text-foreground cursor-pointer"
            >
              {t("settings.guestForm.required")}
            </Label>
          </div>
        </div>
      </div>

      {/* Options — only if dropdown */}
      {question.type === "dropdown" && (
        <div className="space-y-1.5">
          <Label
            htmlFor={`q-opts-${question.id}`}
            className="text-xs font-medium text-muted-foreground"
          >
            {t("settings.guestForm.dropdownOptions")}
          </Label>
          <Input
            id={`q-opts-${question.id}`}
            value={optionsInput}
            onChange={(e) => setOptionsInput(e.target.value)}
            onBlur={handleOptionsBlur}
            placeholder={t("settings.guestForm.dropdownOptionsPlaceholder")}
            className="bg-card border-border text-sm"
            data-ocid={`question-options-${index}`}
          />
          <p className="text-xs text-muted-foreground">
            {t("settings.guestForm.dropdownOptionsHint")}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function GuestFormSettingsPage() {
  const { t } = useTranslation("dashboard");
  const [config, setConfig] = useState<GuestFormConfig>(loadConfig);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setConfig(loadConfig());
    setIsDirty(false);
  }, []);

  const update = <K extends keyof GuestFormConfig>(
    key: K,
    value: GuestFormConfig[K],
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const toggleSpecialRequest = (key: string) => {
    const current = config.enabledSpecialRequests;
    const next = current.includes(key)
      ? current.filter((k) => k !== key)
      : [...current, key];
    update("enabledSpecialRequests", next);
  };

  const addQuestion = () => {
    const newQ: CustomQuestion = {
      id: genId(),
      labelText: "",
      type: "text",
      options: [],
      required: false,
    };
    update("customQuestions", [...config.customQuestions, newQ]);
  };

  const updateQuestion = (index: number, q: CustomQuestion) => {
    const next = [...config.customQuestions];
    next[index] = q;
    update("customQuestions", next);
  };

  const deleteQuestion = (index: number) => {
    update(
      "customQuestions",
      config.customQuestions.filter((_, i) => i !== index),
    );
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    const next = [...config.customQuestions];
    const target = direction === "up" ? index - 1 : index + 1;
    [next[index], next[target]] = [next[target], next[index]];
    update("customQuestions", next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      saveConfig(config);
      setIsDirty(false);
      toast.success(t("settings.saved"));
    } catch {
      toast.error(t("settings.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6" data-ocid="guest-form-settings-page">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <ClipboardList className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {t("settings.nav.guestForm")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("settings.guestForm.subtitle")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1 — Required fields */}
        <SectionCard
          title={t("settings.guestForm.requiredFieldsTitle")}
          subtitle={t("settings.guestForm.requiredFieldsSubtitle")}
        >
          <ToggleRow
            id="req-phone"
            label={t("settings.guestForm.requirePhone")}
            hint={t("settings.guestForm.requirePhoneHint")}
            checked={config.requirePhone}
            onCheckedChange={(v) => update("requirePhone", v)}
            ocid="guest-form-require-phone"
          />
          <ToggleRow
            id="req-allergies"
            label={t("settings.guestForm.requireAllergies")}
            hint={t("settings.guestForm.requireAllergiesHint")}
            checked={config.requireAllergies}
            onCheckedChange={(v) => update("requireAllergies", v)}
            ocid="guest-form-require-allergies"
          />
          <ToggleRow
            id="req-diet"
            label={t("settings.guestForm.requireDietPreferences")}
            hint={t("settings.guestForm.requireDietHint")}
            checked={config.requireDietPreferences}
            onCheckedChange={(v) => update("requireDietPreferences", v)}
            ocid="guest-form-require-diet"
          />
        </SectionCard>

        {/* Section 2 — Standard special requests */}
        <SectionCard
          title={t("settings.guestForm.specialRequestsTitle")}
          subtitle={t("settings.guestForm.specialRequestsSubtitle")}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1">
            {SPECIAL_REQUESTS.map((key) => {
              const checked = config.enabledSpecialRequests.includes(key);
              return (
                <label
                  key={key}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/40 cursor-pointer transition-colors"
                  data-ocid={`special-request-${key}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSpecialRequest(key)}
                    className="h-4 w-4 rounded border-border bg-background accent-primary"
                  />
                  <span className="text-sm text-foreground">
                    {t(`settings.guestForm.specialRequest.${key}`)}
                  </span>
                </label>
              );
            })}
          </div>
        </SectionCard>

        {/* Section 3 — Custom questions */}
        <SectionCard
          title={t("settings.guestForm.customQuestionsTitle")}
          subtitle={t("settings.guestForm.customQuestionsSubtitle")}
        >
          <div className="space-y-3">
            {config.customQuestions.length === 0 && (
              <div
                className="text-center py-8 rounded-xl border border-dashed border-border"
                data-ocid="custom-questions-empty"
              >
                <ClipboardList className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t("settings.guestForm.noCustomQuestions")}
                </p>
              </div>
            )}

            {config.customQuestions.map((q, i) => (
              <QuestionEditor
                key={q.id}
                question={q}
                index={i}
                total={config.customQuestions.length}
                onChange={(updated) => updateQuestion(i, updated)}
                onDelete={() => deleteQuestion(i)}
                onMoveUp={() => moveQuestion(i, "up")}
                onMoveDown={() => moveQuestion(i, "down")}
              />
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 border-dashed"
              onClick={addQuestion}
              data-ocid="add-custom-question-btn"
            >
              <Plus className="h-4 w-4" />
              {t("settings.guestForm.addQuestion")}
            </Button>
          </div>
        </SectionCard>

        {/* Footer save bar */}
        <div className="rounded-2xl border border-border bg-card px-6 py-4 flex items-center justify-between gap-4">
          {isDirty && (
            <p className="text-xs text-muted-foreground">
              {t("settings.unsavedChanges")}
            </p>
          )}
          <div className="ml-auto">
            <Button
              type="submit"
              disabled={isSaving || !isDirty}
              className="gap-2"
              data-ocid="guest-form-save-btn"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? t("settings.saving") : t("settings.save")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
