import { Link } from "react-router-dom";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">

      {/* ================= TOP BAR ================= */}

      <div className="contact-topbar">
        <div className="contact-container contact-topbar-inner">
          <div>
            Bahrain Home Nursing Care
          </div>

          <div className="contact-top-links">
            <span>24/7 Home Care Support</span>
            <span>•</span>
            <span>Bahrain</span>
          </div>
        </div>
      </div>

      {/* ================= NAVBAR ================= */}

      <header className="contact-navbar">
        <div className="contact-container contact-nav-inner">

          <Link
            to="/"
            className="contact-logo"
          >
            <span className="contact-logo-main">
              Bahrain
            </span>

            <span className="contact-logo-sub">
              HOME NURSING CARE
            </span>
          </Link>

          <nav className="contact-nav-links">

            <Link to="/">
              Home
            </Link>

            <Link to="/about">
              About Us
            </Link>

            <Link to="/services">
              Our Services
            </Link>

            <Link to="/why-us">
              Why Choose Us
            </Link>

            <Link
              to="/contact"
              className="active"
            >
              Contact Us
            </Link>

          </nav>

          <Link
            to="/login"
            className="contact-login-btn"
          >
            Login
          </Link>

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

      {/* ================= SERVICE CTA ================= */}

      <section className="contact-service-cta">

        <div className="contact-container contact-service-inner">

          <div>

            <p className="contact-section-label">
              HOME NURSING CARE
            </p>

            <h2>
              Looking for care
              <span> for your family?</span>
            </h2>

            <p>
              Explore our home nursing care options and
              submit your requirements online.
            </p>

          </div>

          <div className="contact-service-buttons">

            <Link
              to="/services"
              className="contact-primary-btn"
            >
              View Our Services
            </Link>

            <Link
              to="/login"
              className="contact-outline-btn"
            >
              Submit a Request
            </Link>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="contact-footer">

        <div className="contact-container contact-footer-grid">

          <div>

            <Link
              to="/"
              className="contact-footer-logo"
            >
              Bahrain

              <span>
                HOME NURSING CARE
              </span>
            </Link>

            <p>
              Professional home nursing care support
              designed around individuals and families
              in Bahrain.
            </p>

          </div>

          <div>

            <h4>
              Quick Links
            </h4>

            <Link to="/">
              Home
            </Link>

            <Link to="/about">
              About Us
            </Link>

            <Link to="/services">
              Our Services
            </Link>

            <Link to="/why-us">
              Why Choose Us
            </Link>

          </div>

          <div>

            <h4>
              Services
            </h4>

            <Link to="/services/patient">
              Patient Care
            </Link>

            <Link to="/services/elder">
              Elder Care
            </Link>

            <Link to="/services/newborn">
              Newborn Care
            </Link>

            <Link to="/services/children">
              Children's Care
            </Link>

          </div>

          <div>

            <h4>
              Contact
            </h4>

            <p>
              Bahrain
            </p>

            <p>
              24/7 Home Care Support
            </p>

            <a href="mailto:info@example.com">
              info@example.com
            </a>

          </div>

        </div>

        <div className="contact-footer-bottom">

          <div className="contact-container">
            © 2026 Bahrain Home Nursing Care.
            All rights reserved.
          </div>

        </div>

      </footer>

    </div>
  );
}

export default Contact;