import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function getUserName() {
  try { return localStorage.getItem("username") || "User"; } catch { return "User"; }
}

// ─── SVG Icon System (InstaBuyHome) ──────────────────────────────────────────
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

// Field-level SVG icons
const NameIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="#f97316" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="#f97316" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const AddressIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="#f97316" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const CityIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="#f97316" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22" />
    <rect x="4" y="2" width="16" height="20" rx="1" />
    <rect x="8" y="6" width="3" height="3" />
    <rect x="13" y="6" width="3" height="3" />
    <rect x="8" y="12" width="3" height="3" />
    <rect x="13" y="12" width="3" height="3" />
    <rect x="10" y="18" width="4" height="4" />
  </svg>
);

const PincodeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="#f97316" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="#f97316" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// ─── Address Page ─────────────────────────────────────────────────────────────
const AddressPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const userName = getUserName();

  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', pincode: '' });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isEmi = !!state?.emiPlan;

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

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit number';
    if (!form.address.trim()) e.address = 'Street address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const addressObj = {
      fullName: form.name,
      phone: form.phone,
      street: form.address,
      city: form.city,
      pincode: form.pincode,
    };
    if (isEmi) {
      navigate('/emi-summary', {
        state: { items: state.items, total: state.total, emiPlan: state.emiPlan, address: addressObj },
      });
    } else {
      navigate('/payment', {
        state: {
          items: state?.items || [],
          total: state?.total || 0,
          subtotal: state?.subtotal || 0,
          address: `${form.address}, ${form.city} - ${form.pincode}`,
          discount: state?.discount ?? 0,
          appliedCoupon: state?.appliedCoupon ?? '',
        },
      });
    }
  };

  // Steps config
  const steps = isEmi
    ? ['Cart', 'Address', 'EMI Summary', 'Payment']
    : ['Cart', 'Checkout', 'Address', 'Payment'];
  const activeStep = isEmi ? 1 : 2;

  // Field config
  const fields = [
    { key: 'name',    label: 'Full Name',       placeholder: 'Enter your full name',    IconComp: NameIcon,    half: true },
    { key: 'phone',   label: 'Phone Number',    placeholder: '10-digit mobile number',  IconComp: PhoneIcon,   half: true },
    { key: 'address', label: 'Street Address',  placeholder: 'House no, Street, Area',  IconComp: AddressIcon, half: false },
    { key: 'city',    label: 'City',            placeholder: 'Your city',               IconComp: CityIcon,    half: true },
    { key: 'pincode', label: 'Pincode',         placeholder: '6-digit pincode',         IconComp: PincodeIcon, half: true },
  ];

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
        .ib-input { transition: border-color 0.2s, box-shadow 0.2s; }
        .ib-input:hover { border-color: #fdba74 !important; }
        .ib-input:focus { outline: none; border-color: #f97316 !important; box-shadow: 0 0 0 3px rgba(249,115,22,0.12) !important; }
        .ib-submit-btn { transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s; }
        .ib-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(249,115,22,0.38) !important; }
        .ib-submit-btn:active { transform: translateY(0); opacity: 0.9; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
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
          {/* Announcement bar */}
          <div style={{ background: "var(--ink)", padding: "6px 1.5rem", textAlign: "center" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", letterSpacing: "0.04em" }}>
              🎉 Free delivery on orders above ₹499 &nbsp;·&nbsp; Use code&nbsp;
              <strong style={{ color: "#f97316", letterSpacing: "0.06em" }}>FIRST10</strong>
              &nbsp;for 10% off your first order
            </span>
          </div>

          <div style={{
            maxWidth: 1340, margin: "0 auto", padding: "0 1.5rem",
            display: "flex", alignItems: "center", height: 62, gap: "1rem",
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

            {/* Profile dropdown */}
            <div style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
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
        <main style={{
          maxWidth: 760, margin: "0 auto",
          padding: "40px 24px 80px",
          fontFamily: "var(--sans)",
        }}>

          {/* ── Step Progress ── */}
          <div className="fade-up fade-up-1" style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  color: i < activeStep ? "var(--orange)" : i === activeStep ? "var(--orange)" : "var(--ink-30)",
                  fontWeight: i <= activeStep ? 700 : 500,
                  fontSize: 13, fontFamily: "var(--sans)",
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: i < activeStep
                      ? "linear-gradient(135deg,#f97316,#ea580c)"
                      : i === activeStep
                        ? "linear-gradient(135deg,#f97316,#ea580c)"
                        : "#ece9e4",
                    color: i <= activeStep ? "white" : "var(--ink-30)",
                    fontSize: 11, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: i === activeStep ? "0 0 0 3px rgba(249,115,22,0.2)" : "none",
                  }}>
                    {i < activeStep ? "✓" : i + 1}
                  </div>
                  <span>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    flex: 1, height: 2, margin: "0 10px",
                    background: i < activeStep
                      ? "linear-gradient(90deg,#f97316,#ea580c)"
                      : "var(--border)",
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ── Address Card ── */}
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
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <h2 style={{
                  fontFamily: "var(--serif)", fontSize: "1.75rem", fontWeight: 400,
                  color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: 4,
                }}>Delivery Address</h2>
                <p style={{ fontSize: 13, color: "var(--ink-60)" }}>
                  Where should we deliver your order?
                </p>
              </div>
              {/* Map pin icon badge */}
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "var(--orange-pale)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="#f97316" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
            </div>

            {/* EMI Badge */}
            {isEmi && (
              <div style={{ padding: "16px 32px 0" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "var(--orange-pale)",
                  border: "1px solid #fed7aa",
                  borderRadius: 10,
                  padding: "12px 16px",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "linear-gradient(135deg,#f97316,#ea580c)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <CalendarIcon />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--ink-60)", fontWeight: 500 }}>Active EMI Plan</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>
                      {state.emiPlan.months} months &nbsp;·&nbsp;
                      ₹{state.emiPlan.emiPerMonth.toLocaleString()}/month &nbsp;·&nbsp;
                      Total ₹{state.emiPlan.totalPayable.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div style={{ padding: "24px 32px 0" }}>
              {/* Name + Phone row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {fields.filter(f => f.half).slice(0, 2).map(({ key, label, placeholder, IconComp }) => (
                  <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{
                      fontSize: 12.5, fontWeight: 600, color: "var(--ink-60)",
                      display: "flex", alignItems: "center", gap: 5,
                    }}>
                      <IconComp />
                      {label}
                    </label>
                    <input
                      className="ib-input"
                      style={{
                        border: `1.5px solid ${errors[key] ? "#dc2626" : focused === key ? "#f97316" : "var(--border)"}`,
                        borderRadius: 10, padding: "12px 14px",
                        fontSize: 14, fontFamily: "var(--sans)",
                        background: "var(--white)", color: "var(--ink)",
                        boxShadow: focused === key ? "0 0 0 3px rgba(249,115,22,0.12)" : "none",
                      }}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      onFocus={() => setFocused(key)}
                      onBlur={() => setFocused(null)}
                    />
                    {errors[key] && (
                      <span style={{ fontSize: 11.5, color: "#dc2626", fontWeight: 500 }}>
                        ⚠ {errors[key]}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Street Address full-width */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                <label style={{
                  fontSize: 12.5, fontWeight: 600, color: "var(--ink-60)",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <AddressIcon />
                  Street Address
                </label>
                <input
                  className="ib-input"
                  style={{
                    border: `1.5px solid ${errors.address ? "#dc2626" : focused === "address" ? "#f97316" : "var(--border)"}`,
                    borderRadius: 10, padding: "12px 14px",
                    fontSize: 14, fontFamily: "var(--sans)",
                    background: "var(--white)", color: "var(--ink)",
                    boxShadow: focused === "address" ? "0 0 0 3px rgba(249,115,22,0.12)" : "none",
                  }}
                  placeholder="House no, Street, Area, Landmark"
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  onFocus={() => setFocused("address")}
                  onBlur={() => setFocused(null)}
                />
                {errors.address && (
                  <span style={{ fontSize: 11.5, color: "#dc2626", fontWeight: 500 }}>⚠ {errors.address}</span>
                )}
              </div>

              {/* City + Pincode row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 8 }}>
                {[
                  { key: "city", label: "City", placeholder: "Your city", IconComp: CityIcon },
                  { key: "pincode", label: "Pincode", placeholder: "6-digit pincode", IconComp: PincodeIcon },
                ].map(({ key, label, placeholder, IconComp }) => (
                  <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{
                      fontSize: 12.5, fontWeight: 600, color: "var(--ink-60)",
                      display: "flex", alignItems: "center", gap: 5,
                    }}>
                      <IconComp />
                      {label}
                    </label>
                    <input
                      className="ib-input"
                      style={{
                        border: `1.5px solid ${errors[key] ? "#dc2626" : focused === key ? "#f97316" : "var(--border)"}`,
                        borderRadius: 10, padding: "12px 14px",
                        fontSize: 14, fontFamily: "var(--sans)",
                        background: "var(--white)", color: "var(--ink)",
                        boxShadow: focused === key ? "0 0 0 3px rgba(249,115,22,0.12)" : "none",
                      }}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      onFocus={() => setFocused(key)}
                      onBlur={() => setFocused(null)}
                    />
                    {errors[key] && (
                      <span style={{ fontSize: 11.5, color: "#dc2626", fontWeight: 500 }}>⚠ {errors[key]}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, var(--border), transparent)",
              margin: "24px 32px 0",
            }} />

            {/* CTA */}
            <div style={{ padding: "20px 32px 32px" }}>
              <button
                className="ib-submit-btn"
                onClick={handleSubmit}
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
              >
                {isEmi ? "Continue to EMI Summary →" : "Continue to Payment →"}
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

export default AddressPage;