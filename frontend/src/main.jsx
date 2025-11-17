import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import StudentDashboard from "./pages/Dashboard.jsx";
import ApplyOD from "./pages/ApplyOD.jsx";
import FacultyApproval from "./pages/FacultyApproval.jsx";
import ODStatus from "./pages/ODStatus.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/apply-od" element={<ApplyOD />} />
      <Route path="/faculty" element={<FacultyApproval />} />
      <Route path="/status" element={<ODStatus />} />

    </Routes>
  </BrowserRouter>
);
