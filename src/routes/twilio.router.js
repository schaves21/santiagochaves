import express from 'express';
import { client } from '../utils/twilio.js';
import env from '../config/enviroment.config.js';
import { logger } from '../utils/logger.js';

export const twilioRouter = express.Router();

twilioRouter.get('/', async (req, res) => {
  const result = await client.messages.create({
    body: 'Enviando sms con Twilio',
    from: env.twilioPhoneNumber,
    to: '+59898988391',
  });

  logger.info(result);

  res.send('SMS sent');
});
