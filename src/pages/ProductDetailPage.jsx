import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Toast from '../components/Toast';
import { useCart } from '../context/CartContext';

const PLACEHOLDER = 'https://via.placeholder.com/500x500/FFE8DA/FF6B35?text=Product';
const STATIC_DESC = "This is a high-quality product designed for everyday use with durability and premium materials. Crafted with precision and care, it delivers exceptional performance and lasting value.";

const ProductDetailPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = state?.product;
  const [qty, setQty] = useState(1);

  if (!product) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <h2>Product not found</h2>
      <button onClick={() => navigate('/')} style={styles.backBtn}>Go Home</button>
    </div>
  );

  const imgSrc = product.imageUrl
    ? `http://localhost:8087/uploads/${product.imageUrl}`
    : PLACEHOLDER;

  return (
    <div style={{ background: '#FFFAF7', minHeight: '100vh' }}>
      <Header />
      <Toast />
      <main style={styles.main}>
        <button onClick={() => navigate(-1)} style={styles.back}>← Back</button>
        <div style={styles.card}>
          {/* Image */}
          <div style={styles.imgSection}>
            <img
              src={imgSrc} alt={product.productName}
              style={styles.img}
              onError={e => { e.target.src = PLACEHOLDER; }}
            />
            {product.discount > 0 && (
              <div style={styles.discountBadge}>{product.discount}% OFF</div>
            )}
          </div>

          {/* Info */}
          <div style={styles.info}>
            <h1 style={styles.name}>{product.productName}</h1>

            <div style={styles.stars}>
              ★★★★☆ <span style={styles.ratingText}>4.2 (328 ratings)</span>
            </div>

            <div style={styles.priceRow}>
              <span style={styles.price}>₹{product.price?.toLocaleString()}</span>
              {product.discount > 0 && (
                <>
                  <span style={styles.originalPrice}>
                    ₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
                  </span>
                  <span style={styles.discountText}>{product.discount}% off</span>
                </>
              )}
            </div>

            <div style={styles.divider} />

            <p style={styles.descTitle}>Description</p>
            <p style={styles.desc}>{STATIC_DESC}</p>

            <div style={styles.divider} />

            {/* Stock */}
            <p style={styles.stock}>
              {product.quantity > 5
                ? <span style={{ color: '#059669' }}>✅ In Stock ({product.quantity} available)</span>
                : product.quantity > 0
                  ? <span style={{ color: '#D97706' }}>⚠️ Only {product.quantity} left!</span>
                  : <span style={{ color: '#DC2626' }}>❌ Out of Stock</span>
              }
            </p>

            {/* Qty */}
            <div style={styles.qtyRow}>
              <span style={styles.qtyLabel}>Quantity:</span>
              <div style={styles.qtyControl}>
                <button style={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span style={styles.qtyNum}>{qty}</span>
                <button style={styles.qtyBtn} onClick={() => setQty(q => q + 1)}>+</button>
              </div>
            </div>

            {/* Buttons */}
            <div style={styles.btnRow}>
              <button
                style={styles.cartBtn}
                onClick={() => { for (let i = 0; i < qty; i++) addToCart(product); }}
              >
                🛒 Add to Cart
              </button>
              <button
                style={styles.buyBtn}
                onClick={() => navigate('/checkout', { state: { items: [{ ...product, cartQty: qty }] } })}
              >
                ⚡ Buy Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  main: { maxWidth: 1100, margin: '0 auto', padding: '24px 24px 60px' },
  back: {
    background: 'none', border: 'none',
    color: '#FF6B35', fontSize: 15, fontWeight: 600,
    cursor: 'pointer', marginBottom: 20, fontFamily: 'Poppins, sans-serif',
    padding: 0,
  },
  card: {
    background: 'white', borderRadius: 20,
    padding: 40, display: 'flex', gap: 48,
    boxShadow: '0 4px 30px rgba(255,107,53,0.1)',
    border: '1px solid #FFE8DA',
  },
  imgSection: { position: 'relative', flexShrink: 0 },
  img: {
    width: 380, height: 380, objectFit: 'cover',
    borderRadius: 16, background: '#FFF3ED',
  },
  discountBadge: {
    position: 'absolute', top: 14, left: 14,
    background: '#FF6B35', color: 'white',
    fontSize: 13, fontWeight: 700, padding: '5px 12px', borderRadius: 8,
  },
  info: { flex: 1 },
  name: { fontSize: 26, fontWeight: 800, color: '#1A1A2E', marginBottom: 12, lineHeight: 1.3 },
  stars: { color: '#FF6B35', fontSize: 18, marginBottom: 16 },
  ratingText: { fontSize: 14, color: '#6C757D', fontWeight: 400 },
  priceRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 },
  price: { fontSize: 32, fontWeight: 800, color: '#FF6B35' },
  originalPrice: { fontSize: 18, color: '#999', textDecoration: 'line-through' },
  discountText: { background: '#FFF3ED', color: '#FF6B35', padding: '3px 10px', borderRadius: 6, fontSize: 14, fontWeight: 600 },
  divider: { height: 1, background: '#FFE8DA', margin: '20px 0' },
  descTitle: { fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 },
  desc: { fontSize: 15, color: '#555', lineHeight: 1.7 },
  stock: { fontSize: 14, fontWeight: 600, marginBottom: 20 },
  qtyRow: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 },
  qtyLabel: { fontSize: 15, fontWeight: 600, color: '#333' },
  qtyControl: { display: 'flex', alignItems: 'center', gap: 0 },
  qtyBtn: {
    width: 36, height: 36, border: '1.5px solid #FF6B35',
    background: 'white', color: '#FF6B35', fontSize: 20,
    cursor: 'pointer', borderRadius: 8, fontFamily: 'Poppins, sans-serif',
    fontWeight: 700,
  },
  qtyNum: {
    width: 44, textAlign: 'center', fontSize: 16,
    fontWeight: 700, color: '#1A1A2E',
  },
  btnRow: { display: 'flex', gap: 16 },
  cartBtn: {
    flex: 1, background: 'white', color: '#FF6B35',
    border: '2px solid #FF6B35', padding: '14px 0',
    borderRadius: 12, fontSize: 16, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
    transition: 'all 0.2s',
  },
  buyBtn: {
    flex: 1, background: 'linear-gradient(135deg, #FF6B35, #FF8C5A)',
    color: 'white', border: 'none', padding: '14px 0',
    borderRadius: 12, fontSize: 16, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
    boxShadow: '0 4px 15px rgba(255,107,53,0.35)',
  },
  backBtn: {
    background: '#FF6B35', color: 'white', border: 'none',
    padding: '10px 24px', borderRadius: 8, cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  },
};

export default ProductDetailPage;