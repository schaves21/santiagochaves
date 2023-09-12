import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { __dirname } from '../config.js';

export const docsRouter = express.Router();

const specs = swaggerJSDoc({
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentation of MEGA-FRIDAY API',
      description: 'Documentation of the MEGA-FRIDAY API developed for an ecommerce in the Coderhouse backend course.',
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
});

docsRouter.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
