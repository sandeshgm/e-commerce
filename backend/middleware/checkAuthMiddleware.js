const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/jwtSecret");  // <-- import secret string here

const checkAuthUser = (req, res, next) => {
  // Note: you set the cookie as 'jwt', so read 'jwt' here, not 'token'
  const tokenFromCookie = req.cookies?.jwt;
  const authHeader = req.headers?.authorization;
  const tokenFromHeader =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  const token = tokenFromCookie || tokenFromHeader;
  console.log("Token received from middleware", token);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const user = jwt.verify(token, jwtSecret);  // Use secret string here
    console.log("JWT verified user:", user);
    req.authUser = user;
    next();
  } catch (error) {
    console.log("JWT verification failed:", error.message);
    res.status(401).json({
      message: "Unauthorized access - Invalid token",
    });
  }
};

const checkAuthAdmin = (req, res, next) => {
  const tokenFromCookie = req.cookies?.jwt;
  const authHeader = req.headers?.authorization;
  const tokenFromHeader =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const user = jwt.verify(token, jwtSecret);

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Forbidden - Admins only" });
    }

    req.authUser = user;
    next();
  } catch (error) {
    console.log("JWT verification failed:", error.message);
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
