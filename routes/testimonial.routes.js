const express = require("express");
const router = express.Router();
const {
  createTestimonial,
  deleteTestimonialById,
  getAllTestimonial,
  getTestimonialById,
  updateTestimonialById,
} = require("../controllers/testimonial.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all blogs
router.get("/", getAllTestimonial);

// Route for getting a specific blog by ID
router.get("/:id", authenticate, getTestimonialById);

// Route for creating a new blog
router.post("/", authenticate, createTestimonial);

// Route for updating a blog by ID
router.put("/:id", authenticate, updateTestimonialById);

// Route for deleting a blog by ID
router.delete("/:id", authenticate, deleteTestimonialById);

module.exports = router;
