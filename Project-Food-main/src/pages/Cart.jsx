import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import { placeOrder } from "../services/orderService";

const STEPS = ["Cart", "Address", "Payment"];

export default function Cart({ cartItems, updateQuantity, removeFromCart, clearCart }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({ name:"", phone:"", street:"", city:"", pincode:"", landmark:"" });
  const [payMethod, setPayMethod] = useState("cod");

  const subtotal = cartItems.reduce((s,i)=>s+i.price*i.quantity,0);
  const delivery = cartItems.length>0?2.49:0;
  const total = subtotal+delivery;

  const handleOrder = async () => {
    setPlacing(true);
    try {
      const res = await placeOrder(cartItems[0]?.restaurantId, cartItems, total, address);
      clearCart();
      navigate("/orders", { state:{ newOrder:res.data } });
    } catch { alert("Failed to place order."); setPlacing(false); }
  };

  const field = (key,label,placeholder,type="text") => (
    <div style={F.group} key={key}>
      <label style={F.label}>{label}</label>
      <input style={F.input} type={type} placeholder={placeholder}
        value={address[key]} onChange={e=>setAddress({...address,[key]:e.target.value})} required />
    </div>
  );

  const addrValid = address.name&&address.phone&&address.street&&address.city&&address.pincode;

  return (
    <div style={S.page}>
      <div style={S.container}>
        {/* Stepper */}
        <div style={S.stepper}>
          {STEPS.map((s,i)=>(
            <React.Fragment key={s}>
              <div style={S.stepItem}>
                <div style={{ ...S.stepDot, ...(i<=step?S.stepDotOn:{}) }}>{i<step?"✓":i+1}</div>
                <span style={{ ...S.stepLabel, ...(i===step?S.stepLabelOn:{}) }}>{s}</span>
              </div>
              {i<STEPS.length-1&&<div style={{ ...S.stepLine, ...(i<step?S.stepLineOn:{}) }}/>}
            </React.Fragment>
          ))}
        </div>

        {cartItems.length===0 && step===0 ? (
          <div style={S.empty}>
            <p style={{fontSize:"3rem",marginBottom:"12px"}}>🛒</p>
            <p style={S.emptyTxt}>Your cart is empty</p>
            <button style={S.browseBtn} onClick={()=>navigate("/")}>Browse Restaurants</button>
          </div>
        ) : (
          <div style={S.layout}>
            <div style={S.main}>

              {/* STEP 0: Cart items */}
              {step===0 && (
                <div style={S.card}>
                  <h2 style={S.cardTitle}>Your Cart</h2>
                  {cartItems.map(item=>(
                    <CartItem key={item._id} item={item}
                      onIncrease={updateQuantity} onDecrease={updateQuantity} onRemove={removeFromCart}/>
                  ))}
                  <button style={S.nextBtn} onClick={()=>setStep(1)}>Continue to Address →</button>
                </div>
              )}

              {/* STEP 1: Address */}
              {step===1 && (
                <div style={S.card}>
                  <h2 style={S.cardTitle}>📍 Delivery Address</h2>
                  <p style={S.cardHint}>Where should we deliver your order?</p>
                  <div style={F.grid}>
                    {field("name","Full Name","Ravi Kumar")}
                    {field("phone","Phone Number","+91 98765 43210","tel")}
                  </div>
                  {field("street","Street Address","123, Anna Nagar, 2nd Cross")}
                  <div style={F.grid}>
                    {field("city","City","Chennai")}
                    {field("pincode","Pincode","600040")}
                  </div>
                  {field("landmark","Landmark (optional)","Near City Mall")}
                  <div style={S.btnRow}>
                    <button style={S.backBtn} onClick={()=>setStep(0)}>← Back</button>
                    <button style={{ ...S.nextBtn, opacity:addrValid?1:0.5 }} disabled={!addrValid} onClick={()=>setStep(2)}>Continue to Payment →</button>
                  </div>
                </div>
              )}

              {/* STEP 2: Payment */}
              {step===2 && (
                <div style={S.card}>
                  <h2 style={S.cardTitle}>💳 Payment</h2>
                  <p style={S.cardHint}>Choose how you'd like to pay</p>
                  {[
                    {id:"cod",label:"Cash on Delivery",icon:"💵",desc:"Pay when your order arrives"},
                    {id:"upi",label:"UPI / GPay",icon:"📱",desc:"Google Pay, PhonePe, Paytm"},
                    {id:"card",label:"Credit / Debit Card",icon:"💳",desc:"Visa, Mastercard, RuPay"},
                  ].map(m=>(
                    <div key={m.id} style={{ ...P.option, ...(payMethod===m.id?P.optionOn:{}) }} onClick={()=>setPayMethod(m.id)}>
                      <span style={P.optIcon}>{m.icon}</span>
                      <div style={P.optInfo}><p style={P.optLabel}>{m.label}</p><p style={P.optDesc}>{m.desc}</p></div>
                      <div style={{ ...P.radio, ...(payMethod===m.id?P.radioOn:{}) }}>{payMethod===m.id&&<div style={P.radioDot}/>}</div>
                    </div>
                  ))}
                  <div style={{ ...S.addrPreview }}>
                    <p style={S.addrPreviewTitle}>📍 Delivering to</p>
                    <p style={S.addrPreviewText}>{address.name} • {address.phone}</p>
                    <p style={S.addrPreviewText}>{address.street}, {address.city} - {address.pincode}</p>
                    {address.landmark&&<p style={S.addrPreviewText}>Near: {address.landmark}</p>}
                  </div>
                  <div style={S.btnRow}>
                    <button style={S.backBtn} onClick={()=>setStep(1)}>← Back</button>
                    <button style={{ ...S.nextBtn, opacity:placing?0.7:1 }} onClick={handleOrder} disabled={placing}>
                      {placing?"Placing Order…":"🎉 Place Order"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Summary sidebar */}
            <div style={S.sidebar}>
              <div style={S.summaryCard}>
                <h3 style={S.summaryTitle}>Order Summary</h3>
                {cartItems.map(i=>(
                  <div key={i._id} style={S.summRow}>
                    <span style={S.summItem}>{i.name} × {i.quantity}</span>
                    <span style={S.summPrice}>${(i.price*i.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div style={S.summDivider}/>
                <div style={S.summRow}><span style={S.summMuted}>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div style={S.summRow}><span style={S.summMuted}>Delivery</span><span>${delivery.toFixed(2)}</span></div>
                <div style={S.summDivider}/>
                <div style={{ ...S.summRow, ...S.summTotal }}>
                  <span>Total</span><span style={S.totalAmt}>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  page:{minHeight:"100vh",background:"#faf8f5",padding:"32px 24px"},
  container:{maxWidth:"980px",margin:"0 auto"},
  stepper:{display:"flex",alignItems:"center",marginBottom:"36px"},
  stepItem:{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px"},
  stepDot:{width:"34px",height:"34px",borderRadius:"50%",background:"#e8e2d9",color:"#9a9188",fontWeight:700,fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s"},
  stepDotOn:{background:"#e8622a",color:"#fff"},
  stepLabel:{fontSize:"0.78rem",color:"#9a9188",fontWeight:500},
  stepLabelOn:{color:"#e8622a",fontWeight:700},
  stepLine:{flex:1,height:"2px",background:"#e8e2d9",margin:"0 8px",marginBottom:"22px",transition:"background 0.3s"},
  stepLineOn:{background:"#e8622a"},
  layout:{display:"grid",gridTemplateColumns:"1fr 320px",gap:"24px",alignItems:"start"},
  main:{},
  card:{background:"#fff",borderRadius:"20px",padding:"28px",border:"1px solid #e8e2d9",boxShadow:"0 4px 20px rgba(60,40,20,0.06)",animation:"fadeUp 0.35s ease"},
  cardTitle:{fontFamily:"'Fraunces',serif",fontSize:"1.4rem",fontWeight:800,color:"#1a1410",marginBottom:"6px"},
  cardHint:{color:"#9a9188",fontSize:"0.88rem",marginBottom:"22px"},
  nextBtn:{background:"#e8622a",color:"#fff",border:"none",padding:"13px 24px",borderRadius:"12px",fontWeight:700,fontSize:"0.95rem",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",marginTop:"20px"},
  backBtn:{background:"#fff",color:"#5a5248",border:"1px solid #e8e2d9",padding:"13px 20px",borderRadius:"12px",fontWeight:600,fontSize:"0.95rem",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"},
  btnRow:{display:"flex",justifyContent:"space-between",marginTop:"20px",gap:"12px"},
  addrPreview:{background:"#faf8f5",border:"1px solid #e8e2d9",borderRadius:"12px",padding:"14px 16px",marginTop:"20px"},
  addrPreviewTitle:{fontWeight:700,color:"#1a1410",fontSize:"0.88rem",marginBottom:"6px"},
  addrPreviewText:{color:"#5a5248",fontSize:"0.83rem",marginBottom:"2px"},
  empty:{textAlign:"center",padding:"80px 0"},
  emptyTxt:{color:"#5a5248",fontWeight:600,fontSize:"1.1rem",marginBottom:"20px"},
  browseBtn:{background:"#e8622a",color:"#fff",border:"none",padding:"13px 28px",borderRadius:"12px",fontWeight:700,fontSize:"0.95rem",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"},
  sidebar:{position:"sticky",top:"88px"},
  summaryCard:{background:"#fff",borderRadius:"20px",padding:"22px",border:"1px solid #e8e2d9",boxShadow:"0 4px 20px rgba(60,40,20,0.06)"},
  summaryTitle:{fontFamily:"'Fraunces',serif",fontSize:"1.1rem",fontWeight:700,color:"#1a1410",marginBottom:"16px"},
  summRow:{display:"flex",justifyContent:"space-between",fontSize:"0.88rem",color:"#5a5248",marginBottom:"10px"},
  summItem:{flex:1,marginRight:"8px",color:"#1a1410"},
  summPrice:{fontWeight:600,color:"#1a1410"},
  summMuted:{color:"#9a9188"},
  summDivider:{borderTop:"1px solid #f3f0eb",margin:"12px 0"},
  summTotal:{fontWeight:700,color:"#1a1410",fontSize:"1rem"},
  totalAmt:{color:"#e8622a",fontSize:"1.15rem",fontWeight:800},
};
const F = {
  grid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"},
  group:{marginBottom:"16px"},
  label:{display:"block",color:"#5a5248",fontSize:"0.78rem",fontWeight:600,marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.05em"},
  input:{width:"100%",padding:"12px 14px",background:"#faf8f5",border:"1px solid #e8e2d9",borderRadius:"10px",color:"#1a1410",fontSize:"0.92rem",outline:"none",boxSizing:"border-box"},
};
const P = {
  option:{display:"flex",alignItems:"center",gap:"14px",padding:"14px 16px",background:"#faf8f5",border:"1px solid #e8e2d9",borderRadius:"14px",cursor:"pointer",marginBottom:"10px",transition:"all 0.2s"},
  optionOn:{background:"#fff0ea",border:"1px solid #e8622a"},
  optIcon:{fontSize:"1.5rem"},
  optInfo:{flex:1},
  optLabel:{fontWeight:600,color:"#1a1410",fontSize:"0.92rem",marginBottom:"2px"},
  optDesc:{color:"#9a9188",fontSize:"0.78rem"},
  radio:{width:"20px",height:"20px",border:"2px solid #e8e2d9",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"},
  radioOn:{border:"2px solid #e8622a"},
  radioDot:{width:"10px",height:"10px",background:"#e8622a",borderRadius:"50%"},
};