const express = require("express");
const router = express.Router();
const {
  createImageGallery,
  createVideoGallery,
  deleteImageGallery,
  deleteVideoGallery,
  getActiveImageGallery,
  getActiveVideoGallery,
  getAllImageGallery,
  getAllVideoGallery,
  getImageGalleryById,
  getVideoGalleryById,
  updateImageGalleryById,
  updateVideoGalleryById,
  updateisActiveByImageGalleryId,
  updateisActiveByVideoGalleryId,
} = require("../controllers/gallery(copy).controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all Image Gallery

router.get("/image", getAllImageGallery);
router.get("/image//active", getActiveImageGallery);

// Route for getting a specific Image Gallery by ID
router.get("/image/:id", getImageGalleryById);

// Route for creating a new Image Gallery
router.post("/image", authenticate, createImageGallery);

// Route for updating a Image Gallery by ID
router.put("/image/:id", authenticate, updateImageGalleryById);

// Route for deleting a Image Gallery by ID
router.delete("/image/:id", authenticate, deleteImageGallery);

// Route for update Isactive a Image Gallery by ID
router.post("/image/active/:id", authenticate, updateisActiveByImageGalleryId);

// Route for getting all Video Gallery
router.get("/video", getAllVideoGallery);
router.get("/video/active", getActiveVideoGallery);

// Route for getting a specific Video Gallery by ID
router.get("/video/:id", getVideoGalleryById);

// Route for creating a new Video Gallery
router.post("/video", authenticate, createVideoGallery);

// Route for updating a Video Gallery by ID
router.put("/video/:id", authenticate, updateVideoGalleryById);

// Route for deleting a Video Gallery by ID
router.delete("/video/:id", authenticate, deleteVideoGallery);

// Route for update Isactive a Video Gallery by ID
router.post("/video/active/:id", authenticate, updateisActiveByVideoGalleryId);

module.exports = router;
