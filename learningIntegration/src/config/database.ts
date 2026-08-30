import config from './env.js';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema.js';

// Create connection pools for both databases
const devPool = new Pool({
  connectionString: config.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const testPool = new Pool({
  connectionString: config.testDatabaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Route application queries to the test database during Vitest runs.
const activePool = config.nodeEnv === 'test' ? testPool : devPool;

// Create Drizzle ORM instances
export const db = drizzle(activePool, { schema });
export const testDb = drizzle(testPool, { schema });

// Export pools for migrations and direct access if needed
export const pool = devPool;
export const testPoolInstance = testPool;

// Graceful shutdown
export const shutdownDb = async () => {
  await devPool.end();
  await testPool.end();
};
