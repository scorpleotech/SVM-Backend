const express = require("express");
const router = express.Router();
const {
  createBanner,
  deleteBanner,
  getActiveBanner,
  getAllBanner,
  getBannerById,
  updateBannerById,
  updateisActiveByBannerId,
} = require("../controllers/banner.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all banner
router.get("/", getAllBanner);

router.get("/active", getActiveBanner);

// Route for getting a specific banner by ID
router.get("/:id", getBannerById);

// Route for creating a new banner
router.post("/", authenticate, createBanner);

// Route for updating a banner by ID
router.put("/:id", authenticate, updateBannerById);

// Route for deleting a banner by ID
router.delete("/:id", authenticate, deleteBanner);

// Route for update isActive a banner by ID
router.post("/active/:id", authenticate, updateisActiveByBannerId);

module.exports = router;
