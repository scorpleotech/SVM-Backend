const express = require("express");
const router = express.Router();
const {
  createEvent,
  deleteEventById,
  getAllEvents,
  getEventById,
  updateEventById,
} = require("../controllers/event.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all Event
router.get("/", getAllEvents);

// Route for getting a specific Event by ID
router.get("/:id", getEventById);

// Route for creating a new Event
router.post("/", authenticate, createEvent);

// Route for updating a Event by ID
router.put("/:id", authenticate, updateEventById);

// Route for deleting a Event by ID
router.delete("/:id", authenticate, deleteEventById);

module.exports = router;
