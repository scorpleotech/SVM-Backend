const Broucher = require("../models/browcher&specSheet");

exports.createBroucher = (req, res, next) => {
  try {
    const brochure = new Broucher(req.body);
    brochure.save();
    res.status(201).json({ message: "Broucher created successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllBroucher = async (req, res) => {
  try {
    const brochure = await Broucher.find();
    res.json(brochure);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBroucherById = async (req, res) => {
  try {
    const brochure = await Broucher.findById(req.params.id);
    if (!brochure) {
      return res.status(404).json({ message: "Broucher not found" });
    }
    res.json(brochure);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBroucherById = async (req, res) => {
  try {
    const { id } = req.params;
    const brochure = await Broucher.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!brochure) {
      return res.status(404).json({ message: "Broucher not found" });
    }
    res.json(brochure);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBroucherById = async (req, res) => {
  try {
    const { id } = req.params;
    const brochure = await Broucher.findByIdAndDelete(id);
    if (!brochure) {
      return res.status(404).json({ message: "Broucher not found" });
    }
    res.json({ message: "Broucher deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBroucherByType = async (req, res) => {
  try {
    const { type } = req.params;
    const brochure = await Broucher.findOne({ file_type: type });
    if (!brochure) {
      return res.status(404).json({ message: "Broucher not found" });
    }
    res.json(brochure);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
