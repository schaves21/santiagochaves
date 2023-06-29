export function checkUser(req, res, next) {
  if (req.session.email) {
    return next();
  }
  return res.status(401).render("error", { error: "Authentication error" });
}

export function checkAdmin(req, res, next) {
  if (req.session.email && req.session.isAdmin == true) {
    return next();
  }
  return res.status(401).render("error", { error: "Please login AS ADMIN!" });
}
