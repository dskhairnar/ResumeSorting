
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={styles.footerContainer}>
      <div style={styles.logoContainer}>
        <img 
          src="src/assets/logo.png" 
          alt="Logo" 
          style={styles.logo} 
        />
      </div>

      <div style={styles.socialMediaContainer}>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={styles.icon}>
          <FaFacebook />
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" style={styles.icon}>
          <FaTwitter />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={styles.icon}>
          <FaInstagram />
        </a>
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" style={styles.icon}>
          <FaLinkedin />
        </a>
        <a href="https://www.github.com" target="_blank" rel="noopener noreferrer" style={styles.icon}>
          <FaGithub />
        </a>
      </div>

      <div style={styles.copyrightContainer}>
        <p>Project by <strong>Dinesh Santosh Khairnar</strong> for <strong>Sunahack Hackathon</strong></p>
        <p>&copy; {new Date().getFullYear()} All Rights Reserved</p>
      </div>
    </footer>
  );
};

const styles = {
  footerContainer: {
    backgroundColor: '#212529',
    color: '#ffffff',
    textAlign: 'center',
    padding: '20px 0',
  },
  logoContainer: {
    marginBottom: '10px',
  },
  logo: {
    height: '60px',
    width: 'auto',
  },
  socialMediaContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '10px',
  },
  icon: {
    color: '#ffffff',
    fontSize: '24px',
    textDecoration: 'none',
  },
  copyrightContainer: {
    fontSize: '14px',
  },
};

export default Footer;
