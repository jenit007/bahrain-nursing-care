import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  HAS_CONTACT_PHONE,
  CONTACT_ALT_PHONE_DISPLAY,
  CONTACT_ALT_PHONE_HREF,
  HAS_CONTACT_ALT_PHONE,
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
    const prevBodyOverflowX = document.body.style.overflowX;
    const prevHtmlOverflowX = document.documentElement.style.overflowX;
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";

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
      document.body.style.overflowX = prevBodyOverflowX;
      document.documentElement.style.overflowX = prevHtmlOverflowX;
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
            <a
              href="tel:+97313644221"
              className="top-contact-phone"
              dir="ltr"
              title="Call NOOR AL AFIYA"
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
              <span>+973 13644221</span>
            </a>
            <span className="top-contact-sep" aria-hidden="true">•</span>
            <a
              href="mailto:nooralafiyahomecare@gmail.com"
              className="top-contact-email"
              dir="ltr"
              title="Email NOOR AL AFIYA"
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
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>nooralafiyahomecare@gmail.com</span>
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
            aria-label="NOOR AL AFIYA Home Health Care WLL - Home"
          >
            <img
              src={logoMark}
              width="256"
              height="256"
              alt="NOOR AL AFIYA Mark"
              className="brand-mark-image"
            />
            <span className="brand-text-block">
              <strong>{t("common.noorAlAfiya")}</strong>
              <small>{t("common.homeHealthCareWLL")}</small>
            </span>
          </Link>

          {/* DESKTOP NAV LINKS + CTA */}
          <nav className="home-nav-desktop" aria-label="Main Navigation">
            <div className="home-nav-links">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={isActive(link) ? "active" : ""}
                  aria-current={isActive(link) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <Link
              to="/services"
              className="nav-cta-btn"
              aria-label={t("common.bookAppointment")}
            >
              <span>{t("common.bookAppointment")}</span>
              <span className="nav-cta-arrow" aria-hidden="true">→</span>
            </Link>
          </nav>

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

          {/* MOBILE DRAWER */}
          <div
            className={`home-nav-mobile-drawer ${menuOpen ? "show" : ""}`}
            role="dialog"
            aria-label="Mobile Navigation"
            aria-modal={menuOpen}
          >
            <div className="mobile-drawer-links">
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
            </div>

            <div className="mobile-drawer-cta">
              <Link
                to="/services"
                className="mobile-nav-book-btn"
                onClick={() => setMenuOpen(false)}
              >
                {t("common.bookAppointment")} →
              </Link>
            </div>

            <div className="mobile-drawer-lang-row">
              <LanguageSwitcher />
            </div>

            <div className="mobile-drawer-contact">
              <a href="tel:+97313644221" className="mobile-drawer-contact-item" dir="ltr">
                <span className="mobile-drawer-icon">☎</span>
                <span>+973 13644221</span>
              </a>
              <a href="mailto:nooralafiyahomecare@gmail.com" className="mobile-drawer-contact-item" dir="ltr">
                <span className="mobile-drawer-icon">✉</span>
                <span>nooralafiyahomecare@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
