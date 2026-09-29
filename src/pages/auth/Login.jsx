import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (loginType === "admin") {
      navigate("/admin");
    } else {
      navigate("/services");
    }
  };

  return (
    <div className="login-page">

      {/* ================= TOP BAR ================= */}

      <div className="login-topbar">
        <div className="login-container login-topbar-inner">

          <span>
            Bahrain Home Nursing Care
          </span>

          <div className="login-top-links">
            <span>24/7 Home Care Support</span>
            <span>•</span>
            <span>Bahrain</span>
          </div>

        </div>
      </div>

      {/* ================= NAVBAR ================= */}

      <header className="login-navbar">

        <div className="login-container login-nav-inner">

          <Link
            to="/"
            className="login-logo"
          >
            <span className="login-logo-main">
              Bahrain
            </span>

            <span className="login-logo-sub">
              HOME NURSING CARE
            </span>
          </Link>

          <nav className="login-nav-links">

            <Link to="/">
              Home
            </Link>

            <Link to="/about">
              About Us
            </Link>

            <Link to="/services">
              Our Services
            </Link>

            <Link to="/why-us">
              Why Choose Us
            </Link>

            <Link to="/contact">
              Contact Us
            </Link>

          </nav>

          <Link
            to="/login"
            className="login-nav-btn"
          >
            Login
          </Link>

        </div>

      </header>

      {/* ================= LOGIN AREA ================= */}

      <main className="login-main">

        <div className="login-container login-main-grid">

          {/* LEFT CONTENT */}

          <div className="login-info">

            <p className="login-label">
              WELCOME BACK
            </p>

            <h1>
              Care starts with
              <span> the right support.</span>
            </h1>

            <p className="login-description">
              Access your Bahrain Home Nursing Care account
              to explore services, submit care requests and
              track your request status.
            </p>

            <div className="login-benefits">

              <div className="login-benefit">

                <div className="login-benefit-icon">
                  ✓
                </div>

                <div>
                  <h3>
                    Simple Care Requests
                  </h3>

                  <p>
                    Submit your home care requirements
                    through a simple online process.
                  </p>
                </div>

              </div>

              <div className="login-benefit">

                <div className="login-benefit-icon">
                  ✓
                </div>

                <div>
                  <h3>
                    Track Your Request
                  </h3>

                  <p>
                    Follow the progress of your care request
                    from submission to completion.
                  </p>
                </div>

              </div>

              <div className="login-benefit">

                <div className="login-benefit-icon">
                  ✓
                </div>

                <div>
                  <h3>
                    Access Care Services
                  </h3>

                  <p>
                    Explore patient, elder, newborn and
                    children's care services.
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* LOGIN CARD */}

          <div className="login-card">

            <div className="login-card-header">

              <p className="login-card-label">
                ACCOUNT ACCESS
              </p>

              <h2>
                Sign in
              </h2>

              <p>
                Choose your account type to continue.
              </p>

            </div>

            {/* ACCOUNT TYPE */}

            <div className="login-type-selector">

              <button
                type="button"
                className={
                  loginType === "user"
                    ? "active"
                    : ""
                }
                onClick={() => setLoginType("user")}
              >
                User
              </button>

              <button
                type="button"
                className={
                  loginType === "admin"
                    ? "active"
                    : ""
                }
                onClick={() => setLoginType("admin")}
              >
                Admin
              </button>

            </div>

            {/* FORM */}

            <form
              className="login-form"
              onSubmit={handleSubmit}
            >

              <div className="login-field">

                <label>
                  {loginType === "admin"
                    ? "Admin Username / Email"
                    : "Email Address"}
                </label>

                <input
                  type={
                    loginType === "admin"
                      ? "text"
                      : "email"
                  }
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder={
                    loginType === "admin"
                      ? "Enter admin username or email"
                      : "Enter your email address"
                  }
                  required
                />

              </div>

              <div className="login-field">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  required
                />

              </div>

              <button
                type="submit"
                className="login-submit"
              >
                {loginType === "admin"
                  ? "Login as Admin"
                  : "Login"}
              </button>

            </form>

            <div className="login-demo-note">

              <strong>
                Demo Website
              </strong>

              <p>
                This login is currently for frontend
                demonstration. Real authentication will
                be connected when the backend is integrated.
              </p>

            </div>

          </div>

        </div>

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="login-footer">

        <div className="login-container login-footer-grid">

          <div>

            <Link
              to="/"
              className="login-footer-logo"
            >
              Bahrain

              <span>
                HOME NURSING CARE
              </span>
            </Link>

            <p>
              Professional home nursing care support
              designed around individuals and families
              in Bahrain.
            </p>

          </div>

          <div>

            <h4>
              Quick Links
            </h4>

            <Link to="/">
              Home
            </Link>

            <Link to="/about">
              About Us
            </Link>

            <Link to="/services">
              Our Services
            </Link>

            <Link to="/why-us">
              Why Choose Us
            </Link>

          </div>

          <div>

            <h4>
              Services
            </h4>

            <Link to="/services/patient">
              Patient Care
            </Link>

            <Link to="/services/elder">
              Elder Care
            </Link>

            <Link to="/services/newborn">
              Newborn Care
            </Link>

            <Link to="/services/children">
              Children's Care
            </Link>

          </div>

          <div>

            <h4>
              Contact
            </h4>

            <p>
              Bahrain
            </p>

            <p>
              24/7 Home Care Support
            </p>

            <Link to="/contact">
              Contact Us →
            </Link>

          </div>

        </div>

        <div className="login-footer-bottom">

          <div className="login-container">
            © 2026 Bahrain Home Nursing Care.
            All rights reserved.
          </div>

        </div>

      </footer>

    </div>
  );
}

export default Login;