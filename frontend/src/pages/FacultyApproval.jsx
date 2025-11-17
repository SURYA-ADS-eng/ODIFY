import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FacultyApproval() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPending();
    // eslint-disable-next-line
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/requests/pending", {
        headers: { "x-auth-token": token },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Fetch pending error:", err);
      alert("Failed to load pending requests. Make sure you're logged in as Faculty/HoD/Admin.");
    } finally {
      setLoading(false);
    }
  };

  const makeDecision = async (id, action) => {
    const remarks = prompt("Enter remarks (optional):");
    try {
      await axios.post(
        `http://localhost:5000/api/requests/${id}/decision`,
        { action, remarks },
        { headers: { "x-auth-token": token } }
      );
      alert(`Request ${action}`);
      // remove the request from local state
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Decision error:", err);
      alert("Failed to update request. Check console for details.");
    }
  };

  if (loading) {
    return <div style={styles.container}><p>Loading pending requests...</p></div>;
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
                  <p style={{ margin: "4px 0" }}>
                    <strong>Student:</strong> {r.studentName || r.student?.name}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Reg No:</strong> {r.regNo || r.student?.regNo}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Dept:</strong> {r.dept} &nbsp; <strong>Year:</strong> {r.year}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Type:</strong> {r.eventType} &nbsp; <strong>Dates:</strong>{" "}
                    {new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
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
                    <span style={{ color: "#777" }}>No proof</span>
                  )}
                </div>
              </div>

              <div style={styles.actionRow}>
                <button style={styles.approve} onClick={() => makeDecision(r._id, "Approved")}>
                  Approve
                </button>
                <button style={styles.reject} onClick={() => makeDecision(r._id, "Rejected")}>
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
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
  title: {
    marginBottom: "16px",
  },
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
    border: "none",
    padding: "8px 14px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  reject: {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  link: {
    display: "inline-block",
    padding: "6px 10px",
    background: "#007bff",
    color: "#fff",
    borderRadius: "5px",
    textDecoration: "none",
  },
};
