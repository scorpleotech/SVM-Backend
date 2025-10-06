const Values = require("../models/values.model");

// Get all Values
exports.getAllValues = async (req, res) => {
  try {
    const values = await Values.find().sort({ createdAt: -1 });
    res.json(values);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Values by ID
exports.getValuesById = async (req, res) => {
  try {
    const values = await Values.findById(req.params.id);
    if (!values) {
      return res.status(404).json({ message: "Values not found" });
    }
    res.json(values);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// create a Values
exports.createValues = async (req, res) => {
  try {
    // Create a new Values instance
    const newValues = new Values(req.body);

    // Save the new test drive entry to the database
    const savedValues = await newValues.save();

    // Respond with the newly created test drive entry
    res.status(201).json(savedValues);
  } catch (error) {
    // If any error occurs during creation, respond with a 400 status and error message
    res
      .status(400)
      .json({ message: "Invalid data provided", error: error.message });
  }
};

// Update Values by ID
exports.updateValuesById = async (req, res) => {
  try {
    const updatedValues = await Values.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedValues) {
      return res.status(404).json({ message: "Values not found" });
    }
    res.json(updatedValues);
  } catch (error) {
    res.status(400).json({ message: "Invalid data provided" });
  }
};

// Delete Values by ID
exports.deleteValuesById = async (req, res) => {
  try {
    const deletedValues = await Values.findByIdAndDelete(req.params.id);
    if (!deletedValues) {
      return res.status(404).json({ message: "Values not found" });
    }
    res.json({ message: "Values deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
