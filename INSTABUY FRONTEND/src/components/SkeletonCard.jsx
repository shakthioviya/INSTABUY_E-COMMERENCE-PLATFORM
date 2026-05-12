import React from 'react';

const SkeletonCard = () => (
  <div style={styles.card}>
    <div style={{...styles.shimmer, height: 200, borderRadius: 10}} />
    <div style={{...styles.shimmer, height: 16, borderRadius: 6, marginTop: 12, width: '80%'}} />
    <div style={{...styles.shimmer, height: 14, borderRadius: 6, marginTop: 8, width: '50%'}} />
    <div style={{...styles.shimmer, height: 36, borderRadius: 8, marginTop: 12}} />
    <style>{`
      @keyframes shimmer {
        0% { background-position: -400px 0; }
        100% { background-position: 400px 0; }
      }
    `}</style>
  </div>
);

const styles = {
  card: {
    background: 'white', borderRadius: 14, padding: 16,
    boxShadow: '0 2px 12px rgba(255,107,53,0.08)',
  },
  shimmer: {
    background: 'linear-gradient(90deg, #f0e6df 25%, #ffe8da 50%, #f0e6df 75%)',
    backgroundSize: '800px 100%',
    animation: 'shimmer 1.4s infinite linear',
  },
};

export default SkeletonCard;