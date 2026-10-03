import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoMark from "../assets/noor-al-afiya-mark.png";
import "./About.css";
import aboutCarePhoto from "../assets/about-care-photo.png";

function About() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="about-page">

      {/* ================= TOP BAR ================= */}

      <div className="about-top-strip">

        <div className="about-container about-top-inner">

          <span>
            Professional home nursing care in Bahrain
          </span>

          <div className="about-top-contact">

            <a href="tel:+97300000000">
              +973 0000 0000
            </a>

            <span>•</span>

            <a href="mailto:info@bahrainnursingcare.com">
              info@bahrainnursingcare.com
            </a>

          </div>

        </div>

      </div>


      {/* ================= NAVIGATION ================= */}

      <header className="about-nav-wrap">

        <div className="about-container about-nav">

          <Link
            to="/"
            className="home-brand"
            onClick={() => setMenuOpen(false)}
          >
            <img
              src={logoMark}
              alt="NOOR AL AFIYA"
              className="brand-mark-image"
            />
            <span>
              <strong>
                NOOR AL AFIYA
              </strong>
              <small>
                Home Health Care WLL
              </small>
            </span>
          </Link>


          <button
            type="button"
            className={`about-menu-toggle ${
              menuOpen ? "open" : ""
            }`}
            onClick={() =>
              setMenuOpen((value) => !value)
            }
            aria-label="Toggle navigation"
          >

            <span />
            <span />
            <span />

          </button>


          <nav
            className={`about-nav-links ${
              menuOpen ? "show" : ""
            }`}
          >

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/about"
              className="active"
              onClick={() => setMenuOpen(false)}
            >
              About Us
            </Link>

            <Link
              to="/services"
              onClick={() => setMenuOpen(false)}
            >
              Our Services
            </Link>

            <Link
              to="/why-us"
              onClick={() => setMenuOpen(false)}
            >
              Why Choose Us
            </Link>

            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </Link>

            <Link
              to="/careers"
              onClick={() => setMenuOpen(false)}
            >
              Job Opportunities
            </Link>

          </nav>

        </div>

      </header>


      {/* ================= PAGE HERO ================= */}

      <main>

        <section className="about-hero">

          <div className="about-container about-hero-content">

            <div className="about-hero-copy">

              <span className="about-eyebrow">
                ABOUT BAHRAIN NURSING CARE
              </span>

              <h1>
                Care built around
                <span> people.</span>
              </h1>

              <p>
                We are creating a simple and reliable
                way for families in Bahrain to access
                professional home-care services.
              </p>

              <div className="about-breadcrumb">

                <Link to="/">
                  Home
                </Link>

                <span>
                  /
                </span>

                <strong>
                  About Us
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* ================= INTRODUCTION ================= */}

        <section className="about-intro about-section">

          <div className="about-container about-intro-grid">

            <div className="about-intro-image">

              <img
                src={aboutCarePhoto}
                alt="Professional nurse providing home care"
                className="about-intro-bg-img"
              />

            </div>


            <div className="about-intro-content">

              <span className="about-eyebrow">
                WHO WE ARE
              </span>

              <h2>
                Professional home care,
                with a human approach.
              </h2>

              <p>
                NOOR AL AFIYA is a home-care
                service platform designed to make it
                easier for families to request the care
                support they need.
              </p>

              <p>
                Our platform brings together essential
                care services in one simple experience,
                allowing users to select a service,
                provide care requirements and follow
                the progress of their request.
              </p>

              <p>
                We focus on making the journey clear,
                respectful and convenient for families
                looking for support at home.
              </p>


              <button
                type="button"
                className="about-primary-button"
                onClick={() => navigate("/services")}
              >
                Explore Our Services
                <span>
                  →
                </span>
              </button>

            </div>

          </div>

        </section>


        {/* ================= MISSION ================= */}

        <section className="about-mission">

          <div className="about-container about-mission-grid">

            <div className="about-mission-copy">

              <span className="about-eyebrow">
                OUR APPROACH
              </span>

              <h2>
                Making home care
                easier to navigate.
              </h2>

              <p>
                Care needs can be different for every
                family. Our goal is to provide a clear
                digital journey where users can choose
                the right service and communicate the
                information needed for their request.
              </p>

            </div>


            <div className="about-values">

              <div className="about-value-card">

                <div className="about-value-icon">
                  ♡
                </div>

                <div>

                  <h3>
                    Compassion
                  </h3>

                  <p>
                    We keep the person and their
                    comfort at the center of the
                    care journey.
                  </p>

                </div>

              </div>


              <div className="about-value-card">

                <div className="about-value-icon">
                  ✓
                </div>

                <div>

                  <h3>
                    Transparency
                  </h3>

                  <p>
                    Request progress can be followed
                    through a clear status journey.
                  </p>

                </div>

              </div>


              <div className="about-value-card">

                <div className="about-value-icon">
                  ◷
                </div>

                <div>

                  <h3>
                    Convenience
                  </h3>

                  <p>
                    A straightforward online process
                    makes requesting care easier.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================= SERVICES SUMMARY ================= */}

        <section className="about-services about-section">

          <div className="about-container">

            <div className="about-section-heading">

              <span className="about-eyebrow">
                OUR CARE AREAS
              </span>

              <h2>
                Support for different stages of life.
              </h2>

              <p>
                Our current care services are designed
                around four key areas.
              </p>

            </div>


            <div className="about-care-grid">

              <div className="about-care-card">

                <span className="care-number">
                  01
                </span>

                <div className="care-icon">
                  ✚
                </div>

                <h3>
                  Patient Care
                </h3>

                <p>
                  Personalized support for patients
                  requiring care at home.
                </p>

              </div>


              <div className="about-care-card">

                <span className="care-number">
                  02
                </span>

                <div className="care-icon">
                  ♡
                </div>

                <h3>
                  Elder Care
                </h3>

                <p>
                  Support focused on comfort,
                  assistance and daily needs.
                </p>

              </div>


              <div className="about-care-card">

                <span className="care-number">
                  03
                </span>

                <div className="care-icon">
                  ✦
                </div>

                <h3>
                  Newborn Care
                </h3>

                <p>
                  Gentle care and support for
                  newborn babies.
                </p>

              </div>


              <div className="about-care-card">

                <span className="care-number">
                  04
                </span>

                <div className="care-icon">
                  ◉
                </div>

                <h3>
                  Children's Care
                </h3>

                <p>
                  Caring support designed around
                  children's needs.
                </p>

              </div>

            </div>

          </div>

        </section>


      </main>


      {/* ================= FOOTER ================= */}

      <footer className="about-footer">

        <div className="about-container about-footer-grid">


          <div className="about-footer-brand">
            <Link
              to="/"
              className="home-brand"
            >
              <img
                src={logoMark}
                alt="NOOR AL AFIYA"
                className="brand-mark-image"
              />
              <span>
                <strong>
                  NOOR AL AFIYA
                </strong>
                <small>
                  Home Health Care WLL
                </small>
              </span>
            </Link>

            <p>
              Compassionate home-care services
              for families in Bahrain.
            </p>
          </div>

          <div>
            <h3>
              Quick Links
            </h3>

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

            <Link to="/contact">
              Contact Us
            </Link>

            <Link to="/careers">
              Job Opportunities
            </Link>
          </div>


          <div>

            <h3>
              Care Services
            </h3>

            <Link to="/care/patient">
              Patient Care
            </Link>

            <Link to="/care/elder">
              Elder Care
            </Link>

            <Link to="/care/newborn">
              Newborn Care
            </Link>

            <Link to="/care/children">
              Children's Care
            </Link>

          </div>


          <div>

            <h3>
              Contact
            </h3>

            <a href="tel:+97300000000">
              +973 0000 0000
            </a>

            <a href="mailto:info@bahrainnursingcare.com">
              info@bahrainnursingcare.com
            </a>

            <span>
              Bahrain
            </span>

          </div>

        </div>


        <div className="about-container about-footer-bottom">

          <span>
            © 2026 NOOR AL AFIYA.
            All rights reserved.
          </span>

          <span>
            Professional Home Care Services
          </span>

        </div>

      </footer>

    </div>
  );
}

export default About;