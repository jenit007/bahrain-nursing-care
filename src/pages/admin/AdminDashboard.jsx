import { useEffect, useState } from "react";
import {
  getRequests,
  updateRequestStatus,
  requestFeedback,
} from "../../utils/requestStorage";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Load all requests
  const loadRequests = () => {
    const storedRequests = getRequests();
    setRequests(storedRequests);

    // Keep opened modal synchronized
    if (selectedRequest) {
      const updatedSelectedRequest = storedRequests.find(
        (request) => request.id === selectedRequest.id
      );

      if (updatedSelectedRequest) {
        setSelectedRequest(updatedSelectedRequest);
      }
    }
  };

  useEffect(() => {
    loadRequests();

    // Sync between browser tabs/windows
    const handleStorageChange = () => {
      loadRequests();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    // Check for updates periodically
    const interval = setInterval(() => {
      loadRequests();
    }, 1000);

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      clearInterval(interval);
    };
  }, [selectedRequest]);

  // Verify request
  const handleVerify = (requestId) => {
    updateRequestStatus(
      requestId,
      "Verified"
    );

    const updatedRequests = getRequests();
    setRequests(updatedRequests);

    const updatedRequest = updatedRequests.find(
      (request) => request.id === requestId
    );

    if (updatedRequest) {
      setSelectedRequest(updatedRequest);
    }
  };

  // Appoint staff
  const handleAppointStaff = (requestId) => {
    updateRequestStatus(
      requestId,
      "Staff Appointed"
    );

    const updatedRequests = getRequests();
    setRequests(updatedRequests);

    const updatedRequest = updatedRequests.find(
      (request) => request.id === requestId
    );

    if (updatedRequest) {
      setSelectedRequest(updatedRequest);
    }
  };

  // Mark completed
  const handleComplete = (requestId) => {
    updateRequestStatus(
      requestId,
      "Completed"
    );

    const updatedRequests = getRequests();
    setRequests(updatedRequests);

    const updatedRequest = updatedRequests.find(
      (request) => request.id === requestId
    );

    if (updatedRequest) {
      setSelectedRequest(updatedRequest);
    }
  };

  // Request feedback
  const handleRequestFeedback = (requestId) => {
    requestFeedback(requestId);

    const updatedRequests = getRequests();
    setRequests(updatedRequests);

    const updatedRequest = updatedRequests.find(
      (request) => request.id === requestId
    );

    if (updatedRequest) {
      setSelectedRequest(updatedRequest);
    }

    alert(
      "Feedback request sent to the user."
    );
  };

  // Open booking details
  const handleViewDetails = (request) => {
    setSelectedRequest(request);
  };

  // Close modal
  const handleCloseDetails = () => {
    setSelectedRequest(null);
  };

  // Statistics
  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (request) =>
      request.status === "Pending Verification"
  ).length;

  const verifiedRequests = requests.filter(
    (request) =>
      request.status === "Verified"
  ).length;

  const appointedRequests = requests.filter(
    (request) =>
      request.status === "Staff Appointed"
  ).length;

  const completedRequests = requests.filter(
    (request) =>
      request.status === "Completed"
  ).length;

  const feedbackPending = requests.filter(
    (request) =>
      request.feedbackRequested &&
      !request.feedbackSubmitted
  ).length;

  const feedbackReceived = requests.filter(
    (request) =>
      request.feedbackSubmitted
  ).length;

  return (
    <div className="admin-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="admin-header">

        <div className="admin-brand">

          <div className="admin-logo">
            ✚
          </div>

          <div>
            <h1>
              Bahrain Nursing Care
            </h1>

            <p>
              Professional Home Care Services
            </p>
          </div>

        </div>

        <div className="admin-user">

          <span className="admin-user-icon">
            ◉
          </span>

          <span>
            Admin
          </span>

        </div>

      </header>


      {/* =====================================
          MAIN
      ===================================== */}

      <main className="admin-main">

        {/* Heading */}

        <div className="admin-heading">

          <div>
            <h2>
              Admin Dashboard
            </h2>

            <p>
              Manage care requests and customer feedback
            </p>
          </div>

        </div>


        {/* =====================================
            STATISTICS
        ===================================== */}

        <div className="admin-stats">

          <div className="stat-card">

            <div className="stat-icon">
              ▣
            </div>

            <div className="stat-content">
              <span>
                Total Requests
              </span>

              <strong>
                {totalRequests}
              </strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ⏳
            </div>

            <div className="stat-content">
              <span>
                Pending Verification
              </span>

              <strong>
                {pendingRequests}
              </strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ✓
            </div>

            <div className="stat-content">
              <span>
                Verified
              </span>

              <strong>
                {verifiedRequests}
              </strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ♟
            </div>

            <div className="stat-content">
              <span>
                Staff Appointed
              </span>

              <strong>
                {appointedRequests}
              </strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ✓
            </div>

            <div className="stat-content">
              <span>
                Completed
              </span>

              <strong>
                {completedRequests}
              </strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ★
            </div>

            <div className="stat-content">
              <span>
                Feedback Received
              </span>

              <strong>
                {feedbackReceived}
              </strong>
            </div>

          </div>

        </div>


        {/* =====================================
            REQUESTS
        ===================================== */}

        <section className="requests-section">

          <div className="section-heading">

            <div>
              <h2>
                Care Requests
              </h2>

              <p>
                View, verify and manage customer requests
              </p>
            </div>

            <div className="request-count">
              {totalRequests} Request
              {totalRequests !== 1 ? "s" : ""}
            </div>

          </div>


          {requests.length === 0 ? (

            <div className="no-requests">

              <div className="no-requests-icon">
                ▣
              </div>

              <h3>
                No Requests Found
              </h3>

              <p>
                No care requests have been submitted yet.
              </p>

            </div>

          ) : (

            <div className="requests-table-container">

              <table className="requests-table">

                <thead>

                  <tr>

                    <th>
                      Request ID
                    </th>

                    <th>
                      Service
                    </th>

                    <th>
                      Name
                    </th>

                    <th>
                      Phone
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Feedback
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {requests
                    .slice()
                    .reverse()
                    .map((request) => (

                      <tr key={request.id}>

                        <td>
                          <strong>
                            {request.id}
                          </strong>
                        </td>

                        <td>
                          {request.service}
                        </td>

                        <td>
                          {request.name}
                        </td>

                        <td>
                          {request.phone}
                        </td>

                        <td>

                          <span
                            className={`status-badge ${request.status
                              ?.toLowerCase()
                              .replace(
                                / /g,
                                "-"
                              )}`}
                          >
                            {request.status}
                          </span>

                        </td>


                        <td>

                          {request.feedbackSubmitted ? (

                            <span className="feedback-received">
                              ✓ Received
                            </span>

                          ) : request.feedbackRequested ? (

                            <span className="feedback-waiting">
                              Waiting
                            </span>

                          ) : (

                            <span className="feedback-not-requested">
                              Not Requested
                            </span>

                          )}

                        </td>


                        <td>

                          <div className="request-actions">

                            <button
                              className="view-btn"
                              onClick={() =>
                                handleViewDetails(
                                  request
                                )
                              }
                            >
                              View Details
                            </button>


                            {request.status ===
                              "Pending Verification" && (

                              <button
                                className="verify-btn"
                                onClick={() =>
                                  handleVerify(
                                    request.id
                                  )
                                }
                              >
                                Verify
                              </button>

                            )}


                            {request.status ===
                              "Verified" && (

                              <button
                                className="appoint-btn"
                                onClick={() =>
                                  handleAppointStaff(
                                    request.id
                                  )
                                }
                              >
                                Appoint Staff
                              </button>

                            )}


                            {request.status ===
                              "Staff Appointed" && (

                              <button
                                className="complete-btn"
                                onClick={() =>
                                  handleComplete(
                                    request.id
                                  )
                                }
                              >
                                Completed
                              </button>

                            )}


                            {!request.feedbackSubmitted && (

                              <button
                                className="feedback-request-btn"
                                onClick={() =>
                                  handleRequestFeedback(
                                    request.id
                                  )
                                }
                                disabled={
                                  request.feedbackRequested
                                }
                              >
                                {request.feedbackRequested
                                  ? "Feedback Requested"
                                  : "Request Feedback"}
                              </button>

                            )}

                          </div>

                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>


      {/* =====================================
          BOOKING DETAILS MODAL
      ===================================== */}

      {selectedRequest && (

        <div
          className="modal-overlay"
          onClick={handleCloseDetails}
        >

          <div
            className="details-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="modal-header">

              <div>

                <h2>
                  Booking Details
                </h2>

                <p>
                  {selectedRequest.id}
                </p>

              </div>

              <button
                className="close-modal-btn"
                onClick={handleCloseDetails}
              >
                ×
              </button>

            </div>


            {/* =====================================
                REQUEST INFORMATION
            ===================================== */}

            <div className="details-section">

              <h3>
                Request Information
              </h3>

              <div className="details-grid">

                <div className="detail-item">
                  <label>
                    Request ID
                  </label>

                  <span>
                    {selectedRequest.id}
                  </span>
                </div>


                <div className="detail-item">
                  <label>
                    Service
                  </label>

                  <span>
                    {selectedRequest.service}
                  </span>
                </div>


                <div className="detail-item">
                  <label>
                    Status
                  </label>

                  <span
                    className={`status-badge ${selectedRequest.status
                      ?.toLowerCase()
                      .replace(
                        / /g,
                        "-"
                      )}`}
                  >
                    {selectedRequest.status}
                  </span>
                </div>


                <div className="detail-item">
                  <label>
                    Submitted
                  </label>

                  <span>
                    {selectedRequest.createdAt
                      ? new Date(
                          selectedRequest.createdAt
                        ).toLocaleString()
                      : "N/A"}
                  </span>
                </div>

              </div>

            </div>


            {/* =====================================
                PERSONAL DETAILS
            ===================================== */}

            <div className="details-section">

              <h3>
                Personal Details
              </h3>

              <div className="details-grid">

                <div className="detail-item">
                  <label>
                    Name
                  </label>

                  <span>
                    {selectedRequest.name ||
                      "N/A"}
                  </span>
                </div>


                <div className="detail-item">
                  <label>
                    CPR
                  </label>

                  <span>
                    {selectedRequest.cpr ||
                      "N/A"}
                  </span>
                </div>


                <div className="detail-item">
                  <label>
                    Phone Number
                  </label>

                  <span>
                    {selectedRequest.phone ||
                      "N/A"}
                  </span>
                </div>


                <div className="detail-item">
                  <label>
                    Alternative Phone
                  </label>

                  <span>
                    {selectedRequest.alternativePhone ||
                      "N/A"}
                  </span>
                </div>


                <div className="detail-item">
                  <label>
                    Email
                  </label>

                  <span>
                    {selectedRequest.email ||
                      "N/A"}
                  </span>
                </div>


                <div className="detail-item">
                  <label>
                    Condition
                  </label>

                  <span>
                    {selectedRequest.condition ||
                      "N/A"}
                  </span>
                </div>


                <div className="detail-item">
                  <label>
                    Shift
                  </label>

                  <span>
                    {selectedRequest.shift ||
                      "N/A"}
                  </span>
                </div>

              </div>

            </div>


            {/* =====================================
                BAHRAIN ADDRESS
            ===================================== */}

            <div className="details-section">

              <h3>
                Bahrain Address
              </h3>

              <div className="details-grid">

                <div className="detail-item">
                  <label>
                    Flat / Villa / Unit
                  </label>

                  <span>
                    {selectedRequest.address
                      ?.flatVilla ||
                      "Not provided"}
                  </span>
                </div>


                <div className="detail-item">
                  <label>
                    Building Number
                  </label>

                  <span>
                    {selectedRequest.address
                      ?.buildingNumber ||
                      "N/A"}
                  </span>
                </div>


                <div className="detail-item">
                  <label>
                    Road Number
                  </label>

                  <span>
                    {selectedRequest.address
                      ?.roadNumber ||
                      "N/A"}
                  </span>
                </div>


                <div className="detail-item">
                  <label>
                    Block Number
                  </label>

                  <span>
                    {selectedRequest.address
                      ?.blockNumber ||
                      "N/A"}
                  </span>
                </div>


                <div className="detail-item">
                  <label>
                    Area / Town
                  </label>

                  <span>
                    {selectedRequest.address
                      ?.area ||
                      "N/A"}
                  </span>
                </div>


                <div className="detail-item">
                  <label>
                    Governorate
                  </label>

                  <span>
                    {selectedRequest.address
                      ?.governorate ||
                      "N/A"}
                  </span>
                </div>


                <div className="detail-item">
                  <label>
                    P.O. Box
                  </label>

                  <span>
                    {selectedRequest.address
                      ?.poBox ||
                      "Not provided"}
                  </span>
                </div>


                <div className="detail-item">
                  <label>
                    Country
                  </label>

                  <span>
                    Bahrain
                  </span>
                </div>

              </div>

            </div>


            {/* =====================================
                GPS LOCATION
            ===================================== */}

            <div className="details-section">

              <h3>
                GPS Location
              </h3>

              {selectedRequest.latitude &&
              selectedRequest.longitude ? (

                <div className="gps-details">

                  <div className="details-grid">

                    <div className="detail-item">
                      <label>
                        Latitude
                      </label>

                      <span>
                        {selectedRequest.latitude}
                      </span>
                    </div>


                    <div className="detail-item">
                      <label>
                        Longitude
                      </label>

                      <span>
                        {selectedRequest.longitude}
                      </span>
                    </div>

                  </div>


                  <a
                    href={`https://www.openstreetmap.org/?mlat=${selectedRequest.latitude}&mlon=${selectedRequest.longitude}#map=18/${selectedRequest.latitude}/${selectedRequest.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-link"
                  >
                    View Exact Location on Map
                  </a>

                </div>

              ) : (

                <p className="no-location">
                  GPS location was not provided.
                </p>

              )}

            </div>


            {/* =====================================
                CUSTOMER FEEDBACK
            ===================================== */}

            {selectedRequest.feedbackRequested && (

              <div className="details-section">

                <h3>
                  Customer Feedback
                </h3>


                {!selectedRequest.feedbackSubmitted ? (

                  <div className="feedback-pending">

                    <strong>
                      Feedback Requested
                    </strong>

                    <p>
                      Feedback has been requested
                      from the user. Waiting for the
                      user to submit their response.
                    </p>

                  </div>

                ) : (

                  <div className="feedback-result">

                    {/* Overall rating */}

                    <div className="feedback-rating">

                      <strong>
                        Overall Rating:
                      </strong>

                      <span>
                        {"★".repeat(
                          selectedRequest.feedback
                            ?.rating || 0
                        )}

                        {"☆".repeat(
                          5 -
                            (
                              selectedRequest
                                .feedback
                                ?.rating || 0
                            )
                        )}
                      </span>

                      <strong>
                        {selectedRequest.feedback
                          ?.rating || 0}/5
                      </strong>

                    </div>


                    {/* Service-specific answers */}

                    {selectedRequest.feedback
                      ?.answers && (

                      <div className="feedback-answers">

                        <h4>
                          Service Feedback
                        </h4>

                        {Object.entries(
                          selectedRequest.feedback
                            .answers
                        ).map(
                          ([question, answer]) => (

                            <div
                              className="feedback-answer"
                              key={question}
                            >

                              <span>
                                {question}
                              </span>

                              <strong>
                                {answer}/5
                              </strong>

                            </div>

                          )
                        )}

                      </div>

                    )}


                    {/* Comments */}

                    <div className="feedback-comments">

                      <strong>
                        Comments:
                      </strong>

                      <p>
                        {selectedRequest.feedback
                          ?.comment ||
                          "No additional comments provided."}
                      </p>

                    </div>


                    {/* Submitted date */}

                    {selectedRequest.feedback
                      ?.submittedAt && (

                      <div className="feedback-date">

                        Submitted:

                        {" "}

                        {new Date(
                          selectedRequest.feedback
                            .submittedAt
                        ).toLocaleString()}

                      </div>

                    )}

                  </div>

                )}

              </div>

            )}


            {/* =====================================
                MODAL ACTIONS
            ===================================== */}

            <div className="modal-actions">

              {selectedRequest.status ===
                "Pending Verification" && (

                <button
                  className="verify-btn"
                  onClick={() =>
                    handleVerify(
                      selectedRequest.id
                    )
                  }
                >
                  Verify Request
                </button>

              )}


              {selectedRequest.status ===
                "Verified" && (

                <button
                  className="appoint-btn"
                  onClick={() =>
                    handleAppointStaff(
                      selectedRequest.id
                    )
                  }
                >
                  Appoint Staff
                </button>

              )}


              {selectedRequest.status ===
                "Staff Appointed" && (

                <button
                  className="complete-btn"
                  onClick={() =>
                    handleComplete(
                      selectedRequest.id
                    )
                  }
                >
                  Mark Completed
                </button>

              )}


              {!selectedRequest.feedbackSubmitted && (

                <button
                  className="feedback-request-btn"
                  onClick={() =>
                    handleRequestFeedback(
                      selectedRequest.id
                    )
                  }
                  disabled={
                    selectedRequest.feedbackRequested
                  }
                >
                  {selectedRequest.feedbackRequested
                    ? "Feedback Requested"
                    : "Request Feedback"}
                </button>

              )}


              <button
                className="close-btn"
                onClick={handleCloseDetails}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminDashboard;