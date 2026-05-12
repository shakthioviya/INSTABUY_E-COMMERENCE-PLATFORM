import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { placeOrder, initiateCardPayment, getUserId } from "../config/api";

// ─── Utility ──────────────────────────────────────────────────────────────────
function getUserName() {
  try { return localStorage.getItem("username") || "User"; } catch { return "User"; }
}

// ─── SVG Icon System (matches InstaBuyHome exactly) ───────────────────────────
const Icon = ({ size = 20, stroke = "currentColor", strokeWidth = 1.8, fill = "none", children, style }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0, ...style }}
  >
    {children}
  </svg>
);

const ShoppingBagIcon = (p) => (
  <Icon {...p}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </Icon>
);

const UserIcon = (p) => (
  <Icon {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Icon>
);

const ChevronDown = (p) => (
  <Icon {...p}>
    <polyline points="6 9 12 15 18 9" />
  </Icon>
);

const OrdersIcon = (p) => (
  <Icon {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </Icon>
);

const WalletIcon = (p) => (
  <Icon {...p}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </Icon>
);

const HeartIcon = (p) => (
  <Icon {...p}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Icon>
);

const TruckIcon = (p) => (
  <Icon {...p}>
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h4l3 5v4h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </Icon>
);

const SignOutIcon = (p) => (
  <Icon {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </Icon>
);

const LockIcon = (p) => (
  <Icon {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Icon>
);

const BadgeCheckIcon = (p) => (
  <Icon {...p}>
    <path d="M12 2l2.4 4.8L20 8l-4 4.4.8 5.6L12 15l-4.8 3 .8-5.6L4 8l5.6-1.2L12 2z" />
    <polyline points="9 12 11 14 15 10" />
  </Icon>
);

// ─── Dropdown config ───────────────────────────────────────────────────────────
const dropdownItems = [
  { label: "My Orders",    IconComp: OrdersIcon  },
  { label: "Wallet",       IconComp: WalletIcon  },
];

const routes = {
  "My Orders":   "/orders",
  "Wallet":      "/wallet",
};

// ─── Main Component ────────────────────────────────────────────────────────────
const CardPaymentPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const dropdownRef = useRef(null);

  const total   = state?.total   || 0;
  const bank    = state?.bank    || "Card Payment";
  const items   = state?.items   || [];
  const address = state?.address || "";

  const userName = getUserName();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const [form, setForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    gmail: "",
    billingName: "",
  });

  const [processing, setProcessing] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const payNow = async () => {
    if (
      !form.cardName.trim() || !form.cardNumber.trim() ||
      !form.expiry.trim()   || !form.cvv.trim()        ||
      !form.gmail.trim()    || !form.billingName.trim()
    ) { alert("Please fill all fields"); return; }

    if (form.cardNumber.length !== 16) { alert("Card number must be 16 digits"); return; }
    if (form.cvv.length !== 3)         { alert("CVV must be 3 digits"); return; }
    if (!form.gmail.includes("@"))     { alert("Enter valid Gmail"); return; }

    setProcessing(true);

    try {
      const orderPayload = {
        userId: Number(getUserId()),
        address,
        items: items.map(item => ({
          productId:   item.productId   || item.id,
          productName: item.productName || item.name,
          quantity:    item.cartQty     || item.quantity || 1,
        })),
      };
      const orderRes = await placeOrder(orderPayload);
      const orderId  = orderRes.data?.id || orderRes.data?.orderId;

      await initiateCardPayment(
        form.cardName, form.cardNumber, form.expiry,
        form.cvv, form.gmail, orderId, total
      );

      navigate("/otp", {
        state: { total, gmail: form.gmail, method: bank, orderId, items, address },
      });
    } catch (err) {
      console.error("Card payment initiation failed:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data           ||
        err?.message                  ||
        "Something went wrong. Please try again.";
      alert(typeof msg === "object" ? JSON.stringify(msg) : msg);
      setProcessing(false);
    }
  };

  // ─── Input field style (matches InstaBuyHome search/input aesthetic) ──────
  const inputStyle = (name) => ({
    width: "100%",
    padding: "13px 16px",
    marginBottom: 14,
    border: `1.5px solid ${focusedField === name ? "#f97316" : "var(--border)"}`,
    borderRadius: "var(--radius)",
    fontSize: 14,
    fontFamily: "var(--sans)",
    color: "var(--ink)",
    background: focusedField === name ? "#fff" : "var(--surface)",
    outline: "none",
    boxShadow: focusedField === name ? "0 0 0 3px rgba(249,115,22,0.10)" : "none",
    transition: "all 0.18s",
    boxSizing: "border-box",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --orange: #f97316;
          --orange-deep: #ea580c;
          --orange-pale: #fff7ed;
          --ink: #0f0e0d;
          --ink-60: rgba(15,14,13,0.6);
          --ink-30: rgba(15,14,13,0.3);
          --border: #e8e4df;
          --surface: #faf9f7;
          --white: #ffffff;
          --serif: 'DM Serif Display', Georgia, serif;
          --sans: 'DM Sans', system-ui, sans-serif;
          --radius: 14px;
          --shadow-sm: 0 1px 4px rgba(0,0,0,0.06);
          --shadow-md: 0 4px 20px rgba(0,0,0,0.08);
          --shadow-lg: 0 12px 48px rgba(0,0,0,0.12);
        }
        html { scroll-behavior: smooth; }
        body { font-family: var(--sans); background: var(--surface); color: var(--ink); }
        .dd-item:hover { background: var(--orange-pale) !important; color: var(--orange) !important; }
        .dd-item:hover svg { stroke: var(--orange) !important; }
        .header-btn:hover { background: var(--orange-pale) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .pay-card { animation: fadeIn 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes cardFlip { 0%,100%{transform:rotateY(0);} 50%{transform:rotateY(6deg);} }
        .card-preview:hover { animation: cardFlip 0.6s ease; }
        .pay-btn:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 10px 28px rgba(249,115,22,0.4) !important; }
        .pay-btn { transition: all 0.18s !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--sans)" }}>

        {/* ══════════ HEADER (exact InstaBuyHome style) ══════════ */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}>
          {/* Announcement bar */}
          <div style={{ background: "var(--ink)", padding: "6px 1.5rem", textAlign: "center" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", letterSpacing: "0.04em" }}>
              Secure &amp; encrypted payment gateway &nbsp;·&nbsp; 256-bit SSL protected
            </span>
          </div>

          {/* Nav row */}
          <div style={{
            maxWidth: 1340, margin: "0 auto",
            padding: "0 1.5rem",
            display: "flex", alignItems: "center",
            height: 62, justifyContent: "space-between",
          }}>

            {/* ── Left: Logo ── */}
            <div
              onClick={() => navigate("/")}
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "linear-gradient(135deg,#f97316,#ea580c)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 3px 10px rgba(249,115,22,0.35)",
              }}>
                <ShoppingBagIcon size={17} stroke="white" strokeWidth={2.3} />
              </div>
              <span style={{
                fontFamily: "var(--serif)", fontSize: "1.25rem",
                fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.01em",
              }}>
                InstaBuy
              </span>
            </div>

            {/* ── Right: User avatar + dropdown ── */}
            <div style={{ position: "relative" }} ref={dropdownRef}>
              <button
                className="header-btn"
                onClick={() => setIsUserDropdownOpen((o) => !o)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: "transparent", border: "none",
                  borderRadius: 10, cursor: "pointer",
                  padding: "6px 10px", transition: "background 0.18s",
                }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "linear-gradient(135deg,#f97316,#ea580c)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.2 }}>
                  <span style={{ fontSize: 10, color: "var(--ink-60)", fontWeight: 400 }}>Hello,</span>
                  <span style={{
                    fontSize: 12, color: "var(--ink)", fontWeight: 700,
                    maxWidth: 68, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {userName}
                  </span>
                </div>
                <ChevronDown size={12} stroke="var(--ink-60)" strokeWidth={2.5} />
              </button>

              {isUserDropdownOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 10px)", right: 0,
                  background: "white", border: "1px solid var(--border)",
                  borderRadius: 16, boxShadow: "var(--shadow-lg)",
                  minWidth: 210, zIndex: 100, overflow: "hidden",
                }}>
                  {/* Dropdown header */}
                  <div style={{
                    padding: "14px 16px", display: "flex", alignItems: "center",
                    gap: 10, background: "var(--orange-pale)",
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: "linear-gradient(135deg,#f97316,#ea580c)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 15, fontWeight: 700, color: "white", flexShrink: 0,
                    }}>
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{userName}</div>
                      <div style={{ fontSize: 11, color: "var(--ink-60)" }}>Member</div>
                    </div>
                  </div>
                  <div style={{ height: 1, background: "var(--border)" }} />

                  {dropdownItems.map(({ label, IconComp }) => (
                    <button key={label} className="dd-item"
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        width: "100%", padding: "10px 16px",
                        background: "transparent", border: "none",
                        cursor: "pointer", fontSize: 13, fontWeight: 500,
                        color: "var(--ink)", textAlign: "left", transition: "all 0.15s",
                      }}
                      onClick={() => { setIsUserDropdownOpen(false); navigate(routes[label]); }}
                    >
                      <IconComp size={15} stroke="#f97316" strokeWidth={2} />
                      {label}
                    </button>
                  ))}

                  <div style={{ height: 1, background: "var(--border)" }} />
                  <button className="dd-item"
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      width: "100%", padding: "10px 16px",
                      background: "transparent", border: "none",
                      cursor: "pointer", fontSize: 13, fontWeight: 500,
                      color: "#dc2626", textAlign: "left", transition: "all 0.15s",
                    }}
                    onClick={() => { try { localStorage.clear(); } catch {} window.location.href = "/login"; }}
                  >
                    <SignOutIcon size={15} stroke="#dc2626" strokeWidth={2} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ══════════ MAIN CONTENT ══════════ */}
        <main style={{ maxWidth: 720, margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>

          {/* Breadcrumb */}
          <p style={{ fontSize: 12.5, color: "var(--ink-60)", marginBottom: "1.5rem", letterSpacing: "0.01em" }}>
            Home &nbsp;/&nbsp; Checkout &nbsp;/&nbsp;
            <span style={{ color: "var(--orange)", fontWeight: 600 }}>Card Payment</span>
          </p>

          {/* Page title */}
          <div style={{ marginBottom: "1.8rem" }}>
            <h1 style={{
              fontFamily: "var(--serif)", fontSize: "2rem",
              fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.02em",
              marginBottom: 6,
            }}>
              Secure Card Payment
            </h1>
            <p style={{ fontSize: 14, color: "var(--ink-60)", lineHeight: 1.6 }}>
              Enter your card details below. Your information is encrypted and never stored.
            </p>
          </div>

          <div style={{ display: "grid", gap: "1.5rem" }}>

            {/* ── Card Visual Preview ── */}
            <div className="card-preview pay-card" style={{
              background: "linear-gradient(135deg,#f97316 0%,#ea580c 60%,#c2410c 100%)",
              borderRadius: 20, padding: "28px 30px",
              color: "white", position: "relative",
              overflow: "hidden",
              boxShadow: "0 12px 40px rgba(249,115,22,0.30)",
              cursor: "default",
            }}>
              {/* Decorative circles */}
              <div style={{
                position: "absolute", top: -40, right: -40,
                width: 160, height: 160, borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
              }} />
              <div style={{
                position: "absolute", bottom: -30, right: 60,
                width: 100, height: 100, borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
              }} />

              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "flex-start", marginBottom: 24,
              }}>
                <span style={{
                  fontFamily: "var(--serif)", fontSize: "1.05rem",
                  fontWeight: 400, letterSpacing: "-0.01em", opacity: 0.95,
                }}>
                  {bank}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <ShoppingBagIcon size={16} stroke="white" strokeWidth={2.2} />
                  <span style={{ fontFamily: "var(--serif)", fontSize: "0.95rem", fontWeight: 400 }}>InstaBuy</span>
                </div>
              </div>

              {/* Chip */}
              <div style={{
                width: 44, height: 32,
                background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
                borderRadius: 7, marginBottom: 22,
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.15)",
              }} />

              <p style={{
                fontSize: 20, letterSpacing: "0.22em",
                fontWeight: 600, marginBottom: 18,
                fontFamily: "var(--sans)",
              }}>
                {form.cardNumber
                  ? form.cardNumber.padEnd(16, "·").replace(/(.{4})/g, "$1 ").trim()
                  : "•••• •••• •••• ••••"}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <p style={{ fontSize: 9, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>
                    Card Holder
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.04em" }}>
                    {form.cardName || "YOUR NAME"}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 9, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>
                    Expires
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 700 }}>
                    {form.expiry || "MM/YY"}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Amount Summary ── */}
            <div className="pay-card" style={{
              background: "var(--orange-pale)",
              border: "1px solid #fed7aa",
              borderRadius: "var(--radius)",
              padding: "16px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "linear-gradient(135deg,#f97316,#ea580c)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 3px 10px rgba(249,115,22,0.30)",
                }}>
                  <WalletIcon size={16} stroke="white" strokeWidth={2} />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "var(--ink-60)", letterSpacing: "0.03em" }}>Payable Amount</p>
                  <p style={{ fontSize: 22, fontFamily: "var(--serif)", color: "var(--ink)", letterSpacing: "-0.02em" }}>
                    ₹{total.toLocaleString()}
                  </p>
                </div>
              </div>
              <div style={{
                fontSize: 11, fontWeight: 600, color: "var(--orange)",
                background: "white", borderRadius: 8,
                padding: "5px 10px", border: "1px solid #fed7aa",
              }}>
                GST Inclusive
              </div>
            </div>

            {/* ── Form Card ── */}
            <div className="pay-card" style={{
              background: "var(--white)",
              borderRadius: 20,
              padding: "28px 28px",
              boxShadow: "var(--shadow-md)",
              border: "1px solid var(--border)",
            }}>
              <h2 style={{
                fontFamily: "var(--serif)", fontSize: "1.35rem",
                fontWeight: 400, color: "var(--ink)",
                marginBottom: "1.4rem", letterSpacing: "-0.015em",
              }}>
                Card Details
              </h2>

              {/* Card Holder Name */}
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-60)", letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Card Holder Name
              </label>
              <input
                name="cardName"
                placeholder="Name on card"
                value={form.cardName}
                onChange={handleChange}
                onFocus={() => setFocusedField("cardName")}
                onBlur={() => setFocusedField(null)}
                style={inputStyle("cardName")}
              />

              {/* Card Number */}
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-60)", letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Card Number
              </label>
              <input
                name="cardNumber"
                placeholder="16-digit card number"
                maxLength="16"
                value={form.cardNumber}
                onChange={handleChange}
                onFocus={() => setFocusedField("cardNumber")}
                onBlur={() => setFocusedField(null)}
                style={inputStyle("cardNumber")}
              />

              {/* Expiry + CVV */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-60)", letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    Expiry Date
                  </label>
                  <input
                    name="expiry"
                    placeholder="MM/YY"
                    value={form.expiry}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("expiry")}
                    onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle("expiry"), width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-60)", letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    CVV
                  </label>
                  <input
                    name="cvv"
                    type="password"
                    placeholder="3 digits"
                    maxLength="3"
                    value={form.cvv}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("cvv")}
                    onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle("cvv"), width: "100%" }}
                  />
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "var(--border)", margin: "6px 0 18px" }} />

              <h2 style={{
                fontFamily: "var(--serif)", fontSize: "1.2rem",
                fontWeight: 400, color: "var(--ink)",
                marginBottom: "1.2rem", letterSpacing: "-0.015em",
              }}>
                Billing Info
              </h2>

              {/* Billing Name */}
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-60)", letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Account / Billing Name
              </label>
              <input
                name="billingName"
                placeholder="Name as per bank account"
                value={form.billingName}
                onChange={handleChange}
                onFocus={() => setFocusedField("billingName")}
                onBlur={() => setFocusedField(null)}
                style={inputStyle("billingName")}
              />

              {/* Gmail */}
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-60)", letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Gmail for OTP &amp; Invoice
              </label>
              <input
                name="gmail"
                type="email"
                placeholder="yourname@gmail.com"
                value={form.gmail}
                onChange={handleChange}
                onFocus={() => setFocusedField("gmail")}
                onBlur={() => setFocusedField(null)}
                style={inputStyle("gmail")}
              />

              {/* CTA */}
              {processing ? (
                <div style={{ textAlign: "center", padding: "28px 0" }}>
                  <div style={{
                    width: 44, height: 44,
                    border: "4px solid var(--orange-pale)",
                    borderTopColor: "#f97316",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    margin: "0 auto 14px",
                  }} />
                  <p style={{
                    fontFamily: "var(--serif)", fontSize: "1.1rem",
                    color: "var(--orange)", fontWeight: 400,
                  }}>
                    Redirecting to OTP Verification…
                  </p>
                  <p style={{ fontSize: 12.5, color: "var(--ink-60)", marginTop: 6 }}>
                    Please do not close or refresh this page.
                  </p>
                </div>
              ) : (
                <button
                  className="pay-btn"
                  onClick={payNow}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg,#f97316,#ea580c)",
                    border: "none", color: "white",
                    padding: "15px 24px",
                    borderRadius: "var(--radius)",
                    fontSize: 16, fontWeight: 700,
                    fontFamily: "var(--sans)",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(249,115,22,0.32)",
                    letterSpacing: "0.01em",
                  }}
                >
                  Pay ₹{total.toLocaleString()} →
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CardPaymentPage;