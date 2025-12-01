/**
 * Jobs API Routes
 * GET /api/jobs - List all jobs with filters
 * POST /api/jobs - Create a new job
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { jobs, clients, users } from '@/lib/db/schema';
import { eq, desc, and, or, like, sql } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema for creating a job
const createJobSchema = z.object({
  clientId: z.string().uuid(),
  equipmentType: z.string().min(1),
  serialNumber: z.string().min(1),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  modelNumber: z.string().optional(),
  hasHazmat: z.boolean().default(false),
  hazmatLevel: z.enum(['none', 'low', 'medium', 'high', 'extreme']).optional(),
  hazmatNotes: z.string().optional(),
  receivingNotes: z.string().optional(),
  assignedTechnicianId: z.string().uuid().optional(),
  targetCompletionDate: z.string().datetime().optional(),
});

// Generate job number: BRIM-YYYY-XXX
async function generateJobNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `BRIM-${year}-`;

  // Get the latest job number for this year
  const latestJob = await db
    .select({ jobNumber: jobs.jobNumber })
    .from(jobs)
    .where(like(jobs.jobNumber, `${prefix}%`))
    .orderBy(desc(jobs.jobNumber))
    .limit(1);

  let nextNumber = 1;
  if (latestJob.length > 0) {
    const lastNumber = parseInt(latestJob[0].jobNumber.split('-')[2], 10);
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${String(nextNumber).padStart(3, '0')}`;
}

/**
 * GET /api/jobs
 * Query params: status, step, technicianId, clientId, search, limit, offset
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const step = searchParams.get('step');
    const technicianId = searchParams.get('technicianId');
    const clientId = searchParams.get('clientId');
    const hasHazmat = searchParams.get('hasHazmat');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Build conditions array
    const conditions = [];

    if (status) {
      conditions.push(eq(jobs.status, status as typeof jobs.status.enumValues[number]));
    }
    if (step) {
      conditions.push(eq(jobs.currentStep, step as typeof jobs.currentStep.enumValues[number]));
    }
    if (technicianId) {
      conditions.push(eq(jobs.assignedTechnicianId, technicianId));
    }
    if (clientId) {
      conditions.push(eq(jobs.clientId, clientId));
    }
    if (hasHazmat === 'true') {
      conditions.push(eq(jobs.hasHazmat, true));
    }
    if (search) {
      conditions.push(
        or(
          like(jobs.jobNumber, `%${search}%`),
          like(jobs.equipmentType, `%${search}%`),
          like(jobs.serialNumber, `%${search}%`)
        )
      );
    }

    // Execute query with relations
    const jobsList = await db
      .select({
        id: jobs.id,
        jobNumber: jobs.jobNumber,
        equipmentType: jobs.equipmentType,
        serialNumber: jobs.serialNumber,
        manufacturer: jobs.manufacturer,
        model: jobs.model,
        currentStep: jobs.currentStep,
        status: jobs.status,
        hasHazmat: jobs.hasHazmat,
        hazmatLevel: jobs.hazmatLevel,
        receivedAt: jobs.receivedAt,
        targetCompletionDate: jobs.targetCompletionDate,
        createdAt: jobs.createdAt,
        client: {
          id: clients.id,
          name: clients.name,
          company: clients.company,
        },
        technician: {
          id: users.id,
          fullName: users.fullName,
        },
      })
      .from(jobs)
      .leftJoin(clients, eq(jobs.clientId, clients.id))
      .leftJoin(users, eq(jobs.assignedTechnicianId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(jobs.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobs)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const total = Number(countResult[0]?.count || 0);

    return NextResponse.json({
      jobs: jobsList,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/jobs
 * Create a new job
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createJobSchema.parse(body);

    // Generate job number
    const jobNumber = await generateJobNumber();

    // Create the job
    const [newJob] = await db
      .insert(jobs)
      .values({
        jobNumber,
        clientId: validatedData.clientId,
        equipmentType: validatedData.equipmentType,
        serialNumber: validatedData.serialNumber,
        manufacturer: validatedData.manufacturer,
        model: validatedData.model,
        modelNumber: validatedData.modelNumber,
        hasHazmat: validatedData.hasHazmat,
        hazmatLevel: validatedData.hazmatLevel,
        hazmatNotes: validatedData.hazmatNotes,
        receivingNotes: validatedData.receivingNotes,
        assignedTechnicianId: validatedData.assignedTechnicianId,
        targetCompletionDate: validatedData.targetCompletionDate
          ? new Date(validatedData.targetCompletionDate)
          : undefined,
        currentStep: 'step_1_receiving',
        status: 'received',
      })
      .returning();

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
