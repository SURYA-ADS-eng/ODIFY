import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ODStatus() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // STOP redirecting if logged in
    if (!user || !token) {
      navigate("/login");
      return;
    }

    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/requests/student/${user._id}`,
        {
          headers: { "x-auth-token": token },
        }
      );

      setRequests(res.data);
    } catch (err) {
      alert("Error loading OD status.");
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Your OD Status</h2>

        {requests.length === 0 ? (
          <p>No OD requests submitted yet.</p>
        ) : (
          requests.map((req) => (
            <div key={req._id} style={styles.item}>
              <p><strong>Event:</strong> {req.eventName}</p>
              <p>
                <strong>Dates:</strong>{" "}
                {new Date(req.startDate).toLocaleDateString()} -{" "}
                {new Date(req.endDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      req.status === "Approved"
                        ? "green"
                        : req.status === "Rejected"
                        ? "red"
                        : "orange",
                    fontWeight: "bold",
                  }}
                >
                  {req.status}
                </span>
              </p>

              {req.remarks && (
                <p>
                  <strong>Remarks:</strong> {req.remarks}
                </p>
              )}

              {req.proofFile && (
                <a
                  href={`http://localhost:5000/${req.proofFile}`}
                  target="_blank"
                  style={styles.link}
                >
                  View Proof
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    background: "#f4f4f4",
    minHeight: "100vh",
  },
  card: {
    width: "800px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  heading: {
    marginBottom: "20px",
  },
  item: {
    padding: "15px",
    marginBottom: "12px",
    background: "#fafafa",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  link: {
    marginTop: "10px",
    display: "inline-block",
    background: "#007bff",
    padding: "8px 12px",
    color: "#fff",
    borderRadius: "5px",
    textDecoration: "none",
  },
};
