import { Link } from "react-router-dom";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  HAS_CONTACT_PHONE,
} from "../config/contact";
import logoMark from "../assets/noor-al-afiya-mark.webp";
import { useTranslation } from "../hooks/useTranslation";
import "./Footer.css";

export default function Footer() {
  const { t } = useTranslation();

  const servicesList = [
    { to: "/care/patient", title: t("services.patient.title") },
    { to: "/care/elder", title: t("services.elder.title") },
    { to: "/care/newborn", title: t("services.newborn.title") },
    { to: "/care/children", title: t("services.children.title") },
    { to: "/care/icu", title: t("services.icu.title") },
    { to: "/care/cancer", title: t("services.cancer.title") },
    { to: "/care/ventilator", title: t("services.ventilator.title") },
    { to: "/care/blood-collection", title: t("services.bloodCollection.title") },
  ];

  return (
    <footer className="home-footer">
      <div className="home-container footer-grid">
        {/* BRAND COLUMN */}
        <div className="footer-brand">
          <Link
            className="home-brand"
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
          <p>{t("common.compassionateServices")}</p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3>{t("footer.quickLinks")}</h3>
          <Link to="/">{t("nav.home")}</Link>
          <Link to="/about">{t("nav.about")}</Link>
          <Link to="/services">{t("nav.services")}</Link>
          <Link to="/why-us">{t("nav.whyUs")}</Link>
          <Link to="/contact">{t("nav.contact")}</Link>
          <Link to="/careers">{t("nav.careers")}</Link>
        </div>

        {/* SERVICES */}
        <div>
          <h3>{t("footer.services")}</h3>
          {servicesList.map((service) => (
            <Link key={service.to} to={service.to}>
              {service.title}
            </Link>
          ))}
        </div>

        {/* CONTACT */}
        <div>
          <h3>{t("footer.contact")}</h3>
          {HAS_CONTACT_PHONE && (
            <a href={CONTACT_PHONE_HREF}>{CONTACT_PHONE_DISPLAY}</a>
          )}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <span>{t("common.bahrain")}</span>
        </div>
      </div>

      <div className="home-container footer-bottom">
        <span>{t("common.copyright")}</span>
        <span>{t("common.homeNursingBahrain")}</span>
      </div>
    </footer>
  );
}
