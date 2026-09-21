'use strict';

const app = require('./app');
const { PORT } = require('./config/env');
const logger = require('./utils/logger');

app.listen(PORT, '0.0.0.0', () => {
  logger.info({ port: PORT }, `Refova backend running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, 'Unhandled promise rejection');
});

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught exception — shutting down');
  process.exit(1);
});
