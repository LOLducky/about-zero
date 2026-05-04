"use client";

import { useEffect, useState } from "react";

// TODO: write a real bio one day. this'll do for now.
const NOW: [string, string][] = [
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
          transition: all .18s ease;
        }
        .discord-link:hover { background: var(--gglow); color: #fff; }

        .page { position: relative; z-index: 1; padding-top: 46px; }

        .last-login {
          max-width: 1080px; margin: 22px auto 0; padding: 0 32px;
          font-family: var(--mono); font-size: .68rem; color: var(--dim);
        }
        .last-login .blink { animation: blink 1.1s steps(2) infinite; color: var(--g); }
        @keyframes blink { 50% { opacity: 0; } }

        .hero {
          max-width: 1080px; margin: 0 auto; padding: 36px 32px 72px;
          display: grid; grid-template-columns: 1.4fr 1fr; gap: 48px; align-items: start;
        }
        .prompt { font-family: var(--mono); color: var(--g); }
        .hero h1 {
          font-family: var(--mono);
          font-size: clamp(1.4rem, 2.4vw, 1.9rem);
          font-weight: 400; color: var(--text); line-height: 1.5;
          margin: 6px 0 20px;
        }
        .hero h1 .name { color: #fff; }
        .hero h1 .em { color: var(--g); }
        .hero-sub {
          font-family: var(--mono); font-size: .82rem; color: #5a8a73;
          line-height: 1.85; margin-bottom: 28px; max-width: 480px;
        }
        .hero-sub .crossed { text-decoration: line-through; color: var(--dim); }

        .cta-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }
        .btn {
          padding: 9px 18px; font-family: var(--mono); font-size: .74rem;
          text-decoration: none; border: 1px solid var(--gborder); color: var(--g);
          background: transparent; transition: all .15s; display: inline-block;
        }
        .btn:hover { background: var(--g); color: #000; }
        .btn.primary { background: var(--g); color: #000; border-color: var(--g); }
        .btn.primary:hover { background: #fff; border-color: #fff; }

        .about-box {
          border: 1px solid var(--gborder);
          background: rgba(0,8,5,0.6);
          padding: 18px 20px; position: relative;
          font-family: var(--mono); font-size: .78rem;
          transform: rotate(-0.25deg);
        }
        .about-box-title {
          position: absolute; top: -9px; left: 14px;
          background: var(--black); padding: 0 8px;
          font-size: .62rem; color: var(--dim);
        }
        .about-row { display: flex; padding: 5px 0; gap: 14px; }
        .about-row .k { color: var(--dim); width: 78px; flex-shrink: 0; }
        .about-row .v { color: var(--text); }
        .about-row .v.hi { color: var(--g); }
        .about-foot {
          margin-top: 12px; padding-top: 10px;
          border-top: 1px dashed rgba(0,255,140,.12);
          color: var(--dim); font-size: .68rem;
        }

        .section { max-width: 1080px; margin: 0 auto; padding: 56px 32px; }
        .sec-hd {
          font-family: var(--mono); color: var(--g); font-size: .82rem;
          margin-bottom: 22px; display: flex; align-items: center; gap: 10px;
        }
        .sec-hd .hash { color: var(--dim); }
        .sec-hd .rule { flex: 1; height: 1px; background: var(--gborder); margin-left: 10px; }
        .sec-note {
          font-family: var(--mono); font-size: .65rem; color: var(--dim);
          margin: -12px 0 22px; padding-left: 18px;
        }

        .eng-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .eng-card {
          border: 1px solid var(--gborder);
          padding: 22px 22px 20px;
          background: rgba(0,8,5,.4);
          transition: border-color .2s;
        }
        .eng-card:hover { border-color: rgba(0,255,140,.35); }
        .eng-name {
          font-family: var(--head); font-size: 1.5rem; font-weight: 700;
          color: #fff; text-transform: uppercase; letter-spacing: .02em;
        }
        .eng-meta { font-family: var(--mono); font-size: .68rem; color: var(--amber); margin: 2px 0 12px; }
        .eng-desc { font-family: var(--mono); font-size: .8rem; color: #5a8a73; line-height: 1.8; }
        .eng-desc .self { color: var(--dim); font-style: italic; display: block; margin-top: 8px; }

        .two-col { display: grid; grid-template-columns: 1.1fr 1fr; gap: 36px; }
        .text-col p {
          font-family: var(--mono); font-size: .82rem; color: #5a8a73;
          line-height: 1.85; margin-bottom: 14px;
        }
        .text-col p .hi { color: var(--text); }
        .text-col p .em { color: var(--g); }
        .text-col .aside {
          font-size: .68rem; color: var(--dim);
          border-left: 2px solid var(--gborder); padding-left: 10px; margin-top: 18px;
        }

        .now-box {
          border: 1px solid var(--gborder); padding: 16px 18px;
          background: rgba(0,8,5,.4); position: relative;
          font-family: var(--mono);
        }
        .now-box-title {
          position: absolute; top: -9px; left: 14px;
          background: var(--black); padding: 0 8px;
          font-size: .62rem; color: var(--dim);
        }
        .now-row { display: flex; gap: 14px; padding: 4px 0; font-size: .74rem; color: #5a8a73; }
        .now-row .day { color: var(--dim); width: 36px; flex-shrink: 0; text-transform: lowercase; }
        .now-row.hi .day { color: var(--g); }
        .now-foot {
          margin-top: 12px; padding-top: 10px;
          border-top: 1px dashed rgba(0,255,140,.12);
          font-size: .66rem; color: var(--dim);
        }
        .now-foot .live { color: var(--g); }

        footer {
          max-width: 1080px; margin: 0 auto; padding: 28px 32px 40px;
          border-top: 1px solid var(--gborder);
          display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;
          font-family: var(--mono); font-size: .66rem; color: var(--dim);
        }
        footer a { color: var(--g); text-decoration: none; }
        footer a:hover { color: #fff; }

        @media (max-width: 760px) {
          nav { padding: 0 16px; }
          .nav-clock { display: none; }
          .last-login { padding: 0 18px; }
          .hero { grid-template-columns: 1fr; padding: 24px 18px 48px; gap: 28px; }
          .section { padding: 40px 18px; }
          .eng-grid, .two-col { grid-template-columns: 1fr; gap: 18px; }
          .about-box { transform: none; }
        }
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
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <span>discord</span>
          </a>
        </div>
      </nav>

      <div className="page">
        <div className="last-login">
          last login: {lastLogin} on tty/web <span className="blink">▌</span>
        </div>

        <section className="hero">
          <div>
            <div className="prompt" style={{ fontSize: ".82rem", marginBottom: 6 }}>
              $ whoami
            </div>
            <h1>
              hey, i'm <span className="name">igotzeroideas</span>.<br />
              i make <span className="em">small games</span>, mostly alone.
            </h1>
            <p className="hero-sub">
              been doing unity for ~3 years. picked up unreal last year because i
              wanted to know what i was missing (verdict: a lot). most of what
              i make are prototypes that never ship. occasionally one does.
              <br />
              <br />
              not a senior. not a junior either. somewhere in the awkward
              middle where you know enough to be{" "}
              <span className="crossed">dangerous</span> annoying about
              architecture.
            </p>
            <div className="cta-row">
              <a href="#engines" className="btn primary">
                cat engines.txt
              </a>
              <a
                href="https://discord.com/users/igotzeroideas"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                dm me →
              </a>
            </div>
          </div>

          <aside className="about-box">
            <div className="about-box-title">~/about.txt</div>
            <div className="about-row"><span className="k">handle</span><span className="v hi">igotzeroideas</span></div>
            <div className="about-row"><span className="k">doing</span><span className="v">solo game dev</span></div>
            <div className="about-row"><span className="k">engine</span><span className="v">unity (main), ue5 (learning)</span></div>
            <div className="about-row"><span className="k">lang</span><span className="v">c#, some blueprints, less c++</span></div>
            <div className="about-row"><span className="k">years</span><span className="v">3-ish</span></div>
            <div className="about-row"><span className="k">status</span><span className="v hi">open to collabs + jams</span></div>
            <div className="about-row"><span className="k">coffee</span><span className="v">too much</span></div>
            <div className="about-foot">{`// TODO: replace this with something cooler`}</div>
          </aside>
        </section>

        <section className="section" id="engines">
          <div className="sec-hd">
            <span className="hash">##</span> engines
            <div className="rule" />
          </div>
          <div className="sec-note">
            // honest version. no progress bars because they're made up anyway.
          </div>
          <div className="eng-grid">
            <div className="eng-card">
              <div className="eng-name">Unity</div>
              <div className="eng-meta">~3 years · main tool</div>
              <p className="eng-desc">
                where i actually live. fine with c#, scriptable objects, the
                input system, ui toolkit (mostly). shipped a couple of small
                things, lost the source for at least one of them.
                <span className="self">
                  weak spot: shaders. i can read hlsl. writing it is a
                  different story.
                </span>
              </p>
            </div>
            <div className="eng-card">
              <div className="eng-name">Unreal 5</div>
              <div className="eng-meta">~1 year · still learning</div>
              <p className="eng-desc">
                blueprints click for me. c++ does not, yet. built one fps test
                map with lumen + nanite that runs at 40fps on my laptop and
                makes the fans sound like a drone taking off.
                <span className="self">
                  weak spot: literally everything else. ask me again in a year.
                </span>
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="sec-hd">
            <span className="hash">##</span> about + now
            <div className="rule" />
          </div>
          <div className="two-col">
            <div className="text-col">
              <p>
                i like making <span className="hi">small things that feel good to play</span>.
                a tight grappling hook, a satisfying jump, a weapon that has
                weight. the small stuff. i'd rather have one good 30-second
                loop than a sprawling broken open world.
              </p>
              <p>
                i work alone most of the time. this is partly because i'm picky
                and partly because finding people is hard. if you're a
                programmer, artist, or sound person and we vibe, i'd love to
                build something together.
              </p>
              <p>
                outside of dev: too much coffee, way too much time on
                youtube watching other devs work, occasional game jams.
              </p>
              <div className="aside">
                ps. i don't do "rapid synergistic delivery of agile shippable
                experiences". if a recruiter sent you here, sorry, i'm not it.
              </div>
            </div>

            <div className="now-box">
              <div className="now-box-title">~/now.txt — this week</div>
              {NOW.map(([day, msg], i) => (
                <div className={`now-row${i === NOW.length - 1 ? " hi" : ""}`} key={day}>
                  <span className="day">{day}</span>
                  <span>{msg}</span>
                </div>
              ))}
              <div className="now-foot">
                <span className="live">●</span> updated by hand. probably out of date.
              </div>
            </div>
          </div>
        </section>

        <footer>
          <span>
            // hand-written in vscode at unreasonable hours · no ai bios were
            harmed in the making of this page
          </span>
          <a
            href="https://discord.com/users/igotzeroideas"
            target="_blank"
            rel="noopener noreferrer"
          >
            discord: igotzeroideas
          </a>
        </footer>
      </div>
    </>
  );
}
