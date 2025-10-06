const express = require("express");
const router = express.Router();
const {
  createFooter,
  deleteFooterById,
  getAllFooter,
  getFooterById,
  updateFooterById,
} = require("../controllers/footer.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all footer
router.get("/", getAllFooter);

// Route for getting a specific footer by ID
router.get("/:id", authenticate, getFooterById);

// Route for creating a new footer
router.post("/", authenticate, createFooter);

// Route for updating a footer by ID
router.put("/:id", authenticate, updateFooterById);

// Route for deleting a footer by ID
router.delete("/:id", authenticate, deleteFooterById);

module.exports = router;
