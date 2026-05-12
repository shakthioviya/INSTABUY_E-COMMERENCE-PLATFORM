import React from "react";
import "./Welcome.css";
 
export default function Contact() {
  return (
    <div className="welcome-container">
 
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
 
          <div className="hero-text">
            <h1 className="hero-title">
  Contact <span className="brand-name">InstaBuy</span>
</h1>
 
<p className="hero-description">
  At InstaBuy, we believe in building strong and meaningful relationships with our customers.
  Every interaction matters to us, and we are committed to providing support that is fast,
  reliable, and helpful.
</p>
 
<p className="hero-description">
  Whether you have a question about your order, need assistance with payments, or want to
  share your feedback, our team is always ready to assist you. We strive to make your shopping
  experience smooth, secure, and stress-free at every step.
</p>
 
<p className="hero-description">
  Your satisfaction is our priority, and we continuously work to improve our services based on
  your needs. From resolving issues quickly to guiding you through your shopping journey,
  InstaBuy is here to support you anytime, anywhere.
</p>
 
<p className="hero-description">
  Feel free to reach out to us — because at InstaBuy, every customer matters and every voice is heard.
</p>
          </div>
 
        </div>
      </section>
 
      {/* CONTACT DETAILS + FORM */}
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
 
          {/* LEFT SIDE */}
          <div>
            <h2 className="section-title" style={{ textAlign: "left" }}>
              Get in Touch
            </h2>
 
            <p className="feature-description">
              We’re here to assist you with orders, returns, payments, and general
              queries. Reach out through any of the following channels.
            </p>
 
            <div style={{ marginTop: "1.5rem" }}>
              <p className="feature-description"> Email: support@instabuy.com</p>
              <p className="feature-description"> Phone: +91 98765 43210</p>
              <p className="feature-description"> Location: Chennai , India</p>
            </div>
 
            <div style={{ marginTop: "1.5rem" }}>
              <h3 style={{ color: "#f97316" }}>Support Hours</h3>
              <p className="feature-description">
                Monday – Sunday: 9:00 AM – 9:00 PM
              </p>
              <p className="feature-description">
                24/7 Email Support Available
              </p>
            </div>
 
            <div style={{ marginTop: "1.5rem" }}>
              <h3 style={{ color: "#f97316" }}>Need Help With?</h3>
              <p className="feature-description">• Order tracking & delivery</p>
              <p className="feature-description">• Returns & refunds</p>
              <p className="feature-description">• Payment issues</p>
              <p className="feature-description">• Account & login problems</p>
            </div>
 
            <div style={{ marginTop: "1.5rem" }}>
              <p className="feature-description">
                Our goal is to resolve your queries quickly and provide the best
                support experience possible.
              </p>
            </div>
          </div>
 
          {/* RIGHT SIDE - FORM */}
          <div>
            <h2 className="section-title" style={{ textAlign: "left" }}>
              Send Us a Message
            </h2>
 
            <p className="feature-description">
              Fill out the form below and our team will get back to you as soon
              as possible.
            </p>
 
            <form style={{ marginTop: "1rem" }}>
              <input
                type="text"
                placeholder="Your Name"
                style={inputStyle}
              />
 
              <input
                type="email"
                placeholder="Your Email"
                style={inputStyle}
              />
 
              <input
                type="text"
                placeholder="Subject"
                style={inputStyle}
              />
 
              <textarea
                placeholder="Describe your issue or message..."
                rows="5"
                style={inputStyle}
              ></textarea>
 
              <button className="btn btn-primary btn-large">
                Send Message
              </button>
            </form>
          </div>
 
        </div>
      </section>
 
      {/* EXTRA SECTION */}
      <section style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
        <h2 className="section-title">We’re Here for You</h2>
 
        <p
          className="feature-description"
          style={{ maxWidth: "700px", margin: "0 auto" }}
        >
          At InstaBuy, customer satisfaction is our top priority. We continuously
          improve our support system to ensure every query is handled efficiently
          and professionally.
        </p>
 
        <p
          className="feature-description"
          style={{ maxWidth: "700px", margin: "1rem auto" }}
        >
          Whether you need help with an order or simply want to share your
          experience, we value your feedback and are always ready to assist.
        </p>
      </section>
 
    </div>
  );
}
 
// Input style
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "1rem",
  borderRadius: "8px",
  border: "1px solid #e7e5e4",
  fontSize: "14px",
};
 