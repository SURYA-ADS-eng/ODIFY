const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const OD = require("../models/ODRequest");

// Today's OD count
router.get("/today", auth, roleCheck(["Admin"]), async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const count = await OD.countDocuments({ startDate: { $gte: start, $lte: end } });

  res.json({ todayCount: count });
});

// Pending certificates
router.get("/pending-certificates", auth, roleCheck(["Admin"]), async (req, res) => {
  const list = await OD.find({ status: "ProofPending" });
  res.json(list);
});

module.exports = router;
