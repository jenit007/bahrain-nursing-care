import { useState } from "react";
import { Link } from "react-router-dom";
import logoMark from "../assets/noor-al-afiya-mark.png";
import "./Home.css";
import "./WhyUs.css";

function WhyUs() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reasons = [
    {
      number: "01",
      title: "Personalized Care",
      text: "Every care request is handled according to the individual needs and requirements of the patient or family.",
    },
    {
      number: "02",
      title: "Experienced Care",
      text: "Our service model is designed around dependable home-based care and professional support.",
    },
    {
      number: "03",
      title: "Family-Focused Support",
      text: "We keep families informed throughout the care request and service process.",
    },
    {
      number: "04",
      title: "Flexible Care Options",
      text: "Choose from different care conditions and shift options based on your requirements.",
    },
    {
      number: "05",
      title: "Simple Request Process",
      text: "Submit your care requirements through a simple online process and track your request status.",
    },
    {
      number: "06",
      title: "Dedicated Support",
      text: "Our service approach focuses on making home care more convenient, organized and accessible.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Choose Your Care",
      text: "Select the type of home care service you need.",
    },
    {
      number: "02",
      title: "Share Your Details",
      text: "Provide the required patient and care information.",
    },
    {
      number: "03",
      title: "Request Verification",
      text: "Your request is reviewed and verified by our administration team.",
    },
    {
      number: "04",
      title: "Care Arrangement",
      text: "Once verified, the required care arrangement is initiated.",
    },
  ];

  return (
    <div className="why-page">

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
            <Link to="/why-us" onClick={() => setMenuOpen(false)} className="active">Why Choose Us</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>
            <Link to="/careers" onClick={() => setMenuOpen(false)}>Job Opportunities</Link>
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}

      <section className="why-hero">

        <div className="why-container why-hero-content">

          <div className="why-breadcrumb">
            Home <span>/</span> Why Choose Us
          </div>

          <p className="why-hero-label">
            CARE YOU CAN TRUST
          </p>

          <h1>
            Why Choose Our
            <span> Home Nursing Care?</span>
          </h1>

          <p>
            We focus on providing organized, compassionate and
            convenient home care services designed around the
            needs of individuals and families in Bahrain.
          </p>

          <div className="why-hero-buttons">

            <Link
              to="/services"
              className="why-primary-btn"
            >
              Explore Our Services
            </Link>

            <Link
              to="/contact"
              className="why-secondary-btn"
            >
              Contact Us
            </Link>

          </div>

        </div>

      </section>

      {/* ================= INTRO ================= */}

      <section className="why-intro">

        <div className="why-container why-intro-grid">

          <div className="why-intro-left">

            <p className="why-section-label">
              WHY US
            </p>

            <h2>
              Care designed around
              <span> your needs.</span>
            </h2>

          </div>

          <div className="why-intro-right">

            <p>
              Choosing home nursing care is an important decision.
              Our approach is built around making the process
              straightforward, transparent and centered on the
              needs of every family.
            </p>

            <p>
              From submitting a care request to tracking its
              progress, we aim to provide a simple experience
              while keeping care requirements at the center of
              the process.
            </p>

          </div>

        </div>

      </section>

      {/* ================= REASONS ================= */}

      <section className="why-reasons">

        <div className="why-container">

          <div className="why-heading">

            <p className="why-section-label">
              OUR APPROACH
            </p>

            <h2>
              What makes our
              <span> care experience different?</span>
            </h2>

            <p>
              Our service is built around convenience,
              communication and personalized care.
            </p>

          </div>

          <div className="why-reasons-grid">

            {reasons.map((reason) => (
              <div
                className="why-reason-card"
                key={reason.number}
              >

                <div className="why-reason-number">
                  {reason.number}
                </div>

                <div>
                  <h3>{reason.title}</h3>

                  <p>
                    {reason.text}
                  </p>
                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* ================= CARE AREAS ================= */}

      <section className="why-care-section">

        <div className="why-container">

          <div className="why-heading center">

            <p className="why-section-label">
              OUR CARE AREAS
            </p>

            <h2>
              Support for different
              <span> care needs.</span>
            </h2>

          </div>

          <div className="why-care-grid">

            <div className="why-care-card">
              <div className="why-care-icon">+</div>

              <h3>Patient Care</h3>

              <p>
                Home care support for patients with different
                care requirements and conditions.
              </p>

              <Link to="/care/patient">
                Book Appointment →
              </Link>
            </div>

            <div className="why-care-card">
              <div className="why-care-icon">♥</div>

              <h3>Elder Care</h3>

              <p>
                Dedicated home care support designed around
                the comfort and daily needs of elderly people.
              </p>

              <Link to="/care/elder">
                Book Appointment →
              </Link>
            </div>

            <div className="why-care-card">
              <div className="why-care-icon">✦</div>

              <h3>Newborn Care</h3>

              <p>
                Support for families requiring care for
                newborn and premature babies.
              </p>

              <Link to="/care/newborn">
                Book Appointment →
              </Link>
            </div>

            <div className="why-care-card">
              <div className="why-care-icon">●</div>

              <h3>Children's Care</h3>

              <p>
                Home care support designed around the needs
                of children and their families.
              </p>

              <Link to="/care/children">
                Book Appointment →
              </Link>
            </div>

          </div>

        </div>

      </section>

      {/* ================= PROCESS ================= */}

      <section className="why-process">

        <div className="why-container">

          <div className="why-process-header">

            <div>
              <p className="why-section-label">
                SIMPLE PROCESS
              </p>

              <h2>
                Getting started is
                <span> simple.</span>
              </h2>
            </div>

            <p>
              Our online request process helps you provide
              your care requirements and follow the progress
              of your request.
            </p>

          </div>

          <div className="why-process-grid">

            {steps.map((step) => (
              <div
                className="why-process-card"
                key={step.number}
              >

                <span>
                  {step.number}
                </span>

                <h3>
                  {step.title}
                </h3>

                <p>
                  {step.text}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="why-footer">

        <div className="why-container why-footer-grid">

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

        <div className="why-footer-bottom">
          <div className="why-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>© 2026 NOOR AL AFIYA. All rights reserved.</span>
            <span>Home Nursing • Bahrain</span>
          </div>
        </div>

      </footer>

    </div>
  );
}

export default WhyUs;