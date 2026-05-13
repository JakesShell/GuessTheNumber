# AWS CDK Placeholder

This folder documents the planned AWS infrastructure path for MetricForge.

A production-ready CDK app would define:

- S3 bucket for React build artifacts
- CloudFront distribution
- ECR repository for the Node API image
- ECS Fargate cluster and service
- Application Load Balancer
- CloudWatch log groups
- IAM roles with least-privilege permissions
- Secrets Manager references for production configuration

The current repo includes deployment documentation and a Dockerfile as the first AWS-readiness layer.