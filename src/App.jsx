import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { lazy, Suspense, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { useLanguage } from "./context/LanguageContext";

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

// Applies persisted lang/dir from context on initial render
function LangSync() {
  const { lang, isRTL } = useLanguage();
  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
  }, [lang, isRTL]);
  return null;
}

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
      <LangSync />
      <ScrollToTop />
      <ErrorBoundary>
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
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
