import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoMark from "../../assets/noor-al-afiya-mark.png";
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
              <InfoItem label="Full Name" value={request.name} />
              <InfoItem label="Email" value={request.email} />
              <InfoItem label="Phone" value={request.phone} />
              <InfoItem label="Preferred Date" value={request.preferredDate ? new Date(`${request.preferredDate}T00:00:00`).toLocaleDateString() : "N/A"} />
              <InfoItem label="Condition" value={request.condition} />
              <InfoItem label="Shift" value={request.shift === "Other" && request.shiftOther ? request.shiftOther : request.shift} />
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
              <p className="status-section-label">SERVICE ADDRESS</p>
              <h3>Bahrain service address</h3>
              <div className="status-address">
                <span>Flat No.: {address.flatNo || address.flatVilla || "—"}</span>
                <span>Building No.: {address.buildingNo || address.buildingNumber || "—"}</span>
                <span>Area: {address.area || "—"}</span>
                <span>Governorate: {address.governorate || "—"}</span>
                <span>Country: Bahrain</span>
              </div>
            </div>

            <div className="status-detail-card">
              <p className="status-section-label">ADDITIONAL NOTES</p>
              <h3>Information shared with our team</h3>
              <p className="status-next-text">{request.notes || "No additional notes were provided."}</p>
            </div>

            <div className="status-detail-card">
              <p className="status-section-label">NEXT STEP</p>
              <h3>{request.status === "Completed" ? "Your request is complete" : "Keep your request details available"}</h3>
              <p className="status-next-text">
                {request.status === "Completed" ? "Thank you for choosing NOOR AL AFIYA Home Health Care." : "Your request status can be updated by the admin dashboard. This page checks for updates automatically."}
              </p>
            </div>
          </section>

          {request.status === "Completed" && (
            <div className="status-complete-note"><span>✓</span><div><strong>Service completed</strong><p>Thank you for choosing NOOR AL AFIYA. Our team has successfully completed your requested home care service.</p></div></div>
          )}

          <div className="status-actions">
            <button className="status-secondary-btn" onClick={() => navigate("/services")}>Back to Services</button>
            <button className="status-secondary-btn" onClick={() => navigate("/contact")}>Contact Us</button>
          </div>
        </div>
      </main>

      <footer className="status-footer">
        <div className="status-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', padding: '40px 0' }}>
          <div>
            <Link className="home-brand" to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <img src={logoMark} alt="NOOR AL AFIYA" className="brand-mark-image" />
              <span>
                <strong>NOOR AL AFIYA</strong>
                <small>Home Health Care WLL</small>
              </span>
            </Link>
            <p style={{ marginTop: '12px', fontSize: '13px', color: '#8995A7' }}>
              Compassionate home-care services for families in Bahrain.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '15px' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/" style={{ color: '#9AA5B6', textDecoration: 'none' }}>Home</Link>
              <Link to="/about" style={{ color: '#9AA5B6', textDecoration: 'none' }}>About Us</Link>
              <Link to="/services" style={{ color: '#9AA5B6', textDecoration: 'none' }}>Our Services</Link>
              <Link to="/why-us" style={{ color: '#9AA5B6', textDecoration: 'none' }}>Why Choose Us</Link>
              <Link to="/contact" style={{ color: '#9AA5B6', textDecoration: 'none' }}>Contact Us</Link>
              <Link to="/careers" style={{ color: '#9AA5B6', textDecoration: 'none' }}>Job Opportunities</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '15px' }}>Services</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/care/patient" style={{ color: '#9AA5B6', textDecoration: 'none' }}>Patient Care</Link>
              <Link to="/care/elder" style={{ color: '#9AA5B6', textDecoration: 'none' }}>Elder Care</Link>
              <Link to="/care/newborn" style={{ color: '#9AA5B6', textDecoration: 'none' }}>Newborn Care</Link>
              <Link to="/care/children" style={{ color: '#9AA5B6', textDecoration: 'none' }}>Children's Care</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '15px' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#9AA5B6' }}>
              <a href="tel:+97300000000" style={{ color: '#9AA5B6', textDecoration: 'none' }}>+973 0000 0000</a>
              <a href="mailto:info@bahrainnursingcare.com" style={{ color: '#9AA5B6', textDecoration: 'none' }}>info@bahrainnursingcare.com</a>
              <span>Bahrain</span>
            </div>
          </div>
        </div>
        <div className="status-footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0' }}>
          <span>© 2026 NOOR AL AFIYA. All rights reserved.</span>
          <span>Home Nursing • Bahrain</span>
        </div>
      </footer>
    </div>
  );
}

function StatusHeader() {
  return (
    <>
      <div className="status-topbar"><div className="status-container"><span>NOOR AL AFIYA</span><span>24/7 Home Care Support • Bahrain</span></div></div>
      <header className="status-navbar">
        <div className="status-container status-nav-inner">
          <Link to="/" className="home-brand">
            <img src={logoMark} alt="NOOR AL AFIYA" className="brand-mark-image" />
            <span>
              <strong>NOOR AL AFIYA</strong>
              <small>Home Health Care WLL</small>
            </span>
          </Link>
          <nav><Link to="/">Home</Link><Link to="/about">About Us</Link><Link to="/services">Our Services</Link><Link to="/why-us">Why Choose Us</Link><Link to="/contact">Contact Us</Link></nav>
        </div>
      </header>
    </>
  );
}

function InfoItem({ label, value }) {
  return <div><span>{label}</span><strong>{value || "—"}</strong></div>;
}

export default RequestStatus;
