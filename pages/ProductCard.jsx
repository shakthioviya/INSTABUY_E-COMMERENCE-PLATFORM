import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Cart helpers ───────────────────────────────────────────────────────────────
function addToCart(product) {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const idx = cart.findIndex(i => i.productId === product.productId);
    if (idx > -1) {
      cart[idx].quantity = (cart[idx].quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    // Notify other tabs / components
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Cart error', e);
  }
}

function getCartCountForProduct(productId) {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find(i => i.productId === productId);
    return item ? item.quantity || 1 : 0;
  } catch { return 0; }
}

// ── Rating helper ──────────────────────────────────────────────────────────────
const getProductRating = (productId) => (((productId * 7) % 15) / 10 + 3.5);

// ── Star renderer ──────────────────────────────────────────────────────────────
const Stars = ({ rating }) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(s => {
        const filled = s <= full;
        const isHalf = !filled && s === full + 1 && half;
        return (
          <svg key={s} width="13" height="13" viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
            <defs>
              {isHalf && (
                <linearGradient id={`half-${s}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="50%" stopColor="#f97316"/>
                  <stop offset="50%" stopColor="#e7e5e4"/>
                </linearGradient>
              )}
            </defs>
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              fill={filled ? '#f97316' : isHalf ? `url(#half-${s})` : '#e7e5e4'}
              stroke={filled ? '#ea580c' : isHalf ? '#ea580c' : '#d6d3d1'}
              strokeWidth="0.8"
            />
          </svg>
        );
      })}
    </div>
  );
};

// ── Discount calculator ────────────────────────────────────────────────────────
function getOriginalPrice(price, productId) {
  const discounts = [6, 8, 10, 12, 7, 15, 5, 9, 11, 14];
  const pct = discounts[productId % discounts.length];
  return Math.round(price / (1 - pct / 100));
}
function getDiscount(price, productId) {
  const discounts = [6, 8, 10, 12, 7, 15, 5, 9, 11, 14];
  return discounts[productId % discounts.length];
}

// ── ProductCard ────────────────────────────────────────────────────────────────
const ProductCard = ({ product, category }) => {
  const navigate  = useNavigate();
  const rating    = getProductRating(product.productId);
  const origPrice = getOriginalPrice(product.price, product.productId);
  const discount  = getDiscount(product.price, product.productId);
  const inStock   = product.quantity > 0;

  const [adding,    setAdding]    = useState(false);
  const [added,     setAdded]     = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgHover,  setImgHover]  = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!inStock || adding) return;

    setAdding(true);
    addToCart(product);

    // Trigger the global toast in CategoryPage
    if (typeof window.__showCartToast === 'function') {
      window.__showCartToast(product.productName || product.name || 'Product', product.price);
    }

    setTimeout(() => {
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2200);
    }, 380);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.productId}`);
  };

  const reviewCount = 100 + (product.productId % 200);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');

        .pc-card {
          background: #ffffff;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          cursor: pointer;
          transition: transform 0.28s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.28s cubic-bezier(0.22,1,0.36,1);
          position: relative;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .pc-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(249,115,22,0.08);
        }
        .pc-img-wrap {
          position: relative;
          width: 100%;
          padding-top: 115%;
          overflow: hidden;
          background: #f5f0eb;
        }
        .pc-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
          transition: transform 0.45s cubic-bezier(0.22,1,0.36,1),
                      opacity 0.3s ease;
        }
        .pc-card:hover .pc-img {
          transform: scale(1.06);
        }
        .pc-discount-badge {
          position: absolute;
          top: 11px;
          left: 11px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.06em;
          padding: 4px 9px;
          border-radius: 8px;
          box-shadow: 0 3px 10px rgba(249,115,22,0.4);
          text-transform: uppercase;
          z-index: 2;
        }
        .pc-oos-badge {
          position: absolute;
          top: 11px;
          right: 11px;
          background: rgba(15,14,13,0.72);
          backdrop-filter: blur(6px);
          color: rgba(255,255,255,0.85);
          font-family: 'DM Sans', sans-serif;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.06em;
          padding: 4px 9px;
          border-radius: 8px;
          text-transform: uppercase;
          z-index: 2;
        }
        .pc-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 45%);
          opacity: 0;
          transition: opacity 0.28s ease;
          z-index: 1;
        }
        .pc-card:hover .pc-img-overlay {
          opacity: 1;
        }
        .pc-body {
          padding: 14px 15px 15px;
          display: flex;
          flex-direction: column;
          gap: 0;
          flex: 1;
        }
        .pc-name {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 1rem;
          font-weight: 400;
          color: #1c1917;
          letter-spacing: -0.01em;
          line-height: 1.25;
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pc-rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
        }
        .pc-rating-num {
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px;
          font-weight: 700;
          color: #44403c;
          letter-spacing: 0;
        }
        .pc-rating-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: #a8a29e;
          font-weight: 400;
        }
        .pc-price-row {
          display: flex;
          align-items: baseline;
          gap: 7px;
          margin-bottom: 13px;
        }
        .pc-price {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.1rem;
          font-weight: 800;
          color: #f97316;
          letter-spacing: -0.02em;
        }
        .pc-original {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #a8a29e;
          text-decoration: line-through;
          letter-spacing: 0;
        }
        .pc-save-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: #16a34a;
          background: rgba(22,163,74,0.08);
          border: 1px solid rgba(22,163,74,0.18);
          border-radius: 6px;
          padding: 1px 6px;
          letter-spacing: 0.01em;
        }
        .pc-add-btn {
          width: 100%;
          padding: 11px 0;
          border: none;
          border-radius: 11px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.01em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition: all 0.22s cubic-bezier(0.22,1,0.36,1);
          position: relative;
          overflow: hidden;
        }
        .pc-add-btn.idle {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
          box-shadow: 0 4px 14px rgba(249,115,22,0.32);
        }
        .pc-add-btn.idle:hover {
          box-shadow: 0 6px 20px rgba(249,115,22,0.45);
          transform: translateY(-1px);
        }
        .pc-add-btn.idle:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(249,115,22,0.3);
        }
        .pc-add-btn.adding {
          background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
          color: white;
          cursor: wait;
        }
        .pc-add-btn.done {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: white;
          box-shadow: 0 4px 14px rgba(22,163,74,0.32);
        }
        .pc-add-btn.oos {
          background: #f5f0eb;
          color: #a8a29e;
          cursor: not-allowed;
          box-shadow: none;
        }
        .pc-add-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 65%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .pc-add-btn.idle:hover::after {
          opacity: 1;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes checkDraw {
          from { stroke-dashoffset: 30; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

      <div className="pc-card" onClick={handleCardClick}>

        {/* ── Image ── */}
        <div
          className="pc-img-wrap"
          onMouseEnter={() => setImgHover(true)}
          onMouseLeave={() => setImgHover(false)}
        >
          {/* Skeleton shimmer while loading */}
          {!imgLoaded && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, #f5f0eb 25%, #ede9e4 50%, #f5f0eb 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}/>
          )}

          {product.imageUrl ? (
            <img
              className="pc-img"
              src={product.imageUrl}
              alt={product.productName || product.name}
              onLoad={() => setImgLoaded(true)}
              style={{ opacity: imgLoaded ? 1 : 0 }}
            />
          ) : (
            /* Placeholder when no image */
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #fef3e2 0%, #fff7ed 100%)',
              gap: 8,
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#d4956a', fontWeight: 500 }}>No image</span>
            </div>
          )}

          <div className="pc-img-overlay"/>

          {/* Discount badge */}
          {inStock && (
            <div className="pc-discount-badge">{discount}% OFF</div>
          )}

          {/* Out of stock */}
          {!inStock && (
            <div className="pc-oos-badge">Out of Stock</div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="pc-body">

          {/* Name */}
          <div className="pc-name" title={product.productName || product.name}>
            {product.productName || product.name || 'Product'}
          </div>

          {/* Rating */}
          <div className="pc-rating-row">
            <Stars rating={rating}/>
            <span className="pc-rating-num">{rating.toFixed(1)}</span>
            <span className="pc-rating-count">({reviewCount})</span>
          </div>

          {/* Price */}
          <div className="pc-price-row">
            <span className="pc-price">₹{product.price?.toLocaleString('en-IN')}</span>
            <span className="pc-original">₹{origPrice?.toLocaleString('en-IN')}</span>
            <span className="pc-save-tag">Save {discount}%</span>
          </div>

          {/* Add to Cart button */}
          <button
            className={`pc-add-btn ${!inStock ? 'oos' : adding ? 'adding' : added ? 'done' : 'idle'}`}
            onClick={handleAddToCart}
            disabled={!inStock || adding}
          >
            {/* Icon */}
            {!inStock ? (
              /* Notify me icon */
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            ) : adding ? (
              /* Spinner */
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.7s linear infinite' }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            ) : added ? (
              /* Check */
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" strokeDasharray="30" style={{ animation: 'checkDraw 0.3s ease forwards' }}/>
              </svg>
            ) : (
              /* Cart */
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            )}

            {/* Label */}
            <span>
              {!inStock ? 'Notify Me' : adding ? 'Adding…' : added ? 'Added to Cart!' : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
