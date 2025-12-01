'use server';

/**
 * Server Actions for Workflow Operations
 * Type-safe server mutations for the Brimis 11-step process
 */

import { db } from '@/lib/db';
import {
  jobs,
  stepCompletions,
  technicalReports,
  qcInspections,
  users,
  NewStepCompletion,
  NewTechnicalReport,
  NewQcInspection,
} from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// ============================================================================
// CONSTANTS
// ============================================================================

const WORKFLOW_STEPS = [
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
] as const;

type WorkflowStep = (typeof WORKFLOW_STEPS)[number];

const STEP_STATUS_MAP: Record<WorkflowStep, string> = {
  step_1_receiving: 'received',
  step_2_logging: 'logged',
  step_3_strip_assess: 'stripped',
  step_4_document_faults: 'assessed',
  step_5_technical_report: 'awaiting_quote_approval',
  step_6_await_po: 'po_received',
  step_7_repair: 'in_repair',
  step_8_reassemble: 'assembled',
  step_9_function_test: 'tested',
  step_10_qc_inspection: 'qc_passed',
  step_11_dispatch: 'dispatched',
};

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const completeStepSchema = z.object({
  jobId: z.string().uuid(),
  step: z.enum(WORKFLOW_STEPS),
  completedBy: z.string().uuid(),
  notes: z.string().optional(),
  measurements: z.record(z.number()).optional(),
  checklistData: z.record(z.boolean()).optional(),
});

const createReportSchema = z.object({
  jobId: z.string().uuid(),
  executiveSummary: z.string().optional(),
  findings: z.string().optional(),
  recommendations: z.string().optional(),
  aiGenerated: z.boolean().default(false),
  aiDraft: z.string().optional(),
});

const qcInspectionSchema = z.object({
  jobId: z.string().uuid(),
  inspectorId: z.string().uuid(),
  measurements: z.record(z.number()),
  visualInspectionPassed: z.boolean(),
  functionTestPassed: z.boolean(),
  leakTestPassed: z.boolean(),
  documentationComplete: z.boolean(),
  overallStatus: z.enum(['passed', 'failed', 'conditional']),
  notes: z.string().optional(),
  failedItems: z.array(z.string()).optional(),
});

// ============================================================================
// STEP COMPLETION ACTIONS
// ============================================================================

/**
 * Complete a workflow step
 */
export async function completeStep(data: z.infer<typeof completeStepSchema>) {
  try {
    const validatedData = completeStepSchema.parse(data);

    // Get current job state
    const [job] = await db
      .select({ id: jobs.id, currentStep: jobs.currentStep, status: jobs.status })
      .from(jobs)
      .where(eq(jobs.id, validatedData.jobId))
      .limit(1);

    if (!job) {
      return { success: false, error: 'Job not found' };
    }

    // Validate step progression
    const currentIndex = WORKFLOW_STEPS.indexOf(job.currentStep);
    const targetIndex = WORKFLOW_STEPS.indexOf(validatedData.step);

    if (targetIndex > currentIndex + 1) {
      return {
        success: false,
        error: 'Cannot skip steps. Complete the current step first.',
      };
    }

    // Check for existing completion
    const [existingCompletion] = await db
      .select({ id: stepCompletions.id })
      .from(stepCompletions)
      .where(
        and(
          eq(stepCompletions.jobId, validatedData.jobId),
          eq(stepCompletions.step, validatedData.step)
        )
      )
      .limit(1);

    if (existingCompletion) {
      // Update existing
      await db
        .update(stepCompletions)
        .set({
          completedAt: new Date(),
          completedBy: validatedData.completedBy,
          notes: validatedData.notes,
          measurements: validatedData.measurements,
          checklistData: validatedData.checklistData,
        })
        .where(eq(stepCompletions.id, existingCompletion.id));
    } else {
      // Create new completion
      await db.insert(stepCompletions).values({
        jobId: validatedData.jobId,
        step: validatedData.step,
        completedBy: validatedData.completedBy,
        notes: validatedData.notes,
        measurements: validatedData.measurements,
        checklistData: validatedData.checklistData,
      } satisfies NewStepCompletion);
    }

    // Determine next step
    const nextStepIndex = targetIndex + 1;
    const nextStep =
      nextStepIndex < WORKFLOW_STEPS.length
        ? WORKFLOW_STEPS[nextStepIndex]
        : validatedData.step;

    // Update job
    const newStatus = STEP_STATUS_MAP[validatedData.step];
    const [updatedJob] = await db
      .update(jobs)
      .set({
        currentStep: targetIndex >= currentIndex ? nextStep : job.currentStep,
        status: newStatus as typeof job.status,
        updatedAt: new Date(),
        ...(validatedData.step === 'step_11_dispatch' && {
          actualCompletionDate: new Date(),
        }),
      })
      .where(eq(jobs.id, validatedData.jobId))
      .returning();

    revalidatePath('/technician');
    revalidatePath(`/technician/jobs/${validatedData.jobId}`);

    return {
      success: true,
      job: updatedJob,
      completedStep: validatedData.step,
      nextStep: nextStepIndex < WORKFLOW_STEPS.length ? WORKFLOW_STEPS[nextStepIndex] : null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation error', details: error.errors };
    }
    console.error('Error completing step:', error);
    return { success: false, error: 'Failed to complete step' };
  }
}

/**
 * Get workflow progress for a job
 */
export async function getWorkflowProgress(jobId: string) {
  try {
    const [job] = await db
      .select({ currentStep: jobs.currentStep, status: jobs.status })
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!job) {
      return { success: false, error: 'Job not found' };
    }

    // Get all completions with user info
    const completions = await db
      .select({
        id: stepCompletions.id,
        step: stepCompletions.step,
        completedAt: stepCompletions.completedAt,
        notes: stepCompletions.notes,
        measurements: stepCompletions.measurements,
        checklistData: stepCompletions.checklistData,
        completedBy: {
          id: users.id,
          fullName: users.fullName,
        },
      })
      .from(stepCompletions)
      .leftJoin(users, eq(stepCompletions.completedBy, users.id))
      .where(eq(stepCompletions.jobId, jobId));

    const completedSteps = new Set(completions.map((c) => c.step));
    const currentStepIndex = WORKFLOW_STEPS.indexOf(job.currentStep);

    const steps = WORKFLOW_STEPS.map((step, index) => ({
      step,
      stepNumber: index + 1,
      title: getStepTitle(step),
      isCompleted: completedSteps.has(step),
      isCurrent: step === job.currentStep,
      isLocked: index > currentStepIndex && !completedSteps.has(step),
      completion: completions.find((c) => c.step === step) || null,
    }));

    const progress = Math.round((completedSteps.size / WORKFLOW_STEPS.length) * 100);

    return {
      success: true,
      currentStep: job.currentStep,
      status: job.status,
      steps,
      progress,
      completedCount: completedSteps.size,
      totalSteps: WORKFLOW_STEPS.length,
    };
  } catch (error) {
    console.error('Error fetching workflow progress:', error);
    return { success: false, error: 'Failed to fetch workflow progress' };
  }
}

/**
 * Move job to specific step (admin/manager function)
 */
export async function moveToStep(jobId: string, step: WorkflowStep, userId: string) {
  try {
    const targetIndex = WORKFLOW_STEPS.indexOf(step);
    const newStatus = STEP_STATUS_MAP[step];

    const [updatedJob] = await db
      .update(jobs)
      .set({
        currentStep: step,
        status: newStatus as typeof jobs.status.enumValues[number],
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, jobId))
      .returning();

    if (!updatedJob) {
      return { success: false, error: 'Job not found' };
    }

    revalidatePath('/technician');
    revalidatePath(`/technician/jobs/${jobId}`);

    return { success: true, job: updatedJob };
  } catch (error) {
    console.error('Error moving to step:', error);
    return { success: false, error: 'Failed to move to step' };
  }
}

// ============================================================================
// TECHNICAL REPORT ACTIONS
// ============================================================================

/**
 * Create or update technical report
 */
export async function saveReport(data: z.infer<typeof createReportSchema>) {
  try {
    const validatedData = createReportSchema.parse(data);

    // Check for existing report
    const [existingReport] = await db
      .select({ id: technicalReports.id })
      .from(technicalReports)
      .where(eq(technicalReports.jobId, validatedData.jobId))
      .limit(1);

    let report;

    if (existingReport) {
      [report] = await db
        .update(technicalReports)
        .set({
          executiveSummary: validatedData.executiveSummary,
          findings: validatedData.findings,
          recommendations: validatedData.recommendations,
          aiGenerated: validatedData.aiGenerated,
          aiDraft: validatedData.aiDraft,
          updatedAt: new Date(),
        })
        .where(eq(technicalReports.id, existingReport.id))
        .returning();
    } else {
      [report] = await db
        .insert(technicalReports)
        .values({
          jobId: validatedData.jobId,
          executiveSummary: validatedData.executiveSummary,
          findings: validatedData.findings,
          recommendations: validatedData.recommendations,
          aiGenerated: validatedData.aiGenerated,
          aiDraft: validatedData.aiDraft,
          status: 'draft',
        } satisfies NewTechnicalReport)
        .returning();
    }

    revalidatePath(`/technician/jobs/${validatedData.jobId}`);

    return { success: true, report };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation error', details: error.errors };
    }
    console.error('Error saving report:', error);
    return { success: false, error: 'Failed to save report' };
  }
}

/**
 * Finalize and send report
 */
export async function finalizeReport(jobId: string) {
  try {
    const [report] = await db
      .update(technicalReports)
      .set({
        status: 'sent',
        sentAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(technicalReports.jobId, jobId))
      .returning();

    if (!report) {
      return { success: false, error: 'Report not found' };
    }

    // Update job status
    await db
      .update(jobs)
      .set({
        quoteSentAt: new Date(),
        status: 'awaiting_quote_approval',
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, jobId));

    revalidatePath(`/technician/jobs/${jobId}`);

    return { success: true, report };
  } catch (error) {
    console.error('Error finalizing report:', error);
    return { success: false, error: 'Failed to finalize report' };
  }
}

// ============================================================================
// QC INSPECTION ACTIONS
// ============================================================================

/**
 * Submit QC inspection
 */
export async function submitQcInspection(data: z.infer<typeof qcInspectionSchema>) {
  try {
    const validatedData = qcInspectionSchema.parse(data);

    const [inspection] = await db
      .insert(qcInspections)
      .values({
        jobId: validatedData.jobId,
        inspectorId: validatedData.inspectorId,
        measurements: validatedData.measurements,
        visualInspectionPassed: validatedData.visualInspectionPassed,
        functionTestPassed: validatedData.functionTestPassed,
        leakTestPassed: validatedData.leakTestPassed,
        documentationComplete: validatedData.documentationComplete,
        overallStatus: validatedData.overallStatus,
        notes: validatedData.notes,
        failedItems: validatedData.failedItems || [],
      } satisfies NewQcInspection)
      .returning();

    // Update job if QC passed
    if (validatedData.overallStatus === 'passed') {
      await db
        .update(jobs)
        .set({
          currentStep: 'step_11_dispatch',
          status: 'qc_passed',
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, validatedData.jobId));
    }

    revalidatePath(`/technician/jobs/${validatedData.jobId}`);

    return { success: true, inspection };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation error', details: error.errors };
    }
    console.error('Error submitting QC inspection:', error);
    return { success: false, error: 'Failed to submit QC inspection' };
  }
}

// ============================================================================
// PO / QUOTE ACTIONS
// ============================================================================

/**
 * Record PO received
 */
export async function recordPoReceived(jobId: string, poNumber: string) {
  try {
    const [updatedJob] = await db
      .update(jobs)
      .set({
        poNumber,
        poReceivedAt: new Date(),
        quoteApprovedAt: new Date(),
        currentStep: 'step_7_repair',
        status: 'po_received',
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, jobId))
      .returning();

    if (!updatedJob) {
      return { success: false, error: 'Job not found' };
    }

    revalidatePath('/technician');
    revalidatePath(`/technician/jobs/${jobId}`);

    return { success: true, job: updatedJob };
  } catch (error) {
    console.error('Error recording PO:', error);
    return { success: false, error: 'Failed to record PO' };
  }
}

/**
 * Update quote amount
 */
export async function updateQuote(jobId: string, amount: number) {
  try {
    const [updatedJob] = await db
      .update(jobs)
      .set({
        quoteAmount: amount.toString(),
        quoteSentAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, jobId))
      .returning();

    if (!updatedJob) {
      return { success: false, error: 'Job not found' };
    }

    revalidatePath(`/technician/jobs/${jobId}`);

    return { success: true, job: updatedJob };
  } catch (error) {
    console.error('Error updating quote:', error);
    return { success: false, error: 'Failed to update quote' };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getStepTitle(step: WorkflowStep): string {
  const titles: Record<WorkflowStep, string> = {
    step_1_receiving: 'Receiving',
    step_2_logging: 'Logging & Hazmat Check',
    step_3_strip_assess: 'Strip & Assess',
    step_4_document_faults: 'Document Faults',
    step_5_technical_report: 'Technical Report',
    step_6_await_po: 'Await PO',
    step_7_repair: 'Repair',
    step_8_reassemble: 'Reassemble',
    step_9_function_test: 'Function Test',
    step_10_qc_inspection: 'QC Inspection',
    step_11_dispatch: 'Dispatch',
  };
  return titles[step];
}
