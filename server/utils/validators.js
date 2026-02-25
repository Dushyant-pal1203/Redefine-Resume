const { body, param, query, validationResult } = require("express-validator");

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  };
};

const userValidators = {
  register: [
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .matches(/\d/)
      .withMessage("Password must contain a number"),
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
  ],
  login: [
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
};

const resumeValidators = {
  create: [
    body("resume_title")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Title must be less than 100 characters"),
    body("full_name")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Name must be less than 100 characters"),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Please provide a valid email")
      .normalizeEmail(),
    body("phone")
      .optional()
      .matches(/^[\d\s\-+()]+$/)
      .withMessage("Please provide a valid phone number"),
    body("template")
      .optional()
      .isIn(["modern", "professional", "creative", "minimal", "executive"])
      .withMessage("Invalid template selection"),
    body("experience")
      .optional()
      .isArray()
      .withMessage("Experience must be an array"),
    body("education")
      .optional()
      .isArray()
      .withMessage("Education must be an array"),
    body("skills").optional().isArray().withMessage("Skills must be an array"),
  ],
  update: [
    param("id").isUUID().withMessage("Invalid resume ID format"),
    body("resume_title")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Title must be less than 100 characters"),
    body("full_name")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Name must be less than 100 characters"),
    body("email")
      .optional() // Make optional for updates
      .isEmail()
      .withMessage("Please provide a valid email")
      .normalizeEmail(),
    body("phone")
      .optional()
      .matches(/^[\d\s\-+()]+$/)
      .withMessage("Please provide a valid phone number"),
    body("template")
      .optional()
      .isIn(["modern", "professional", "creative", "minimal", "executive"])
      .withMessage("Invalid template selection"),
    body("is_public")
      .optional()
      .isBoolean()
      .withMessage("is_public must be a boolean"),
    body("professional_summary").optional().trim(),
    body("location").optional().trim(),
    body("headline").optional().trim(),
    body("experience")
      .optional()
      .isArray()
      .withMessage("Experience must be an array"),
    body("education")
      .optional()
      .isArray()
      .withMessage("Education must be an array"),
    body("skills").optional().isArray().withMessage("Skills must be an array"),
    body("projects")
      .optional()
      .isArray()
      .withMessage("Projects must be an array"),
  ],
  id: [param("id").isUUID().withMessage("Invalid resume ID format")],
  userId: [param("userId").isUUID().withMessage("Invalid user ID format")],
};

const templateValidators = {
  id: [
    param("id")
      .isIn(["modern", "professional", "creative", "minimal", "executive"])
      .withMessage("Invalid template ID"),
  ],
};

module.exports = {
  validate,
  userValidators,
  resumeValidators,
  templateValidators,
};
