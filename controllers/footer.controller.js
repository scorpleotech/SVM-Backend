const Footer = require("../models/footer.model");

// Get all Footer
exports.getAllFooter = async (req, res) => {
  try {
    const footer = await Footer.find().sort({ createdAt: -1 });
    res.json(footer);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Footer by ID
exports.getFooterById = async (req, res) => {
  try {
    const footer = await Footer.findById(req.params.id);
    if (!footer) {
      return res.status(404).json({ message: "Footer not found" });
    }
    res.json(footer);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// create a Footer
exports.createFooter = async (req, res) => {
  try {
    // Create a new Footer instance
    const newFooter = new Footer(req.body);

    // Save the new test drive entry to the database
    const savedFooter = await newFooter.save();

    // Respond with the newly created test drive entry
    res.status(201).json(savedFooter);
  } catch (error) {
    // If any error occurs during creation, respond with a 400 status and error message
    res
      .status(400)
      .json({ message: "Invalid data provided", error: error.message });
  }
};

// Update Footer by ID
exports.updateFooterById = async (req, res) => {
  try {
    const updatedFooter = await Footer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedFooter) {
      return res.status(404).json({ message: "Footer not found" });
    }
    res.json(updatedFooter);
  } catch (error) {
    res.status(400).json({ message: "Invalid data provided" });
  }
};

// Delete Footer by ID
exports.deleteFooterById = async (req, res) => {
  try {
    const deletedFooter = await Footer.findByIdAndDelete(req.params.id);
    if (!deletedFooter) {
      return res.status(404).json({ message: "Footer not found" });
    }
    res.json({ message: "Footer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
