const Aboutus = require("../models/aboutus.model");

// Create aboutus
exports.createAboutus = async (req, res) => {
  try {
    const aboutus = new Aboutus(req.body);
    await aboutus.save();
    res.status(201).json(aboutus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update aboutus By Id
exports.updateAboutusById = async (req, res) => {
  try {
    const { id } = req.params;
    const aboutus = await Aboutus.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!aboutus) {
      return res.status(404).json({ message: "Aboutus not found" });
    }
    res.json(aboutus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete aboutus
exports.deleteAboutus = async (req, res) => {
  try {
    const { id } = req.params;
    const aboutus = await Aboutus.findByIdAndDelete(id);
    if (!aboutus) {
      return res.status(404).json({ message: "Aboutus not found" });
    }
    res.json({ message: "Aboutus deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get aboutus by ID
exports.getAboutusById = async (req, res) => {
  try {
    const { id } = req.params;
    const aboutus = await Aboutus.findById(id);
    if (!aboutus) {
      return res.status(404).json({ message: "Aboutus not found" });
    }
    res.json(aboutus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Get All aboutus
exports.getAllAboutus = async (req, res) => {
  try {
    const aboutus = await Aboutus.find().sort({ updatedAt: -1 });
    if (!aboutus) {
      return res.status(404).json({ message: "Aboutus not found" });
    }
    res.json(aboutus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getActiveAboutus = async (req, res) => {
  try {
    // Find all banners that are active
    const activeaboutus = await Aboutus.find({ isActive: true });
    res.json(activeaboutus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateisActiveByAboutusId = async (req, res) => {
  try {
    const { id } = req.params;

    const aboutus = await Aboutus.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!aboutus) {
      return res.status(404).json({ message: "Aboutus not found" });
    }
    res.json({ message: "Aboutus isActive updated", variant: "success" });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error, variant: "error" });
  }
};
