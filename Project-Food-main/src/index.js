import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const style = document.createElement("style");
style.innerHTML = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #faf8f5;
    --bg2:       #f3f0eb;
    --surface:   #ffffff;
    --border:    #e8e2d9;
    --border2:   #d4cdc3;
    --orange:    #e8622a;
    --orange2:   #d4511a;
    --orange-lt: #fff0ea;
    --orange-md: #fdddc9;
    --green:     #2d9e6b;
    --green-lt:  #e6f7ef;
    --red:       #e03e3e;
    --red-lt:    #fdeaea;
    --text:      #1a1410;
    --text2:     #5a5248;
    --muted:     #9a9188;
    --radius:    16px;
    --font-display: 'Fraunces', serif;
    --font-body:    'Plus Jakarta Sans', sans-serif;
    --shadow-sm: 0 2px 8px rgba(60,40,20,0.08);
    --shadow:    0 8px 32px rgba(60,40,20,0.12);
    --shadow-lg: 0 20px 60px rgba(60,40,20,0.16);
  }

  body {
    font-family: var(--font-body);
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  a { text-decoration: none; color: inherit; }
  input, button, select, textarea { font-family: var(--font-body); }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 99px; }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes slideIn {
    from { opacity:0; transform:translateX(-12px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes bounce {
    0%,100%{ transform:translateY(0); }
    50%{ transform:translateY(-6px); }
  }
  @keyframes ping {
    0%{ transform:scale(1); opacity:1; }
    100%{ transform:scale(2.2); opacity:0; }
  }
  @keyframes drive {
    0%  { left:10%; }
    100%{ left:72%; }
  }
  @keyframes shimmer {
    0%  { background-position: -200% 0; }
    100%{ background-position:  200% 0; }
  }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<React.StrictMode><App /></React.StrictMode>);