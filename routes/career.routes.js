const express = require("express");
const router = express.Router();
const careerController = require("../controllers/career.controller");

const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Create a new career
router.post("/", authenticate, careerController.createCareer);

// Update a career by id
router.put("/:id", authenticate, careerController.updateCareerById);

// Delete a career by id
router.delete("/:id", authenticate, careerController.deleteCareer);

// Get a career by id
router.get("/:id", careerController.getCareerById);

// Get all careers
router.get("/", careerController.getAllCareers);

module.exports = router;
