import { useEffect, useState } from "react";
import usePageMeta from "../../utils/usePageMeta";
import { Link, useNavigate } from "react-router-dom";
import {
  clearAdminSessionState,
  fetchCurrentAdmin,
  getActiveAdminAccessToken,
  logoutAdmin,
  requestAdminPasswordReset,
} from "../../utils/api";
import { supabase } from "../../utils/supabaseClient";
import "./AdminLogin.css";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

function isNetworkFailure(err) {
  const msg = String(err?.message || "").toLowerCase();
  return (
    Boolean(err?.isNetworkError) ||
    msg.includes("failed to fetch") ||
    msg.includes("fetch failed") ||
    msg.includes("networkerror") ||
    msg.includes("network request failed") ||
    msg.includes("load failed")
  );
}

export default function AdminLogin() {
  usePageMeta({"title":"Admin Login | NOOR AL AFIYA","noindex":true});
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [forgotMode, setForgotMode] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkExistingSession() {
      try {
        const accessToken = await getActiveAdminAccessToken();
        if (!accessToken) {
          if (active) setCheckingSession(false);
          return;
        }

        await fetchCurrentAdmin(accessToken);
        if (active) {
          navigate("/admin", { replace: true });
        }
      } catch (err) {
        await logoutAdmin();
        if (active && err?.status === 403) {
          setError(
            "You are authenticated, but you do not have administrator access."
          );
        }
      } finally {
        if (active) {
          setCheckingSession(false);
        }
      }
    }

    checkExistingSession();

    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Please enter your administrator email address.");
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (!supabase) {
      setError(
        "Supabase Authentication is not configured. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
      );
      return;
    }

    setIsLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (authError || !data?.session?.access_token || !data?.user?.id) {
        if (isNetworkFailure(authError)) {
          setError(
            "Network error. Unable to reach Supabase Authentication. Please check your connection and try again."
          );
        } else {
          setError("Invalid email or password. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      // Verify database-backed administrator authorization in public.admins
      try {
        await fetchCurrentAdmin(data.session.access_token);
        navigate("/admin", { replace: true });
      } catch (verifyError) {
        await supabase.auth.signOut().catch(() => {});
        clearAdminSessionState();
        if (verifyError?.status === 403) {
          setError(
            "You are authenticated, but you do not have administrator access."
          );
        } else if (isNetworkFailure(verifyError)) {
          setError(
            "Network error while verifying administrator access. Please try again."
          );
        } else {
          setError(
            verifyError?.message ||
              "Unable to verify administrator authorization. Please try again."
          );
        }
        setIsLoading(false);
      }
    } catch (err) {
      if (isNetworkFailure(err)) {
        setError(
          "Network error. Unable to reach Supabase Authentication. Please check your connection and try again."
        );
      } else {
        setError(err.message || "Invalid email or password. Please try again.");
      }
      setIsLoading(false);
    }
  }

  async function handleForgotSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Please enter your administrator email address.");
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await requestAdminPasswordReset(trimmedEmail);
      setNotice(
        result.message ||
          "Password reset instructions have been sent to your email."
      );
    } catch (err) {
      setError(
        err.message || "Unable to send password reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-decoration admin-login-decoration-one" />
      <div className="admin-login-decoration admin-login-decoration-two" />
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <Link className="admin-login-brand" to="/" aria-label="NOOR AL AFIYA home">
          <span className="admin-login-mark">✚</span>
          <span>
            <strong>NOOR AL AFIYA</strong>
            <small>HOME HEALTH CARE WLL</small>
          </span>
        </Link>
        <div className="admin-login-icon" aria-hidden="true">⌘</div>
        <p className="admin-login-eyebrow">SECURE AREA</p>

        {!forgotMode ? (
          <>
            <h1 id="admin-login-title">Admin Login</h1>
            <p className="admin-login-intro">
              Login with your authorized administrator credentials to manage
              care bookings, enquiries, and job applications.
            </p>

            <form
              onSubmit={handleLoginSubmit}
              className="admin-login-form"
              noValidate
            >
              <label htmlFor="admin-email">Administrator Email</label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter administrator email"
                disabled={isLoading || checkingSession}
                required
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <label htmlFor="admin-password">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotMode(true);
                    setError("");
                    setNotice("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    color: "#FF3A94",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="admin-password-field">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading || checkingSession}
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={isLoading || checkingSession}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {error && (
                <p className="admin-login-error" role="alert">
                  {error}
                </p>
              )}
              {notice && (
                <p
                  role="status"
                  style={{
                    margin: "4px 0 0",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "#F3F9EA",
                    border: "1px solid #96C855",
                    color: "#252525",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {notice}
                </p>
              )}
              <button
                className="admin-login-submit"
                type="submit"
                disabled={isLoading || checkingSession}
              >
                {checkingSession
                  ? "Checking session…"
                  : isLoading
                  ? "Logging in…"
                  : "Login"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 id="admin-login-title">Reset Password</h1>
            <p className="admin-login-intro">
              Enter your administrator email address to receive a password reset
              link via Supabase Auth.
            </p>
            <form
              onSubmit={handleForgotSubmit}
              className="admin-login-form"
              noValidate
            >
              <label htmlFor="admin-reset-email">Administrator Email</label>
              <input
                id="admin-reset-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter administrator email"
                disabled={isLoading}
                required
              />
              {error && (
                <p className="admin-login-error" role="alert">
                  {error}
                </p>
              )}
              {notice && (
                <p
                  role="status"
                  style={{
                    margin: "4px 0 0",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "#F3F9EA",
                    border: "1px solid #96C855",
                    color: "#252525",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {notice}
                </p>
              )}
              <button
                className="admin-login-submit"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Sending reset link…" : "Send password reset link"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForgotMode(false);
                  setError("");
                  setNotice("");
                }}
                style={{
                  marginTop: "6px",
                  background: "none",
                  border: "none",
                  color: "#FF3A94",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                ← Back to Login
              </button>
            </form>
          </>
        )}

        <div className="admin-login-note">
          <span>✓</span> Authorized administrators only
        </div>
        <Link className="admin-login-back" to="/">
          ← Back to website
        </Link>
      </section>
      <p className="admin-login-copyright">
        © {new Date().getFullYear()} NOOR AL AFIYA · Bahrain
      </p>
    </main>
  );
}
