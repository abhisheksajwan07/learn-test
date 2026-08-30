import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Set NODE_ENV to test for the test suite
process.env.NODE_ENV = 'test';

// Load test-only configuration after NODE_ENV has been set. These dynamic
// imports prevent env.ts from loading the development environment first.
const { testPoolInstance } = await import('../src/config/database.js');
const { default: config } = await import('../src/config/env.js');

const migrationPath = fileURLToPath(
  new URL('../src/db/migrations/0000_initial_schema.sql', import.meta.url),
);
const initialSchema = await readFile(migrationPath, 'utf8');

// Global setup for test database
beforeAll(async () => {
  console.log('Setting up test database...');

  // Ensure we're using the test database
  if (config.nodeEnv !== 'test') {
    throw new Error('Tests must run with NODE_ENV=test');
  }

  // Recreate the schema and apply the same SQL used by the project migration.
  const client = await testPoolInstance.connect();
  try {
    await client.query('DROP SCHEMA IF EXISTS app CASCADE');
    await client.query('DROP SCHEMA IF EXISTS auth CASCADE');
    await client.query('CREATE SCHEMA app');
    await client.query('CREATE SCHEMA auth');
    await client.query(initialSchema);
  } finally {
    client.release();
  }
});

// Global teardown
afterAll(async () => {
  console.log('Cleaning up test database...');
  await testPoolInstance.end();
});

// Reset database state between tests
afterEach(async () => {
  const client = await testPoolInstance.connect();
  try {
    await client.query('TRUNCATE TABLE app.tasks, app.users RESTART IDENTITY CASCADE');
  } finally {
    client.release();
  }
});
