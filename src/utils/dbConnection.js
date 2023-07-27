import env from '../config/enviroment.config.js';
import { connect } from 'mongoose';

export async function connectMongo() {
  try {
    await connect(env.mongoUrl, {
      dbName: 'ecommerce',
    });
    console.log('plug to mongo!');
  } catch (e) {
    console.log(e);
    throw 'can not connect to the db';
  }
}
