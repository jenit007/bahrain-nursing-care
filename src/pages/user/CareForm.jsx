import {
  useCallback,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import LocationPicker from "../../components/LocationPicker";

import {
  addRequest,
} from "../../utils/requestStorage";

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

  const { service } =
    useParams();

  const navigate =
    useNavigate();

  const currentService =
    careData[service];


  const [
    formData,
    setFormData,
  ] = useState({

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
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >

        <h2>
          Service Not Found
        </h2>

        <button
          onClick={() =>
            navigate("/services")
          }
        >
          Back to Services
        </button>

      </div>
    );
  }


  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };


  const handleLocationChange =
    useCallback((location) => {

      setFormData(
        (previous) => ({
          ...previous,

          address:
            location.address,

          latitude:
            location.latitude,

          longitude:
            location.longitude,
        })
      );

    }, []);


  const handleSubmit = (e) => {

    e.preventDefault();


    addRequest({

      service:
        currentService.title,

      name:
        formData.name,

      cpr:
        formData.cpr,

      phone:
        formData.phone,

      alternativePhone:
        formData.alternativePhone,

      email:
        formData.email,

      condition:
        formData.condition,

      shift:
        formData.shift,

      address:
        formData.address,

      latitude:
        formData.latitude,

      longitude:
        formData.longitude,
    });


    navigate(
      "/request-status"
    );
  };


  return (

    <div className="care-form-page">

      <header className="care-form-header">

        <div
          className="care-form-logo"
          onClick={() =>
            navigate("/services")
          }
        >

          <span>
            ✚
          </span>

          <div>
            <h1>
              Bahrain Nursing Care
            </h1>

            <p>
              Professional Home Care Services
            </p>
          </div>

        </div>


        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate("/services")
          }
        >
          ← Back to Services
        </button>

      </header>


      <main className="care-form-main">

        <div className="care-form-heading">

          <h2>
            {currentService.title}
          </h2>

          <p>
            Please enter the required
            information
          </p>

        </div>


        <form
          className="care-form-card"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>
              {currentService.nameLabel}
            </label>

            <input
              type="text"
              name="name"
              placeholder={
                `Enter ${
                  currentService
                    .nameLabel
                    .toLowerCase()
                }`
              }
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>
              CPR
            </label>

            <input
              type="text"
              name="cpr"
              placeholder="Enter CPR number"
              value={formData.cpr}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>
              Alternative Phone Number
            </label>

            <input
              type="tel"
              name="alternativePhone"
              placeholder="Enter alternative phone number"
              value={
                formData.alternativePhone
              }
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <LocationPicker
              onLocationChange={
                handleLocationChange
              }
            />

          </div>


          <div className="form-group">

            <label>
              Condition
            </label>

            <div className="radio-group">

              {currentService.conditions.map(
                (condition) => (

                  <label
                    className="radio-option"
                    key={condition}
                  >

                    <input
                      type="radio"
                      name="condition"
                      value={condition}
                      checked={
                        formData.condition ===
                        condition
                      }
                      onChange={handleChange}
                      required
                    />

                    <span>
                      {condition}
                    </span>

                  </label>
                )
              )}

            </div>

          </div>


          <div className="form-group">

            <label>
              Shift
            </label>

            <div className="radio-group">

              {[
                "12h",
                "24h",
                "Other",
              ].map((shift) => (

                <label
                  className="radio-option"
                  key={shift}
                >

                  <input
                    type="radio"
                    name="shift"
                    value={shift}
                    checked={
                      formData.shift ===
                      shift
                    }
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
            Submit Care Request
          </button>

        </form>

      </main>

    </div>
  );
}


export default CareForm;