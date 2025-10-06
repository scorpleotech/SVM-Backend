const express = require("express");
const router = express.Router();
const {
  createValues,
  deleteValuesById,
  getAllValues,
  getValuesById,
  updateValuesById,
} = require("../controllers/values.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all values
router.get("/", getAllValues);

// Route for getting a specific values by ID
router.get("/:id", authenticate, getValuesById);

// Route for creating a new values
router.post("/", authenticate, createValues);

// Route for updating a values by ID
router.put("/:id", authenticate, updateValuesById);

// Route for deleting a values by ID
router.delete("/:id", authenticate, deleteValuesById);

module.exports = router;
