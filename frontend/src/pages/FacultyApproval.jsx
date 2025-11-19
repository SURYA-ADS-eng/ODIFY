import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FacultyApproval() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/requests/pending",
        {
          headers: { "x-auth-token": token },
        },
      );

      // res.data is array, no extra fields
      console.log("Pending requests", res.data);
      setRequests(res.data);
    } catch (err) {
      console.error("Fetch pending error:", err);

      // alert("Error fetching pending requests");

      //alert("Error fetching pending requests");

    } finally {
      setLoading(false);
    }
  };

  const makeDecision = async (id, action) => {
    const remarks = prompt("Enter remarks (optional):");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/requests/${id}/decision",
        { action, remarks },
        { headers: { "x-auth-token": token } },
      );

      alert(`Request ${action}`);

      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Decision error:", err);
      alert("Failed to update request.");
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p>Loading pending requests...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Pending OD Requests</h2>

        {requests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          requests.map((r) => (
            <div key={r._id} style={styles.reqCard}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ margin: 0 }}>{r.eventName}</h3>

                  <p>
                    <strong>Student:</strong> {r.student?.name || r.studentName}
                  </p>
                  <p>
                    <strong>Reg No:</strong> {r.student?.regNo || r.regNo}
                  </p>
                  <p>
                    <strong>Dept:</strong> {r.student?.dept || r.dept}
                  </p>
                  <p>
                    <strong>Year:</strong> {r.student?.year || r.year}
                  </p>

                  <p>
                    <strong>Event Type:</strong> {r.eventType} <br />
                    <strong>Dates:</strong>
                    {new Date(r.startDate).toLocaleDateString()} -{" "}
                    {new Date(r.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  {r.proofFile ? (
                    <a
                      href={`http://localhost:5000/${r.proofFile}`}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.link}
                    >
                      View Proof
                    </a>
                  ) : (
                    <span style={{ color: "#777" }}>No proof uploaded</span>
                  )}
                </div>
              </div>

              <div style={styles.actionRow}>
                <button
                  style={styles.approve}
                  onClick={() => makeDecision(r._id, "Approved")}
                >
                  Approve
                </button>
                <button
                  style={styles.reject}
                  onClick={() => makeDecision(r._id, "Rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <button
        style={{
          padding: "10px 16px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
        onClick={() => (window.location.href = "/faculty/certificates")}
      >
        View Certificates
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    minHeight: "100vh",
    background: "#f0f2f5",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "900px",
    background: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  },
  title: { marginBottom: "16px" },
  reqCard: {
    border: "1px solid #eee",
    padding: "14px",
    borderRadius: "6px",
    marginBottom: "12px",
    background: "#fafafa",
  },
  actionRow: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
  },
  approve: {
    background: "#28a745",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
  },
  reject: {
    background: "#dc3545",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
  },
  link: {
    padding: "6px 10px",
    background: "#007bff",
    color: "#fff",
    borderRadius: "5px",
    textDecoration: "none",
  },
};
