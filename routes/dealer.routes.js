const express = require("express");
const router = express.Router();
const {
  createDealer,
  deleteDealer,
  getAllDealer,
  getDealerById,
  updateDealerById,
  exportAllDealer,
} = require("../controllers/dealer.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all dealer
router.get("/", authenticate, getAllDealer);

// Route for getting a specific dealer by ID
router.get("/:id", authenticate, getDealerById);

// Route for creating a new dealer
router.post("/", createDealer);

// Route for updating a dealer by ID
router.put("/:id", authenticate, updateDealerById);

// Route for deleting a dealer by ID
router.delete("/:id", authenticate, deleteDealer);
router.get("/export/dealer", exportAllDealer);

module.exports = router;
