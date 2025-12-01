/**
 * Users API Routes
 * GET /api/users - List all users
 * POST /api/users - Create a new user
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { desc, eq, like, or } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema for creating a user
const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(1, 'Full name is required'),
  role: z.enum(['technician', 'manager', 'admin']).default('technician'),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

/**
 * GET /api/users
 * Query params: role, search, limit, offset
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = db.select().from(users);

    // Apply filters
    const conditions = [];

    if (role) {
      conditions.push(eq(users.role, role as 'technician' | 'manager' | 'admin'));
    }

    if (search) {
      conditions.push(
        or(
          like(users.fullName, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      // @ts-expect-error - Dynamic where conditions
      query = query.where(conditions.length === 1 ? conditions[0] : or(...conditions));
    }

    const usersList = await query
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ users: usersList });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Create a new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    // Check if email already exists
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const [newUser] = await db
      .insert(users)
      .values(validatedData)
      .returning();

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
