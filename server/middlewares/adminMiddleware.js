const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== 1 && req.user.role !== 2 ) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
}

export default adminMiddleware;