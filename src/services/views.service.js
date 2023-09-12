import { ViewModel } from '../DAO/factory.js';
import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';
import { logger } from '../utils/logger.js';

const viewModel = new ViewModel();

class ViewService {
  async getProductsView() {
    try {
      const allProducts = await viewModel.getProductsView();

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

      if (!result) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }

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
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }

  async viewProductById(productId) {
    try {
      const product = await viewModel.viewProductById(productId);

      //logger.debug(`Product found in BD: ${product}`);

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
      const cart = await viewModel.viewCartById(cid);

      logger.debug(`Cart found in BD: ${cart}`);

      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      return cart;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }
  async viewPurchaseByEmail(email) {
    try {
      const ticketUser = await viewModel.viewPurchaseByEmail(email);

      //logger.debug(`Ticket found in BD: ${ticketUser}`);

      if (!ticketUser) {
        throw new CustomError(EErrors.TICKET_NOT_FOUND.code, EErrors.TICKET_NOT_FOUND.name, EErrors.TICKET_NOT_FOUND.cause, EErrors.TICKET_NOT_FOUND.message);
      }
      return ticketUser;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
    }
  }
}

export const viewService = new ViewService();
