const express = require("express");
const router = express.Router();
const { signup , signin} = require("../Controller/authController.js");
const { jdUpload, getResumes, resumeUpload } = require("../Controller/resumeController.js");

router.post("/jdupload", jdUpload);
router.post("/upload", resumeUpload);
router.post("/getresume", getResumes);

module.exports = router;
