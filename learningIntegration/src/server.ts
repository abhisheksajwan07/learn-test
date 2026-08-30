import config from './config/env.js';
import app from './app.js';
import { shutdownDb } from './config/database.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Database URL: ${config.databaseUrl}`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');

  server.close(async () => {
    console.log('Server closed');
    await shutdownDb();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');

  server.close(async () => {
    console.log('Server closed');
    await shutdownDb();
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err);
  server.close(async () => {
    await shutdownDb();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  server.close(async () => {
    await shutdownDb();
    process.exit(1);
  });
});
