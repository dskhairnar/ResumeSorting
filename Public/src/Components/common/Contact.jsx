/**
 * Contact Component
 *
 * A common component that displays:
 * - Contact image
 * - Contact information
 */

import img from "../../assets/contactimg.png";
import "../../Css/Home.css";

function Contact() {
  return (
    <div className="contact">
      <img src={img} alt="Contact" />
      <div className="contact-links">
        <a href="/contact">Contact Us</a>
        <a href="/demo">Request Demo</a>
        <a href="/pricing">View Pricing</a>
      </div>
    </div>
  );
}

export default Contact;
