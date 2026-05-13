# MetricForge Database Design

MetricForge currently uses simulated JSON data for a clean portfolio demo. A production version should use PostgreSQL, preferably Amazon RDS for PostgreSQL.

## Recommended Production Database

PostgreSQL is the best fit because MetricForge has relational business data:

- Organizations
- Users
- Roles
- Teams
- Learners
- KPI Scenarios
- Simulation Attempts
- Coaching Assignments
- Audit Events

## Suggested Tables

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE teams (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL
);

CREATE TABLE learners (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID NOT NULL REFERENCES users(id),
  team_id UUID REFERENCES teams(id),
  readiness_score INTEGER NOT NULL DEFAULT 0,
  weakest_category TEXT,
  status TEXT NOT NULL DEFAULT 'Developing'
);

CREATE TABLE kpi_scenarios (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  role_path TEXT NOT NULL,
  metric TEXT NOT NULL,
  unit TEXT NOT NULL,
  target NUMERIC NOT NULL,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE simulation_attempts (
  id UUID PRIMARY KEY,
  learner_id UUID NOT NULL REFERENCES learners(id),
  scenario_id UUID NOT NULL REFERENCES kpi_scenarios(id),
  estimate NUMERIC NOT NULL,
  selected_decision TEXT NOT NULL,
  accuracy_score INTEGER NOT NULL,
  threshold_score INTEGER NOT NULL,
  decision_score INTEGER NOT NULL,
  readiness_score INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE coaching_assignments (
  id UUID PRIMARY KEY,
  learner_id UUID NOT NULL REFERENCES learners(id),
  assigned_by UUID NOT NULL REFERENCES users(id),
  category TEXT NOT NULL,
  note TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_events (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  actor_user_id UUID REFERENCES users(id),
  event_type TEXT NOT NULL,
  action TEXT NOT NULL,
  outcome TEXT NOT NULL,
  metadata JSONB,
  request_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Production Recommendation

- Local development: SQLite or PostgreSQL Docker container
- Production: Amazon RDS PostgreSQL
- Secrets: AWS Secrets Manager
- Backups: RDS automated backups
- Audit retention: RDS table plus optional S3 export

## Future Improvement

A later version could add Prisma or Drizzle ORM for migrations, type-safe queries, and cleaner repository patterns.