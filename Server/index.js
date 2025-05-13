const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const userRoutes = require("./Routes/authRoutes.js");
const resumeRoutes = require("./Routes/resumeRoute.js");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

main().catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://root:root@cluster0.9jvgbhc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        tls: true,
        tlsAllowInvalidCertificates: true,
      }
    );
    console.log("Successfully connected to db");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/user", userRoutes);
app.use("/api/image", resumeRoutes);

app.listen(port, () => {
  console.log("Server started successfully");
});
