const express = require("express");
const router = express.Router();
const {
  createEnquiry,
  deleteEnquiryById,
  getAllEnquiry,
  getEnquiryById,
  updateEnquiryById,
  downloadExcel,
} = require("../controllers/enquiry.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all enquiry
router.get("/", authenticate, getAllEnquiry);

router.get("/download", downloadExcel);

// Route for getting a specific enquiry by ID
router.get("/:id", authenticate, getEnquiryById);

// Route for creating a new enquiry
router.post("/", createEnquiry);

// Route for updating a enquiry by ID
router.put("/:id", authenticate, updateEnquiryById);

// Route for deleting a enquiry by ID
router.delete("/:id", authenticate, deleteEnquiryById);

module.exports = router;
