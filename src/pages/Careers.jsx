import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { addJobApplication } from "../utils/requestStorage";
import "../pages/Home.css";
import "./Careers.css";

import logoMark from "../assets/noor-al-afiya-mark.png";
import careersHero from "../assets/careers/careers-hero.png";

const positions = [
  "Registered Nurse",
  "Caregiver",
  "Newborn Care Specialist",
  "Patient Care Assistant",
  "Other Healthcare Position",
];

const governorates = [
  "Capital Governorate",
  "Muharraq Governorate",
  "Northern Governorate",
  "Southern Governorate",
];

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  governorate: "",
  position: "",
  experience: "",
  qualification: "",
  licenseNumber: "",
  availability: "",
  message: "",
};

function Careers() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [cvFile, setCvFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const cvInputRef = useRef(null);
  const certificateInputRef = useRef(null);

  const selectedFiles = useMemo(
    () => ({
      cv: cvFile ? `${cvFile.name} (${formatFileSize(cvFile.size)})` : "No CV selected",
      certificate: certificateFile
        ? `${certificateFile.name} (${formatFileSize(certificateFile.size)})`
        : "No certification selected",
    }),
    [cvFile, certificateFile]
  );

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setSubmitted(false);
  };

  const validateFile = (file, type) => {
    if (!file) return true;

    const maxSize = 5 * 1024 * 1024;
    const allowed =
      type === "cv"
        ? [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ]
        : [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ];

    if (file.size > maxSize) {
      return "Please choose a file smaller than 5 MB.";
    }

    if (!allowed.includes(file.type)) {
      return type === "cv"
        ? "CV must be a PDF, DOC or DOCX file."
        : "Certification must be a PDF, JPG, PNG, DOC or DOCX file.";
    }

    return true;
  };

  const handleFileChange = (event, type) => {
    const file = event.target.files?.[0] || null;
    const result = validateFile(file, type);

    if (result !== true) {
      setErrors((current) => ({ ...current, [type]: result }));
      event.target.value = "";
      return;
    }

    setErrors((current) => ({ ...current, [type]: "" }));
    setSubmitted(false);

    if (type === "cv") setCvFile(file);
    if (type === "certificate") setCertificateFile(file);
  };

  const clearFile = (type) => {
    if (type === "cv") {
      setCvFile(null);
      if (cvInputRef.current) cvInputRef.current.value = "";
    }

    if (type === "certificate") {
      setCertificateFile(null);
      if (certificateInputRef.current) certificateInputRef.current.value = "";
    }
  };

  const validate = () => {
    const nextErrors = {};
    const required = [
      ["fullName", "Full name is required."],
      ["email", "Email address is required."],
      ["phone", "Phone number is required."],
      ["address", "Address is required."],
      ["governorate", "Please select your governorate."],
      ["position", "Please select a position."],
      ["experience", "Please select your experience level."],
      ["qualification", "Professional qualification is required."],
      ["availability", "Please select your availability."],
    ];

    required.forEach(([field, message]) => {
      if (!String(form[field]).trim()) nextErrors[field] = message;
    });

    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (form.phone && !/^[+\d][\d\s().-]{7,18}$/.test(form.phone)) {
      nextErrors.phone = "Please enter a valid phone number.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const applicationPayload = {
      ...form,
      cvFileName: cvFile?.name || "Not provided",
      certificationFileName: certificateFile?.name || "Not provided",
      submittedAt: new Date().toISOString(),
      status: "Application Received",
    };

    try {
      addJobApplication(applicationPayload);
      await new Promise((resolve) => setTimeout(resolve, 350));
      setSubmitted(true);
      setForm(initialForm);
      setCvFile(null);
      setCertificateFile(null);
      if (cvInputRef.current) cvInputRef.current.value = "";
      if (certificateInputRef.current) certificateInputRef.current.value = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors({
        form: "We could not save the application in this browser. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="careers-page">
      <div className="top-strip">
        <div className="home-container top-strip-inner">
          <span>Professional home nursing care in Bahrain</span>
          <div className="top-contact">
            <a href="tel:+97300000000">+973 0000 0000</a>
            <span>•</span>
            <a href="mailto:info@bahrainnursingcare.com">info@bahrainnursingcare.com</a>
          </div>
        </div>
      </div>

      <header className="home-nav-wrap">
        <div className="home-container home-nav">
          <Link className="home-brand" to="/" onClick={() => setMenuOpen(false)}>
            <img src={logoMark} alt="NOOR AL AFIYA" className="brand-mark-image" />
            <span>
              <strong>NOOR AL AFIYA</strong>
              <small>Home Health Care WLL</small>
            </span>
          </Link>

          <button
            className={`nav-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
            type="button"
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`home-nav-links ${menuOpen ? "show" : ""}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link to="/services" onClick={() => setMenuOpen(false)}>Our Services</Link>
            <Link to="/why-us" onClick={() => setMenuOpen(false)}>Why Choose Us</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>
            <Link to="/careers" className="active" onClick={() => setMenuOpen(false)}>Job Opportunities</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="careers-hero">
          <div className="careers-container careers-hero-grid">
            <div className="careers-hero-copy">
              <span className="careers-eyebrow">
                <span className="careers-eyebrow-dot" />
                CAREERS AT NOOR AL AFIYA
              </span>
              <h1>
                Make a difference,
                <span>one home at a time.</span>
              </h1>
              <p>
                Join a caring healthcare team where your skills, compassion and
                professionalism can directly improve the lives of patients and
                families across Bahrain.
              </p>
              <div className="careers-hero-actions">
                <a href="#application" className="careers-primary-button">
                  Apply Now <span>↓</span>
                </a>
                <a href="#open-roles" className="careers-secondary-button">
                  Explore Opportunities <span>↗</span>
                </a>
              </div>
              <div className="careers-hero-points">
                <span><b>✓</b> Professional growth</span>
                <span><b>✓</b> Meaningful patient care</span>
                <span><b>✓</b> Bahrain-based opportunities</span>
              </div>
            </div>

            <div className="careers-hero-visual">
              <div className="careers-image-card">
                <img
                  src={careersHero}
                  alt="Healthcare professional preparing for home care work"
                />
              </div>
              <div className="careers-image-badge">
                <span className="badge-icon">✦</span>
                <div>
                  <strong>Care starts with people.</strong>
                  <small>Bring your expertise to a team that values it.</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="careers-intro" id="open-roles">
          <div className="careers-container">
            <div className="careers-section-heading">
              <div>
                <span className="section-kicker">OPPORTUNITIES</span>
                <h2>Find your place in our care team.</h2>
              </div>
              <p>
                We welcome qualified healthcare professionals and caring
                support staff who want to build meaningful careers in home
                healthcare.
              </p>
            </div>

            <div className="careers-role-grid">
              <article className="careers-role-card featured">
                <div className="role-icon">✚</div>
                <div>
                  <span className="role-tag">CLINICAL</span>
                  <h3>Registered Nurse</h3>
                  <p>
                    Support patients at home with professional nursing care,
                    clinical attention and compassionate communication.
                  </p>
                </div>
                <a href="#application">Apply for this role <span>→</span></a>
              </article>

              <article className="careers-role-card">
                <div className="role-icon">♡</div>
                <div>
                  <span className="role-tag">CARE SUPPORT</span>
                  <h3>Caregiver</h3>
                  <p>
                    Help clients with daily living, companionship, comfort and
                    respectful home-based support.
                  </p>
                </div>
                <a href="#application">Apply for this role <span>→</span></a>
              </article>

              <article className="careers-role-card">
                <div className="role-icon">✦</div>
                <div>
                  <span className="role-tag">CHILD & FAMILY</span>
                  <h3>Newborn Care Specialist</h3>
                  <p>
                    Provide attentive support for newborns and help families
                    feel confident during the early stages of care.
                  </p>
                </div>
                <a href="#application">Apply for this role <span>→</span></a>
              </article>
            </div>
          </div>
        </section>

        <section className="careers-values">
          <div className="careers-container careers-values-grid">
            <div>
              <span className="section-kicker">WHY JOIN US</span>
              <h2>Bring your skills. Grow with purpose.</h2>
              <p>
                Home healthcare is personal. We are building a team that puts
                professionalism, dignity and human connection at the centre
                of every visit.
              </p>
            </div>
            <div className="careers-benefit-list">
              <div><span>01</span><strong>People-first culture</strong><p>Work in an environment built around respect and compassionate care.</p></div>
              <div><span>02</span><strong>Continuous development</strong><p>Keep strengthening your professional knowledge and practical skills.</p></div>
              <div><span>03</span><strong>Meaningful work</strong><p>Use your expertise where it can make a direct difference to families.</p></div>
            </div>
          </div>
        </section>

        <section className="careers-application" id="application">
          <div className="careers-container">
            <div className="application-heading">
              <span className="section-kicker">JOIN OUR TEAM</span>
              <h2>Submit your application</h2>
              <p>
                Tell us about yourself and your professional background. Your
                CV and nursing certification are welcome, but they are optional
                at this stage.
              </p>
            </div>

            {submitted && (
              <div className="application-success" role="status">
                <span>✓</span>
                <div>
                  <strong>Application received.</strong>
                  <p>Thank you for your interest in NOOR AL AFIYA. Our team can review your details and contact you if your profile matches an opportunity.</p>
                </div>
              </div>
            )}

            {errors.form && <div className="application-error">{errors.form}</div>}

            <form className="career-form" onSubmit={handleSubmit} noValidate>
              <div className="form-section-title">
                <span>01</span>
                <div><h3>Personal information</h3><p>Fields marked with * are required.</p></div>
              </div>

              <div className="career-form-grid">
                <Field label="Full Name" name="fullName" value={form.fullName} onChange={updateField} required placeholder="Enter your full name" error={errors.fullName} />
                <Field label="Email Address" name="email" type="email" value={form.email} onChange={updateField} required placeholder="you@example.com" error={errors.email} />
                <Field label="Phone Number" name="phone" value={form.phone} onChange={updateField} required placeholder="+973 XXXX XXXX" error={errors.phone} />
                <SelectField label="Governorate" name="governorate" value={form.governorate} onChange={updateField} required options={governorates} placeholder="Select governorate" error={errors.governorate} />
                <div className="career-field full-width">
                  <label htmlFor="address">Address <span>*</span></label>
                  <textarea id="address" name="address" value={form.address} onChange={updateField} required rows="3" placeholder="Flat / building, area and additional address details" />
                  {errors.address && <small className="field-error">{errors.address}</small>}
                </div>
              </div>

              <div className="form-section-title second">
                <span>02</span>
                <div><h3>Professional profile</h3><p>Help us understand where your experience fits.</p></div>
              </div>

              <div className="career-form-grid">
                <SelectField label="Position Applying For" name="position" value={form.position} onChange={updateField} required options={positions} placeholder="Select a position" error={errors.position} />
                <SelectField label="Years of Experience" name="experience" value={form.experience} onChange={updateField} required options={["Less than 1 year", "1–2 years", "3–5 years", "6–10 years", "10+ years"]} placeholder="Select experience" error={errors.experience} />
                <Field label="Professional Qualification" name="qualification" value={form.qualification} onChange={updateField} required placeholder="e.g. BSN, GNM, Caregiver Certificate" error={errors.qualification} />
                <Field label="Nursing / Professional License No." name="licenseNumber" value={form.licenseNumber} onChange={updateField} placeholder="Optional" />
                <SelectField label="Availability" name="availability" value={form.availability} onChange={updateField} required options={["Immediately", "Within 2 weeks", "Within 1 month", "More than 1 month"]} placeholder="Select availability" error={errors.availability} />
                <div className="career-field full-width">
                  <label htmlFor="message">About You <span className="optional">Optional</span></label>
                  <textarea id="message" name="message" value={form.message} onChange={updateField} rows="4" placeholder="Briefly tell us about your experience, strengths or the type of care you are interested in." />
                </div>
              </div>

              <div className="form-section-title second">
                <span>03</span>
                <div><h3>Documents</h3><p>Optional now. You can provide them if available.</p></div>
              </div>

              <div className="upload-grid">
                <UploadBox
                  id="career-cv"
                  title="Upload your CV"
                  hint="PDF, DOC or DOCX • up to 5 MB"
                  file={cvFile}
                  fileText={selectedFiles.cv}
                  inputRef={cvInputRef}
                  onChange={(event) => handleFileChange(event, "cv")}
                  onClear={() => clearFile("cv")}
                  error={errors.cv}
                />
                <UploadBox
                  id="career-certificate"
                  title="Nursing certification / credential"
                  hint="PDF, JPG, PNG, DOC or DOCX • up to 5 MB"
                  file={certificateFile}
                  fileText={selectedFiles.certificate}
                  inputRef={certificateInputRef}
                  onChange={(event) => handleFileChange(event, "certificate")}
                  onClear={() => clearFile("certificate")}
                  error={errors.certificate}
                />
              </div>

              <div className="career-form-footer">
                <p>
                  By submitting this application, you confirm that the information provided is accurate to the best of your knowledge.
                </p>
                <button type="submit" className="career-submit-button" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit Application"}
                  <span>→</span>
                </button>
              </div>
            </form>
          </div>
        </section>

      </main>

      <footer className="careers-footer">
        <div className="careers-container careers-footer-grid">
          <div>
            <Link
              className="home-brand"
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img
                src={logoMark}
                alt="NOOR AL AFIYA"
                className="brand-mark-image"
              />
              <span>
                <strong>NOOR AL AFIYA</strong>
                <small>Home Health Care WLL</small>
              </span>
            </Link>
            <p>Compassionate home-care services for families in Bahrain.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/services">Our Services</Link>
            <Link to="/why-us">Why Choose Us</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/careers">Job Opportunities</Link>
          </div>
          <div>
            <h4>Services</h4>
            <Link to="/care/patient">Patient Care</Link>
            <Link to="/care/elder">Elder Care</Link>
            <Link to="/care/newborn">Newborn Care</Link>
            <Link to="/care/children">Children's Care</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <a href="tel:+97300000000">+973 0000 0000</a>
            <a href="mailto:info@bahrainnursingcare.com">info@bahrainnursingcare.com</a>
            <span>Bahrain</span>
          </div>
        </div>
        <div className="careers-footer-bottom">
          <div className="careers-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>© 2026 NOOR AL AFIYA. All rights reserved.</span>
            <span>Home Nursing • Bahrain</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Field({ label, name, value, onChange, required, placeholder, type = "text", error }) {
  return (
    <div className="career-field">
      <label htmlFor={name}>{label} {required && <span>*</span>}</label>
      <input id={name} name={name} type={type} value={value} onChange={onChange} required={required} placeholder={placeholder} />
      {error && <small className="field-error">{error}</small>}
    </div>
  );
}

function SelectField({ label, name, value, onChange, required, options, placeholder, error }) {
  return (
    <div className="career-field">
      <label htmlFor={name}>{label} {required && <span>*</span>}</label>
      <select id={name} name={name} value={value} onChange={onChange} required={required}>
        <option value="">{placeholder}</option>
        {options.map((option) => <option value={option} key={option}>{option}</option>)}
      </select>
      {error && <small className="field-error">{error}</small>}
    </div>
  );
}

function UploadBox({ id, title, hint, file, fileText, inputRef, onChange, onClear, error }) {
  return (
    <div className={`upload-box ${file ? "has-file" : ""}`}>
      <input ref={inputRef} id={id} type="file" onChange={onChange} hidden />
      <label htmlFor={id} className="upload-label">
        <span className="upload-icon">↑</span>
        <span className="upload-content">
          <strong>{title} <em>Optional</em></strong>
          <small>{hint}</small>
          <span className="upload-file-name">{fileText}</span>
        </span>
        <span className="upload-action">Choose file</span>
      </label>
      {file && <button type="button" className="upload-remove" onClick={onClear}>Remove</button>}
      {error && <small className="field-error upload-error">{error}</small>}
    </div>
  );
}

function formatFileSize(bytes) {
  if (!bytes) return "0 KB";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default Careers;
