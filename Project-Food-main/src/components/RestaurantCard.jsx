import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RestaurantCard = ({ restaurant, index }) => {
  const navigate = useNavigate();
  const [hov, setHov] = useState(false);

  return (
    <div
      style={{ ...S.card, animationDelay:`${index*0.06}s`, ...(hov?S.cardHov:{}) }}
      onClick={() => navigate(`/restaurant/${restaurant._id}`)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={S.imgWrap}>
        <img src={restaurant.image} alt={restaurant.name} style={{ ...S.img, transform:hov?"scale(1.07)":"scale(1)" }} />
        <div style={S.overlay} />
        <span style={S.badge}>{restaurant.cuisine}</span>
        <span style={S.price}>{restaurant.priceRange}</span>
      </div>
      <div style={S.body}>
        <h3 style={S.name}>{restaurant.name}</h3>
        <div style={S.meta}>
          <span style={S.rating}>⭐ {restaurant.rating}</span>
          <span style={S.dot}>·</span>
          <span style={S.mt}>🕒 {restaurant.deliveryTime} min</span>
          <span style={S.dot}>·</span>
          <span style={S.mt}>🛵 ${restaurant.deliveryFee}</span>
        </div>
      </div>
    </div>
  );
};

const S = {
  card: { background:"#fff", borderRadius:"20px", overflow:"hidden", cursor:"pointer", border:"1px solid #e8e2d9", transition:"transform 0.25s, box-shadow 0.25s, border-color 0.25s", animation:"fadeUp 0.45s ease both" },
  cardHov: { transform:"translateY(-5px)", boxShadow:"0 16px 48px rgba(60,40,20,0.14)", borderColor:"#e8622a44" },
  imgWrap: { position:"relative", height:"188px", overflow:"hidden" },
  img: { width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.45s ease" },
  overlay: { position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 55%, rgba(255,248,245,0.6))" },
  badge: { position:"absolute", top:"12px", left:"12px", background:"rgba(255,255,255,0.92)", backdropFilter:"blur(8px)", color:"#e8622a", fontSize:"0.72rem", fontWeight:700, padding:"4px 10px", borderRadius:"20px", border:"1px solid #fdddc9" },
  price: { position:"absolute", top:"12px", right:"12px", background:"rgba(255,255,255,0.92)", backdropFilter:"blur(8px)", color:"#9a9188", fontSize:"0.72rem", fontWeight:600, padding:"4px 10px", borderRadius:"20px" },
  body: { padding:"14px 18px 18px" },
  name: { fontFamily:"'Fraunces',serif", fontSize:"1.1rem", fontWeight:700, color:"#1a1410", marginBottom:"8px" },
  meta: { display:"flex", alignItems:"center", gap:"6px", flexWrap:"wrap" },
  rating: { color:"#e8622a", fontSize:"0.83rem", fontWeight:600 },
  dot: { color:"#d4cdc3" },
  mt: { color:"#9a9188", fontSize:"0.8rem" },
};

export default RestaurantCard;