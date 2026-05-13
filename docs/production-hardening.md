# MetricForge Production Hardening Plan

## Frontend Improvements

- Active navigation states
- API status indicator
- Search and filtering
- Stronger primary CTA styling
- Toast notifications
- Loading, empty, and error states
- Responsive enterprise table layouts
- Learner profile pages
- Readiness charts
- Completion funnel
- Dark analytics mode

## Backend Improvements

- Request ID tracking
- Readiness endpoint
- API status endpoint
- Admin-only audit endpoint
- Server-side permission matrix
- Structured JSON logs
- Database-backed simulation attempts
- Persistent audit storage

## Security Improvements

- Managed authentication with Amazon Cognito
- Server-side authorization for every protected route
- Tenant isolation by organization
- PostgreSQL row-level access strategy
- AWS Secrets Manager for secrets
- AWS WAF in front of public endpoints
- Dependency scanning in CI
- Immutable audit log export to S3

## AWS Architecture

- React frontend hosted on S3 and CloudFront
- Node API deployed to ECS Fargate
- RDS PostgreSQL for data
- CloudWatch Logs and Alarms
- Secrets Manager for DB credentials
- GitHub Actions for CI/CD
- ALB health checks against `/health`
- ALB readiness checks against `/ready`