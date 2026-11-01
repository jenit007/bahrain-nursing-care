import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutAdmin, updateAdminPassword } from "../../utils/api";
import { supabase } from "../../utils/supabaseClient";
import "./AdminLogin.css";

export default function AdminResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkRecoverySession() {
      if (!supabase) {
        if (active) setCheckingSession(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (active) {
        setHasRecoverySession(Boolean(data?.session));
        setCheckingSession(false);
      }
    }

    checkRecoverySession();

    const { data: subscription } = supabase
      ? supabase.auth.onAuthStateChange((event, session) => {
          if (!active) return;
          if (event === "PASSWORD_RECOVERY" || session) {
            setHasRecoverySession(true);
            setCheckingSession(false);
          }
        })
      : { data: { subscription: null } };

    return () => {
      active = false;
      subscription?.subscription?.unsubscribe?.();
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!password || password.length < 10) {
      setError("New password must be at least 10 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please confirm your new password.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateAdminPassword(password);
      setSuccess(
        result.message || "Your password has been updated. Redirecting to sign in…"
      );
      await logoutAdmin();
      setTimeout(() => {
        navigate("/admin/login", { replace: true });
      }, 1800);
    } catch (err) {
      setError(
        err.message || "Unable to update your password. Your recovery link may have expired."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-decoration admin-login-decoration-one" />
      <div className="admin-login-decoration admin-login-decoration-two" />
      <section className="admin-login-card" aria-labelledby="reset-password-title">
        <Link className="admin-login-brand" to="/" aria-label="NOOR AL AFIYA home">
          <span className="admin-login-mark">✚</span>
          <span>
            <strong>NOOR AL AFIYA</strong>
            <small>HOME HEALTH CARE WLL</small>
          </span>
        </Link>
        <div className="admin-login-icon" aria-hidden="true">⌘</div>
        <p className="admin-login-eyebrow">PASSWORD RECOVERY</p>
        <h1 id="reset-password-title">Set new admin password</h1>

        {checkingSession ? (
          <p className="admin-login-intro">Verifying password recovery link…</p>
        ) : !hasRecoverySession && !success ? (
          <>
            <p className="admin-login-intro">
              This password reset page requires a valid recovery link sent to
              your administrator email.
            </p>
            <p className="admin-login-error" role="alert">
              No active password recovery session found. Please request a new
              password reset link from the admin sign-in page.
            </p>
            <Link className="admin-login-back" to="/admin/login">
              ← Return to Admin Sign In
            </Link>
          </>
        ) : (
          <>
            <p className="admin-login-intro">
              Choose a strong password (at least 10 characters) for your
              NOOR AL AFIYA administrator account.
            </p>
            <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
              <label htmlFor="new-admin-password">New Password</label>
              <div className="admin-password-field">
                <input
                  id="new-admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={isLoading || Boolean(success)}
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={isLoading || Boolean(success)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <label htmlFor="confirm-admin-password">Confirm New Password</label>
              <input
                id="confirm-admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                disabled={isLoading || Boolean(success)}
                required
              />

              {error && (
                <p className="admin-login-error" role="alert">
                  {error}
                </p>
              )}
              {success && (
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
                  {success}
                </p>
              )}

              <button
                className="admin-login-submit"
                type="submit"
                disabled={isLoading || Boolean(success)}
              >
                {isLoading ? "Updating password…" : "Update password"}
              </button>
            </form>
            <Link className="admin-login-back" to="/admin/login">
              ← Back to Admin Sign In
            </Link>
          </>
        )}
      </section>
      <p className="admin-login-copyright">
        © {new Date().getFullYear()} NOOR AL AFIYA · Bahrain
      </p>
    </main>
  );
}
