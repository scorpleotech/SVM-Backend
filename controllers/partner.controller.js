const Partner = require("../models/partners,model");

// Create Partner
exports.createPartner = async (req, res) => {
  try {
    const partner = new Partner(req.body);
    await partner.save();
    res.status(201).json(partner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update Partner By Id
exports.updatePartnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await Partner.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    res.json(partner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Partner
exports.deletePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await Partner.findByIdAndDelete(id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    res.json({ message: "Partner deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get Partner by ID
exports.getPartnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await Partner.findById(id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    res.json(partner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Get All Partner
exports.getAllPartner = async (req, res) => {
  try {
    const partner = await Partner.find().sort({ updatedAt: -1 });
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    res.json(partner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getActivePartner = async (req, res) => {
  try {
    // Find all banners that are active
    const activePartner = await Partner.find({ isActive: true });
    res.json(activePartner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateisActiveByPartnerId = async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    res.json({ message: "Partner isActive updated", variant: "success" });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error, variant: "error" });
  }
};
