/**
 * Card Component
 * A reusable card component for displaying resume information
 * @author Dinesh Santosh Khairnar
 */

function Card({ resume }) {
  return (
    <div className="feature-item">
      <img
        src={resume.content}
        alt={resume.filename}
        style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "1rem" }}
      />
      <h3>{resume.filename}</h3>
      <p>{resume.description}</p>
    </div>
  );
}

export default Card; 