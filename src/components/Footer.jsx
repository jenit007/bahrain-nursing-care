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
    { to: "/care/icu", title: t("services.icu.title") },
    { to: "/care/ventilator", title: t("services.ventilator.title") },
    { to: "/care/cancer", title: t("services.cancer.title") },
    { to: "/care/patient", title: t("services.patient.title") },
    { to: "/care/elder", title: t("services.elder.title") },
    { to: "/care/newborn", title: t("services.newborn.title") },
    { to: "/care/children", title: t("services.children.title") },
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
        <div className="footer-contact-col">
          <h3>{t("footer.contact")}</h3>
          {HAS_CONTACT_PHONE && (
            <a href={CONTACT_PHONE_HREF} className="footer-contact-link" dir="ltr">
              <svg
                className="footer-contact-icon"
                viewBox="0 0 24 24"
                width="14"
                height="14"
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
          )}
          <a href={`mailto:${CONTACT_EMAIL}`} dir="ltr">{CONTACT_EMAIL}</a>
          <address className="footer-address">
            <strong>{t("contact.addressCompany")}</strong>
            <span>{t("contact.addressLine1")}</span>
            <span>{t("contact.addressLine2")}</span>
            <span>{t("contact.addressLine3")}</span>
            <span>{t("contact.addressLine4")}</span>
          </address>
        </div>
      </div>

      <div className="home-container footer-bottom">
        <span>{t("common.copyright")}</span>
        <span>{t("common.homeNursingBahrain")}</span>
      </div>
    </footer>
  );
}
