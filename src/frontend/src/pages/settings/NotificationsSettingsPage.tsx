import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DEFAULT_TEMPLATES,
  type EmailTemplate,
  type HouseStylePayload,
  type TemplateType,
  useApplyHouseStyleToAll,
  useEmailTemplates,
  useResetEmailTemplate,
  useSaveEmailTemplate,
} from "@/hooks/useEmailTemplates";
import {
  type ReviewRequestDelay,
  useReviewRequests,
} from "@/hooks/useReviewRequests";
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "@/hooks/useSettings";
import {
  AlertCircle,
  Bell,
  Bold,
  CheckCircle2,
  ChevronDown,
  Clock,
  Italic,
  List,
  Mail,
  MessageSquare,
  Paintbrush,
  RotateCcw,
  Save,
  Star,
  Underline,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NotificationSettings {
  sendConfirmationEmail: boolean;
  sendReminderEmail: boolean;
  reminderHoursBefore: number[];
  sendCancellationEmail: boolean;
  waitlistAutoActivate: boolean;
}

const MOCK_DATA = {
  guest_name: "Jan Janssen",
  date: "15 april 2026",
  time: "19:00",
  party_size: "4 personen",
  restaurant_name: "Restaurant Demo",
  reservation_id: "#RES-001",
};

const TEMPLATE_VARS: Array<{ key: string; label: string }> = [
  { key: "{{guest_name}}", label: "{{guest_name}}" },
  { key: "{{date}}", label: "{{date}}" },
  { key: "{{time}}", label: "{{time}}" },
  { key: "{{party_size}}", label: "{{party_size}}" },
  { key: "{{restaurant_name}}", label: "{{restaurant_name}}" },
  { key: "{{reservation_id}}", label: "{{reservation_id}}" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const DEFAULT_NOTIF_SETTINGS: NotificationSettings = {
  sendConfirmationEmail: true,
  sendReminderEmail: true,
  reminderHoursBefore: [24],
  sendCancellationEmail: true,
  waitlistAutoActivate: true,
};

function replaceMockVars(html: string): string {
  return html
    .replace(/\{\{guest_name\}\}/g, MOCK_DATA.guest_name)
    .replace(/\{\{date\}\}/g, MOCK_DATA.date)
    .replace(/\{\{time\}\}/g, MOCK_DATA.time)
    .replace(/\{\{party_size\}\}/g, MOCK_DATA.party_size)
    .replace(/\{\{restaurant_name\}\}/g, MOCK_DATA.restaurant_name)
    .replace(/\{\{reservation_id\}\}/g, MOCK_DATA.reservation_id);
}

// ── RichTextEditor ────────────────────────────────────────────────────────────

function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showVarMenu, setShowVarMenu] = useState(false);
  const savedRange = useRef<Range | null>(null);
  const { t } = useTranslation("dashboard");

  const lastExternal = useRef<string>(value);
  useEffect(() => {
    if (editorRef.current && value !== lastExternal.current) {
      editorRef.current.innerHTML = value;
      lastExternal.current = value;
    }
  }, [value]);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = lastExternal.current;
    }
  }, []);

  const execCmd = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastExternal.current = html;
      onChange(html);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastExternal.current = html;
      onChange(html);
    }
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const insertVar = (varKey: string) => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (savedRange.current) {
      sel?.removeAllRanges();
      sel?.addRange(savedRange.current);
    }
    document.execCommand("insertText", false, varKey);
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastExternal.current = html;
      onChange(html);
    }
    setShowVarMenu(false);
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-background focus-within:ring-2 focus-within:ring-primary/40">
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-muted/30">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("bold");
          }}
          className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title={t("settings.notifications.editor.bold")}
          data-ocid="rte-bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("italic");
          }}
          className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title={t("settings.notifications.editor.italic")}
          data-ocid="rte-italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCmd("underline");
          }}
          className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title={t("settings.notifications.editor.underline")}
          data-ocid="rte-underline"
        >
          <Underline className="h-3.5 w-3.5" />
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={() => setShowVarMenu((v) => !v)}
            className="flex items-center gap-1 h-7 px-2 rounded hover:bg-muted transition-colors text-xs text-muted-foreground hover:text-foreground"
            data-ocid="rte-vars-trigger"
          >
            {t("settings.notifications.editor.insertVar")}
            <ChevronDown className="h-3 w-3" />
          </button>
          {showVarMenu && (
            <div className="absolute top-full left-0 mt-1 z-20 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[180px]">
              {TEMPLATE_VARS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => insertVar(key)}
                  className="flex w-full items-center px-3 py-2 text-xs hover:bg-muted transition-colors text-left font-mono text-primary/80"
                  data-ocid={`rte-var-${key}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={saveSelection}
        data-placeholder={placeholder}
        className="min-h-[140px] max-h-[280px] overflow-y-auto px-4 py-3 text-sm text-foreground outline-none [&_p]:mb-2 [&_p:empty]:hidden empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/60 empty:before:pointer-events-none"
        data-ocid="rte-body"
      />
    </div>
  );
}

// ── Color Picker ──────────────────────────────────────────────────────────────

function ColorPicker({
  label,
  value,
  onChange,
  ocid,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  ocid: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-9 w-9 shrink-0">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          data-ocid={`${ocid}-native`}
          aria-label={label}
        />
        <div
          className="h-9 w-9 rounded-lg border-2 border-border shadow-sm cursor-pointer"
          style={{ backgroundColor: value }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <Label className="text-xs text-muted-foreground mb-1 block">
          {label}
        </Label>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={7}
          className="h-8 font-mono text-xs bg-background"
          data-ocid={ocid}
        />
      </div>
    </div>
  );
}

// ── Logo Uploader ─────────────────────────────────────────────────────────────

function LogoUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const { t } = useTranslation("dashboard");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("settings.notifications.logoTooLarge"));
      return;
    }
    setIsUploading(true);
    try {
      const modulePath = "@caffeineai/object-storage";
      // biome-ignore lint/suspicious/noExplicitAny: runtime extension import
      const mod = await import(/* @vite-ignore */ modulePath).catch(
        () => null as unknown as Record<string, unknown>,
      );
      const uploadFn =
        mod && typeof (mod as Record<string, unknown>).uploadFile === "function"
          ? ((mod as Record<string, unknown>).uploadFile as (
              f: File,
              opts: Record<string, unknown>,
            ) => Promise<string>)
          : null;
      if (uploadFn) {
        onChange(await uploadFn(file, { folder: "email-logos", public: true }));
      } else {
        onChange(URL.createObjectURL(file));
      }
    } catch {
      onChange(URL.createObjectURL(file));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">
        {t("settings.notifications.editor.logo")}
      </Label>
      {value ? (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20">
          <img
            src={value}
            alt="logo preview"
            className="h-10 max-w-[120px] object-contain rounded"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">
              {t("settings.notifications.editor.logoUploaded")}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
            className="shrink-0 text-destructive hover:text-destructive"
            data-ocid="logo-remove"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) uploadFile(file);
          }}
          onClick={() => !isUploading && fileRef.current?.click()}
          disabled={isUploading}
          className={`relative w-full flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
            isDragging
              ? "border-primary/60 bg-primary/5"
              : "border-border hover:border-primary/40 hover:bg-muted/20"
          }`}
          data-ocid="logo-dropzone"
        >
          {isUploading ? (
            <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          ) : (
            <Upload className="h-5 w-5 text-muted-foreground" />
          )}
          <p className="text-xs text-muted-foreground text-center">
            {isUploading
              ? t("settings.notifications.editor.logoUploading", {
                  defaultValue: "Uploading…",
                })
              : t("settings.notifications.editor.logoDragHint")}
          </p>
          <p className="text-xs text-muted-foreground/60">
            {t("settings.notifications.editor.logoSizeLimit")}
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file);
            }}
            data-ocid="logo-file-input"
          />
        </button>
      )}
    </div>
  );
}

// ── Email Preview ─────────────────────────────────────────────────────────────

function EmailPreview({ template }: { template: EmailTemplate }) {
  const { t } = useTranslation("dashboard");
  const subject = replaceMockVars(template.subject);
  const heading = replaceMockVars(template.heading);
  const bodyHtml = replaceMockVars(template.bodyHtml);
  const footer = replaceMockVars(template.footer);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">
          {t("settings.notifications.editor.preview")}
        </h3>
        <Badge variant="secondary" className="text-xs ml-auto">
          {t("settings.notifications.editor.previewMockBadge")}
        </Badge>
      </div>

      <div
        className="rounded-2xl overflow-hidden border border-border shadow-sm"
        style={{
          backgroundColor: template.backgroundColor || "var(--background)",
        }}
        data-ocid="email-preview"
      >
        <div className="px-4 py-2.5 bg-muted/40 border-b border-border">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {t("settings.notifications.editor.subjectLabel")}:
            </span>{" "}
            {subject || (
              <span className="italic opacity-60">
                {t("settings.notifications.editor.subjectPlaceholder")}
              </span>
            )}
          </p>
        </div>

        <div className="p-6">
          {template.logoUrl && (
            <div className="flex justify-center mb-5">
              <img
                src={template.logoUrl}
                alt="restaurant logo"
                className="h-12 max-w-[160px] object-contain"
              />
            </div>
          )}

          <div
            className="h-1 rounded-full mb-5"
            style={{ backgroundColor: template.accentColor || "var(--accent)" }}
          />

          {heading && (
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: template.accentColor || "var(--accent)" }}
            >
              {heading}
            </h2>
          )}

          <div
            className="text-sm leading-relaxed text-foreground [&_p]:mb-3 [&_strong]:font-semibold"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled template HTML
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          {footer && (
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                {footer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Apply-to-All Modal ────────────────────────────────────────────────────────

const TEMPLATE_LABELS: Record<TemplateType, string> = {
  confirmation: "Bevestiging",
  reminder_24h: "Herinnering 24u",
  reminder_2h: "Herinnering 2u",
  cancellation: "Annulering",
};

const ALL_TEMPLATE_TYPES: TemplateType[] = [
  "confirmation",
  "reminder_24h",
  "reminder_2h",
  "cancellation",
];

function ApplyAllModal({
  open,
  onOpenChange,
  houseStyle,
  allTemplates,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  houseStyle: HouseStylePayload;
  allTemplates: Record<TemplateType, EmailTemplate>;
}) {
  const { t } = useTranslation("dashboard");
  const applyAll = useApplyHouseStyleToAll();
  const [isApplying, setIsApplying] = useState(false);

  const handleConfirm = async () => {
    setIsApplying(true);
    try {
      await applyAll.mutateAsync(houseStyle);
      toast.success(t("settings.notifications.applyAll.successToast"));
      onOpenChange(false);
    } catch {
      toast.error(t("settings.saveError"));
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl" data-ocid="apply-all-modal">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5 text-primary" />
            {t("settings.notifications.applyAll.modalTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("settings.notifications.applyAll.modalDesc")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Before/After comparison */}
        <div className="rounded-xl border border-border overflow-hidden my-2">
          <div className="grid grid-cols-2 divide-x divide-border">
            {/* Before */}
            <div className="p-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t("settings.notifications.applyAll.beforeLabel")}
              </p>
              {ALL_TEMPLATE_TYPES.map((type) => {
                const tpl = allTemplates[type];
                return (
                  <div key={type} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full border border-border shrink-0"
                      style={{ backgroundColor: tpl.accentColor }}
                    />
                    <div
                      className="h-3 w-8 rounded border border-border shrink-0"
                      style={{ backgroundColor: tpl.backgroundColor }}
                    />
                    {tpl.logoUrl ? (
                      <img
                        src={tpl.logoUrl}
                        alt=""
                        className="h-4 max-w-[40px] object-contain rounded"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground/50">
                        —
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground truncate">
                      {TEMPLATE_LABELS[type]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* After */}
            <div className="p-4 space-y-3 bg-primary/5">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                {t("settings.notifications.applyAll.afterLabel")}
              </p>
              {ALL_TEMPLATE_TYPES.map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full border border-border shrink-0"
                    style={{ backgroundColor: houseStyle.accentColor }}
                  />
                  <div
                    className="h-3 w-8 rounded border border-border shrink-0"
                    style={{ backgroundColor: houseStyle.backgroundColor }}
                  />
                  {houseStyle.logoUrl ? (
                    <img
                      src={houseStyle.logoUrl}
                      alt=""
                      className="h-4 max-w-[40px] object-contain rounded"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground/50">—</span>
                  )}
                  <span className="text-xs text-foreground font-medium truncate">
                    {TEMPLATE_LABELS[type]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Style summary bar */}
          <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div
                className="h-5 w-5 rounded border border-border"
                style={{ backgroundColor: houseStyle.accentColor }}
              />
              <span className="text-xs text-muted-foreground">
                {t("settings.notifications.applyAll.accentColorLabel")}:{" "}
                <span className="font-mono text-foreground">
                  {houseStyle.accentColor}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-5 w-5 rounded border border-border"
                style={{ backgroundColor: houseStyle.backgroundColor }}
              />
              <span className="text-xs text-muted-foreground">
                {t("settings.notifications.applyAll.bgColorLabel")}:{" "}
                <span className="font-mono text-foreground">
                  {houseStyle.backgroundColor}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {t("settings.notifications.applyAll.logoLabel")}:{" "}
                {houseStyle.logoUrl ? (
                  <img
                    src={houseStyle.logoUrl}
                    alt=""
                    className="inline h-4 max-w-[60px] object-contain rounded ml-1"
                  />
                ) : (
                  <span className="text-muted-foreground/60">
                    {t("settings.notifications.applyAll.noLogo")}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isApplying} data-ocid="apply-all-cancel">
            {t("settings.notifications.applyAll.cancelBtn")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isApplying}
            className="gap-2"
            data-ocid="apply-all-confirm"
          >
            {isApplying ? (
              <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            {t("settings.notifications.applyAll.confirmBtn")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ── Template Editor (single tab) ──────────────────────────────────────────────

function TemplateEditor({
  templateType,
  template,
  onChange,
}: {
  templateType: TemplateType;
  template: EmailTemplate;
  onChange: (t: EmailTemplate) => void;
}) {
  const { t } = useTranslation("dashboard");
  const saveTemplate = useSaveEmailTemplate();
  const resetTemplate = useResetEmailTemplate();
  const [isSaving, setIsSaving] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const set = <K extends keyof EmailTemplate>(
    key: K,
    value: EmailTemplate[K],
  ) => {
    onChange({ ...template, [key]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveTemplate.mutateAsync(template);
      toast.success(t("settings.notifications.editor.savedToast"));
    } catch {
      toast.error(t("settings.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      await resetTemplate.mutateAsync(templateType);
      onChange({ id: templateType, ...DEFAULT_TEMPLATES[templateType] });
      setShowReset(false);
      toast.success(t("settings.notifications.editor.resetToast"));
    } catch {
      toast.error(t("settings.saveError"));
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ── Left: editor fields ── */}
        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">
              {t("settings.notifications.editor.subject")}
            </Label>
            <Input
              value={template.subject}
              onChange={(e) => set("subject", e.target.value)}
              placeholder={t(
                "settings.notifications.editor.subjectPlaceholder",
              )}
              className="bg-background"
              data-ocid="template-subject"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">
              {t("settings.notifications.editor.heading")}
            </Label>
            <Input
              value={template.heading}
              onChange={(e) => set("heading", e.target.value)}
              placeholder={t(
                "settings.notifications.editor.headingPlaceholder",
              )}
              className="bg-background"
              data-ocid="template-heading"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">
              {t("settings.notifications.editor.body")}
            </Label>
            <RichTextEditor
              value={template.bodyHtml}
              onChange={(v) => set("bodyHtml", v)}
              placeholder={t("settings.notifications.editor.bodyPlaceholder")}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">
              {t("settings.notifications.editor.footer")}
            </Label>
            <textarea
              value={template.footer}
              onChange={(e) => set("footer", e.target.value)}
              rows={3}
              placeholder={t("settings.notifications.editor.footerPlaceholder")}
              className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
              data-ocid="template-footer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ColorPicker
              label={t("settings.notifications.editor.accentColor")}
              value={template.accentColor}
              onChange={(v) => set("accentColor", v)}
              ocid="template-accent-color"
            />
            <ColorPicker
              label={t("settings.notifications.editor.backgroundColor")}
              value={template.backgroundColor}
              onChange={(v) => set("backgroundColor", v)}
              ocid="template-bg-color"
            />
          </div>

          <LogoUploader
            value={template.logoUrl}
            onChange={(v) => set("logoUrl", v)}
          />

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2 flex-1"
              data-ocid="save-template-btn"
            >
              <Save className="h-4 w-4" />
              {isSaving
                ? t("settings.saving")
                : t("settings.notifications.editor.save")}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowReset(true)}
              className="gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/40"
              data-ocid="reset-template-btn"
            >
              <RotateCcw className="h-4 w-4" />
              {t("settings.notifications.editor.reset")}
            </Button>
          </div>
        </div>

        {/* ── Right: live preview ── */}
        <div className="xl:sticky xl:top-6 xl:self-start">
          <EmailPreview template={template} />
        </div>
      </div>

      <AlertDialog open={showReset} onOpenChange={setShowReset}>
        <AlertDialogContent data-ocid="reset-confirm-modal">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("settings.notifications.editor.resetConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("settings.notifications.editor.resetConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="reset-cancel">
              {t("settings.notifications.editor.resetCancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="reset-confirm"
            >
              {t("settings.notifications.editor.resetConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ── Toggle row ────────────────────────────────────────────────────────────────

function ToggleRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  icon,
  ocid,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  icon: React.ReactNode;
  ocid: string;
}) {
  return (
    <div className="flex items-start gap-4 py-4">
      <div className="h-9 w-9 rounded-xl bg-muted/40 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <Label
          htmlFor={id}
          className="text-sm font-medium text-foreground cursor-pointer"
        >
          {label}
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        data-ocid={ocid}
        className="shrink-0"
      />
    </div>
  );
}

const PRESET_HOURS = [1, 2, 3, 6, 12, 24, 48, 72];

function ReminderTagInput({
  value,
  onChange,
}: {
  value: number[];
  onChange: (v: number[]) => void;
}) {
  const { t } = useTranslation("dashboard");
  const [inputVal, setInputVal] = useState("");

  const addHour = (h: number) => {
    if (!value.includes(h)) onChange([...value, h].sort((a, b) => a - b));
  };
  const removeHour = (h: number) => onChange(value.filter((v) => v !== h));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const parsed = Number.parseInt(inputVal, 10);
      if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 720) {
        addHour(parsed);
        setInputVal("");
      }
    }
    if (e.key === "Backspace" && inputVal === "" && value.length > 0) {
      removeHour(value[value.length - 1]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 min-h-[36px]">
        {value.map((h) => (
          <span
            key={h}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/15 border border-primary/30 text-primary text-sm font-medium"
          >
            {h}h
            <button
              type="button"
              onClick={() => removeHour(h)}
              className="ml-0.5 hover:text-destructive transition-colors"
              aria-label={t("settings.notifications.removeHour", { h })}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {value.length === 0 && (
          <span className="text-xs text-muted-foreground self-center">
            {t("settings.notifications.noReminderHours")}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PRESET_HOURS.map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => (value.includes(h) ? removeHour(h) : addHour(h))}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
              value.includes(h)
                ? "bg-primary/15 border-primary/40 text-primary"
                : "bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
            data-ocid={`reminder-preset-${h}`}
          >
            {h}u
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={720}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("settings.notifications.customHourPlaceholder")}
          className="w-32 h-8 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          data-ocid="reminder-custom-input"
        />
        <span className="text-xs text-muted-foreground">
          {t("settings.notifications.customHourHint")}
        </span>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const REVIEW_DELAY_OPTIONS: Array<{
  value: ReviewRequestDelay;
  labelKey: string;
}> = [
  { value: "hour1", labelKey: "settings.reviewRequests.delay1h" },
  { value: "hour2", labelKey: "settings.reviewRequests.delay2h" },
  { value: "hour24", labelKey: "settings.reviewRequests.delay24h" },
];

const REVIEW_MOCK = {
  guest_name: "Jan Janssen",
  restaurant_name: "Restaurant Demo",
};

export default function NotificationsSettingsPage() {
  const { t } = useTranslation("dashboard");

  const { data: remoteTemplates, isLoading: isLoadingTemplates } =
    useEmailTemplates();
  const { data: remoteNotif } = useNotificationSettings();
  const updateNotifications = useUpdateNotificationSettings();

  const [notif, setNotif] = useState<NotificationSettings>(
    DEFAULT_NOTIF_SETTINGS,
  );
  // Saved snapshot for notification settings — isDirty is derived, not manual
  const [savedNotif, setSavedNotif] = useState<NotificationSettings | null>(
    null,
  );
  // Ref to guard against re-syncing after user has started editing
  const notifLoadedRef = useRef(false);
  const [localTemplates, setLocalTemplates] = useState<Record<
    TemplateType,
    EmailTemplate
  > | null>(null);

  // Sync backend → local on initial load only (guarded by ref so user edits are safe)
  useEffect(() => {
    if (remoteNotif && !notifLoadedRef.current) {
      notifLoadedRef.current = true;
      const loaded: NotificationSettings = {
        sendConfirmationEmail: remoteNotif.sendConfirmationEmail,
        sendReminderEmail: remoteNotif.sendReminderEmail,
        reminderHoursBefore: remoteNotif.reminderHoursBefore.map(Number),
        sendCancellationEmail: remoteNotif.sendCancellationEmail,
        waitlistAutoActivate: remoteNotif.waitlistAutoActivate,
      };
      setNotif(loaded);
      setSavedNotif(loaded);
    }
  }, [remoteNotif]);

  // ── Review requests state ──────────────────────────────────────────────────
  const {
    settings: reviewSettings,
    isLoading: isReviewLoading,
    isSaving: isReviewSaving,
    isDirty: isReviewDirty,
    update: updateReview,
    save: saveReview,
  } = useReviewRequests();
  // Derive isDirty from snapshot — never silently reset
  const isNotifDirty =
    savedNotif === null || JSON.stringify(notif) !== JSON.stringify(savedNotif);
  const [isSavingNotif, setIsSavingNotif] = useState(false);
  const [activeTab, setActiveTab] = useState<TemplateType>("confirmation");
  const [showApplyAll, setShowApplyAll] = useState(false);

  // Sync remote → local on initial load
  useEffect(() => {
    if (remoteTemplates && !localTemplates) {
      setLocalTemplates(remoteTemplates);
    }
  }, [remoteTemplates, localTemplates]);

  const templates = localTemplates ?? remoteTemplates;

  const setNotifField = useCallback(
    <K extends keyof NotificationSettings>(
      key: K,
      value: NotificationSettings[K],
    ) => {
      setNotif((s) => ({ ...s, [key]: value }));
    },
    [],
  );

  const updateTemplate = useCallback(
    (templateType: TemplateType, tpl: EmailTemplate) => {
      setLocalTemplates((prev) =>
        prev ? { ...prev, [templateType]: tpl } : prev,
      );
    },
    [],
  );

  const handleSaveNotif = async () => {
    setIsSavingNotif(true);
    try {
      await updateNotifications.mutateAsync({
        sendConfirmationEmail: notif.sendConfirmationEmail,
        sendReminderEmail: notif.sendReminderEmail,
        reminderHoursBefore: notif.reminderHoursBefore.map(BigInt),
        sendCancellationEmail: notif.sendCancellationEmail,
        waitlistAutoActivate: notif.waitlistAutoActivate,
      });
      setSavedNotif(notif);
      toast.success(t("settings.saved"));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[NotificationsSettings] save failed:", err);
      toast.error(`${t("settings.saveError")}: ${message}`);
    } finally {
      setIsSavingNotif(false);
    }
  };

  const TEMPLATE_TABS: Array<{ key: TemplateType; labelKey: string }> = [
    {
      key: "confirmation",
      labelKey: "settings.notifications.tabs.confirmation",
    },
    {
      key: "reminder_24h",
      labelKey: "settings.notifications.tabs.reminder24h",
    },
    { key: "reminder_2h", labelKey: "settings.notifications.tabs.reminder2h" },
    {
      key: "cancellation",
      labelKey: "settings.notifications.tabs.cancellation",
    },
  ];

  // House style derives from the currently active template
  const activeTemplate = templates?.[activeTab];
  const houseStyle: HouseStylePayload = {
    accentColor: activeTemplate?.accentColor ?? "#c8a96e",
    backgroundColor: activeTemplate?.backgroundColor ?? "#faf8f5",
    logoUrl: activeTemplate?.logoUrl ?? "",
  };

  return (
    <div
      className="max-w-7xl space-y-8"
      data-ocid="notifications-settings-page"
    >
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {t("settings.nav.notifications")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("settings.notifications.subtitle")}
          </p>
        </div>
      </div>

      {/* ── Section 1: Email toggles ───────────────────── */}
      <section className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            {t("settings.notifications.emailSection")}
          </h2>
        </div>

        <div className="px-4 py-3">
          <div className="flex items-start gap-3 rounded-xl border border-[oklch(var(--status-orange)/0.3)] bg-[oklch(var(--status-orange)/0.1)] px-4 py-3">
            <AlertCircle className="h-4 w-4 text-[oklch(var(--status-orange))] shrink-0 mt-0.5" />
            <p className="text-xs text-[oklch(var(--status-orange))]">
              {t("settings.notifications.emailDisabledNote")}
            </p>
          </div>
        </div>

        <div className="px-6 divide-y divide-border">
          <ToggleRow
            id="confirmationToggle"
            label={t("settings.notifications.confirmation")}
            description={t("settings.notifications.confirmationDesc")}
            checked={notif.sendConfirmationEmail}
            onCheckedChange={(v) => setNotifField("sendConfirmationEmail", v)}
            icon={<CheckCircle2 className="h-4 w-4 text-primary/70" />}
            ocid="toggle-confirmation"
          />
          <ToggleRow
            id="cancellationToggle"
            label={t("settings.notifications.cancellation")}
            description={t("settings.notifications.cancellationDesc")}
            checked={notif.sendCancellationEmail}
            onCheckedChange={(v) => setNotifField("sendCancellationEmail", v)}
            icon={<X className="h-4 w-4 text-destructive/70" />}
            ocid="toggle-cancellation"
          />
          <div className="py-4 space-y-4">
            <ToggleRow
              id="reminderToggle"
              label={t("settings.notifications.reminder")}
              description={t("settings.notifications.reminderDesc")}
              checked={notif.sendReminderEmail}
              onCheckedChange={(v) => setNotifField("sendReminderEmail", v)}
              icon={
                <Clock className="h-4 w-4 text-[oklch(var(--status-orange))]" />
              }
              ocid="toggle-reminder"
            />
            {notif.sendReminderEmail && (
              <div className="pl-13 space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t("settings.notifications.reminderHours")}
                </Label>
                <ReminderTagInput
                  value={notif.reminderHoursBefore}
                  onChange={(v) => setNotifField("reminderHoursBefore", v)}
                />
              </div>
            )}
          </div>
          <ToggleRow
            id="waitlistToggle"
            label={t("settings.notifications.waitlistAutoActivate")}
            description={t("settings.notifications.waitlistAutoActivateDesc")}
            checked={notif.waitlistAutoActivate}
            onCheckedChange={(v) => setNotifField("waitlistAutoActivate", v)}
            icon={<List className="h-4 w-4 text-primary/70" />}
            ocid="toggle-waitlist-auto"
          />
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between">
          {isNotifDirty && (
            <p className="text-xs text-muted-foreground">
              {t("settings.unsavedChanges")}
            </p>
          )}
          <Button
            onClick={handleSaveNotif}
            disabled={isSavingNotif || !isNotifDirty}
            className="gap-2 ml-auto"
            data-ocid="save-notif-btn"
          >
            {t(isSavingNotif ? "settings.saving" : "settings.save")}
          </Button>
        </div>
      </section>

      {/* ── Section 2: Email template editor ──────────── */}
      <section className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex flex-wrap items-center gap-3">
          <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
          <h2 className="text-sm font-semibold text-foreground flex-1 min-w-0">
            {t("settings.notifications.templatesSection")}
          </h2>

          {/* ── Apply-to-All CTA ── */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApplyAll(true)}
              className="gap-2 border-primary/40 text-primary hover:bg-primary/5 hover:border-primary/60 transition-colors shrink-0"
              data-ocid="apply-house-style-btn"
            >
              <Paintbrush className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t("settings.notifications.applyAll.button")}
              </span>
              <span className="sm:hidden">
                {t("settings.notifications.applyAll.confirmBtn")}
              </span>
            </Button>
          </motion.div>

          <span className="text-xs text-muted-foreground hidden md:block">
            {t("settings.notifications.templatesHint")}
          </span>
        </div>

        {isLoadingTemplates ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        ) : templates ? (
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TemplateType)}
            className="w-full"
            data-ocid="template-tabs"
          >
            <div className="px-6 pt-5 border-b border-border bg-muted/10">
              <TabsList className="h-auto p-0 bg-transparent gap-0 flex-wrap">
                {TEMPLATE_TABS.map(({ key, labelKey }) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-primary transition-colors"
                    data-ocid={`tab-${key}`}
                  >
                    {t(labelKey)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              {TEMPLATE_TABS.map(({ key }) =>
                activeTab === key ? (
                  <TabsContent
                    key={key}
                    value={key}
                    className="p-6 mt-0 focus-visible:outline-none"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                    >
                      <TemplateEditor
                        templateType={key}
                        template={templates[key]}
                        onChange={(tpl) => updateTemplate(key, tpl)}
                      />
                    </motion.div>
                  </TabsContent>
                ) : null,
              )}
            </AnimatePresence>
          </Tabs>
        ) : null}
      </section>

      {/* ── Apply-to-All modal ──────────────────────────── */}
      {templates && (
        <ApplyAllModal
          open={showApplyAll}
          onOpenChange={setShowApplyAll}
          houseStyle={houseStyle}
          allTemplates={templates}
        />
      )}

      {/* ── Section 3: Review Requests ──────────────────── */}
      <section
        className="rounded-2xl border border-border bg-card shadow-subtle overflow-hidden"
        data-ocid="review-requests-section"
      >
        <div className="px-6 py-5 border-b border-border flex items-center gap-2">
          <Star className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            {t("reviewRequests.title", { ns: "settings" })}
          </h2>
        </div>

        {/* Disabled note */}
        <div className="px-4 py-3">
          <div className="flex items-start gap-3 rounded-xl border border-[oklch(var(--status-orange)/0.3)] bg-[oklch(var(--status-orange)/0.1)] px-4 py-3">
            <AlertCircle className="h-4 w-4 text-[oklch(var(--status-orange))] shrink-0 mt-0.5" />
            <p className="text-xs text-[oklch(var(--status-orange))]">
              {t("reviewRequests.disabledNote", { ns: "settings" })}
            </p>
          </div>
        </div>

        <div className="px-6 space-y-6 pb-6">
          {/* Enable toggle */}
          <ToggleRow
            id="reviewRequestsToggle"
            label={t("reviewRequests.enableToggle", { ns: "settings" })}
            description={t("reviewRequests.enableToggleDesc", {
              ns: "settings",
            })}
            checked={reviewSettings.enabled}
            onCheckedChange={(v) => updateReview("enabled", v)}
            icon={<Star className="h-4 w-4 text-primary/70" />}
            ocid="toggle-review-requests"
          />

          <AnimatePresence>
            {reviewSettings.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden space-y-6"
              >
                {/* Delay selector */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-foreground">
                      {t("reviewRequests.delayTitle", { ns: "settings" })}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("reviewRequests.delayDesc", { ns: "settings" })}
                    </p>
                  </div>
                  <div
                    className="flex flex-wrap gap-2"
                    data-ocid="review-delay-options"
                  >
                    {REVIEW_DELAY_OPTIONS.map(({ value, labelKey }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => updateReview("delay", value)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                          reviewSettings.delay === value
                            ? "bg-primary/10 border-primary/50 text-primary"
                            : "bg-background border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}
                        data-ocid={`review-delay-${value}`}
                      >
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        {t(labelKey, { ns: "settings" })}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message textarea + char count */}
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm font-medium text-foreground">
                      {t("reviewRequests.messageTitle", { ns: "settings" })}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("reviewRequests.messageDesc", { ns: "settings" })}
                    </p>
                  </div>
                  <textarea
                    value={reviewSettings.message}
                    onChange={(e) =>
                      updateReview("message", e.target.value.slice(0, 500))
                    }
                    rows={4}
                    maxLength={500}
                    placeholder={t("reviewRequests.messagePlaceholder", {
                      ns: "settings",
                    })}
                    className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    data-ocid="review-message-input"
                  />
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs ${
                        reviewSettings.message.length >= 500
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {reviewSettings.message.length >= 500
                        ? t("reviewRequests.messageCharLimit", {
                            ns: "settings",
                          })
                        : t("reviewRequests.messageCharCount", {
                            ns: "settings",
                            count: reviewSettings.message.length,
                          })}
                    </span>
                  </div>
                </div>

                {/* Live preview */}
                <div className="space-y-3" data-ocid="review-message-preview">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">
                      {t("reviewRequests.previewTitle", { ns: "settings" })}
                    </h3>
                    <Badge variant="secondary" className="text-xs ml-auto">
                      {t("reviewRequests.previewBadge", { ns: "settings" })}
                    </Badge>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                        <Star className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground">
                          {REVIEW_MOCK.restaurant_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t(
                            `reviewRequests.delay${
                              reviewSettings.delay === "hour1"
                                ? "1h"
                                : reviewSettings.delay === "hour2"
                                  ? "2h"
                                  : "24h"
                            }`,
                            { ns: "settings" },
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                      {reviewSettings.message
                        .replace(/\{\{guest_name\}\}/g, REVIEW_MOCK.guest_name)
                        .replace(
                          /\{\{restaurant_name\}\}/g,
                          REVIEW_MOCK.restaurant_name,
                        ) || (
                        <span className="text-muted-foreground/60 italic">
                          {t("reviewRequests.messagePlaceholder", {
                            ns: "settings",
                          })}
                        </span>
                      )}
                    </p>
                    <div className="flex gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className="h-5 w-5 text-primary/40"
                          aria-hidden
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between">
          {isReviewDirty && (
            <p className="text-xs text-muted-foreground">
              {t("settings.unsavedChanges")}
            </p>
          )}
          <Button
            onClick={async () => {
              const result = await saveReview();
              if (result.ok) {
                toast.success(
                  t("reviewRequests.savedToast", { ns: "settings" }),
                );
              } else {
                toast.error(t("reviewRequests.saveError", { ns: "settings" }));
              }
            }}
            disabled={isReviewSaving || isReviewLoading || !isReviewDirty}
            className="gap-2 ml-auto"
            data-ocid="save-review-requests-btn"
          >
            {isReviewSaving ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                {t("settings.saving")}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {t("settings.save")}
              </>
            )}
          </Button>
        </div>
      </section>
    </div>
  );
}
