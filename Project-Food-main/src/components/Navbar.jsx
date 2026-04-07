import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout as logoutService } from "../services/authService";

const Navbar = ({ totalItems }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLogout = () => { logoutService(); logout(); navigate("/login"); };
  const active = (p) => location.pathname === p;

  return (
    <nav style={{ ...S.nav, boxShadow: scrolled ? "0 2px 20px rgba(60,40,20,0.10)" : "none" }}>
      <Link to="/" style={S.brand}>
        <span style={S.brandIcon}>🍊</span>
        <span style={S.brandText}>Zesto</span>
      </Link>
      <div style={S.links}>
        {user ? (
          <>
            <Link to="/" style={{ ...S.link, ...(active("/") ? S.linkActive : {}) }}>Home</Link>
            <Link to="/orders" style={{ ...S.link, ...(active("/orders") ? S.linkActive : {}) }}>Orders</Link>
            <Link to="/profile" style={{ ...S.link, ...(active("/profile") ? S.linkActive : {}) }}>Profile</Link>
            <Link to="/cart" style={S.cartBtn}>
              <span>🛒</span>
              {totalItems > 0 && <span style={S.badge}>{totalItems}</span>}
            </Link>
            <button onClick={handleLogout} style={S.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={S.link}>Login</Link>
            <Link to="/signup" style={S.signupBtn}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const S = {
  nav: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 32px", position:"sticky", top:0, zIndex:1000, background:"rgba(250,248,245,0.95)", backdropFilter:"blur(16px)", borderBottom:"1px solid #e8e2d9", transition:"box-shadow 0.3s" },
  brand: { display:"flex", alignItems:"center", gap:"10px" },
  brandIcon: { fontSize:"1.5rem" },
  brandText: { fontFamily:"'Fraunces',serif", fontSize:"1.6rem", fontWeight:800, color:"#e8622a", letterSpacing:"-0.5px" },
  links: { display:"flex", alignItems:"center", gap:"6px" },
  link: { color:"#9a9188", fontSize:"0.9rem", fontWeight:500, padding:"8px 14px", borderRadius:"10px", transition:"color 0.2s" },
  linkActive: { color:"#1a1410", fontWeight:600 },
  cartBtn: { position:"relative", background:"#fff0ea", border:"1px solid #fdddc9", color:"#e8622a", padding:"10px 16px", borderRadius:"12px", fontSize:"1rem", cursor:"pointer", display:"flex", alignItems:"center", gap:"6px", fontWeight:600 },
  badge: { position:"absolute", top:"-7px", right:"-7px", background:"#e8622a", color:"#fff", borderRadius:"50%", width:"20px", height:"20px", fontSize:"0.68rem", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" },
  logoutBtn: { background:"transparent", border:"1px solid #e8e2d9", color:"#9a9188", padding:"8px 16px", borderRadius:"10px", cursor:"pointer", fontSize:"0.88rem", fontWeight:500 },
  signupBtn: { background:"#e8622a", color:"#fff", padding:"10px 20px", borderRadius:"12px", fontWeight:700, fontSize:"0.9rem" },
};

export default Navbar;