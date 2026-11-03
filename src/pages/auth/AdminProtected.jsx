import { useEffect, useState, useCallback } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  fetchCurrentAdmin,
  getActiveAdminAccessToken,
  logoutAdmin,
} from "../../utils/api";
import { supabase } from "../../utils/supabaseClient";

export default function AdminProtected({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("checking"); // "checking" | "authenticated" | "forbidden" | "unauthenticated"

  const verifyAccess = useCallback(async () => {
    const accessToken = await getActiveAdminAccessToken();
    if (!accessToken) {
      setStatus("unauthenticated");
      return;
    }

    try {
      await fetchCurrentAdmin(accessToken);
      setStatus("authenticated");
    } catch (err) {
      if (err.status === 403) {
        setStatus("forbidden");
      } else {
        await logoutAdmin();
        setStatus("unauthenticated");
      }
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      if (!active) return;
      await verifyAccess();
    }

    checkSession();

    const { data: authListener } = supabase
      ? supabase.auth.onAuthStateChange((event, session) => {
          if (!active) return;
          if (event === "SIGNED_OUT" || !session) {
            setStatus("unauthenticated");
          } else if (
            event === "TOKEN_REFRESHED" ||
            event === "SIGNED_IN" ||
            event === "USER_UPDATED"
          ) {
            verifyAccess();
          }
        })
      : { data: { subscription: null } };

    // Recheck authentication when the admin revisits the dashboard tab or uses browser back/forward navigation
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible" && active) {
        verifyAccess();
      }
    };

    const handlePageShow = () => {
      if (active) {
        verifyAccess();
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("popstate", handlePageShow);

    return () => {
      active = false;
      authListener?.subscription?.unsubscribe?.();
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("popstate", handlePageShow);
    };
  }, [verifyAccess, location.pathname]);

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
            You are authenticated, but you do not have administrator access.
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
            Logout & return to login
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
