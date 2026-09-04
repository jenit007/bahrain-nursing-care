import { useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [requests, setRequests] = useState([
    {
      id: "REQ-001",
      name: "John",
      service: "Patient Care",
      condition: "Wheelchair",
      shift: "12 Hours",
      status: "Pending Verification",
    },
    {
      id: "REQ-002",
      name: "Mary",
      service: "Elder Care",
      condition: "Bedridden",
      shift: "24 Hours",
      status: "Verified",
    },
    {
      id: "REQ-003",
      name: "Sara",
      service: "Newborn Baby Care",
      condition: "Premature Baby",
      shift: "12 Hours",
      status: "Staff Appointed",
    },
    {
      id: "REQ-004",
      name: "Adam",
      service: "Children's Care",
      condition: "Normal",
      shift: "24 Hours",
      status: "Pending Verification",
    },
  ]);

  const handleVerify = (id) => {
    setRequests((previousRequests) =>
      previousRequests.map((request) =>
        request.id === id
          ? {
              ...request,
              status: "Verified",
            }
          : request
      )
    );
  };

  const handleAppoint = (id) => {
    setRequests((previousRequests) =>
      previousRequests.map((request) =>
        request.id === id
          ? {
              ...request,
              status: "Staff Appointed",
            }
          : request
      )
    );
  };

  const pendingCount = requests.filter(
    (request) => request.status === "Pending Verification"
  ).length;

  const verifiedCount = requests.filter(
    (request) => request.status === "Verified"
  ).length;

  const appointedCount = requests.filter(
    (request) => request.status === "Staff Appointed"
  ).length;

  return (
    <div className="admin-page">

      <header className="admin-header">

        <div className="admin-logo">

          <span>✚</span>

          <div>
            <h1>Bahrain Nursing Care</h1>
            <p>Admin Panel</p>
          </div>

        </div>

        <div className="admin-user">
          <span>◉</span>
          <span>Admin</span>
        </div>

      </header>

      <main className="admin-main">

        <div className="admin-heading">

          <div>
            <h2>Admin Dashboard</h2>
            <p>
              Manage nursing care service requests
            </p>
          </div>

        </div>

        <div className="admin-stats">

          <div className="stat-card">
            <span className="stat-number">
              {requests.length}
            </span>

            <span className="stat-label">
              Total Requests
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-number">
              {pendingCount}
            </span>

            <span className="stat-label">
              Pending Verification
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-number">
              {verifiedCount}
            </span>

            <span className="stat-label">
              Verified
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-number">
              {appointedCount}
            </span>

            <span className="stat-label">
              Staff Appointed
            </span>
          </div>

        </div>

        <section className="requests-section">

          <div className="requests-header">
            <h3>Service Requests</h3>

            <span>
              {requests.length} Requests
            </span>
          </div>

          <div className="requests-list">

            {requests.map((request) => (

              <div
                className="request-card"
                key={request.id}
              >

                <div className="request-info">

                  <div className="request-top">

                    <span className="request-id">
                      {request.id}
                    </span>

                    <span
                      className={`status-badge ${request.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {request.status}
                    </span>

                  </div>

                  <h4>
                    {request.name}
                  </h4>

                  <p className="request-service">
                    {request.service}
                  </p>

                  <div className="request-details">

                    <span>
                      {request.condition}
                    </span>

                    <span>
                      {request.shift}
                    </span>

                  </div>

                </div>

                <div className="request-actions">

                  {request.status === "Pending Verification" && (
                    <button
                      className="verify-button"
                      onClick={() =>
                        handleVerify(request.id)
                      }
                    >
                      Verify
                    </button>
                  )}

                  {request.status === "Verified" && (
                    <button
                      className="appoint-button"
                      onClick={() =>
                        handleAppoint(request.id)
                      }
                    >
                      Appoint Staff
                    </button>
                  )}

                  {request.status === "Staff Appointed" && (
                    <span className="completed-label">
                      Completed
                    </span>
                  )}

                </div>

              </div>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;
