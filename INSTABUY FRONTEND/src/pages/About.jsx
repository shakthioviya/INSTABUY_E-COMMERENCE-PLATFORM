import React from "react";
import "./Welcome.css";
 
export default function About() {
  return (
    <div className="welcome-container">
 
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
 
          <div className="hero-text">
            <h1 className="hero-title">
              About <span className="brand-name">InstaBuy</span>
            </h1>
 
            <p className="hero-description">
              InstaBuy is a modern e-commerce platform designed to transform the
              way people shop online. We combine technology, convenience, and
              affordability to create a seamless shopping experience.
            </p>
 
            <p className="hero-description">
              From discovering products to doorstep delivery, InstaBuy ensures
              every step is simple, fast, and reliable.
            </p>
          </div>
 
          <div className="hero-image">
            <div className="image-container">
              <div className="hero-graphic">
                <div className="circle-bg"></div>
              </div>
            </div>
          </div>
 
        </div>
      </section>
 
      {/* IMAGE */}
      <section style={{ padding: "2rem 1.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            alt="team"
            style={{
              width: "100%",
              borderRadius: "20px",
            }}
          />
        </div>
      </section>
 
      {/* DIFFERENCE + TRUST */}
      <section className="features-section">
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
          }}
        >
 
          {/* LEFT */}
          <div>
            <h2 className="section-title" style={{ textAlign: "left" }}>
              What Makes InstaBuy Different
            </h2>
 
            <p className="feature-description">
              InstaBuy is built with a strong focus on user experience and
              innovation. Unlike traditional platforms, we simplify every step of
              the shopping journey.
            </p>
 
            <p className="feature-description">
              Our platform is designed to reduce search time, improve product
              discovery, and provide a smooth checkout experience.
            </p>
 
            <div style={{ marginTop: "1rem" }}>
              <p className="feature-description">⚡ Faster browsing & checkout</p>
              <p className="feature-description">🎯 Smart product recommendations</p>
              <p className="feature-description">💰 Best deals & pricing</p>
              <p className="feature-description">📦 Reliable delivery network</p>
              <p className="feature-description">🔐 Secure payment system</p>
            </div>
          </div>
 
          {/* RIGHT */}
          <div>
            <h2 className="section-title" style={{ textAlign: "left" }}>
              Why Users Trust InstaBuy
            </h2>
 
            <p className="feature-description">
              Trust is at the core of everything we do. We focus on transparency,
              reliability, and delivering consistent value to our customers.
            </p>
 
            <p className="feature-description">
              Our systems are designed to ensure secure transactions, authentic
              products, and a smooth post-purchase experience.
            </p>
 
            <div style={{ marginTop: "1rem" }}>
              <p className="feature-description">✔ Transparent pricing</p>
              <p className="feature-description">✔ Verified sellers</p>
              <p className="feature-description">✔ Secure transactions</p>
              <p className="feature-description">✔ Easy returns & support</p>
              <p className="feature-description">✔ Consistent service</p>
            </div>
          </div>
 
        </div>
      </section>
 
      {/* ACHIEVEMENTS */}
      <section style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
        <h2 className="section-title">Our Growth & Achievements</h2>
 
        <div className="stats">
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Products</span>
          </div>
 
          <div className="stat-item">
            <span className="stat-number">25K+</span>
            <span className="stat-label">Customers</span>
          </div>
 
          <div className="stat-item">
            <span className="stat-number">5K+</span>
            <span className="stat-label">Orders Delivered</span>
          </div>
        </div>
 
        <p
          className="feature-description"
          style={{ maxWidth: "700px", margin: "2rem auto" }}
        >
          InstaBuy is continuously expanding its reach and improving its
          platform. With a growing customer base and product range, we are
          building a reliable ecosystem that prioritizes user satisfaction.
        </p>
      </section>
 
      {/* EXTRA SECTION (NEW 🔥) */}
      <section style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
        <h2 className="section-title">Our Commitment</h2>
        <p
          className="feature-description"
          style={{ maxWidth: "700px", margin: "0 auto" }}
        >
          At InstaBuy, we are committed to delivering excellence in every aspect
          of our service. From product quality to customer support, we ensure
          that every interaction adds value to your shopping experience.
        </p>
 
        <p
          className="feature-description"
          style={{ maxWidth: "700px", margin: "1rem auto" }}
        >
          We continuously innovate and adapt to changing customer needs, ensuring
          that InstaBuy remains a reliable and future-ready platform.
        </p>
      </section>
 
      {/* MISSION & VISION */}
      <section className="features-section">
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2 className="section-title">Our Mission</h2>
          <p className="feature-description">
            To simplify online shopping by offering better products, better
            prices, and better experiences.
          </p>
 
          <h2 className="section-title" style={{ marginTop: "2rem" }}>
            Our Vision
          </h2>
          <p className="feature-description">
            To become a trusted and widely preferred e-commerce platform known
            for innovation, convenience, and customer satisfaction.
          </p>
        </div>
      </section>
 
    </div>
  );
}