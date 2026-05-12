import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import CategorySection from '../components/CategorySection';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import Toast from '../components/Toast';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/product/all')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const featured = products.slice(0, 8);

  return (
    <div style={{ background: '#FFFAF7', minHeight: '100vh' }}>
      <Header activeCat="all" />
      <Toast />
      <main style={styles.main}>
        <HeroBanner />
        <CategorySection />

        <section>
          <h2 style={styles.sectionTitle}>✨ Featured Products</h2>
          <div style={styles.grid}>
            {loading
              ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : featured.map(p => <ProductCard key={p.productId} product={p} />)
            }
          </div>
        </section>
      </main>
    </div>
  );
};

const styles = {
  main: { maxWidth: 1300, margin: '0 auto', padding: '0 24px 60px' },
  sectionTitle: { fontSize: 24, fontWeight: 700, color: '#1A1A2E', margin: '32px 0 20px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 20,
  },
};

export default HomePage;