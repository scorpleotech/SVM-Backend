const express = require("express");
const router = express.Router();
const {
  createVisitUs,
  deleteVisitUsById,
  getAllVisitUs,
  getVisitUsById,
  updateVisitUsById,
  downloadExcel,
} = require("../controllers/visitus.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all testdrive
router.get("/", authenticate, getAllVisitUs);

router.get("/download", downloadExcel);

// Route for getting a specific testdrive by ID
router.get("/:id", authenticate, getVisitUsById);

// Route for creating a new testdrive
router.post("/", createVisitUs);

// Route for updating a testdrive by ID
router.put("/:id", authenticate, updateVisitUsById);

// Route for deleting a testdrive by ID
router.delete("/:id", authenticate, deleteVisitUsById);

module.exports = router;
