import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders, cancelAndRefund } from "../config/api";
import axios from "axios";


const getOrderItems = (orderId) => {
  const token = localStorage.getItem("token");
  return axios.get(`http://localhost:8085/api/orders/${orderId}/items`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

function getUserName() {
  try { return localStorage.getItem("username") || "User"; } catch { return "User"; }
}

// ─── Icon primitives ──────────────────────────────────────────────────────────
const Icon = ({ size = 20, stroke = "currentColor", strokeWidth = 1.8, fill = "none", children, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "block", flexShrink: 0, ...style }}>
    {children}
  </svg>
);

const ShoppingBagIcon = (p) => (
  <Icon {...p}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </Icon>
);

const ChevronDown = (p) => (
  <Icon {...p}><polyline points="6 9 12 15 18 9" /></Icon>
);

const ChevronLeft = (p) => (
  <Icon {...p}><polyline points="15 18 9 12 15 6" /></Icon>
);

const HeartIcon = (p) => (
  <Icon {...p}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Icon>
);

const CartIcon = (p) => (
  <Icon {...p}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </Icon>
);

const OrdersIcon = (p) => (
  <Icon {...p}>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="2" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="13" y2="16" />
  </Icon>
);

const SignOutIcon = (p) => (
  <Icon {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </Icon>
);

const UserIcon = (p) => (
  <Icon {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Icon>
);

const WalletIcon = (p) => (
  <Icon {...p}>
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
  </Icon>
);

const BellIcon = (p) => (
  <Icon {...p}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Icon>
);

const RefreshIcon = (p) => (
  <Icon {...p}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </Icon>
);

// Cancel modal icons
const XCircleIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </Icon>
);

const CheckCircleIcon = (p) => (
  <Icon {...p}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </Icon>
);

const AlertTriangleIcon = (p) => (
  <Icon {...p}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Icon>
);

const BankIcon = (p) => (
  <Icon {...p}>
    <line x1="3" y1="22" x2="21" y2="22" />
    <line x1="6" y1="18" x2="6" y2="11" />
    <line x1="10" y1="18" x2="10" y2="11" />
    <line x1="14" y1="18" x2="14" y2="11" />
    <line x1="18" y1="18" x2="18" y2="11" />
    <polygon points="12 2 20 7 4 7" />
  </Icon>
);

const ArrowRightIcon = (p) => (
  <Icon {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </Icon>
);

const TruckIcon = (p) => (
  <Icon {...p}>
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </Icon>
);

const PackageIcon = (p) => (
  <Icon {...p}>
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </Icon>
);

const ClockIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Icon>
);

// ─── Status config ────────────────────────────────────────────────────────────
const statusConfig = {
  SUCCESS:     { bg: "#F0FDF4", color: "#16A34A", dot: "#16A34A", label: "Paid" },
  PENDING:     { bg: "#FFF8E1", color: "#D97706", dot: "#F59E0B", label: "Pending" },
  COD_PENDING: { bg: "#EFF6FF", color: "#2563EB", dot: "#3B82F6", label: "Pay on Delivery" },
  CANCELLED:   { bg: "#FEF2F2", color: "#DC2626", dot: "#DC2626", label: "Cancelled" },
  EMI_ACTIVE:  { bg: "#F5F3FF", color: "#7C3AED", dot: "#7C3AED", label: "EMI Active" },
  FAILED:      { bg: "#FEF2F2", color: "#DC2626", dot: "#DC2626", label: "Failed" },
};

const StatusIconComp = ({ status, size = 20 }) => {
  const props = { size, strokeWidth: 2 };
  switch (status) {
    case "SUCCESS":     return <CheckCircleIcon {...props} stroke="#16A34A" />;
    case "PENDING":     return <ClockIcon {...props} stroke="#D97706" />;
    case "COD_PENDING": return <TruckIcon {...props} stroke="#2563EB" />;
    case "CANCELLED":   return <XCircleIcon {...props} stroke="#DC2626" />;
    case "EMI_ACTIVE":  return <ClockIcon {...props} stroke="#7C3AED" />;
    case "FAILED":      return <XCircleIcon {...props} stroke="#DC2626" />;
    default:            return <PackageIcon {...props} stroke="#888" />;
  }
};

// ─── Cancel reasons (Amazon-style, SVG icons only) ────────────────────────────
const ReasonIcon = ({ type, size = 16, color = "var(--ink-60)" }) => {
  const s = { size, stroke: color, strokeWidth: 1.9 };
  switch (type) {
    case "changed_mind":  return <Icon {...s}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></Icon>;
    case "wrong_size":    return <Icon {...s}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></Icon>;
    case "wrong_item":    return <Icon {...s}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></Icon>;
    case "found_cheaper": return <Icon {...s}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></Icon>;
    case "delay":         return <Icon {...s}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>;
    case "duplicate":     return <Icon {...s}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></Icon>;
    case "quality":       return <Icon {...s}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></Icon>;
    case "other":         return <Icon {...s}><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></Icon>;
    default:              return null;
  }
};

const CANCEL_REASONS = [
  { id: "changed_mind",   label: "I no longer need this item",                   sub: "Changed my mind about the purchase" },
  { id: "wrong_size",     label: "I ordered the wrong size / colour / variant",  sub: "Selected an incorrect product option" },
  { id: "wrong_item",     label: "I accidentally ordered the wrong product",     sub: "Added wrong item to cart" },
  { id: "found_cheaper",  label: "I found a lower price elsewhere",              sub: "Better deal available on another platform" },
  { id: "delay",          label: "Delivery is taking too long",                  sub: "Expected delivery date not acceptable" },
  { id: "duplicate",      label: "This is a duplicate / accidental order",       sub: "Placed the same order more than once" },
  { id: "quality",        label: "I have concerns about the product quality",    sub: "Doubts about item authenticity or condition" },
  { id: "other",          label: "Other reason",                                 sub: "Something not listed above" },
];

// ─── Dropdown config ──────────────────────────────────────────────────────────
const dropdownItems = [
  { label: "My Profile",    IconComp: UserIcon    },
  { label: "My Orders",     IconComp: OrdersIcon  },
  { label: "My Wallet",     IconComp: WalletIcon  },
  { label: "Notifications", IconComp: BellIcon    },
];
const routes = {
  
  "My Orders":     "/orders",
  "My Wallet":     "/mywallet",
};

// ─── Cancel Modal ─────────────────────────────────────────────────────────────
// Steps: "reason" → "refund" → "confirm" → "processing" → "done" | "not_eligible"
function CancelModal({ order, paidAmount, productAmount, orderDate, onClose, onConfirmed }) {
  // Mirror backend refund logic: only productAmount is refunded (no platform fee / shipping).
  // Full refund if ≤5 days, 50% if ≤10 days, 0 if >10 days.
  const daysSinceOrder = orderDate
    ? Math.floor((Date.now() - new Date(orderDate).getTime()) / 86400000)
    : 0;
  const baseRefund = productAmount ?? paidAmount ?? order.totalAmount;
  const refundAmount = daysSinceOrder <= 5
    ? baseRefund
    : daysSinceOrder <= 10
    ? Math.floor(baseRefund * 0.5)
    : 0;
  const isPartial = daysSinceOrder > 5 && daysSinceOrder <= 10;
  const [step, setStep] = useState("reason");
  const [selectedReason, setSelectedReason] = useState(null);
  const [refundToWallet, setRefundToWallet] = useState(null); // true = wallet, false = original acc
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(null);

  const isPaid = order.status === "SUCCESS";

  // step indices for progress bar
  const STEPS = isPaid ? ["reason", "refund", "confirm"] : ["reason", "confirm"];
  const stepIndex = STEPS.indexOf(step);
  const totalSteps = STEPS.length;

  const handleConfirm = async () => {
    setStep("processing");
    setError(null);
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:8085/api/orders/cancel/${order.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (isPaid) {
        try {
          const paymentRes = await axios.get(`http://localhost:8083/api/payments/by-order/${order.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const payment =  paymentRes.data.data || paymentRes.data;
          if (payment && payment.paymentStatus === "SUCCESS") {
            const refundRes = await cancelAndRefund(payment.paymentId, refundToWallet);
            const refund = refundRes.data.data;
            if (refund.type === "NOT_ELIGIBLE") {
              setStep("not_eligible");
            } else {
              setResultData({ amount: refund.amount, toWallet: refundToWallet });
              setStep("done");
            }
          } else {
            setStep("done");
          }
        } catch (paymentErr) {
          console.warn("Payment service unavailable:", paymentErr);
          setResultData(null);
          setStep("done");
        }
      } else {
        setStep("done");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setStep("confirm");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const isTerminal = ["processing", "done", "not_eligible"].includes(step);

  // ── shared header bar ──
  const ModalHeader = ({ title, subtitle, onBack }) => (
    <div style={{ padding: "20px 24px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {onBack && (
            <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "var(--ink-30)", display: "flex", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--ink)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--ink-30)"}>
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
          )}
          <div>
            <p style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", color: "var(--ink)", fontWeight: 400 }}>{title}</p>
            {subtitle && <p style={{ fontSize: 11.5, color: "var(--ink-30)", fontWeight: 500, marginTop: 2 }}>{subtitle}</p>}
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 8, color: "var(--ink-30)", transition: "color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--ink)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--ink-30)"}>
          <XCircleIcon size={18} strokeWidth={1.8} />
        </button>
      </div>
      {/* progress bar */}
      <div style={{ display: "flex", gap: 5, marginBottom: 20 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= stepIndex ? "var(--orange)" : "#e8e4df",
            transition: "background 0.3s",
          }} />
        ))}
      </div>
    </div>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(15,14,13,0.55)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem", animation: "fadeIn 0.2s ease",
    }}>
      <div style={{
        background: "white", borderRadius: 24, width: "100%", maxWidth: 480,
        boxShadow: "0 24px 80px rgba(0,0,0,0.22)", overflow: "hidden",
        animation: "slideUp 0.28s cubic-bezier(0.34,1.56,0.64,1)",
        maxHeight: "90vh", overflowY: "auto",
      }}>

        {/* ══ STEP 1: Reason ══ */}
        {step === "reason" && (
          <>
            <ModalHeader title="Cancel Order" subtitle={`Order #${order.id}`} />
            <div style={{ padding: "0 24px 24px" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 2 }}>
                Tell us why you want to cancel
              </p>
              <p style={{ fontSize: 12, color: "var(--ink-60)", marginBottom: 14, lineHeight: 1.5 }}>
                This helps us improve. Select the option that best describes your situation.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {CANCEL_REASONS.map(r => {
                  const selected = selectedReason === r.id;
                  return (
                    <button key={r.id}
                      onClick={() => setSelectedReason(r.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 14px", borderRadius: 12, border: "1.5px solid",
                        borderColor: selected ? "var(--orange)" : "var(--border)",
                        background: selected ? "var(--orange-pale)" : "white",
                        cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%",
                      }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                        background: selected ? "rgba(249,115,22,0.12)" : "var(--surface)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background 0.15s",
                      }}>
                        <ReasonIcon type={r.id} size={16} color={selected ? "var(--orange)" : "var(--ink-60)"} />
                      </div>
                      <div style={{ flex: 1, textAlign: "left" }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: selected ? "var(--orange)" : "var(--ink)", marginBottom: 2 }}>{r.label}</p>
                        <p style={{ fontSize: 11.5, color: selected ? "rgba(249,115,22,0.7)" : "var(--ink-30)", lineHeight: 1.4 }}>{r.sub}</p>
                      </div>
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                        border: `2px solid ${selected ? "var(--orange)" : "var(--border)"}`,
                        background: selected ? "var(--orange)" : "white",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s",
                      }}>
                        {selected && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }} />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                <button onClick={onClose}
                  style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "1.5px solid var(--border)", background: "white", color: "var(--ink)", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.color = "#f97316"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ink)"; }}>
                  Keep Order
                </button>
                <button
                  onClick={() => { if (!selectedReason) return; setStep(isPaid ? "refund" : "confirm"); }}
                  disabled={!selectedReason}
                  style={{
                    flex: 1, padding: "11px 0", borderRadius: 12, border: "none",
                    background: selectedReason ? "linear-gradient(135deg,#f97316,#ea580c)" : "#e8e4df",
                    color: selectedReason ? "white" : "var(--ink-30)",
                    fontWeight: 700, fontSize: 13, cursor: selectedReason ? "pointer" : "not-allowed",
                    transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}>
                  Continue
                  <ArrowRightIcon size={14} stroke="currentColor" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* ══ STEP 2: Refund Yes / No ══ */}
        {step === "refund" && (
          <>
            <ModalHeader title="Refund Preference" subtitle={`Order #${order.id}`} onBack={() => setStep("reason")} />
            <div style={{ padding: "0 24px 24px" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 2 }}>
                Would you like your refund credited to your InstaBuy Wallet?
              </p>
              <p style={{ fontSize: 12, color: "var(--ink-60)", marginBottom: 18, lineHeight: 1.5 }}>
                Refund amount: <strong style={{ color: "var(--ink)" }}>₹{refundAmount?.toLocaleString("en-IN")}</strong>
                {isPartial && <span style={{ color: "#D97706", fontWeight: 600 }}> (50% partial refund)</span>}
                <br />
                <span style={{ fontSize: 11, color: "var(--ink-60)" }}>Platform fee &amp; shipping charges are non-refundable.</span>
              </p>

              {/* YES */}
              <button
                onClick={() => { setRefundToWallet(true); setStep("confirm"); }}
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "18px 16px",
                  borderRadius: 14, border: "1.5px solid var(--border)", background: "white",
                  cursor: "pointer", textAlign: "left", transition: "all 0.18s", width: "100%",
                  marginBottom: 10,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--orange)"; e.currentTarget.style.background = "var(--orange-pale)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "white"; }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: "linear-gradient(135deg,#fff7ed,#fed7aa)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <WalletIcon size={22} stroke="#f97316" strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Yes — add to InstaBuy Wallet</p>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#16A34A", background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 6, padding: "2px 7px" }}>Instant</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--ink-60)", lineHeight: 1.5 }}>Credited immediately · Use on any future purchase</p>
                </div>
                <ArrowRightIcon size={16} stroke="var(--ink-30)" strokeWidth={2} />
              </button>

              {/* NO */}
              <button
                onClick={() => { setRefundToWallet(false); setStep("confirm"); }}
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "18px 16px",
                  borderRadius: 14, border: "1.5px solid var(--border)", background: "white",
                  cursor: "pointer", textAlign: "left", transition: "all 0.18s", width: "100%",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.background = "#EFF6FF"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "white"; }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: "linear-gradient(135deg,#EFF6FF,#BFDBFE)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <BankIcon size={22} stroke="#2563EB" strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>No — refund to original account</p>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#2563EB", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 6, padding: "2px 7px" }}>3–5 days</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--ink-60)", lineHeight: 1.5 }}>Back to the card / UPI / bank used at checkout</p>
                </div>
                <ArrowRightIcon size={16} stroke="var(--ink-30)" strokeWidth={2} />
              </button>
            </div>
          </>
        )}

        {/* ══ STEP 3: Confirm Refund ══ */}
        {step === "confirm" && (
          <>
            <ModalHeader
              title="Confirm Cancellation"
              subtitle={`Order #${order.id}`}
              onBack={() => setStep(isPaid ? "refund" : "reason")}
            />
            <div style={{ padding: "0 24px 24px" }}>
              <div style={{ background: "#FFF8E1", border: "1.5px solid #FDE68A", borderRadius: 14, padding: "13px 15px", marginBottom: 18, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <AlertTriangleIcon size={17} stroke="#D97706" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.6, fontWeight: 500 }}>
                  This cannot be undone. Your order will be permanently cancelled and the refund will be initiated.
                </p>
              </div>

              {/* Summary */}
              <div style={{ background: "var(--surface)", borderRadius: 14, padding: "16px", marginBottom: 18, border: "1px solid var(--border)" }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-30)", marginBottom: 12 }}>Order Summary</p>
                <Row label="Order ID" value={`#${order.id}`} />
                <Row label="Cancel Reason" value={CANCEL_REASONS.find(r => r.id === selectedReason)?.label} />
                {isPaid && refundToWallet !== null && (
                  <Row
                    label="Refund To"
                    value={refundToWallet ? "InstaBuy Wallet" : "Original Account"}
                    valueColor={refundToWallet ? "var(--orange)" : "#2563EB"}
                  />
                )}
                {isPaid && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed var(--border)", paddingTop: 10, marginTop: 10 }}>
                    <span style={{ fontSize: 12, color: "var(--ink-60)", fontWeight: 500 }}>Refund Amount</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: "#16A34A", fontFamily: "var(--serif)" }}>
                      ₹{refundAmount?.toLocaleString("en-IN")}{isPartial ? " (50%)" : ""}
                    </span>
                  </div>
                )}
              </div>

              {error && (
                <div style={{ background: "#FEF2F2", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
                  <p style={{ fontSize: 12, color: "#DC2626", fontWeight: 600 }}>{error}</p>
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onClose}
                  style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "1.5px solid var(--border)", background: "white", color: "var(--ink)", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.color = "#f97316"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ink)"; }}>
                  Keep Order
                </button>
                <button onClick={handleConfirm}
                  style={{
                    flex: 1.5, padding: "12px 0", borderRadius: 12, border: "none",
                    background: "linear-gradient(135deg,#DC2626,#b91c1c)",
                    color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    boxShadow: "0 4px 14px rgba(220,38,38,0.28)", transition: "opacity 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  <XCircleIcon size={14} stroke="white" strokeWidth={2.5} />
                  Confirm &amp; Initiate Refund
                </button>
              </div>
            </div>
          </>
        )}

        {/* ══ Processing ══ */}
        {step === "processing" && (
          <div style={{ padding: "52px 24px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", border: "3px solid var(--orange)", borderTopColor: "transparent", margin: "0 auto 22px", animation: "spin 0.8s linear infinite" }} />
            <p style={{ fontFamily: "var(--serif)", fontSize: "1.2rem", color: "var(--ink)", marginBottom: 6 }}>Processing your request…</p>
            <p style={{ fontSize: 13, color: "var(--ink-60)" }}>Cancelling order and initiating refund. Please wait.</p>
          </div>
        )}

        {/* ══ Done ══ */}
        {step === "done" && (
          <div style={{ padding: "44px 28px", textAlign: "center" }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#F0FDF4", border: "2px solid #86EFAC", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
              <CheckCircleIcon size={34} stroke="#16A34A" strokeWidth={2} />
            </div>
            <p style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", color: "var(--ink)", marginBottom: 8, letterSpacing: "-0.02em" }}>
              Cancellation Confirmed
            </p>
            <p style={{ fontSize: 13, color: "var(--ink-60)", lineHeight: 1.7, marginBottom: 24 }}>
              Your order has been cancelled and your refund has been initiated.
            </p>
            <button onClick={() => { onConfirmed(order.id); onClose(); }}
              style={{ padding: "11px 36px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#16A34A,#15803d)", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 14px rgba(22,163,74,0.3)" }}>
              Done
            </button>
          </div>
        )}

        {/* ══ Not eligible ══ */}
        {step === "not_eligible" && (
          <div style={{ padding: "44px 28px", textAlign: "center" }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#FFF8E1", border: "2px solid #FDE68A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <AlertTriangleIcon size={32} stroke="#D97706" strokeWidth={2} />
            </div>
            <p style={{ fontFamily: "var(--serif)", fontSize: "1.3rem", color: "var(--ink)", marginBottom: 8, letterSpacing: "-0.02em" }}>Order Cancelled</p>
            <p style={{ fontSize: 13, color: "var(--ink-60)", lineHeight: 1.7, marginBottom: 24 }}>
              Your order has been cancelled. However, this order is <strong>not eligible for a refund</strong> as it was placed more than 10 days ago.
            </p>
            <button onClick={onClose}
              style={{ padding: "11px 36px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#f97316,#ea580c)", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 14px rgba(249,115,22,0.3)" }}>
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// small helper row
function Row({ label, value, valueColor = "var(--ink)" }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 9 }}>
      <span style={{ fontSize: 12, color: "var(--ink-60)", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: valueColor, textAlign: "right", maxWidth: "60%" }}>{value}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OrdersPage() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const userName = getUserName();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [orderItemsMap, setOrderItemsMap] = useState({});
  // Stores the actual paid amount (after coupon) from Payment service, keyed by orderId
  const [paymentAmountMap, setPaymentAmountMap] = useState({});

  // Cancel modal state
  const [cancelModalOrder, setCancelModalOrder] = useState(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data);
        const token = localStorage.getItem("token");
        const itemsMap = {};
        const amountMap = {};
        await Promise.all(
          res.data.map(async (order) => {
            // Fetch order items
            try {
              const itemsRes = await getOrderItems(order.id);
              itemsMap[order.id] = itemsRes.data;
            } catch {
              itemsMap[order.id] = [];
            }
            // Fetch actual paid amount from Payment service (includes coupon discount)
            try {
              const payRes = await axios.get(
                `http://localhost:8083/api/payments/by-order/${order.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              // Backend returns ApiResponse: { status, message, data: { amount, productAmount, ... } }
              const payment = payRes.data?.data;
              if (payment?.amount != null) {
                amountMap[order.id] = payment; // full object: amount, productAmount, shippingFee, platformFee
              }
            } catch {
              // Payment not found — fall back to order.totalAmount
            }
          })
        );
        setOrderItemsMap(itemsMap);
        setPaymentAmountMap(amountMap);
      } catch {
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const st = statusConfig[order.status];
    return activeFilter === "All" || (st && st.label === activeFilter);
  });

  const handleCancelClick = (e, order) => {
    e.stopPropagation();
    setCancelModalOrder(order);
  };

  const handleCancelConfirmed = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "CANCELLED" } : o));
  };

  const refreshOrders = () => {
    setLoading(true);
    setError(null);
    getMyOrders()
      .then(r => setOrders(r.data))
      .catch(() => setError("Failed to load orders. Please try again."))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --orange:#f97316;
          --orange-deep:#ea580c;
          --orange-pale:#fff7ed;
          --ink:#0f0e0d;
          --ink-60:rgba(15,14,13,0.6);
          --ink-30:rgba(15,14,13,0.3);
          --border:#e8e4df;
          --surface:#faf9f7;
          --white:#ffffff;
          --serif:'DM Serif Display',Georgia,serif;
          --sans:'DM Sans',system-ui,sans-serif;
          --radius:14px;
          --shadow-sm:0 1px 4px rgba(0,0,0,0.06);
          --shadow-md:0 4px 20px rgba(0,0,0,0.08);
          --shadow-lg:0 12px 48px rgba(0,0,0,0.12);
        }
        html{scroll-behavior:smooth;}
        body{font-family:var(--sans);background:var(--surface);color:var(--ink);}
        ::-webkit-scrollbar{width:6px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#e0d9d1;border-radius:3px;}
        .dd-item:hover{background:#fff7ed!important;color:#f97316!important;}
        .dd-item:hover svg{stroke:#f97316!important;}
        .header-btn:hover{background:var(--orange-pale)!important;}
        .filter-pill:hover{background:var(--orange-pale)!important;color:var(--orange)!important;border-color:var(--orange)!important;}
        .order-card{transition:box-shadow 0.22s,transform 0.22s;}
        .order-card:hover{box-shadow:0 8px 32px rgba(249,115,22,0.13)!important;transform:translateY(-2px);}
        .ft-link:hover{color:#f97316!important;}
        .retry-btn:hover{background:#ea580c!important;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes slideUp{from{opacity:0;transform:translateY(30px) scale(0.97);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes scaleIn{from{transform:scale(0.5);opacity:0;}to{transform:scale(1);opacity:1;}}
        .fade-in{animation:fadeUp 0.4s ease both;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .spinner{animation:spin 0.8s linear infinite;}
        @keyframes shimmer{0%{background-position:-400px 0;}100%{background-position:400px 0;}}
        .shimmer{
          background:linear-gradient(90deg,#f0ece7 25%,#faf8f5 50%,#f0ece7 75%);
          background-size:800px 100%;
          animation:shimmer 1.5s infinite;
          border-radius:8px;
        }
      `}</style>

      {/* Cancel modal */}
      {cancelModalOrder && (
        <CancelModal
          order={cancelModalOrder}
          paidAmount={paymentAmountMap[cancelModalOrder.id]?.amount ?? cancelModalOrder.totalAmount}
          productAmount={paymentAmountMap[cancelModalOrder.id]?.productAmount ?? null}
          orderDate={cancelModalOrder.createdAt ?? cancelModalOrder.orderDate ?? null}
          onClose={() => setCancelModalOrder(null)}
          onConfirmed={(id) => {
            handleCancelConfirmed(id);
            setCancelModalOrder(null);
          }}
        />
      )}

      <div style={{ minHeight: "100vh", background: "var(--surface)", fontFamily: "var(--sans)" }}>

        {/* ══════════ HEADER ══════════ */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}>
          {/* Promo bar */}
          <div style={{ background: "var(--ink)", padding: "6px 1.5rem", textAlign: "center" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", letterSpacing: "0.04em" }}>
              🎉 Free delivery on orders above ₹499 &nbsp;·&nbsp; Use code&nbsp;
              <strong style={{ color: "#f97316", letterSpacing: "0.06em" }}>FIRST10</strong>
              &nbsp;for 10% off your first order
            </span>
          </div>

          <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", height: 62, gap: "1rem" }}>

            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, cursor: "pointer" }} onClick={() => navigate("/home")}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#f97316,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(249,115,22,0.35)" }}>
                <ShoppingBagIcon size={17} stroke="white" strokeWidth={2.3} />
              </div>
              <span style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.01em" }}>InstaBuy</span>
            </div>

            {/* Right actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0, marginLeft: "auto" }}>

              {/* User dropdown */}
              <div style={{ position: "relative" }} ref={dropdownRef}>
                <button
                  className="header-btn"
                  onClick={() => setIsUserDropdownOpen(o => !o)}
                  style={{ display: "flex", alignItems: "center", gap: 7, background: "transparent", border: "none", borderRadius: 10, cursor: "pointer", padding: "6px 10px", transition: "background 0.18s" }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#f97316,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{userName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.2 }}>
                    <span style={{ fontSize: 10, color: "var(--ink-60)", fontWeight: 400 }}>Hello,</span>
                    <span style={{ fontSize: 12, color: "var(--ink)", fontWeight: 700, maxWidth: 68, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</span>
                  </div>
                  <ChevronDown size={12} stroke="var(--ink-60)" strokeWidth={2.5} />
                </button>

                {isUserDropdownOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 10px)", right: 0,
                    background: "white", border: "1px solid var(--border)",
                    borderRadius: 16, boxShadow: "var(--shadow-lg)",
                    minWidth: 210, zIndex: 100, overflow: "hidden",
                  }}>
                    <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, background: "var(--orange-pale)" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#f97316,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "white", flexShrink: 0 }}>
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{userName}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-60)" }}>Member</div>
                      </div>
                    </div>
                    <div style={{ height: 1, background: "var(--border)" }} />
                    {dropdownItems.map(({ label, IconComp }) => (
                      <button key={label} className="dd-item"
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          width: "100%", padding: "10px 16px",
                          background: label === "My Orders" ? "var(--orange-pale)" : "transparent",
                          border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
                          color: label === "My Orders" ? "var(--orange)" : "var(--ink)",
                          textAlign: "left", transition: "all 0.15s",
                        }}
                        onClick={() => { setIsUserDropdownOpen(false); navigate(routes[label]); }}>
                        <IconComp size={15} stroke={label === "My Orders" ? "#f97316" : "var(--ink-60)"} strokeWidth={2} />
                        {label}
                      </button>
                    ))}
                    <div style={{ height: 1, background: "var(--border)" }} />
                    <button className="dd-item"
                      style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#dc2626", textAlign: "left", transition: "all 0.15s" }}
                      onClick={() => { try { localStorage.clear(); } catch {} window.location.href = "/login"; }}>
                      <SignOutIcon size={15} stroke="#dc2626" strokeWidth={2} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <button className="header-btn"
                style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", borderRadius: 10, cursor: "pointer", padding: "6px 10px", transition: "background 0.18s" }}>
                <HeartIcon size={20} stroke="var(--ink)" strokeWidth={1.8} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>Wishlist</span>
              </button>

              {/* Cart */}
              <button className="header-btn"
                style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", borderRadius: 10, cursor: "pointer", padding: "6px 12px", transition: "background 0.18s" }}>
                <CartIcon size={20} stroke="var(--ink)" strokeWidth={1.8} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>Cart</span>
              </button>
            </div>
          </div>
        </header>

        {/* ══════════ PAGE BODY ══════════ */}
        <main style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1.8rem" }}>
            <button onClick={() => navigate("/home")}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "var(--ink-60)", fontSize: 13, fontWeight: 500, padding: 0 }}>
              <ChevronLeft size={14} stroke="currentColor" strokeWidth={2.5} />
              Home
            </button>
            <span style={{ color: "var(--ink-30)", fontSize: 13 }}>/</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>My Orders</span>
          </div>

          {/* Page heading */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.8rem", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.025em", lineHeight: 1.15 }}>
                My Orders
              </h1>
              {!loading && !error && (
                <p style={{ fontSize: 13, color: "var(--ink-60)", marginTop: 5 }}>
                  {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""} found
                </p>
              )}
            </div>
            {!loading && !error && orders.length > 0 && (
              <button
                onClick={refreshOrders}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1.5px solid var(--border)", borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 600, color: "var(--ink)", cursor: "pointer", transition: "all 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.color = "#f97316"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ink)"; }}>
                <RefreshIcon size={13} stroke="currentColor" strokeWidth={2.2} />
                Refresh
              </button>
            )}
          </div>

          {/* Filter pills */}
          {!loading && !error && orders.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.8rem" }}>
              {["All", ...Object.values(statusConfig).map(s => s.label).filter((v, i, a) => a.indexOf(v) === i)].map(filter => (
                <button key={filter} className="filter-pill"
                  onClick={() => setActiveFilter(filter)}
                  style={{
                    padding: "7px 20px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                    border: "1.5px solid",
                    borderColor: activeFilter === filter ? "#f97316" : "var(--border)",
                    background: activeFilter === filter ? "var(--orange-pale)" : "white",
                    color: activeFilter === filter ? "var(--orange)" : "var(--ink-60)",
                    cursor: "pointer", transition: "all 0.18s",
                  }}>
                  {filter}
                </button>
              ))}
            </div>
          )}

          {/* ── Loading skeletons ── */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <div>
                      <div className="shimmer" style={{ width: 70, height: 11, marginBottom: 8 }} />
                      <div className="shimmer" style={{ width: 110, height: 15 }} />
                    </div>
                    <div className="shimmer" style={{ width: 100, height: 28, borderRadius: 20 }} />
                  </div>
                  <div style={{ height: 1, background: "var(--border)", margin: "12px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div className="shimmer" style={{ width: 40, height: 11, marginBottom: 8 }} />
                      <div className="shimmer" style={{ width: 160, height: 14 }} />
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="shimmer" style={{ width: 80, height: 11, marginBottom: 8 }} />
                      <div className="shimmer" style={{ width: 90, height: 22 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <XCircleIcon size={30} stroke="#DC2626" strokeWidth={1.8} />
              </div>
              <p style={{ color: "#DC2626", fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{error}</p>
              <p style={{ color: "var(--ink-60)", fontSize: 13, marginBottom: 24 }}>Something went wrong while fetching your orders.</p>
              <button className="retry-btn"
                onClick={refreshOrders}
                style={{ padding: "12px 28px", background: "linear-gradient(135deg,#f97316,#ea580c)", color: "white", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.18s", boxShadow: "0 4px 14px rgba(249,115,22,0.3)" }}>
                Try Again
              </button>
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && !error && filteredOrders.length === 0 && (
            <div style={{ textAlign: "center", padding: "70px 0" }}>
              <div style={{ width: 80, height: 80, borderRadius: 24, background: "var(--orange-pale)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: "1.5px solid #fed7aa" }}>
                <OrdersIcon size={34} stroke="#f97316" strokeWidth={1.5} />
              </div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 400, color: "var(--ink)", marginBottom: 8, letterSpacing: "-0.02em" }}>
                {orders.length === 0 ? "No orders yet" : "No matching orders"}
              </h2>
              <p style={{ color: "var(--ink-60)", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
                {orders.length === 0
                  ? "Looks like you haven't placed any orders.\nStart shopping to see them here!"
                  : `No orders match "${activeFilter}" filter.`}
              </p>
              {orders.length === 0 ? (
                <button
                  onClick={() => navigate("/home")}
                  style={{ padding: "12px 28px", background: "linear-gradient(135deg,#f97316,#ea580c)", color: "white", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.18s", boxShadow: "0 4px 14px rgba(249,115,22,0.3)" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  Start Shopping →
                </button>
              ) : (
                <button onClick={() => setActiveFilter("All")}
                  style={{ padding: "10px 22px", background: "white", color: "var(--orange)", border: "1.5px solid #f97316", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  Clear Filter
                </button>
              )}
            </div>
          )}

          {/* ── Orders list ── */}
          {!loading && !error && filteredOrders.map((order, i) => {
            const st = statusConfig[order.status] || { bg: "#f5f5f5", color: "#888", dot: "#ccc", label: order.status };
            const isExpanded = expandedId === order.id;

            return (
              <div key={order.id} className="order-card fade-in"
                style={{
                  background: "white", borderRadius: 16, padding: 24, marginBottom: 14,
                  boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
                  animationDelay: `${i * 0.06}s`,
                  cursor: "pointer",
                }}
                onClick={() => setExpandedId(isExpanded ? null : order.id)}>

                {/* Card header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Product image or status icon */}
                    <div style={{ width: 52, height: 52, borderRadius: 12, background: st.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1.5px solid ${st.dot}33`, overflow: "hidden" }}>
                      {order.productImage ? (
                        <img src={order.productImage} alt={order.productName}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                      ) : null}
                      <div style={{ display: order.productImage ? "none" : "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                        <StatusIconComp status={order.status} size={24} />
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: "var(--ink-30)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Order ID</p>
                      <p style={{ fontFamily: "var(--serif)", fontSize: "1rem", fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.01em" }}>#{order.id}</p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                      background: st.bg, color: st.color,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: st.dot, flexShrink: 0 }} />
                      {st.label}
                    </span>
                    <ChevronDown size={14} stroke="var(--ink-30)" strokeWidth={2.5}
                      style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.22s" }} />
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }} />

                {/* Summary row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 11, color: "var(--ink-30)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Items</p>
                    {orderItemsMap[order.id] && orderItemsMap[order.id].length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {orderItemsMap[order.id].map((item, idx) => (
                          <p key={idx} style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>
                            {item.productName}&nbsp;<span style={{ color: "var(--ink-60)", fontWeight: 400 }}>× {item.quantity}</span>
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>
                        {order.productName}&nbsp;<span style={{ color: "var(--ink-60)", fontWeight: 400 }}>× {order.quantity}</span>
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 11, color: "var(--ink-30)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Total</p>
                    <p style={{ fontFamily: "var(--serif)", fontSize: "1.3rem", fontWeight: 400, color: "var(--orange)", letterSpacing: "-0.02em" }}>
                      ₹{(paymentAmountMap[order.id]?.amount ?? order.totalAmount).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px dashed #e8e4df", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "14px 24px" }}>
                    {order.orderedAt && (
                      <div>
                        <p style={{ fontSize: 11, color: "var(--ink-30)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Ordered On</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
                          {new Date(order.orderedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    )}
                    {order.deliveryDate && (
                      <div>
                        <p style={{ fontSize: 11, color: "var(--ink-30)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Delivery Date</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
                          {new Date(order.deliveryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    )}
                    {order.paymentMethod && (
                      <div>
                        <p style={{ fontSize: 11, color: "var(--ink-30)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Payment</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{order.paymentMethod}</p>
                      </div>
                    )}
                    {order.address && (
                      <div>
                        <p style={{ fontSize: 11, color: "var(--ink-30)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Delivered To</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", lineHeight: 1.5 }}>{order.address}</p>
                      </div>
                    )}

                    {/* Fee breakdown from Payment service */}
                    {paymentAmountMap[order.id] && (
                      <div style={{ gridColumn: "1 / -1", background: "var(--surface)", borderRadius: 12, padding: "14px 16px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 8 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-30)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Bill Breakdown</p>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                          <span style={{ color: "var(--ink-60)" }}>Product Amount</span>
                          <span style={{ fontWeight: 600, color: "var(--ink)" }}>₹{paymentAmountMap[order.id].productAmount?.toLocaleString("en-IN")}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                          <span style={{ color: "var(--ink-60)" }}>Shipping</span>
                          <span style={{ fontWeight: 600, color: paymentAmountMap[order.id].shippingFee > 0 ? "var(--ink)" : "#16a34a" }}>
                            {paymentAmountMap[order.id].shippingFee > 0 ? `₹${paymentAmountMap[order.id].shippingFee?.toLocaleString("en-IN")}` : "FREE"}
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                          <span style={{ color: "var(--ink-60)" }}>Platform Fee</span>
                          <span style={{ fontWeight: 600, color: "var(--ink)" }}>₹{paymentAmountMap[order.id].platformFee?.toLocaleString("en-IN")}</span>
                        </div>
                        {paymentAmountMap[order.id].amount !== (
                          (paymentAmountMap[order.id].productAmount ?? 0) +
                          (paymentAmountMap[order.id].shippingFee ?? 0) +
                          (paymentAmountMap[order.id].platformFee ?? 0)
                        ) && (
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                            <span style={{ color: "#16a34a", fontWeight: 600 }}>Coupon Discount</span>
                            <span style={{ fontWeight: 700, color: "#16a34a" }}>
                              −₹{(
                                (paymentAmountMap[order.id].productAmount ?? 0) +
                                (paymentAmountMap[order.id].shippingFee ?? 0) +
                                (paymentAmountMap[order.id].platformFee ?? 0) -
                                paymentAmountMap[order.id].amount
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}
                        <div style={{ height: 1, background: "var(--border)", margin: "2px 0" }} />
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                          <span style={{ fontWeight: 700, color: "var(--ink)" }}>Total Paid</span>
                          <span style={{ fontWeight: 800, color: "var(--orange)", fontFamily: "var(--serif)", fontSize: 15 }}>₹{paymentAmountMap[order.id].amount?.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    )}
                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/orders/${order.id}`); }}
                        style={{ padding: "9px 20px", background: "linear-gradient(135deg,#f97316,#ea580c)", color: "white", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: "pointer", boxShadow: "0 3px 10px rgba(249,115,22,0.28)", transition: "opacity 0.18s", display: "flex", alignItems: "center", gap: 6 }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                        <PackageIcon size={13} stroke="white" strokeWidth={2.2} />
                        View Details
                      </button>
                      {(order.status === "SUCCESS" || order.status === "COD_PENDING") && (
                        <button
                          onClick={e => e.stopPropagation()}
                          style={{ padding: "9px 20px", background: "white", color: "var(--ink)", border: "1.5px solid var(--border)", borderRadius: 10, fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all 0.18s", display: "flex", alignItems: "center", gap: 6 }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.color = "#f97316"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ink)"; }}>
                          <TruckIcon size={13} stroke="currentColor" strokeWidth={2} />
                          Track Order
                        </button>
                      )}
                      {(order.status === "SUCCESS" || order.status === "COD_PENDING" || order.status === "PENDING") && (
                        <button
                          onClick={e => handleCancelClick(e, order)}
                          style={{
                            padding: "9px 20px", background: "white", color: "#DC2626",
                            border: "1.5px solid #fca5a5", borderRadius: 10, fontWeight: 600,
                            fontSize: 12, cursor: "pointer",
                            transition: "all 0.18s",
                            display: "flex", alignItems: "center", gap: 6,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.borderColor = "#DC2626"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#fca5a5"; }}>
                          <XCircleIcon size={13} stroke="#DC2626" strokeWidth={2.2} />
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                )}

              </div>
            );
          })}

        </main>

        {/* ══════════ FOOTER ══════════ */}
        <footer style={{ background: "var(--ink)", padding: "2.5rem 1.5rem 1.5rem", marginTop: "1rem" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#f97316,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShoppingBagIcon size={13} stroke="white" strokeWidth={2.3} />
              </div>
              <span style={{ fontFamily: "var(--serif)", fontSize: "1.05rem", fontWeight: 400, color: "white", letterSpacing: "-0.01em" }}>InstaBuy</span>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.7, maxWidth: 400, marginBottom: 16 }}>
              Your trusted shopping destination for quality products at the best prices. Made with ❤️ in India.
            </p>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.25)" }}>© 2026 InstaBuy. All rights reserved.</p>
              <div style={{ display: "flex", gap: 16 }}>
                {["Privacy", "Terms", "Cookies"].map(l => (
                  <a key={l} href={`/${l.toLowerCase()}`} className="ft-link"
                    style={{ fontSize: 11.5, color: "rgba(255,255,255,0.25)", textDecoration: "none", transition: "color 0.18s" }}>
                    {l}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
