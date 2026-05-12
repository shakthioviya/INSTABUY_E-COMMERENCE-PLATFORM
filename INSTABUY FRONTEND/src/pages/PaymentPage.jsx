import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { placeOrder, payWithCOD, payWithWallet, getUserId } from "../config/api";

function getUserName() {
  try { return localStorage.getItem("username") || "User"; } catch { return "User"; }
}

// ─── SVG Icon System ──────────────────────────────────────────────────────────
const Icon = ({ size = 20, stroke = "currentColor", strokeWidth = 1.8, fill = "none", children, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0, ...style }}>
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
const ChevronDown = (p) => (
  <Icon {...p}><polyline points="6 9 12 15 18 9" /></Icon>
);
const ChevronUpIcon = (p) => (
  <Icon {...p}><polyline points="18 15 12 9 6 15" /></Icon>
);
const OrdersIcon = (p) => (
  <Icon {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </Icon>
);
const WalletIcon = (p) => (
  <Icon {...p}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </Icon>
);
const SignOutIcon = (p) => (
  <Icon {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </Icon>
);

// ─── Payment Method Icons ─────────────────────────────────────────────────────

// Credit/Debit Card
const CardMethodIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="#f97316" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
    <line x1="5" y1="15" x2="9" y2="15" />
    <line x1="11" y1="15" x2="13" y2="15" />
  </svg>
);

// UPI
const UpiMethodIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="#f97316" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
    <path d="M9 7l3 4 3-4" />
    <path d="M9 11l3 2 3-2" />
  </svg>
);

// Wallet
const WalletMethodIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="#f97316" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
    <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
    <circle cx="17" cy="13" r="1.5" fill="#f97316" stroke="none" />
  </svg>
);

// COD
const CodMethodIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="#f97316" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="14" rx="2" />
    <path d="M12 10v4M10 12h4" />
    <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
  </svg>
);

// ─── Real brand logo components using official CDN URLs ──────────────────────
const LogoBadge = ({ src, alt, bg = "#fff" }) => (
  <div style={{
    width: 36, height: 36, borderRadius: 9,
    background: bg,
    border: "1px solid #e8e4df",
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden", flexShrink: 0,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  }}>
    <img src={src} alt={alt}
      style={{ width: 28, height: 28, objectFit: "contain", display: "block" }}
      onError={e => { e.target.style.display = "none"; }}
    />
  </div>
);

// Bank logos
const HdfcIcon = () => (
  <LogoBadge
    src="https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg"
    alt="HDFC Bank"
    bg="#fff"
  />
);

const IciciIcon = () => (
  <LogoBadge
    src="https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg"
    alt="ICICI Bank"
    bg="#fff"
  />
);

const SbiIcon = () => (
  <LogoBadge
    src="https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg"
    alt="SBI"
    bg="#fff"
  />
);

// UPI App logos — real brand icons
const GpayIcon = ({ size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.25,
    background: "#fff",
    border: "1px solid #e8e4df",
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden", flexShrink: 0,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  }}>
    {/* Official Google Pay 4-colour logo mark */}
    <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 48 48" fill="none">
      <path d="M24 19.5v3.8h9.1c-.4 2.1-1.6 3.9-3.3 5.1l5.3 4.1C38.3 30 40 27.2 40 24c0-.9-.1-1.8-.3-2.6L24 19.5z" fill="#4285F4"/>
      <path d="M11.3 28.6l-1.2.9-4.2 3.3C8.4 36.6 15.7 40 24 40c5.5 0 10.1-1.8 13.5-4.9l-5.3-4.1c-1.7 1.2-3.9 1.9-8.2 1.9-6.3 0-11.6-4.2-13.5-10.3h-.2z" fill="#34A853"/>
      <path d="M6 15.1C4.7 17.6 4 20.2 4 24s.7 6.4 2 8.9l5.3-4.1c-.4-1.2-.6-2.5-.6-3.8s.2-2.6.6-3.8L6 15.1z" fill="#FBBC04"/>
      <path d="M24 12.5c3 0 5.7 1 7.8 3l5.8-5.8C34 6.5 29.4 4.5 24 4.5c-8.3 0-15.6 4.8-19.1 11.8L10.2 20c1.9-4.4 6.3-7.5 13.8-7.5z" fill="#EA4335"/>
    </svg>
  </div>
);

const PhonepeIcon = ({ size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.25,
    background: "#5F259F",
    border: "1px solid #e8e4df",
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden", flexShrink: 0,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  }}>
    {/* Official PhonePe "P" wordmark */}
    <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 64 64" fill="none">
      <path d="M38 8H22C16.5 8 12 12.5 12 18v28c0 5.5 4.5 10 10 10h4V46h-4c-2.2 0-4-1.8-4-4V18c0-2.2 1.8-4 4-4h16c6.6 0 12 5.4 12 12s-5.4 12-12 12h-8v8h8c11 0 20-9 20-20S49 8 38 8z" fill="white"/>
      <circle cx="47" cy="50" r="6" fill="#00BAF2"/>
    </svg>
  </div>
);

const PaytmIcon = ({ size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.25,
    background: "#00BAF2",
    border: "1px solid #e8e4df",
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden", flexShrink: 0,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  }}>
    {/* Paytm "P" style mark */}
    <svg width={size * 0.68} height={size * 0.68} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="4" fill="#00BAF2"/>
      <text x="24" y="33" textAnchor="middle" fontSize="26" fontWeight="900"
        fill="white" fontFamily="Arial Black, Arial, sans-serif">P</text>
      <rect x="8" y="36" width="32" height="5" rx="2" fill="#002970"/>
    </svg>
  </div>
);

const BhimIcon = ({ size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.25,
    background: "#fff",
    border: "1px solid #e8e4df",
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden", flexShrink: 0,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  }}>
    {/* BHIM UPI — tricolour UPI logo mark */}
    <svg width={size * 0.78} height={size * 0.78} viewBox="0 0 56 56" fill="none">
      {/* Top stripe — saffron */}
      <rect x="4" y="6" width="48" height="13" rx="3" fill="#FF9933"/>
      {/* Middle stripe — white with Ashoka-blue text */}
      <rect x="4" y="19" width="48" height="13" rx="0" fill="#f5f5f5"/>
      <text x="28" y="29.5" textAnchor="middle" fontSize="9" fontWeight="900"
        fill="#000088" fontFamily="Arial Black, Arial, sans-serif">BHIM</text>
      {/* Bottom stripe — green */}
      <rect x="4" y="32" width="48" height="13" rx="3" fill="#138808"/>
      {/* UPI label */}
      <rect x="4" y="45" width="48" height="8" rx="3" fill="#000088"/>
      <text x="28" y="51.5" textAnchor="middle" fontSize="6.5" fontWeight="700"
        fill="white" fontFamily="Arial, sans-serif" letterSpacing="2">UPI</text>
    </svg>
  </div>
);

// InstaBuy Wallet icon
const InstaBuyWalletIcon = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="url(#ibgrad)" />
    <defs>
      <linearGradient id="ibgrad" x1="0" y1="0" x2="40" y2="40">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    {/* bag shape */}
    <path d="M12 16L10 28h20L28 16H12z" fill="white" opacity="0.92" />
    <path d="M15 16v-2a5 5 0 0 1 10 0v2" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* rupee symbol */}
    <text x="20" y="26" textAnchor="middle" fontSize="9" fontWeight="800"
      fill="#f97316" fontFamily="DM Sans,sans-serif">₹</text>
  </svg>
);

// ─── Payment Page ─────────────────────────────────────────────────────────────
const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const userName = getUserName();

  const total    = state?.total    || 0;  // full amount shown to user (e.g. ₹2510)
  const subtotal = state?.subtotal  || 0;  // raw product total sent to backend (e.g. ₹2500) — backend adds fees
  const items        = state?.items   || [];
  const address      = state?.address || "";
  const discount     = state?.discount     ?? 0;
  const appliedCoupon = state?.appliedCoupon ?? '';

  const [method, setMethod] = useState("");
  const [processing, setProcessing] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dropdownItems = [
    { label: "My Orders", IconComp: OrdersIcon },
    { label: "My Wallet", IconComp: WalletIcon },
  ];
  const routes = { "My Orders": "/myorders", "My Wallet": "/mywallet" };

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsUserDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const cardBanks = [
    { name: "HDFC Bank",  IconComp: HdfcIcon },
    { name: "ICICI Bank", IconComp: IciciIcon },
    { name: "SBI",        IconComp: SbiIcon },
  ];

  const upiApps = [
    { name: "Google Pay", IconComp: GpayIcon },
    { name: "PhonePe",    IconComp: PhonepeIcon },
    { name: "Paytm",      IconComp: PaytmIcon },
    { name: "BHIM UPI",   IconComp: BhimIcon },
  ];

  const selectMethod = (type) => setMethod(method === type ? "" : type);

  const goCardPayment = (bank) =>
    navigate("/card-payment", { state: { total, subtotal, items, address, discount, appliedCoupon } });
  const goUpiPayment  = (app)  =>
    navigate("/upi-payment",  { state: { total, subtotal, items, address, discount, appliedCoupon } });

  const handlePlaceOrder = async () => {
    if (!method) { alert("Please select a payment method"); return; }
    setProcessing(true);
    try {
      const userId = getUserId();
      const orderPayload = {
        userId: Number(userId),
        address,
        items: items.map(item => ({
          productId:   item.productId || item.id,
          productName: item.productName || item.name,
          quantity:    item.cartQty || item.quantity || 1,
        })),
      };
      const orderRes = await placeOrder(orderPayload);
      const orderId  = orderRes?.data?.id || orderRes?.data?.orderId;
      if (!orderId) throw new Error("Order ID not returned");

      try {
        if (method === "wallet") await payWithWallet(orderId, subtotal);
        if (method === "cod")    await payWithCOD(orderId, subtotal);
      } catch (payErr) {
        if (payErr.response?.status !== 401) throw payErr;
      }

      clearCart();
      navigate("/order-success", { state: { orderId, total, method } });
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Order failed");
    } finally {
      setProcessing(false);
    }
  };

  // Step config
  const steps = ['Cart', 'Checkout', 'Address', 'Payment'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
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
          --shadow-sm: 0 1px 4px rgba(0,0,0,0.06);
          --shadow-md: 0 4px 20px rgba(0,0,0,0.08);
          --shadow-lg: 0 12px 48px rgba(0,0,0,0.12);
        }
        html { scroll-behavior: smooth; }
        body { font-family: var(--sans); background: var(--surface); color: var(--ink); }
        .header-btn:hover { background: var(--orange-pale) !important; }
        .dd-item:hover { background: #fff7ed !important; color: #f97316 !important; }
        .dd-item:hover svg { stroke: #f97316 !important; }
        .pm-method { transition: border-color 0.18s, background 0.18s, box-shadow 0.18s; }
        .pm-method:hover { border-color: #fdba74 !important; background: #fffbf7 !important; }
        .pm-option { transition: background 0.15s, box-shadow 0.15s, transform 0.15s; }
        .pm-option:hover { background: var(--orange-pale) !important; transform: translateX(3px); }
        .ib-submit-btn { transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s; }
        .ib-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(249,115,22,0.38) !important; }
        .ib-submit-btn:active { transform: translateY(0); opacity: 0.9; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-up { animation: fadeUp 0.45s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.12s; }
        .fade-up-3 { animation-delay: 0.20s; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--sans)" }}>

        {/* ══════════ HEADER ══════════ */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}>
          <div style={{ background: "var(--ink)", padding: "6px 1.5rem", textAlign: "center" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", letterSpacing: "0.04em" }}>
              🎉 Free delivery on orders above ₹499 &nbsp;·&nbsp; Use code&nbsp;
              <strong style={{ color: "#f97316", letterSpacing: "0.06em" }}>FIRST10</strong>
              &nbsp;for 10% off your first order
            </span>
          </div>
          <div style={{
            maxWidth: 1340, margin: "0 auto", padding: "0 1.5rem",
            display: "flex", alignItems: "center", height: 62,
          }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, cursor: "pointer" }}
              onClick={() => navigate("/home")}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "linear-gradient(135deg,#f97316,#ea580c)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 3px 10px rgba(249,115,22,0.35)",
              }}>
                <ShoppingBagIcon size={17} stroke="white" strokeWidth={2.3} />
              </div>
              <span style={{
                fontFamily: "var(--serif)", fontSize: "1.25rem", fontWeight: 400,
                color: "var(--ink)", letterSpacing: "-0.01em",
              }}>InstaBuy</span>
            </div>

            {/* Profile */}
            <div style={{ marginLeft: "auto" }}>
              <div style={{ position: "relative" }} ref={dropdownRef}>
                <button className="header-btn"
                  onClick={() => setIsUserDropdownOpen(o => !o)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    background: "transparent", border: "none", borderRadius: 10,
                    cursor: "pointer", padding: "6px 10px", transition: "background 0.18s",
                  }}>
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
                    }}>{userName}</span>
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
                          background: "transparent", border: "none", cursor: "pointer",
                          fontSize: 13, fontWeight: 500, color: "var(--ink)",
                          textAlign: "left", transition: "all 0.15s",
                        }}
                        onClick={() => { setIsUserDropdownOpen(false); navigate(routes[label]); }}>
                        <IconComp size={15} stroke="#f97316" strokeWidth={2} />
                        {label}
                      </button>
                    ))}
                    <div style={{ height: 1, background: "var(--border)" }} />
                    <button className="dd-item"
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        width: "100%", padding: "10px 16px",
                        background: "transparent", border: "none", cursor: "pointer",
                        fontSize: 13, fontWeight: 500, color: "#dc2626",
                        textAlign: "left", transition: "all 0.15s",
                      }}
                      onClick={() => { try { localStorage.clear(); } catch {} window.location.href = "/login"; }}>
                      <SignOutIcon size={15} stroke="#dc2626" strokeWidth={2} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ══════════ MAIN ══════════ */}
        <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px", fontFamily: "var(--sans)" }}>

          {/* Step Progress */}
          <div className="fade-up fade-up-1" style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  color: i <= 3 ? "var(--orange)" : "var(--ink-30)",
                  fontWeight: 700, fontSize: 13,
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: "linear-gradient(135deg,#f97316,#ea580c)",
                    color: "white", fontSize: 11, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: i === 3 ? "0 0 0 3px rgba(249,115,22,0.2)" : "none",
                  }}>
                    {i < 3 ? "✓" : i + 1}
                  </div>
                  <span>{s}</span>
                </div>
                {i < 3 && (
                  <div style={{
                    flex: 1, height: 2, margin: "0 10px",
                    background: i < 3
                      ? "linear-gradient(90deg,#f97316,#ea580c)"
                      : "var(--border)",
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Payment Card */}
          <div className="fade-up fade-up-2" style={{
            background: "var(--white)", borderRadius: 20,
            border: "1px solid var(--border)", boxShadow: "var(--shadow-md)",
            overflow: "hidden",
          }}>

            {/* Card Header */}
            <div style={{
              padding: "26px 32px 22px", borderBottom: "1px solid var(--border)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <h2 style={{
                  fontFamily: "var(--serif)", fontSize: "1.75rem", fontWeight: 400,
                  color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: 4,
                }}>Payment</h2>
                <p style={{ fontSize: 13, color: "var(--ink-60)" }}>Choose how you'd like to pay</p>
              </div>
              {/* Amount badge */}
              <div style={{
                background: "var(--orange-pale)", border: "1px solid #fed7aa",
                borderRadius: 12, padding: "10px 18px", textAlign: "right",
              }}>
                <div style={{ fontSize: 11, color: "var(--ink-60)", fontWeight: 500, marginBottom: 2 }}>Amount Due</div>
                <div style={{
                  fontFamily: "var(--serif)", fontSize: "1.4rem", fontWeight: 400,
                  color: "var(--orange)", letterSpacing: "-0.02em",
                }}>₹{total.toLocaleString()}</div>
              </div>
            </div>

            {/* Methods */}
            <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 12 }}>

              {/* ── Credit / Debit Card ── */}
              <div className="pm-method"
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
                  border: `1.5px solid ${method === "card" ? "#f97316" : "var(--border)"}`,
                  borderRadius: 14, cursor: "pointer",
                  background: method === "card" ? "var(--orange-pale)" : "var(--white)",
                  boxShadow: method === "card" ? "0 0 0 3px rgba(249,115,22,0.1)" : "none",
                }}
                onClick={() => selectMethod("card")}>
                {/* Radio */}
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  border: `2px solid ${method === "card" ? "#f97316" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {method === "card" && <div style={{ width: 10, height: 10, background: "#f97316", borderRadius: "50%" }} />}
                </div>
                {/* Icon */}
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: "var(--orange-pale)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <CardMethodIcon />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Credit / Debit Card</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}>
                    {[
                      { src: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",         alt: "Visa" },
                      { src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",   alt: "Mastercard" },
                      { src: "https://upload.wikimedia.org/wikipedia/commons/d/d1/RuPay.svg",             alt: "RuPay" },
                    ].map(({ src, alt }) => (
                      <div key={alt} style={{
                        height: 18, borderRadius: 4,
                        background: "#fff",
                        border: "1px solid #e8e4df",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        overflow: "hidden", padding: "2px 5px",
                      }}>
                        <img src={src} alt={alt}
                          style={{ height: 12, objectFit: "contain" }}
                          onError={e => { e.target.style.display = "none"; }} />
                      </div>
                    ))}
                    <span style={{ fontSize: 11, color: "var(--ink-60)" }}>& more</span>
                  </div>
                </div>
                {method === "card"
                  ? <ChevronUpIcon size={16} stroke="var(--ink-60)" strokeWidth={2.2} />
                  : <ChevronDown   size={16} stroke="var(--ink-60)" strokeWidth={2.2} />}
              </div>

              {/* Card Bank Dropdown */}
              {method === "card" && (
                <div style={{
                  background: "var(--surface)", borderRadius: 12,
                  border: "1px solid var(--border)", padding: "10px",
                  display: "flex", flexDirection: "column", gap: 8,
                }}>
                  {cardBanks.map(({ name, IconComp }) => (
                    <div key={name} className="pm-option"
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "13px 14px", background: "var(--white)",
                        borderRadius: 10, cursor: "pointer",
                        border: "1px solid var(--border)",
                      }}
                      onClick={() => goCardPayment(name)}>
                      <IconComp />
                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{name}</span>
                      <ChevronDown size={14} stroke="var(--ink-30)" strokeWidth={2.5}
                        style={{ marginLeft: "auto", transform: "rotate(-90deg)" }} />
                    </div>
                  ))}
                </div>
              )}

              {/* ── UPI ── */}
              <div className="pm-method"
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
                  border: `1.5px solid ${method === "upi" ? "#f97316" : "var(--border)"}`,
                  borderRadius: 14, cursor: "pointer",
                  background: method === "upi" ? "var(--orange-pale)" : "var(--white)",
                  boxShadow: method === "upi" ? "0 0 0 3px rgba(249,115,22,0.1)" : "none",
                }}
                onClick={() => selectMethod("upi")}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  border: `2px solid ${method === "upi" ? "#f97316" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {method === "upi" && <div style={{ width: 10, height: 10, background: "#f97316", borderRadius: "50%" }} />}
                </div>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: "var(--orange-pale)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <UpiMethodIcon />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>UPI</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}>
                    <GpayIcon size={22} />
                    <PhonepeIcon size={22} />
                    <PaytmIcon size={22} />
                    <BhimIcon size={22} />
                  </div>
                </div>
                {method === "upi"
                  ? <ChevronUpIcon size={16} stroke="var(--ink-60)" strokeWidth={2.2} />
                  : <ChevronDown   size={16} stroke="var(--ink-60)" strokeWidth={2.2} />}
              </div>

              {/* UPI App Dropdown */}
              {method === "upi" && (
                <div style={{
                  background: "var(--surface)", borderRadius: 12,
                  border: "1px solid var(--border)", padding: "10px",
                  display: "flex", flexDirection: "column", gap: 8,
                }}>
                  {upiApps.map(({ name, IconComp }) => (
                    <div key={name} className="pm-option"
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "13px 14px", background: "var(--white)",
                        borderRadius: 10, cursor: "pointer",
                        border: "1px solid var(--border)",
                      }}
                      onClick={() => goUpiPayment(name)}>
                      <IconComp />
                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{name}</span>
                      <ChevronDown size={14} stroke="var(--ink-30)" strokeWidth={2.5}
                        style={{ marginLeft: "auto", transform: "rotate(-90deg)" }} />
                    </div>
                  ))}
                </div>
              )}

              {/* ── InstaBuy Wallet ── */}
              <div className="pm-method"
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
                  border: `1.5px solid ${method === "wallet" ? "#f97316" : "var(--border)"}`,
                  borderRadius: 14, cursor: "pointer",
                  background: method === "wallet" ? "var(--orange-pale)" : "var(--white)",
                  boxShadow: method === "wallet" ? "0 0 0 3px rgba(249,115,22,0.1)" : "none",
                }}
                onClick={() => setMethod(method === "wallet" ? "" : "wallet")}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  border: `2px solid ${method === "wallet" ? "#f97316" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {method === "wallet" && <div style={{ width: 10, height: 10, background: "#f97316", borderRadius: "50%" }} />}
                </div>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: "var(--orange-pale)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <WalletMethodIcon />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>InstaBuy Wallet</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: "#f97316",
                      background: "white", border: "1px solid #fed7aa",
                      borderRadius: 6, padding: "2px 7px", letterSpacing: "0.04em",
                    }}>INSTANT</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-60)", marginTop: 2 }}>Pay instantly with your InstaBuy balance</div>
                </div>
                {/* Wallet icon */}
                <InstaBuyWalletIcon />
              </div>

              {/* ── Cash on Delivery ── */}
              <div className="pm-method"
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
                  border: `1.5px solid ${method === "cod" ? "#f97316" : "var(--border)"}`,
                  borderRadius: 14, cursor: "pointer",
                  background: method === "cod" ? "var(--orange-pale)" : "var(--white)",
                  boxShadow: method === "cod" ? "0 0 0 3px rgba(249,115,22,0.1)" : "none",
                }}
                onClick={() => setMethod(method === "cod" ? "" : "cod")}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  border: `2px solid ${method === "cod" ? "#f97316" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {method === "cod" && <div style={{ width: 10, height: 10, background: "#f97316", borderRadius: "50%" }} />}
                </div>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: "var(--orange-pale)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <CodMethodIcon />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Cash on Delivery</div>
                  <div style={{ fontSize: 12, color: "var(--ink-60)", marginTop: 2 }}>Pay in cash when your order arrives</div>
                </div>
              </div>

            </div>

            {/* Divider */}
            <div style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, var(--border), transparent)",
              margin: "0 32px",
            }} />

            {/* CTA / Spinner */}
            <div style={{ padding: "20px 32px 32px" }}>
              {processing ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{
                    width: 44, height: 44, margin: "0 auto 14px",
                    border: "4px solid var(--border)",
                    borderTopColor: "#f97316",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  <p style={{ fontSize: 14, color: "var(--ink-60)", fontWeight: 500 }}>Placing your order…</p>
                </div>
              ) : (method === "wallet" || method === "cod") && (
                <button className="ib-submit-btn"
                  onClick={handlePlaceOrder}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg,#f97316,#ea580c)",
                    color: "white", border: "none",
                    padding: "16px 0", borderRadius: 12,
                    fontSize: 15, fontWeight: 700,
                    cursor: "pointer", fontFamily: "var(--sans)",
                    boxShadow: "0 6px 20px rgba(249,115,22,0.35)",
                    letterSpacing: "0.02em",
                  }}>
                  {method === "cod" ? "Place Order" : `Pay ₹${total.toLocaleString()}`}
                </button>
              )}
              {!processing && !method && (
                <p style={{ textAlign: "center", fontSize: 13, color: "var(--ink-30)", fontWeight: 500 }}>
                  Select a payment method above to continue
                </p>
              )}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="fade-up fade-up-3" style={{
            display: "flex", justifyContent: "center", gap: "1.5rem",
            marginTop: 32, flexWrap: "wrap",
          }}>
            {[
              {
                text: "Secure Checkout",
                svg: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="#f97316" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                ),
              },
              {
                text: "Fast Delivery",
                svg: (
                  <svg width="20" height="18" viewBox="0 0 26 24" fill="none"
                    stroke="#f97316" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="15" height="13" rx="1.5"/>
                    <path d="M16 8h4l3 5v4h-7V8z"/>
                    <circle cx="5.5" cy="19.5" r="2.5"/>
                    <circle cx="19.5" cy="19.5" r="2.5"/>
                    <line x1="1" y1="9" x2="5" y2="9"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                  </svg>
                ),
              },
              {
                text: "Easy Returns",
                svg: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="#f97316" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74"/>
                    <polyline points="3 3 3 9 9 9"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="15" x2="12.01" y2="15"/>
                  </svg>
                ),
              },
            ].map(({ svg, text }) => (
              <div key={text} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "var(--white)", border: "1px solid var(--border)",
                borderRadius: 10, padding: "9px 16px", boxShadow: "var(--shadow-sm)",
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, background: "var(--orange-pale)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {svg}
                </div>
                <span style={{ fontSize: 12.5, color: "var(--ink)", fontWeight: 600 }}>{text}</span>
              </div>
            ))}
          </div>

        </main>
      </div>
    </>
  );
};

export default PaymentPage;