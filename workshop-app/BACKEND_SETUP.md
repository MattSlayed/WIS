# Workshop Intelligence System - Backend Setup Guide

This guide covers setting up the Neon PostgreSQL database and connecting it to the Workshop Intelligence System.

## Prerequisites

- Node.js 18+ installed
- A [Neon](https://neon.tech) account (free tier available)
- The WIS workshop-app running locally

---

## 1. Create a Neon Database

1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Sign up or log in to your account
3. Click **"New Project"**
4. Configure your project:
   - **Name**: `workshop-intelligence-system` (or your preference)
   - **Region**: Choose the closest to your users (e.g., `eu-central-1` for South Africa)
   - **Postgres Version**: 16 (latest)
5. Click **"Create Project"**

## 2. Get Your Connection String

1. In your Neon dashboard, go to your project
2. Click on **"Connection Details"** in the sidebar
3. Select **"Connection string"** tab
4. Copy the connection string - it looks like:
   ```
   postgresql://username:password@ep-cool-name-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

## 3. Configure Environment Variables

1. In the `workshop-app` directory, copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your Neon connection string:
   ```env
   # DATABASE (Neon PostgreSQL - PRIMARY)
   DATABASE_URL=postgresql://username:password@ep-cool-name-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

3. (Optional) Configure other services:
   ```env
   # AI Services
   ANTHROPIC_API_KEY=your-anthropic-api-key

   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## 4. Push the Database Schema

Run the following command to create all tables in your Neon database:

```bash
npm run db:push
```

You should see output like:
```
[✓] Changes applied
```

## 5. Seed Development Data (Optional)

To populate the database with sample South African mining companies and jobs:

```bash
# First install tsx if not already installed
npm install -D tsx

# Run the seed script
npx tsx lib/db/seed.ts
```

This creates:
- 5 users (1 admin, 1 manager, 3 technicians)
- 4 clients (AngloGold Ashanti, Sasol Mining, Impala Platinum, Harmony Gold)
- 5 jobs at various workflow stages
- Sample parts and step completions

## 6. Verify the Connection

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000/technician](http://localhost:3000/technician)

3. You should see:
   - Real job data from your database (if seeded)
   - The "Using demo data" banner should disappear
   - Stats should reflect actual database counts

## 7. Database Management Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate SQL migrations from schema changes |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:push` | Push schema directly to database (dev mode) |
| `npm run db:studio` | Open Drizzle Studio GUI |
| `npm run db:seed` | Seed database with sample data |

---

## Database Schema Overview

### Core Tables

| Table | Description |
|-------|-------------|
| `users` | Workshop staff - technicians, managers, admins |
| `clients` | Companies sending equipment for repair |
| `jobs` | Main workflow entity with 11-step process tracking |
| `job_parts` | Parts and components associated with jobs |
| `job_photos` | Images captured during workflow steps |
| `step_completions` | Tracks progress through the Brimis process |

### Supporting Tables

| Table | Description |
|-------|-------------|
| `technical_reports` | AI-generated repair reports |
| `magic_links` | Secure client portal access tokens |
| `digital_signatures` | Client quote approvals |
| `qc_inspections` | Quality control inspection records |
| `notifications` | SMS, email, and in-app notifications |

---

## API Endpoints

### Jobs API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/jobs` | List jobs with filters |
| `POST` | `/api/jobs` | Create a new job |
| `GET` | `/api/jobs/[id]` | Get job details |
| `PATCH` | `/api/jobs/[id]` | Update a job |
| `DELETE` | `/api/jobs/[id]` | Delete a job |
| `GET` | `/api/jobs/[id]/steps` | Get workflow progress |
| `POST` | `/api/jobs/[id]/steps` | Complete a step |

### Query Parameters for `/api/jobs`

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by job status |
| `step` | string | Filter by current step |
| `technicianId` | uuid | Filter by assigned technician |
| `hasHazmat` | boolean | Filter hazmat jobs |
| `search` | string | Search job number, equipment, serial |
| `limit` | number | Results per page (default: 50) |
| `offset` | number | Pagination offset |

### Clients API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/clients` | List all clients |
| `POST` | `/api/clients` | Create a new client |

### Users API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | List all users |
| `POST` | `/api/users` | Create a new user |

---

## Server Actions

Server actions provide type-safe mutations that can be called directly from React components.

### Job Actions (`lib/actions/jobs.ts`)

```typescript
import { createJob, getJobs, updateJob, addJobPart } from '@/lib/actions/jobs';

// Create a job
const result = await createJob({
  clientId: 'uuid',
  equipmentType: 'Hydraulic Cylinder',
  serialNumber: 'HC-2024-001',
  hasHazmat: true,
  hazmatLevel: 'medium',
});

// Get jobs with filters
const { jobs } = await getJobs({
  status: 'in_repair',
  hasHazmat: true,
});

// Add a part
await addJobPart({
  jobId: 'uuid',
  partName: 'Seal Kit',
  condition: 'replace',
  cost: 4500,
});
```

### Workflow Actions (`lib/actions/workflow.ts`)

```typescript
import { completeStep, getWorkflowProgress, submitQcInspection } from '@/lib/actions/workflow';

// Complete a step
await completeStep({
  jobId: 'uuid',
  step: 'step_3_strip_assess',
  completedBy: 'user-uuid',
  notes: 'Disassembly complete',
});

// Get progress
const progress = await getWorkflowProgress('job-uuid');
// Returns: { currentStep, steps[], progress: 45, completedCount: 5 }

// Submit QC inspection
await submitQcInspection({
  jobId: 'uuid',
  inspectorId: 'user-uuid',
  measurements: { pressure: 150, temperature: 65 },
  visualInspectionPassed: true,
  functionTestPassed: true,
  leakTestPassed: true,
  documentationComplete: true,
  overallStatus: 'passed',
});
```

---

## React Hooks

Custom hooks for data fetching with automatic loading states.

```typescript
import { useJobs, useJob, useJobStats, useWorkflowProgress } from '@/lib/hooks/use-jobs';

// List jobs
const { jobs, isLoading, error, refetch } = useJobs({
  hasHazmat: true,
  search: 'BRIM-2025',
});

// Single job
const { job, isLoading } = useJob('job-uuid');

// Stats
const { stats } = useJobStats();
// Returns: { totalJobs, activeJobs, hazmatJobs, completedToday }

// Workflow progress
const { progress } = useWorkflowProgress('job-uuid');
```

---

## Troubleshooting

### "DATABASE_URL is not set"

Make sure you have created `.env.local` with your Neon connection string.

### Connection timeout

1. Check your Neon project is active (not suspended)
2. Verify the connection string is correct
3. Ensure your IP is not blocked (Neon allows all IPs by default)

### Schema push fails

```bash
# Try generating migrations instead
npm run db:generate
npm run db:migrate
```

### "Relation does not exist"

The tables haven't been created. Run:
```bash
npm run db:push
```

### Seed script fails

Make sure:
1. Tables exist (`npm run db:push` first)
2. You have `tsx` installed: `npm install -D tsx`

---

## Production Deployment

### Environment Variables

Set these in your deployment platform (Vercel, Railway, etc.):

```env
DATABASE_URL=your-neon-production-connection-string
ANTHROPIC_API_KEY=your-api-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Neon Branching (Recommended)

Neon supports database branching for staging/preview environments:

1. Create a branch for each PR/preview deployment
2. Use the branch connection string in preview environments
3. Merge schema changes like code

### Connection Pooling

For production, enable connection pooling in Neon:

1. Go to your Neon project settings
2. Enable "Connection pooling"
3. Use the pooled connection string for your app

---

## Support

- **Neon Documentation**: [https://neon.tech/docs](https://neon.tech/docs)
- **Drizzle ORM Docs**: [https://orm.drizzle.team](https://orm.drizzle.team)
- **Next.js App Router**: [https://nextjs.org/docs/app](https://nextjs.org/docs/app)

---

*Workshop Intelligence System - Built by NOVATEK LLC*
