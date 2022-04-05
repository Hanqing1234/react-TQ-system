const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; //Authorization: 'Bearer TOKEN'
   
    if (!token) {
      throw new HttpError("Authentication failed3");
    }
    const decodedToken = jwt.verify(token, "secret_dont_share");
    
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed222", 401);
    return next(error);
  }
};