import env from '../config/enviroment.config.js';
import MongoSingleton from '../utils/dbConnection.js';
import { logger } from '../utils/logger.js';

export let ProductModel;
export let CartModel;
export let TicketModel;
export let ViewModel;

switch (env.persistence) {
  case 'MONGO':
    MongoSingleton.getInstance();
    logger.info('Persistence with MongoDB');

    const { default: ProductsMongo } = await import('./mongo/products.model.js');
    ProductModel = ProductsMongo;

    const { default: CartsMongo } = await import('./mongo/carts.model.js');
    CartModel = CartsMongo;

    const { default: TicketsMongo } = await import('./mongo/tickets.model.js');
    TicketModel = TicketsMongo;

    const { default: ViewsMongo } = await import('./mongo/views.model.js');
    ViewModel = ViewsMongo;

    break;
  case 'MEMORY':
    logger.info('Persistence with Memory');
    const { default: ProductsMemory } = await import('./memory/products.memory.js');
    ProductModel = ProductsMemory;

    const { default: CartsMemory } = await import('./memory/carts.memory.js');
    CartModel = CartsMemory;

    const { default: TicketsMemory } = await import('./memory/tickets.memory.js');
    TicketModel = TicketsMemory;

    const { default: ViewsMemory } = await import('./memory/views.memory.js');
    ViewModel = ViewsMemory;

    break;
  default:
    break;
}
