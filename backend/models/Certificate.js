const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    certificateImage: { type: String, required: true },
    evidenceImage: { type: String, required: true },

    status: {
      type: String,
      enum: ["Pending", "Reviewed"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Certificate", CertificateSchema);
