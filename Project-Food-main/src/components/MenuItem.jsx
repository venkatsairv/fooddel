import React, { useState } from "react";

const MenuItem = ({ item, onAdd }) => {
  const [added, setAdded] = useState(false);
  const handle = () => {
    const wasAdded = onAdd(item);
    if (wasAdded === false) return;
    setAdded(true);
    setTimeout(()=>setAdded(false),1100);
  };

  return (
    <div style={S.card}>
      <div style={S.left}>
        <span style={S.tag}>{item.category}</span>
        <h4 style={S.name}>{item.name}</h4>
        <p style={S.desc}>{item.description}</p>
        <div style={S.row}>
          <span style={S.price}>${item.price.toFixed(2)}</span>
          <button style={{ ...S.btn, ...(added?S.btnAdded:{}) }} onClick={handle}>
            {added ? "✓ Added!" : "+ Add"}
          </button>
        </div>
      </div>
      {item.image && (
        <div style={S.imgWrap}>
          <img src={item.image} alt={item.name} style={S.img} />
        </div>
      )}
    </div>
  );
};

const S = {
  card: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 0", borderBottom:"1px solid #f3f0eb", gap:"16px" },
  left: { flex:1 },
  tag: { display:"inline-block", background:"#fff0ea", color:"#e8622a", fontSize:"0.68rem", fontWeight:700, padding:"2px 8px", borderRadius:"20px", marginBottom:"6px", border:"1px solid #fdddc9" },
  name: { color:"#1a1410", fontSize:"0.97rem", fontWeight:600, marginBottom:"4px" },
  desc: { color:"#9a9188", fontSize:"0.82rem", lineHeight:1.5, marginBottom:"10px" },
  row: { display:"flex", alignItems:"center", gap:"14px" },
  price: { color:"#e8622a", fontWeight:700, fontSize:"1rem" },
  btn: { background:"#fff0ea", color:"#e8622a", border:"1px solid #fdddc9", padding:"7px 16px", borderRadius:"10px", cursor:"pointer", fontWeight:700, fontSize:"0.82rem", transition:"all 0.2s" },
  btnAdded: { background:"#e6f7ef", color:"#2d9e6b", border:"1px solid #b7e6d0" },
  imgWrap: { width:"88px", height:"88px", borderRadius:"14px", overflow:"hidden", flexShrink:0 },
  img: { width:"100%", height:"100%", objectFit:"cover" },
};

export default MenuItem;
