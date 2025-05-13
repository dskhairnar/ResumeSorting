/**
 * Resume Controller
 *
 * This controller handles all resume-related operations:
 * - Resume file upload and processing
 * - Job description analysis
 * - Resume matching and scoring
 * - PDF parsing and text extraction
 *
 * Technical Implementation:
 * - Uses multer for file uploads
 * - Implements PDF parsing with pdf-parse
 * - Handles MongoDB operations
 * - Manages file system operations
 *
 * Dependencies:
 * - multer: File upload handling
 * - pdf-parse: PDF text extraction
 * - fs: File system operations
 * - path: Path manipulation
 * - Resume: MongoDB model
 *
 * @author [Your Name]
 * @version 1.0
 */

const express = require("express");
const multer = require("multer");
const PDFParser = require("pdf-parse");
const fs = require("fs");
const { removeStopwords } = require("stopword");
const natural = require("natural");
const Resume = require("../Models/Resume.js");
const path = require("path");
const mkdirp = require("mkdirp");

// Create necessary directories with absolute paths
const uploadsDirectory = path.join(__dirname, "../uploads");
const jduploadDirectory = path.join(__dirname, "../jduploads");

// Ensure directories exist with proper permissions
try {
  mkdirp.sync(uploadsDirectory, { mode: 0o755 });
  mkdirp.sync(jduploadDirectory, { mode: 0o755 });
  console.log("Upload directories created successfully");
} catch (error) {
  console.error("Error creating directories:", error);
}

const tokenizer = new natural.WordTokenizer();

// Configure multer storage with error handling
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    try {
      await mkdirp(uploadDir);
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    // Sanitize filename and add timestamp to prevent conflicts
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const timestamp = Date.now();
    cb(null, `${timestamp}-${sanitizedFilename}`);
  },
});

// Configure multer with file filter and limits
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10, // Maximum 10 files
  },
}).array("resumes", 10); // Allow up to 10 files

const jdstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, jduploadDirectory);
  },
  filename: function (req, file, cb) {
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const timestamp = Date.now();
    cb(null, `${timestamp}-${sanitizedFilename}`);
  },
});

const jdupload = multer({
  storage: jdstorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

//%%%%%%%%%%%%%%%%%%%%%%%%%  JD upload  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const jdUpload = [
  jdupload.single("jd"),
  async (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No JD uploaded" });
    }

    try {
      // Read PDF file from the file path and extract text
      const filePath = file.path;
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await PDFParser(dataBuffer);
      const resumeText = pdfData.text;

      // Tokenize and remove stopwords
      const tokenizedText = tokenizer.tokenize(resumeText);
      const processedText = removeStopwords(tokenizedText);
      const jdWordsCount = processedText.length;

      fs.unlinkSync(filePath);

      return res.json({
        msg: "JD Uploaded Successfully",
        processedText: processedText.join(" "),
        jdWordsCount,
      });
    } catch (error) {
      console.error("Error processing JD:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
];

//%%%%%%%%%%%%%%%%%%%%%%%%%  Resume upload  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const resumeUpload = [
  (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ error: "File size too large. Maximum size is 5MB" });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res
            .status(400)
            .json({ error: "Too many files. Maximum is 10 files" });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    try {
      await Resume.deleteMany({});
      const uploadedResumes = [];

      for (const file of files) {
        try {
          const filePath = file.path;
          console.log(`Processing file: ${filePath}`);

          // Ensure file exists
          if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            continue;
          }

          // Read PDF file and extract text
          const dataBuffer = fs.readFileSync(filePath);
          const pdfData = await PDFParser(dataBuffer);
          const resumeText = pdfData.text;

          if (!resumeText || resumeText.trim().length === 0) {
            console.error(
              `Empty or invalid PDF content in file: ${file.originalname}`
            );
            continue;
          }

          // Tokenize and Remove stopwords
          const tokenResume = tokenizer.tokenize(resumeText);
          const processedText = removeStopwords(tokenResume);

          // Convert to array of strings as required by the schema
          const contentArray = processedText.map((word) => word.toString());

          const newResume = new Resume({
            filename: file.originalname,
            content: contentArray,
            pdfString: dataBuffer.toString("base64"),
          });

          const savedResume = await newResume.save();
          console.log(`Successfully saved resume: ${file.originalname}`);
          uploadedResumes.push(savedResume);

          // Delete the file after processing
          try {
            fs.unlinkSync(filePath);
            console.log(`Deleted temporary file: ${filePath}`);
          } catch (unlinkError) {
            console.error(`Error deleting file ${filePath}:`, unlinkError);
          }
        } catch (fileError) {
          console.error(
            `Error processing file ${file.originalname}:`,
            fileError
          );
          // Continue with next file even if one fails
          continue;
        }
      }

      if (uploadedResumes.length === 0) {
        return res.status(500).json({
          error: "Failed to process any resumes",
          details: "No valid resumes were processed",
        });
      }

      return res.json({
        msg: `${uploadedResumes.length} resume(s) uploaded successfully`,
        status: true,
        uploadedResumes,
      });
    } catch (error) {
      console.error("Error uploading resumes:", error);
      return res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    }
  },
];

//%%%%%%%%%%%%%%%%%%%%%%%%%  Analyze  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const getResumes = async (req, res) => {
  const { parsedJDText } = req.body;

  if (!parsedJDText) {
    return res.status(400).json({ error: "No JD text provided" });
  }

  try {
    // Tokenize the JD text
    const tokenizer = new natural.WordTokenizer();
    const jdTokens = tokenizer.tokenize(parsedJDText);

    const allResumes = await Resume.find();

    const matchedResumes = [];
    let totalResumesCount = 0;
    let matchedResumesCount = 0;

    for (const resume of allResumes) {
      const resumeTokens = resume.content;

      totalResumesCount++;

      // Count matching words in the resume
      const matchingWordsCount = jdTokens.reduce((count, token) => {
        return count + (resumeTokens.includes(token) ? 1 : 0);
      }, 0);

      if (matchingWordsCount > 0) {
        matchedResumes.push({
          resume: resume,
          matchingWordsCount: matchingWordsCount,
          pdfContent: resume.pdflink,
        });

        matchedResumesCount++;
      }
    }

    matchedResumes.sort((a, b) => b.matchingWordsCount - a.matchingWordsCount);

    return res.json({
      status: true,
      matchedResumes,
      totalResumesCount,
      matchedResumesCount,
    });
  } catch (error) {
    console.error("Error searching resumes:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

//%%%%%%%%%%%%%%%%%%%%%%%%%  Analyze Resumes  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const analyzeResumes = async (req, res) => {
  try {
    const { jdText } = req.body;

    if (!jdText) {
      return res
        .status(400)
        .json({ error: "Job description text is required" });
    }

    // Get all resumes from database
    const resumes = await Resume.find({});

    if (!resumes || resumes.length === 0) {
      return res.status(404).json({ error: "No resumes found to analyze" });
    }

    // Process job description
    const jdTokens = tokenizer.tokenize(jdText);
    const processedJD = removeStopwords(jdTokens);

    // Analyze each resume
    const analyzedResumes = resumes.map((resume) => {
      const resumeTokens = tokenizer.tokenize(resume.text);
      const processedResume = removeStopwords(resumeTokens);

      // Calculate match score using TF-IDF
      const tfidf = new natural.TfIdf();
      tfidf.addDocument(processedJD);
      tfidf.addDocument(processedResume);

      let score = 0;
      processedJD.forEach((term) => {
        score += tfidf.tfidf(term, 1) * tfidf.tfidf(term, 0);
      });

      return {
        filename: resume.filename,
        score: score,
        text: resume.text,
      };
    });

    // Sort resumes by score in descending order
    analyzedResumes.sort((a, b) => b.score - a.score);

    return res.json({
      success: true,
      analyzedResumes,
    });
  } catch (error) {
    console.error("Error analyzing resumes:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  jdUpload,
  resumeUpload,
  getResumes,
  analyzeResumes,
};
