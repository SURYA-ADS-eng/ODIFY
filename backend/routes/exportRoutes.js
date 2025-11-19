const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");
const { MongoClient } = require("mongodb");

// MongoDB connection
const uri = "mongodb://localhost:27017";
const dbName = "od_management";

router.get("/download/od-excel", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const odCol = db.collection("odrequests");

    // Fetch all OD Requests
    const odData = await odCol.find().toArray();

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("OD Requests");

    // Set columns dynamically
    if (odData.length > 0) {
      sheet.columns = Object.keys(odData[0]).map((key) => {
        return { header: key, key: key };
      });
    }

    // Add rows
    odData.forEach((item) => sheet.addRow(item));

    // Set response headers for Excel download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=odrequests.xlsx"
    );

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Export failed:", err);
    res.status(500).send("Error generating Excel file");
  } finally {
    await client.close();
  }
});

module.exports = router;