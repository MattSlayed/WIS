/**
 * Job Steps API Routes
 * GET /api/jobs/[id]/steps - Get step completions for a job
 * POST /api/jobs/[id]/steps - Complete a step
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jobs, stepCompletions, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

// Workflow step order for progression validation
const STEP_ORDER = [
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

// Status mapping for each step
const STEP_STATUS_MAP: Record<string, string> = {
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

// Validation schema for completing a step
const completeStepSchema = z.object({
  step: z.enum(STEP_ORDER),
  completedBy: z.string().uuid(),
  notes: z.string().optional(),
  measurements: z.record(z.number()).optional(),
  checklistData: z.record(z.boolean()).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/jobs/[id]/steps
 * Get all step completions for a job
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Verify job exists
    const [job] = await db
      .select({ id: jobs.id, currentStep: jobs.currentStep })
      .from(jobs)
      .where(eq(jobs.id, id))
      .limit(1);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Get all step completions with user info
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
      .where(eq(stepCompletions.jobId, id));

    // Build step status map
    const completedSteps = new Set(completions.map((c) => c.step));
    const currentStepIndex = STEP_ORDER.indexOf(job.currentStep);

    const stepsWithStatus = STEP_ORDER.map((step, index) => ({
      step,
      stepNumber: index + 1,
      isCompleted: completedSteps.has(step),
      isCurrent: step === job.currentStep,
      isLocked: index > currentStepIndex && !completedSteps.has(step),
      completion: completions.find((c) => c.step === step) || null,
    }));

    return NextResponse.json({
      currentStep: job.currentStep,
      steps: stepsWithStatus,
    });
  } catch (error) {
    console.error('Error fetching steps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch steps' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/jobs/[id]/steps
 * Complete a workflow step
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = completeStepSchema.parse(body);

    // Get current job state
    const [job] = await db
      .select({ id: jobs.id, currentStep: jobs.currentStep, status: jobs.status })
      .from(jobs)
      .where(eq(jobs.id, id))
      .limit(1);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Validate step progression
    const currentIndex = STEP_ORDER.indexOf(job.currentStep);
    const targetIndex = STEP_ORDER.indexOf(validatedData.step);

    // Can only complete current step or go back to re-do previous steps
    if (targetIndex > currentIndex + 1) {
      return NextResponse.json(
        { error: 'Cannot skip steps. Complete the current step first.' },
        { status: 400 }
      );
    }

    // Check if step already completed
    const [existingCompletion] = await db
      .select({ id: stepCompletions.id })
      .from(stepCompletions)
      .where(
        and(
          eq(stepCompletions.jobId, id),
          eq(stepCompletions.step, validatedData.step)
        )
      )
      .limit(1);

    if (existingCompletion) {
      // Update existing completion
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
        jobId: id,
        step: validatedData.step,
        completedBy: validatedData.completedBy,
        notes: validatedData.notes,
        measurements: validatedData.measurements,
        checklistData: validatedData.checklistData,
      });
    }

    // Determine next step
    const nextStepIndex = targetIndex + 1;
    const nextStep = nextStepIndex < STEP_ORDER.length
      ? STEP_ORDER[nextStepIndex]
      : validatedData.step;

    // Update job's current step and status
    const newStatus = STEP_STATUS_MAP[validatedData.step] || job.status;

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
      .where(eq(jobs.id, id))
      .returning();

    return NextResponse.json({
      job: updatedJob,
      completedStep: validatedData.step,
      nextStep: nextStepIndex < STEP_ORDER.length ? STEP_ORDER[nextStepIndex] : null,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error completing step:', error);
    return NextResponse.json(
      { error: 'Failed to complete step' },
      { status: 500 }
    );
  }
}
