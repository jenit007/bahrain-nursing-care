import { useState } from "react";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF, HAS_CONTACT_PHONE } from "../config/contact";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { submitContactEnquiry } from "../utils/api";
import usePageMeta from "../utils/usePageMeta";
import { useTranslation } from "../hooks/useTranslation";
import "./Home.css";
import "./Contact.css";

function Contact() {
  usePageMeta({
    title: "Contact NOOR AL AFIYA | Home Nursing Care in Bahrain",
    description:
      "Contact NOOR AL AFIYA Home Health Care for questions about home nursing services in Bahrain, or send us an enquiry online.",
    path: "/contact",
  });

  const { t } = useTranslation();
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError("");
    setSubmitSuccess("");
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  };

  const handleEnquirySubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    const trimmedName = formData.fullName.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();
    const trimmedPhone = formData.phone.trim();
    const trimmedSubject = formData.subject.trim();
    const trimmedMessage = formData.message.trim();

    const errors = {};
    if (!trimmedName || trimmedName.length < 2) {
      errors.fullName = t("contact.validFullName");
    }
    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      errors.email = t("contact.validEmail");
    }
    if (!trimmedPhone || !/^[+\d][\d\s().-]{6,20}$/.test(trimmedPhone) || trimmedPhone.replace(/\D/g, "").length < 7) {
      errors.phone = t("contact.validPhone");
    }
    if (!trimmedSubject) {
      errors.subject = t("contact.validSubject");
    }
    if (!trimmedMessage || trimmedMessage.length < 5) {
      errors.message = t("contact.validMessage");
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSubmitError(t("contact.validFields"));
      return;
    }

    setSubmitting(true);

    try {
      await submitContactEnquiry({
        fullName: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        subject: trimmedSubject,
        message: trimmedMessage,
      });
      setSubmitSuccess(t("contact.successMessage"));
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      if (err?.details && typeof err.details === "object") {
        setFieldErrors(err.details);
      }
      setSubmitError(
        err.message || t("contact.errorSubmit")
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <Header />

      {/* ================= HERO ================= */}
      <section className="contact-hero">
        <div className="contact-container contact-hero-content">
          <div className="contact-breadcrumb">
            <Link to="/">{t("common.home")}</Link> <span>/</span> {t("nav.contact")}
          </div>

          <p className="contact-hero-label">
            {t("contact.heroLabel")}
          </p>

          <h1>
            {t("contact.heroHeading")}
            <span> {t("contact.heroHeadingSpan")}</span>
          </h1>

          <p>{t("contact.heroDesc")}</p>
        </div>
      </section>

      {/* ================= CONTACT INTRO ================= */}
      <section className="contact-intro">
        <div className="contact-container">
          <div className="contact-intro-heading">
            <p className="contact-section-label">
              {t("contact.introLabel")}
            </p>

            <h2>
              {t("contact.introHeading")}
              <span> {t("contact.introHeadingSpan")}</span>
            </h2>

            <p>{t("contact.introDesc")}</p>
          </div>

          <div className="contact-info-grid">
            {/* PHONE */}
            {HAS_CONTACT_PHONE && (
              <div className="contact-info-card">
                <div className="contact-info-icon">☎</div>
                <div>
                  <h3>{t("contact.phoneTitle")}</h3>
                  <p>{t("contact.phoneDesc")}</p>
                  <a href={CONTACT_PHONE_HREF} dir="ltr">{CONTACT_PHONE_DISPLAY}</a>
                </div>
              </div>
            )}

            {/* EMAIL */}
            <div className="contact-info-card">
              <div className="contact-info-icon">@</div>
              <div>
                <h3>{t("contact.emailTitle")}</h3>
                <p>{t("contact.emailDesc")}</p>
                <a href={`mailto:${CONTACT_EMAIL}`} dir="ltr">
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>

            {/* LOCATION */}
            <div className="contact-info-card">
              <div className="contact-info-icon">+</div>
              <div>
                <h3>{t("contact.locationTitle")}</h3>
                <p>{t("contact.locationDesc")}</p>
                <address className="contact-address">
                  <strong>{t("contact.addressCompany")}</strong>
                  <span>{t("contact.addressLine1")}</span>
                  <span>{t("contact.addressLine2")}</span>
                  <span>{t("contact.addressLine3")}</span>
                  <span>{t("contact.addressLine4")}</span>
                </address>
              </div>
            </div>

            {/* HOURS */}
            <div className="contact-info-card">
              <div className="contact-info-icon">◷</div>
              <div>
                <h3>{t("contact.hoursTitle")}</h3>
                <p>{t("contact.hoursDesc")}</p>
                <span>{t("contact.hours247")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT FORM ================= */}
      <section className="contact-form-section">
        <div className="contact-container contact-form-grid">
          <div className="contact-form-content">
            <p className="contact-section-label">
              {t("contact.formLabel")}
            </p>

            <h2>
              {t("contact.formHeading")}
              <span> {t("contact.formHeadingSpan")}</span>
            </h2>

            <p>{t("contact.formDesc")}</p>

            <div className="contact-form-note">
              <strong>{t("contact.formNoteTitle")}</strong>
              <p>{t("contact.formNoteDesc")}</p>
              <Link to="/services" className="contact-primary-btn">
                {t("common.exploreServices")}
              </Link>
            </div>
          </div>

          <div className="contact-form-card">
            <form onSubmit={handleEnquirySubmit} noValidate>
              {submitSuccess && (
                <div
                  className="contact-success"
                  role="status"
                  style={{
                    marginBottom: "16px",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "#F3F9EA",
                    border: "1px solid #96C855",
                    color: "#252525",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {submitSuccess}
                </div>
              )}

              {submitError && (
                <div
                  className="contact-error"
                  role="alert"
                  style={{
                    marginBottom: "16px",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "#FFF0F7",
                    border: "1px solid #FF3A94",
                    color: "#252525",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {submitError}
                </div>
              )}

              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="contact-fullName">{t("contact.fullName")} *</label>
                  <input
                    id="contact-fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFieldChange}
                    type="text"
                    autoComplete="name"
                    placeholder={t("contact.fullNamePlaceholder")}
                    required
                    aria-invalid={fieldErrors.fullName ? "true" : "false"}
                    aria-describedby={fieldErrors.fullName ? "contact-fullName-error" : undefined}
                  />
                  {fieldErrors.fullName && (
                    <span id="contact-fullName-error" className="contact-field-error" role="alert">
                      {fieldErrors.fullName}
                    </span>
                  )}
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-phone">{t("contact.phoneNumber")} *</label>
                  <input
                    id="contact-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFieldChange}
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder={t("contact.phonePlaceholder")}
                    required
                    aria-invalid={fieldErrors.phone ? "true" : "false"}
                    aria-describedby={fieldErrors.phone ? "contact-phone-error" : undefined}
                  />
                  {fieldErrors.phone && (
                    <span id="contact-phone-error" className="contact-field-error" role="alert">
                      {fieldErrors.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="contact-email">{t("contact.email")} *</label>
                  <input
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={handleFieldChange}
                    type="email"
                    autoComplete="email"
                    placeholder={t("contact.emailPlaceholder")}
                    required
                    aria-invalid={fieldErrors.email ? "true" : "false"}
                    aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
                  />
                  {fieldErrors.email && (
                    <span id="contact-email-error" className="contact-field-error" role="alert">
                      {fieldErrors.email}
                    </span>
                  )}
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-subject">{t("contact.subject")} *</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleFieldChange}
                    type="text"
                    placeholder={t("contact.subjectPlaceholder")}
                    required
                    aria-invalid={fieldErrors.subject ? "true" : "false"}
                    aria-describedby={fieldErrors.subject ? "contact-subject-error" : undefined}
                  />
                  {fieldErrors.subject && (
                    <span id="contact-subject-error" className="contact-field-error" role="alert">
                      {fieldErrors.subject}
                    </span>
                  )}
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="contact-message">{t("contact.message")} *</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleFieldChange}
                  rows="6"
                  placeholder={t("contact.messagePlaceholder")}
                  required
                  aria-invalid={fieldErrors.message ? "true" : "false"}
                  aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
                />
                {fieldErrors.message && (
                  <span id="contact-message-error" className="contact-field-error" role="alert">
                    {fieldErrors.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="contact-submit-btn"
                disabled={submitting}
              >
                {submitting ? t("contact.sendingEnquiry") : t("contact.sendEnquiry")}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;
