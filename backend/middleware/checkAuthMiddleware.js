const jwt = require("jsonwebtoken");
const jwtToken = require("../config/jsonWebToken.js");

const checkAuthUser = (req, res, next) => {
  const token = req.cookies.token ?? req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const user = jwt.verify(token, jwtToken);
    req.authUser = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized access - Invalid token",
    });
  }
};

const checkAuthAdmin = (req, res, next) => {
  const token = req.cookies.token ?? req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const user = jwt.verify(token, jwtToken);

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Forbidden - Admins only" });
    }
    
    req.authUser = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized access",
      data: error.message,
    });
  }
};

module.exports = {
  checkAuthUser,
  checkAuthAdmin,
};
