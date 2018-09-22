function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(403).redirect('/');
}

module.exports = checkAuth;
