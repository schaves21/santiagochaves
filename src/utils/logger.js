import winston from 'winston';
import env from '../config/enviroment.config.js';

let logger;

if (env.winstonLogger === 'production') {
  logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level}: ${message}`;
      })
    ),
    transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'errors.log', level: 'error' })],
  });
} else if (env.winstonLogger === 'development') {
  logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    transports: [new winston.transports.Console()],
  });
} else if (env.winstonLogger === 'qa') {
  logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    transports: [new winston.transports.Console()],
  });
}

export { logger };
