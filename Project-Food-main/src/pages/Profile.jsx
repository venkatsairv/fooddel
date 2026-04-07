import React from "react";
import { useAuth } from "../context/AuthContext";
import { logout as logoutService } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout }=useAuth(); const navigate=useNavigate();
  const handleLogout=()=>{ logoutService(); logout(); navigate("/login"); };
  if(!user) return null;
  const initials=user.name?.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.avatarRow}>
          <div style={S.avatar}>{initials}</div>
          <div>
            <h1 style={S.name}>{user.name}</h1>
            <p style={S.email}>{user.email}</p>
          </div>
        </div>
        <div style={S.divider}/>
        <div style={S.stats}>
          {[["🍔","Foodie Status"],["⭐","Member"],["🛵","Free delivery eligible"]].map(([e,l])=>(
            <div key={l} style={S.stat}><span style={S.statIcon}>{e}</span><span style={S.statLabel}>{l}</span></div>
          ))}
        </div>
        <div style={S.divider}/>
        <button style={S.actionBtn} onClick={()=>navigate("/orders")}>📦 View My Orders</button>
        <button style={{...S.actionBtn,...S.logoutBtn}} onClick={handleLogout}>🚪 Logout</button>
      </div>
    </div>
  );
}

const S = {
  page:{minHeight:"100vh",background:"#faf8f5",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px"},
  card:{background:"#fff",borderRadius:"24px",padding:"40px",width:"100%",maxWidth:"440px",boxShadow:"0 8px 40px rgba(60,40,20,0.10)",border:"1px solid #e8e2d9",animation:"fadeUp 0.4s ease"},
  avatarRow:{display:"flex",alignItems:"center",gap:"18px",marginBottom:"24px"},
  avatar:{width:"72px",height:"72px",background:"linear-gradient(135deg,#e8622a,#c44d1a)",color:"#fff",fontSize:"1.6rem",fontWeight:800,borderRadius:"20px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Fraunces',serif",flexShrink:0},
  name:{fontFamily:"'Fraunces',serif",fontSize:"1.5rem",fontWeight:800,color:"#1a1410",marginBottom:"4px"},
  email:{color:"#9a9188",fontSize:"0.88rem"},
  divider:{borderTop:"1px solid #f3f0eb",margin:"20px 0"},
  stats:{display:"flex",flexDirection:"column",gap:"10px"},
  stat:{display:"flex",alignItems:"center",gap:"12px",padding:"10px 14px",background:"#faf8f5",borderRadius:"12px"},
  statIcon:{fontSize:"1.2rem"},
  statLabel:{color:"#5a5248",fontSize:"0.9rem",fontWeight:500},
  actionBtn:{width:"100%",padding:"13px",background:"#fff0ea",color:"#e8622a",border:"1px solid #fdddc9",borderRadius:"12px",fontWeight:700,fontSize:"0.95rem",cursor:"pointer",marginTop:"10px",fontFamily:"'Plus Jakarta Sans',sans-serif"},
  logoutBtn:{background:"#fdeaea",color:"#e03e3e",border:"1px solid #f5b8b8",marginTop:"8px"},
};