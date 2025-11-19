import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import ApplyOD from "./pages/ApplyOD";
import ODStatus from "./pages/ODStatus";
import StudentDash from "./pages/Dashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDash from "./pages/AdminDash"; 



export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/student" element={<Dashboard />} />
        <Route path="/apply-od" element={<ApplyOD />} />
        <Route path="/studentDash" element={<StudentDash />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />

        <Route path="/faculty" element={<FacultyApproval />} />
        <Route path="/adminDash" element={<AdminDash />} />
        

        <Route path="*" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}