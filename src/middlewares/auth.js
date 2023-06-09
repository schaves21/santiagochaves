export function checkUser(req, res, next) {
  if (req.session?.user?.email) {
    return next();
  }
  return res.status(401).render("error", { error: "Authentication error" });
}

export function checkAdmin(req, res, next) {
  if (req.session?.user?.isAdmin) {
    return next();
  }
  return res.status(401).render("error", { error: "Please login AS ADMIN!" });
}
