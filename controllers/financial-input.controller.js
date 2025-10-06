const FinancialInput = require("../models/financial-inputs.model");

// Create a new vehicle
exports.createFinancialInput = async (req, res) => {
  try {
    const financialInput = new FinancialInput(req.body);
    await financialInput.save();
    res.status(201).json(financialInput);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all vehicles
exports.getAllFinancialInputs = async (req, res) => {
  try {
    const financialInput = await FinancialInput.find();
    res.json(financialInput);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific vehicle
exports.getFinancialInputById = async (req, res) => {
  try {
    const financialInput = await FinancialInput.findById(req.params.id);
    if (!financialInput) {
      return res.status(404).json({ message: "Financial Input not found" });
    }
    res.json(financialInput);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a vehicle
exports.updateFinancialInput = async (req, res) => {
  try {
    const financialInput = await FinancialInput.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!financialInput) {
      return res.status(404).json({ message: "Financial Input not found" });
    }
    res.json(financialInput);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a vehicle
exports.deleteFinancialInput = async (req, res) => {
  try {
    const financialInput = await FinancialInput.findByIdAndDelete(
      req.params.id
    );
    if (!financialInput) {
      return res.status(404).json({ message: "Financial Input not found" });
    }
    res.json({ message: "Financial Input deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
