import MongoStore from 'connect-mongo';
import express from 'express';
import compression from 'express-compression';
import handlebars from 'express-handlebars';
import session from 'express-session';
import passport from 'passport';
import methodOverride from 'method-override';
import env from './config/enviroment.config.js';
import { iniPassport } from './config/passport.config.js';
import path from 'path';
import cookieParser from 'cookie-parser';
import { __dirname } from './config.js';
import { docsRouter } from './routes/docs.router.js';
import { authRouter } from './routes/auth.router.js';
import { usersRouter } from './routes/users.router.js';
import { cartsRouter } from './routes/carts.router.js';
import { productsRouter } from './routes/products.router.js';
import { ticketRouter } from './routes/tickets.router.js';
import { viewsRouter } from './routes/views.router.js';
import { loggerRouter } from './routes/logger.router.js';
import { recoverRouter } from './routes/recover.router.js';
import { twilioRouter } from './routes/twilio.router.js';
import { connectWebSockets } from './utils/websockets.js';
import { CustomError } from './utils/errors/custom-error.js';
import { EErrors } from './utils/errors/dictionary-error.js';
import { errorHandler } from './middlewares/error.js';
import { logger } from './utils/logger.js';
import 'express-async-errors';

const app = express();
app.use(compression({ brotli: { enabled: true, zlib: {} } }));
const PORT = env.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(cookieParser());

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

// API ROUTES
app.use('/', docsRouter);
app.use('/api/sessions', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/tickets', ticketRouter);
app.use('/api/loggerTest', loggerRouter);
app.use('/api/sms', twilioRouter);

// VIEWS
app.use('/', recoverRouter);
app.use('/', viewsRouter);

// GITHUB
app.get('/api/sessions/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/api/sessions/githubcallback', passport.authenticate('github', { failureRedirect: '/error' }), (req, res) => {
  req.session.user = {
    _id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    age: req.user.age,
    cartID: req.user.cartID,
    rol: req.user.rol,
    documents: req.user.documents,
    lastConnection: new Date(),
  };
  res.redirect('/menu');
});

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

const httpServer = app.listen(PORT, () => {
  logger.info(`App runing on ${__dirname} - server http://localhost:${PORT}`);
});

connectWebSockets(httpServer);

app.use(errorHandler.handleMiddleware);

export default app;
