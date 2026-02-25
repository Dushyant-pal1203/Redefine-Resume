const jwt = require("jsonwebtoken");
const { User } = require("../db/models");
const { AuthenticationError, AuthorizationError } = require("../utils/errors");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Check Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AuthenticationError("Not authorized to access this route");
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findByPk(decoded.id, {
        attributes: {
          exclude: ["password", "resetPasswordToken", "resetPasswordExpire"],
        },
      });

      if (!user) {
        throw new AuthenticationError("User not found");
      }

      if (!user.isActive) {
        throw new AuthorizationError("Account is deactivated");
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new AuthenticationError("Token expired");
      }
      if (error.name === "JsonWebTokenError") {
        throw new AuthenticationError("Invalid token");
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError("Not authenticated"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AuthorizationError("Not authorized to perform this action"),
      );
    }

    next();
  };
};

module.exports = { protect, authorize };
