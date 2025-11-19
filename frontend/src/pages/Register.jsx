import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    regNo: "",
    dept: "",
    year: "",
    role: "Student",
  });

  const [error, setError] = useState("");

  // ---------- HANDLE CHANGE LOGIC ----------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // ROLE CHANGE LOGIC
    if (name === "role") {
      if (value === "admin") {
        // Admin must NOT select dept or year
        setForm({ ...form, role: value, dept: "", year: "" });
      } 
      else if (value !== "Student") {
        // Faculty / HoD → clear year but keep dept
        setForm({ ...form, role: value, year: "" });
      } 
      else {
        // Student → normal
        setForm({ ...form, role: value });
      }
      return;
    }

    setForm({ ...form, [name]: value });
  };

  // ---------- REGISTER FUNCTION ----------
  const handleRegister = async (e) => {
    e.preventDefault();

    // Gmail check
    if (!form.email.toLowerCase().endsWith("@gmail.com")) {
      setError("Email must be a @gmail.com address");
      return;
    }

    // Password match check
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registered Successfully!");
      window.location.href = "/login";
    } catch (err) {
      alert("Registration Failed!");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleRegister}>

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            style={styles.input}
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* REGISTER NUMBER */}
          <input
            type="text"
            name="regNo"
            placeholder="Register Number"
            style={styles.input}
            value={form.regNo}
            onChange={handleChange}
          />

          {/* DEPARTMENT */}
          <select
            name="dept"
            style={{
              ...styles.input,
              background: form.role === "admin" ? "#dfe8f7" : "white",
              cursor: form.role === "admin" ? "not-allowed" : "pointer",
            }}
            value={form.dept}
            onChange={handleChange}
            disabled={form.role === "admin"}
            required={form.role !== "admin"}   // Admin does NOT need dept
          >
            <option value="">Select Department</option>
            <option value="AI&DS">AI&DS</option>
            <option value="AI&ML">AI&ML</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="BME">BME</option>
            <option value="MDE">MDE</option>
            <option value="CIVIL">CIVIL</option>


          </select>

          {/* YEAR - DISABLED IF NOT STUDENT */}
          <select
            name="year"
            style={{
              ...styles.input,
              background: form.role !== "Student" ? "#dfe8f7" : "white",
              cursor: form.role !== "Student" ? "not-allowed" : "pointer",
            }}
            value={form.year}
            onChange={handleChange}
            disabled={form.role !== "Student"}
            required={form.role === "Student"}
          >
            <option value="">Select Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>

          {/* ROLE DROPDOWN */}
          <select
            name="role"
            style={styles.input}
            value={form.role}
            onChange={handleChange}
          >
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
            <option value="HoD">HoD</option>
            <option value="admin">Admin</option>
          </select>

          {/* GMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Gmail Address (must end with @gmail.com)"
            style={styles.input}
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            style={styles.input}
            value={form.password}
            onChange={handleChange}
            required
          />

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            style={styles.input}
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* SUBMIT BUTTON */}
          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <a href="/login" style={styles.link}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

// -------------- STYLES ----------------

const styles = {
  page: {
    height: "100vh",
    background: "#e8f1ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    width: "380px",
    padding: "35px",
    background: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 8px 25px rgba(0, 72, 135, 0.25)",
    border: "2px solid #d0e2ff",
  },

  title: {
    textAlign: "center",
    color: "#004a99",
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1.5px solid #9bbbe9",
    borderRadius: "6px",
    fontSize: "15px",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#0059d4",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "17px",
    fontWeight: "600",
    transition: "0.3s",
  },

  footer: {
    marginTop: "15px",
    textAlign: "center",
    fontSize: "14px",
  },

  link: {
    color: "#0059d4",
    fontWeight: "600",
    textDecoration: "none",
  },

  error: {
    color: "#d40000",
    textAlign: "center",
    marginBottom: "10px",
    fontWeight: "600",
  },
};
