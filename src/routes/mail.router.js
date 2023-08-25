import express from 'express';
import { transport } from '../utils/nodemailer.js';
import env from '../config/enviroment.config.js';
import { __dirname } from '../config.js';
import { logger } from '../utils/logger.js';

export const mailRouter = express.Router();

mailRouter.get('/', async (req, res) => {
  const result = await transport.sendMail({
    from: env.googleMail,
    to: 'valeriacajes@gmail.com',
    subject: 'Enviado con nodemailer',
    html: `
            <div>
                <h1>Notificaciones via Nodemailer</h1>
                <img src="cid:logo" />
            </div>
          `,
    attachments: [
      {
        filename: 'logo.png',
        path: __dirname + '/public/images/logo.png',
        cid: 'logo',
      },
    ],
  });

  logger.info(result);
  res.send('Email sent');
});
