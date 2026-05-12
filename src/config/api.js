import axios from "axios";

/* =========================
   BASE URLS
========================= */
export const PRODUCT_API = "http://localhost:8087";
export const AUTH_API    = "http://localhost:8084/api/auth";
export const ORDER_API   = "http://localhost:8085/api/orders";
export const PAYMENT_API = "http://localhost:8083/api/payments";


/* =========================
   AXIOS INSTANCE (Auth only)
========================= */
const API = axios.create({ baseURL: AUTH_API });

/* =========================
   JWT INTERCEPTOR — Auth instance only
========================= */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* =========================
   TOKEN EXPIRY — ONLY redirect on auth endpoints, never on payment
========================= */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only wipe token if it's an auth endpoint 401, never payment
    const url = error.config?.url || "";
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      url.includes("/api/auth/")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/* =========================
   HELPER — always reads fresh token
========================= */
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const saveUserId = (id) => localStorage.setItem("userId", String(id));
export const getUserId  = ()  => localStorage.getItem("userId");

/* =========================
   AUTH APIs
========================= */
export const loginUser  = (data) => API.post("/login",    data);
export const signupUser = (data) => API.post("/register", data);

/* =========================
   CATEGORY MAP
========================= */
export const categoryMapping = {
  beauty:       { dealerId: 28, name: "Beauty",      color: "#ec4899", icon: "✨"  },
  furniture:    { dealerId: 29, name: "Furniture",   color: "#8b5cf6", icon: "🛋️" },
  electronics:  { dealerId: 30, name: "Electronics", color: "#06b6d4", icon: "📱"  },
  clothing:     { dealerId: 31, name: "Clothing",    color: "#f97316", icon: "👕"  },
  "home-decor": { dealerId: 32, name: "Home Decor",  color: "#0d9488", icon: "🏠"  },
};

/* =========================
   PRODUCT APIs
========================= */

export const fetchProducts = async () => {
  const res = await axios.get(`${PRODUCT_API}/products`);
  return res.data;
};
export const fetchProductById = async (id) => {
  const res = await axios.get(`${PRODUCT_API}/products/${id}`);
  return res.data;
};
export const fetchProductsByDealer = async (dealerId) => {
  const res = await axios.get(`${PRODUCT_API}/products/dealer/${dealerId}`);
  return res.data;
};
export const getUserProfile = () => API.get("/profile");
export const getCategoryFromDealerId = (dealerId) => {
  for (const [slug, data] of Object.entries(categoryMapping)) {
    if (data.dealerId === dealerId) return { slug, ...data };
  }
  return null;
};
// Get payment record by orderId
export const getPaymentByOrder = (orderId) => {
  const token = localStorage.getItem("token");
  return axios.get(`http://localhost:8083/api/payments/by-order/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Cancel order + trigger refund
export const cancelAndRefund = (paymentId, toWallet = true) => {
  const token = localStorage.getItem("token");
  return axios.post(
    `http://localhost:8083/api/payments/cancel?paymentId=${paymentId}&toWallet=${toWallet}`, // ✅ 8083
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

/* =========================
   ORDER API
   POST /api/orders  — raw axios, explicit header
========================= */
export const placeOrder = (orderData) =>
  axios.post(ORDER_API, orderData, { headers: getAuthHeaders() });

/* =========================
   PAYMENT APIs
   ⚠️  ALL use raw axios + explicit Authorization header
   ⚠️  ALL params go as query params (not body)
   ⚠️  NEVER use the API instance for payment calls
========================= */

// ── COD ─────────────────────────────────────────────────────
// POST /api/payments/payNow
export const payWithCOD = (orderId, amount) =>
  axios.post(`${PAYMENT_API}/payNow`, null, {
    params:  { orderId, amount, paymentType: "COD" },
    headers: getAuthHeaders(),
  });

// ── Wallet ───────────────────────────────────────────────────
// POST /api/payments/wallet/pay
export const payWithWallet = (orderId, amount) =>
  axios.post(`${PAYMENT_API}/wallet/pay`, null, {
    params:  { orderId, amount },
    headers: getAuthHeaders(),
  });

  export const validateCoupon = (couponCode) => {
  const token = localStorage.getItem("token");
  return axios.post(`${PAYMENT_API}/coupons/validate`, null, {
    params: { couponCode },
    headers: { Authorization: `Bearer ${token}` }  // ✅ added auth header
  });
};
// ── Card Step 1: Initiate OTP ────────────────────────────────
// POST /api/payments/card/initiate
export const initiateCardPayment = (
  cardHolderName, cardNumber, expiryDate, cvv, email, orderId, amount
) =>
  axios.post(`${PAYMENT_API}/card/initiate`, null, {
    params:  { cardHolderName, cardNumber, expiryDate, cvv, email, orderId, amount },
    headers: getAuthHeaders(),
  });

// ── Card Step 2: Verify OTP ──────────────────────────────────
// POST /api/payments/card/verify
export const verifyUpiOtp = (email, orderId, enteredOtp, couponCode) =>
  axios.post(`${PAYMENT_API}/upi/verify`, null, {
    params:  { email, orderId, enteredOtp }, // ✅
    headers: getAuthHeaders(),
  });

export const verifyCardOtp = (email, orderId, enteredOtp, couponCode) =>
  axios.post(`${PAYMENT_API}/card/verify`, null, {
    params:  { email, orderId, enteredOtp }, // ✅
    headers: getAuthHeaders(),
  });

// ── UPI Step 1: Initiate OTP ─────────────────────────────────
// POST /api/payments/upi/initiate
export const initiateUpiPayment = (upiId, email, orderId, amount) =>
  axios.post(`${PAYMENT_API}/upi/initiate`, null, {
    params:  { upiId, email, orderId, amount },
    headers: getAuthHeaders(),
  });

// ── UPI Step 2: Verify OTP ──────────────────────────────────

  // ── EMI Initiate ─────────────────────────────────────────────
// POST /api/payments/emi/initiate
export const initiateEmiPayment = (orderId, amount, months) =>
  axios.post(`${PAYMENT_API}/emi/initiate`, null, {
    params:  { orderId, amount, months },
    headers: getAuthHeaders(),
  });

  // ── My Orders ────────────────────────────────────────────────
export const getMyOrders = () => {
  const token = localStorage.getItem("token");
  return axios.get("http://localhost:8085/api/orders/my", {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  
};
export default API;
