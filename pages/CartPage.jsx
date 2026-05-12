import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';// At the top of your file, add this import
import { validateCoupon } from '../config/api';  // adjust path if neededimport

const PLACEHOLDER = 'https://placehold.co/80x80/FFE8DA/FF6B35?text=P';

function getUserName() {
  try { return localStorage.getItem('username') || 'User'; } catch { return 'User'; }
}

const COUPONS = [
  { code: 'FIRST250', title: '\u20b9250 Off for New Users', desc: 'Exclusive for first-time users on orders above \u20b91000', minOrder: 1000, firstUserOnly: true },
];

const getEmiTenures = (amount) => {
  if (amount >= 5000  && amount <= 10000) return [3, 6];
  if (amount > 10000  && amount <= 50000) return [3, 6, 9, 12];
  if (amount > 50000)                     return [3, 6, 9, 12, 18, 24];
  return [];
};

const calcEmi = (principal, months) => {
  const r = 0.12 / 12;
  return Math.ceil((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
};

const getScheduleDates = (months) => {
  const today = new Date();
  return Array.from({ length: months }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() + i + 1, today.getDate());
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  });
};

// ── Shared Icon primitive (same as InstaBuyHome) ──────────────────────────────
const Icon = ({ size = 20, stroke = 'currentColor', strokeWidth = 1.8, fill = 'none', children, style }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block', flexShrink: 0, ...style }}
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

const dropdownItems = [
  { label: 'My Orders', IconComp: OrdersIcon, path: '/myorders' },
  { label: 'My Wallet', IconComp: WalletIcon, path: '/mywallet' },
];

// ── Header — matches InstaBuyHome exactly ─────────────────────────────────────
const CartHeader = () => {
  const navigate  = useNavigate();
  const userName  = getUserName();
  const [ddOpen, setDdOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDdOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.96)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        maxWidth: 1340, margin: '0 auto',
        padding: '0 1.5rem',
        height: 62,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo — identical to InstaBuyHome */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          onClick={() => navigate('/home')}
        >
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg,#f97316,#ea580c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 3px 10px rgba(249,115,22,0.35)',
          }}>
            <ShoppingBagIcon size={17} stroke="white" strokeWidth={2.3} />
          </div>
          <span style={{
            fontFamily: 'var(--serif)',
            fontSize: '1.25rem', fontWeight: 400,
            color: 'var(--ink)', letterSpacing: '-0.01em',
          }}>InstaBuy</span>
        </div>

        {/* Profile — identical pattern to InstaBuyHome */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            className="header-btn"
            onClick={() => setDdOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'transparent', border: 'none',
              borderRadius: 10, cursor: 'pointer',
              padding: '6px 10px', transition: 'background 0.18s',
            }}
          >
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg,#f97316,#ea580c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
              <span style={{ fontSize: 10, color: 'var(--ink-60)', fontWeight: 400 }}>Hello,</span>
              <span style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 700, maxWidth: 68, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</span>
            </div>
            <ChevronDown size={12} stroke="var(--ink-60)" strokeWidth={2.5} />
          </button>

          {ddOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0,
              background: 'white', border: '1px solid var(--border)',
              borderRadius: 16, boxShadow: 'var(--shadow-lg)',
              minWidth: 210, zIndex: 100, overflow: 'hidden',
            }}>
              {/* Dropdown header */}
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--orange-pale)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{userName}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-60)' }}>Member</div>
                </div>
              </div>
              <div style={{ height: 1, background: 'var(--border)' }} />
              {dropdownItems.map(({ label, IconComp, path }) => (
                <button key={label} className="dd-item"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'var(--ink)', textAlign: 'left', transition: 'all 0.15s' }}
                  onClick={() => { setDdOpen(false); navigate(path); }}>
                  <IconComp size={15} stroke="#f97316" strokeWidth={2} />
                  {label}
                </button>
              ))}
              <div style={{ height: 1, background: 'var(--border)' }} />
              <button className="dd-item"
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#dc2626', textAlign: 'left', transition: 'all 0.15s' }}
                onClick={() => { try { localStorage.clear(); } catch {} window.location.href = '/login'; }}>
                <SignOutIcon size={15} stroke="#dc2626" strokeWidth={2} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// ── CartPage ──────────────────────────────────────────────────────────────────
const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();

  const [coupon,         setCoupon]         = useState('');
  const [discount,       setDiscount]       = useState(0);
  const [couponMsg,      setCouponMsg]      = useState('');
  const [appliedCoupon,  setAppliedCoupon]  = useState('');
  const [showCoupons,    setShowCoupons]    = useState(false);
  const [emiOpen,        setEmiOpen]        = useState(false);
  const [selectedMonths, setSelectedMonths] = useState(null);
  const [showSchedule,   setShowSchedule]   = useState(false);

  const shippingCharge = cartTotal < 500 ? 50 : 0;
  const platformFee    = 10;
  const emiTenures     = getEmiTenures(cartTotal);
  const emiEligible    = cartTotal >= 5000;
  const finalTotal     = cartTotal + shippingCharge + platformFee - discount;

  const applyCoupon = async (code) => {
    const c = (code || coupon).trim().toUpperCase();
    if (!c) return;

    // FIRST250 is the only valid coupon — backend enforces first-time-user check.
    // SAVE10 / FLAT100 are not real backend coupons, reject them.
    if (c !== 'FIRST250') {
      setDiscount(0); setCouponMsg('Invalid coupon code'); setAppliedCoupon('');
      setShowCoupons(false);
      return;
    }

    if (cartTotal < 1000) {
      setDiscount(0); setCouponMsg('FIRST250 requires a minimum order of \u20b91000'); setAppliedCoupon('');
      setShowCoupons(false);
      return;
    }

    try {
      const res = await fetch(
        'http://localhost:8083/api/payments/coupons/validate?couponCode=FIRST250',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await res.json();
      if (data.status === 'SUCCESS') {
        setDiscount(250); setCouponMsg('\u20b9250 First User Discount Applied! \ud83c\udf89'); setAppliedCoupon(c);
      } else {
        setDiscount(0); setCouponMsg(data.message || 'This coupon is only for first-time users'); setAppliedCoupon('');
      }
    } catch {
      setCouponMsg('Could not validate coupon. Try again.');
    }
    setShowCoupons(false);
  };

  const removeCoupon = () => {
    setDiscount(0); setCouponMsg(''); setAppliedCoupon(''); setCoupon('');
  };

  const handleProceed = () => {
    if (selectedMonths) {
      navigate('/address', {
        state: {
          items: cartItems, total: finalTotal,
          emiPlan: {
            months: selectedMonths,
            emiPerMonth: calcEmi(finalTotal, selectedMonths),
            totalPayable: calcEmi(finalTotal, selectedMonths) * selectedMonths,
            schedule: getScheduleDates(selectedMonths),
          },
        },
      });
    } else {
      navigate('/checkout', {
        state: {
          items: cartItems,
          total: finalTotal,
          subtotal: cartTotal,
          discount,
          appliedCoupon,
          shippingFee: shippingCharge,
          platformFee,
          emiPlan: null,
        },
      });
    }
  };

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
        ::-webkit-scrollbar{width:6px;height:6px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#e0d9d1;border-radius:3px;}
        .header-btn:hover{background:var(--orange-pale)!important;}
        .dd-item:hover{background:#fff7ed!important;color:#f97316!important;}
        .dd-item:hover svg{stroke:#f97316!important;}
        .cart-item-row:hover{box-shadow:0 6px 24px rgba(0,0,0,0.09)!important;}
        .qty-btn:hover{background:var(--orange)!important;color:white!important;border-color:var(--orange)!important;}
        .remove-btn:hover{background:var(--orange-pale)!important;color:var(--orange)!important;}
        .coupon-card:hover{border-color:var(--orange)!important;background:var(--orange-pale)!important;}
        .checkout-btn:hover{opacity:0.88;transform:translateY(-1px);}
        .checkout-btn{transition:all 0.2s!important;}
        .view-schedule-btn:hover{background:var(--orange)!important;color:white!important;}
        .emi-plan-card:hover{border-color:var(--orange)!important;background:var(--orange-pale)!important;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        .fade-up{animation:fadeUp 0.4s ease both;}
        @keyframes emiSlide{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
        .emi-slide{animation:emiSlide 0.22s ease both;}
      `}</style>

      <div style={{ background: 'var(--surface)', minHeight: '100vh', fontFamily: 'var(--sans)' }}>
        <CartHeader />

        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

          {/* Page title */}
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 400,
            color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '1.8rem',
          }}>
            Your Cart
          </h1>

          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ink-60)' }}>
              <div style={{ fontSize: 72, marginBottom: 16 }}>🛒</div>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', fontWeight: 400, color: 'var(--ink)', marginBottom: 8 }}>Your cart is empty</h2>
              <p style={{ fontSize: 14, color: 'var(--ink-60)', marginBottom: 24 }}>Looks like you haven't added anything yet.</p>
              <button
                style={{
                  background: 'linear-gradient(135deg,#f97316,#ea580c)',
                  color: 'white', border: 'none',
                  padding: '12px 28px', borderRadius: 10,
                  fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', boxShadow: '0 4px 14px rgba(249,115,22,0.35)',
                }}
                onClick={() => navigate('/home')}
              >
                Continue Shopping →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1.8rem', alignItems: 'flex-start' }}>

              {/* ── LEFT: Cart Items ── */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cartItems.map((item, idx) => (
                  <div
                    key={item.productId}
                    className={`cart-item-row fade-up`}
                    style={{
                      background: 'white', borderRadius: 14,
                      padding: '16px 20px',
                      display: 'flex', alignItems: 'center', gap: 16,
                      boxShadow: 'var(--shadow-sm)',
                      border: '1px solid var(--border)',
                      transition: 'box-shadow 0.2s',
                      animationDelay: `${idx * 0.06}s`,
                    }}
                  >
                    <img
                      src={item.imageUrl ? `http://localhost:8087/uploads/${item.imageUrl}` : PLACEHOLDER}
                      alt={item.productName}
                      style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)', flexShrink: 0 }}
                      onError={e => { e.target.src = PLACEHOLDER; }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{item.productName}</p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--orange)' }}>₹{item.price?.toLocaleString('en-IN')}</p>
                    </div>

                    {/* Qty control */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <button
                        className="qty-btn"
                        style={{ width: 30, height: 30, border: '1.5px solid var(--border)', background: 'white', color: 'var(--ink)', borderRadius: 6, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                        onClick={() => updateQty(item.productId, (item.cartQty ?? item.quantity ?? 1) - 1)}
                      >−</button>
                      <span style={{ width: 36, textAlign: 'center', fontWeight: 700, color: 'var(--ink)', fontSize: 14 }}>
                        {item.cartQty ?? item.quantity ?? 1}
                      </span>
                      <button
                        className="qty-btn"
                        style={{ width: 30, height: 30, border: '1.5px solid var(--border)', background: 'white', color: 'var(--ink)', borderRadius: 6, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                        onClick={() => updateQty(item.productId, (item.cartQty ?? item.quantity ?? 1) + 1)}
                      >+</button>
                    </div>

                    <p style={{ fontWeight: 700, minWidth: 80, textAlign: 'right', color: 'var(--ink)', fontSize: 15 }}>
                      ₹{(item.price * (item.cartQty ?? item.quantity ?? 1)).toLocaleString('en-IN')}
                    </p>

                    <button
                      className="remove-btn"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink-60)', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0 }}
                      onClick={() => removeFromCart(item.productId)}
                    >✕</button>
                  </div>
                ))}
              </div>

              {/* ── RIGHT: Order Summary ── */}
              <div style={{
                width: 340, background: 'white',
                borderRadius: 16, padding: '1.5rem',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border)',
                position: 'sticky', top: 78,
              }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--ink)', marginBottom: '1.2rem', letterSpacing: '-0.01em' }}>
                  Order Summary
                </h3>

                {/* Price rows */}
                {[
                  { label: 'Subtotal', value: `₹${cartTotal.toLocaleString('en-IN')}` },
                  { label: 'Shipping', value: shippingCharge === 0 ? <span style={{ color: '#16a34a', fontWeight: 600 }}>FREE</span> : `₹${shippingCharge}` },
                  { label: 'Platform fee', value: `₹${platformFee}` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 10, color: 'var(--ink)' }}>
                    <span style={{ color: 'var(--ink-60)' }}>{label}</span>
                    <span>{value}</span>
                  </div>
                ))}

                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 10 }}>
                    <span style={{ color: 'var(--ink-60)' }}>Discount</span>
                    <span style={{ color: '#16a34a', fontWeight: 600 }}>−₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: '1rem' }}>
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>

                {/* Free shipping info */}
                {shippingCharge > 0 && (
                  <div style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 600, background: 'var(--orange-pale)', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
                    🚚 Add ₹{(500 - cartTotal).toLocaleString('en-IN')} more for FREE delivery
                  </div>
                )}

                {/* ── Coupons ── */}
                <div style={{ marginBottom: '1rem', padding: 14, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>Coupons</span>
                    <button
                      style={{ background: 'none', border: 'none', color: 'var(--orange)', fontWeight: 600, fontSize: 12, cursor: 'pointer', padding: 0 }}
                      onClick={() => setShowCoupons(v => !v)}
                    >
                      {showCoupons ? 'Hide ▲' : 'View all ▼'}
                    </button>
                  </div>

                  {showCoupons && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                      {COUPONS.map(c => {
                        const eligible = cartTotal >= c.minOrder;
                        return (
                          <div
                            key={c.code}
                            className="coupon-card"
                            style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              background: 'white', border: '1.5px dashed var(--border)',
                              borderRadius: 10, padding: '10px 12px', gap: 8,
                              transition: 'all 0.15s', cursor: 'pointer',
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)', letterSpacing: 1 }}>{c.code}</span>
                              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--orange)' }}>{c.title}</span>
                              <span style={{ fontSize: 11, color: 'var(--ink-60)' }}>{c.desc}</span>
                              {!eligible && <span style={{ fontSize: 11, color: '#dc2626', marginTop: 2 }}>Min. order ₹{c.minOrder}</span>}
                            </div>
                            <button
                              disabled={!eligible}
                              style={{
                                border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 700,
                                background: eligible ? 'linear-gradient(135deg,#f97316,#ea580c)' : 'var(--surface)',
                                color: eligible ? 'white' : 'var(--ink-30)',
                                cursor: eligible ? 'pointer' : 'not-allowed',
                              }}
                              onClick={() => eligible && applyCoupon(c.code)}
                            >Apply</button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Manual coupon input */}
                  {!appliedCoupon ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        value={coupon}
                        onChange={e => setCoupon(e.target.value)}
                        placeholder="Enter coupon code"
                        style={{
                          flex: 1, padding: '9px 12px',
                          border: '1.5px solid var(--border)', borderRadius: 8,
                          outline: 'none', fontFamily: 'var(--sans)', fontSize: 13,
                          background: 'white', color: 'var(--ink)',
                          transition: 'border-color 0.15s',
                        }}
                        onFocus={e => e.target.style.borderColor = '#f97316'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                      />
                      <button
                        style={{
                          background: 'var(--ink)', color: 'white', border: 'none',
                          padding: '9px 16px', borderRadius: 8,
                          fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13,
                          cursor: 'pointer', transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f97316'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}
                        onClick={() => applyCoupon()}
                      >Apply</button>
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      background: '#f0fdf4', border: '1px solid #86efac',
                      borderRadius: 8, padding: '8px 12px', fontSize: 13,
                    }}>
                      <span style={{ color: '#166534', fontWeight: 600 }}>✓ {appliedCoupon} applied</span>
                      <button
                        style={{ background: 'none', border: 'none', color: '#dc2626', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}
                        onClick={removeCoupon}
                      >Remove</button>
                    </div>
                  )}

                  {couponMsg && !appliedCoupon && (
                    <p style={{ fontSize: 12, color: '#dc2626', marginTop: 8, fontWeight: 500 }}>{couponMsg}</p>
                  )}
                </div>

                {/* ── EMI Section ── */}
                {emiEligible && (
                  <div style={{
                    border: '1.5px solid var(--border)', borderRadius: 14,
                    overflow: 'hidden', marginBottom: '1rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                    {/* EMI Header toggle */}
                    <div
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '14px 16px',
                        background: emiOpen ? 'var(--orange-pale)' : 'white',
                        cursor: 'pointer',
                        borderBottom: emiOpen ? '1px solid #fed7aa' : 'none',
                        transition: 'background 0.2s',
                      }}
                      onClick={() => setEmiOpen(v => !v)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {/* Card icon */}
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: 'linear-gradient(135deg,#f97316,#ea580c)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(249,115,22,0.3)', flexShrink: 0,
                        }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                            <line x1="1" y1="10" x2="23" y2="10"/>
                          </svg>
                        </div>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0, fontFamily: 'var(--sans)' }}>Pay in EMI</p>
                          <p style={{ fontSize: 11, color: 'var(--orange)', fontWeight: 600, margin: 0 }}>No-cost options available</p>
                        </div>
                      </div>
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform: emiOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>

                    {emiOpen && (
                      <div className="emi-slide" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 0, background: 'white' }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-60)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                          Select a tenure
                        </p>

                        {/* Plan cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                          {emiTenures.map(months => {
                            const emiAmt   = calcEmi(finalTotal, months);
                            const interest = emiAmt * months - finalTotal;
                            const total    = emiAmt * months;
                            const isSel    = selectedMonths === months;
                            return (
                              <div
                                key={months}
                                className="emi-plan-card"
                                style={{
                                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                  borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
                                  transition: 'all 0.18s',
                                  border: isSel ? '2px solid var(--orange)' : '1.5px solid var(--border)',
                                  background: isSel ? 'var(--orange-pale)' : 'white',
                                  boxShadow: isSel ? '0 2px 12px rgba(249,115,22,0.12)' : 'none',
                                }}
                                onClick={() => { setSelectedMonths(months); setShowSchedule(false); }}
                              >
                                {/* Left: radio + label */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                  {/* Custom radio */}
                                  <div style={{
                                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                                    border: `2px solid ${isSel ? 'var(--orange)' : '#d1cdc7'}`,
                                    background: isSel ? 'var(--orange)' : 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.18s',
                                    boxShadow: isSel ? '0 0 0 3px rgba(249,115,22,0.15)' : 'none',
                                  }}>
                                    {isSel && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                                  </div>
                                  <div>
                                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', margin: 0, fontFamily: 'var(--sans)' }}>
                                      {months} Months
                                    </p>
                                    <p style={{ fontSize: 11, color: 'var(--ink-60)', margin: '2px 0 0', fontFamily: 'var(--sans)' }}>
                                      Interest: ₹{interest.toLocaleString('en-IN')} (12% p.a.)
                                    </p>
                                  </div>
                                </div>

                                {/* Right: price */}
                                <div style={{ textAlign: 'right' }}>
                                  <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--orange)', margin: 0, fontFamily: 'var(--sans)' }}>
                                    ₹{emiAmt.toLocaleString('en-IN')}
                                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink-60)' }}>/mo</span>
                                  </p>
                                  <p style={{ fontSize: 11, color: 'var(--ink-60)', margin: '2px 0 0', fontFamily: 'var(--sans)' }}>
                                    Total: ₹{total.toLocaleString('en-IN')}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* View schedule + confirmation */}
                        {selectedMonths && (
                          <>
                            <button
                              className="view-schedule-btn"
                              style={{
                                background: 'white', border: '1.5px solid var(--orange)',
                                color: 'var(--orange)', borderRadius: 10,
                                padding: '9px 14px', fontSize: 13, fontWeight: 600,
                                cursor: 'pointer', width: '100%',
                                fontFamily: 'var(--sans)', transition: 'all 0.18s',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                              }}
                              onClick={() => setShowSchedule(!showSchedule)}
                            >
                              <span>📆</span>
                              {showSchedule ? 'Hide Schedule' : 'View Payment Schedule'}
                            </button>

                            {showSchedule && (
                              <div className="emi-slide" style={{
                                background: 'var(--surface)', borderRadius: 10,
                                border: '1px solid var(--border)',
                                padding: '10px 14px', marginTop: 8,
                                maxHeight: 200, overflowY: 'auto',
                              }}>
                                {/* Table header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: 'var(--ink-30)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, padding: '0 2px' }}>
                                  <span style={{ width: 28 }}>#</span>
                                  <span style={{ flex: 1 }}>Due Date</span>
                                  <span>Amount</span>
                                </div>
                                {getScheduleDates(selectedMonths).map((date, i) => (
                                  <div key={i} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    fontSize: 12, padding: '7px 2px',
                                    borderBottom: i < selectedMonths - 1 ? '1px solid var(--border)' : 'none',
                                  }}>
                                    <span style={{ color: 'var(--orange)', fontWeight: 700, width: 28, fontSize: 11 }}>#{i + 1}</span>
                                    <span style={{ flex: 1, color: 'var(--ink-60)' }}>{date}</span>
                                    <span style={{ fontWeight: 700, color: 'var(--ink)' }}>
                                      ₹{calcEmi(finalTotal, selectedMonths).toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Confirmation pill */}
                            <div style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                              fontSize: 12, color: '#166534', fontWeight: 600,
                              background: '#f0fdf4', border: '1px solid #86efac',
                              borderRadius: 10, padding: '10px 14px', marginTop: 8,
                              fontFamily: 'var(--sans)',
                            }}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              EMI of ₹{calcEmi(finalTotal, selectedMonths).toLocaleString('en-IN')}/month for {selectedMonths} months selected
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Checkout button */}
                <button
                  className="checkout-btn"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg,#f97316,#ea580c)',
                    color: 'white', border: 'none',
                    padding: '14px 0', borderRadius: 12,
                    fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(249,115,22,0.35)',
                    letterSpacing: '0.01em',
                  }}
                  onClick={handleProceed}
                >
                  {selectedMonths
                    ? `Proceed with EMI (${selectedMonths} months) →`
                    : 'Proceed to Checkout →'}
                </button>
              </div>

            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default CartPage;