import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { CATEGORY_CONFIG } from '../utils/categoryConfig';

// ── Asset imports ──────────────────────────────────────────────────────────────
import beautyImg    from '../assets/Beauty.png';
import clothingImg  from '../assets/Clothing.png';
import ElectImg     from '../assets/Electronics.png';
import furniImg     from '../assets/Furniture.png';
import hdImg        from '../assets/Homedecor.png';
import all          from '../assets/All.png';

// ── Helpers ───────────────────────────────────────────────────────────────────
function getUserName() {
  try { return localStorage.getItem('username') || 'User'; } catch { return 'User'; }
}

function getCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  } catch { return 0; }
}

const getProductRating = (productId) => (((productId * 7) % 15) / 10 + 3.5);

// ── SVG icon system ───────────────────────────────────────────────────────────
const Icon = ({ size = 20, stroke = 'currentColor', strokeWidth = 1.8, fill = 'none', children, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'block', flexShrink: 0, ...style }}>
    {children}
  </svg>
);

const MenuIcon      = (p) => <Icon {...p}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></Icon>;
const CloseIcon     = (p) => <Icon {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>;
const ChevronDown   = (p) => <Icon {...p}><polyline points="6 9 12 15 18 9"/></Icon>;
const ChevronRight  = (p) => <Icon {...p}><polyline points="9 18 15 12 9 6"/></Icon>;
const CartIcon      = (p) => <Icon {...p}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></Icon>;
const ShoppingBagIcon = (p) => <Icon {...p}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></Icon>;
const OrdersIcon    = (p) => <Icon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></Icon>;
const WalletIcon    = (p) => <Icon {...p}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></Icon>;
const SignOutIcon   = (p) => <Icon {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>;
const CheckIcon     = (p) => <Icon {...p}><polyline points="20 6 9 17 4 12"/></Icon>;
const SlidersIcon   = (p) => <Icon {...p}><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></Icon>;

// ── Categories ────────────────────────────────────────────────────────────────
const categories = [
  { name: 'All',        slug: 'all',         img: all         },
  { name: 'Clothing',   slug: 'clothing',    img: clothingImg },
  { name: 'Electronics',slug: 'electronics', img: ElectImg    },
  { name: 'Beauty',     slug: 'beauty',      img: beautyImg   },
  { name: 'Home Decor', slug: 'home-decor',  img: hdImg       },
  { name: 'Furniture',  slug: 'furniture',   img: furniImg    },
];

const menuItems = {
  Information: [
    { name: 'About Us',      href: '/about'   },
    { name: 'Contact',       href: '/contact' },
    { name: 'FAQs',          href: '/faqs'    },
    { name: 'Help & Support',href: '/help'    },
  ],
  Legal: [
    { name: 'Privacy Policy',        href: '/privacy'  },
    { name: 'Terms & Conditions',    href: '/terms'    },
    { name: 'Refund & Return Policy',href: '/refund'   },
    { name: 'Shipping Policy',       href: '/shipping' },
  ],
};

const dropdownItems = [
  { label: 'My Orders', IconComp: OrdersIcon },
  { label: 'My Wallet', IconComp: WalletIcon },
];
const dropdownRoutes = { 'My Orders': '/myorders', 'My Wallet': '/mywallet' };

// ── Category icon art ─────────────────────────────────────────────────────────
const CategoryArt = ({ categoryName, size = 56 }) => {
  const artMap = {
    clothing: (
      <svg viewBox="0 0 64 64" width={size} height={size} fill="none">
        <defs>
          <linearGradient id="cg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316"/>
            <stop offset="100%" stopColor="#ea580c"/>
          </linearGradient>
          <filter id="cshadow">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#f97316" floodOpacity="0.3"/>
          </filter>
        </defs>
        <rect width="64" height="64" rx="20" fill="url(#cg1)" opacity="0.12"/>
        <g filter="url(#cshadow)">
          <path d="M22 13 L17 24 L26 21 L26 51 L38 51 L38 21 L47 24 L42 13 Q37 19 32 19 Q27 19 22 13Z"
            fill="url(#cg1)"/>
        </g>
        <path d="M32 19 Q29.5 21 27.5 21 L36.5 21 Q34.5 21 32 19Z" fill="white" opacity="0.3"/>
        <line x1="29" y1="28" x2="29" y2="44" stroke="white" strokeWidth="1.2" strokeOpacity="0.25" strokeDasharray="2 2"/>
        <line x1="35" y1="28" x2="35" y2="44" stroke="white" strokeWidth="1.2" strokeOpacity="0.25" strokeDasharray="2 2"/>
      </svg>
    ),
    electronics: (
      <svg viewBox="0 0 64 64" width={size} height={size} fill="none">
        <defs>
          <linearGradient id="eg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316"/>
            <stop offset="100%" stopColor="#ea580c"/>
          </linearGradient>
          <filter id="eshadow">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#f97316" floodOpacity="0.3"/>
          </filter>
        </defs>
        <rect width="64" height="64" rx="20" fill="url(#eg1)" opacity="0.12"/>
        <g filter="url(#eshadow)">
          <rect x="13" y="17" width="38" height="26" rx="4" fill="url(#eg1)"/>
        </g>
        <rect x="16" y="20" width="32" height="20" rx="2" fill="white" opacity="0.18"/>
        <circle cx="32" cy="30" r="5" fill="white" opacity="0.22"/>
        <circle cx="32" cy="30" r="2.5" fill="white" opacity="0.35"/>
        <rect x="28" y="43" width="8" height="4" rx="1" fill="url(#eg1)" opacity="0.7"/>
        <rect x="22" y="47" width="20" height="2.5" rx="1.25" fill="#ea580c" opacity="0.4"/>
        <line x1="20" y1="26" x2="24" y2="26" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round"/>
        <line x1="40" y1="26" x2="44" y2="26" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round"/>
      </svg>
    ),
    beauty: (
      <svg viewBox="0 0 64 64" width={size} height={size} fill="none">
        <defs>
          <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316"/>
            <stop offset="100%" stopColor="#ea580c"/>
          </linearGradient>
          <filter id="bshadow">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#f97316" floodOpacity="0.3"/>
          </filter>
        </defs>
        <rect width="64" height="64" rx="20" fill="url(#bg1)" opacity="0.12"/>
        <g filter="url(#bshadow)">
          <rect x="27" y="14" width="10" height="8" rx="3" fill="url(#bg1)" opacity="0.7"/>
          <rect x="25" y="20" width="14" height="26" rx="4" fill="url(#bg1)"/>
        </g>
        <rect x="28" y="23" width="8" height="3" rx="1" fill="white" opacity="0.35"/>
        <circle cx="16" cy="20" r="3" fill="#f97316" opacity="0.3"/>
        <circle cx="48" cy="28" r="2" fill="#ea580c" opacity="0.3"/>
        <circle cx="14" cy="36" r="1.5" fill="#f97316" opacity="0.2"/>
        <circle cx="50" cy="42" r="1.5" fill="#ea580c" opacity="0.2"/>
        <path d="M32 13 Q34 11 36 13" stroke="#f97316" strokeWidth="1.2" strokeOpacity="0.5" fill="none"/>
      </svg>
    ),
    'home-decor': (
      <svg viewBox="0 0 64 64" width={size} height={size} fill="none">
        <defs>
          <linearGradient id="hg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316"/>
            <stop offset="100%" stopColor="#ea580c"/>
          </linearGradient>
          <filter id="hshadow">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#f97316" floodOpacity="0.3"/>
          </filter>
        </defs>
        <rect width="64" height="64" rx="20" fill="url(#hg1)" opacity="0.12"/>
        <g filter="url(#hshadow)">
          <path d="M11 32 L32 15 L53 32" fill="url(#hg1)" opacity="0.8"/>
          <rect x="17" y="31" width="30" height="21" rx="2" fill="url(#hg1)"/>
        </g>
        <rect x="26" y="37" width="12" height="15" rx="1.5" fill="white" opacity="0.3"/>
        <rect x="18" y="33" width="9" height="8" rx="1.5" fill="white" opacity="0.25"/>
        <line x1="32" y1="15" x2="32" y2="52" stroke="white" strokeWidth="1" strokeOpacity="0.15"/>
      </svg>
    ),
    furniture: (
      <svg viewBox="0 0 64 64" width={size} height={size} fill="none">
        <defs>
          <linearGradient id="fg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316"/>
            <stop offset="100%" stopColor="#ea580c"/>
          </linearGradient>
          <filter id="fshadow">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#f97316" floodOpacity="0.3"/>
          </filter>
        </defs>
        <rect width="64" height="64" rx="20" fill="url(#fg1)" opacity="0.12"/>
        <g filter="url(#fshadow)">
          <rect x="10" y="24" width="12" height="14" rx="5" fill="url(#fg1)" opacity="0.85"/>
          <rect x="42" y="24" width="12" height="14" rx="5" fill="url(#fg1)" opacity="0.85"/>
          <rect x="10" y="32" width="44" height="12" rx="6" fill="url(#fg1)"/>
        </g>
        <rect x="10" y="32" width="44" height="4" rx="2" fill="white" opacity="0.12"/>
        <rect x="14" y="44" width="5" height="6" rx="1.5" fill="#ea580c" opacity="0.5"/>
        <rect x="45" y="44" width="5" height="6" rx="1.5" fill="#ea580c" opacity="0.5"/>
      </svg>
    ),
  };
  return artMap[categoryName] || <span style={{ fontSize: 40 }}>🛍️</span>;
};

// ── Improved Sidebar ──────────────────────────────────────────────────────────
const ImprovedSidebar = ({ onPriceChange, onAvailabilityChange, onRatingChange }) => {
  const [minPrice, setMinPrice]   = useState(0);
  const [maxPrice, setMaxPrice]   = useState(10000);
  const [inStock, setInStock]     = useState(false);
  const [rating, setRating]       = useState(0);
  const [expanded, setExpanded]   = useState({ price: true, rating: true, availability: true });

  const MAX = 10000;

  const toggle = (section) => setExpanded(e => ({ ...e, [section]: !e[section] }));

  const handleMinChange = (val) => {
    const v = Math.min(Number(val), maxPrice - 100);
    setMinPrice(v);
    onPriceChange(v, maxPrice);
  };
  const handleMaxChange = (val) => {
    const v = Math.max(Number(val), minPrice + 100);
    setMaxPrice(v);
    onPriceChange(minPrice, v);
  };
  const handleStock = (v) => { setInStock(v); onAvailabilityChange(v); };
  const handleRating = (v) => { setRating(v); onRatingChange(v); };

  const resetAll = () => {
    setMinPrice(0); setMaxPrice(MAX); setInStock(false); setRating(0);
    onPriceChange(0, 9999999); onAvailabilityChange(false); onRatingChange(0);
  };

  const pct = (v) => `${(v / MAX) * 100}%`;

  const SectionHeader = ({ title, section }) => (
    <button onClick={() => toggle(section)} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      width: '100%', background: 'none', border: 'none', cursor: 'pointer',
      padding: '0 0 10px', marginBottom: expanded[section] ? 14 : 0,
      borderBottom: expanded[section] ? '1px solid rgba(249,115,22,0.1)' : 'none',
      transition: 'border-color 0.2s',
    }}>
      <span style={{
        fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: '#78716c',
        fontFamily: 'var(--sans)',
      }}>{title}</span>
      <span style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 20, height: 20, borderRadius: 6,
        background: expanded[section] ? 'rgba(249,115,22,0.1)' : 'rgba(0,0,0,0.04)',
        transition: 'all 0.2s',
      }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round">
          {expanded[section]
            ? <><line x1="2" y1="5" x2="8" y2="5"/></>
            : <><line x1="5" y1="2" x2="5" y2="8"/><line x1="2" y1="5" x2="8" y2="5"/></>
          }
        </svg>
      </span>
    </button>
  );

  return (
    <aside style={{
      width: 240, flexShrink: 0,
      background: 'white',
      borderRadius: 18,
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 2px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(249,115,22,0.04)',
      overflow: 'hidden',
      alignSelf: 'flex-start',
      position: 'sticky',
      top: 88,
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 14px',
        background: 'linear-gradient(135deg, #fff7ed 0%, #fef3e2 100%)',
        borderBottom: '1px solid rgba(249,115,22,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: 'linear-gradient(135deg,#f97316,#ea580c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(249,115,22,0.35)',
          }}>
            <SlidersIcon size={14} stroke="white" strokeWidth={2}/>
          </div>
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 13.5, fontWeight: 700,
            color: '#1c1917', letterSpacing: '-0.01em',
          }}>Filters</span>
        </div>
        <button onClick={resetAll} style={{
          fontSize: 10, fontWeight: 700, color: '#f97316',
          background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)',
          borderRadius: 6, padding: '3px 8px', cursor: 'pointer',
          letterSpacing: '0.04em', textTransform: 'uppercase',
          transition: 'all 0.18s', fontFamily: 'var(--sans)',
        }}
          onMouseEnter={e => { e.currentTarget.style.background='#f97316'; e.currentTarget.style.color='white'; }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(249,115,22,0.08)'; e.currentTarget.style.color='#f97316'; }}
        >Reset</button>
      </div>

      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Price Range */}
        <div>
          <SectionHeader title="Price Range" section="price"/>
          {expanded.price && (
            <div>
              {/* Price labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{
                  background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)',
                  borderRadius: 8, padding: '4px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}>
                  <span style={{ fontSize: 9, color: '#a8a29e', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Min</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#f97316', fontFamily: 'var(--sans)' }}>₹{minPrice.toLocaleString()}</span>
                </div>
                <div style={{ alignSelf: 'center', width: 16, height: 1, background: '#e7e5e4' }}/>
                <div style={{
                  background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)',
                  borderRadius: 8, padding: '4px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}>
                  <span style={{ fontSize: 9, color: '#a8a29e', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Max</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#f97316', fontFamily: 'var(--sans)' }}>₹{maxPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Dual range track */}
              <div style={{ position: 'relative', height: 24, marginBottom: 4 }}>
                {/* Track background */}
                <div style={{
                  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                  left: 0, right: 0, height: 4, borderRadius: 2, background: '#f0ebe5',
                }} />
                {/* Active track fill */}
                <div style={{
                  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                  left: pct(minPrice), width: `calc(${pct(maxPrice)} - ${pct(minPrice)})`,
                  height: 4, borderRadius: 2,
                  background: 'linear-gradient(90deg,#f97316,#ea580c)',
                  boxShadow: '0 0 6px rgba(249,115,22,0.4)',
                }} />
                {/* Min thumb */}
                <input type="range" min={0} max={MAX} step={100} value={minPrice}
                  onChange={e => handleMinChange(e.target.value)}
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    opacity: 0, cursor: 'pointer', zIndex: 2, pointerEvents: 'auto',
                  }} />
                {/* Max thumb */}
                <input type="range" min={0} max={MAX} step={100} value={maxPrice}
                  onChange={e => handleMaxChange(e.target.value)}
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    opacity: 0, cursor: 'pointer', zIndex: 3,
                  }} />
                {/* Visual thumb: min */}
                <div style={{
                  position: 'absolute', top: '50%', left: pct(minPrice),
                  transform: 'translate(-50%, -50%)',
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'white', border: '2.5px solid #f97316',
                  boxShadow: '0 2px 8px rgba(249,115,22,0.35)',
                  pointerEvents: 'none', zIndex: 1,
                }} />
                {/* Visual thumb: max */}
                <div style={{
                  position: 'absolute', top: '50%', left: pct(maxPrice),
                  transform: 'translate(-50%, -50%)',
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'white', border: '2.5px solid #ea580c',
                  boxShadow: '0 2px 8px rgba(234,88,12,0.35)',
                  pointerEvents: 'none', zIndex: 1,
                }} />
              </div>

              {/* Range labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, color: '#a8a29e', fontFamily: 'var(--sans)' }}>₹0</span>
                <span style={{ fontSize: 10, color: '#a8a29e', fontFamily: 'var(--sans)' }}>₹10,000</span>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(0,0,0,0.05)', margin: '0 -4px' }} />

        {/* Minimum Rating */}
        <div>
          <SectionHeader title="Minimum Rating" section="rating"/>
          {expanded.rating && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[5, 4, 3, 2].map(r => {
                const active = rating === r;
                return (
                  <button key={r} onClick={() => handleRating(rating === r ? 0 : r)} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 10px', borderRadius: 10, cursor: 'pointer',
                    background: active ? 'rgba(249,115,22,0.08)' : 'transparent',
                    border: active ? '1.5px solid rgba(249,115,22,0.3)' : '1.5px solid transparent',
                    transition: 'all 0.18s', textAlign: 'left', width: '100%',
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 5,
                      border: active ? '2px solid #f97316' : '2px solid #e7e5e4',
                      background: active ? '#f97316' : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.18s',
                    }}>
                      {active && <CheckIcon size={11} stroke="white" strokeWidth={3}/>}
                    </div>
                    {/* Stars */}
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} width="12" height="12" viewBox="0 0 24 24">
                          <polygon
                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                            fill={s <= r ? '#f97316' : '#e7e5e4'}
                            stroke={s <= r ? '#ea580c' : '#e7e5e4'}
                            strokeWidth="1"
                          />
                        </svg>
                      ))}
                    </div>
                    <span style={{
                      fontSize: 11, color: active ? '#f97316' : '#78716c',
                      fontWeight: active ? 700 : 500, fontFamily: 'var(--sans)',
                      transition: 'color 0.18s',
                    }}>& above</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(0,0,0,0.05)', margin: '0 -4px' }} />

        {/* Availability */}
        <div>
          <SectionHeader title="Availability" section="availability"/>
          {expanded.availability && (
            <button onClick={() => handleStock(!inStock)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 10px', borderRadius: 10, cursor: 'pointer',
              background: inStock ? 'rgba(249,115,22,0.08)' : 'transparent',
              border: inStock ? '1.5px solid rgba(249,115,22,0.3)' : '1.5px solid #f0ebe5',
              transition: 'all 0.2s', width: '100%', textAlign: 'left',
            }}>
              {/* Toggle */}
              <div style={{
                width: 34, height: 20, borderRadius: 10, flexShrink: 0,
                background: inStock ? 'linear-gradient(135deg,#f97316,#ea580c)' : '#e7e5e4',
                position: 'relative', transition: 'background 0.25s',
                boxShadow: inStock ? '0 0 10px rgba(249,115,22,0.3)' : 'none',
              }}>
                <div style={{
                  position: 'absolute', top: 3, left: inStock ? 17 : 3,
                  width: 14, height: 14, borderRadius: '50%',
                  background: 'white', transition: 'left 0.25s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }} />
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: inStock ? '#f97316' : '#44403c', fontFamily: 'var(--sans)', transition: 'color 0.18s' }}>
                  In Stock Only
                </div>
                <div style={{ fontSize: 10, color: '#a8a29e', fontFamily: 'var(--sans)', marginTop: 1 }}>
                  Show available items
                </div>
              </div>
            </button>
          )}
        </div>

      </div>
    </aside>
  );
};

// ── Improved Cart Toast / Popup ───────────────────────────────────────────────
const CartToast = ({ toasts }) => (
  <div style={{
    position: 'fixed', bottom: 28, right: 24, zIndex: 9999,
    display: 'flex', flexDirection: 'column', gap: 10,
    pointerEvents: 'none',
  }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        background: 'white',
        borderRadius: 16,
        padding: '14px 18px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.04)',
        display: 'flex', alignItems: 'center', gap: 12,
        minWidth: 280, maxWidth: 340,
        animation: t.exiting ? 'toastOut 0.3s ease forwards' : 'toastIn 0.35s cubic-bezier(0.22,1,0.36,1) forwards',
        borderLeft: '3px solid #f97316',
      }}>
        {/* Icon */}
        <div style={{
          width: 38, height: 38, borderRadius: 12, flexShrink: 0,
          background: 'linear-gradient(135deg,#f97316,#ea580c)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(249,115,22,0.35)',
          animation: 'iconBounce 0.4s cubic-bezier(0.22,1,0.36,1) 0.1s both',
        }}>
          <CheckIcon size={18} stroke="white" strokeWidth={2.8}/>
        </div>
        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: '#1c1917',
            fontFamily: 'var(--sans)', marginBottom: 2, letterSpacing: '-0.01em',
          }}>Added to Cart!</div>
          <div style={{
            fontSize: 11.5, color: '#78716c',
            fontFamily: 'var(--sans)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{t.productName}</div>
        </div>
        {/* Price badge */}
        <div style={{
          background: 'rgba(249,115,22,0.08)',
          border: '1px solid rgba(249,115,22,0.2)',
          borderRadius: 8, padding: '4px 9px', flexShrink: 0,
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#f97316', fontFamily: 'var(--sans)' }}>
            ₹{t.price}
          </span>
        </div>
      </div>
    ))}
  </div>
);

// ── CategoryPage ──────────────────────────────────────────────────────────────
const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate         = useNavigate();
  const config           = CATEGORY_CONFIG[categoryName];
  const userName         = getUserName();

  const [allProducts, setAllProducts] = useState([]);
  const [filtered,    setFiltered]    = useState([]);
  const [loading,     setLoading]     = useState(true);

  const [priceRange,  setPriceRange]  = useState({ min: 0, max: 9999999 });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating,   setMinRating]   = useState(0);

  const [isMenuOpen,         setIsMenuOpen]         = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [cartFlash,          setCartFlash]          = useState(false);
  const [cartCount,          setCartCount]          = useState(getCartCount);
  const [toasts,             setToasts]             = useState([]);

  const dropdownRef = useRef(null);
  let toastIdRef    = useRef(0);

  const activeCategory = (() => {
    const found = categories.find(c => c.slug === categoryName);
    return found ? found.name : 'All';
  })();

  // Refresh cart count from localStorage whenever it might change
  useEffect(() => {
    const refresh = () => setCartCount(getCartCount());
    window.addEventListener('storage', refresh);
    // Poll briefly after add to cart actions
    const interval = setInterval(refresh, 800);
    return () => { window.removeEventListener('storage', refresh); clearInterval(interval); };
  }, []);

  // Expose a global addToCartToast function for ProductCard to call
  useEffect(() => {
    window.__showCartToast = (productName, price) => {
      const id = ++toastIdRef.current;
      setToasts(prev => [...prev, { id, productName, price, exiting: false }]);
      setCartCount(getCartCount());
      setTimeout(() => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 320);
      }, 2800);
    };
    return () => { delete window.__showCartToast; };
  }, []);

  useEffect(() => {
    if (!config) return;
    setLoading(true);
    fetch(`http://localhost:8087/api/product/dealer/${config.dealerId}`)
      .then(r => r.json())
      .then(data => { setAllProducts(data); setFiltered(data); setLoading(false); })
      .catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryName]);

  useEffect(() => {
    let result = allProducts;
    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    if (inStockOnly) result = result.filter(p => p.quantity > 0);
    if (minRating > 0) result = result.filter(p => getProductRating(p.productId) >= minRating);
    setFiltered(result);
  }, [priceRange, inStockOnly, minRating, allProducts]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsUserDropdownOpen(false);
      if (!e.target.closest('.cat-sidebar-menu') && !e.target.closest('.menu-btn')) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const goToCart = () => {
    setCartFlash(true);
    setTimeout(() => { setCartFlash(false); navigate('/cart'); }, 220);
  };

  const handleCategoryClick = (cat) => {
    if (cat.name === 'All') { navigate('/home'); return; }
    navigate(`/category/${cat.slug}`);
  };

  if (!config) return (
    <div style={{ textAlign: 'center', padding: 60, fontFamily: 'var(--sans)', color: 'var(--ink)' }}>
      <h2>Category not found</h2>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
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
        .cat-sidebar-menu::-webkit-scrollbar{display:none;}
        .cat-strip::-webkit-scrollbar{display:none;}
        .dd-item:hover{background:#fff7ed!important;color:#f97316!important;}
        .dd-item:hover svg{stroke:#f97316!important;}
        .sb-link:hover{background:#fff7ed!important;color:#f97316!important;}
        .header-btn:hover{background:var(--orange-pale)!important;}

        @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        @keyframes cartPop{0%,100%{transform:scale(1);}50%{transform:scale(1.35);}}
        @keyframes toastIn{from{opacity:0;transform:translateX(20px) scale(0.95);}to{opacity:1;transform:translateX(0) scale(1);}}
        @keyframes toastOut{from{opacity:1;transform:translateX(0);}to{opacity:0;transform:translateX(20px);}}
        @keyframes iconBounce{0%{transform:scale(0);}60%{transform:scale(1.2);}100%{transform:scale(1);}}
        @keyframes badgePop{0%,100%{transform:scale(1);}40%{transform:scale(1.5);}}
        @keyframes categoryIconPulse{0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,0.35);}50%{box-shadow:0 0 0 8px rgba(249,115,22,0);}}
        @keyframes shimmer{0%{background-position:200% center;}100%{background-position:-200% center;}}

        .fade-up{animation:fadeUp 0.45s ease both;}
        .cart-pop{animation:cartPop 0.3s ease;}
        .product-grid-item{animation:fadeUp 0.4s ease both;}
        .badge-pop{animation:badgePop 0.35s ease;}

        input[type=range]{-webkit-appearance:none;appearance:none;background:transparent;height:100%;width:100%;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:transparent;cursor:pointer;}
        input[type=range]:focus{outline:none;}
      `}</style>

      <div style={{ minHeight: '100vh', background: 'var(--surface)', fontFamily: 'var(--sans)' }}>

        {/* ══════════ HEADER ══════════ */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* Promo bar */}
          <div style={{ background: 'var(--ink)', padding: '6px 1.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.04em' }}>
              Free delivery on orders above ₹499 &nbsp;·&nbsp; Use code&nbsp;
              <strong style={{ color: '#f97316', letterSpacing: '0.06em' }}>FIRST10</strong>
              &nbsp;for 10% off your first order
            </span>
          </div>

          <div style={{ maxWidth: 1340, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', height: 62, gap: '1rem' }}>
            {/* Hamburger + Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <button className="menu-btn" onClick={() => setIsMenuOpen(o => !o)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: 8, display: 'flex', alignItems: 'center', color: 'var(--ink)' }}>
                {isMenuOpen ? <CloseIcon size={20} stroke="var(--ink)" strokeWidth={2.2}/> : <MenuIcon size={20} stroke="var(--ink)" strokeWidth={2.2}/>}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/home')}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(249,115,22,0.35)' }}>
                  <ShoppingBagIcon size={17} stroke="white" strokeWidth={2.3}/>
                </div>
                <span style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.01em' }}>InstaBuy</span>
              </div>
            </div>

            {/* Right side — Profile + Cart with badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0, marginLeft: 'auto' }}>

              {/* User dropdown */}
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button className="header-btn" onClick={() => setIsUserDropdownOpen(o => !o)}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'transparent', border: 'none', borderRadius: 10, cursor: 'pointer', padding: '6px 10px', transition: 'background 0.18s' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{userName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
                    <span style={{ fontSize: 10, color: 'var(--ink-60)', fontWeight: 400 }}>Hello,</span>
                    <span style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 700, maxWidth: 68, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</span>
                  </div>
                  <ChevronDown size={12} stroke="var(--ink-60)" strokeWidth={2.5}/>
                </button>

                {isUserDropdownOpen && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: 'white', border: '1px solid var(--border)', borderRadius: 16, boxShadow: 'var(--shadow-lg)', minWidth: 210, zIndex: 100, overflow: 'hidden' }}>
                    <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--orange-pale)' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{userName}</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-60)' }}>Member</div>
                      </div>
                    </div>
                    <div style={{ height: 1, background: 'var(--border)' }}/>
                    {dropdownItems.map(({ label, IconComp }) => (
                      <button key={label} className="dd-item"
                        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'var(--ink)', textAlign: 'left', transition: 'all 0.15s' }}
                        onClick={() => { setIsUserDropdownOpen(false); navigate(dropdownRoutes[label]); }}>
                        <IconComp size={15} stroke="#f97316" strokeWidth={2}/> {label}
                      </button>
                    ))}
                    <div style={{ height: 1, background: 'var(--border)' }}/>
                    <button className="dd-item"
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#dc2626', textAlign: 'left', transition: 'all 0.15s' }}
                      onClick={() => { try { localStorage.clear(); } catch {} window.location.href = '/login'; }}>
                      <SignOutIcon size={15} stroke="#dc2626" strokeWidth={2}/> Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Cart with badge */}
              <button className="header-btn" onClick={goToCart}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: cartFlash ? 'var(--orange-pale)' : 'transparent', border: 'none', borderRadius: 10, cursor: 'pointer', padding: '6px 12px', transition: 'background 0.2s', position: 'relative' }}>
                <div style={{ position: 'relative', display: 'flex' }}>
                  <span className={cartFlash ? 'cart-pop' : ''} style={{ display: 'flex' }}>
                    <CartIcon size={20} stroke={cartFlash ? '#f97316' : 'var(--ink)'} strokeWidth={1.8}/>
                  </span>
                  {/* Cart count badge */}
                  {cartCount > 0 && (
                    <span key={cartCount} style={{
                      position: 'absolute', top: -7, right: -8,
                      background: 'linear-gradient(135deg,#f97316,#ea580c)',
                      color: 'white', fontSize: 9, fontWeight: 800,
                      width: 17, height: 17, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid white',
                      boxShadow: '0 2px 6px rgba(249,115,22,0.45)',
                      animation: 'badgePop 0.35s ease',
                      fontFamily: 'var(--sans)',
                      lineHeight: 1,
                    }}>
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: cartFlash ? '#f97316' : 'var(--ink)', transition: 'color 0.2s' }}>Cart</span>
              </button>
            </div>
          </div>
        </header>

        {/* ══════════ SLIDE-IN SIDEBAR MENU ══════════ */}
        <div className="cat-sidebar-menu" style={{
          position: 'fixed', top: 0, left: 0, width: 290, height: '100vh',
          background: 'white', borderRight: '1px solid var(--border)',
          boxShadow: '12px 0 40px rgba(0,0,0,0.08)', zIndex: 200,
          transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
          overflowY: 'auto', paddingTop: 72,
          transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.8rem', padding: '12px 14px', background: 'var(--orange-pale)', borderRadius: 12, border: '1px solid #fed7aa' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{userName.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{userName}</div>
                <div style={{ fontSize: 11, color: '#f97316', fontWeight: 600 }}>View Profile →</div>
              </div>
            </div>
            {Object.entries(menuItems).map(([cat, items]) => (
              <div key={cat} style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-30)', marginBottom: 8, paddingLeft: 4 }}>{cat}</p>
                {items.map(item => (
                  <a key={item.name} href={item.href} className="sb-link"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 9, color: 'var(--ink)', textDecoration: 'none', fontSize: 13, fontWeight: 500, transition: 'all 0.15s', marginBottom: 2 }}>
                    {item.name}
                    <ChevronRight size={13} stroke="currentColor" strokeWidth={2.5}/>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        {isMenuOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.28)', zIndex: 199, backdropFilter: 'blur(3px)' }}
            onClick={() => setIsMenuOpen(false)}/>
        )}

        {/* ══════════ CATEGORY STRIP ══════════ */}
        <div style={{ background: 'white', borderBottom: '1px solid var(--border)' }}>
          <div className="cat-strip" style={{
            maxWidth: 1340, margin: '0 auto',
            display: 'flex', overflowX: 'auto',
            justifyContent: 'center',
            padding: '14px 1.5rem 0',
            gap: 0, scrollbarWidth: 'none',
          }}>
            {categories.map(cat => {
              const active = cat.name === activeCategory;
              return (
                <button key={cat.name} onClick={() => handleCategoryClick(cat)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: '4px 16px 14px', background: 'transparent', border: 'none',
                  cursor: 'pointer', position: 'relative', flexShrink: 0, minWidth: 96,
                  color: active ? '#f97316' : 'var(--ink-60)',
                  transition: 'color 0.2s',
                }}>
                  <div style={{
                    width: 76, height: 76, borderRadius: '50%', overflow: 'hidden',
                    border: active ? '2.5px solid #f97316' : '2.5px solid #ede9e3',
                    transform: active ? 'translateY(-3px) scale(1.07)' : 'none',
                    boxShadow: active ? '0 6px 20px rgba(249,115,22,0.28), 0 2px 6px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.24s cubic-bezier(0.22,1,0.36,1)',
                    background: '#f9f6f2',
                  }}>
                    <img src={cat.img} alt={cat.name} style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      objectPosition: cat.name === 'Beauty' ? 'center 25%' : cat.name === 'Clothing' ? 'center 15%' : 'center center',
                      borderRadius: '50%', display: 'block', transition: 'transform 0.24s',
                    }}/>
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: active ? 700 : 500, whiteSpace: 'nowrap', letterSpacing: active ? '0.01em' : 0 }}>{cat.name}</span>
                  {active && (
                    <span style={{
                      position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                      width: 32, height: 3, background: 'linear-gradient(90deg,#f97316,#ea580c)', borderRadius: 2,
                    }}/>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ══════════ MAIN CONTENT ══════════ */}
        <main style={{ maxWidth: 1340, margin: '0 auto', padding: '32px 1.5rem 60px' }}>

          {/* ── Improved Page Title with animated icon ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            {/* Icon with glow ring */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                position: 'absolute', inset: -4,
                borderRadius: 24,
                background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)',
                animation: 'categoryIconPulse 2.5s ease-in-out infinite',
              }}/>
              <div style={{ animation: 'fadeUp 0.5s ease both', position: 'relative' }}>
                <CategoryArt categoryName={categoryName} size={60}/>
              </div>
            </div>

            <div style={{ animation: 'fadeUp 0.5s ease 0.08s both' }}>
              <h1 style={{
                fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 400,
                color: 'var(--ink)', letterSpacing: '-0.025em', lineHeight: 1.1,
              }}>
                {config.label}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: filtered.length > 0 ? 'rgba(249,115,22,0.08)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${filtered.length > 0 ? 'rgba(249,115,22,0.2)' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: 20, padding: '2px 10px',
                  fontSize: 11.5, fontWeight: 700,
                  color: filtered.length > 0 ? '#f97316' : 'var(--ink-30)',
                  fontFamily: 'var(--sans)',
                }}>
                  {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
                </span>
                <span style={{ color: 'var(--ink-30)', fontSize: 12, fontFamily: 'var(--sans)' }}>found</span>
              </div>
            </div>

            {/* Accent line */}
            <div style={{
              flex: 1, height: 1, marginLeft: 8,
              background: 'linear-gradient(90deg, rgba(249,115,22,0.3) 0%, transparent 100%)',
            }}/>
          </div>

          {/* Layout: Sidebar + Grid */}
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <ImprovedSidebar
              onPriceChange={(min, max) => setPriceRange({ min, max })}
              onAvailabilityChange={setInStockOnly}
              onRatingChange={setMinRating}
            />

            <div style={{ flex: 1 }}>
              {loading ? (
                <div style={gridStyle}>
                  {Array(8).fill(0).map((_, i) => <SkeletonCard key={i}/>)}
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ink-60)' }}>
                  <div style={{ fontSize: 60 }}>😔</div>
                  <p style={{ marginTop: 16, fontSize: 15, fontFamily: 'var(--sans)' }}>
                    No products match the selected filters.
                  </p>
                  <button
                    onClick={() => { setPriceRange({ min: 0, max: 9999999 }); setInStockOnly(false); setMinRating(0); }}
                    style={{ marginTop: 18, padding: '10px 24px', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: 'white', border: 'none', borderRadius: 10, fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 14px rgba(249,115,22,0.3)' }}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div style={gridStyle}>
                  {filtered.map((p, i) => (
                    <div key={p.productId} className="product-grid-item" style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }}>
                      <ProductCard product={p} category={categoryName}/>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* ══════════ IMPROVED CART TOAST ══════════ */}
        <CartToast toasts={toasts}/>

      </div>
    </>
  );
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: 20,
};

export default CategoryPage;
