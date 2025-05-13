/**
 * Resume Model
 *
 * This model defines the schema for resume documents in MongoDB:
 * - Stores resume file information
 * - Maintains PDF content and extracted text
 * - Tracks upload metadata
 *
 * Schema Fields:
 * - filename: Original name of the uploaded file
 * - pdfString: Base64 encoded PDF content
 * - text: Extracted text from PDF
 * - uploadDate: Timestamp of upload
 * - score: Optional matching score
 * - skills: Array of extracted skills
 *
 * Technical Implementation:
 * - Uses Mongoose Schema
 * - Implements timestamps
 * - Handles file metadata
 *
 * Dependencies:
 * - mongoose: MongoDB ODM
 *
 * @author [Your Name]
 * @version 1.0
 */

const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, "Filename is required"],
      trim: true,
    },
    pdfString: {
      type: String,
      required: [true, "PDF content is required"],
    },
    text: {
      type: String,
      required: [true, "Extracted text is required"],
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    score: {
      type: Number,
      default: 0,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
resumeSchema.index({ filename: 1 });
resumeSchema.index({ uploadDate: -1 });
resumeSchema.index({ score: -1 });

// Add text index for full-text search
resumeSchema.index({ text: "text" });

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
