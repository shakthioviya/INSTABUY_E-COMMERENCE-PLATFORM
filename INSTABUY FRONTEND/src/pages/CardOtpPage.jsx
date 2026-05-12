import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyCardOtp, verifyUpiOtp } from "../config/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
const ArrowLeft = (p) => (
  <Icon {...p}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </Icon>
);
const MailIcon = (p) => (
  <Icon {...p}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </Icon>
);
const ShieldIcon = (p) => (
  <Icon {...p}>
    <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z" />
    <polyline points="9 12 11 14 15 10" />
  </Icon>
);
const RefreshIcon = (p) => (
  <Icon {...p}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </Icon>
);

// ─── Real Brand Icons ─────────────────────────────────────────────────────────
const GpayBrandIcon = ({ size = 48 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.22,
    background: "#fff", border: "1.5px solid #e8e4df",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: "0 3px 12px rgba(0,0,0,0.10)",
  }}>
    <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 48 48" fill="none">
      <path d="M24 19.5v3.8h9.1c-.4 2.1-1.6 3.9-3.3 5.1l5.3 4.1C38.3 30 40 27.2 40 24c0-.9-.1-1.8-.3-2.6L24 19.5z" fill="#4285F4"/>
      <path d="M11.3 28.6l-1.2.9-4.2 3.3C8.4 36.6 15.7 40 24 40c5.5 0 10.1-1.8 13.5-4.9l-5.3-4.1c-1.7 1.2-3.9 1.9-8.2 1.9-6.3 0-11.6-4.2-13.5-10.3h-.2z" fill="#34A853"/>
      <path d="M6 15.1C4.7 17.6 4 20.2 4 24s.7 6.4 2 8.9l5.3-4.1c-.4-1.2-.6-2.5-.6-3.8s.2-2.6.6-3.8L6 15.1z" fill="#FBBC04"/>
      <path d="M24 12.5c3 0 5.7 1 7.8 3l5.8-5.8C34 6.5 29.4 4.5 24 4.5c-8.3 0-15.6 4.8-19.1 11.8L10.2 20c1.9-4.4 6.3-7.5 13.8-7.5z" fill="#EA4335"/>
    </svg>
  </div>
);

const PhonepeBrandIcon = ({ size = 48 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.22,
    background: "#5F259F", border: "1.5px solid #e8e4df",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: "0 3px 12px rgba(0,0,0,0.10)",
  }}>
    <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 64 64" fill="none">
      <path d="M38 8H22C16.5 8 12 12.5 12 18v28c0 5.5 4.5 10 10 10h4V46h-4c-2.2 0-4-1.8-4-4V18c0-2.2 1.8-4 4-4h16c6.6 0 12 5.4 12 12s-5.4 12-12 12h-8v8h8c11 0 20-9 20-20S49 8 38 8z" fill="white"/>
      <circle cx="47" cy="50" r="6" fill="#00BAF2"/>
    </svg>
  </div>
);

const PaytmBrandIcon = ({ size = 48 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.22,
    background: "#00BAF2", border: "1.5px solid #e8e4df",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: "0 3px 12px rgba(0,0,0,0.10)",
  }}>
    <svg width={size * 0.68} height={size * 0.68} viewBox="0 0 48 48" fill="none">
      <text x="24" y="34" textAnchor="middle" fontSize="28" fontWeight="900"
        fill="white" fontFamily="Arial Black, Arial, sans-serif">P</text>
      <rect x="8" y="37" width="32" height="5" rx="2" fill="#002970"/>
    </svg>
  </div>
);

const BhimBrandIcon = ({ size = 48 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.22,
    background: "#fff", border: "1.5px solid #e8e4df",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: "0 3px 12px rgba(0,0,0,0.10)",
  }}>
    <svg width={size * 0.78} height={size * 0.78} viewBox="0 0 56 56" fill="none">
      <rect x="4" y="6"  width="48" height="13" rx="3" fill="#FF9933"/>
      <rect x="4" y="19" width="48" height="13" rx="0" fill="#f5f5f5"/>
      <text x="28" y="29.5" textAnchor="middle" fontSize="9" fontWeight="900"
        fill="#000088" fontFamily="Arial Black, Arial, sans-serif">BHIM</text>
      <rect x="4" y="32" width="48" height="13" rx="3" fill="#138808"/>
      <rect x="4" y="45" width="48" height="8"  rx="3" fill="#000088"/>
      <text x="28" y="51.5" textAnchor="middle" fontSize="6.5" fontWeight="700"
        fill="white" fontFamily="Arial, sans-serif" letterSpacing="2">UPI</text>
    </svg>
  </div>
);

// Card bank icons
const HdfcBrandIcon = ({ size = 48 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.22,
    background: "#fff", border: "1.5px solid #e8e4df",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: "0 3px 12px rgba(0,0,0,0.10)",
  }}>
    <img src="https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg"
      alt="HDFC" style={{ width: size * 0.72, height: size * 0.72, objectFit: "contain" }}
      onError={e => { e.target.style.display = "none"; }} />
  </div>
);

const IciciBrandIcon = ({ size = 48 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.22,
    background: "#fff", border: "1.5px solid #e8e4df",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: "0 3px 12px rgba(0,0,0,0.10)",
  }}>
    <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg"
      alt="ICICI" style={{ width: size * 0.72, height: size * 0.72, objectFit: "contain" }}
      onError={e => { e.target.style.display = "none"; }} />
  </div>
);

const SbiBrandIcon = ({ size = 48 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.22,
    background: "#fff", border: "1.5px solid #e8e4df",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: "0 3px 12px rgba(0,0,0,0.10)",
  }}>
    <img src="https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg"
      alt="SBI" style={{ width: size * 0.72, height: size * 0.72, objectFit: "contain" }}
      onError={e => { e.target.style.display = "none"; }} />
  </div>
);

// Generic card icon fallback
const CardBrandIcon = ({ size = 48 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.22,
    background: "var(--orange-pale)", border: "1.5px solid #fed7aa",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: "0 3px 12px rgba(0,0,0,0.10)",
  }}>
    <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none"
      stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
      <line x1="5" y1="15" x2="9" y2="15"/>
    </svg>
  </div>
);

// Wallet icon
const WalletBrandIcon = ({ size = 48 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.22,
    background: "linear-gradient(135deg,#f97316,#ea580c)",
    border: "1.5px solid #fed7aa",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: "0 3px 12px rgba(249,115,22,0.3)",
  }}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
      <circle cx="17" cy="13" r="1.5" fill="white" stroke="none"/>
    </svg>
  </div>
);

// Map method name → brand icon
const METHOD_ICONS = {
  "Google Pay":   GpayBrandIcon,
  "PhonePe":      PhonepeBrandIcon,
  "Paytm":        PaytmBrandIcon,
  "BHIM UPI":     BhimBrandIcon,
  "HDFC Bank":    HdfcBrandIcon,
  "ICICI Bank":   IciciBrandIcon,
  "SBI":          SbiBrandIcon,
  "Card Payment": CardBrandIcon,
  "wallet":       WalletBrandIcon,
};

// ─── Dropdown config ──────────────────────────────────────────────────────────
const dropdownItems = [
  { label: "My Orders", IconComp: OrdersIcon },
  { label: "My Wallet", IconComp: WalletIcon },
];
const routes = { "My Orders": "/myorders", "My Wallet": "/mywallet" };

// ─── Main Component ───────────────────────────────────────────────────────────
const CardOtpPage = () => {
  const navigate     = useNavigate();
  const { state }    = useLocation();
  const dropdownRef  = useRef(null);
  const userName     = getUserName();

  const total   = state?.total   || 0;
  const gmail   = state?.gmail   || "user@gmail.com";
  const method  = state?.method  || "Payment";
  const orderId = state?.orderId || null;
  const couponCode = state?.couponCode || null; // ✅

  const [otp,        setOtp]        = useState(["", "", "", "", "", ""]);
  const [timeLeft,   setTimeLeft]   = useState(300);
  const [processing, setProcessing] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(null);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsUserDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`).focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      document.getElementById(`otp-${index - 1}`).focus();
  };

  const verifyOtp = async () => {
    if (otp.join("").length !== 6) { alert("Enter valid 6 digit OTP"); return; }
    setProcessing(true);
    try {
      const enteredOtp = otp.join("");
      const isCard = ["HDFC Bank", "ICICI Bank", "SBI", "Card Payment"].includes(method);
      if (isCard) await verifyCardOtp(gmail, orderId, enteredOtp, couponCode); // ✅
else        await verifyUpiOtp(gmail, orderId, enteredOtp, couponCode);  // ✅
      navigate("/order-success", { state: { orderId, total, method } });
    } catch (err) {
      console.error("OTP verification failed:", err);
      alert(err.response?.data?.message || err.response?.data || "Invalid OTP. Please try again.");
      setProcessing(false);
    }
  };

  const resendOtp = () => {
    setTimeLeft(300);
    setOtp(["", "", "", "", "", ""]);
    alert("New OTP sent to " + gmail);
  };

  const BrandIcon = METHOD_ICONS[method] || CardBrandIcon;
  const isCard = ["HDFC Bank", "ICICI Bank", "SBI", "Card Payment"].includes(method);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --orange:#f97316;
          --orange-deep:#ea580c;
          --orange-pale:#fff7ed;
          --ink:#0f0e0d;
          --ink-60:rgba(15,14,13,0.6);
          --ink-30:rgba(15,14,13,0.3);
          --border:#e8e4df;
          --surface:#faf9f7;
          --white:#ffffff;
          --serif:'DM Serif Display',Georgia,serif;
          --sans:'DM Sans',system-ui,sans-serif;
          --shadow-sm:0 1px 4px rgba(0,0,0,0.06);
          --shadow-md:0 4px 20px rgba(0,0,0,0.08);
          --shadow-lg:0 12px 48px rgba(0,0,0,0.12);
        }
        html{scroll-behavior:smooth;}
        body{font-family:var(--sans);background:var(--surface);color:var(--ink);}
        .header-btn:hover{background:var(--orange-pale)!important;}
        .dd-item:hover{background:#fff7ed!important;color:#f97316!important;}
        .dd-item:hover svg{stroke:#f97316!important;}
        .otp-input:focus{
          border-color:var(--orange)!important;
          box-shadow:0 0 0 4px rgba(249,115,22,0.14)!important;
          background:#fff!important;
          transform:scale(1.06);
        }
        .otp-input{transition:border-color 0.18s,box-shadow 0.18s,transform 0.18s,background 0.18s;}
        .verify-btn{transition:transform 0.18s,box-shadow 0.18s,opacity 0.18s;}
        .verify-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 32px rgba(249,115,22,0.38)!important;}
        .verify-btn:active:not(:disabled){transform:translateY(0);opacity:0.9;}
        .resend-btn:hover{background:var(--orange-pale)!important;color:var(--orange)!important;}
        .back-btn:hover{color:var(--orange)!important;}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
        .fade-up{animation:fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both;}
        .timer-pulse{animation:pulse 1s ease-in-out infinite;}
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
              Secured by InstaBuy · 256-bit SSL Encryption
            </span>
          </div>

          <div style={{
            maxWidth: 1340, margin: "0 auto", padding: "0 1.5rem",
            display: "flex", alignItems: "center", height: 62, gap: "1rem",
          }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }}
              onClick={() => navigate("/home")}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "linear-gradient(135deg,#f97316,#ea580c)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 3px 10px rgba(249,115,22,0.35)",
              }}>
                <ShoppingBagIcon size={17} stroke="white" strokeWidth={2.3} />
              </div>
              <span style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.01em" }}>
                InstaBuy
              </span>
            </div>

            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-60)", marginLeft: 6 }}>
              <span style={{ color: "var(--ink-30)" }}>›</span>
              <span>Checkout</span>
              <span style={{ color: "var(--ink-30)" }}>›</span>
              <span style={{ color: "var(--orange)", fontWeight: 600 }}>OTP Verification</span>
            </div>

            {/* Profile dropdown */}
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
                    <span style={{ fontSize: 12, color: "var(--ink)", fontWeight: 700, maxWidth: 68, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
                    <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, background: "var(--orange-pale)" }}>
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
                          width: "100%", padding: "10px 16px", background: "transparent",
                          border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
                          color: "var(--ink)", textAlign: "left", transition: "all 0.15s",
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
                        width: "100%", padding: "10px 16px", background: "transparent",
                        border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
                        color: "#dc2626", textAlign: "left", transition: "all 0.15s",
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
        <main style={{ maxWidth: 560, margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>

          {/* Back */}
          <button className="back-btn"
            onClick={() => navigate(-1)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "transparent", border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, color: "var(--ink-60)",
              padding: "6px 0", marginBottom: "1.5rem", transition: "color 0.18s",
            }}>
            <ArrowLeft size={16} stroke="currentColor" strokeWidth={2} />
            Back to payment
          </button>

          {/* Card */}
          <div className="fade-up" style={{
            background: "white", borderRadius: 20,
            border: "1px solid var(--border)", boxShadow: "var(--shadow-md)",
            overflow: "hidden",
          }}>

            {/* Gradient header */}
            <div style={{
              background: "linear-gradient(135deg,#f97316 0%,#ea580c 100%)",
              padding: "28px 32px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                    {isCard ? "Card Payment OTP" : "UPI Payment OTP"}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <BrandIcon size={44} />
                    <h1 style={{ fontFamily: "var(--serif)", fontSize: "1.75rem", fontWeight: 400, color: "white", letterSpacing: "-0.02em" }}>
                      {method}
                    </h1>
                  </div>
                </div>
                {/* Amount badge */}
                <div style={{
                  background: "rgba(255,255,255,0.15)", borderRadius: 14,
                  padding: "10px 18px", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.25)", textAlign: "right",
                }}>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginBottom: 2 }}>Amount</p>
                  <p style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", color: "white", fontWeight: 400, letterSpacing: "-0.01em" }}>
                    ₹{total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "32px" }}>

              {/* Shield + title */}
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16, margin: "0 auto 14px",
                  background: "var(--orange-pale)", border: "1px solid #fed7aa",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <ShieldIcon size={26} stroke="var(--orange)" strokeWidth={1.8} />
                </div>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.45rem", fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: 6 }}>
                  OTP Verification
                </h2>
                <p style={{ fontSize: 13.5, color: "var(--ink-60)" }}>
                  Verify your {method} payment
                </p>
              </div>

              {/* Gmail pill */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "var(--orange-pale)", border: "1px solid #fed7aa",
                borderRadius: 12, padding: "12px 16px", marginBottom: 20,
              }}>
                <MailIcon size={16} stroke="var(--orange)" strokeWidth={2} />
                <span style={{ fontSize: 13, color: "var(--ink-60)" }}>
                  OTP sent to&nbsp;<strong style={{ color: "var(--ink)", fontWeight: 700 }}>{gmail}</strong>
                </span>
              </div>

              {/* OTP inputs */}
              <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 24 }}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    className="otp-input"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onFocus={() => setFocusedIdx(index)}
                    onBlur={() => setFocusedIdx(null)}
                    style={{
                      width: 52, height: 60, fontSize: 24, fontWeight: 700,
                      textAlign: "center", fontFamily: "var(--sans)",
                      border: `2px solid ${focusedIdx === index ? "var(--orange)" : digit ? "#fdba74" : "var(--border)"}`,
                      borderRadius: 14, outline: "none",
                      background: digit ? "var(--orange-pale)" : "var(--surface)",
                      color: "var(--ink)",
                    }}
                  />
                ))}
              </div>

              {/* Timer */}
              <div style={{
                textAlign: "center", marginBottom: 24,
                fontSize: 14, color: "var(--ink-60)", fontWeight: 500,
              }}>
                {timeLeft > 0 ? (
                  <span>
                    OTP expires in&nbsp;
                    <span className={timeLeft <= 30 ? "timer-pulse" : ""}
                      style={{ color: timeLeft <= 30 ? "#dc2626" : "var(--orange)", fontWeight: 700, fontSize: 15 }}>
                      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                    </span>
                  </span>
                ) : (
                  <div>
                    <p style={{ color: "#dc2626", fontWeight: 700, marginBottom: 12, fontSize: 14 }}>
                      OTP expired
                    </p>
                    <button className="resend-btn"
                      onClick={resendOtp}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        background: "transparent", border: "1.5px solid var(--orange)",
                        color: "var(--orange)", borderRadius: 10, padding: "9px 20px",
                        fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)",
                        transition: "all 0.18s",
                      }}>
                      <RefreshIcon size={14} stroke="currentColor" strokeWidth={2} />
                      Resend OTP
                    </button>
                  </div>
                )}
              </div>

              {/* CTA */}
              {processing ? (
                <div style={{ textAlign: "center", padding: "10px 0 4px" }}>
                  <div style={{
                    width: 40, height: 40, margin: "0 auto 14px",
                    border: "3px solid var(--border)", borderTopColor: "var(--orange)",
                    borderRadius: "50%", animation: "spin 0.8s linear infinite",
                  }} />
                  <p style={{ fontSize: 13.5, color: "var(--ink-60)", fontWeight: 600 }}>
                    Verifying OTP…
                  </p>
                </div>
              ) : (
                <button className="verify-btn"
                  onClick={verifyOtp}
                  disabled={timeLeft === 0}
                  style={{
                    width: "100%",
                    background: timeLeft === 0
                      ? "var(--border)"
                      : "linear-gradient(135deg,#f97316,#ea580c)",
                    color: timeLeft === 0 ? "var(--ink-30)" : "white",
                    border: "none", padding: "15px", borderRadius: 14,
                    fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700,
                    cursor: timeLeft === 0 ? "not-allowed" : "pointer",
                    boxShadow: timeLeft === 0 ? "none" : "0 6px 20px rgba(249,115,22,0.35)",
                    letterSpacing: "0.02em",
                  }}>
                  Verify & Complete Payment →
                </button>
              )}



            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CardOtpPage;