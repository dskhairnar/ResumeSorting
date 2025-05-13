/**
 * Hero Component
 *
 * A common component that displays:
 * - Main heading
 * - Subheading
 * - Call to action button
 */

import "../../Css/Home.css";

function Hero() {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Streamline Your Resume Collection Process</h1>
        <p>Automatically filter resumes based on job descriptions</p>
        <div className="button-link">
          <a href="#services">
            <button>Get Started</button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Hero;
