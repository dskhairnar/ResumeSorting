const express = require("express");
const multer = require("multer");
const PDFParser = require("pdf-parse");
const fs = require("fs");
const { removeStopwords } = require("stopword");
const natural = require("natural");
const Resume = require("../Models/Resume.js");
const path = require("path");
const mkdirp = require("mkdirp");

const jduploadDirectory = path.join(__dirname, "jduploads");
mkdirp.sync(jduploadDirectory);

const tokenizer = new natural.WordTokenizer();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const jdstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, jduploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const jdupload = multer({ storage: jdstorage });

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
  upload.array("resumes"),
  async (req, res) => {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    try {
      await Resume.deleteMany({});
      const uploadedResumes = [];

      for (const file of files) {
        const filePath = file.path;

        // Read PDF file and extract text
        const dataBuffer = fs.readFileSync(filePath);
        const base64Encoded = dataBuffer.toString("base64");
        const pdfData = await PDFParser(dataBuffer);
        const resumeText = pdfData.text;

        // Tokenize and Remove stopwords
        const tokenResume = tokenizer.tokenize(resumeText);
        const processedText = removeStopwords(tokenResume);

        const newResume = new Resume({
          filename: file.originalname,
          content: processedText,
          pdfString: base64Encoded,
        });

        const savedResume = await newResume.save();

        uploadedResumes.push(savedResume);

        // Delete the file after processing
        fs.unlinkSync(filePath);
      }

      return res.json({
        msg: "Resumes uploaded successfully",
        status: true,
        uploadedResumes,
      });
    } catch (error) {
      console.error("Error uploading resumes:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
];

//%%%%%%%%%%%%%%%%%%%%%%%%%  Analyze  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const getResumes = async (req, res) => {
  const { parsedJDText } = req.body;

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
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  jdUpload,
  resumeUpload,
  getResumes,
};
