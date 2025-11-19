import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* 🔹 View OD Status Button at TOP */}
        <button
          style={styles.topButton}
          onClick={() => navigate("/studentDash")}
        >
          View OD Status
        </button>

        <h2>Welcome, {user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Register No: {user.regNo}</p>
        <p>Department: {user.dept}</p>
        <p>Year: {user.year}</p>

        {/* Apply OD */}
        <button style={styles.button} onClick={() => navigate("/apply-od")}>
          Apply for OD
        </button>
        <button
          style={{
            ...styles.button,
            background: "#6f42c1", // purple just to differentiate
          }}
          onClick={() => navigate("/upload-certificate")}
        >
          Apply Attendance
        </button>
        {/* Logout */}
        <button
          style={styles.logout}
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>
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
    backgroundColor: "#f0f0f0",
  },
  card: {
    width: "400px",
    padding: "25px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  },

  topButton: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    border: "none",
    background: "#28a745",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    border: "none",
    background: "#007bff",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },

  logout: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    border: "none",
    background: "#dc3545",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};
