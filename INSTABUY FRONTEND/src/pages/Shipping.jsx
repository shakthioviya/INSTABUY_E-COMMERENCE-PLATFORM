import React from "react";
import "./Welcome.css";
 
export default function Shipping() {
  return (
    <div className="welcome-container" style={{ minHeight: "100vh" }}>
      <div style={containerStyle}>
 
        <h1 className="hero-title">
          Shipping Policy <span className="brand-name">InstaBuy</span>
        </h1>
 
        <p className="feature-description">
          InstaBuy is committed to delivering your orders in a timely, secure,
          and reliable manner. This Shipping Policy outlines the processes,
          timelines, conditions, and exceptions associated with the shipment
          and delivery of products purchased on our platform.
        </p>
 
        <p className="feature-description">
          Delivery timelines, shipping charges, and logistics processes may vary
          depending on product type, seller location, delivery destination,
          and external factors. Customers are advised to review shipping details
          on the product page before placing an order.
        </p>
 
        {/* 1 */}
        <h3 style={heading}>1. Order Processing</h3>
        <p className="feature-description">
          Once an order is successfully placed, it undergoes processing which
          includes order confirmation, packaging, and dispatch preparation.
        </p>
        <p className="feature-description">
          Orders are typically processed within 1–2 business days. However,
          during peak seasons, sales events, or high demand periods, processing
          times may be extended.
        </p>
 
        {/* 2 */}
        <h3 style={heading}>2. Delivery Timelines</h3>
        <p className="feature-description">
          Estimated delivery timelines are displayed on the product page and may
          vary based on location and product availability. Standard delivery
          typically ranges from 3 to 7 business days.
        </p>
        <p className="feature-description">
          Certain products may be eligible for faster delivery options such as
          same-day or next-day delivery depending on service availability.
        </p>
 
        {/* 3 */}
        <h3 style={heading}>3. Shipping Charges</h3>
        <p className="feature-description">
          Shipping charges may vary depending on order value, product weight,
          dimensions, and delivery location. Some orders may qualify for free
          shipping based on promotional offers or minimum order value.
        </p>
        <p className="feature-description">
          Any applicable shipping charges will be clearly displayed at checkout
          before payment is completed.
        </p>
 
        {/* 4 */}
        <h3 style={heading}>4. Shipment Tracking</h3>
        <p className="feature-description">
          Once an order is dispatched, customers will receive tracking details
          via email or SMS. Tracking allows customers to monitor the shipment
          status and estimated delivery date.
        </p>
        <p className="feature-description">
          Customers can also track their orders directly from the “My Orders”
          section on the InstaBuy platform.
        </p>
 
        {/* 5 */}
        <h3 style={heading}>5. Delivery Attempts</h3>
        <p className="feature-description">
          Delivery partners typically make multiple attempts to deliver the order.
          If the customer is unavailable, re-delivery may be scheduled.
        </p>
        <p className="feature-description">
          If delivery attempts fail repeatedly, the order may be returned to the
          seller, and refund or re-shipment policies will apply.
        </p>
 
        {/* 6 */}
        <h3 style={heading}>6. Delays and Exceptions</h3>
        <p className="feature-description">
          While InstaBuy strives to meet delivery timelines, delays may occur due
          to unforeseen circumstances such as weather conditions, natural disasters,
          strikes, logistical issues, or high order volumes.
        </p>
        <p className="feature-description">
          In such cases, customers will be notified, and revised delivery timelines
          will be communicated.
        </p>
 
        {/* 7 */}
        <h3 style={heading}>7. Out-of-Delivery-Area Locations</h3>
        <p className="feature-description">
          Certain remote or restricted locations may not be serviceable by our
          logistics partners. In such cases, orders may be cancelled and refunded.
        </p>
 
        {/* 8 */}
        <h3 style={heading}>8. International Shipping</h3>
        <p className="feature-description">
          InstaBuy may offer limited international shipping for select products.
          Delivery timelines, customs duties, and additional charges may apply.
        </p>
 
        {/* 9 */}
        <h3 style={heading}>9. Damaged Shipments</h3>
        <p className="feature-description">
          Customers are advised to inspect packages at the time of delivery.
          If a package appears damaged or tampered with, it should be reported
          immediately to the delivery agent or InstaBuy support team.
        </p>
 
        {/* 10 */}
        <h3 style={heading}>10. Responsibilities of Customers</h3>
        <p className="feature-description">
          Customers must provide accurate shipping details including address,
          contact number, and landmark information. Incorrect details may lead
          to delays or failed delivery.
        </p>
 
        {/* 11 */}
        <h3 style={heading}>11. Policy Updates</h3>
        <p className="feature-description">
          InstaBuy reserves the right to update this Shipping Policy at any time.
          Changes will be reflected on this page.
        </p>
 
        {/* 12 */}
        <h3 style={heading}>12. Contact Us</h3>
        <p className="feature-description">
          For any shipping-related queries, contact:
        </p>
 
        <p className="feature-description">
          📧 support@instabuy.com <br />
          📞 +91 98765 43210
        </p>
 
      </div>
    </div>
  );
}
 
/* STYLES */
const containerStyle = {
  maxWidth: "900px",
  margin: "0 auto",
  padding: "1rem 1.5rem",
};
 
const heading = {
  color: "#f97316",
  marginTop: "1.5rem",
};