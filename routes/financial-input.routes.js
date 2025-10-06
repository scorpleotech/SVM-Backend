const express = require("express");
const router = express.Router();
const FinancialInputController = require("../controllers/financial-input.controller");

// Create a new vehicle
router.post("/", FinancialInputController.createFinancialInput);

// Get all vehicles
router.get("/", FinancialInputController.getAllFinancialInputs);

// Get a specific vehicle
router.get("/:id", FinancialInputController.getFinancialInputById);

// Update a vehicle
router.put("/:id", FinancialInputController.updateFinancialInput);

// Delete a vehicle
router.delete("/:id", FinancialInputController.deleteFinancialInput);

module.exports = router;
