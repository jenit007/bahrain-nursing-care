import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { lazy, Suspense, useEffect } from "react";

// Home is loaded eagerly (first paint); every other route is code-split.
import Home from "./pages/Home";

const About = lazy(() => import("./pages/About"));
const WhyUs = lazy(() => import("./pages/WhyUs"));
const Contact = lazy(() => import("./pages/Contact"));
const Careers = lazy(() => import("./pages/Careers"));

const Services = lazy(() => import("./pages/user/Services"));
const CareForm = lazy(() => import("./pages/user/CareForm"));
const RequestStatus = lazy(() => import("./pages/user/RequestStatus"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProtected = lazy(() => import("./pages/auth/AdminProtected"));
const AdminLogin = lazy(() => import("./pages/auth/AdminLogin"));
const AdminResetPassword = lazy(() => import("./pages/auth/AdminResetPassword"));

import "./responsive.css";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="route-loading" role="status" aria-live="polite">
            Loading…
          </div>
        }
      >
        <Routes>
          {/* ================= PUBLIC PAGES ================= */}

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />

          {/* ================= CARE FORMS ================= */}

          <Route path="/care/:service" element={<CareForm />} />

          {/* ================= USER PAGES ================= */}

          <Route path="/request-status" element={<RequestStatus />} />

          {/* ================= ADMIN ================= */}

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />
          <Route
            path="/admin/*"
            element={
              <AdminProtected>
                <AdminDashboard />
              </AdminProtected>
            }
          />

          {/* ================= FALLBACK ================= */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
