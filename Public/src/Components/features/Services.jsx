/**
 * Services Component
 *
 * This component handles the core functionality of resume analysis:
 * - Job Description (JD) upload
 * - Multiple resume file uploads
 * - Resume analysis against JD
 * - Loading states and error handling
 *
 * Technical Implementation:
 * - Uses FormData for file uploads
 * - Implements axios for API calls
 * - Handles multiple file uploads
 * - Manages loading states
 * - Provides user feedback
 *
 * API Endpoints Used:
 * - imageUploadRoute: For resume uploads
 * - getResumeRoute: For resume analysis
 * - jdUploadRoute: For job description upload
 *
 * @author [Your Name]
 * @version 1.0
 */

import { useEffect, useState } from "react";
import axios from "axios";
import {
  imageUploadRoute,
  getResumeRoute,
  jdUploadRoute,
} from "../../Utils/apiroutes";
import { useNavigate } from "react-router-dom";
import "../../Css/Home.css";
import { Spinner } from "flowbite-react";

function Services() {
  // Navigation hook for redirecting after analysis
  const navigate = useNavigate();

  // State management
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [parsedJDText, setParsedJDText] = useState("");
  const [isResumeUpload, setIsResumeUpload] = useState(false);
  const [isJDUpload, setIsJDUpload] = useState(false);
  const [jdWordsCount, setJdWordsCount] = useState(false);
  const [analyzeLoader, setAnalyzeLoader] = useState(false);
  const [uploadLoader, setUploadLoader] = useState(false);

  /**
   * Handles Job Description upload
   * - Validates file
   * - Uploads to server
   * - Updates state with response
   */
  const handleJDUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const file = event.target.elements.jd.files[0];
    formData.append("jd", file);
    try {
      const response = await axios.post(jdUploadRoute, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setParsedJDText(response.data.processedText);
      setResponse(response.data.msg);
      setJdWordsCount(response.data.jdWordsCount);
      setIsJDUpload(true);
    } catch (error) {
      setError("Error uploading JD: " + error.message);
    }
  };

  /**
   * Handles Resume file uploads
   * - Validates multiple files
   * - Checks file types
   * - Uploads to server
   * - Updates state with response
   */
  const handleResumeUpload = async (event) => {
    setUploadLoader(true);
    event.preventDefault();
    const resumeFormData = new FormData();
    const resumeFiles = event.target.elements.resumes.files;

    // Validate file selection
    if (!resumeFiles || resumeFiles.length === 0) {
      setError("Please select at least one resume file");
      setUploadLoader(false);
      return;
    }

    // Validate file types
    for (let i = 0; i < resumeFiles.length; i++) {
      if (resumeFiles[i].type !== "application/pdf") {
        setError("Only PDF files are allowed");
        setUploadLoader(false);
        return;
      }
      resumeFormData.append("resumes", resumeFiles[i]);
    }

    try {
      const response = await axios.post(imageUploadRoute, resumeFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status) {
        setResponse(response.data.msg);
        setIsResumeUpload(true);
      } else {
        setError(response.data.error || "Failed to upload resumes");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError(
        error.response?.data?.error || error.message || "Error uploading files"
      );
    } finally {
      setUploadLoader(false);
    }
  };

  /**
   * Handles resume analysis
   * - Validates both JD and resumes are uploaded
   * - Sends analysis request
   * - Redirects to results page
   */
  const handleSubmit = async (event) => {
    if (isResumeUpload && isJDUpload) {
      setAnalyzeLoader(true);
      event.preventDefault();
      try {
        const response = await axios.post(getResumeRoute, {
          parsedJDText,
        });

        const data = response.data;
        const totalResumeCount = data.totalResumesCount;
        const matchedResumesCount = data.matchedResumesCount;
        const matchedResumes = data.matchedResumes;

        setAnalyzeLoader(false);
        navigate("/sort", {
          state: {
            matchedResumes,
            totalResumeCount,
            matchedResumesCount,
            jdWordsCount,
          },
        });
      } catch (error) {
        setResponse("Error searching resumes: " + error.message);
      }
    } else {
      setError("Please upload both JD and resumes first");
    }
  };

  // Clear success message after 2 seconds
  useEffect(() => {
    if (response) {
      setTimeout(() => {
        setResponse("");
      }, 2000);
    }
  }, [response]);

  // Clear error message after 2 seconds
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  }, [error]);

  return (
    <>
      <div className="homeOuter">
        {/* Section Header */}
        <div className="services-heading">
          <h1>Resume Analysis Service</h1>
          <p>
            Upload your job description and resumes to find the best matches.
            Our AI-powered system will analyze and rank the resumes based on
            their relevance to your requirements.
          </p>
        </div>

        {/* Alert Messages */}
        <div className="alertmsg">
          {response && (
            <div className="alert alert-success" role="alert">
              {response}
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
        </div>

        {/* Input Container for side-by-side layout */}
        <div className="input-container">
          {/* Job Description Upload */}
          <div className="topcount">
            <h1>Upload Job Description</h1>
            <form className="serviceForm" onSubmit={handleJDUpload}>
              <input type="file" name="jd" accept=".pdf" />
              <button className="analyzebtn" type="submit">
                Upload JD
              </button>
            </form>
          </div>

          {/* Resume Files Upload */}
          <div className="lowercount">
            <h1>Upload Resume Files</h1>
            <form className="serviceForm" onSubmit={handleResumeUpload}>
              <input type="file" name="resumes" accept=".pdf" multiple />
              <button className="Uploadbtn" type="submit">
                {uploadLoader ? (
                  <Spinner aria-label="Uploading..." />
                ) : (
                  <h6>Upload Resumes</h6>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="analyze-container">
        <button className="analyzebtn" onClick={handleSubmit}>
          {analyzeLoader ? (
            <Spinner aria-label="Analyzing..." />
          ) : (
            <h1>Analyze Resumes</h1>
          )}
        </button>
      </div>
    </>
  );
}

export default Services;
