import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ─── Shared Icon Primitive (matches InstaBuyHome) ────────────────────────────
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

// ─── Icon Components ──────────────────────────────────────────────────────────
const ShoppingBagIcon = (p) => (
  <Icon {...p}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </Icon>
);

const CartIcon = (p) => (
  <Icon {...p}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
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

const CheckCircleIcon = (p) => (
  <Icon {...p}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
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

const CreditCardIcon = (p) => (
  <Icon {...p}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </Icon>
);

const ClockIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Icon>
);

const HashIcon = (p) => (
  <Icon {...p}>
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
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

const ArrowRightIcon = (p) => (
  <Icon {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </Icon>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getUserName() {
  try { return localStorage.getItem("username") || "User"; } catch { return "User"; }
}

// ─── Main Component ───────────────────────────────────────────────────────────
const OrderSuccessPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [cartFlash, setCartFlash] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userName = getUserName();

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const addToCart = () => { setCartFlash(true); setTimeout(() => setCartFlash(false), 400); };

  const dropdownItems = [
    { label: "My Orders",  IconComp: OrdersIcon },
    { label: "My Wallet",  IconComp: WalletIcon },
  ];
  const routes = { "My Orders": "/myorders", "My Wallet": "/mywallet" };

  const details = [
    { icon: HashIcon,       label: "Order ID",    value: `#${state?.orderId || 'IB12345678'}`,         accent: false },
    { icon: CreditCardIcon, label: "Amount Paid", value: `₹${state?.total?.toLocaleString() || '0'}`,  accent: false },
    { icon: WalletIcon,     label: "Payment",     value: (state?.method || 'COD').toUpperCase(),        accent: false },
    { icon: TruckIcon,      label: "Delivery",    value: "3 – 5 Business Days",                        accent: true  },
  ];

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
          --green:#059669;
          --green-light:#d1fae5;
        }
        html{scroll-behavior:smooth;}
        body{font-family:var(--sans);background:var(--surface);color:var(--ink);}
        .header-btn:hover{background:var(--orange-pale)!important;}
        .dd-item:hover{background:#fff7ed!important;color:#f97316!important;}
        .dd-item:hover svg{stroke:#f97316!important;}
        .cart-pop{animation:cartPop 0.3s ease;}
        @keyframes cartPop{0%,100%{transform:scale(1);}50%{transform:scale(1.35);}}
        @keyframes popIn{
          from{opacity:0;transform:translateY(32px) scale(0.96);}
          to{opacity:1;transform:translateY(0) scale(1);}
        }
        @keyframes pulseRing{
          0%{transform:scale(0.92);opacity:0.6;}
          50%{transform:scale(1.08);opacity:0.2;}
          100%{transform:scale(0.92);opacity:0.6;}
        }
        @keyframes fadeSlideUp{
          from{opacity:0;transform:translateY(14px);}
          to{opacity:1;transform:translateY(0);}
        }
        .success-card{
          animation: popIn 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .detail-row:not(:last-child){
          border-bottom:1px solid var(--border);
        }
        .detail-row:hover{background:var(--orange-pale);}
        .detail-row{transition:background 0.15s;border-radius:8px;}
        .shop-btn:hover{
          background:linear-gradient(135deg,#ea580c,#c2410c)!important;
          transform:translateY(-1px);
          box-shadow:0 8px 24px rgba(234,88,12,0.4)!important;
        }
        .orders-btn:hover{
          background:var(--orange-pale)!important;
          color:var(--orange)!important;
          border-color:var(--orange)!important;
        }
        .step-item{transition:all 0.18s;}
        .step-item:hover{transform:translateY(-2px);}
      `}</style>

      <div style={{ minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--sans)" }}>

        {/* ══════ NAVBAR ══════ */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}>
          <div style={{
            maxWidth: 1340, margin: "0 auto",
            padding: "0 1.5rem",
            display: "flex", alignItems: "center",
            height: 62, gap: "1rem",
          }}>
            {/* ── Logo ── */}
            <div
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }}
              onClick={() => navigate("/home")}
            >
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

            {/* ── Right: Cart + Profile ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0, marginLeft: "auto" }}>

              {/* Profile dropdown */}
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
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#f97316,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "white", flexShrink: 0 }}>
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
                        style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "var(--ink)", textAlign: "left", transition: "all 0.15s" }}
                        onClick={() => { setIsUserDropdownOpen(false); navigate(routes[label]); }}>
                        <IconComp size={15} stroke="#f97316" strokeWidth={2} />
                        {label}
                      </button>
                    ))}
                    <div style={{ height: 1, background: "var(--border)" }} />
                    <button className="dd-item"
                      style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#dc2626", textAlign: "left", transition: "all 0.15s" }}
                      onClick={() => { try { localStorage.clear(); } catch {} window.location.href = "/login"; }}>
                      <SignOutIcon size={15} stroke="#dc2626" strokeWidth={2} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Cart */}
              <button
                className="header-btn"
                onClick={addToCart}
                style={{ display: "flex", alignItems: "center", gap: 6, background: cartFlash ? "var(--orange-pale)" : "transparent", border: "none", borderRadius: 10, cursor: "pointer", padding: "6px 12px", transition: "background 0.2s" }}
              >
                <span className={cartFlash ? "cart-pop" : ""} style={{ display: "flex" }}>
                  <CartIcon size={20} stroke="var(--ink)" strokeWidth={1.8} />
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>Cart</span>
              </button>
            </div>
          </div>
        </header>

        {/* ══════ MAIN CONTENT ══════ */}
        <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 80px" }}>

          <div
            className="success-card"
            style={{
              background: "var(--white)",
              borderRadius: 24,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden",
            }}
          >
            {/* Top accent bar */}
            <div style={{
              height: 5,
              background: "linear-gradient(90deg,#f97316,#ea580c,#f97316)",
              backgroundSize: "200% 100%",
            }} />

            <div style={{ padding: "40px 40px 36px", textAlign: "center" }}>

              {/* ── Animated Check Icon ── */}
              <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <div style={{
                  position: "absolute",
                  width: 96, height: 96,
                  borderRadius: "50%",
                  background: "rgba(5,150,105,0.1)",
                  animation: "pulseRing 2.4s ease-in-out infinite",
                }} />
                <div style={{
                  width: 76, height: 76, borderRadius: "50%",
                  background: "linear-gradient(135deg,#059669,#34d399)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 28px rgba(5,150,105,0.35)",
                  position: "relative", zIndex: 1,
                }}>
                  <CheckCircleIcon size={36} stroke="white" strokeWidth={2.2} fill="none" />
                </div>
              </div>

              {/* Heading */}
              <h1 style={{
                fontFamily: "var(--serif)",
                fontSize: "2rem",
                fontWeight: 400,
                color: "var(--ink)",
                letterSpacing: "-0.025em",
                marginBottom: 8,
                lineHeight: 1.2,
              }}>
                Order Confirmed!
              </h1>
              <p style={{ fontSize: 14.5, color: "var(--ink-60)", lineHeight: 1.6, maxWidth: 340, margin: "0 auto 32px" }}>
                Thanks for shopping with InstaBuy, <strong style={{ color: "var(--ink)", fontWeight: 600 }}>{userName}</strong>. Your order is on its way.
              </p>

              {/* ── Order Details Grid ── */}
              <div style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                overflow: "hidden",
                marginBottom: 28,
                textAlign: "left",
              }}>
                {details.map(({ icon: IconComp, label, value, accent }, i) => (
                  <div
                    key={i}
                    className="detail-row"
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px" }}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                      background: accent ? "var(--green-light)" : "var(--orange-pale)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <IconComp size={16} stroke={accent ? "var(--green)" : "var(--orange)"} strokeWidth={2} />
                    </div>
                    <span style={{ fontSize: 13, color: "var(--ink-60)", flex: 1, fontWeight: 400 }}>{label}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: accent ? "var(--green)" : "var(--ink)", letterSpacing: "0.01em" }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* ── Tracking Steps ── */}
              <div style={{ marginBottom: 32 }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-30)", marginBottom: 14 }}>
                  Order Progress
                </p>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
                  <div style={{ position: "absolute", top: 16, left: "12.5%", right: "12.5%", height: 2, background: "linear-gradient(90deg,var(--orange),#34d399)", zIndex: 0, borderRadius: 1 }} />
                  {[
                    { icon: CheckCircleIcon, label: "Confirmed", done: true  },
                    { icon: PackageIcon,     label: "Packed",    done: false },
                    { icon: TruckIcon,       label: "Shipped",   done: false },
                    { icon: ClockIcon,       label: "Delivered", done: false },
                  ].map(({ icon: StepIcon, label, done }, i) => (
                    <div key={i} className="step-item" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 1, flex: 1 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: done ? "linear-gradient(135deg,#f97316,#ea580c)" : "var(--white)",
                        border: done ? "none" : "2px solid var(--border)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: done ? "0 3px 10px rgba(249,115,22,0.35)" : "none",
                      }}>
                        <StepIcon size={14} stroke={done ? "white" : "var(--ink-30)"} strokeWidth={2} />
                      </div>
                      <span style={{ fontSize: 10.5, fontWeight: done ? 700 : 400, color: done ? "var(--orange)" : "var(--ink-30)", letterSpacing: "0.02em" }}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── CTA Buttons ── */}
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  className="shop-btn"
                  onClick={() => navigate("/home")}
                  style={{
                    background: "linear-gradient(135deg,#f97316,#ea580c)",
                    color: "white", border: "none",
                    padding: "13px 28px", borderRadius: 12,
                    fontSize: 14, fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "var(--sans)",
                    boxShadow: "0 4px 16px rgba(249,115,22,0.35)",
                    display: "flex", alignItems: "center", gap: 8,
                    transition: "all 0.2s",
                  }}
                >
                  <ShoppingBagIcon size={16} stroke="white" strokeWidth={2.2} />
                  Continue Shopping
                </button>
                <button
                  className="orders-btn"
                  onClick={() => navigate("/myorders")}
                  style={{
                    background: "var(--white)",
                    color: "var(--ink)", border: "1.5px solid var(--border)",
                    padding: "13px 24px", borderRadius: 12,
                    fontSize: 14, fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--sans)",
                    display: "flex", alignItems: "center", gap: 8,
                    transition: "all 0.2s",
                  }}
                >
                  <OrdersIcon size={16} stroke="var(--ink-60)" strokeWidth={2} />
                  My Orders
                  <ArrowRightIcon size={14} stroke="var(--ink-30)" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* ── Footer Note ── */}
            <div style={{
              borderTop: "1px solid var(--border)",
              padding: "16px 40px",
              background: "var(--orange-pale)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <TruckIcon size={14} stroke="var(--orange)" strokeWidth={2} />
              <span style={{ fontSize: 12.5, color: "var(--ink-60)", lineHeight: 1.5 }}>
                A confirmation email has been sent to your registered address.
              </span>
            </div>
          </div>

        </main>
      </div>
    </>
  );
};

export default OrderSuccessPage;
