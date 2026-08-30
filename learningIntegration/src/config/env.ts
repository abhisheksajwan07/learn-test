import dotenv from 'dotenv';
import path from 'path';

// Load environment variables based on NODE_ENV
const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`);
dotenv.config({ path: envPath });

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

interface EnvConfig {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  testDatabaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  cookieName: string;
  cookieSecure: boolean;
  cookieHttpOnly: boolean;
  cookieSameSite: string;
}

const config: EnvConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  testDatabaseUrl: process.env.TEST_DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  cookieName: process.env.COOKIE_NAME || 'auth_token',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  cookieHttpOnly: process.env.COOKIE_HTTP_ONLY !== 'false',
  cookieSameSite: process.env.COOKIE_SAME_SITE || 'strict',
};

export default config;
