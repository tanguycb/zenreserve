import { u as useTranslation, b7 as useBrandingConfig, b8 as useUpdateBrandingConfig, r as reactExports, j as jsxRuntimeExports, aJ as LoaderCircle, w as Label, b9 as Moon, c as cn, B as Button, I as Input, F as Textarea, t as ue } from "./index-BNayfcmF.js";
import { S as Switch } from "./switch-Da4cPyDO.js";
import { P as Palette } from "./palette-CO2i3J_t.js";
import { M as Monitor } from "./monitor-C_6nSkuR.js";
import { S as Sun } from "./sun-sQ0z6rjy.js";
import { U as Upload } from "./upload-B8_9SfNZ.js";
import { S as Save } from "./save-DmaA-fW0.js";
const LANGUAGES = [
  { value: "nl", label: "Nederlands (NL)" },
  { value: "en", label: "English (EN)" },
  { value: "fr", label: "Français (FR)" },
  { value: "de", label: "Deutsch (DE)" }
];
const THEME_KEY = "zenreserve_theme";
function loadTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light") return "light";
  } catch {
  }
  return "dark";
}
function applyTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
  }
  const root = document.documentElement;
  if (theme === "light") {
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
  } else {
    root.classList.add("dark");
    root.removeAttribute("data-theme");
  }
}
function WidgetPreview({
  primaryColor,
  accentColor,
  logoUrl,
  welcomeText
}) {
  const { t } = useTranslation("dashboard");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-border overflow-hidden shadow-md w-full bg-background",
      "aria-label": t("settings.branding.previewAriaLabel"),
      "data-ocid": "branding-widget-preview",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 py-3 flex items-center gap-2",
            style: { background: primaryColor },
            children: [
              logoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: logoUrl,
                  alt: "logo",
                  className: "h-7 w-7 rounded-md object-contain bg-muted/30",
                  onError: (e) => {
                    e.currentTarget.style.display = "none";
                  }
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-md flex items-center justify-center text-white text-xs font-bold bg-[oklch(var(--primary)/0.25)]", children: "Z" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold text-sm truncate", children: welcomeText || t("settings.branding.previewWelcome") })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground", children: t("settings.branding.previewSelectDate") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 flex-wrap", children: ["Vr 12", "Za 13", "Zo 14", "Ma 15"].map((day, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: i === 1 ? { background: primaryColor, color: "#fff" } : void 0,
              className: cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium",
                i !== 1 && "bg-muted text-foreground border border-border"
              ),
              children: day
            },
            day
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 flex-wrap mt-1", children: ["12:00", "12:30", "19:00", "20:00"].map((slot, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: i === 2 ? { background: accentColor, color: "#fff" } : void 0,
              className: cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium",
                i !== 2 && "bg-muted text-foreground border border-border"
              ),
              children: slot
            },
            slot
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "w-full mt-2 py-1.5 rounded-lg text-white text-xs font-semibold",
              style: { background: primaryColor },
              tabIndex: -1,
              "aria-hidden": "true",
              type: "button",
              children: t("settings.branding.previewCta")
            }
          )
        ] })
      ]
    }
  );
}
function ColorField({
  id,
  label,
  value,
  onChange,
  "data-ocid": dataOcid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: id, className: "text-sm font-medium text-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id,
            type: "color",
            value,
            onChange: (e) => onChange(e.target.value),
            className: "sr-only",
            "aria-label": label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => {
              var _a;
              return (_a = document.getElementById(id)) == null ? void 0 : _a.click();
            },
            onKeyDown: (e) => {
              var _a;
              return e.key === "Enter" && ((_a = document.getElementById(id)) == null ? void 0 : _a.click());
            },
            className: "block h-9 w-9 rounded-lg cursor-pointer border-2 border-border shadow-sm transition-transform hover:scale-105",
            style: { background: value },
            "aria-label": label
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value,
          onChange: (e) => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
          },
          placeholder: "#22C55E",
          className: "bg-background border-border font-mono text-sm w-32",
          "data-ocid": dataOcid,
          maxLength: 7
        }
      )
    ] })
  ] });
}
function SectionCard({
  title,
  icon: Icon,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 gradient-card shadow-lg overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border/40 flex items-center gap-2.5", children: [
      Icon && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "heading-h2 text-base", children: title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-6", children })
  ] });
}
function BrandingSettingsPage() {
  const { t } = useTranslation("dashboard");
  const { data, isLoading } = useBrandingConfig();
  const updateMutation = useUpdateBrandingConfig();
  const fileInputRef = reactExports.useRef(null);
  const [form, setForm] = reactExports.useState({
    primaryColor: "#22C55E",
    accentColor: "#3B82F6",
    logoUrl: "",
    welcomeText: "",
    confirmationText: "",
    defaultLanguage: "nl",
    sendConfirmationEmail: true,
    sendReminderEmail: true,
    reminderHoursBefore: 24
  });
  const [saved, setSaved] = reactExports.useState(null);
  const [darkMode, setDarkMode] = reactExports.useState(loadTheme);
  const [logoPreviewSrc, setLogoPreviewSrc] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (data) {
      setForm(data);
      setSaved(data);
    }
  }, [data]);
  reactExports.useEffect(() => {
    setLogoPreviewSrc(form.logoUrl);
  }, [form.logoUrl]);
  const isDirty = saved === null || JSON.stringify(form) !== JSON.stringify(saved);
  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
  };
  const handleThemeToggle = (checked) => {
    const theme = checked ? "light" : "dark";
    setDarkMode(theme);
    applyTheme(theme);
  };
  const handleLogoFileChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      var _a2;
      const result = (_a2 = ev.target) == null ? void 0 : _a2.result;
      setLogoPreviewSrc(result);
      set("logoUrl", result);
    };
    reader.readAsDataURL(file);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(form);
      setSaved(form);
      ue.success(t("settings.saved"));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[BrandingSettings] save failed:", err);
      ue.error(`${t("settings.saveError")}: ${message}`);
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[40vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl space-y-6", "data-ocid": "branding-settings-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { className: "h-5 w-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "heading-h1 text-xl md:text-2xl", children: t("settings.nav.branding") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mt-0.5", children: t("settings.branding.subtitle") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: t("settings.branding.themeTitle"), icon: Monitor, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold text-foreground", children: t("settings.branding.darkMode") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: t("settings.branding.darkModeHint") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Moon,
              {
                className: cn(
                  "h-4 w-4 transition-colors",
                  darkMode === "dark" ? "text-primary" : "text-muted-foreground"
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: t("settings.branding.darkModeLabel") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: darkMode === "light",
                onCheckedChange: handleThemeToggle,
                "data-ocid": "branding-theme-toggle",
                "aria-label": t("settings.branding.darkMode"),
                className: "mx-1"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Sun,
              {
                className: cn(
                  "h-4 w-4 transition-colors",
                  darkMode === "light" ? "text-primary" : "text-muted-foreground"
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: t("settings.branding.lightModeLabel") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "h-12 w-12 rounded-xl border-2 flex items-center justify-center transition-all",
                darkMode === "dark" ? "border-primary bg-card" : "border-border bg-muted/30"
              ),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Moon,
                {
                  className: cn(
                    "h-5 w-5",
                    darkMode === "dark" ? "text-primary" : "text-muted-foreground"
                  )
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "h-12 w-12 rounded-xl border-2 flex items-center justify-center transition-all",
                darkMode === "light" ? "border-primary bg-card" : "border-border bg-muted/30"
              ),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Sun,
                {
                  className: cn(
                    "h-5 w-5",
                    darkMode === "light" ? "text-primary" : "text-muted-foreground"
                  )
                }
              )
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: t("settings.branding.colorsTitle"), icon: Palette, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ColorField,
            {
              id: "primaryColor",
              label: t("settings.branding.primaryColor"),
              value: form.primaryColor,
              onChange: (v) => set("primaryColor", v),
              "data-ocid": "branding-primary-color"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ColorField,
            {
              id: "accentColor",
              label: t("settings.branding.accentColor"),
              value: form.accentColor,
              onChange: (v) => set("accentColor", v),
              "data-ocid": "branding-accent-color"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs font-medium text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { className: "h-3.5 w-3.5" }),
            t("settings.branding.livePreview")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            WidgetPreview,
            {
              primaryColor: form.primaryColor,
              accentColor: form.accentColor,
              logoUrl: logoPreviewSrc,
              welcomeText: form.welcomeText
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: t("settings.branding.logoTitle"), icon: Upload, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: t("settings.branding.logoUpload") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: "image/png,image/jpeg,image/svg+xml,image/webp",
                className: "sr-only",
                onChange: handleLogoFileChange,
                "aria-label": t("settings.branding.logoUpload"),
                "data-ocid": "branding-logo-file-input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => {
                  var _a;
                  return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                },
                className: "gap-2 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]",
                "data-ocid": "branding-logo-upload-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
                  t("settings.branding.logoUploadBtn")
                ]
              }
            ),
            logoPreviewSrc && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                className: "text-muted-foreground hover:text-destructive",
                onClick: () => {
                  setLogoPreviewSrc("");
                  set("logoUrl", "");
                },
                children: t("settings.branding.logoRemove")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.branding.logoUploadHint") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "logoUrl",
              className: "text-sm font-medium text-foreground",
              children: t("settings.branding.logoUrl")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "logoUrl",
              type: "url",
              value: form.logoUrl.startsWith("data:") ? "" : form.logoUrl,
              onChange: (e) => set("logoUrl", e.target.value),
              placeholder: "https://example.com/logo.png",
              className: "bg-background border-border",
              "data-ocid": "branding-logo-url"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.branding.logoUrlHint") })
        ] }),
        logoPreviewSrc && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-muted/10",
            "data-ocid": "branding-logo-preview",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: logoPreviewSrc,
                  alt: t("settings.branding.logoPreviewAlt"),
                  className: "h-14 w-14 rounded-xl object-contain border border-border/60 bg-muted/20 p-1",
                  onError: (e) => {
                    e.currentTarget.src = "/assets/images/placeholder.svg";
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: t("settings.branding.logoPreviewLabel") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate max-w-xs", children: logoPreviewSrc.startsWith("data:") ? t("settings.branding.logoUploadedFile") : logoPreviewSrc })
              ] })
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: t("settings.branding.textsTitle"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "welcomeText",
                className: "text-sm font-medium text-foreground",
                children: t("settings.branding.welcomeText")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              form.welcomeText.length,
              "/200"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "welcomeText",
              value: form.welcomeText,
              onChange: (e) => set("welcomeText", e.target.value),
              placeholder: t("settings.branding.welcomeTextPlaceholder"),
              className: "bg-background border-border resize-none leading-relaxed",
              rows: 3,
              maxLength: 200,
              "data-ocid": "branding-welcome-text"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: t("settings.branding.welcomeTextHint") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "confirmationText",
                className: "text-sm font-medium text-foreground",
                children: t("settings.branding.confirmationText")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              form.confirmationText.length,
              "/200"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "confirmationText",
              value: form.confirmationText,
              onChange: (e) => set("confirmationText", e.target.value),
              placeholder: t("settings.branding.confirmationTextPlaceholder"),
              className: "bg-background border-border resize-none leading-relaxed",
              rows: 3,
              maxLength: 200,
              "data-ocid": "branding-confirmation-text"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: t("settings.branding.confirmationTextHint") })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: t("settings.branding.languageTitle"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "defaultLanguage",
            className: "text-sm font-medium text-foreground",
            children: t("settings.branding.defaultLanguage")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            id: "defaultLanguage",
            value: form.defaultLanguage,
            onChange: (e) => set(
              "defaultLanguage",
              e.target.value
            ),
            className: "w-full max-w-xs rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
            "data-ocid": "branding-default-language",
            children: LANGUAGES.map((lang) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: lang.value, children: lang.label }, lang.value))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.branding.defaultLanguageHint") })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: t("settings.branding.autoMessagesTitle"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold text-foreground", children: t("settings.branding.sendConfirmationEmail") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: t("settings.branding.sendConfirmationEmailHint") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: form.sendConfirmationEmail,
              onCheckedChange: (v) => set("sendConfirmationEmail", v),
              "data-ocid": "branding-send-confirmation",
              "aria-label": t("settings.branding.sendConfirmationEmail")
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold text-foreground", children: t("settings.branding.sendReminderEmail") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: t("settings.branding.sendReminderEmailHint") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: form.sendReminderEmail,
              onCheckedChange: (v) => set("sendReminderEmail", v),
              "data-ocid": "branding-send-reminder",
              "aria-label": t("settings.branding.sendReminderEmail")
            }
          )
        ] }),
        form.sendReminderEmail && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-0 pl-4 border-l-2 border-primary/20 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "reminderHoursBefore",
              className: "text-sm font-medium text-foreground",
              children: t("settings.branding.reminderHoursBefore")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "reminderHoursBefore",
                type: "number",
                min: 1,
                max: 168,
                value: form.reminderHoursBefore,
                onChange: (e) => set("reminderHoursBefore", Number(e.target.value)),
                className: "bg-background border-border w-24",
                "data-ocid": "branding-reminder-hours"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: t("settings.branding.hours") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: t("settings.branding.reminderHoursHint") })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 gradient-card shadow-lg px-6 py-4 flex items-center justify-between gap-4", children: [
        isDirty && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("settings.unsavedChanges") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "submit",
            disabled: updateMutation.isPending || !isDirty,
            className: "gap-2 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]",
            "data-ocid": "branding-save-btn",
            children: [
              updateMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
              updateMutation.isPending ? t("settings.saving") : t("settings.save")
            ]
          }
        ) })
      ] })
    ] })
  ] });
}
export {
  BrandingSettingsPage as default
};
