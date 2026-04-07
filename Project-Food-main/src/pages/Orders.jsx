import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getMyOrders } from "../services/orderService";

const STATUS = {
  placed:     { color:"#e8622a", bg:"#fff0ea", border:"#fdddc9", label:"Order Placed" },
  confirmed:  { color:"#e8622a", bg:"#fff0ea", border:"#fdddc9", label:"Order Confirmed" },
  preparing:  { color:"#b07d1a", bg:"#fef9ea", border:"#f5e0a0", label:"Preparing" },
  on_the_way: { color:"#1a6eb0", bg:"#eaf3fe", border:"#a0caf5", label:"On the Way" },
  delivered:  { color:"#2d9e6b", bg:"#e6f7ef", border:"#b7e6d0", label:"Delivered" },
  cancelled:  { color:"#e03e3e", bg:"#fdeaea", border:"#f5b8b8", label:"Cancelled" },
};

const TIMELINE = ["confirmed","preparing","on_the_way","delivered"];

function DeliveryMap({ status }) {
  const idx = TIMELINE.indexOf(status);
  const pct = idx===-1?0:Math.min((idx/(TIMELINE.length-1))*100,100);

  return (
    <div style={M.wrap}>
      <div style={M.mapBg}>
        {/* Road */}
        <svg style={M.svg} viewBox="0 0 400 120" fill="none">
          <path d="M 20 90 Q 100 20 200 60 Q 300 100 380 30" stroke="#e8e2d9" strokeWidth="8" strokeLinecap="round"/>
          <path d="M 20 90 Q 100 20 200 60 Q 300 100 380 30" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeDasharray="12 10"/>
        </svg>
        {/* Restaurant pin */}
        <div style={M.pinR}>🏪</div>
        {/* You pin */}
        <div style={M.pinU}>🏠</div>
        {/* Rider */}
        <div style={{ ...M.rider, left:`calc(10% + ${pct*0.7}%)` }}>🛵</div>
      </div>
      {/* Progress bar */}
      <div style={M.bar}>
        <div style={{ ...M.barFill, width:`${pct}%` }}/>
      </div>
      <div style={M.steps}>
        {TIMELINE.map((s,i)=>{
          const done=i<=idx; const active=i===idx;
          return (
            <div key={s} style={M.step}>
              <div style={{ ...M.dot, ...(done?M.dotDone:{}), ...(active?M.dotActive:{}) }}>
                {done&&!active?"✓":i+1}
              </div>
              <span style={{ ...M.stepTxt, ...(active?M.stepTxtActive:{}) }}>
                {STATUS[s]?.label||s}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RiderCard({ rider }) {
  if (!rider) return null;
  return (
    <div style={R.card}>
      <div style={R.avatar}>{rider.avatar}</div>
      <div style={R.info}>
        <p style={R.name}>{rider.name}</p>
        <p style={R.vehicle}>{rider.vehicle}</p>
        <div style={R.row}>
          <span style={R.rating}>⭐ {rider.rating}</span>
          <span style={R.sep}>·</span>
          <span style={R.phone}>{rider.phone}</span>
        </div>
      </div>
      <a href={`tel:${rider.phone}`} style={R.callBtn}>📞 Call</a>
    </div>
  );
}

function normalizeOrder(order) {
  const normalizedItems = Array.isArray(order?.items)
    ? order.items.map((item) => ({
        name: item?.name || item?.menuItem?.name || "Item",
        quantity: item?.quantity ?? 0,
        price: Number(item?.price ?? item?.menuItem?.price ?? 0),
      }))
    : [];

  const normalizedStatus = String(order?.status || "placed").toLowerCase();

  return {
    id: order?._id ?? order?.id ?? "",
    status: normalizedStatus,
    createdAt: order?.createdAt || null,
    items: normalizedItems,
    totalAmount: Number(order?.totalAmount ?? order?.totalPrice ?? 0),
    address: order?.address || null,
    rider: order?.rider || null,
  };
}

export default function Orders() {
  const location = useLocation();
  const [orders,setOrders]=useState([]);
  const [loading,setLoading]=useState(true);
  const [expanded,setExpanded]=useState(null);

  useEffect(()=>{
    getMyOrders().then(d=>{
      const normalizedOrders = Array.isArray(d) ? d.map(normalizeOrder) : [];
      setOrders(normalizedOrders);
      setLoading(false);
      if(location.state?.newOrder) {
        const newOrder = normalizeOrder(location.state.newOrder);
        setExpanded(newOrder.id);
      }
    }).catch(()=>setLoading(false));
  },[]);

  return (
    <div style={S.page}>
      <div style={S.container}>
        <h1 style={S.title}>My Orders</h1>
        {loading ? <p style={S.muted}>Loading…</p>
        : orders.length===0 ? (
          <div style={S.empty}><p style={{fontSize:"2.5rem"}}>📦</p><p style={S.emptyTxt}>No orders yet</p><p style={S.muted}>Your order history will appear here</p></div>
        ) : orders.map(order=>{
          const st=STATUS[order.status]||STATUS.placed;
          const open=expanded===order.id;
          const orderCode = String(order.id || "").slice(-8).toUpperCase() || "ORDER";
          const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleString() : "Date unavailable";
          return (
            <div key={order.id || orderCode} style={{...S.card, animation:"fadeUp 0.4s ease both"}}>
              <div style={S.cardHead} onClick={()=>setExpanded(open?null:order.id)}>
                <div>
                  <div style={S.orderMeta}>
                    <span style={S.orderId}>#{orderCode}</span>
                    <span style={{...S.badge,background:st.bg,border:`1px solid ${st.border}`,color:st.color}}>{st.label}</span>
                  </div>
                  <p style={S.orderDate}>{orderDate}</p>
                  <p style={S.orderItems}>{order.items.map(i=>`${i.name} ×${i.quantity}`).join(" · ") || "No items available"}</p>
                </div>
                <div style={S.right}>
                  <p style={S.totalAmt}>${order.totalAmount?.toFixed(2)}</p>
                  <span style={S.chevron}>{open?"▲":"▼"}</span>
                </div>
              </div>

              {open && (
                <div style={S.detail}>
                  <DeliveryMap status={order.status}/>
                  <RiderCard rider={order.rider}/>
                  {order.address && (
                    <div style={S.addrBox}>
                      <p style={S.addrTitle}>📍 Delivery Address</p>
                      <p style={S.addrTxt}>{order.address.name} · {order.address.phone}</p>
                      <p style={S.addrTxt}>{order.address.street}, {order.address.city} – {order.address.pincode}</p>
                      {order.address.landmark&&<p style={S.addrTxt}>Near: {order.address.landmark}</p>}
                    </div>
                  )}
                  <div style={S.itemList}>
                    {order.items.map((item,i)=>(
                      <div key={i} style={S.itemRow}>
                        <span style={S.itemName}>{item.name}</span>
                        <span style={S.itemQty}>× {item.quantity}</span>
                        <span style={S.itemPrice}>${(item.price*item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div style={S.totalRow}><span>Total paid</span><span style={{color:"#e8622a",fontWeight:800}}>${order.totalAmount?.toFixed(2)}</span></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const S = {
  page:{minHeight:"100vh",background:"#faf8f5",padding:"40px 24px"},
  container:{maxWidth:"720px",margin:"0 auto"},
  title:{fontFamily:"'Fraunces',serif",fontSize:"2rem",fontWeight:800,color:"#1a1410",marginBottom:"28px"},
  card:{background:"#fff",border:"1px solid #e8e2d9",borderRadius:"20px",marginBottom:"14px",overflow:"hidden",boxShadow:"0 2px 12px rgba(60,40,20,0.06)"},
  cardHead:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"20px 24px",cursor:"pointer",gap:"12px"},
  orderMeta:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"5px"},
  orderId:{fontWeight:700,color:"#1a1410",fontSize:"0.92rem"},
  badge:{padding:"3px 10px",borderRadius:"20px",fontSize:"0.73rem",fontWeight:700},
  orderDate:{color:"#9a9188",fontSize:"0.78rem",marginBottom:"4px"},
  orderItems:{color:"#5a5248",fontSize:"0.83rem"},
  right:{textAlign:"right",flexShrink:0},
  totalAmt:{color:"#e8622a",fontWeight:800,fontSize:"1.05rem",marginBottom:"6px"},
  chevron:{color:"#9a9188",fontSize:"0.75rem"},
  detail:{borderTop:"1px solid #f3f0eb",padding:"0 24px 24px"},
  addrBox:{background:"#faf8f5",border:"1px solid #e8e2d9",borderRadius:"12px",padding:"14px 16px",marginBottom:"16px"},
  addrTitle:{fontWeight:700,color:"#1a1410",fontSize:"0.85rem",marginBottom:"6px"},
  addrTxt:{color:"#5a5248",fontSize:"0.82rem",marginBottom:"2px"},
  itemList:{background:"#faf8f5",borderRadius:"12px",padding:"14px 16px"},
  itemRow:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"},
  itemName:{flex:1,color:"#1a1410",fontSize:"0.88rem"},
  itemQty:{color:"#9a9188",fontSize:"0.83rem"},
  itemPrice:{color:"#5a5248",fontWeight:600,fontSize:"0.88rem"},
  totalRow:{display:"flex",justifyContent:"space-between",fontWeight:700,color:"#1a1410",borderTop:"1px solid #e8e2d9",marginTop:"10px",paddingTop:"10px",fontSize:"0.92rem"},
  muted:{color:"#9a9188",textAlign:"center",padding:"40px"},
  empty:{textAlign:"center",padding:"80px 0"},
  emptyTxt:{color:"#1a1410",fontWeight:600,fontSize:"1.05rem",marginTop:"12px",marginBottom:"6px"},
};

const M = {
  wrap:{marginTop:"20px",marginBottom:"16px"},
  mapBg:{position:"relative",background:"linear-gradient(135deg,#fff5f0,#fef9f5)",borderRadius:"16px",height:"130px",overflow:"hidden",border:"1px solid #e8e2d9",marginBottom:"14px"},
  svg:{position:"absolute",inset:0,width:"100%",height:"100%"},
  pinR:{position:"absolute",left:"4%",bottom:"10px",fontSize:"1.5rem"},
  pinU:{position:"absolute",right:"4%",top:"10px",fontSize:"1.5rem"},
  rider:{position:"absolute",bottom:"18px",fontSize:"1.4rem",transition:"left 1.2s ease",animation:"bounce 1.4s ease infinite"},
  bar:{height:"6px",background:"#f3f0eb",borderRadius:"99px",overflow:"hidden",marginBottom:"16px"},
  barFill:{height:"100%",background:"linear-gradient(90deg,#e8622a,#f0843a)",borderRadius:"99px",transition:"width 0.8s ease"},
  steps:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"4px"},
  step:{display:"flex",flexDirection:"column",alignItems:"center",gap:"5px"},
  dot:{width:"26px",height:"26px",borderRadius:"50%",background:"#e8e2d9",color:"#9a9188",fontSize:"0.72rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"},
  dotDone:{background:"#e6f7ef",color:"#2d9e6b"},
  dotActive:{background:"#e8622a",color:"#fff",animation:"pulse 1.4s ease infinite"},
  stepTxt:{fontSize:"0.65rem",color:"#9a9188",textAlign:"center",lineHeight:1.3},
  stepTxtActive:{color:"#e8622a",fontWeight:700},
};

const R = {
  card:{display:"flex",alignItems:"center",gap:"14px",background:"#faf8f5",border:"1px solid #e8e2d9",borderRadius:"14px",padding:"14px 16px",marginBottom:"14px"},
  avatar:{fontSize:"2.2rem",width:"48px",height:"48px",background:"#fff0ea",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid #fdddc9"},
  info:{flex:1},
  name:{fontWeight:700,color:"#1a1410",fontSize:"0.92rem",marginBottom:"2px"},
  vehicle:{color:"#9a9188",fontSize:"0.78rem",marginBottom:"4px"},
  row:{display:"flex",alignItems:"center",gap:"6px"},
  rating:{color:"#e8622a",fontSize:"0.8rem",fontWeight:600},
  sep:{color:"#d4cdc3"},
  phone:{color:"#5a5248",fontSize:"0.8rem"},
  callBtn:{background:"#e6f7ef",color:"#2d9e6b",border:"1px solid #b7e6d0",padding:"8px 16px",borderRadius:"10px",fontSize:"0.83rem",fontWeight:700,textDecoration:"none"},
};
