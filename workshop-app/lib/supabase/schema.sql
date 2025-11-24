-- Workshop Intelligence System Database Schema
-- Supabase PostgreSQL Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('technician', 'manager', 'admin')),
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table (Core workflow entity)
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_number TEXT UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id),

  -- Equipment details
  equipment_type TEXT NOT NULL,
  serial_number TEXT NOT NULL,
  manufacturer TEXT,
  model TEXT,

  -- Workflow state
  current_step TEXT NOT NULL CHECK (current_step IN (
    'step_1_receiving',
    'step_2_logging',
    'step_3_strip_assess',
    'step_4_document_faults',
    'step_5_technical_report',
    'step_6_await_po',
    'step_7_repair',
    'step_8_reassemble',
    'step_9_function_test',
    'step_10_qc_inspection',
    'step_11_dispatch'
  )),
  status TEXT NOT NULL CHECK (status IN (
    'received',
    'logged',
    'stripped',
    'assessed',
    'awaiting_quote_approval',
    'po_received',
    'in_repair',
    'assembled',
    'tested',
    'qc_passed',
    'ready_for_dispatch',
    'dispatched',
    'on_hold',
    'cancelled'
  )),

  -- Hazmat information
  has_hazmat BOOLEAN DEFAULT FALSE,
  hazmat_level TEXT CHECK (hazmat_level IN ('none', 'low', 'medium', 'high', 'extreme')),
  hazmat_notes TEXT,
  hazmat_cleaned BOOLEAN DEFAULT FALSE,
  hazmat_cleaned_at TIMESTAMPTZ,
  hazmat_cleaned_by UUID REFERENCES public.users(id),

  -- Quote information
  quote_sent_at TIMESTAMPTZ,
  quote_amount DECIMAL(10, 2),
  quote_approved_at TIMESTAMPTZ,
  po_number TEXT,
  po_received_at TIMESTAMPTZ,

  -- Assignment
  assigned_technician_id UUID REFERENCES public.users(id),

  -- QR Code
  qr_code_url TEXT,

  -- Timestamps
  received_at TIMESTAMPTZ DEFAULT NOW(),
  target_completion_date TIMESTAMPTZ,
  actual_completion_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job parts table
CREATE TABLE public.job_parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  part_name TEXT NOT NULL,
  part_number TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  condition TEXT NOT NULL CHECK (condition IN ('good', 'repairable', 'replace')),
  defects TEXT[] DEFAULT '{}',
  defect_notes TEXT,
  cost DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job photos table
CREATE TABLE public.job_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  step TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  ai_analysis JSONB,
  uploaded_by UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step completions table
CREATE TABLE public.step_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  step TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  completed_by UUID NOT NULL REFERENCES public.users(id),
  notes TEXT,
  measurements JSONB,
  checklist_data JSONB,
  UNIQUE(job_id, step)
);

-- Technical reports table
CREATE TABLE public.technical_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,

  -- Report content
  executive_summary TEXT,
  findings TEXT,
  recommendations TEXT,

  -- AI generated
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_draft TEXT,

  -- PDF
  pdf_url TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'final', 'sent')),
  sent_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id)
);

-- Magic links table (for client portal access)
CREATE TABLE public.magic_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  client_email TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Digital signatures table
CREATE TABLE public.digital_signatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  magic_link_id UUID NOT NULL REFERENCES public.magic_links(id),
  signature_data TEXT NOT NULL,
  signer_name TEXT NOT NULL,
  signer_email TEXT NOT NULL,
  signed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT NOT NULL
);

-- QC inspections table
CREATE TABLE public.qc_inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  inspector_id UUID NOT NULL REFERENCES public.users(id),

  -- Measurements
  measurements JSONB NOT NULL,

  -- Checklist
  visual_inspection_passed BOOLEAN NOT NULL,
  function_test_passed BOOLEAN NOT NULL,
  leak_test_passed BOOLEAN NOT NULL,
  documentation_complete BOOLEAN NOT NULL,

  -- Results
  overall_status TEXT NOT NULL CHECK (overall_status IN ('passed', 'failed', 'conditional')),
  notes TEXT,
  failed_items TEXT[],

  inspected_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  email TEXT,
  phone TEXT,
  type TEXT NOT NULL CHECK (type IN ('sms', 'email', 'in_app')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_jobs_client_id ON public.jobs(client_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_current_step ON public.jobs(current_step);
CREATE INDEX idx_jobs_assigned_technician ON public.jobs(assigned_technician_id);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX idx_job_parts_job_id ON public.job_parts(job_id);
CREATE INDEX idx_job_photos_job_id ON public.job_photos(job_id);
CREATE INDEX idx_step_completions_job_id ON public.step_completions(job_id);
CREATE INDEX idx_magic_links_token ON public.magic_links(token);
CREATE INDEX idx_magic_links_job_id ON public.magic_links(job_id);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.step_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magic_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qc_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- All authenticated users can read clients
CREATE POLICY "Authenticated users can read clients" ON public.clients
  FOR SELECT USING (auth.role() = 'authenticated');

-- Managers and admins can manage clients
CREATE POLICY "Managers can manage clients" ON public.clients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

-- All authenticated users can read jobs
CREATE POLICY "Authenticated users can read jobs" ON public.jobs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Technicians can update jobs assigned to them
CREATE POLICY "Technicians can update assigned jobs" ON public.jobs
  FOR UPDATE USING (
    assigned_technician_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

-- Managers and admins can manage all jobs
CREATE POLICY "Managers can manage jobs" ON public.jobs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

-- Similar policies for related tables...
CREATE POLICY "Users can read related job data" ON public.job_parts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage job parts" ON public.job_parts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = job_parts.job_id
      AND (jobs.assigned_technician_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.users
          WHERE users.id = auth.uid()
          AND users.role IN ('manager', 'admin')
        )
      )
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_parts_updated_at BEFORE UPDATE ON public.job_parts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technical_reports_updated_at BEFORE UPDATE ON public.technical_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate job numbers
CREATE OR REPLACE FUNCTION generate_job_number()
RETURNS TEXT AS $$
DECLARE
  year TEXT;
  seq INTEGER;
  job_num TEXT;
BEGIN
  year := TO_CHAR(CURRENT_DATE, 'YYYY');

  SELECT COALESCE(MAX(CAST(SUBSTRING(job_number FROM 'BRIM-' || year || '-(.*)') AS INTEGER)), 0) + 1
  INTO seq
  FROM public.jobs
  WHERE job_number LIKE 'BRIM-' || year || '-%';

  job_num := 'BRIM-' || year || '-' || LPAD(seq::TEXT, 3, '0');

  RETURN job_num;
END;
$$ LANGUAGE plpgsql;
