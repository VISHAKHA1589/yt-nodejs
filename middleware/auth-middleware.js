const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader);

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied, no token provided. Please login to continue",
    });
  }

  try {
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedTokenInfo);

    req.userInfo = decodedTokenInfo; // Attach user info to request object
    next(); // Pass control to the next middleware or route handler
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Invalid token. Access denied",
    });
  }
};




module.exports = authMiddleware;
 