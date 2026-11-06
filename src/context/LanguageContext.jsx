import { createContext, useContext, useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "naf_lang";
const DEFAULT_LANG = "en";

export const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === "ar" || saved === "en" ? saved : DEFAULT_LANG;
    } catch {
      return DEFAULT_LANG;
    }
  });

  const isRTL = lang === "ar";

  // Apply dir/lang/font to <html> whenever lang changes
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", isRTL ? "rtl" : "ltr");

    if (isRTL) {
      html.classList.add("lang-ar");
      html.classList.remove("lang-en");
    } else {
      html.classList.add("lang-en");
      html.classList.remove("lang-ar");
    }
  }, [lang, isRTL]);

  const setLang = useCallback((newLang) => {
    if (newLang !== "en" && newLang !== "ar") return;
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore storage errors
    }
    setLangState(newLang);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
