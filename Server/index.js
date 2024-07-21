const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const userRoutes = require("./Routes/authRoutes.js");
const resumeRoutes = require("./Routes/resumeRoute.js");
const cookieParser = require("cookie-parser");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/resumeSorting");
  console.log("Successfully connected to db");
}

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static("uploads"));

app.use("/api/user", userRoutes);
app.use("/api/image", resumeRoutes);

app.listen(port, () => {
  console.log("Server started successfully");
});
