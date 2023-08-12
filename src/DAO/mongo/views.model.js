import { cartMongoose } from '../mongo/schemas/carts.mongoose.js';
import { productMongoose } from '../mongo/schemas/products.mongoose.js';

class ViewModel {
  async paginate(filter, options) {
    try {
      const product = await productMongoose.paginate(filter, options);

      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  async viewProductById(productId) {
    try {
      const product = await productMongoose.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  async viewCartById(cid) {
    try {
      const cart = await cartMongoose.findById(cid).populate('products.product');
      const cartView = cart.products.map((item) => ({
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
      }));
      return cartView;
    } catch (error) {
      throw error;
    }
  }
}

export const viewModel = new ViewModel();
