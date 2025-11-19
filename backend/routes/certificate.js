const router = require("express").Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const Certificate = require("../models/Certificate");

// Storage
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ------------------------------
// STUDENT UPLOAD CERTIFICATE
// ------------------------------
router.post(
  "/submit",
  auth,
  upload.fields([
    { name: "certificateImage", maxCount: 1 },
    { name: "evidenceImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files.certificateImage || !req.files.evidenceImage) {
        return res.status(400).send("Both images are required");
      }

      const cert = new Certificate({
        student: req.user.id, // THIS IS PROBABLY UNDEFINED
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        certificateImage: req.files.certificateImage[0].path,
        evidenceImage: req.files.evidenceImage[0].path,
      });

      await cert.save();
      res.json({ msg: "Uploaded", cert });
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },
);
// ------------------------------
// TEACHER GET ALL CERTIFICATES
// ------------------------------
router.get(
  "/all",
  auth,
  roleCheck(["Faculty", "HOD", "Admin"]),
  async (req, res) => {
    const list = await Certificate.find().populate(
      "student",
      "name regNo dept",
    );
    res.json(list);
  },
);

// ------------------------------
// TEACHER REVIEW A CERTIFICATE
// ------------------------------
router.post(
  "/:id/review",
  auth,
  roleCheck(["Faculty", "HOD", "Admin"]),
  async (req, res) => {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).send("Not found");

    cert.status = "Reviewed";
    await cert.save();

    res.json({ msg: "Reviewed", cert });
  },
);

module.exports = router;
