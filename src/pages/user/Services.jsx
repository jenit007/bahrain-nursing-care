import usePageMeta from "../../utils/usePageMeta";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import patientCareImage from "../../assets/services/patient-care.webp";
import elderCareImage from "../../assets/services/elder-care.webp";
import newbornCareImage from "../../assets/services/newborn-care.webp";
import childrenCareImage from "../../assets/services/children-care.webp";
import icuCareImage from "../../assets/services/icu-patient-care.jpg";
import cancerCareImage from "../../assets/services/cancer-patient-care.jpg";
import ventilatorCareImage from "../../assets/services/ventilator-patient-care.jpg";
import bloodCollectionImage from "../../assets/services/blood-collection-service.jpg";

import { useTranslation } from "../../hooks/useTranslation";
import "./Services.css";

function Services() {
  usePageMeta({
    title: "Services – Home Nursing Services in Bahrain | NOOR AL AFIYA",
    description: "Home nursing services in Bahrain from NOOR AL AFIYA: patient care, elder care, newborn baby care and children's care. Request care online.",
    path: "/services"
  });

  const { t } = useTranslation();
  const navigate = useNavigate();

  const services = [
    {
      id: "patient",
      number: "01",
      icon: "✚",
      title: t("services.patient.title"),
      image: patientCareImage,
      shortDescription: t("services.patient.shortDescription"),
      description: t("services.patient.description"),
      features: [
        t("services.patient.features.0"),
        t("services.patient.features.1"),
        t("services.patient.features.2"),
        t("services.patient.features.3"),
      ],
    },
    {
      id: "elder",
      number: "02",
      icon: "♡",
      title: t("services.elder.title"),
      image: elderCareImage,
      shortDescription: t("services.elder.shortDescription"),
      description: t("services.elder.description"),
      features: [
        t("services.elder.features.0"),
        t("services.elder.features.1"),
        t("services.elder.features.2"),
        t("services.elder.features.3"),
      ],
    },
    {
      id: "newborn",
      number: "03",
      icon: "✦",
      title: t("services.newborn.title"),
      image: newbornCareImage,
      shortDescription: t("services.newborn.shortDescription"),
      description: t("services.newborn.description"),
      features: [
        t("services.newborn.features.0"),
        t("services.newborn.features.1"),
        t("services.newborn.features.2"),
        t("services.newborn.features.3"),
      ],
    },
    {
      id: "children",
      number: "04",
      icon: "◉",
      title: t("services.children.title"),
      image: childrenCareImage,
      shortDescription: t("services.children.shortDescription"),
      description: t("services.children.description"),
      features: [
        t("services.children.features.0"),
        t("services.children.features.1"),
        t("services.children.features.2"),
        t("services.children.features.3"),
      ],
    },
    {
      id: "icu",
      number: "05",
      icon: "✚",
      title: t("services.icu.title"),
      image: icuCareImage,
      shortDescription: t("services.icu.shortDescription"),
      description: t("services.icu.description"),
      features: [
        t("services.icu.features.0"),
        t("services.icu.features.1"),
        t("services.icu.features.2"),
        t("services.icu.features.3"),
      ],
    },
    {
      id: "cancer",
      number: "06",
      icon: "♡",
      title: t("services.cancer.title"),
      image: cancerCareImage,
      shortDescription: t("services.cancer.shortDescription"),
      description: t("services.cancer.description"),
      features: [
        t("services.cancer.features.0"),
        t("services.cancer.features.1"),
        t("services.cancer.features.2"),
        t("services.cancer.features.3"),
      ],
    },
    {
      id: "ventilator",
      number: "07",
      icon: "◈",
      title: t("services.ventilator.title"),
      image: ventilatorCareImage,
      shortDescription: t("services.ventilator.shortDescription"),
      description: t("services.ventilator.description"),
      features: [
        t("services.ventilator.features.0"),
        t("services.ventilator.features.1"),
        t("services.ventilator.features.2"),
        t("services.ventilator.features.3"),
      ],
    },
    {
      id: "blood-collection",
      number: "08",
      icon: "✦",
      title: t("services.bloodCollection.title"),
      image: bloodCollectionImage,
      shortDescription: t("services.bloodCollection.shortDescription"),
      description: t("services.bloodCollection.description"),
      features: [
        t("services.bloodCollection.features.0"),
        t("services.bloodCollection.features.1"),
        t("services.bloodCollection.features.2"),
        t("services.bloodCollection.features.3"),
      ],
    },
  ];

  const selectService = (serviceId) => {
    navigate(`/care/${serviceId}`);
  };

  return (
    <div className="services-page-new">
      <Header />

      {/* ================= HERO ================= */}
      <main>
        <section className="services-hero">
          <div className="services-container services-hero-content">
            <div className="services-hero-copy">
              <span className="services-eyebrow">
                {t("services.heroEyebrow")}
              </span>
              <h1>
                {t("services.heroHeading")}
                <span> {t("services.heroHeadingSpan")}</span>
              </h1>
              <p>{t("services.heroDesc")}</p>
              <div className="services-breadcrumb">
                <Link to="/">{t("common.home")}</Link>
                <span>/</span>
                <strong>{t("services.breadcrumb")}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SERVICE INTRO ================= */}
        <section className="services-intro">
          <div className="services-container">
            <div className="services-section-heading">
              <span className="services-eyebrow">
                {t("services.introEyebrow")}
              </span>
              <h2>{t("services.introHeading")}</h2>
              <p>{t("services.introDesc")}</p>
            </div>

            {/* SERVICE CARDS */}
            <div className="services-card-grid">
              {services.map((service) => (
                <article className="new-service-card" key={service.id}>
                  <div className="service-card-image-wrap">
                    <img
                      src={service.image}
                      width="763"
                      height="507"
                      loading="lazy"
                      decoding="async"
                      alt={`${service.title} home nursing care`}
                      className="service-card-image"
                    />
                  </div>

                  <div className="service-card-top">
                    <span className="service-number">{service.number}</span>
                    <div className="new-service-icon">{service.icon}</div>
                  </div>

                  <h3>{service.title}</h3>
                  <p className="service-short-text">{service.shortDescription}</p>

                  <div className="service-feature-list">
                    {service.features.map((feature) => (
                      <div className="service-feature" key={feature}>
                        <span>✓</span>
                        <p>{feature}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="service-select-button"
                    onClick={() => selectService(service.id)}
                  >
                    {t("common.bookAppointment")}
                    <span>→</span>
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="services-process">
          <div className="services-container">
            <div className="services-section-heading">
              <span className="services-eyebrow">
                {t("services.processEyebrow")}
              </span>
              <h2>{t("services.processHeading")}</h2>
              <p>{t("services.processDesc")}</p>
            </div>

            <div className="process-grid">
              <div className="process-step">
                <div className="process-number">01</div>
                <div className="process-icon">◉</div>
                <h3>{t("services.processStep1Title")}</h3>
                <p>{t("services.processStep1Desc")}</p>
              </div>

              <div className="process-connector" />

              <div className="process-step">
                <div className="process-number">02</div>
                <div className="process-icon">✎</div>
                <h3>{t("services.processStep2Title")}</h3>
                <p>{t("services.processStep2Desc")}</p>
              </div>

              <div className="process-connector" />

              <div className="process-step">
                <div className="process-number">03</div>
                <div className="process-icon">✓</div>
                <h3>{t("services.processStep3Title")}</h3>
                <p>{t("services.processStep3Desc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SERVICE DETAIL STRIP ================= */}
        <section className="services-detail">
          <div className="services-container services-detail-grid">
            <div>
              <span className="services-eyebrow">
                {t("services.detailEyebrow")}
              </span>
              <h2>{t("services.detailHeading")}</h2>
              <p>{t("services.detailDesc")}</p>
            </div>

            <div className="services-detail-points">
              <div>
                <span>01</span>
                <strong>{t("services.detailPoint1Title")}</strong>
                <p>{t("services.detailPoint1Desc")}</p>
              </div>

              <div>
                <span>02</span>
                <strong>{t("services.detailPoint2Title")}</strong>
                <p>{t("services.detailPoint2Desc")}</p>
              </div>

              <div>
                <span>03</span>
                <strong>{t("services.detailPoint3Title")}</strong>
                <p>{t("services.detailPoint3Desc")}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Services;
