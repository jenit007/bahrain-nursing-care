import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useEffect } from "react";

import Home from "./pages/Home";
import About from "./pages/About";
import WhyUs from "./pages/WhyUs";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";

import Services from "./pages/user/Services";
import CareForm from "./pages/user/CareForm";
import RequestStatus from "./pages/user/RequestStatus";

import AdminDashboard from "./pages/admin/AdminDashboard";

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
  useEffect(() => {
    document.title = "NOOR AL AFIYA | Home Health Care Service";
  }, []);
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ================= PUBLIC PAGES ================= */}

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/why-us" element={<WhyUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />

        {/* ================= CARE FORMS ================= */}

        <Route
          path="/care/:service"
          element={<CareForm />}
        />

        {/* ================= USER PAGES ================= */}

        <Route
          path="/request-status"
          element={<RequestStatus />}
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        {/* ================= FALLBACK ================= */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
