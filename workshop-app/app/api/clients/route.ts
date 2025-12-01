/**
 * Clients API Routes
 * GET /api/clients - List all clients
 * POST /api/clients - Create a new client
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clients } from '@/lib/db/schema';
import { desc, like, or } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema for creating a client
const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  company: z.string().min(1, 'Company is required'),
  address: z.string().optional(),
});

/**
 * GET /api/clients
 * Query params: search, limit, offset
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = db.select().from(clients);

    if (search) {
      query = query.where(
        or(
          like(clients.name, `%${search}%`),
          like(clients.company, `%${search}%`),
          like(clients.email, `%${search}%`)
        )
      ) as typeof query;
    }

    const clientsList = await query
      .orderBy(desc(clients.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ clients: clientsList });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/clients
 * Create a new client
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createClientSchema.parse(body);

    const [newClient] = await db
      .insert(clients)
      .values(validatedData)
      .returning();

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}
