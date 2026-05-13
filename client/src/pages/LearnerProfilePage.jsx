import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Award, ClipboardCheck, Target, TrendingUp } from "lucide-react";
import { MetricCard, ReadinessBadge, ScoreBar, Topbar } from "../components/Shared.jsx";

export default function LearnerProfilePage({ dashboard }) {
  const { id } = useParams();
  const learner = dashboard.learners.find((item) => item.id === id) ?? dashboard.learners[0];
  const relatedSessions = dashboard.sessions.filter((session) => session.learnerName === learner.name);
  const recommendedScenarios = dashboard.scenarios.filter((scenario) =>
    scenario.category === learner.weakestCategory || scenario.rolePath.includes(learner.role.split(" ")[0])
  ).slice(0, 3);

  return (
    <>
      <Topbar
        title={learner.name}
        subtitle={`${learner.role} | ${learner.team} | Personalized KPI readiness profile`}
      />

      <section className="profile-hero">
        <div className="profile-card-main">
          <div className="profile-avatar">{learner.name.split(" ").map((part) => part[0]).join("")}</div>
          <div>
            <p className="eyebrow">Learner Profile</p>
            <h1>{learner.name}</h1>
            <p>{learner.role} in {learner.team}. Last session: {learner.lastSession}.</p>
            <ReadinessBadge status={learner.status} />
          </div>
        </div>

        <div className="profile-score-card">
          <span>Readiness Score</span>
          <strong>{learner.readinessScore}/100</strong>
          <ScoreBar value={learner.readinessScore} />
        </div>
      </section>

      <section className="metrics-grid compact-metrics">
        <MetricCard icon={Award} label="Sessions Completed" value={learner.sessionsCompleted} note="Total training attempts" />
        <MetricCard icon={Target} label="Weakest Area" value={learner.weakestCategory} note="Coaching priority" />
        <MetricCard icon={TrendingUp} label="Status" value={learner.status} note="Current readiness state" />
        <MetricCard icon={ClipboardCheck} label="Recommended Tasks" value={recommendedScenarios.length} note="Next practice set" />
      </section>

      <section className="two-column">
        <div className="panel">
          <div className="section-toolbar">
            <div>
              <p className="eyebrow">Recommended Training</p>
              <h2>Next KPI simulations</h2>
            </div>
          </div>

          <div className="queue-grid slim">
            {recommendedScenarios.map((scenario) => (
              <article className="queue-card" key={scenario.id}>
                <span>{scenario.category}</span>
                <h3>{scenario.title}</h3>
                <p>{scenario.metric}</p>
                <strong>{scenario.difficulty}</strong>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-toolbar">
            <div>
              <p className="eyebrow">Recent Attempts</p>
              <h2>Training evidence</h2>
            </div>
          </div>

          {relatedSessions.length === 0 ? (
            <div className="empty-state">
              <p>No recorded sessions yet. Assign a simulation from the KPI Library.</p>
              <Link className="primary-link" to="/simulation-lab">Start Simulation</Link>
            </div>
          ) : (
            <div className="kanban-stack">
              {relatedSessions.map((session) => (
                <article className="kanban-card" key={session.id}>
                  <div>
                    <strong>{session.scenarioTitle}</strong>
                    <span>{session.category} | {session.readinessScore}/100</span>
                  </div>
                  <span>{session.date}</span>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Link className="ghost-button" to="/">
        <ArrowLeft size={16} />
        Back To Overview
      </Link>
    </>
  );
}