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

import Login from "./pages/auth/Login";

import Services from "./pages/user/Services";
import CareForm from "./pages/user/CareForm";
import RequestStatus from "./pages/user/RequestStatus";
import Feedback from "./pages/user/Feedback";

import PatientCare from "./pages/services/PatientCare";
import ElderCare from "./pages/services/ElderCare";
import NewbornCare from "./pages/services/NewbornCare";
import ChildrenCare from "./pages/services/ChildrenCare";

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
        <Route path="/login" element={<Login />} />

        {/* ================= SERVICE DETAIL PAGES ================= */}

        <Route
          path="/services/patient"
          element={<PatientCare />}
        />

        <Route
          path="/services/elder"
          element={<ElderCare />}
        />

        <Route
          path="/services/newborn"
          element={<NewbornCare />}
        />

        <Route
          path="/services/children"
          element={<ChildrenCare />}
        />

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

        <Route
          path="/feedback"
          element={<Feedback />}
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
