import { useState } from "react";
import { Link } from "react-router-dom";
import logoMark from "../assets/noor-al-afiya-mark.png";
import "./Home.css";
import "./Contact.css";

function Contact() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="contact-page">

      <div className="top-strip">
        <div className="home-container top-strip-inner">
          <span>Professional home nursing care in Bahrain</span>
          <div className="top-contact">
            <a href="tel:+97300000000">+973 0000 0000</a>
            <span>•</span>
            <a href="mailto:info@bahrainnursingcare.com">info@bahrainnursingcare.com</a>
          </div>
        </div>
      </div>

      <header className="home-nav-wrap">
        <div className="home-container home-nav">
          <Link className="home-brand" to="/" onClick={() => setMenuOpen(false)}>
            <img src={logoMark} alt="NOOR AL AFIYA" className="brand-mark-image" />
            <span>
              <strong>NOOR AL AFIYA</strong>
              <small>Home Health Care WLL</small>
            </span>
          </Link>

          <button
            className={`nav-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
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

            {/* PHONE */}

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

                <a href="tel:+97300000000">
                  +973 0000 0000
                </a>

              </div>

            </div>

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

                <a href="mailto:info@example.com">
                  info@example.com
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

            <form
              onSubmit={(event) => {
                event.preventDefault();
                alert(
                  "Thank you. Your enquiry has been submitted."
                );
              }}
            >

              <div className="contact-form-row">

                <div className="contact-field">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    required
                  />

                </div>

                <div className="contact-field">

                  <label>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    required
                  />

                </div>

              </div>

              <div className="contact-form-row">

                <div className="contact-field">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                  />

                </div>

                <div className="contact-field">

                  <label>
                    Subject
                  </label>

                  <input
                    type="text"
                    placeholder="What can we help with?"
                    required
                  />

                </div>

              </div>

              <div className="contact-field">

                <label>
                  Message
                </label>

                <textarea
                  rows="6"
                  placeholder="Write your message..."
                  required
                />

              </div>

              <button
                type="submit"
                className="contact-submit-btn"
              >
                Send Enquiry
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
                src={logoMark}
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
            <a href="tel:+97300000000">+973 0000 0000</a>
            <a href="mailto:info@bahrainnursingcare.com">info@bahrainnursingcare.com</a>
            <span>Bahrain</span>
          </div>

        </div>

        <div className="contact-footer-bottom">
          <div className="contact-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>© 2026 NOOR AL AFIYA. All rights reserved.</span>
            <span>Home Nursing • Bahrain</span>
          </div>
        </div>

      </footer>

    </div>
  );
}

export default Contact;