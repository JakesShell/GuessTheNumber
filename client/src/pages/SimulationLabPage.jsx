import { useState } from "react";
import { Topbar, ReadinessBadge } from "../components/Shared.jsx";

const API_BASE = "http://localhost:8080";

export default function SimulationLabPage({ dashboard, role }) {
  const [scenarioId, setScenarioId] = useState(dashboard.scenarios[0]?.id ?? "");
  const [learnerName, setLearnerName] = useState("Demo Learner");
  const [estimate, setEstimate] = useState("");
  const [selectedDecision, setSelectedDecision] = useState("");
  const [result, setResult] = useState(null);

  const scenario = dashboard.scenarios.find((item) => item.id === scenarioId);

  async function evaluateSimulation(event) {
    event.preventDefault();

    const response = await fetch(`${API_BASE}/api/simulations/evaluate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-demo-role": role
      },
      body: JSON.stringify({
        scenarioId,
        learnerName,
        estimate,
        selectedDecision
      })
    });

    const data = await response.json();
    setResult(data);
  }

  return (
    <>
      <Topbar
        title="KPI Simulation Lab"
        subtitle="Estimate the KPI, interpret business risk, and select the best operational action."
      />

      <section className="simulation-grid">
        <form className="panel simulation-form" onSubmit={evaluateSimulation}>
          <p className="eyebrow">Scenario</p>

          <label>
            Select Scenario
            <select value={scenarioId} onChange={(event) => {
              setScenarioId(event.target.value);
              setSelectedDecision("");
              setEstimate("");
              setResult(null);
            }}>
              {dashboard.scenarios.map((item) => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
          </label>

          {scenario && (
            <div className="scenario-brief">
              <h2>{scenario.title}</h2>
              <p>{scenario.brief}</p>

              <div className="detail-grid">
                <div><span>Category</span><strong>{scenario.category}</strong></div>
                <div><span>Difficulty</span><strong>{scenario.difficulty}</strong></div>
                <div><span>Metric</span><strong>{scenario.metric}</strong></div>
                <div><span>Unit</span><strong>{scenario.unit}</strong></div>
              </div>
            </div>
          )}

          <label>
            Learner Name
            <input value={learnerName} onChange={(event) => setLearnerName(event.target.value)} />
          </label>

          <label>
            KPI Estimate
            <input type="number" step="0.1" value={estimate} onChange={(event) => setEstimate(event.target.value)} placeholder="Enter your estimate" />
          </label>

          <label>
            Business Decision
            <select value={selectedDecision} onChange={(event) => setSelectedDecision(event.target.value)} required>
              <option value="">Choose the best action</option>
              {scenario?.decisionOptions.map((decision) => (
                <option key={decision} value={decision}>{decision}</option>
              ))}
            </select>
          </label>

          <button className="primary-link button-link" type="submit">Evaluate KPI Attempt</button>
        </form>

        <aside className="panel">
          <p className="eyebrow">Training Result</p>
          {!result ? (
            <p className="muted">Submit a KPI estimate and business decision to generate training feedback.</p>
          ) : (
            <div className="result-stack">
              <div className="result-header">
                <h2>{result.readinessLevel}</h2>
                <ReadinessBadge status={result.readinessLevel} />
              </div>

              <div className="score-strip">
                <div><span>Accuracy</span><strong>{result.scores.accuracyScore}/100</strong></div>
                <div><span>Threshold</span><strong>{result.scores.thresholdScore}/100</strong></div>
                <div><span>Decision</span><strong>{result.scores.decisionScore}/100</strong></div>
                <div><span>Readiness</span><strong>{result.scores.readinessScore}/100</strong></div>
              </div>

              <div className="feedback-card">
                <strong>Target: {result.target} {result.unit}</strong>
                <p>Your estimate: {result.estimate} {result.unit} | Threshold: {result.estimateClass}</p>
              </div>

              <ul className="check-list">
                {result.feedback.map((item) => <li key={item}>{item}</li>)}
              </ul>

              <div className="security-notice">
                <p><strong>Next:</strong> {result.nextRecommendation}</p>
              </div>
            </div>
          )}
        </aside>
      </section>
    </>
  );
}