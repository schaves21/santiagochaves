import MongoStore from 'connect-mongo';
import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';
import passport from 'passport';
import env from './config/enviroment.config.js';
import { iniPassport } from './config/passport.config.js';
import path from 'path';
import { __dirname } from './config.js';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { authRouter } from './routes/auth.router.js';
import { cartsRouter } from './routes/carts.router.js';
import { productsRouter } from './routes/products.router.js';
import { ticketRouter } from './routes/tickets.router.js';
import { viewsRouter } from './routes/views.router.js';
import { chatsRouter } from './routes/chats.router.js';
import { connectWebSockets } from './utils/websockets.js';
import { CustomError } from './utils/errors/custom-error.js';
import { EErrors } from './utils/errors/dictionary-error.js';
import { errorHandler } from './middlewares/error.js';
import { loggerRouter } from './routes/logger.router.js';
import { logger } from './utils/logger.js';

const app = express();
const PORT = env.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const httpServer = app.listen(PORT, () => {
  logger.info(`App runing on ${__dirname} - server http://localhost:${PORT}`);
});

connectWebSockets(httpServer);

app.use(
  session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: env.mongoUrl,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 3600,
    }),
  })
);

// CONFIG DE PASSPORT
iniPassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_PASS,
  },
});

app.get('/mail', async (req, res) => {
  const result = await transport.sendMail({
    from: process.env.GOOGLE_EMAIL,
    to: 'valeriacajes@gmail.com',
    subject: 'Enviado con nodemailer',
    html: `
				<div>
					<h1>Probando nodemailer</h1>
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

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.get('/sms', async (req, res) => {
  const result = await client.messages.create({
    body: 'Enviando sms con Twilio',
    from: process.env.TWILIO_PHONE_NUMBER,
    to: '+59898988391',
  });

  logger.info(result);

  res.send('SMS sent');
});

app.use('/api/sessions', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/tickets', ticketRouter);
app.use('/api/loggerTest', loggerRouter);

app.get('/api/sessions/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/api/sessions/githubcallback', passport.authenticate('github', { failureRedirect: '/error' }), (req, res) => {
  req.session.user = {
    _id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    age: req.user.age,
    rol: req.user.rol,
  };
  res.redirect('/products');
});

app.use('/', viewsRouter);
app.use('/chat', chatsRouter);

app.get('/error-auth', (req, res) => {
  return res.status(400).render('error');
});

app.get('*', (req, res, next) => {
  try {
    throw new CustomError(EErrors.ROUTING_ERROR.code, EErrors.ROUTING_ERROR.name, EErrors.ROUTING_ERROR.cause, EErrors.ROUTING_ERROR.message);
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler.handleMiddleware);
