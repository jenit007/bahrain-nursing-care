import { useEffect, useState, useMemo } from "react";
import {
  getRequests,
  updateRequestStatus,
  assignStaffToRequest,
  deleteRequest,
  addRequest,
  getStaffRoster,
  addStaffMember,
  toggleStaffStatus,
  seedSampleDataIfEmpty,
  getJobApplications,
  updateJobApplicationStatus,
  hireJobApplicant,
  deleteJobApplication,
} from "../../utils/requestStorage";
import "./AdminDashboard.css";

function AdminDashboard() {
  // State management
  const [requests, setRequests] = useState([]);
  const [staffRoster, setStaffRoster] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("requests"); // 'requests' | 'jobs' | 'staff' | 'analytics' | 'settings'

  // Search & Filter state for Care Requests
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [urgencyFilter, setUrgencyFilter] = useState("ALL");

  // Search & Filter state for Job Applications
  const [jobSearchTerm, setJobSearchTerm] = useState("");
  const [jobPositionFilter, setJobPositionFilter] = useState("ALL");
  const [jobStatusFilter, setJobStatusFilter] = useState("ALL");

  // Dark/Light Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("admin_theme") || "dark";
  });

  // Modal states
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [assignModalReq, setAssignModalReq] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAddRequestModal, setShowAddRequestModal] = useState(false);
  const [deleteConfirmReq, setDeleteConfirmReq] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [printModalReq, setPrintModalReq] = useState(null);

  // Job Application Modal states
  const [selectedJobApp, setSelectedJobApp] = useState(null);
  const [hireConfirmApp, setHireConfirmApp] = useState(null);
  const [deleteConfirmJobApp, setDeleteConfirmJobApp] = useState(null);

  // Hire Form State
  const [hireForm, setHireForm] = useState({
    role: "Registered Nurse",
    specialization: "General Home Care",
  });

  // New staff form state
  const [newStaffForm, setNewStaffForm] = useState({
    name: "",
    role: "Registered Nurse",
    specialization: "General Home Care",
    phone: "",
    cpr: "",
    status: "Available",
  });

  // New request form state
  const [newReqForm, setNewReqForm] = useState({
    service: "Elder Care",
    name: "",
    email: "",
    phone: "",
    condition: "",
    shift: "Day Shift (8 AM - 4 PM)",
    preferredDate: new Date().toISOString().split("T")[0],
    notes: "",
    urgency: "Normal",
    flatNo: "",
    buildingNo: "",
    area: "Seef District",
    governorate: "Capital Governorate",
  });

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load all data
  const loadData = () => {
    const storedReqs = getRequests();
    const storedStaff = getStaffRoster();
    const storedJobs = getJobApplications();

    setRequests(storedReqs);
    setStaffRoster(storedStaff);
    setJobApplications(storedJobs);

    // Keep selected request synchronized
    if (selectedRequest) {
      const updated = storedReqs.find((r) => r.id === selectedRequest.id);
      if (updated) setSelectedRequest(updated);
    }

    // Keep selected job application synchronized
    if (selectedJobApp) {
      const updatedJob = storedJobs.find((j) => j.id === selectedJobApp.id);
      if (updatedJob) setSelectedJobApp(updatedJob);
    }
  };

  useEffect(() => {
    loadData();

    const handleStorageChange = () => loadData();
    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(loadData, 1500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [selectedRequest, selectedJobApp]);

  // Persist Theme
  useEffect(() => {
    localStorage.setItem("admin_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Status handlers
  const handleStatusChange = (requestId, newStatus) => {
    updateRequestStatus(requestId, newStatus);
    loadData();
    showToast(`Request ${requestId} status updated to "${newStatus}"`);
  };

  const handleDeleteRequest = (requestId) => {
    deleteRequest(requestId);
    setDeleteConfirmReq(null);
    if (selectedRequest?.id === requestId) setSelectedRequest(null);
    loadData();
    showToast(`Request ${requestId} permanently removed`, "info");
  };

  // Job Applications Handlers
  const handleJobStatusChange = (appId, newStatus) => {
    updateJobApplicationStatus(appId, newStatus);
    loadData();
    showToast(`Application ${appId} status updated to "${newStatus}"`);
  };

  const handleDeleteJobApplication = (appId) => {
    deleteJobApplication(appId);
    setDeleteConfirmJobApp(null);
    if (selectedJobApp?.id === appId) setSelectedJobApp(null);
    loadData();
    showToast(`Job application ${appId} removed`, "info");
  };

  const handleOpenHireModal = (app) => {
    setHireConfirmApp(app);
    setHireForm({
      role: app.position || "Registered Nurse",
      specialization: `${app.qualification || "Healthcare Specialist"} (${app.experience || "Experienced"})`,
    });
  };

  const handleConfirmHireApplicant = (e) => {
    e.preventDefault();
    if (!hireConfirmApp) return;

    hireJobApplicant(hireConfirmApp.id, hireForm.role, hireForm.specialization);
    showToast(`Successfully hired ${hireConfirmApp.fullName}! Added to Staff & Caregivers Roster.`);
    setHireConfirmApp(null);
    if (selectedJobApp?.id === hireConfirmApp.id) {
      setSelectedJobApp(null);
    }
    loadData();
  };

  // Staff Assignment
  const handleOpenAssignModal = (request) => {
    setAssignModalReq(request);
    setSelectedStaffId(request.assignedStaffId || "");
  };

  const handleConfirmAssignStaff = (e) => {
    e.preventDefault();
    if (!assignModalReq) return;

    if (!selectedStaffId) {
      showToast("Please select a caregiver or nurse to appoint", "error");
      return;
    }

    const staffMember = staffRoster.find((s) => s.id === selectedStaffId);
    if (staffMember) {
      assignStaffToRequest(
        assignModalReq.id,
        staffMember.id,
        staffMember.name,
        staffMember.role
      );
      showToast(`Assigned ${staffMember.name} to Request ${assignModalReq.id}`);
    }
    setAssignModalReq(null);
    setSelectedStaffId("");
    loadData();
  };

  // Add Staff Submit
  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (!newStaffForm.name || !newStaffForm.phone) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    addStaffMember(newStaffForm);
    showToast(`Added new staff member: ${newStaffForm.name}`);
    setShowAddStaffModal(false);
    setNewStaffForm({
      name: "",
      role: "Registered Nurse",
      specialization: "General Home Care",
      phone: "",
      cpr: "",
      status: "Available",
    });
    loadData();
  };

  // Add Request Submit
  const handleAddRequestSubmit = (e) => {
    e.preventDefault();
    if (!newReqForm.name || !newReqForm.phone) {
      showToast("Please provide patient name and phone number", "error");
      return;
    }

    const payload = {
      service: newReqForm.service,
      name: newReqForm.name,
      email: newReqForm.email,
      phone: newReqForm.phone,
      condition: newReqForm.condition,
      shift: newReqForm.shift,
      preferredDate: newReqForm.preferredDate,
      notes: newReqForm.notes,
      urgency: newReqForm.urgency,
      address: {
        flatNo: newReqForm.flatNo,
        buildingNo: newReqForm.buildingNo,
        area: newReqForm.area,
        governorate: newReqForm.governorate,
      },
      status: "Pending Verification",
    };

    const created = addRequest(payload);
    showToast(`Created new Care Request ${created.id}`);
    setShowAddRequestModal(false);
    setNewReqForm({
      service: "Elder Care",
      name: "",
      email: "",
      phone: "",
      condition: "",
      shift: "Day Shift (8 AM - 4 PM)",
      preferredDate: new Date().toISOString().split("T")[0],
      notes: "",
      urgency: "Normal",
      flatNo: "",
      buildingNo: "",
      area: "Seef District",
      governorate: "Capital Governorate",
    });
    loadData();
  };

  // Staff Status Toggle
  const handleToggleStaffStatus = (staffId) => {
    toggleStaffStatus(staffId);
    loadData();
    showToast("Staff availability updated");
  };

  // Reset Demo Data
  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all data to default demo state?")) {
      seedSampleDataIfEmpty(true);
      loadData();
      showToast("System demo data has been restored", "info");
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (requests.length === 0) {
      showToast("No care requests available to export", "error");
      return;
    }

    const headers = [
      "Request ID",
      "Service",
      "Patient Name",
      "Email",
      "Phone",
      "Governorate",
      "Area",
      "Status",
      "Assigned Staff",
      "Urgency",
      "Date",
    ];

    const rows = requests.map((r) => [
      r.id,
      `"${r.service || ""}"`,
      `"${r.name || ""}"`,
      `"${r.email || ""}"`,
      `"${r.phone || ""}"`,
      `"${r.address?.governorate || ""}"`,
      `"${r.address?.area || ""}"`,
      `"${r.status || ""}"`,
      `"${r.assignedStaffName || "Unassigned"}"`,
      `"${r.urgency || "Normal"}"`,
      `"${r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bahrain_care_requests_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Exported care requests to CSV file");
  };

  // Filtering Logic for Care Requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        !searchTerm ||
        req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.address?.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.service?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        req.status?.toLowerCase() === statusFilter.toLowerCase();

      const matchesService =
        serviceFilter === "ALL" ||
        req.service?.toLowerCase() === serviceFilter.toLowerCase();

      const matchesUrgency =
        urgencyFilter === "ALL" ||
        (req.urgency || "Normal").toLowerCase() === urgencyFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesService && matchesUrgency;
    });
  }, [requests, searchTerm, statusFilter, serviceFilter, urgencyFilter]);

  // Filtering Logic for Job Applications
  const filteredJobApplications = useMemo(() => {
    return jobApplications.filter((app) => {
      const matchesSearch =
        !jobSearchTerm ||
        app.id?.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
        app.fullName?.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
        app.phone?.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
        app.qualification?.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
        app.governorate?.toLowerCase().includes(jobSearchTerm.toLowerCase());

      const matchesPosition =
        jobPositionFilter === "ALL" ||
        app.position?.toLowerCase() === jobPositionFilter.toLowerCase();

      const matchesStatus =
        jobStatusFilter === "ALL" ||
        app.status?.toLowerCase() === jobStatusFilter.toLowerCase();

      return matchesSearch && matchesPosition && matchesStatus;
    });
  }, [jobApplications, jobSearchTerm, jobPositionFilter, jobStatusFilter]);

  // Statistics
  const totalCount = requests.length;
  const pendingCount = requests.filter(
    (r) => r.status === "Pending Verification"
  ).length;
  const verifiedCount = requests.filter((r) => r.status === "Verified").length;
  const appointedCount = requests.filter(
    (r) => r.status === "Staff Appointed"
  ).length;
  const completedCount = requests.filter((r) => r.status === "Completed").length;
  const urgentCount = requests.filter(
    (r) => r.urgency === "Urgent" || r.urgency === "High"
  ).length;

  // Job Statistics
  const totalJobsCount = jobApplications.length;
  const pendingJobsCount = jobApplications.filter(
    (a) => a.status === "Application Received" || a.status === "Under Review"
  ).length;
  const hiredJobsCount = jobApplications.filter(
    (a) => a.status?.toLowerCase().includes("hired")
  ).length;

  const totalNotificationsBadge = pendingCount + pendingJobsCount;

  // Combined System Notifications list
  const notificationsList = useMemo(() => {
    const bookingNotifs = requests.map((r) => ({
      id: r.id,
      title: `Care Booking ${r.id} (${r.service})`,
      type: "booking",
      status: r.status,
      time: r.createdAt ? new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
      dateObj: r.createdAt ? new Date(r.createdAt) : new Date(0),
      detail: `Patient: ${r.name}`,
    }));

    const jobNotifs = jobApplications.map((j) => ({
      id: j.id,
      title: `Job Application: ${j.fullName}`,
      type: "job",
      status: j.status,
      time: j.submittedAt ? new Date(j.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
      dateObj: j.submittedAt ? new Date(j.submittedAt) : new Date(0),
      detail: `Position: ${j.position}`,
      raw: j,
    }));

    return [...bookingNotifs, ...jobNotifs]
      .sort((a, b) => b.dateObj - a.dateObj)
      .slice(0, 8);
  }, [requests, jobApplications]);

  return (
    <div className={`admin-app-root theme-${theme}`}>
      {/* Toast notification popup */}
      {toastMessage && (
        <div className={`admin-toast toast-${toastMessage.type}`}>
          <span className="toast-icon">
            {toastMessage.type === "error" ? "⚠️" : toastMessage.type === "info" ? "ℹ️" : "✓"}
          </span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <header className="admin-navbar">
        <div className="admin-navbar-inner">
          <div className="admin-brand-block">
            <div className="admin-brand-icon">✚</div>
            <div>
              <div className="admin-brand-title">NOOR AL AFIYA</div>
              <div className="admin-brand-subtitle">
                Bahrain • HOME HEALTH CARE WLL Admin Portal
              </div>
            </div>
          </div>

          {/* Quick Stats Summary / System Badge */}
          <div className="admin-system-status">
            <span className="pulse-dot"></span>
            <span className="status-label">System Operational</span>
            <span className="version-tag">v2.4 Pro</span>
          </div>

          {/* Top Actions */}
          <div className="admin-nav-actions">
            {/* Theme Toggle Button */}
            <button
              className="admin-icon-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            {/* Notifications Bell */}
            <div className="notification-wrapper">
              <button
                className="admin-icon-btn notif-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                title="System Notifications"
              >
                🔔 <span className="notif-badge">{totalNotificationsBadge || notificationsList.length}</span>
              </button>

              {showNotifications && (
                <div className="notifications-popover">
                  <div className="notif-header">
                    <h4>Recent System Events</h4>
                    <span className="notif-count">{notificationsList.length} recent</span>
                  </div>
                  <div className="notif-list">
                    {notificationsList.map((n) => (
                      <div
                        className={`notif-item ${n.type === "job" ? "notif-job-item" : ""}`}
                        key={n.id}
                        onClick={() => {
                          setShowNotifications(false);
                          if (n.type === "job") {
                            setActiveTab("jobs");
                            if (n.raw) setSelectedJobApp(n.raw);
                          } else {
                            setActiveTab("requests");
                          }
                        }}
                      >
                        <div className={`notif-dot ${n.type === "job" ? "job-dot" : ""}`}></div>
                        <div className="notif-content">
                          <div className="notif-title">
                            {n.type === "job" && <span className="notif-tag-job">JOB APP</span>}
                            {n.title}
                          </div>
                          <div className="notif-sub">
                            {n.detail} • <strong>{n.status}</strong>
                          </div>
                          <div className="notif-time">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* New Request Modal Button */}
            <button
              className="admin-primary-btn"
              onClick={() => setShowAddRequestModal(true)}
            >
              ➕ New Request
            </button>

            <div className="admin-user-profile">
              <div className="user-avatar">AD</div>
              <div className="user-info">
                <span className="user-name">Executive Admin</span>
                <span className="user-role">Superintendent</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="admin-dashboard-container">
        {/* Metric Cards (Clickable Filter Shortcuts) */}
        <div className="admin-metrics-grid">
          <div
            className={`metric-card ${statusFilter === "ALL" && activeTab === "requests" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("requests");
              setStatusFilter("ALL");
            }}
          >
            <div className="metric-header">
              <span className="metric-title">Total Requests</span>
              <span className="metric-icon">📋</span>
            </div>
            <div className="metric-value">{totalCount}</div>
            <div className="metric-footer">All logged bookings in system</div>
          </div>

          <div
            className={`metric-card warning ${statusFilter === "Pending Verification" && activeTab === "requests" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("requests");
              setStatusFilter("Pending Verification");
            }}
          >
            <div className="metric-header">
              <span className="metric-title">Pending Verification</span>
              <span className="metric-icon">⏳</span>
            </div>
            <div className="metric-value">{pendingCount}</div>
            <div className="metric-footer">Requires immediate admin review</div>
          </div>

          <div
            className={`metric-card primary ${activeTab === "jobs" ? "active" : ""}`}
            onClick={() => setActiveTab("jobs")}
          >
            <div className="metric-header">
              <span className="metric-title">Job Applications</span>
              <span className="metric-icon">💼</span>
            </div>
            <div className="metric-value">{totalJobsCount}</div>
            <div className="metric-footer">
              {pendingJobsCount > 0 ? `⚠️ ${pendingJobsCount} pending review & hiring` : "All applicant requests synced"}
            </div>
          </div>

          <div
            className={`metric-card info ${statusFilter === "Verified" && activeTab === "requests" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("requests");
              setStatusFilter("Verified");
            }}
          >
            <div className="metric-header">
              <span className="metric-title">Verified & Ready</span>
              <span className="metric-icon">✓</span>
            </div>
            <div className="metric-value">{verifiedCount}</div>
            <div className="metric-footer">Ready for nurse appointment</div>
          </div>

          <div
            className={`metric-card success ${statusFilter === "Completed" && activeTab === "requests" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("requests");
              setStatusFilter("Completed");
            }}
          >
            <div className="metric-header">
              <span className="metric-title">Completed Care</span>
              <span className="metric-icon">🏁</span>
            </div>
            <div className="metric-value">{completedCount}</div>
            <div className="metric-footer">Successfully served patients</div>
          </div>

          <div
            className={`metric-card danger ${urgencyFilter === "Urgent" && activeTab === "requests" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("requests");
              setUrgencyFilter(urgencyFilter === "Urgent" ? "ALL" : "Urgent");
            }}
          >
            <div className="metric-header">
              <span className="metric-title">High Priority / Urgent</span>
              <span className="metric-icon">🚨</span>
            </div>
            <div className="metric-value">{urgentCount}</div>
            <div className="metric-footer">Requires priority dispatch</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs-bar">
          <button
            className={`tab-btn ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            📊 Care Requests Hub ({filteredRequests.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "jobs" ? "active" : ""}`}
            onClick={() => setActiveTab("jobs")}
          >
            💼 Job Applications ({filteredJobApplications.length})
            {pendingJobsCount > 0 && (
              <span className="tab-badge-count">{pendingJobsCount}</span>
            )}
          </button>
          <button
            className={`tab-btn ${activeTab === "staff" ? "active" : ""}`}
            onClick={() => setActiveTab("staff")}
          >
            👩‍⚕️ Staff & Caregivers ({staffRoster.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            📈 Operations Analytics
          </button>
          <button
            className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ System Settings
          </button>
        </div>

        {/* TAB 1: CARE REQUESTS */}
        {activeTab === "requests" && (
          <div className="tab-panel">
            {/* Filter Bar */}
            <div className="admin-filter-card">
              <div className="filter-search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by Request ID, Patient Name, Phone, Area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="clear-search-btn"
                    onClick={() => setSearchTerm("")}
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="filter-controls-group">
                {/* Service Filter */}
                <div className="filter-select-wrapper">
                  <label>Service:</label>
                  <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                  >
                    <option value="ALL">All Services</option>
                    <option value="Elder Care">Elder Care</option>
                    <option value="Newborn Care">Newborn Care</option>
                    <option value="Patient Care">Patient Care</option>
                    <option value="Children Care">Children Care</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="filter-select-wrapper">
                  <label>Status:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Pending Verification">
                      Pending Verification
                    </option>
                    <option value="Verified">Verified</option>
                    <option value="Staff Appointed">Staff Appointed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Urgency Filter */}
                <div className="filter-select-wrapper">
                  <label>Urgency:</label>
                  <select
                    value={urgencyFilter}
                    onChange={(e) => setUrgencyFilter(e.target.value)}
                  >
                    <option value="ALL">All Urgencies</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                {/* Reset Filters & Export */}
                <button
                  className="admin-secondary-btn"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("ALL");
                    setServiceFilter("ALL");
                    setUrgencyFilter("ALL");
                  }}
                >
                  Reset Filters
                </button>

                <button
                  className="admin-outline-btn"
                  onClick={handleExportCSV}
                  title="Export current table to CSV file"
                >
                  📥 Export CSV
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="admin-table-card">
              {filteredRequests.length === 0 ? (
                <div className="empty-table-state">
                  <div className="empty-icon">📂</div>
                  <h3>No matching care requests found</h3>
                  <p>Try adjusting your search query or clear existing filter selections.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Request ID</th>
                        <th>Patient Name</th>
                        <th>Service</th>
                        <th>Location (Bahrain)</th>
                        <th>Urgency</th>
                        <th>Status Workflow</th>
                        <th>Assigned Staff</th>
                        <th>Submitted</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests
                        .slice()
                        .reverse()
                        .map((req) => (
                          <tr key={req.id}>
                            <td>
                              <span className="req-id-badge">{req.id}</span>
                            </td>
                            <td>
                              <div className="patient-name-block">
                                <strong>{req.name || "N/A"}</strong>
                                <span className="patient-phone">{req.phone}</span>
                              </div>
                            </td>
                            <td>
                              <span className="service-tag">
                                {req.service}
                              </span>
                            </td>
                            <td>
                              <div className="location-block">
                                <span>{req.address?.area || "N/A"}</span>
                                <small>{req.address?.governorate || "Bahrain"}</small>
                              </div>
                            </td>
                            <td>
                              <span
                                className={`urgency-badge urgency-${(
                                  req.urgency || "Normal"
                                ).toLowerCase()}`}
                              >
                                {req.urgency || "Normal"}
                              </span>
                            </td>
                            <td>
                              <div className="status-dropdown-wrapper">
                                <select
                                  className={`status-select status-${(
                                    req.status || ""
                                  )
                                    .toLowerCase()
                                    .replace(/ /g, "-")}`}
                                  value={req.status}
                                  onChange={(e) =>
                                    handleStatusChange(req.id, e.target.value)
                                  }
                                >
                                  <option value="Pending Verification">
                                    Pending Verification
                                  </option>
                                  <option value="Verified">Verified</option>
                                  <option value="Staff Appointed">
                                    Staff Appointed
                                  </option>
                                  <option value="Completed">Completed</option>
                                </select>
                              </div>
                            </td>
                            <td>
                              {req.assignedStaffName ? (
                                <div className="staff-assigned-chip">
                                  <span className="chip-avatar">🩺</span>
                                  <span>{req.assignedStaffName}</span>
                                </div>
                              ) : (
                                <button
                                  className="assign-prompt-btn"
                                  onClick={() => handleOpenAssignModal(req)}
                                >
                                  + Assign Staff
                                </button>
                              )}
                            </td>
                            <td>
                              <small className="date-text">
                                {req.createdAt
                                  ? new Date(req.createdAt).toLocaleDateString()
                                  : "N/A"}
                              </small>
                            </td>
                            <td className="text-right">
                              <div className="action-buttons-group">
                                <button
                                  className="btn-action view"
                                  onClick={() => setSelectedRequest(req)}
                                  title="View Full Booking Details"
                                >
                                  👁️ View
                                </button>
                                <button
                                  className="btn-action appoint"
                                  onClick={() => handleOpenAssignModal(req)}
                                  title="Assign Caregiver or Nurse"
                                >
                                  🩺 Staff
                                </button>
                                <button
                                  className="btn-action print"
                                  onClick={() => setPrintModalReq(req)}
                                  title="Print Summary"
                                >
                                  🖨️
                                </button>
                                <button
                                  className="btn-action delete"
                                  onClick={() => setDeleteConfirmReq(req)}
                                  title="Delete Request"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: JOB APPLICATIONS HUB */}
        {activeTab === "jobs" && (
          <div className="tab-panel">
            <div className="admin-section-header">
              <div>
                <h2>Job Opportunities & Staff Recruitment</h2>
                <p>
                  Review job application submissions from nursing & care staff across Bahrain, verify candidate credentials, and accept them into the active staff roster.
                </p>
              </div>
              <div className="job-summary-badges">
                <span className="summary-badge pending">
                  ⏳ {pendingJobsCount} Pending Review
                </span>
                <span className="summary-badge hired">
                  ✓ {hiredJobsCount} Hired to Roster
                </span>
              </div>
            </div>

            {/* Job Filter Bar */}
            <div className="admin-filter-card">
              <div className="filter-search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by Application ID, Candidate Name, Phone, Qualification, Governorate..."
                  value={jobSearchTerm}
                  onChange={(e) => setJobSearchTerm(e.target.value)}
                />
                {jobSearchTerm && (
                  <button
                    className="clear-search-btn"
                    onClick={() => setJobSearchTerm("")}
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="filter-controls-group">
                {/* Position Filter */}
                <div className="filter-select-wrapper">
                  <label>Position:</label>
                  <select
                    value={jobPositionFilter}
                    onChange={(e) => setJobPositionFilter(e.target.value)}
                  >
                    <option value="ALL">All Positions</option>
                    <option value="Registered Nurse">Registered Nurse</option>
                    <option value="Caregiver">Caregiver</option>
                    <option value="Newborn Care Specialist">Newborn Care Specialist</option>
                    <option value="Patient Care Assistant">Patient Care Assistant</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="filter-select-wrapper">
                  <label>Status:</label>
                  <select
                    value={jobStatusFilter}
                    onChange={(e) => setJobStatusFilter(e.target.value)}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Application Received">Application Received</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Hired / Added to Roster">Hired / Added to Roster</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <button
                  className="admin-secondary-btn"
                  onClick={() => {
                    setJobSearchTerm("");
                    setJobPositionFilter("ALL");
                    setJobStatusFilter("ALL");
                  }}
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="admin-table-card">
              {filteredJobApplications.length === 0 ? (
                <div className="empty-table-state">
                  <div className="empty-icon">📁</div>
                  <h3>No job applications found</h3>
                  <p>When staff submit forms on the Careers page, their application requests will appear here in real-time.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Application ID</th>
                        <th>Applicant Name</th>
                        <th>Position Applied</th>
                        <th>Qualification & Experience</th>
                        <th>Governorate</th>
                        <th>Availability</th>
                        <th>Status Workflow</th>
                        <th>Submitted</th>
                        <th className="text-right">Recruitment Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobApplications
                        .slice()
                        .reverse()
                        .map((app) => (
                          <tr key={app.id}>
                            <td>
                              <span className="req-id-badge job-app-id">{app.id}</span>
                            </td>
                            <td>
                              <div className="patient-name-block">
                                <strong>{app.fullName}</strong>
                                <span className="patient-phone">{app.phone}</span>
                              </div>
                            </td>
                            <td>
                              <span className="service-tag job-position-tag">
                                {app.position}
                              </span>
                            </td>
                            <td>
                              <div className="location-block">
                                <span>{app.qualification || "Healthcare Professional"}</span>
                                <small>{app.experience || "N/A experience"}</small>
                              </div>
                            </td>
                            <td>
                              <small>{app.governorate || "Bahrain"}</small>
                            </td>
                            <td>
                              <span className="availability-chip">{app.availability || "Immediate"}</span>
                            </td>
                            <td>
                              <div className="status-dropdown-wrapper">
                                <select
                                  className={`status-select status-${(
                                    app.status || ""
                                  )
                                    .toLowerCase()
                                    .replace(/[\/\s]+/g, "-")}`}
                                  value={app.status}
                                  onChange={(e) =>
                                    handleJobStatusChange(app.id, e.target.value)
                                  }
                                >
                                  <option value="Application Received">Application Received</option>
                                  <option value="Under Review">Under Review</option>
                                  <option value="Hired / Added to Roster">Hired / Added to Roster</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                              </div>
                            </td>
                            <td>
                              <small className="date-text">
                                {app.submittedAt
                                  ? new Date(app.submittedAt).toLocaleDateString()
                                  : "N/A"}
                              </small>
                            </td>
                            <td className="text-right">
                              <div className="action-buttons-group">
                                <button
                                  className="btn-action view"
                                  onClick={() => setSelectedJobApp(app)}
                                  title="View Full Job Application Details"
                                >
                                  👁️ View
                                </button>

                                {app.status?.toLowerCase().includes("hired") ? (
                                  <span className="hired-badge-check" title="Staff active in roster">
                                    ✓ Active Staff
                                  </span>
                                ) : (
                                  <button
                                    className="btn-action hire-btn"
                                    onClick={() => handleOpenHireModal(app)}
                                    title="Take candidate for job & add to active roster"
                                  >
                                    💼 Take for Job
                                  </button>
                                )}

                                <button
                                  className="btn-action delete"
                                  onClick={() => setDeleteConfirmJobApp(app)}
                                  title="Delete Application"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: STAFF MANAGEMENT */}
        {activeTab === "staff" && (
          <div className="tab-panel">
            <div className="admin-section-header">
              <div>
                <h2>Healthcare Staff & Caregiver Roster</h2>
                <p>
                  Manage active nurses, pediatric caregivers, and clinical staff assigned to home care requests.
                </p>
              </div>
              <button
                className="admin-primary-btn"
                onClick={() => setShowAddStaffModal(true)}
              >
                ➕ Add New Nurse / Caregiver
              </button>
            </div>

            <div className="staff-cards-grid">
              {staffRoster.map((staff) => (
                <div className="staff-card" key={staff.id}>
                  <div className="staff-card-header">
                    <div
                      className="staff-avatar"
                      style={{ backgroundColor: staff.avatarColor || "#0066cc" }}
                    >
                      {staff.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h3>{staff.name}</h3>
                      <span className="staff-role-badge">{staff.role}</span>
                    </div>
                  </div>

                  <div className="staff-card-body">
                    <div className="staff-info-row">
                      <label>Specialization:</label>
                      <span>{staff.specialization}</span>
                    </div>
                    <div className="staff-info-row">
                      <label>Bahrain Phone:</label>
                      <span>{staff.phone}</span>
                    </div>
                    <div className="staff-info-row">
                      <label>CPR Number:</label>
                      <span>{staff.cpr}</span>
                    </div>
                    <div className="staff-info-row">
                      <label>Active Cases:</label>
                      <strong>{staff.assignedCount || 0} Patients</strong>
                    </div>
                  </div>

                  <div className="staff-card-footer">
                    <button
                      className={`staff-status-toggle status-${staff.status
                        .toLowerCase()
                        .replace(/ /g, "-")}`}
                      onClick={() => handleToggleStaffStatus(staff.id)}
                      title="Click to toggle availability status"
                    >
                      ● {staff.status} (Click to toggle)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: OPERATIONS ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="tab-panel">
            <div className="admin-section-header">
              <div>
                <h2>Operations & Care Service Analytics</h2>
                <p>Overview of patient request distribution and service metrics across Bahrain governorates.</p>
              </div>
            </div>

            <div className="analytics-grid">
              {/* Service Distribution */}
              <div className="analytics-card">
                <h3>Requests by Service Package</h3>
                <div className="analytics-bar-list">
                  {["Elder Care", "Newborn Care", "Patient Care", "Children Care"].map((service) => {
                    const count = requests.filter((r) => r.service === service).length;
                    const pct = totalCount ? Math.round((count / totalCount) * 100) : 0;
                    return (
                      <div className="analytics-bar-item" key={service}>
                        <div className="bar-label-row">
                          <span>{service}</span>
                          <strong>
                            {count} requests ({pct}%)
                          </strong>
                        </div>
                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="analytics-card">
                <h3>Request Workflow Status Distribution</h3>
                <div className="analytics-bar-list">
                  {[
                    { label: "Pending Verification", count: pendingCount, color: "#f59e0b" },
                    { label: "Verified", count: verifiedCount, color: "#0284c7" },
                    { label: "Staff Appointed", count: appointedCount, color: "#7c3aed" },
                    { label: "Completed", count: completedCount, color: "#10b981" },
                  ].map((item) => {
                    const pct = totalCount ? Math.round((item.count / totalCount) * 100) : 0;
                    return (
                      <div className="analytics-bar-item" key={item.label}>
                        <div className="bar-label-row">
                          <span>{item.label}</span>
                          <strong>
                            {item.count} ({pct}%)
                          </strong>
                        </div>
                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{ width: `${pct}%`, backgroundColor: item.color }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Governorates Coverage */}
              <div className="analytics-card">
                <h3>Bahrain Governorate Coverage</h3>
                <div className="governorate-grid">
                  {[
                    "Capital Governorate",
                    "Muharraq Governorate",
                    "Northern Governorate",
                    "Southern Governorate",
                  ].map((gov) => {
                    const count = requests.filter(
                      (r) => r.address?.governorate === gov
                    ).length;
                    return (
                      <div className="gov-stat-box" key={gov}>
                        <span className="gov-name">{gov.replace(" Governorate", "")}</span>
                        <strong className="gov-count">{count} Active Bookings</strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM SETTINGS */}
        {activeTab === "settings" && (
          <div className="tab-panel">
            <div className="admin-section-header">
              <div>
                <h2>System Preferences & Data Controls</h2>
                <p>Configure dashboard behavior, system details, and demo environment.</p>
              </div>
            </div>

            <div className="settings-cards-grid">
              <div className="settings-card">
                <h3>🏢 Healthcare Provider Identity</h3>
                <p className="settings-desc">Registered medical identity details shown on patient receipts and printouts.</p>
                <div className="settings-field">
                  <label>Company Legal Title:</label>
                  <input type="text" value="Bahrain HOME HEALTH CARE WLL" readOnly />
                </div>
                <div className="settings-field">
                  <label>Brand Trade Name:</label>
                  <input type="text" value="NOOR AL AFIYA" readOnly />
                </div>
                <div className="settings-field">
                  <label>NHRA Accreditation No.:</label>
                  <input type="text" value="NHRA-BH-2026-9910" readOnly />
                </div>
                <div className="settings-field">
                  <label>24/7 Dispatch Hotline:</label>
                  <input type="text" value="+973 1700 8899" readOnly />
                </div>
              </div>

              <div className="settings-card">
                <h3>🛠️ Demo & Data Management</h3>
                <p className="settings-desc">Reset local storage or seed default Bahrain patient requests for testing.</p>
                <div className="settings-action-block">
                  <button className="admin-secondary-btn" onClick={handleResetData}>
                    🔄 Restore Default Demo Dataset
                  </button>
                  <p className="sub-text">
                    Restores standard sample requests and nursing roster for smooth demo walkthroughs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          MODAL 1: BOOKING DETAILS MODAL
      ======================================================== */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Booking Record Details</h2>
                <p className="modal-subtitle">{selectedRequest.id}</p>
              </div>
              <button className="close-btn" onClick={() => setSelectedRequest(null)}>
                ×
              </button>
            </div>

            <div className="modal-body-scroll">
              {/* Top Banner */}
              <div className="details-top-banner">
                <div>
                  <span className="label">SERVICE REQUESTED</span>
                  <h3>{selectedRequest.service}</h3>
                </div>
                <div>
                  <span className="label">WORKFLOW STATUS</span>
                  <select
                    className={`status-select status-${(
                      selectedRequest.status || ""
                    )
                      .toLowerCase()
                      .replace(/ /g, "-")}`}
                    value={selectedRequest.status}
                    onChange={(e) =>
                      handleStatusChange(selectedRequest.id, e.target.value)
                    }
                  >
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Verified">Verified</option>
                    <option value="Staff Appointed">Staff Appointed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Patient Info */}
              <div className="detail-section">
                <h4>👤 Patient & Contact Profile</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Full Name</label>
                    <span>{selectedRequest.name || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone Number</label>
                    <span>{selectedRequest.phone || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email Address</label>
                    <span>{selectedRequest.email || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Preferred Date</label>
                    <span>
                      {selectedRequest.preferredDate
                        ? new Date(`${selectedRequest.preferredDate}T00:00:00`).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Shift Schedule</label>
                    <span>{selectedRequest.shift || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Priority Level</label>
                    <span className={`urgency-badge urgency-${(selectedRequest.urgency || "Normal").toLowerCase()}`}>
                      {selectedRequest.urgency || "Normal"}
                    </span>
                  </div>
                </div>
                <div className="detail-item full-width">
                  <label>Medical Condition & Requirements</label>
                  <p>{selectedRequest.condition || "None provided."}</p>
                </div>
              </div>

              {/* Service Address */}
              <div className="detail-section">
                <h4>📍 Bahrain Service Address</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Flat / Villa No.</label>
                    <span>
                      {selectedRequest.address?.flatNo ||
                        selectedRequest.address?.flatVilla ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Building No.</label>
                    <span>
                      {selectedRequest.address?.buildingNo ||
                        selectedRequest.address?.buildingNumber ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Area / District</label>
                    <span>{selectedRequest.address?.area || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Governorate</label>
                    <span>{selectedRequest.address?.governorate || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Staff Assignment Info */}
              <div className="detail-section">
                <h4>🩺 Assigned Healthcare Staff</h4>
                {selectedRequest.assignedStaffName ? (
                  <div className="assigned-staff-box">
                    <div>
                      <strong>{selectedRequest.assignedStaffName}</strong>
                      <p>{selectedRequest.assignedStaffRole || "Registered Nurse"}</p>
                    </div>
                    <button
                      className="admin-secondary-btn"
                      onClick={() => {
                        const r = selectedRequest;
                        setSelectedRequest(null);
                        handleOpenAssignModal(r);
                      }}
                    >
                      Reassign Staff
                    </button>
                  </div>
                ) : (
                  <div className="unassigned-staff-box">
                    <p>No caregiver or nurse has been appointed to this request yet.</p>
                    <button
                      className="admin-primary-btn"
                      onClick={() => {
                        const r = selectedRequest;
                        setSelectedRequest(null);
                        handleOpenAssignModal(r);
                      }}
                    >
                      + Appoint Staff Now
                    </button>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="detail-section">
                <h4>📝 Patient Notes</h4>
                <p className="notes-text">
                  {selectedRequest.notes || "No special instructions supplied by the patient."}
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="admin-outline-btn"
                onClick={() => {
                  setPrintModalReq(selectedRequest);
                  setSelectedRequest(null);
                }}
              >
                🖨️ Print Request Record
              </button>
              <button
                className="admin-secondary-btn"
                onClick={() => setSelectedRequest(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: ASSIGN STAFF MODAL
      ======================================================== */}
      {assignModalReq && (
        <div className="modal-overlay" onClick={() => setAssignModalReq(null)}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Appoint Caregiver to Request {assignModalReq.id}</h2>
              <button className="close-btn" onClick={() => setAssignModalReq(null)}>
                ×
              </button>
            </div>

            <form onSubmit={handleConfirmAssignStaff}>
              <div className="form-group">
                <label>Select Nurse / Caregiver from Roster:</label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Staff Member --</option>
                  {staffRoster.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role} - {s.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={() => setAssignModalReq(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  Confirm Staff Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: ADD NEW STAFF MODAL
      ======================================================== */}
      {showAddStaffModal && (
        <div className="modal-overlay" onClick={() => setShowAddStaffModal(false)}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Staff Member</h2>
              <button
                className="close-btn"
                onClick={() => setShowAddStaffModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit}>
              <div className="form-group">
                <label>Full Name & Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Nurse Fatima Al-Sayed"
                  value={newStaffForm.name}
                  onChange={(e) =>
                    setNewStaffForm({ ...newStaffForm, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Role:</label>
                <select
                  value={newStaffForm.role}
                  onChange={(e) =>
                    setNewStaffForm({ ...newStaffForm, role: e.target.value })
                  }
                >
                  <option value="Registered Senior Nurse">Registered Senior Nurse</option>
                  <option value="Pediatric Care Specialist">Pediatric Care Specialist</option>
                  <option value="Palliative Caregiver">Palliative Caregiver</option>
                  <option value="Clinical Home Care Specialist">Clinical Home Care Specialist</option>
                  <option value="Maternal & Newborn Caregiver">Maternal & Newborn Caregiver</option>
                </select>
              </div>

              <div className="form-group">
                <label>Specialization:</label>
                <input
                  type="text"
                  placeholder="e.g. Elderly Care & Wound Management"
                  value={newStaffForm.specialization}
                  onChange={(e) =>
                    setNewStaffForm({
                      ...newStaffForm,
                      specialization: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Bahrain Phone Number:</label>
                <input
                  type="text"
                  placeholder="+973 3900 1122"
                  value={newStaffForm.phone}
                  onChange={(e) =>
                    setNewStaffForm({ ...newStaffForm, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>CPR ID Number:</label>
                <input
                  type="text"
                  placeholder="920188310"
                  value={newStaffForm.cpr}
                  onChange={(e) =>
                    setNewStaffForm({ ...newStaffForm, cpr: e.target.value })
                  }
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={() => setShowAddStaffModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: ADD NEW REQUEST MODAL (ADMIN CREATION)
      ======================================================== */}
      {showAddRequestModal && (
        <div className="modal-overlay" onClick={() => setShowAddRequestModal(false)}>
          <div className="form-modal large-form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Log New Patient Care Request</h2>
              <button
                className="close-btn"
                onClick={() => setShowAddRequestModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddRequestSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Care Package / Service:</label>
                  <select
                    value={newReqForm.service}
                    onChange={(e) =>
                      setNewReqForm({ ...newReqForm, service: e.target.value })
                    }
                  >
                    <option value="Elder Care">Elder Care</option>
                    <option value="Newborn Care">Newborn Care</option>
                    <option value="Patient Care">Patient Care</option>
                    <option value="Children Care">Children Care</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority / Urgency:</label>
                  <select
                    value={newReqForm.urgency}
                    onChange={(e) =>
                      setNewReqForm({ ...newReqForm, urgency: e.target.value })
                    }
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Emergency / Urgent</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Patient Full Name:</label>
                  <input
                    type="text"
                    placeholder="Patient Name"
                    value={newReqForm.name}
                    onChange={(e) =>
                      setNewReqForm({ ...newReqForm, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number (+973):</label>
                  <input
                    type="text"
                    placeholder="+973 3xxx xxxx"
                    value={newReqForm.phone}
                    onChange={(e) =>
                      setNewReqForm({ ...newReqForm, phone: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address:</label>
                  <input
                    type="email"
                    placeholder="patient@domain.bh"
                    value={newReqForm.email}
                    onChange={(e) =>
                      setNewReqForm({ ...newReqForm, email: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Preferred Start Date:</label>
                  <input
                    type="date"
                    value={newReqForm.preferredDate}
                    onChange={(e) =>
                      setNewReqForm({
                        ...newReqForm,
                        preferredDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Shift Schedule:</label>
                  <select
                    value={newReqForm.shift}
                    onChange={(e) =>
                      setNewReqForm({ ...newReqForm, shift: e.target.value })
                    }
                  >
                    <option value="Day Shift (8 AM - 4 PM)">Day Shift (8 AM - 4 PM)</option>
                    <option value="Evening Shift (4 PM - 10 PM)">Evening Shift (4 PM - 10 PM)</option>
                    <option value="Night Shift (10 PM - 6 AM)">Night Shift (10 PM - 6 AM)</option>
                    <option value="Full Time (24 Hours)">Full Time (24 Hours)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Bahrain Governorate:</label>
                  <select
                    value={newReqForm.governorate}
                    onChange={(e) =>
                      setNewReqForm({ ...newReqForm, governorate: e.target.value })
                    }
                  >
                    <option value="Capital Governorate">Capital Governorate</option>
                    <option value="Muharraq Governorate">Muharraq Governorate</option>
                    <option value="Northern Governorate">Northern Governorate</option>
                    <option value="Southern Governorate">Southern Governorate</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Area / District:</label>
                  <input
                    type="text"
                    placeholder="e.g. Seef, Riffa, Saar, Juffair"
                    value={newReqForm.area}
                    onChange={(e) =>
                      setNewReqForm({ ...newReqForm, area: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Building / Flat No.:</label>
                  <input
                    type="text"
                    placeholder="Building 12, Flat 4"
                    value={newReqForm.buildingNo}
                    onChange={(e) =>
                      setNewReqForm({ ...newReqForm, buildingNo: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Medical Condition & Instructions:</label>
                <textarea
                  rows="3"
                  placeholder="Describe patient condition, medications, special care notes..."
                  value={newReqForm.condition}
                  onChange={(e) =>
                    setNewReqForm({ ...newReqForm, condition: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={() => setShowAddRequestModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 5: DELETE CONFIRMATION MODAL
      ======================================================== */}
      {deleteConfirmReq && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmReq(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Request Deletion</h2>
              <button
                className="close-btn"
                onClick={() => setDeleteConfirmReq(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to permanently delete care request{" "}
                <strong>{deleteConfirmReq.id}</strong> for patient{" "}
                <strong>{deleteConfirmReq.name}</strong>?
              </p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button
                className="admin-secondary-btn"
                onClick={() => setDeleteConfirmReq(null)}
              >
                Cancel
              </button>
              <button
                className="admin-danger-btn"
                onClick={() => handleDeleteRequest(deleteConfirmReq.id)}
              >
                Delete Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 6: PRINT RECORD SUMMARY MODAL
      ======================================================== */}
      {printModalReq && (
        <div className="modal-overlay" onClick={() => setPrintModalReq(null)}>
          <div className="print-modal" onClick={(e) => e.stopPropagation()}>
            <div className="print-header-actions">
              <button
                className="admin-primary-btn"
                onClick={() => window.print()}
              >
                🖨️ Print / Save PDF
              </button>
              <button
                className="admin-secondary-btn"
                onClick={() => setPrintModalReq(null)}
              >
                Close
              </button>
            </div>

            <div className="printable-record-paper">
              <div className="printable-header">
                <div>
                  <h1>NOOR AL AFIYA</h1>
                  <p>HOME HEALTH CARE WLL • Kingdom of Bahrain</p>
                </div>
                <div className="text-right">
                  <h3>CARE REQUEST RECEIPT</h3>
                  <small>ID: {printModalReq.id}</small>
                </div>
              </div>

              <hr />

              <div className="printable-grid">
                <div>
                  <strong>Patient Name:</strong> {printModalReq.name}
                </div>
                <div>
                  <strong>Phone:</strong> {printModalReq.phone}
                </div>
                <div>
                  <strong>Service:</strong> {printModalReq.service}
                </div>
                <div>
                  <strong>Status:</strong> {printModalReq.status}
                </div>
                <div>
                  <strong>Preferred Date:</strong> {printModalReq.preferredDate}
                </div>
                <div>
                  <strong>Shift:</strong> {printModalReq.shift}
                </div>
              </div>

              <div className="printable-section">
                <strong>Service Address:</strong>
                <p>
                  Flat {printModalReq.address?.flatNo || "N/A"}, Building{" "}
                  {printModalReq.address?.buildingNo || "N/A"}, Area{" "}
                  {printModalReq.address?.area || "N/A"},{" "}
                  {printModalReq.address?.governorate || "Bahrain"}
                </p>
              </div>

              <div className="printable-section">
                <strong>Assigned Medical Caregiver:</strong>
                <p>{printModalReq.assignedStaffName || "Pending Assignment"}</p>
              </div>

              <div className="printable-section">
                <strong>Patient Condition / Notes:</strong>
                <p>{printModalReq.condition || "N/A"}</p>
              </div>

              <div className="printable-footer">
                <span>Authorized Signature: _______________________</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;