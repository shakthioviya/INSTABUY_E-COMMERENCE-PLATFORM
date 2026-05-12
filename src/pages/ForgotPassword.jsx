import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../config/api";
 
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
 
  .auth-right { flex:1; display:flex; align-items:center; justify-content:center; padding:2rem 1.5rem; position:relative; }
  .auth-right::before { content:''; position:absolute; inset:0; background-image:radial-gradient(circle,#f97316 1px,transparent 1px); background-size:28px 28px; opacity:.04; }
 
  .auth-card { position:relative; z-index:1; width:100%; max-width:420px; }
 
  .auth-logo { display:flex; align-items:center; gap:10px; margin-bottom:2.5rem; }
  .auth-logo-icon { color:#f97316; }
  .auth-logo-name { font-size:22px; font-weight:700; color:#1c1917; }
 
  /* Step indicator */
  .step-bar { display:flex; align-items:center; gap:0; margin-bottom:2rem; }
  .step-item { display:flex; align-items:center; gap:8px; }
  .step-circle { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; transition:all .3s; }
  .step-circle.done { background:#f97316; color:#fff; }
  .step-circle.active { background:#fff7ed; color:#f97316; border:2px solid #f97316; }
  .step-circle.pending { background:#f5f5f4; color:#a8a29e; }
  .step-label { font-size:12px; font-weight:500; color:#78716c; white-space:nowrap; }
  .step-line { flex:1; height:2px; background:#e7e5e4; margin:0 8px; min-width:24px; }
  .step-line.done { background:#f97316; }
 
  .auth-icon-box { width:72px; height:72px; border-radius:20px; background:#fff7ed; display:flex; align-items:center; justify-content:center; margin-bottom:1.5rem; }
 
  .auth-heading { font-family:'Playfair Display',serif; font-size:2rem; font-weight:800; color:#1c1917; margin-bottom:.4rem; line-height:1.2; }
  .auth-sub { font-size:14px; color:#78716c; margin-bottom:1.8rem; line-height:1.6; }
  .auth-sub strong { color:#1c1917; }
 
  .auth-field { margin-bottom:1.1rem; }
  .auth-label { display:block; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:.07em; color:#57534e; margin-bottom:6px; }
  .auth-input { width:100%; padding:13px 16px; border:1.5px solid #e7e5e4; border-radius:12px; font-size:15px; font-family:'DM Sans',sans-serif; background:#fff; color:#1c1917; outline:none; transition:border-color .2s, box-shadow .2s; }
  .auth-input:focus { border-color:#f97316; box-shadow:0 0 0 3px rgba(249,115,22,.12); }
  .auth-input::placeholder { color:#c4c0bb; }
 
  .auth-btn { width:100%; padding:14px; background:linear-gradient(135deg,#f97316,#ea580c); color:#fff; border:none; border-radius:12px; font-size:16px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:transform .18s, box-shadow .18s, opacity .18s; box-shadow:0 4px 20px rgba(249,115,22,.38); }
  .auth-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(249,115,22,.45); }
  .auth-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; }
 
  .auth-btn-ghost { width:100%; padding:13px; background:transparent; border:1.5px solid #e7e5e4; border-radius:12px; font-size:15px; font-weight:500; color:#78716c; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .2s; margin-top:.75rem; display:flex; align-items:center; justify-content:center; gap:6px; }
  .auth-btn-ghost:hover { border-color:#f97316; color:#f97316; }
 
  .auth-alert { padding:10px 14px; border-radius:10px; font-size:13px; font-weight:500; margin-bottom:1rem; display:flex; align-items:center; gap:8px; }
  .auth-alert.error { background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; }
  .auth-alert.success { background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; }
 
  /* strength */
  .strength-bar { display:flex; gap:4px; margin-top:6px; }
  .strength-seg { flex:1; height:3px; border-radius:4px; background:#e7e5e4; transition:background .3s; }
  .strength-seg.active-weak { background:#ef4444; }
  .strength-seg.active-medium { background:#f59e0b; }
  .strength-seg.active-strong { background:#22c55e; }
 
  .auth-footer-text { text-align:center; margin-top:1.5rem; font-size:14px; color:#78716c; }
  .auth-footer-text span { color:#f97316; font-weight:600; cursor:pointer; }
  .auth-footer-text span:hover { text-decoration:underline; }
 
  /* Success state */
  .success-state { text-align:center; padding: 1rem 0; }
  .success-icon { width:80px; height:80px; border-radius:50%; background:linear-gradient(135deg,#f97316,#ea580c); display:flex; align-items:center; justify-content:center; margin:0 auto 1.5rem; box-shadow:0 8px 32px rgba(249,115,22,.35); animation:popIn .4s cubic-bezier(.34,1.56,.64,1); }
  @keyframes popIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
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
  return score;
}
 
const STEPS = ["Email", "New Password", "Done"];
 
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ email:"", password:"", confirmPassword:"" });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
 
  const strength = getPasswordStrength(data.password);
  const strengthColor = ["","active-weak","active-medium","active-strong","active-strong"][strength];
 
  const set = (k) => (e) => setData(d => ({ ...d, [k]: e.target.value }));
 
  const handleReset = async () => {
    if (!data.email) { setAlert({ type:"error", msg:"Please enter your email." }); return; }
    if (!data.password) { setAlert({ type:"error", msg:"Please enter a new password." }); return; }
    if (data.password !== data.confirmPassword) { setAlert({ type:"error", msg:"Passwords don't match." }); return; }
    setLoading(true); setAlert(null);
    try {
      const res = await API.post("/forgot-password", { email: data.email, password: data.password });
      setAlert({ type:"success", msg: res.data.message || "Password updated!" });
      setDone(true);
    } catch { setAlert({ type:"error", msg:"Error resetting password. Please try again." }); }
    finally { setLoading(false); }
  };
 
  const goNext = () => {
    if (step === 0 && !data.email) { setAlert({ type:"error", msg:"Please enter your email address." }); return; }
    setAlert(null);
    setStep(s => s + 1);
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
            <h2>No worries,<br/>we've got you.</h2>
            <p>Reset your password quickly and get back to the best deals on InstaBuy.</p>
          </div>
        </div>
 
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-logo">
              <LogoIcon />
              <span className="auth-logo-name">InstaBuy</span>
            </div>
 
            {/* Step bar */}
            <div className="step-bar">
              {STEPS.map((label, i) => (
                <React.Fragment key={i}>
                  <div className="step-item">
                    <div className={`step-circle ${done && i === 2 ? "done" : i < step ? "done" : i === step ? "active" : "pending"}`}>
                      {i < step || (done && i === 2) ? "✓" : i + 1}
                    </div>
                    <span className="step-label">{label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`step-line ${i < step ? "done" : ""}`} />}
                </React.Fragment>
              ))}
            </div>
 
            {alert && <div className={`auth-alert ${alert.type}`}>{alert.msg}</div>}
 
            {done ? (
              <div className="success-state">
                <div className="success-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h1 className="auth-heading" style={{marginBottom:".5rem"}}>Password reset!</h1>
                <p className="auth-sub">Your password has been updated successfully. You can now sign in with your new password.</p>
                <button className="auth-btn" onClick={() => navigate("/login")}>Back to Sign In →</button>
              </div>
            ) : step === 0 ? (
              <>
                <div className="auth-icon-box">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="3"/><polyline points="22,4 12,13 2,4"/>
                  </svg>
                </div>
                <h1 className="auth-heading">Forgot password? </h1>
                <p className="auth-sub">Enter your registered email address and we'll help you reset your password.</p>
                <div className="auth-field">
                  <label className="auth-label">Email Address</label>
                  <input className="auth-input" type="email" placeholder="you@example.com" value={data.email} onChange={set("email")} />
                </div>
                <button className="auth-btn" onClick={goNext}>Continue →</button>
              </>
            ) : (
              <>
                <div className="auth-icon-box">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <h1 className="auth-heading">New password </h1>
                <p className="auth-sub">Resetting password for <strong>{data.email}</strong></p>
                <div className="auth-field">
                  <label className="auth-label">New Password</label>
                  <input className="auth-input" type="password" placeholder="••••••••" value={data.password} onChange={set("password")} />
                  {data.password && (
                    <>
                      <div className="strength-bar">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`strength-seg ${i <= strength ? strengthColor : ""}`} />
                        ))}
                      </div>
                      <span style={{fontSize:11,color:"#78716c",marginTop:3,display:"block"}}>
                        {["","Weak","Fair","Good","Strong"][strength]}
                      </span>
                    </>
                  )}
                </div>
                <div className="auth-field">
                  <label className="auth-label">Confirm New Password</label>
                  <input className="auth-input" type="password" placeholder="••••••••" value={data.confirmPassword} onChange={set("confirmPassword")} />
                </div>
                <button className="auth-btn" onClick={handleReset} disabled={loading}>
                  {loading ? "Resetting…" : "Reset Password →"}
                </button>
                <button className="auth-btn-ghost" onClick={() => { setStep(0); setAlert(null); }}>
                  ← Change Email
                </button>
              </>
            )}
 
            {!done && (
              <p className="auth-footer-text">
                Remember your password?{" "}
                <span onClick={() => navigate("/login")}>Sign in</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
 
}