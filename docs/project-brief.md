# Project Brief: Workshop Intelligence System (WIS)

**Version:** 1.0
**Date:** November 2025
**Created by:** Mary (Business Analyst) | BMad Method
**Project Type:** Greenfield Full-Stack Application

---

## Executive Summary

Workshop Intelligence System (WIS) is an AI-powered workflow automation platform designed to digitize and optimize the "Brimis 11 Steps for Service Excellence" process. The system replaces manual job cards and paper-based reporting with a tablet-first application that guides technicians through repair workflows using Computer Vision for defect detection and Generative AI for automated technical reporting.

**The Opportunity:** Industrial workshops face a critical "Efficiency Gap" between physical repair work and administrative reporting. WIS targets a 60% reduction in administrative overhead, 70% faster quote turnaround, and 100% digital compliance - delivering an estimated R700,000+ first-year value with a payback period under 2.5 months.

**Target Market:** Industrial equipment repair workshops currently using manual or semi-digital job tracking systems, with immediate deployment at Brimis workshop operations.

**Key Value Proposition:** WIS eliminates the "Quote Lag" bottleneck by automating technical report generation, enforces quality compliance through step-gating, and provides real-time client visibility - transforming workshop efficiency while maintaining rigorous engineering standards.

---

## Problem Statement

### Current State & Pain Points

Industrial workshops like Brimis face a critical operational inefficiency where **administrative work (reporting and quoting) creates bottlenecks** in the physical repair process. The current 11-step workflow relies on manual inputs at critical junctures:

**1. Information Silos**
- Technicians capture damage photos on personal phones
- Photos must be manually transferred to office computers for report creation
- Data loss and delays occur during transfer process
- No systematic photo organization or tagging

**2. The "Quote Lag" Crisis**
- Equipment sits idle on the workshop floor (Step 6) waiting for Purchase Order approval
- Technical report generation (Step 5) is highly labor-intensive (1.5 hours per job)
- Manual report writing becomes the critical path bottleneck
- Estimated 50 jobs/month × 1.5 hours = 75 hours/month of pure administrative overhead

**3. Compliance & Quality Risks**
- Physical job cards can be lost or damaged
- Critical safety steps (Hazmat checks in Step 2, QC validations in Step 10) can be accidentally skipped
- No digital enforcement of the 11-step sequence
- Audit trail gaps create liability exposure

**4. Client Communication Gaps**
- Clients lack real-time visibility into repair status
- Frequent "status check" phone calls consume staff time
- No systematic mechanism for digital PO approval
- Quote-to-approval cycle adds unnecessary friction

### Impact of the Problem (Quantified)

**Financial Impact:**
- **R450,000/year** in wasted administrative time (1.5 hrs/job × 50 jobs/month × R500/hr)
- **R200,000/year** in operational value lost to equipment sitting idle awaiting PO
- **R50,000/year** in dispute costs from inadequate photo evidence

**Operational Impact:**
- 20% of workshop capacity consumed by "waiting for PO" downtime
- Delayed quote generation extends total job cycle time by 30-40%
- Compliance gaps create regulatory and liability exposure

**Customer Satisfaction Impact:**
- Lack of transparency requires customers to make status inquiry calls
- Slow quote turnaround creates perception of inefficiency
- Manual PO process adds friction to approval workflow

### Why Existing Solutions Fall Short

**Generic Job Management Systems:**
- Not designed for the specific 11-step engineering protocol
- Lack AI-powered report generation capabilities
- Don't integrate Computer Vision for defect tagging
- No built-in step-gating enforcement

**Manual Documentation Systems:**
- Paper job cards are inherently non-scalable
- Cannot provide real-time client visibility
- No mechanism for automated compliance enforcement
- Photo management remains siloed

**Custom Internal Tools:**
- Previous attempts lack AI integration
- No mobile-first tablet experience
- Missing real-time synchronization
- Don't address the core "report writing bottleneck"

### Urgency & Importance

**Market Timing:** Industrial services digitization is accelerating post-COVID. Early movers will establish competitive advantage in operational efficiency and client experience.

**Business Criticality:** Current inefficiencies directly impact:
- Workshop throughput and revenue capacity
- Client satisfaction and retention
- Regulatory compliance and risk management
- Staff productivity and morale (frustration with manual administrative burden)

**ROI Window:** With a <2.5 month payback period, delaying implementation costs approximately R58,000 per month in unrealized efficiency gains.

---

## Proposed Solution

### Core Concept & Approach

WIS is a **tablet-first Progressive Web Application (PWA)** that digitizes the entire 11-step Brimis service workflow with three breakthrough capabilities:

1. **11-Step Logic Engine:** A state machine that enforces sequential workflow progression with mandatory quality gates, preventing steps from being skipped
2. **AI Report Writer:** Uses Anthropic Claude 3.5 Sonnet to transform technician bullet points into formal branded technical reports instantly
3. **Visual Inspection AI:** Leverages Google Cloud Vision API to analyze damage photos and auto-tag defects (corrosion, cracks, wear patterns)

### Key Differentiators

**vs. Generic Job Management Tools:**
- Purpose-built for the Brimis 11-step engineering protocol
- AI automation eliminates 1.5 hours of manual report writing per job
- Computer Vision reduces manual photo tagging workload

**vs. Paper-Based Systems:**
- Real-time client portal with live job status tracking
- Digital step-gating prevents compliance violations
- Automated evidence collection for dispute prevention

**vs. Previous Internal Tools:**
- Mobile-first tablet UX designed for workshop floor conditions
- Offline-capable PWA with automatic sync
- Integrated AI reduces administrative burden by 60%

### Why This Solution Will Succeed

**Technical Feasibility:** Proven technologies (Next.js 14, Supabase, Claude API, Google Vision) with established reliability

**User-Centered Design:** Tablet-first interface designed for technicians wearing gloves in industrial environments

**Immediate ROI:** Targets the #1 bottleneck (manual report generation) with measurable time savings

**Compliance Enforcement:** Digital step-gating ensures 100% QCP completion, addressing regulatory risk

**Client Experience:** Magic link portal provides transparency without requiring client login/account creation

### High-Level Vision

**Phase 1 (Weeks 1-5):** Production deployment with core 11-step workflow, AI report generation, client portal, and QR-based job tracking

**Phase 2 (Months 2-4):** Advanced analytics dashboard, predictive maintenance insights, inventory integration

**Long-Term Vision:** Platform expansion to other industrial service verticals, white-label licensing opportunity

---

## Target Users

### Primary User Segment: Workshop Technicians

**Profile:**
- Industrial equipment repair specialists (pumps, motors, gearboxes)
- Age range: 25-55 years
- Technical/trade school education
- Comfortable with tablets but not "tech-savvy"
- Work in physically demanding workshop environment (grease, noise, PPE)

**Current Behaviors & Workflows:**
- Use paper job cards clipped to equipment
- Take photos with personal smartphones
- Write handwritten notes on damage observations
- Must go to office computer to create formal reports
- Manually enter QC measurements into spreadsheets

**Specific Needs & Pain Points:**
- Need hands-free or glove-friendly input methods (voice-to-text)
- Require clear visual guidance on current step and next actions
- Want photos automatically linked to the correct job (no manual transfer)
- Need quick access to previous repair photos during reassembly (Step 8)
- Frustrated by "duplicate data entry" between job card and digital systems

**Goals:**
- Complete jobs efficiently without administrative bottlenecks
- Ensure compliance with quality standards without extra effort
- Produce professional reports that make them look competent
- Avoid blame for lost paperwork or skipped steps

**Success Metric:** Technicians complete digital job card in ≤ same time as paper process (no productivity loss) while eliminating manual report writing.

---

### Secondary User Segment: Workshop Managers

**Profile:**
- Operations supervisors and service managers
- Age range: 35-60 years
- Engineering or business management background
- Responsible for job profitability, client relationships, compliance
- Office-based with occasional workshop floor visits

**Current Behaviors & Workflows:**
- Manually compile technical reports from technician notes
- Create quotes by adding labor/parts costs to reports
- Send quote PDFs via email and chase clients for PO approval
- Track job status using whiteboards or Excel spreadsheets
- Field frequent client "status update" phone calls

**Specific Needs & Pain Points:**
- Spend 1.5 hours per job on report writing (want AI automation)
- Lack real-time visibility into workshop floor progress
- Quote-to-PO approval cycle creates unpredictable delays
- No systematic way to enforce QCP compliance
- Difficult to generate performance analytics from paper records

**Goals:**
- Accelerate quote generation to reduce equipment idle time
- Provide clients with proactive updates (reduce inbound calls)
- Ensure 100% compliance with safety and quality protocols
- Generate data-driven insights for capacity planning

**Success Metric:** Time-to-quote reduced by 70%, zero compliance violations, client satisfaction score improvement.

---

### Tertiary User Segment: Clients (Equipment Owners)

**Profile:**
- Industrial facility managers, maintenance supervisors
- Responsible for equipment uptime and repair budgets
- Need to justify repair costs to senior management
- Value transparency and fast turnaround

**Current Behaviors & Workflows:**
- Submit equipment for repair and wait for quote
- Receive PDF quote via email with damage photos
- Must call workshop for status updates
- Manually sign and return PO (often requires internal approval workflow)

**Specific Needs & Pain Points:**
- Lack visibility into repair progress (equipment is "black box" at workshop)
- Quote approval requires photo evidence to justify costs
- Slow PO process extends total repair cycle time
- Want ability to review and approve quotes 24/7 (not just business hours)

**Goals:**
- Understand exactly what's wrong with equipment (clear photo evidence)
- Approve quotes quickly to minimize downtime
- Track repair status without making phone calls
- Have audit trail for finance/compliance purposes

**Success Metric:** 90% of clients approve quotes within 24 hours (vs. current 3-5 days), zero "status inquiry" calls.

---

## Goals & Success Metrics

### Business Objectives

- **Deploy production system within 4-5 weeks** from project kickoff (Target: Week 5 go-live)
- **Reduce time-to-quote by 70%** through AI report generation (From 1.5 hours to <30 minutes per job)
- **Increase workshop throughput by 15%** by eliminating "waiting for PO" idle time (Revenue impact: R200K+/year)
- **Achieve 100% digital QCP completion rate** for every job (Zero compliance violations)
- **Reduce administrative overhead by 60%** (Save 75 hours/month of manual report writing)
- **Deliver positive ROI within 2.5 months** (R700K+ first-year value vs. R95K + R145K setup costs)

### User Success Metrics

**Technician Metrics:**
- ≤5 minutes to complete digital job card per step (vs. 3 min paper baseline)
- 90% adoption rate within 30 days of launch
- Voice-to-text usage rate >50% for damage notes
- Zero "lost job card" incidents (vs. current ~2 per month)

**Manager Metrics:**
- Technical report generation time: <30 minutes (vs. 1.5 hours manual)
- Quote send time: <1 hour from technician "Step 5 Complete" trigger
- Client response rate to magic link portal: >90%
- Dashboard login frequency: >5 times per week per manager

**Client Metrics:**
- Time-to-PO-approval: <24 hours for 90% of quotes
- Client satisfaction score: 4.5+/5.0 for quote clarity and transparency
- "Status inquiry" call volume: -80% reduction

### Key Performance Indicators (KPIs)

- **Quote Turnaround Time:** Target <4 hours from job completion to quote sent (vs. current 24-48 hours)
- **Administrative Time Saved:** 75+ hours/month reclaimed from manual report writing
- **Compliance Rate:** 100% of jobs with complete digital QCP (all 11 steps validated)
- **System Uptime:** 99.9% availability (Managed hosting SLA)
- **AI Report Quality:** <10% of AI-generated reports requiring substantive manual editing
- **Client Portal Engagement:** 80%+ of clients access portal vs. calling for updates
- **Mobile-First UX:** 95%+ of technician interactions occur on tablet (not desktop)
- **Offline Capability:** 100% of core technician functions available offline with sync

---

## MVP Scope

### Core Features (Must Have)

**Module 1: Intake & Triage (Steps 1-2)**
- **Digital Receiving Log:** QR code scanning or serial number entry to check in equipment
  - *Rationale:* Replaces manual job card creation, generates unique Job ID
- **Hazmat Toggle & Enforcement:** Mandatory hazardous chemical declaration in Step 2
  - *Rationale:* Critical safety compliance requirement
- **QR Tag Generation:** System prints physical QR label for equipment tracking
  - *Rationale:* Enables technicians to instantly access job card from any device

**Module 2: AI Inspector & Report Writer (Steps 3-5)**
- **In-App Camera:** Direct photo capture with automatic job linkage
  - *Rationale:* Eliminates phone-to-computer transfer process
- **Google Vision Analysis:** Auto-tag defects (corrosion, cracks, wear)
  - *Rationale:* Reduces manual tagging effort, ensures consistent labeling
- **Voice-to-Text Notes:** Hands-free damage description input
  - *Rationale:* Optimized for workshop environment (gloves, grease)
- **GenAI Technical Report:** Claude 3.5 compiles photos + notes into branded PDF
  - *Rationale:* Eliminates 1.5 hours of manual report writing (core bottleneck)

**Module 3: Client Portal & Fast-Track PO (Step 6 Gate)**
- **Magic Link Portal:** Secure, no-login client quote review
  - *Rationale:* Removes friction from client access (no account creation)
- **Interactive Quote Display:** Photos, damage descriptions, pricing breakdown
  - *Rationale:* Provides visual evidence to justify costs
- **Digital Signature Capture:** On-screen PO approval
  - *Rationale:* Eliminates email/fax/scan PO process
- **Work Unlocking:** Step 6 "Repair" button locked until PO received
  - *Rationale:* Prevents unauthorized work, enforces approval gate

**Module 4: Execution, QC & Dispatch (Steps 6-11)**
- **Digital QCP Forms:** Mandatory micrometer measurement entry (Steps 7 & 10)
  - *Rationale:* Ensures quality control data is captured and auditable
- **Assembly Photo Guide:** Display Step 3 photos during Step 8 reassembly
  - *Rationale:* Ensures correct orientation/configuration during rebuild
- **Dispatch Gate:** Block Step 11 delivery note printing until all QC checks pass
  - *Rationale:* Final quality enforcement before equipment leaves workshop

**Platform Foundation**
- **Next.js 14 PWA:** Responsive tablet-first interface with offline capability
  - *Rationale:* Workshop floor may have spotty Wi-Fi, offline mode critical
- **Supabase Real-Time:** Instant updates when client signs PO (technician screen refreshes)
  - *Rationale:* Eliminates manual refresh, provides instant work authorization
- **Manager Dashboard:** Kanban board view of all active jobs by step
  - *Rationale:* Provides operational visibility for capacity planning

### Out of Scope for MVP

- Advanced analytics/reporting dashboards (charts, trends, performance metrics)
- Inventory management integration
- Automated parts ordering
- Predictive maintenance AI (failure prediction based on historical data)
- Mobile native apps (iOS/Android) - PWA only for MVP
- Multi-workshop/multi-location support (single Brimis site only)
- Custom branding per client (standard Brimis branding only)
- Integration with external accounting/ERP systems
- Automated SMS/WhatsApp notifications (email only for MVP)
- Multi-language support (English only initially)

### MVP Success Criteria

**MVP is considered successful when:**

1. **Functional Completeness:** All 11 steps digitally implemented with step-gating enforcement
2. **AI Performance:** Claude report generation produces usable output for ≥90% of jobs with minimal editing
3. **Adoption Threshold:** 3 technicians actively using the system for 10+ jobs each
4. **Client Engagement:** 5+ clients successfully receive and approve quotes via magic link portal
5. **Compliance Achievement:** 20 consecutive jobs completed with 100% QCP digital completion
6. **Performance Targets:**
   - Average quote generation time <45 minutes (vs. 1.5 hour target for Phase 2 optimization)
   - System uptime >99% during 2-week pilot period
   - Zero critical bugs preventing job progression
7. **User Acceptance:** Technician NPS score ≥7/10, Manager satisfaction ≥8/10

**Go/No-Go Decision Criteria:**
If MVP success criteria are not met within Week 6 (1 week post-launch), conduct root cause analysis and implement corrective measures before declaring production-ready.

---

## Post-MVP Vision

### Phase 2 Features (Months 2-3)

**Advanced Analytics Dashboard**
- Job cycle time analysis (average days per step, bottleneck identification)
- Technician productivity metrics (jobs completed, quality scores)
- Revenue analytics (quote acceptance rate, average job value)
- Client behavior insights (approval speed, repeat customer patterns)

**Inventory Integration**
- Real-time parts availability checking during quote creation
- Automated low-stock alerts for common replacement parts
- Integration with supplier catalogs for accurate pricing
- Parts usage tracking for cost analysis

**Enhanced Client Experience**
- Automated SMS/email notifications at key milestones (quote ready, repair started, QC passed)
- Client feedback collection (post-delivery NPS survey)
- Historical job lookup for repeat customers

### Long-Term Vision (6-12 Months)

**Predictive Maintenance AI**
- Analyze historical failure patterns to predict equipment lifecycle
- Recommend proactive maintenance schedules to clients
- Generate "equipment health reports" based on inspection data
- Build proprietary failure prediction models from accumulated repair data

**Multi-Workshop Platform**
- Support for multiple Brimis locations with centralized management
- Inter-location job transfer capability
- Consolidated reporting across all sites
- Franchise/licensing model for independent workshops

**White-Label Platform**
- Rebrandable solution for other industrial service providers
- Customizable workflow engine (support different process variants)
- SaaS subscription model (per-technician/per-job pricing)
- Partner ecosystem for integrations (accounting, CRM, ERP)

### Expansion Opportunities

**Vertical Expansion:**
- Hydraulic cylinder repair shops
- Pneumatic equipment service centers
- Industrial valve refurbishment facilities
- Electric motor rewind operations

**Horizontal Expansion:**
- Field service technicians (mobile version with GPS tracking)
- Manufacturing quality control (production line inspection workflows)
- Facility maintenance operations (building equipment servicing)

**Strategic Partnerships:**
- Equipment OEMs (authorized service center network)
- Insurance companies (claim verification with photo evidence)
- Industrial IoT platforms (condition monitoring integration)

---

## Technical Considerations

### Platform Requirements

**Target Platforms:**
- **Primary:** Tablet (10-12" iPad/Android tablets) for technicians
- **Secondary:** Desktop (Windows/Mac) for managers
- **Tertiary:** Mobile phone (responsive fallback for clients)

**Browser/OS Support:**
- Modern browsers (Chrome 90+, Safari 14+, Edge 90+)
- iOS 14+ and Android 10+ for mobile/tablet
- Progressive Web App (installable, works offline)

**Performance Requirements:**
- Page load time: <2 seconds on 4G connection
- Offline mode: 100% of technician functions available without internet
- Real-time updates: <1 second latency for PO approval notifications
- Photo upload: Support 4K images (12MP camera), max 5MB per photo
- AI report generation: <60 seconds for typical job (10 photos, 500 words notes)

**Accessibility:**
- WCAG 2.1 Level AA compliance
- Large touch targets (min 44×44px) for glove-friendly operation
- High contrast mode for bright workshop lighting conditions
- Voice input support for hands-free operation

### Technology Preferences

**Frontend:**
- **Framework:** Next.js 14 (App Router) with React Server Components
- **Styling:** Tailwind CSS for rapid responsive design
- **State Management:** React Context + Zustand for client state
- **PWA:** Workbox for service worker and offline caching
- **Camera:** WebRTC Media Capture API with fallback to file upload

**Backend:**
- **Database:** Supabase (PostgreSQL) with Row Level Security
- **Real-time:** Supabase Realtime subscriptions for live updates
- **API Layer:** Next.js API routes (serverless functions)
- **Authentication:** Supabase Auth with magic links for clients

**AI/ML Services:**
- **Text Generation:** Anthropic Claude 3.5 Sonnet API for report writing
- **Image Analysis:** Google Cloud Vision API for defect detection
- **Prompt Management:** LangChain for prompt templates and versioning

**Storage:**
- **Images:** Google Cloud Storage for high-resolution repair photos
- **Documents:** Supabase Storage for PDF reports and QR codes
- **CDN:** Vercel Edge Network for fast global delivery

**Hosting/Infrastructure:**
- **Deployment:** Vercel (managed Next.js hosting)
- **Database:** Supabase Cloud (managed PostgreSQL)
- **Monitoring:** Vercel Analytics + Sentry error tracking
- **Backups:** Supabase daily automated backups with 7-day retention

### Architecture Considerations

**Repository Structure:**
- **Monorepo:** Single repository with clear separation of concerns
  ```
  /app          - Next.js application pages and routes
  /components   - Reusable UI components
  /lib          - Utility functions, API clients, workflow engine
  /public       - Static assets
  /docs         - Project documentation (PRD, architecture, specs)
  ```

**Service Architecture:**
- **Monolithic Application:** Single Next.js app (appropriate for MVP scale)
- **State Machine:** 11-step workflow engine as core business logic module
- **API Abstraction:** Separate modules for Claude, Vision, Supabase interactions
- **Future Consideration:** Microservices split if scaling beyond 1000+ concurrent jobs

**Integration Requirements:**
- **Email:** SendGrid or Resend for quote delivery and notifications
- **SMS (Phase 2):** Twilio for client PO approval alerts
- **QR Generation:** Built-in library (qrcode.js) for job tag creation
- **PDF Generation:** Puppeteer or react-pdf for branded report export
- **Signature Capture:** Canvas-based drawing library for client PO signing

**Security/Compliance:**
- **Data Encryption:** TLS 1.3 in transit, AES-256 at rest (Supabase default)
- **Authentication:** JWT-based with role-based access control (Technician/Manager/Client)
- **API Security:** Rate limiting, API key rotation, input validation
- **GDPR Considerations:** Client data retention policy (photos stored for 7 years per audit requirements)
- **Backup Strategy:** Daily incremental, weekly full backups with 30-day retention
- **Disaster Recovery:** RPO 24 hours, RTO 4 hours (Supabase SLA)

---

## Constraints & Assumptions

### Constraints

**Budget:**
- **Option A (Managed Service):** R95,000 setup + R14,500/month ongoing
- **Option B (Self-Hosted):** R145,000 setup + R6,500/month support (client pays hosting)
- **Decision Point:** Budget approval required before Week 1 kickoff

**Timeline:**
- **Fixed Deadline:** 5-week development timeline (non-negotiable for initial deployment)
- **Discovery Day:** Week 1 includes 1 full day of technician shadowing
- **Training:** Week 5 includes 2 days on-site technician training
- **Constraint Impact:** Aggressive timeline requires clear prioritization and scope discipline

**Resources:**
- **Development Team:** NOVATEK (1-2 developers) - external vendor
- **Client Availability:** Workshop manager must allocate 5-10 hours/week for requirements validation
- **Test Users:** Minimum 3 technicians available for Week 4-5 pilot testing
- **Hardware:** Client must provide tablets (recommend iPad 10.2" or Samsung Galaxy Tab - budget not included in software costs)

**Technical:**
- **Internet Dependency:** Offline mode for technicians, but manager features require connectivity
- **AI API Limits:** 5,000 queries/month included in managed service (50 jobs × 100 queries/job)
- **Photo Storage:** Managed service includes hosting but large volumes may incur overage fees
- **Browser Constraints:** No support for Internet Explorer or browsers >2 years old

### Key Assumptions

- **User Adoption:** Technicians are willing to transition from paper to tablets with adequate training
- **AI Quality:** Claude 3.5 report generation will produce acceptable output with well-engineered prompts
- **Client Technology:** 90%+ of clients have email access and smartphone/computer to view quotes
- **Workshop Connectivity:** Wi-Fi available in office area (not required on workshop floor due to PWA offline mode)
- **Process Stability:** The 11-step Brimis workflow is well-established and won't require major changes during development
- **Photo Quality:** Tablet cameras (8MP+) are sufficient for defect documentation (no need for professional camera equipment)
- **QR Code Viability:** Physical QR tags can withstand workshop environment (oil, heat, chemicals) - may require lamination
- **Compliance Requirements:** No regulatory approvals needed beyond standard digital record-keeping practices
- **Data Ownership:** Client owns all job/customer data; NOVATEK retains IP for core platform
- **Signature Validity:** Digital signatures on tablet are legally binding for PO approval (client legal review recommended)

---

## Risks & Open Questions

### Key Risks

**1. User Adoption Resistance (Probability: Medium | Impact: High)**
- **Risk:** Technicians accustomed to paper may resist tablet-based workflow
- **Mitigation:** Extensive hands-on training, shadowing during Week 1, champion identification
- **Contingency:** Hybrid paper/digital transition period if needed

**2. AI Report Quality Below Expectations (Probability: Low | Impact: High)**
- **Risk:** Claude-generated reports may require excessive manual editing, negating time savings
- **Mitigation:** Invest in prompt engineering during Week 2, build report template library
- **Contingency:** Fallback to manual report writing with AI-assisted sections only

**3. Offline Mode Technical Challenges (Probability: Medium | Impact: Medium)**
- **Risk:** PWA offline sync may have edge cases causing data loss
- **Mitigation:** Rigorous testing of offline scenarios, conflict resolution strategy
- **Contingency:** Require Wi-Fi connectivity as temporary measure until resolved

**4. Timeline Slippage (Probability: Medium | Impact: High)**
- **Risk:** 5-week timeline is aggressive; unexpected technical issues could delay launch
- **Mitigation:** Daily standups, weekly milestone reviews, scope flexibility (MVP vs. nice-to-have)
- **Contingency:** Soft launch with 1 technician pilot if full rollout not ready Week 5

**5. Client Digital Adoption Gap (Probability: Low | Impact: Medium)**
- **Risk:** Some clients may lack email/smartphone access or prefer phone call quotes
- **Mitigation:** Hybrid approach (email magic link + phone call for non-digital clients)
- **Contingency:** Manager can manually send PDF quotes via traditional methods

**6. Tablet Hardware Constraints (Probability: Low | Impact: Medium)**
- **Risk:** Tablets may be damaged in harsh workshop environment or battery life insufficient
- **Mitigation:** Recommend rugged cases, multiple charging stations, backup device
- **Contingency:** Desktop fallback mode for damaged tablets

### Open Questions

**Process & Workflow:**
- What happens if a client verbally approves a quote but doesn't digitally sign? (Manual override process?)
- How are rush jobs handled? Can managers override step-gating in emergencies?
- What is the escalation process if AI report generation fails? (Manager notification? Auto-fallback?)
- Are there seasonal job volume fluctuations that would stress-test system capacity?

**Technical & Integration:**
- Does Brimis have existing systems (accounting, inventory) that must integrate with WIS?
- What is the workshop's current internet bandwidth? Will photo uploads impact performance?
- Are there specific report formatting requirements (logo placement, legal disclaimers)?
- Does Brimis have preferred cloud providers (Google, AWS, Azure) for compliance reasons?

**User Experience & Training:**
- How tech-savvy are the target technicians? Any previous tablet experience?
- What is the primary language of technicians? (Assumption: English, but multilingual UI needed?)
- Are there specific accessibility needs (vision impairment, motor skill considerations)?
- What is the typical noise level in workshop? (Impacts voice-to-text reliability)

**Business & Compliance:**
- What is the data retention policy for client information and repair photos?
- Are there industry certifications (ISO 9001, etc.) that WIS must support?
- What happens to historical paper job cards? (Digital migration? Parallel systems?)
- Who has final authority to approve/reject AI-generated reports before sending to clients?

### Areas Needing Further Research

**Technical Validation:**
- Benchmark Claude 3.5 report quality with sample technician notes (pre-development POC)
- Test Google Vision defect detection accuracy on real pump/motor damage photos
- Validate PWA offline sync reliability with simulated poor connectivity scenarios
- Assess tablet battery life under typical 8-hour workshop shift usage

**User Research:**
- Shadow 2-3 technicians for full repair cycle to identify workflow pain points
- Interview workshop manager to understand current quote approval bottleneck specifics
- Survey 5-10 clients to gauge appetite for digital quote portal vs. PDF email
- Observe current paper job card process to identify implicit steps not documented

**Competitive Analysis:**
- Research existing industrial service management platforms (ServiceTitan, FieldEdge)
- Investigate Computer Vision applications in industrial inspection (success stories, limitations)
- Analyze AI report generation tools in adjacent verticals (medical imaging, automotive diagnostics)
- Review PWA performance benchmarks in offline-first industrial applications

**Regulatory & Compliance:**
- Clarify digital signature legal requirements for PO approval (South African e-signature law)
- Confirm GDPR/POPIA data protection obligations for client photo storage
- Validate QCP digital record-keeping acceptability with relevant regulatory bodies
- Research industry standards for equipment repair audit trails

---

## Appendices

### A. Research Summary

**Source Document:** Project Scope: Workshop Intelligence System (Version 1.0, November 2025)

**Key Findings:**
- Current manual process wastes 75 hours/month on report writing alone
- Equipment idle time ("Quote Lag") costs estimated R200K/year in opportunity cost
- Client lack of visibility drives frequent status inquiry calls (unmeasured but significant)
- Paper job card loss occurs ~2 times/month, creating compliance gaps
- First-year ROI projection: R700K+ value vs. R95K+R174K total cost = 2.4 month payback

**Market Validation:**
- No direct competitors offering 11-step Brimis-specific workflow automation
- Generic industrial service platforms lack AI report generation integration
- Computer Vision for defect tagging is emerging but not yet mainstream in repair workflows

**Technology Validation:**
- Next.js 14 + Supabase is proven stack for real-time web applications
- Claude 3.5 Sonnet has demonstrated report writing capabilities in similar use cases
- Google Vision API has >90% accuracy for standard industrial defect categories
- PWA offline-first architecture is mature and production-ready

### B. Competitive Landscape

**Direct Competitors:** None (Brimis 11-step process is proprietary)

**Indirect Competitors:**
1. **ServiceTitan (Industrial Services CRM)**
   - Strength: Comprehensive field service management
   - Weakness: Not specialized for workshop repair workflows, no AI report generation

2. **FieldEdge (Service Management Software)**
   - Strength: Mobile-first design, inventory integration
   - Weakness: Generic workflow, lacks Computer Vision integration

3. **Paper Job Cards (Current Internal System)**
   - Strength: Familiar to technicians, no technology learning curve
   - Weakness: Information silos, no automation, compliance risks

**WIS Differentiation:**
- Only solution purpose-built for Brimis 11-step protocol
- AI-powered report generation (unique capability)
- Computer Vision defect tagging (cutting-edge)
- Client portal with digital PO approval (streamlined quote-to-work flow)

### C. Success Stories & References

**Analogous Use Cases:**
- **Healthcare:** AI-powered radiology report generation (similar technical report automation)
- **Automotive:** Digital inspection apps with photo evidence (similar workflow digitization)
- **Manufacturing:** Computer Vision quality control (similar defect detection application)

**Technology Precedents:**
- **Notion AI:** Demonstrates user acceptance of AI content generation in professional workflows
- **Uber/DoorDash:** Proves mobile-first app adoption in traditionally non-digital worker populations
- **DocuSign:** Validates client acceptance of digital signatures for business approvals

---

## Document Control

**Review & Approval:**
- [ ] Business Analyst (Mary) - Draft Complete
- [ ] Workshop Manager (Client Stakeholder) - Review Required
- [ ] NOVATEK Technical Lead - Feasibility Validation
- [ ] Product Manager (John) - Ready for PRD Creation

**Next Steps:**
1. **Client Review:** Share this brief with workshop manager for feedback (Target: 48-hour turnaround)
2. **Discovery Day:** Schedule Week 1 technician shadowing session
3. **PRD Creation:** Product Manager (John) to create detailed PRD from this brief
4. **Technical Validation:** Conduct Claude/Vision API POC with sample data

**Change Log:**
- v1.0 (November 2025): Initial draft based on Project Scope document

---

**End of Project Brief**
