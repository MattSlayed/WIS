# Workshop Intelligence System (WIS) Product Requirements Document (PRD)

**Version:** 1.0
**Date:** November 2025
**Product Manager:** John | BMad Method
**Status:** Draft for Review

---

## Goals and Background Context

### Goals

- **Digitize the 11-Step Brimis Workflow** with mandatory step-gating to ensure 100% QCP compliance
- **Eliminate Quote Lag Bottleneck** by automating technical report generation using AI, targeting 70% reduction in time-to-quote
- **Reduce Administrative Overhead by 60%** through Computer Vision defect tagging and GenAI report writing
- **Provide Real-Time Client Visibility** via secure magic link portal with digital PO approval
- **Deliver Production-Ready MVP within 5 weeks** with full deployment, training, and go-live
- **Achieve Positive ROI within 2.5 months** with R700K+ first-year value delivery
- **Enable Tablet-First Workshop Floor Experience** with offline PWA capability for technicians
- **Enforce Quality Gates** preventing equipment dispatch until all QC checks pass

### Background Context

Industrial workshops like Brimis face a critical "Efficiency Gap" where administrative work (reporting and quoting) creates bottlenecks in the physical repair process. Currently, technicians must manually transfer photos from phones to computers, spend 1.5 hours per job writing technical reports, and equipment sits idle on the floor waiting for Purchase Order approval. Physical job cards can be lost, critical safety steps (Hazmat checks, QC validations) can be accidentally skipped, and clients lack real-time transparency into repair status.

The Workshop Intelligence System (WIS) addresses these pain points with an AI-powered tablet-first Progressive Web App that enforces the proprietary "Brimis 11 Steps for Service Excellence" workflow. By leveraging Anthropic Claude 3.5 Sonnet for automated technical report generation and Google Cloud Vision API for defect detection, WIS is designed to reclaim 75 hours/month of administrative time, accelerate quote turnaround by 70%, and provide clients with live job tracking. The system targets an estimated R700K+ first-year value with a payback period under 2.5 months.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| November 2025 | 1.0 | Initial PRD draft from project brief | John (PM) |

---

## Requirements

### Functional

- **FR1:** System shall enforce sequential 11-step workflow progression with mandatory validation gates preventing users from skipping steps
- **FR2:** System shall generate unique Job IDs (format: BRIM-YYYY-###) upon equipment check-in
- **FR3:** System shall support QR code scanning and manual serial number entry for equipment intake
- **FR4:** System shall enforce mandatory Hazardous Chemical declaration toggle in Step 2
- **FR5:** System shall block Step 3 progression if Hazmat toggle is active until "Chemical Cleaning Procedure" checklist is completed
- **FR6:** System shall generate and print physical QR tags for equipment tracking
- **FR7:** System shall provide in-app camera functionality for direct photo capture with automatic job linkage
- **FR8:** System shall integrate Google Cloud Vision API to analyze damage photos and auto-suggest defect labels (corrosion, cracks, wear, pitting)
- **FR9:** System shall support voice-to-text input for technician damage notes
- **FR10:** System shall integrate Anthropic Claude 3.5 Sonnet to generate branded PDF technical reports from technician photos and notes
- **FR11:** AI-generated technical reports shall include: equipment details, damage photos, fault descriptions, recommended repairs, and Brimis branding
- **FR12:** System shall generate secure magic link URLs for client quote review (no login required)
- **FR13:** Client portal shall display quote with photos, damage descriptions, and pricing breakdown
- **FR14:** System shall capture digital signatures on client devices for PO approval
- **FR15:** System shall lock Step 6 "Repair" button (greyed out) until client digitally approves quote
- **FR16:** System shall use Supabase Realtime to instantly notify technician tablets when client signs PO
- **FR17:** System shall require mandatory micrometer measurement entry for Steps 7 and 10 (QC validation)
- **FR18:** System shall display Step 3 damage photos during Step 8 reassembly as visual guidance
- **FR19:** System shall block Step 11 delivery note printing until all QC checks are marked complete
- **FR20:** Manager dashboard shall provide Kanban board view of all active jobs organized by current step
- **FR21:** System shall support offline mode for technician tablet functions with automatic sync when online
- **FR22:** System shall send email notifications to clients when quote is ready
- **FR23:** System shall send email notifications to managers when jobs reach Step 5 (ready for quoting)
- **FR24:** System shall support concurrent multi-job workflows for multiple technicians
- **FR25:** System shall maintain audit trail of all step completions with timestamp and user
- **FR26:** System shall support photo uploads up to 12MP (4K camera resolution)
- **FR27:** System shall generate PDF reports with consistent Brimis branding (logo, colors, formatting)
- **FR28:** System shall provide search/filter capability for jobs by status, client, equipment type, date range
- **FR29:** System shall support role-based access control (Technician, Manager, Client)
- **FR30:** System shall prevent data loss during offline mode with conflict resolution on sync

### Non-Functional

- **NFR1:** System shall load pages in <2 seconds on 4G mobile connection
- **NFR2:** AI report generation shall complete in <60 seconds for typical job (10 photos, 500 words notes)
- **NFR3:** System shall function 100% offline for all technician core workflows (Steps 1-11)
- **NFR4:** Real-time PO approval notifications shall have <1 second latency
- **NFR5:** System shall achieve 99.9% uptime on managed hosting (Vercel SLA)
- **NFR6:** System shall support WCAG 2.1 Level AA accessibility compliance
- **NFR7:** Touch targets shall be minimum 44×44 pixels for glove-friendly operation
- **NFR8:** System shall support high contrast mode for bright workshop lighting conditions
- **NFR9:** Photo uploads shall be optimized for bandwidth (compression without quality loss)
- **NFR10:** Database queries shall return results in <200ms for dashboard views
- **NFR11:** System shall encrypt data in transit (TLS 1.3) and at rest (AES-256)
- **NFR12:** System shall implement rate limiting on API endpoints (100 requests/minute per user)
- **NFR13:** System shall perform daily automated backups with 7-day retention
- **NFR14:** System shall support concurrent usage by 10+ technicians without performance degradation
- **NFR15:** AI API costs shall stay within 5,000 queries/month budget for managed service tier
- **NFR16:** System shall be responsive across tablet (10-12"), desktop (1920×1080+), and mobile (375px+)
- **NFR17:** System shall support modern browsers (Chrome 90+, Safari 14+, Edge 90+)
- **NFR18:** PWA shall be installable on iOS 14+ and Android 10+ devices
- **NFR19:** System shall implement comprehensive error logging with Sentry integration
- **NFR20:** System shall maintain data integrity during network interruptions with optimistic UI updates

---

## User Interface Design Goals

### Overall UX Vision

The Workshop Intelligence System prioritizes **"Gloves-On" Accessibility** - every interaction must be operable by technicians wearing work gloves in a noisy, industrial environment. The tablet-first interface uses large touch targets, high contrast visuals, clear step indicators, and voice input options to minimize cognitive load during physical repair work.

For managers, the desktop dashboard emphasizes **Operational Visibility** with at-a-glance Kanban views showing job progress, bottlenecks, and pending actions. The design philosophy is "Progressive Disclosure" - show only what's needed for the current step, with drill-down for details.

For clients, the magic link portal prioritizes **Trust Through Transparency** - high-quality damage photos, clear explanations, and friction-free approval workflow create confidence in repair recommendations.

### Key Interaction Paradigms

**Wizard-Style Step Progression:**
Technicians navigate a linear wizard interface where each step is clearly numbered (Step 1/11, Step 2/11, etc.) with progress visualization. Primary action buttons are large (full-width on mobile) and use action-oriented language ("Complete Step & Continue" vs. generic "Next").

**Contextual Input Methods:**
Voice-to-text is presented as the primary input for damage notes (large microphone button), with keyboard fallback. Camera access is one-tap from any step requiring photo evidence. Dropdowns are avoided in favor of large button grids for selections (e.g., defect types).

**Real-Time Status Synchronization:**
Manager dashboard auto-updates when technicians complete steps (no manual refresh). Technician tablets show live "PO Approved - Proceed" notification when client signs quote. Toast notifications confirm successful actions without blocking workflow.

**Offline-First Optimism:**
All technician actions save immediately with visual confirmation (checkmark animation). Network status indicator shows sync state ("Synced", "Pending Upload", "Offline Mode"). Conflicts are resolved server-side with timestamps.

### Core Screens and Views

**Technician Interface (Tablet):**
1. **Job List Screen** - Active jobs assigned to technician with current step indicator
2. **Step Detail View** - Current step instructions, input fields, photo capture, voice notes
3. **QR Scanner Screen** - Full-screen camera for QR code scanning
4. **Photo Review Gallery** - Captured photos for current job with AI-suggested tags
5. **Hazmat Checklist Modal** - Mandatory checklist overlay for Step 2 Hazmat workflow
6. **Assembly Guide View** - Side-by-side comparison of Step 3 photos during Step 8 reassembly

**Manager Interface (Desktop):**
1. **Dashboard Kanban Board** - Columns for each of the 11 steps with draggable job cards
2. **Quote Builder Screen** - AI-generated report preview with pricing form and send button
3. **Job Detail Modal** - Full job history, photo gallery, notes, timeline
4. **Reports & Analytics Screen** (Phase 2) - Job cycle time, technician productivity charts
5. **Settings Screen** - User management, system configuration, branding upload

**Client Interface (Mobile/Desktop):**
1. **Magic Link Landing Page** - Quote summary with equipment details
2. **Photo Evidence Gallery** - Damage photos with technician annotations
3. **Digital Signature Screen** - Canvas-based signature capture with PO approval button
4. **Quote Sent Confirmation** - Thank you page with estimated repair timeline

### Accessibility: WCAG 2.1 Level AA

**Compliance Requirements:**
- Minimum 4.5:1 color contrast ratio for all text
- Keyboard navigation support for all interactive elements (desktop manager interface)
- ARIA labels for screen reader compatibility
- Focus indicators on all focusable elements (3px solid outline)
- Error messages announced to screen readers
- Form inputs with clear labels and validation feedback
- Skip navigation links for keyboard users
- Resizable text without loss of functionality

**Workshop-Specific Accessibility:**
- High contrast mode toggle for bright workshop lighting (15:1 ratio)
- Large touch targets (minimum 60×60px for primary actions, 44×44px minimum for secondary)
- Voice input alternative for all text fields
- Visual feedback for all touch interactions (button press states)
- Offline mode indicator for network-dependent features
- Battery level warning for tablet users

### Branding

**Brimis Brand Identity:**
- Primary Color: Industrial Blue (#1E3A8A)
- Secondary Color: Warning Orange (#F97316) for hazmat/alerts
- Neutral Gray: (#6B7280) for supporting text
- Success Green: (#10B981) for completed steps
- Logo: Brimis company logo (top-left header, PDF report header)
- Typography: Inter (sans-serif) for UI, system fonts for performance
- Iconography: Heroicons outline style for consistency

**PDF Report Branding:**
- Brimis letterhead with company address and contact details
- Professional layout with section headings and dividers
- Equipment photo gallery with 2-column grid
- Footer with job ID, technician name, date
- Digital signature placeholder for client approval record

### Target Device and Platforms: Web Responsive (Tablet-First PWA)

**Primary Devices:**
- Tablets (10-12"): iPad 10.2" (2160×1620), Samsung Galaxy Tab A (1920×1200)
- Optimized breakpoint: 768px-1024px (tablet portrait/landscape)

**Secondary Devices:**
- Desktop (1920×1080+): Manager dashboard and quote builder
- Mobile phones (375px+): Client magic link portal (responsive fallback)

**Progressive Web App Requirements:**
- Installable on home screen (iOS/Android)
- Offline-capable with service worker caching
- App shell architecture for instant loading
- Add to Home Screen prompt for first-time users
- Splash screen with Brimis branding

---

## Technical Assumptions

### Repository Structure: Monorepo

**Rationale:** A monorepo provides the best developer experience for a full-stack Next.js application with shared types, utilities, and configuration. Since we're building a cohesive single application (not microservices), a monorepo avoids the complexity of managing multiple repositories while enabling code sharing between frontend and API routes.

**Structure:**
```
/workshop-app
├── /app                 # Next.js 14 App Router pages
├── /components          # React components
├── /lib                 # Utilities, API clients, workflow engine
│   ├── /ai              # Claude & Vision API integrations
│   ├── /db              # Supabase client and queries
│   ├── /workflow        # 11-step state machine logic
│   └── /utils           # Shared utilities
├── /public              # Static assets (images, fonts)
├── /docs                # Project documentation (PRD, architecture)
├── /tests               # Test files
└── package.json
```

### Service Architecture

**Monolith (Next.js Full-Stack Application):**

The WIS MVP will be built as a monolithic Next.js 14 application with the following architecture:

- **Frontend:** React Server Components + Client Components (App Router)
- **API Layer:** Next.js API Routes (serverless functions on Vercel)
- **Database:** Supabase PostgreSQL with Row Level Security (RLS)
- **Real-Time:** Supabase Realtime subscriptions for live updates
- **AI Services:** External API calls to Claude (Anthropic) and Vision (Google Cloud)
- **Storage:** Supabase Storage for photos, Google Cloud Storage for PDFs
- **Authentication:** Supabase Auth with JWT tokens and magic links

**Rationale:** A monolithic architecture is appropriate for the MVP scope (3 user types, single workshop location, <1000 concurrent jobs). This simplifies deployment, reduces operational overhead, and accelerates development within the 5-week timeline. Future scaling to microservices can be considered post-MVP if multi-workshop deployment creates performance bottlenecks.

**Key Architectural Patterns:**
- **11-Step State Machine:** Core business logic module managing workflow transitions and validation gates
- **Service Layer Pattern:** Separate modules for AI, database, and external API interactions
- **Repository Pattern:** Database query abstraction for testability
- **API Route Controllers:** Thin controllers delegating to service layer

### Testing Requirements

**Unit + Integration Testing (Moderate Coverage):**

Given the 5-week timeline and AI-heavy nature of the project, we prioritize:

**Unit Testing (Target: 60% coverage):**
- Workflow state machine logic (11-step transitions, validation gates)
- Utility functions (QR generation, date formatting, data validation)
- API route handlers (input validation, error handling)
- Database query functions (data transformation logic)

**Integration Testing (Target: 40% coverage):**
- API route end-to-end tests (request → database → response)
- Supabase real-time subscription flows
- AI service integration (mock Claude/Vision API responses)
- Authentication flows (magic link generation, JWT validation)

**Manual Testing:**
- Offline PWA functionality (network disconnect scenarios)
- Cross-browser compatibility (Chrome, Safari, Edge on tablet/desktop)
- AI report quality validation (human review of Claude outputs)
- End-to-end user workflows (technician job completion, client PO approval)

**Testing Tools:**
- **Framework:** Vitest (fast unit testing for Next.js)
- **Integration:** Supertest for API route testing
- **Mocking:** MSW (Mock Service Worker) for AI API mocks
- **E2E:** Playwright (Phase 2 - not required for MVP go-live)

**Rationale:** Full E2E test automation is deferred to Phase 2 to meet the aggressive 5-week timeline. The 11-step workflow state machine and API routes are the highest-risk areas requiring automated test coverage. AI service integrations will be manually validated during Week 4 pilot testing.

### Additional Technical Assumptions and Requests

**Frontend Framework & Tooling:**
- **Framework:** Next.js 14.0+ with App Router (React Server Components)
- **Styling:** Tailwind CSS 3.3+ with custom design system configuration
- **Component Library:** Headless UI (unstyled accessible components) + Heroicons
- **Forms:** React Hook Form with Zod validation schemas
- **State Management:** React Context for global state (user session, job context), Zustand for complex client state (offline queue)

**Backend & Database:**
- **Database:** Supabase (managed PostgreSQL 15+)
- **ORM:** Supabase JavaScript client (no heavy ORM to reduce complexity)
- **Real-Time:** Supabase Realtime with PostgreSQL Change Data Capture (CDC)
- **Row Level Security:** Enabled on all tables (technician can only see assigned jobs, clients can only see their quotes)
- **Migrations:** Supabase CLI for version-controlled schema changes

**AI & External Services:**
- **GenAI:** Anthropic Claude 3.5 Sonnet via REST API (report generation)
- **Computer Vision:** Google Cloud Vision API (image annotation, label detection, OCR)
- **Prompt Management:** LangChain.js for prompt templates and versioning
- **PDF Generation:** Puppeteer (headless Chrome) for branded report export
- **Email:** Resend (modern email API) for quote notifications
- **QR Codes:** `qrcode` npm package for generation, `html5-qrcode` for scanning

**Storage & Media:**
- **Primary Storage:** Supabase Storage (S3-compatible) for repair photos
- **PDF Storage:** Google Cloud Storage with signed URLs for secure client access
- **CDN:** Vercel Edge Network for static asset delivery
- **Image Optimization:** Next.js Image component with automatic WebP conversion

**Authentication & Security:**
- **Auth Provider:** Supabase Auth with email magic links (passwordless)
- **Session Management:** JWT tokens with 7-day expiration, refresh token rotation
- **Client Access:** Time-limited magic links (72-hour expiry) with cryptographic tokens
- **API Security:** Rate limiting (Upstash Redis), CORS configuration, input sanitization
- **Secrets Management:** Vercel environment variables with encrypted storage

**Deployment & Infrastructure:**
- **Hosting:** Vercel (managed Next.js platform with automatic scaling)
- **Database:** Supabase Cloud (managed PostgreSQL with daily backups)
- **CI/CD:** Vercel Git integration (auto-deploy on git push to main)
- **Monitoring:** Vercel Analytics + Sentry error tracking
- **Logging:** Axiom for structured log aggregation (production only)

**PWA & Offline Support:**
- **Service Worker:** Workbox 7.0+ for offline caching and sync
- **Caching Strategy:** Network-first for API calls, cache-first for static assets
- **Background Sync:** Queue failed API requests for retry when online
- **Install Prompt:** Custom "Add to Home Screen" banner for iOS/Android

**Development Environment:**
- **Runtime:** Node.js 18+ LTS
- **Package Manager:** pnpm (faster than npm, stricter than yarn)
- **TypeScript:** 5.0+ with strict mode enabled
- **Linting:** ESLint with Next.js recommended config
- **Formatting:** Prettier with Tailwind plugin
- **Git Hooks:** Husky for pre-commit linting and type checking

**Browser & Device Support:**
- **Desktop Browsers:** Chrome 90+, Safari 14+, Edge 90+, Firefox 88+
- **Mobile Browsers:** iOS Safari 14+, Chrome Android 90+
- **Tablet OS:** iPad OS 14+, Android 10+
- **Screen Sizes:** 375px (mobile) to 2560px (4K desktop)
- **No IE11 Support:** Modern browsers only (reduces polyfill complexity)

**Performance Budgets:**
- **First Contentful Paint:** <1.5s
- **Largest Contentful Paint:** <2.5s
- **Time to Interactive:** <3.5s
- **Cumulative Layout Shift:** <0.1
- **Bundle Size:** <500KB initial JavaScript (before code splitting)

**Data Model Assumptions:**
- Jobs are assigned to one primary technician (no multi-technician collaboration on single job for MVP)
- One client per job (no multi-party approvals)
- Linear 11-step progression (no parallel step execution)
- QC measurements stored as structured JSON (flexible schema for different equipment types)
- Audit trail stored as append-only log (no deletion of historical records)

**Third-Party API Assumptions:**
- Claude API has 95%+ uptime (fallback: queue report generation and retry)
- Google Vision API processes images in <5 seconds (timeout: 30 seconds)
- Resend email delivery SLA: 99% within 5 minutes
- Supabase Realtime latency: <500ms for database change propagation

**Compliance & Legal:**
- Digital signatures are legally binding under South African Electronic Communications and Transactions Act (ECTA)
- Client data retention: 7 years (industry standard for equipment service records)
- GDPR/POPIA compliance: User data deletion request workflow (Phase 2)
- No PCI compliance required (no credit card processing in MVP)

---

## Epic List

**Epic 1: Foundation & Digital Intake (Steps 1-2)**
Establish Next.js project infrastructure with CI/CD, authentication, database schema, and implement the first two steps of the Brimis workflow: digital equipment receiving and hazmat triage with QR tag generation.

**Epic 2: AI Inspector & Report Writer (Steps 3-5)**
Build the AI-powered inspection workflow enabling technicians to capture damage photos, leverage Computer Vision for defect tagging, input voice notes, and generate branded technical reports using GenAI - culminating in automated quote preparation.

**Epic 3: Client Portal & PO Approval Workflow (Step 6 Gate)**
Create the secure client-facing portal with magic link authentication, interactive quote presentation, digital signature capture, and real-time synchronization to unlock technician workflow progression upon PO approval.

**Epic 4: Execution, QC & Dispatch (Steps 6-11)**
Implement the final repair execution stages with digital QC forms, assembly photo guidance, dispatch validation gates, and manager dashboard for operational visibility across all active jobs.

---

## Epic 1: Foundation & Digital Intake (Steps 1-2)

**Epic Goal:**
Establish a production-ready Next.js application with complete development infrastructure (Git, CI/CD, testing, linting), user authentication system (technician/manager roles), and core database schema. Deliver the first two steps of the Brimis workflow—digital equipment check-in with QR tagging and mandatory hazmat triage—as a fully functional vertical slice that technicians can use to replace paper job cards for intake processing.

### Story 1.1: Project Setup & Development Infrastructure

As a **developer**,
I want a fully configured Next.js 14 project with Tailwind CSS, TypeScript, ESLint, Prettier, and Git repository,
so that I have a consistent, production-ready development environment with quality controls from day one.

**Acceptance Criteria:**

1. Next.js 14.0+ project initialized with App Router configuration and TypeScript strict mode enabled
2. Tailwind CSS 3.3+ configured with custom design system tokens (Brimis colors, spacing, typography)
3. ESLint configured with Next.js recommended rules and Prettier integration for automated formatting
4. Husky Git hooks installed for pre-commit linting and type checking (prevents broken code commits)
5. `package.json` includes all required dependencies: React 18+, Tailwind, TypeScript, Supabase client, Zod
6. Project directory structure created per Technical Assumptions (`/app`, `/components`, `/lib`, `/public`, `/docs`)
7. `.gitignore` configured to exclude `node_modules`, `.env.local`, `.next`, and other build artifacts
8. README.md created with project overview, setup instructions, and architecture links
9. Development server runs successfully on `localhost:3000` with hot reload working
10. Successfully deploy to Vercel with automatic deployment pipeline (git push → build → deploy)

### Story 1.2: Supabase Database Setup & Core Schema

As a **developer**,
I want a Supabase project configured with initial database schema for Jobs, Users, and Steps,
so that I have a persistent data layer with Row Level Security enforcing access controls.

**Acceptance Criteria:**

1. Supabase project created in cloud with PostgreSQL database provisioned
2. Database schema includes `jobs` table with columns: `id` (UUID, PK), `job_number` (text, unique, format BRIM-YYYY-###), `client_name`, `equipment_type`, `serial_number`, `current_step` (int 1-11), `status` (enum: active/completed/cancelled), `created_at`, `updated_at`, `assigned_technician_id` (FK to users)
3. Database schema includes `users` table with columns: `id` (UUID, PK), `email`, `full_name`, `role` (enum: technician/manager), `created_at`
4. Database schema includes `job_steps` table (audit trail) with columns: `id`, `job_id` (FK), `step_number` (1-11), `completed_at`, `completed_by_user_id` (FK), `data` (JSONB for step-specific fields)
5. Row Level Security (RLS) policies created: Technicians can only read/update jobs assigned to them; Managers can read/update all jobs
6. Database migration files created in `/supabase/migrations` for version control
7. Supabase connection string added to `.env.local` with environment variables for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
8. Supabase JavaScript client configured in `/lib/db/supabase.ts` with singleton pattern
9. Successfully query database from Next.js API route (test route returning job count)
10. Database seeds script created for development data (3 sample jobs, 5 sample users)

### Story 1.3: Authentication System (Technician & Manager Roles)

As a **technician or manager**,
I want to securely log in to the Workshop Intelligence System using my email,
so that I can access job workflows appropriate to my role without sharing credentials.

**Acceptance Criteria:**

1. Supabase Auth configured with email/password authentication enabled
2. Login page created at `/login` with email and password input fields, submit button, and error messaging
3. Authentication middleware created in `/lib/auth/middleware.ts` to protect routes requiring authentication
4. Session management implemented using Supabase JWT tokens with 7-day expiration and automatic refresh
5. User role stored in `users` table and synced to Supabase auth metadata on registration
6. Role-based redirect after login: Technicians → `/technician/jobs`, Managers → `/manager/dashboard`
7. Logout functionality implemented with session cleanup and redirect to login page
8. Protected routes return 401 Unauthorized for unauthenticated requests
9. API routes check authentication using `getUser()` helper function from Supabase client
10. Successfully login as technician, verify access to technician routes, verify no access to manager routes

### Story 1.4: Step 1 - Digital Equipment Receiving Log

As a **technician**,
I want to digitally check in equipment by scanning a QR code or entering a serial number,
so that a new job is created in the system without using paper job cards.

**Acceptance Criteria:**

1. Technician job list page created at `/technician/jobs` showing all active jobs assigned to the logged-in technician
2. "New Job" button prominent at top of job list (large, full-width on mobile, action-oriented label)
3. Equipment intake form includes fields: Client Name (text), Equipment Type (dropdown: Pump/Motor/Gearbox/Other), Serial Number (text), Notes (textarea)
4. Form validation using React Hook Form + Zod schema: Client Name required (min 2 chars), Equipment Type required, Serial Number required (alphanumeric, min 3 chars)
5. On form submit, create new record in `jobs` table with auto-generated `job_number` using format BRIM-YYYY-### (year + sequential 3-digit number)
6. New job defaults to `current_step: 1`, `status: active`, `assigned_technician_id: current_user.id`
7. On successful job creation, redirect to `/technician/step/[jobId]?step=1` (Step 1 detail view)
8. Job list displays jobs sorted by most recently created first, showing job number, equipment type, client name, current step
9. Empty state message displayed when technician has no active jobs ("No active jobs. Tap 'New Job' to get started")
10. Successfully create job, verify job appears in list, verify job_number follows BRIM-2025-001 format, verify record in database

### Story 1.5: QR Code Generation & Printing

As a **technician**,
I want the system to generate a printable QR code tag for each new job,
so that I can attach it to the equipment and quickly access the digital job card by scanning.

**Acceptance Criteria:**

1. Install `qrcode` npm package for QR code generation (MIT license, lightweight)
2. QR code generation utility function created in `/lib/utils/qr.ts` that encodes job ID as URL: `https://wis.app/job/[jobId]`
3. QR code API route created at `/api/qr/[jobId]` that returns PNG image (200×200px) of QR code
4. After job creation (Story 1.4), "Print QR Tag" button displayed on Step 1 detail view
5. Clicking "Print QR Tag" opens print dialog with formatted tag layout: Job Number (large text), QR code (centered), Equipment Type, Client Name, Date Created
6. Print layout uses `@media print` CSS to hide navigation and show only tag content
7. QR code scans successfully with smartphone camera app, redirecting to `https://wis.app/job/[jobId]` URL
8. Job detail page at `/job/[jobId]` renders for scanned QR codes, redirecting to current step view for technicians
9. Successfully generate QR code, print tag, scan with phone camera, verify redirects to correct job
10. QR code stored as SVG data URL in `jobs` table `qr_code` column for future reprinting

### Story 1.6: Step 2 - Hazmat Declaration & Checklist Enforcement

As a **technician**,
I want to declare if equipment has hazardous chemical contamination in Step 2,
so that the system enforces the mandatory Chemical Cleaning Procedure before allowing me to proceed to disassembly.

**Acceptance Criteria:**

1. Step 2 detail view created at `/technician/step/[jobId]?step=2` with clear heading "Step 2: Hazmat Assessment"
2. Large toggle switch/checkbox for "Hazardous Chemical Contamination Present?" (default: unchecked/No)
3. If Hazmat toggle is OFF, "Complete Step 2" button is enabled (green, full-width)
4. If Hazmat toggle is ON, "Complete Step 2" button is disabled (greyed out) with helper text "Complete Chemical Cleaning Checklist to proceed"
5. When Hazmat toggle is ON, "Chemical Cleaning Checklist" modal/overlay automatically opens with 5 mandatory checklist items:
   - Item 1: "Identify chemical type and confirm MSDS availability"
   - Item 2: "Don appropriate PPE (gloves, goggles, respirator)"
   - Item 3: "Perform initial rinse with approved solvent in ventilated area"
   - Item 4: "Inspect for residual contamination (visual and odor check)"
   - Item 5: "Obtain supervisor sign-off for Hazmat cleaning completion"
6. Checklist items are checkboxes; all 5 must be checked before "Confirm Cleaning Complete" button is enabled
7. Checklist state stored in `job_steps` table `data` JSONB column: `{hazmat: true, checklist: [true, true, true, true, true]}`
8. On "Confirm Cleaning Complete", close modal and enable "Complete Step 2" button
9. On "Complete Step 2", update `jobs.current_step` to 3, insert record in `job_steps` audit trail with `step_number: 2`, redirect to Step 3
10. Successfully complete Step 2 with Hazmat ON, verify checklist enforced, verify Step 2 cannot be skipped, verify database audit trail record created

---

## Epic 2: AI Inspector & Report Writer (Steps 3-5)

**Epic Goal:**
Build the AI-powered core of the Workshop Intelligence System, enabling technicians to capture damage photos directly in the app, leverage Google Cloud Vision API for automated defect tagging, input voice-to-text damage notes, and generate professional branded technical reports using Anthropic Claude 3.5 Sonnet. Deliver an end-to-end workflow from equipment stripping (Step 3) through fault assessment (Step 4) to automated quote preparation (Step 5), eliminating the 1.5-hour manual report writing bottleneck.

### Story 2.1: Step 3 - In-App Photo Capture & Gallery

As a **technician**,
I want to capture damage photos directly in the Workshop Intelligence app using my tablet camera,
so that photos are automatically linked to the correct job without manual transfer from my phone.

**Acceptance Criteria:**

1. Step 3 detail view created at `/technician/step/[jobId]?step=3` with heading "Step 3: Strip & Assess"
2. Large "Capture Photo" button (camera icon, full-width on mobile) triggers native camera app via WebRTC Media Capture API (`navigator.mediaDevices.getUserMedia`)
3. Camera permission requested on first use with clear explanation ("WIS needs camera access to document equipment damage")
4. Photo captured at maximum tablet camera resolution (up to 12MP), compressed to 2MB max file size without visible quality loss (JPEG quality 85%)
5. After photo capture, preview screen shows captured image with "Retake" and "Save Photo" buttons
6. On "Save Photo", upload image to Supabase Storage in bucket `job-photos` with path: `/jobs/[jobId]/step3/[timestamp].jpg`
7. Photo metadata stored in `job_photos` database table with columns: `id`, `job_id` (FK), `step_number` (3), `photo_url` (Supabase Storage URL), `uploaded_at`, `ai_tags` (JSONB, null initially)
8. Photo gallery component displays all photos captured for current job in Step 3, showing thumbnails (150×150px) in grid layout
9. Tapping photo thumbnail opens full-size view in modal with "Delete" button (soft delete: mark `deleted: true` in metadata)
10. Successfully capture 3 photos, verify uploaded to Supabase Storage, verify photo URLs stored in database, verify gallery displays all photos

### Story 2.2: Google Cloud Vision Integration for Defect Tagging

As a **technician**,
I want the system to analyze my damage photos and suggest defect labels automatically,
so that I don't have to manually tag every photo with defect types.

**Acceptance Criteria:**

1. Google Cloud Vision API project created with Vision API enabled and API key generated
2. Google Vision API client configured in `/lib/ai/vision.ts` using REST API (no heavy SDK to reduce bundle size)
3. After photo upload (Story 2.1), trigger background API call to `/api/ai/analyze-photo` with photo URL
4. Vision API route calls Google Cloud Vision `labelDetection` and `textDetection` features on uploaded photo
5. Vision API response parsed to extract relevant labels: "Corrosion", "Crack", "Wear", "Pitting", "Rust", "Damage", "Broken"
6. Extracted labels filtered to top 5 by confidence score (>70% threshold), stored in `job_photos.ai_tags` JSONB column
7. Photo gallery UI updated to display AI-suggested tags as small chips/badges below each thumbnail (e.g., "Corrosion • Rust • Wear")
8. Technician can tap "Edit Tags" to manually add, remove, or modify AI-suggested tags (custom tags stored alongside AI tags)
9. If Vision API call fails (network error, timeout >30s), log error to Sentry and display fallback message "Auto-tagging unavailable - add tags manually"
10. Successfully upload photo with visible corrosion, verify Vision API detects "Corrosion" tag, verify tag displayed in gallery, verify can manually override tag

### Story 2.3: Voice-to-Text Damage Notes Input

As a **technician**,
I want to dictate damage observations using voice input,
so that I can capture detailed notes hands-free while wearing gloves.

**Acceptance Criteria:**

1. Step 3 detail view includes "Damage Notes" section with large microphone button (red when not recording, animated pulse when recording)
2. Clicking microphone button triggers browser Web Speech API (`SpeechRecognition` or `webkitSpeechRecognition`) with continuous mode enabled
3. Voice input permission requested on first use with explanation ("WIS needs microphone access for voice notes")
4. As technician speaks, live transcription displays in real-time in textarea field below microphone button
5. Technician can pause recording (tap microphone to stop), edit transcribed text with keyboard, then resume voice input (appends to existing text)
6. Voice input supports common industrial terms ("micrometer", "corrosion", "gearbox", "bearing") with reasonable accuracy (90%+ for standard English)
7. Fallback manual keyboard input available if voice input fails or browser doesn't support Web Speech API (show keyboard icon toggle)
8. Damage notes autosaved to `job_steps.data.notes` JSONB field every 10 seconds during voice input (prevent data loss)
9. Voice input stops automatically after 60 seconds of silence, with notification "Voice input paused - tap microphone to resume"
10. Successfully dictate 100-word damage description, verify text appears in textarea, verify autosave works, verify can edit text manually after dictation

### Story 2.4: Step 4 - Fault List & Recommendations

As a **technician**,
I want to document identified faults and recommended repairs in Step 4,
so that this information feeds into the AI-generated technical report.

**Acceptance Criteria:**

1. Step 4 detail view created at `/technician/step/[jobId]?step=4` with heading "Step 4: Identify Faults"
2. Fault list builder UI allows technician to add multiple faults with "Add Fault" button (creates new fault row)
3. Each fault row includes: Fault Description (textarea, required), Severity (dropdown: Low/Medium/High/Critical), Recommended Action (textarea, required)
4. Fault rows can be reordered by drag-and-drop (priority order for report)
5. "Delete Fault" button (trash icon) removes fault row with confirmation dialog ("Delete this fault?")
6. Faults stored in `job_steps.data.faults` JSONB array: `[{description, severity, recommendation, order}]`
7. Form validation requires at least 1 fault before "Complete Step 4" button is enabled
8. Autosave to database every 10 seconds while technician edits fault list (prevent data loss)
9. On "Complete Step 4", update `jobs.current_step` to 5, insert `job_steps` audit record, redirect to Step 5
10. Successfully add 3 faults with varying severity levels, verify stored in database, verify can reorder faults, verify autosave works

### Story 2.5: Claude AI Integration for Report Generation

As a **manager**,
I want to click "Generate Report" and have the system use AI to create a professional technical report from technician notes and photos,
so that I don't spend 1.5 hours manually writing reports for each job.

**Acceptance Criteria:**

1. Anthropic Claude API account created with API key generated and added to environment variables (`ANTHROPIC_API_KEY`)
2. Claude API client configured in `/lib/ai/claude.ts` using Anthropic SDK (`@anthropic-ai/sdk` npm package)
3. Step 5 detail view created at `/technician/step/[jobId]?step=5` with heading "Step 5: Generate Technical Report"
4. "Generate Report" button (prominent, purple accent color) triggers API call to `/api/ai/generate-report`
5. Report generation API route constructs prompt for Claude 3.5 Sonnet including:
   - Job metadata (client name, equipment type, serial number, job number)
   - Step 3 damage notes and photo tags
   - Step 4 fault list with severity and recommendations
   - Template structure: Executive Summary, Equipment Details, Inspection Findings, Recommended Repairs, Cost Estimate Placeholder
6. Claude API called with `max_tokens: 2048`, `temperature: 0.3` (deterministic output), `model: claude-3-5-sonnet-20241022`
7. Claude response parsed and formatted into structured report sections (Markdown format initially)
8. Loading state displayed during report generation ("Generating report... This may take up to 60 seconds")
9. Generated report displayed in preview panel with "Edit Report" (manual textarea) and "Finalize Report" buttons
10. Successfully generate report for job with 3 faults and 5 photos, verify Claude API called, verify report includes all fault details, verify report completes in <60 seconds

### Story 2.6: PDF Report Generation with Brimis Branding

As a **manager**,
I want to export the AI-generated technical report as a branded PDF,
so that I can send professional quotes to clients with Brimis company branding.

**Acceptance Criteria:**

1. Puppeteer installed (`puppeteer` npm package) for headless Chrome PDF generation
2. Report PDF template created as HTML/CSS in `/lib/templates/report-template.html` with Brimis branding:
   - Header with Brimis logo (logo uploaded to Supabase Storage)
   - Company contact details (address, phone, email in footer)
   - Color scheme matching Brimis brand (Industrial Blue #1E3A8A headers)
   - Professional typography (Inter font family)
3. PDF generation API route created at `/api/reports/generate-pdf` accepting `jobId` parameter
4. API route fetches job details, technician notes, fault list, and photo URLs from database
5. Photo gallery embedded in PDF (2-column grid, 6 photos per page, automatic pagination)
6. Puppeteer renders HTML template to PDF with options: `format: A4`, `printBackground: true`, `margin: 1cm`
7. Generated PDF saved to Google Cloud Storage bucket `wis-reports` with path: `/reports/BRIM-YYYY-###.pdf`
8. PDF URL returned to client and displayed as "Download PDF" button on Step 5 view
9. PDF includes disclaimer footer: "This report is auto-generated with AI assistance. Manager review recommended before sending to client."
10. Successfully generate PDF for sample job, verify Brimis logo appears in header, verify photos embedded, verify PDF downloads correctly, verify file size <5MB

### Story 2.7: Manager Quote Builder & Pricing

As a **manager**,
I want to review the AI-generated report, add pricing for labor and parts, and send the quote to the client,
so that I can quickly turn technical findings into actionable quotes.

**Acceptance Criteria:**

1. Manager dashboard created at `/manager/dashboard` with Kanban board showing all jobs organized by current step (columns for Steps 1-11)
2. Jobs in Step 5 column have "Review Quote" badge to indicate ready for manager action
3. Clicking job card in Step 5 opens Quote Builder modal with three sections: Report Preview, Pricing, Send Quote
4. Report Preview section displays AI-generated report content (read-only text with "Edit Report" link to open textarea for manual edits)
5. Pricing section includes form fields: Labor Hours (number), Hourly Rate (number, default R500), Parts List (repeatable rows: Part Name, Quantity, Unit Price, Subtotal)
6. Total Cost calculated automatically: (Labor Hours × Hourly Rate) + Sum(Parts Subtotals), displayed prominently with VAT calculation (15%)
7. "Save Quote" button stores pricing data in `quotes` table with columns: `id`, `job_id` (FK), `labor_hours`, `hourly_rate`, `parts` (JSONB array), `total_cost`, `created_at`
8. "Send Quote to Client" button validates that pricing is saved, then triggers quote email workflow (Story 2.8)
9. After quote sent, job status updated to "Awaiting PO" and current_step remains 5 (locked at Step 6 gate)
10. Successfully review AI report, add labor (3 hours) and 2 parts, verify total calculates correctly, verify quote saved to database

### Story 2.8: Email Quote Notification to Client

As a **manager**,
I want the system to automatically email the quote link to the client when I click "Send Quote",
so that clients receive professional quotes immediately without manual email composition.

**Acceptance Criteria:**

1. Resend email service configured with API key (`RESEND_API_KEY` environment variable) and verified sender domain
2. Email template created in `/lib/templates/quote-email.html` with professional layout:
   - Subject line: "Quote Ready: [Equipment Type] Repair - Job #[BRIM-YYYY-###]"
   - Greeting with client name
   - Summary of equipment details and repair recommendations
   - Total cost display (prominently formatted)
   - Magic link button: "Review Quote & Approve" → links to client portal (Story 3.1)
   - Brimis contact information and support email in footer
3. Email API route created at `/api/emails/send-quote` accepting `jobId` and `clientEmail` parameters
4. Email route generates magic link token (Story 3.1 dependency), embeds in email template, sends via Resend API
5. Client email address stored in `jobs.client_email` field (added to Story 1.4 intake form)
6. Email delivery status tracked: Resend webhook logs delivery confirmation in `email_logs` table
7. If email fails to send (Resend API error), display error toast to manager: "Email failed to send. Please try again or contact support."
8. Email subject line includes job number for easy client identification in inbox
9. Email includes disclaimer: "This quote is valid for 30 days. Please approve or decline within this period."
10. Successfully send quote email, verify received in client inbox (test with real email), verify magic link included, verify Brimis branding in email

---

## Epic 3: Client Portal & PO Approval Workflow (Step 6 Gate)

**Epic Goal:**
Create the secure client-facing portal that enables equipment owners to review quotes, view damage photo evidence, and digitally approve Purchase Orders without login friction. Implement the critical "Step 6 Gate" workflow synchronization where technician repair work is locked until client PO approval is received, with real-time notification to unlock the workflow. Deliver a seamless quote-to-approval experience that eliminates the multi-day email/phone tag cycle.

### Story 3.1: Magic Link Generation & Client Authentication

As a **client**,
I want to click a link in my email and immediately access my equipment quote,
so that I don't need to create an account or remember a password.

**Acceptance Criteria:**

1. Magic link token generation utility created in `/lib/auth/magic-links.ts` using crypto-secure random tokens (32 bytes, hex-encoded)
2. `client_tokens` table created in database with columns: `id`, `job_id` (FK, unique), `token` (text, unique, indexed), `expires_at` (timestamp, default 72 hours from creation), `used` (boolean, default false)
3. Magic link URL format: `https://wis.app/client/quote/[token]` where token is unique per job
4. When manager sends quote (Story 2.8), magic link token generated and stored in `client_tokens` table, URL embedded in email
5. Client portal landing page created at `/client/quote/[token]` that validates token on page load
6. Token validation logic checks: token exists in database, not expired (`expires_at > now()`), not already used (`used = false`), associated job exists
7. If token invalid/expired, display error page: "This quote link has expired or is invalid. Please contact Brimis for a new link."
8. If token valid, mark `used = true` in database (one-time use) and display quote review page (Story 3.2)
9. Client session cookie created (7-day expiration) to allow returning to quote without re-validating token
10. Successfully generate magic link, click from email, verify lands on quote page, verify token marked as used, verify cannot reuse same link

### Story 3.2: Client Quote Review Page with Photo Evidence

As a **client**,
I want to see a clear breakdown of what's wrong with my equipment with photo evidence and repair costs,
so that I can make an informed decision about approving the repair quote.

**Acceptance Criteria:**

1. Client quote review page displays job summary header: Equipment Type, Serial Number, Job Number, Date Received
2. "Damage Evidence" section displays photo gallery (3-column grid on desktop, 1-column on mobile) showing all Step 3 photos captured by technician
3. Each photo displays with AI-detected tags (e.g., "Corrosion • Rust") and technician annotations if present
4. Photo thumbnails clickable to open full-size lightbox view with zoom capability (pinch-to-zoom on mobile)
5. "Technical Report" section displays AI-generated report content formatted for readability (headings, bullet points, line breaks)
6. Fault list displayed as numbered items with severity indicators (color-coded: Red=Critical, Orange=High, Yellow=Medium, Gray=Low)
7. "Cost Breakdown" section displays pricing table: Labor (hours × rate), Parts (itemized list with quantities and unit prices), Subtotal, VAT (15%), Total Cost (prominently highlighted)
8. Quote validity period displayed: "This quote is valid until [date 30 days from creation]"
9. Page is fully responsive (mobile-first design) with readable typography on small screens (min 16px font size)
10. Successfully view quote as client, verify all photos display, verify cost breakdown accurate, verify can zoom photos, verify responsive on mobile (375px width)

### Story 3.3: Digital Signature Capture & PO Approval

As a **client**,
I want to approve the repair quote by signing on my phone or computer screen,
so that I can authorize the work without printing, signing, and scanning paperwork.

**Acceptance Criteria:**

1. "Approve Quote" section displayed below cost breakdown with large green button: "Approve & Authorize Repair"
2. Clicking "Approve & Authorize Repair" opens full-screen digital signature modal
3. Signature modal includes: Canvas element for drawing signature (responsive size: 80% viewport width, min 300px), "Clear" button to erase and restart, "Cancel" button to close without saving, "Confirm Approval" button (disabled until signature drawn)
4. Signature canvas uses HTML5 Canvas API with smooth drawing strokes (sample rate: 60fps, stroke width: 3px, color: black)
5. Touch input supported on mobile devices (pointer events API for cross-device compatibility)
6. Signature validation checks minimum stroke count (at least 10 stroke points to prevent accidental single-tap approvals)
7. On "Confirm Approval", signature saved as PNG image (Base64-encoded) to Supabase Storage: `/signatures/[jobId]/client-signature.png`
8. PO approval record created in `purchase_orders` table with columns: `id`, `job_id` (FK, unique), `approved_at` (timestamp), `signature_url` (Supabase Storage URL), `client_ip` (for audit trail), `client_user_agent`
9. After approval, update `jobs.current_step` to 6 (unlock Step 6 for technician) and `jobs.status` to "PO Approved"
10. Confirmation page displayed: "Thank you! Your repair has been approved. You will receive updates as work progresses."
11. Successfully draw signature on canvas (desktop and mobile), verify signature saved to storage, verify PO record created, verify job status updated to step 6

### Story 3.4: Real-Time Technician Notification on PO Approval

As a **technician**,
I want to instantly see a notification on my tablet when the client approves the quote,
so that I know I can proceed with repair work without checking manually.

**Acceptance Criteria:**

1. Supabase Realtime subscription configured in technician tablet app to listen for changes on `jobs` table filtered by `assigned_technician_id = current_user.id`
2. When `jobs.current_step` changes from 5 to 6 (PO approval), trigger real-time event in technician app
3. Technician app displays toast notification (green background, 5-second auto-dismiss): "PO Approved for Job #[BRIM-YYYY-###] - Proceed to Step 6 Repair"
4. Step 6 button on technician's current job view automatically unlocks (changes from greyed out/disabled to green/enabled) without page refresh
5. Job list on `/technician/jobs` automatically updates to show updated current step (Step 6) with visual indicator (green dot)
6. Realtime connection resilience: If websocket connection drops, app automatically reconnects and resyncs job state
7. Offline handling: If technician tablet is offline when PO approved, sync notification displays when connection restored
8. Successfully approve quote as client (Story 3.3), verify technician tablet receives notification within 1 second (NFR4 requirement), verify Step 6 button unlocks without manual refresh
9. Test websocket reconnection: Force disconnect, approve quote, reconnect, verify notification received
10. Test offline scenario: Technician offline, client approves, technician comes online, verify notification appears on sync

### Story 3.5: Step 6 Gate - Repair Work Unlock Logic

As a **system**,
I want to prevent technicians from starting Step 6 (repair work) until the client has digitally approved the quote,
so that we enforce the business rule of "no work without PO".

**Acceptance Criteria:**

1. Step 6 detail view created at `/technician/step/[jobId]?step=6` with heading "Step 6: Execute Repairs"
2. If job PO status is "Pending" (no record in `purchase_orders` table), display lock screen overlay with message: "Awaiting Client PO Approval. Quote sent on [date]. You will be notified when client approves."
3. Lock screen includes visual indicator (lock icon, grey background), manager contact link ("Contact manager if urgent"), and auto-refresh every 30 seconds to check PO status
4. If job PO status is "Approved" (`purchase_orders` record exists), display Step 6 form with repair checklist fields (Story 4.1 dependency)
5. Attempting to navigate to `/technician/step/[jobId]?step=6` when `jobs.current_step < 6` redirects back to current step with error toast: "Complete previous steps first"
6. Database constraint enforced: Cannot update `jobs.current_step` from 5 to 6 unless `purchase_orders` record exists (PostgreSQL check constraint or RLS policy)
7. Manager override capability: Managers can manually mark job as "PO Approved" from dashboard (emergency bypass for verbal approvals), logs override action in audit trail
8. Successfully attempt to access Step 6 before PO approval, verify lock screen displayed, approve quote as client, verify lock screen disappears and Step 6 form accessible
9. Test database constraint: Attempt direct database update to step 6 without PO, verify constraint blocks update
10. Test manager override: Manager manually approves PO from dashboard, verify technician Step 6 unlocks, verify audit log entry created

---

## Epic 4: Execution, QC & Dispatch (Steps 6-11)

**Epic Goal:**
Implement the final stages of the Brimis workflow from repair execution through quality control validation to equipment dispatch. Deliver digital QC forms with mandatory measurement entry, photo-guided reassembly to prevent errors, dispatch validation gates preventing premature delivery, and a manager dashboard providing real-time operational visibility across all active jobs. Complete the end-to-end workflow ensuring 100% digital QCP compliance and enforceable quality standards.

### Story 4.1: Step 6-7 - Repair Execution & QC Measurement Entry

As a **technician**,
I want to document repair work performed and enter quality control measurements digitally,
so that QC data is captured systematically without paper forms.

**Acceptance Criteria:**

1. Step 6 form includes "Repair Work Performed" textarea (free-text description of repairs completed, voice-to-text enabled)
2. Step 6 form includes "Parts Replaced" repeatable section (Part Name, Quantity, Notes), matches parts list from manager quote (Story 2.7)
3. On "Complete Step 6", update `jobs.current_step` to 7, insert `job_steps` audit record with repair notes, redirect to Step 7
4. Step 7 detail view created at `/technician/step/[jobId]?step=7` with heading "Step 7: Quality Control Measurements"
5. QC measurement form includes fields specific to equipment type (dynamically loaded based on `jobs.equipment_type`):
   - Pumps: Shaft Diameter (mm), Impeller Clearance (mm), Bearing Condition (dropdown: Good/Fair/Replace)
   - Motors: Winding Resistance (Ω), Insulation Resistance (MΩ), Bearing Play (mm)
   - Gearboxes: Gear Tooth Wear (%), Backlash (mm), Oil Level (dropdown: Full/Add/Change)
6. All measurement fields required (form validation prevents completion without all values entered)
7. Measurement input uses numeric keyboard on mobile (type="number" with step precision: 0.01 for mm, 0.1 for Ω)
8. "Measurement Guide" help icon displays tolerance ranges for each measurement (e.g., "Shaft Diameter: 45.00mm ± 0.05mm")
9. Measurements stored in `job_steps.data.qc_measurements` JSONB object: `{shaft_diameter: 45.02, impeller_clearance: 0.15, ...}`
10. Successfully complete Step 6 repair notes, enter QC measurements for pump (3 required fields), verify all fields required, verify measurements saved in database, verify progress to Step 8

### Story 4.2: Step 8 - Assembly Guidance with Reference Photos

As a **technician**,
I want to see the damage photos from Step 3 while reassembling the equipment in Step 8,
so that I can ensure correct orientation and configuration without disassembly errors.

**Acceptance Criteria:**

1. Step 8 detail view created at `/technician/step/[jobId]?step=8` with heading "Step 8: Reassemble Equipment"
2. Page layout split into two sections: Left panel (60% width): Assembly checklist, Right panel (40% width): Reference Photo Gallery
3. Reference Photo Gallery displays all photos captured in Step 3 (thumbnails, click to expand full-size)
4. Photo gallery includes annotation tools (Phase 2 feature stub): "Add orientation marker" button (disabled for MVP, tooltip: "Coming Soon")
5. Assembly checklist includes generic items (customizable per equipment type in Phase 2):
   - Item 1: "Position bearings in correct orientation per damage photos"
   - Item 2: "Torque bolts to specification (refer to equipment manual)"
   - Item 3: "Install new seals/gaskets with proper alignment"
   - Item 4: "Verify shaft rotation is smooth without binding"
6. Checklist items are checkboxes; all must be checked before "Complete Step 8" is enabled
7. Checklist state saved in `job_steps.data.assembly_checklist` JSONB array (autosave every 10 seconds)
8. On mobile/tablet portrait mode, photo gallery collapses to bottom drawer (swipe up to expand) to maximize checklist visibility
9. On "Complete Step 8", update `jobs.current_step` to 9, insert `job_steps` audit record, redirect to Step 9
10. Successfully view Step 3 photos in side panel while completing Step 8 checklist, verify all checklist items required, verify responsive layout on tablet, verify can zoom reference photos

### Story 4.3: Step 9-10 - Testing & Final QC Validation

As a **technician**,
I want to perform operational testing and final QC checks before dispatch,
so that equipment is verified working before returning to the client.

**Acceptance Criteria:**

1. Step 9 detail view created at `/technician/step/[jobId]?step=9` with heading "Step 9: Operational Testing"
2. Testing checklist includes:
   - Item 1: "No-load test run completed (minimum 5 minutes)"
   - Item 2: "Vibration levels within acceptable range"
   - Item 3: "No abnormal noise or overheating detected"
   - Item 4: "Visual inspection confirms no leaks"
3. Test results captured in Pass/Fail radio buttons for each item (all must be "Pass" to proceed)
4. If any test result is "Fail", "Complete Step 9" button disabled with warning: "Resolve all test failures before proceeding. Contact supervisor if needed."
5. Test results stored in `job_steps.data.test_results` JSONB object with timestamps
6. On "Complete Step 9", update `jobs.current_step` to 10, insert `job_steps` audit record, redirect to Step 10
7. Step 10 detail view created at `/technician/step/[jobId]?step=10` with heading "Step 10: Final QC Validation"
8. Final QC form duplicates critical measurements from Step 7 (shaft diameter, bearing clearance) for comparison validation
9. "Measurement Comparison" table displays: Measurement Name, Step 7 Value, Step 10 Value, Delta (auto-calculated), Status (Green if delta <5%, Red if >5%)
10. If any delta exceeds 5%, display warning: "Significant measurement deviation detected. Verify equipment reassembly." (but allow completion with manager override)
11. Successfully complete Step 9 testing with all Pass results, enter Step 10 final measurements, verify delta calculation works, verify warning displays for >5% deviation

### Story 4.4: Step 11 - Dispatch Validation & Delivery Notes

As a **technician**,
I want the system to prevent printing delivery notes until all QC checks are complete,
so that equipment cannot leave the workshop without passing all quality gates.

**Acceptance Criteria:**

1. Step 11 detail view created at `/technician/step/[jobId]?step=11` with heading "Step 11: Dispatch Equipment"
2. Dispatch validation logic checks: Step 9 test results (all "Pass"), Step 10 QC measurements entered, PO approved (`purchase_orders` record exists)
3. If validation fails, display error block: "Cannot dispatch - complete all requirements: [list of missing items]"
4. If validation passes, display "Print Delivery Note" button (enabled, green background)
5. Clicking "Print Delivery Note" generates PDF delivery document including:
   - Client name and contact details
   - Equipment details (type, serial number)
   - Job summary (date received, date completed, job number)
   - Work performed summary (from Step 6 notes)
   - Parts replaced list (from Step 6)
   - QC validation stamp: "This equipment has passed all quality checks. Technician: [name], Date: [date]"
   - Brimis company logo and contact information
6. Delivery note PDF saved to Google Cloud Storage: `/delivery-notes/BRIM-YYYY-###-delivery.pdf`
7. PDF opens in new tab for printing (browser print dialog auto-triggered)
8. After delivery note printed, "Mark as Dispatched" button appears (technician confirms equipment physically handed over)
9. On "Mark as Dispatched", update `jobs.status` to "Completed", `jobs.completed_at` to current timestamp, `jobs.current_step` to 11 (final step)
10. Job completion triggers email notification to client: "Your equipment repair is complete and ready for pickup/delivery. View final report: [link]"
11. Successfully complete all QC checks, verify "Print Delivery Note" button enabled, print delivery note PDF, mark as dispatched, verify job status "Completed", verify client email sent

### Story 4.5: Manager Dashboard - Kanban Board with Job Visibility

As a **manager**,
I want to see all active jobs organized by their current step in a Kanban board view,
so that I can quickly identify bottlenecks and monitor workshop capacity.

**Acceptance Criteria:**

1. Manager dashboard at `/manager/dashboard` displays Kanban board with 11 columns (one per step)
2. Column headers show: Step number, Step name (e.g., "1 - Receiving"), Job count badge (e.g., "3 jobs")
3. Each job displayed as a card in the appropriate column showing: Job number (BRIM-YYYY-###), Client name, Equipment type, Assigned technician, Days in current step (e.g., "2d")
4. Job cards color-coded by priority/age: Green (<2 days), Yellow (2-5 days), Red (>5 days in same step)
5. Clicking job card opens detailed modal with: Full job history (timeline of all completed steps with timestamps), Photo gallery (all photos from all steps), Notes and measurements (all captured data), "Edit Job" button (managers can override any field)
6. Kanban board uses horizontal scroll on desktop (11 columns wide), responsive stacking on mobile (one column at a time with dropdown filter)
7. Drag-and-drop NOT implemented for MVP (manual step progression only via technician interface)
8. Real-time updates: Dashboard auto-refreshes when jobs change step (Supabase Realtime subscription), new jobs appear without manual refresh, completed jobs auto-remove from board
9. Filter controls above Kanban: "All Jobs", "My Assigned" (manager as fallback technician), "By Technician" dropdown, "By Client" dropdown
10. Successfully view dashboard with 10 sample jobs distributed across steps, verify job cards display all required info, verify color coding works, verify clicking card opens modal, verify real-time updates (create new job, verify appears on dashboard)

### Story 4.6: Job Search & Historical Records

As a **manager**,
I want to search for completed jobs and view historical repair records,
so that I can reference past work for repeat clients or warranty claims.

**Acceptance Criteria:**

1. "Completed Jobs" tab added to manager dashboard (next to "Active Jobs" Kanban board)
2. Completed jobs list displays all jobs with `status: completed`, sorted by `completed_at` descending (most recent first)
3. List view shows: Job number, Client name, Equipment type, Date completed, Total cost, View button
4. Search functionality includes filter fields: Job number (exact match), Client name (partial match), Equipment type (dropdown), Date range (from/to date pickers)
5. Search results update in real-time as filters are applied (no "Search" button - instant filtering)
6. Pagination implemented for large result sets (20 jobs per page, load more on scroll)
7. Clicking "View" button opens read-only job detail modal with full history, photos, technical report PDF link, delivery note PDF link
8. Export to CSV functionality: "Download Report" button exports filtered job list to CSV file with columns: Job Number, Client, Equipment, Date Completed, Total Cost, Technician
9. Successfully search for jobs by client name, verify partial match works (e.g., "Acme" finds "Acme Industries Ltd"), verify date range filter works, verify can download CSV export
10. Test large dataset: Seed database with 100 completed jobs, verify pagination works, verify search performance (<500ms response time per NFR10)

---

## Checklist Results Report

*(This section will be populated after running the PM Checklist validation process. The checklist systematically verifies PRD completeness, epic sequencing, story sizing, acceptance criteria clarity, and MVP scope discipline.)*

**Status:** Pending PM Checklist Execution

---

## Next Steps

### UX Expert Prompt

Hi Sally (UX Expert) - I've completed the PRD for the Workshop Intelligence System. Your task: Create a comprehensive Front-End Specification document based on this PRD, focusing on the tablet-first technician interface, desktop manager dashboard, and mobile client portal. Pay special attention to "gloves-on" accessibility, high-contrast visuals for workshop lighting, and offline-first PWA patterns. Reference the UI Design Goals section for detailed requirements. Save the output as `docs/front-end-spec.md`.

### Architect Prompt

Hi Winston (Architect) - I've finalized the PRD for the Workshop Intelligence System. Your task: Create a detailed Full-Stack Architecture document that specifies the Next.js 14 monorepo structure, Supabase database schema with RLS policies, 11-step workflow state machine logic, AI service integration patterns (Claude + Google Vision), real-time synchronization architecture, and offline-first PWA implementation strategy. Reference the Technical Assumptions section for all technology decisions. Save the output as `docs/fullstack-architecture.md`.

---

**End of PRD**
