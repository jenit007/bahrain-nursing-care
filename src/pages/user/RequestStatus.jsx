import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RequestStatus.css";

function RequestStatus() {
  const navigate = useNavigate();

  const [status] = useState("verification");

  const steps = [
    {
      id: "submitted",
      title: "Request Submitted",
      description: "Your care service request has been submitted.",
    },
    {
      id: "verification",
      title: "Under Verification",
      description: "Our admin team is reviewing your request.",
    },
    {
      id: "verified",
      title: "Verified",
      description: "Your request has been verified.",
    },
    {
      id: "appointed",
      title: "Staff Appointed",
      description: "A suitable staff member has been appointed.",
    },
  ];

  const statusOrder = [
    "submitted",
    "verification",
    "verified",
    "appointed",
  ];

  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="status-page">

      <header className="status-header">

        <div className="status-logo">
          <span>✚</span>

          <div>
            <h1>Bahrain Nursing Care</h1>
            <p>Professional Home Care Services</p>
          </div>
        </div>

        <button
          className="status-services-button"
          onClick={() => navigate("/services")}
        >
          Services
        </button>

      </header>

      <main className="status-main">

        <div className="status-heading">

          <div className="success-icon">
            ✓
          </div>

          <h2>Request Submitted</h2>

          <p>
            Your nursing care request has been received successfully.
          </p>

        </div>

        <div className="status-card">

          <div className="tracker">

            {steps.map((step, index) => {

              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div
                  className={`tracker-step ${
                    isCompleted ? "completed" : ""
                  } ${isCurrent ? "current" : ""}`}
                  key={step.id}
                >

                  <div className="tracker-marker">
                    {isCompleted ? "✓" : index + 1}
                  </div>

                  <div className="tracker-content">

                    <h3>
                      {step.title}
                    </h3>

                    <p>
                      {step.description}
                    </p>

                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`tracker-line ${
                        index < currentIndex
                          ? "completed-line"
                          : ""
                      }`}
                    />
                  )}

                </div>
              );
            })}

          </div>

        </div>

        <button
          className="back-services-button"
          onClick={() => navigate("/services")}
        >
          Back to Services
        </button>

      </main>

    </div>
  );
}

export default RequestStatus;