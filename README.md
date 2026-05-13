# MetricForge Performance Training And KPI Simulation Lab

MetricForge is a full-stack KPI simulation and performance training platform for JSA Enterprise. It helps teams practice KPI estimation, threshold interpretation, and operational decision-making before working with real business dashboards.

## What This Project Solves

Companies often promote staff into dashboards and reporting workflows without training them to understand what the numbers actually mean. MetricForge provides a safe simulation environment where learners can estimate KPIs, classify risk thresholds, choose business actions, and receive coaching feedback.

## Core Features

- KPI simulation scenarios
- Role-based training paths
- Estimate scoring
- Threshold interpretation scoring
- Decision quality scoring
- Readiness score calculation
- Manager coaching review
- KPI library
- Training history
- Learner profile pages
- Coaching queue
- Readiness trend visualization
- Completion funnel visualization
- Skill pathway cards
- Light and dark analytics mode
- Role-aware simulated workflows
- Security controls
- AWS-readiness documentation
- Request IDs
- Health and readiness endpoints
- Admin-only audit endpoint
- PostgreSQL production database design

## Tech Stack

- React + Vite frontend
- Node.js + Express backend
- JSON demo data layer
- Helmet security headers
- CORS origin restriction
- API rate limiting
- Zod request validation
- Docker-ready backend
- GitHub Actions CI workflow

## Local Development

```powershell
npm run install:all
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8080
```

Health checks:

```text
http://localhost:8080/health
http://localhost:8080/ready
```

## Security Considerations

This project includes demo-focused security controls:

- Secure HTTP headers with Helmet
- CORS restricted through `CLIENT_ORIGIN`
- Rate limiting on API requests
- Input validation for simulation and coaching payloads
- Server-side permission matrix
- Role-aware simulated authorization
- Structured audit logs
- Controlled error handling
- No real employee or production KPI data

Production hardening would include managed authentication, tenant isolation, encrypted storage, AWS Secrets Manager, WAF protection, centralized logging, and cloud-native monitoring.

## AWS Readiness

MetricForge is structured for a future AWS deployment:

- React frontend can be built and hosted on S3 + CloudFront
- Node API can run on ECS Fargate
- `/health` endpoint supports health checks
- `/ready` endpoint supports readiness checks
- Environment variables are documented in `.env.example`
- JSON logs are CloudWatch-friendly
- Dockerfile is included for the backend service
- AWS deployment notes are included in `docs/aws-deployment.md`
- Database design is documented in `docs/database-design.md`

## Portfolio Value

MetricForge demonstrates product thinking, full-stack development, KPI logic, staff training workflows, secure API design, cloud deployment readiness, database planning, and manager-facing operational reporting.