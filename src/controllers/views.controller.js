import { viewService } from '../services/views.service.js';
import { authService } from '../services/auth.service.js';
import { productService } from '../services/products.service.js';
import { userService } from '../services/users.service.js';
import ProductDTO from './DTO/products.dto.js';
import { CustomError } from '../utils/errors/custom-error.js';
import { EErrors } from '../utils/errors/dictionary-error.js';
import { logger } from '../utils/logger.js';
import env from '../config/enviroment.config.js';
import { transport } from '../utils/nodemailer.js';

class ViewController {
  getHome(_, res) {
    try {
      res.render('home');
    } catch (err) {
      logger.error(err);
    }
  }

  getLogin(_, res) {
    try {
      const title = 'Mega-Friday® - Login';
      return res.status(200).render('login', { title });
    } catch (err) {
      logger.error(err);
    }
  }

  getMenu(req, res) {
    try {
      if (!req.user) {
        logger.info('No user found in the request object');
        throw new CustomError(EErrors.INVALID_EMAIL_PASSWORD.code, EErrors.INVALID_EMAIL_PASSWORD.name, EErrors.INVALID_EMAIL_PASSWORD.cause, EErrors.INVALID_EMAIL_PASSWORD.message);
      }
      const title = 'Mega-Friday® - Menu';
      const { firstName, lastName, rol } = req.session.user;
      return res.render('menu', { title, firstName, lastName, rol });
    } catch (err) {
      logger.error(err);
    }
  }

  async getLogout(req, res) {
    try {
      await authService.updateLastConnection(req.session.user._id);

      req.session.destroy((err) => {
        if (err) {
          return res.render('error', { error: 'could not close the session' });
        }
        return res.redirect('/login');
      });
    } catch (err) {
      logger.error(err);
    }
  }

  getRegister(_, res) {
    try {
      const title = 'Mega-Friday® - Register';
      return res.status(200).render('register', { title });
    } catch (err) {
      logger.error(err);
    }
  }

  getProfile(req, res) {
    try {
      const user = req.session.user;
      res.render('profile', { user: user });
    } catch (err) {
      logger.error(err);
    }
  }

  getAdmin(_, res) {
    try {
      res.render('admin');
    } catch (err) {
      logger.error(err);
    }
  }

  getRealTimeProducts(_, res) {
    try {
      res.render('realtimeproducts');
    } catch (err) {
      logger.error(err);
    }
  }

  getChats(_, res) {
    try {
      res.render('chat');
    } catch (err) {
      logger.error(err);
    }
  }

  async getProducts(req, res) {
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
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async viewProductById(req, res) {
    try {
      const { pid } = req.params;

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
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async viewCartById(req, res) {
    try {
      const { cid } = req.params;

      const cart = await viewService.viewCartById(cid);
      if (!cart) {
        throw new CustomError(EErrors.CART_NOT_FOUND.code, EErrors.CART_NOT_FOUND.name, EErrors.CART_NOT_FOUND.cause, EErrors.CART_NOT_FOUND.message);
      }

      res.render('cart', { cart: cart.cartView });
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async viewPurchaseByEmail(req, res) {
    try {
      const email = req.session.user.email;
      const ticketUser = await viewService.viewPurchaseByEmail(email);

      if (ticketUser && ticketUser.length > 0) {
        const purchases = ticketUser.map((purchase) => ({
          _id: purchase._id.toString(),
          code: purchase.code,
          purchase_datetime: purchase.purchase_datetime,
          amount: purchase.amount,
          purchaser: purchase.purchaser,
          products: purchase.products.map((product) => ({
            productId: product.productId.toString(),
            quantity: product.quantity,
          })),
        }));
        res.render('purchases', { purchases });
      } else {
        const message = 'User without purchases';
        res.render('purchases', { message });
      }
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  viewApiProductsMenu(_, res) {
    try {
      res.render('api-products-menu');
    } catch (err) {
      logger.error(err);
    }
  }

  viewApiProductById(_, res) {
    try {
      res.render('product-by-id');
    } catch (err) {
      logger.error(err);
    }
  }

  viewApiUsersMenu(_, res) {
    try {
      res.render('api-users-menu');
    } catch (err) {
      logger.error(err);
    }
  }

  viewApiUserById(_, res) {
    try {
      res.render('user-by-id');
    } catch (err) {
      logger.error(err);
    }
  }

  // **************** CRUD API USERS ROLE ADMIN **************** //
  async viewCrudApiUsers(_, res) {
    try {
      const allUsers = await userService.getAllUsers();

      const usersViews = allUsers.map((user) => ({
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        age: user.age,
        rol: user.rol,
      }));

      res.render('crud-api-users', { users: usersViews });
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  // **************** CRUD API PRODUCTS ADMIN / PREMIUM **************** //
  async viewCrudApiProducts(_, res) {
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

      res.render('crud-api-products', { products: productsViews });
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  viewApiCartsMenu(_, res) {
    try {
      res.render('crud-api-carts');
    } catch (err) {
      logger.error(err);
    }
  }

  viewApiTicketsMenu(_, res) {
    try {
      res.render('api-tickets');
    } catch (err) {
      logger.error(err);
    }
  }

  // **************** CRUD PRODUCT ADMINISTRATOR **************** //
  async readProductsView(_, res) {
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
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async createProductView(req, res) {
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
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async updateProductView(req, res) {
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
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async deleteProductView(req, res) {
    try {
      const { pid } = req.params;

      logger.debug(`Product id received by parameter: ${pid}`);

      const productDeleted = await productService.deleteProductView(pid);

      if (productDeleted) {
        res.redirect('/crud-products');
      }
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  // **************** Read Update Role Delete Inactive User **************** //
  async readUsersView(_, res) {
    try {
      const allUsers = await userService.getAllUsers();

      const usersViews = allUsers.map((user) => ({
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        rol: user.rol,
        last_connection: user.last_connection,
      }));

      res.render('rud-users', { users: usersViews });
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async updateUserRoleView(req, res) {
    try {
      const userId = req.params.uid;
      logger.debug(`User id received by parameter: ${userId}`);

      const updatedRole = await userService.updateRole(userId);

      if (updatedRole) {
        res.redirect('/rud-users');
      }
    } catch (err) {
      logger.error(err.message);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }

  async deleteInactiveUsersView(_, res) {
    try {
      const inactiveUsers = await userService.deleteInactiveUsers(2);

      for (const user of inactiveUsers) {
        const to = user.email;
        const subject = 'Account deleted due to inactivity';
        const htmlContent = `
        <div>
          <h2>Dear ${user.firstName},</h2>
          <p>Your account has been deleted due to inactivity for the last 2 days.</p>
        </div>`;

        await transport.sendMail({
          from: env.googleMail,
          to: to,
          subject: subject,
          html: htmlContent,
        });
      }

      res.redirect('/rud-users');
    } catch (err) {
      logger.error(err);
      throw new CustomError(EErrors.UNEXPECTED_ERROR.code, EErrors.UNEXPECTED_ERROR.name, EErrors.UNEXPECTED_ERROR.cause, EErrors.UNEXPECTED_ERROR.message);
    }
  }
}

export const viewController = new ViewController();
