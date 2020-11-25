const { check, validationResult } = require("express-validator");

const checkValidation = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};
exports.validateLogin = [
  check("email")
    .normalizeEmail({ gmail_remove_dots: false })
    .notEmpty()
    .withMessage("Email cannot be blank")
    .bail()
    .isEmail()
    .withMessage("Email is not valid"),
  check("key")
    .isLength(5)
    .withMessage("Key must be at least 5 characters long"),
  checkValidation,
];
exports.validateUser = [
  check("name").notEmpty().withMessage("Name cannot be blank"),
  check("userType")
    .notEmpty()
    .withMessage("userType cannot be blank")
    .bail()
    .isIn(["admin", "user"])
    .withMessage("userType must be admin or user"),
  check("email")
    .normalizeEmail({ gmail_remove_dots: false })
    .notEmpty()
    .withMessage("Email cannot be blank")
    .bail()
    .isEmail()
    .withMessage("Email is not valid"),
  check("key")
    .isLength(5)
    .withMessage("Key must be at least 5 characters long"),
  checkValidation,
];
exports.validateProject = [
  check("slug")
    .notEmpty()
    .withMessage("Slug cannot be blank")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Slug must be at least 3 characters long.")
    .bail()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Slug must be only letters."),
  check("name").notEmpty().withMessage("Name cannot be blank"),
  check("description")
    .notEmpty()
    .withMessage("description cannot be blank")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long."),
  checkValidation,
];
exports.validateIssues = [
  check("title")
    .notEmpty()
    .withMessage("Title cannot be blank")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long."),
  check("description")
    .notEmpty()
    .withMessage("description cannot be blank")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long."),
  check("status")
    .notEmpty()
    .withMessage("Status cannot be blank")
    .bail()
    .isIn(["open", "wip", "blocked", "closed"])
    .withMessage("Status must Be: open, wip, blocked or closed"),
  check("dueDate")
    .notEmpty()
    .withMessage("Due Date cannot be blank")
    .bail()
    .toDate()
    .notEmpty()
    .withMessage("dueDate must be a valid date YYYY-MM-DD"),
  checkValidation,
];
exports.validateComments = [
  check("text")
    .notEmpty()
    .withMessage("Text cannot be blank")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Text must be at least 3 characters long."),
  checkValidation,
];
