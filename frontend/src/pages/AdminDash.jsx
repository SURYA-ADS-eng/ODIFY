// src/pages/AdminDash.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDash() {
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deptFilter, setDeptFilter] = useState("");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const DEPARTMENTS = [
    "AI&DS", "AI&ML", "BME", "CSE", "IT", "ECE", "EEE", "CIVIL", "MECH"
  ];

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/requests/debug/all", {
        headers: { "x-auth-token": token },
      });
      setAllRequests(res.data || []);
    } catch (err) {
      console.error("Admin fetch error:", err);
     // alert("Failed to load admin dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // FILTER LOGIC
  const filtered = allRequests.filter((r) => {
    let ok = true;

    if (deptFilter && r.student?.dept !== deptFilter) ok = false;

    if (search.trim() !== "") {
      const q = search.toLowerCase();
      const text = `${r.student?.name} ${r.student?.regNo} ${r.eventName} ${r.status}`.toLowerCase();
      if (!text.includes(q)) ok = false;
    }

    return ok;
  });

  // STATISTICS
  const today = new Date().toDateString();

  const todaysCount = allRequests.filter(
    (r) => new Date(r.createdAt).toDateString() === today
  ).length;

  const approved = allRequests.filter((r) => r.status === "Approved").length;
  const rejected = allRequests.filter((r) => r.status === "Rejected").length;
  const pending = allRequests.filter((r) => r.status === "Pending").length;

  const styles = {
    container: { padding: "20px", background: "#f0f2f5", minHeight: "100vh" },
    headerRow: { display: "flex", justifyContent: "space-between", marginBottom: 16 },
    title: { fontSize: 26, fontWeight: "700" },

    topRow: { display: "flex", gap: 12, flexWrap: "wrap" },
    card: {
      flex: 1,
      background: "#fff",
      padding: "14px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      minWidth: "180px",
    },
    cardHead: { color: "#888", fontSize: 13 },
    cardNum: { fontSize: 22, fontWeight: "700", marginTop: 6 },

    filters: { display: "flex", gap: 10, marginTop: 16, marginBottom: 16 },
    select: { padding: 8, borderRadius: 6, border: "1px solid #ddd" },
    input: { padding: 8, borderRadius: 6, border: "1px solid #ddd", minWidth: 220 },

    tableWrap: { overflowX: "auto", marginTop: 10 },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { background: "#fafafa", padding: 10, borderBottom: "1px solid #eee", textAlign: "left" },
    td: { padding: 10, borderBottom: "1px solid #f5f5f5", verticalAlign: "top" },

    proofBtn: {
      padding: "6px 10px",
      background: "#2980b9",
      color: "white",
      textDecoration: "none",
      borderRadius: 6,
      fontSize: 13,
    },

    refreshBtn: {
      padding: "8px 14px",
      background: "#34495e",
      color: "white",
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.headerRow}>
        <div style={styles.title}>Admin Dashboard</div>

        <button style={styles.refreshBtn} onClick={fetchAll}>
          Refresh
        </button>
      </div>

      {/* TOP STATS */}
      <div style={styles.topRow}>
        <div style={styles.card}>
          <div style={styles.cardHead}>Total OD Requests</div>
          <div style={styles.cardNum}>{allRequests.length}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHead}>Today’s OD Count</div>
          <div style={styles.cardNum}>{todaysCount}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHead}>Approved</div>
          <div style={styles.cardNum}>{approved}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHead}>Rejected</div>
          <div style={styles.cardNum}>{rejected}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHead}>Pending</div>
          <div style={styles.cardNum}>{pending}</div>
        </div>
      </div>

      {/* FILTERS */}
      <div style={styles.filters}>
        {/* Department Filter */}
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Search */}
        <input
          placeholder="Search by student name, reg no, event..."
          style={styles.input}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* DATA TABLE */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Student</th>
              <th style={styles.th}>Reg No</th>
              <th style={styles.th}>Dept</th>
              <th style={styles.th}>Event</th>
              <th style={styles.th}>Dates</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Proof</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={styles.td}>
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={styles.td}>
                  No data found.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r._id}>
                  <td style={styles.td}>{r.student?.name}</td>
                  <td style={styles.td}>{r.student?.regNo}</td>
                  <td style={styles.td}>{r.student?.dept}</td>
                  <td style={styles.td}>{r.eventName}</td>

                  <td style={styles.td}>
                    {new Date(r.startDate).toLocaleDateString()} -{" "}
                    {new Date(r.endDate).toLocaleDateString()}
                  </td>

                  <td style={styles.td}>
                    <strong
                      style={{
                        color:
                          r.status === "Approved"
                            ? "green"
                            : r.status === "Rejected"
                            ? "red"
                            : "#444",
                      }}
                    >
                      {r.status}
                    </strong>
                  </td>

                  <td style={styles.td}>
                    {r.proofFile ? (
                      <a
                        href={`http://localhost:5000/${r.proofFile}`}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.proofBtn}
                      >
                        View Proof
                      </a>
                    ) : (
                      <span>No proof</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
