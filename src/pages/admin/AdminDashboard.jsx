import { useEffect, useState, useMemo, useCallback } from "react";
import usePageMeta from "../../utils/usePageMeta";
import { Link } from "react-router-dom";
import logoMark from "../../assets/noor-al-afiya-mark.webp";
import {
  fetchAdminBookings,
  fetchAdminBookingHistory,
  updateAdminBookingStatus,
  fetchAdminContactEnquiries,
  updateAdminContactEnquiryStatus,
  fetchAdminJobApplications,
  updateAdminJobApplicationStatus,
  fetchJobApplicationSignedDocumentUrl,
  logoutAdmin,
} from "../../utils/api";
import "./AdminDashboard.css";

const BOOKING_STATUSES = [
  "Pending Verification",
  "Verified",
  "Completed",
];

const ALL_CARE_SERVICES = [
  "Patient Care",
  "Elder Care",
  "Newborn Care",
  "Children's Care",
  "ICU Patient Care",
  "Cancer Patient Care",
  "Ventilator Patient Care",
  "Blood Collection Service",
];

const ENQUIRY_STATUSES = [
  "New",
  "In Progress",
  "Resolved",
];

const APPLICATION_STATUSES = [
  "Application Received",
  "Under Review",
  "Approved",
  "Rejected",
];

const SECTION_META = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Overview of care bookings and pending verification requests",
  },
  bookings: {
    title: "Care Bookings",
    subtitle: "Search, filter, verify, and manage submitted patient care bookings",
  },
  enquiries: {
    title: "Contact Enquiries",
    subtitle: "Review and manage customer enquiries submitted through the Contact Us page",
  },
  applications: {
    title: "Job Applications",
    subtitle: "Review healthcare career applications submitted through the website",
  },
};

function formatDate(dateString) {
  if (!dateString) return "Not specified";
  const parsed = dateString.includes("T")
    ? new Date(dateString)
    : new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateString;
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateString) {
  if (!dateString) return "Not specified";
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return dateString;
  return parsed.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusClass(status) {
  const normalized = (status || "").toLowerCase();
  if (
    normalized.includes("pending") ||
    normalized.includes("received") ||
    normalized === "new"
  ) {
    return "status-pending";
  }
  if (
    normalized.includes("verified") ||
    normalized.includes("review") ||
    normalized.includes("progress")
  ) {
    return "status-verified";
  }
  if (
    normalized.includes("completed") ||
    normalized.includes("approved") ||
    normalized.includes("resolved")
  ) {
    return "status-positive";
  }
  if (normalized.includes("rejected")) {
    return "status-rejected";
  }
  return "status-default";
}

function AdminDashboard() {
  usePageMeta({"title":"Admin Dashboard | NOOR AL AFIYA","noindex":true});
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Real database data states
  const [requests, setRequests] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Care Bookings search & filters
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("ALL");
  const [bookingServiceFilter, setBookingServiceFilter] = useState("ALL");
  const [bookingDateFilter, setBookingDateFilter] = useState("");

  // Contact Enquiries search & filters
  const [enquirySearch, setEnquirySearch] = useState("");
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState("ALL");

  // Job Applications search & filters
  const [jobSearch, setJobSearch] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState("ALL");

  // Modals & booking status history
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [selectedJobApp, setSelectedJobApp] = useState(null);

  // Status notice banner
  const [statusNotice, setStatusNotice] = useState(null);

  const showNotice = useCallback((text, type = "success") => {
    setStatusNotice({ text, type });
    setTimeout(() => {
      setStatusNotice((current) => (current?.text === text ? null : current));
    }, 3500);
  }, []);

  const loadData = useCallback(async (showSpinner = false) => {
    if (showSpinner) {
      setIsLoading(true);
    }
    try {
      const [storedReqs, storedEnquiries, storedJobs] = await Promise.all([
        fetchAdminBookings(),
        fetchAdminContactEnquiries(),
        fetchAdminJobApplications(),
      ]);

      setRequests(storedReqs);
      setEnquiries(storedEnquiries);
      setJobApplications(storedJobs);
      setLoadError("");

      setSelectedBooking((prev) =>
        prev ? storedReqs.find((r) => r.id === prev.id) || prev : null
      );
      setSelectedEnquiry((prev) =>
        prev ? storedEnquiries.find((e) => e.id === prev.id) || prev : null
      );
      setSelectedJobApp((prev) =>
        prev ? storedJobs.find((j) => j.id === prev.id) || prev : null
      );
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        await logoutAdmin();
        window.location.replace("/admin/login");
        return;
      }
      setLoadError(
        err.message || "Unable to load dashboard records from the server."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(true);
    const interval = setInterval(() => loadData(false), 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Load status history when a booking details modal opens
  const handleOpenBookingDetails = async (booking) => {
    setSelectedBooking(booking);
    setBookingHistory([]);
    setLoadingHistory(true);
    try {
      const history = await fetchAdminBookingHistory(booking.id);
      setBookingHistory(history);
    } catch {
      setBookingHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Close mobile sidebar or active modal on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
        setSelectedBooking(null);
        setSelectedEnquiry(null);
        setSelectedJobApp(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavigateSection = (section, presetStatus = null) => {
    setActiveSection(section);
    setSidebarOpen(false);
    if (section === "bookings" && presetStatus !== null) {
      setBookingStatusFilter(presetStatus);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleLogout = async () => {
    setRequests([]);
    setEnquiries([]);
    setJobApplications([]);
    setSelectedBooking(null);
    setSelectedEnquiry(null);
    setSelectedJobApp(null);
    await logoutAdmin();
    window.location.replace("/admin/login");
  };

  // Contact Enquiry actions
  const handleEnquiryStatusChange = async (enquiryId, newStatus) => {
    try {
      const updated = await updateAdminContactEnquiryStatus(enquiryId, newStatus);
      setEnquiries((prev) =>
        prev.map((item) => (item.id === enquiryId ? updated : item))
      );
      if (selectedEnquiry?.id === enquiryId) {
        setSelectedEnquiry(updated);
      }
      showNotice(`Enquiry status updated to "${newStatus}".`);
    } catch (err) {
      showNotice(err.message || "Could not update enquiry status.", "error");
    }
  };

  // Care Booking actions
  const handleVerifyBooking = async (booking) => {
    try {
      const updated = await updateAdminBookingStatus(booking.id, "Verified");
      setRequests((prev) =>
        prev.map((item) => (item.id === booking.id ? updated : item))
      );
      if (selectedBooking?.id === booking.id) {
        setSelectedBooking(updated);
        const history = await fetchAdminBookingHistory(booking.id).catch(() => []);
        setBookingHistory(history);
      }
      showNotice(`Booking ${booking.id} has been verified.`);
    } catch (err) {
      showNotice(err.message || "Could not verify booking.", "error");
    }
  };

  const handleBookingStatusChange = async (bookingId, newStatus) => {
    try {
      const updated = await updateAdminBookingStatus(bookingId, newStatus);
      setRequests((prev) =>
        prev.map((item) => (item.id === bookingId ? updated : item))
      );
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(updated);
        const history = await fetchAdminBookingHistory(bookingId).catch(() => []);
        setBookingHistory(history);
      }
      showNotice(`Booking ${bookingId} status updated to "${newStatus}".`);
    } catch (err) {
      showNotice(err.message || "Could not update booking status.", "error");
    }
  };

  // Job Application actions
  const handleJobStatusChange = async (appId, newStatus) => {
    try {
      const updated = await updateAdminJobApplicationStatus(appId, newStatus);
      setJobApplications((prev) =>
        prev.map((item) => (item.id === appId ? updated : item))
      );
      if (selectedJobApp?.id === appId) {
        setSelectedJobApp(updated);
      }
      showNotice(`Application ${appId} status updated to "${newStatus}".`);
    } catch (err) {
      showNotice(err.message || "Could not update application status.", "error");
    }
  };

  const handleOpenPrivateDocument = async (appId, type = "cv") => {
    try {
      const signedUrl = await fetchJobApplicationSignedDocumentUrl(appId, type);
      window.open(signedUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      showNotice(
        err.message || "Could not generate temporary access link for document.",
        "error"
      );
    }
  };

  // Computed metrics & sorted lists
  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [requests]);

  const totalBookingsCount = sortedRequests.length;
  const pendingBookings = useMemo(
    () => sortedRequests.filter((r) => r.status === "Pending Verification"),
    [sortedRequests]
  );
  const verifiedBookings = useMemo(
    () => sortedRequests.filter((r) => r.status === "Verified"),
    [sortedRequests]
  );
  const recentBookings = useMemo(
    () => sortedRequests.slice(0, 5),
    [sortedRequests]
  );

  const filteredBookings = useMemo(() => {
    const query = bookingSearch.trim().toLowerCase();
    return sortedRequests.filter((req) => {
      const matchesSearch =
        !query ||
        (req.id || "").toLowerCase().includes(query) ||
        (req.name || "").toLowerCase().includes(query) ||
        (req.phone || "").toLowerCase().includes(query) ||
        (req.email || "").toLowerCase().includes(query) ||
        (req.service || "").toLowerCase().includes(query);

      const matchesStatus =
        bookingStatusFilter === "ALL" ||
        (req.status || "").toLowerCase() === bookingStatusFilter.toLowerCase();

      const matchesService =
        bookingServiceFilter === "ALL" ||
        (req.service || "").toLowerCase() === bookingServiceFilter.toLowerCase();

      const createdDate = req.createdAt ? req.createdAt.split("T")[0] : "";
      const matchesDate =
        !bookingDateFilter ||
        req.preferredDate === bookingDateFilter ||
        createdDate === bookingDateFilter;

      return matchesSearch && matchesStatus && matchesService && matchesDate;
    });
  }, [sortedRequests, bookingSearch, bookingStatusFilter, bookingServiceFilter, bookingDateFilter]);

  const sortedEnquiries = useMemo(() => {
    return [...enquiries].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [enquiries]);

  const filteredEnquiries = useMemo(() => {
    const query = enquirySearch.trim().toLowerCase();
    return sortedEnquiries.filter((enq) => {
      const matchesSearch =
        !query ||
        (enq.fullName || "").toLowerCase().includes(query) ||
        (enq.email || "").toLowerCase().includes(query) ||
        (enq.phone || "").toLowerCase().includes(query) ||
        (enq.subject || "").toLowerCase().includes(query) ||
        (enq.message || "").toLowerCase().includes(query);

      const matchesStatus =
        enquiryStatusFilter === "ALL" ||
        (enq.status || "").toLowerCase() === enquiryStatusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [sortedEnquiries, enquirySearch, enquiryStatusFilter]);

  const sortedJobApplications = useMemo(() => {
    return [...jobApplications].sort((a, b) => {
      const timeA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const timeB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [jobApplications]);

  const filteredJobApplications = useMemo(() => {
    const query = jobSearch.trim().toLowerCase();
    return sortedJobApplications.filter((app) => {
      const matchesSearch =
        !query ||
        (app.id || "").toLowerCase().includes(query) ||
        (app.fullName || "").toLowerCase().includes(query) ||
        (app.phone || "").toLowerCase().includes(query) ||
        (app.email || "").toLowerCase().includes(query) ||
        (app.position || "").toLowerCase().includes(query);

      const matchesStatus =
        jobStatusFilter === "ALL" ||
        (app.status || "").toLowerCase() === jobStatusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [sortedJobApplications, jobSearch, jobStatusFilter]);

  const currentSectionMeta =
    SECTION_META[activeSection] || SECTION_META.dashboard;

  return (
    <div className="admin-layout">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}
        aria-label="Admin navigation"
      >
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <img
              src={logoMark} width="256" height="256"
              alt="NOOR AL AFIYA"
              className="admin-brand-logo"
            />
            <div className="admin-brand-text">
              <strong>NOOR AL AFIYA</strong>
              <span>Home Health Care WLL</span>
            </div>
          </div>
          <button
            type="button"
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
          >
            ×
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="admin-nav-group">
            <span className="admin-nav-label">MANAGEMENT</span>
            <button
              type="button"
              className={`admin-nav-item ${
                activeSection === "dashboard" ? "active" : ""
              }`}
              onClick={() => handleNavigateSection("dashboard")}
            >
              <svg
                className="admin-nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${
                activeSection === "bookings" ? "active" : ""
              }`}
              onClick={() => handleNavigateSection("bookings")}
            >
              <svg
                className="admin-nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Care Bookings</span>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${
                activeSection === "enquiries" ? "active" : ""
              }`}
              onClick={() => handleNavigateSection("enquiries")}
            >
              <svg
                className="admin-nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Contact Enquiries</span>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${
                activeSection === "applications" ? "active" : ""
              }`}
              onClick={() => handleNavigateSection("applications")}
            >
              <svg
                className="admin-nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
              <span>Job Applications</span>
            </button>
          </div>

          <div className="admin-nav-footer">
            <span className="admin-nav-label">SYSTEM</span>
            <Link to="/" className="admin-nav-item admin-website-link">
              <svg
                className="admin-nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>Website</span>
            </Link>

            <button
              type="button"
              className="admin-nav-item admin-logout-item"
              onClick={handleLogout}
            >
              <svg
                className="admin-nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <div className="admin-main-wrapper">
        {/* Compact Top Header */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="admin-page-heading">
              <h1>{currentSectionMeta.title}</h1>
              <p>{currentSectionMeta.subtitle}</p>
            </div>
          </div>

          <div className="admin-topbar-right">
            <span className="admin-role-pill">
              <span className="admin-role-dot" />
              Administrator
            </span>
          </div>
        </header>

        {/* Status Toast Notification */}
        {statusNotice && (
          <div
            className={`admin-notice admin-notice-${statusNotice.type}`}
            role="status"
          >
            <span>{statusNotice.text}</span>
            <button
              type="button"
              className="admin-notice-close"
              onClick={() => setStatusNotice(null)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        {loadError && (
          <div
            className="admin-notice"
            role="alert"
            style={{
              backgroundColor: "#FFF0F7",
              borderColor: "#FF3A94",
            }}
          >
            <span>{loadError}</span>
            <button
              type="button"
              className="admin-action-btn"
              onClick={() => loadData(true)}
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Workspace Content */}
        <main className="admin-content">
          {isLoading ? (
            <div className="admin-card admin-empty-state">
              <p>Loading dashboard data...</p>
            </div>
          ) : (
            <>
              {/* ==================== 1. DASHBOARD SECTION ==================== */}
              {activeSection === "dashboard" && (
                <div className="admin-section-stack">
                  {/* Summary Cards */}
                  <section
                    className="admin-stats-grid"
                    aria-label="Booking statistics"
                  >
                    <div className="admin-stat-card">
                      <div className="admin-stat-info">
                        <span className="admin-stat-label">
                          Total Care Bookings
                        </span>
                        <strong className="admin-stat-value">
                          {totalBookingsCount}
                        </strong>
                        <span className="admin-stat-sub">
                          All submitted care requests
                        </span>
                      </div>
                      <button
                        type="button"
                        className="admin-stat-link"
                        onClick={() => handleNavigateSection("bookings", "ALL")}
                      >
                        View all →
                      </button>
                    </div>

                    <div className="admin-stat-card stat-highlight-pink">
                      <div className="admin-stat-info">
                        <span className="admin-stat-label">
                          Pending Bookings
                        </span>
                        <strong className="admin-stat-value text-pink">
                          {pendingBookings.length}
                        </strong>
                        <span className="admin-stat-sub">
                          Awaiting verification
                        </span>
                      </div>
                      <button
                        type="button"
                        className="admin-stat-link"
                        onClick={() =>
                          handleNavigateSection(
                            "bookings",
                            "Pending Verification"
                          )
                        }
                      >
                        Review pending →
                      </button>
                    </div>

                    <div className="admin-stat-card stat-highlight-green">
                      <div className="admin-stat-info">
                        <span className="admin-stat-label">
                          Verified Bookings
                        </span>
                        <strong className="admin-stat-value text-green">
                          {verifiedBookings.length}
                        </strong>
                        <span className="admin-stat-sub">
                          Verified and confirmed
                        </span>
                      </div>
                      <button
                        type="button"
                        className="admin-stat-link"
                        onClick={() =>
                          handleNavigateSection("bookings", "Verified")
                        }
                      >
                        View verified →
                      </button>
                    </div>
                  </section>

                  {/* Quick Access to Pending Requests */}
                  <section className="admin-card">
                    <div className="admin-card-header">
                      <div>
                        <h2>Pending Booking Requests</h2>
                        <p>
                          Quick access to bookings requiring verification (
                          {pendingBookings.length})
                        </p>
                      </div>
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        onClick={() =>
                          handleNavigateSection(
                            "bookings",
                            "Pending Verification"
                          )
                        }
                      >
                        Filter Pending Bookings
                      </button>
                    </div>

                    {pendingBookings.length === 0 ? (
                      <div className="admin-empty-state">
                        <h3>No pending booking requests</h3>
                        <p>
                          All submitted care bookings have been reviewed. New
                          pending bookings will appear here automatically.
                        </p>
                      </div>
                    ) : (
                      <div className="admin-table-wrap">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Reference</th>
                              <th>Customer</th>
                              <th>Phone</th>
                              <th>Service</th>
                              <th>Preferred Date</th>
                              <th className="text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pendingBookings.slice(0, 5).map((req) => (
                              <tr key={req.id}>
                                <td>
                                  <span className="admin-ref-badge">
                                    {req.id}
                                  </span>
                                </td>
                                <td>
                                  <strong className="admin-cell-primary">
                                    {req.name || "N/A"}
                                  </strong>
                                </td>
                                <td>{req.phone || "N/A"}</td>
                                <td>{req.service || "N/A"}</td>
                                <td>{formatDate(req.preferredDate)}</td>
                                <td className="text-right">
                                  <div className="admin-table-actions">
                                    <button
                                      type="button"
                                      className="admin-action-btn action-verify"
                                      onClick={() => handleVerifyBooking(req)}
                                    >
                                      Verify
                                    </button>
                                    <button
                                      type="button"
                                      className="admin-action-btn"
                                      onClick={() =>
                                        handleOpenBookingDetails(req)
                                      }
                                    >
                                      View Details
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>

                  {/* Recent Booking Requests */}
                  <section className="admin-card">
                    <div className="admin-card-header">
                      <div>
                        <h2>Recent Booking Requests</h2>
                        <p>Latest care requests submitted by customers</p>
                      </div>
                      <button
                        type="button"
                        className="admin-btn admin-btn-primary"
                        onClick={() => handleNavigateSection("bookings", "ALL")}
                      >
                        Manage All Bookings
                      </button>
                    </div>

                    {recentBookings.length === 0 ? (
                      <div className="admin-empty-state">
                        <h3>No care bookings submitted yet</h3>
                        <p>
                          Bookings submitted through the public Care Booking
                          forms will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="admin-table-wrap">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Reference</th>
                              <th>Customer</th>
                              <th>Phone</th>
                              <th>Service</th>
                              <th>Preferred Date</th>
                              <th>Status</th>
                              <th className="text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentBookings.map((req) => (
                              <tr key={req.id}>
                                <td>
                                  <span className="admin-ref-badge">
                                    {req.id}
                                  </span>
                                </td>
                                <td>
                                  <strong className="admin-cell-primary">
                                    {req.name || "N/A"}
                                  </strong>
                                </td>
                                <td>{req.phone || "N/A"}</td>
                                <td>{req.service || "N/A"}</td>
                                <td>{formatDate(req.preferredDate)}</td>
                                <td>
                                  <span
                                    className={`admin-status-badge ${getStatusClass(
                                      req.status
                                    )}`}
                                  >
                                    {req.status || "Pending Verification"}
                                  </span>
                                </td>
                                <td className="text-right">
                                  <div className="admin-table-actions">
                                    {req.status === "Pending Verification" && (
                                      <button
                                        type="button"
                                        className="admin-action-btn action-verify"
                                        onClick={() => handleVerifyBooking(req)}
                                      >
                                        Verify
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      className="admin-action-btn"
                                      onClick={() =>
                                        handleOpenBookingDetails(req)
                                      }
                                    >
                                      View Details
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                </div>
              )}

              {/* ==================== 2. CARE BOOKINGS SECTION ==================== */}
              {activeSection === "bookings" && (
                <div className="admin-section-stack">
                  {/* Search & Filter Bar */}
                  <section className="admin-card admin-filter-bar">
                    <div className="admin-filter-field admin-filter-search">
                      <label htmlFor="booking-search">Search Bookings</label>
                      <input
                        id="booking-search"
                        type="search"
                        placeholder="Search by customer name, phone number, or reference..."
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                      />
                    </div>

                    <div className="admin-filter-field">
                      <label htmlFor="booking-status-filter">Status</label>
                      <select
                        id="booking-status-filter"
                        value={bookingStatusFilter}
                        onChange={(e) => setBookingStatusFilter(e.target.value)}
                      >
                        <option value="ALL">All Statuses</option>
                        {BOOKING_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="admin-filter-field">
                      <label htmlFor="booking-service-filter">Service</label>
                      <select
                        id="booking-service-filter"
                        value={bookingServiceFilter}
                        onChange={(e) => setBookingServiceFilter(e.target.value)}
                      >
                        <option value="ALL">All Services</option>
                        {ALL_CARE_SERVICES.map((srv) => (
                          <option key={srv} value={srv}>
                            {srv}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="admin-filter-field">
                      <label htmlFor="booking-date-filter">Date</label>
                      <input
                        id="booking-date-filter"
                        type="date"
                        value={bookingDateFilter}
                        onChange={(e) => setBookingDateFilter(e.target.value)}
                      />
                    </div>

                    {(bookingSearch ||
                      bookingStatusFilter !== "ALL" ||
                      bookingServiceFilter !== "ALL" ||
                      bookingDateFilter) && (
                      <div className="admin-filter-actions">
                        <button
                          type="button"
                          className="admin-btn admin-btn-secondary"
                          onClick={() => {
                            setBookingSearch("");
                            setBookingStatusFilter("ALL");
                            setBookingServiceFilter("ALL");
                            setBookingDateFilter("");
                          }}
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </section>

                  {/* Care Bookings Table */}
                  <section className="admin-card">
                    <div className="admin-card-header">
                      <div>
                        <h2>Submitted Care Bookings</h2>
                        <p>
                          Showing {filteredBookings.length} of{" "}
                          {sortedRequests.length} total bookings
                        </p>
                      </div>
                    </div>

                    {filteredBookings.length === 0 ? (
                      <div className="admin-empty-state">
                        <h3>No matching care bookings found</h3>
                        <p>
                          {sortedRequests.length === 0
                            ? "No customer care bookings have been submitted yet."
                            : "Try adjusting your search query, status filter, or date filter."}
                        </p>
                      </div>
                    ) : (
                      <div className="admin-table-wrap">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Reference</th>
                              <th>Customer</th>
                              <th>Service & Shift</th>
                              <th>Preferred Date</th>
                              <th>Status</th>
                              <th className="text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredBookings.map((req) => (
                              <tr key={req.id}>
                                <td>
                                  <span className="admin-ref-badge">
                                    {req.id}
                                  </span>
                                  <span className="admin-cell-sub">
                                    {formatDate(req.createdAt)}
                                  </span>
                                </td>
                                <td>
                                  <strong className="admin-cell-primary">
                                    {req.name || "N/A"}
                                  </strong>
                                  <span className="admin-cell-sub">
                                    {req.phone || "N/A"}
                                  </span>
                                </td>
                                <td>
                                  <strong className="admin-cell-primary">
                                    {req.service || "N/A"}
                                  </strong>
                                  <span className="admin-cell-sub">
                                    {req.service === "Blood Collection Service"
                                      ? (req.cprNumber ? `CPR: ${req.cprNumber}` : "Phlebotomy Visit")
                                      : (req.shift === "Other" && req.shiftOther
                                        ? req.shiftOther
                                        : req.shift || "Standard shift")}
                                  </span>
                                </td>
                                <td>{formatDate(req.preferredDate)}</td>
                                <td>
                                  <select
                                    aria-label={`Update status for ${req.id}`}
                                    className={`admin-status-select ${getStatusClass(
                                      req.status
                                    )}`}
                                    value={
                                      BOOKING_STATUSES.includes(req.status)
                                        ? req.status
                                        : "Pending Verification"
                                    }
                                    onChange={(e) =>
                                      handleBookingStatusChange(
                                        req.id,
                                        e.target.value
                                      )
                                    }
                                  >
                                    {BOOKING_STATUSES.map((st) => (
                                      <option key={st} value={st}>
                                        {st}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="text-right">
                                  <div className="admin-table-actions">
                                    {req.status === "Pending Verification" && (
                                      <button
                                        type="button"
                                        className="admin-action-btn action-verify"
                                        onClick={() => handleVerifyBooking(req)}
                                      >
                                        Verify
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      className="admin-action-btn"
                                      onClick={() =>
                                        handleOpenBookingDetails(req)
                                      }
                                    >
                                      Details
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                </div>
              )}

              {/* ==================== 2B. CONTACT ENQUIRIES SECTION ==================== */}
              {activeSection === "enquiries" && (
                <div className="admin-section-stack">
                  <section className="admin-card admin-filter-bar">
                    <div className="admin-filter-field admin-filter-search">
                      <label htmlFor="enquiry-search">Search Enquiries</label>
                      <input
                        id="enquiry-search"
                        type="search"
                        placeholder="Search by customer name, phone, email, subject, or message..."
                        value={enquirySearch}
                        onChange={(e) => setEnquirySearch(e.target.value)}
                      />
                    </div>

                    <div className="admin-filter-field">
                      <label htmlFor="enquiry-status-filter">Status</label>
                      <select
                        id="enquiry-status-filter"
                        value={enquiryStatusFilter}
                        onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                      >
                        <option value="ALL">All Statuses</option>
                        {ENQUIRY_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    {(enquirySearch || enquiryStatusFilter !== "ALL") && (
                      <div className="admin-filter-actions">
                        <button
                          type="button"
                          className="admin-btn admin-btn-secondary"
                          onClick={() => {
                            setEnquirySearch("");
                            setEnquiryStatusFilter("ALL");
                          }}
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </section>

                  <section className="admin-card">
                    <div className="admin-card-header">
                      <div>
                        <h2>Submitted Contact Enquiries</h2>
                        <p>
                          Showing {filteredEnquiries.length} of{" "}
                          {sortedEnquiries.length} enquiries from the Contact Us
                          page
                        </p>
                      </div>
                    </div>

                    {filteredEnquiries.length === 0 ? (
                      <div className="admin-empty-state">
                        <h3>No contact enquiries found</h3>
                        <p>
                          {sortedEnquiries.length === 0
                            ? "Enquiries submitted through the public Contact Us form will appear here."
                            : "No enquiries match your current search or status filter."}
                        </p>
                      </div>
                    ) : (
                      <div className="admin-table-wrap">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Customer</th>
                              <th>Contact</th>
                              <th>Subject</th>
                              <th>Submitted</th>
                              <th>Status</th>
                              <th className="text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredEnquiries.map((enq) => (
                              <tr key={enq.id}>
                                <td>
                                  <strong className="admin-cell-primary">
                                    {enq.fullName || "N/A"}
                                  </strong>
                                </td>
                                <td>
                                  <strong className="admin-cell-primary">
                                    {enq.phone || "N/A"}
                                  </strong>
                                  <span className="admin-cell-sub">
                                    {enq.email || "N/A"}
                                  </span>
                                </td>
                                <td>
                                  <strong className="admin-cell-primary">
                                    {enq.subject || "General Enquiry"}
                                  </strong>
                                  <span className="admin-cell-sub">
                                    {(enq.message || "").length > 60
                                      ? `${enq.message.slice(0, 60)}…`
                                      : enq.message || ""}
                                  </span>
                                </td>
                                <td>{formatDateTime(enq.createdAt)}</td>
                                <td>
                                  <select
                                    aria-label={`Update status for enquiry from ${enq.fullName}`}
                                    className={`admin-status-select ${getStatusClass(
                                      enq.status
                                    )}`}
                                    value={
                                      ENQUIRY_STATUSES.includes(enq.status)
                                        ? enq.status
                                        : "New"
                                    }
                                    onChange={(e) =>
                                      handleEnquiryStatusChange(
                                        enq.id,
                                        e.target.value
                                      )
                                    }
                                  >
                                    {ENQUIRY_STATUSES.map((st) => (
                                      <option key={st} value={st}>
                                        {st}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="text-right">
                                  <div className="admin-table-actions">
                                    <button
                                      type="button"
                                      className="admin-action-btn"
                                      onClick={() => setSelectedEnquiry(enq)}
                                    >
                                      View Details
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                </div>
              )}

              {/* ==================== 3. JOB APPLICATIONS SECTION ==================== */}
              {activeSection === "applications" && (
                <div className="admin-section-stack">
                  <section className="admin-card admin-filter-bar">
                    <div className="admin-filter-field admin-filter-search">
                      <label htmlFor="job-search">Search Applications</label>
                      <input
                        id="job-search"
                        type="search"
                        placeholder="Search by applicant name, phone, email, or role..."
                        value={jobSearch}
                        onChange={(e) => setJobSearch(e.target.value)}
                      />
                    </div>

                    <div className="admin-filter-field">
                      <label htmlFor="job-status-filter">Status</label>
                      <select
                        id="job-status-filter"
                        value={jobStatusFilter}
                        onChange={(e) => setJobStatusFilter(e.target.value)}
                      >
                        <option value="ALL">All Statuses</option>
                        {APPLICATION_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    {(jobSearch || jobStatusFilter !== "ALL") && (
                      <div className="admin-filter-actions">
                        <button
                          type="button"
                          className="admin-btn admin-btn-secondary"
                          onClick={() => {
                            setJobSearch("");
                            setJobStatusFilter("ALL");
                          }}
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </section>

                  <section className="admin-card">
                    <div className="admin-card-header">
                      <div>
                        <h2>Submitted Job Applications</h2>
                        <p>
                          Showing {filteredJobApplications.length} of{" "}
                          {sortedJobApplications.length} applications from the
                          Careers page
                        </p>
                      </div>
                    </div>

                    {filteredJobApplications.length === 0 ? (
                      <div className="admin-empty-state">
                        <h3>No job applications found</h3>
                        <p>
                          {sortedJobApplications.length === 0
                            ? "Applications submitted through the public Careers page will appear here."
                            : "No applications match your current search or filter."}
                        </p>
                      </div>
                    ) : (
                      <div className="admin-table-wrap">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Reference</th>
                              <th>Applicant</th>
                              <th>Position & Experience</th>
                              <th>Submitted</th>
                              <th>CV / Resume</th>
                              <th>Status</th>
                              <th className="text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredJobApplications.map((app) => {
                              const cvName =
                                app.cvFileName || app.resumeName || null;

                              return (
                                <tr key={app.id}>
                                  <td>
                                    <span className="admin-ref-badge">
                                      {app.id}
                                    </span>
                                  </td>
                                  <td>
                                    <strong className="admin-cell-primary">
                                      {app.fullName || "N/A"}
                                    </strong>
                                    <span className="admin-cell-sub">
                                      {app.phone || "N/A"}
                                    </span>
                                  </td>
                                  <td>
                                    <strong className="admin-cell-primary">
                                      {app.position || "N/A"}
                                    </strong>
                                    <span className="admin-cell-sub">
                                      {app.experience || "Not specified"}
                                    </span>
                                  </td>
                                  <td>{formatDate(app.submittedAt)}</td>
                                  <td>
                                    {app.hasCv ? (
                                      <button
                                        type="button"
                                        className="admin-action-btn"
                                        onClick={() =>
                                          handleOpenPrivateDocument(
                                            app.id,
                                            "cv"
                                          )
                                        }
                                      >
                                        Open CV
                                      </button>
                                    ) : cvName && cvName !== "Not provided" ? (
                                      <span
                                        className="admin-cv-filename"
                                        title={cvName}
                                      >
                                        {cvName}
                                      </span>
                                    ) : (
                                      <span className="admin-unassigned-text">
                                        Not provided
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <select
                                      aria-label={`Update status for ${app.id}`}
                                      className={`admin-status-select ${getStatusClass(
                                        app.status
                                      )}`}
                                      value={
                                        APPLICATION_STATUSES.includes(
                                          app.status
                                        )
                                          ? app.status
                                          : "Application Received"
                                      }
                                      onChange={(e) =>
                                        handleJobStatusChange(
                                          app.id,
                                          e.target.value
                                        )
                                      }
                                    >
                                      {APPLICATION_STATUSES.map((st) => (
                                        <option key={st} value={st}>
                                          {st}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="text-right">
                                    <div className="admin-table-actions">
                                      <button
                                        type="button"
                                        className="admin-action-btn"
                                        onClick={() => setSelectedJobApp(app)}
                                      >
                                        View Details
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ==================== MODAL 1: BOOKING DETAILS ==================== */}
      {selectedBooking && (
        <div
          className="admin-modal-overlay"
          onClick={() => setSelectedBooking(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
        >
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div>
                <h2 id="booking-modal-title">Care Booking Details</h2>
                <p className="admin-modal-subtitle">
                  Reference: <strong>{selectedBooking.id}</strong>
                </p>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedBooking(null)}
                aria-label="Close booking details modal"
              >
                ×
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-detail-banner">
                <div>
                  <span className="admin-detail-label">Service Requested</span>
                  <strong>{selectedBooking.service || "N/A"}</strong>
                </div>
                <div>
                  <label
                    htmlFor="modal-booking-status"
                    className="admin-detail-label"
                  >
                    Booking Status
                  </label>
                  <select
                    id="modal-booking-status"
                    className={`admin-status-select ${getStatusClass(
                      selectedBooking.status
                    )}`}
                    value={
                      BOOKING_STATUSES.includes(selectedBooking.status)
                        ? selectedBooking.status
                        : "Pending Verification"
                    }
                    onChange={(e) =>
                      handleBookingStatusChange(
                        selectedBooking.id,
                        e.target.value
                      )
                    }
                  >
                    {BOOKING_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-detail-section">
                <h3>Customer & Schedule</h3>
                <div className="admin-detail-grid">
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Customer Name</span>
                    <p>{selectedBooking.name || "N/A"}</p>
                  </div>
                  {selectedBooking.service === "Blood Collection Service" && (
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">CPR Number</span>
                      <p><strong>{selectedBooking.cprNumber || selectedBooking.patientDetails?.cprNumber || "N/A"}</strong></p>
                    </div>
                  )}
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Phone Number</span>
                    <p>{selectedBooking.phone || "N/A"}</p>
                  </div>
                  {selectedBooking.service !== "Blood Collection Service" && (
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Email Address</span>
                      <p>{selectedBooking.email || "Not provided"}</p>
                    </div>
                  )}
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Preferred Date</span>
                    <p>{formatDate(selectedBooking.preferredDate)}</p>
                  </div>
                  {selectedBooking.service !== "Blood Collection Service" && (
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Shift / Timing</span>
                      <p>
                        {selectedBooking.shift === "Other" &&
                        selectedBooking.shiftOther
                          ? selectedBooking.shiftOther
                          : selectedBooking.shift || "Not specified"}
                      </p>
                    </div>
                  )}
                  {selectedBooking.service !== "Blood Collection Service" && (
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Preferred Time</span>
                      <p>{selectedBooking.preferredTime || "Not specified"}</p>
                    </div>
                  )}
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Submitted At</span>
                    <p>{formatDateTime(selectedBooking.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="admin-detail-section">
                <h3>Clinical Details & Address</h3>
                <div className="admin-detail-grid">
                  {selectedBooking.service === "Blood Collection Service" && (
                    <div className="admin-detail-item admin-detail-full">
                      <span className="admin-detail-label">Preferred Tests</span>
                      <p style={{ whiteSpace: "pre-wrap", fontWeight: 500, lineHeight: 1.6 }}>
                        {selectedBooking.preferredTests || selectedBooking.patientDetails?.preferredTests || "Not specified"}
                      </p>
                    </div>
                  )}
                  {selectedBooking.service !== "Ventilator Patient Care" && selectedBooking.service !== "Blood Collection Service" && (
                    <div className="admin-detail-item admin-detail-full">
                      <span className="admin-detail-label">
                        Patient Condition / Care Need
                      </span>
                      <p>{selectedBooking.condition || "Not specified"}</p>
                    </div>
                  )}
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Block Number</span>
                    <p>
                      {selectedBooking.address?.blockNo ||
                        selectedBooking.address?.flatNo ||
                        selectedBooking.address?.flatVilla ||
                        "N/A"}
                    </p>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Building No.</span>
                    <p>
                      {selectedBooking.address?.buildingNo ||
                        selectedBooking.address?.buildingNumber ||
                        "N/A"}
                    </p>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Area</span>
                    <p>{selectedBooking.address?.area || "N/A"}</p>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Governorate</span>
                    <p>{selectedBooking.address?.governorate || "Not specified"}</p>
                  </div>
                  <div className="admin-detail-item admin-detail-full">
                    <span className="admin-detail-label">Additional Notes</span>
                    <p>
                      {selectedBooking.notes ||
                        "No additional notes provided."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="admin-detail-section">
                <h3>Status History</h3>
                {loadingHistory ? (
                  <p>Loading status history...</p>
                ) : bookingHistory.length === 0 ? (
                  <p>No status transitions recorded yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {bookingHistory.map((entry) => (
                      <div
                        key={entry.id}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "8px",
                          backgroundColor: "#F8F9FA",
                          border: "1px solid #E8E8EC",
                          fontSize: "13px",
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "12px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span>
                          <strong>{entry.newStatus}</strong>
                          {entry.previousStatus ? ` (from ${entry.previousStatus})` : " (Initial)"}
                        </span>
                        <span style={{ color: "#6B6B6B" }}>
                          {entry.changedBy} · {formatDateTime(entry.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="admin-modal-footer">
              {selectedBooking.status === "Pending Verification" && (
                <button
                  type="button"
                  className="admin-btn admin-btn-green"
                  onClick={() => handleVerifyBooking(selectedBooking)}
                >
                  Verify Booking
                </button>
              )}
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: JOB APPLICATION DETAILS ==================== */}
      {selectedJobApp && (
        <div
          className="admin-modal-overlay"
          onClick={() => setSelectedJobApp(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="job-modal-title"
        >
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div>
                <h2 id="job-modal-title">Job Application Details</h2>
                <p className="admin-modal-subtitle">
                  Reference: <strong>{selectedJobApp.id}</strong>
                </p>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedJobApp(null)}
                aria-label="Close job application modal"
              >
                ×
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-detail-banner">
                <div>
                  <span className="admin-detail-label">Position Applied For</span>
                  <strong>{selectedJobApp.position || "N/A"}</strong>
                </div>
                <div>
                  <label
                    htmlFor="modal-job-status"
                    className="admin-detail-label"
                  >
                    Application Status
                  </label>
                  <select
                    id="modal-job-status"
                    className={`admin-status-select ${getStatusClass(
                      selectedJobApp.status
                    )}`}
                    value={
                      APPLICATION_STATUSES.includes(selectedJobApp.status)
                        ? selectedJobApp.status
                        : "Application Received"
                    }
                    onChange={(e) =>
                      handleJobStatusChange(selectedJobApp.id, e.target.value)
                    }
                  >
                    {APPLICATION_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-detail-section">
                <h3>Applicant Information</h3>
                <div className="admin-detail-grid">
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Full Name</span>
                    <p>{selectedJobApp.fullName || "N/A"}</p>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Phone Number</span>
                    <p>{selectedJobApp.phone || "N/A"}</p>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Email Address</span>
                    <p>{selectedJobApp.email || "N/A"}</p>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Qualification</span>
                    <p>{selectedJobApp.qualification || "Not specified"}</p>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Experience</span>
                    <p>{selectedJobApp.experience || "Not specified"}</p>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">NHRA / License Status</span>
                    <p>{selectedJobApp.licenseNumber || "Not specified"}</p>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Availability</span>
                    <p>{selectedJobApp.availability || selectedJobApp.preferredShift || "Not specified"}</p>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Submitted At</span>
                    <p>{formatDateTime(selectedJobApp.submittedAt)}</p>
                  </div>
                </div>
              </div>

              <div className="admin-detail-section">
                <h3>CV & Cover Note</h3>
                <div className="admin-detail-grid">
                  <div className="admin-detail-item admin-detail-full">
                    <span className="admin-detail-label">Uploaded CV (Private Storage)</span>
                    {selectedJobApp.hasCv ? (
                      <p>
                        <button
                          type="button"
                          className="admin-action-btn"
                          onClick={() =>
                            handleOpenPrivateDocument(selectedJobApp.id, "cv")
                          }
                        >
                          Download / View CV (
                          {selectedJobApp.cvFileName || "Document"})
                        </button>
                      </p>
                    ) : (
                      <p>No CV file uploaded.</p>
                    )}
                  </div>
                  {selectedJobApp.hasCertificate && (
                    <div className="admin-detail-item admin-detail-full">
                      <span className="admin-detail-label">
                        Uploaded Certification (Private Storage)
                      </span>
                      <p>
                        <button
                          type="button"
                          className="admin-action-btn"
                          onClick={() =>
                            handleOpenPrivateDocument(
                              selectedJobApp.id,
                              "certificate"
                            )
                          }
                        >
                          Download / View Certificate (
                          {selectedJobApp.certificateFileName || "Certificate"})
                        </button>
                      </p>
                    </div>
                  )}
                  <div className="admin-detail-item admin-detail-full">
                    <span className="admin-detail-label">
                      Cover Letter / Message
                    </span>
                    <p className="admin-detail-notes">
                      {selectedJobApp.coverLetter ||
                        selectedJobApp.message ||
                        "No cover message provided."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setSelectedJobApp(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 3: CONTACT ENQUIRY DETAILS ==================== */}
      {selectedEnquiry && (
        <div
          className="admin-modal-overlay"
          onClick={() => setSelectedEnquiry(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-modal-title"
        >
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div>
                <h2 id="enquiry-modal-title">Contact Enquiry Details</h2>
                <p className="admin-modal-subtitle">
                  Submitted: <strong>{formatDateTime(selectedEnquiry.createdAt)}</strong>
                </p>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedEnquiry(null)}
                aria-label="Close contact enquiry modal"
              >
                ×
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-detail-banner">
                <div>
                  <span className="admin-detail-label">Subject</span>
                  <strong>{selectedEnquiry.subject || "General Enquiry"}</strong>
                </div>
                <div>
                  <label
                    htmlFor="modal-enquiry-status"
                    className="admin-detail-label"
                  >
                    Enquiry Status
                  </label>
                  <select
                    id="modal-enquiry-status"
                    className={`admin-status-select ${getStatusClass(
                      selectedEnquiry.status
                    )}`}
                    value={
                      ENQUIRY_STATUSES.includes(selectedEnquiry.status)
                        ? selectedEnquiry.status
                        : "New"
                    }
                    onChange={(e) =>
                      handleEnquiryStatusChange(
                        selectedEnquiry.id,
                        e.target.value
                      )
                    }
                  >
                    {ENQUIRY_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-detail-section">
                <h3>Sender Information</h3>
                <div className="admin-detail-grid">
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Full Name</span>
                    <p>{selectedEnquiry.fullName || "N/A"}</p>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Phone Number</span>
                    <p>{selectedEnquiry.phone || "N/A"}</p>
                  </div>
                  <div className="admin-detail-item admin-detail-full">
                    <span className="admin-detail-label">Email Address</span>
                    <p>{selectedEnquiry.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="admin-detail-section">
                <h3>Enquiry Message</h3>
                <div className="admin-detail-grid">
                  <div className="admin-detail-item admin-detail-full">
                    <p className="admin-detail-notes">
                      {selectedEnquiry.message || "No message content."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setSelectedEnquiry(null)}
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
