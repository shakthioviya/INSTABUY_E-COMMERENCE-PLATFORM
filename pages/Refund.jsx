import React from "react";
import "./Welcome.css";
 
export default function Refund() {
  return (
    <div className="welcome-container" style={{ minHeight: "100vh" }}>
      <div style={containerStyle}>
 
        <h1 className="hero-title">
          Refund & Return Policy <span className="brand-name">InstaBuy</span>
        </h1>
 
        <p className="feature-description">
          At InstaBuy, customer satisfaction is our highest priority. We aim to provide
          a transparent, reliable, and hassle-free return and refund experience. This policy
          outlines in detail the rules, eligibility criteria, timelines, and procedures
          for returns, replacements, and refunds across all product categories available
          on the InstaBuy platform.
        </p>
 
        <p className="feature-description">
          We encourage customers to read this policy carefully before making a purchase,
          as different categories may have different return conditions, timelines, and
          resolution options.
        </p>
 
        {/* 1 */}
        <h3 style={heading}>1. Return Eligibility and Conditions</h3>
        <p className="feature-description">
          Customers may request a return, replacement, or refund for eligible products
          within the return window mentioned on the product page. Return windows typically
          range between 3 to 10 days depending on the product category, seller policies,
          and product type.
        </p>
        <p className="feature-description">
          To be eligible for return, the product must be unused, in its original condition,
          and returned with all original packaging, accessories, manuals, tags, and invoices.
          Products that show signs of use, damage, or missing components may be rejected.
        </p>
        <p className="feature-description">
          InstaBuy reserves the right to determine eligibility based on inspection results.
        </p>
 
        {/* 2 */}
        <h3 style={heading}>2. Category-Specific Return Rules</h3>
        <p className="feature-description">
          Different product categories have different return and replacement policies.
          Electronics such as mobile phones, laptops, and large appliances may be eligible
          only for replacement within a limited window (e.g., 7 days).
        </p>
        <p className="feature-description">
          Fashion and lifestyle products may allow returns due to size, fit, or preference.
          Furniture and large appliances may require installation verification before
          returns are accepted.
        </p>
        <p className="feature-description">
          Certain categories such as groceries, personal care, innerwear, and customized
          items may be marked as non-returnable due to hygiene or safety reasons.
        </p>
 
        {/* 3 */}
        <h3 style={heading}>3. Return Request Process</h3>
        <p className="feature-description">
          Customers can initiate a return request through the “My Orders” section by
          selecting the product and choosing a return reason.
        </p>
        <p className="feature-description">
          Based on the issue, customers may be offered:
        </p>
        <p className="feature-description">
          • Replacement (for defective/damaged products) <br />
          • Exchange (for size or variant issues) <br />
          • Refund (if replacement is unavailable)
        </p>
        <p className="feature-description">
          Once the return is approved, InstaBuy will arrange pickup or provide return
          instructions depending on logistics availability.
        </p>
 
        {/* 4 */}
        <h3 style={heading}>4. Quality Check and Verification</h3>
        <p className="feature-description">
          Returned products undergo a quality check process to ensure they meet return
          eligibility criteria. This may include physical inspection, packaging verification,
          and matching serial numbers where applicable.
        </p>
        <p className="feature-description">
          In certain cases, customers may be asked to upload images or videos to support
          their return request.
        </p>
 
        {/* 5 */}
        <h3 style={heading}>5. Refund Process and Timelines</h3>
        <p className="feature-description">
          Refunds are initiated once the returned product is successfully received and
          verified. The refund is processed to the original payment method.
        </p>
        <p className="feature-description">
          Refund timelines may vary:
        </p>
        <p className="feature-description">
          • UPI / Wallets: 1–3 business days <br />
          • Debit/Credit Cards: 3–7 business days <br />
          • Net Banking: 2–5 business days
        </p>
 
        {/* 6 */}
        <h3 style={heading}>6. Damaged, Defective, or Incorrect Products</h3>
        <p className="feature-description">
          If you receive a damaged, defective, or incorrect product, you must report it
          within the return window. InstaBuy may request supporting evidence such as images
          or videos for verification.
        </p>
        <p className="feature-description">
          After verification, customers may receive a replacement or refund based on availability.
        </p>
 
        {/* 7 */}
        <h3 style={heading}>7. Non-Returnable and Restricted Items</h3>
        <p className="feature-description">
          Certain products are not eligible for returns. These include:
        </p>
        <p className="feature-description">
          • Personal care and hygiene products <br />
          • Perishable goods <br />
          • Customized or personalized items <br />
          • Digital products and subscriptions
        </p>
        <p className="feature-description">
          These items may only be replaced if defective or damaged.
        </p>
 
        {/* 8 */}
        <h3 style={heading}>8. Cancellation Policy</h3>
        <p className="feature-description">
          Orders can be cancelled before they are shipped. Once dispatched,
          cancellation may not be possible. Customers may refuse delivery
          at the doorstep if applicable.
        </p>
 
        {/* 9 */}
        <h3 style={heading}>9. Abuse of Return Policy</h3>
        <p className="feature-description">
          InstaBuy monitors return patterns and reserves the right to take action
          against accounts that misuse return policies. Excessive or fraudulent
          return behavior may result in restrictions or suspension.
        </p>
 
        {/* 10 */}
        <h3 style={heading}>10. Important Guidelines for Customers</h3>
        <p className="feature-description">
          Customers are advised to retain invoices, packaging, and accessories
          until the return process is completed. Ensure products are properly
          packed during return to avoid damage in transit.
        </p>
 
        {/* 11 */}
        <h3 style={heading}>11. Policy Updates</h3>
        <p className="feature-description">
          InstaBuy reserves the right to modify this policy at any time. Updates
          will be reflected on this page.
        </p>
 
        {/* 12 */}
        <h3 style={heading}>12. Contact Us</h3>
        <p className="feature-description">
          For assistance, contact:
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