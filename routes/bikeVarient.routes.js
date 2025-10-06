const express = require("express");
const router = express.Router();
const {
  createBikeVarient,
  deleteBikeVarient,
  getActiveBikeVarient,
  getAllBikeVarient,
  getBikeVarientById,
  updateBikeVarientById,
  updateisActiveByBikeVarientId,
  getBikeVarientCount,
  downloadpdf,
} = require("../controllers/bikevarient.controller");
const passport = require("passport");

const path = require("path");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all BikeVarient
router.get("/", getAllBikeVarient);

router.get("/active", getActiveBikeVarient);

router.get("/active/counts", getBikeVarientCount);

// Route for getting a specific BikeVarient by ID
router.get("/:id", getBikeVarientById);

// Route for creating a new BikeVarient
router.post("/", authenticate, createBikeVarient);

// Route for updating a BikeVarient by ID
router.put("/:id", authenticate, updateBikeVarientById);

// Route for deleting a BikeVarient by ID
router.delete("/:id", authenticate, deleteBikeVarient);

// Route for update isActive a BikeVarient by ID
router.post("/active/:id", authenticate, updateisActiveByBikeVarientId);

router.get("/pdf/download", downloadpdf);

module.exports = router;
