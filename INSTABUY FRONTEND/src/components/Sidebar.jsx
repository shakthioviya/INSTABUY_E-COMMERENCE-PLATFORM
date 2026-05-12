import React, { useState, useCallback } from 'react';

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  orange:     '#f97316',
  orangeDeep: '#ea580c',
  orangePale: '#fff7ed',
  ink:        '#0f0e0d',
  ink60:      'rgba(15,14,13,0.6)',
  ink30:      'rgba(15,14,13,0.3)',
  border:     '#e8e4df',
  surface:    '#faf9f7',
  serif:      "'DM Serif Display', Georgia, serif",
  sans:       "'DM Sans', system-ui, sans-serif",
};

// ── Custom SVG icons ──────────────────────────────────────────────────────────
const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.orange} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

const PriceIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const StarIconSolid = ({ filled, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      fill={filled ? T.orange : T.border}
      stroke="none"
    />
  </svg>
);

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const AvailabilityIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const ResetIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-4.49"/>
  </svg>
);

// ── Section wrapper ───────────────────────────────────────────────────────────
const Section = ({ icon, label, children }) => (
  <div style={{ marginBottom: 0 }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      marginBottom: 14,
    }}>
      {icon}
      <span style={{
        fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '0.1em', color: T.ink60, fontFamily: T.sans,
      }}>{label}</span>
    </div>
    {children}
  </div>
);

// ── Custom range slider ───────────────────────────────────────────────────────
const RangeSlider = ({ value, min, max, onChange, label }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ position: 'relative', marginBottom: 4 }}>
      <span style={{ fontSize: 10, color: T.ink30, fontFamily: T.sans, marginBottom: 6, display: 'block' }}>{label}</span>
      <div style={{ position: 'relative', height: 4, background: T.border, borderRadius: 2 }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${T.orange}, ${T.orangeDeep})`,
          borderRadius: 2,
        }} />
      </div>
      <input
        type="range"
        min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          position: 'absolute', inset: 0, width: '100%',
          opacity: 0, cursor: 'pointer', height: 20, margin: 0,
          top: 12,
        }}
      />
      {/* Thumb visual */}
      <div style={{
        position: 'absolute',
        left: `calc(${pct}% - 9px)`,
        top: 8,
        width: 18, height: 18, borderRadius: '50%',
        background: `linear-gradient(135deg, ${T.orange}, ${T.orangeDeep})`,
        boxShadow: '0 2px 8px rgba(249,115,22,0.45)',
        border: '2.5px solid white',
        pointerEvents: 'none',
        transition: 'left 0s',
        zIndex: 1,
      }} />
    </div>
  );
};

// ── Main Sidebar ──────────────────────────────────────────────────────────────
const Sidebar = ({ onPriceChange, onAvailabilityChange, onRatingChange }) => {
  const MAX_PRICE = 10000;
  const [minVal,    setMinVal]    = useState(0);
  const [maxVal,    setMaxVal]    = useState(MAX_PRICE);
  const [inStock,   setInStock]   = useState(false);
  const [minRating, setMinRating] = useState(0);

  const emit = useCallback((min, max, stock, rating) => {
    onPriceChange?.(min, max);
    onAvailabilityChange?.(stock);
    onRatingChange?.(rating);
  }, [onPriceChange, onAvailabilityChange, onRatingChange]);

  const handleMinChange = (v) => {
    const val = Math.min(v, maxVal - 500);
    setMinVal(val);
    onPriceChange?.(val, maxVal);
  };
  const handleMaxChange = (v) => {
    const val = Math.max(v, minVal + 500);
    setMaxVal(val);
    onPriceChange?.(minVal, val);
  };
  const handleStock = () => {
    const next = !inStock;
    setInStock(next);
    onAvailabilityChange?.(next);
  };
  const handleRating = (r) => {
    const next = minRating === r ? 0 : r;
    setMinRating(next);
    onRatingChange?.(next);
  };
  const handleReset = () => {
    setMinVal(0); setMaxVal(MAX_PRICE);
    setInStock(false); setMinRating(0);
    emit(0, MAX_PRICE, false, 0);
  };

  const ratingOptions = [5, 4, 3, 2];

  return (
    <>
      <style>{`
        .sb-reset:hover{background:var(--orange-pale,#fff7ed)!important;color:#f97316!important;}
        .sb-reset:hover svg{stroke:#f97316!important;}
        .sb-rat-row:hover .sb-rat-pill{background:#fff7ed!important;border-color:#fdba74!important;}
      `}</style>

      <aside style={{
        width: 230,
        flexShrink: 0,
        background: 'white',
        borderRadius: 18,
        border: '1px solid #f0ece6',
        boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
        fontFamily: T.sans,
        overflow: 'hidden',
        position: 'sticky',
        top: 90,
      }}>

        {/* Header */}
        <div style={{
          padding: '16px 18px 14px',
          borderBottom: '1px solid #f5f0ea',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg,#fff7ed 0%,white 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9,
              background: 'linear-gradient(135deg,#f97316,#ea580c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(249,115,22,0.3)',
            }}>
              <FilterIcon />
            </div>
            <span style={{ fontFamily: T.serif, fontSize: '1rem', fontWeight: 400, color: T.ink, letterSpacing: '-0.01em' }}>
              Filters
            </span>
          </div>
          <button
            className="sb-reset"
            onClick={handleReset}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 11, fontWeight: 600, color: T.ink60,
              background: 'transparent', border: '1px solid #ede9e3',
              borderRadius: 7, padding: '4px 9px', cursor: 'pointer',
              fontFamily: T.sans, transition: 'all 0.18s',
            }}>
            <ResetIcon /> Reset
          </button>
        </div>

        <div style={{ padding: '18px 18px', display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* ── Price Range ── */}
          <Section icon={<PriceIcon />} label="Price Range">
            {/* Display pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <div style={{
                flex: 1, textAlign: 'center', padding: '6px 8px',
                background: T.surface, borderRadius: 9,
                border: '1.5px solid #f0ece6',
              }}>
                <span style={{ fontSize: 10, color: T.ink30, display: 'block', marginBottom: 1 }}>Min</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.ink, fontFamily: T.serif }}>
                  ₹{minVal.toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ width: 16, height: 1.5, background: T.border, borderRadius: 1 }} />
              <div style={{
                flex: 1, textAlign: 'center', padding: '6px 8px',
                background: T.surface, borderRadius: 9,
                border: '1.5px solid #f0ece6',
              }}>
                <span style={{ fontSize: 10, color: T.ink30, display: 'block', marginBottom: 1 }}>Max</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.ink, fontFamily: T.serif }}>
                  ₹{maxVal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Track with both thumbs */}
            <div style={{ position: 'relative', height: 34, marginBottom: 4 }}>
              {/* Track */}
              <div style={{ position: 'absolute', top: 8, left: 0, right: 0, height: 4, background: T.border, borderRadius: 2 }}>
                <div style={{
                  position: 'absolute',
                  left: `${(minVal / MAX_PRICE) * 100}%`,
                  right: `${100 - (maxVal / MAX_PRICE) * 100}%`,
                  top: 0, height: '100%',
                  background: `linear-gradient(90deg,${T.orange},${T.orangeDeep})`,
                  borderRadius: 2,
                }} />
              </div>
              {/* Min thumb */}
              <input type="range" min={0} max={MAX_PRICE} step={100} value={minVal}
                onChange={e => handleMinChange(Number(e.target.value))}
                style={{ position: 'absolute', width: '100%', height: 20, top: 0, opacity: 0, cursor: 'pointer', zIndex: 3 }} />
              {/* Max thumb */}
              <input type="range" min={0} max={MAX_PRICE} step={100} value={maxVal}
                onChange={e => handleMaxChange(Number(e.target.value))}
                style={{ position: 'absolute', width: '100%', height: 20, top: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
              {/* Visual thumb min */}
              <div style={{
                position: 'absolute',
                left: `calc(${(minVal / MAX_PRICE) * 100}% - 9px)`,
                top: 2, width: 20, height: 20, borderRadius: '50%',
                background: `linear-gradient(135deg,${T.orange},${T.orangeDeep})`,
                border: '2.5px solid white',
                boxShadow: '0 2px 8px rgba(249,115,22,0.4)',
                pointerEvents: 'none', zIndex: 1,
              }} />
              {/* Visual thumb max */}
              <div style={{
                position: 'absolute',
                left: `calc(${(maxVal / MAX_PRICE) * 100}% - 9px)`,
                top: 2, width: 20, height: 20, borderRadius: '50%',
                background: `linear-gradient(135deg,${T.orange},${T.orangeDeep})`,
                border: '2.5px solid white',
                boxShadow: '0 2px 8px rgba(249,115,22,0.4)',
                pointerEvents: 'none', zIndex: 1,
              }} />
            </div>
          </Section>

          {/* ── Divider ── */}
          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#ede9e3,transparent)' }} />

          {/* ── Minimum Rating ── */}
          <Section icon={
            <svg width="15" height="15" viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={T.orange} stroke="none"/>
            </svg>
          } label="Minimum Rating">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ratingOptions.map(r => {
                const active = minRating === r;
                return (
                  <button
                    key={r}
                    className="sb-rat-row"
                    onClick={() => handleRating(r)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      padding: '8px 10px', borderRadius: 10, cursor: 'pointer',
                      border: active ? `1.5px solid ${T.orange}` : '1.5px solid transparent',
                      background: active ? T.orangePale : 'transparent',
                      fontFamily: T.sans, transition: 'all 0.18s',
                      width: '100%',
                    }}>
                    {/* Custom radio */}
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%',
                      border: active ? `2px solid ${T.orange}` : `2px solid ${T.border}`,
                      background: active ? T.orange : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.18s',
                    }}>
                      {active && <CheckIcon />}
                    </div>
                    {/* Stars */}
                    <div style={{ display: 'flex', gap: 2 }}>
                      {Array(5).fill(0).map((_, i) => (
                        <StarIconSolid key={i} filled={i < r} size={13} />
                      ))}
                    </div>
                    <span style={{ fontSize: 11.5, color: T.ink60, fontWeight: 500, marginLeft: 2 }}>
                      & above
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* ── Divider ── */}
          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#ede9e3,transparent)' }} />

          {/* ── Availability ── */}
          <Section icon={<AvailabilityIcon />} label="Availability">
            <button
              onClick={handleStock}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                border: inStock ? `1.5px solid ${T.orange}` : '1.5px solid #ede9e3',
                background: inStock ? T.orangePale : 'white',
                fontFamily: T.sans, width: '100%', transition: 'all 0.2s',
              }}>
              {/* Custom checkbox */}
              <div style={{
                width: 18, height: 18, borderRadius: 5,
                border: inStock ? 'none' : `2px solid ${T.border}`,
                background: inStock ? `linear-gradient(135deg,${T.orange},${T.orangeDeep})` : 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, boxShadow: inStock ? '0 2px 6px rgba(249,115,22,0.35)' : 'none',
                transition: 'all 0.2s',
              }}>
                {inStock && <CheckIcon />}
              </div>
              {/* Icon + label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={inStock ? T.orange : T.ink60} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                <span style={{
                  fontSize: 13, fontWeight: inStock ? 700 : 500,
                  color: inStock ? T.ink : T.ink60,
                  transition: 'all 0.18s',
                }}>In Stock Only</span>
              </div>
            </button>
          </Section>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
