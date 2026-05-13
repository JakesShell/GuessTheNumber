import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  LineChart,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MetricCard, ReadinessBadge, ScoreBar, SecurityNotice } from "../components/Shared.jsx";

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -60px 0px"
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function KpiIntelligenceVisual() {
  return (
    <div className="kpi-visual-card">
      <div className="visual-toolbar">
        <span></span>
        <span></span>
        <span></span>
        <strong>KPI Readiness Map</strong>
      </div>

      <div className="signal-map">
        <div className="map-ring ring-one"></div>
        <div className="map-ring ring-two"></div>
        <div className="map-ring ring-three"></div>

        <div className="signal-node node-a">
          <span>84</span>
          <small>Accuracy</small>
        </div>

        <div className="signal-node node-b">
          <span>72</span>
          <small>Threshold</small>
        </div>

        <div className="signal-node node-c">
          <span>91</span>
          <small>Decision</small>
        </div>

        <div className="signal-core">
          <Target size={28} />
          <strong>Ready</strong>
        </div>
      </div>

      <div className="visual-footer">
        <div>
          <span>Simulation Flow</span>
          <strong>Estimate &gt; Interpret &gt; Decide</strong>
        </div>
        <div>
          <span>Engine</span>
          <strong>Online</strong>
        </div>
      </div>
    </div>
  );
}

function LearningPathVisual() {
  return (
    <div className="learning-path-visual">
      <div className="path-line"></div>

      <div className="path-step step-one">
        <span>01</span>
        <strong>Estimate KPI</strong>
        <p>Learner predicts a business metric from scenario context.</p>
      </div>

      <div className="path-step step-two">
        <span>02</span>
        <strong>Classify Risk</strong>
        <p>The system checks if the estimate lands in healthy, warning, or critical range.</p>
      </div>

      <div className="path-step step-three">
        <span>03</span>
        <strong>Choose Action</strong>
        <p>The learner selects the best operational response.</p>
      </div>

      <div className="path-step step-four">
        <span>04</span>
        <strong>Coach Next</strong>
        <p>Managers see readiness gaps and assign targeted training.</p>
      </div>
    </div>
  );
}

function TrendChart() {
  const points = [58, 63, 66, 71, 76, 79, 82, 84];
  return (
    <div className="trend-chart">
      {points.map((point, index) => (
        <div className="trend-bar-wrap" key={index}>
          <div className="trend-bar" style={{ height: `${point}%` }}></div>
          <span>W{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

function CompletionFunnel() {
  const stages = [
    { label: "Assigned", value: 100 },
    { label: "Started", value: 86 },
    { label: "Completed", value: 72 },
    { label: "Ready", value: 58 }
  ];

  return (
    <div className="funnel-stack">
      {stages.map((stage) => (
        <div className="funnel-row" key={stage.label}>
          <span>{stage.label}</span>
          <div><strong style={{ width: `${stage.value}%` }}>{stage.value}%</strong></div>
        </div>
      ))}
    </div>
  );
}

function SkillPathways() {
  const paths = [
    { name: "KPI Foundations", level: "Beginner", progress: 88 },
    { name: "Threshold Judgment", level: "Intermediate", progress: 72 },
    { name: "Operational Decisions", level: "Advanced", progress: 61 }
  ];

  return (
    <div className="skill-pathways">
      {paths.map((path) => (
        <article className="skill-card" key={path.name}>
          <div>
            <span>{path.level}</span>
            <h3>{path.name}</h3>
          </div>
          <strong>{path.progress}%</strong>
          <ScoreBar value={path.progress} />
        </article>
      ))}
    </div>
  );
}

export default function HomePage({ dashboard }) {
  const [learnerSearch, setLearnerSearch] = useState("");
  const [scenarioSearch, setScenarioSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const strongestLearner = [...dashboard.learners].sort(
    (a, b) => b.readinessScore - a.readinessScore
  )[0];

  const coachingLearners = dashboard.learners.filter(
    (learner) => learner.status === "Coaching Needed" || learner.status === "At Risk"
  );

  const categories = useMemo(() => {
    return ["All", ...new Set(dashboard.scenarios.map((scenario) => scenario.category))];
  }, [dashboard.scenarios]);

  const filteredLearners = useMemo(() => {
    const query = learnerSearch.toLowerCase();

    return dashboard.learners.filter((learner) =>
      learner.name.toLowerCase().includes(query) ||
      learner.role.toLowerCase().includes(query) ||
      learner.team.toLowerCase().includes(query) ||
      learner.weakestCategory.toLowerCase().includes(query)
    );
  }, [dashboard.learners, learnerSearch]);

  const filteredScenarios = useMemo(() => {
    const query = scenarioSearch.toLowerCase();

    return dashboard.scenarios.filter((scenario) => {
      const matchesSearch =
        scenario.title.toLowerCase().includes(query) ||
        scenario.category.toLowerCase().includes(query) ||
        scenario.metric.toLowerCase().includes(query) ||
        scenario.rolePath.toLowerCase().includes(query);

      const matchesDifficulty = difficultyFilter === "All" || scenario.difficulty === difficultyFilter;
      const matchesCategory = categoryFilter === "All" || scenario.category === categoryFilter;

      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [dashboard.scenarios, scenarioSearch, difficultyFilter, categoryFilter]);

  return (
    <>
      <Reveal>
        <section className="training-command-strip elevated-hero">
          <div>
            <p className="eyebrow">JSA Enterprise Learning Intelligence</p>
            <h1>MetricForge Training Operations</h1>
            <p>
              A KPI readiness system for training employees to estimate business metrics,
              understand thresholds, and make better operational decisions before they touch live dashboards.
            </p>

            <div className="hero-proof-row">
              <span><Sparkles size={15} /> LMS-style analytics</span>
              <span><TrendingUp size={15} /> KPI readiness scoring</span>
              <span><BrainCircuit size={15} /> Decision quality engine</span>
            </div>
          </div>

          <div className="command-actions hero-actions-block">
            <Link className="primary-link" to="/simulation-lab">
              Start Simulation <ArrowUpRight size={16} />
            </Link>
            <Link className="ghost-button" to="/manager-review">
              Review Learners
            </Link>
          </div>
        </section>
      </Reveal>

      <Reveal delay={80}>
        <section className="visual-showcase">
          <KpiIntelligenceVisual />

          <div className="visual-copy">
            <p className="eyebrow">Training Intelligence Layer</p>
            <h2>From guessing numbers to proving operational judgment.</h2>
            <p>
              MetricForge teaches people how to read business signals. Each simulation checks
              estimation accuracy, threshold awareness, and decision quality, then turns the result
              into coaching data managers can actually use.
            </p>

            <div className="visual-copy-grid">
              <div>
                <span>Accuracy</span>
                <strong>Estimate vs. Target</strong>
              </div>
              <div>
                <span>Awareness</span>
                <strong>Healthy / Warning / Critical</strong>
              </div>
              <div>
                <span>Decision</span>
                <strong>Best Business Action</strong>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={120}>
        <section className="learning-status-grid">
          <article className="status-tile featured">
            <span>Team Readiness</span>
            <strong>{dashboard.metrics.averageReadiness}/100</strong>
            <p>Weighted score from KPI accuracy, threshold interpretation, and decision quality.</p>
          </article>

          <article className="status-tile">
            <span>Training Engine</span>
            <strong>Online</strong>
            <p>Scoring active</p>
          </article>

          <article className="status-tile">
            <span>Scenario Library</span>
            <strong>{dashboard.metrics.scenarioCount}</strong>
            <p>Active simulations</p>
          </article>

          <article className="status-tile">
            <span>Top Learner</span>
            <strong>{strongestLearner?.name ?? "N/A"}</strong>
            <p>Highest readiness score</p>
          </article>

          <article className="status-tile alert">
            <span>Coaching Queue</span>
            <strong>{coachingLearners.length}</strong>
            <p>Needs manager attention</p>
          </article>
        </section>
      </Reveal>

      <Reveal delay={100}>
        <section className="analytics-board">
          <article className="analytics-card wide">
            <div className="section-toolbar">
              <div>
                <p className="eyebrow">Readiness Trend</p>
                <h2>Eight-week learning velocity</h2>
              </div>
              <span className="subtle-chip">+26 pts</span>
            </div>
            <TrendChart />
          </article>

          <article className="analytics-card">
            <div className="section-toolbar">
              <div>
                <p className="eyebrow">Completion Funnel</p>
                <h2>Simulation progress</h2>
              </div>
            </div>
            <CompletionFunnel />
          </article>

          <article className="analytics-card">
            <div className="section-toolbar">
              <div>
                <p className="eyebrow">Skill Pathways</p>
                <h2>Role readiness tracks</h2>
              </div>
            </div>
            <SkillPathways />
          </article>
        </section>
      </Reveal>

      <Reveal delay={80}>
        <section className="process-section">
          <div>
            <p className="eyebrow">Simulation Workflow</p>
            <h2>How MetricForge trains KPI judgment</h2>
            <p>
              This is the core product story: the learner does not just answer a question.
              They move through a business scenario, make an estimate, interpret risk, and
              choose an action.
            </p>
          </div>

          <LearningPathVisual />
        </section>
      </Reveal>

      <Reveal delay={100}>
        <section className="admin-layout">
          <div className="admin-main">
            <div className="section-toolbar">
              <div>
                <p className="eyebrow">Learner Readiness</p>
                <h2>Training Cohort Performance</h2>
              </div>
              <span className="subtle-chip">Showing {filteredLearners.length} learners</span>
            </div>

            <div className="table-control-bar">
              <div className="input-shell">
                <Search size={16} />
                <input
                  value={learnerSearch}
                  onChange={(event) => setLearnerSearch(event.target.value)}
                  placeholder="Search learners, teams, roles, or weak areas..."
                />
              </div>
            </div>

            <div className="enterprise-table">
              <div className="enterprise-row header">
                <span>Learner</span>
                <span>Role</span>
                <span>Team</span>
                <span>Readiness</span>
                <span>Weak Area</span>
                <span>Status</span>
              </div>

              {filteredLearners.map((learner) => (
                <div className="enterprise-row" key={learner.id}>
                  <div className="learner-cell">
                    <div className="avatar small-avatar">
                      {learner.name.split(" ").map((part) => part[0]).join("")}
                    </div>
                    <Link to={`/learners/${learner.id}`}><strong>{learner.name}</strong></Link>
                  </div>
                  <span>{learner.role}</span>
                  <span>{learner.team}</span>
                  <div>
                    <strong>{learner.readinessScore}/100</strong>
                    <ScoreBar value={learner.readinessScore} />
                  </div>
                  <span>{learner.weakestCategory}</span>
                  <ReadinessBadge status={learner.status} />
                </div>
              ))}
            </div>
          </div>

          <aside className="admin-side">
            <div className="side-panel">
              <p className="eyebrow">Manager Intelligence</p>
              <h2>Coaching Queue</h2>
              <p>
                MetricForge identifies learners with weak KPI judgment and recommends focused coaching by category.
              </p>

              <div className="kanban-stack">
                {coachingLearners.map((learner) => (
                  <article className="kanban-card" key={learner.id}>
                    <div>
                      <strong>{learner.name}</strong>
                      <span>{learner.weakestCategory}</span>
                    </div>
                    <Link to={`/learners/${learner.id}`}>
                      Open <ArrowRight size={14} />
                    </Link>
                  </article>
                ))}
              </div>
            </div>

            <SecurityNotice />
          </aside>
        </section>
      </Reveal>

      <Reveal delay={100}>
        <section className="metrics-grid compact-metrics">
          <MetricCard icon={Target} label="Training Scenarios" value={dashboard.metrics.scenarioCount} note="Role-based KPI simulations" />
          <MetricCard icon={UsersRound} label="Learners Tracked" value={dashboard.metrics.learnerCount} note="Active readiness records" />
          <MetricCard icon={ShieldAlert} label="Coaching Needed" value={dashboard.metrics.coachingNeeded} note="Manager review candidates" />
          <MetricCard icon={BookOpenCheck} label="Completed Sessions" value={dashboard.metrics.completedSessions} note="Recent attempts" />
          <MetricCard icon={LineChart} label="Average Readiness" value={`${dashboard.metrics.averageReadiness}/100`} note="Team score" />
          <MetricCard icon={BrainCircuit} label="Decision Engine" value="Online" note="Scoring service active" />
        </section>
      </Reveal>

      <Reveal delay={100}>
        <section className="scenario-queue">
          <div className="section-toolbar">
            <div>
              <p className="eyebrow">Scenario Catalog</p>
              <h2>KPI Simulation Queue</h2>
            </div>
            <Link className="ghost-button" to="/kpi-library">
              Open KPI Library
            </Link>
          </div>

          <div className="table-control-bar scenario-controls">
            <div className="input-shell">
              <Search size={16} />
              <input
                value={scenarioSearch}
                onChange={(event) => setScenarioSearch(event.target.value)}
                placeholder="Search scenarios, metrics, categories, or role paths..."
              />
            </div>

            <select value={difficultyFilter} onChange={(event) => setDifficultyFilter(event.target.value)}>
              <option>All</option>
              <option>Foundation</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>

            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="queue-grid">
            {filteredScenarios.map((scenario) => (
              <article className="queue-card" key={scenario.id}>
                <span>{scenario.category}</span>
                <h3>{scenario.title}</h3>
                <p>{scenario.metric}</p>

                <div>
                  <strong>{scenario.difficulty}</strong>
                  <small>{scenario.rolePath}</small>
                </div>
              </article>
            ))}
          </div>
        </section>
      </Reveal>
    </>
  );
}