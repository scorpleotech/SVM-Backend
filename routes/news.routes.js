const express = require("express");
const router = express.Router();
const {
  createNews,
  deleteNewsById,
  getAllNews,
  getNewsById,
  updateNewsById,
} = require("../controllers/news.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all News
router.get("/", getAllNews);

// Route for getting a specific News by ID
router.get("/:id", getNewsById);

// Route for creating a new News
router.post("/", authenticate, createNews);

// Route for updating a News by ID
router.put("/:id", authenticate, updateNewsById);

// Route for deleting a News by ID
router.delete("/:id", authenticate, deleteNewsById);

module.exports = router;
