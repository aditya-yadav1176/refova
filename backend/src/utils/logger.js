'use strict';

const pino = require('pino');
const { IS_PROD } = require('../config/env');

const logger = pino({
  level: IS_PROD ? 'info' : 'debug',
  transport: IS_PROD
    ? undefined
    : { target: 'pino/file', options: { destination: 1 } },
  redact: {
    paths: [
      'req.headers.authorization',
      'FIREBASE_PRIVATE_KEY',
      'password',
      'token',
    ],
    censor: '[REDACTED]',
  },
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
});

module.exports = logger;
