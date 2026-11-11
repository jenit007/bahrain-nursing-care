import usePageMeta from "../utils/usePageMeta";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTranslation } from "../hooks/useTranslation";
import "./Home.css";
import "./WhyUs.css";

function WhyUs() {
  usePageMeta({
    title: "Why Choose Us – NOOR AL AFIYA | Home Nursing Care",
    description: "See why families in Bahrain choose NOOR AL AFIYA for dependable, professional and caring home nursing services.",
    path: "/why-us"
  });

  const { t } = useTranslation();

  const introPoints = [
    t("whyUs.introPoints.0"),
    t("whyUs.introPoints.1"),
    t("whyUs.introPoints.2"),
    t("whyUs.introPoints.3"),
    t("whyUs.introPoints.4"),
    t("whyUs.introPoints.5"),
  ];

  const promisePoints = [
    t("whyUs.promisePoints.0"),
    t("whyUs.promisePoints.1"),
    t("whyUs.promisePoints.2"),
    t("whyUs.promisePoints.3"),
  ];

  const reasons = [
    {
      number: "01",
      title: t("whyUs.reason1Title"),
      text: t("whyUs.reason1Desc"),
    },
    {
      number: "02",
      title: t("whyUs.reason2Title"),
      text: t("whyUs.reason2Desc"),
    },
    {
      number: "03",
      title: t("whyUs.reason3Title"),
      text: t("whyUs.reason3Desc"),
    },
    {
      number: "04",
      title: t("whyUs.reason4Title"),
      text: t("whyUs.reason4Desc"),
    },
    {
      number: "05",
      title: t("whyUs.reason5Title"),
      text: t("whyUs.reason5Desc"),
    },
    {
      number: "06",
      title: t("whyUs.reason6Title"),
      text: t("whyUs.reason6Desc"),
    },
  ];

  const steps = [
    {
      number: "01",
      title: t("whyUs.step1Title"),
      text: t("whyUs.step1Desc"),
    },
    {
      number: "02",
      title: t("whyUs.step2Title"),
      text: t("whyUs.step2Desc"),
    },
    {
      number: "03",
      title: t("whyUs.step3Title"),
      text: t("whyUs.step3Desc"),
    },
    {
      number: "04",
      title: t("whyUs.step4Title"),
      text: t("whyUs.step4Desc"),
    },
  ];

  return (
    <div className="why-page">
      <Header />

      {/* ================= HERO ================= */}
      <section className="why-hero">
        <div className="why-container why-hero-content">
          <div className="why-breadcrumb">
            <Link to="/">{t("common.home")}</Link> <span>/</span> {t("whyUs.breadcrumb")}
          </div>

          <p className="why-hero-label">{t("whyUs.heroLabel")}</p>

          <h1>
            {t("whyUs.heroHeading")}
            <span> {t("whyUs.heroHeadingSpan")}</span>
          </h1>

          <p>{t("whyUs.heroDesc")}</p>

          <div className="why-hero-buttons">
            <Link to="/services" className="why-primary-btn">
              {t("common.exploreServices")}
            </Link>

            <Link to="/contact" className="why-secondary-btn">
              {t("common.contactUs")}
            </Link>
          </div>
        </div>
      </section>

      {/* ================= INTRO / WHY CHOOSE US ================= */}
      <section className="why-intro">
        <div className="why-container why-intro-grid">
          <div className="why-intro-left">
            <p className="why-section-label">{t("whyUs.introLabel")}</p>
            <h2>
              {t("whyUs.introHeading")}
              <span> {t("whyUs.introHeadingSpan")}</span>
            </h2>
            <p className="why-intro-desc">{t("whyUs.introDesc")}</p>
          </div>

          <div className="why-intro-right">
            <div className="why-points-grid">
              {introPoints.map((point) => (
                <div className="why-point-card" key={point}>
                  <span className="why-point-check" aria-hidden="true">✓</span>
                  <p>{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= APPROACH, MISSION & VISION ================= */}
      <section className="why-philosophy">
        <div className="why-container">
          <div className="why-heading center why-approach-header">
            <p className="why-section-label">{t("whyUs.approachLabel")}</p>
            <h2>
              {t("whyUs.approachHeading")}
              <span> {t("whyUs.approachHeadingSpan")}</span>
            </h2>
            <p>{t("whyUs.approachDesc")}</p>
          </div>

          <div className="why-mv-grid">
            <div className="why-mv-card">
              <div className="why-care-icon" aria-hidden="true">✚</div>
              <p className="why-section-label">{t("whyUs.missionLabel")}</p>
              <h3>{t("whyUs.missionHeading")}</h3>
              <p>{t("whyUs.missionDesc")}</p>
            </div>

            <div className="why-mv-card">
              <div className="why-care-icon" aria-hidden="true">✦</div>
              <p className="why-section-label">{t("whyUs.visionLabel")}</p>
              <h3>{t("whyUs.visionHeading")}</h3>
              <p>{t("whyUs.visionDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= REASONS ================= */}
      <section className="why-reasons">
        <div className="why-container">
          <div className="why-heading">
            <p className="why-section-label">{t("whyUs.reasonsLabel")}</p>
            <h2>
              {t("whyUs.reasonsHeading")}
              <span> {t("whyUs.reasonsHeadingSpan")}</span>
            </h2>
            <p>{t("whyUs.reasonsDesc")}</p>
          </div>

          <div className="why-reasons-grid">
            {reasons.map((reason) => (
              <div className="why-reason-card" key={reason.number}>
                <div className="why-reason-number">{reason.number}</div>
                <div>
                  <h3>{reason.title}</h3>
                  <p>{reason.text}</p>
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
            <p className="why-section-label">{t("whyUs.careLabel")}</p>
            <h2>
              {t("whyUs.careHeading")}
              <span> {t("whyUs.careHeadingSpan")}</span>
            </h2>
          </div>

          <div className="why-care-grid">
            <div className="why-care-card">
              <div className="why-care-icon">+</div>
              <h3>{t("services.patient.title")}</h3>
              <p>{t("services.patient.text")}</p>
              <Link to="/care/patient">{t("common.bookAppointment")} →</Link>
            </div>

            <div className="why-care-card">
              <div className="why-care-icon">♥</div>
              <h3>{t("services.elder.title")}</h3>
              <p>{t("services.elder.text")}</p>
              <Link to="/care/elder">{t("common.bookAppointment")} →</Link>
            </div>

            <div className="why-care-card">
              <div className="why-care-icon">✦</div>
              <h3>{t("services.newborn.title")}</h3>
              <p>{t("services.newborn.text")}</p>
              <Link to="/care/newborn">{t("common.bookAppointment")} →</Link>
            </div>

            <div className="why-care-card">
              <div className="why-care-icon">●</div>
              <h3>{t("services.children.title")}</h3>
              <p>{t("services.children.text")}</p>
              <Link to="/care/children">{t("common.bookAppointment")} →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="why-process">
        <div className="why-container">
          <div className="why-process-header">
            <div>
              <p className="why-section-label">{t("whyUs.processLabel")}</p>
              <h2>
                {t("whyUs.processHeading")}
                <span> {t("whyUs.processHeadingSpan")}</span>
              </h2>
            </div>
            <p>{t("whyUs.processDesc")}</p>
          </div>

          <div className="why-process-grid">
            {steps.map((step) => (
              <div className="why-process-card" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CARE YOU CAN TRUST & OUR PROMISE ================= */}
      <section className="why-trust-promise">
        <div className="why-container why-trust-grid">
          <div className="why-trust-card">
            <p className="why-section-label">{t("whyUs.trustLabel")}</p>
            <h2>{t("whyUs.trustHeading")}</h2>
            <p className="why-trust-desc">{t("whyUs.trustDesc")}</p>
          </div>

          <div className="why-promise-card">
            <p className="why-section-label">{t("whyUs.promiseLabel")}</p>
            <h2>
              {t("whyUs.promiseHeading")}
              <span> {t("whyUs.promiseHeadingSpan")}</span>
            </h2>

            <div className="why-promise-list">
              {promisePoints.map((point) => (
                <div className="why-promise-item" key={point}>
                  <span className="why-promise-check" aria-hidden="true">✓</span>
                  <p>{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default WhyUs;
