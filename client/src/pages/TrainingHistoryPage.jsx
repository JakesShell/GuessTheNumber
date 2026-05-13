import { Topbar } from "../components/Shared.jsx";

export default function TrainingHistoryPage({ dashboard }) {
  return (
    <>
      <Topbar
        title="Training History"
        subtitle="Recent KPI simulation attempts with score breakdowns and readiness outcomes."
      />

      <section className="panel">
        <div className="data-table">
          <div className="data-row header">
            <span>Learner</span>
            <span>Scenario</span>
            <span>Category</span>
            <span>Estimate</span>
            <span>Accuracy</span>
            <span>Threshold</span>
            <span>Decision</span>
            <span>Readiness</span>
          </div>

          {dashboard.sessions.map((session) => (
            <div className="data-row" key={session.id}>
              <strong>{session.learnerName}</strong>
              <span>{session.scenarioTitle}</span>
              <span>{session.category}</span>
              <span>{session.estimate}</span>
              <span>{session.accuracyScore}/100</span>
              <span>{session.thresholdScore}/100</span>
              <span>{session.decisionScore}/100</span>
              <strong>{session.readinessScore}/100</strong>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}