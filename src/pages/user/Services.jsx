import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoMark from "../../assets/noor-al-afiya-mark.png";

import patientCareImage from "../../assets/services/patient-care.jpg";
import elderCareImage from "../../assets/services/elder-care.jpg";
import newbornCareImage from "../../assets/services/newborn-care.jpg";
import childrenCareImage from "../../assets/services/children-care.jpg";

import "./Services.css";

const services = [
  {
    id: "patient",
    number: "01",
    icon: "✚",
    title: "Patient Care",
    image: patientCareImage,
    shortDescription:
      "Professional support for patients who need dependable care and assistance at home.",
    description:
      "Our patient care service is designed to support individuals who require assistance at home. Care requirements can vary from normal mobility to wheelchair, bedridden and ventilator support.",
    features: [
      "Personalized patient support",
      "Wheelchair and bedridden care",
      "Ventilator care option",
      "Flexible 12-hour or 24-hour shifts",
    ],
  },
  {
    id: "elder",
    number: "02",
    icon: "♡",
    title: "Elder Care",
    image: elderCareImage,
    shortDescription:
      "Comfort-focused care and assistance for elderly people in the familiar surroundings of home.",
    description:
      "Our elder care service focuses on providing respectful assistance and everyday support for elderly people while helping families arrange care according to their requirements.",
    features: [
      "Dedicated elder support",
      "Mobility assistance",
      "Bedridden care option",
      "Flexible 12-hour or 24-hour shifts",
    ],
  },
  {
    id: "newborn",
    number: "03",
    icon: "✦",
    title: "Newborn Care",
    image: newbornCareImage,
    shortDescription:
      "Gentle and attentive support for newborn babies and families during the early stages of care.",
    description:
      "Our newborn care service provides a structured way for families to request support based on the baby's specific care requirements.",
    features: [
      "Newborn care support",
      "Premature baby care option",
      "Special care requirements",
      "Flexible care shifts",
    ],
  },
  {
    id: "children",
    number: "04",
    icon: "◉",
    title: "Children's Care",
    image: childrenCareImage,
    shortDescription:
      "Safe and caring support designed around the individual needs of children.",
    description:
      "Our children's care service allows families to request home-care support based on the child's condition and care requirements.",
    features: [
      "Child-focused support",
      "Normal care option",
      "Special care requirements",
      "Flexible care shifts",
    ],
  },
];

function Services() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const selectService = (serviceId) => {
    setMenuOpen(false);
    navigate(`/care/${serviceId}`);
  };

  return (
    <div className="services-page-new">

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <div className="services-top-strip">

        <div className="services-container services-top-inner">

          <span>
            Professional home nursing care in Bahrain
          </span>

          <div className="services-top-contact">

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


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <header className="services-nav-wrap">

        <div className="services-container services-nav">

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
            className={`services-menu-toggle ${
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
            className={`services-nav-links ${
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
              onClick={() => setMenuOpen(false)}
            >
              About Us
            </Link>

            <Link
              to="/services"
              className="active"
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


      {/* =====================================================
          HERO
      ===================================================== */}

      <main>

        <section className="services-hero">

          <div className="services-container services-hero-content">

            <div className="services-hero-copy">

              <span className="services-eyebrow">
                OUR HOME CARE SERVICES
              </span>

              <h1>
                Care options designed
                <span> around you.</span>
              </h1>

              <p>
                Explore our home-care services and
                choose the support that best matches
                your family's requirements.
              </p>

              <div className="services-breadcrumb">

                <Link to="/">
                  Home
                </Link>

                <span>
                  /
                </span>

                <strong>
                  Our Services
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            SERVICE INTRO
        ===================================================== */}

        <section className="services-intro">

          <div className="services-container">

            <div className="services-section-heading">

              <span className="services-eyebrow">
                WHAT WE OFFER
              </span>

              <h2>
                Home care for different needs
              </h2>

              <p>
                Select a service below to book an appointment
                and submit your care request.
              </p>

            </div>


            {/* =================================================
                SERVICE CARDS
            ================================================= */}

            <div className="services-card-grid">

              {services.map((service) => (

                <article
                  className="new-service-card"
                  key={service.id}
                >

                  {/* SERVICE IMAGE */}

                  <div className="service-card-image-wrap">

                    <img
                      src={service.image}
                      alt={`${service.title} home nursing care`}
                      className="service-card-image"
                    />

                  </div>


                  {/* CARD TOP */}

                  <div className="service-card-top">

                    <span className="service-number">
                      {service.number}
                    </span>

                    <div className="new-service-icon">
                      {service.icon}
                    </div>

                  </div>


                  <h3>
                    {service.title}
                  </h3>

                  <p className="service-short-text">
                    {service.shortDescription}
                  </p>


                  <div className="service-feature-list">

                    {service.features.map(
                      (feature) => (

                        <div
                          className="service-feature"
                          key={feature}
                        >

                          <span>
                            ✓
                          </span>

                          <p>
                            {feature}
                          </p>

                        </div>

                      )
                    )}

                  </div>


                  <button
                    type="button"
                    className="service-select-button"
                    onClick={() =>
                      selectService(service.id)
                    }
                  >
                    Book Appointment

                    <span>
                      →
                    </span>

                  </button>

                </article>

              ))}

            </div>

          </div>

        </section>


        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <section className="services-process">

          <div className="services-container">

            <div className="services-section-heading">

              <span className="services-eyebrow">
                SIMPLE PROCESS
              </span>

              <h2>
                Getting started is easy
              </h2>

              <p>
                Our request journey is designed to
                keep the process simple and clear.
              </p>

            </div>


            <div className="process-grid">

              <div className="process-step">

                <div className="process-number">
                  01
                </div>

                <div className="process-icon">
                  ◉
                </div>

                <h3>
                  Choose a Service
                </h3>

                <p>
                  Select the type of care that
                  matches your requirements.
                </p>

              </div>


              <div className="process-connector" />


              <div className="process-step">

                <div className="process-number">
                  02
                </div>

                <div className="process-icon">
                  ✎
                </div>

                <h3>
                  Submit Details
                </h3>

                <p>
                  Provide the required care and
                  contact information.
                </p>

              </div>


              <div className="process-connector" />


              <div className="process-step">

                <div className="process-number">
                  03
                </div>

                <div className="process-icon">
                  ✓
                </div>

                <h3>
                  Track Your Request
                </h3>

                <p>
                  Follow the progress of your request
                  through the status tracker.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            SERVICE DETAIL STRIP
        ===================================================== */}

        <section className="services-detail">

          <div className="services-container services-detail-grid">

            <div>

              <span className="services-eyebrow">
                CARE WITH CLARITY
              </span>

              <h2>
                Choose the support
                your family needs.
              </h2>

              <p>
                Every care category has different
                requirements. Our service forms are
                designed to collect the essential
                information needed for your selected
                care type.
              </p>

            </div>


            <div className="services-detail-points">

              <div>

                <span>
                  01
                </span>

                <strong>
                  Patient-focused
                </strong>

                <p>
                  Care requirements are collected
                  according to the selected service.
                </p>

              </div>


              <div>

                <span>
                  02
                </span>

                <strong>
                  Flexible shifts
                </strong>

                <p>
                  Select available care durations
                  according to your requirements.
                </p>

              </div>


              <div>

                <span>
                  03
                </span>

                <strong>
                  Request tracking
                </strong>

                <p>
                  Follow your request after
                  submitting your details.
                </p>

              </div>

            </div>

          </div>

        </section>


      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="services-footer">

        <div className="services-container services-footer-grid">


          <div className="services-footer-brand">
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


        <div className="services-container services-footer-bottom">

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

export default Services;