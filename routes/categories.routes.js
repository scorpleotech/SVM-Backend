const express = require("express");
const router = express.Router();
const {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  getTotalCategoriesCount,
  updateCategory,
} = require("../controllers/categories.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all categories
router.get("/", getAllCategories);

// Route for getting all categories
router.get("/count", authenticate, getTotalCategoriesCount);

// Route for getting a specific category by ID
router.get("/:id", getCategoryById);

// Route for creating a new category
router.post("/", authenticate, createCategory);

// Route for updating a category by ID
router.put("/:id", authenticate, updateCategory);

// Route for deleting a category by ID
router.delete("/:id", authenticate, deleteCategory);

module.exports = router;
