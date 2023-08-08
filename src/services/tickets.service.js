import { cartService } from './carts.service.js';
import getModel from '../DAO/factory.js';
import { UserMongoose } from '../DAO/mongo/users.mongoose.js';

const models = await getModel();
const ticketModel = models.tickets;
const productModel = models.products;

class TicketService {
  async getTicket(tid) {
    try {
      const ticket = await ticketModel.getTicket(tid);
      return ticket;
    } catch (error) {
      throw error;
    }
  }

  async getAll(cartId) {
    try {
      const tickets = await ticketModel.getAll(cartId);
      return tickets;
    } catch (error) {
      throw error;
    }
  }

  async create(purchase, products, user) {
    try {
      const stockCheckResult = await this.controlStock(products);
      if (stockCheckResult) {
        const cartid = await cartService.readById(purchase.cartId);
        purchase.products = cartid.products;
        const newTicket = await ticketModel.create(purchase);

        await UserMongoose.findOneAndUpdate({ _id: user._id }, { $push: { purchase_made: newTicket.code } });

        await cartService.clearCart(purchase.cartId);

        return newTicket;
      } else {
        console.log('The product could not be created due to lack of stock');
      }
    } catch (error) {
      throw error;
    }
  }

  async controlStock(products) {
    try {
      for (const productData of products) {
        const productId = productData.product.toString();
        const product = await productModel.readById(productId);
        if (product.stock >= productData.quantity) {
          product.stock = product.stock - 1;
          await product.save();
          console.log('Stock discounted correctly. The current Stock is: ', product.stock);
        } else {
          console.log(`There is not enough stock for the product ${productId}`);
          return false;
        }
        return true;
      }
    } catch (error) {
      throw error;
    }
  }
}

export const ticketService = new TicketService();
