const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  content: { type: [String], required: true },
  pdfString: { type: String, required: true },
});

module.exports = mongoose.model("Resume", resumeSchema);
