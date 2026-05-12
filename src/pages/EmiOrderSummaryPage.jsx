import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { initiateEmiPayment } from '../config/api';
import { placeOrder } from '../config/api';

// ─── Shared Icon Primitive ────────────────────────────────────────────────────
const Icon = ({ size = 20, stroke = "currentColor", strokeWidth = 1.8, fill = "none", children, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0, ...style }}>
    {children}
  </svg>
);

// ─── Nav Icons ────────────────────────────────────────────────────────────────
const ShoppingBagIcon = (p) => (
  <Icon {...p}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </Icon>
);
const CartIcon = (p) => (
  <Icon {...p}>
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </Icon>
);
const ChevronDown = (p) => (<Icon {...p}><polyline points="6 9 12 15 18 9" /></Icon>);
const ChevronRight = (p) => (<Icon {...p}><polyline points="9 18 15 12 9 6" /></Icon>);
const SignOutIcon = (p) => (
  <Icon {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </Icon>
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

// ─── Page-specific Icons ──────────────────────────────────────────────────────
const ReceiptIcon = (p) => (
  <Icon {...p}>
    <polyline points="6 9 12 15 18 9" style={{ display: 'none' }} />
    <path d="M4 2h16v20l-4-2-4 2-4-2-4 2V2z" />
    <line x1="8" y1="8" x2="16" y2="8" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="8" y1="16" x2="12" y2="16" />
  </Icon>
);
const CalendarIcon = (p) => (
  <Icon {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </Icon>
);
const PackageIcon = (p) => (
  <Icon {...p}>
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </Icon>
);
const MapPinIcon = (p) => (
  <Icon {...p}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);
const PercentIcon = (p) => (
  <Icon {...p}>
    <line x1="19" y1="5" x2="5" y2="19" />
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </Icon>
);
const TrendingUpIcon = (p) => (
  <Icon {...p}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </Icon>
);
const AlertCircleIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </Icon>
);
const CheckCircleIcon = (p) => (
  <Icon {...p}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </Icon>
);
const LoaderIcon = (p) => (
  <Icon {...p}>
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </Icon>
);
const HomeIcon = (p) => (
  <Icon {...p}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </Icon>
);
const StarIcon = (p) => (
  <Icon {...p}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </Icon>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getUserName() {
  try { return localStorage.getItem("username") || "User"; } catch { return "User"; }
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const navigate = useNavigate();
  const [cartFlash, setCartFlash] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userName = getUserName();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addToCart = () => { setCartFlash(true); setTimeout(() => setCartFlash(false), 400); };

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", height: 62, gap: "1rem" }}>
        {/* Logo */}
        <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#f97316,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(249,115,22,0.35)" }}>
            <ShoppingBagIcon size={17} stroke="white" strokeWidth={2.3} />
          </div>
          <span style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.01em" }}>InstaBuy</span>
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: "auto" }}>
          {/* Profile */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button className="header-btn" onClick={() => setDropdownOpen(o => !o)}
              style={{ display: "flex", alignItems: "center", gap: 7, background: "transparent", border: "none", borderRadius: 10, cursor: "pointer", padding: "6px 10px", transition: "background 0.18s" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#f97316,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{userName.charAt(0).toUpperCase()}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.2 }}>
                <span style={{ fontSize: 10, color: "var(--ink-60)", fontWeight: 400 }}>Hello,</span>
                <span style={{ fontSize: 12, color: "var(--ink)", fontWeight: 700, maxWidth: 68, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</span>
              </div>
              <ChevronDown size={12} stroke="var(--ink-60)" strokeWidth={2.5} />
            </button>
            {dropdownOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, background: "white", border: "1px solid var(--border)", borderRadius: 16, boxShadow: "var(--shadow-lg)", minWidth: 210, zIndex: 100, overflow: "hidden" }}>
                <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, background: "var(--orange-pale)" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#f97316,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "white", flexShrink: 0 }}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{userName}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-60)" }}>Member</div>
                  </div>
                </div>
                <div style={{ height: 1, background: "var(--border)" }} />
                {[{ label: "My Orders", IC: OrdersIcon }, { label: "My Wallet", IC: WalletIcon }].map(({ label, IC }) => (
                  <button key={label} className="dd-item" onClick={() => { setDropdownOpen(false); navigate(label === "My Orders" ? "/myorders" : "/mywallet"); }}
                    style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "var(--ink)", textAlign: "left", transition: "all 0.15s" }}>
                    <IC size={15} stroke="#f97316" strokeWidth={2} />{label}
                  </button>
                ))}
                <div style={{ height: 1, background: "var(--border)" }} />
                <button className="dd-item" onClick={() => { try { localStorage.clear(); } catch {} window.location.href = "/login"; }}
                  style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#dc2626", textAlign: "left", transition: "all 0.15s" }}>
                  <SignOutIcon size={15} stroke="#dc2626" strokeWidth={2} />Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Cart */}
          <button className="header-btn" onClick={addToCart}
            style={{ display: "flex", alignItems: "center", gap: 6, background: cartFlash ? "var(--orange-pale)" : "transparent", border: "none", borderRadius: 10, cursor: "pointer", padding: "6px 12px", transition: "background 0.2s" }}>
            <span className={cartFlash ? "cart-pop" : ""} style={{ display: "flex" }}>
              <CartIcon size={20} stroke="var(--ink)" strokeWidth={1.8} />
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>Cart</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Section Block ────────────────────────────────────────────────────────────
function Section({ icon: IconComp, label, accent, children }) {
  return (
    <div style={{ marginBottom: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--orange-pale)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <IconComp size={14} stroke="var(--orange)" strokeWidth={2} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-30)" }}>{label}</span>
      </div>
      {children}
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
const Divider = () => <div style={{ height: 1, background: "var(--border)", margin: "24px 0" }} />;

// ─── Main Page ────────────────────────────────────────────────────────────────
const EmiOrderSummaryPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const items   = state?.items   || [];
  const total   = state?.total   ?? 0;
  const emiPlan = state?.emiPlan ?? null;
  const address = state?.address ?? null;

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);

  const handleConfirmEmi = async () => {
    setLoading(true);
    setError('');
    try {
      const orderRes = await placeOrder({
        items: items.map(i => ({ productId: i.productId, productName: i.productName, quantity: i.cartQty })),
      });
      const realOrderId = orderRes.data.orderId;
      const res = await initiateEmiPayment(realOrderId, total, emiPlan.months);
      if (res.data.status === 'SUCCESS') setSuccess(true);
      else setError(res.data.message || 'EMI initiation failed. Please try again.');
    } catch {
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── No plan guard ──
  if (!emiPlan) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div style={{ minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--sans)" }}>
          <Navbar />
          <main style={{ maxWidth: 560, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <AlertCircleIcon size={28} stroke="#dc2626" strokeWidth={1.8} />
            </div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", color: "var(--ink)", marginBottom: 8 }}>No EMI Plan Found</h2>
            <p style={{ color: "var(--ink-60)", fontSize: 14, marginBottom: 24 }}>Please go back and select an EMI plan to continue.</p>
            <button className="primary-btn" onClick={() => navigate(-1)}
              style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", color: "white", border: "none", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)" }}>
              ← Go Back
            </button>
          </main>
        </div>
      </>
    );
  }

  // ── Success screen ──
  if (success) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div style={{ minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--sans)" }}>
          <Navbar />
          <main style={{ maxWidth: 620, margin: "0 auto", padding: "48px 24px 80px" }}>
            <div className="card-animate" style={{ background: "var(--white)", borderRadius: 24, border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
              <div style={{ height: 5, background: "linear-gradient(90deg,#059669,#34d399,#059669)" }} />
              <div style={{ padding: "44px 40px 36px", textAlign: "center" }}>
                {/* Success icon */}
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                  <div style={{ position: "absolute", width: 96, height: 96, borderRadius: "50%", background: "rgba(5,150,105,0.08)", animation: "pulseRing 2.4s ease-in-out infinite" }} />
                  <div style={{ width: 76, height: 76, borderRadius: "50%", background: "linear-gradient(135deg,#059669,#34d399)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 28px rgba(5,150,105,0.35)", zIndex: 1, position: "relative" }}>
                    <CheckCircleIcon size={34} stroke="white" strokeWidth={2.2} />
                  </div>
                </div>

                <h1 style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.025em", marginBottom: 8 }}>EMI Activated!</h1>
                <p style={{ fontSize: 14.5, color: "var(--ink-60)", lineHeight: 1.7, maxWidth: 380, margin: "0 auto 32px" }}>
                  Your EMI of{" "}
                  <strong style={{ color: "var(--orange)", fontWeight: 700 }}>₹{emiPlan.emiPerMonth.toLocaleString()}/month</strong>
                  {" "}for{" "}
                  <strong style={{ color: "var(--ink)", fontWeight: 700 }}>{emiPlan.months} months</strong>
                  {" "}has been set up successfully.
                </p>

                {/* Schedule */}
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", marginBottom: 28, textAlign: "left" }}>
                  <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
                    <CalendarIcon size={14} stroke="var(--orange)" strokeWidth={2} />
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-30)" }}>Payment Schedule</span>
                  </div>
                  <div style={{ maxHeight: 260, overflowY: "auto" }}>
                    {emiPlan.schedule.map((date, i) => (
                      <div key={i} className="schedule-row" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", borderBottom: i < emiPlan.schedule.length - 1 ? "1px solid var(--border)" : "none" }}>
                        <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--orange-pale)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: 10, fontWeight: 800, color: "var(--orange)" }}>{i + 1}</span>
                        </div>
                        <span style={{ flex: 1, fontSize: 13, color: "var(--ink-60)" }}>{date}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#d97706", background: "#fef3c7", borderRadius: 4, padding: "2px 7px" }}>PENDING</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>₹{emiPlan.emiPerMonth.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="primary-btn" onClick={() => navigate("/home")}
                  style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", color: "white", border: "none", padding: "14px 36px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--sans)", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 4px 16px rgba(249,115,22,0.35)" }}>
                  <HomeIcon size={16} stroke="white" strokeWidth={2.2} />Back to Home
                </button>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  // ── Summary screen ──
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--sans)" }}>
        <Navbar />

        <main style={{ maxWidth: 720, margin: "0 auto", padding: "36px 24px 80px" }}>

          {/* Breadcrumb steps */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 28 }}>
            {["Cart", "Address", "EMI Summary"].map((step, i, arr) => (
              <React.Fragment key={step}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: i === 2 ? "linear-gradient(135deg,#f97316,#ea580c)" : "var(--orange-pale)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: i === 2 ? "0 2px 8px rgba(249,115,22,0.35)" : "none",
                  }}>
                    <span style={{ fontSize: 9, fontWeight: 800, color: i === 2 ? "white" : "var(--orange)" }}>{i + 1}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: i === 2 ? 700 : 500, color: i === 2 ? "var(--orange)" : "var(--ink-60)" }}>{step}</span>
                </div>
                {i < arr.length - 1 && <ChevronRight size={14} stroke="var(--ink-30)" strokeWidth={2} />}
              </React.Fragment>
            ))}
          </div>

          {/* Main card */}
          <div className="card-animate" style={{ background: "var(--white)", borderRadius: 24, border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
            <div style={{ height: 5, background: "linear-gradient(90deg,#f97316,#ea580c,#f97316)" }} />

            <div style={{ padding: "32px 36px" }}>
              {/* Title */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: "linear-gradient(135deg,#f97316,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(249,115,22,0.35)" }}>
                  <ReceiptIcon size={20} stroke="white" strokeWidth={2} />
                </div>
                <div>
                  <h1 style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.02em" }}>EMI Order Summary</h1>
                  <p style={{ fontSize: 12.5, color: "var(--ink-60)", marginTop: 2 }}>Review your plan before confirming</p>
                </div>
              </div>

              {/* Items */}
              <Section icon={PackageIcon} label="Items Ordered">
                <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                  {items.map((item, idx) => (
                    <div key={item.productId} className="item-row" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: idx < items.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--orange-pale)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <ShoppingBagIcon size={16} stroke="var(--orange)" strokeWidth={1.8} />
                      </div>
                      <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: "var(--ink)" }}>{item.productName}</span>
                      <span style={{ fontSize: 12, color: "var(--ink-60)", background: "var(--surface)", borderRadius: 6, padding: "3px 9px", fontWeight: 600 }}>× {item.cartQty}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", minWidth: 80, textAlign: "right" }}>₹{(item.price * item.cartQty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                {/* Total row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px 0" }}>
                  <span style={{ fontSize: 13, color: "var(--ink-60)", fontWeight: 500 }}>Order Total</span>
                  <span style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.02em" }}>₹{total.toLocaleString()}</span>
                </div>
              </Section>

              <Divider />

              {/* EMI Plan */}
              <Section icon={StarIcon} label="EMI Plan Details">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  {[
                    { icon: CalendarIcon,  label: "Tenure",         value: `${emiPlan.months} Months`,                              highlight: false },
                    { icon: WalletIcon,    label: "Monthly EMI",    value: `₹${emiPlan.emiPerMonth.toLocaleString()}`,              highlight: true  },
                    { icon: PercentIcon,   label: "Interest Rate",  value: "12% p.a.",                                              highlight: false },
                    { icon: TrendingUpIcon,label: "Total Payable",  value: `₹${emiPlan.totalPayable.toLocaleString()}`,             highlight: false },
                    { icon: AlertCircleIcon,label:"Total Interest", value: `₹${(emiPlan.totalPayable - total).toLocaleString()}`,   highlight: false, warn: true },
                    { icon: CalendarIcon,  label: "First Payment",  value: emiPlan.schedule?.[0] ?? "—",                           highlight: false },
                  ].map(({ icon: IC, label, value, highlight, warn }, i) => (
                    <div key={i} style={{ background: highlight ? "var(--orange-pale)" : "var(--surface)", border: `1px solid ${highlight ? "#fed7aa" : "var(--border)"}`, borderRadius: 12, padding: "14px 14px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <IC size={12} stroke={highlight ? "var(--orange)" : "var(--ink-30)"} strokeWidth={2} />
                        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-30)" }}>{label}</span>
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 700, color: highlight ? "var(--orange)" : warn ? "#dc2626" : "var(--ink)", letterSpacing: "-0.01em" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Divider />

              {/* Payment Schedule */}
              <Section icon={CalendarIcon} label="Payment Schedule">
                <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                  {/* Header */}
                  <div style={{ display: "grid", gridTemplateColumns: "40px 1fr auto auto", gap: 12, padding: "9px 16px", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
                    {["#", "Due Date", "Status", "Amount"].map(h => (
                      <span key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-30)" }}>{h}</span>
                    ))}
                  </div>
                  <div style={{ maxHeight: 220, overflowY: "auto" }}>
                    {emiPlan.schedule.map((date, i) => (
                      <div key={i} className="schedule-row" style={{ display: "grid", gridTemplateColumns: "40px 1fr auto auto", gap: 12, alignItems: "center", padding: "10px 16px", borderBottom: i < emiPlan.schedule.length - 1 ? "1px solid var(--border)" : "none" }}>
                        <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--orange-pale)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 10, fontWeight: 800, color: "var(--orange)" }}>{i + 1}</span>
                        </div>
                        <span style={{ fontSize: 13, color: "var(--ink-60)" }}>{date}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#d97706", background: "#fef3c7", borderRadius: 5, padding: "3px 8px", whiteSpace: "nowrap" }}>PENDING</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", textAlign: "right" }}>₹{emiPlan.emiPerMonth.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>

              {/* Address */}
              {address && (
                <>
                  <Divider />
                  <Section icon={MapPinIcon} label="Delivery Address">
                    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--orange-pale)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <MapPinIcon size={15} stroke="var(--orange)" strokeWidth={2} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", marginBottom: 3 }}>{address.fullName}</p>
                        <p style={{ fontSize: 13, color: "var(--ink-60)", lineHeight: 1.6 }}>{address.street}, {address.city} — {address.pincode}</p>
                      </div>
                    </div>
                  </Section>
                </>
              )}

              {/* Error */}
              {error && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginTop: 20 }}>
                  <AlertCircleIcon size={16} stroke="#dc2626" strokeWidth={2} />
                  <span style={{ fontSize: 13, color: "#dc2626", fontWeight: 500 }}>{error}</span>
                </div>
              )}

              {/* Confirm CTA */}
              <div style={{ marginTop: 28 }}>
                <button
                  className="primary-btn"
                  onClick={handleConfirmEmi}
                  disabled={loading}
                  style={{
                    width: "100%",
                    background: loading ? "#fdba74" : "linear-gradient(135deg,#f97316,#ea580c)",
                    color: "white", border: "none",
                    padding: "16px 0", borderRadius: 13,
                    fontSize: 15, fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: "var(--sans)",
                    boxShadow: "0 4px 18px rgba(249,115,22,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    transition: "all 0.2s",
                  }}
                >
                  {loading
                    ? (<><LoaderIcon size={18} stroke="white" strokeWidth={2} style={{ animation: "spin 1s linear infinite" }} />Processing…</>)
                    : (<><CheckCircleIcon size={18} stroke="white" strokeWidth={2.2} />Confirm & Activate EMI</>)
                  }
                </button>
                <p style={{ fontSize: 11.5, color: "var(--ink-30)", textAlign: "center", marginTop: 12, lineHeight: 1.7 }}>
                  By confirming you agree to the EMI deduction schedule above. First instalment starts {emiPlan.schedule?.[0]}.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

// ─── Global CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
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
  ::-webkit-scrollbar{width:5px;height:5px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:#e0d9d1;border-radius:3px;}
  .header-btn:hover{background:var(--orange-pale)!important;}
  .dd-item:hover{background:#fff7ed!important;color:#f97316!important;}
  .dd-item:hover svg{stroke:#f97316!important;}
  .cart-pop{animation:cartPop 0.3s ease;}
  .item-row:hover{background:var(--orange-pale);}
  .item-row{transition:background 0.14s;}
  .schedule-row:hover{background:var(--orange-pale);}
  .schedule-row{transition:background 0.14s;}
  .primary-btn:hover:not(:disabled){
    filter:brightness(0.92);
    transform:translateY(-1px);
    box-shadow:0 8px 24px rgba(249,115,22,0.4)!important;
  }
  .primary-btn{transition:all 0.18s;}
  @keyframes cartPop{0%,100%{transform:scale(1);}50%{transform:scale(1.35);}}
  @keyframes pulseRing{0%{transform:scale(0.92);opacity:0.6;}50%{transform:scale(1.08);opacity:0.2;}100%{transform:scale(0.92);opacity:0.6;}}
  @keyframes cardIn{from{opacity:0;transform:translateY(28px) scale(0.97);}to{opacity:1;transform:none;}}
  @keyframes spin{to{transform:rotate(360deg);}}
  .card-animate{animation:cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both;}
`;

export default EmiOrderSummaryPage;
