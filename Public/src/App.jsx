/**
 * Main App Component
 * This is the root component of the application that handles routing and layout
 *
 * Key Features:
 * - Implements React Router for navigation
 * - Manages application-wide routing
 * - Handles authentication routes
 *
 * Best Practices Demonstrated:
 * - Component organization
 * - Route management
 * - Clean code structure
 *
 * @author Dinesh Santosh Khairnar
 * @version 1.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/Home/HomePage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Sort from "./Components/features/Sort";
import Ranking from "./Components/features/Ranking";
import "./Css/layout.css"; // Global styles

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          {/* Home route - Main landing page */}
          <Route path="/" element={<HomePage />} />

          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Feature routes */}
          <Route path="/sort" element={<Sort />} />
          <Route path="/ranking" element={<Ranking />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
