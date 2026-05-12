import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMinus, FiPlus, FiShoppingBag, FiHeart, FiShare2, FiTruck, FiShield, FiRefreshCw, FiChevronRight } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore.js';
import { fetchProductById, getCategoryFromDealerId } from '../config/api';
import toast from 'react-hot-toast';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`Added ${quantity} item(s) to cart!`, {
        icon: '🛒',
        style: {
          borderRadius: '12px',
          background: '#171717',
          color: '#fff',
        },
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="product-page-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  const category = getCategoryFromDealerId(product.dealerId);
  const images = [product.imageUrl, product.imageUrl, product.imageUrl]; // Placeholder for multiple images

  return (
    <div className="product-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight />
          {category && (
            <>
              <Link to={`/category/${category.slug}`}>{category.name}</Link>
              <FiChevronRight />
            </>
          )}
          <span>{product.name}</span>
        </div>

        <div className="product-layout">
          {/* Images */}
          <motion.div
            className="product-images"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="main-image">
              <img src={images[selectedImage] || '/placeholder.png'} alt={product.name} />
            </div>
            <div className="image-thumbnails">
              {images.map((img, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img || '/placeholder.png'} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            className="product-details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {category && (
              <span className="product-category" style={{ backgroundColor: category.color }}>
                {category.name}
              </span>
            )}
            
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-price-section">
              <span className="price">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="original-price">{formatPrice(product.originalPrice)}</span>
                  <span className="discount">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="product-description">{product.description}</p>

            {/* Quantity */}
            <div className="quantity-section">
              <label>Quantity</label>
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <FiMinus />
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>
                  <FiPlus />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="product-actions">
              <button className="btn btn-primary add-to-cart" onClick={handleAddToCart}>
                <FiShoppingBag /> Add to Cart
              </button>
              <button className="btn btn-secondary wishlist-btn">
                <FiHeart />
              </button>
              <button className="btn btn-secondary share-btn">
                <FiShare2 />
              </button>
            </div>

            {/* Features */}
            <div className="product-features">
              <div className="feature">
                <FiTruck />
                <div>
                  <strong>Free Delivery</strong>
                  <span>On orders above ₹499</span>
                </div>
              </div>
              <div className="feature">
                <FiShield />
                <div>
                  <strong>Secure Payment</strong>
                  <span>100% protected</span>
                </div>
              </div>
              <div className="feature">
                <FiRefreshCw />
                <div>
                  <strong>Easy Returns</strong>
                  <span>7 days return policy</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;