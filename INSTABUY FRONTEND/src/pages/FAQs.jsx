import React, { useState } from "react";
import "./Welcome.css";
 
export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);
 
  const faqs = [
    {
      question: "Why should I sell on InstaBuy?",
      answer:
        "InstaBuy provides a growing platform with a wide customer base, easy onboarding, and tools to help sellers increase visibility and sales.",
    },
    {
      question: "How does selling on InstaBuy work?",
      answer:
        "Register as a seller, list your products, and start receiving orders. InstaBuy helps with payments and order management.",
    },
    {
      question: "What products can I sell on InstaBuy?",
      answer:
        "You can sell electronics, fashion, home essentials, and more, as long as they meet quality standards.",
    },
    {
      question: "What do I need to register as a seller?",
      answer:
        "Basic business details, bank account information, and valid ID proof are required.",
    },
    {
      question: "Do I need GST to sell on InstaBuy?",
      answer:
        "Yes, GST is required for most categories as per regulations.",
    },
    {
      question: "How and when do I get paid?",
      answer:
        "Payments are securely transferred to your bank account after order completion.",
    },
    {
      question: "Will I be charged for listing products?",
      answer:
        "No, listing is free. Charges apply only after successful sales.",
    },
    {
      question: "Who decides product pricing?",
      answer:
        "Sellers decide pricing, but competitive pricing improves sales.",
    },
    {
      question: "How do I manage my orders?",
      answer:
        "Orders can be managed through the seller dashboard easily.",
    },
    {
      question: "Do customers leave feedback?",
      answer:
        "Yes, feedback helps build trust and improve product visibility.",
    },
 
    // DEALER QUESTIONS
    {
      question: "Who is a dealer on InstaBuy?",
      answer:
        "A dealer is a registered seller who lists and sells products.",
    },
    {
      question: "How can I become a dealer?",
      answer:
        "Sign up, submit documents, and get approval to start selling.",
    },
    {
      question: "Is there a fee to become a dealer?",
      answer:
        "Registration is free; charges apply only when selling.",
    },
    {
      question: "Can I manage multiple products?",
      answer:
        "Yes, dealers can manage multiple products from one dashboard.",
    },
    {
      question: "What support is provided to dealers?",
      answer:
        "We provide tools for listing, analytics, and customer support.",
    },
    {
      question: "Can I track sales performance?",
      answer:
        "Yes, dealers get reports and analytics for performance tracking.",
    },
    {
      question: "How do returns and refunds work?",
      answer:
        "InstaBuy handles returns and ensures a smooth refund process.",
    },
  ];
 
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
 
  return (
    <div className="welcome-container">
 
      {/* HEADER (NO GAP) */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
          padding: "1rem 1.5rem 0.5rem",
        }}
      >
        <h1 className="hero-title" style={{ marginBottom: "0.5rem" }}>
          FAQs <span className="brand-name">InstaBuy</span>
        </h1>
 
        <p
          className="hero-description"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Find answers to common questions about InstaBuy.
        </p>
      </div>
 
      {/* FAQ LIST */}
      <div style={{ maxWidth: "900px", margin: "1rem auto 3rem" }}>
        {faqs.map((faq, index) => (
          <div
            key={index}
            style={{
              marginBottom: "1rem",
              borderRadius: "12px",
              border: "1px solid #e7e5e4",
              background: "#fff",
              overflow: "hidden",
            }}
          >
            {/* QUESTION */}
            <div
              onClick={() => toggleFAQ(index)}
              style={{
                padding: "1rem",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ fontSize: "16px", margin: 0 }}>
                {faq.question}
              </h3>
 
              <span
                style={{
                  fontSize: "20px",
                  color: "#f97316",
                  transform:
                    openIndex === index ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "0.3s",
                }}
              >
                ▶
              </span>
            </div>
 
            {/* ANSWER */}
            {openIndex === index && (
              <div
                style={{
                  padding: "1rem",
                  borderTop: "1px solid #e7e5e4",
                }}
              >
                <p className="feature-description">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
 
    </div>
  );
}