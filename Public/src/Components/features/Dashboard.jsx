/**
 * Dashboard Component
 * 
 * A feature component that displays:
 * - Statistics dashboard
 * - Total resumes count
 * - Relevant resumes count
 */

import React from "react";
import "../../Css/Home.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Statistics Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-item">
          <h2>Total Resumes</h2>
          <p>500</p>
        </div>
        <div className="dashboard-item">
          <h2>Relevant Resumes</h2>
          <p>250</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 