import React, { useState, useEffect, useRef } from 'react';

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  orange:     '#f97316',
  orangeDeep: '#ea580c',
  orangePale: '#fff7ed',
  ink:        '#0f0e0d',
  ink60:      'rgba(15,14,13,0.6)',
  ink30:      'rgba(15,14,13,0.3)',
  border:     '#e8e4df',
  serif:      "'DM Serif Display', Georgia, serif",
  sans:       "'DM Sans', system-ui, sans-serif",
};

// ── Cart bag SVG ──────────────────────────────────────────────────────────────
const BagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = () => {
  const [visible,  setVisible]  = useState(false);
  const [leaving,  setLeaving]  = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [lastItem,  setLastItem]  = useState(null);  // { productName, price }
  const timerRef = useRef(null);

  // Count all items in localStorage cart
  const countCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      return cart.reduce((sum, i) => sum + (i.quantity || 1), 0);
    } catch { return 0; }
  };

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => { setVisible(false); setLeaving(false); }, 380);
  };

  useEffect(() => {
    const handler = (e) => {
      const { productName, price } = e.detail || {};
      setLastItem({ productName, price });
      setCartCount(countCart());

      // Reset timer
      clearTimeout(timerRef.current);
      setLeaving(false);
      setVisible(true);

      timerRef.current = setTimeout(() => {
        dismiss();
      }, 4000);
    };

    window.addEventListener('cart-updated', handler);
    return () => {
      window.removeEventListener('cart-updated', handler);
      clearTimeout(timerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { opacity:0; transform:translateX(calc(100% + 24px)); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes toastOut {
          from { opacity:1; transform:translateX(0); }
          to   { opacity:0; transform:translateX(calc(100% + 24px)); }
        }
        @keyframes progressBar {
          from { width: 100%; }
          to   { width: 0%; }
        }
        @keyframes countPop {
          0%   { transform: scale(0.6); }
          60%  { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        .toast-view-btn:hover { background: rgba(255,255,255,0.18) !important; }
        .toast-close:hover    { background: rgba(255,255,255,0.2) !important; }
      `}</style>

      <div style={{
        position: 'fixed',
        bottom: 28,
        right: 24,
        zIndex: 9999,
        fontFamily: T.sans,
        animation: leaving
          ? 'toastOut 0.38s cubic-bezier(0.4,0,1,1) forwards'
          : 'toastIn 0.42s cubic-bezier(0.22,1,0.36,1) forwards',
      }}>
        <div style={{
          width: 340,
          background: 'linear-gradient(135deg, #1a1108 0%, #0f0e0d 100%)',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35), 0 4px 16px rgba(249,115,22,0.15)',
          border: '1px solid rgba(249,115,22,0.15)',
        }}>

          {/* Progress bar at top */}
          <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', position: 'relative' }}>
            <div style={{
              height: '100%',
              background: `linear-gradient(90deg, ${T.orange}, ${T.orangeDeep})`,
              borderRadius: 2,
              animation: 'progressBar 4s linear forwards',
            }} />
          </div>

          <div style={{ padding: '16px 18px 18px' }}>
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>

              {/* Orange bag icon */}
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: `linear-gradient(135deg, ${T.orange}, ${T.orangeDeep})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(249,115,22,0.45)',
              }}>
                <BagIcon />
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 12, fontWeight: 700, color: T.orange,
                  textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3,
                }}>
                  Added to Cart
                </div>
                <div style={{
                  fontSize: 13.5, fontWeight: 600, color: 'white',
                  lineHeight: 1.35, letterSpacing: '-0.01em',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {lastItem?.productName || 'Item added'}
                </div>
                {lastItem?.price && (
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                    ₹{lastItem.price.toLocaleString('en-IN')} per item
                  </div>
                )}
              </div>

              {/* Close */}
              <button
                className="toast-close"
                onClick={dismiss}
                style={{
                  background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer',
                  width: 26, height: 26, borderRadius: 7, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.4)', flexShrink: 0, transition: 'background 0.18s',
                }}>
                <CloseIcon />
              </button>
            </div>

            {/* Cart count + view cart row */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: 14, paddingTop: 12,
              borderTop: '1px solid rgba(255,255,255,0.07)',
            }}>
              {/* Count pill */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.06)', borderRadius: 10,
                padding: '7px 12px',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                  Cart
                </span>
                {/* Animated count */}
                <div style={{
                  minWidth: 22, height: 22, borderRadius: '50%',
                  background: `linear-gradient(135deg,${T.orange},${T.orangeDeep})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: 'white',
                  boxShadow: '0 2px 8px rgba(249,115,22,0.5)',
                  animation: 'countPop 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                  padding: '0 4px',
                }}>
                  {cartCount}
                </div>
              </div>

              {/* View Cart button */}
              <button
                className="toast-view-btn"
                onClick={() => { dismiss(); window.location.href = '/cart'; }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, padding: '7px 14px',
                  color: 'white', fontSize: 12.5, fontWeight: 600,
                  cursor: 'pointer', fontFamily: T.sans, transition: 'background 0.18s',
                  letterSpacing: '0.01em',
                }}>
                View Cart <ArrowIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Toast;
