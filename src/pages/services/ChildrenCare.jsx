import { Link } from "react-router-dom";
import "./ChildrenCare.css";

function ChildrenCare() {
  return (
    <div className="children-care-page">
      <div className="children-topbar">
        <div className="children-container children-topbar-inner">
          <span>Bahrain Home Nursing Care</span>
          <div className="children-topbar-right">
            <span>24/7 Home Care Support</span>
            <span>•</span>
            <span>Bahrain</span>
          </div>
        </div>
      </div>

      <header className="children-navbar">
        <div className="children-container children-nav-inner">
          <Link to="/" className="children-logo">
            <span className="children-logo-main">Bahrain</span>
            <span className="children-logo-sub">HOME NURSING CARE</span>
          </Link>

          <nav className="children-nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/services">Our Services</Link>
            <Link to="/why-us">Why Choose Us</Link>
            <Link to="/contact">Contact Us</Link>
          </nav>

          <Link to="/login" className="children-login-btn">
            Login
          </Link>
        </div>
      </header>

      <section className="children-hero">
        <div className="children-container children-hero-content">
          <p className="children-eyebrow">HOME NURSING SERVICES</p>
          <h1>Children's Care</h1>
          <p className="children-hero-description">
            Caring and dependable home-care support designed around
            the individual needs of children and their families.
          </p>

          <div className="children-hero-buttons">
            <Link to="/care/children" className="children-primary-btn">
              Request Children's Care
            </Link>
            <Link to="/services" className="children-secondary-btn">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      <section className="children-overview">
        <div className="children-container children-two-column">
          <div className="children-overview-text">
            <p className="children-section-label">CHILDREN'S CARE SERVICES</p>
            <h2>Support designed around every child</h2>
            <p>
              Our Children's Care service helps families request home
              care according to the child's condition and individual
              support requirements.
            </p>
            <p>
              Families can provide the essential information needed
              to arrange care for normal, disability-related or other
              special care needs.
            </p>
          </div>

          <div className="children-overview-card">
            <div className="children-overview-icon">♥</div>
            <h3>Child-focused support</h3>
            <p>
              Care arrangements can be based on the child's needs and
              the family's preferred care schedule.
            </p>
          </div>
        </div>
      </section>

      <section className="children-options">
        <div className="children-container">
          <div className="children-section-heading">
            <p className="children-section-label">CARE OPTIONS</p>
            <h2>Support based on the child's needs</h2>
            <p>
              Choose the care requirement that best describes the
              child's current needs.
            </p>
          </div>

          <div className="children-options-grid">
            <div className="children-option-card">
              <div className="children-option-number">01</div>
              <h3>Normal Child Care</h3>
              <p>
                Routine support and assistance with everyday
                child-care requirements at home.
              </p>
            </div>

            <div className="children-option-card">
              <div className="children-option-number">02</div>
              <h3>Disable</h3>
              <p>
                Home-care support for children with disability-related
                care requirements.
              </p>
            </div>

            <div className="children-option-card">
              <div className="children-option-number">03</div>
              <h3>Abnormal</h3>
              <p>
                Support for children with care requirements that need
                additional attention or specialized assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="children-support">
        <div className="children-container">
          <div className="children-section-heading">
            <p className="children-section-label">OUR SUPPORT</p>
            <h2>Children's care support</h2>
            <p>
              Support is structured around the child's daily needs and
              the family's requested care requirements.
            </p>
          </div>

          <div className="children-support-grid">
            <div className="children-support-item">
              <span className="children-check">✓</span>
              <div>
                <h3>Daily Child Care</h3>
                <p>
                  Assistance with everyday routines and child-care
                  activities.
                </p>
              </div>
            </div>

            <div className="children-support-item">
              <span className="children-check">✓</span>
              <div>
                <h3>Comfort & Supervision</h3>
                <p>
                  Support focused on the child's comfort and
                  appropriate supervision.
                </p>
              </div>
            </div>

            <div className="children-support-item">
              <span className="children-check">✓</span>
              <div>
                <h3>Special Care Support</h3>
                <p>
                  Support for disability-related and other special
                  care requirements.
                </p>
              </div>
            </div>

            <div className="children-support-item">
              <span className="children-check">✓</span>
              <div>
                <h3>Family Assistance</h3>
                <p>
                  Helping families coordinate children's home-care
                  requirements.
                </p>
              </div>
            </div>

            <div className="children-support-item">
              <span className="children-check">✓</span>
              <div>
                <h3>Routine Monitoring</h3>
                <p>
                  Observation and support according to the requested
                  care arrangement.
                </p>
              </div>
            </div>

            <div className="children-support-item">
              <span className="children-check">✓</span>
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

      <section className="children-shifts">
        <div className="children-container children-shifts-content">
          <div className="children-shifts-text">
            <p className="children-section-label">FLEXIBLE SHIFTS</p>
            <h2>Choose a care schedule that works for your family</h2>
            <p>
              Children's Care requests can be submitted according to
              the required care duration.
            </p>
          </div>

          <div className="children-shift-grid">
            <div className="children-shift-card">
              <strong>12 Hours</strong>
              <span>12-hour care shift</span>
            </div>
            <div className="children-shift-card">
              <strong>24 Hours</strong>
              <span>24-hour care support</span>
            </div>
            <div className="children-shift-card">
              <strong>Other</strong>
              <span>Specify your required shift</span>
            </div>
          </div>
        </div>
      </section>

      <section className="children-cta">
        <div className="children-container children-cta-inner">
          <div>
            <p className="children-section-label">NEED CHILDREN'S CARE?</p>
            <h2>Tell us about your child's care requirements.</h2>
            <p>
              Submit your Children's Care request and provide the
              information needed to understand your requirements.
            </p>
          </div>

          <Link to="/care/children" className="children-primary-btn">
            Request Children's Care
          </Link>
        </div>
      </section>

      <footer className="children-footer">
        <div className="children-container children-footer-grid">
          <div>
            <Link to="/" className="children-footer-logo">
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

        <div className="children-footer-bottom">
          <div className="children-container">
            © 2026 Bahrain Home Nursing Care. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ChildrenCare;
