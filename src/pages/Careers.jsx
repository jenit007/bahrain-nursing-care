import { useMemo, useRef, useState } from "react";
import usePageMeta from "../utils/usePageMeta";
import { submitJobApplication } from "../utils/api";
import { useTranslation } from "../hooks/useTranslation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../pages/Home.css";
import "./Careers.css";

import careersHero from "../assets/careers/careers-hero.webp";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  cprNo: "",
  address: "",
  position: "",
  experience: "",
  qualification: "",
  licenseNumber: "",
  availability: "",
  message: "",
};

function Careers() {
  usePageMeta({
    title: "Careers | NOOR AL AFIYA",
    description: "Explore job opportunities and apply to join the NOOR AL AFIYA Home Health Care nursing team in Bahrain.",
    path: "/careers"
  });

  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [cvFile, setCvFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const cvInputRef = useRef(null);
  const certificateInputRef = useRef(null);

  const positions = [
    t("careers.positions.0"),
    t("careers.positions.1"),
    t("careers.positions.2"),
    t("careers.positions.3"),
    t("careers.positions.4"),
  ];

  const experienceOptions = [
    t("careers.experienceOptions.0"),
    t("careers.experienceOptions.1"),
    t("careers.experienceOptions.2"),
    t("careers.experienceOptions.3"),
    t("careers.experienceOptions.4"),
  ];

  const availabilityOptions = [
    t("careers.availabilityOptions.0"),
    t("careers.availabilityOptions.1"),
    t("careers.availabilityOptions.2"),
    t("careers.availabilityOptions.3"),
  ];

  const selectedFiles = useMemo(
    () => ({
      cv: cvFile ? `${cvFile.name} (${formatFileSize(cvFile.size)})` : t("careers.noCV"),
      certificate: certificateFile
        ? `${certificateFile.name} (${formatFileSize(certificateFile.size)})`
        : t("careers.noCert"),
    }),
    [cvFile, certificateFile, t]
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
      return t("careers.fileTooLarge");
    }

    if (!allowed.includes(file.type)) {
      return type === "cv"
        ? t("careers.cvFileType")
        : t("careers.certFileType");
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
      ["fullName", t("careers.validFullName")],
      ["email", t("careers.validEmail")],
      ["phone", t("careers.validPhone")],
      ["cprNo", t("careers.validCpr")],
      ["address", t("careers.validAddress")],
      ["position", t("careers.validPosition")],
      ["experience", t("careers.validExperience")],
      ["qualification", t("careers.validQualification")],
      ["availability", t("careers.validAvailability")],
    ];

    required.forEach(([field, message]) => {
      if (!String(form[field]).trim()) nextErrors[field] = message;
    });

    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = t("careers.validEmailFormat");
    }

    if (form.phone && (!/^[+\d][\d\s().-]{6,20}$/.test(form.phone) || form.phone.replace(/\D/g, "").length < 7)) {
      nextErrors.phone = t("careers.validPhoneFormat");
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});

    try {
      await submitJobApplication(form, cvFile, certificateFile);
      setSubmitted(true);
      setForm(initialForm);
      setCvFile(null);
      setCertificateFile(null);
      if (cvInputRef.current) cvInputRef.current.value = "";
      if (certificateInputRef.current) certificateInputRef.current.value = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrors({
        ...err.details,
        form:
          err.message ||
          t("careers.appError"),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="careers-page">
      <Header />

      <main>
        <section className="careers-hero">
          <div className="careers-container careers-hero-grid">
            <div className="careers-hero-copy">
              <span className="careers-eyebrow">
                <span className="careers-eyebrow-dot" />
                {t("careers.heroEyebrow")}
              </span>
              <h1>
                {t("careers.heroHeading")}
                <span> {t("careers.heroHeadingSpan")}</span>
              </h1>
              <p>{t("careers.heroDesc")}</p>
              <div className="careers-hero-actions">
                <a href="#application" className="careers-primary-button">
                  {t("common.applyNow")} <span>↓</span>
                </a>
                <a href="#open-roles" className="careers-secondary-button">
                  {t("common.exploreOpportunities")} <span>↗</span>
                </a>
              </div>
              <div className="careers-hero-points">
                <span><b>✓</b> {t("careers.point1")}</span>
                <span><b>✓</b> {t("careers.point2")}</span>
                <span><b>✓</b> {t("careers.point3")}</span>
              </div>
            </div>

            <div className="careers-hero-visual">
              <div className="careers-image-card">
                <img
                  src={careersHero}
                  width="1672"
                  height="941"
                  fetchPriority="high"
                  decoding="async"
                  alt="Healthcare professional preparing for home care work"
                />
              </div>
              <div className="careers-image-badge">
                <span className="badge-icon">✦</span>
                <div>
                  <strong>{t("careers.badgeTitle")}</strong>
                  <small>{t("careers.badgeSubtitle")}</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="careers-intro" id="open-roles">
          <div className="careers-container">
            <div className="careers-section-heading">
              <div>
                <span className="section-kicker">{t("careers.oppLabel")}</span>
                <h2>{t("careers.oppHeading")}</h2>
              </div>
              <p>{t("careers.oppDesc")}</p>
            </div>

            <div className="careers-role-grid">
              <article className="careers-role-card featured">
                <div className="role-icon">✚</div>
                <div>
                  <span className="role-tag">{t("careers.role1Tag")}</span>
                  <h3>{t("careers.role1Title")}</h3>
                  <p>{t("careers.role1Desc")}</p>
                </div>
                <a href="#application">{t("common.applyRole")} <span>→</span></a>
              </article>

              <article className="careers-role-card">
                <div className="role-icon">♡</div>
                <div>
                  <span className="role-tag">{t("careers.role2Tag")}</span>
                  <h3>{t("careers.role2Title")}</h3>
                  <p>{t("careers.role2Desc")}</p>
                </div>
                <a href="#application">{t("common.applyRole")} <span>→</span></a>
              </article>

              <article className="careers-role-card">
                <div className="role-icon">✦</div>
                <div>
                  <span className="role-tag">{t("careers.role3Tag")}</span>
                  <h3>{t("careers.role3Title")}</h3>
                  <p>{t("careers.role3Desc")}</p>
                </div>
                <a href="#application">{t("common.applyRole")} <span>→</span></a>
              </article>
            </div>
          </div>
        </section>

        <section className="careers-values">
          <div className="careers-container careers-values-grid">
            <div>
              <span className="section-kicker">{t("careers.whyLabel")}</span>
              <h2>{t("careers.whyHeading")}</h2>
              <p>{t("careers.whyDesc")}</p>
            </div>
            <div className="careers-benefit-list">
              <div><span>01</span><strong>{t("careers.benefit1Title")}</strong><p>{t("careers.benefit1Desc")}</p></div>
              <div><span>02</span><strong>{t("careers.benefit2Title")}</strong><p>{t("careers.benefit2Desc")}</p></div>
              <div><span>03</span><strong>{t("careers.benefit3Title")}</strong><p>{t("careers.benefit3Desc")}</p></div>
            </div>
          </div>
        </section>

        <section className="careers-application" id="application">
          <div className="careers-container">
            <div className="application-heading">
              <span className="section-kicker">{t("careers.appLabel")}</span>
              <h2>{t("careers.appHeading")}</h2>
              <p>{t("careers.appDesc")}</p>
            </div>

            {submitted && (
              <div className="application-success" role="status">
                <span>✓</span>
                <div>
                  <strong>{t("careers.appSuccess")}</strong>
                  <p>{t("careers.appSuccessDesc")}</p>
                </div>
              </div>
            )}

            {errors.form && <div className="application-error">{errors.form}</div>}

            <form className="career-form" onSubmit={handleSubmit} noValidate>
              <div className="form-section-title">
                <span>01</span>
                <div><h3>{t("careers.personalTitle")}</h3><p>{t("careers.personalDesc")}</p></div>
              </div>

              <div className="career-form-grid">
                <Field label={t("careers.fullName")} name="fullName" value={form.fullName} onChange={updateField} required placeholder={t("careers.fullNamePlaceholder")} error={errors.fullName} />
                <Field label={t("careers.emailAddress")} name="email" type="email" value={form.email} onChange={updateField} required placeholder={t("careers.emailPlaceholder")} error={errors.email} />
                <Field label={t("careers.phoneNumber")} name="phone" value={form.phone} onChange={updateField} required placeholder={t("careers.phonePlaceholder")} error={errors.phone} />
                <Field label={t("careers.cprNo")} name="cprNo" value={form.cprNo} onChange={updateField} required placeholder={t("careers.cprPlaceholder")} error={errors.cprNo} />
                <div className="career-field full-width">
                  <label htmlFor="address">{t("careers.address")} <span>*</span></label>
                  <textarea id="address" name="address" value={form.address} onChange={updateField} required rows="3" placeholder={t("careers.addressPlaceholder")} />
                  {errors.address && <small className="field-error">{errors.address}</small>}
                </div>
              </div>

              <div className="form-section-title second">
                <span>02</span>
                <div><h3>{t("careers.profileTitle")}</h3><p>{t("careers.profileDesc")}</p></div>
              </div>

              <div className="career-form-grid">
                <SelectField label={t("careers.positionApplying")} name="position" value={form.position} onChange={updateField} required options={positions} placeholder={t("careers.positionPlaceholder")} error={errors.position} />
                <SelectField label={t("careers.yearsExperience")} name="experience" value={form.experience} onChange={updateField} required options={experienceOptions} placeholder={t("careers.experiencePlaceholder")} error={errors.experience} />
                <Field label={t("careers.qualification")} name="qualification" value={form.qualification} onChange={updateField} required placeholder={t("careers.qualificationPlaceholder")} error={errors.qualification} />
                <Field label={t("careers.licenseNo")} name="licenseNumber" value={form.licenseNumber} onChange={updateField} placeholder={t("careers.licensePlaceholder")} />
                <SelectField label={t("careers.availability")} name="availability" value={form.availability} onChange={updateField} required options={availabilityOptions} placeholder={t("careers.availabilityPlaceholder")} error={errors.availability} />
                <div className="career-field full-width">
                  <label htmlFor="message">{t("careers.aboutYou")} <span className="optional">{t("common.optional")}</span></label>
                  <textarea id="message" name="message" value={form.message} onChange={updateField} rows="4" placeholder={t("careers.aboutYouPlaceholder")} />
                </div>
              </div>

              <div className="form-section-title second">
                <span>03</span>
                <div><h3>{t("careers.docsTitle")}</h3><p>{t("careers.docsDesc")}</p></div>
              </div>

              <div className="upload-grid">
                <UploadBox
                  id="career-cv"
                  title={t("careers.uploadCV")}
                  optionalLabel={t("common.optional")}
                  chooseFileLabel={t("common.chooseFile")}
                  removeLabel={t("common.remove")}
                  hint={t("careers.uploadCVHint")}
                  file={cvFile}
                  fileText={selectedFiles.cv}
                  inputRef={cvInputRef}
                  onChange={(event) => handleFileChange(event, "cv")}
                  onClear={() => clearFile("cv")}
                  error={errors.cv}
                />
                <UploadBox
                  id="career-certificate"
                  title={t("careers.uploadCert")}
                  optionalLabel={t("common.optional")}
                  chooseFileLabel={t("common.chooseFile")}
                  removeLabel={t("common.remove")}
                  hint={t("careers.uploadCertHint")}
                  file={certificateFile}
                  fileText={selectedFiles.certificate}
                  inputRef={certificateInputRef}
                  onChange={(event) => handleFileChange(event, "certificate")}
                  onClear={() => clearFile("certificate")}
                  error={errors.certificate}
                />
              </div>

              <div className="career-form-footer">
                <p>{t("careers.submitConfirm")}</p>
                <button type="submit" className="career-submit-button" disabled={submitting}>
                  {submitting ? t("careers.submitting") : t("careers.submitBtn")}
                  <span>→</span>
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
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

function UploadBox({ id, title, optionalLabel, chooseFileLabel, removeLabel, hint, file, fileText, inputRef, onChange, onClear, error }) {
  return (
    <div className={`upload-box ${file ? "has-file" : ""}`}>
      <input ref={inputRef} id={id} type="file" onChange={onChange} hidden />
      <label htmlFor={id} className="upload-label">
        <span className="upload-icon">↑</span>
        <span className="upload-content">
          <strong>{title} <em>{optionalLabel}</em></strong>
          <small>{hint}</small>
          <span className="upload-file-name">{fileText}</span>
        </span>
        <span className="upload-action">{chooseFileLabel}</span>
      </label>
      {file && <button type="button" className="upload-remove" onClick={onClear}>{removeLabel}</button>}
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
