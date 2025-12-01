/**
 * Workshop Intelligence System - Database Connection
 * Neon PostgreSQL with Drizzle ORM
 */

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Configure Neon for edge runtime compatibility
neonConfig.fetchConnectionCache = true;

// Create the connection
const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL environment variable is not set. ' +
    'Please add your Neon PostgreSQL connection string to .env.local'
  );
}

// Create Neon SQL client
const sql = neon(connectionString);

// Create Drizzle instance with schema
export const db = drizzle(sql, { schema });

// Export schema for easy access
export * from './schema';

// Type-safe query builder
export type Database = typeof db;
