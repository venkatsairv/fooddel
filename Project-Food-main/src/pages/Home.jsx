import React, { useEffect, useState } from "react";
import api from "../services/api";
import RestaurantCard from "../components/RestaurantCard";

const CATEGORIES = [
  {label:"All",emoji:"🍽️"},{label:"Burgers",emoji:"🍔"},{label:"Pizza",emoji:"🍕"},
  {label:"Sushi",emoji:"🍣"},{label:"Mexican",emoji:"🌮"},{label:"Indian",emoji:"🍛"},{label:"Healthy",emoji:"🥗"},
];

export default function Home() {
  const [restaurants,setRestaurants]=useState([]);
  const [locations,setLocations]=useState([]);
  const [selectedLocation,setSelectedLocation]=useState("");
  const [search,setSearch]=useState("");
  const [cat,setCat]=useState("All");
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    let ignore = false;

    const loadLocations = async () => {
      try {
        const response = await api.get?.("/locations");
        const data = Array.isArray(response?.data) ? response.data : [];
        if (!ignore) {
          setLocations(data);
        }
      } catch {
        if (!ignore) {
          setLocations([]);
        }
      }
    };

    loadLocations();

    return () => {
      ignore = true;
    };
  },[]);

  useEffect(()=>{
    let ignore = false;

    const loadRestaurants = async () => {
      try {
        const response = await api.get?.("/restaurants", {
          params: selectedLocation ? { location: selectedLocation } : {},
        });
        const data = Array.isArray(response?.data) ? response.data : [];
        const mapped = data.map((rest, i) => {
          // Assign a category and cuisine visually since backend lacks these fields
          const catObj = CATEGORIES[(i % (CATEGORIES.length - 1)) + 1];
          return {
            ...rest,
            _id: rest.id,
            name: rest.name || "Local Favorite",
            location: rest.location || selectedLocation || "Popular area",
            cuisine: catObj.label,
            category: catObj.label,
            rating: (4.0 + Math.random()).toFixed(1),
            deliveryTime: 20 + (i * 5 % 30),
            deliveryFee: 1.99,
            priceRange: "$$",
            image: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=700&q=80"
          };
        });

        if (!ignore) {
          setRestaurants(mapped);
        }
      } catch {
        if (!ignore) {
          setRestaurants([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadRestaurants();

    return () => {
      ignore = true;
    };
  },[selectedLocation]);

  const filtered = restaurants.filter(r=>{
    const ms=r.name.toLowerCase().includes(search.toLowerCase())||r.cuisine.toLowerCase().includes(search.toLowerCase());
    const mc=cat==="All"||r.category===cat;
    return ms&&mc;
  });

  return (
    <div style={S.page}>
      {/* Hero */}
      <div style={S.hero}>
        <div style={S.heroInner}>
          <p style={S.eyebrow}>🛵 Fast delivery • Fresh food</p>
          <h1 style={S.heroTitle}>Hungry? <span style={S.accent}>We've got you.</span></h1>
          <p style={S.heroSub}>Order from the best restaurants near you</p>
          <div style={S.controls}>
            <div style={S.locationWrap}>
              <label style={S.locationLabel}>Deliver to</label>
              <select
                style={S.select}
                value={selectedLocation}
                onChange={e=>setSelectedLocation(e.target.value)}
              >
                <option value="">All locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={S.searchBox}>
            <span style={S.searchIcon}>🔍</span>
            <input style={S.search} placeholder="Search restaurants or cuisines…"
              value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
        </div>
        <div style={S.heroArt}>🍔🍕🍣🌮🍛🥗</div>
      </div>

      {/* Category strip */}
      <div style={S.section}>
        <h2 style={S.secTitle}>What are you craving?</h2>
        <div style={S.strip}>
          {CATEGORIES.map(c=>(
            <button key={c.label} style={{ ...S.chip, ...(cat===c.label?S.chipOn:{}) }} onClick={()=>setCat(c.label)}>
              <span style={S.chipEmoji}>{c.emoji}</span>{c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={S.section}>
        <h2 style={S.secTitle}>{cat==="All"?"All Restaurants":cat} <span style={S.count}>({filtered.length})</span></h2>
        {loading ? (
          <div style={S.grid}>{[1,2,3,4,5,6].map(i=><div key={i} style={S.skel}/>)}</div>
        ) : filtered.length===0 ? (
          <div style={S.empty}><p style={{fontSize:"2.5rem"}}>🍽️</p><p style={S.emptyTxt}>No restaurants found</p><p style={S.emptyHint}>Try a different category</p></div>
        ) : (
          <div style={S.grid}>{filtered.map((r,i)=><RestaurantCard key={r._id} restaurant={r} index={i}/>)}</div>
        )}
      </div>
    </div>
  );
}

const S = {
  page:{minHeight:"100vh",background:"#faf8f5"},
  hero:{background:"linear-gradient(135deg,#fff5f0 0%,#fde8d8 100%)",padding:"64px 40px 80px",borderBottom:"1px solid #e8e2d9",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"32px",flexWrap:"wrap"},
  heroInner:{maxWidth:"560px"},
  eyebrow:{color:"#e8622a",fontSize:"0.88rem",fontWeight:600,marginBottom:"14px",letterSpacing:"0.04em"},
  heroTitle:{fontFamily:"'Fraunces',serif",fontSize:"clamp(2.2rem,5vw,3.4rem)",fontWeight:900,color:"#1a1410",lineHeight:1.1,marginBottom:"14px"},
  accent:{color:"#e8622a"},
  heroSub:{color:"#9a9188",fontSize:"1rem",marginBottom:"28px"},
  controls:{display:"flex",gap:"16px",flexWrap:"wrap",marginBottom:"18px"},
  locationWrap:{display:"flex",flexDirection:"column",gap:"8px",maxWidth:"260px"},
  locationLabel:{color:"#5a5248",fontSize:"0.78rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em"},
  select:{padding:"14px 16px",background:"#fff",border:"1px solid #e8e2d9",borderRadius:"14px",color:"#1a1410",fontSize:"0.95rem",outline:"none",boxShadow:"0 4px 20px rgba(60,40,20,0.08)"},
  searchBox:{position:"relative",maxWidth:"460px"},
  searchIcon:{position:"absolute",left:"16px",top:"50%",transform:"translateY(-50%)",fontSize:"1rem",pointerEvents:"none"},
  search:{width:"100%",padding:"15px 18px 15px 46px",background:"#fff",border:"1px solid #e8e2d9",borderRadius:"14px",color:"#1a1410",fontSize:"0.95rem",outline:"none",boxSizing:"border-box",boxShadow:"0 4px 20px rgba(60,40,20,0.08)"},
  heroArt:{fontSize:"3rem",letterSpacing:"8px",opacity:0.25,flexShrink:0},
  section:{maxWidth:"1200px",margin:"0 auto",padding:"40px 32px"},
  secTitle:{fontFamily:"'Fraunces',serif",fontSize:"1.45rem",fontWeight:700,color:"#1a1410",marginBottom:"18px"},
  count:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:400,color:"#9a9188",fontSize:"1rem"},
  strip:{display:"flex",gap:"10px",flexWrap:"wrap"},
  chip:{display:"flex",alignItems:"center",gap:"7px",padding:"10px 18px",background:"#fff",border:"1px solid #e8e2d9",borderRadius:"40px",color:"#5a5248",fontSize:"0.87rem",fontWeight:500,cursor:"pointer",transition:"all 0.2s",fontFamily:"'Plus Jakarta Sans',sans-serif"},
  chipOn:{background:"#fff0ea",border:"1px solid #e8622a",color:"#e8622a",fontWeight:700},
  chipEmoji:{fontSize:"1.05rem"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"20px"},
  skel:{height:"270px",background:"linear-gradient(90deg,#f3f0eb 25%,#ece8e1 50%,#f3f0eb 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.4s infinite",borderRadius:"20px",border:"1px solid #e8e2d9"},
  empty:{textAlign:"center",padding:"80px 0"},
  emptyTxt:{color:"#1a1410",fontWeight:600,fontSize:"1.1rem",marginTop:"12px"},
  emptyHint:{color:"#9a9188",fontSize:"0.88rem",marginTop:"4px"},
};
