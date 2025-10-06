const express = require("express");
const router = express.Router();
const {
  createAccessory,
  deleteAccessoryById,
  getAccessoryById,
  getAllAccessory,
  updateAccessoryById,
  getActiveAccessory,
  updateisActiveByAccessoryId,
  getAccessoryByCouponCode,
} = require("../controllers/accessories.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all accessories
router.get("/", authenticate, getAllAccessory);

// Route for get active Accessories
router.get("/active", getActiveAccessory);

// Route for getting a specific accessories by ID
router.get("/:id", authenticate, getAccessoryById);

// Route for creating a new accessories
router.post("/", authenticate, createAccessory);

// Route for updating a accessories by ID
router.put("/:id", authenticate, updateAccessoryById);

// Route for deleting a accessories by ID
router.delete("/:id", authenticate, deleteAccessoryById);

// Route for update active data by id
router.post("/active/:id", authenticate, updateisActiveByAccessoryId);

// router.post("/coupon", getAccessoryByCouponCode);

// Route for getting a specific accessories by ID
router.get("/coupon/:coupon", getAccessoryByCouponCode);

module.exports = router;
