export function checkUser(req, res, next) {
  if (req.session?.user?.email && req.session?.user?.rol == 'user') {
    return next();
  }
  return res.status(401).render('error', { error: 'Access denied. Only users are allowed.' });
}

export function checkAdmin(req, res, next) {
  if (req.session?.user?.email && req.session?.user?.rol == 'admin') {
    return next();
  }
  return res.status(401).render('error', { error: 'Access denied. Only admins are allowed.' });
}

export function checkCart(req, res, next) {
  const cartUser = req.session.user.cartID;
  const cartId = req.params.cid;
  if (cartUser == cartId) {
    return next();
  } else {
    const errorCart = 'The cart you want to access does not correspond to your user';
    return res.status(500).render('error', { errorCart });
  }
}
