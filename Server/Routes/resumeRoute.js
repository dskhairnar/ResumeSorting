const express = require("express");
const multer = require("multer");
const PDFParser = require("pdf-parse");
const fs = require("fs");
const router = express.Router();
const Resume = require("../Models/Resume");
const upload = multer({ dest: "uploads/" });
const natural = require("natural");

const tokenizer = new natural.WordTokenizer();

let uploadedFiles;

router.post("/upload", upload.array("resumes"), async (req, res) => {
  uploadedFiles = req.files;
  if (!uploadedFiles || uploadedFiles.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  try {
    const uploadedResumes = [];

    for (const file of uploadedFiles) {
      const filePath = file.path;

      // Read PDF file and extract text
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await PDFParser(dataBuffer);
      const base64String = dataBuffer.toString("base64");

      const resumeText = pdfData.text;

      // Extracted text
      const tokenResume = tokenizer.tokenize(resumeText);

      const newResume = new Resume({
        filename: file.originalname,
        content: tokenResume,
        pdfString: base64String,
      });

      // Save the new resume document to the database
      const savedResume = await newResume.save();

      // Example: Push the new resume document to the uploadedResumes array
      uploadedResumes.push(newResume);
    }

    return res.json({ status: true, uploadedResumes });
  } catch (error) {
    console.error("Error uploading resumes:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/getresume", async (req, res) => {
  const { searchQuery, skillsQuery } = req.body;

  try {
    // Tokenize the search query and skills query
    const tokenizer = new natural.WordTokenizer();
    const searchTokens = tokenizer.tokenize(searchQuery);
    const skillsTokens = tokenizer.tokenize(skillsQuery);

    // Find all resumes from the database
    const allResumes = await Resume.find();

    // Initialize array to store matched resumes and their PDF files
    const matchedResumes = [];
    let totalResumesCount = 0;
    let matchedResumesCount = 0;

    // Array to store filenames of already added resumes
    const addedResumes = [];

    // Iterate through all resumes to find matches
    for (const resume of allResumes) {
      const resumeTokens = resume.content; // Assuming content is already tokenized

      // Increment total resumes count
      totalResumesCount++;

      // Initialize count for matching words in the resume
      let matchingWordsCount = 0;

      // Check if any search query token is present in the resume
      const searchQueryMatch = searchTokens.some((token) => {
        if (resumeTokens.includes(token)) {
          matchingWordsCount++;
          return true;
        }
        return false;
      });

      // Check if any skills query token is present in the resume
      const skillsQueryMatch = skillsTokens.some((token) => {
        if (resumeTokens.includes(token)) {
          matchingWordsCount++;
          return true;
        }
        return false;
      });

      // If the resume matches any search or skills query token, and the filename is not already in the addedResumes array, add it to the list
      if ((searchQueryMatch || skillsQueryMatch) && !addedResumes.includes(resume.filename)) {
        const matchedFile = uploadedFiles.find(
          (file) => file.originalname === resume.filename
        );
        if (matchedFile) {
          matchedResumes.push({
            resume: resume,
            pdfFile: matchedFile,
            matchingWordsCount: matchingWordsCount,
          });
          matchedResumesCount++; // Increment the matched resumes count
          addedResumes.push(resume.filename); // Add filename to the addedResumes array
        }
      }
    }

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
});

module.exports = router;
