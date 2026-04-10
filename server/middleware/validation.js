const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

const validateResume = [
  body("full_name").optional().trim().escape(),
  body("email").optional().isEmail().normalizeEmail(),
  body("phone").optional().trim().escape(),
  body("location").optional().trim().escape(),
  body("professional_summary").optional().trim().escape(),
  body("experience").optional().isArray(),
  body("education").optional().isArray(),
  body("skills").optional().isArray(),
  body("template").optional().isIn(["modern", "professional", "creative"]),
  handleValidationErrors,
];

module.exports = {
  validateResume,
  handleValidationErrors,
};
