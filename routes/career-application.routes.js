const express = require("express");
const router = express.Router();
const careerApplicationController = require("../controllers/career-application.controller");
const multer = require("multer");

const passport = require("passport");
// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/resume");
  },
  filename: function (req, file, cb) {
    const randomNumber = Math.random().toString().replace(".", "");
    cb(null, randomNumber + "_" + file.originalname);
  },
});

// Filter files to accept only PDF, Word, and TXT files
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype === "text/plain"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, Word, and TXT files are allowed"), false);
  }
};

// Set up multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 6 }, // 6MB file size limit
  fileFilter: fileFilter,
});

// Upload resume API
router.post(
  "/upload-resume",
  upload.single("resume"),
  careerApplicationController.uploadResume
);

// Create a new career application
router.post("/", careerApplicationController.createCareerApplication);

// Get all career applications
router.get(
  "/",
  authenticate,
  careerApplicationController.getAllCareerApplications
);

// Get career application by id
router.get(
  "/:id",
  authenticate,
  careerApplicationController.getCareerApplicationById
);

// Update career application by id
router.put(
  "/:id",
  authenticate,
  careerApplicationController.updateCareerApplicationById
);

// Delete career application by id
router.delete(
  "/:id",
  authenticate,
  careerApplicationController.deleteCareerApplicationById
);

module.exports = router;
