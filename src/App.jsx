import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Services from "./pages/user/Services";
import CareForm from "./pages/user/CareForm";
import RequestStatus from "./pages/user/RequestStatus";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/services"
          element={<Services />}
        />

        <Route
          path="/care/:service"
          element={<CareForm />}
        />

        <Route
          path="/request-status"
          element={<RequestStatus />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;