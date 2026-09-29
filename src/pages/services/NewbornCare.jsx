import { Link } from "react-router-dom";
import "./NewbornCare.css";

function NewbornCare() {
  return (
    <div className="newborn-care-page">
      <div className="newborn-topbar">
        <div className="newborn-container newborn-topbar-inner">
          <span>Bahrain Home Nursing Care</span>
          <div className="newborn-topbar-right">
            <span>24/7 Home Care Support</span>
            <span>•</span>
            <span>Bahrain</span>
          </div>
        </div>
      </div>

      <header className="newborn-navbar">
        <div className="newborn-container newborn-nav-inner">
          <Link to="/" className="newborn-logo">
            <span className="newborn-logo-main">Bahrain</span>
            <span className="newborn-logo-sub">HOME NURSING CARE</span>
          </Link>

          <nav className="newborn-nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/services">Our Services</Link>
            <Link to="/why-us">Why Choose Us</Link>
            <Link to="/contact">Contact Us</Link>
          </nav>

          <Link to="/login" className="newborn-login-btn">
            Login
          </Link>
        </div>
      </header>

      <section className="newborn-hero">
        <div className="newborn-container newborn-hero-content">
          <p className="newborn-eyebrow">HOME NURSING SERVICES</p>
          <h1>Newborn Care</h1>
          <p className="newborn-hero-description">
            Gentle and attentive home-care support for newborn babies
            and families during the important early stages of care.
          </p>

          <div className="newborn-hero-buttons">
            <Link to="/care/newborn" className="newborn-primary-btn">
              Request Newborn Care
            </Link>
            <Link to="/services" className="newborn-secondary-btn">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      <section className="newborn-overview">
        <div className="newborn-container newborn-two-column">
          <div className="newborn-overview-text">
            <p className="newborn-section-label">NEWBORN CARE SERVICES</p>
            <h2>Thoughtful support for newborns at home</h2>
            <p>
              Our Newborn Care service helps families request home-care
              support based on the baby's condition and individual needs.
            </p>
            <p>
              Families can provide the essential details needed to
              understand whether the baby requires normal, premature,
              disability-related or other specialized support.
            </p>
          </div>

          <div className="newborn-overview-card">
            <div className="newborn-overview-icon">✦</div>
            <h3>Gentle newborn support</h3>
            <p>
              Care requirements can be arranged according to the
              baby's condition and preferred shift.
            </p>
          </div>
        </div>
      </section>

      <section className="newborn-options">
        <div className="newborn-container">
          <div className="newborn-section-heading">
            <p className="newborn-section-label">CARE OPTIONS</p>
            <h2>Support based on your baby's needs</h2>
            <p>
              Select the care requirement that best describes the
              newborn baby's current needs.
            </p>
          </div>

          <div className="newborn-options-grid">
            <div className="newborn-option-card">
              <div className="newborn-option-number">01</div>
              <h3>Normal Baby Care</h3>
              <p>
                Routine newborn support and assistance with everyday
                baby-care requirements.
              </p>
            </div>

            <div className="newborn-option-card">
              <div className="newborn-option-number">02</div>
              <h3>Premature Baby Care</h3>
              <p>
                Additional home-care support for babies born
                prematurely according to their care requirements.
              </p>
            </div>

            <div className="newborn-option-card">
              <div className="newborn-option-number">03</div>
              <h3>Disable</h3>
              <p>
                Care support for a newborn baby with disability-related
                care requirements.
              </p>
            </div>

            <div className="newborn-option-card">
              <div className="newborn-option-number">04</div>
              <h3>Abnormal</h3>
              <p>
                Support for newborn care requirements that need
                additional attention or specialized assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="newborn-support">
        <div className="newborn-container">
          <div className="newborn-section-heading">
            <p className="newborn-section-label">OUR SUPPORT</p>
            <h2>Newborn care support</h2>
            <p>
              Support is structured around the baby's daily needs and
              the family's requested care requirements.
            </p>
          </div>

          <div className="newborn-support-grid">
            <div className="newborn-support-item">
              <span className="newborn-check">✓</span>
              <div>
                <h3>Daily Baby Care</h3>
                <p>
                  Assistance with everyday newborn-care routines.
                </p>
              </div>
            </div>

            <div className="newborn-support-item">
              <span className="newborn-check">✓</span>
              <div>
                <h3>Comfort & Supervision</h3>
                <p>
                  Support focused on the baby's comfort and routine
                  supervision.
                </p>
              </div>
            </div>

            <div className="newborn-support-item">
              <span className="newborn-check">✓</span>
              <div>
                <h3>Special Care Support</h3>
                <p>
                  Support for premature and other special newborn
                  care requirements.
                </p>
              </div>
            </div>

            <div className="newborn-support-item">
              <span className="newborn-check">✓</span>
              <div>
                <h3>Family Assistance</h3>
                <p>
                  Helping families coordinate newborn home-care
                  requirements.
                </p>
              </div>
            </div>

            <div className="newborn-support-item">
              <span className="newborn-check">✓</span>
              <div>
                <h3>Routine Monitoring</h3>
                <p>
                  Observation and support according to the requested
                  care arrangement.
                </p>
              </div>
            </div>

            <div className="newborn-support-item">
              <span className="newborn-check">✓</span>
              <div>
                <h3>Flexible Care</h3>
                <p>
                  Care requests can be arranged around the family's
                  required shift.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="newborn-shifts">
        <div className="newborn-container newborn-shifts-content">
          <div className="newborn-shifts-text">
            <p className="newborn-section-label">FLEXIBLE SHIFTS</p>
            <h2>Choose a care schedule that works for your family</h2>
            <p>
              Newborn care requests can be submitted according to the
              required care duration.
            </p>
          </div>

          <div className="newborn-shift-grid">
            <div className="newborn-shift-card">
              <strong>12 Hours</strong>
              <span>12-hour care shift</span>
            </div>
            <div className="newborn-shift-card">
              <strong>24 Hours</strong>
              <span>24-hour care support</span>
            </div>
            <div className="newborn-shift-card">
              <strong>Other</strong>
              <span>Specify your required shift</span>
            </div>
          </div>
        </div>
      </section>

      <section className="newborn-cta">
        <div className="newborn-container newborn-cta-inner">
          <div>
            <p className="newborn-section-label">NEED NEWBORN CARE?</p>
            <h2>Tell us about your newborn care requirements.</h2>
            <p>
              Submit your Newborn Care request and provide the
              information needed to understand your requirements.
            </p>
          </div>

          <Link to="/care/newborn" className="newborn-primary-btn">
            Request Newborn Care
          </Link>
        </div>
      </section>

      <footer className="newborn-footer">
        <div className="newborn-container newborn-footer-grid">
          <div>
            <Link to="/" className="newborn-footer-logo">
              Bahrain
              <span>HOME NURSING CARE</span>
            </Link>
            <p>
              Professional home nursing care support designed around
              individuals and families in Bahrain.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/services">Our Services</Link>
            <Link to="/why-us">Why Choose Us</Link>
          </div>

          <div>
            <h4>Services</h4>
            <Link to="/services/patient">Patient Care</Link>
            <Link to="/services/elder">Elder Care</Link>
            <Link to="/services/newborn">Newborn Care</Link>
            <Link to="/services/children">Children's Care</Link>
          </div>

          <div>
            <h4>Contact</h4>
            <p>Bahrain</p>
            <p>24/7 Home Care Support</p>
            <Link to="/contact">Contact Us →</Link>
          </div>
        </div>

        <div className="newborn-footer-bottom">
          <div className="newborn-container">
            © 2026 Bahrain Home Nursing Care. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default NewbornCare;
