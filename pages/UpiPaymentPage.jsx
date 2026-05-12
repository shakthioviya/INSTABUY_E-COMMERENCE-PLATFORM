import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { placeOrder, initiateUpiPayment, getUserId } from "../config/api";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getUserName() {
  try { return localStorage.getItem("username") || "User"; } catch { return "User"; }
}

// ─── SVG Icon System (mirrors InstaBuyHome) ───────────────────────────────────
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

const ArrowLeft = (p) => (
  <Icon {...p}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </Icon>
);

const CheckCircle = (p) => (
  <Icon {...p}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </Icon>
);

// ─── Real UPI Brand Icons (same as PaymentPage) ───────────────────────────────
const GpayBrandIcon = ({ size = 40 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.22,
    background: "#fff", border: "1px solid #e8e4df",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
  }}>
    <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 48 48" fill="none">
      <path d="M24 19.5v3.8h9.1c-.4 2.1-1.6 3.9-3.3 5.1l5.3 4.1C38.3 30 40 27.2 40 24c0-.9-.1-1.8-.3-2.6L24 19.5z" fill="#4285F4"/>
      <path d="M11.3 28.6l-1.2.9-4.2 3.3C8.4 36.6 15.7 40 24 40c5.5 0 10.1-1.8 13.5-4.9l-5.3-4.1c-1.7 1.2-3.9 1.9-8.2 1.9-6.3 0-11.6-4.2-13.5-10.3h-.2z" fill="#34A853"/>
      <path d="M6 15.1C4.7 17.6 4 20.2 4 24s.7 6.4 2 8.9l5.3-4.1c-.4-1.2-.6-2.5-.6-3.8s.2-2.6.6-3.8L6 15.1z" fill="#FBBC04"/>
      <path d="M24 12.5c3 0 5.7 1 7.8 3l5.8-5.8C34 6.5 29.4 4.5 24 4.5c-8.3 0-15.6 4.8-19.1 11.8L10.2 20c1.9-4.4 6.3-7.5 13.8-7.5z" fill="#EA4335"/>
    </svg>
  </div>
);

const PhonepeBrandIcon = ({ size = 40 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.22,
    background: "#5F259F", border: "1px solid #e8e4df",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
  }}>
    <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 64 64" fill="none">
      <path d="M38 8H22C16.5 8 12 12.5 12 18v28c0 5.5 4.5 10 10 10h4V46h-4c-2.2 0-4-1.8-4-4V18c0-2.2 1.8-4 4-4h16c6.6 0 12 5.4 12 12s-5.4 12-12 12h-8v8h8c11 0 20-9 20-20S49 8 38 8z" fill="white"/>
      <circle cx="47" cy="50" r="6" fill="#00BAF2"/>
    </svg>
  </div>
);

const PaytmBrandIcon = ({ size = 40 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.22,
    background: "#00BAF2", border: "1px solid #e8e4df",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
  }}>
    <svg width={size * 0.68} height={size * 0.68} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="4" fill="#00BAF2"/>
      <text x="24" y="33" textAnchor="middle" fontSize="26" fontWeight="900"
        fill="white" fontFamily="Arial Black, Arial, sans-serif">P</text>
      <rect x="8" y="36" width="32" height="5" rx="2" fill="#002970"/>
    </svg>
  </div>
);

const BhimBrandIcon = ({ size = 40 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.22,
    background: "#fff", border: "1px solid #e8e4df",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
  }}>
    <svg width={size * 0.78} height={size * 0.78} viewBox="0 0 56 56" fill="none">
      <rect x="4" y="6" width="48" height="13" rx="3" fill="#FF9933"/>
      <rect x="4" y="19" width="48" height="13" rx="0" fill="#f5f5f5"/>
      <text x="28" y="29.5" textAnchor="middle" fontSize="9" fontWeight="900"
        fill="#000088" fontFamily="Arial Black, Arial, sans-serif">BHIM</text>
      <rect x="4" y="32" width="48" height="13" rx="3" fill="#138808"/>
      <rect x="4" y="45" width="48" height="8" rx="3" fill="#000088"/>
      <text x="28" y="51.5" textAnchor="middle" fontSize="6.5" fontWeight="700"
        fill="white" fontFamily="Arial, sans-serif" letterSpacing="2">UPI</text>
    </svg>
  </div>
);

// Map app name → brand icon component
const UPI_BRAND_ICONS = {
  "Google Pay": GpayBrandIcon,
  "PhonePe":    PhonepeBrandIcon,
  "Paytm":      PaytmBrandIcon,
  "BHIM UPI":   BhimBrandIcon,
};

// ─── Dropdown items ───────────────────────────────────────────────────────────
const dropdownItems = [
  { label: "My Profile",  IconComp: UserIcon    },
  { label: "My Orders",   IconComp: OrdersIcon  },
  { label: "My Wallet",   IconComp: WalletIcon  },
];
const routes = { "My Profile": "/profile", "My Orders": "/orders", "My Wallet": "/wallet" };

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UpiPaymentPage() {
  const navigate   = useNavigate();
  const { state }  = useLocation();
  const dropdownRef = useRef(null);

  const total   = state?.total   || 0;
  const app     = state?.app     || "UPI";
  const items   = state?.items   || [];
  const address = state?.address || "";

  const [upiId,  setUpiId]  = useState("");
  const [gmail,  setGmail]  = useState("");
  const [loading, setLoading] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [upiIdFocused, setUpiIdFocused] = useState(false);
  const [gmailFocused, setGmailFocused] = useState(false);

  const userName = getUserName();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsUserDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const proceedOtp = async () => {
    if (!upiId.includes("@")) { alert("Enter valid UPI ID"); return; }
    if (!gmail.includes("@"))  { alert("Enter valid Gmail"); return; }

    setLoading(true);
    try {
      const orderPayload = {
        userId: Number(getUserId()),
        address: address,
        items: items.map(item => ({
          productId:   item.productId   || item.id,
          productName: item.productName || item.name,
          quantity:    item.cartQty     || item.quantity || 1,
        })),
      };
      const orderRes = await placeOrder(orderPayload);
      const orderId  = orderRes.data?.id || orderRes.data?.orderId;

      await initiateUpiPayment(upiId, gmail, orderId, total);

      navigate("/otp", {
        state: { total, gmail, method: app, orderId, items, address },
      });
    } catch (err) {
      console.error("UPI initiation failed:", err);
      alert(err.response?.data || "Failed to send OTP. Try again.");
      setLoading(false);
    }
  };

  const BrandIcon = UPI_BRAND_ICONS[app] || null;

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
          --radius:14px;
          --shadow-sm:0 1px 4px rgba(0,0,0,0.06);
          --shadow-md:0 4px 20px rgba(0,0,0,0.08);
          --shadow-lg:0 12px 48px rgba(0,0,0,0.12);
        }
        html{scroll-behavior:smooth;}
        body{font-family:var(--sans);background:var(--surface);color:var(--ink);}
        .header-btn:hover{background:var(--orange-pale)!important;}
        .dd-item:hover{background:#fff7ed!important;color:#f97316!important;}
        .dd-item:hover svg{stroke:#f97316!important;}
        .upi-input:focus{
          border-color:var(--orange)!important;
          box-shadow:0 0 0 3px rgba(249,115,22,0.12)!important;
          background:#fff!important;
        }
        .pay-btn:hover{opacity:0.90;transform:translateY(-1px);}
        .back-btn:hover{background:var(--orange-pale)!important;color:var(--orange)!important;}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
        .fade-up{animation:fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both;}
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
          {/* Promo bar */}
          <div style={{ background: "var(--ink)", padding: "6px 1.5rem", textAlign: "center" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", letterSpacing: "0.04em" }}>
              Secured by InstaBuy · 256-bit SSL Encryption
            </span>
          </div>

          <div style={{
            maxWidth: 1340, margin: "0 auto", padding: "0 1.5rem",
            display: "flex", alignItems: "center", height: 62, gap: "1rem",
          }}>
            {/* Left — Logo */}
            <div
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }}
              onClick={() => navigate("/")}
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

            {/* Page crumb */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 13, color: "var(--ink-60)", marginLeft: 6,
            }}>
              <span style={{ color: "var(--ink-30)" }}>›</span>
              <span>Checkout</span>
              <span style={{ color: "var(--ink-30)" }}>›</span>
              <span style={{ color: "var(--orange)", fontWeight: 600 }}>{app} Payment</span>
            </div>

            {/* Right — Profile */}
            <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0, marginLeft: "auto" }}>
              <div style={{ position: "relative" }} ref={dropdownRef}>
                <button
                  className="header-btn"
                  onClick={() => setIsUserDropdownOpen(o => !o)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    background: "transparent", border: "none", borderRadius: 10,
                    cursor: "pointer", padding: "6px 10px", transition: "background 0.18s",
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
                        width: "100%", padding: "10px 16px", background: "transparent",
                        border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
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
          </div>
        </header>

        {/* ══════════ MAIN ══════════ */}
        <main style={{ maxWidth: 620, margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>

          {/* Back button */}
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "transparent", border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, color: "var(--ink-60)",
              padding: "6px 0", marginBottom: "1.5rem",
              transition: "color 0.18s",
            }}
          >
            <ArrowLeft size={16} stroke="currentColor" strokeWidth={2} />
            Back to checkout
          </button>

          <div className="fade-up" style={{
            background: "white",
            borderRadius: 20,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
          }}>

            {/* Card header gradient */}
            <div style={{
              background: "linear-gradient(135deg,#f97316 0%,#ea580c 100%)",
              padding: "28px 32px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                    Payment via
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {BrandIcon && <BrandIcon size={44} />}
                    <h1 style={{
                      fontFamily: "var(--serif)", fontSize: "1.9rem",
                      fontWeight: 400, color: "white", letterSpacing: "-0.02em",
                    }}>
                      {app}
                    </h1>
                  </div>
                </div>
                <div style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 14, padding: "10px 18px",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginBottom: 2 }}>Total Amount</p>
                  <p style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", color: "white", fontWeight: 400, letterSpacing: "-0.01em" }}>
                    ₹{total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Card body */}
            <div style={{ padding: "32px" }}>

              {/* UPI ID field */}
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: "block", fontSize: 12, fontWeight: 700,
                  color: "var(--ink-60)", letterSpacing: "0.06em",
                  textTransform: "uppercase", marginBottom: 8,
                }}>
                  UPI ID
                </label>
                <input
                  className="upi-input"
                  placeholder="yourname@okhdfc"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  style={{
                    width: "100%", padding: "13px 16px",
                    border: `1.5px solid ${upiIdFocused ? "var(--orange)" : "var(--border)"}`,
                    borderRadius: 12, fontSize: 14, fontFamily: "var(--sans)",
                    color: "var(--ink)", background: "var(--surface)", outline: "none",
                    transition: "all 0.18s",
                  }}
                  onFocus={() => setUpiIdFocused(true)}
                  onBlur={() => setUpiIdFocused(false)}
                />
              </div>

              {/* Gmail field */}
              <div style={{ marginBottom: 28 }}>
                <label style={{
                  display: "block", fontSize: 12, fontWeight: 700,
                  color: "var(--ink-60)", letterSpacing: "0.06em",
                  textTransform: "uppercase", marginBottom: 8,
                }}>
                  Gmail for OTP
                </label>
                <input
                  className="upi-input"
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                  style={{
                    width: "100%", padding: "13px 16px",
                    border: `1.5px solid ${gmailFocused ? "var(--orange)" : "var(--border)"}`,
                    borderRadius: 12, fontSize: 14, fontFamily: "var(--sans)",
                    color: "var(--ink)", background: "var(--surface)", outline: "none",
                    transition: "all 0.18s",
                  }}
                  onFocus={() => setGmailFocused(true)}
                  onBlur={() => setGmailFocused(false)}
                />
              </div>

    

              {/* CTA */}
              {loading ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{
                    width: 40, height: 40, margin: "0 auto 14px",
                    border: "3px solid var(--border)",
                    borderTopColor: "var(--orange)",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-60)", fontFamily: "var(--sans)" }}>
                    Sending OTP to your Gmail…
                  </p>
                </div>
              ) : (
                <button
                  className="pay-btn"
                  onClick={proceedOtp}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg,#f97316,#ea580c)",
                    border: "none", color: "white",
                    padding: "15px", borderRadius: 14,
                    fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700,
                    cursor: "pointer", letterSpacing: "0.02em",
                    boxShadow: "0 6px 20px rgba(249,115,22,0.35)",
                    transition: "all 0.2s",
                  }}
                >
                  Proceed to OTP →
                </button>
              )}

              {/* Trust badges */}
              <div style={{
                display: "flex", justifyContent: "center", gap: 24,
                marginTop: 24, paddingTop: 24,
                borderTop: "1px solid var(--border)",
              }}>
                {["SSL Secure", "UPI Verified", "Instant"].map((badge) => (
                  <span key={badge} style={{
                    fontSize: 11.5, fontWeight: 600,
                    color: "var(--ink-60)", letterSpacing: "0.02em",
                  }}>
                    {badge}
                  </span>
                ))}
              </div>

            </div>
          </div>
        </main>

      </div>
    </>
  );
}