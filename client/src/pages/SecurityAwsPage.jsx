import { Topbar } from "../components/Shared.jsx";

export default function SecurityAwsPage() {
  return (
    <>
      <Topbar
        title="Security & AWS Readiness"
        subtitle="Portfolio-grade controls showing how MetricForge is prepared for secure cloud deployment."
      />

      <section className="two-column">
        <div className="panel">
          <p className="eyebrow">Security Controls</p>
          <h2>Application safeguards</h2>
          <ul className="check-list">
            <li>Helmet security headers</li>
            <li>CORS restricted through CLIENT_ORIGIN</li>
            <li>Rate limiting on API requests</li>
            <li>Zod validation for simulation and coaching payloads</li>
            <li>Role-aware simulated access control</li>
            <li>Structured audit logging for training events</li>
            <li>Controlled error responses</li>
            <li>No real employee or production KPI data</li>
          </ul>
        </div>

        <div className="panel">
          <p className="eyebrow">AWS Ready</p>
          <h2>Cloud deployment path</h2>
          <ul className="check-list">
            <li>Dockerfile for backend containerization</li>
            <li>GET /health endpoint for load balancer checks</li>
            <li>.env.example for environment configuration</li>
            <li>CloudWatch-friendly JSON request logs</li>
            <li>GitHub Actions CI workflow</li>
            <li>S3 + CloudFront frontend path documented</li>
            <li>ECS Fargate backend path documented</li>
            <li>Secrets Manager and IAM hardening plan</li>
          </ul>
        </div>
      </section>
    </>
  );
}