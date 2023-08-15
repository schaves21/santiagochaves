import getModel from '../DAO/factory.js';
import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';

const models = await getModel();
const viewModel = models.views;

class ViewService {
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
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
    }
  }

  async viewProductById(productId) {
    try {
      const product = await viewModel.viewProductById(productId);
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
      const cart = await viewModel.viewCartById(cid);
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      return cart;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
    }
  }
}

export const viewService = new ViewService();
