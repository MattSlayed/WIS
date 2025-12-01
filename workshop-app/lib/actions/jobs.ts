'use server';

/**
 * Server Actions for Job Operations
 * Type-safe server mutations for job management
 */

import { db } from '@/lib/db';
import { jobs, jobParts, jobPhotos, clients, users, NewJob, NewJobPart, NewJobPhoto } from '@/lib/db/schema';
import { eq, desc, like, and, or, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

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

const addPartSchema = z.object({
  jobId: z.string().uuid(),
  partName: z.string().min(1),
  partNumber: z.string().optional(),
  quantity: z.number().int().positive().default(1),
  condition: z.enum(['good', 'repairable', 'replace']),
  defects: z.array(z.string()).optional(),
  defectNotes: z.string().optional(),
  cost: z.number().positive().optional(),
});

const addPhotoSchema = z.object({
  jobId: z.string().uuid(),
  step: z.enum([
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
  stepNumber: z.number().int().min(1).max(11).optional(),
  url: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  caption: z.string().optional(),
  uploadedBy: z.string().uuid(),
});

// ============================================================================
// JOB ACTIONS
// ============================================================================

/**
 * Generate a unique job number
 */
async function generateJobNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `BRIM-${year}-`;

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
 * Create a new job
 */
export async function createJob(data: z.infer<typeof createJobSchema>) {
  try {
    const validatedData = createJobSchema.parse(data);
    const jobNumber = await generateJobNumber();

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
      } satisfies NewJob)
      .returning();

    revalidatePath('/technician');
    revalidatePath('/manager');

    return { success: true, job: newJob };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation error', details: error.errors };
    }
    console.error('Error creating job:', error);
    return { success: false, error: 'Failed to create job' };
  }
}

/**
 * Get jobs with filters
 */
export async function getJobs(filters?: {
  status?: string;
  step?: string;
  technicianId?: string;
  hasHazmat?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    const conditions = [];

    if (filters?.status) {
      conditions.push(eq(jobs.status, filters.status as typeof jobs.status.enumValues[number]));
    }
    if (filters?.step) {
      conditions.push(eq(jobs.currentStep, filters.step as typeof jobs.currentStep.enumValues[number]));
    }
    if (filters?.technicianId) {
      conditions.push(eq(jobs.assignedTechnicianId, filters.technicianId));
    }
    if (filters?.hasHazmat) {
      conditions.push(eq(jobs.hasHazmat, true));
    }
    if (filters?.search) {
      conditions.push(
        or(
          like(jobs.jobNumber, `%${filters.search}%`),
          like(jobs.equipmentType, `%${filters.search}%`),
          like(jobs.serialNumber, `%${filters.search}%`)
        )
      );
    }

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
      .limit(filters?.limit || 50)
      .offset(filters?.offset || 0);

    return { success: true, jobs: jobsList };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return { success: false, error: 'Failed to fetch jobs', jobs: [] };
  }
}

/**
 * Get a single job by ID with full details
 */
export async function getJobById(id: string) {
  try {
    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, id))
      .limit(1);

    if (!job) {
      return { success: false, error: 'Job not found' };
    }

    // Fetch related data
    const [client, technician, parts, photos] = await Promise.all([
      db.select().from(clients).where(eq(clients.id, job.clientId)).limit(1),
      job.assignedTechnicianId
        ? db.select().from(users).where(eq(users.id, job.assignedTechnicianId)).limit(1)
        : Promise.resolve([]),
      db.select().from(jobParts).where(eq(jobParts.jobId, id)),
      db.select().from(jobPhotos).where(eq(jobPhotos.jobId, id)),
    ]);

    return {
      success: true,
      job: {
        ...job,
        client: client[0] || null,
        assignedTechnician: technician[0] || null,
        parts,
        photos,
      },
    };
  } catch (error) {
    console.error('Error fetching job:', error);
    return { success: false, error: 'Failed to fetch job' };
  }
}

/**
 * Update job fields
 */
export async function updateJob(id: string, data: Partial<NewJob>) {
  try {
    const [updatedJob] = await db
      .update(jobs)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, id))
      .returning();

    if (!updatedJob) {
      return { success: false, error: 'Job not found' };
    }

    revalidatePath('/technician');
    revalidatePath(`/technician/jobs/${id}`);

    return { success: true, job: updatedJob };
  } catch (error) {
    console.error('Error updating job:', error);
    return { success: false, error: 'Failed to update job' };
  }
}

/**
 * Assign technician to job
 */
export async function assignTechnician(jobId: string, technicianId: string) {
  return updateJob(jobId, { assignedTechnicianId: technicianId });
}

/**
 * Update hazmat status
 */
export async function updateHazmatStatus(
  jobId: string,
  data: {
    hasHazmat: boolean;
    hazmatLevel?: 'none' | 'low' | 'medium' | 'high' | 'extreme';
    hazmatNotes?: string;
    hazmatCleaned?: boolean;
    hazmatCleanedBy?: string;
  }
) {
  const updateData: Partial<NewJob> = {
    hasHazmat: data.hasHazmat,
    hazmatLevel: data.hazmatLevel,
    hazmatNotes: data.hazmatNotes,
  };

  if (data.hazmatCleaned) {
    updateData.hazmatCleaned = true;
    updateData.hazmatCleanedAt = new Date();
    updateData.hazmatCleanedBy = data.hazmatCleanedBy;
  }

  return updateJob(jobId, updateData);
}

// ============================================================================
// PARTS ACTIONS
// ============================================================================

/**
 * Add a part to a job
 */
export async function addJobPart(data: z.infer<typeof addPartSchema>) {
  try {
    const validatedData = addPartSchema.parse(data);

    const [newPart] = await db
      .insert(jobParts)
      .values({
        jobId: validatedData.jobId,
        partName: validatedData.partName,
        partNumber: validatedData.partNumber,
        quantity: validatedData.quantity,
        condition: validatedData.condition,
        defects: validatedData.defects || [],
        defectNotes: validatedData.defectNotes,
        cost: validatedData.cost?.toString(),
      } satisfies NewJobPart)
      .returning();

    revalidatePath(`/technician/jobs/${data.jobId}`);

    return { success: true, part: newPart };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation error', details: error.errors };
    }
    console.error('Error adding part:', error);
    return { success: false, error: 'Failed to add part' };
  }
}

/**
 * Update a job part
 */
export async function updateJobPart(id: string, data: Partial<NewJobPart>) {
  try {
    const [updatedPart] = await db
      .update(jobParts)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(jobParts.id, id))
      .returning();

    if (!updatedPart) {
      return { success: false, error: 'Part not found' };
    }

    revalidatePath(`/technician/jobs/${updatedPart.jobId}`);

    return { success: true, part: updatedPart };
  } catch (error) {
    console.error('Error updating part:', error);
    return { success: false, error: 'Failed to update part' };
  }
}

/**
 * Delete a job part
 */
export async function deleteJobPart(id: string) {
  try {
    const [deletedPart] = await db
      .delete(jobParts)
      .where(eq(jobParts.id, id))
      .returning();

    if (!deletedPart) {
      return { success: false, error: 'Part not found' };
    }

    revalidatePath(`/technician/jobs/${deletedPart.jobId}`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting part:', error);
    return { success: false, error: 'Failed to delete part' };
  }
}

// ============================================================================
// PHOTOS ACTIONS
// ============================================================================

/**
 * Add a photo to a job
 */
export async function addJobPhoto(data: z.infer<typeof addPhotoSchema>) {
  try {
    const validatedData = addPhotoSchema.parse(data);

    const [newPhoto] = await db
      .insert(jobPhotos)
      .values({
        jobId: validatedData.jobId,
        step: validatedData.step,
        stepNumber: validatedData.stepNumber,
        url: validatedData.url,
        imageUrl: validatedData.imageUrl,
        caption: validatedData.caption,
        uploadedBy: validatedData.uploadedBy,
        takenAt: new Date(),
      } satisfies NewJobPhoto)
      .returning();

    revalidatePath(`/technician/jobs/${data.jobId}`);

    return { success: true, photo: newPhoto };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation error', details: error.errors };
    }
    console.error('Error adding photo:', error);
    return { success: false, error: 'Failed to add photo' };
  }
}

/**
 * Delete a job photo
 */
export async function deleteJobPhoto(id: string) {
  try {
    const [deletedPhoto] = await db
      .delete(jobPhotos)
      .where(eq(jobPhotos.id, id))
      .returning();

    if (!deletedPhoto) {
      return { success: false, error: 'Photo not found' };
    }

    revalidatePath(`/technician/jobs/${deletedPhoto.jobId}`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting photo:', error);
    return { success: false, error: 'Failed to delete photo' };
  }
}

/**
 * Get job statistics
 */
export async function getJobStats() {
  try {
    const stats = await db
      .select({
        totalJobs: sql<number>`count(*)`,
        activeJobs: sql<number>`count(*) filter (where ${jobs.status} not in ('dispatched', 'cancelled'))`,
        hazmatJobs: sql<number>`count(*) filter (where ${jobs.hasHazmat} = true)`,
        completedToday: sql<number>`count(*) filter (where ${jobs.actualCompletionDate}::date = current_date)`,
      })
      .from(jobs);

    return { success: true, stats: stats[0] };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { success: false, error: 'Failed to fetch stats' };
  }
}
