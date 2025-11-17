import React, { useState } from "react";
import axios from "axios";

export default function ApplyOD() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    studentName: user?.name,
    regNo: user?.regNo,
    dept: user?.dept,
    year: user?.year,
    eventName: "",
    organizer: "",
    eventType: "Workshop",
    startDate: "",
    endDate: "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));

    if (file) data.append("proofFile", file);

    try {
      await axios.post("http://localhost:5000/api/requests/submit", data, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });

      alert("OD Request Submitted Successfully!");
      window.location.href = "/student";
    } catch (err) {
      alert("Failed to submit OD request");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Apply for OD</h2>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            name="eventName"
            placeholder="Event Name"
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="text"
            name="organizer"
            placeholder="Organizer"
            onChange={handleChange}
            required
          />

          <select
            name="eventType"
            style={styles.input}
            onChange={handleChange}
          >
            <option>Workshop</option>
            <option>Symposium</option>
            <option>Hackathon</option>
            <option>Sports</option>
            <option>Cultural</option>
          </select>

          <label>Start Date:</label>
          <input
            style={styles.input}
            type="date"
            name="startDate"
            onChange={handleChange}
            required
          />

          <label>End Date:</label>
          <input
            style={styles.input}
            type="date"
            name="endDate"
            onChange={handleChange}
            required
          />

          <label>Upload Proof (image/pdf):</label>
          <input
            style={styles.input}
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />

          <button style={styles.button} type="submit">
            Submit OD Request
          </button>
        </form>
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
    width: "400px",
    padding: "25px",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#007bff",
    color: "#fff",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
};
