const express = require("express");
const router = express.Router();
const {
  deleteAboutus,
  getAboutusById,
  getActiveAboutus,
  getAllAboutus,
  updateisActiveByAboutusId,
  createAboutus,
  updateAboutusById,
} = require("../controllers/aboutus.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all aboutus
router.get("/", getAllAboutus);

router.get("/active", getActiveAboutus);

// Route for getting a specific aboutus by ID
router.get("/:id", getAboutusById);

// Route for creating a new aboutus
router.post("/", authenticate, createAboutus);

// Route for updating a aboutus by ID
router.put("/:id", authenticate, updateAboutusById);

// Route for deleting a aboutus by ID
router.delete("/:id", authenticate, deleteAboutus);

// Route for update Isactive a aboutus by ID
router.post("/active/:id", authenticate, updateisActiveByAboutusId);

module.exports = router;
