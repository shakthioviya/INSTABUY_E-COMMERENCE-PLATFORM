import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = ({ activeCat = 'all' }) => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const user = JSON.parse(localStorage.getItem('instabuy_user') || 'null');
  const [menuOpen, setMenuOpen] = useState(false);

  const cats = [
    { key: 'all', label: 'All' },
    { key: 'clothing', label: 'Clothing' },
    { key: 'electronics', label: 'Electronics' },
    { key: 'home-decor', label: 'Home Decor' },
    { key: 'furniture', label: 'Furniture' },
    { key: 'beauty', label: 'Beauty' },
  ];

  return (
    <header style={styles.header}>
      <div style={styles.inner}>

        {/* Logo — exact match to CartPage screenshot */}
        <Link to="/" style={styles.logo}>
          <div style={styles.logoBox}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <span style={styles.logoText}>InstaBuy</span>
        </Link>

        {/* Nav */}
        <nav style={styles.nav}>
          {cats.map(c => (
            <Link
              key={c.key}
              to={c.key === 'all' ? '/home' : `/category/${c.key}`}
              style={{
                ...styles.navLink,
                ...(activeCat === c.key ? styles.navLinkActive : {})
              }}
            >
              {c.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div style={styles.right}>

          {/* Cart */}
          <button onClick={() => navigate('/cart')} style={styles.cartBtn}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2H18L21 7H3L6 2Z" />
              <path d="M3 7H21V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V7Z" />
              <path d="M9 11C9 12.66 10.34 14 12 14C13.66 14 15 12.66 15 11" />
            </svg>
            <span style={styles.cartLabel}>Cart</span>
            {cartCount > 0 && (
              <span style={styles.cartBadge}>{cartCount}</span>
            )}
          </button>

          {/* User chip */}
          {user && (
            <div style={styles.userChip}>
              <span style={styles.userAvatar}>{user.name[0].toUpperCase()}</span>
              <div style={styles.userInfo}>
                <span style={styles.userHello}>Hello,</span>
                <span style={styles.userName}>{user.name}</span>
              </div>
              <span style={styles.chevron}>⌄</span>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    background: '#FFFFFF',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    borderBottom: '1px solid #e8e4df',
  },
  inner: {
    maxWidth: 1340,
    margin: '0 auto',
    padding: '0 24px',
    height: 62,
    display: 'flex',
    alignItems: 'center',
    gap: 24,
  },

  /* Logo */
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoBox: {
    width: 34,
    height: 34,
    background: 'linear-gradient(135deg, #f97316, #ea580c)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 10px rgba(249,115,22,0.35)',
    flexShrink: 0,
  },
  logoText: {
    color: '#0f0e0d',
    fontSize: '1.25rem',
    fontWeight: 400,
    letterSpacing: '-0.01em',
    fontFamily: "'DM Serif Display', Georgia, serif",
  },

  /* Nav */
  nav: {
    display: 'flex',
    gap: 2,
    flex: 1,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  navLink: {
    color: '#6B7280',
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.2s',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
  },
  navLinkActive: {
    background: '#fff7ed',
    color: '#f97316',
    fontWeight: 600,
  },

  /* Right */
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexShrink: 0,
  },

  /* Cart */
  cartBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '6px 10px',
    borderRadius: 8,
    position: 'relative',
  },
  cartLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: '#374151',
    fontFamily: "'DM Sans', sans-serif",
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -4,
    background: '#f97316',
    color: 'white',
    borderRadius: '50%',
    width: 18,
    height: 18,
    fontSize: 10,
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* User chip */
  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    background: 'transparent',
    border: 'none',
    padding: '6px 10px',
    borderRadius: 10,
    cursor: 'pointer',
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f97316, #ea580c)',
    color: 'white',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 12,
    flexShrink: 0,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    lineHeight: 1.2,
  },
  userHello: {
    fontSize: 10,
    color: 'rgba(15,14,13,0.6)',
    fontWeight: 400,
  },
  userName: {
    fontSize: 12,
    color: '#0f0e0d',
    fontWeight: 700,
    maxWidth: 68,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  chevron: {
    fontSize: 12,
    color: 'rgba(15,14,13,0.6)',
  },
};

export default Header;