import { viewService } from '../services/views.service.js';

class ViewController {
  getHome(req, res) {
    res.render('home');
  }

  getLogin(req, res) {
    try {
      const title = 'Mega-Friday® - Login';
      return res.status(200).render('login', { title });
    } catch (err) {
      console.log(err);
      res.status(501).send({ status: 'error', msg: 'Server error', error: err });
    }
  }

  getLogout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.render('error', { error: 'could not close the session' });
      }
      return res.redirect('/login');
    });
  }

  getRegister(req, res) {
    try {
      const title = 'Mega-Friday® - Register';
      return res.status(200).render('register', { title });
    } catch (err) {
      console.log(err);
      res.status(501).send({ status: 'error', msg: 'Server error', error: err });
    }
  }

  getProfile(req, res) {
    const user = req.session.user;
    console.log(user);
    res.render('profile', { user: user });
  }

  getAdmin(req, res) {
    res.send('admin');
  }

  async getRealTimeProducts(req, res) {
    try {
      res.render('realtimeproducts');
    } catch (err) {
      console.log(err);
      res.status(501).send({ status: 'error', msg: 'Server error', error: err });
    }
  }

  async getProducts(req, res) {
    try {
      const user = req.session.user;

      req.session.user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        rol: req.user.rol,
      };

      const { limit = 10, page = 1, sort, query } = req.query;
      const queryParams = { limit, page, sort, query };
      const { payload: products, totalPages, prevPage, nextPage, page: currentPage, hasPrevPage, hasNextPage, prevLink, nextLink } = await viewService.getProducts(queryParams);
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
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Error in server' });
    }
  }

  async viewProductById(req, res) {
    try {
      const { pid } = req.params;
      const product = await viewService.viewProductById(pid);
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
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Error in server' });
    }
  }

  async viewCartById(req, res) {
    try {
      const { cid } = req.params;
      const cart = await viewService.viewCartById(cid);
      res.render('cart', { cart });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

export const viewController = new ViewController();
