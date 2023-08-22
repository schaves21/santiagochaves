import mongoose from 'mongoose';
import env from '../config/enviroment.config.js';
import { logger } from './logger.js';

export default class MongoSingleton {
  static instance;

  constructor() {
    mongoose.connect(env.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  static getInstance() {
    if (this.instance) {
      logger.info('Already connected!');
      return this.instance;
    }

    this.instance = new MongoSingleton();
    logger.info('Connected MongoDB!');

    return this.instance;
  }
}
