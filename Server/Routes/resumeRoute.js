/**
 * Resume Routes
 *
 * This module defines all resume-related API endpoints:
 * - POST /upload: Upload and process resume files
 * - POST /analyze: Analyze resumes against job description
 * - POST /jd: Upload and process job description
 *
 * Technical Implementation:
 * - Uses Express Router
 * - Implements middleware for file uploads
 * - Handles multipart/form-data
 * - Validates request data
 *
 * Dependencies:
 * - express: Web framework
 * - resumeController: Controller functions
 * - multer: File upload middleware
 *
 * @author [Your Name]
 * @version 1.0
 */

const express = require("express");
const router = express.Router();
const {
  resumeUpload,
  analyzeResumes,
  jdUpload,
} = require("../Controller/resumeController");
const multer = require("multer");
const path = require("path");

// Configure multer for job description upload
const jdstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, "jd-" + Date.now() + "-" + file.originalname);
  },
});

const jdupload = multer({
  storage: jdstorage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("jd");

/**
 * @route POST /api/resume/upload
 * @desc Upload and process resume files
 * @access Public
 */
router.post("/upload", resumeUpload);

/**
 * @route POST /api/resume/analyze
 * @desc Analyze resumes against job description
 * @access Public
 */
router.post("/analyze", analyzeResumes);

/**
 * @route POST /api/resume/jd
 * @desc Upload and process job description
 * @access Public
 */
router.post("/jd", jdupload, jdUpload);

module.exports = router;
