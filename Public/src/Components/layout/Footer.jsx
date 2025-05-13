/**
 * Footer Component
 * 
 * A modern, responsive footer that includes:
 * - Logo and brand information
 * - Navigation links
 * - Social media links
 * - Copyright information
 */

import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import '../../Css/layout.css';  // Footer styles

const Footer = () => {
    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    };
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <img src={logo} alt="Resume Scanner Logo" />
            <span>Resume Scanner</span>
          </div>
          <p>Streamline your hiring process with our AI-powered resume scanning solution.</p>
          <div className="footer-social">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <div className="footer-links">
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
        </div>

        <div className="footer-section">
          <h3>Support</h3>
          <div className="footer-links">
          <a href="#contact" onClick={() => scrollToSection("contact")}>
            Contact us
          </a>
            <Link to="/">FAQ</Link>
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms of Service</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Resume Scanner. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
