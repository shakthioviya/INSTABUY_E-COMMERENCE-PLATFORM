import React from 'react';
import { useNavigate } from 'react-router-dom';

const CATS = [
  { key: 'clothing', label: 'Clothing', emoji: '👗', color: '#EDE9FE', border: '#7C3AED' },
  { key: 'electronics', label: 'Electronics', emoji: '📱', color: '#DBEAFE', border: '#2563EB' },
  { key: 'home-decor', label: 'Home Decor', emoji: '🏠', color: '#D1FAE5', border: '#059669' },
  { key: 'furniture', label: 'Furniture', emoji: '🪑', color: '#FEF3C7', border: '#D97706' },
  { key: 'beauty', label: 'Beauty', emoji: '💄', color: '#FCE7F3', border: '#DB2777' },
];

const CategorySection = () => {
  const navigate = useNavigate();
  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>Shop by Category</h2>
      <div style={styles.grid}>
        {CATS.map(c => (
          <div
            key={c.key}
            style={{ ...styles.card, background: c.color, borderColor: c.border + '33' }}
            onClick={() => navigate(`/category/${c.key}`)}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
              e.currentTarget.style.boxShadow = `0 12px 30px ${c.border}33`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)';
            }}
          >
            <div style={styles.emoji}>{c.emoji}</div>
            <p style={{ ...styles.label, color: c.border }}>{c.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const styles = {
  section: { margin: '32px 0' },
  heading: { fontSize: 24, fontWeight: 700, color: '#1A1A2E', marginBottom: 20 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 16,
  },
  card: {
    borderRadius: 16, padding: '28px 16px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    cursor: 'pointer', border: '1.5px solid transparent',
    transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
  },
  emoji: { fontSize: 40, marginBottom: 10 },
  label: { fontSize: 14, fontWeight: 600 },
};

export default CategorySection;