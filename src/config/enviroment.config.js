import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();
program.option('--mode <mode>', 'Modo de Trabajo', 'DEVELOPMENT');
program.parse();

// Determina el archivo .env en función del modo especificado
let envPath = '';

if (program.opts().mode === 'DEVELOPMENT') {
  envPath = './.env.development';
} else if (program.opts().mode === 'QA') {
  envPath = './.env.qa';
} else {
  envPath = './.env.production';
}

dotenv.config({
  path: envPath,
});

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  sessionSecret: process.env.SESSION_SECRET,
  githubKey: process.env.GITHUB_CLIENT_SECRET,
  adminName: process.env.ADMIN_NAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  persistence: process.env.PERSISTENCE,
  winstonLogger: process.env.WINSTON_LOGGER,
  googleMail: process.env.GOOGLE_EMAIL,
  googlePass: process.env.GOOGLE_PASS,
  twilioAccountSID: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  apiUrl: process.env.API_URL,
};
