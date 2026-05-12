import React from "react";
import "./Welcome.css";
 
export default function Privacy() {
  return (
    <div className="welcome-container" style={{ minHeight: "100vh" }}>
      <div style={containerStyle}>
 
        <h1 className="hero-title">
          Privacy Policy <span className="brand-name">InstaBuy</span>
        </h1>
 
        <p className="feature-description">
          InstaBuy respects your privacy and is committed to protecting your
          personal information. This Privacy Policy describes in detail how
          InstaBuy collects, processes, stores, shares, and safeguards your data
          when you access or use our platform, services, or applications.
        </p>
 
        <p className="feature-description">
          By accessing InstaBuy, you agree to the collection and use of
          information in accordance with this policy. We encourage you to read
          this policy carefully to understand our practices regarding your
          personal data and how we treat it.
        </p>
 
        {/* 1 */}
        <h3 style={heading}>1. Information We Collect</h3>
        <p className="feature-description">
          We collect various types of information to provide and improve our
          services. Information you provide directly includes your name, email
          address, phone number, shipping and billing addresses, payment details,
          and account login credentials.
        </p>
        <p className="feature-description">
          Additionally, we automatically collect certain information when you
          interact with our platform. This includes your IP address, device
          information, browser type, operating system, referring URLs, and
          browsing behavior such as pages visited and time spent.
        </p>
        <p className="feature-description">
          We may also collect information from third-party sources such as
          payment gateways, logistics partners, and marketing partners to
          enhance your experience and ensure smooth service delivery.
        </p>
 
        {/* 2 */}
        <h3 style={heading}>2. How We Use Your Information</h3>
        <p className="feature-description">
          The information we collect is used for multiple purposes, including
          processing your orders, managing your account, delivering products,
          and providing customer support.
        </p>
        <p className="feature-description">
          We also use your information to personalize your experience by
          recommending products, improving our website functionality, and
          analyzing user behavior to enhance our services.
        </p>
        <p className="feature-description">
          In certain cases, we may use your data to send promotional messages,
          updates, or offers that may be relevant to your interests. You may opt
          out of these communications at any time.
        </p>
 
        {/* 3 */}
        <h3 style={heading}>3. Cookies and Tracking Technologies</h3>
        <p className="feature-description">
          InstaBuy uses cookies, web beacons, and similar technologies to
          improve user experience. Cookies help us recognize your device,
          remember your preferences, and provide essential features such as
          maintaining your shopping cart.
        </p>
        <p className="feature-description">
          These technologies also allow us to analyze trends, track user
          interactions, and gather demographic information to improve our
          platform.
        </p>
        <p className="feature-description">
          You can control cookie settings through your browser; however,
          disabling cookies may affect certain functionalities of the platform.
        </p>
 
        {/* 4 */}
        <h3 style={heading}>4. Sharing of Information</h3>
        <p className="feature-description">
          InstaBuy does not sell your personal information. However, we may share
          your information with trusted third parties such as payment processors,
          delivery partners, cloud service providers, and analytics providers.
        </p>
        <p className="feature-description">
          These third parties are obligated to protect your data and use it only
          for the purposes specified by InstaBuy.
        </p>
        <p className="feature-description">
          We may also disclose your information if required by law or to protect
          our rights, property, or safety, as well as that of our users.
        </p>
 
        {/* 5 */}
        <h3 style={heading}>5. Data Security</h3>
        <p className="feature-description">
          We implement strong security measures including encryption, secure
          servers, firewalls, and regular monitoring to protect your data from
          unauthorized access, loss, or misuse.
        </p>
        <p className="feature-description">
          Despite our efforts, no system is completely secure, and we cannot
          guarantee absolute protection of your information.
        </p>
 
        {/* 6 */}
        <h3 style={heading}>6. Data Retention</h3>
        <p className="feature-description">
          We retain your personal information only as long as necessary to fulfill
          the purposes outlined in this policy, including legal, accounting, or
          reporting requirements.
        </p>
        <p className="feature-description">
          Once your data is no longer required, we securely delete or anonymize it.
        </p>
 
        {/* 7 */}
        <h3 style={heading}>7. Your Rights and Choices</h3>
        <p className="feature-description">
          You have the right to access, update, or delete your personal
          information. You can also request a copy of your data or restrict its
          processing in certain situations.
        </p>
        <p className="feature-description">
          You may opt out of promotional communications at any time by following
          the unsubscribe instructions or contacting us directly.
        </p>
 
        {/* 8 */}
        <h3 style={heading}>8. Children’s Privacy</h3>
        <p className="feature-description">
          InstaBuy does not knowingly collect personal information from children
          under 18. If such information is identified, we will promptly delete it.
        </p>
 
        {/* 9 */}
        <h3 style={heading}>9. Changes to This Policy</h3>
        <p className="feature-description">
          We may update this Privacy Policy periodically. Any changes will be
          posted on this page with an updated revision date.
        </p>
        <p className="feature-description">
          Continued use of InstaBuy after changes means you accept the updated policy.
        </p>
 
        {/* 10 */}
        <h3 style={heading}>10. Contact Us</h3>
        <p className="feature-description">
          If you have questions or concerns about this Privacy Policy, contact us:
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