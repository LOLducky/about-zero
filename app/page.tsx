"use client";
import { useEffect, useRef, useState } from "react";

const BOOT_LINES = [
  "INITIALIZING SECURE CONNECTION...",
  "VERIFYING CREDENTIALS............",
  "SCANNING BIOMETRIC DATA...........",
  "THREAT ASSESSMENT: NONE DETECTED.",
  "CLEARANCE LEVEL: UNRESTRICTED.....",
  "ACCESS GRANTED ✓",
];

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [booted, setBooted] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [showMain, setShowMain] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setBootLines((prev) => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
        setBooted(true);
        setTimeout(() => {
          setGlitch(true);
          setTimeout(() => {
            setGlitch(false);
            setShowMain(true);
          }, 600);
        }, 800);
      }
    }, 380);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toISOString().replace("T", " ").split(".")[0] + " UTC");
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!showMain) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    let raf: number;
    let frame = 0;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(0,255,140,0.03)";
      ctx.lineWidth = 1;
      const g = 48;
      for (let x = 0; x < canvas.width; x += g) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += g) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
      const scanY = ((frame * 1.2) % (canvas.height + 80)) - 80;
      const grad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      grad.addColorStop(0, "rgba(0,255,140,0)");
      grad.addColorStop(0.5, "rgba(0,255,140,0.045)");
      grad.addColorStop(1, "rgba(0,255,140,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 40, canvas.width, 80);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [showMain]);

  if (!showMain) {
    return (
      <div style={{ background:"#000", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Courier New',monospace", color:"#00ff8c", padding:"40px" }}>
        <div style={{ maxWidth:560, width:"100%" }}>
          <div style={{ fontSize:"0.65rem", letterSpacing:"0.25em", color:"#003d22", marginBottom:28, borderBottom:"1px solid #003d22", paddingBottom:12 }}>
            ████ SECURE TERMINAL v4.2.1 &nbsp;|&nbsp; INITIALIZING... ████
          </div>
          {bootLines.map((line, i) => (
            <div key={i} style={{ fontSize:"0.82rem", letterSpacing:"0.08em", marginBottom:10, color: i === bootLines.length-1 && booted ? "#00ff8c" : "#00bb66" }}>
              <span style={{ color:"#004d28", marginRight:14 }}>[{String(i+1).padStart(2,"0")}]</span>{line}
              {i === bootLines.length-1 && booted && <span style={{ marginLeft:10, color:"#00ff8c", textShadow:"0 0 10px #00ff8c" }}> ✓</span>}
            </div>
          ))}
          {!booted && <span style={{ animation:"blink 1s infinite", fontSize:"1rem" }}>▌</span>}
          {glitch && <div style={{ position:"fixed", inset:0, background:"rgba(0,255,140,0.07)", pointerEvents:"none" }} />}
        </div>
        <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Exo+2:wght@300;400;600;700;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --black:#000508;--green:#00ff8c;--green-dim:#00cc70;--green-dark:#003d22;
          --green-glow:rgba(0,255,140,0.1);--green-border:rgba(0,255,140,0.16);
          --amber:#ffb800;--text:#a0eec8;--muted:#2a6644;
          --mono:'Share Tech Mono',monospace;--body:'Exo 2',sans-serif;
        }
        html{scroll-behavior:smooth}
        body{background:var(--black);color:var(--text);font-family:var(--body);overflow-x:hidden;cursor:crosshair}
        body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse at center,transparent 35%,rgba(0,0,0,0.8) 100%);pointer-events:none;z-index:9998}
        body::after{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px);pointer-events:none;z-index:9999}
        canvas.bg{position:fixed;inset:0;z-index:0;pointer-events:none}

        nav{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:54px;background:rgba(0,5,8,0.95);border-bottom:1px solid var(--green-border)}
        .nav-left{display:flex;align-items:center;gap:20px}
        .nav-logo{font-family:var(--mono);font-size:0.78rem;letter-spacing:0.15em;color:var(--green);text-decoration:none;text-shadow:0 0 12px var(--green)}
        .nav-sep{color:var(--green-dark);font-family:var(--mono);font-size:0.8rem}
        .nav-status{display:flex;align-items:center;gap:7px;font-family:var(--mono);font-size:0.6rem;color:var(--muted);letter-spacing:0.1em}
        .status-dot{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green);animation:pulse 2s infinite}
        @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 8px var(--green)}50%{opacity:0.3;box-shadow:none}}
        .nav-clock{font-family:var(--mono);font-size:0.6rem;color:var(--muted);letter-spacing:0.08em}
        .discord-btn{display:flex;align-items:center;gap:9px;padding:8px 18px;background:transparent;border:1px solid var(--green-border);color:var(--green);font-family:var(--mono);font-size:0.72rem;letter-spacing:0.12em;text-decoration:none;transition:all .2s;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)}
        .discord-btn:hover{background:var(--green-glow);border-color:var(--green);box-shadow:0 0 24px rgba(0,255,140,0.3);color:#fff;text-shadow:0 0 8px var(--green)}

        .page{position:relative;z-index:1}

        .hero{min-height:100vh;display:grid;grid-template-columns:1fr 360px;gap:0;align-items:center;padding:80px 40px 40px;max-width:1100px;margin:0 auto}
        .hero-left{padding-right:60px}
        .hero-tag{font-family:var(--mono);font-size:0.6rem;letter-spacing:0.28em;color:var(--muted);margin-bottom:18px;display:flex;align-items:center;gap:10px}
        .hero-tag::before{content:'';width:18px;height:1px;background:var(--green);box-shadow:0 0 6px var(--green)}
        .hero-cursor{font-family:var(--mono);font-size:0.85rem;letter-spacing:0.22em;color:var(--green);text-shadow:0 0 18px var(--green);margin-bottom:14px;overflow:hidden;white-space:nowrap;animation:typeIn 1.2s steps(22) forwards}
        @keyframes typeIn{from{width:0}to{width:100%}}
        .hero-title{font-family:var(--body);font-size:clamp(2.4rem,5.5vw,4.5rem);font-weight:900;line-height:0.95;letter-spacing:-0.03em;color:#fff;text-transform:uppercase;margin-bottom:6px}
        .hero-title .accent{color:var(--green);text-shadow:0 0 40px rgba(0,255,140,0.55);display:block}
        .hero-title .ghost{color:#0d2619}
        .hero-sub{font-family:var(--mono);font-size:0.68rem;letter-spacing:0.2em;color:var(--muted);margin:18px 0 32px;text-transform:uppercase}
        .hero-desc{font-size:0.9rem;color:#3d7a56;line-height:1.85;max-width:440px;margin-bottom:36px;font-weight:300}
        .btn-access{display:inline-flex;align-items:center;gap:12px;padding:13px 30px;background:var(--green);color:#000;font-family:var(--mono);font-size:0.75rem;font-weight:700;letter-spacing:0.2em;text-decoration:none;text-transform:uppercase;clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);transition:all .2s}
        .btn-access:hover{background:#fff;box-shadow:0 0 40px rgba(0,255,140,0.6);transform:translateY(-2px)}

        .hud-panel{border:1px solid var(--green-border);background:rgba(0,8,4,0.85);padding:26px;position:relative;animation:hudIn .5s .2s both}
        @keyframes hudIn{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:none}}
        .hud-panel::before{content:'OPERATOR PROFILE';position:absolute;top:-9px;left:18px;background:var(--black);padding:0 10px;font-family:var(--mono);font-size:0.58rem;letter-spacing:0.2em;color:var(--green)}
        .hc{position:absolute;width:10px;height:10px;border-color:var(--green);border-style:solid}
        .hc.tl{top:-1px;left:-1px;border-width:2px 0 0 2px}
        .hc.tr{top:-1px;right:-1px;border-width:2px 2px 0 0}
        .hc.bl{bottom:-1px;left:-1px;border-width:0 0 2px 2px}
        .hc.br{bottom:-1px;right:-1px;border-width:0 2px 2px 0}
        .hud-row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid rgba(0,255,140,0.06)}
        .hud-row:last-of-type{border-bottom:none}
        .hl{color:var(--muted);font-family:var(--mono);font-size:0.6rem;letter-spacing:0.12em}
        .hv{color:var(--green);font-family:var(--mono);font-size:0.7rem;letter-spacing:0.08em}
        .hv.w{color:#fff}.hv.a{color:var(--amber)}
        .hud-bar-wrap{height:2px;background:rgba(0,255,140,0.07);margin-top:18px}
        .hud-bar{height:100%;background:var(--green);box-shadow:0 0 6px var(--green)}
        .hud-note{font-family:var(--mono);font-size:0.56rem;color:var(--muted);letter-spacing:0.1em;margin-top:5px}
        .access-badge{margin-top:18px;padding:10px 14px;background:rgba(0,255,140,0.04);border:1px solid rgba(0,255,140,0.15);display:flex;align-items:center;gap:9px;font-family:var(--mono);font-size:0.62rem;color:var(--green);letter-spacing:0.12em}

        .section{position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:90px 40px}
        .sec-header{display:flex;align-items:center;gap:14px;margin-bottom:52px}
        .sec-num{font-family:var(--mono);font-size:0.62rem;color:var(--green);letter-spacing:0.2em}
        .sec-title{font-family:var(--body);font-size:clamp(1.3rem,2.8vw,1.9rem);font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:0.05em}
        .sec-line{flex:1;height:1px;background:linear-gradient(90deg,var(--green-border),transparent)}

        .engine-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px}
        .engine-card{background:rgba(0,6,3,0.92);border:1px solid var(--green-border);padding:36px 32px;position:relative;overflow:hidden;transition:border-color .3s}
        .engine-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--green),transparent);transform:scaleX(0);transition:transform .4s}
        .engine-card:hover{border-color:rgba(0,255,140,0.35)}
        .engine-card:hover::after{transform:scaleX(1)}
        .engine-card:hover .eng-bg{opacity:.055}
        .eng-bg{position:absolute;top:50%;right:16px;transform:translateY(-50%);font-family:var(--mono);font-size:5.5rem;color:var(--green);opacity:.022;pointer-events:none;transition:opacity .3s;font-weight:900}
        .eng-status{font-family:var(--mono);font-size:0.58rem;letter-spacing:0.2em;color:var(--green);margin-bottom:14px;display:flex;align-items:center;gap:7px}
        .eng-status::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green)}
        .eng-name{font-family:var(--body);font-size:1.5rem;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:5px}
        .eng-years{font-family:var(--mono);font-size:0.7rem;color:var(--amber);letter-spacing:0.1em;margin-bottom:18px}
        .eng-desc{font-size:0.88rem;color:#3a6648;line-height:1.85;font-weight:300}
        .meter{margin-top:22px}
        .meter-lbl{display:flex;justify-content:space-between;font-family:var(--mono);font-size:0.58rem;color:var(--muted);letter-spacing:0.1em;margin-bottom:6px}
        .meter-track{height:2px;background:rgba(0,255,140,0.07)}
        .meter-fill{height:100%;background:linear-gradient(90deg,var(--green-dark),var(--green));box-shadow:0 0 5px var(--green)}

        .intel-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px}
        .intel-text p{font-size:0.9rem;color:#3d7a56;line-height:1.85;font-weight:300;margin-bottom:14px}
        .redacted{background:#122b1c;color:transparent;padding:0 4px;border-radius:2px;cursor:pointer;transition:all .3s;user-select:none}
        .redacted:hover{background:var(--green-dark);color:var(--green);text-shadow:0 0 6px var(--green)}
        .log-feed{border:1px solid var(--green-border);background:rgba(0,4,2,0.9);padding:18px;font-family:var(--mono);font-size:0.65rem;position:relative}
        .log-feed::before{content:'SYSTEM LOG';position:absolute;top:-8px;left:14px;background:var(--black);padding:0 8px;font-size:0.55rem;letter-spacing:0.2em;color:var(--green)}
        .log-line{display:flex;gap:12px;padding:5px 0;border-bottom:1px solid rgba(0,255,140,0.04)}
        .log-line:last-child{border:none}
        .log-t{color:#1a4d30;flex-shrink:0}
        .log-m{color:#2d5e42}.log-m.ok{color:var(--green)}.log-m.warn{color:var(--amber)}

        footer{position:relative;z-index:1;border-top:1px solid var(--green-border);padding:18px 40px;display:flex;justify-content:space-between;align-items:center}
        footer p{font-family:var(--mono);font-size:0.58rem;color:var(--muted);letter-spacing:0.15em}

        .sc{position:fixed;width:36px;height:36px;border-color:rgba(0,255,140,0.2);border-style:solid;pointer-events:none;z-index:9997}
        .sc.tl{top:14px;left:14px;border-width:2px 0 0 2px}
        .sc.tr{top:14px;right:14px;border-width:2px 2px 0 0}
        .sc.bl{bottom:14px;left:14px;border-width:0 0 2px 2px}
        .sc.br{bottom:14px;right:14px;border-width:0 2px 2px 0}

        @media(max-width:768px){
          nav{padding:0 18px}
          .nav-status,.nav-clock{display:none}
          .hero{grid-template-columns:1fr;padding:90px 20px 50px}
          .hero-left{padding-right:0}
          .hud-panel{margin-top:36px}
          .engine-grid,.intel-grid{grid-template-columns:1fr}
          .section{padding:60px 20px}
          footer{padding:14px 20px;flex-direction:column;gap:10px}
        }
      `}</style>

      <div className="sc tl"/><div className="sc tr"/><div className="sc bl"/><div className="sc br"/>
      <canvas ref={canvasRef} className="bg" />

      <nav>
        <div className="nav-left">
          <a href="#" className="nav-logo">▶ SEC//PORT</a>
          <span className="nav-sep">|</span>
          <div className="nav-status"><span className="status-dot"/>SYSTEM ONLINE</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:18}}>
          <span className="nav-clock">{time}</span>
          <a href="https://discord.com/users/igotzeroideas" target="_blank" rel="noopener noreferrer" className="discord-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            CONTACT ME
          </a>
        </div>
      </nav>

      <div className="page">
        {/* HERO */}
        <section style={{position:"relative",zIndex:1}}>
          <div className="hero">
            <div className="hero-left">
              <p className="hero-tag">IDENTITY CONFIRMED — CLEARANCE LEVEL ALPHA</p>
              <div className="hero-cursor">▶ GAME_DEVELOPER.exe</div>
              <h1 className="hero-title">
                <span className="ghost">BUILD</span>
                <span className="accent">WORLDS.</span>
                SHIP
                <span className="accent"> GAMES.</span>
              </h1>
              <p className="hero-sub">// UNITY · UNREAL ENGINE · C# · BLUEPRINTS</p>
              <p className="hero-desc">
                Independent game developer operating across two major engines. Specializing in gameplay systems, interactive environments, and rapid iteration from prototype to polished build.
              </p>
              <a href="#engines" className="btn-access">▶ VIEW CREDENTIALS</a>
            </div>

            <div className="hud-panel">
              <div className="hc tl"/><div className="hc tr"/><div className="hc bl"/><div className="hc br"/>
              {[
                ["DESIGNATION","GAME DEV","w"],
                ["STATUS","● ACTIVE",""],
                ["PRIMARY ENGINE","UNITY","w"],
                ["SECONDARY ENGINE","UNREAL","w"],
                ["TOTAL EXP","3+ YEARS","a"],
                ["THREAT LEVEL","NONE",""],
                ["LANGUAGE","C# / BLUEPRINTS","w"],
              ].map(([lbl,val,cls])=>(
                <div className="hud-row" key={lbl}>
                  <span className="hl">{lbl}</span>
                  <span className={`hv ${cls}`}>{val}</span>
                </div>
              ))}
              <div className="hud-bar-wrap"><div className="hud-bar" style={{width:"80%"}}/></div>
              <div className="hud-note">SKILL INDEX: 80 / 100</div>
              <div className="access-badge">🔒 ACCESS GRANTED — PORTFOLIO UNLOCKED</div>
            </div>
          </div>
        </section>

        {/* ENGINES */}
        <section className="section" id="engines">
          <div className="sec-header">
            <span className="sec-num">01</span>
            <h2 className="sec-title">Engine Credentials</h2>
            <div className="sec-line"/>
          </div>
          <div className="engine-grid">
            {[
              {bg:"U", name:"Unity", years:"2+ YEARS FIELD EXPERIENCE", pct:"80%",
                desc:"Primary development environment. Proficient in C# scripting, physics systems, UI/UX, and the full Unity pipeline from prototype to packaged build."},
              {bg:"UE", name:"Unreal Engine", years:"1+ YEAR FIELD EXPERIENCE", pct:"55%",
                desc:"Secondary engine specialization. Working with UE5 Blueprint scripting, Nanite geometry, Lumen global illumination, and high-fidelity environment building."},
            ].map(e=>(
              <div className="engine-card" key={e.name}>
                <div className="eng-bg">{e.bg}</div>
                <div className="eng-status">MODULE ACTIVE</div>
                <div className="eng-name">{e.name}</div>
                <div className="eng-years">▶ {e.years}</div>
                <p className="eng-desc">{e.desc}</p>
                <div className="meter">
                  <div className="meter-lbl"><span>PROFICIENCY</span><span>{e.pct}</span></div>
                  <div className="meter-track"><div className="meter-fill" style={{width:e.pct}}/></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INTEL */}
        <section className="section" id="about">
          <div className="sec-header">
            <span className="sec-num">02</span>
            <h2 className="sec-title">Operator Intel</h2>
            <div className="sec-line"/>
          </div>
          <div className="intel-grid">
            <div className="intel-text">
              <p>Independent game developer with a focus on building tight, playable systems. Started with Unity over two years ago and expanded into Unreal Engine to broaden the toolset.</p>
              <p>Comfortable working solo across the full pipeline — from initial concept and level design to scripting, polish, and deployment. <span className="redacted" title="hover to reveal">Shipping great games</span> is always the goal.</p>
              <p>Open to collaboration, freelance work, and game jam partnerships. Reach out via Discord to start a conversation.</p>
            </div>
            <div className="log-feed">
              {[
                ["00:00:01","UNITY ENGINE — INITIALIZED","ok"],
                ["00:00:14","C# SCRIPTING — LOADED",""],
                ["00:01:03","PHYSICS ENGINE — ACTIVE",""],
                ["00:01:44","UNREAL ENGINE — INITIALIZED","ok"],
                ["00:02:12","BLUEPRINTS — COMPILED",""],
                ["00:02:58","NANITE / LUMEN — ENABLED",""],
                ["00:03:30","AWAITING CONTACT — DISCORD","warn"],
                ["NOW","PORTFOLIO — ONLINE ✓","ok"],
              ].map(([t,m,c])=>(
                <div className="log-line" key={t+m}>
                  <span className="log-t">{t}</span>
                  <span className={`log-m ${c}`}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer>
          <p>// PORTFOLIO SYS v2.0 — ALL RIGHTS RESERVED</p>
          <a href="https://discord.com/users/igotzeroideas" target="_blank" rel="noopener noreferrer" className="discord-btn" style={{fontSize:"0.65rem",padding:"7px 14px"}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            igotzeroideas
          </a>
        </footer>
      </div>
    </>
  );
}