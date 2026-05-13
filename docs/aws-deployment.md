# AWS Deployment Plan

MetricForge is structured to be deployed as a cloud-ready SaaS module.

## Suggested AWS Architecture

- Route 53 for domain management
- CloudFront for CDN and HTTPS
- S3 for static React frontend hosting
- Application Load Balancer for backend routing
- ECS Fargate for the Node.js API container
- AWS Secrets Manager for production secrets
- CloudWatch Logs for API and audit logs
- CloudWatch Alarms for health and error monitoring
- AWS WAF for web protection
- GitHub Actions for CI/CD

## Deployment Flow

1. Build React frontend with `npm run build`
2. Upload `client/dist` to S3
3. Invalidate CloudFront cache
4. Build backend Docker image
5. Push image to Amazon ECR
6. Deploy API service to ECS Fargate
7. Configure ALB health check against `/health`
8. Store production config in Secrets Manager or ECS task environment variables

## Well-Architected Alignment

- Operational Excellence: health endpoint, logs, CI workflow
- Security: headers, validation, rate limiting, role-aware API, secrets plan
- Reliability: container deployment path and load balancer health checks
- Performance Efficiency: CDN frontend and lightweight API
- Cost Optimization: S3 + CloudFront + Fargate scalable deployment
- Sustainability: lightweight training data model and scalable cloud path