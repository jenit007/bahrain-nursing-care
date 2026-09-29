import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLatestRequest, getRequests } from "../../utils/requestStorage";
import "./RequestStatus.css";

const trackingSteps = [
  { number: 1, title: "Request Submitted", description: "Your care request has been submitted successfully." },
  { number: 2, title: "Under Verification", description: "Our admin team is reviewing your request." },
  { number: 3, title: "Verified", description: "Your request has been verified and is ready for appointment." },
  { number: 4, title: "Staff Appointed", description: "A care staff member has been appointed for your request." },
  { number: 5, title: "Completed", description: "Your care request has been completed." },
];

function getStatusIndex(status) {
  switch (status) {
    case "Pending Verification": return 2;
    case "Verified": return 3;
    case "Staff Appointed": return 4;
    case "Completed": return 5;
    default: return 1;
  }
}

function RequestStatus() {
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const loadRequest = () => setRequest(getLatestRequest());
    loadRequest();

    const handleStorageChange = () => loadRequest();
    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(loadRequest, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (!request) {
    return (
      <div className="request-status-page">
        <StatusHeader />
        <main className="status-main">
          <div className="status-empty-card">
            <span className="status-empty-icon">⌁</span>
            <p className="status-eyebrow">REQUEST TRACKING</p>
            <h1>No request found</h1>
            <p>You have not submitted a care request yet. Choose a service to get started.</p>
            <button className="status-primary-btn" onClick={() => navigate("/services")}>Explore Services <span>→</span></button>
          </div>
        </main>
      </div>
    );
  }

  const currentIndex = getStatusIndex(request.status);
  const handleFeedback = () => navigate("/feedback", { state: { request } });
  const address = request.address || {};

  return (
    <div className="request-status-page">
      <StatusHeader />

      <section className="status-hero">
        <div className="status-container status-hero-inner">
          <p className="status-eyebrow">REQUEST TRACKING</p>
          <h1>Track your care request</h1>
          <p>Follow every stage of your request from submission through completion.</p>
        </div>
      </section>

      <main className="status-main">
        <div className="status-container">
          <div className="status-request-card">
            <div className="status-request-head">
              <div>
                <span className="status-small-label">REQUEST ID</span>
                <h2>{request.id}</h2>
              </div>
              <span className="status-badge">{request.status}</span>
            </div>
            <div className="status-request-grid">
              <InfoItem label="Service" value={request.service} />
              <InfoItem label="Name" value={request.name} />
              <InfoItem label="Condition" value={request.condition} />
              <InfoItem label="Shift" value={request.shift} />
              <InfoItem label="Phone" value={request.phone} />
              <InfoItem label="Submitted" value={request.createdAt ? new Date(request.createdAt).toLocaleString() : "N/A"} />
            </div>
          </div>

          <section className="status-tracking-card">
            <div className="status-section-heading">
              <div>
                <p className="status-section-label">LIVE REQUEST JOURNEY</p>
                <h2>Request progress</h2>
              </div>
              <span>{Math.min(currentIndex, 5)} / 5 stages</span>
            </div>

            <div className="status-progress-bar"><span style={{ width: `${(currentIndex / 5) * 100}%` }} /></div>

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
                        {current && <span>Current</span>}
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
              <p className="status-section-label">CARE LOCATION</p>
              <h3>Bahrain service address</h3>
              <div className="status-address">
                {address.flatVilla && <span>Unit: {address.flatVilla}</span>}
                <span>Building: {address.buildingNumber || "—"}</span>
                <span>Road: {address.roadNumber || "—"}</span>
                <span>Block: {address.blockNumber || "—"}</span>
                <span>Area: {address.area || "—"}</span>
                <span>Governorate: {address.governorate || "—"}</span>
                {address.poBox && <span>P.O. Box: {address.poBox}</span>}
                <span>Country: Bahrain</span>
              </div>
              {request.latitude && request.longitude && (
                <a className="status-map-link" href={`https://www.google.com/maps?q=${request.latitude},${request.longitude}`} target="_blank" rel="noreferrer">Open GPS Location ↗</a>
              )}
            </div>

            <div className="status-detail-card">
              <p className="status-section-label">NEXT STEP</p>
              <h3>{request.status === "Completed" ? "Your request is complete" : "Keep your request details available"}</h3>
              <p className="status-next-text">
                {request.status === "Completed" ? "Thank you for choosing Bahrain Home Nursing Care. You can share feedback about your service." : "Your request status can be updated by the admin dashboard. This page checks for updates automatically."}
              </p>
              {request.feedbackRequested && !request.feedbackSubmitted && (
                <button className="status-primary-btn" onClick={handleFeedback}>Give Feedback <span>→</span></button>
              )}
              {request.feedbackSubmitted && <div className="status-success-note">✓ Feedback submitted successfully</div>}
            </div>
          </section>

          {!request.feedbackRequested && request.status === "Completed" && (
            <div className="status-complete-note"><span>✓</span><div><strong>Service completed</strong><p>Thank you for choosing Bahrain Home Nursing Care. You may receive a feedback request from our admin.</p></div></div>
          )}

          <div className="status-actions">
            <button className="status-secondary-btn" onClick={() => navigate("/services")}>Back to Services</button>
            <button className="status-secondary-btn" onClick={() => navigate("/contact")}>Contact Us</button>
          </div>
        </div>
      </main>

      <footer className="status-footer">
        <div className="status-container status-footer-inner">
          <Link to="/" className="status-footer-logo">Bahrain <span>HOME NURSING CARE</span></Link>
          <div><Link to="/about">About Us</Link><Link to="/services">Our Services</Link><Link to="/contact">Contact Us</Link></div>
        </div>
        <div className="status-footer-bottom">© 2026 Bahrain Home Nursing Care. All rights reserved.</div>
      </footer>
    </div>
  );
}

function StatusHeader() {
  return (
    <>
      <div className="status-topbar"><div className="status-container"><span>Bahrain Home Nursing Care</span><span>24/7 Home Care Support • Bahrain</span></div></div>
      <header className="status-navbar">
        <div className="status-container status-nav-inner">
          <Link to="/" className="status-logo"><span>Bahrain</span><small>HOME NURSING CARE</small></Link>
          <nav><Link to="/">Home</Link><Link to="/about">About Us</Link><Link to="/services">Our Services</Link><Link to="/why-us">Why Choose Us</Link><Link to="/contact">Contact Us</Link></nav>
          <Link to="/login" className="status-login-btn">Login</Link>
        </div>
      </header>
    </>
  );
}

function InfoItem({ label, value }) {
  return <div><span>{label}</span><strong>{value || "—"}</strong></div>;
}

export default RequestStatus;
