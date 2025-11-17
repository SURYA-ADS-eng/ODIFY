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

// Student submits OD request
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

// Faculty sees pending ODs
router.get("/pending", auth, roleCheck(["Faculty", "HoD", "Admin"]), async (req, res) => {
  const list = await OD.find({ status: "Pending" });
  res.json(list);
});

// Faculty decision
router.post("/:id/decision", auth, roleCheck(["Faculty", "HoD", "Admin"]), async (req, res) => {
  const { action, remarks } = req.body;

  const od = await OD.findById(req.params.id);
  if (!od) return res.status(404).send("Not found");

  od.status = action;
  od.facultyRemarks = remarks;
  od.facultyInCharge = req.user.id;

  await od.save();

  res.json({ msg: "Updated", od });
});

// Upload post-event certificate
router.post("/:id/postproof", auth, upload.single("postEventProof"), async (req, res) => {
  const od = await OD.findById(req.params.id);
  if (!od) return res.status(404).send("Not found");

  od.postEventProof = req.file.path;
  od.status = "ProofPending";

  await od.save();

  res.json({ msg: "Certificate Uploaded", od });
});

module.exports = router;
