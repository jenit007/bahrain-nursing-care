import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CareForm.css";

const careData = {
  patient: {
    title: "Patient Care",
    nameLabel: "Patient Name",
    conditions: [
      "Normal",
      "Wheelchair",
      "Bedridden",
      "Ventilator",
      "Other",
    ],
  },

  elder: {
    title: "Elder Care",
    nameLabel: "Name",
    conditions: [
      "Normal",
      "Wheelchair",
      "Bedridden",
      "Other",
    ],
  },

  newborn: {
    title: "Newborn Baby Care",
    nameLabel: "Name",
    conditions: [
      "Normal",
      "Premature Baby",
      "Disable",
      "Abnormal",
    ],
  },

  children: {
    title: "Children's Care",
    nameLabel: "Name",
    conditions: [
      "Normal",
      "Disable",
      "Abnormal",
    ],
  },
};

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
  });

  if (!currentService) {
    return (
      <div className="invalid-service">
        <h2>Service Not Found</h2>

        <button onClick={() => navigate("/services")}>
          Back to Services
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Service Request:", {
      service: currentService.title,
      ...formData,
    });

    navigate("/request-status");
  };

  return (
    <div className="care-form-page">

      <header className="care-form-header">

        <div className="care-form-logo">
          <span>✚</span>

          <div>
            <h1>Bahrain Nursing Care</h1>
            <p>Professional Home Care Services</p>
          </div>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/services")}
        >
          Back
        </button>

      </header>

      <main className="care-form-main">

        <div className="care-form-heading">
          <h2>{currentService.title}</h2>

          <p>
            Please enter the required information
          </p>
        </div>

        <form
          className="care-form-card"
          onSubmit={handleSubmit}
        >

          {/* Name */}

          <div className="form-group">

            <label htmlFor="name">
              {currentService.nameLabel}
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder={`Enter ${currentService.nameLabel.toLowerCase()}`}
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>

          {/* CPR */}

          <div className="form-group">

            <label htmlFor="cpr">
              CPR
            </label>

            <input
              id="cpr"
              name="cpr"
              type="text"
              placeholder="Enter CPR"
              value={formData.cpr}
              onChange={handleChange}
              required
            />

          </div>

          {/* Phone */}

          <div className="form-group">

            <label htmlFor="phone">
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

          </div>

          {/* Alternative Phone */}

          <div className="form-group">

            <label htmlFor="alternativePhone">
              Alternative Phone Number
            </label>

            <input
              id="alternativePhone"
              name="alternativePhone"
              type="tel"
              placeholder="Enter alternative phone number"
              value={formData.alternativePhone}
              onChange={handleChange}
              required
            />

          </div>

          {/* Email */}

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* Condition */}

          <div className="form-group">

            <label>
              Care Type
            </label>

            <div className="checkbox-group">

              {currentService.conditions.map((condition) => (
                <label
                  className="checkbox-option"
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

                  <span>
                    {condition}
                  </span>

                </label>
              ))}

            </div>

          </div>

          {/* Shift */}

          <div className="form-group">

            <label>
              Shift Time
            </label>

            <div className="shift-group">

              {["12 Hours", "24 Hours", "Other"].map((shift) => (
                <label
                  className="shift-option"
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

                  <span>
                    {shift}
                  </span>

                </label>
              ))}

            </div>

          </div>

          <button
            type="submit"
            className="submit-request-button"
          >
            Submit Request
          </button>

        </form>

      </main>

    </div>
  );
}

export default CareForm;