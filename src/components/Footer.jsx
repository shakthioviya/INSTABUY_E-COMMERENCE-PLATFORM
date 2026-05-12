import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-gradient" />
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <span className="logo-icon">🛍️</span>
                <span className="logo-text">ShopEase</span>
              </Link>
              <p className="footer-tagline">
                Your one-stop destination for premium products at unbeatable prices.
              </p>
              <div className="social-links">
                <a href="#" className="social-link"><FiInstagram /></a>
                <a href="#" className="social-link"><FiFacebook /></a>
                <a href="#" className="social-link"><FiTwitter /></a>
                <a href="#" className="social-link"><FiYoutube /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/category/electronics">Electronics</Link></li>
                <li><Link to="/category/clothing">Clothing</Link></li>
                <li><Link to="/category/beauty">Beauty</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="footer-section">
              <h4>Customer Service</h4>
              <ul>
                <li><Link to="/orders">Track Order</Link></li>
                <li><Link to="/cart">Shopping Cart</Link></li>
                <li><a href="#">Returns & Refunds</a></li>
                <li><a href="#">FAQs</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-section">
              <h4>Contact Us</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <FiMail />
                  <span>support@shopease.com</span>
                </div>
                <div className="contact-item">
                  <FiPhone />
                  <span>+91 1800 123 4567</span>
                </div>
                <div className="contact-item">
                  <FiMapPin />
                  <span>Mumbai, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 ShopEase. All rights reserved.</p>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;