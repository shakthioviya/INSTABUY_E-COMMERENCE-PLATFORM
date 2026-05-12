import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./Welcome.css";

const menuItems = {
  Information: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "FAQs", href: "/faqs" },
    { name: "Help & Support", href: "/help" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Refund & Return Policy", href: "/refund" },
    { name: "Shipping Policy", href: "/shipping" },
  ],
  Business: [
    { name: "Dealers", href: "http://localhost:3000" },
  ],
};

const typingTexts = [
  "Shop Smarter, Live Better",
  "Instant Deals, Instant Joy",
  "Your One-Stop Shopping Destination",
  "Best Prices, Best Quality",
];

export default function Welcome() {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing animation effect
  useEffect(() => {
    const currentFullText = typingTexts[currentTextIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentFullText.length) {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTextIndex]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('.sidebar-menu') && !e.target.closest('.menu-button')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="welcome-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          {/* Left - Menu Button */}
          <div className="header-left">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="menu-button"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
            <div className="logo">
              <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="logo-text">InstaBuy</span>
            </div>
          </div>

          {/* Center */}
          <div className="header-center">
            <span className="greeting">Hello, <span className="username">User</span></span>
          </div>

          {/* Right */}
          <div className="header-right">
            <button className="btn btn-ghost" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="btn btn-primary" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`sidebar-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-content">

          <div className="mobile-greeting">
            <span>Hello, <span className="username">User</span></span>
          </div>

          {Object.entries(menuItems).map(([category, items]) => (
            <div key={category} className="menu-category">
              <h3 className="category-title">{category}</h3>
              <ul className="menu-list">
                {items.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="menu-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>{item.name}</span>
                      <svg className="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && <div className="overlay" onClick={() => setIsMenuOpen(false)}></div>}

      {/* Hero */}
      <main className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="brand-name">InstaBuy</span>
            </h1>

            <div className="typing-container">
              <p className="typing-text">
                {displayText}
                <span className="cursor">|</span>
              </p>
            </div>

            <p className="hero-description">
              Discover amazing products at unbeatable prices. Fast delivery, secure payments, and exceptional customer service.
            </p>

            <div className="hero-buttons">
              <button className="btn btn-primary btn-large" onClick={() => navigate("/login")}>
                Start Shopping
              </button>
              <button className="btn btn-outline btn-large" onClick={() => navigate("/about")}>
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100K+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">99%</span>
                <span className="stat-label">Satisfaction</span>
              </div>
            </div>
          </div>

          {/* ✅ Hero Image - loads from public folder, no import needed */}
          <div className="hero-image">
            <div className="image-container">
              <div className="floating-card card-1">
                <span>Free Shipping</span>
              </div>
              <div className="floating-card card-2">
                <span>Secure Payment</span>
              </div>
              <div className="hero-graphic">
                <div className="circle-bg">
                  <img
                    src="/hero-image.png"
                    alt="InstaBuy Shopping"
                    className="hero-circle-img"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="logo-text">InstaBuy</span>
            <p className="footer-tagline">Your one-stop shopping destination</p>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 InstaBuy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
