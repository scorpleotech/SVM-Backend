const ImageGallery = require("../models/imagegallery.model");
const VideoGallery = require("../models/videogallery.model");

// Create imageGallery
exports.createImageGallery = async (req, res) => {
  try {
    const imageGallery = new ImageGallery(req.body);
    await imageGallery.save();
    res.status(201).json(imageGallery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update imageGallery By Id
exports.updateImageGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const imageGallery = await ImageGallery.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!imageGallery) {
      return res.status(404).json({ message: "ImageGallery not found" });
    }
    res.json(imageGallery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete imageGallery
exports.deleteImageGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const imageGallery = await ImageGallery.findByIdAndDelete(id);
    if (!imageGallery) {
      return res.status(404).json({ message: "ImageGallery not found" });
    }
    res.json({ message: "ImageGallery deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get imageGallery by ID
exports.getImageGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const imageGallery = await ImageGallery.findById(id);
    if (!imageGallery) {
      return res.status(404).json({ message: "ImageGallery not found" });
    }
    res.json(imageGallery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Get All imageGallery
exports.getAllImageGallery = async (req, res) => {
  try {
    const imageGallery = await ImageGallery.find();
    if (!imageGallery) {
      return res.status(404).json({ message: "ImageGallery not found" });
    }
    res.json(imageGallery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getActiveImageGallery = async (req, res) => {
  try {
    // Find all banners that are active
    const activeaboutus = await ImageGallery.find({ isActive: true });
    res.json(activeaboutus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateisActiveByImageGalleryId = async (req, res) => {
  try {
    const { id } = req.params;

    const imageGallery = await ImageGallery.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!imageGallery) {
      return res.status(404).json({ message: "ImageGallery not found" });
    }
    res.json({ message: "ImageGallery isActive updated", variant: "success" });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error, variant: "error" });
  }
};

// Create videoGallery
exports.createVideoGallery = async (req, res) => {
  try {
    const videoGallery = new VideoGallery(req.body);
    await videoGallery.save();
    res.status(201).json(videoGallery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update videoGallery By Id
exports.updateVideoGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const videoGallery = await VideoGallery.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!videoGallery) {
      return res.status(404).json({ message: "VideoGallery not found" });
    }
    res.json(videoGallery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete videoGallery
exports.deleteVideoGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const videoGallery = await VideoGallery.findByIdAndDelete(id);
    if (!videoGallery) {
      return res.status(404).json({ message: "VideoGallery not found" });
    }
    res.json({ message: "VideoGallery deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get videoGallery by ID
exports.getVideoGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const videoGallery = await VideoGallery.findById(id);
    if (!videoGallery) {
      return res.status(404).json({ message: "VideoGallery not found" });
    }
    res.json(videoGallery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Get All videoGallery
exports.getAllVideoGallery = async (req, res) => {
  try {
    const videoGallery = await VideoGallery.find();
    if (!videoGallery) {
      return res.status(404).json({ message: "VideoGallery not found" });
    }
    res.json(videoGallery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getActiveVideoGallery = async (req, res) => {
  try {
    // Find all banners that are active
    const activeaboutus = await VideoGallery.find({ isActive: true });
    res.json(activeaboutus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateisActiveByVideoGalleryId = async (req, res) => {
  try {
    const { id } = req.params;

    const videoGallery = await VideoGallery.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!videoGallery) {
      return res.status(404).json({ message: "VideoGallery not found" });
    }
    res.json({ message: "VideoGallery isActive updated", variant: "success" });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error, variant: "error" });
  }
};
