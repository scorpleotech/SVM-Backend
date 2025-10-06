const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  getAllGallery,
  createGallery,
  getGalleryById,
  updateGalleryById,
  deleteGallery,
} = require("../controllers/gallery.controller");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all footer
router.get("/", getAllGallery);

router.post("/", createGallery);

router.get("/:id", getGalleryById);

router.put("/:id", updateGalleryById);

router.delete("/:id", deleteGallery);

module.exports = router;
