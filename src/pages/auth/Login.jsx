import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [loginType, setLoginType] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (loginType === "admin") {
      navigate("/admin");
    } else {
      navigate("/services");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-brand">
          <div className="brand-icon">✚</div>

          <h1>Bahrain Nursing Care</h1>

          <p>
            Professional Home Care Services
          </p>
        </div>

        <div className="login-card">

          <h2>Welcome Back</h2>

          <p className="login-subtitle">
            Sign in to continue
          </p>

          <div className="login-type">
            <button
              type="button"
              className={loginType === "user" ? "active" : ""}
              onClick={() => setLoginType("user")}
            >
              User
            </button>

            <button
              type="button"
              className={loginType === "admin" ? "active" : ""}
              onClick={() => setLoginType("admin")}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleLogin}>

            <div className="form-group">
              <label>
                Email / Username
              </label>

              <input
                type="text"
                placeholder="Enter your email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
            >
              Login
            </button>

          </form>

        </div>

        <p className="login-footer">
          © 2026 Bahrain Nursing Care
        </p>

      </div>
    </div>
  );
}

export default Login;