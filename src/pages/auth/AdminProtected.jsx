import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  fetchCurrentAdmin,
  getActiveAdminAccessToken,
  logoutAdmin,
} from "../../utils/api";
import { supabase } from "../../utils/supabaseClient";

export default function AdminProtected({ children }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking"); // "checking" | "authenticated" | "forbidden" | "unauthenticated"

  useEffect(() => {
    let active = true;

    async function verifyAccess() {
      const accessToken = await getActiveAdminAccessToken();
      if (!accessToken) {
        if (active) setStatus("unauthenticated");
        return;
      }

      try {
        await fetchCurrentAdmin();
        if (active) setStatus("authenticated");
      } catch (err) {
        if (!active) return;
        if (err.status === 403) {
          setStatus("forbidden");
        } else {
          await logoutAdmin();
          setStatus("unauthenticated");
        }
      }
    }

    verifyAccess();

    const { data: authListener } = supabase
      ? supabase.auth.onAuthStateChange((event, session) => {
          if (!active) return;
          if (event === "SIGNED_OUT" || !session) {
            setStatus("unauthenticated");
          } else if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") {
            verifyAccess();
          }
        })
      : { data: { subscription: null } };

    return () => {
      active = false;
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  if (status === "checking") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8F9FA",
          color: "#4F4F4F",
          fontFamily: "system-ui, sans-serif",
          fontSize: "15px",
          fontWeight: 600,
        }}
      >
        Verifying administrator session...
      </div>
    );
  }

  if (status === "forbidden") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "#FFF8FC",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "460px",
            width: "100%",
            background: "#FFFFFF",
            border: "1px solid #F3D5E4",
            borderRadius: "14px",
            padding: "28px 24px",
            textAlign: "center",
            boxShadow: "0 12px 32px rgba(37, 37, 37, 0.08)",
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1px",
              color: "#FF3A94",
            }}
          >
            ACCESS DENIED · 403
          </p>
          <h1 style={{ margin: "0 0 10px", fontSize: "22px", color: "#252525" }}>
            Administrator authorization required
          </h1>
          <p style={{ margin: "0 0 20px", fontSize: "14px", color: "#4F4F4F", lineHeight: 1.5 }}>
            Your account is signed in, but it does not have administrator
            privileges for the NOOR AL AFIYA dashboard.
          </p>
          <button
            type="button"
            onClick={async () => {
              await logoutAdmin();
              navigate("/admin/login", { replace: true });
            }}
            style={{
              height: "42px",
              padding: "0 18px",
              borderRadius: "8px",
              border: "1px solid #FF3A94",
              background: "#FF3A94",
              color: "#FFFFFF",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign out & return to login
          </button>
        </div>
      </div>
    );
  }

  return status === "authenticated" ? (
    children
  ) : (
    <Navigate to="/admin/login" replace />
  );
}
