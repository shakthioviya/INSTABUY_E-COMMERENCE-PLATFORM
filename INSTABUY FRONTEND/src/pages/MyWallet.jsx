import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { PAYMENT_API, getAuthHeaders, getUserId } from '../config/api'; // adjust path if needed

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_BASE = PAYMENT_API; // → "http://localhost:8083/api/payments"

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const api = async (path, opts = {}) => {
  const { method = "GET", params } = opts;
  const res = await axios({
    method,
    url: `${API_BASE}${path}`,
    params,
    headers: getAuthHeaders(),
  });
  return res.data;
};

const fmt = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });

// ─── ICONS (inline SVG) ───────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  wallet: "M20 12V22H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z",
  plus: "M12 5v14M5 12h14",
  arrow: "M5 12h14M12 5l7 7-7 7",
  check: "M20 6L9 17l-5-5",
  copy: "M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2M8 4a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2h-4a2 2 0 01-2-2zM12 11v6M9 14h6",
  gift: "M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7a5 5 0 01-5-5 5 5 0 005 5zM12 7a5 5 0 005-5 5 5 0 01-5 5z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
  history: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",
  truck: "M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-3M16 17a2 2 0 100 4 2 2 0 000-4zM7 17a2 2 0 100 4 2 2 0 000-4z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  x: "M18 6L6 18M6 6l12 12",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 0l8 8 8-8",
};

// ─── STEP INDICATOR ───────────────────────────────────────────────────────────
const StepDot = ({ label, active, done }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
    <div style={{
      width: 28, height: 28, borderRadius: "50%",
      background: done ? "#FF6B00" : active ? "#FF6B00" : "#2a2a2a",
      border: `2px solid ${active || done ? "#FF6B00" : "#444"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 12, color: "#fff", fontWeight: 700,
      boxShadow: active ? "0 0 12px #FF6B0066" : "none",
      transition: "all 0.3s",
    }}>
      {done ? "✓" : label}
    </div>
  </div>
);

// ─── TOP-UP MODAL ─────────────────────────────────────────────────────────────
const QUICK_AMOUNTS = [200, 500, 1000, 2000, 5000];

function TopUpModal({ onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1=amount, 2=upi, 3=otp, 4=success
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [upiId, setUpiId] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [addedAmt, setAddedAmt] = useState(0);
  const [txnId] = useState("TXN" + Date.now());
  const otpRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (step === 3) {
      timerRef.current = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [step]);

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const initiateTopup = async () => {
    setError("");
    if (!amount || Number(amount) < 1) { setError("Enter a valid amount"); return; }
    if (!email.includes("@")) { setError("Enter a valid email"); return; }
    if (!upiId.includes("@")) { setError("Enter a valid UPI ID (e.g. name@upi)"); return; }
    setLoading(true);
    try {
      await api(`/wallet/topup/initiate`, {
        method: "POST",
        params: { email, upiId, amount },
      });
      setTimer(30);
      setStep(3);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError("");
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) { setError("Enter complete 6-digit OTP"); return; }
    setLoading(true);
    try {
      await api(`/wallet/topup/verify`, {
        method: "POST",
        params: { email, enteredOtp },
      });
      setAddedAmt(Number(amount));
      setStep(4);
      setTimeout(() => { onSuccess(Number(amount)); onClose(); }, 3500);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "OTP verification failed");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (timer > 0) return;
    setLoading(true);
    try {
      await api(`/wallet/topup/initiate`, {
        method: "POST",
        params: { email, upiId, amount },
      });
      setTimer(30);
      setOtp(["", "", "", "", "", ""]);
      setError("");
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ["Amount", "UPI", "OTP", "Done"];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#1a1a1a", borderRadius: 20, padding: "32px 28px",
        width: "min(440px, 92vw)", border: "1px solid #2a2a2a",
        boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        animation: "slideUp 0.3s ease",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>
            {step < 4 ? "Add Money to Wallet" : ""}
          </h2>
          {step < 4 && (
            <button onClick={onClose} style={{
              background: "#2a2a2a", border: "none", color: "#aaa",
              width: 32, height: 32, borderRadius: "50%", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon d={icons.x} size={16} />
            </button>
          )}
        </div>

        {/* Step dots */}
        {step < 4 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 28, position: "relative" }}>
            <div style={{
              position: "absolute", top: 13, left: "10%", right: "10%",
              height: 2, background: "#2a2a2a", zIndex: 0,
            }} />
            {stepLabels.slice(0, 3).map((l, i) => (
              <div key={i} style={{ zIndex: 1 }}>
                <StepDot label={i + 1} active={step === i + 1} done={step > i + 1} />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div style={{
            background: "#ff4d4d22", border: "1px solid #ff4d4d55", color: "#ff6b6b",
            borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13,
          }}>
            {error}
          </div>
        )}

        {/* STEP 1 — Amount */}
        {step === 1 && (
          <div>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>Select or enter amount</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              {QUICK_AMOUNTS.map((q) => (
                <button key={q} onClick={() => setAmount(String(q))} style={{
                  padding: "8px 16px", borderRadius: 8,
                  background: String(amount) === String(q) ? "#FF6B00" : "#2a2a2a",
                  border: `1px solid ${String(amount) === String(q) ? "#FF6B00" : "#3a3a3a"}`,
                  color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600,
                  transition: "all 0.2s",
                }}>
                  ₹{q}
                </button>
              ))}
            </div>
            <input
              type="number" placeholder="Or enter custom amount"
              value={amount} onChange={(e) => setAmount(e.target.value)}
              style={{
                width: "100%", padding: "12px 14px", background: "#111", border: "1px solid #333",
                borderRadius: 10, color: "#fff", fontSize: 16, outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button onClick={() => {
              if (!amount || Number(amount) < 1) { setError("Enter a valid amount"); return; }
              setError(""); setStep(2);
            }} style={{
              marginTop: 20, width: "100%", padding: "14px", background: "#FF6B00",
              border: "none", borderRadius: 12, color: "#fff", fontSize: 16,
              fontWeight: 700, cursor: "pointer",
            }}>
              Continue →
            </button>
          </div>
        )}

        {/* STEP 2 — UPI Details */}
        {step === 2 && (
          <div>
            <div style={{
              background: "#FF6B0015", border: "1px solid #FF6B0033", borderRadius: 10,
              padding: "10px 14px", marginBottom: 20, display: "flex", gap: 8, alignItems: "center",
            }}>
              <Icon d={icons.shield} size={16} color="#FF6B00" />
              <span style={{ color: "#FF6B00", fontSize: 13 }}>OTP will be sent to your email for security</span>
            </div>
            <label style={{ color: "#aaa", fontSize: 12, display: "block", marginBottom: 6 }}>Email Address</label>
            <div style={{ marginBottom: 14 }}>
              <input
                type="email" placeholder="yourname@gmail.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%", padding: "12px 14px", background: "#111",
                  border: "1px solid #333", borderRadius: 10, color: "#fff",
                  fontSize: 14, outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
            <label style={{ color: "#aaa", fontSize: 12, display: "block", marginBottom: 6 }}>UPI ID</label>
            <div style={{ marginBottom: 20 }}>
              <input
                type="text" placeholder="yourname@upi"
                value={upiId} onChange={(e) => setUpiId(e.target.value)}
                style={{
                  width: "100%", padding: "12px 14px", background: "#111",
                  border: "1px solid #333", borderRadius: 10, color: "#fff",
                  fontSize: 14, outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setStep(1); setError(""); }} style={{
                flex: 1, padding: "13px", background: "#2a2a2a", border: "1px solid #3a3a3a",
                borderRadius: 12, color: "#fff", cursor: "pointer", fontSize: 15, fontWeight: 600,
              }}>
                ← Back
              </button>
              <button onClick={initiateTopup} disabled={loading} style={{
                flex: 2, padding: "13px", background: "#FF6B00", border: "none",
                borderRadius: 12, color: "#fff", cursor: loading ? "not-allowed" : "pointer",
                fontSize: 15, fontWeight: 700, opacity: loading ? 0.7 : 1,
              }}>
                {loading ? "Sending OTP…" : `Send OTP for ${fmt(amount)}`}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — OTP */}
        {step === 3 && (
          <div>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 6 }}>
              OTP sent to <span style={{ color: "#FF6B00" }}>{email}</span>
            </p>
            <p style={{ color: "#555", fontSize: 12, marginBottom: 24 }}>
              Adding <strong style={{ color: "#fff" }}>{fmt(amount)}</strong> to your InstaBuy Wallet
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24 }}>
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  maxLength={1} value={d}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKey(i, e)}
                  style={{
                    width: 44, height: 52, textAlign: "center", fontSize: 22, fontWeight: 700,
                    background: "#111", border: `2px solid ${d ? "#FF6B00" : "#333"}`,
                    borderRadius: 10, color: "#fff", outline: "none",
                    boxShadow: d ? "0 0 8px #FF6B0044" : "none", transition: "all 0.2s",
                  }}
                />
              ))}
            </div>
            <button onClick={resendOtp} style={{
              background: "none", border: "none", display: "block", margin: "0 auto 20px",
              color: timer > 0 ? "#555" : "#FF6B00", cursor: timer > 0 ? "default" : "pointer",
              fontSize: 13,
            }}>
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
            <button onClick={verifyOtp} disabled={loading} style={{
              width: "100%", padding: "14px", background: "#FF6B00", border: "none",
              borderRadius: 12, color: "#fff", cursor: loading ? "not-allowed" : "pointer",
              fontSize: 16, fontWeight: 700, opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "Verifying…" : "Verify & Add Money"}
            </button>
          </div>
        )}

        {/* STEP 4 — Success */}
        {step === 4 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg, #00c853, #69f0ae)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", fontSize: 36,
              boxShadow: "0 0 30px #00c85355",
              animation: "pulse 1s ease",
            }}>
              ✓
            </div>
            <h3 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 8px" }}>
              Money Added!
            </h3>
            <p style={{ color: "#00c853", fontSize: 28, fontWeight: 900, margin: "0 0 6px" }}>
              {fmt(addedAmt)}
            </p>
            <p style={{ color: "#555", fontSize: 13 }}>
              Transaction ID: <span style={{ color: "#888" }}>{txnId}</span>
            </p>
            <p style={{ color: "#444", fontSize: 12, marginTop: 16 }}>Closing automatically…</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.08); } }
      `}</style>
    </div>
  );
}

// ─── TRANSACTION ITEM ─────────────────────────────────────────────────────────
const TxnItem = ({ txn }) => {
  const isCredit = txn.type === "CREDIT" || txn.transactionType === "WALLET_TOPUP";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 0", borderBottom: "1px solid #1e1e1e",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: isCredit ? "#00c85320" : "#FF6B0020",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon d={isCredit ? icons.plus : icons.arrow} size={18}
          color={isCredit ? "#00c853" : "#FF6B00"} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: "#eee", fontSize: 14, fontWeight: 600 }}>
          {txn.description || (isCredit ? "Wallet Top-up" : "Payment")}
        </div>
        <div style={{ color: "#555", fontSize: 12, marginTop: 2 }}>
          {txn.createdAt
            ? new Date(txn.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
            : "—"}
        </div>
      </div>
      <div style={{
        color: isCredit ? "#00c853" : "#FF6B00", fontWeight: 800, fontSize: 15,
      }}>
        {isCredit ? "+" : "-"}{fmt(txn.amount)}
      </div>
    </div>
  );
};

// ─── QUICK ACTION BUTTON ──────────────────────────────────────────────────────
const QuickBtn = ({ icon, label }) => (
  <button style={{
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
    padding: "16px 12px", background: "#1a1a1a", border: "1px solid #2a2a2a",
    borderRadius: 14, cursor: "pointer", flex: 1, minWidth: 70,
    transition: "all 0.2s",
  }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF6B0055"; e.currentTarget.style.background = "#FF6B0010"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.background = "#1a1a1a"; }}
  >
    <div style={{
      width: 44, height: 44, borderRadius: 12, background: "#FF6B0015",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Icon d={icon} size={20} color="#FF6B00" />
    </div>
    <span style={{ color: "#aaa", fontSize: 11, textAlign: "center", lineHeight: 1.3 }}>{label}</span>
  </button>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function MyWallet() {
  const USER_ID = getUserId(); // ✅ reads from localStorage via api.js

  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState("ALL");
  const [showMore, setShowMore] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(true);

  // ── Fetch balance & transactions on mount ──
  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const fetchBalance = async () => {
    setLoadingBalance(true);
    try {
      const data = await api(`/wallet/balance`, {
        params: { userId: USER_ID },
      });
      setBalance(typeof data === "object" ? data.walletBalance ?? data.balance : data);
    } catch {
      setBalance(0);
    } finally {
      setLoadingBalance(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const data = await api(`/history`, {
        params: { userId: USER_ID },
      });
      setTransactions(Array.isArray(data) ? data : data?.data || []);
    } catch {
      setTransactions([]);
    }
  };

  const handleTopupSuccess = (amount) => {
    setBalance((prev) => (Number(prev || 0) + amount));
    fetchTransactions();
  };

  const filtered = transactions.filter((t) => {
    if (tab === "ALL") return true;
    const isCredit = t.type === "CREDIT" || t.transactionType === "WALLET_TOPUP";
    if (tab === "CREDITS") return isCredit;
    if (tab === "DEBITS") return !isCredit;
    return true;
  });

  const visible = showMore ? filtered : filtered.slice(0, 5);

  const totalAdded = transactions
    .filter((t) => t.type === "CREDIT" || t.transactionType === "WALLET_TOPUP")
    .reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalSpent = transactions
    .filter((t) => t.type === "DEBIT")
    .reduce((s, t) => s + Number(t.amount || 0), 0);

  return (
    <div style={{
      minHeight: "100vh", background: "#111", color: "#fff",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* ── NAV ── */}
      <div style={{
        background: "#FF6B00", padding: "0 20px",
        display: "flex", alignItems: "center", height: 56, gap: 12,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <Icon d={icons.wallet} size={22} color="#fff" />
        <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>My Wallet</span>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px 80px" }}>

        {/* ── BALANCE CARD ── */}
        <div style={{
          background: "linear-gradient(135deg, #1e1008 0%, #2a1500 40%, #1a0a00 100%)",
          borderRadius: 20, padding: "28px 24px 24px",
          border: "1px solid #FF6B0033", marginBottom: 20,
          position: "relative", overflow: "hidden",
        }}>
          {[200, 140, 90].map((s, i) => (
            <div key={i} style={{
              position: "absolute", right: -s / 3, top: -s / 3,
              width: s, height: s, borderRadius: "50%",
              border: "1px solid #FF6B00" + ["33", "22", "15"][i],
              pointerEvents: "none",
            }} />
          ))}

          <p style={{ color: "#FF6B0099", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 8px" }}>
            InstaBuy Wallet Balance
          </p>
          <h1 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 4px", letterSpacing: -1 }}>
            {loadingBalance ? (
              <span style={{ color: "#555", fontSize: 24 }}>Loading…</span>
            ) : fmt(balance)}
          </h1>
          <p style={{ color: "#FF6B0088", fontSize: 12, margin: "0 0 24px" }}>Available to spend</p>

          <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Total Added", val: totalAdded, color: "#00c853" },
              { label: "Total Spent", val: totalSpent, color: "#FF6B00" },
            ].map(({ label, val, color }) => (
              <div key={label} style={{
                flex: 1, background: "#ffffff08", borderRadius: 12, padding: "10px 14px",
              }}>
                <p style={{ color: "#666", fontSize: 11, margin: "0 0 4px" }}>{label}</p>
                <p style={{ color, fontWeight: 800, fontSize: 16, margin: 0 }}>{fmt(val)}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => setShowModal(true)}
              style={{
                flex: 1, padding: "13px", background: "#FF6B00", border: "none",
                borderRadius: 12, color: "#fff", cursor: "pointer",
                fontWeight: 700, fontSize: 15, display: "flex",
                alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <Icon d={icons.plus} size={18} /> Add Money
            </button>
            <button style={{
              flex: 1, padding: "13px", background: "transparent",
              border: "1px solid #FF6B0055", borderRadius: 12, color: "#FF6B00",
              cursor: "pointer", fontWeight: 700, fontSize: 15,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <Icon d={icons.arrow} size={18} /> Transfer
            </button>
          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: "#666", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
            Quick Actions
          </p>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
            <QuickBtn icon={icons.history} label="Order History" />
            <QuickBtn icon={icons.tag} label="Cashbacks" />
            <QuickBtn icon={icons.gift} label="Gift Cards" />
            <QuickBtn icon={icons.truck} label="Free Delivery" />
            <QuickBtn icon={icons.refresh} label="Refunds" />
          </div>
        </div>

        {/* ── PROMO BANNER ── */}
        <div style={{
          background: "linear-gradient(90deg, #1a0a00, #2d1100)",
          border: "1px solid #FF6B0033", borderRadius: 14, padding: "14px 18px",
          display: "flex", alignItems: "center", gap: 14, marginBottom: 20,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "linear-gradient(135deg, #FF6B00, #ffc107)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, flexShrink: 0,
          }}>🎁</div>
          <div>
            <p style={{ color: "#FF6B00", fontWeight: 700, fontSize: 14, margin: 0 }}>
              Add ₹1000+, get 2% cashback
            </p>
            <p style={{ color: "#666", fontSize: 12, margin: "3px 0 0" }}>
              Valid on all wallet top-ups today
            </p>
          </div>
        </div>

        {/* ── REWARDS ── */}
        <div style={{
          background: "linear-gradient(135deg, #0d0d20, #1a1a35)",
          border: "1px solid #6c63ff33", borderRadius: 16, padding: "18px 20px", marginBottom: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div>
              <span style={{ color: "#ffd700", fontWeight: 800, fontSize: 15 }}>⭐ Gold Member</span>
              <p style={{ color: "#555", fontSize: 12, margin: "2px 0 0" }}>₹850 more to reach Platinum</p>
            </div>
            <span style={{ background: "#ffd70020", color: "#ffd700", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>
              1,150 pts
            </span>
          </div>
          <div style={{ background: "#1a1a1a", borderRadius: 99, height: 6, overflow: "hidden" }}>
            <div style={{
              width: "57.5%", height: "100%",
              background: "linear-gradient(90deg, #ffd700, #ffb300)",
              borderRadius: 99, transition: "width 1s ease",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ color: "#555", fontSize: 11 }}>Gold: ₹500</span>
            <span style={{ color: "#555", fontSize: 11 }}>Platinum: ₹2000</span>
          </div>
        </div>

        {/* ── TRANSACTION HISTORY ── */}
        <div style={{
          background: "#1a1a1a", borderRadius: 16, padding: "20px",
          border: "1px solid #2a2a2a",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 16, margin: 0 }}>Transactions</h3>
            <button onClick={fetchTransactions} style={{
              background: "none", border: "none", color: "#FF6B00", cursor: "pointer", fontSize: 12,
            }}>
              Refresh
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["ALL", "CREDITS", "DEBITS"].map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "6px 14px", borderRadius: 99,
                background: tab === t ? "#FF6B00" : "#2a2a2a",
                border: "none", color: tab === t ? "#fff" : "#888",
                cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s",
              }}>
                {t}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 0", color: "#444" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
              <p style={{ margin: 0 }}>No transactions yet</p>
            </div>
          ) : (
            visible.map((t, i) => <TxnItem key={i} txn={t} />)
          )}

          {filtered.length > 5 && (
            <button onClick={() => setShowMore(!showMore)} style={{
              width: "100%", marginTop: 16, padding: "10px", background: "#2a2a2a",
              border: "1px solid #3a3a3a", borderRadius: 10, color: "#FF6B00",
              cursor: "pointer", fontSize: 14, fontWeight: 600,
            }}>
              {showMore ? "Show Less ▲" : `Show More (${filtered.length - 5}) ▼`}
            </button>
          )}
        </div>
      </div>

      {/* ── TOP-UP MODAL ── */}
      {showModal && (
        <TopUpModal
          onClose={() => setShowModal(false)}
          onSuccess={handleTopupSuccess}
        />
      )}
    </div>
  );
}
