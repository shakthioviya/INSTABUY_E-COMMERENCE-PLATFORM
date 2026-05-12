import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AddressPage from './pages/AddressPage';
import PaymentPage from './pages/PaymentPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import CardPaymentPage from './pages/CardPaymentPage';
import CardOtpPage from './pages/CardOtpPage';
import UpiPaymentPage from './pages/UpiPaymentPage';
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import InstaBuyHome from "./pages/InstaBuyHome";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQs from "./pages/FAQs";
import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Refund from "./pages/Refund";
import Shipping from "./pages/Shipping";
import EmiOrderSummaryPage from "./pages/EmiOrderSummaryPage";
import MyWallet from "./pages/MyWallet";
import OrdersPage from "./pages/OrdersPage";
import './App.css';


function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/home" element={<InstaBuyHome />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/address" element={<AddressPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/card-payment" element={<CardPaymentPage />} />
          <Route path="/upi-payment" element={<UpiPaymentPage />} />
          <Route path="/otp" element={<CardOtpPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/help" element={<Help />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/emi-summary" element={<EmiOrderSummaryPage />} />
          <Route path="/mywallet" element={<MyWallet/>} />
          <Route path="/myorders" element={<OrdersPage/>} />
          <Route path="/home" element={<InstaBuyHome/>} />
          
          
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;