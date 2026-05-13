import { ReadinessBadge, ScoreBar, Topbar } from "../components/Shared.jsx";

export default function ManagerReviewPage({ dashboard }) {
  return (
    <>
      <Topbar
        title="Manager Coaching Review"
        subtitle="Review learner readiness, weak KPI categories, and coaching candidates."
      />

      <section className="manager-list">
        {dashboard.learners.map((learner) => (
          <article className="manager-card" key={learner.id}>
            <div>
              <p className="eyebrow">{learner.team}</p>
              <h2>{learner.name}</h2>
              <p>
                {learner.role} | Last session: {learner.lastSession}
              </p>
            </div>

            <ReadinessBadge status={learner.status} />

            <div className="manager-score clean-manager-score">
              <span>Readiness</span>
              <strong>{learner.readinessScore}/100</strong>
            </div>

            <ScoreBar value={learner.readinessScore} />

            <div className="detail-grid">
              <div>
                <span>Sessions Completed</span>
                <strong>{learner.sessionsCompleted}</strong>
              </div>

              <div>
                <span>Weakest KPI Area</span>
                <strong>{learner.weakestCategory}</strong>
              </div>
            </div>

            <button className="primary-link manager-action-button">
              Assign Simulated Coaching
            </button>
          </article>
        ))}
      </section>
    </>
  );
}