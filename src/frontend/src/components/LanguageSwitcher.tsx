import { useTranslation } from "react-i18next";

type Lang = "nl" | "en" | "fr";
const LANGS: Lang[] = ["nl", "en", "fr"];

interface LanguageSwitcherProps {
  variant?: "header" | "footer";
}

export function LanguageSwitcher({
  variant = "header",
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation("shared");
  const currentLang = i18n.language as Lang;

  function handleChange(lang: Lang) {
    void i18n.changeLanguage(lang);
    localStorage.setItem("zenreserve-lang", lang);
  }

  const isHeader = variant === "header";

  return (
    <fieldset
      aria-label={t("language.switchLabel")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0,
        border: "none",
        padding: 0,
        margin: 0,
        borderRadius: "9999px",
        overflow: "hidden",
        background: isHeader ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)",
      }}
    >
      <legend
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
        }}
      >
        {t("language.switchLabel")}
      </legend>
      {LANGS.map((lang) => {
        const isActive = currentLang === lang || currentLang.startsWith(lang);
        return (
          <button
            key={lang}
            type="button"
            onClick={() => handleChange(lang)}
            aria-pressed={isActive}
            aria-label={t(`language.${lang}`)}
            data-ocid={`lang-switcher-${lang}`}
            style={{
              padding: isHeader ? "4px 10px" : "3px 9px",
              fontSize: isHeader ? "13px" : "12px",
              fontWeight: isActive ? 600 : 400,
              fontFamily: "inherit",
              letterSpacing: "0.02em",
              border: "none",
              borderRadius: "9999px",
              cursor: "pointer",
              transition: "background 0.18s, color 0.18s",
              background: isActive ? "#22C55E" : "transparent",
              color: isActive
                ? "#fff"
                : isHeader
                  ? "rgba(255,255,255,0.72)"
                  : "#1F2937",
              outline: "none",
              lineHeight: 1.4,
            }}
          >
            {lang.toUpperCase()}
          </button>
        );
      })}
    </fieldset>
  );
}
