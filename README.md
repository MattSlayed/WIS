# Workshop Intelligence System (WIS)

AI-powered workflow automation platform for the **Brimis 11-Step Service Excellence Process**.

## 🎯 Project Overview

The Workshop Intelligence System digitizes and optimizes industrial workshop operations by:

- **Enforcing the 11-Step Workflow** with strict step-gating logic
- **AI-Powered Report Generation** using Anthropic Claude 3.5 Sonnet
- **Automated Defect Detection** via Google Cloud Vision API
- **Real-Time Client Portal** with digital signatures and instant PO approval
- **Tablet-First Interface** optimized for workshop floor technicians
- **Offline PWA Capability** for uninterrupted workshop operations

## 🏗️ Architecture

```
workshop-app/
├── app/                      # Next.js 14 App Router
│   ├── technician/          # Tablet Interface for Technicians
│   │   ├── step/[id]/       # Dynamic Step Wizard
│   │   └── camera/          # Camera View
│   ├── manager/             # Desktop Dashboard
│   │   ├── dashboard/       # Kanban Board
│   │   └── quotes/          # Quote Approval
│   └── client/              # Public Client Portal
│       └── quote/[token]/   # Magic Link Access
├── lib/
│   ├── workflow-engine.ts   # 11-Step State Machine
│   ├── ai-report.ts         # Claude Integration
│   ├── ai-vision.ts         # Google Vision Integration
│   └── supabase/            # Database Client
├── types/
│   └── index.ts             # TypeScript Definitions
└── components/              # Reusable UI Components
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Supabase account
- Anthropic API key (Claude)
- Google Cloud account with Vision API enabled
- Google Cloud Storage bucket

### Installation

1. **Clone and install dependencies:**

```bash
cd workshop-app
npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env
```

Edit `.env` with your API keys and configuration.

3. **Set up Supabase database:**

- Create a new Supabase project
- Run the SQL schema from `lib/supabase/schema.sql` in the Supabase SQL Editor
- Copy your Supabase URL and keys to `.env`

4. **Configure Google Cloud:**

- Enable Vision API in Google Cloud Console
- Create a service account and download credentials JSON
- Save credentials as `google-credentials.json` in the project root
- Create a Cloud Storage bucket for image storage

5. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Core Features

### 1. 11-Step Workflow Engine

The system enforces the Brimis 11-step process with **step-gating logic**:

1. **Receiving** - Equipment intake and QR code generation
2. **Logging & Hazmat Check** - Mandatory hazmat clearance if required
3. **Strip & Assess** - Photographic documentation of disassembly
4. **Document Faults** - AI-assisted defect cataloging
5. **Technical Report** - Automated report generation via Claude AI
6. **Await PO** - **CRITICAL GATE**: Repair button locked until client approves
7. **Repair** - Execute repairs with measurement tracking
8. **Reassemble** - Reference strip photos for correct assembly
9. **Function Test** - Performance validation
10. **QC Inspection** - Quality control checkpoint
11. **Dispatch** - Final packaging and delivery

### 2. AI-Powered Features

**Anthropic Claude 3.5 Sonnet:**
- Converts technician bullet points into professional technical reports
- Generates executive summaries, findings, and recommendations
- Creates client-friendly quote summaries

**Google Cloud Vision API:**
- Automatically detects defects in equipment photos
- Suggests labels (corrosion, cracks, wear, pitting, etc.)
- Confidence scoring for each detected defect

### 3. Real-Time Client Portal

- **Magic Link Access**: Clients receive secure, time-limited links via email/SMS
- **Digital Signatures**: Sign quotes directly on mobile devices
- **Live Tracking**: View equipment status in real-time
- **Instant PO Submission**: Approve quotes and unblock Step 6 immediately

### 4. Offline-First PWA

- Works offline on workshop floor
- Syncs data when connection is restored
- Installable on tablets and mobile devices
- Native app-like experience

## 📱 User Workflows

### Technician Workflow

1. Scan QR code on equipment
2. Progress through steps 1-11 sequentially
3. Take photos and add notes at each step
4. AI suggests defect labels based on photos
5. System prevents skipping steps or proceeding without required data
6. Repair button remains locked until PO received

### Manager Workflow

1. Review AI-generated technical reports
2. Add pricing from inventory
3. Send quote link to client
4. Monitor dashboard for PO approvals
5. Track job progress across all technicians

### Client Workflow

1. Receive SMS/Email with quote link
2. View photos of equipment damage
3. Review technical report and pricing
4. Sign digitally to approve
5. System instantly notifies technician to proceed

## 🗄️ Database Schema

Key tables:
- `jobs` - Core job tracking with workflow state
- `job_parts` - Parts inventory and defects
- `job_photos` - Photo evidence with AI analysis
- `step_completions` - Audit trail of step progression
- `technical_reports` - AI-generated reports
- `magic_links` - Client portal authentication
- `digital_signatures` - PO approvals
- `qc_inspections` - Quality control records

## 🔐 Security

- Row-Level Security (RLS) policies in Supabase
- Magic link expiration and single-use tokens
- IP address logging for digital signatures
- Role-based access control (Technician, Manager, Admin)
- Secure file storage with signed URLs

## 📊 Success Metrics

- **Quote Speed**: Reduce time-to-quote by 70%
- **Compliance**: 100% digital QCP completion
- **Revenue**: Increase throughput by 15%
- **Client Experience**: Real-time status tracking
- **ROI**: <2.5 month payback period

## 🛠️ Development

```bash
# Development
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Production build
npm run build
npm run start
```

## 📦 Deployment

### Option A: Vercel (Recommended)

```bash
vercel deploy
```

### Option B: Self-Hosted

```bash
npm run build
# Deploy `out/` directory to your server
```

## 🤝 Contributing

This project is developed by **NOVATEK LLC** for Brimis Engineering.

## 📄 License

Proprietary - All Rights Reserved

## 📞 Support

Contact: matthew@novatek.co.za
Website: www.novatek.co.za

---

**Built with:** Next.js 14, TypeScript, Supabase, Anthropic Claude, Google Cloud Vision
