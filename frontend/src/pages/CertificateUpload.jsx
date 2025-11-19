import { useState } from "react";
import axios from "axios";

export default function CertificateUpload() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [certificateImage, setCertificateImage] = useState(null);
  const [evidenceImage, setEvidenceImage] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("startDate", startDate);
    form.append("endDate", endDate);
    form.append("certificateImage", certificateImage);
    form.append("evidenceImage", evidenceImage);

    const token = localStorage.getItem("token");

    await axios.post("http://localhost:5000/certificate/submit", form, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Uploaded");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Certificate</h2>

      <form onSubmit={submitHandler}>
        <label>Start Date</label>
        <br />
        <input
          type="date"
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <br />
        <br />

        <label>End Date</label>
        <br />
        <input
          type="date"
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <br />
        <br />

        <label>Certificate JPG</label>
        <br />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCertificateImage(e.target.files[0])}
          required
        />
        <br />
        <br />

        <label>Evidence Photo</label>
        <br />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setEvidenceImage(e.target.files[0])}
          required
        />
        <br />
        <br />

        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
