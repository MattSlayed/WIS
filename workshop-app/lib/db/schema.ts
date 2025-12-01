/**
 * Workshop Intelligence System - Drizzle ORM Schema
 * Database schema for Neon PostgreSQL
 */

import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  decimal,
  integer,
  jsonb,
  uniqueIndex,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// ENUMS
// ============================================================================

export const workflowStepEnum = pgEnum('workflow_step', [
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
  'step_11_dispatch',
]);

export const jobStatusEnum = pgEnum('job_status', [
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
  'cancelled',
]);

export const hazmatLevelEnum = pgEnum('hazmat_level', [
  'none',
  'low',
  'medium',
  'high',
  'extreme',
]);

export const partConditionEnum = pgEnum('part_condition', [
  'good',
  'repairable',
  'replace',
]);

export const userRoleEnum = pgEnum('user_role', [
  'technician',
  'manager',
  'admin',
]);

export const reportStatusEnum = pgEnum('report_status', [
  'draft',
  'final',
  'sent',
]);

export const qcStatusEnum = pgEnum('qc_status', [
  'passed',
  'failed',
  'conditional',
]);

export const notificationTypeEnum = pgEnum('notification_type', [
  'sms',
  'email',
  'in_app',
]);

export const notificationStatusEnum = pgEnum('notification_status', [
  'pending',
  'sent',
  'failed',
]);

// ============================================================================
// TABLES
// ============================================================================

/**
 * Users - Workshop staff (technicians, managers, admins)
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  fullName: text('full_name').notNull(),
  role: userRoleEnum('role').notNull().default('technician'),
  phone: text('phone'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('users_email_idx').on(table.email),
}));

/**
 * Clients - Companies sending equipment for repair
 */
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  company: text('company').notNull(),
  address: text('address'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  companyIdx: index('clients_company_idx').on(table.company),
}));

/**
 * Jobs - Core workflow entity following Brimis 11-step process
 */
export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobNumber: text('job_number').notNull().unique(),
  clientId: uuid('client_id').notNull().references(() => clients.id),

  // Equipment details
  equipmentType: text('equipment_type').notNull(),
  serialNumber: text('serial_number').notNull(),
  manufacturer: text('manufacturer'),
  model: text('model'),
  modelNumber: text('model_number'),

  // Workflow state
  currentStep: workflowStepEnum('current_step').notNull().default('step_1_receiving'),
  status: jobStatusEnum('status').notNull().default('received'),

  // Hazmat information
  hasHazmat: boolean('has_hazmat').default(false).notNull(),
  hazmatLevel: hazmatLevelEnum('hazmat_level'),
  hazmatNotes: text('hazmat_notes'),
  hazmatDetails: text('hazmat_details'),
  hazmatCleaned: boolean('hazmat_cleaned').default(false).notNull(),
  hazmatCleanedAt: timestamp('hazmat_cleaned_at', { withTimezone: true }),
  hazmatCleanedBy: uuid('hazmat_cleaned_by').references(() => users.id),

  // Quote information
  quoteSentAt: timestamp('quote_sent_at', { withTimezone: true }),
  quoteAmount: decimal('quote_amount', { precision: 10, scale: 2 }),
  quoteApprovedAt: timestamp('quote_approved_at', { withTimezone: true }),
  poNumber: text('po_number'),
  poReceivedAt: timestamp('po_received_at', { withTimezone: true }),

  // Assignment
  assignedTechnicianId: uuid('assigned_technician_id').references(() => users.id),

  // QR Code
  qrCodeUrl: text('qr_code_url'),

  // Notes
  receivingNotes: text('receiving_notes'),

  // Timestamps
  receivedAt: timestamp('received_at', { withTimezone: true }).defaultNow().notNull(),
  targetCompletionDate: timestamp('target_completion_date', { withTimezone: true }),
  actualCompletionDate: timestamp('actual_completion_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  jobNumberIdx: uniqueIndex('jobs_job_number_idx').on(table.jobNumber),
  clientIdx: index('jobs_client_id_idx').on(table.clientId),
  statusIdx: index('jobs_status_idx').on(table.status),
  currentStepIdx: index('jobs_current_step_idx').on(table.currentStep),
  assignedTechIdx: index('jobs_assigned_technician_idx').on(table.assignedTechnicianId),
  createdAtIdx: index('jobs_created_at_idx').on(table.createdAt),
}));

/**
 * Job Parts - Components and parts associated with jobs
 */
export const jobParts = pgTable('job_parts', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  partName: text('part_name').notNull(),
  partNumber: text('part_number'),
  quantity: integer('quantity').notNull().default(1),
  condition: partConditionEnum('condition').notNull().default('good'),
  defects: text('defects').array().default([]),
  defectNotes: text('defect_notes'),
  cost: decimal('cost', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  jobIdx: index('job_parts_job_id_idx').on(table.jobId),
}));

/**
 * Job Photos - Images captured during workflow steps
 */
export const jobPhotos = pgTable('job_photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  step: workflowStepEnum('step'),
  stepNumber: integer('step_number'),
  url: text('url'),
  imageUrl: text('image_url'),
  thumbnailUrl: text('thumbnail_url'),
  caption: text('caption'),
  takenAt: timestamp('taken_at', { withTimezone: true }),
  aiAnalysis: jsonb('ai_analysis'),
  uploadedBy: uuid('uploaded_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  jobIdx: index('job_photos_job_id_idx').on(table.jobId),
  stepIdx: index('job_photos_step_idx').on(table.step),
}));

/**
 * Step Completions - Tracks progress through workflow steps
 */
export const stepCompletions = pgTable('step_completions', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  step: workflowStepEnum('step').notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow().notNull(),
  completedBy: uuid('completed_by').notNull().references(() => users.id),
  notes: text('notes'),
  measurements: jsonb('measurements'),
  checklistData: jsonb('checklist_data'),
}, (table) => ({
  jobIdx: index('step_completions_job_id_idx').on(table.jobId),
  jobStepUnique: uniqueIndex('step_completions_job_step_unique').on(table.jobId, table.step),
}));

/**
 * Technical Reports - AI-generated repair reports
 */
export const technicalReports = pgTable('technical_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }).unique(),

  // Report content
  executiveSummary: text('executive_summary'),
  findings: text('findings'),
  recommendations: text('recommendations'),

  // AI generated
  aiGenerated: boolean('ai_generated').default(false).notNull(),
  aiDraft: text('ai_draft'),

  // PDF
  pdfUrl: text('pdf_url'),

  // Status
  status: reportStatusEnum('status').notNull().default('draft'),
  sentAt: timestamp('sent_at', { withTimezone: true }),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  jobIdx: uniqueIndex('technical_reports_job_id_idx').on(table.jobId),
}));

/**
 * Magic Links - Secure client portal access tokens
 */
export const magicLinks = pgTable('magic_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  token: text('token').notNull().unique(),
  jobId: uuid('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  clientEmail: text('client_email').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  tokenIdx: uniqueIndex('magic_links_token_idx').on(table.token),
  jobIdx: index('magic_links_job_id_idx').on(table.jobId),
}));

/**
 * Digital Signatures - Client quote approvals
 */
export const digitalSignatures = pgTable('digital_signatures', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  magicLinkId: uuid('magic_link_id').notNull().references(() => magicLinks.id),
  signatureData: text('signature_data').notNull(), // Base64 encoded
  signerName: text('signer_name').notNull(),
  signerEmail: text('signer_email').notNull(),
  signedAt: timestamp('signed_at', { withTimezone: true }).defaultNow().notNull(),
  ipAddress: text('ip_address').notNull(),
}, (table) => ({
  jobIdx: index('digital_signatures_job_id_idx').on(table.jobId),
}));

/**
 * QC Inspections - Quality control records
 */
export const qcInspections = pgTable('qc_inspections', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  inspectorId: uuid('inspector_id').notNull().references(() => users.id),

  // Measurements
  measurements: jsonb('measurements').notNull(),

  // Checklist
  visualInspectionPassed: boolean('visual_inspection_passed').notNull(),
  functionTestPassed: boolean('function_test_passed').notNull(),
  leakTestPassed: boolean('leak_test_passed').notNull(),
  documentationComplete: boolean('documentation_complete').notNull(),

  // Results
  overallStatus: qcStatusEnum('overall_status').notNull(),
  notes: text('notes'),
  failedItems: text('failed_items').array().default([]),

  inspectedAt: timestamp('inspected_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  jobIdx: index('qc_inspections_job_id_idx').on(table.jobId),
  inspectorIdx: index('qc_inspections_inspector_id_idx').on(table.inspectorId),
}));

/**
 * Notifications - SMS, email, and in-app notifications
 */
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  email: text('email'),
  phone: text('phone'),
  type: notificationTypeEnum('type').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: notificationStatusEnum('status').notNull().default('pending'),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdx: index('notifications_user_id_idx').on(table.userId),
  statusIdx: index('notifications_status_idx').on(table.status),
}));

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  assignedJobs: many(jobs, { relationName: 'assignedTechnician' }),
  uploadedPhotos: many(jobPhotos),
  completedSteps: many(stepCompletions),
  qcInspections: many(qcInspections),
  notifications: many(notifications),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  client: one(clients, {
    fields: [jobs.clientId],
    references: [clients.id],
  }),
  assignedTechnician: one(users, {
    fields: [jobs.assignedTechnicianId],
    references: [users.id],
    relationName: 'assignedTechnician',
  }),
  hazmatCleanedByUser: one(users, {
    fields: [jobs.hazmatCleanedBy],
    references: [users.id],
  }),
  parts: many(jobParts),
  photos: many(jobPhotos),
  stepCompletions: many(stepCompletions),
  technicalReport: one(technicalReports),
  magicLinks: many(magicLinks),
  digitalSignatures: many(digitalSignatures),
  qcInspections: many(qcInspections),
}));

export const jobPartsRelations = relations(jobParts, ({ one }) => ({
  job: one(jobs, {
    fields: [jobParts.jobId],
    references: [jobs.id],
  }),
}));

export const jobPhotosRelations = relations(jobPhotos, ({ one }) => ({
  job: one(jobs, {
    fields: [jobPhotos.jobId],
    references: [jobs.id],
  }),
  uploadedByUser: one(users, {
    fields: [jobPhotos.uploadedBy],
    references: [users.id],
  }),
}));

export const stepCompletionsRelations = relations(stepCompletions, ({ one }) => ({
  job: one(jobs, {
    fields: [stepCompletions.jobId],
    references: [jobs.id],
  }),
  completedByUser: one(users, {
    fields: [stepCompletions.completedBy],
    references: [users.id],
  }),
}));

export const technicalReportsRelations = relations(technicalReports, ({ one }) => ({
  job: one(jobs, {
    fields: [technicalReports.jobId],
    references: [jobs.id],
  }),
}));

export const magicLinksRelations = relations(magicLinks, ({ one, many }) => ({
  job: one(jobs, {
    fields: [magicLinks.jobId],
    references: [jobs.id],
  }),
  digitalSignatures: many(digitalSignatures),
}));

export const digitalSignaturesRelations = relations(digitalSignatures, ({ one }) => ({
  job: one(jobs, {
    fields: [digitalSignatures.jobId],
    references: [jobs.id],
  }),
  magicLink: one(magicLinks, {
    fields: [digitalSignatures.magicLinkId],
    references: [magicLinks.id],
  }),
}));

export const qcInspectionsRelations = relations(qcInspections, ({ one }) => ({
  job: one(jobs, {
    fields: [qcInspections.jobId],
    references: [jobs.id],
  }),
  inspector: one(users, {
    fields: [qcInspections.inspectorId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

export type JobPart = typeof jobParts.$inferSelect;
export type NewJobPart = typeof jobParts.$inferInsert;

export type JobPhoto = typeof jobPhotos.$inferSelect;
export type NewJobPhoto = typeof jobPhotos.$inferInsert;

export type StepCompletion = typeof stepCompletions.$inferSelect;
export type NewStepCompletion = typeof stepCompletions.$inferInsert;

export type TechnicalReport = typeof technicalReports.$inferSelect;
export type NewTechnicalReport = typeof technicalReports.$inferInsert;

export type MagicLink = typeof magicLinks.$inferSelect;
export type NewMagicLink = typeof magicLinks.$inferInsert;

export type DigitalSignature = typeof digitalSignatures.$inferSelect;
export type NewDigitalSignature = typeof digitalSignatures.$inferInsert;

export type QcInspection = typeof qcInspections.$inferSelect;
export type NewQcInspection = typeof qcInspections.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
