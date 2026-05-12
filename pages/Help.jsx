import React from "react";
import "./Welcome.css";
 
export default function Help() {
  return (
    <div className="welcome-container">
 
      {/* HEADER (COMPACT) */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
          padding: "1rem 1.5rem 0.5rem",
        }}
      >
        <h1 className="hero-title" style={{ marginBottom: "0.5rem" }}>
          Help & Support <span className="brand-name">InstaBuy</span>
        </h1>
 
        <p
          className="hero-description"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Need help? We're here to assist you with orders, payments, and more.
        </p>
      </div>
 
      {/* HELP CATEGORIES */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "2rem auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
 
        {helpItems.map((item, index) => (
          <div
            key={index}
            style={{
              padding: "1.5rem",
              borderRadius: "16px",
              background: "#fff",
              border: "1px solid #e7e5e4",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              transition: "0.3s",
              cursor: "pointer",
            }}
          >
            <h3 style={{ marginBottom: "0.5rem" }}>{item.title}</h3>
            <p className="feature-description">{item.desc}</p>
          </div>
        ))}
 
      </div>
 
      {/* SUPPORT INFO */}
      <div
        style={{
          maxWidth: "900px",
          margin: "3rem auto",
          textAlign: "center",
        }}
      >
        <h2 className="section-title">Still Need Help?</h2>
 
        <p className="feature-description" style={{ marginBottom: "1rem" }}>
          Our support team is available to help you with any issues or queries.
        </p>
 
        <p className="feature-description">📧 support@instabuy.com</p>
        <p className="feature-description">📞 +91 98765 43210</p>
 
        <p className="feature-description" style={{ marginTop: "1rem" }}>
          Available: 9 AM – 9 PM (All Days)
        </p>
      </div>
 
      {/* OPTIONAL CONTACT FORM */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto 3rem",
        }}
      >
        <h2 className="section-title" style={{ textAlign: "center" }}>
          Raise a Support Request
        </h2>
 
        <form style={{ marginTop: "1rem" }}>
          <input type="text" placeholder="Your Name" style={inputStyle} />
          <input type="email" placeholder="Your Email" style={inputStyle} />
          <textarea
            placeholder="Describe your issue..."
            rows="4"
            style={inputStyle}
          ></textarea>
 
          <button className="btn btn-primary btn-large">
            Submit Request
          </button>
        </form>
      </div>
 
    </div>
  );
}
 
// HELP ITEMS
const helpItems = [
  {
    title: "Orders & Tracking",
    desc: "Track your orders and get updates on delivery status.",
  },
  {
    title: "Returns & Refunds",
    desc: "Easy returns and quick refunds for your purchases.",
  },
  {
    title: "Payments",
    desc: "Get help with payment issues and transaction queries.",
  },
  {
    title: "Account Support",
    desc: "Manage your account, login issues, and settings.",
  },
  {
    title: "Seller & Dealer Help",
    desc: "Support for sellers and dealers on InstaBuy platform.",
  },
  {
    title: "Technical Issues",
    desc: "Facing bugs or issues? Let us help you resolve them.",
  },
];
 
// INPUT STYLE
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "1rem",
  borderRadius: "8px",
  border: "1px solid #e7e5e4",
  fontSize: "14px",
};