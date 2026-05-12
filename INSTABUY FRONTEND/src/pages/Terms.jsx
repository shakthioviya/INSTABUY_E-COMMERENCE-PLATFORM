import React from "react";
import "./Welcome.css";
 
export default function Terms() {
  return (
    <div className="welcome-container" style={{ minHeight: "100vh" }}>
      <div style={containerStyle}>
 
        <h1 className="hero-title">
          Terms & Conditions <span className="brand-name">InstaBuy</span>
        </h1>
 
        <p className="feature-description">
          These Terms & Conditions govern your use of InstaBuy. By accessing or using our platform,
          you agree to be bound by these terms. Please read them carefully before using our services.
        </p>
 
        <h3 style={heading}>1. Use of the Platform</h3>
        <p className="feature-description">
          InstaBuy provides users with access to a wide range of products and services. You agree to use
          the platform only for lawful purposes and in compliance with all applicable laws and regulations.
        </p>
        <p className="feature-description">
          Any misuse of the platform, including fraudulent activities, unauthorized access, or violation
          of terms, may result in suspension or termination of your account.
        </p>
 
        <h3 style={heading}>2. Account Registration</h3>
        <p className="feature-description">
          To access certain features, users must create an account by providing accurate and complete information.
          You are responsible for maintaining the confidentiality of your account credentials.
        </p>
        <p className="feature-description">
          InstaBuy is not responsible for any loss resulting from unauthorized use of your account.
        </p>
 
        <h3 style={heading}>3. Product Information and Pricing</h3>
        <p className="feature-description">
          We strive to ensure that all product descriptions, images, and prices are accurate. However,
          errors may occur, and InstaBuy reserves the right to correct any inaccuracies without prior notice.
        </p>
        <p className="feature-description">
          Prices and availability of products are subject to change at any time.
        </p>
 
        <h3 style={heading}>4. Orders and Acceptance</h3>
        <p className="feature-description">
          Placing an order does not guarantee acceptance. InstaBuy reserves the right to cancel or refuse
          any order due to pricing errors, stock issues, or suspected fraud.
        </p>
 
        <h3 style={heading}>5. Payments</h3>
        <p className="feature-description">
          All payments must be made through secure payment methods provided on the platform. InstaBuy uses
          trusted third-party payment gateways to process transactions.
        </p>
 
        <h3 style={heading}>6. Limitation of Liability</h3>
        <p className="feature-description">
          InstaBuy shall not be liable for any indirect, incidental, or consequential damages arising from
          the use of our services or products.
        </p>
 
        <h3 style={heading}>7. Intellectual Property</h3>
        <p className="feature-description">
          All content on InstaBuy, including logos, text, and images, is protected by intellectual property laws
          and may not be used without permission.
        </p>
 
        <h3 style={heading}>8. Changes to Terms</h3>
        <p className="feature-description">
          InstaBuy reserves the right to update these Terms & Conditions at any time. Continued use of the
          platform constitutes acceptance of the updated terms.
        </p>
 
        <h3 style={heading}>9. Contact Information</h3>
        <p className="feature-description">
          For any queries, please contact:
        </p>
 
        <p className="feature-description">
          📧 support@instabuy.com <br />
          📞 +91 98765 43210
        </p>
 
      </div>
    </div>
  );
}
 
const containerStyle = {
  maxWidth: "900px",
  margin: "0 auto",
  padding: "1rem 1.5rem",
};
 
const heading = {
  color: "#f97316",
  marginTop: "1.5rem",
};