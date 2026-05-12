import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../config/api";
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
 
  .auth-root {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: #fefdfb;
    position: relative;
    overflow: hidden;
  }
 
  /* ── Left Panel ── */
  .auth-left {
    display: none;
    position: relative;
    width: 52%;
    overflow: hidden;
  }
  @media(min-width:900px){ .auth-left { display: flex; flex-direction: column; justify-content: flex-end; } }
 
  .auth-left-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(160deg, #f97316 0%, #ea580c 45%, #9a3412 100%);
  }
 
  /* SVG pattern overlay */
  .auth-left-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.08;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
 
  /* Shopping bag illustration */
  .auth-illustration {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -56%);
  }
  .auth-illustration svg { width: 260px; height: 260px; filter: drop-shadow(0 40px 80px rgba(0,0,0,0.35)); }
 
  /* Floating tags */
  .float-tag {
    position: absolute;
    background: rgba(255,255,255,0.18);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(255,255,255,0.28);
    border-radius: 40px;
    padding: 10px 18px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    animation: authFloat 4s ease-in-out infinite;
  }
  .float-tag-dot { width: 8px; height: 8px; border-radius: 50%; background: #fff; }
  .float-tag.t1 { top: 22%; left: 8%; animation-delay: 0s; }
  .float-tag.t2 { top: 32%; right: 6%; animation-delay: 1.3s; }
  .float-tag.t3 { bottom: 30%; left: 12%; animation-delay: 2.6s; }
 
  @keyframes authFloat {
    0%,100%{ transform: translateY(0); }
    50%{ transform: translateY(-12px); }
  }
 
  .auth-left-footer {
    position: relative;
    z-index: 2;
    padding: 2.5rem 3rem;
    color: rgba(255,255,255,0.9);
  }
  .auth-left-footer h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem;
    font-weight: 800;
    color: #fff;
    line-height: 1.2;
    margin-bottom: 0.6rem;
  }
  .auth-left-footer p { font-size: 15px; font-weight: 300; line-height: 1.6; opacity: .85; }
 
  /* ── Right Panel ── */
  .auth-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
    position: relative;
  }
 
  /* subtle dot pattern bg */
  .auth-right::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, #f97316 1px, transparent 1px);
    background-size: 28px 28px;
    opacity: 0.04;
  }
 
  .auth-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
  }
 
  /* Logo */
  .auth-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 2.5rem;
    text-decoration: none;
  }
  .auth-logo-icon { color: #f97316; }
  .auth-logo-name { font-family: 'DM Sans',sans-serif; font-size: 22px; font-weight: 700; color: #1c1917; }
 
  /* Heading */
  .auth-heading {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    font-weight: 800;
    color: #1c1917;
    margin-bottom: 0.4rem;
    line-height: 1.2;
  }
  .auth-sub {
    font-size: 14px;
    color: #78716c;
    margin-bottom: 2rem;
    font-weight: 400;
  }
 
  /* Fields */
  .auth-field { margin-bottom: 1.1rem; }
  .auth-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .07em;
    color: #57534e;
    margin-bottom: 6px;
  }
  .auth-input {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid #e7e5e4;
    border-radius: 12px;
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    background: #fff;
    color: #1c1917;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .auth-input:focus {
    border-color: #f97316;
    box-shadow: 0 0 0 3px rgba(249,115,22,.12);
  }
  .auth-input::placeholder { color: #c4c0bb; }
 
  /* Forgot row */
  .auth-row {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1.5rem;
    margin-top: -0.4rem;
  }
  .auth-link {
    font-size: 13px;
    color: #f97316;
    cursor: pointer;
    font-weight: 500;
    background: none;
    border: none;
    padding: 0;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .auth-link:hover { color: #ea580c; }
 
  /* Primary button */
  .auth-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #f97316, #ea580c);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: transform .18s, box-shadow .18s, opacity .18s;
    box-shadow: 0 4px 20px rgba(249,115,22,.38);
    letter-spacing: .01em;
  }
  .auth-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(249,115,22,.45); }
  .auth-btn:active { transform: translateY(0); opacity: .9; }
 
  /* Divider */
  .auth-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 1.5rem 0;
    color: #c4c0bb;
    font-size: 13px;
  }
  .auth-divider::before, .auth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e7e5e4;
  }
 
  /* Social buttons */
  .auth-social-row { display: flex; gap: 10px; }
  .auth-social-btn {
    flex: 1;
    padding: 11px;
    border: 1.5px solid #e7e5e4;
    border-radius: 12px;
    background: #fff;
    font-size: 14px;
    font-weight: 500;
    color: #1c1917;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: 'DM Sans', sans-serif;
    transition: border-color .2s, background .2s;
  }
  .auth-social-btn:hover { border-color: #f97316; background: #fff7ed; }
 
  /* Footer text */
  .auth-footer-text {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 14px;
    color: #78716c;
  }
  .auth-footer-text span {
    color: #f97316;
    font-weight: 600;
    cursor: pointer;
  }
  .auth-footer-text span:hover { text-decoration: underline; }
 
  /* Alert */
  .auth-alert {
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .auth-alert.error { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
  .auth-alert.success { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
`;
 
function BagSVG() {
  return (
    <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="130" cy="220" rx="90" ry="18" fill="rgba(0,0,0,0.18)" />
      <rect x="50" y="90" width="160" height="130" rx="24" fill="white" fillOpacity="0.22" stroke="white" strokeWidth="2.5"/>
      <rect x="65" y="100" width="130" height="110" rx="18" fill="white" fillOpacity="0.12"/>
      <path d="M94 90 C94 62 110 48 130 48 C150 48 166 62 166 90" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <circle cx="105" cy="130" r="8" fill="white" fillOpacity="0.6"/>
      <circle cx="155" cy="130" r="8" fill="white" fillOpacity="0.6"/>
      <path d="M105 152 Q130 168 155 152" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <rect x="78" y="86" width="16" height="10" rx="5" fill="white" fillOpacity="0.55"/>
      <rect x="166" y="86" width="16" height="10" rx="5" fill="white" fillOpacity="0.55"/>
    </svg>
  );
}
 
function LogoIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="auth-logo-icon">
      <rect x="5" y="11" width="22" height="18" rx="4" fill="#f97316"/>
      <path d="M11 11C11 7.686 13.239 5 16 5C18.761 5 21 7.686 21 11" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <circle cx="12" cy="18" r="1.5" fill="white"/>
      <circle cx="20" cy="18" r="1.5" fill="white"/>
      <path d="M12 22.5 Q16 25 20 22.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
 
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}
 
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const handleLogin = async () => {
    if (!email || !password) { setAlert({ type: "error", msg: "Please fill in all fields." }); return; }
    setLoading(true); setAlert(null);
    try {
      const response = await API.post("/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.name);
      localStorage.setItem("userId",   response.data.userId);
      setAlert({ type: "success", msg: "Login successful! Redirecting…" });
      setTimeout(() => navigate("/home"), 900);
    } catch {
      setAlert({ type: "error", msg: "Invalid email or password. Please try again." });
    } finally { setLoading(false); }
  };
 
  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        {/* Left Panel */}
        <div className="auth-left">
          <div className="auth-left-bg" />
          <div className="auth-left-pattern" />
          <div className="auth-illustration"><BagSVG /></div>
          <div className="float-tag t1"><div className="float-tag-dot" />Free Delivery</div>
          <div className="float-tag t2"><div className="float-tag-dot" />10k+ Products</div>
          <div className="float-tag t3"><div className="float-tag-dot" />Secure Payments</div>
          <div className="auth-left-footer">
            <h2>Shop smarter,<br/>not harder.</h2>
            <p>Discover thousands of products at unbeatable prices, delivered right to your door.</p>
          </div>
        </div>
 
        {/* Right Panel */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-logo">
              <LogoIcon />
              <span className="auth-logo-name">InstaBuy</span>
            </div>
 
            <h1 className="auth-heading">Welcome back </h1>
            <p className="auth-sub">Sign in to your account to continue shopping</p>
 
            {alert && <div className={`auth-alert ${alert.type}`}>{alert.msg}</div>}
 
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
 
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input className="auth-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
 
            <div className="auth-row">
              <button className="auth-link" onClick={() => navigate("/forgot")}>Forgot password?</button>
            </div>
 
            <button className="auth-btn" onClick={handleLogin} disabled={loading}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
 
           
 
            <p className="auth-footer-text">
              Don't have an account?{" "}
              <span onClick={() => navigate("/signup")}>Create one free</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}