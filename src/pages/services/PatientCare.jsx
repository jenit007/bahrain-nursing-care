import { Link } from "react-router-dom";
import "./PatientCare.css";

function PatientCare() {
  return (
    <div className="patient-care-page">

      {/* ================= TOP BAR ================= */}
      <div className="patient-topbar">
        <div className="patient-container patient-topbar-inner">
          <span>Bahrain Home Nursing Care</span>

          <div className="patient-topbar-right">
            <span>24/7 Home Care Support</span>
            <span>•</span>
            <span>Bahrain</span>
          </div>
        </div>
      </div>

      {/* ================= NAVIGATION ================= */}
      <header className="patient-navbar">
        <div className="patient-container patient-nav-inner">

          <Link to="/" className="patient-logo">
            <span className="patient-logo-main">
              Bahrain
            </span>

            <span className="patient-logo-sub">
              HOME NURSING CARE
            </span>
          </Link>

          <nav className="patient-nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/services">Our Services</Link>
            <Link to="/why-us">Why Choose Us</Link>
            <Link to="/contact">Contact Us</Link>
          </nav>

          <Link
            to="/login"
            className="patient-login-btn"
          >
            Login
          </Link>

        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="patient-hero">
        <div className="patient-container patient-hero-content">

          <p className="patient-eyebrow">
            HOME NURSING SERVICES
          </p>

          <h1>
            Patient Care
          </h1>

          <p className="patient-hero-description">
            Professional home nursing support designed to provide
            compassionate, safe and reliable care for patients
            in the comfort of their own home.
          </p>

          <div className="patient-hero-buttons">

            <Link
              to="/care/patient"
              className="patient-primary-btn"
            >
              Request Patient Care
            </Link>

            <Link
              to="/services"
              className="patient-secondary-btn"
            >
              View All Services
            </Link>

          </div>

        </div>
      </section>

      {/* ================= OVERVIEW ================= */}
      <section className="patient-overview">
        <div className="patient-container patient-two-column">

          <div className="patient-overview-text">

            <p className="patient-section-label">
              PATIENT CARE SERVICES
            </p>

            <h2>
              Dedicated care for patients at home
            </h2>

            <p>
              Our Patient Care service is designed for individuals
              who require professional assistance, supervision and
              support while recovering or managing their daily
              care needs at home.
            </p>

            <p>
              Care can be arranged according to the patient's
              condition and required shift, helping families
              receive dependable support throughout the day or
              night.
            </p>

          </div>

          <div className="patient-overview-card">

            <div className="patient-overview-icon">
              +
            </div>

            <h3>
              Patient-focused support
            </h3>

            <p>
              Care plans can accommodate different patient
              conditions and home-care requirements.
            </p>

          </div>

        </div>
      </section>

      {/* ================= CARE OPTIONS ================= */}
      <section className="patient-options">
        <div className="patient-container">

          <div className="patient-section-heading">

            <p className="patient-section-label">
              CARE OPTIONS
            </p>

            <h2>
              Support based on patient needs
            </h2>

            <p>
              Select the care requirement that best describes
              the patient's current needs.
            </p>

          </div>

          <div className="patient-options-grid">

            {/* Normal */}
            <div className="patient-option-card">

              <div className="patient-option-number">
                01
              </div>

              <h3>
                Normal Patient Care
              </h3>

              <p>
                Assistance with routine daily activities,
                personal care and general supervision at home.
              </p>

            </div>

            {/* Wheelchair */}
            <div className="patient-option-card">

              <div className="patient-option-number">
                02
              </div>

              <h3>
                Wheelchair Care
              </h3>

              <p>
                Support with mobility, transfers, personal
                assistance and daily activities for wheelchair
                users.
              </p>

            </div>

            {/* Bedridden */}
            <div className="patient-option-card">

              <div className="patient-option-number">
                03
              </div>

              <h3>
                Bedridden Patient Care
              </h3>

              <p>
                Dedicated assistance for patients who require
                continuous support while remaining in bed.
              </p>

            </div>

            {/* Ventilator */}
            <div className="patient-option-card">

              <div className="patient-option-number">
                04
              </div>

              <h3>
                Ventilator Care
              </h3>

              <p>
                Specialized home-care support for patients who
                require ventilator-related assistance and close
                monitoring.
              </p>

            </div>

            {/* Other */}
            <div className="patient-option-card">

              <div className="patient-option-number">
                05
              </div>

              <h3>
                Other Requirements
              </h3>

              <p>
                Care support for patient needs that do not fall
                under the standard care categories.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* ================= CARE SUPPORT ================= */}
      <section className="patient-support">
        <div className="patient-container">

          <div className="patient-section-heading">

            <p className="patient-section-label">
              OUR SUPPORT
            </p>

            <h2>
              Patient care support
            </h2>

            <p>
              Our care approach focuses on the patient's comfort,
              safety and everyday requirements.
            </p>

          </div>

          <div className="patient-support-grid">

            {/* Daily Personal Care */}
            <div className="patient-support-item">

              <span className="patient-check">
                ✓
              </span>

              <div>
                <h3>
                  Daily Personal Care
                </h3>

                <p>
                  Assistance with personal routines and everyday
                  activities.
                </p>
              </div>

            </div>

            {/* Mobility */}
            <div className="patient-support-item">

              <span className="patient-check">
                ✓
              </span>

              <div>
                <h3>
                  Mobility Support
                </h3>

                <p>
                  Assistance with movement, transfers and
                  mobility-related needs.
                </p>
              </div>

            </div>

            {/* Medication */}
            <div className="patient-support-item">

              <span className="patient-check">
                ✓
              </span>

              <div>
                <h3>
                  Medication Management
                </h3>

                <p>
                  Support with medication routines according to
                  the patient's care requirements.
                </p>
              </div>

            </div>

            {/* Monitoring */}
            <div className="patient-support-item">

              <span className="patient-check">
                ✓
              </span>

              <div>
                <h3>
                  Patient Monitoring
                </h3>

                <p>
                  Regular observation and support according to
                  the patient's care needs.
                </p>
              </div>

            </div>

            {/* Comfort */}
            <div className="patient-support-item">

              <span className="patient-check">
                ✓
              </span>

              <div>
                <h3>
                  Comfort & Assistance
                </h3>

                <p>
                  Support focused on comfort, safety and
                  everyday patient needs.
                </p>
              </div>

            </div>

            {/* Family */}
            <div className="patient-support-item">

              <span className="patient-check">
                ✓
              </span>

              <div>
                <h3>
                  Family Support
                </h3>

                <p>
                  Helping families coordinate and understand
                  the patient's home-care requirements.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= SHIFT OPTIONS ================= */}
      <section className="patient-shifts">
        <div className="patient-container">

          <div className="patient-shifts-content">

            <div className="patient-shifts-text">

              <p className="patient-section-label">
                FLEXIBLE SHIFTS
              </p>

              <h2>
                Choose a care schedule that works for you
              </h2>

              <p>
                Patient care requests can be submitted according
                to the required care duration.
              </p>

            </div>

            <div className="patient-shift-grid">

              <div className="patient-shift-card">
                <strong>
                  12 Hours
                </strong>

                <span>
                  12-hour care shift
                </span>
              </div>

              <div className="patient-shift-card">
                <strong>
                  24 Hours
                </strong>

                <span>
                  24-hour care support
                </span>
              </div>

              <div className="patient-shift-card">
                <strong>
                  Other
                </strong>

                <span>
                  Specify your required shift
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="patient-cta">
        <div className="patient-container patient-cta-inner">

          <div>

            <p className="patient-section-label">
              NEED PATIENT CARE?
            </p>

            <h2>
              Tell us about your care requirements.
            </h2>

            <p>
              Submit your patient care request and provide the
              information needed to understand your requirements.
            </p>

          </div>

          <Link
            to="/care/patient"
            className="patient-primary-btn"
          >
            Request Patient Care
          </Link>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="patient-footer">

        <div className="patient-container patient-footer-grid">

          <div>

            <Link
              to="/"
              className="patient-footer-logo"
            >
              Bahrain

              <span>
                HOME NURSING CARE
              </span>
            </Link>

            <p>
              Professional home nursing care support designed
              around individuals and families in Bahrain.
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

            <Link to="/contact">
              Contact Us →
            </Link>

          </div>

        </div>

        <div className="patient-footer-bottom">

          <div className="patient-container">
            © 2026 Bahrain Home Nursing Care.
            All rights reserved.
          </div>

        </div>

      </footer>

    </div>
  );
}

export default PatientCare;