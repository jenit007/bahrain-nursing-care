import { useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LocationPicker from "../../components/LocationPicker";
import { addRequest } from "../../utils/requestStorage";
import "./CareForm.css";

const careData = {
  patient: {
    title: "Patient Care",
    eyebrow: "CARE REQUEST · 01",
    description: "Tell us about the patient and the care support required at home.",
    nameLabel: "Patient Name",
    conditions: ["Normal", "Wheelchair", "Bedridden", "Ventilator", "Other"],
  },
  elder: {
    title: "Elder Care",
    eyebrow: "CARE REQUEST · 02",
    description: "Provide the details needed to arrange comfortable elder care at home.",
    nameLabel: "Name",
    conditions: ["Normal", "Wheelchair", "Bedridden", "Other"],
  },
  newborn: {
    title: "Newborn Baby Care",
    eyebrow: "CARE REQUEST · 03",
    description: "Share the baby's care requirements so the request can be reviewed accurately.",
    nameLabel: "Name",
    conditions: ["Normal", "Premature Baby", "Disable", "Abnormal"],
  },
  children: {
    title: "Children's Care",
    eyebrow: "CARE REQUEST · 04",
    description: "Tell us about the child and the home-care support your family needs.",
    nameLabel: "Name",
    conditions: ["Normal", "Disable", "Abnormal"],
  },
};

const shiftOptions = ["12h", "24h", "Other"];

function CareForm() {
  const { service } = useParams();
  const navigate = useNavigate();
  const currentService = careData[service];

  const [formData, setFormData] = useState({
    name: "",
    cpr: "",
    phone: "",
    alternativePhone: "",
    email: "",
    condition: "",
    shift: "",
    address: {
      flatVilla: "",
      buildingNumber: "",
      roadNumber: "",
      blockNumber: "",
      area: "",
      governorate: "",
      poBox: "",
      country: "Bahrain",
    },
    latitude: "",
    longitude: "",
  });

  if (!currentService) {
    return (
      <div className="care-form-page">
        <div className="care-form-empty">
          <span className="care-form-empty-icon">!</span>
          <h2>Service Not Found</h2>
          <p>The requested care service could not be found.</p>
          <button className="care-primary-btn" onClick={() => navigate("/services")}>
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleLocationChange = useCallback((location) => {
    setFormData((previous) => ({
      ...previous,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
    }));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    addRequest({
      service: currentService.title,
      name: formData.name,
      cpr: formData.cpr,
      phone: formData.phone,
      alternativePhone: formData.alternativePhone,
      email: formData.email,
      condition: formData.condition,
      shift: formData.shift,
      address: formData.address,
      latitude: formData.latitude,
      longitude: formData.longitude,
    });

    navigate("/request-status");
  };

  return (
    <div className="care-form-page">
      <div className="care-form-topbar">
        <div className="care-form-container care-form-topbar-inner">
          <span>Bahrain Home Nursing Care</span>
          <div>
            <span>24/7 Home Care Support</span>
            <span>•</span>
            <span>Bahrain</span>
          </div>
        </div>
      </div>

      <header className="care-form-navbar">
        <div className="care-form-container care-form-nav-inner">
          <Link to="/" className="care-form-logo">
            <span className="care-form-logo-main">Bahrain</span>
            <span className="care-form-logo-sub">HOME NURSING CARE</span>
          </Link>

          <nav className="care-form-nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/services">Our Services</Link>
            <Link to="/why-us">Why Choose Us</Link>
            <Link to="/contact">Contact Us</Link>
          </nav>

          <Link to="/login" className="care-form-login-btn">Login</Link>
        </div>
      </header>

      <main>
        <section className="care-form-hero">
          <div className="care-form-container care-form-hero-inner">
            <button type="button" className="care-back-link" onClick={() => navigate(`/services/${service}`)}>
              ← Back to {currentService.title}
            </button>
            <p className="care-eyebrow">{currentService.eyebrow}</p>
            <h1>Request {currentService.title}</h1>
            <p>{currentService.description}</p>
          </div>
        </section>

        <section className="care-form-section">
          <div className="care-form-container care-form-layout">
            <aside className="care-form-sidebar">
              <div className="care-sidebar-card">
                <span className="care-sidebar-number">01</span>
                <p className="care-sidebar-label">YOUR REQUEST</p>
                <h2>{currentService.title}</h2>
                <p>Complete the required information below. Your request will be stored and sent to the request tracker after submission.</p>
                <div className="care-sidebar-points">
                  <span><b>✓</b> Personal details</span>
                  <span><b>✓</b> Care requirement</span>
                  <span><b>✓</b> Bahrain location</span>
                  <span><b>✓</b> Shift preference</span>
                </div>
              </div>
              <div className="care-help-card">
                <span>NEED HELP?</span>
                <strong>24/7 Home Care Support</strong>
                <p>Submit your details and our team can review the request.</p>
              </div>
            </aside>

            <form className="care-form-card" onSubmit={handleSubmit}>
              <div className="care-form-card-header">
                <div>
                  <p className="care-section-label">PERSONAL & CARE DETAILS</p>
                  <h2>Tell us about the care requirement</h2>
                  <p>Fields marked with * are required.</p>
                </div>
                <span className="care-form-step">STEP 01</span>
              </div>

              <div className="care-form-fields">
                <div className="care-field">
                  <label>{currentService.nameLabel} *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={`Enter ${currentService.nameLabel.toLowerCase()}`} required />
                </div>
                <div className="care-field">
                  <label>CPR *</label>
                  <input type="text" name="cpr" value={formData.cpr} onChange={handleChange} placeholder="Enter CPR number" required />
                </div>
                <div className="care-field">
                  <label>Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" required />
                </div>
                <div className="care-field">
                  <label>Alternative Phone Number *</label>
                  <input type="tel" name="alternativePhone" value={formData.alternativePhone} onChange={handleChange} placeholder="Enter alternative number" required />
                </div>
                <div className="care-field care-field-full">
                  <label>Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" required />
                </div>
              </div>

              <div className="care-form-divider" />

              <div className="care-form-section-heading">
                <p className="care-section-label">CARE REQUIREMENT</p>
                <h3>Select the condition and required shift</h3>
              </div>

              <div className="care-choice-group">
                <label className="care-choice-label">Condition *</label>
                <div className="care-choice-grid">
                  {currentService.conditions.map((condition) => (
                    <label className={`care-choice-card ${formData.condition === condition ? "selected" : ""}`} key={condition}>
                      <input type="radio" name="condition" value={condition} checked={formData.condition === condition} onChange={handleChange} required />
                      <span className="care-choice-radio" />
                      <span>{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="care-choice-group">
                <label className="care-choice-label">Shift *</label>
                <div className="care-choice-grid care-shift-grid">
                  {shiftOptions.map((shift) => (
                    <label className={`care-choice-card ${formData.shift === shift ? "selected" : ""}`} key={shift}>
                      <input type="radio" name="shift" value={shift} checked={formData.shift === shift} onChange={handleChange} required />
                      <span className="care-choice-radio" />
                      <span>{shift}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="care-form-divider" />

              <div className="care-form-section-heading">
                <p className="care-section-label">CARE LOCATION</p>
                <h3>Where should the care be provided?</h3>
                <p>Enter the Bahrain address manually or use the map to detect your location.</p>
              </div>

              <div className="care-location-wrapper">
                <LocationPicker onLocationChange={handleLocationChange} />
              </div>

              <div className="care-submit-area">
                <div>
                  <strong>Ready to submit?</strong>
                  <span>Your request will appear in Request Tracking after submission.</span>
                </div>
                <button type="submit" className="care-primary-btn">Submit Care Request <span>→</span></button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="care-form-footer">
        <div className="care-form-container care-footer-inner">
          <div>
            <Link to="/" className="care-footer-logo">Bahrain <span>HOME NURSING CARE</span></Link>
            <p>Professional home nursing care support designed around individuals and families in Bahrain.</p>
          </div>
          <div className="care-footer-links">
            <Link to="/services">Our Services</Link>
            <Link to="/request-status">Request Tracking</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>
        <div className="care-footer-bottom">© 2026 Bahrain Home Nursing Care. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default CareForm;
