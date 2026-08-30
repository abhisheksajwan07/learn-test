import { Pool } from 'pg';
import config from '../config/env.js';

async function resetDatabase() {
  console.log('Resetting database...');

  const pool = new Pool({
    connectionString: config.databaseUrl,
    max: 1,
  });

  try {
    const client = await pool.connect();

    // Drop all tables in the app schema
    await client.query('DROP SCHEMA IF EXISTS app CASCADE');

    // Drop all tables in the auth schema
    await client.query('DROP SCHEMA IF EXISTS auth CASCADE');

    // Recreate schemas
    await client.query('CREATE SCHEMA app');
    await client.query('CREATE SCHEMA auth');

    client.release();
    console.log('Database reset completed successfully');
  } catch (error) {
    console.error('Database reset failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetDatabase();
