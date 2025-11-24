/**
 * Workshop Intelligence System - Core Type Definitions
 * Based on the Brimis 11-Step Process
 */

export type WorkflowStep =
  | 'step_1_receiving'
  | 'step_2_logging'
  | 'step_3_strip_assess'
  | 'step_4_document_faults'
  | 'step_5_technical_report'
  | 'step_6_await_po'
  | 'step_7_repair'
  | 'step_8_reassemble'
  | 'step_9_function_test'
  | 'step_10_qc_inspection'
  | 'step_11_dispatch';

export type JobStatus =
  | 'received'
  | 'logged'
  | 'stripped'
  | 'assessed'
  | 'awaiting_quote_approval'
  | 'po_received'
  | 'in_repair'
  | 'assembled'
  | 'tested'
  | 'qc_passed'
  | 'ready_for_dispatch'
  | 'dispatched'
  | 'on_hold'
  | 'cancelled';

export type DefectType =
  | 'corrosion'
  | 'crack'
  | 'wear'
  | 'pitting'
  | 'deformation'
  | 'seal_failure'
  | 'bearing_failure'
  | 'thread_damage'
  | 'surface_damage'
  | 'other';

export type HazmatLevel = 'none' | 'low' | 'medium' | 'high' | 'extreme';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  job_number: string; // e.g., BRIM-2025-001
  client_id: string;
  client?: Client;

  // Equipment Details
  equipment_type: string;
  serial_number: string;
  manufacturer?: string;
  model?: string;
  model_number?: string;

  // Workflow State
  current_step: WorkflowStep;
  status: JobStatus;

  // Hazmat Information
  has_hazmat: boolean;
  hazmat_level?: HazmatLevel;
  hazmat_notes?: string;
  hazmat_details?: string;
  hazmat_cleaned: boolean;
  hazmat_cleaned_at?: string;
  hazmat_cleaned_by?: string;

  // Quote Information
  quote_sent_at?: string;
  quote_amount?: number;
  quote_approved_at?: string;
  po_number?: string;
  po_received_at?: string;

  // Assignment
  assigned_technician_id?: string;
  assigned_technician?: User;

  // QR Code
  qr_code_url?: string;

  // Notes
  receiving_notes?: string;

  // Timestamps
  received_at: string;
  target_completion_date?: string;
  actual_completion_date?: string;
  created_at: string;
  updated_at: string;
}

export interface JobPart {
  id: string;
  job_id: string;
  part_name: string;
  part_number?: string;
  quantity: number;
  condition: 'good' | 'repairable' | 'replace';
  defects: DefectType[];
  defect_notes?: string;
  cost?: number;
  created_at: string;
  updated_at: string;
}

export interface JobPhoto {
  id: string;
  job_id: string;
  step?: WorkflowStep;
  step_number?: number;
  url?: string;
  image_url?: string;
  thumbnail_url?: string;
  caption?: string;
  taken_at?: string;
  ai_analysis?: AIAnalysisResult;
  uploaded_by: string;
  created_at: string;
}

export interface AIAnalysisResult {
  detected_defects: DefectType[];
  confidence_scores: Record<DefectType, number>;
  suggested_labels: string[];
  raw_analysis: string;
}

export interface StepCompletion {
  id: string;
  job_id: string;
  step: WorkflowStep;
  completed_at: string;
  completed_by: string;
  completed_by_user?: User;
  notes?: string;
  measurements?: Record<string, number>;
  checklist_data?: Record<string, boolean>;
}

export interface TechnicalReport {
  id: string;
  job_id: string;
  job?: Job;

  // Report Content
  executive_summary: string;
  findings: string;
  recommendations: string;
  parts_list: JobPart[];
  photos: JobPhoto[];

  // AI Generated
  ai_generated: boolean;
  ai_draft?: string;

  // PDF
  pdf_url?: string;

  // Status
  status: 'draft' | 'final' | 'sent';
  sent_at?: string;

  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'technician' | 'manager' | 'admin';
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface MagicLink {
  id: string;
  token: string;
  job_id: string;
  client_email: string;
  expires_at: string;
  used_at?: string;
  created_at: string;
}

export interface DigitalSignature {
  id: string;
  job_id: string;
  magic_link_id: string;
  signature_data: string; // Base64 encoded signature
  signer_name: string;
  signer_email: string;
  signed_at: string;
  ip_address: string;
}

export interface QCInspection {
  id: string;
  job_id: string;
  inspector_id: string;
  inspector?: User;

  // Measurements
  measurements: Record<string, number>;

  // Checklist
  visual_inspection_passed: boolean;
  function_test_passed: boolean;
  leak_test_passed: boolean;
  documentation_complete: boolean;

  // Results
  overall_status: 'passed' | 'failed' | 'conditional';
  notes?: string;
  failed_items?: string[];

  inspected_at: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id?: string;
  email?: string;
  phone?: string;
  type: 'sms' | 'email' | 'in_app';
  subject: string;
  message: string;
  status: 'pending' | 'sent' | 'failed';
  sent_at?: string;
  error_message?: string;
  created_at: string;
}

// Step Configuration
export interface StepConfig {
  id: WorkflowStep;
  number: number;
  title: string;
  description: string;
  requires_photos: boolean;
  requires_checklist: boolean;
  requires_measurements: boolean;
  requires_hazmat_clearance: boolean;
  requires_po_approval: boolean;
  can_go_back: boolean;
  next_step?: WorkflowStep;
}

export const WORKFLOW_STEPS: Record<WorkflowStep, StepConfig> = {
  step_1_receiving: {
    id: 'step_1_receiving',
    number: 1,
    title: 'Receiving',
    description: 'Log equipment arrival and create job',
    requires_photos: true,
    requires_checklist: false,
    requires_measurements: false,
    requires_hazmat_clearance: false,
    requires_po_approval: false,
    can_go_back: false,
    next_step: 'step_2_logging',
  },
  step_2_logging: {
    id: 'step_2_logging',
    number: 2,
    title: 'Logging & Hazmat Check',
    description: 'Record equipment details and check for hazardous materials',
    requires_photos: false,
    requires_checklist: true,
    requires_measurements: false,
    requires_hazmat_clearance: true,
    requires_po_approval: false,
    can_go_back: true,
    next_step: 'step_3_strip_assess',
  },
  step_3_strip_assess: {
    id: 'step_3_strip_assess',
    number: 3,
    title: 'Strip & Assess',
    description: 'Dismantle equipment and photograph components',
    requires_photos: true,
    requires_checklist: false,
    requires_measurements: false,
    requires_hazmat_clearance: false,
    requires_po_approval: false,
    can_go_back: true,
    next_step: 'step_4_document_faults',
  },
  step_4_document_faults: {
    id: 'step_4_document_faults',
    number: 4,
    title: 'Document Faults',
    description: 'Record all defects and create parts list',
    requires_photos: true,
    requires_checklist: false,
    requires_measurements: false,
    requires_hazmat_clearance: false,
    requires_po_approval: false,
    can_go_back: true,
    next_step: 'step_5_technical_report',
  },
  step_5_technical_report: {
    id: 'step_5_technical_report',
    number: 5,
    title: 'Generate Technical Report',
    description: 'AI-powered report generation for client quote',
    requires_photos: false,
    requires_checklist: false,
    requires_measurements: false,
    requires_hazmat_clearance: false,
    requires_po_approval: false,
    can_go_back: true,
    next_step: 'step_6_await_po',
  },
  step_6_await_po: {
    id: 'step_6_await_po',
    number: 6,
    title: 'Await Purchase Order',
    description: 'Wait for client approval and PO',
    requires_photos: false,
    requires_checklist: false,
    requires_measurements: false,
    requires_hazmat_clearance: false,
    requires_po_approval: true,
    can_go_back: false,
    next_step: 'step_7_repair',
  },
  step_7_repair: {
    id: 'step_7_repair',
    number: 7,
    title: 'Repair',
    description: 'Execute repairs and replace parts',
    requires_photos: true,
    requires_checklist: true,
    requires_measurements: true,
    requires_hazmat_clearance: false,
    requires_po_approval: false,
    can_go_back: false,
    next_step: 'step_8_reassemble',
  },
  step_8_reassemble: {
    id: 'step_8_reassemble',
    number: 8,
    title: 'Reassemble',
    description: 'Reassemble equipment using strip photos as reference',
    requires_photos: true,
    requires_checklist: true,
    requires_measurements: false,
    requires_hazmat_clearance: false,
    requires_po_approval: false,
    can_go_back: true,
    next_step: 'step_9_function_test',
  },
  step_9_function_test: {
    id: 'step_9_function_test',
    number: 9,
    title: 'Function Test',
    description: 'Test equipment operation and performance',
    requires_photos: true,
    requires_checklist: true,
    requires_measurements: true,
    requires_hazmat_clearance: false,
    requires_po_approval: false,
    can_go_back: true,
    next_step: 'step_10_qc_inspection',
  },
  step_10_qc_inspection: {
    id: 'step_10_qc_inspection',
    number: 10,
    title: 'QC Inspection',
    description: 'Quality control inspection and measurements',
    requires_photos: true,
    requires_checklist: true,
    requires_measurements: true,
    requires_hazmat_clearance: false,
    requires_po_approval: false,
    can_go_back: false,
    next_step: 'step_11_dispatch',
  },
  step_11_dispatch: {
    id: 'step_11_dispatch',
    number: 11,
    title: 'Dispatch',
    description: 'Package and prepare for delivery',
    requires_photos: true,
    requires_checklist: true,
    requires_measurements: false,
    requires_hazmat_clearance: false,
    requires_po_approval: false,
    can_go_back: false,
  },
};
