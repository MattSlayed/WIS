/**
 * Individual Job API Routes
 * GET /api/jobs/[id] - Get job details
 * PATCH /api/jobs/[id] - Update job
 * DELETE /api/jobs/[id] - Delete job
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  jobs,
  clients,
  users,
  jobParts,
  jobPhotos,
  stepCompletions,
  technicalReports,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema for updating a job
const updateJobSchema = z.object({
  equipmentType: z.string().min(1).optional(),
  serialNumber: z.string().min(1).optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  modelNumber: z.string().optional(),
  currentStep: z.enum([
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
  ]).optional(),
  status: z.enum([
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
  ]).optional(),
  hasHazmat: z.boolean().optional(),
  hazmatLevel: z.enum(['none', 'low', 'medium', 'high', 'extreme']).optional(),
  hazmatNotes: z.string().optional(),
  hazmatDetails: z.string().optional(),
  hazmatCleaned: z.boolean().optional(),
  hazmatCleanedBy: z.string().uuid().optional(),
  quoteAmount: z.number().positive().optional(),
  poNumber: z.string().optional(),
  assignedTechnicianId: z.string().uuid().optional(),
  receivingNotes: z.string().optional(),
  targetCompletionDate: z.string().datetime().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/jobs/[id]
 * Get full job details with related data
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Get job with client and technician
    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, id))
      .limit(1);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Fetch related data in parallel
    const [client, technician, parts, photos, steps, report] = await Promise.all([
      db.select().from(clients).where(eq(clients.id, job.clientId)).limit(1),
      job.assignedTechnicianId
        ? db.select().from(users).where(eq(users.id, job.assignedTechnicianId)).limit(1)
        : Promise.resolve([]),
      db.select().from(jobParts).where(eq(jobParts.jobId, id)),
      db.select().from(jobPhotos).where(eq(jobPhotos.jobId, id)),
      db.select().from(stepCompletions).where(eq(stepCompletions.jobId, id)),
      db.select().from(technicalReports).where(eq(technicalReports.jobId, id)).limit(1),
    ]);

    return NextResponse.json({
      ...job,
      client: client[0] || null,
      assignedTechnician: technician[0] || null,
      parts,
      photos,
      stepCompletions: steps,
      technicalReport: report[0] || null,
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/jobs/[id]
 * Update job fields
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateJobSchema.parse(body);

    // Check if job exists
    const [existing] = await db
      .select({ id: jobs.id })
      .from(jobs)
      .where(eq(jobs.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      ...validatedData,
      updatedAt: new Date(),
    };

    // Handle special fields
    if (validatedData.targetCompletionDate) {
      updateData.targetCompletionDate = new Date(validatedData.targetCompletionDate);
    }
    if (validatedData.hazmatCleaned) {
      updateData.hazmatCleanedAt = new Date();
    }
    if (validatedData.poNumber) {
      updateData.poReceivedAt = new Date();
    }
    if (validatedData.quoteAmount) {
      updateData.quoteSentAt = new Date();
    }
    if (validatedData.status === 'dispatched') {
      updateData.actualCompletionDate = new Date();
    }

    // Update the job
    const [updatedJob] = await db
      .update(jobs)
      .set(updateData)
      .where(eq(jobs.id, id))
      .returning();

    return NextResponse.json(updatedJob);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/jobs/[id]
 * Delete a job (cascades to related records)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if job exists
    const [existing] = await db
      .select({ id: jobs.id })
      .from(jobs)
      .where(eq(jobs.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Delete the job (cascades to related records)
    await db.delete(jobs).where(eq(jobs.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
