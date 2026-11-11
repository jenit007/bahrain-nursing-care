import { useEffect, useRef, useState } from "react";
import usePageMeta from "../utils/usePageMeta";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Home.css";
import aboutCareImage from "../assets/about-care.webp";
import patientCareImage from "../assets/services/patient-care.webp";
import elderCareImage from "../assets/services/elder-care.webp";
import newbornCareImage from "../assets/services/newborn-care.webp";
import childrenCareImage from "../assets/services/children-care.webp";
import icuCareImage from "../assets/services/icu-patient-care.jpg";
import cancerCareImage from "../assets/services/cancer-patient-care.jpg";
import ventilatorCareImage from "../assets/services/ventilator-patient-care.jpg";
import bloodCollectionImage from "../assets/services/blood-collection-service.jpg";
import nhraApprovedImage from "../assets/nhra-approved.webp";
import homeCareSupportPhoto from "../assets/home-care-support-photo.webp";
import HeroSlideshow from "../components/HeroSlideshow";
import { useTranslation } from "../hooks/useTranslation";

function Home() {
  usePageMeta({
    title: "Home – NOOR AL AFIYA | Home Nursing Care in Bahrain",
    description: "NOOR AL AFIYA Home Health Care provides professional home nursing care in Bahrain: patient care, elder care, newborn care and children's care delivered at home.",
    path: "/"
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  // Illustrative placeholder demo statistics (pending company verification & approval)
  const [yearsExpCount, setYearsExpCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
  const [caregiversCount, setCaregiversCount] = useState(0);
  const [satisfactionCount, setSatisfactionCount] = useState(0);
  const statsRef = useRef(null);

  const services = [
    {
      id: "icu",
      title: t("services.icu.title"),
      text: t("services.icu.text"),
      icon: "✚",
      image: icuCareImage,
    },
    {
      id: "ventilator",
      title: t("services.ventilator.title"),
      text: t("services.ventilator.text"),
      icon: "◈",
      image: ventilatorCareImage,
    },
    {
      id: "cancer",
      title: t("services.cancer.title"),
      text: t("services.cancer.text"),
      icon: "♡",
      image: cancerCareImage,
    },
    {
      id: "patient",
      title: t("services.patient.title"),
      text: t("services.patient.text"),
      icon: "✚",
      image: patientCareImage,
    },
    {
      id: "elder",
      title: t("services.elder.title"),
      text: t("services.elder.text"),
      icon: "♡",
      image: elderCareImage,
    },
    {
      id: "newborn",
      title: t("services.newborn.title"),
      text: t("services.newborn.text"),
      icon: "✦",
      image: newbornCareImage,
    },
    {
      id: "children",
      title: t("services.children.title"),
      text: t("services.children.text"),
      icon: "◉",
      image: childrenCareImage,
    },
    {
      id: "blood-collection",
      title: t("services.bloodCollection.title"),
      text: t("services.bloodCollection.text"),
      icon: "✦",
      image: bloodCollectionImage,
    },
  ];

  const benefits = [
    {
      icon: "✓",
      title: t("benefits.personalizedCare"),
      text: t("benefits.personalizedCareDesc"),
    },
    {
      icon: "◷",
      title: t("benefits.flexibleSupport"),
      text: t("benefits.flexibleSupportDesc"),
    },
    {
      icon: "⌂",
      title: t("benefits.careAtHome"),
      text: t("benefits.careAtHomeDesc"),
    },
    {
      icon: "♡",
      title: t("benefits.familyFocused"),
      text: t("benefits.familyFocusedDesc"),
    },
  ];

  useEffect(() => {
    const statsElement = statsRef.current;
    if (!statsElement) return;

    let animationFrame;

    const animateAll = (duration = 3000) => {
      cancelAnimationFrame(animationFrame);
      const startTime = performance.now();

      const update = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        setYearsExpCount(Math.floor(10 * easedProgress));
        setPatientsCount(Math.floor(5000 * easedProgress));
        setCaregiversCount(Math.floor(50 * easedProgress));
        setSatisfactionCount(Math.floor(978 * easedProgress) / 10);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(update);
        } else {
          setYearsExpCount(10);
          setPatientsCount(5000);
          setCaregiversCount(50);
          setSatisfactionCount(97.8);
        }
      };

      animationFrame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animateAll(3000);
        } else {
          cancelAnimationFrame(animationFrame);
          setYearsExpCount(0);
          setPatientsCount(0);
          setCaregiversCount(0);
          setSatisfactionCount(0);
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -60px 0px",
      }
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

  const goToService = (serviceId) => {
    navigate(`/care/${serviceId}`);
  };

  return (
    <div className="home-page">
      <Header />

      {/* ================= HERO ================= */}
      <main>
        <section className="home-hero">
          {/* ── FULL-BLEED BACKGROUND SLIDESHOW ── */}
          <div className="hero-slideshow-bg" aria-hidden="true">
            <HeroSlideshow />
          </div>

          <div className="home-container hero-content">
            <div className="hero-copy">
              <span className="eyebrow">{t("home.heroEyebrow")}</span>

              <h1>
                {t("home.heroHeading")}
                <span> {t("home.heroHeadingSpan")}</span>
              </h1>

              <p>{t("home.heroDesc")}</p>

              <div className="hero-actions">
                <button
                  className="primary-cta"
                  onClick={() => navigate("/services")}
                  type="button"
                >
                  {t("home.chooseService")}
                  <span>→</span>
                </button>

                <Link className="secondary-cta" to="/services">
                  {t("common.exploreServices")}
                </Link>
              </div>

              <div className="hero-approval">
                <div className="hero-approval-badge">
                  <span className="hero-approval-dot" aria-hidden="true" />
                  <div className="hero-approval-copy">
                    <strong>{t("common.nhraApproved")}</strong>
                    <span>{t("common.nhraApprovalMark")}</span>
                  </div>
                  <img
                    src={nhraApprovedImage}
                    width="400"
                    height="83"
                    decoding="async"
                    alt="NHRA Bahrain approved"
                  />
                </div>
              </div>

              <div className="hero-trust">
                <span className="trust-icon">✓</span>
                <span>
                  {t("common.simpleBooking")}
                  &nbsp;•&nbsp;
                  {t("common.bahrainFocused")}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SERVICES ================= */}
        <section className="service-section section-pad home-scroll-reveal">
          <div className="home-container">
            <div className="section-heading center">
              <span className="eyebrow">{t("home.servicesEyebrow")}</span>
              <h2>{t("home.servicesHeading")}</h2>
              <p>{t("home.servicesDesc")}</p>
            </div>

            <div className="service-grid">
              {services.map((service) => (
                <article className="service-card" key={service.id}>
                  <div
                    className="service-card-image-background"
                    style={{ backgroundImage: `url(${service.image})` }}
                    aria-hidden="true"
                  />
                  <div className="service-card-content">
                    <div className="service-card-icon">{service.icon}</div>
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                    <button
                      className="service-card-button"
                      onClick={() => goToService(service.id)}
                      type="button"
                    >
                      {t("common.bookAppointment")}
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
              <span className="eyebrow">{t("home.whyEyebrow")}</span>
              <h2>{t("home.whyHeading")}</h2>
              <p>{t("home.whyDesc")}</p>

              <div className="benefit-grid">
                {benefits.map((item) => (
                  <div className="benefit" key={item.title}>
                    <span className="benefit-icon">{item.icon}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="why-visual">
              <img
                src={homeCareSupportPhoto}
                width="1400"
                height="1400"
                loading="lazy"
                decoding="async"
                alt="24/7 Home-care support"
                className="why-visual-bg-img"
              />
            </div>
          </div>
        </section>

        {/* ================= STATISTICS (DEMO PLACEHOLDER VALUES - PENDING COMPANY APPROVAL) ================= */}
        <section
          className="stats-section home-scroll-reveal home-scroll-delay-2"
          ref={statsRef}
          data-stats-status="demo-placeholder"
          aria-label="Key Statistics (Illustrative Demo Figures)"
        >
          <div className="home-container stats-grid">
            <div className="stats-item" data-demo="true">
              <strong>{yearsExpCount}+</strong>
              <span>{t("home.statsYearsExp")}</span>
            </div>
            <div className="stats-item" data-demo="true">
              <strong>{patientsCount.toLocaleString()}+</strong>
              <span>{t("home.statsPatientsServed")}</span>
            </div>
            <div className="stats-item" data-demo="true">
              <strong>{caregiversCount}+</strong>
              <span>{t("home.statsNursesCaregivers")}</span>
            </div>
            <div className="stats-item" data-demo="true">
              <strong>{satisfactionCount === 0 ? "0" : satisfactionCount.toFixed(1)}%</strong>
              <span>{t("home.statsSatisfactionRate")}</span>
            </div>
          </div>
        </section>

        {/* ================= ABOUT PREVIEW ================= */}
        <section className="about-section section-pad home-scroll-reveal home-scroll-delay-1">
          <div className="home-container about-grid">
            <div className="about-image-wrap">
              <img
                src={aboutCareImage}
                width="1400"
                height="933"
                loading="lazy"
                decoding="async"
                alt="Caregiver supporting an elderly person at home"
              />
            </div>

            <div className="about-copy">
              <span className="eyebrow">{t("home.aboutEyebrow")}</span>
              <h2>{t("home.aboutHeading")}</h2>
              <p>{t("home.aboutP1")}</p>
              <p>{t("home.aboutP2")}</p>
              <p>{t("home.aboutP3")}</p>
              <p className="about-copy-commitment">
                {t("home.aboutCommitment")}
              </p>

              <button
                className="outline-cta"
                onClick={() => navigate("/about")}
                type="button"
              >
                {t("common.learnMore")}
                <span>→</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
