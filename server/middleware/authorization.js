const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    // Step 1. Destructure the token from request headers. If not JWT is found, throw error
    const jwtToken = req.header("token");

    if (!jwtToken) {
      res.status(403).send("Unauthorized access - no JWT");
    }

    // Step 2. Validate the JWT token. If validated, add the payload (user ID) to the request
    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = payload.user;

    next();
  } catch (error) {
    next(error);
    res.status(403).send("Unauthorized access");
  }
};
