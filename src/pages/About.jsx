import usePageMeta from "../utils/usePageMeta";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./About.css";
import aboutCarePhoto from "../assets/about-care-photo.webp";
import { useTranslation } from "../hooks/useTranslation";

function About() {
  usePageMeta({"title":"About Us – NOOR AL AFIYA | Home Health Care in Bahrain","description":"Learn about NOOR AL AFIYA Home Health Care and our commitment to compassionate, professional home nursing care for families in Bahrain.","path":"/about"});
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <Header />


      {/* ================= PAGE HERO ================= */}

      <main>
        <section className="about-hero">
          <div className="about-container about-hero-content">
            <div className="about-hero-copy">
              <span className="about-eyebrow">{t("about.heroEyebrow")}</span>
              <h1>
                {t("about.heroHeading")}
                <span> {t("about.heroHeadingSpan")}</span>
              </h1>
              <p>{t("about.heroDesc")}</p>
              <div className="about-breadcrumb">
                <Link to="/">{t("common.home")}</Link>
                <span>/</span>
                <strong>{t("about.breadcrumb")}</strong>
              </div>
            </div>
          </div>
        </section>


        {/* ================= WHO WE ARE ================= */}

        <section className="about-intro about-section">
          <div className="about-container about-intro-grid">
            <div className="about-intro-image">
              <img
                src={aboutCarePhoto} width="1400" height="933" loading="lazy" decoding="async"
                alt="Professional nurse providing home care"
                className="about-intro-bg-img"
              />
            </div>

            <div className="about-intro-content">
              <span className="about-eyebrow">{t("about.introEyebrow")}</span>
              <h2>{t("about.introHeading")}</h2>
              <p>{t("about.introP1")}</p>
              <p>{t("about.introP2")}</p>
              <p>{t("about.introP3")}</p>

              <button
                type="button"
                className="about-primary-button"
                onClick={() => navigate("/services")}
              >
                {t("about.exploreServices")}
                <span>→</span>
              </button>
            </div>
          </div>
        </section>


        {/* ================= OUR APPROACH ================= */}

        <section className="about-mission">
          <div className="about-container about-mission-grid">
            <div className="about-mission-copy">
              <span className="about-eyebrow">{t("about.approachEyebrow")}</span>
              <h2>{t("about.approachHeading")}</h2>
              <p>{t("about.approachP1")}</p>
              <p>{t("about.approachP2")}</p>
              <p>{t("about.approachP3")}</p>
            </div>

            <div className="about-values">
              <div className="about-value-card">
                <div className="about-value-icon">♡</div>
                <div>
                  <h3>{t("about.compassionTitle")}</h3>
                  <p>{t("about.compassionDesc")}</p>
                </div>
              </div>

              <div className="about-value-card">
                <div className="about-value-icon">✓</div>
                <div>
                  <h3>{t("about.professionalismTitle")}</h3>
                  <p>{t("about.professionalismDesc")}</p>
                </div>
              </div>

              <div className="about-value-card">
                <div className="about-value-icon">◷</div>
                <div>
                  <h3>{t("about.personalisedTitle")}</h3>
                  <p>{t("about.personalisedDesc")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ================= ADVANCED CARE AT HOME ================= */}

        <section className="about-services about-section">
          <div className="about-container">
            <div className="about-section-heading">
              <span className="about-eyebrow">{t("about.advancedEyebrow")}</span>
              <h2>{t("about.advancedHeading")}</h2>
              <p>{t("about.advancedDesc")}</p>
            </div>

            <div className="about-care-grid">
              <div className="about-care-card">
                <span className="care-number">01</span>
                <div className="care-icon">⊡</div>
                <h3>{t("about.card1Title")}</h3>
                <p>{t("about.card1Desc")}</p>
              </div>

              <div className="about-care-card">
                <span className="care-number">02</span>
                <div className="care-icon">✚</div>
                <h3>{t("about.card2Title")}</h3>
                <p>{t("about.card2Desc")}</p>
              </div>

              <div className="about-care-card">
                <span className="care-number">03</span>
                <div className="care-icon">◷</div>
                <h3>{t("about.card3Title")}</h3>
                <p>{t("about.card3Desc")}</p>
              </div>

              <div className="about-care-card">
                <span className="care-number">04</span>
                <div className="care-icon">♡</div>
                <h3>{t("about.card4Title")}</h3>
                <p>{t("about.card4Desc")}</p>
              </div>
            </div>
          </div>
        </section>


        {/* ================= PATIENT MONITORING ================= */}

        <section className="about-mission about-monitoring-section">
          <div className="about-container about-mission-grid">
            <div className="about-mission-copy">
              <span className="about-eyebrow">{t("about.monitoringEyebrow")}</span>
              <h2>{t("about.monitoringHeading")}</h2>
              <p>{t("about.monitoringP1")}</p>
              <p>{t("about.monitoringP2")}</p>
              <div className="about-monitoring-actions">
                <button
                  type="button"
                  className="about-primary-button"
                  onClick={() => navigate("/services")}
                >
                  {t("about.viewServices")}
                  <span>→</span>
                </button>
                <button
                  type="button"
                  className="about-secondary-link-button"
                  onClick={() => navigate("/contact")}
                >
                  {t("nav.contact")}
                  <span>→</span>
                </button>
              </div>
            </div>

            <div className="about-values">
              <div className="about-value-card">
                <div className="about-value-icon">✓</div>
                <div>
                  <h3>{t("about.healthRecordsTitle")}</h3>
                  <p>{t("about.healthRecordsDesc")}</p>
                </div>
              </div>

              <div className="about-value-card">
                <div className="about-value-icon">✚</div>
                <div>
                  <h3>{t("about.supervisoryTitle")}</h3>
                  <p>{t("about.supervisoryDesc")}</p>
                </div>
              </div>

              <div className="about-value-card">
                <div className="about-value-icon">◉</div>
                <div>
                  <h3>{t("about.specialistTitle")}</h3>
                  <p>{t("about.specialistDesc")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ================= COMMITMENT TO FAMILIES ================= */}

        <section className="about-commitment-section about-section">
          <div className="about-container">
            <div className="about-commitment-inner">
              <div className="about-commitment-copy">
                <span className="about-eyebrow">{t("about.commitmentEyebrow")}</span>
                <h2>{t("about.commitmentHeading")}</h2>
                <p>{t("about.commitmentP1")}</p>
                <p>{t("about.commitmentP2")}</p>
                <p className="about-disclaimer">{t("about.commitmentDisclaimer")}</p>
                <p className="about-tagline">
                  <strong>{t("about.commitmentTagline")}</strong>
                </p>
                <div className="about-commitment-actions">
                  <button
                    type="button"
                    className="about-primary-button"
                    onClick={() => navigate("/care/patient")}
                  >
                    {t("common.bookCareService")}
                    <span>→</span>
                  </button>
                  <button
                    type="button"
                    className="about-secondary-link-button"
                    onClick={() => navigate("/contact")}
                  >
                    {t("common.getInTouch")}
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>


      </main>

      <Footer />
    </div>
  );
}

export default About;
