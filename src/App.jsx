import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Services from "./pages/user/Services";
import CareForm from "./pages/user/CareForm";
import RequestStatus from "./pages/user/RequestStatus";
import Feedback from "./pages/user/Feedback";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default page */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* User Services */}
        <Route
          path="/services"
          element={<Services />}
        />

        {/* Care Booking Forms */}
        <Route
          path="/care/:service"
          element={<CareForm />}
        />

        {/* Request Tracking */}
        <Route
          path="/request-status"
          element={<RequestStatus />}
        />

        {/* Feedback */}
        <Route
          path="/feedback"
          element={<Feedback />}
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        {/* Invalid URL */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;