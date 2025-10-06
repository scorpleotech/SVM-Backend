const BikeVarient = require("../models/bikevarient.model");

const path = require("path");

// Create BikeVarient
exports.createBikeVarient = async (req, res) => {
  try {
    const bikeVarient = new BikeVarient(req.body);
    await bikeVarient.save();
    res.status(201).json(bikeVarient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update BikeVarient By Id
exports.updateBikeVarientById = async (req, res) => {
  try {
    const { id } = req.params;
    const bikeVarient = await BikeVarient.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!bikeVarient) {
      return res.status(404).json({ message: "BikeVarient not found" });
    }
    res.json(bikeVarient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete BikeVarient
exports.deleteBikeVarient = async (req, res) => {
  try {
    const { id } = req.params;
    const bikeVarient = await BikeVarient.findByIdAndDelete(id);
    if (!bikeVarient) {
      return res.status(404).json({ message: "BikeVarient not found" });
    }
    res.json({ message: "BikeVarient deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get BikeVarient by ID
exports.getBikeVarientById = async (req, res) => {
  try {
    const { id } = req.params;
    const bikeVarient = await BikeVarient.findById(id);
    if (!bikeVarient) {
      return res.status(404).json({ message: "BikeVarient not found" });
    }
    res.json(bikeVarient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Get All BikeVarient
exports.getAllBikeVarient = async (req, res) => {
  try {
    const bikeVarient = await BikeVarient.find().sort({ updatedAt: -1 });
    if (!bikeVarient) {
      return res.status(404).json({ message: "BikeVarient not found" });
    }
    res.json(bikeVarient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getActiveBikeVarient = async (req, res) => {
  try {
    // Find all BikeVarients that are active
    const activeBikeVarient = await BikeVarient.find({ isActive: true });
    res.json(activeBikeVarient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateisActiveByBikeVarientId = async (req, res) => {
  try {
    const { id } = req.params;

    const bikeVarient = await BikeVarient.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!bikeVarient) {
      return res.status(404).json({ message: "BikeVarient not found" });
    }
    res.json({ message: "BikeVarient isActive updated", variant: "success" });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error, variant: "error" });
  }
};

// Get the count of all BikeVarient documents
exports.getBikeVarientCount = async (req, res) => {
  try {
    const count = await BikeVarient.countDocuments();
    res.json(count);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.downloadpdf = async (req, res) => {
  const filePath = path.join(
    __dirname,
    "..",
    "uploads",
    "specsheet",
    "PRANA_2.0_Spec_Sheet.pdf"
  );
  console.log("filepath", filePath);
  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Error downloading file");
    }
  });
};
