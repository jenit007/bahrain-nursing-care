import { useState } from "react";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF, HAS_CONTACT_PHONE } from "../config/contact";
import { Link } from "react-router-dom";
import logoMark from "../assets/noor-al-afiya-mark.webp";
import { submitContactEnquiry } from "../utils/api";
import usePageMeta from "../utils/usePageMeta";
import "./Home.css";
import "./Contact.css";

const CONTACT_SUCCESS_MESSAGE =
  "Thank you for contacting NOOR AL AFIYA. Your message has been submitted successfully. Our team will get back to you.";

function Contact() {
  usePageMeta({
    title: "Contact NOOR AL AFIYA | Home Nursing Care in Bahrain",
    description:
      "Contact NOOR AL AFIYA Home Health Care for questions about home nursing services in Bahrain, or send us an enquiry online.",
    path: "/contact",
  });
  const [menuOpen, setMenuOpen] = useState(false);
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
      errors.fullName = "Please enter your full name.";
    }
    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!trimmedPhone || !/^[+\d][\d\s().-]{6,20}$/.test(trimmedPhone) || trimmedPhone.replace(/\D/g, "").length < 7) {
      errors.phone = "Please enter a valid phone number.";
    }
    if (!trimmedSubject) {
      errors.subject = "Please enter a subject for your enquiry.";
    }
    if (!trimmedMessage || trimmedMessage.length < 5) {
      errors.message = "Please enter your enquiry message (at least 5 characters).";
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSubmitError("Please correct the highlighted fields and try again.");
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
      // Shown only after the backend has confirmed the enquiry was saved (HTTP 201).
      setSubmitSuccess(CONTACT_SUCCESS_MESSAGE);
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
        err.message || "We could not submit your enquiry right now. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="contact-page">

      <div className="top-strip">
        <div className="home-container top-strip-inner">
          <span>Professional home nursing care in Bahrain</span>
          <div className="top-contact">
            {HAS_CONTACT_PHONE && (
<>
<a href={CONTACT_PHONE_HREF}>{CONTACT_PHONE_DISPLAY}</a>
<span>•</span>
</>
)}
            <a href={`mailto:${CONTACT_EMAIL}`}>nooralafiyahomecare@gmail.com</a>
          </div>
        </div>
      </div>

      <header className="home-nav-wrap">
        <div className="home-container home-nav">
          <Link className="home-brand" to="/" onClick={() => setMenuOpen(false)}>
            <img src={logoMark} width="256" height="256" alt="NOOR AL AFIYA" className="brand-mark-image" />
            <span>
              <strong>NOOR AL AFIYA</strong>
              <small>Home Health Care WLL</small>
            </span>
          </Link>

          <button
            className={`nav-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`home-nav-links ${menuOpen ? "show" : ""}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link to="/services" onClick={() => setMenuOpen(false)}>Our Services</Link>
            <Link to="/why-us" onClick={() => setMenuOpen(false)}>Why Choose Us</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="active">Contact Us</Link>
            <Link to="/careers" onClick={() => setMenuOpen(false)}>Job Opportunities</Link>
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}

      <section className="contact-hero">

        <div className="contact-container contact-hero-content">

          <div className="contact-breadcrumb">
            Home <span>/</span> Contact Us
          </div>

          <p className="contact-hero-label">
            WE ARE HERE TO HELP
          </p>

          <h1>
            Get in
            <span> Touch With Us</span>
          </h1>

          <p>
            Have a question about our home nursing care
            services? Reach out to us and our team will be
            happy to assist you.
          </p>

        </div>

      </section>

      {/* ================= CONTACT INTRO ================= */}

      <section className="contact-intro">

        <div className="contact-container">

          <div className="contact-intro-heading">

            <p className="contact-section-label">
              CONTACT US
            </p>

            <h2>
              Let's talk about
              <span> your care needs.</span>
            </h2>

            <p>
              Whether you need information about our services,
              want to submit a care request, or need help with
              an existing request, we're here to support you.
            </p>

          </div>

          <div className="contact-info-grid">

            {/* PHONE (shown only when VITE_CONTACT_PHONE is configured) */}
{HAS_CONTACT_PHONE && (
<div className="contact-info-card">

              <div className="contact-info-icon">
                ☎
              </div>

              <div>

                <h3>
                  Phone
                </h3>

                <p>
                  Speak with our support team
                  for assistance.
                </p>

                {HAS_CONTACT_PHONE && <a href={CONTACT_PHONE_HREF}>{CONTACT_PHONE_DISPLAY}</a>}

              </div>

            </div>
)}

            {/* EMAIL */}

            <div className="contact-info-card">

              <div className="contact-info-icon">
                @
              </div>

              <div>

                <h3>
                  Email
                </h3>

                <p>
                  Send us your questions or
                  service enquiries.
                </p>

                <a href={`mailto:${CONTACT_EMAIL}`}>
                  nooralafiyahomecare@gmail.com
                </a>

              </div>

            </div>

            {/* LOCATION */}

            <div className="contact-info-card">

              <div className="contact-info-icon">
                +
              </div>

              <div>

                <h3>
                  Location
                </h3>

                <p>
                  Providing home nursing care
                  services across Bahrain.
                </p>

                <span>
                  Bahrain
                </span>

              </div>

            </div>

            {/* HOURS */}

            <div className="contact-info-card">

              <div className="contact-info-icon">
                ◷
              </div>

              <div>

                <h3>
                  Support Hours
                </h3>

                <p>
                  Our home care service support
                  is available around the clock.
                </p>

                <span>
                  24 / 7 Support
                </span>

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
              SEND AN ENQUIRY
            </p>

            <h2>
              How can we
              <span> help you?</span>
            </h2>

            <p>
              Complete the form and provide your contact
              details. Our team can use your enquiry to
              understand what information or assistance you
              require.
            </p>

            <div className="contact-form-note">

              <strong>
                Need to request care?
              </strong>

              <p>
                If you are ready to submit a home nursing
                care request, you can start directly from
                our services page.
              </p>

              <Link
                to="/services"
                className="contact-primary-btn"
              >
                Explore Services
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
                  <label htmlFor="contact-fullName">Full Name</label>
                  <input
                    id="contact-fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFieldChange}
                    type="text" autoComplete="name" placeholder="Enter your name"
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
                  <label htmlFor="contact-phone">Phone Number</label>
                  <input
                    id="contact-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFieldChange}
                    type="tel" autoComplete="tel" inputMode="tel" placeholder="Enter phone number"
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
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={handleFieldChange}
                    type="email" autoComplete="email" placeholder="Enter your email"
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
                  <label htmlFor="contact-subject">Subject</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleFieldChange}
                    type="text" placeholder="What can we help with?"
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
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleFieldChange}
                    rows="6" placeholder="Write your message..."
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
                {submitting ? "Sending Enquiry..." : "Send Enquiry"}
              </button>

            </form>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="contact-footer">

        <div className="contact-container contact-footer-grid">

          <div>
            <Link
              className="home-brand"
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img
                src={logoMark} width="256" height="256"
                alt="NOOR AL AFIYA"
                className="brand-mark-image"
              />
              <span>
                <strong>NOOR AL AFIYA</strong>
                <small>Home Health Care WLL</small>
              </span>
            </Link>

            <p>
              Compassionate home-care services for families in Bahrain.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/services">Our Services</Link>
            <Link to="/why-us">Why Choose Us</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/careers">Job Opportunities</Link>
          </div>

          <div>
            <h4>Services</h4>
            <Link to="/care/patient">Patient Care</Link>
            <Link to="/care/elder">Elder Care</Link>
            <Link to="/care/newborn">Newborn Care</Link>
            <Link to="/care/children">Children's Care</Link>
          </div>

          <div>
            <h4>Contact</h4>
            {HAS_CONTACT_PHONE && <a href={CONTACT_PHONE_HREF}>{CONTACT_PHONE_DISPLAY}</a>}
            <a href={`mailto:${CONTACT_EMAIL}`}>nooralafiyahomecare@gmail.com</a>
            <span>Bahrain</span>
          </div>

        </div>

        <div className="contact-footer-bottom">
          <div className="contact-container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span>© 2026 NOOR AL AFIYA. All rights reserved.</span>
            <span>Home Nursing • Bahrain</span>
          </div>
        </div>

      </footer>

    </div>
  );
}

export default Contact;