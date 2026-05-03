"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const BOOT = [
  { text: "BIOS v3.1.4 — SECURE BOOT ENABLED", delay: 0 },
  { text: "INITIALIZING ENCRYPTION LAYER......", delay: 420 },
  { text: "VERIFYING OPERATOR CREDENTIALS.....", delay: 860 },
  { text: "BIOMETRIC SCAN: ████████████ OK", delay: 1320 },
  { text: "THREAT ASSESSMENT: NONE DETECTED...", delay: 1780 },
  { text: "CLEARANCE: UNRESTRICTED ▓▓▓▓▓▓▓▓▓▓", delay: 2180 },
  { text: "LOADING PORTFOLIO INTERFACE........", delay: 2520 },
  { text: "ACCESS GRANTED.", delay: 2900 },
];

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [bootDone, setBootDone] = useState(false);
  const [showSite, setShowSite] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [time, setTime] = useState("");
  const [glitchActive, setGlitchActive] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  // Boot sequence
  useEffect(() => {
    BOOT.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, i]);
        if (i === BOOT.length - 1) {
          setTimeout(() => setBootDone(true), 300);
          setTimeout(() => {
            setGlitchActive(true);
            setTimeout(() => { setGlitchActive(false); setShowSite(true); }, 700);
          }, 900);
        }
      }, line.delay);
    });
  }, []);

  // Hero entrance stagger
  useEffect(() => {
    if (showSite) setTimeout(() => setHeroVisible(true), 100);
  }, [showSite]);

  // Clock
  useEffect(() => {
    const t = () => setTime(new Date().toISOString().replace("T"," ").split(".")[0]+" UTC");
    t(); const id = setInterval(t, 1000); return () => clearInterval(id);
  }, []);

  // Mouse parallax
  useEffect(() => {
    const h = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // Canvas: grid + sweep + particles + mouse-reactive glow
  useEffect(() => {
    if (!showSite) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    let frame = 0;

    // Particles
    type P = { x:number; y:number; vx:number; vy:number; life:number; maxLife:number };
    const particles: P[] = [];
    const spawnParticle = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.1,
        life: 0,
        maxLife: 200 + Math.random() * 200,
      });
    };

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid
      const gs = 52;
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += gs) {
        const dist = Math.abs(x - mouseRef.current.x);
        const alpha = Math.max(0.015, 0.05 - dist / 8000);
        ctx.strokeStyle = `rgba(0,255,140,${alpha})`;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gs) {
        const dist = Math.abs(y - mouseRef.current.y);
        const alpha = Math.max(0.015, 0.05 - dist / 8000);
        ctx.strokeStyle = `rgba(0,255,140,${alpha})`;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Mouse glow blob
      const mg = ctx.createRadialGradient(
        mouseRef.current.x, mouseRef.current.y, 0,
        mouseRef.current.x, mouseRef.current.y, 280
      );
      mg.addColorStop(0, "rgba(0,255,140,0.04)");
      mg.addColorStop(1, "rgba(0,255,140,0)");
      ctx.fillStyle = mg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Scan sweep
      const scanY = ((frame * 0.9) % (canvas.height + 100)) - 100;
      const sg = ctx.createLinearGradient(0, scanY, 0, scanY + 100);
      sg.addColorStop(0, "rgba(0,255,140,0)");
      sg.addColorStop(0.4, "rgba(0,255,140,0.03)");
      sg.addColorStop(0.6, "rgba(0,255,140,0.06)");
      sg.addColorStop(1, "rgba(0,255,140,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(0, scanY, canvas.width, 100);

      // Particles
      if (frame % 4 === 0 && particles.length < 60) spawnParticle();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life++;
        if (p.life > p.maxLife) { particles.splice(i, 1); continue; }
        const t = p.life / p.maxLife;
        const alpha = t < 0.2 ? t/0.2*0.4 : t > 0.8 ? (1-t)/0.2*0.4 : 0.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI*2);
        ctx.fillStyle = `rgba(0,255,140,${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [showSite]);

  // ── BOOT SCREEN ──
  if (!showSite) {
    return (
      <div style={{
        background: "#000", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px", fontFamily: "'Courier New', monospace",
      }}>
        {glitchActive && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 999,
            animation: "gFlash .7s forwards",
            background: "rgba(0,255,140,0.06)",
            pointerEvents: "none",
          }}/>
        )}
        <div style={{ maxWidth: 600, width: "100%" }}>
          <div style={{
            fontSize: "0.58rem", letterSpacing: "0.3em", color: "#002d18",
            marginBottom: 32, borderBottom: "1px solid #001a0f", paddingBottom: 14,
            display: "flex", justifyContent: "space-between",
          }}>
            <span>████ SECURE TERMINAL v4.2.1 ████</span>
            <span style={{ color: "#001a0f" }}>{time}</span>
          </div>
          {BOOT.map((line, i) => (
            visibleLines.includes(i) && (
              <div key={i} style={{
                fontSize: "0.8rem", letterSpacing: "0.06em", marginBottom: 11,
                display: "flex", gap: 14, alignItems: "baseline",
                animation: "slideIn .25s ease both",
                color: i === BOOT.length - 1 ? "#00ff8c" : "#00aa5e",
              }}>
                <span style={{ color: "#003320", flexShrink: 0 }}>[{String(i+1).padStart(2,"0")}]</span>
                <span style={i === BOOT.length - 1 ? { textShadow: "0 0 14px #00ff8c" } : {}}>
                  {line.text}
                </span>
              </div>
            )
          ))}
          {!bootDone && <span style={{ color: "#00ff8c", animation: "blink 1s infinite", fontSize: "1.1rem" }}>▌</span>}
        </div>
        <style>{`
          @keyframes slideIn { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:none; } }
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
          @keyframes gFlash { 0%{opacity:1;filter:brightness(2)} 100%{opacity:0;filter:brightness(1)} }
        `}</style>
      </div>
    );
  }

  // ── MAIN SITE ──
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;600;700;900&family=Barlow:wght@300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --black: #000608;
          --g: #00ff8c;
          --gd: #00cc70;
          --gdark: #003d22;
          --gborder: rgba(0,255,140,0.14);
          --gglow: rgba(0,255,140,0.08);
          --amber: #f0a500;
          --red: #ff3b5c;
          --text: #9de8c0;
          --dim: #2d6645;
          --mono: 'Share Tech Mono', monospace;
          --head: 'Barlow Condensed', sans-serif;
          --body: 'Barlow', sans-serif;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--black);
          color: var(--text);
          font-family: var(--body);
          overflow-x: hidden;
          cursor: none;
        }

        /* Custom cursor */
        .cursor {
          position: fixed; pointer-events: none; z-index: 99999;
          width: 20px; height: 20px;
          border: 1px solid var(--g);
          transform: translate(-50%,-50%);
          transition: transform .08s, width .15s, height .15s, border-color .15s;
          mix-blend-mode: screen;
        }
        .cursor-dot {
          position: fixed; pointer-events: none; z-index: 99999;
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--g);
          transform: translate(-50%,-50%);
          box-shadow: 0 0 6px var(--g);
        }
        .cursor.hover { width: 36px; height: 36px; border-color: #fff; }

        /* Vignette */
        body::before {
          content: ''; position: fixed; inset: 0;
          background: radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,0,0,0.82) 100%);
          pointer-events: none; z-index: 9998;
        }
        /* Scanlines */
        body::after {
          content: ''; position: fixed; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.055) 2px, rgba(0,0,0,0.055) 4px);
          pointer-events: none; z-index: 9999;
        }

        canvas.bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; }

        /* Screen corners */
        .sc { position: fixed; width: 28px; height: 28px; border-color: rgba(0,255,140,0.22); border-style: solid; pointer-events: none; z-index: 9997; }
        .sc.tl { top: 16px; left: 16px; border-width: 1px 0 0 1px; }
        .sc.tr { top: 16px; right: 16px; border-width: 1px 1px 0 0; }
        .sc.bl { bottom: 16px; left: 16px; border-width: 0 0 1px 1px; }
        .sc.br { bottom: 16px; right: 16px; border-width: 0 1px 1px 0; }

        /* NAV */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 36px; height: 52px;
          background: rgba(0,6,8,0.94);
          border-bottom: 1px solid var(--gborder);
          animation: navSlide .6s .1s both;
        }
        @keyframes navSlide { from { transform: translateY(-100%); opacity: 0; } to { transform: none; opacity: 1; } }

        .nav-left { display: flex; align-items: center; gap: 18px; }
        .nav-logo { font-family: var(--mono); font-size: 0.75rem; letter-spacing: 0.18em; color: var(--g); text-decoration: none; text-shadow: 0 0 10px rgba(0,255,140,0.5); }
        .nav-pip { width: 1px; height: 16px; background: var(--gborder); }
        .nav-live { display: flex; align-items: center; gap: 6px; font-family: var(--mono); font-size: 0.58rem; color: var(--dim); letter-spacing: 0.1em; }
        .live-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--g); box-shadow: 0 0 6px var(--g); animation: livePulse 2.4s ease-in-out infinite; }
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.25;transform:scale(.7)} }
        .nav-clock { font-family: var(--mono); font-size: 0.57rem; color: var(--dim); letter-spacing: 0.06em; }

        .discord-link {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none; color: var(--g);
          font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.14em;
          padding: 7px 16px;
          border: 1px solid var(--gborder);
          transition: all .2s ease;
          position: relative; overflow: hidden;
        }
        .discord-link::before {
          content: ''; position: absolute; inset: 0;
          background: var(--g); transform: translateX(-101%);
          transition: transform .25s ease;
        }
        .discord-link:hover::before { transform: translateX(0); }
        .discord-link:hover { color: #000; border-color: var(--g); box-shadow: 0 0 24px rgba(0,255,140,0.35); }
        .discord-link svg, .discord-link span { position: relative; z-index: 1; }

        /* PAGE */
        .page { position: relative; z-index: 1; }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 340px;
          align-items: center;
          padding: 80px 48px 48px;
          max-width: 1160px;
          margin: 0 auto;
          gap: 48px;
        }

        .hero-content { opacity: 0; }
        .hero-content.visible { animation: heroReveal .7s .05s both; }
        .hud-panel-wrap { opacity: 0; }
        .hud-panel-wrap.visible { animation: heroReveal .7s .25s both; }
        @keyframes heroReveal { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:none; } }

        .hero-pre {
          font-family: var(--mono); font-size: 0.58rem; letter-spacing: 0.28em;
          color: var(--dim); margin-bottom: 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .hero-pre::before { content:''; width:16px; height:1px; background: var(--g); box-shadow: 0 0 4px var(--g); }

        .hero-handle {
          font-family: var(--mono); font-size: clamp(.7rem, 1.3vw, .9rem);
          color: var(--g); letter-spacing: 0.22em; margin-bottom: 14px;
          text-shadow: 0 0 16px rgba(0,255,140,0.5);
          overflow: hidden; white-space: nowrap;
          animation: typeReveal 1.1s steps(24) .4s both;
          border-right: 2px solid var(--g);
          animation: typeReveal 1.1s steps(24) .4s both, cursorBlink .8s step-end 1.5s 4;
        }
        @keyframes typeReveal { from{width:0;} to{width:100%;} }
        @keyframes cursorBlink { 50%{border-color:transparent} }

        .hero-title {
          font-family: var(--head);
          font-size: clamp(3rem, 7vw, 6rem);
          font-weight: 900; line-height: .9;
          letter-spacing: -.01em; text-transform: uppercase;
          color: #fff; margin-bottom: 10px;
        }
        .hero-title .g { color: var(--g); text-shadow: 0 0 50px rgba(0,255,140,0.45); }
        .hero-title .ghost { color: rgba(255,255,255,0.06); }

        .hero-rule {
          font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.22em;
          color: var(--dim); margin: 18px 0 28px; text-transform: uppercase;
        }

        .hero-desc {
          font-family: var(--body); font-size: .95rem; font-weight: 300;
          color: #3d7a56; line-height: 1.85; max-width: 440px; margin-bottom: 40px;
        }

        .cta-row { display: flex; gap: 12px; flex-wrap: wrap; }

        .btn-primary {
          padding: 12px 28px; background: var(--g); color: #000;
          font-family: var(--mono); font-size: .72rem; font-weight: 700;
          letter-spacing: .18em; text-decoration: none; text-transform: uppercase;
          display: inline-block; transition: all .2s; position: relative; overflow: hidden;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
        }
        .btn-primary:hover { background: #fff; box-shadow: 0 0 36px rgba(0,255,140,0.55); transform: translateY(-2px); }

        .btn-ghost {
          padding: 12px 28px; background: transparent;
          border: 1px solid var(--gborder); color: var(--g);
          font-family: var(--mono); font-size: .72rem; letter-spacing: .18em;
          text-decoration: none; text-transform: uppercase; display: inline-block;
          transition: all .2s;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
        }
        .btn-ghost:hover { border-color: var(--g); background: var(--gglow); color: #fff; transform: translateY(-2px); }

        /* HUD PANEL */
        .hud {
          border: 1px solid var(--gborder);
          background: rgba(0,8,5,0.88);
          padding: 24px; position: relative;
          backdrop-filter: blur(4px);
        }
        .hud::before {
          content: 'OPERATOR PROFILE';
          position: absolute; top: -8px; left: 18px;
          background: var(--black); padding: 0 9px;
          font-family: var(--mono); font-size: .56rem;
          letter-spacing: .2em; color: var(--g);
        }
        .hc { position: absolute; width: 8px; height: 8px; border-color: var(--g); border-style: solid; }
        .hc.tl{top:-1px;left:-1px;border-width:1px 0 0 1px}
        .hc.tr{top:-1px;right:-1px;border-width:1px 1px 0 0}
        .hc.bl{bottom:-1px;left:-1px;border-width:0 0 1px 1px}
        .hc.br{bottom:-1px;right:-1px;border-width:0 1px 1px 0}

        .hud-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 8px 0; border-bottom: 1px solid rgba(0,255,140,0.05);
          font-family: var(--mono);
        }
        .hud-row:last-of-type { border: none; }
        .hl { font-size: .58rem; letter-spacing: .12em; color: var(--dim); }
        .hv { font-size: .68rem; letter-spacing: .07em; color: var(--g); }
        .hv.w { color: #d0f0e0; }
        .hv.a { color: var(--amber); }

        .hud-sep { height: 1px; background: var(--gborder); margin: 14px 0; }

        .skill-row { margin-bottom: 14px; }
        .skill-meta { display: flex; justify-content: space-between; font-family: var(--mono); font-size: .58rem; color: var(--dim); letter-spacing: .1em; margin-bottom: 5px; }
        .skill-track { height: 2px; background: rgba(0,255,140,0.07); position: relative; overflow: hidden; }
        .skill-fill {
          height: 100%; background: linear-gradient(90deg, #003d22, var(--g));
          box-shadow: 0 0 6px var(--g); transform-origin: left;
          animation: fillGrow 1.6s cubic-bezier(.16,1,.3,1) .8s both;
        }
        @keyframes fillGrow { from{transform:scaleX(0)} to{transform:scaleX(1)} }

        .access-tag {
          margin-top: 16px; padding: 9px 12px;
          background: rgba(0,255,140,0.04);
          border: 1px solid rgba(0,255,140,0.12);
          font-family: var(--mono); font-size: .58rem;
          color: var(--g); letter-spacing: .12em;
          display: flex; align-items: center; gap: 8px;
          animation: tagPulse 3s ease-in-out infinite;
        }
        @keyframes tagPulse { 0%,100%{border-color:rgba(0,255,140,.12)} 50%{border-color:rgba(0,255,140,.3)} }

        /* SECTION */
        .section { position: relative; z-index: 1; max-width: 1160px; margin: 0 auto; padding: 96px 48px; }

        .sec-hd { display: flex; align-items: center; gap: 14px; margin-bottom: 52px; }
        .sec-num { font-family: var(--mono); font-size: .58rem; color: var(--g); letter-spacing: .22em; }
        .sec-title { font-family: var(--head); font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: .04em; }
        .sec-line { flex: 1; height: 1px; background: linear-gradient(90deg, var(--gborder), transparent); }

        /* ENGINE CARDS */
        .eng-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; }

        .eng-card {
          background: rgba(0,5,3,0.9);
          border: 1px solid var(--gborder);
          padding: 36px 32px; position: relative; overflow: hidden;
          transition: border-color .35s, transform .35s;
          cursor: default;
        }
        .eng-card::before {
          content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--g), transparent);
          transition: left .5s ease;
        }
        .eng-card:hover { border-color: rgba(0,255,140,.38); transform: translateY(-4px); }
        .eng-card:hover::before { left: 100%; }

        .eng-ghost {
          position: absolute; top: 50%; right: 12px; transform: translateY(-50%);
          font-family: var(--mono); font-size: 5rem; color: var(--g);
          opacity: .02; font-weight: 900; pointer-events: none;
          transition: opacity .3s;
        }
        .eng-card:hover .eng-ghost { opacity: .055; }

        .eng-pip {
          display: flex; align-items: center; gap: 6px; font-family: var(--mono);
          font-size: .56rem; letter-spacing: .2em; color: var(--g); margin-bottom: 14px;
        }
        .eng-pip::before { content:''; width:5px; height:5px; border-radius:50%; background:var(--g); box-shadow:0 0 5px var(--g); animation: livePulse 2s infinite; }

        .eng-name { font-family: var(--head); font-size: 1.6rem; font-weight: 900; color: #fff; text-transform: uppercase; letter-spacing: .03em; margin-bottom: 4px; }
        .eng-exp { font-family: var(--mono); font-size: .65rem; color: var(--amber); letter-spacing: .1em; margin-bottom: 18px; }
        .eng-desc { font-size: .88rem; font-weight: 300; color: #326645; line-height: 1.9; }

        .eng-bar { margin-top: 22px; }
        .eng-bar-lbl { display: flex; justify-content: space-between; font-family: var(--mono); font-size: .56rem; color: var(--dim); letter-spacing: .1em; margin-bottom: 5px; }
        .eng-bar-track { height: 2px; background: rgba(0,255,140,.07); }
        .eng-bar-fill { height: 100%; background: linear-gradient(90deg, #002d18, var(--g)); box-shadow: 0 0 5px var(--g); animation: fillGrow 1.8s cubic-bezier(.16,1,.3,1) 1s both; }

        /* INTEL */
        .intel-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 44px; }
        .intel-text p { font-size: .9rem; font-weight: 300; color: #3d7a56; line-height: 1.9; margin-bottom: 14px; }

        .redacted {
          background: #0e2418; color: transparent;
          padding: 1px 5px; border-radius: 2px;
          cursor: pointer; transition: all .35s; user-select: none;
          font-family: var(--mono); font-size: .78rem; letter-spacing: .05em;
          display: inline-block; vertical-align: middle;
        }
        .redacted:hover { background: var(--gdark); color: var(--g); text-shadow: 0 0 8px var(--g); }

        .log {
          border: 1px solid var(--gborder);
          background: rgba(0,3,2,.92);
          padding: 18px; position: relative;
        }
        .log::before {
          content: 'SYSTEM LOG'; position: absolute; top: -8px; left: 14px;
          background: var(--black); padding: 0 8px;
          font-family: var(--mono); font-size: .54rem; letter-spacing: .2em; color: var(--g);
        }
        .log-row { display: flex; gap: 14px; padding: 5px 0; border-bottom: 1px solid rgba(0,255,140,.04); }
        .log-row:last-child { border: none; }
        .lt { color: #1c4030; font-family: var(--mono); font-size: .62rem; flex-shrink: 0; }
        .lm { font-family: var(--mono); font-size: .62rem; color: #2a5c3e; }
        .lm.ok { color: var(--g); }
        .lm.warn { color: var(--amber); }
        .lm.err { color: var(--red); }

        /* FOOTER */
        footer {
          position: relative; z-index: 1;
          border-top: 1px solid var(--gborder);
          padding: 18px 48px;
          display: flex; justify-content: space-between; align-items: center;
        }
        footer p { font-family: var(--mono); font-size: .56rem; color: var(--dim); letter-spacing: .14em; }

        /* SCROLL REVEAL */
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity .7s ease, transform .7s ease; }
        .reveal.in { opacity: 1; transform: none; }

        @media(max-width: 768px) {
          nav { padding: 0 18px; }
          .nav-live, .nav-clock { display: none; }
          .hero { grid-template-columns: 1fr; padding: 90px 22px 50px; gap: 36px; }
          .eng-grid, .intel-grid { grid-template-columns: 1fr; }
          .section { padding: 64px 22px; }
          footer { padding: 14px 22px; flex-direction: column; gap: 10px; }
        }
      `}</style>

      {/* Cursor */}
      <CursorFollow />

      {/* Screen corners */}
      <div className="sc tl"/><div className="sc tr"/><div className="sc bl"/><div className="sc br"/>
      <canvas ref={canvasRef} className="bg"/>

      {/* NAV */}
      <nav>
        <div className="nav-left">
          <a href="#" className="nav-logo">▶ SEC//PORT</a>
          <div className="nav-pip"/>
          <div className="nav-live"><span className="live-dot"/>ONLINE</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <span className="nav-clock">{time}</span>
          <a href="https://discord.com/users/igotzeroideas" target="_blank" rel="noopener noreferrer" className="discord-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span>igotzeroideas</span>
          </a>
        </div>
      </nav>

      <div className="page">
        {/* HERO */}
        <section style={{position:"relative",zIndex:1}}>
          <div className="hero">
            <div className={`hero-content ${heroVisible?"visible":""}`}>
              <p className="hero-pre">IDENTITY CONFIRMED — CLEARANCE ALPHA</p>
              <div className="hero-handle">▶ GAME_DEVELOPER.exe</div>
              <h1 className="hero-title">
                <span className="ghost">BUILD </span>
                <span className="g">WORLDS.</span><br/>
                SHIP <span className="g">GAMES.</span>
              </h1>
              <p className="hero-rule">// UNITY · UNREAL ENGINE · C# · BLUEPRINTS</p>
              <p className="hero-desc">
                Independent game developer crafting tight, playable systems across two major engines. From rapid prototypes to polished, shippable builds — solo or in a team.
              </p>
              <div className="cta-row">
                <a href="#engines" className="btn-primary">▶ VIEW CREDENTIALS</a>
                <a href="https://discord.com/users/igotzeroideas" target="_blank" rel="noopener noreferrer" className="btn-ghost">REACH OUT</a>
              </div>
            </div>

            <div className={`hud-panel-wrap ${heroVisible?"visible":""}`}>
              <div className="hud">
                <div className="hc tl"/><div className="hc tr"/><div className="hc bl"/><div className="hc br"/>
                {([
                  ["DESIGNATION","GAME DEV","w"],
                  ["STATUS","● ACTIVE",""],
                  ["PRIMARY","UNITY","w"],
                  ["SECONDARY","UNREAL ENGINE","w"],
                  ["EXPERIENCE","3+ YEARS","a"],
                  ["THREAT LEVEL","NONE DETECTED",""],
                  ["LANGUAGE","C# / BLUEPRINTS","w"],
                ] as [string,string,string][]).map(([l,v,c])=>(
                  <div className="hud-row" key={l}>
                    <span className="hl">{l}</span>
                    <span className={`hv ${c}`}>{v}</span>
                  </div>
                ))}
                <div className="hud-sep"/>
                <div className="skill-row">
                  <div className="skill-meta"><span>UNITY</span><span>80%</span></div>
                  <div className="skill-track"><div className="skill-fill" style={{width:"80%"}}/></div>
                </div>
                <div className="skill-row">
                  <div className="skill-meta"><span>UNREAL</span><span>55%</span></div>
                  <div className="skill-track"><div className="skill-fill" style={{width:"55%"}}/></div>
                </div>
                <div className="access-tag">🔒 ACCESS GRANTED — UNLOCKED</div>
              </div>
            </div>
          </div>
        </section>

        {/* ENGINES */}
        <RevealSection>
          <section className="section" id="engines">
            <div className="sec-hd">
              <span className="sec-num">01</span>
              <h2 className="sec-title">Engine Credentials</h2>
              <div className="sec-line"/>
            </div>
            <div className="eng-grid">
              {[
                {bg:"U",name:"Unity",exp:"2+ YEARS FIELD EXPERIENCE",pct:"80%",
                  desc:"Primary development environment. Proficient in C# scripting, physics, UI systems, and the full Unity pipeline — from blank scene to packaged release."},
                {bg:"UE",name:"Unreal Engine",exp:"1+ YEAR FIELD EXPERIENCE",pct:"55%",
                  desc:"Secondary engine, focused on UE5 — Blueprint scripting, Nanite geometry, Lumen global illumination, and high-fidelity level design."},
              ].map((e,i)=>(
                <div className="eng-card" key={e.name} style={{animationDelay:`${i*0.12}s`}}>
                  <div className="eng-ghost">{e.bg}</div>
                  <div className="eng-pip">MODULE ACTIVE</div>
                  <div className="eng-name">{e.name}</div>
                  <div className="eng-exp">▶ {e.exp}</div>
                  <p className="eng-desc">{e.desc}</p>
                  <div className="eng-bar">
                    <div className="eng-bar-lbl"><span>PROFICIENCY</span><span>{e.pct}</span></div>
                    <div className="eng-bar-track"><div className="eng-bar-fill" style={{width:e.pct}}/></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </RevealSection>

        {/* INTEL */}
        <RevealSection>
          <section className="section" id="about">
            <div className="sec-hd">
              <span className="sec-num">02</span>
              <h2 className="sec-title">Operator Intel</h2>
              <div className="sec-line"/>
            </div>
            <div className="intel-grid">
              <div className="intel-text">
                <p>Independent game developer with hands-on experience across Unity and Unreal Engine. Started with Unity over two years ago and expanded into UE5 to broaden the creative and technical range.</p>
                <p>Comfortable working solo across the full pipeline — concept, level design, scripting, polish, and build. The goal is always to <span className="redacted">ship something great.</span></p>
                <p>Open to collaboration, freelance, and game jams. Hit me up on Discord to talk.</p>
              </div>
              <div className="log">
                {([
                  ["00:00:01","UNITY ENGINE — INITIALIZED","ok"],
                  ["00:00:14","C# SCRIPTING — LOADED",""],
                  ["00:01:03","PHYSICS ENGINE — ACTIVE",""],
                  ["00:01:44","UNREAL ENGINE — INITIALIZED","ok"],
                  ["00:02:12","BLUEPRINTS — COMPILED",""],
                  ["00:02:58","NANITE / LUMEN — ENABLED",""],
                  ["00:03:30","AWAITING COLLABORATION","warn"],
                  ["NOW","PORTFOLIO — ONLINE ✓","ok"],
                ] as [string,string,string][]).map(([t,m,c])=>(
                  <div className="log-row" key={t+m}>
                    <span className="lt">{t}</span>
                    <span className={`lm ${c}`}>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </RevealSection>

        <footer>
          <p>// PORTFOLIO SYS v2.1 — ALL RIGHTS RESERVED</p>
          <a href="https://discord.com/users/igotzeroideas" target="_blank" rel="noopener noreferrer" className="discord-link" style={{fontSize:".62rem",padding:"6px 14px"}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span>igotzeroideas</span>
          </a>
        </footer>
      </div>
    </>
  );
}

// Custom cursor component
function CursorFollow() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({x:0,y:0});
  const actual = useRef({x:0,y:0});

  useEffect(()=>{
    const move = (e:MouseEvent) => { pos.current = {x:e.clientX,y:e.clientY}; if(dotRef.current){dotRef.current.style.left=e.clientX+"px";dotRef.current.style.top=e.clientY+"px";} };
    window.addEventListener("mousemove",move);

    let raf:number;
    const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
    const animate=()=>{
      actual.current.x=lerp(actual.current.x,pos.current.x,.12);
      actual.current.y=lerp(actual.current.y,pos.current.y,.12);
      if(cursorRef.current){
        cursorRef.current.style.left=actual.current.x+"px";
        cursorRef.current.style.top=actual.current.y+"px";
      }
      raf=requestAnimationFrame(animate);
    };
    animate();

    const over = (e:MouseEvent)=>{
      const el=e.target as HTMLElement;
      if(el.closest("a,button,.eng-card,.redacted"))cursorRef.current?.classList.add("hover");
      else cursorRef.current?.classList.remove("hover");
    };
    window.addEventListener("mouseover",over);
    return ()=>{ window.removeEventListener("mousemove",move); window.removeEventListener("mouseover",over); cancelAnimationFrame(raf); };
  },[]);

  return(
    <>
      <div ref={cursorRef} className="cursor"/>
      <div ref={dotRef} className="cursor-dot"/>
    </>
  );
}

// Scroll reveal wrapper
function RevealSection({children}:{children:React.ReactNode}){
  const ref=useRef<HTMLDivElement>(null);
  const [vis,setVis]=useState(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVis(true);obs.disconnect();}},{threshold:.12});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  return <div ref={ref} className={`reveal ${vis?"in":""}`}>{children}</div>;
}
