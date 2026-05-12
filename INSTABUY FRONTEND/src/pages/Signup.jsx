import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../config/api";
 
/* Reusing the same styles as Login — import from a shared file in your project */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
 
  .auth-root { min-height:100vh; display:flex; font-family:'DM Sans',sans-serif; background:#fefdfb; position:relative; overflow:hidden; }
 
  .auth-left { display:none; position:relative; width:52%; overflow:hidden; }
  @media(min-width:900px){ .auth-left { display:flex; flex-direction:column; justify-content:flex-end; } }
  .auth-left-bg { position:absolute; inset:0; background:linear-gradient(160deg,#f97316 0%,#ea580c 45%,#9a3412 100%); }
  .auth-left-pattern { position:absolute; inset:0; opacity:.08;
    background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
 
  .auth-illustration { position:absolute; top:50%; left:50%; transform:translate(-50%,-56%); }
  .auth-illustration svg { width:260px; height:260px; filter:drop-shadow(0 40px 80px rgba(0,0,0,.35)); }
 
  .float-tag { position:absolute; background:rgba(255,255,255,.18); backdrop-filter:blur(14px); border:1px solid rgba(255,255,255,.28); border-radius:40px; padding:10px 18px; display:flex; align-items:center; gap:8px; color:#fff; font-size:13px; font-weight:500; animation:authFloat 4s ease-in-out infinite; }
  .float-tag-dot { width:8px; height:8px; border-radius:50%; background:#fff; }
  .float-tag.t1 { top:22%; left:8%; animation-delay:0s; }
  .float-tag.t2 { top:32%; right:6%; animation-delay:1.3s; }
  .float-tag.t3 { bottom:30%; left:12%; animation-delay:2.6s; }
  @keyframes authFloat { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-12px); } }
 
  .auth-left-footer { position:relative; z-index:2; padding:2.5rem 3rem; color:rgba(255,255,255,.9); }
  .auth-left-footer h2 { font-family:'Playfair Display',serif; font-size:2.4rem; font-weight:800; color:#fff; line-height:1.2; margin-bottom:.6rem; }
  .auth-left-footer p { font-size:15px; font-weight:300; line-height:1.6; opacity:.85; }
 
  .auth-right { flex:1; display:flex; align-items:center; justify-content:center; padding:2rem 1.5rem; position:relative; overflow-y:auto; }
  .auth-right::before { content:''; position:absolute; inset:0; background-image:radial-gradient(circle,#f97316 1px,transparent 1px); background-size:28px 28px; opacity:.04; }
 
  .auth-card { position:relative; z-index:1; width:100%; max-width:420px; padding: 2rem 0; }
 
  .auth-logo { display:flex; align-items:center; gap:10px; margin-bottom:2rem; }
  .auth-logo-icon { color:#f97316; }
  .auth-logo-name { font-size:22px; font-weight:700; color:#1c1917; }
 
  .auth-heading { font-family:'Playfair Display',serif; font-size:2rem; font-weight:800; color:#1c1917; margin-bottom:.4rem; line-height:1.2; }
  .auth-sub { font-size:14px; color:#78716c; margin-bottom:1.6rem; }
 
  /* 2-column grid for fields */
  .auth-fields-grid { display:grid; grid-template-columns:1fr 1fr; gap:0 1rem; }
  .auth-fields-grid .full-col { grid-column:1/-1; }
 
  .auth-field { margin-bottom:1rem; }
  .auth-label { display:block; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:.07em; color:#57534e; margin-bottom:6px; }
  .auth-input { width:100%; padding:12px 15px; border:1.5px solid #e7e5e4; border-radius:12px; font-size:15px; font-family:'DM Sans',sans-serif; background:#fff; color:#1c1917; outline:none; transition:border-color .2s, box-shadow .2s; }
  .auth-input:focus { border-color:#f97316; box-shadow:0 0 0 3px rgba(249,115,22,.12); }
  .auth-input::placeholder { color:#c4c0bb; }
 
  /* password strength */
  .strength-bar { display:flex; gap:4px; margin-top:6px; }
  .strength-seg { flex:1; height:3px; border-radius:4px; background:#e7e5e4; transition:background .3s; }
  .strength-seg.active-weak { background:#ef4444; }
  .strength-seg.active-medium { background:#f59e0b; }
  .strength-seg.active-strong { background:#22c55e; }
 
  .auth-btn { width:100%; padding:14px; background:linear-gradient(135deg,#f97316,#ea580c); color:#fff; border:none; border-radius:12px; font-size:16px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:transform .18s, box-shadow .18s, opacity .18s; box-shadow:0 4px 20px rgba(249,115,22,.38); margin-top:.5rem; }
  .auth-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(249,115,22,.45); }
  .auth-btn:active { transform:translateY(0); opacity:.9; }
  .auth-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; }
 
  .auth-footer-text { text-align:center; margin-top:1.2rem; font-size:14px; color:#78716c; }
  .auth-footer-text span { color:#f97316; font-weight:600; cursor:pointer; }
  .auth-footer-text span:hover { text-decoration:underline; }
 
  .auth-terms { font-size:12px; color:#a8a29e; text-align:center; margin-top:.8rem; line-height:1.5; }
  .auth-terms a { color:#f97316; text-decoration:underline; }
 
  .auth-alert { padding:10px 14px; border-radius:10px; font-size:13px; font-weight:500; margin-bottom:1rem; display:flex; align-items:center; gap:8px; }
  .auth-alert.error { background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; }
  .auth-alert.success { background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; }
`;
 
function BagSVG() {
  return (
    <svg viewBox="0 0 260 260" fill="none">
      <ellipse cx="130" cy="220" rx="90" ry="18" fill="rgba(0,0,0,0.18)"/>
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
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="auth-logo-icon">
      <rect x="5" y="11" width="22" height="18" rx="4" fill="#f97316"/>
      <path d="M11 11C11 7.686 13.239 5 16 5C18.761 5 21 7.686 21 11" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <circle cx="12" cy="18" r="1.5" fill="white"/>
      <circle cx="20" cy="18" r="1.5" fill="white"/>
      <path d="M12 22.5 Q16 25 20 22.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
 
function getPasswordStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0–4
}
 
export default function Signup() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name:"", email:"", phone:"", password:"", confirmPassword:"" });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const strength = getPasswordStrength(user.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "active-weak", "active-medium", "active-strong", "active-strong"][strength];
 
  const set = (k) => (e) => setUser(u => ({ ...u, [k]: e.target.value }));
 
  const handleSignup = async () => {
    if (!user.name || !user.email || !user.password) { setAlert({ type:"error", msg:"Please fill in all required fields." }); return; }
    if (user.password !== user.confirmPassword) { setAlert({ type:"error", msg:"Passwords don't match." }); return; }
    if (strength < 2) { setAlert({ type:"error", msg:"Please choose a stronger password." }); return; }
    setLoading(true); setAlert(null);
    try {
      const res = await API.post("/register", user);
      if (res.data.error) { setAlert({ type:"error", msg: res.data.error }); }
      else { setAlert({ type:"success", msg:"Account created! Redirecting to login…" }); setTimeout(() => navigate("/login"), 1000); }
    } catch { setAlert({ type:"error", msg:"Registration failed. Please try again." }); }
    finally { setLoading(false); }
  };
 
  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        <div className="auth-left">
          <div className="auth-left-bg" />
          <div className="auth-left-pattern" />
          <div className="auth-illustration"><BagSVG /></div>
          <div className="float-tag t1"><div className="float-tag-dot" />Free Delivery</div>
          <div className="float-tag t2"><div className="float-tag-dot" />10k+ Products</div>
          <div className="float-tag t3"><div className="float-tag-dot" />Secure Payments</div>
          <div className="auth-left-footer">
            <h2>Join thousands of happy shoppers.</h2>
            <p>Create your free account and start exploring the best deals today.</p>
          </div>
        </div>
 
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-logo">
              <LogoIcon />
              <span className="auth-logo-name">InstaBuy</span>
            </div>
 
            <h1 className="auth-heading">Create account</h1>
            <p className="auth-sub">It's free and only takes a minute</p>
 
            {alert && <div className={`auth-alert ${alert.type}`}>{alert.msg}</div>}
 
            <div className="auth-fields-grid">
              <div className="auth-field full-col">
                <label className="auth-label">Full Name</label>
                <input className="auth-input" placeholder="Jane Doe" onChange={set("name")} />
              </div>
              <div className="auth-field full-col">
                <label className="auth-label">Email Address</label>
                <input className="auth-input" type="email" placeholder="you@example.com" onChange={set("email")} />
              </div>
              <div className="auth-field full-col">
                <label className="auth-label">Phone Number</label>
                <input className="auth-input" type="tel" placeholder="+91 99999 00000" onChange={set("phone")} />
              </div>
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <input className="auth-input" type="password" placeholder="••••••••" onChange={set("password")} />
                {user.password && (
                  <>
                    <div className="strength-bar">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`strength-seg ${i <= strength ? strengthColor : ""}`} />
                      ))}
                    </div>
                    <span style={{fontSize:11,color:"#78716c",marginTop:3,display:"block"}}>{strengthLabel}</span>
                  </>
                )}
              </div>
              <div className="auth-field">
                <label className="auth-label">Confirm Password</label>
                <input className="auth-input" type="password" placeholder="••••••••" onChange={set("confirmPassword")} />
              </div>
            </div>
 
            <button className="auth-btn" onClick={handleSignup} disabled={loading}>
              {loading ? "Creating Account…" : "Create Account →"}
            </button>
 
            <p className="auth-terms">
              By registering, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>
 
            <p className="auth-footer-text">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>Sign in</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}