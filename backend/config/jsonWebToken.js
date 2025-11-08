const jwt = require("jsonwebtoken");

const jwtToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    expires: expiresAt,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return token;
};
module.exports = jwtToken;
