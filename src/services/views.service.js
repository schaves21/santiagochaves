import { viewModel } from '../dao/models/views.model.js';

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
      throw error;
    }
  }

  async viewProductById(productId) {
    try {
      const product = await viewModel.viewProductById(productId);
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
      const cart = await viewModel.viewCartById(cid);
      if (!cart) {
        throw new Error('Cart not found');
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }
}

export const viewService = new ViewService();
