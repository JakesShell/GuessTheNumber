import { Topbar } from "../components/Shared.jsx";

export default function KpiLibraryPage({ dashboard }) {
  return (
    <>
      <Topbar
        title="KPI Library"
        subtitle="Training scenarios grouped by category, role path, difficulty, and business metric."
      />

      <section className="panel">
        <div className="scenario-grid">
          {dashboard.scenarios.map((scenario) => (
            <article className="scenario-card" key={scenario.id}>
              <p className="eyebrow">{scenario.category}</p>
              <h2>{scenario.title}</h2>
              <p>{scenario.brief}</p>

              <div className="detail-grid">
                <div><span>Difficulty</span><strong>{scenario.difficulty}</strong></div>
                <div><span>Role Path</span><strong>{scenario.rolePath}</strong></div>
                <div><span>Metric</span><strong>{scenario.metric}</strong></div>
                <div><span>Target</span><strong>{scenario.target} {scenario.unit}</strong></div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}