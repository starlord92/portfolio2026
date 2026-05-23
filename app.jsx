// ============================================================
// Portfolio entry — assembles components and holds page data
// ============================================================

const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#d97757",
  "density": "comfortable",
  "showCursor": true
}/*EDITMODE-END*/;

// Projects data — in priority order requested by user
const PROJECTS = [
  {
    title: 'Deuce & Double Faults',
    kind: 'Side project · Web app',
    year: '2025',
    blurb: 'A tennis analytics site for tracking match patterns, double-fault rates, and shot tendencies — built to scratch my own itch.',
    stack: ['React', 'TypeScript', 'Node.js', 'Charts'],
    visual: 'site',
    archKind: 'deuce',
    live: true,
    links: [{ label: 'Live site', href: 'https://www.deuceanddoublefaults.com' }],
    bullets: [
      'Designed to be a single-purpose tool — log matches, see patterns, no fluff.',
      'Frontend in React + TS; data layer pragmatic enough to evolve as I learn what I actually want from it.',
    ],
  },
  {
    title: 'Big Deal Making',
    kind: 'Side project · Web app',
    year: '2025',
    blurb: 'A deal-tracker that surfaces the discounts worth caring about, filtered and ranked the way I\'d actually shop.',
    stack: ['React', 'Node.js', 'PostgreSQL'],
    visual: 'site',
    archKind: 'bigdeal',
    live: true,
    links: [{ label: 'Live site', href: 'https://www.bigdealmaking.site' }],
    bullets: [
      'Built end-to-end — scraping, ranking, UI — to stay sharp on full-stack work outside the day job.',
      'Honest UX: small list, fast filters, no dark patterns.',
    ],
  },
  {
    title: 'Conditional Release Support Platform',
    kind: 'Work · Compliance tracking',
    year: '2024–25',
    blurb: 'A compliance system for daily plans, required actions, alerts, and violation tracking — concurrent cases at scale, with Spring Batch as the heartbeat.',
    stack: ['Spring Boot', 'Spring Batch', 'Kafka', 'TypeScript', 'Firebase'],
    visual: 'arch',
    archKind: 'crs',
    bullets: [
      'Event-driven Kafka pipeline for asynchronous compliance events, escalations, and notification workflows.',
      'Spring Batch jobs run scheduled processing for missed actions and deadline monitoring across 10+ workflow types.',
      'Test-blocking + demo-blocking defects down 45% via systematic root-cause and defensive programming.',
    ],
  },
  {
    title: 'InsightGPT',
    kind: 'Work · AI decision support',
    year: '2024–Present',
    blurb: 'A scalable microservices platform for real-time alerts, reminders, and structured decision workflows — the flagship platform at Hotkey.',
    stack: ['Spring Boot', 'Kafka', 'React', 'Postgres', 'AWS EKS'],
    visual: 'arch',
    archKind: 'insightgpt',
    bullets: [
      'Architected RBAC across 3 user roles with fine-grained permissions; routing & authz accuracy +50%.',
      '5+ role-specific dashboards for decisions, follow-ups, status changes, and compliance metrics in real time.',
      'Horizontal pod autoscaling on EKS — 99.9% uptime, 10k+ concurrent users, sub-200ms p50.',
    ],
  },
  {
    title: 'Comp Restore AI',
    kind: 'Work · Workflow automation',
    year: '2024–25',
    blurb: 'Administrative workflow platform — recovery, resolution, and follow-up across concurrent admin workflows. Serverless backbone, zero idle cost.',
    stack: ['TypeScript', 'Node.js', 'React', 'AWS Lambda', 'Postgres'],
    visual: 'arch',
    archKind: 'comprestore',
    bullets: [
      'Serverless on AWS Lambda + API Gateway — scales to zero between bursts.',
      'OAuth 2.0 + JWT shared auth across multiple apps; killed duplicated access-control logic.',
      '15+ admin workflows validated through iterative cycles with stakeholders.',
    ],
  },
];

function SelectedWork() {
  const [expanded, setExpanded] = useState(null);
  return (
    <section className="section" id="work">
      <div className="wrap">
        <div className="sec-head">
          <span className="num">§ 02 · Selected work</span>
          <h2>Five things <em>I'd want you to know about.</em></h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {PROJECTS.map((p, i) => (
            <ProjectCard
              key={p.title}
              idx={i}
              p={p}
              expanded={expanded === i}
              onToggle={() => setExpanded(expanded === i ? null : i)}
            />
          ))}
          <div style={{ borderTop: '1px solid var(--line)' }} />
        </div>

        <div style={{ marginTop: 32, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-faint)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          ↑ Click any card to expand · Six+ more on{' '}
          <a href="https://github.com/starlord92" target="_blank" rel="noreferrer" data-hover style={{ color: 'var(--accent)', borderBottom: '1px solid currentColor' }}>github</a>.
        </div>
      </div>
    </section>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || 'dark'; } catch { return 'dark'; }
  });
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  // Apply accent color tweak
  useEffect(() => {
    if (tweaks.accent) {
      document.documentElement.style.setProperty('--accent', tweaks.accent);
      document.documentElement.style.setProperty('--accent-soft', tweaks.accent + '24');
    }
  }, [tweaks.accent]);

  // Toggle cursor
  useEffect(() => {
    const ring = document.getElementById('cursor-ring');
    const dot = document.getElementById('cursor-dot');
    if (ring && dot) {
      ring.style.display = tweaks.showCursor ? '' : 'none';
      dot.style.display = tweaks.showCursor ? '' : 'none';
      document.body.style.cursor = tweaks.showCursor ? 'none' : 'auto';
    }
  }, [tweaks.showCursor]);

  // Apply density
  useEffect(() => {
    document.documentElement.setAttribute('data-density', tweaks.density);
  }, [tweaks.density]);

  return (
    <>
      <Nav theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      <main>
        <Hero />
        <About />
        <SelectedWork />
        <GitHubActivity />
        <Experience />
        <Stack />
      </main>
      <Footer />
      <GalleryPanel />

      <TweaksPanel>
        <TweakSection label="Accent color" />
        <TweakColor
          label="Brand"
          value={tweaks.accent}
          onChange={v => setTweak('accent', v)}
          options={['#d97757', '#e8b339', '#7aa37a', '#5b8def', '#c46cd9', '#e6e6e6']}
        />
        <TweakSection label="Layout" />
        <TweakRadio
          label="Density"
          value={tweaks.density}
          onChange={v => setTweak('density', v)}
          options={[
            { value: 'compact', label: 'Compact' },
            { value: 'comfortable', label: 'Roomy' },
          ]}
        />
        <TweakSection label="Interactions" />
        <TweakToggle
          label="Custom cursor"
          value={tweaks.showCursor}
          onChange={v => setTweak('showCursor', v)}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
