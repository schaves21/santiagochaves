import AuthDTO from './DTO/auth.dto.js';

class AuthController {
  async authLogin(req, res) {
    try {
      if (!req.user) {
        return res.json({ error: 'Invalid credentials' });
      }

      req.session.user = {
        _id: req.user._id.toString(),
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        age: req.user.age,
        rol: req.user.rol,
      };

      return res.redirect('/products');
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async authRegister(req, res) {
    try {
      if (!req.user) {
        return res.json({ error: 'Something went wrong' });
      }
      req.session.user = {
        _id: req.user._id.toString(),
        email: req.user.email,
        firstName: req.user.firstName,
        rol: req.user.rol,
      };

      return res.redirect('/products');
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async getCurrent(req, res) {
    try {
      const { firstName, lastName, email, rol } = req.session.user;
      const authDTO = new AuthDTO({ firstName, lastName, email, rol });
      const authUser = {
        firstName: authDTO.firstName,
        lastName: authDTO.lastName,
        email: authDTO.email,
        role: authDTO.rol,
      };
      return res.status(200).json({
        status: 'success',
        msg: 'User session data',
        data: { user: authUser },
      });
    } catch (e) {
      console.log(e);
    }
  }
}

export const authController = new AuthController();
