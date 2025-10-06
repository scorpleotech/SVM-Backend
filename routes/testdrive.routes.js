const express = require("express");
const router = express.Router();
const {
  getAllTestDrive,
  createTestDrive,
  deleteTestDriveById,
  getTestDriveById,
  updateTestDriveById,
} = require("../controllers/testdrive.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all testdrive
router.get("/", authenticate, getAllTestDrive);

// Route for getting a specific testdrive by ID
router.get("/:id", authenticate, getTestDriveById);

// Route for creating a new testdrive
router.post("/", createTestDrive);

// Route for updating a testdrive by ID
router.put("/:id", authenticate, updateTestDriveById);

// Route for deleting a testdrive by ID
router.delete("/:id", authenticate, deleteTestDriveById);

module.exports = router;
