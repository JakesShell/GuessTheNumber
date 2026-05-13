# Security Notes

MetricForge is a portfolio demonstration project using simulated training, learner, and KPI data only.

## Implemented Controls

- Helmet security headers
- CORS restricted by `CLIENT_ORIGIN`
- Express rate limiting
- Zod request validation
- Simulated role-based workflow controls
- Structured audit logging
- Controlled error responses
- `.env.example` for environment configuration
- No secrets committed to source control

## Simulated Roles

- Learner
- Manager
- Training Lead
- Executive
- Admin
- Viewer

Only Manager, Training Lead, and Admin roles can record simulated coaching assignments.

## Production Hardening Plan

- Add managed authentication with Amazon Cognito or an external identity provider
- Add tenant isolation for multi-company SaaS usage
- Store secrets in AWS Secrets Manager
- Add AWS WAF in front of public endpoints
- Store audit logs in an immutable log store
- Add centralized CloudWatch dashboards and alarms
- Add dependency scanning in CI/CD
- Add API Gateway or ALB authentication controls