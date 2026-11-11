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
                <a href={CONTACT_PHONE_HREF}>{CONTACT_PHONE_DISPLAY}</a>
                <span>•</span>
              </>
            )}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
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
