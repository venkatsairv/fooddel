import React from "react";

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => (
  <div style={S.row}>
    <div style={S.info}>
      <p style={S.name}>{item.name}</p>
      <p style={S.price}>${(item.price * item.quantity).toFixed(2)}</p>
    </div>
    <div style={S.ctrl}>
      <button style={S.qb} onClick={() => onDecrease(item._id, item.quantity-1)}>−</button>
      <span style={S.qty}>{item.quantity}</span>
      <button style={S.qb} onClick={() => onIncrease(item._id, item.quantity+1)}>+</button>
      <button style={S.del} onClick={() => onRemove(item._id)}>🗑</button>
    </div>
  </div>
);

const S = {
  row: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 0", borderBottom:"1px solid #f3f0eb" },
  info: {},
  name: { color:"#1a1410", fontWeight:600, marginBottom:"3px", fontSize:"0.93rem" },
  price: { color:"#e8622a", fontWeight:700, fontSize:"0.9rem" },
  ctrl: { display:"flex", alignItems:"center", gap:"6px" },
  qb: { width:"30px", height:"30px", borderRadius:"8px", border:"1px solid #e8e2d9", background:"#faf8f5", color:"#1a1410", cursor:"pointer", fontSize:"1rem", fontWeight:700 },
  qty: { color:"#1a1410", fontWeight:700, minWidth:"22px", textAlign:"center" },
  del: { background:"none", border:"none", cursor:"pointer", fontSize:"1rem", marginLeft:"4px", color:"#9a9188" },
};

export default CartItem;