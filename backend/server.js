require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const exportRoutes = require("./routes/exportRoutes");

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Static folder for uploaded files
// app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/requests", require("./routes/requests"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/faculty", require("./routes/faculty"));
app.use("/certificate", require("./routes/certificate"));
app.use("/api", exportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
