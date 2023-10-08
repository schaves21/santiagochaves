import { ViewModel } from '../DAO/factory.js';
import { logger } from '../utils/logger.js';

const viewModel = new ViewModel();

class ViewService {
  async getProductsView() {
    try {
      const allProducts = await viewModel.getProductsView();
      return allProducts;
    } catch (err) {
      logger.error(err);
    }
  }

  async getProducts(queryParams) {
    try {
      const { limit = 10, page = 1, sort, query } = queryParams;
      const filter = {};

      if (query) {
        filter.$or = [{ category: query }, { availability: query }];
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort === 'desc' ? '-price' : 'price',
      };

      const result = await viewModel.paginate(filter, options);

      const response = {
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.hasPrevPage ? result.prevPage : null,
        nextPage: result.hasNextPage ? result.nextPage : null,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}` : null,
        nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}` : null,
      };
      return response;
    } catch (err) {
      logger.error(err);
    }
  }

  async viewProductById(productId) {
    try {
      const product = await viewModel.viewProductById(productId);
      return product;
    } catch (err) {
      logger.error(err);
    }
  }

  async viewCartById(cid) {
    try {
      const cart = await viewModel.viewCartById(cid);
      logger.debug(`Cart found in BD: ${cart}`);
      return cart;
    } catch (err) {
      logger.error(err);
    }
  }
  async viewPurchaseByEmail(email) {
    try {
      const ticketUser = await viewModel.viewPurchaseByEmail(email);
      return ticketUser;
    } catch (err) {
      logger.error(err);
    }
  }
}

export const viewService = new ViewService();
