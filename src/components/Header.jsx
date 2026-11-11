import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  HAS_CONTACT_PHONE,
} from "../config/contact";
import logoMark from "../assets/noor-al-afiya-mark.webp";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "../hooks/useTranslation";
import "./Header.css";

export default function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navWrapRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const handleClickOutside = (e) => {
      if (navWrapRef.current && !navWrapRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/services", label: t("nav.services"), matchPrefix: "/care" },
    { to: "/why-us", label: t("nav.whyUs") },
    { to: "/contact", label: t("nav.contact") },
    { to: "/careers", label: t("nav.careers") },
  ];

  const isActive = (link) => {
    if (link.to === "/") {
      return location.pathname === "/";
    }
    if (location.pathname === link.to) {
      return true;
    }
    if (link.matchPrefix && location.pathname.startsWith(link.matchPrefix)) {
      return true;
    }
    return false;
  };

  return (
    <>
      {/* ================= TOP CONTACT BAR ================= */}
      <div className="top-strip">
        <div className="home-container top-strip-inner">
          <span className="top-strip-tagline">{t("topBar.tagline")}</span>
          <div className="top-contact">
            {HAS_CONTACT_PHONE && (
              <>
                <a
                  href={CONTACT_PHONE_HREF}
                  className="top-contact-phone"
                  dir="ltr"
                >
                  <svg
                    className="top-contact-icon"
                    viewBox="0 0 24 24"
                    width="13"
                    height="13"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{CONTACT_PHONE_DISPLAY}</span>
                </a>
                <span className="top-contact-sep" aria-hidden="true">•</span>
              </>
            )}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="top-contact-email"
              dir="ltr"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* ================= MAIN NAVIGATION ================= */}
      <header className="home-nav-wrap" ref={navWrapRef}>
        <div className="home-container home-nav">
          <Link
            className="home-brand"
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            <img
              src={logoMark}
              width="256"
              height="256"
              alt="NOOR AL AFIYA"
              className="brand-mark-image"
            />
            <span>
              <strong>{t("common.noorAlAfiya")}</strong>
              <small>{t("common.homeHealthCareWLL")}</small>
            </span>
          </Link>

          {/* MOBILE MENU TOGGLE */}
          <button
            className={`nav-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={t("nav.toggleNav")}
            aria-expanded={menuOpen}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>

          {/* NAVIGATION LINKS */}
          <nav className={`home-nav-links ${menuOpen ? "show" : ""}`}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={isActive(link) ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
