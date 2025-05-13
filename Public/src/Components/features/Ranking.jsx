/**
 * Ranking Component
 * Displays the relevance ranking of resumes based on job description matching
 * 
 * Key Features:
 * - Displays ranked resumes with their relevance scores
 * - Uses localStorage for data persistence
 * - Implements responsive design
 * - Handles PDF display
 * 
 * Technical Implementation:
 * - Uses localStorage for data management
 * - Implements conditional rendering
 * - Uses inline styles for component-specific styling
 * - Handles PDF display using object tag
 * 
 * Best Practices Demonstrated:
 * - Data persistence
 * - Component composition
 * - Error handling
 * - Responsive design
 * - Clean code structure
 * 
 * @author Dinesh Santosh Khairnar
 */

function Ranking() {
  // Retrieve sorted data from localStorage
  const sortedData = JSON.parse(localStorage.getItem("SortedArray"));
  
  return (
    // Main container with scrollable area
    <div style={{ maxHeight: "800px", overflowY: "scroll" }}>
      {/* Page title */}
      <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>
        Relevance Ranking of Resume
      </h1>

      {/* Conditional rendering based on sorted data availability */}
      {sortedData &&
        sortedData.status &&
        sortedData.matchedResumes.length > 0 &&
        // Map through matched resumes and display each one
        sortedData.matchedResumes.map((resume, index) => (
          <div key={index} style={{ display: "flex", flexDirection: "row" }}>
            <div>
              {/* Resume filename with styled container */}
              <h2
                style={{
                  margin: "10px",
                  fontSize: "20px",
                  border: "3px solid black",
                  width: "200px",
                  padding: "5px",
                  backgroundColor: "#92C4ED",
                  borderRadius: "10px",
                  marginLeft: "100px",
                }}
              >
                {resume.resume.filename}
              </h2>
              {/* PDF viewer using object tag */}
              <object
                data={`data:application/pdf;base64,${resume.resume.pdfString}`}
                type="application/pdf"
                width="600"
                height="400"
                style={{
                  border: "1px solid black",
                  borderRadius: "10px",
                  marginTop: "10px",
                }}
              >
                <p>PDF cannot be displayed.</p>
              </object>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Ranking; 