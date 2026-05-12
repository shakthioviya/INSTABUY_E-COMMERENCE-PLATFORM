import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.productId === product.productId);
      if (exists) {
        return prev.map(i =>
          i.productId === product.productId
            ? { ...i, cartQty: i.cartQty + 1 }
            : i
        );
      }
      return [...prev, { ...product, cartQty: 1 }];
    });
    showToast(`${product.productName} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(i => i.productId !== productId));
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) { removeFromCart(productId); return; }
    setCartItems(prev =>
      prev.map(i => i.productId === productId ? { ...i, cartQty: qty } : i)
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.cartQty, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.cartQty, 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQty,
      clearCart, cartCount, cartTotal, toastMsg
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);