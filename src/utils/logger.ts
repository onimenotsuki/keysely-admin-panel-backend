import pino from 'pino';

const isProduction = Bun.env.NODE_ENV === 'production';

export const logger = pino({
  level: Bun.env.LOG_LEVEL || 'info',
  transport: !isProduction
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      }
    : undefined,
});
