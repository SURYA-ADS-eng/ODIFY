const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const OD = require("../models/ODRequest");

router.get("/dashboard", auth, roleCheck(["Faculty"]), async (req, res) => {
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
