import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
  { bg: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)', emoji: '📱', title: 'Latest Electronics', sub: 'Up to 40% off on top brands', cta: 'Shop Electronics', cat: 'electronics' },
  { bg: 'linear-gradient(135deg, #FF6B9D 0%, #FF8C5A 100%)', emoji: '💄', title: 'Beauty Essentials', sub: 'Glow up with premium products', cta: 'Shop Beauty', cat: 'beauty' },
  { bg: 'linear-gradient(135deg, #7C3AED 0%, #FF6B35 100%)', emoji: '👗', title: 'Fashion Forward', sub: 'New arrivals every week', cta: 'Shop Clothing', cat: 'clothing' },
  { bg: 'linear-gradient(135deg, #059669 0%, #FFB347 100%)', emoji: '🏠', title: 'Home & Living', sub: 'Transform your space today', cta: 'Shop Decor', cat: 'home-decor' },
  { bg: 'linear-gradient(135deg, #8B6914 0%, #FF6B35 100%)', emoji: '🪑', title: 'Premium Furniture', sub: 'Comfort meets elegance', cta: 'Shop Furniture', cat: 'furniture' },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, []);

  const s = slides[current];

  return (
    <div style={{ ...styles.hero, background: s.bg, transition: 'background 0.7s ease' }}>
      <div style={styles.content}>
        <div style={styles.emoji}>{s.emoji}</div>
        <h1 style={styles.title}>{s.title}</h1>
        <p style={styles.sub}>{s.sub}</p>
        <button
          style={styles.cta}
          onClick={() => navigate(`/category/${s.cat}`)}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        >
          {s.cta} →
        </button>
      </div>

      {/* Dots */}
      <div style={styles.dots}>
        {slides.map((_, i) => (
          <div
            key={i}
            style={{ ...styles.dot, ...(i === current ? styles.dotActive : {}) }}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>

      {/* Decorative circles */}
      <div style={styles.circle1} />
      <div style={styles.circle2} />
    </div>
  );
};

const styles = {
  hero: {
    minHeight: 380, borderRadius: 20,
    margin: '24px 0', padding: '60px 60px',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center', position: 'relative',
    overflow: 'hidden',
  },
  content: { position: 'relative', zIndex: 2 },
  emoji: { fontSize: 64, marginBottom: 16, animation: 'bounce 1s ease infinite alternate' },
  title: { fontSize: 42, fontWeight: 800, color: 'white', marginBottom: 10, lineHeight: 1.2 },
  sub: { fontSize: 18, color: 'rgba(255,255,255,0.85)', marginBottom: 24 },
  cta: {
    background: 'white', color: '#FF6B35',
    border: 'none', padding: '14px 32px',
    borderRadius: 30, fontSize: 16, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s',
  },
  dots: {
    position: 'absolute', bottom: 24, left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex', gap: 8, zIndex: 2,
  },
  dot: {
    width: 8, height: 8, borderRadius: '50%',
    background: 'rgba(255,255,255,0.4)', cursor: 'pointer',
    transition: 'all 0.3s',
  },
  dotActive: {
    background: 'white', width: 24, borderRadius: 4,
  },
  circle1: {
    position: 'absolute', right: -80, top: -80,
    width: 350, height: 350, borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
  },
  circle2: {
    position: 'absolute', right: 60, bottom: -60,
    width: 220, height: 220, borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
  },
};

export default HeroBanner;