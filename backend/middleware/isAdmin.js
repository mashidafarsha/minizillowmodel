module.exports = function (req, res, next) {
    if (!req.user?.role || req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Admin access required' });
    }
    next();
  };