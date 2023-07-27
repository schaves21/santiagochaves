class AuthController {
  async authLogin(req, res) {
    try {
      if (!req.user) {
        return res.json({ error: 'invalid credentials' });
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
        return res.json({ error: 'something went wrong' });
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

  getCurrent = (req, res) => {
    console.log(req.session);
    return res.status(200).json({
      status: 'success',
      msg: 'User session data',
      data: { user: req.session.user },
    });
  };
}

export const authController = new AuthController();
