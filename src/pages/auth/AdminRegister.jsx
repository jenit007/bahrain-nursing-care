import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchAdminSetupStatus,
  registerFirstAdmin,
} from "../../utils/api";
import "./AdminLogin.css";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

function validatePassword(password) {
  const pwd = String(password || "");
  if (pwd.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/[A-Z]/.test(pwd)) {
    return "Password must include at least one uppercase letter.";
  }
  if (!/[a-z]/.test(pwd)) {
    return "Password must include at least one lowercase letter.";
  }
  if (!/\d/.test(pwd)) {
    return "Password must include at least one number.";
  }
  if (!/[^A-Za-z0-9]/.test(pwd)) {
    return "Password must include at least one special character (e.g. !@#$%^&*).";
  }
  return null;
}

export default function AdminRegister() {
  const navigate = useNavigate();

  const [checkingSetup, setCheckingSetup] = useState(true);
  const [registrationAllowed, setRegistrationAllowed] = useState(false);
  const [requiresSetupKey, setRequiresSetupKey] = useState(false);

  const [fullName, setFullName] = useState("NOOR AL AFIYA Administrator");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSetupStatus() {
      try {
        const status = await fetchAdminSetupStatus();
        if (!active) return;
        setRegistrationAllowed(Boolean(status.registrationAllowed));
        setRequiresSetupKey(Boolean(status.requiresSetupKey));
      } catch {
        if (!active) return;
        setRegistrationAllowed(false);
      } finally {
        if (active) {
          setCheckingSetup(false);
        }
      }
    }

    loadSetupStatus();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || trimmedName.length < 2) {
      setError("Please enter the administrator's full name.");
      return;
    }
    if (!trimmedEmail) {
      setError("Please enter your administrator email address.");
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please confirm your password.");
      return;
    }

    if (requiresSetupKey && !setupKey.trim()) {
      setError("Please enter the administrator setup key.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerFirstAdmin({
        fullName: trimmedName,
        email: trimmedEmail,
        password,
        confirmPassword,
        setupKey: setupKey.trim(),
      });

      const msg = result.requiresEmailConfirmation
        ? "Initial admin account created. Please check your email if verification is required, then sign in."
        : "Initial administrator account created and authorized. Redirecting to sign in…";

      setSuccessMessage(msg);
      setTimeout(() => {
        navigate("/admin/login?registered=1", { replace: true });
      }, 1000);
    } catch (err) {
      setError(
        err.message || "Unable to create administrator account. Please try again."
      );
      if (err.status === 403) {
        setRegistrationAllowed(false);
      }
      setIsLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-decoration admin-login-decoration-one" />
      <div className="admin-login-decoration admin-login-decoration-two" />
      <section
        className="admin-login-card"
        aria-labelledby="admin-register-title"
      >
        <Link
          className="admin-login-brand"
          to="/"
          aria-label="NOOR AL AFIYA home"
        >
          <span className="admin-login-mark">✚</span>
          <span>
            <strong>NOOR AL AFIYA</strong>
            <small>HOME HEALTH CARE WLL</small>
          </span>
        </Link>
        <div className="admin-login-icon" aria-hidden="true">
          ⌘
        </div>
        <p className="admin-login-eyebrow">INITIAL ADMIN PROVISIONING</p>

        {checkingSetup ? (
          <>
            <h1 id="admin-register-title">Checking setup status…</h1>
            <p className="admin-login-intro">
              Verifying administrator initialization status with Supabase.
            </p>
          </>
        ) : !registrationAllowed && !successMessage ? (
          <>
            <h1 id="admin-register-title">Registration disabled</h1>
            <p className="admin-login-intro">
              The initial administrator account has already been provisioned for
              NOOR AL AFIYA. For security, public administrator registration is
              permanently disabled.
            </p>
            <button
              type="button"
              className="admin-login-submit"
              onClick={() => navigate("/admin/login")}
            >
              Proceed to Admin Sign In <span aria-hidden="true">→</span>
            </button>
          </>
        ) : (
          <>
            <h1 id="admin-register-title">Create first admin</h1>
            <p className="admin-login-intro">
              Register and authorize the initial NOOR AL AFIYA administrator
              account. Once created, public admin registration will be locked
              automatically.
            </p>

            <form
              onSubmit={handleSubmit}
              className="admin-login-form"
              noValidate
            >
              <label htmlFor="admin-register-name">Administrator Name</label>
              <input
                id="admin-register-name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="NOOR AL AFIYA Administrator"
                disabled={isLoading || Boolean(successMessage)}
                required
              />

              <label htmlFor="admin-register-email">Administrator Email</label>
              <input
                id="admin-register-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nooralafiyahomecare@gmail.com"
                disabled={isLoading || Boolean(successMessage)}
                required
              />

              <label htmlFor="admin-register-password">Password</label>
              <div className="admin-password-field">
                <input
                  id="admin-register-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 chars, upper, lower, number & symbol"
                  disabled={isLoading || Boolean(successMessage)}
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={isLoading || Boolean(successMessage)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <label htmlFor="admin-register-confirm">Confirm Password</label>
              <input
                id="admin-register-confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                disabled={isLoading || Boolean(successMessage)}
                required
              />

              {requiresSetupKey && (
                <>
                  <label htmlFor="admin-register-setup-key">
                    Administrator Setup Key
                  </label>
                  <input
                    id="admin-register-setup-key"
                    type="password"
                    value={setupKey}
                    onChange={(e) => setSetupKey(e.target.value)}
                    placeholder="Enter server setup key"
                    disabled={isLoading || Boolean(successMessage)}
                    required
                  />
                </>
              )}

              {error && (
                <p className="admin-login-error" role="alert">
                  {error}
                </p>
              )}

              {successMessage && (
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
                  {successMessage}
                </p>
              )}

              <button
                className="admin-login-submit"
                type="submit"
                disabled={isLoading || Boolean(successMessage)}
              >
                {isLoading ? (
                  "Creating administrator account…"
                ) : (
                  <>
                    Create First Admin Account <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}

        <div className="admin-login-note">
          <span>✓</span> Controlled one-time administrator provisioning
        </div>
        <Link className="admin-login-back" to="/admin/login">
          ← Back to Admin Sign In
        </Link>
      </section>
      <p className="admin-login-copyright">
        © {new Date().getFullYear()} NOOR AL AFIYA · Bahrain
      </p>
    </main>
  );
}
