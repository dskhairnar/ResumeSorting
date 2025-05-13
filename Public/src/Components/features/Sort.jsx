/**
 * Sort Component
 * 
 * This component displays the results of resume analysis:
 * - Shows matched resumes with their scores
 * - Provides PDF preview functionality
 * - Displays statistics and metrics
 * - Handles resume ranking and filtering
 * 
 * Technical Implementation:
 * - Uses react-pdf for PDF rendering
 * - Implements sorting and filtering
 * - Manages PDF loading states
 * - Handles responsive layout
 * 
 * Props:
 * - matchedResumes: Array of matched resume data
 * - totalResumeCount: Total number of resumes analyzed
 * - matchedResumesCount: Number of resumes that matched criteria
 * - jdWordsCount: Word count of the job description
 * 
 * @author [Your Name]
 * @version 1.0
 */

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "../../Css/Home.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function Sort() {
  // Get data from location state
  const matchedResumes = location.state?.matchedResumes || [];
  const totalResumeCount = location.state?.totalResumeCount || 0;
  const matchedResumesCount = location.state?.matchedResumesCount || 0;
  const jdWordsCount = location.state?.jdWordsCount || 0;

  // State management
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedResume, setSelectedResume] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterScore, setFilterScore] = useState(0);

  /**
   * Handles PDF document load
   * @param {Object} pdf - The loaded PDF document
   */
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  /**
   * Changes the currently selected resume
   * @param {Object} resume - The resume to display
   */
  const handleResumeSelect = (resume) => {
    setSelectedResume(resume);
    setPageNumber(1);
  };

  /**
   * Toggles the sort order between ascending and descending
   */
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  /**
   * Filters resumes based on minimum score
   * @param {number} score - Minimum score threshold
   */
  const handleFilterChange = (score) => {
    setFilterScore(score);
  };

  // Sort and filter resumes
  const sortedResumes = [...matchedResumes]
    .filter((resume) => resume.score >= filterScore)
    .sort((a, b) => {
      return sortOrder === "desc"
        ? b.score - a.score
        : a.score - b.score;
    });

  return (
    <div className="sort-container">
      {/* Header Section */}
      <div className="sort-header">
        <h1>Resume Analysis Results</h1>
        <div className="stats-container">
          <div className="stat-item">
            <h3>Total Resumes</h3>
            <p>{totalResumeCount}</p>
          </div>
          <div className="stat-item">
            <h3>Matched Resumes</h3>
            <p>{matchedResumesCount}</p>
          </div>
          <div className="stat-item">
            <h3>JD Word Count</h3>
            <p>{jdWordsCount}</p>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls-container">
        <div className="sort-controls">
          <button onClick={toggleSortOrder}>
            Sort {sortOrder === "desc" ? "↓" : "↑"}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={filterScore}
            onChange={(e) => handleFilterChange(Number(e.target.value))}
          />
          <span>Min Score: {filterScore}%</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="sort-content">
        {/* Resume List */}
        <div className="resume-list">
          {sortedResumes.map((resume, index) => (
            <div
              key={index}
              className={`resume-item ${
                selectedResume === resume ? "selected" : ""
              }`}
              onClick={() => handleResumeSelect(resume)}
            >
              <h3>{resume.name}</h3>
              <p>Score: {resume.score}%</p>
              <p>Skills: {resume.skills.join(", ")}</p>
            </div>
          ))}
        </div>

        {/* PDF Viewer */}
        <div className="pdf-viewer">
          {selectedResume ? (
            <>
              <Document
                file={selectedResume.url}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div>Loading PDF...</div>}
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
              <div className="pdf-controls">
                <button
                  disabled={pageNumber <= 1}
                  onClick={() => setPageNumber(pageNumber - 1)}
                >
                  Previous
                </button>
                <p>
                  Page {pageNumber} of {numPages}
                </p>
                <button
                  disabled={pageNumber >= numPages}
                  onClick={() => setPageNumber(pageNumber + 1)}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="no-resume-selected">
              <p>Select a resume to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sort; 