"use client";

import { useEffect, useState } from "react";

// TODO: write a real bio one day. this'll do for now.
const NOW = [
  ["mon", "messed with a grappling hook prototype in unity"],
  ["tue", "broke it. fixed it. broke it again."],
  ["wed", "watched 4 hrs of ue5 tutorials, retained ~12 minutes"],
  ["thu", "level blockout for the fps test map"],
  ["fri", "rewrote this site instead of working on the game"],
];

export default function Page() {
  const [time, setTime] = useState("");
  const [lastLogin] = useState(() => {
    const d = new Date(Date.now() - 1000 * 60 * 60 * 6);
    return d.toISOString().replace("T", " ").split(".")[0];
  });

  useEffect(() => {
    const t = () =>
      setTime(new Date().toISOString().replace("T", " ").split(".")[0] + " UTC");
    t();
    const id = setInterval(t, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --black: #050a07;
          --g: #00ff8c;
          --gd: #00cc70;
          --gborder: rgba(0,255,140,0.14);
          --gglow: rgba(0,255,140,0.08);
          --amber: #f0a500;
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
        }

        .v-vignette {
          content: ''; position: fixed; inset: 0;
          background: radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(0,0,0,0.6) 100%);
          pointer-events: none; z-index: 9998;
        }
        .v-scan {
          position: fixed; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px);
          pointer-events: none; z-index: 9999;
          opacity: .55;
        }

        .sc { position: fixed; width: 22px; height: 22px; border-color: rgba(0,255,140,0.22); border-style: solid; pointer-events: none; z-index: 9997; }
        .sc.tl { top: 14px; left: 14px; border-width: 1px 0 0 1px; }
        .sc.tr { top: 14px; right: 14px; border-width: 1px 1px 0 0; }
        .sc.bl { bottom: 14px; left: 14px; border-width: 0 0 1px 1px; }
        .sc.br { bottom: 14px; right: 14px; border-width: 0 1px 1px 0; }

        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px; height: 46px;
          background: rgba(5,10,7,0.92);
          border-bottom: 1px solid var(--gborder);
        }

        .nav-left { display: flex; align-items: center; gap: 14px; }
        .nav-logo { font-family: var(--mono); font-size: 0.78rem; color: var(--g); text-decoration: none; }
        .nav-logo span { color: var(--dim); }
        .nav-clock { font-family: var(--mono); font-size: 0.6rem; color: var(--dim); letter-spacing: 0.05em; }

        .discord-link {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none; color: var(--g);
          font-family: var(--mono); font-size: 0.72rem;
          padding: 6px 14px;
          border: 1px solid var(--gborder);
        }

        .page { position: relative; z-index: 1; padding-top: 46px; }

        .last-login {
          max-width: 1080px; margin: 22px auto 0; padding: 0 32px;
          font-family: var(--mono); font-size: .68rem; color: var(--dim);
        }

        .blink { animation: blink 1.1s steps(2) infinite; color: var(--g); }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>

      <div className="v-vignette" />
      <div className="v-scan" />
      <div className="sc tl" />
      <div className="sc tr" />
      <div className="sc bl" />
      <div className="sc br" />

      <nav>
        <div className="nav-left">
          <a href="/" className="nav-logo">
            <span>~/</span>igotzeroideas
          </a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span className="nav-clock">{time}</span>
          <a
            href="https://discord.com/users/igotzeroideas"
            target="_blank"
            rel="noopener noreferrer"
            className="discord-link"
          >
            discord
          </a>
        </div>
      </nav>

      <div className="page">
        <div className="last-login">
          last login: {lastLogin} on tty/web <span className="blink">▌</span>
        </div>

        <main>
          {/* your terminal page content */}
        </main>
      </div>
    </>
  );
}