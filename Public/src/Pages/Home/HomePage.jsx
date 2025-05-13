/**
 * HomePage Component
 *
 * This is the main landing page of the application that showcases all key features
 * and provides access to the resume scanning service.
 *
 * Key Features:
 * - Hero section with main value proposition
 * - Resume upload and analysis service
 * - Feature highlights with visual cards
 * - Statistics dashboard
 * - Contact section
 *
 * Technical Implementation:
 * - Modular component structure
 * - Responsive design
 * - Dynamic feature cards
 * - Section-based navigation
 *
 * @author [Your Name]
 * @version 1.0
 */

import Navbar from "../../Components/layout/Navbar";
import Footer from "../../Components/layout/Footer";
import Hero from "../../Components/common/Hero";
import Dashboard from "../../Components/features/Dashboard";
import Contact from "../../Components/common/Contact";
import Services from "../../Components/features/Services";
import Card from "../../Components/common/Card";
import "../../Css/Home.css";
import "../../Css/layout.css";

const HomePage = () => {
  // Feature cards data - can be moved to a separate config file
  const features = [
    {
      title: "AI-Powered Scanning",
      description:
        "Advanced algorithms to analyze resumes quickly and accurately",
      image: "/src/assets/ai-scan.png",
    },
    {
      title: "Smart Ranking",
      description: "Automatically rank candidates based on job requirements",
      image: "/src/assets/ranking.png",
    },
    {
      title: "Customizable Filters",
      description: "Set your own criteria for candidate evaluation",
      image: "/src/assets/filter.png",
    },
  ];

  return (
    <div className="scrollable">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section - Main value proposition */}
      <section id="hero" className="section">
        <Hero />
      </section>

      {/* Services Section - Resume upload and analysis */}
      <section id="services" className="section">
        <Services />
      </section>

      {/* Features Section - Key features showcase */}
      <section id="features" className="section">
        <div className="features">
          <h1>Key Features</h1>
          <div className="feature-grid">
            {/* Map through features to create feature cards */}
            {features.map((feature, index) => (
              <Card
                key={index}
                resume={{
                  filename: feature.title,
                  content: feature.image,
                  description: feature.description,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Section - Statistics and metrics */}
      <section id="dashboard" className="section">
        <Dashboard />
      </section>

      {/* Contact Section - Get in touch */}
      <section id="contact" className="section">
        <Contact />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
