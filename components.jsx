// ============================================================
// Portfolio components — Sai Sumanth Reddy
// Dark editorial, mono accents, restrained color, 3D depth
// ============================================================

const { useState, useEffect, useRef, useMemo } = React;

// -------- Hooks --------
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observers = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(id);
          });
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((io) => io.disconnect());
  }, [ids.join(',')]);
  return active;
}

// -------- Top nav --------
function Nav({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(['top', 'work', 'activity', 'experience']);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
    padding: '20px 40px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    backdropFilter: scrolled ? 'blur(14px) saturate(140%)' : 'none',
    background: scrolled ? 'color-mix(in oklab, var(--bg) 78%, transparent)' : 'transparent',
    borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
    transition: 'background 0.25s ease, border-color 0.25s ease, backdrop-filter 0.25s ease',
    fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
  };
  const link = (id, label) => (
    <a href={`#${id}`} className={`nav-link${active === id ? ' active' : ''}`} style={{ color: 'var(--fg-dim)' }}>
      {label}
    </a>
  );
  return (
    <nav style={navStyle}>
      <a href="#top" style={{ color: 'var(--fg)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          width: 18, height: 18, borderRadius: 4, background: 'var(--accent)',
          display: 'inline-block', boxShadow: '0 0 16px var(--accent-soft)',
        }} />
        Sai Sumanth Reddy
      </a>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        {link('work', 'Work')}
        {link('activity', 'Activity')}
        {link('experience', 'Experience')}
        <button onClick={onToggleTheme} aria-label="Toggle theme" style={{
          background: 'transparent', border: '1px solid var(--line-strong)',
          color: 'var(--fg)', borderRadius: 999, padding: '6px 12px',
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em',
          textTransform: 'uppercase', cursor: 'none', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {theme === 'dark' ? '◐ Dark' : '◑ Light'}
        </button>
      </div>
    </nav>
  );
}

// -------- Hero with 3D depth --------
function Hero() {
  const wrapRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      setTilt({ x: dx, y: dy });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const layer = (depth) => ({
    transform: `translate3d(${tilt.x * depth * -1}px, ${tilt.y * depth * -1}px, 0)`,
    transition: 'transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)',
    willChange: 'transform',
  });

  return (
    <section id="top" ref={wrapRef} style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative',
      padding: '120px 0 80px',
      perspective: '1200px',
    }}>
      {/* Background depth grid */}
      <div aria-hidden="true" style={{
        ...layer(40),
        position: 'absolute', inset: '-10%',
        background: 'radial-gradient(circle at 30% 30%, var(--accent-soft), transparent 50%)',
        opacity: 0.6, pointerEvents: 'none',
      }} />

      <div className="wrap" style={{ width: '100%', position: 'relative', zIndex: 2 }}>
        {/* Status pill */}
        <div style={{ ...layer(15), opacity: 0, animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both' }}>
          <span className="pill" data-hover>
            <span className="dot"></span>
            Available · Lead Software Engineer @ Hotkey Solutions
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(64px, 12vw, 180px)',
          lineHeight: 0.92,
          margin: '36px 0 28px',
          letterSpacing: '-0.035em',
          fontWeight: 400,
          ...layer(25),
        }}>
          <span style={{ display: 'block', color: 'var(--fg)' }}>
            <span className="word-rise" style={{ animationDelay: '120ms' }}>Sai</span>
            {' '}
            <span className="word-rise" style={{ animationDelay: '210ms' }}>Sumanth</span>
          </span>
          <span style={{ display: 'block', color: 'var(--fg)' }}>
            <span className="word-rise" style={{ animationDelay: '300ms' }}>Reddy</span>
            <span className="word-rise" style={{ animationDelay: '360ms', color: 'var(--accent)' }}>.</span>
          </span>
        </h1>

        {/* Subhead grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: 80,
          marginTop: 48,
          alignItems: 'start',
          opacity: 0,
          animation: 'fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.44s both',
        }} className="hero-grid">
          <p style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(22px, 2.2vw, 30px)',
            lineHeight: 1.35,
            color: 'var(--fg)',
            margin: 0,
            maxWidth: 640,
            letterSpacing: '-0.005em',
            ...layer(10),
          }}>
            I build <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>scalable backend systems</em> — event-driven microservices in Java &amp; Kafka, deployed on Kubernetes. Lately leading three AI-driven platforms in production.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, ...layer(8) }}>
            <MetaRow k="Location" v="Baltimore, MD" />
            <MetaRow k="Focus" v="Java · Spring Boot · Kafka · AWS" />
            <MetaRow k="Currently" v="50k+ daily events · 99.9% reliability" />
            <MetaRow k="Education" v="UMBC · MS Information Sciences" />
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 56, ...layer(6), opacity: 0, animation: 'fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.62s both' }}>
          <a href="#work" className="btn btn-primary" data-hover data-magnetic>
            View selected work <span style={{ marginLeft: 8 }}>→</span>
          </a>
          <a href="assets/Sai_Sumanth_Reddy_Resume.pdf" download className="btn" data-hover data-magnetic>
            ↓ Download résumé
          </a>
          <a href="mailto:sumanth.reddy9214@gmail.com" className="btn" data-hover data-magnetic>
            Get in touch
          </a>
        </div>
      </div>

      {/* scroll hint */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
        color: 'var(--fg-faint)', textTransform: 'uppercase',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}>
        <span>scroll</span>
        <span style={{
          display: 'inline-block', width: 1, height: 36,
          background: 'linear-gradient(180deg, var(--fg-faint), transparent)',
        }} />
      </div>
    </section>
  );
}

function MetaRow({ k, v }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '90px 1fr',
      gap: 16, paddingBottom: 12,
      borderBottom: '1px dashed var(--line)',
    }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-faint)', paddingTop: 4 }}>{k}</span>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--fg)' }}>{v}</span>
    </div>
  );
}

// -------- About --------
function About() {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">§ 01 · About</span>
          <h2>An engineer who likes <em>building things that don't fall over.</em></h2>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 80,
        }} className="about-grid">
          <div style={{ fontFamily: 'var(--serif)', fontSize: 22, lineHeight: 1.5, color: 'var(--fg)', letterSpacing: '-0.005em' }}>
            <p style={{ marginTop: 0 }}>
              I'm a software engineer in Baltimore with three years of writing production code — primarily backend, increasingly system architecture.
            </p>
            <p>
              At Hotkey Solutions I lead engineering on three AI-driven platforms — decision support, compliance tracking, and administrative workflow. I spend my days designing event-driven systems, optimizing query plans, and arguing about API contracts.
            </p>
            <p>
              Outside work I build small side projects to stay sharp — most recently a tennis analytics site and a deal-tracker.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Stat k="Production platforms" v="3" sub="AI-driven, live with users" />
            <Stat k="Events processed daily" v="50k+" sub="sub-second latency, 99.9% reliability" />
            <Stat k="MTTR improvement" v="−81%" sub="4 hours → 45 minutes" />
            <Stat k="Deployment time" v="−65%" sub="multi-day → multiple daily releases" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ k, v, sub }) {
  const [vis, setVis] = useState(false);
  const [display, setDisplay] = useState('—');
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started) return;
      started = true;
      io.disconnect();
      setVis(true);
      const m = String(v).match(/^([-−]?)([\d.]+)(.*)$/);
      if (!m) { setDisplay(v); return; }
      const [, sign, raw, suf] = m;
      const target = parseFloat(raw);
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / 1400, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        setDisplay(sign + Math.round(target * eased) + suf);
        if (p < 1) requestAnimationFrame(tick);
        else setDisplay(v);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [v]);

  return (
    <div ref={ref} style={{
      border: '1px solid var(--line)', background: 'var(--bg-card)',
      padding: '24px 26px', borderRadius: 4,
      display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'baseline', gap: 16,
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(18px)',
      transition: 'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)',
    }} data-hover>
      <div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: 6 }}>{k}</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--fg-dim)' }}>{sub}</div>
      </div>
      <div style={{
        fontFamily: 'var(--serif)', fontSize: 48, lineHeight: 1, color: 'var(--accent)',
        transform: vis ? 'scale(1)' : 'scale(0.8)',
        transition: 'transform 0.65s cubic-bezier(0.16,1,0.3,1)',
        display: 'inline-block',
      }}>{display}</div>
    </div>
  );
}

// -------- Project Card --------
function ProjectCard({ idx, p, expanded, onToggle }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: dx, y: dy });
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <article
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-hover
      style={{
        borderTop: '1px solid var(--line)',
        padding: '40px 0',
        display: 'grid',
        gridTemplateColumns: '60px 1fr',
        gap: 32,
        cursor: 'none',
        position: 'relative',
        perspective: '1000px',
      }}
      onClick={onToggle}
      className={`project-card${expanded ? ' open' : ''}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      aria-expanded={expanded}
    >
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em',
        color: 'var(--fg-faint)', paddingTop: 8,
      }}>
        {String(idx + 1).padStart(2, '0')}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)',
        gap: 48,
        alignItems: 'start',
      }} className="project-row">
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14,
            fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-faint)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            <span>{p.kind}</span>
            <span style={{ width: 4, height: 4, borderRadius: 2, background: 'var(--fg-faint)' }} />
            <span>{p.year}</span>
            {p.live && <>
              <span style={{ width: 4, height: 4, borderRadius: 2, background: 'var(--fg-faint)' }} />
              <span style={{ color: 'oklch(0.7 0.16 145)' }}>● Live</span>
            </>}
          </div>
          <h3 style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(36px, 4.5vw, 60px)',
            lineHeight: 0.95, fontWeight: 400, letterSpacing: '-0.02em',
            margin: '0 0 20px', color: 'var(--fg)',
            display: 'flex', alignItems: 'baseline', gap: 16,
          }}>
            <span>{p.title}</span>
            <span className="chev" style={{
              fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--fg-faint)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, border: '1px solid var(--line-strong)', borderRadius: '50%',
              flexShrink: 0,
            }} aria-hidden="true">⌄</span>
          </h3>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.5,
            color: 'var(--fg-dim)', margin: 0, maxWidth: 540,
          }}>
            {p.blurb}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
            {p.stack.map(s => (
              <span key={s} style={{
                fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.04em',
                padding: '4px 10px', border: '1px solid var(--line-strong)',
                color: 'var(--fg-dim)', borderRadius: 2,
              }}>{s}</span>
            ))}
          </div>

          {p.links && (
            <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
              {p.links.map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" data-hover
                  style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent)', borderBottom: '1px solid currentColor', paddingBottom: 2 }}
                  onClick={(e) => e.stopPropagation()}>
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Visual side — either diagram or screenshot placeholder */}
        <div style={{
          aspectRatio: '4 / 3',
          background: 'var(--bg-card)',
          border: '1px solid var(--line)',
          borderRadius: 4,
          overflow: 'hidden',
          transform: `rotateY(${tilt.x * 4}deg) rotateX(${tilt.y * -4}deg) translateZ(0)`,
          transition: 'transform 0.18s cubic-bezier(0.2,0.8,0.2,1)',
          transformStyle: 'preserve-3d',
          position: 'relative',
        }}>
          {p.visual === 'arch' ? <ArchDiagram kind={p.archKind} /> : <SiteVisual kind={p.archKind} url={p.preview} />}
        </div>
      </div>

      {p.bullets && (
        <div className="expand-area" style={{ gridColumn: '2 / -1' }}>
          <ul style={{
            fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--fg-dim)',
            lineHeight: 1.6, margin: '8px 0 0', paddingLeft: 18,
            display: 'grid', gap: 8, maxWidth: 720,
          }}>
            {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
      )}
    </article>
  );
}

// -------- Architecture diagrams (CSS/SVG-drawn, mono labels) --------
function ArchDiagram({ kind }) {
  if (kind === 'insightgpt') return <InsightGPTArch />;
  if (kind === 'crs') return <CRSArch />;
  if (kind === 'comprestore') return <CompRestoreArch />;
  return null;
}

const archStroke = 'var(--line-strong)';
const archFg = 'var(--fg)';
const archDim = 'var(--fg-dim)';
const archAccent = 'var(--accent)';

function Node({ x, y, w = 90, h = 28, label, dim, fill }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2}
        fill={fill || 'var(--bg-elev)'} stroke={archStroke} strokeWidth="1" />
      <text x={x + w/2} y={y + h/2 + 3} textAnchor="middle"
        fontFamily="var(--mono)" fontSize="9"
        fill={dim ? archDim : archFg}
        style={{ letterSpacing: '0.05em' }}>
        {label}
      </text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, dashed }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={archStroke} strokeWidth="1"
      strokeDasharray={dashed ? '3 3' : 'none'}
      markerEnd="url(#arrow)" />
  );
}

function DiagramFrame({ title, children }) {
  return (
    <div style={{ width: '100%', height: '100%', padding: 18, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: 10 }}>
        // {title}
      </div>
      <svg viewBox="0 0 360 220" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ flex: 1 }}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={archStroke} />
          </marker>
        </defs>
        {children}
      </svg>
    </div>
  );
}

function InsightGPTArch() {
  return (
    <DiagramFrame title="InsightGPT · event-driven microservices">
      <Node x={10} y={20} w={70} h={22} label="React UI" />
      <Node x={10} y={60} w={70} h={22} label="Admin" />
      <Node x={10} y={100} w={70} h={22} label="Provider" />
      <Node x={10} y={140} w={70} h={22} label="End user" />

      <Arrow x1={80} y1={31} x2={130} y2={70} />
      <Arrow x1={80} y1={71} x2={130} y2={84} />
      <Arrow x1={80} y1={111} x2={130} y2={98} />
      <Arrow x1={80} y1={151} x2={130} y2={112} />

      <Node x={130} y={70} w={70} h={48} label="API gateway" fill="var(--bg-card)" />
      <text x={165} y={104} textAnchor="middle" fontFamily="var(--mono)" fontSize="8" fill={archDim}>OAuth/JWT</text>

      <Arrow x1={200} y1={94} x2={240} y2={50} />
      <Arrow x1={200} y1={94} x2={240} y2={94} />
      <Arrow x1={200} y1={94} x2={240} y2={138} />

      <Node x={240} y={36} w={90} h={26} label="Alerts svc" />
      <Node x={240} y={80} w={90} h={26} label="Decisions svc" />
      <Node x={240} y={124} w={90} h={26} label="Monitoring svc" />

      <Arrow x1={285} y1={62} x2={285} y2={170} dashed />
      <Arrow x1={285} y1={106} x2={285} y2={170} dashed />
      <Arrow x1={285} y1={150} x2={285} y2={170} dashed />
      <Node x={235} y={172} w={100} h={26} label="Kafka topics" fill="var(--bg-card)" />

      <Node x={130} y={172} w={90} h={26} label="Postgres" />
      <Arrow x1={175} y1={172} x2={175} y2={132} dashed />
    </DiagramFrame>
  );
}

function CRSArch() {
  return (
    <DiagramFrame title="Conditional Release · batch + event pipeline">
      <Node x={10} y={20} w={80} h={26} label="Case mgmt UI" />
      <Arrow x1={90} y1={33} x2={140} y2={33} />
      <Node x={140} y={20} w={90} h={26} label="REST API" />

      <Arrow x1={230} y1={33} x2={280} y2={33} />
      <Node x={280} y={20} w={70} h={26} label="Postgres" />

      <Arrow x1={185} y1={46} x2={185} y2={80} />
      <Node x={140} y={80} w={90} h={26} label="Kafka bus" fill="var(--bg-card)" />

      <Arrow x1={140} y1={93} x2={70} y2={93} dashed />
      <Arrow x1={230} y1={93} x2={290} y2={93} dashed />
      <Node x={10} y={80} w={60} h={26} label="Spring Batch" />
      <Node x={290} y={80} w={60} h={26} label="Notify svc" />

      <Arrow x1={40} y1={106} x2={40} y2={140} />
      <Arrow x1={185} y1={106} x2={185} y2={140} />
      <Arrow x1={320} y1={106} x2={320} y2={140} />

      <Node x={10} y={140} w={60} h={26} label="Cron jobs" />
      <Node x={140} y={140} w={90} h={26} label="Violations" />
      <Node x={290} y={140} w={60} h={26} label="Firebase" />

      <text x={180} y={195} textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill={archDim}>
        10+ compliance workflow types · 20+ tests
      </text>
    </DiagramFrame>
  );
}

function CompRestoreArch() {
  return (
    <DiagramFrame title="Comp Restore · serverless workflow engine">
      <Node x={10} y={20} w={80} h={26} label="Admin UI" />
      <Arrow x1={90} y1={33} x2={140} y2={33} />
      <Node x={140} y={20} w={80} h={26} label="API gateway" fill="var(--bg-card)" />

      <Arrow x1={220} y1={33} x2={260} y2={33} />
      <Node x={260} y={20} w={90} h={26} label="OAuth/JWT" />

      <Arrow x1={180} y1={46} x2={180} y2={75} />

      <Node x={60} y={75} w={70} h={26} label="λ recover" />
      <Node x={145} y={75} w={70} h={26} label="λ resolve" />
      <Node x={230} y={75} w={70} h={26} label="λ followup" />

      <Arrow x1={95} y1={101} x2={95} y2={140} />
      <Arrow x1={180} y1={101} x2={180} y2={140} />
      <Arrow x1={265} y1={101} x2={265} y2={140} />

      <Node x={50} y={140} w={90} h={26} label="Postgres" />
      <Node x={150} y={140} w={70} h={26} label="S3" />
      <Node x={230} y={140} w={90} h={26} label="CloudWatch" />

      <text x={180} y={195} textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill={archDim}>
        15+ workflows · serverless · zero idle cost
      </text>
    </DiagramFrame>
  );
}

// -------- Visual block for non-architecture projects --------
// Renders the first image-slot full bleed, with a "View N screenshots" badge.
// Clicking opens a global side-panel viewer for all slots.

// Pre-supplied screenshots per side-project
const PROJECT_SHOTS = {
  bigdeal: [
    'assets/bigdeal-1.png',
    'assets/bigdeal-2.png',
    'assets/bigdeal-3.png',
    'assets/bigdeal-4.png',
  ],
  deuce: [
    'assets/deuce-1.png',
    'assets/deuce-2.png',
    'assets/deuce-3.png',
    'assets/deuce-4.png',
  ],
};

function SiteVisual({ kind, url }) {
  const labels = {
    bigdeal: { name: 'bigdealmaking.site', tag: 'Deal tracker' },
    deuce: { name: 'deuceanddoublefaults.com', tag: 'Tennis analytics' },
  };
  const meta = labels[kind] || { name: 'Project', tag: '' };
  const srcs = PROJECT_SHOTS[kind] || [null, null, null, null];
  const slots = [0, 1, 2, 3].map(i => ({
    id: `${kind}-shot-${i + 1}`,
    placeholder: `Drop screenshot ${i + 1}`,
    src: srcs[i] || undefined,
  }));

  const openViewer = (e, startIdx = 0) => {
    e.stopPropagation();
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-gallery', {
      detail: { slots, title: meta.name, startIdx },
    }));
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* browser chrome */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '10px 12px', borderBottom: '1px solid var(--line)',
        background: 'var(--bg-elev)', flexShrink: 0,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--line-strong)' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--line-strong)' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--line-strong)' }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-faint)', marginLeft: 12 }}>{meta.name}</span>
      </div>

      {/* Primary screenshot slot */}
      <div style={{ flex: 1, position: 'relative', background: 'var(--bg-card)', minHeight: 0 }}
        onClick={(e) => openViewer(e, 0)}>
        <image-slot
          id={slots[0].id}
          src={slots[0].src}
          placeholder={slots[0].placeholder}
          shape="rect"
          fit="cover"
          style={{ display: 'block', width: '100%', height: '100%' }}
        ></image-slot>

        {/* Counter badge */}
        <button
          data-hover
          onClick={(e) => openViewer(e, 0)}
          style={{
            position: 'absolute', right: 10, bottom: 10,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 10px',
            background: 'color-mix(in oklab, var(--bg) 75%, transparent)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--line-strong)',
            color: 'var(--fg)',
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em',
            textTransform: 'uppercase',
            borderRadius: 2,
            cursor: 'none',
          }}>
          ⤢ View 4 screenshots
        </button>
      </div>

      {/* Hidden but mounted: remaining 3 slots so users can fill them too */}
      <div style={{ display: 'none' }}>
        {slots.slice(1).map(s => (
          <image-slot key={s.id} id={s.id} src={s.src} placeholder={s.placeholder} shape="rect" fit="cover"></image-slot>
        ))}
      </div>
    </div>
  );
}

// -------- Side-panel gallery viewer --------
// Listens for window 'open-gallery' events; slides in from the right.
function GalleryPanel() {
  const [state, setState] = useState({ open: false, slots: [], title: '', idx: 0 });

  useEffect(() => {
    const onOpen = (e) => {
      const { slots = [], title = '', startIdx = 0 } = e.detail || {};
      setState({ open: true, slots, title, idx: startIdx });
    };
    window.addEventListener('open-gallery', onOpen);
    return () => window.removeEventListener('open-gallery', onOpen);
  }, []);

  const close = () => setState(s => ({ ...s, open: false }));
  const next = () => setState(s => ({ ...s, idx: (s.idx + 1) % s.slots.length }));
  const prev = () => setState(s => ({ ...s, idx: (s.idx - 1 + s.slots.length) % s.slots.length }));

  useEffect(() => {
    if (!state.open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [state.open, state.slots.length]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'color-mix(in oklab, var(--bg) 60%, transparent)',
          backdropFilter: 'blur(8px)',
          opacity: state.open ? 1 : 0,
          pointerEvents: state.open ? 'auto' : 'none',
          transition: 'opacity 0.32s cubic-bezier(0.2,0.7,0.2,1)',
        }}
      />
      {/* Side panel */}
      <aside
        aria-hidden={!state.open}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(880px, 92vw)', zIndex: 201,
          background: 'var(--bg-elev)',
          borderLeft: '1px solid var(--line)',
          transform: state.open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.42s cubic-bezier(0.2,0.7,0.2,1)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '-40px 0 80px rgba(0,0,0,0.4)',
        }}>
        {/* Header */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '22px 28px', borderBottom: '1px solid var(--line)',
        }}>
          <div>
            <div className="mono" style={{ marginBottom: 4 }}>Screenshots</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 24, color: 'var(--fg)', letterSpacing: '-0.01em' }}>{state.title}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="mono">{state.idx + 1} / {state.slots.length}</span>
            <button onClick={close} data-hover aria-label="Close" style={{
              width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--line-strong)',
              background: 'transparent', color: 'var(--fg)', cursor: 'none',
              fontFamily: 'var(--mono)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>×</button>
          </div>
        </header>

        {/* Main viewer */}
        <div style={{ flex: 1, position: 'relative', padding: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
          {state.slots.length > 0 && (
            <div style={{
              width: '100%', height: '100%',
              border: '1px solid var(--line)', borderRadius: 4,
              background: 'var(--bg-card)', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              {state.slots.map((s, i) => (
                <div key={s.id} style={{
                  position: 'absolute', inset: 0,
                  opacity: i === state.idx ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: i === state.idx ? 'auto' : 'none',
                }}>
                  <image-slot
                    id={s.id}
                    src={s.src}
                    placeholder={s.placeholder}
                    shape="rect"
                    fit="contain"
                    style={{ display: 'block', width: '100%', height: '100%' }}
                  ></image-slot>
                </div>
              ))}

              {/* Prev/Next */}
              {state.slots.length > 1 && (
                <>
                  <button onClick={prev} data-hover aria-label="Previous" style={navBtnStyle('left')}>‹</button>
                  <button onClick={next} data-hover aria-label="Next" style={navBtnStyle('right')}>›</button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        <footer style={{ padding: '18px 28px 24px', borderTop: '1px solid var(--line)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${state.slots.length || 1}, 1fr)`, gap: 10 }}>
            {state.slots.map((s, i) => (
              <button key={s.id} onClick={() => setState(prev => ({ ...prev, idx: i }))}
                data-hover
                style={{
                  aspectRatio: '4 / 3',
                  border: i === state.idx ? '1px solid var(--accent)' : '1px solid var(--line-strong)',
                  background: 'var(--bg-card)', borderRadius: 4, padding: 0, overflow: 'hidden',
                  cursor: 'none',
                  position: 'relative',
                  transition: 'border-color 0.2s ease',
                }}>
                <image-slot
                  id={s.id}
                  src={s.src}
                  placeholder={`#${i + 1}`}
                  shape="rect"
                  fit="cover"
                  style={{ display: 'block', width: '100%', height: '100%', pointerEvents: 'none' }}
                ></image-slot>
                <span style={{
                  position: 'absolute', left: 6, top: 6,
                  fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.08em',
                  color: 'var(--fg)', background: 'color-mix(in oklab, var(--bg) 70%, transparent)',
                  padding: '2px 6px', borderRadius: 2,
                }}>{String(i + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </div>
          <div className="mono" style={{ marginTop: 12, color: 'var(--fg-faint)' }}>
            Drop image files into any slot to fill it · arrow keys / esc
          </div>
        </footer>
      </aside>
    </>
  );
}

function navBtnStyle(side) {
  return {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    [side]: 16,
    width: 44, height: 44, borderRadius: '50%',
    border: '1px solid var(--line-strong)',
    background: 'color-mix(in oklab, var(--bg) 70%, transparent)',
    backdropFilter: 'blur(8px)',
    color: 'var(--fg)', cursor: 'none',
    fontFamily: 'var(--serif)', fontSize: 24, lineHeight: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 2,
  };
}

// -------- GitHub live activity --------
function relativeTime(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 86400 * 365) return `${Math.floor(diff / (86400 * 30))}mo ago`;
  return `${Math.floor(diff / (86400 * 365))}y ago`;
}

// Map github language → swatch (close to GitHub's own palette)
const LANG_COLORS = {
  Java: '#b07219',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'C++': '#f34b7d',
  C: '#555555',
  Dockerfile: '#384d54',
  Kotlin: '#A97BFF',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
};
const langColor = (l) => LANG_COLORS[l] || 'oklch(0.65 0.05 70)';

function summarizeEvent(ev) {
  const repo = ev.repo?.name?.split('/').slice(-1)[0] || ev.repo?.name || 'repo';
  const full = ev.repo?.name || '';
  switch (ev.type) {
    case 'PushEvent': {
      const n = ev.payload?.commits?.length || ev.payload?.size || 1;
      return { verb: 'Pushed', noun: `${n} commit${n === 1 ? '' : 's'} to`, repo, full, icon: '↑' };
    }
    case 'PullRequestEvent':
      return { verb: ev.payload?.action === 'closed' ? 'Closed' : 'Opened', noun: 'a PR in', repo, full, icon: '⤴' };
    case 'IssuesEvent':
      return { verb: ev.payload?.action === 'closed' ? 'Closed' : 'Opened', noun: 'an issue in', repo, full, icon: '◯' };
    case 'CreateEvent': {
      const t = ev.payload?.ref_type || 'repo';
      return { verb: 'Created', noun: `${t === 'repository' ? 'repo' : t} in`, repo, full, icon: '+' };
    }
    case 'ForkEvent':
      return { verb: 'Forked', noun: '', repo, full, icon: '⑂' };
    case 'WatchEvent':
      return { verb: 'Starred', noun: '', repo, full, icon: '★' };
    case 'ReleaseEvent':
      return { verb: 'Released', noun: 'in', repo, full, icon: '⚐' };
    case 'DeleteEvent':
      return { verb: 'Deleted', noun: `${ev.payload?.ref_type} in`, repo, full, icon: '×' };
    case 'PullRequestReviewEvent':
      return { verb: 'Reviewed', noun: 'PR in', repo, full, icon: '✓' };
    default:
      return { verb: ev.type.replace('Event', ''), noun: 'in', repo, full, icon: '◇' };
  }
}

function GitHubActivity() {
  const [data, setData] = useState({ user: null, repos: null, err: null });
  const [barVis, setBarVis] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setBarVis(true); io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const [u, r] = await Promise.all([
          fetch('https://api.github.com/users/starlord92').then(x => x.json()),
          fetch('https://api.github.com/users/starlord92/repos?sort=updated&per_page=100').then(x => x.json()),
        ]);
        if (!cancelled) setData({ user: u, repos: r, err: null });
      } catch (err) {
        if (!cancelled) setData(d => ({ ...d, err: err.message }));
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  // Language breakdown across repos
  const langs = useMemo(() => {
    const repos = Array.isArray(data.repos) ? data.repos : [];
    const tally = new Map();
    for (const r of repos) {
      if (!r.language) continue;
      tally.set(r.language, (tally.get(r.language) || 0) + 1);
    }
    const entries = [...tally.entries()].sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((s, [, n]) => s + n, 0) || 1;
    return entries.map(([name, n]) => ({ name, pct: (n / total) * 100, count: n }));
  }, [data.repos]);

  const repos = Array.isArray(data.repos) ? data.repos : [];

  return (
    <section className="section" id="activity">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">§ 03 · Languages</span>
          <h2>What I <em>actually reach for</em>, across {repos.length || '—'} public repos.</h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '180px 1fr',
          gap: 48, alignItems: 'start',
        }} className="lang-grid">
          <div>
            <div className="mono" style={{ marginBottom: 8 }}>@starlord92</div>
            <a href="https://github.com/starlord92" target="_blank" rel="noreferrer" data-hover
              style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent)', borderBottom: '1px solid currentColor', paddingBottom: 2 }}>
              github ↗
            </a>
          </div>

          <div>
            {/* The bar */}
            <div ref={barRef} style={{
              height: 14, borderRadius: 999, overflow: 'hidden', display: 'flex',
              background: 'var(--line)',
              boxShadow: 'inset 0 0 0 1px var(--line)',
            }}>
              {langs.map((l, i) => (
                <div key={l.name} title={`${l.name} · ${l.count} repo${l.count === 1 ? '' : 's'}`}
                  style={{
                    width: `${l.pct}%`,
                    background: langColor(l.name),
                    transform: barVis ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: `transform ${0.7 + i * 0.06}s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s`,
                  }} />
              ))}
            </div>

            {/* legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px 28px', marginTop: 24 }}>
              {langs.map(l => (
                <div key={l.name} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: langColor(l.name), transform: 'translateY(1px)' }} />
                  <span style={{ fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--fg)', letterSpacing: '-0.005em' }}>{l.name}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-dim)' }}>{l.pct.toFixed(0)}%</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-faint)' }}>({l.count})</span>
                </div>
              ))}
              {!langs.length && !data.err && <RepoSkeleton />}
              {data.err && <span style={{ color: 'var(--fg-dim)', fontFamily: 'var(--mono)', fontSize: 12 }}>// couldn't reach github api</span>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BigStat({ label, value, sub }) {
  return (
    <div data-hover style={{
      border: '1px solid var(--line)', background: 'var(--bg-card)',
      padding: '24px 26px', borderRadius: 4,
    }}>
      <div className="mono" style={{ marginBottom: 12 }}>{label}</div>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 56, color: 'var(--accent)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
        {value}
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-dim)', marginTop: 10, letterSpacing: '0.04em' }}>
        {sub}
      </div>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <>
      {[0,1,2,3].map(i => (
        <li key={i} style={{ padding: '14px 0', borderTop: '1px solid var(--line)' }}>
          <div style={{ width: '70%', height: 14, background: 'var(--bg-card)', borderRadius: 2 }} />
          <div style={{ width: '40%', height: 10, background: 'var(--bg-card)', borderRadius: 2, marginTop: 8 }} />
        </li>
      ))}
    </>
  );
}

function GhStat({ k, v }) {
  return (
    <div style={{ border: '1px solid var(--line)', padding: '14px 16px', borderRadius: 4, background: 'var(--bg-card)' }}>
      <div className="mono" style={{ marginBottom: 4 }}>{k}</div>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 32, color: 'var(--fg)', lineHeight: 1 }}>{v}</div>
    </div>
  );
}

function RepoSkeleton() {
  return (
    <>
      {[0,1,2].map(i => (
        <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid var(--line)' }}>
          <div style={{ width: '40%', height: 22, background: 'var(--bg-card)', borderRadius: 2 }} />
          <div style={{ width: '60%', height: 12, background: 'var(--bg-card)', borderRadius: 2, marginTop: 10 }} />
        </div>
      ))}
    </>
  );
}

// -------- Experience timeline --------
function Experience() {
  const jobs = [
    {
      role: 'Lead Software Engineer',
      company: 'Hotkey Solutions',
      where: 'Baltimore, MD',
      when: 'Jul 2024 – Present',
      bullets: [
        'Design and ship event-driven microservices in Java 17 / Spring Boot supporting 3 production AI platforms.',
        'Architected Kafka pipelines handling 50k+ daily events at sub-second latency, 99.9% reliability.',
        'Built CI/CD on Jenkins + Argo CD; deployment time down 65%, multiple daily releases.',
        'OpenTelemetry + Prometheus + Grafana observability; MTTR from 4 hrs → 45 min.',
        'Owns API gateway, OAuth/JWT, RBAC across services and shared auth ecosystem.',
      ],
    },
    {
      role: 'Software Engineer Intern',
      company: 'Wavemaker, Inc.',
      where: 'Hyderabad, India',
      when: 'Jan – May 2022',
      bullets: [
        'Full-stack features in React + Spring Boot for client-facing apps.',
        '80%+ test coverage with JUnit and Jest, 50+ defects resolved across the stack.',
        'Designed Postgres schemas and optimized data-access layer via Spring Data JPA.',
      ],
    },
  ];

  const edu = [
    { school: 'University of Maryland, Baltimore County', deg: 'M.S. Information Sciences', gpa: '3.7 / 4.0', when: 'Aug 2022 – May 2024' },
    { school: 'Malla Reddy University', deg: 'B.Tech Computer Science', gpa: '3.5 / 4.0', when: 'Jul 2018 – Jul 2022' },
  ];

  return (
    <section className="section" id="experience">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">§ 04 · Experience</span>
          <h2>Where I've <em>shipped code</em>.</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {jobs.map((j, i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '200px 1fr',
              gap: 48,
              padding: '36px 0',
              borderTop: '1px solid var(--line)',
            }} className="exp-row">
              <div>
                <div className="mono" style={{ marginBottom: 8 }}>{j.when}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--fg-faint)' }}>{j.where}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 36, color: 'var(--fg)', lineHeight: 1.05, letterSpacing: '-0.015em' }}>
                  {j.role} <span style={{ color: 'var(--accent)' }}>·</span> {j.company}
                </div>
                <ul style={{ marginTop: 16, padding: 0, listStyle: 'none', display: 'grid', gap: 10, color: 'var(--fg-dim)', fontSize: 15, lineHeight: 1.55, maxWidth: 720 }}>
                  {j.bullets.map((b, k) => (
                    <li key={k} style={{ paddingLeft: 18, position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, top: '0.6em', width: 8, height: 1, background: 'var(--line-strong)' }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mono" style={{ marginTop: 64, marginBottom: 18 }}>Education</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="edu-grid">
          {edu.map((e, i) => (
            <div key={i} style={{ border: '1px solid var(--line)', background: 'var(--bg-card)', padding: 24, borderRadius: 4 }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 24, color: 'var(--fg)', letterSpacing: '-0.01em' }}>{e.school}</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--fg-dim)', marginTop: 4 }}>{e.deg}</div>
              <div className="mono" style={{ marginTop: 12 }}>{e.when} · GPA {e.gpa}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------- Stack --------
function Stack() {
  const [stackVis, setStackVis] = useState(false);
  const stackRef = useRef(null);
  useEffect(() => {
    const el = stackRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStackVis(true); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const groups = [
    { k: 'Languages', v: ['Java 17', 'TypeScript', 'JavaScript', 'Python', 'Go', 'SQL', 'Bash', 'C / C++'] },
    { k: 'Backend', v: ['Spring Boot', 'Spring Batch', 'Spring Cloud', 'Micronaut', 'Node.js'] },
    { k: 'Events / APIs', v: ['Apache Kafka', 'Kafka Streams', 'RabbitMQ', 'gRPC', 'GraphQL', 'REST'] },
    { k: 'Frontend', v: ['React', 'Angular', 'Next.js'] },
    { k: 'Data', v: ['PostgreSQL', 'MySQL', 'DynamoDB', 'MongoDB', 'Redis', 'OpenSearch'] },
    { k: 'Cloud', v: ['AWS · EKS · Lambda · ECS · S3 · RDS · CDK', 'PCF', 'Azure'] },
    { k: 'DevOps', v: ['Docker', 'Kubernetes', 'Terraform', 'Argo CD', 'Helm', 'Jenkins', 'GitHub Actions'] },
    { k: 'Observability', v: ['OpenTelemetry', 'Prometheus', 'Grafana', 'ELK', 'CloudWatch'] },
    { k: 'Security', v: ['OAuth 2.0', 'JWT', 'SAST / DAST / SCA', 'Chaos engineering'] },
    { k: 'Testing', v: ['JUnit', 'PyTest', 'Jest', 'Cypress', 'Pact', 'Mockito'] },
  ];
  return (
    <section className="section" id="stack">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">§ 05 · Stack</span>
          <h2>Tools I <em>reach for</em>.</h2>
        </div>
        <div ref={stackRef} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0',
          borderTop: '1px solid var(--line)',
        }} className="stack-grid">
          {groups.map((g, i) => (
            <div key={g.k} style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr',
              gap: 24, padding: '24px 28px',
              borderBottom: '1px solid var(--line)',
              borderRight: i % 2 === 0 ? '1px solid var(--line)' : 'none',
            }}>
              <div className="mono" style={{ paddingTop: 4 }}>{g.k}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {g.v.map((t, ti) => (
                  <span key={t}
                    className={stackVis ? 'tag-pop' : ''}
                    style={{
                      fontFamily: 'var(--mono)', fontSize: 12,
                      padding: '4px 10px', border: '1px solid var(--line-strong)',
                      borderRadius: 2, color: 'var(--fg)',
                      opacity: stackVis ? undefined : 0,
                      animationDelay: stackVis ? `${(i * 3 + ti) * 30}ms` : undefined,
                    }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------- Contact --------
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', msg: '' });
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!form.email || !form.msg) return;
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name || 'someone'}`);
    const body = encodeURIComponent(`${form.msg}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:sumanth.reddy9214@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section className="section" id="contact" style={{ paddingBottom: 80 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="num">§ 06 · Contact</span>
          <h2>Let's <em>build something.</em></h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }} className="contact-grid">
          <div>
            <p style={{ fontFamily: 'var(--serif)', fontSize: 24, lineHeight: 1.4, color: 'var(--fg)', marginTop: 0 }}>
              I'm open to senior backend / platform roles, contract work, and the occasional interesting side project. Drop a note — I read everything.
            </p>
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <ContactLine label="Email" value="sumanth.reddy9214@gmail.com" href="mailto:sumanth.reddy9214@gmail.com" />
              <ContactLine label="Phone" value="667 · 335 · 4909" href="tel:6673354909" />
              <ContactLine label="LinkedIn" value="/in/saisumanth-reddy" href="https://www.linkedin.com/in/saisumanth-reddy" />
              <ContactLine label="GitHub" value="@starlord92" href="https://github.com/starlord92" />
              <ContactLine label="Résumé" value="Sai_Sumanth_Reddy.pdf ↓" href="assets/Sai_Sumanth_Reddy_Resume.pdf" download />
            </div>
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Field label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
            <Field label="Email" type="email" required value={form.email} onChange={v => setForm({ ...form, email: v })} />
            <Field label="Message" textarea required value={form.msg} onChange={v => setForm({ ...form, msg: v })} />
            <button type="submit" className="btn btn-primary" data-hover style={{ alignSelf: 'flex-start', marginTop: 8 }}>
              {sent ? 'Sent ✓' : 'Send message →'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function ContactLine({ label, value, href, download }) {
  return (
    <a href={href} download={download} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer" data-hover style={{
      display: 'grid', gridTemplateColumns: '100px 1fr auto',
      gap: 16, alignItems: 'baseline',
      padding: '14px 0', borderTop: '1px solid var(--line)',
    }}>
      <span className="mono">{label}</span>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 15, color: 'var(--fg)' }}>{value}</span>
      <span style={{ color: 'var(--fg-faint)' }}>↗</span>
    </a>
  );
}

function Field({ label, value, onChange, textarea, type = 'text', required }) {
  return (
    <label style={{ display: 'block' }}>
      <div className="mono" style={{ marginBottom: 6 }}>{label}{required && <span style={{ color: 'var(--accent)' }}>*</span>}</div>
      {textarea ? (
        <textarea required={required} value={value} onChange={(e) => onChange(e.target.value)} rows={5} style={inputStyle} />
      ) : (
        <input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
      )}
    </label>
  );
}

const inputStyle = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--line-strong)',
  padding: '8px 0',
  fontFamily: 'var(--mono)',
  fontSize: 14,
  color: 'var(--fg)',
  outline: 'none',
  resize: 'vertical',
};

// -------- Footer --------
function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--line)',
      padding: '32px 0',
      fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-faint)',
      letterSpacing: '0.06em', textTransform: 'uppercase',
    }}>
      <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span>© 2026 Sai Sumanth Reddy · Baltimore, MD</span>
        <span>Built with React · Hand-tuned typography</span>
      </div>
    </footer>
  );
}

// Export to window so app.jsx can use them
Object.assign(window, {
  Nav, Hero, About, ProjectCard, ArchDiagram,
  GitHubActivity, Experience, Stack, Contact, Footer,
  GalleryPanel,
});
