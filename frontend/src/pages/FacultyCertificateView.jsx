import { useEffect, useState } from "react";
import axios from "axios";

export default function FacultyCertificateView() {
  const [list, setList] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/certificate/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setList(res.data);
  };

  const markReviewed = async (id) => {
    const token = localStorage.getItem("token");

    await axios.post(
      `http://localhost:5000/certificate/${id}/review`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    loadData();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Certificate Submissions</h2>

      {list.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid gray",
            padding: 15,
            marginBottom: 20,
            borderRadius: 6,
          }}
        >
          <h3>
            {item.student.name} ({item.student.regNo})
          </h3>

          <p>Dept: {item.student.dept}</p>
          <p>Start: {item.startDate.slice(0, 10)}</p>
          <p>End: {item.endDate.slice(0, 10)}</p>
          <p>Status: {item.status}</p>

          <div style={{ display: "flex", gap: 20 }}>
            <div>
              <p>Certificate:</p>
              <img
                src={`http://localhost:5000/${item.certificateImage}`}
                width="200"
              />
            </div>

            <div>
              <p>Evidence:</p>
              <img
                src={`http://localhost:5000/${item.evidenceImage}`}
                width="200"
              />
            </div>
          </div>

          <br />

          {item.status === "Pending" && (
            <button onClick={() => markReviewed(item._id)}>
              Mark Reviewed
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
