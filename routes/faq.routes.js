const express = require("express");
const router = express.Router();
const {
  createFAQ,
  deleteFAQById,
  getAllFAQ,
  getFAQById,
  updateFAQById,
} = require("../controllers/faq.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all blogs
router.get("/", getAllFAQ);

// Route for getting a specific blog by ID
router.get("/:id", authenticate, getFAQById);

// Route for creating a new blog
router.post("/", authenticate, createFAQ);

// Route for updating a blog by ID
router.put("/:id", authenticate, updateFAQById);

// Route for deleting a blog by ID
router.delete("/:id", authenticate, deleteFAQById);

module.exports = router;
