import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function getUserName() {
  try { return localStorage.getItem("username") || "User"; } catch { return "User"; }
}

// ─── SVG Icon System (from InstaBuyHome) ─────────────────────────────────────
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

// ─── Checkout Page ────────────────────────────────────────────────────────────
const CheckoutPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const items = state?.items || [];
  const userName = getUserName();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const subtotal    = items.reduce((s, i) => s + i.price * i.cartQty, 0);
  const shippingFee = state?.shippingFee  ?? (subtotal < 500 ? 50 : 0);
  const platformFee = state?.platformFee  ?? 10;
  const discount    = state?.discount     ?? 0;
  const appliedCoupon = state?.appliedCoupon ?? '';
  // Use the total passed from CartPage (includes coupon discount).
  // Fall back to recalculating only if state.total is missing.
  const total = state?.total ?? (subtotal + shippingFee + platformFee - discount);

  const dropdownItems = [
    { label: "My Orders",  IconComp: OrdersIcon },
    { label: "My Wallet",  IconComp: WalletIcon },
  ];
  const routes = {
    "My Orders": "/myorders",
    "My Wallet": "/mywallet",
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
          --radius: 14px;
          --shadow-sm: 0 1px 4px rgba(0,0,0,0.06);
          --shadow-md: 0 4px 20px rgba(0,0,0,0.08);
          --shadow-lg: 0 12px 48px rgba(0,0,0,0.12);
        }
        html { scroll-behavior: smooth; }
        body { font-family: var(--sans); background: var(--surface); color: var(--ink); }
        .header-btn:hover { background: var(--orange-pale) !important; }
        .dd-item:hover { background: #fff7ed !important; color: #f97316 !important; }
        .dd-item:hover svg { stroke: #f97316 !important; }
        .ib-item-row { transition: background 0.15s; border-radius: 10px; }
        .ib-item-row:hover { background: var(--orange-pale); }
        .ib-continue-btn { transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s; }
        .ib-continue-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(249,115,22,0.38) !important; }
        .ib-continue-btn:active { transform: translateY(0); opacity: 0.9; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.45s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.12s; }
        .fade-up-3 { animation-delay: 0.20s; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--sans)" }}>

        {/* ══════════ HEADER (InstaBuyHome exact style) ══════════ */}
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
               Free delivery on orders above ₹499 &nbsp;·&nbsp; Use code&nbsp;
              <strong style={{ color: "#f97316", letterSpacing: "0.06em" }}>FIRST10</strong>
              &nbsp;for 10% off your first order
            </span>
          </div>

          <div style={{
            maxWidth: 1340, margin: "0 auto", padding: "0 1.5rem",
            display: "flex", alignItems: "center", height: 62, gap: "1rem",
          }}>
            {/* Left — Logo only */}
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

            {/* Right — Profile icon only */}
            <div style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
              <div style={{ position: "relative" }} ref={dropdownRef}>
                <button
                  className="header-btn"
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
        <main style={{
          maxWidth: 760, margin: "0 auto",
          padding: "40px 24px 80px",
          fontFamily: "var(--sans)",
        }}>

          {/* ── Step Progress ── */}
          <div className="fade-up fade-up-1" style={{
            display: "flex", alignItems: "center", marginBottom: 40,
          }}>
            {['Cart', 'Checkout', 'Address', 'Payment'].map((s, i) => (
              <React.Fragment key={s}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  color: i < 2 ? "var(--orange)" : "var(--ink-30)",
                  fontWeight: i < 2 ? 700 : 500,
                  fontSize: 13,
                  fontFamily: "var(--sans)",
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: i < 2
                      ? "linear-gradient(135deg,#f97316,#ea580c)"
                      : "#ece9e4",
                    color: i < 2 ? "white" : "var(--ink-30)",
                    fontSize: 11, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {i < 2 ? "✓" : i + 1}
                  </div>
                  <span>{s}</span>
                </div>
                {i < 3 && (
                  <div style={{
                    flex: 1, height: 2, margin: "0 10px",
                    background: i < 1
                      ? "linear-gradient(90deg,#f97316,#ea580c)"
                      : "var(--border)",
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ── Order Card ── */}
          <div className="fade-up fade-up-2" style={{
            background: "var(--white)",
            borderRadius: 20,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
          }}>
            {/* Card Header */}
            <div style={{
              padding: "26px 32px 22px",
              borderBottom: "1px solid var(--border)",
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            }}>
              <div>
                <h2 style={{
                  fontFamily: "var(--serif)", fontSize: "1.75rem", fontWeight: 400,
                  color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: 4,
                }}>Order Summary</h2>
                <p style={{ fontSize: 13, color: "var(--ink-60)" }}>
                  {items.length} item{items.length !== 1 ? 's' : ''} in your order
                </p>
              </div>
              <div style={{
                background: "#f0fdf4", color: "#059669",
                border: "1px solid #bbf7d0",
                borderRadius: 20, padding: "6px 14px",
                fontSize: 12, fontWeight: 700,
              }}>
                Ready to Ship
              </div>
            </div>

            {/* Items List */}
            <div style={{ padding: "18px 32px" }}>
              {items.map((item, idx) => (
                <div key={item.productId} className="ib-item-row" style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "12px 10px", marginBottom: 4,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "var(--orange-pale)", color: "var(--orange)",
                    fontSize: 12, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink)" }}>
                      {item.productName}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--ink-60)" }}>
                      ₹{item.price.toLocaleString()} × {item.cartQty}
                    </span>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>
                    ₹{(item.price * item.cartQty).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, var(--border), transparent)",
              margin: "0 32px",
            }} />

            {/* Fee Breakdown */}
            <div style={{ padding: "20px 32px", display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Subtotal",      value: `₹${subtotal.toLocaleString()}`,                          highlight: false,          color: null         },
                { label: "Shipping",      value: shippingFee === 0 ? "FREE" : `₹${shippingFee}`,           highlight: shippingFee === 0, color: null      },
                { label: "Platform Fee",  value: `₹${platformFee}`,                                        highlight: false,          color: null         },
                ...(discount > 0 ? [{ label: `Coupon${appliedCoupon ? ` (${appliedCoupon})` : ''}`, value: `−₹${discount.toLocaleString()}`, highlight: false, color: "#059669" }] : []),
              ].map(({ label, value, highlight, color }) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ fontSize: 13.5, color: "var(--ink-60)" }}>{label}</span>
                  <span style={{
                    fontSize: 13.5, fontWeight: 600,
                    color: color ?? (highlight ? "#059669" : "var(--ink)"),
                  }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, var(--border), transparent)",
              margin: "0 32px",
            }} />

            {/* Total */}
            <div style={{
              padding: "20px 32px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{
                fontFamily: "var(--serif)", fontSize: "1.25rem", fontWeight: 400, color: "var(--ink)",
              }}>Total Payable</span>
              <span style={{
                fontFamily: "var(--serif)", fontSize: "1.6rem", fontWeight: 400, color: "var(--orange)",
                letterSpacing: "-0.02em",
              }}>₹{total.toLocaleString()}</span>
            </div>

            {/* Free shipping nudge */}
            {subtotal < 500 && (
              <div style={{
                margin: "0 32px 20px",
                background: "#fffbeb",
                border: "1px dashed #fcd34d",
                borderRadius: 10,
                padding: "11px 16px",
                fontSize: 13, color: "#92400e",
              }}>
                Add ₹{500 - subtotal} more to unlock <strong>FREE shipping!</strong>
              </div>
            )}

            {/* CTA Button */}
            <div style={{ padding: "4px 32px 32px" }}>
              <button
                className="ib-continue-btn"
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg,#f97316,#ea580c)",
                  color: "white", border: "none",
                  padding: "16px 0", borderRadius: 12,
                  fontSize: 15, fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "var(--sans)",
                  boxShadow: "0 6px 20px rgba(249,115,22,0.35)",
                  letterSpacing: "0.02em",
                }}
                onClick={() => navigate('/address', { state: { items, total, subtotal: state?.subtotal ?? subtotal, discount, appliedCoupon } })}
              >
                Continue to Address &nbsp;→
              </button>
            </div>
          </div>

          {/* ── Trust Badges ── */}
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
                background: "var(--white)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "9px 16px",
                boxShadow: "var(--shadow-sm)",
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: "var(--orange-pale)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
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

export default CheckoutPage;