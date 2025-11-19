const mongoose = require("mongoose");

const ODRequestSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    studentName: String,
    regNo: String,
    dept: String,
    year: String,

    eventName: String,
    organizer: String,
    eventType: String,

    startDate: Date,
    endDate: Date,

    proofFile: String,
    postEventProof: String,

    facultyRemarks: String,
    facultyInCharge: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "ProofPending", "Verified"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ODRequest", ODRequestSchema);
