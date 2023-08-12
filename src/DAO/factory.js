import env from '../config/enviroment.config.js';
import MongoSingleton from '../utils/dbConnection.js';
import { productModel } from '../DAO/mongo/products.model.js';
//import { usersModel } from "./mongo/models/users.model.js";
import { cartModel } from '../DAO/mongo/carts.model.js';
import { viewModel } from '../DAO/mongo/views.model.js';
import { ticketModel } from '../DAO/mongo/tickets.model.js';
import { productsMemory } from './memory/products.memory.js';
//import { usersMemory } from "./memory/users.memory.js";
import { cartsMemory } from './memory/carts.memory.js';
import { ticketsMemory } from './memory/tickets.memory.js';

async function getModel() {
  let models;

  switch (env.persistence) {
    case 'MONGO':
      MongoSingleton.getInstance();
      console.log('Persistence with MongoDB');
      models = {
        products: productModel,
        carts: cartModel,
        views: viewModel,
        tickets: ticketModel,
      };
      break;

    case 'MEMORY':
      console.log('Persistence with Memory');
      models = {
        products: productsMemory,
        carts: cartsMemory,
        tickets: ticketsMemory,
      };
      break;

    default:
      throw new Error(`The type of persistence "${env.persistence}" is not valid`);
  }

  return models;
}

export default getModel;
