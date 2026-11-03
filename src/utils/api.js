// The Supabase client is only needed for admin authentication, so it is loaded on demand
// to keep it out of the public pages' initial JavaScript bundle.
// NOTE: keep in sync with ADMIN_AUTH_STORAGE_KEY in ./supabaseClient.js
const ADMIN_AUTH_STORAGE_KEY = "noor_supabase_admin_auth";

async function loadSupabase() {
  const mod = await import("./supabaseClient");
  return mod.supabase;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

// Non-sensitive UI preference key: stores only the 12-char reference code (e.g., "REQ-12345678"),
// never any patient, customer, or booking record.
const LAST_BOOKING_REF_KEY = "noor_last_booking_ref";
const LEGACY_ADMIN_TOKEN_KEY = "noor_admin_access_token";

export async function getActiveAdminAccessToken() {
  const supabase = await loadSupabase();
  if (!supabase) {
    return null;
  }
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data?.session?.access_token) {
      return null;
    }
    return data.session.access_token;
  } catch {
    return null;
  }
}

export function clearAdminSessionState() {
  try {
    localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    sessionStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

function isNetworkFailure(err) {
  const msg = String(err?.message || "").toLowerCase();
  return (
    msg.includes("failed to fetch") ||
    msg.includes("fetch failed") ||
    msg.includes("networkerror") ||
    msg.includes("network request failed") ||
    msg.includes("load failed")
  );
}

async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const method = (options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Automatically attach Supabase Auth Bearer token for protected /api/admin/* endpoints
  if (path.startsWith("/api/admin") && !headers.has("Authorization")) {
    const accessToken = await getActiveAdminAccessToken();
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      method,
      headers,
      credentials: "include",
    });
  } catch {
    const netErr = new Error(
      "Network error. Unable to reach the server. Please check your connection and try again."
    );
    netErr.isNetworkError = true;
    throw netErr;
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => ({}))
    : {};

  if (!response.ok) {
    const error = new Error(
      data.error || `Request failed with status ${response.status}`
    );
    error.status = response.status;
    error.details = data.details || null;
    error.data = data;
    throw error;
  }

  return data;
}

// ============================================================================
// PUBLIC CUSTOMER BOOKING & TRACKING API
// ============================================================================

export function getSavedBookingReference() {
  try {
    return sessionStorage.getItem(LAST_BOOKING_REF_KEY) || "";
  } catch {
    return "";
  }
}

export function saveBookingReference(reference) {
  try {
    if (reference) {
      sessionStorage.setItem(
        LAST_BOOKING_REF_KEY,
        String(reference).trim().toUpperCase()
      );
    }
  } catch {
    // Ignore storage restriction errors
  }
}

export async function createCareBooking(payload) {
  const data = await apiRequest("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (data?.booking?.bookingReference) {
    saveBookingReference(data.booking.bookingReference);
  }
  return data.booking;
}

export async function trackCareBooking(reference) {
  const cleanRef = String(reference || "").trim().toUpperCase();
  const data = await apiRequest(
    `/api/bookings/track/${encodeURIComponent(cleanRef)}`
  );
  if (data?.booking?.bookingReference) {
    saveBookingReference(data.booking.bookingReference);
  }
  return data.booking;
}

// ============================================================================
// PUBLIC CONTACT ENQUIRY API
// ============================================================================

export async function submitContactEnquiry(payload) {
  return apiRequest("/api/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ============================================================================
// PUBLIC JOB APPLICATION API
// ============================================================================

export async function submitJobApplication(formValues, cvFile, certificateFile) {
  const formData = new FormData();
  Object.entries(formValues || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  if (cvFile) {
    formData.append("cv", cvFile);
  }
  if (certificateFile) {
    formData.append("certificate", certificateFile);
  }

  return apiRequest("/api/jobs/apply", {
    method: "POST",
    body: formData,
  });
}

// ============================================================================
// SUPABASE ADMIN LOGIN, SESSION & AUTHORIZATION API
// ============================================================================

export async function verifyAdminAuthorization(accessToken) {
  if (!accessToken) {
    const err = new Error("Authentication required. Please login with your administrator account.");
    err.status = 401;
    throw err;
  }

  return apiRequest("/api/admin/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function loginAdmin(email, password) {
  const supabase = await loadSupabase();
  if (!supabase) {
    throw new Error(
      "Supabase Authentication is not configured. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    );
  }

  const normalizedEmail = String(email || "").trim().toLowerCase();
  const cleanPassword = String(password || "");

  let data;
  let error;
  try {
    const response = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: cleanPassword,
    });
    data = response.data;
    error = response.error;
  } catch (err) {
    if (isNetworkFailure(err)) {
      throw new Error(
        "Network error. Unable to reach Supabase Authentication. Please check your internet connection and try again."
      );
    }
    throw err;
  }

  if (error || !data?.session?.access_token || !data?.user?.id) {
    if (isNetworkFailure(error)) {
      throw new Error(
        "Network error. Unable to reach Supabase Authentication. Please check your internet connection and try again."
      );
    }
    const isInvalidCreds =
      error?.code === "invalid_credentials" ||
      String(error?.message || "")
        .toLowerCase()
        .includes("invalid login credentials");
    const authErr = new Error(
      isInvalidCreds
        ? "Invalid email or password. Please try again."
        : error?.message || "Invalid email or password. Please try again."
    );
    authErr.status = error?.status || 401;
    throw authErr;
  }

  try {
    const authCheck = await verifyAdminAuthorization(data.session.access_token);
    return authCheck;
  } catch (verifyError) {
    await supabase.auth.signOut().catch(() => {});
    clearAdminSessionState();
    if (verifyError?.status === 403) {
      const forbiddenErr = new Error(
        "You are authenticated, but you do not have administrator access."
      );
      forbiddenErr.status = 403;
      throw forbiddenErr;
    }
    throw verifyError;
  }
}

export async function logoutAdmin() {
  const supabase = await loadSupabase();
  if (supabase) {
    await supabase.auth.signOut().catch(() => {});
  }
  clearAdminSessionState();
  await apiRequest("/api/admin/auth/logout", {
    method: "POST",
  }).catch(() => {});
}

export async function requestAdminPasswordReset(email) {
  const supabase = await loadSupabase();
  if (!supabase) {
    throw new Error("Supabase Authentication is not configured.");
  }

  const normalizedEmail = String(email || "").trim().toLowerCase();
  const redirectTo = `${window.location.origin}/admin/reset-password`;

  let error;
  try {
    const res = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo,
    });
    error = res.error;
  } catch (err) {
    if (isNetworkFailure(err)) {
      throw new Error(
        "Network error. Unable to reach Supabase Authentication. Please try again."
      );
    }
    throw err;
  }

  if (error) {
    if (isNetworkFailure(error)) {
      throw new Error(
        "Network error. Unable to reach Supabase Authentication. Please try again."
      );
    }
    throw new Error(error.message || "Unable to send password reset email.");
  }

  return {
    message:
      "If an administrator account exists for that email, a password reset link has been sent.",
  };
}

export async function updateAdminPassword(newPassword) {
  const supabase = await loadSupabase();
  if (!supabase) {
    throw new Error("Supabase Authentication is not configured.");
  }

  const { error } = await supabase.auth.updateUser({
    password: String(newPassword || ""),
  });

  if (error) {
    throw new Error(error.message || "Unable to update password.");
  }

  return {
    message: "Your administrator password has been updated successfully.",
  };
}

export async function fetchCurrentAdmin(accessTokenOverride) {
  const accessToken =
    accessTokenOverride || (await getActiveAdminAccessToken());
  if (!accessToken) {
    const err = new Error("No active administrator session.");
    err.status = 401;
    throw err;
  }

  return verifyAdminAuthorization(accessToken);
}

// ============================================================================
// ADMIN BOOKING, ENQUIRY & JOB APPLICATION MANAGEMENT API
// ============================================================================

export async function fetchAdminBookings(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.status && params.status !== "ALL")
    searchParams.set("status", params.status);
  if (params.date) searchParams.set("date", params.date);

  const query = searchParams.toString();
  const data = await apiRequest(
    `/api/admin/bookings${query ? `?${query}` : ""}`
  );
  return data.bookings || [];
}

export async function fetchAdminBookingDetails(idOrRef) {
  const data = await apiRequest(
    `/api/admin/bookings/${encodeURIComponent(idOrRef)}`
  );
  return data.booking;
}

export async function fetchAdminBookingHistory(idOrRef) {
  const data = await apiRequest(
    `/api/admin/bookings/${encodeURIComponent(idOrRef)}/history`
  );
  return data.history || [];
}

export async function updateAdminBookingStatus(idOrRef, status) {
  const data = await apiRequest(
    `/api/admin/bookings/${encodeURIComponent(idOrRef)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
  return data.booking;
}

export async function fetchAdminContactEnquiries(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.status && params.status !== "ALL")
    searchParams.set("status", params.status);

  const query = searchParams.toString();
  const data = await apiRequest(
    `/api/admin/enquiries${query ? `?${query}` : ""}`
  );
  return data.enquiries || [];
}

export async function updateAdminContactEnquiryStatus(id, status) {
  const data = await apiRequest(
    `/api/admin/enquiries/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
  return data.enquiry;
}

export async function fetchAdminJobApplications(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.status && params.status !== "ALL")
    searchParams.set("status", params.status);

  const query = searchParams.toString();
  const data = await apiRequest(
    `/api/admin/job-applications${query ? `?${query}` : ""}`
  );
  return data.applications || [];
}

export async function updateAdminJobApplicationStatus(idOrRef, status) {
  const data = await apiRequest(
    `/api/admin/job-applications/${encodeURIComponent(idOrRef)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
  return data.application;
}

export async function fetchJobApplicationSignedDocumentUrl(idOrRef, type = "cv") {
  const data = await apiRequest(
    `/api/admin/job-applications/${encodeURIComponent(
      idOrRef
    )}/document?type=${encodeURIComponent(type)}`
  );
  return data.signedUrl;
}
