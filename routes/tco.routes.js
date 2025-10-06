const express = require("express");
const router = express.Router();
const tcoController = require("../controllers/tco.controller");

// Create a new vehicle
router.post("/", tcoController.createTco);

// Get all vehicles
router.get("/", tcoController.getAllTcos);

// Get a specific vehicle
router.get("/:id", tcoController.getTcoById);

// Get two specific vehicles for comparison
router.get("/vehicle/comparison", tcoController.getComparison);

// Update a vehicle
router.put("/:id", tcoController.updateTco);

// Delete a vehicle
router.delete("/:id", tcoController.deleteTco);

module.exports = router;
