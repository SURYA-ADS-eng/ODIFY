// src/pages/FacultyDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const DEPARTMENTS = [
    "AIDS",
    "AIML",
    "BME",
    "CSE",
    "IT",
    "ECE",
    "EEE",
    "CIVIL",
    "MECH",
  ];

  const [dept, setDept] = useState("AIDS");
  const [todayStats, setTodayStats] = useState({
    approved: 0,
    rejected: 0,
    pending: 0,
  });
  const [monthStats, setMonthStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [currentReq, setCurrentReq] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [search, setSearch] = useState("");

  const BASE = `http://localhost:5000/api/requests`;

  useEffect(() => {
    loadAll();
  }, [dept]);

  const loadAll = async () => {
    fetchTodayStats();
    fetchMonthStats();
    fetchRequests();
  };

  const fetchTodayStats = async () => {
    try {
      const res = await fetch(`${BASE}/faculty/today-stats?dept=${dept}`, {
        headers: { "x-auth-token": token },
      });
      const data = await res.json();
      setTodayStats(data);
    } catch (err) {
      console.log("Today stats error:", err);
    }
  };

  const fetchMonthStats = async () => {
    try {
      const res = await fetch(`${BASE}/faculty/month-stats?dept=${dept}`, {
        headers: { "x-auth-token": token },
      });
      const data = await res.json();
      setMonthStats(data);
    } catch (err) {
      console.log("Month stats error:", err);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/faculty/dashboard`, {
        // fixed URL
        headers: { "x-auth-token": token },
      });
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.log("Requests fetch error:", err);
    }
    setLoading(false);
  };

  const openModal = (req) => {
    setCurrentReq(req);
    setShowModal(true);
    setRemarks(req.facultyRemarks || "");
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentReq(null);
    setRemarks("");
  };

  const updateStatus = async (action) => {
    try {
      await fetch(`${BASE}/${currentReq._id}/decision`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ action, remarks }),
      });

      alert(`Request ${action}`);
      closeModal();
      loadAll();
    } catch (err) {
      alert("Error updating request");
    }
  };

  const viewProof = (file) => {
    if (!file) return alert("No proof uploaded");
    window.open(`http://localhost:5000/${file}`, "_blank");
  };

  const filtered = requests.filter((r) => {
    const s = search.toLowerCase();
    return (
      r.studentName?.toLowerCase().includes(s) ||
      r.regNo?.toLowerCase().includes(s) ||
      r.eventName?.toLowerCase().includes(s)
    );
  });

  const styles = {
    container: {
      padding: 20,
      fontFamily: "Arial",
      background: "#f2f4f7",
      minHeight: "100vh",
    },
    title: { fontSize: 26, fontWeight: 700, marginBottom: 10 },
    row: { display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" },
    card: {
      flex: 1,
      minWidth: 160,
      padding: 15,
      background: "#fff",
      borderRadius: 8,
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    },
    number: { fontSize: 22, fontWeight: 700 },
    tableWrap: { overflowX: "auto", marginTop: 12 },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { padding: 10, background: "#eaeaea", textAlign: "left" },
    td: { padding: 10, borderBottom: "1px solid #eee" },
    btn: {
      padding: "6px 10px",
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
    },
    approve: { background: "#27ae60", color: "#fff" },
    reject: { background: "#e74c3c", color: "#fff" },
    view: { background: "#3498db", color: "#fff" },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: { background: "white", padding: 20, borderRadius: 10, width: 450 },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>Faculty Dashboard</div>

      <button
        style={{
          padding: "10px 20px",
          marginBottom: 15,
          background: "#0066ff",
          color: "white",
          borderRadius: 6,
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => navigate("/faculty")}
      >
        Go to Faculty Approval Page
      </button>

      <div style={styles.row}>
        <select
          style={{ padding: 10 }}
          value={dept}
          onChange={(e) => setDept(e.target.value)}
        >
          {DEPARTMENTS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <input
          placeholder="Search student, reg no, event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 10, flex: 1 }}
        />

        <button style={{ padding: "10px 15px" }} onClick={loadAll}>
          Refresh
        </button>
      </div>

      {/* <div style={styles.row}> */}
      {/*   <div style={styles.card}> */}
      {/*     <div>Approved Today</div> */}
      {/*     <div style={styles.number}>{todayStats.approved}</div> */}
      {/*   </div> */}
      {/*   <div style={styles.card}> */}
      {/*     <div>Rejected Today</div> */}
      {/*     <div style={styles.number}>{todayStats.rejected}</div> */}
      {/*   </div> */}
      {/*   <div style={styles.card}> */}
      {/*     <div>Pending Today</div> */}
      {/*     <div style={styles.number}>{todayStats.pending}</div> */}
      {/*   </div> */}
      {/* </div> */}

      {/* <div style={styles.row}> */}
      {/*   <div style={styles.card}> */}
      {/*     <div>Total This Month</div> */}
      {/*     <div style={styles.number}>{monthStats.total}</div> */}
      {/*   </div> */}
      {/*   <div style={styles.card}> */}
      {/*     <div>Approved</div> */}
      {/*     <div style={styles.number}>{monthStats.approved}</div> */}
      {/*   </div> */}
      {/*   <div style={styles.card}> */}
      {/*     <div>Rejected</div> */}
      {/*     <div style={styles.number}>{monthStats.rejected}</div> */}
      {/*   </div> */}
      {/*   <div style={styles.card}> */}
      {/*     <div>Pending</div> */}
      {/*     <div style={styles.number}>{monthStats.pending}</div> */}
      {/*   </div> */}
      {/* </div> */}

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Student</th>
              <th style={styles.th}>Reg No</th>
              <th style={styles.th}>Event</th>
              <th style={styles.th}>Dates</th>
              <th style={styles.th}>Proof</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={styles.td}>
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={styles.td}>
                  No requests found
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r._id}>
                  <td style={styles.td}>{r.studentName}</td>
                  <td style={styles.td}>{r.regNo}</td>
                  <td style={styles.td}>{r.eventName}</td>
                  <td style={styles.td}>
                    {new Date(r.startDate).toLocaleDateString()} -{" "}
                    {new Date(r.endDate).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={{ ...styles.btn, ...styles.view }}
                      onClick={() => viewProof(r.proofFile)}
                    >
                      View
                    </button>
                  </td>
                  <td style={styles.td}>{r.status}</td>
                  <td style={styles.td}>
                    <button
                      style={{ ...styles.btn, ...styles.approve }}
                      onClick={() => openModal(r)}
                    >
                      Approve / Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Process OD Request</h3>
            <p>
              <b>Student:</b> {currentReq.studentName}
            </p>
            <p>
              <b>Event:</b> {currentReq.eventName}
            </p>
            <textarea
              rows="3"
              style={{ width: "100%", marginTop: 10 }}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks..."
            ></textarea>
            <div style={{ marginTop: 15, textAlign: "right" }}>
              <button
                style={{ ...styles.btn, marginRight: 8 }}
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.btn, ...styles.reject, marginRight: 8 }}
                onClick={() => updateStatus("Rejected")}
              >
                Reject
              </button>
              <button
                style={{ ...styles.btn, ...styles.approve }}
                onClick={() => updateStatus("Approved")}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
