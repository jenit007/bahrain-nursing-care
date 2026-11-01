import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchAdminSetupStatus,
  fetchCurrentAdmin,
  getActiveAdminAccessToken,
  loginAdmin,
  logoutAdmin,
  requestAdminPasswordReset,
} from "../../utils/api";
import "./AdminLogin.css";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(
    justRegistered
      ? "Initial administrator account created and authorized. Please sign in below."
      : ""
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [registrationAllowed, setRegistrationAllowed] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkExistingSessionAndSetup() {
      try {
        const setupStatus = await fetchAdminSetupStatus().catch(() => null);
        if (active && setupStatus) {
          setRegistrationAllowed(Boolean(setupStatus.registrationAllowed));
        }

        const accessToken = await getActiveAdminAccessToken();
        if (!accessToken) {
          if (active) setCheckingSession(false);
          return;
        }

        await fetchCurrentAdmin();
        if (active) {
          navigate("/admin", { replace: true });
        }
      } catch {
        await logoutAdmin();
      } finally {
        if (active) {
          setCheckingSession(false);
        }
      }
    }

    checkExistingSessionAndSetup();

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

    setIsLoading(true);
    try {
      await loginAdmin(trimmedEmail, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(
        err.message || "Invalid email or password. Please try again."
      );
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
            <h1 id="admin-login-title">Admin sign in</h1>
            <p className="admin-login-intro">
              Sign in to manage care bookings and job applications.
            </p>

            {registrationAllowed && (
              <div
                style={{
                  marginBottom: "18px",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  background: "#FFF0F7",
                  border: "1px solid rgba(255, 58, 148, 0.3)",
                  fontSize: "13px",
                  lineHeight: 1.5,
                  color: "#252525",
                }}
              >
                <strong style={{ display: "block", marginBottom: "4px", color: "#FF3A94" }}>
                  First-Time Admin Setup
                </strong>
                <span>
                  No administrator account has been created yet.{" "}
                </span>
                <Link
                  to="/admin/register"
                  style={{
                    color: "#FF3A94",
                    fontWeight: 700,
                    textDecoration: "underline",
                  }}
                >
                  Create First Admin Account →
                </Link>
              </div>
            )}

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
                placeholder="nooralafiyahomecare@gmail.com"
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
                {isLoading ? (
                  "Signing in…"
                ) : (
                  <>
                    Sign in to dashboard <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 id="admin-login-title">Reset password</h1>
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
                placeholder="nooralafiyahomecare@gmail.com"
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
                ← Back to sign in
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
