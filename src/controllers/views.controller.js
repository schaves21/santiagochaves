import { viewService } from '../services/views.service.js';
import { authService } from '../services/auth.service.js';
import { productService } from '../services/products.service.js';
import ProductDTO from './DTO/products.dto.js';
import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';
import { logger } from '../utils/logger.js';

class ViewController {
  getHome(_, res, next) {
    try {
      res.render('home');
    } catch (err) {
      next(err);
    }
  }

  getLogin(_, res, next) {
    try {
      const title = 'Mega-Friday® - Login';
      return res.status(200).render('login', { title });
    } catch (err) {
      next(err);
    }
  }

  getMenu(req, res, next) {
    try {
      if (!req.user) {
        logger.info('No user found in the request object');
        throw new CustomError(EErrors.INVALID_EMAIL_PASSWORD.code, EErrors.INVALID_EMAIL_PASSWORD.name, EErrors.INVALID_EMAIL_PASSWORD.cause, EErrors.INVALID_EMAIL_PASSWORD.message);
      }
      const title = 'Mega-Friday® - Menu';
      const { firstName, lastName, rol } = req.session.user;
      return res.render('menu', { title, firstName, lastName, rol });
    } catch (err) {
      next(err);
    }
  }

  async getLogout(req, res, next) {
    try {
      await authService.updateLastConnection(req.session.user._id);

      req.session.destroy((err) => {
        if (err) {
          return res.render('error', { error: 'could not close the session' });
        }
        return res.redirect('/login');
      });
    } catch (err) {
      next(err);
    }
  }

  getRegister(_, res, next) {
    try {
      const title = 'Mega-Friday® - Register';
      return res.status(200).render('register', { title });
    } catch (err) {
      next(err);
    }
  }

  getProfile(req, res, next) {
    try {
      const user = req.session.user;
      res.render('profile', { user: user });
    } catch (err) {
      next(err);
    }
  }

  getAdmin(_, res, next) {
    try {
      res.render('admin');
    } catch (err) {
      next(err);
    }
  }

  getRealTimeProducts(_, res, next) {
    try {
      res.render('realtimeproducts');
    } catch (err) {
      next(err);
    }
  }

  getChats(_, res, next) {
    try {
      res.render('chat');
    } catch (err) {
      next(err);
    }
  }

  async getProducts(req, res, next) {
    try {
      const user = req.session.user;

      const { limit = 10, page = 1, sort, query } = req.query;
      const queryParams = { limit, page, sort, query };
      const { payload: products, totalPages, prevPage, nextPage, page: currentPage, hasPrevPage, hasNextPage, prevLink, nextLink } = await viewService.getProducts(queryParams);
      if (!products) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }
      let productsViews = products.map((item) => {
        return {
          _id: item._id.toString(),
          title: item.title,
          description: item.description,
          code: item.code,
          price: item.price,
          status: item.status,
          stock: item.stock,
          category: item.category,
          thumbnail: item.thumbnail,
        };
      });

      logger.debug('Rendering products view with user data:', user);

      return res.render('products', {
        status: 'success',
        user: user,
        products: productsViews,
        totalPages,
        prevPage,
        nextPage,
        currentPage,
        hasPrevPage,
        hasNextPage,
        prevLink: prevLink?.substring(4) || '',
        nextLink: nextLink?.substring(4) || '',
      });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async viewProductById(req, res, next) {
    try {
      const { pid } = req.params;

      //logger.debug(`Product id received by parameter: ${pid}`);

      const product = await viewService.viewProductById(pid);

      if (!product) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }

      const productsViews = {
        _id: product._id.toString(),
        title: product.title,
        description: product.description,
        code: product.code,
        price: product.price,
        status: product.status,
        stock: product.stock,
        category: product.category,
        thumbnail: product.thumbnail,
      };
      res.render('product', { product: productsViews });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async viewCartById(req, res, next) {
    try {
      const { cid } = req.params;

      logger.debug(`Cart id received by parameter: ${cid}`);

      const cart = await viewService.viewCartById(cid);
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }
      res.render('cart', { cart });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async viewPurchaseByEmail(req, res, next) {
    try {
      const email = req.session.user.email;
      const ticketUser = await viewService.viewPurchaseByEmail(email);

      if (ticketUser && ticketUser.purchaser) {
        res.render('purchases', {
          _id: ticketUser._id.toString(),
          code: ticketUser.code,
          purchase_datetime: ticketUser.purchase_datetime,
          amount: ticketUser.amount,
          purchaser: ticketUser.purchaser,
          products: ticketUser.products.map((product) => ({
            productId: product.productId.toString(),
            quantity: product.quantity,
          })),
        });
      } else {
        const message = 'User without purchases';
        res.render('purchases', {
          message,
        });
      }
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  // **************** CRUD PRODUCT ADMINISTRATOR **************** //
  async readProductsView(_, res, next) {
    try {
      const allProducts = await viewService.getProductsView();

      const productsViews = allProducts.map((product) => ({
        _id: product._id.toString(),
        title: product.title,
        description: product.description,
        code: product.code,
        price: product.price,
        status: product.status,
        stock: product.stock,
        category: product.category,
        thumbnail: product.thumbnail,
        owner: product.owner,
      }));

      res.render('crud-products', { products: productsViews });
    } catch (err) {
      next(err);
    }
  }

  async productByIdView(req, res, next) {
    try {
      const { pid } = req.params;

      logger.debug(`Product id received by parameter: ${pid}`);

      const product = await viewService.viewProductById(pid);

      if (!product) {
        throw new CustomError(EErrors.PRODUCT_NOT_FOUND.code, EErrors.PRODUCT_NOT_FOUND.name, EErrors.PRODUCT_NOT_FOUND.cause, EErrors.PRODUCT_NOT_FOUND.message);
      }

      const productsViews = {
        _id: product._id.toString(),
        title: product.title,
        description: product.description,
        code: product.code,
        price: product.price,
        status: product.status,
        stock: product.stock,
        category: product.category,
        thumbnail: product.thumbnail,
      };
      res.render('crud-products', { products: productsViews });
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async createProductView(req, res, next) {
    try {
      const { title, description, code, price, stock, category, thumbnail } = req.body;

      const owner = req.session.user.email;

      if (!title || !description || !code || !price || !stock || !category || !thumbnail) {
        throw new CustomError(EErrors.INVALID_INPUT_ERROR.code, EErrors.INVALID_INPUT_ERROR.name, EErrors.INVALID_INPUT_ERROR.cause, EErrors.INVALID_INPUT_ERROR.message);
      }

      let product = new ProductDTO({ title, description, code, price, stock, category, thumbnail, owner });
      const productCreated = await productService.create(product);

      if (productCreated) {
        res.redirect('/crud-products');
      }
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async updateProductView(req, res, next) {
    try {
      const { pid } = req.params;

      const { title, description, code, price, status, stock, category, thumbnail, owner } = req.body;

      if (!title || !description || !code || !price || !stock || !category || !thumbnail) {
        throw new CustomError(EErrors.INVALID_INPUT_ERROR.code, EErrors.INVALID_INPUT_ERROR.name, EErrors.INVALID_INPUT_ERROR.cause, EErrors.INVALID_INPUT_ERROR.message);
      }

      let product = new ProductDTO({ title, description, code, price, status, stock, category, thumbnail, owner });
      const productUpdated = await productService.updateOne(pid, product);

      if (productUpdated) {
        res.redirect('/crud-products');
      }
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }

  async deleteProductView(req, res, next) {
    try {
      const { pid } = req.params;

      logger.debug(`Product id received by parameter: ${pid}`);

      const productDeleted = await productService.deleteProductView(pid);

      if (productDeleted) {
        res.redirect('/crud-products');
      }
    } catch (err) {
      logger.error(err.message);
      next(err);
    }
  }
}

export const viewController = new ViewController();
