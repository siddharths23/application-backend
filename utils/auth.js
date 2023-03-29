const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  const actualToken = token.split(" ")[1]; // Extract the actual token

  try {
    const decoded = jwt.verify(actualToken, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Token is not valid." });
  }
};

module.exports = authMiddleware;
