import { useEffect, useState, useCallback } from "react";
import usePageMeta from "../../utils/usePageMeta";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  getSavedBookingReference,
  trackCareBooking,
} from "../../utils/api";
import { useTranslation } from "../../hooks/useTranslation";
import "./RequestStatus.css";

function getStatusIndex(status) {
  switch (status) {
    case "Pending Verification": return 2;
    case "Verified": return 3;
    case "Completed": return 4;
    default: return 1;
  }
}

function RequestStatus() {
  usePageMeta({
    title: "Track Your Care Request | NOOR AL AFIYA",
    description: "Check the status of your NOOR AL AFIYA home nursing care request using your reference code.",
    path: "/request-status"
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryRef = searchParams.get("ref") || "";

  const [referenceInput, setReferenceInput] = useState(
    () => queryRef || getSavedBookingReference()
  );
  const [activeReference, setActiveReference] = useState(
    () => queryRef || getSavedBookingReference()
  );
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(Boolean(queryRef || getSavedBookingReference()));
  const [error, setError] = useState("");

  const trackingSteps = [
    { number: 1, title: t("requestStatus.step1Title"), description: t("requestStatus.step1Desc") },
    { number: 2, title: t("requestStatus.step2Title"), description: t("requestStatus.step2Desc") },
    { number: 3, title: t("requestStatus.step3Title"), description: t("requestStatus.step3Desc") },
    { number: 4, title: t("requestStatus.step4Title"), description: t("requestStatus.step4Desc") },
  ];

  const fetchBookingStatus = useCallback(async (refToFetch, showSpinner = false) => {
    const cleanRef = String(refToFetch || "").trim().toUpperCase();
    if (!cleanRef) {
      setRequest(null);
      setLoading(false);
      return;
    }

    if (showSpinner) {
      setLoading(true);
      setError("");
    }

    try {
      const booking = await trackCareBooking(cleanRef);
      setRequest(booking);
      setError("");
    } catch (err) {
      if (showSpinner) {
        setRequest(null);
        setError(err.message || t("requestStatus.bookingNotFound"));
      }
    } finally {
      if (showSpinner) {
        setLoading(false);
      }
    }
  }, [t]);

  useEffect(() => {
    const targetRef = queryRef || getSavedBookingReference();
    if (targetRef) {
      setReferenceInput(targetRef);
      setActiveReference(targetRef);
      fetchBookingStatus(targetRef, true);
    } else {
      setLoading(false);
    }
  }, [queryRef, fetchBookingStatus]);

  useEffect(() => {
    if (!activeReference) return undefined;
    const interval = setInterval(() => {
      fetchBookingStatus(activeReference, false);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeReference, fetchBookingStatus]);

  const handleLookupSubmit = (event) => {
    event.preventDefault();
    const clean = referenceInput.trim().toUpperCase();
    if (!clean) {
      setError(t("requestStatus.referenceError"));
      return;
    }
    setActiveReference(clean);
    setSearchParams({ ref: clean });
    fetchBookingStatus(clean, true);
  };

  if (loading) {
    return (
      <div className="request-status-page">
        <Header />
        <main className="status-main">
          <div className="status-empty-card">
            <p className="status-eyebrow">{t("requestStatus.eyebrow")}</p>
            <h1>{t("requestStatus.loadingTitle")}</h1>
            <p>{t("requestStatus.loadingDesc")}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="request-status-page">
        <Header />
        <main className="status-main">
          <div className="status-empty-card">
            <span className="status-empty-icon">⌁</span>
            <p className="status-eyebrow">{t("requestStatus.eyebrow")}</p>
            <h1>{error ? t("requestStatus.bookingNotFound") : t("requestStatus.notFoundTitle")}</h1>
            <p>
              {error || t("requestStatus.enterRefDesc")}
            </p>
            <form
              onSubmit={handleLookupSubmit}
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                flexWrap: "wrap",
                margin: "20px auto",
                maxWidth: "460px",
              }}
            >
              <input
                type="text"
                value={referenceInput}
                onChange={(e) => setReferenceInput(e.target.value)}
                placeholder={t("requestStatus.notFoundPlaceholder")}
                aria-label="Booking Reference"
                style={{
                  flex: "1 1 240px",
                  height: "44px",
                  padding: "0 14px",
                  borderRadius: "10px",
                  border: "1px solid #E1E8E3",
                  fontSize: "14px",
                }}
              />
              <button type="submit" className="status-primary-btn">
                {t("requestStatus.trackRequest")}
              </button>
            </form>
            <button
              className="status-secondary-btn"
              onClick={() => navigate("/services")}
            >
              {t("common.exploreServices")} <span>→</span>
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentIndex = getStatusIndex(request.status);
  const address = request.address || {};

  return (
    <div className="request-status-page">
      <Header />

      <section className="status-hero">
        <div className="status-container status-hero-inner">
          <p className="status-eyebrow">{t("requestStatus.eyebrow")}</p>
          <h1>{t("requestStatus.trackingTitle")}</h1>
          <p>{t("requestStatus.trackingDesc")}</p>
          <form
            onSubmit={handleLookupSubmit}
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "18px",
              maxWidth: "480px",
            }}
          >
            <input
              type="text"
              value={referenceInput}
              onChange={(e) => setReferenceInput(e.target.value)}
              placeholder={t("requestStatus.trackAnother")}
              aria-label="Track booking reference"
              style={{
                flex: "1 1 240px",
                height: "42px",
                padding: "0 14px",
                borderRadius: "10px",
                border: "1px solid #E1E8E3",
                background: "#FFFFFF",
                fontSize: "14px",
              }}
            />
            <button type="submit" className="status-secondary-btn" style={{ height: "42px" }}>
              {t("requestStatus.lookup")}
            </button>
          </form>
        </div>
      </section>

      <main className="status-main">
        <div className="status-container">
          <div className="status-request-card">
            <div className="status-request-head">
              <div>
                <span className="status-small-label">{t("requestStatus.requestId")}</span>
                <h2>{request.bookingReference || request.id}</h2>
              </div>
              <span className="status-badge">{request.status}</span>
            </div>
            <div className="status-request-grid">
              <InfoItem label={t("requestStatus.labelService")} value={request.service || request.careType} />
              <InfoItem label={t("requestStatus.labelFullName")} value={request.name || request.fullName} />
              {request.service === "Blood Collection Service" ? (
                <InfoItem label={t("requestStatus.labelCprNumber")} value={request.cprNumber} />
              ) : (
                <InfoItem label={t("requestStatus.labelEmail")} value={request.email || t("requestStatus.notProvided")} />
              )}
              <InfoItem label={t("requestStatus.labelPhone")} value={request.phone} />
              <InfoItem label={t("requestStatus.labelPreferredDate")} value={request.preferredDate ? new Date(`${request.preferredDate}T00:00:00`).toLocaleDateString() : t("requestStatus.na")} />
              {request.service !== "Ventilator Patient Care" && request.service !== "Blood Collection Service" && (
                <InfoItem label={t("requestStatus.labelCondition")} value={request.condition || t("requestStatus.notSpecified")} />
              )}
              {request.service !== "Blood Collection Service" && (
                <InfoItem label={t("requestStatus.labelShift")} value={request.shift === "Other" && request.shiftOther ? request.shiftOther : request.shift || t("requestStatus.notSpecified")} />
              )}
              {request.service === "Blood Collection Service" && (
                <InfoItem label={t("requestStatus.labelPreferredTests")} value={request.preferredTests} />
              )}
              <InfoItem label={t("requestStatus.labelSubmitted")} value={request.createdAt ? new Date(request.createdAt).toLocaleString() : t("requestStatus.na")} />
            </div>
          </div>

          <section className="status-tracking-card">
            <div className="status-section-heading">
              <div>
                <p className="status-section-label">{t("requestStatus.liveJourney")}</p>
                <h2>{t("requestStatus.requestProgress")}</h2>
              </div>
              <span>{Math.min(currentIndex, 4)} / 4 {t("requestStatus.stages")}</span>
            </div>

            <div className="status-progress-bar"><span style={{ width: `${(currentIndex / 4) * 100}%` }} /></div>

            <div className="status-timeline">
              {trackingSteps.map((step) => {
                const completed = currentIndex >= step.number;
                const current = currentIndex === step.number;
                return (
                  <div className={`status-step ${completed ? "completed" : ""} ${current ? "current" : ""}`} key={step.number}>
                    <div className="status-step-marker">{completed ? "✓" : step.number}</div>
                    <div className="status-step-content">
                      <div className="status-step-title-row">
                        <h3>{step.title}</h3>
                        {current && <span>{t("common.current")}</span>}
                      </div>
                      <p>{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="status-details-grid">
            <div className="status-detail-card">
              <p className="status-section-label">{t("requestStatus.serviceAddress")}</p>
              <h3>{t("requestStatus.bahrainAddress")}</h3>
              <div className="status-address">
                <span>{t("requestStatus.blockNo")} {address.blockNo || address.flatNo || address.flatVilla || "—"}</span>
                <span>{t("requestStatus.buildingNo")} {address.buildingNo || address.buildingNumber || "—"}</span>
                <span>{t("requestStatus.area")} {address.area || "—"}</span>
                <span>{t("requestStatus.governorate")} {address.governorate || "—"}</span>
                <span>{t("requestStatus.country")}</span>
              </div>
            </div>

            <div className="status-detail-card">
              <p className="status-section-label">{t("requestStatus.additionalNotes")}</p>
              <h3>{t("requestStatus.infoShared")}</h3>
              <p className="status-next-text">{request.notes || t("requestStatus.noNotes")}</p>
            </div>

            <div className="status-detail-card">
              <p className="status-section-label">{t("requestStatus.nextStep")}</p>
              <h3>{request.status === "Completed" ? t("requestStatus.requestComplete") : t("requestStatus.keepReference")}</h3>
              <p className="status-next-text">
                {request.status === "Completed"
                  ? t("requestStatus.thankYouComplete")
                  : `${t("requestStatus.bookingRefNote")} ${request.bookingReference || request.id}. ${t("requestStatus.referenceNote")}`}
              </p>
            </div>
          </section>

          {request.status === "Completed" && (
            <div className="status-complete-note"><span>✓</span><div><strong>{t("requestStatus.serviceCompleted")}</strong><p>{t("requestStatus.serviceCompletedDesc")}</p></div></div>
          )}

          <div className="status-actions">
            <button className="status-secondary-btn" onClick={() => navigate("/services")}>{t("requestStatus.backToServices")}</button>
            <button className="status-secondary-btn" onClick={() => navigate("/contact")}>{t("common.contactUs")}</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function InfoItem({ label, value }) {
  return <div><span>{label}</span><strong>{value || "—"}</strong></div>;
}

export default RequestStatus;
