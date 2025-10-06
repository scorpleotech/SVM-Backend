const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlogById,
  deleteBlogById,
  getAllBlogsByUserId,
} = require("../controllers/blog.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all blogs
router.get("/", getAllBlogs);

// Route for getting a specific blog by ID
router.get("/:id", getBlogById);

// Route for getting all blog by User ID
router.get("/user/:id", getAllBlogsByUserId);

// Route for creating a new blog
router.post("/", authenticate, createBlog);

// Route for updating a blog by ID
router.put("/:id", authenticate, updateBlogById);

// Route for deleting a blog by ID
router.delete("/:id", authenticate, deleteBlogById);

module.exports = router;
