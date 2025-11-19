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

  // ---------- HANDLE CHANGE ----------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "role") {
      let updated = { ...form, role: value };

      if (value === "Admin") {
        updated.dept = "";
        updated.year = "";
        updated.regNo = "";
      } else if (value === "Faculty" || value === "HoD") {
        updated.year = "";
      }
      setForm(updated);
      return;
    }

    setForm({ ...form, [name]: value });
  };

  // ---------- REGISTER FUNCTION ----------
  const handleRegister = async (e) => {
    e.preventDefault();

    // Gmail validation
    if (!form.email.toLowerCase().endsWith("@gmail.com")) {
      setError("Email must be a @gmail.com address");
      return;
    }

    // Password match
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    // Build payload based on role
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    };

    if (form.role === "Student") {
      payload.regNo = form.regNo;
      payload.dept = form.dept;
      payload.year = form.year;
    } else if (form.role === "Faculty" || form.role === "HoD") {
      payload.dept = form.dept;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", payload);
      alert("Registered Successfully!");
      window.location.href = "/login";
    } catch (err) {
      if (err.response && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Registration failed. Please try again.");
      }
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
            disabled={form.role !== "Student"}
            required={form.role === "Student"}
          />

          {/* DEPARTMENT */}
          <select
            name="dept"
            style={{
              ...styles.input,
              background: form.role === "Admin" ? "#dfe8f7" : "white",
              cursor: form.role === "Admin" ? "not-allowed" : "pointer",
            }}
            value={form.dept}
            onChange={handleChange}
            disabled={form.role === "Admin"}
            required={form.role !== "Admin"}
          >
            <option value="">Select Department</option>
            <option value="AIDS">AIDS</option>
            <option value="AIML">AI&ML</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="BME">BME</option>
            <option value="MDE">MDE</option>
            <option value="CIVIL">CIVIL</option>
          </select>

          {/* YEAR */}
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

          {/* ROLE */}
          <select
            name="role"
            style={styles.input}
            value={form.role}
            onChange={handleChange}
          >
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
            <option value="HoD">HoD</option>
            <option value="Admin">Admin</option>
          </select>

          {/* EMAIL */}
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

          {/* SUBMIT */}
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

// ---------------- STYLES ----------------

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
