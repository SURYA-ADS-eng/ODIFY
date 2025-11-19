import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ApplyOD from "./pages/ApplyOD.jsx";
import FacultyApproval from "./pages/FacultyApproval.jsx";
import FacultyDashboard from "./pages/FacultyDashboard.jsx";

import ODStatus from "./pages/ODStatus.jsx";
import AdminDash from "./pages/AdminDash";
// 👈 Add this
import CertificateUpload from "./pages/CertificateUpload.jsx";
import FacultyCertificateView from "./pages/FacultyCertificateView.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/student" element={<Dashboard />} />
      <Route path="/apply-od" element={<ApplyOD />} />
      <Route path="/faculty" element={<FacultyApproval />} />
      <Route path="/studentDash" element={<ODStatus />} />
      {/* student */}
      <Route path="/upload-certificate" element={<CertificateUpload />} />
      <Route
        path="/faculty/certificates/:id"
        element={<FacultyCertificateView />}
      />
      {/* faculty */}
      <Route
        path="/faculty/certificates"
        element={<FacultyCertificateView />}
      />{" "}
      <Route path="/adminDash" element={<AdminDash />} />
      <Route path="/faculty/dashboard" element={<FacultyDashboard />} />


      <Route path="/studentDash" element={<ODStatus />} />
      <Route path="/adminDash" element={<AdminDash />} />
      

    </Routes>
  </BrowserRouter>,
);

