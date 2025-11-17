import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import ApplyOD from "./pages/ApplyOD";
import ODStatus from "./pages/ODStatus";

import FacultyApproval from "./pages/FacultyApproval";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/student" element={<Dashboard />} />
        <Route path="/apply-od" element={<ApplyOD />} />
        <Route path="/odstatus" element={<ODStatus />} />

        <Route path="/faculty" element={<FacultyApproval />} />

        <Route path="*" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}
