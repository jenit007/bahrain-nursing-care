import { Link } from "react-router-dom";
import "./ElderCare.css";

function ElderCare() {
  return (
    <div className="elder-care-page">

      {/* ================= TOP BAR ================= */}

      <div className="elder-topbar">
        <div className="elder-container elder-topbar-inner">

          <span>
            Bahrain Home Nursing Care
          </span>

          <div className="elder-topbar-right">
            <span>24/7 Home Care Support</span>
            <span>•</span>
            <span>Bahrain</span>
          </div>

        </div>
      </div>


      {/* ================= NAVIGATION ================= */}

      <header className="elder-navbar">

        <div className="elder-container elder-nav-inner">

          <Link
            to="/"
            className="elder-logo"
          >
            <span className="elder-logo-main">
              Bahrain
            </span>

            <span className="elder-logo-sub">
              HOME NURSING CARE
            </span>
          </Link>


          <nav className="elder-nav-links">

            <Link to="/">
              Home
            </Link>

            <Link to="/about">
              About Us
            </Link>

            <Link
              to="/services"
              className="active"
            >
              Our Services
            </Link>

            <Link to="/why-us">
              Why Choose Us
            </Link>

            <Link to="/contact">
              Contact Us
            </Link>

          </nav>


          <Link
            to="/login"
            className="elder-login-btn"
          >
            Login
          </Link>

        </div>

      </header>


      {/* ================= HERO ================= */}

      <section className="elder-hero">

        <div className="elder-container elder-hero-content">

          <p className="elder-eyebrow">
            HOME NURSING SERVICES
          </p>

          <h1>
            Elder Care
          </h1>

          <p className="elder-hero-description">
            Compassionate home-care support designed to help
            elderly individuals maintain comfort, dignity and
            independence in familiar surroundings.
          </p>


          <div className="elder-hero-buttons">

            <Link
              to="/care/elder"
              className="elder-primary-btn"
            >
              Request Elder Care
            </Link>

            <Link
              to="/services"
              className="elder-secondary-btn"
            >
              View All Services
            </Link>

          </div>

        </div>

      </section>


      {/* ================= OVERVIEW ================= */}

      <section className="elder-overview">

        <div className="elder-container elder-two-column">

          <div className="elder-overview-text">

            <p className="elder-section-label">
              ELDER CARE SERVICES
            </p>

            <h2>
              Respectful care for elderly people at home
            </h2>

            <p>
              Our Elder Care service is designed to provide
              dependable assistance to elderly individuals who
              need support with daily activities, mobility,
              personal care or continuous supervision.
            </p>

            <p>
              Families can submit their requirements according
              to the elderly person's condition and preferred
              care duration.
            </p>

          </div>


          <div className="elder-overview-card">

            <div className="elder-overview-icon">
              ♥
            </div>

            <h3>
              Comfort & dignity
            </h3>

            <p>
              Supporting elderly individuals with care that
              respects their comfort, routine and individual
              needs.
            </p>

          </div>

        </div>

      </section>


      {/* ================= CARE OPTIONS ================= */}

      <section className="elder-options">

        <div className="elder-container">

          <div className="elder-section-heading">

            <p className="elder-section-label">
              CARE OPTIONS
            </p>

            <h2>
              Support based on individual needs
            </h2>

            <p>
              Choose the care requirement that best describes
              the elderly person's current needs.
            </p>

          </div>


          <div className="elder-options-grid">

            {/* Normal */}

            <div className="elder-option-card">

              <div className="elder-option-number">
                01
              </div>

              <h3>
                Normal Elder Care
              </h3>

              <p>
                Assistance with everyday activities, personal
                routines and general supervision at home.
              </p>

            </div>


            {/* Wheelchair */}

            <div className="elder-option-card">

              <div className="elder-option-number">
                02
              </div>

              <h3>
                Wheelchair Care
              </h3>

              <p>
                Support with mobility, transfers and everyday
                activities for elderly wheelchair users.
              </p>

            </div>


            {/* Bedridden */}

            <div className="elder-option-card">

              <div className="elder-option-number">
                03
              </div>

              <h3>
                Bedridden Elder Care
              </h3>

              <p>
                Dedicated assistance for elderly individuals
                who require care while remaining in bed.
              </p>

            </div>


            {/* Other */}

            <div className="elder-option-card">

              <div className="elder-option-number">
                04
              </div>

              <h3>
                Other Requirements
              </h3>

              <p>
                Support for elderly care requirements that do
                not fall under the standard categories.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= SUPPORT ================= */}

      <section className="elder-support">

        <div className="elder-container">

          <div className="elder-section-heading">

            <p className="elder-section-label">
              OUR SUPPORT
            </p>

            <h2>
              Elder care support
            </h2>

            <p>
              Our support focuses on helping elderly individuals
              remain comfortable and supported at home.
            </p>

          </div>


          <div className="elder-support-grid">

            <div className="elder-support-item">

              <span className="elder-check">
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


            <div className="elder-support-item">

              <span className="elder-check">
                ✓
              </span>

              <div>

                <h3>
                  Mobility Assistance
                </h3>

                <p>
                  Support with movement, transfers and
                  mobility-related activities.
                </p>

              </div>

            </div>


            <div className="elder-support-item">

              <span className="elder-check">
                ✓
              </span>

              <div>

                <h3>
                  Comfort & Companionship
                </h3>

                <p>
                  Friendly support that helps elderly people
                  feel comfortable and cared for.
                </p>

              </div>

            </div>


            <div className="elder-support-item">

              <span className="elder-check">
                ✓
              </span>

              <div>

                <h3>
                  Medication Support
                </h3>

                <p>
                  Assistance with medication routines according
                  to the care requirements.
                </p>

              </div>

            </div>


            <div className="elder-support-item">

              <span className="elder-check">
                ✓
              </span>

              <div>

                <h3>
                  Daily Monitoring
                </h3>

                <p>
                  Regular observation and support based on the
                  elderly person's needs.
                </p>

              </div>

            </div>


            <div className="elder-support-item">

              <span className="elder-check">
                ✓
              </span>

              <div>

                <h3>
                  Family Assistance
                </h3>

                <p>
                  Helping families coordinate and understand
                  elderly care requirements.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= SHIFTS ================= */}

      <section className="elder-shifts">

        <div className="elder-container">

          <div className="elder-shifts-content">

            <div className="elder-shifts-text">

              <p className="elder-section-label">
                FLEXIBLE SHIFTS
              </p>

              <h2>
                Choose a care schedule that works for you
              </h2>

              <p>
                Elder Care requests can be submitted according
                to the required care duration.
              </p>

            </div>


            <div className="elder-shift-grid">

              <div className="elder-shift-card">

                <strong>
                  12 Hours
                </strong>

                <span>
                  12-hour care shift
                </span>

              </div>


              <div className="elder-shift-card">

                <strong>
                  24 Hours
                </strong>

                <span>
                  24-hour care support
                </span>

              </div>


              <div className="elder-shift-card">

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

      <section className="elder-cta">

        <div className="elder-container elder-cta-inner">

          <div>

            <p className="elder-section-label">
              NEED ELDER CARE?
            </p>

            <h2>
              Tell us about your elderly care requirements.
            </h2>

            <p>
              Submit your Elder Care request and provide the
              information needed to understand your requirements.
            </p>

          </div>


          <Link
            to="/care/elder"
            className="elder-primary-btn"
          >
            Request Elder Care
          </Link>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="elder-footer">

        <div className="elder-container elder-footer-grid">

          <div>

            <Link
              to="/"
              className="elder-footer-logo"
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


        <div className="elder-footer-bottom">

          <div className="elder-container">
            © 2026 Bahrain Home Nursing Care.
            All rights reserved.
          </div>

        </div>

      </footer>

    </div>
  );
}

export default ElderCare;