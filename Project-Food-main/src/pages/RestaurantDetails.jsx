import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import MenuItem from "../components/MenuItem";

export default function RestaurantDetails({ addToCart }) {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");

  useEffect(() => {
    Promise.all([
      api.get("/restaurants"),
      api.get(`/menu/${id}`)
    ])
    .then(([restRes, menuRes]) => {
      // Find the specific restaurant since backend doesn't have GET /restaurants/{id}
      const rest = restRes.data.find(r => String(r.id) === id) || restRes.data[0]; 
      
      // Map backend menu item to expected frontend fields
      const mappedMenuItems = menuRes.data.map(m => ({
        _id: m.id,
        category: "Menu", 
        name: m.name,
        description: "Freshly prepared", 
        price: m.price,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80"
      }));

      setRestaurant({
        ...rest,
        // map backend rest properties to mock properties for UI
        name: rest.name || "Restaurant",
        cuisine: "Various",
        rating: 4.5,
        deliveryTime: 30,
        deliveryFee: 2.99,
        priceRange: "$$",
        image: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=700&q=80",
        menuItems: mappedMenuItems
      });
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, [id]);

  if(loading) return <div style={S.center}><div style={S.spin}/></div>;
  if(!restaurant) return <p style={S.center}>Not found.</p>;

  // since all are "Menu" we just show "Menu" or "All"
  const cats = ["All", ...new Set(restaurant.menuItems.map(m => m.category))];
  const items = tab === "All" ? restaurant.menuItems : restaurant.menuItems.filter(m => m.category === tab);

  return (
    <div style={S.page}>
      <div style={S.hero}>
        <img src={restaurant.image} alt={restaurant.name} style={S.banner}/>
        <div style={S.overlay}/>
        <button style={S.back} onClick={() => navigate(-1)}>← Back</button>
        <div style={S.heroInfo}>
          <span style={S.cuisineTag}>{restaurant.cuisine}</span>
          <h1 style={S.name}>{restaurant.name}</h1>
          <div style={S.badges}>
            {[`⭐ ${restaurant.rating}`,`🕒 ${restaurant.deliveryTime} min`,`🛵 $${restaurant.deliveryFee} delivery`,restaurant.priceRange].map((b, idx)=>(
              <span key={idx} style={S.metaBadge}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={S.content}>
        <div style={S.tabs}>
          {cats.map(c=><button key={c} style={{...S.tab,...(tab===c?S.tabOn:{})}} onClick={()=>setTab(c)}>{c}</button>)}
        </div>
        <div>{items.map(item=><MenuItem key={item._id} item={item} onAdd={addToCart}/>)}</div>
      </div>
    </div>
  );
}

const S = {
  page:{minHeight:"100vh",background:"#faf8f5"},
  hero:{position:"relative",height:"300px"},
  banner:{width:"100%",height:"100%",objectFit:"cover"},
  overlay:{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(250,248,245,0.1) 0%,rgba(250,248,245,0.97) 100%)"},
  back:{position:"absolute",top:"18px",left:"22px",background:"rgba(255,255,255,0.9)",backdropFilter:"blur(10px)",border:"1px solid #e8e2d9",color:"#1a1410",padding:"8px 16px",borderRadius:"10px",cursor:"pointer",fontSize:"0.88rem",fontFamily:"'Plus Jakarta Sans',sans-serif"},
  heroInfo:{position:"absolute",bottom:"22px",left:"24px",right:"24px"},
  cuisineTag:{background:"#fff0ea",color:"#e8622a",border:"1px solid #fdddc9",fontSize:"0.72rem",fontWeight:700,padding:"3px 10px",borderRadius:"20px",display:"inline-block",marginBottom:"8px"},
  name:{fontFamily:"'Fraunces',serif",fontSize:"clamp(1.6rem,4vw,2.2rem)",fontWeight:800,color:"#1a1410",marginBottom:"10px"},
  badges:{display:"flex",gap:"8px",flexWrap:"wrap"},
  metaBadge:{background:"rgba(255,255,255,0.9)",border:"1px solid #e8e2d9",color:"#5a5248",padding:"5px 12px",borderRadius:"20px",fontSize:"0.78rem",backdropFilter:"blur(8px)"},
  content:{maxWidth:"760px",margin:"0 auto",padding:"28px 24px"},
  tabs:{display:"flex",gap:"8px",marginBottom:"24px",flexWrap:"wrap"},
  tab:{padding:"8px 18px",background:"#fff",border:"1px solid #e8e2d9",borderRadius:"30px",color:"#9a9188",fontSize:"0.85rem",fontWeight:500,cursor:"pointer",transition:"all 0.2s",fontFamily:"'Plus Jakarta Sans',sans-serif"},
  tabOn:{background:"#fff0ea",border:"1px solid #e8622a",color:"#e8622a",fontWeight:700},
  center:{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"60vh"},
  spin:{width:"34px",height:"34px",border:"3px solid #e8e2d9",borderTop:"3px solid #e8622a",borderRadius:"50%",animation:"spin 0.8s linear infinite"},
};
