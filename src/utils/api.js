import { supabase, isSupabaseAuthConfigured } from "./supabaseClient";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

// Non-sensitive UI preference key: stores only the 12-char reference code (e.g., "REQ-12345678"),
// never any patient, customer, or booking record.
const LAST_BOOKING_REF_KEY = "noor_last_booking_ref";

// Signed JWT access token key (never stores any password or credential)
const ADMIN_SESSION_TOKEN_KEY = "noor_admin_access_token";

export async function getActiveAdminAccessToken() {
  if (supabase) {
    const { data, error } = await supabase.auth.getSession();
    if (!error && data?.session?.access_token) {
      return data.session.access_token;
    }
  }
  try {
    return sessionStorage.getItem(ADMIN_SESSION_TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

function setStoredAdminAccessToken(token) {
  try {
    if (token) {
      sessionStorage.setItem(ADMIN_SESSION_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
    }
  } catch {
    // Ignore storage errors
  }
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
    throw new Error(
      "Unable to reach the server. Please ensure the backend API is running."
    );
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
// SUPABASE ADMIN SETUP, REGISTRATION, LOGIN & AUTHORIZATION API
// ============================================================================

/**
 * Checks whether the initial administrator account has already been created.
 */
export async function fetchAdminSetupStatus() {
  return apiRequest("/api/admin/auth/setup-status");
}

/**
 * Controlled first-admin registration:
 * Creates the initial administrator in Supabase `auth.users` and authorizes them in `public.admins`.
 * Automatically blocked by the backend with HTTP 403 once the first admin exists.
 */
export async function registerFirstAdmin({
  fullName,
  email,
  password,
  confirmPassword,
  setupKey,
}) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  let clientAccessToken = null;
  let requiresEmailConfirmation = false;

  if (isSupabaseAuthConfigured && supabase) {
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: String(password || ""),
      options: {
        data: {
          full_name: String(fullName || "NOOR AL AFIYA Administrator").trim(),
        },
      },
    });

    if (!error && data?.user) {
      if (data.session?.access_token) {
        clientAccessToken = data.session.access_token;
      } else if (!data.user.email_confirmed_at) {
        requiresEmailConfirmation = true;
      }
    }
  }

  const response = await apiRequest("/api/admin/auth/register-first-admin", {
    method: "POST",
    body: JSON.stringify({
      fullName: String(fullName || "NOOR AL AFIYA Administrator").trim(),
      email: normalizedEmail,
      password: String(password || ""),
      confirmPassword: String(confirmPassword || ""),
      setupKey: setupKey ? String(setupKey).trim() : undefined,
      accessToken: clientAccessToken,
    }),
  });

  if (supabase) {
    await supabase.auth.signOut().catch(() => {});
  }
  setStoredAdminAccessToken(null);

  return {
    ...response,
    requiresEmailConfirmation,
  };
}

/**
 * Signs in with Supabase Auth (`signInWithPassword` or backend Supabase `auth.users` authenticator)
 * and immediately verifies backend administrator authorization (`GET /api/admin/auth/me`).
 * If the user is authenticated in `auth.users` but is NOT an authorized admin in `public.admins`,
 * immediately signs out and throws a 403 error.
 */
export async function loginAdmin(email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const cleanPassword = String(password || "");

  if (isSupabaseAuthConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: cleanPassword,
    });

    if (error || !data?.session?.access_token) {
      throw new Error("Invalid email or password. Please try again.");
    }

    try {
      const authCheck = await apiRequest("/api/admin/auth/me", {
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      });
      setStoredAdminAccessToken(data.session.access_token);
      return authCheck;
    } catch (verifyError) {
      await supabase.auth.signOut().catch(() => {});
      setStoredAdminAccessToken(null);
      throw verifyError;
    }
  }

  // Authenticate via backend against Supabase PostgreSQL `auth.users` & `public.admins`
  const loginData = await apiRequest("/api/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: normalizedEmail,
      password: cleanPassword,
    }),
  });

  if (!loginData?.accessToken) {
    throw new Error("Invalid email or password. Please try again.");
  }

  setStoredAdminAccessToken(loginData.accessToken);
  return { admin: loginData.admin };
}

export async function logoutAdmin() {
  setStoredAdminAccessToken(null);
  if (supabase) {
    await supabase.auth.signOut().catch(() => {});
  }
  await apiRequest("/api/admin/auth/logout", {
    method: "POST",
  }).catch(() => {});
}

export async function requestAdminPasswordReset(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!isSupabaseAuthConfigured || !supabase) {
    throw new Error(
      "To send password reset emails from the browser, please configure VITE_SUPABASE_ANON_KEY in your .env file."
    );
  }

  const redirectTo = `${window.location.origin}/admin/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo,
  });

  if (error) {
    throw new Error(error.message || "Unable to send password reset email.");
  }

  return {
    message:
      "If an administrator account exists for that email, a password reset link has been sent.",
  };
}

export async function updateAdminPassword(newPassword) {
  if (!isSupabaseAuthConfigured || !supabase) {
    throw new Error(
      "Supabase Auth is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file."
    );
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

export async function fetchCurrentAdmin() {
  const accessToken = await getActiveAdminAccessToken();
  if (!accessToken) {
    const err = new Error("No active administrator session.");
    err.status = 401;
    throw err;
  }

  return apiRequest("/api/admin/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

// ============================================================================
// ADMIN BOOKING & JOB APPLICATION MANAGEMENT API
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

export async function fetchAdminJobApplications() {
  const data = await apiRequest("/api/admin/job-applications");
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
