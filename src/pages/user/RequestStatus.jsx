import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLatestRequest,
  getRequests,
} from "../../utils/requestStorage";
import "./RequestStatus.css";

function RequestStatus() {
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);

  // Load the latest request
  const loadRequest = () => {
    const latestRequest = getLatestRequest();
    setRequest(latestRequest);
  };

  useEffect(() => {
    loadRequest();

    // Sync when localStorage changes
    const handleStorageChange = () => {
      loadRequest();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    // Keep checking for Admin updates
    const interval = setInterval(() => {
      const requests = getRequests();

      if (requests.length > 0) {
        const latestRequest =
          requests[requests.length - 1];

        setRequest(latestRequest);
      }
    }, 1000);

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      clearInterval(interval);
    };
  }, []);

  // Open feedback page
  const handleFeedback = () => {
    if (!request) {
      return;
    }

    navigate("/feedback", {
      state: {
        request,
      },
    });
  };

  // No request
  if (!request) {
    return (
      <div className="request-status-page">

        <div className="status-header">

          <div className="status-logo">
            <span>✚</span>

            <div>
              <h1>
                Bahrain Nursing Care
              </h1>

              <p>
                Professional Home Care Services
              </p>
            </div>
          </div>

        </div>

        <main className="status-main">

          <div className="no-request-card">

            <div className="no-request-icon">
              ▣
            </div>

            <h2>
              No Request Found
            </h2>

            <p>
              You have not submitted a care
              request yet.
            </p>

            <button
              onClick={() =>
                navigate("/services")
              }
            >
              Choose a Service
            </button>

          </div>

        </main>

      </div>
    );
  }

  // Determine tracker progress
  const getStatusIndex = () => {
    switch (request.status) {
      case "Pending Verification":
        return 1;

      case "Verified":
        return 2;

      case "Staff Appointed":
        return 3;

      case "Completed":
        return 4;

      default:
        return 1;
    }
  };

  const currentStatusIndex =
    getStatusIndex();

  const trackingSteps = [
    {
      number: 1,
      title: "Request Submitted",
      description:
        "Your care request has been submitted.",
    },
    {
      number: 2,
      title: "Under Verification",
      description:
        "Our admin team is reviewing your request.",
    },
    {
      number: 3,
      title: "Verified",
      description:
        "Your request has been verified.",
    },
    {
      number: 4,
      title: "Staff Appointed",
      description:
        "A care staff member has been appointed.",
    },
  ];

  return (
    <div className="request-status-page">

      {/* Header */}
      <header className="status-header">

        <div className="status-logo">

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

        <div className="status-user">
          <span>
            ◉
          </span>

          <span>
            User
          </span>
        </div>

      </header>

      {/* Main */}
      <main className="status-main">

        {/* Heading */}
        <div className="status-heading">

          <h2>
            Request Tracking
          </h2>

          <p>
            Track the progress of your care request
          </p>

        </div>

        {/* Request Information */}
        <div className="request-info-card">

          <div className="request-info-header">

            <div>

              <span className="request-label">
                Request ID
              </span>

              <h3>
                {request.id}
              </h3>

            </div>

            <span
              className={`request-status-badge ${request.status
                ?.toLowerCase()
                .replace(
                  / /g,
                  "-"
                )}`}
            >
              {request.status}
            </span>

          </div>

          <div className="request-info-grid">

            <div>
              <span>
                Service
              </span>

              <strong>
                {request.service}
              </strong>
            </div>

            <div>
              <span>
                Name
              </span>

              <strong>
                {request.name}
              </strong>
            </div>

            <div>
              <span>
                Shift
              </span>

              <strong>
                {request.shift}
              </strong>
            </div>

            <div>
              <span>
                Submitted
              </span>

              <strong>
                {request.createdAt
                  ? new Date(
                      request.createdAt
                    ).toLocaleString()
                  : "N/A"}
              </strong>
            </div>

          </div>

        </div>

        {/* Tracking */}
        <div className="tracking-card">

          <div className="tracking-title">

            <h2>
              Request Status
            </h2>

            <p>
              Your request progress
            </p>

          </div>

          <div className="tracking">

            {trackingSteps.map(
              (step, index) => {

                const isCompleted =
                  currentStatusIndex >=
                  step.number;

                const isCurrent =
                  currentStatusIndex ===
                  step.number;

                return (
                  <div
                    className={`tracking-step ${
                      isCompleted
                        ? "completed"
                        : ""
                    } ${
                      isCurrent
                        ? "current"
                        : ""
                    }`}
                    key={step.number}
                  >

                    <div className="tracking-marker">

                      {isCompleted
                        ? "✓"
                        : step.number}

                    </div>

                    <div className="tracking-content">

                      <h3>
                        {step.title}
                      </h3>

                      <p>
                        {step.description}
                      </p>

                    </div>

                    {index <
                      trackingSteps.length -
                        1 && (
                      <div
                        className={`tracking-line ${
                          currentStatusIndex >
                          step.number
                            ? "completed"
                            : ""
                        }`}
                      />
                    )}

                  </div>
                );
              }
            )}

          </div>

        </div>

        {/* Feedback Request */}
        {request.feedbackRequested &&
          !request.feedbackSubmitted && (

            <div className="feedback-request-card">

              <div className="feedback-request-icon">
                ★
              </div>

              <div className="feedback-request-content">

                <h2>
                  We'd Love Your Feedback
                </h2>

                <p>
                  We would like to know about
                  your experience with our{" "}
                  <strong>
                    {request.service}
                  </strong>{" "}
                  service.
                </p>

                <button
                  className="give-feedback-btn"
                  onClick={handleFeedback}
                >
                  Give Feedback
                </button>

              </div>

            </div>

          )}

        {/* Feedback Submitted */}
        {request.feedbackSubmitted && (

          <div className="feedback-submitted-card">

            <div className="feedback-success-icon">
              ✓
            </div>

            <div>

              <h2>
                Feedback Submitted
              </h2>

              <p>
                Thank you for sharing your
                experience with Bahrain Nursing
                Care.
              </p>

              {request.feedback?.rating && (

                <div className="submitted-rating">

                  Your Rating:

                  <span>
                    {"★".repeat(
                      request.feedback.rating
                    )}

                    {"☆".repeat(
                      5 -
                        request.feedback.rating
                    )}
                  </span>

                  <strong>
                    {request.feedback.rating}/5
                  </strong>

                </div>

              )}

            </div>

          </div>

        )}

        {/* Waiting message */}
        {!request.feedbackRequested &&
          request.status === "Completed" && (

            <div className="feedback-waiting-card">

              <div className="feedback-waiting-icon">
                ★
              </div>

              <div>

                <h3>
                  Service Completed
                </h3>

                <p>
                  Thank you for choosing Bahrain
                  Nursing Care. You may receive a
                  feedback request from our admin.
                </p>

              </div>

            </div>

          )}

        {/* Back to services */}
        <div className="status-footer-actions">

          <button
            className="back-services-btn"
            onClick={() =>
              navigate("/services")
            }
          >
            Back to Services
          </button>

        </div>

      </main>

    </div>
  );
}

export default RequestStatus;