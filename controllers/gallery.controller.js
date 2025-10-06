const Gallery = require("../models/gallary.model");

// Create gallery
exports.createGallery = async (req, res) => {
  try {
    const gallery = new Gallery(req.body);
    await gallery.save();
    res.status(201).json(gallery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update gallery By Id
exports.updateGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }
    res.json(gallery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete gallery
exports.deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findByIdAndDelete(id);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }
    res.json({ message: "Gallery deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get gallery by ID
exports.getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }
    res.json(gallery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Get All gallery with filter send in query
exports.getAllGallery = async (req, res) => {
  try {
    const filter = {};
    if (req.query.file_type) {
      filter.file_type = req.query.file_type;
    }
    const gallery = await Gallery.find(filter);
    res.json(gallery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
