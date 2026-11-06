import { useState } from "react";
import usePageMeta from "../../utils/usePageMeta";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { createCareBooking } from "../../utils/api";
import { useTranslation } from "../../hooks/useTranslation";
import "./CareForm.css";

const baseCareData = {
  patient: {
    rawTitle: "Patient Care",
    titleKey: "services.patient.title",
    eyebrowKey: "services.patient.eyebrow",
    descriptionKey: "services.patient.formDesc",
    conditions: [
      { raw: "Normal", labelKey: "careForm.conditionPatient.0" },
      { raw: "Wheelchair", labelKey: "careForm.conditionPatient.1" },
      { raw: "Bedridden", labelKey: "careForm.conditionPatient.2" },
      { raw: "Ventilator", labelKey: "careForm.conditionPatient.3" },
      { raw: "Other", labelKey: "careForm.conditionPatient.4" },
    ],
    showCondition: true,
    showShift: true,
    showPreferredTime: true,
    showEmail: true,
    showCprNumber: false,
    showPreferredTests: false,
  },
  elder: {
    rawTitle: "Elder Care",
    titleKey: "services.elder.title",
    eyebrowKey: "services.elder.eyebrow",
    descriptionKey: "services.elder.formDesc",
    conditions: [
      { raw: "Normal", labelKey: "careForm.conditionElder.0" },
      { raw: "Wheelchair", labelKey: "careForm.conditionElder.1" },
      { raw: "Bedridden", labelKey: "careForm.conditionElder.2" },
      { raw: "Other", labelKey: "careForm.conditionElder.3" },
    ],
    showCondition: true,
    showShift: true,
    showPreferredTime: true,
    showEmail: true,
    showCprNumber: false,
    showPreferredTests: false,
  },
  newborn: {
    rawTitle: "Newborn Baby Care",
    titleKey: "services.newborn.title",
    eyebrowKey: "services.newborn.eyebrow",
    descriptionKey: "services.newborn.formDesc",
    conditions: [
      { raw: "Normal", labelKey: "careForm.conditionNewborn.0" },
      { raw: "Premature Baby", labelKey: "careForm.conditionNewborn.1" },
      { raw: "Disable", labelKey: "careForm.conditionNewborn.2" },
      { raw: "Abnormal", labelKey: "careForm.conditionNewborn.3" },
    ],
    showCondition: true,
    showShift: true,
    showPreferredTime: true,
    showEmail: true,
    showCprNumber: false,
    showPreferredTests: false,
  },
  children: {
    rawTitle: "Children's Care",
    titleKey: "services.children.title",
    eyebrowKey: "services.children.eyebrow",
    descriptionKey: "services.children.formDesc",
    conditions: [
      { raw: "Normal", labelKey: "careForm.conditionChildren.0" },
      { raw: "Disable", labelKey: "careForm.conditionChildren.1" },
      { raw: "Abnormal", labelKey: "careForm.conditionChildren.2" },
    ],
    showCondition: true,
    showShift: true,
    showPreferredTime: true,
    showEmail: true,
    showCprNumber: false,
    showPreferredTests: false,
  },
  icu: {
    rawTitle: "ICU Patient Care",
    titleKey: "services.icu.title",
    eyebrowKey: "services.icu.eyebrow",
    descriptionKey: "services.icu.formDesc",
    conditions: [
      { raw: "Critical Care Support", labelKey: "careForm.conditionIcu.0" },
      { raw: "Post-ICU Recovery", labelKey: "careForm.conditionIcu.1" },
      { raw: "Bedridden", labelKey: "careForm.conditionIcu.2" },
      { raw: "Tracheostomy Care", labelKey: "careForm.conditionIcu.3" },
      { raw: "Other", labelKey: "careForm.conditionIcu.4" },
    ],
    showCondition: true,
    showShift: true,
    showPreferredTime: true,
    showEmail: true,
    showCprNumber: false,
    showPreferredTests: false,
  },
  cancer: {
    rawTitle: "Cancer Patient Care",
    titleKey: "services.cancer.title",
    eyebrowKey: "services.cancer.eyebrow",
    descriptionKey: "services.cancer.formDesc",
    conditions: [
      { raw: "Palliative Care", labelKey: "careForm.conditionCancer.0" },
      { raw: "Post-Chemotherapy Care", labelKey: "careForm.conditionCancer.1" },
      { raw: "Pain Management", labelKey: "careForm.conditionCancer.2" },
      { raw: "Bedridden", labelKey: "careForm.conditionCancer.3" },
      { raw: "Other", labelKey: "careForm.conditionCancer.4" },
    ],
    showCondition: true,
    showShift: true,
    showPreferredTime: true,
    showEmail: true,
    showCprNumber: false,
    showPreferredTests: false,
  },
  ventilator: {
    rawTitle: "Ventilator Patient Care",
    titleKey: "services.ventilator.title",
    eyebrowKey: "services.ventilator.eyebrow",
    descriptionKey: "services.ventilator.formDesc",
    conditions: [],
    showCondition: false,
    showShift: true,
    showPreferredTime: true,
    showEmail: true,
    showCprNumber: false,
    showPreferredTests: false,
  },
  "blood-collection": {
    rawTitle: "Blood Collection Service",
    titleKey: "services.bloodCollection.title",
    eyebrowKey: "services.bloodCollection.eyebrow",
    descriptionKey: "services.bloodCollection.formDesc",
    conditions: [],
    showCondition: false,
    showShift: false,
    showPreferredTime: false,
    showEmail: false,
    showCprNumber: true,
    showPreferredTests: true,
  },
};

baseCareData["icu-patient-care"] = baseCareData.icu;
baseCareData["cancer-patient-care"] = baseCareData.cancer;
baseCareData["ventilator-patient-care"] = baseCareData.ventilator;
baseCareData["blood-collection-service"] = baseCareData["blood-collection"];

const shiftList = [
  { raw: "12h", labelKey: "careForm.shifts.0" },
  { raw: "24h", labelKey: "careForm.shifts.1" },
  { raw: "Other", labelKey: "careForm.shifts.2" },
];

const governorateList = [
  { raw: "Capital Governorate", labelKey: "careForm.governorates.0" },
  { raw: "Muharraq Governorate", labelKey: "careForm.governorates.1" },
  { raw: "Northern Governorate", labelKey: "careForm.governorates.2" },
  { raw: "Southern Governorate", labelKey: "careForm.governorates.3" },
];

function CareForm() {
  const { service } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const currentServiceBase = baseCareData[service];

  usePageMeta({
    title: currentServiceBase ? `Request ${currentServiceBase.rawTitle} at Home | NOOR AL AFIYA` : `Care Request | NOOR AL AFIYA`,
    description: currentServiceBase ? t(currentServiceBase.descriptionKey) : undefined,
    path: `/care/${service}`,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    cprNumber: "",
    email: "",
    phone: "",
    preferredDate: "",
    notes: "",
    condition: "",
    shift: "",
    shiftOther: "",
    preferredTime: "",
    preferredTests: "",
    address: {
      flatNo: "",
      buildingNo: "",
      area: "",
      governorate: "",
      country: "Bahrain",
    },
  });

  if (!currentServiceBase) {
    return (
      <div className="care-form-page">
        <div className="care-form-empty">
          <span className="care-form-empty-icon">!</span>
          <h2>{t("careForm.serviceNotFound")}</h2>
          <p>{t("careForm.serviceNotFoundDesc")}</p>
          <button className="care-primary-btn" onClick={() => navigate("/services")}>
            {t("common.backToServices")}
          </button>
        </div>
      </div>
    );
  }

  const currentService = {
    ...currentServiceBase,
    title: t(currentServiceBase.titleKey),
    eyebrow: t(currentServiceBase.eyebrowKey),
    description: t(currentServiceBase.descriptionKey),
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    const trimmedName = formData.name.trim();
    const trimmedCpr = formData.cprNumber.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedTests = formData.preferredTests.trim();
    const trimmedFlat = formData.address.flatNo.trim();
    const trimmedBuilding = formData.address.buildingNo.trim();
    const trimmedArea = formData.address.area.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setSubmitError(t("careForm.validName"));
      return;
    }
    if (currentService.showCprNumber) {
      if (!trimmedCpr) {
        setSubmitError(t("careForm.validCpr"));
        return;
      }
    }
    if (currentService.showEmail && trimmedEmail && !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setSubmitError(t("careForm.validEmail"));
      return;
    }
    const phoneDigits = trimmedPhone.replace(/\D/g, "");
    if (!trimmedPhone || !/^[+\d][\d\s().-]{6,20}$/.test(trimmedPhone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
      setSubmitError(t("careForm.validPhone"));
      return;
    }
    if (!formData.preferredDate) {
      setSubmitError(t("careForm.validDate"));
      return;
    }
    if (currentService.showPreferredTests) {
      if (!trimmedTests) {
        setSubmitError(t("careForm.validTests"));
        return;
      }
    }
    if (!trimmedFlat || !trimmedBuilding || !trimmedArea) {
      setSubmitError(t("careForm.validAddress"));
      return;
    }

    setSubmitting(true);

    try {
      const conditionValue = currentService.showCondition ? formData.condition || "" : "";
      const shiftValue = currentService.showShift ? formData.shift || "" : "";
      const shiftOtherValue = currentService.showShift && formData.shift === "Other" ? formData.shiftOther.trim() : "";
      const preferredTimeValue = currentService.showPreferredTime ? formData.preferredTime || "" : "";
      const emailValue = currentService.showEmail ? trimmedEmail : "";
      const cprValue = currentService.showCprNumber ? trimmedCpr : "";
      const testsValue = currentService.showPreferredTests ? trimmedTests : "";

      const booking = await createCareBooking({
        service: currentServiceBase.rawTitle,
        careType: currentServiceBase.rawTitle,
        name: trimmedName,
        fullName: trimmedName,
        email: emailValue,
        phone: trimmedPhone,
        preferredDate: formData.preferredDate,
        preferredTime: preferredTimeValue,
        notes: formData.notes,
        additionalNotes: formData.notes,
        condition: conditionValue,
        shift: shiftValue,
        shiftOther: shiftOtherValue,
        cprNumber: cprValue,
        cprNo: cprValue,
        preferredTests: testsValue,
        patientDetails: {
          condition: conditionValue,
          shift: shiftValue,
          shiftOther: shiftOtherValue,
          preferredTime: preferredTimeValue,
          cprNumber: cprValue,
          cprNo: cprValue,
          preferredTests: testsValue,
        },
        address: {
          ...formData.address,
          flatNo: trimmedFlat,
          blockNo: trimmedFlat,
          buildingNo: trimmedBuilding,
          area: trimmedArea,
        },
      });

      navigate(`/request-status?ref=${encodeURIComponent(booking.bookingReference)}`);
    } catch (err) {
      setSubmitError(
        err.message || t("careForm.errorSubmit")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return (
    <div className="care-form-page">
      <Header />

      <main>
        <section className="care-form-hero">
          <div className="care-form-container care-form-hero-inner">
            <button
              type="button"
              className="care-back-link"
              onClick={() => navigate("/services")}
            >
              {t("careForm.backToServices")}
            </button>
            <p className="care-eyebrow">{currentService.eyebrow}</p>
            <h1>{t("careForm.book")} {currentService.title}</h1>
            <p>{currentService.description}</p>
          </div>
        </section>

        <section className="care-form-section">
          <div className="care-form-container care-form-layout">
            <aside className="care-form-sidebar">
              <div className="care-sidebar-card">
                <span className="care-sidebar-number">01</span>
                <p className="care-sidebar-label">{t("careForm.quickBooking")}</p>
                <h2>{currentService.title}</h2>
                <p>{t("careForm.sidebarDesc")}</p>
                <div className="care-sidebar-points">
                  <span><b>✓</b> {t("careForm.contactDetails")}</span>
                  <span><b>✓</b> {t("careForm.preferredDate")}</span>
                  {currentService.showPreferredTests ? (
                    <span><b>✓</b> {t("careForm.requestedTests")}</span>
                  ) : (
                    <span><b>✓</b> {t("careForm.careRequirement")}</span>
                  )}
                  <span><b>✓</b> {t("careForm.serviceAddress")}</span>
                </div>
              </div>
              <div className="care-help-card">
                <span>{t("careForm.quickSimple")}</span>
                <strong>{t("careForm.bookInMinutes")}</strong>
                <p>{t("careForm.completeFields")}</p>
              </div>
            </aside>

            <form className="care-form-card" onSubmit={handleSubmit}>
              <div className="care-form-card-header">
                <div>
                  <p className="care-section-label">{t("careForm.yourDetails")}</p>
                  <h2>{t("careForm.letsArrange")}</h2>
                  <p>{t("careForm.formDesc")}</p>
                </div>
                <span className="care-form-step">{t("careForm.shortForm")}</span>
              </div>

              <div className="care-form-fields">
                <div className="care-field">
                  <label>{t("careForm.fullName")}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("careForm.fullNamePlaceholder")}
                    autoComplete="name"
                    required
                  />
                </div>

                {currentService.showCprNumber && (
                  <div className="care-field">
                    <label>{t("careForm.cprNumber")}</label>
                    <input
                      type="text"
                      name="cprNumber"
                      value={formData.cprNumber}
                      onChange={handleChange}
                      placeholder={t("careForm.cprPlaceholder")}
                      autoComplete="off"
                      required
                    />
                  </div>
                )}

                {currentService.showEmail && (
                  <div className="care-field">
                    <label>{t("careForm.email")} <span className="optional-label">({t("common.optional")})</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t("careForm.emailPlaceholder")}
                      autoComplete="email"
                    />
                  </div>
                )}

                <div className="care-field">
                  <label>{t("careForm.phoneNumber")}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t("careForm.phonePlaceholder")}
                    autoComplete="tel"
                    required
                  />
                </div>

                <div className="care-field">
                  <label>{t("careForm.preferredDateLabel")}</label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={today}
                    required
                  />
                </div>

                {currentService.showPreferredTests && (
                  <div className="care-field care-field-full">
                    <label>{t("careForm.preferredTests")}</label>
                    <textarea
                      name="preferredTests"
                      value={formData.preferredTests}
                      onChange={handleChange}
                      placeholder={t("careForm.preferredTestsPlaceholder")}
                      rows="4"
                      required
                    />
                  </div>
                )}

                <div className="care-field care-field-full">
                  <label>{t("careForm.additionalNotes")} <span className="optional-label">({t("common.optional")})</span></label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder={t("careForm.additionalNotesPlaceholder")}
                    rows="4"
                  />
                </div>
              </div>

              {(currentService.showCondition || currentService.showShift || currentService.showPreferredTime) && (
                <>
                  <div className="care-form-divider" />

                  <div className="care-form-section-heading">
                    <p className="care-section-label">{t("careForm.careRequirementSection")}</p>
                    <h3>{t("careForm.selectCareShift")}</h3>
                    <p>{t("careForm.specificTo")} {currentService.title}.</p>
                  </div>

                  {currentService.showCondition && currentService.conditions?.length > 0 && (
                    <div className="care-choice-group">
                      <label className="care-choice-label">
                        {t("careForm.condition")} <span className="optional-label">({t("common.optional")})</span>
                      </label>
                      <div className="care-choice-grid">
                        {currentService.conditions.map((item) => {
                          const isSelected = formData.condition === item.raw;
                          return (
                            <label
                              className={`care-choice-card ${isSelected ? "selected" : ""}`}
                              key={item.raw}
                              onClick={(e) => {
                                if (isSelected) {
                                  e.preventDefault();
                                  setFormData((prev) => ({ ...prev, condition: "" }));
                                }
                              }}
                            >
                              <input
                                type="radio"
                                name="condition"
                                value={item.raw}
                                checked={isSelected}
                                onChange={handleChange}
                              />
                              <span className="care-choice-radio" />
                              <span>{t(item.labelKey)}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {currentService.showShift && (
                    <div className="care-choice-group">
                      <label className="care-choice-label">
                        {t("careForm.shift")} <span className="optional-label">({t("common.optional")})</span>
                      </label>
                      <div className="care-choice-grid care-shift-grid">
                        {shiftList.map((item) => {
                          const isSelected = formData.shift === item.raw;
                          return (
                            <label
                              className={`care-choice-card ${isSelected ? "selected" : ""}`}
                              key={item.raw}
                              onClick={(e) => {
                                if (isSelected) {
                                  e.preventDefault();
                                  setFormData((prev) => ({ ...prev, shift: "", shiftOther: "" }));
                                }
                              }}
                            >
                              <input
                                type="radio"
                                name="shift"
                                value={item.raw}
                                checked={isSelected}
                                onChange={handleChange}
                              />
                              <span className="care-choice-radio" />
                              <span>{t(item.labelKey)}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {currentService.showShift && formData.shift === "Other" && (
                    <div className="care-field care-shift-other-field">
                      <label>{t("careForm.enterPreferredShift")} <span className="optional-label">({t("common.optional")})</span></label>
                      <input
                        type="text"
                        name="shiftOther"
                        value={formData.shiftOther}
                        onChange={handleChange}
                        placeholder={t("careForm.shiftPlaceholder")}
                      />
                    </div>
                  )}

                  {currentService.showPreferredTime && (
                    <div className="care-field care-shift-other-field">
                      <label>{t("careForm.preferredTime")} <span className="optional-label">({t("common.optional")})</span></label>
                      <input
                        type="time"
                        name="preferredTime"
                        value={formData.preferredTime || ""}
                        onChange={handleChange}
                        placeholder={t("careForm.preferredTime")}
                      />
                    </div>
                  )}
                </>
              )}

              <div className="care-form-divider" />

              <div className="care-form-section-heading">
                <p className="care-section-label">{t("careForm.serviceAddressSection")}</p>
                <h3>{t("careForm.whereProvided")}</h3>
                <p>{t("careForm.addressNote")}</p>
              </div>

              <div className="care-address-grid">
                <div className="care-field">
                  <label>{t("careForm.blockNumber")}</label>
                  <input
                    type="text"
                    name="flatNo"
                    value={formData.address.flatNo}
                    onChange={handleAddressChange}
                    placeholder={t("careForm.blockPlaceholder")}
                    required
                  />
                </div>

                <div className="care-field">
                  <label>{t("careForm.buildingNo")}</label>
                  <input
                    type="text"
                    name="buildingNo"
                    value={formData.address.buildingNo}
                    onChange={handleAddressChange}
                    placeholder={t("careForm.buildingPlaceholder")}
                    required
                  />
                </div>

                <div className="care-field">
                  <label>{t("careForm.area")}</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.address.area}
                    onChange={handleAddressChange}
                    placeholder={t("careForm.areaPlaceholder")}
                    required
                  />
                </div>

                <div className="care-field">
                  <label>{t("careForm.governorate")}</label>
                  <select
                    name="governorate"
                    value={formData.address.governorate}
                    onChange={handleAddressChange}
                  >
                    <option value="">{t("careForm.selectGovernorate")}</option>
                    {governorateList.map((item) => (
                      <option key={item.raw} value={item.raw}>
                        {t(item.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="care-address-note">
                <span>✓</span>
                <p>{t("careForm.serviceBahrain")}</p>
              </div>

              {submitError && (
                <div
                  role="alert"
                  style={{
                    marginBottom: "16px",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "#FFF0F7",
                    border: "1px solid #FF3A94",
                    color: "#252525",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {submitError}
                </div>
              )}

              <div className="care-submit-area">
                <div>
                  <strong>{t("careForm.readyToSubmit")}</strong>
                  <span>{t("careForm.requestTracking")}</span>
                </div>
                <button type="submit" className="care-primary-btn" disabled={submitting}>
                  {submitting ? t("careForm.submittingRequest") : <>{t("careForm.submitRequest")} <span>→</span></>}
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

export default CareForm;
