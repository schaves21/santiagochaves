import { cartMongoose } from '../mongo/schemas/carts.mongoose.js';
import { productMongoose } from '../mongo/schemas/products.mongoose.js';
import { ticketMongoose } from '../mongo/schemas/tickets.mongoose.js';
import { logger } from '../../utils/logger.js';

export default class ViewModel {
  constructor() {}

  async getProductsView() {
    try {
      const allProducts = await productMongoose.find({});
      return allProducts;
    } catch (err) {
      logger.error(err);
    }
  }

  async paginate(filter, options) {
    try {
      const product = await productMongoose.paginate(filter, options);
      return product;
    } catch (err) {
      logger.error(err);
    }
  }

  async viewProductById(productId) {
    try {
      const product = await productMongoose.findById(productId);
      return product;
    } catch (err) {
      logger.error(err);
    }
  }

  async viewCartById(cid) {
    try {
      const cart = await cartMongoose.findById(cid).populate('products.product');
      const cartView = cart.products.map((item) => ({
        _id: cart._id,
        thumbnail: item.product.thumbnail,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
      }));
      return { cartView };
    } catch (err) {
      logger.error(err);
    }
  }

  async viewPurchaseByEmail(email) {
    try {
      const ticketUser = await ticketMongoose.find({ purchaser: email });
      return ticketUser;
    } catch (err) {
      logger.error(err);
    }
  }
}
