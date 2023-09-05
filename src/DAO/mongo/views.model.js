import { cartMongoose } from '../mongo/schemas/carts.mongoose.js';
import { productMongoose } from '../mongo/schemas/products.mongoose.js';
import { ticketMongoose } from '../mongo/schemas/tickets.mongoose.js';
import { CustomError } from '../../utils/errors/custom-error.js';
import { EErrors } from '../../utils/errors/dictionary-error.js';

export default class ViewModel {
  constructor() {}

  async getAllProducts() {
    try {
      const allProducts = await productMongoose.find({}).limit(10);
      if (!allProducts) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }
      return allProducts;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async paginate(filter, options) {
    try {
      const product = await productMongoose.paginate(filter, options);

      if (!product) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }
      return product;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async viewProductById(productId) {
    try {
      const product = await productMongoose.findById(productId);
      if (!product) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }
      return product;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async viewCartById(cid) {
    try {
      const cart = await cartMongoose.findById(cid).populate('products.product');
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      const cartView = cart.products.map((item) => ({
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
      }));
      return cartView;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async viewPurchaseById(tid) {
    try {
      const ticket = await ticketMongoose.findById(tid).populate('products.product');
      if (!ticket) {
        throw new CustomError(EErrors.TICKET_NOT_FOUND.code, EErrors.TICKET_NOT_FOUND.name, EErrors.TICKET_NOT_FOUND.cause, EErrors.TICKET_NOT_FOUND.message);
      }
      /*
      const ticketView = ticket.products.map((item) => ({
        id: item.productId,
        quantity: item.quantity,
      }));
      */
      return ticket;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }
}
