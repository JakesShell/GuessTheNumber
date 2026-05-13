import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  Database,
  Home,
  Moon,
  Server,
  ShieldCheck,
  Sun,
  Target,
  Wifi,
  WifiOff
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080";

export function Logo() {
  return (
    <Link className="brand-lockup" to="/">
      <div className="brand-mark">
        <Target size={20} />
      </div>
      <div>
        <strong>MetricForge</strong>
        <span>JSA Enterprise Learning Systems</span>
      </div>
    </Link>
  );
}

function NavLink({ to, children }) {
  const location = useLocation();
  const active = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <Link className={active ? "active" : ""} to={to}>
      {children}
    </Link>
  );
}

function ApiStatusPill() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;

    fetch(`${API_BASE}/health`)
      .then((response) => {
        if (!mounted) return;
        setStatus(response.ok ? "healthy" : "degraded");
      })
      .catch(() => {
        if (!mounted) return;
        setStatus("offline");
      });

    return () => {
      mounted = false;
    };
  }, []);

  const healthy = status === "healthy";

  return (
    <div className={`api-status-pill ${healthy ? "healthy" : "offline"}`}>
      {healthy ? <Wifi size={14} /> : <WifiOff size={14} />}
      <span>{healthy ? "API Healthy" : status === "checking" ? "Checking API" : "API Offline"}</span>
    </div>
  );
}

export function Layout({ children, role, setRole, theme, setTheme }) {
  return (
    <div className={`app-shell ${theme === "dark" ? "theme-dark" : ""}`}>
      <header className="global-header">
        <Logo />

        <nav className="global-nav">
          <NavLink to="/">Overview</NavLink>
          <NavLink to="/simulation-lab">Simulation Lab</NavLink>
          <NavLink to="/manager-review">Manager Review</NavLink>
          <NavLink to="/kpi-library">KPI Library</NavLink>
          <NavLink to="/training-history">History</NavLink>
          <NavLink to="/security">Security & AWS</NavLink>
        </nav>

        <div className="global-ops">
          <ApiStatusPill />
          <button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <div className="global-role">
            <span>View As</span>
            <select value={role} onChange={(event) => setRole(event.target.value)}>
              <option>Learner</option>
              <option>Manager</option>
              <option>Training Lead</option>
              <option>Executive</option>
              <option>Admin</option>
              <option>Viewer</option>
            </select>
          </div>
        </div>
      </header>

      <main className="main-content">
        {children}
        <ProductFooter />
      </main>
    </div>
  );
}

export function ProductFooter() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="product-footer-wrap">
      <section className="page-endcap">
        <div>
          <p className="eyebrow">Next Step</p>
          <h2>Train KPI judgment before production decisions.</h2>
          <p>
            Use MetricForge to help learners practice estimation accuracy, threshold awareness,
            and business decision quality in a safe simulation environment.
          </p>
        </div>

        <div className="endcap-actions">
          <Link className="primary-link" to="/simulation-lab">
            Start Simulation <ArrowUpRight size={16} />
          </Link>
          <Link className="ghost-button" to="/manager-review">
            Review Coaching Queue
          </Link>
          <Link className="ghost-button" to="/kpi-library">
            Open KPI Library
          </Link>
        </div>
      </section>

      <section className="product-footer">
        <div className="footer-brand-column">
          <Logo />
          <p>
            KPI simulation and readiness training for teams learning to estimate metrics,
            interpret thresholds, and make better operational decisions.
          </p>

          <div className="footer-status-row">
            <span><Activity size={15} /> Demo Environment</span>
            <span><Server size={15} /> API Health Ready</span>
            <span><Database size={15} /> Simulated Data</span>
          </div>
        </div>

        <div className="footer-link-column">
          <h3>Platform</h3>
          <Link to="/">Training Overview</Link>
          <Link to="/simulation-lab">Simulation Lab</Link>
          <Link to="/manager-review">Manager Review</Link>
          <Link to="/kpi-library">KPI Library</Link>
          <Link to="/training-history">Training History</Link>
        </div>

        <div className="footer-link-column">
          <h3>Trust & Cloud</h3>
          <Link to="/security">Security & AWS Readiness</Link>
          <span>Audit Logging</span>
          <span>Role-Aware Workflows</span>
          <span>Health Endpoint</span>
          <span>Docker Ready</span>
        </div>

        <div className="footer-link-column">
          <h3>System</h3>
          <span>MetricForge v1.0</span>
          <span>JSA Enterprise</span>
          <span>Training Intelligence Module</span>
          <button className="footer-top-button" onClick={scrollToTop}>
            Back To Top
          </button>
        </div>
      </section>
    </footer>
  );
}

export function Topbar({ title, subtitle }) {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div>
        <div className="breadcrumbs">
          <Link to="/"><Home size={14} /> Home</Link>
          <ChevronRight size={14} />
          <span>{title}</span>
        </div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="topbar-actions">
        <button className="ghost-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Back
        </button>
        <Link className="ghost-button" to="/">
          <Home size={16} />
          Home
        </Link>
      </div>
    </header>
  );
}

export function MetricCard({ label, value, note, icon = BarChart3 }) {
  const Icon = icon;

  return (
    <article className="metric-card">
      <div className="metric-icon"><Icon size={18} /></div>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}

export function ReadinessBadge({ status }) {
  let className = "good";
  if (status === "Coaching Needed" || status === "At Risk") className = "danger";
  if (status === "Improving" || status === "Developing") className = "warn";
  if (status === "Ready" || status === "Strong") className = "good";

  return <span className={`pill ${className}`}>{status}</span>;
}

export function ScoreBar({ value }) {
  return (
    <div className="score-track">
      <div className="score-fill" style={{ width: `${value}%` }} />
    </div>
  );
}

export function SecurityNotice() {
  return (
    <div className="security-notice">
      <ShieldCheck size={18} />
      <p>
        Demo data only. Includes validation, role-aware workflows, secure headers,
        rate limiting, audit logging, a health endpoint, and AWS deployment notes.
      </p>
    </div>
  );
}