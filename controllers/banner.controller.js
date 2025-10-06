const Banner = require("../models/banner.model");

// Create Banner
exports.createBanner = async (req, res) => {
  try {
    const banner = new Banner(req.body);
    await banner.save();
    res.status(201).json(banner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update Banner
exports.updateBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndUpdate(id, req.body, { new: true });
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.json(banner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Banner
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get Banner by ID
exports.getBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.json(banner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Get All Banner
exports.getAllBanner = async (req, res) => {
  try {
    const banner = await Banner.find().sort({ updatedAt: -1 });
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.json(banner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getActiveBanner = async (req, res) => {
  try {
    // Find all banners that are active
    const activeBanners = await Banner.find({ isActive: true });
    res.json(activeBanners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update isActive By banner Id

exports.updateisActiveByBannerId = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.json({ message: "Banner isActive updated", variant: "success" });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error, variant: "error" });
  }
};
