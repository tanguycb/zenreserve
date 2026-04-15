import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enShared from "./locales/en/shared.json";
import frShared from "./locales/fr/shared.json";
// ── Locale imports ────────────────────────────────────────────────────────────
import nlShared from "./locales/nl/shared.json";

import enWidget from "./locales/en/widget.json";
import frWidget from "./locales/fr/widget.json";
import nlWidget from "./locales/nl/widget.json";

import enDashboard from "./locales/en/dashboard.json";
import frDashboard from "./locales/fr/dashboard.json";
import nlDashboard from "./locales/nl/dashboard.json";

import enApp from "./locales/en/app.json";
import frApp from "./locales/fr/app.json";
import nlApp from "./locales/nl/app.json";

import enSettings from "./locales/en/settings.json";
import frSettings from "./locales/fr/settings.json";
import nlSettings from "./locales/nl/settings.json";

const savedLang = localStorage.getItem("zenreserve-lang") ?? "nl";
const supportedLangs = ["nl", "en", "fr"];
const defaultLang = supportedLangs.includes(savedLang) ? savedLang : "nl";

i18n.use(initReactI18next).init({
  resources: {
    nl: {
      shared: nlShared,
      widget: nlWidget,
      dashboard: nlDashboard,
      app: nlApp,
      settings: nlSettings,
    },
    en: {
      shared: enShared,
      widget: enWidget,
      dashboard: enDashboard,
      app: enApp,
      settings: enSettings,
    },
    fr: {
      shared: frShared,
      widget: frWidget,
      dashboard: frDashboard,
      app: frApp,
      settings: frSettings,
    },
  },
  lng: defaultLang,
  fallbackLng: ["fr", "en", "nl"],
  ns: ["widget", "dashboard", "app", "shared", "settings"],
  defaultNS: "shared",
  interpolation: {
    escapeValue: false,
  },
  debug: process.env.NODE_ENV === "development",
});

export default i18n;
