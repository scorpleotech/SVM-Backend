const Accessory = require("../models/accessories.model");

// Get all Accessory
exports.getAllAccessory = async (req, res) => {
  try {
    const accessories = await Accessory.find().sort({ updatedAt: -1 });
    res.json(accessories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get accessory by ID
exports.getAccessoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const accessory = await Accessory.findById(id);

    if (!accessory) {
      return res.status(404).json({ message: "Accessory not found" });
    }

    res.json(accessory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create a new accessory
exports.createAccessory = async (req, res) => {
  // const { couponCode, name, image, price } = req.body;

  try {
    const newAccessory = new Accessory(req.body);

    const savedAccessory = await newAccessory.save();
    res.status(201).json(savedAccessory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update accessory by ID
exports.updateAccessoryById = async (req, res) => {
  // const { couponCode, name, image, price } = req.body;
  const { id } = req.params;

  try {
    const updatedAccessory = await Accessory.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedAccessory) {
      return res.status(404).json({ message: "Accessory not found" });
    }

    res.json(updatedAccessory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete accessory by ID
exports.deleteAccessoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAccessory = await Accessory.findByIdAndDelete(id);

    if (!deletedAccessory) {
      return res.status(404).json({ message: "Accessory not found" });
    }

    res.json({ message: "Accessory deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all active Accessory
exports.getActiveAccessory = async (req, res) => {
  try {
    const activeAccessory = await Accessory.find({ isActive: true }).sort({
      updatedAt: -1,
    });
    res.json(activeAccessory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateisActiveByAccessoryId = async (req, res) => {
  try {
    const { id } = req.params;

    const accessory = await Accessory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!accessory) {
      return res.status(404).json({ message: "Accessoryt not found" });
    }
    res.json({ message: "Accessoryt isActive updated", variant: "success" });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error, variant: "error" });
  }
};

// Get Accessory by Coupon Code
exports.getAccessoryByCouponCode = async (req, res) => {
  try {
    const { coupon } = req.params; // Change to req.params to retrieve from URL
    const accessory = await Accessory.findOne({ couponCode: coupon }).sort({
      updatedAt: -1,
    });

    if (!accessory) {
      return res.status(404).json({ message: "Accessory not found" });
    }

    res.json(accessory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
