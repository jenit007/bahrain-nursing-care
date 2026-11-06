import { useTranslation } from "../hooks/useTranslation";
import "./LanguageSwitcher.css";

export default function LanguageSwitcher() {
  const { t, lang, setLang } = useTranslation();

  return (
    <div className="lang-switcher" aria-label="Language selector">
      <span className="lang-switcher-globe" aria-hidden="true">🌐</span>
      <button
        type="button"
        className={`lang-btn${lang === "en" ? " lang-btn--active" : ""}`}
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        aria-label="Switch to English"
      >
        {t("langSwitcher.en")}
      </button>
      <span className="lang-sep" aria-hidden="true">|</span>
      <button
        type="button"
        className={`lang-btn${lang === "ar" ? " lang-btn--active" : ""}`}
        onClick={() => setLang("ar")}
        aria-pressed={lang === "ar"}
        aria-label="Switch to Arabic"
      >
        {t("langSwitcher.ar")}
      </button>
    </div>
  );
}
