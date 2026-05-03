"use client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animated particle grid background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #020b18;
          --surface: #040f1e;
          --blue: #38bdf8;
          --blue-dim: #0ea5e9;
          --blue-glow: rgba(56,189,248,0.15);
          --blue-border: rgba(56,189,248,0.25);
          --text: #e2f4ff;
          --muted: #5d8aa8;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'Rajdhani', sans-serif;
          font-size: 18px;
          line-height: 1.6;
          overflow-x: hidden;
        }

        canvas.bg-canvas {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          z-index: 0;
          pointer-events: none;
        }

        /* NAV */
        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 48px;
          background: rgba(2, 11, 24, 0.75);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--blue-border);
        }

        .nav-logo {
          font-family: 'Orbitron', monospace;
          font-weight: 900;
          font-size: 1.1rem;
          letter-spacing: 0.15em;
          color: var(--blue);
          text-decoration: none;
        }

        .nav-logo span { color: var(--text); }

        .discord-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          background: rgba(88, 101, 242, 0.15);
          border: 1px solid rgba(88, 101, 242, 0.5);
          border-radius: 8px;
          color: #c9ceff;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.05em;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .discord-btn:hover {
          background: rgba(88, 101, 242, 0.35);
          border-color: rgba(88, 101, 242, 0.9);
          box-shadow: 0 0 20px rgba(88, 101, 242, 0.4);
          transform: translateY(-1px);
        }

        .discord-btn svg { flex-shrink: 0; }

        /* SECTIONS */
        section {
          position: relative;
          z-index: 1;
        }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 48px;
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-eyebrow {
          font-family: 'Orbitron', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          color: var(--blue);
          text-transform: uppercase;
          margin-bottom: 24px;
          opacity: 0;
          animation: fadeUp 0.8s 0.2s forwards;
        }

        .hero-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 32px;
          opacity: 0;
          animation: fadeUp 0.8s 0.4s forwards;
        }

        .hero-title .line-blue {
          color: var(--blue);
          text-shadow: 0 0 40px rgba(56,189,248,0.5);
        }

        .hero-desc {
          font-size: 1.2rem;
          color: #8ab4cc;
          max-width: 560px;
          margin-bottom: 48px;
          font-weight: 400;
          opacity: 0;
          animation: fadeUp 0.8s 0.6s forwards;
        }

        .hero-cta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          opacity: 0;
          animation: fadeUp 0.8s 0.8s forwards;
        }

        .btn-primary {
          padding: 14px 32px;
          background: var(--blue);
          color: var(--bg);
          font-family: 'Orbitron', monospace;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          background: #7dd3fc;
          box-shadow: 0 0 30px rgba(56,189,248,0.5);
          transform: translateY(-2px);
        }

        .btn-outline {
          padding: 14px 32px;
          background: transparent;
          color: var(--blue);
          font-family: 'Orbitron', monospace;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          border: 1px solid var(--blue-border);
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-outline:hover {
          border-color: var(--blue);
          background: var(--blue-glow);
          transform: translateY(-2px);
        }

        /* ABOUT */
        .about {
          padding: 120px 48px;
          max-width: 900px;
          margin: 0 auto;
        }

        .section-label {
          font-family: 'Orbitron', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          color: var(--blue);
          text-transform: uppercase;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-label::after {
          content: '';
          flex: 1;
          max-width: 80px;
          height: 1px;
          background: var(--blue-border);
        }

        .section-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 700;
          margin-bottom: 32px;
          line-height: 1.2;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }

        .about-text p {
          color: #8ab4cc;
          margin-bottom: 16px;
          font-size: 1.05rem;
        }

        /* SKILLS */
        .skills-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .skill-item {
          background: rgba(4, 15, 30, 0.8);
          border: 1px solid var(--blue-border);
          border-radius: 10px;
          padding: 20px 24px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .skill-item:hover {
          border-color: var(--blue);
          box-shadow: 0 0 20px var(--blue-glow);
        }

        .skill-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .skill-name {
          font-family: 'Orbitron', monospace;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .skill-years {
          font-size: 0.8rem;
          color: var(--blue);
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .skill-bar-bg {
          height: 4px;
          background: rgba(56,189,248,0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .skill-bar-fill {
          height: 100%;
          border-radius: 2px;
          background: linear-gradient(90deg, var(--blue-dim), var(--blue));
          box-shadow: 0 0 8px rgba(56,189,248,0.6);
          animation: barGrow 1.2s ease-out forwards;
          transform-origin: left;
        }

        @keyframes barGrow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        /* ENGINES SHOWCASE */
        .engines {
          padding: 80px 48px 120px;
          max-width: 900px;
          margin: 0 auto;
        }

        .engines-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 48px;
        }

        .engine-card {
          position: relative;
          background: rgba(4, 15, 30, 0.9);
          border: 1px solid var(--blue-border);
          border-radius: 16px;
          padding: 40px 32px;
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
          cursor: default;
        }

        .engine-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--blue), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .engine-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(56,189,248,0.12);
          border-color: rgba(56,189,248,0.5);
        }

        .engine-card:hover::before { opacity: 1; }

        .engine-icon {
          font-size: 3rem;
          margin-bottom: 20px;
          display: block;
          filter: drop-shadow(0 0 16px rgba(56,189,248,0.4));
        }

        .engine-name {
          font-family: 'Orbitron', monospace;
          font-size: 1.3rem;
          font-weight: 900;
          margin-bottom: 8px;
          color: var(--text);
        }

        .engine-exp {
          font-size: 0.85rem;
          color: var(--blue);
          font-weight: 600;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
          font-family: 'Orbitron', monospace;
        }

        .engine-desc {
          color: #6b9ab5;
          font-size: 0.95rem;
          line-height: 1.7;
        }

        .engine-bg-text {
          position: absolute;
          bottom: -10px;
          right: -8px;
          font-family: 'Orbitron', monospace;
          font-size: 4.5rem;
          font-weight: 900;
          color: rgba(56,189,248,0.04);
          pointer-events: none;
          user-select: none;
          letter-spacing: -0.05em;
        }

        /* FOOTER */
        footer {
          position: relative;
          z-index: 1;
          border-top: 1px solid var(--blue-border);
          padding: 32px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        footer p {
          color: var(--muted);
          font-size: 0.9rem;
        }

        /* ANIMATIONS */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* SCANLINE OVERLAY */
        body::after {
          content: '';
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          );
          pointer-events: none;
          z-index: 9999;
        }

        @media (max-width: 700px) {
          nav { padding: 14px 20px; }
          .hero { padding: 0 20px; }
          .about, .engines { padding-left: 20px; padding-right: 20px; }
          .about-grid, .engines-grid { grid-template-columns: 1fr; }
          footer { flex-direction: column; gap: 12px; text-align: center; }
        }
      `}</style>

      <canvas ref={canvasRef} className="bg-canvas" />

      {/* NAV */}
      <nav>
        <a href="#" className="nav-logo">DEV<span>.</span>PORTFOLIO</a>
        <a
          href="https://discord.com/users/igotzeroideas"
          target="_blank"
          rel="noopener noreferrer"
          className="discord-btn"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          Contact Me
        </a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <p className="hero-eyebrow">⚡ Game Developer</p>
        <h1 className="hero-title">
          Building<br />
          <span className="line-blue">Immersive</span><br />
          Game Worlds
        </h1>
        <p className="hero-desc">
          Passionate game developer specializing in Unity and Unreal Engine — crafting interactive experiences from concept to playable reality.
        </p>
        <div className="hero-cta">
          <a href="#engines" className="btn-primary">View My Work</a>
          <a
            href="https://discord.com/users/igotzeroideas"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            Get In Touch
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about" id="about">
        <p className="section-label">About Me</p>
        <h2 className="section-title">Crafting Games<br />With Precision</h2>
        <div className="about-grid">
          <div className="about-text">
            <p>
              I'm a dedicated game developer with hands-on experience across two of the industry's most powerful engines. I love turning creative ideas into polished, playable experiences.
            </p>
            <p>
              Whether it's rapid prototyping in Unity or building cinematic worlds in Unreal Engine, I focus on clean systems, smooth gameplay, and strong visual polish.
            </p>
            <p>
              Always learning, always building — and always open to exciting new projects.
            </p>
          </div>
          <div className="skills-panel">
            <div className="skill-item">
              <div className="skill-header">
                <span className="skill-name">Unity</span>
                <span className="skill-years">2+ Years</span>
              </div>
              <div className="skill-bar-bg">
                <div className="skill-bar-fill" style={{ width: "80%" }} />
              </div>
            </div>
            <div className="skill-item">
              <div className="skill-header">
                <span className="skill-name">Unreal Engine</span>
                <span className="skill-years">1+ Year</span>
              </div>
              <div className="skill-bar-bg">
                <div className="skill-bar-fill" style={{ width: "55%" }} />
              </div>
            </div>
            <div className="skill-item">
              <div className="skill-header">
                <span className="skill-name">C# / Blueprints</span>
                <span className="skill-years">Core Skills</span>
              </div>
              <div className="skill-bar-bg">
                <div className="skill-bar-fill" style={{ width: "70%" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENGINE CARDS */}
      <section className="engines" id="engines">
        <p className="section-label">Tech Stack</p>
        <h2 className="section-title">Engines I Work With</h2>
        <div className="engines-grid">
          <div className="engine-card">
            <span className="engine-icon">🎮</span>
            <div className="engine-name">Unity</div>
            <div className="engine-exp">2+ Years Experience</div>
            <p className="engine-desc">
              From 2D indie prototypes to full 3D projects — I'm comfortable with Unity's ecosystem, C# scripting, physics, and the asset pipeline.
            </p>
            <div className="engine-bg-text">U</div>
          </div>
          <div className="engine-card">
            <span className="engine-icon">🔥</span>
            <div className="engine-name">Unreal Engine</div>
            <div className="engine-exp">1+ Year Experience</div>
            <p className="engine-desc">
              Leveraging UE5's Nanite, Lumen, and Blueprint visual scripting to build high-fidelity, cinematic game environments.
            </p>
            <div className="engine-bg-text">UE</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2026 — Game Developer Portfolio</p>
        <a
          href="https://discord.com/users/igotzeroideas"
          target="_blank"
          rel="noopener noreferrer"
          className="discord-btn"
          style={{ fontSize: "0.85rem", padding: "8px 16px" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          igotzeroideas
        </a>
      </footer>
    </>
  );
}