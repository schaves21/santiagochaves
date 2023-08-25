import twilio from 'twilio';
import env from '../config/enviroment.config.js';

export const client = twilio(env.twilioAccountSID, env.twilioAuthToken);
