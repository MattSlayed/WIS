/**
 * Workshop Intelligence System - Database Connection
 * Neon PostgreSQL with Drizzle ORM
 */

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Configure Neon for edge runtime compatibility
neonConfig.fetchConnectionCache = true;

// Lazy database connection - only connects when actually used
let _db: NeonHttpDatabase<typeof schema> | null = null;

function getDb(): NeonHttpDatabase<typeof schema> {
  if (_db) return _db;

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please add your Neon PostgreSQL connection string to .env.local'
    );
  }

  const sql = neon(connectionString);
  _db = drizzle(sql, { schema });
  return _db;
}

// Export a proxy that lazily initializes the database
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_, prop) {
    const database = getDb();
    const value = database[prop as keyof typeof database];
    if (typeof value === 'function') {
      return value.bind(database);
    }
    return value;
  },
});

// Export schema for easy access
export * from './schema';

// Type-safe query builder
export type Database = NeonHttpDatabase<typeof schema>;
