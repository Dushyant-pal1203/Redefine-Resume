const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../db/models");
const { protect } = require("../middleware/auth");
const { validate, userValidators } = require("../utils/validators");
const { AuthenticationError, NotFoundError } = require("../utils/errors");
const { Resume } = require("../db/models");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Set token cookie
const setTokenCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res.cookie("token", token, cookieOptions);
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  validate(userValidators.register),
  async (req, res, next) => {
    try {
      const { email, password, name } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new AuthenticationError("User already exists with this email");
      }

      // Create user
      const user = await User.create({
        email,
        password,
        name,
      });

      // Generate token
      const token = generateToken(user.id);

      // Set cookie
      setTokenCookie(res, token);

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;
      delete userResponse.resetPasswordToken;
      delete userResponse.resetPasswordExpire;

      res.status(201).json({
        success: true,
        data: userResponse,
        token,
      });
    } catch (error) {
      next(error);
    }
  },
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  validate(userValidators.login),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({
        where: { email },
        attributes: { include: ["password"] },
      });

      if (!user) {
        throw new AuthenticationError("Invalid credentials");
      }

      if (!user.isActive) {
        throw new AuthenticationError("Account is deactivated");
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new AuthenticationError("Invalid credentials");
      }

      // Update last login
      await user.update({ lastLogin: new Date() });

      // Generate token
      const token = generateToken(user.id);

      // Set cookie
      setTokenCookie(res, token);

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;
      delete userResponse.resetPasswordToken;
      delete userResponse.resetPasswordExpire;

      res.json({
        success: true,
        data: userResponse,
        token,
      });
    } catch (error) {
      next(error);
    }
  },
);

// @route   GET /api/auth/logout
// @desc    Logout user
// @access  Private
router.get("/logout", protect, (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", protect, async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

// @route   PUT /api/auth/updatedetails
// @desc    Update user details
// @access  Private
router.put("/updatedetails", protect, async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email;

    const user = await req.user.update(fieldsToUpdate);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/auth/updatepassword
// @desc    Update password
// @access  Private
router.put("/updatepassword", protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findByPk(req.user.id, {
      attributes: { include: ["password"] },
    });

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new AuthenticationError("Current password is incorrect");
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/auth/deleteaccount
// @desc    Delete logged in user account
// @access  Private
router.delete("/deleteaccount", protect, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    await user.destroy(); // Resumes auto deleted due to CASCADE

    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/backup
// @desc    Download user data backup
// @access  Private
router.get("/backup", protect, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Resume,
        },
      ],
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
