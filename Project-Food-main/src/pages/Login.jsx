import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { login as loginService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try { const d = await loginService(email,password); login(d.user); navigate(redirectTo, { replace: true }); }
    catch (err) { setError(err.response?.data?.message||"Login failed"); }
    finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <div style={S.left}>
        <div style={S.leftInner}>
          <div style={S.logo}>🍊 Zesto</div>
          <h1 style={S.headline}>Great food,<br/>at your door.</h1>
          <p style={S.sub}>Order from hundreds of restaurants and get delivery in minutes.</p>
          <div style={S.pills}>
            {["🍔 Burgers","🍕 Pizza","🍣 Sushi","🌮 Tacos","🍛 Curry"].map(c=>(
              <span key={c} style={S.pill}>{c}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={S.right}>
        <div style={S.card}>
          <h2 style={S.title}>Welcome back</h2>
          <p style={S.cardSub}>Sign in to continue</p>
          {error && <div style={S.err}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <label style={S.label}>Email address</label>
            <input style={S.input} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            <label style={S.label}>Password</label>
            <input style={S.input} type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required />
            <button style={{ ...S.btn, opacity:loading?.7:1 }} type="submit" disabled={loading}>{loading?"Signing in…":"Sign In"}</button>
          </form>
          <p style={S.foot}>Don't have an account? <Link to="/signup" style={S.footLink}>Create one →</Link></p>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight:"100vh", display:"grid", gridTemplateColumns:"1fr 1fr" },
  left: { background:"linear-gradient(135deg,#e8622a 0%,#c44d1a 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:"60px 48px" },
  leftInner: { maxWidth:"420px" },
  logo: { fontFamily:"'Fraunces',serif", fontSize:"1.8rem", fontWeight:800, color:"#fff", marginBottom:"40px" },
  headline: { fontFamily:"'Fraunces',serif", fontSize:"clamp(2rem,3.5vw,3rem)", fontWeight:900, color:"#fff", lineHeight:1.15, marginBottom:"20px" },
  sub: { color:"rgba(255,255,255,0.8)", fontSize:"1rem", lineHeight:1.6, marginBottom:"32px" },
  pills: { display:"flex", flexWrap:"wrap", gap:"8px" },
  pill: { background:"rgba(255,255,255,0.15)", color:"#fff", padding:"7px 14px", borderRadius:"20px", fontSize:"0.85rem", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)" },
  right: { display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px", background:"#faf8f5" },
  card: { background:"#fff", borderRadius:"24px", padding:"44px 40px", width:"100%", maxWidth:"400px", boxShadow:"0 8px 40px rgba(60,40,20,0.12)", animation:"fadeUp 0.4s ease" },
  title: { fontFamily:"'Fraunces',serif", fontSize:"1.8rem", fontWeight:800, color:"#1a1410", marginBottom:"6px" },
  cardSub: { color:"#9a9188", fontSize:"0.9rem", marginBottom:"28px" },
  err: { background:"#fdeaea", border:"1px solid #f5b8b8", color:"#e03e3e", padding:"11px 14px", borderRadius:"10px", fontSize:"0.85rem", marginBottom:"18px", textAlign:"center" },
  label: { display:"block", color:"#5a5248", fontSize:"0.8rem", fontWeight:600, marginBottom:"6px", textTransform:"uppercase", letterSpacing:"0.05em" },
  input: { width:"100%", padding:"13px 16px", background:"#faf8f5", border:"1px solid #e8e2d9", borderRadius:"12px", color:"#1a1410", fontSize:"0.95rem", marginBottom:"18px", outline:"none" },
  btn: { width:"100%", padding:"14px", background:"#e8622a", color:"#fff", border:"none", borderRadius:"12px", fontSize:"1rem", fontWeight:700, cursor:"pointer" },
  foot: { textAlign:"center", marginTop:"22px", color:"#9a9188", fontSize:"0.88rem" },
  footLink: { color:"#e8622a", fontWeight:700 },
};
