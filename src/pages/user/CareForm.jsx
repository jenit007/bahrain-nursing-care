import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import logoMark from "../../assets/noor-al-afiya-mark.png";
import { addRequest } from "../../utils/requestStorage";
import "./CareForm.css";

const careData = {
  patient: {
    title: "Patient Care",
    eyebrow: "CARE REQUEST · 01",
    description: "Book professional patient care at home with a quick and simple request.",
    conditions: ["Normal", "Wheelchair", "Bedridden", "Ventilator", "Other"],
  },
  elder: {
    title: "Elder Care",
    eyebrow: "CARE REQUEST · 02",
    description: "Arrange comfortable and dependable elder care at home in just a few steps.",
    conditions: ["Normal", "Wheelchair", "Bedridden", "Other"],
  },
  newborn: {
    title: "Newborn Baby Care",
    eyebrow: "CARE REQUEST · 03",
    description: "Tell us what support your newborn needs and choose your preferred care shift.",
    conditions: ["Normal", "Premature Baby", "Disable", "Abnormal"],
  },
  children: {
    title: "Children's Care",
    eyebrow: "CARE REQUEST · 04",
    description: "Request caring home support for your child with a short, easy booking form.",
    conditions: ["Normal", "Disable", "Abnormal"],
  },
};

const shiftOptions = ["12h", "24h", "Other"];

const GOVERNORATES = [
  "Capital Governorate",
  "Muharraq Governorate",
  "Northern Governorate",
  "Southern Governorate",
];

function CareForm() {
  const { service } = useParams();
  const navigate = useNavigate();
  const currentService = careData[service];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    notes: "",
    condition: "",
    shift: "",
    shiftOther: "",
    address: {
      flatNo: "",
      buildingNo: "",
      area: "",
      governorate: "",
      country: "Bahrain",
    },
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

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      address: {
        ...previous.address,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    addRequest({
      service: currentService.title,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      preferredDate: formData.preferredDate,
      notes: formData.notes,
      condition: formData.condition,
      shift: formData.shift,
      shiftOther: formData.shift === "Other" ? formData.shiftOther : "",
      address: formData.address,
    });

    navigate("/request-status");
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="care-form-page">
      <div className="care-form-topbar">
        <div className="care-form-container care-form-topbar-inner">
          <span>NOOR AL AFIYA</span>
          <div>
            <span>24/7 Home Care Support</span>
            <span>•</span>
            <span>Bahrain</span>
          </div>
        </div>
      </div>

      <header className="care-form-navbar">
        <div className="care-form-container care-form-nav-inner">
          <Link to="/" className="home-brand">
            <img src={logoMark} alt="NOOR AL AFIYA" className="brand-mark-image" />
            <span>
              <strong>NOOR AL AFIYA</strong>
              <small>Home Health Care WLL</small>
            </span>
          </Link>

          <nav className="care-form-nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/services">Our Services</Link>
            <Link to="/why-us">Why Choose Us</Link>
            <Link to="/contact">Contact Us</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="care-form-hero">
          <div className="care-form-container care-form-hero-inner">
            <button
              type="button"
              className="care-back-link"
              onClick={() => navigate("/services")}
            >
              ← Back to Services
            </button>
            <p className="care-eyebrow">{currentService.eyebrow}</p>
            <h1>Book {currentService.title}</h1>
            <p>{currentService.description}</p>
          </div>
        </section>

        <section className="care-form-section">
          <div className="care-form-container care-form-layout">
            <aside className="care-form-sidebar">
              <div className="care-sidebar-card">
                <span className="care-sidebar-number">01</span>
                <p className="care-sidebar-label">QUICK BOOKING</p>
                <h2>{currentService.title}</h2>
                <p>
                  We only ask for the information needed to arrange your care request.
                </p>
                <div className="care-sidebar-points">
                  <span><b>✓</b> Contact details</span>
                  <span><b>✓</b> Preferred date</span>
                  <span><b>✓</b> Care requirement</span>
                  <span><b>✓</b> Service address</span>
                </div>
              </div>
              <div className="care-help-card">
                <span>QUICK & SIMPLE</span>
                <strong>Book care in a few minutes</strong>
                <p>Complete the required fields and submit your request.</p>
              </div>
            </aside>

            <form className="care-form-card" onSubmit={handleSubmit}>
              <div className="care-form-card-header">
                <div>
                  <p className="care-section-label">YOUR DETAILS</p>
                  <h2>Let's arrange your care</h2>
                  <p>Only the essential information is required. Fields marked with * are mandatory.</p>
                </div>
                <span className="care-form-step">SHORT FORM</span>
              </div>

              <div className="care-form-fields">
                <div className="care-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="care-field">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="care-field">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                    required
                  />
                </div>

                <div className="care-field">
                  <label>Preferred Date *</label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={today}
                    required
                  />
                </div>

                <div className="care-field care-field-full">
                  <label>Additional Notes <span className="optional-label">(Optional)</span></label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Anything else you would like us to know?"
                    rows="4"
                  />
                </div>
              </div>

              <div className="care-form-divider" />

              <div className="care-form-section-heading">
                <p className="care-section-label">CARE REQUIREMENT</p>
                <h3>Select the care requirement and shift</h3>
                <p>These options are specific to {currentService.title}.</p>
              </div>

              <div className="care-choice-group">
                <label className="care-choice-label">Condition *</label>
                <div className="care-choice-grid">
                  {currentService.conditions.map((condition) => (
                    <label
                      className={`care-choice-card ${formData.condition === condition ? "selected" : ""}`}
                      key={condition}
                    >
                      <input
                        type="radio"
                        name="condition"
                        value={condition}
                        checked={formData.condition === condition}
                        onChange={handleChange}
                        required
                      />
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
                    <label
                      className={`care-choice-card ${formData.shift === shift ? "selected" : ""}`}
                      key={shift}
                    >
                      <input
                        type="radio"
                        name="shift"
                        value={shift}
                        checked={formData.shift === shift}
                        onChange={handleChange}
                        required
                      />
                      <span className="care-choice-radio" />
                      <span>{shift}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.shift === "Other" && (
                <div className="care-field care-shift-other-field">
                  <label>Enter Preferred Shift *</label>
                  <input
                    type="text"
                    name="shiftOther"
                    value={formData.shiftOther}
                    onChange={handleChange}
                    placeholder="Example: 8 hours, 10 AM - 6 PM"
                    required
                  />
                </div>
              )}

              <div className="care-form-divider" />

              <div className="care-form-section-heading">
                <p className="care-section-label">SERVICE ADDRESS</p>
                <h3>Where should the care be provided?</h3>
                <p>Enter the Bahrain service address. All address fields are required.</p>
              </div>

              <div className="care-address-grid">
                <div className="care-field">
                  <label>Flat No. *</label>
                  <input
                    type="text"
                    name="flatNo"
                    value={formData.address.flatNo}
                    onChange={handleAddressChange}
                    placeholder="Enter flat number"
                    required
                  />
                </div>

                <div className="care-field">
                  <label>Building No. *</label>
                  <input
                    type="text"
                    name="buildingNo"
                    value={formData.address.buildingNo}
                    onChange={handleAddressChange}
                    placeholder="Enter building number"
                    required
                  />
                </div>

                <div className="care-field">
                  <label>Area *</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.address.area}
                    onChange={handleAddressChange}
                    placeholder="Enter area"
                    required
                  />
                </div>

                <div className="care-field">
                  <label>Governorate *</label>
                  <select
                    name="governorate"
                    value={formData.address.governorate}
                    onChange={handleAddressChange}
                    required
                  >
                    <option value="">Select governorate</option>
                    {GOVERNORATES.map((governorate) => (
                      <option key={governorate} value={governorate}>
                        {governorate}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="care-address-note">
                <span>✓</span>
                <p>Service location: Bahrain</p>
              </div>

              <div className="care-submit-area">
                <div>
                  <strong>Ready to submit?</strong>
                  <span>Your request will appear in Request Tracking after submission.</span>
                </div>
                <button type="submit" className="care-primary-btn">
                  Submit Care Request <span>→</span>
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="care-form-footer">
        <div className="care-form-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', padding: '40px 0' }}>
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
        <div className="care-footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0' }}>
          <span>© 2026 NOOR AL AFIYA. All rights reserved.</span>
          <span>Home Nursing • Bahrain</span>
        </div>
      </footer>
    </div>
  );
}

export default CareForm;
