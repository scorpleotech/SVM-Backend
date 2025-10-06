const express = require("express");
const router = express.Router();
const {
  deleteProductBanner,
  getProductBannerById,
  getActiveProductBanner,
  getAllProductBanner,
  updateisActiveByProductBannerId,
  createProductBanner,
  updateProductBannerById,
} = require("../controllers/productbanner.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all Partner
router.get("/", getAllProductBanner);

router.get("/active", getActiveProductBanner);

// Route for getting a specific Partner by ID
router.get("/:id", getProductBannerById);

// Route for creating a new Partner
router.post("/", authenticate, createProductBanner);

// Route for updating a Partner by ID
router.put("/:id", authenticate, updateProductBannerById);

// Route for deleting a Partner by ID
router.delete("/:id", authenticate, deleteProductBanner);

// Route for update Isactive a Partner by ID
router.post("/active/:id", authenticate, updateisActiveByProductBannerId);

module.exports = router;
