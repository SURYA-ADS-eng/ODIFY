const express = require("express");
const router = express.Router();
const multer = require("multer");
const OD = require("../models/ODRequest");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

// File upload setup
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/* ======================================================
    ⭐ STUDENT submits OD request
====================================================== */
router.post("/submit", auth, upload.single("proofFile"), async (req, res) => {
  try {
    const od = new OD({
      ...req.body,
      student: req.user.id,
      proofFile: req.file ? req.file.path : null,
    });

    await od.save();
    res.json({ msg: "OD Request Submitted", od });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

/* ======================================================
    ⭐ FACULTY PENDING REQUESTS (for FacultyApproval page)
====================================================== */
router.get(
  "/pending",
  auth,
  roleCheck(["faculty", "hod", "admin"]),
  async (req, res) => {
    const list = await OD.find({ status: "Pending" }).populate(
      "student",
      "name regNo dept year",
    );
    res.json(list);
  },
);

/* ======================================================
    ⭐ FACULTY DASHBOARD — TODAY STATS
====================================================== */
router.get(
  "/faculty/today-stats",
  auth,
  roleCheck(["faculty", "hod", "admin"]),
  async (req, res) => {
    try {
      const dept = req.query.dept;

      const start = new Date();
      start.setHours(0, 0, 0, 0);

      // Filter directly by dept (your model stores dept inside OD, NOT inside student)
      const requests = await OD.find({
        startDate: { $gte: start },
        dept: dept,
      });

      const approved = requests.filter((r) => r.status === "Approved").length;
      const rejected = requests.filter((r) => r.status === "Rejected").length;
      const pending = requests.filter((r) => r.status === "Pending").length;

      res.json({ approved, rejected, pending });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  },
);

/* ======================================================
    ⭐ FACULTY DASHBOARD — MONTH STATS
====================================================== */
router.get(
  "/faculty/month-stats",
  auth,
  roleCheck(["faculty", "hod", "admin"]),
  async (req, res) => {
    try {
      const dept = req.query.dept;

      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);

      const requests = await OD.find({
        startDate: { $gte: start },
        dept: dept,
      });

      const total = requests.length;
      const approved = requests.filter((r) => r.status === "Approved").length;
      const rejected = requests.filter((r) => r.status === "Rejected").length;
      const pending = requests.filter((r) => r.status === "Pending").length;

      res.json({ total, approved, rejected, pending });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  },
);

/* ======================================================
    ⭐ FACULTY DASHBOARD — LIST OF OD REQUESTS (Table)
====================================================== */
router.get(
  "/faculty/dashboard",
  auth,
  roleCheck(["Faculty"]),
  async (req, res) => {
    try {
      const list = await OD.find()
        .populate("student", "name regNo dept year")
        .sort({ createdAt: -1 });

      res.json(list);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  },
);
/* ======================================================
    ⭐ STUDENT VIEWS OWN ODs
====================================================== */
router.get("/student/:id", auth, async (req, res) => {
  try {
    if (
      req.user.id !== req.params.id &&
      !["faculty", "hod", "admin"].includes(req.user.role)
    ) {
      return res.status(403).send("Forbidden");
    }

    const list = await OD.find({ student: req.params.id });
    res.json(list);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

/* ======================================================
    ⭐ FACULTY APPROVE/REJECT OD REQUEST
====================================================== */
router.post(
  "/:id/decision",
  auth,
  roleCheck(["Faculty", "Hod", "Admin"]),
  async (req, res) => {
    const { action, remarks } = req.body;

    const od = await OD.findById(req.params.id);
    if (!od) return res.status(404).send("Not found");

    od.status = action;
    od.facultyRemarks = remarks;
    od.facultyInCharge = req.user.id;

    await od.save();

    res.json({ msg: "Updated", od });
  },
);

/* ======================================================
    ⭐ STUDENT uploads Post-Event Proof
====================================================== */
router.post(
  "/:id/postproof",
  auth,
  upload.single("postEventProof"),
  async (req, res) => {
    const od = await OD.findById(req.params.id);
    if (!od) return res.status(404).send("Not found");

    od.postEventProof = req.file.path;
    od.status = "ProofPending";

    await od.save();

    res.json({ msg: "Certificate Uploaded", od });
  },
);
// GET /api/requests/admin/all
router.get("/admin/all", auth, roleCheck(["Admin"]), async (req, res) => {
  try {
    const list = await OD.find()
      .populate("student", "name regNo dept year")
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});
module.exports = router;
