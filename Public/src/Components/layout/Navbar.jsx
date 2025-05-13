/**
 * Navbar Component
 *
 * This is the main navigation component that appears at the top of every page.
 * It provides easy access to different sections of the application and handles user authentication.
 *
 * Key Features:
 * - Responsive design that works on all screen sizes
 * - Smooth scrolling to different sections
 * - Dynamic login/logout functionality
 * - Brand logo and navigation links
 *
 * Technical Implementation:
 * - Uses React Router for navigation
 * - Implements smooth scrolling using scrollIntoView
 * - Manages authentication state using localStorage
 * - Styled using CSS modules for better maintainability
 *
 * @author [Your Name]
 * @version 1.0
 */

import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "../../Css/layout.css"; // Navbar styles

const Navbar = () => {
  // Get navigation function from React Router
  const navigate = useNavigate();

  // Check if user is logged in by looking for token in localStorage
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  /**
   * Handles user logout by:
   * 1. Removing authentication token
   * 2. Redirecting to login page
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    // Optionally clear other user info
    navigate("/login");
  };

  /**
   * Smoothly scrolls to a section when navigation link is clicked
   * @param {string} sectionId - The ID of the section to scroll to
   */
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left: Logo */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Resume Scanner Logo" />
          <span>Resume Scanner</span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="navbar-links">
          <a href="#hero" onClick={() => scrollToSection("hero")}>
            Home
          </a>
          <a href="#services" onClick={() => scrollToSection("services")}>
            Services
          </a>
          <a href="#features" onClick={() => scrollToSection("features")}>
            Features
          </a>
          <a href="#dashboard" onClick={() => scrollToSection("dashboard")}>
            Dashboard
          </a>
          <a href="#contact" onClick={() => scrollToSection("contact")}>
            Contact
          </a>
        </div>

        {/* Right: Auth Button */}
        <div className="navbar-auth">
          {isLoggedIn ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login">
              <button>Login</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
