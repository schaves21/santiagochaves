import express from 'express';
import { readFile } from 'fs/promises';
import { logger } from '../utils/logger.js';
import { checkAdmin } from '../middlewares/auth.js';

export const loggerRouter = express.Router();

loggerRouter.get('/', checkAdmin, async (req, res) => {
  try {
    const logPath = './errors.log';
    const content = await readFile(logPath, 'utf8');

    const logs = content.split('\n').filter((line) => line.trim() !== '');

    logger.debug('Debug log');
    logger.info('Info log');
    logger.warn('Warning log');
    logger.error('Error log');

    res.status(200).json({ msg: 'View logs from the console and the errors.log file', logs: { logs } });
  } catch (err) {
    logger.error(err.message);
  }
});
