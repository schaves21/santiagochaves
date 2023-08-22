import { cartMongoose } from '../mongo/schemas/carts.mongoose.js';
import { productMongoose } from '../mongo/schemas/products.mongoose.js';
import { CustomError } from '../../utils/errors/custom-error.js';
import { EErrors } from '../../utils/errors/dictionary-error.js';

export default class ViewModel {
  constructor() {}
  async paginate(filter, options) {
    try {
      const product = await productMongoose.paginate(filter, options);

      if (!product) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }
      return product;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
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
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
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
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
    }
  }
}
