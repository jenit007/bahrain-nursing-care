import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import heroImage from "../assets/home-hero.png";
import aboutCareImage from "../assets/about-care.png";
import patientCareImage from "../assets/services/patient-care.jpg";
import elderCareImage from "../assets/services/elder-care.jpg";
import newbornCareImage from "../assets/services/newborn-care.jpg";
import childrenCareImage from "../assets/services/children-care.jpg";

const services = [
  {
    id: "patient",
    title: "Patient Care",
    text: "Personalized support for patients who need dependable care at home.",
    icon: "✚",
    image: patientCareImage,
  },
  {
    id: "elder",
    title: "Elder Care",
    text: "Comfort-focused assistance that helps older adults stay independent at home.",
    icon: "♡",
    image: elderCareImage,
  },
  {
    id: "newborn",
    title: "Newborn Care",
    text: "Gentle, attentive support for newborn babies and their families.",
    icon: "✦",
    image: newbornCareImage,
  },
  {
    id: "children",
    title: "Children's Care",
    text: "Safe and caring support tailored to the needs of children.",
    icon: "◉",
    image: childrenCareImage,
  },
];

const benefits = [
  {
    icon: "✓",
    title: "Personalized Care",
    text: "Care plans designed around each person's needs and routine.",
  },
  {
    icon: "◷",
    title: "Flexible Support",
    text: "Choose care arrangements and shifts that fit your family.",
  },
  {
    icon: "⌂",
    title: "Care at Home",
    text: "Receive support in the comfort and familiarity of your home.",
  },
  {
    icon: "♡",
    title: "Family Focused",
    text: "A respectful approach that keeps families informed and involved.",
  },
];

function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [careServicesCount, setCareServicesCount] = useState(0);
  const [bookingFlowCount, setBookingFlowCount] = useState(0);
  const statsRef = useRef(null);

  useEffect(() => {
    const statsElement = statsRef.current;

    if (!statsElement) return;

    let animationFrame;
    let started = false;

    const animateCount = (setter, target, duration = 1600) => {
      const startTime = performance.now();

      const update = (currentTime) => {
        const progress = Math.min(
          (currentTime - startTime) / duration,
          1
        );

        const easedProgress =
          1 - Math.pow(1 - progress, 3);

        setter(Math.floor(target * easedProgress));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(update);
        } else {
          setter(target);
        }
      };

      animationFrame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          animateCount(setCareServicesCount, 1200);
          animateCount(setBookingFlowCount, 153);
          observer.unobserve(statsElement);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(statsElement);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".home-scroll-reveal");

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("home-scroll-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const closeMenu = () => {
      setMenuOpen(false);
    };

    window.addEventListener("resize", closeMenu);

    return () => {
      window.removeEventListener("resize", closeMenu);
    };
  }, []);

  const goToLogin = () => {
    setMenuOpen(false);
    navigate("/login");
  };

  const goToService = (serviceId) => {
    setMenuOpen(false);
    navigate(`/services/${serviceId}`);
  };

  return (
    <div className="home-page">

      {/* ================= TOP CONTACT BAR ================= */}

      <div className="top-strip">

        <div className="home-container top-strip-inner">

          <span>
            Professional home nursing care in Bahrain
          </span>

          <div className="top-contact">

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

      <header className="home-nav-wrap">

        <div className="home-container home-nav">

          <Link
            className="home-brand"
            to="/"
            onClick={() => setMenuOpen(false)}
          >

            <span className="brand-mark">
              ✚
            </span>

            <span>

              <strong>
                Bahrain Nursing Care
              </strong>

              <small>
                Professional Care at Home
              </small>

            </span>

          </Link>


          {/* MOBILE MENU BUTTON */}

          <button
            className={`nav-toggle ${
              menuOpen ? "open" : ""
            }`}
            onClick={() =>
              setMenuOpen((value) => !value)
            }
            aria-label="Toggle navigation"
            type="button"
          >

            <span />
            <span />
            <span />

          </button>


          {/* NAVIGATION LINKS */}

          <nav
            className={`home-nav-links ${
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

            <button
              className="nav-login"
              onClick={goToLogin}
              type="button"
            >
              Login
            </button>

          </nav>

        </div>

      </header>


      {/* ================= HERO ================= */}

      <main>

        <section className="home-hero">

          <div className="home-container hero-content">

            <div className="hero-copy">

              <span className="eyebrow">
                CARE THAT FEELS LIKE HOME
              </span>

              <h1>
                Professional care,
                <br />
                <span>
                  right at your home.
                </span>
              </h1>

              <p>
                Compassionate home nursing and care
                services designed to support you and
                your loved ones with comfort, dignity
                and confidence.
              </p>


              <div className="hero-actions">

                <button
                  className="primary-cta"
                  onClick={goToLogin}
                  type="button"
                >
                  Book a Care Service
                  <span>→</span>
                </button>

                <Link
                  className="secondary-cta"
                  to="/services"
                >
                  Explore Services
                </Link>

              </div>


              <div className="hero-trust">

                <span className="trust-icon">
                  ✓
                </span>

                <span>
                  Simple booking
                  &nbsp;•&nbsp;
                  Bahrain-focused home care
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* ================= SERVICES ================= */}

        <section className="service-section section-pad home-scroll-reveal">

          <div className="home-container">

            <div className="section-heading center">

              <span className="eyebrow">
                OUR SERVICES
              </span>

              <h2>
                Care designed around your needs
              </h2>

              <p>
                Choose the home-care service that
                best matches your family's requirements.
              </p>

            </div>


            <div className="service-grid">

              {services.map((service) => (

                <article
                  className="service-card"
                  key={service.id}
                >

                  <div
                    className="service-card-image-background"
                    style={{ backgroundImage: `url(${service.image})` }}
                    aria-hidden="true"
                  />

                  <div className="service-card-content">

                    <div className="service-card-icon">
                      {service.icon}
                    </div>

                  <h3>
                    {service.title}
                  </h3>

                  <p>
                    {service.text}
                  </p>

                  <button
                    className="service-card-button"
                    onClick={() =>
                      goToService(service.id)
                    }
                    type="button"
                  >
                    Learn More
                    <span>→</span>
                  </button>

                  </div>

                </article>

              ))}

            </div>

          </div>

        </section>


        {/* ================= WHY CHOOSE US ================= */}

        <section className="why-section section-pad home-scroll-reveal home-scroll-delay-1">

          <div className="home-container why-grid">

            <div className="why-copy">

              <span className="eyebrow">
                WHY CHOOSE US
              </span>

              <h2>
                Support you can feel comfortable
                bringing home.
              </h2>

              <p>
                Our experience is built around making
                home care clear, accessible and centered
                on the person receiving it.
              </p>


              <div className="benefit-grid">

                {benefits.map((item) => (

                  <div
                    className="benefit"
                    key={item.title}
                  >

                    <span className="benefit-icon">
                      {item.icon}
                    </span>

                    <div>

                      <h3>
                        {item.title}
                      </h3>

                      <p>
                        {item.text}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>


            <div className="why-visual">

              <div className="visual-card large">

                <div className="visual-number">
                  24/7
                </div>

                <strong>
                  Home-care support
                </strong>

                <span>
                  Built for comfort, continuity
                  and family peace of mind.
                </span>

              </div>

              <div className="visual-orb orb-one" />

              <div className="visual-orb orb-two" />

            </div>

          </div>

        </section>


        {/* ================= STATISTICS ================= */}

        <section className="stats-section home-scroll-reveal home-scroll-delay-2" ref={statsRef}>

          <div className="home-container stats-grid">

            <div>
              <strong>
                {careServicesCount}
              </strong>

              <span>
                Care Services
              </span>
            </div>

            <div>
              <strong>
                24/7
              </strong>

              <span>
                Care Options
              </span>
            </div>

            <div>
              <strong>
                {bookingFlowCount}
              </strong>

              <span>
                Simple Booking Flow
              </span>
            </div>

            <div>
              <strong>
                100%
              </strong>

              <span>
                Home-focused
              </span>
            </div>

          </div>

        </section>


        {/* ================= ABOUT PREVIEW ================= */}

        <section className="about-section section-pad home-scroll-reveal home-scroll-delay-1">

          <div className="home-container about-grid">

            <div className="about-image-wrap">

              <img
                src={aboutCareImage}
                alt="Caregiver supporting an elderly person at home"
              />

            </div>


            <div className="about-copy">

              <span className="eyebrow">
                GET TO KNOW US
              </span>

              <h2>
                Professional care in the
                comfort of home.
              </h2>

              <p>
                We are building a straightforward way
                for families in Bahrain to request
                home-care services and follow their
                request from submission through
                completion.
              </p>

              <p>
                From patient and elder care to newborn
                and children's care, the experience is
                designed to keep the booking journey
                simple and transparent.
              </p>


              <button
                className="outline-cta"
                onClick={() => navigate("/about")}
                type="button"
              >
                Learn About Us
                <span>→</span>
              </button>

            </div>

          </div>

        </section>


        {/* ================= CTA ================= */}

        <section className="cta-section home-scroll-reveal home-scroll-delay-2">

          <div className="home-container cta-inner">

            <div>

              <span className="eyebrow">
                NEED HOME CARE?
              </span>

              <h2>
                Let's make care feel easier.
              </h2>

              <p>
                Choose a service and submit your
                care requirements in a few simple steps.
              </p>

            </div>


            <button
              className="primary-cta light"
              onClick={goToLogin}
              type="button"
            >
              Book a Care Service
              <span>→</span>
            </button>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="home-footer">

        <div className="home-container footer-grid">


          {/* BRAND */}

          <div className="footer-brand">

            <Link
              className="home-brand"
              to="/"
            >

              <span className="brand-mark">
                ✚
              </span>

              <span>

                <strong>
                  Bahrain Nursing Care
                </strong>

                <small>
                  Professional Care at Home
                </small>

              </span>

            </Link>

            <p>
              Compassionate home-care services
              for families in Bahrain.
            </p>

          </div>


          {/* QUICK LINKS */}

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

          </div>


          {/* SERVICES */}

          <div>

            <h3>
              Services
            </h3>

            {services.map((service) => (

              <button
                key={service.id}
                onClick={() =>
                  goToService(service.id)
                }
                type="button"
              >
                {service.title}
              </button>

            ))}

          </div>


          {/* CONTACT */}

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


        <div className="home-container footer-bottom">

          <span>
            © 2026 Bahrain Nursing Care.
            All rights reserved.
          </span>

          <span>
            Home Nursing • Bahrain
          </span>

        </div>

      </footer>

    </div>
  );
}

export default Home;