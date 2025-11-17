import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    regNo: "",
    dept: "",
    year: "",
    role: "Student",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("User Registered Successfully!");
      window.location.href = "/login"; // go back to login page
    } catch (err) {
      alert("Registration failed!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            style={styles.input}
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            style={styles.input}
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            style={styles.input}
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="regNo"
            placeholder="Register Number"
            style={styles.input}
            value={form.regNo}
            onChange={handleChange}
          />

          <input
            type="text"
            name="dept"
            placeholder="Department"
            style={styles.input}
            value={form.dept}
            onChange={handleChange}
          />

          <input
            type="text"
            name="year"
            placeholder="Year"
            style={styles.input}
            value={form.year}
            onChange={handleChange}
          />

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

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>

        <p style={{ marginTop: "10px", textAlign: "center" }}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f0f2f5",
  },
  card: {
    width: "350px",
    padding: "25px",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "24px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};
