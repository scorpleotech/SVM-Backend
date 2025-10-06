const ProductBanner = require("../models/productbanner.model");

// Create productBanner
exports.createProductBanner = async (req, res) => {
  try {
    const productBanner = new ProductBanner(req.body);
    await productBanner.save();
    res.status(201).json(productBanner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update productBanner By Id
exports.updateProductBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const productBanner = await ProductBanner.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!productBanner) {
      return res.status(404).json({ message: "ProductBanner not found" });
    }
    res.json(productBanner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete productBanner
exports.deleteProductBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const productBanner = await ProductBanner.findByIdAndDelete(id);
    if (!productBanner) {
      return res.status(404).json({ message: "ProductBanner not found" });
    }
    res.json({ message: "ProductBanner deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get productBanner by ID
exports.getProductBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const productBanner = await ProductBanner.findById(id);
    if (!productBanner) {
      return res.status(404).json({ message: "ProductBanner not found" });
    }
    res.json(productBanner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Get All productBanner
exports.getAllProductBanner = async (req, res) => {
  try {
    const productBanner = await ProductBanner.find().sort({ updatedAt: -1 });
    if (!productBanner) {
      return res.status(404).json({ message: "ProductBanner not found" });
    }
    res.json(productBanner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getActiveProductBanner = async (req, res) => {
  try {
    // Find all banners that are active
    const activeaboutus = await ProductBanner.find({ isActive: true });
    res.json(activeaboutus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateisActiveByProductBannerId = async (req, res) => {
  try {
    const { id } = req.params;

    const productBanner = await ProductBanner.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!productBanner) {
      return res.status(404).json({ message: "ProductBanner not found" });
    }
    res.json({ message: "ProductBanner isActive updated", variant: "success" });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error, variant: "error" });
  }
};
