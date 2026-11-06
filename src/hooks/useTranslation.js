import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import en from "../locales/en/translation.json";
import ar from "../locales/ar/translation.json";

const locales = { en, ar };

/**
 * Returns a t(key) function that resolves dot-notation keys from the active locale.
 * Falls back to the English value, then to the raw key string.
 *
 * @example
 *   const { t, lang, isRTL } = useTranslation();
 *   t("nav.home")        // "Home" or "الرئيسية"
 *   t("common.arrow")    // "→" or "←"
 */
export function useTranslation() {
  const { lang, setLang, isRTL } = useContext(LanguageContext);

  function t(key) {
    if (!key) return "";
    const parts = key.split(".");
    let value = locales[lang];
    for (const part of parts) {
      if (value == null) break;
      value = value[part];
    }
    // Fallback to English
    if (value == null || value === "") {
      let fallback = locales.en;
      for (const part of parts) {
        if (fallback == null) break;
        fallback = fallback[part];
      }
      return fallback ?? key;
    }
    return value;
  }

  return { t, lang, setLang, isRTL };
}
