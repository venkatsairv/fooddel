import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup as signupService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  const { login }=useAuth(); const navigate=useNavigate();

  const handleSubmit = async(e)=>{
    e.preventDefault(); setError(""); setLoading(true);
    try { const d=await signupService(name,email,password); login(d.user); navigate("/"); }
    catch(err){ setError(err.response?.data?.message||"Signup failed"); }
    finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <div style={S.left}>
        <div style={S.inner}>
          <div style={S.logo}>🍊 Zesto</div>
          <h1 style={S.headline}>Your hunger,<br/>our mission.</h1>
          <p style={S.sub}>Join thousands of happy customers enjoying fast, fresh delivery every day.</p>
          <div style={S.stats}>
            {[["500+","Restaurants"],["30 min","Avg delivery"],["4.8★","App rating"]].map(([v,l])=>(
              <div key={l} style={S.stat}><p style={S.statVal}>{v}</p><p style={S.statLbl}>{l}</p></div>
            ))}
          </div>
        </div>
      </div>
      <div style={S.right}>
        <div style={S.card}>
          <h2 style={S.title}>Create account</h2>
          <p style={S.cardSub}>Start ordering in seconds</p>
          {error && <div style={S.err}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <label style={S.label}>Full Name</label>
            <input style={S.input} type="text" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} required />
            <label style={S.label}>Email address</label>
            <input style={S.input} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            <label style={S.label}>Password</label>
            <input style={S.input} type="password" placeholder="Min 6 characters" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} />
            <button style={{ ...S.btn, opacity:loading?.7:1 }} type="submit" disabled={loading}>{loading?"Creating…":"Create Account"}</button>
          </form>
          <p style={S.foot}>Already have an account? <Link to="/login" style={S.footLink}>Sign in →</Link></p>
        </div>
      </div>
    </div>
  );
}

const S = {
  page:{minHeight:"100vh",display:"grid",gridTemplateColumns:"1fr 1fr"},
  left:{background:"linear-gradient(135deg,#e8622a 0%,#c44d1a 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 48px"},
  inner:{maxWidth:"400px"},
  logo:{fontFamily:"'Fraunces',serif",fontSize:"1.8rem",fontWeight:800,color:"#fff",marginBottom:"40px"},
  headline:{fontFamily:"'Fraunces',serif",fontSize:"clamp(1.8rem,3vw,2.8rem)",fontWeight:900,color:"#fff",lineHeight:1.15,marginBottom:"20px"},
  sub:{color:"rgba(255,255,255,0.8)",fontSize:"0.97rem",lineHeight:1.6,marginBottom:"36px"},
  stats:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1px",background:"rgba(255,255,255,0.2)",borderRadius:"16px",overflow:"hidden"},
  stat:{background:"rgba(255,255,255,0.12)",padding:"18px 12px",textAlign:"center"},
  statVal:{fontFamily:"'Fraunces',serif",fontWeight:800,fontSize:"1.3rem",color:"#fff",marginBottom:"4px"},
  statLbl:{color:"rgba(255,255,255,0.75)",fontSize:"0.75rem"},
  right:{display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px",background:"#faf8f5"},
  card:{background:"#fff",borderRadius:"24px",padding:"44px 40px",width:"100%",maxWidth:"400px",boxShadow:"0 8px 40px rgba(60,40,20,0.12)",animation:"fadeUp 0.4s ease"},
  title:{fontFamily:"'Fraunces',serif",fontSize:"1.8rem",fontWeight:800,color:"#1a1410",marginBottom:"6px"},
  cardSub:{color:"#9a9188",fontSize:"0.9rem",marginBottom:"28px"},
  err:{background:"#fdeaea",border:"1px solid #f5b8b8",color:"#e03e3e",padding:"11px 14px",borderRadius:"10px",fontSize:"0.85rem",marginBottom:"18px",textAlign:"center"},
  label:{display:"block",color:"#5a5248",fontSize:"0.8rem",fontWeight:600,marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.05em"},
  input:{width:"100%",padding:"13px 16px",background:"#faf8f5",border:"1px solid #e8e2d9",borderRadius:"12px",color:"#1a1410",fontSize:"0.95rem",marginBottom:"18px",outline:"none"},
  btn:{width:"100%",padding:"14px",background:"#e8622a",color:"#fff",border:"none",borderRadius:"12px",fontSize:"1rem",fontWeight:700,cursor:"pointer"},
  foot:{textAlign:"center",marginTop:"22px",color:"#9a9188",fontSize:"0.88rem"},
  footLink:{color:"#e8622a",fontWeight:700},
};