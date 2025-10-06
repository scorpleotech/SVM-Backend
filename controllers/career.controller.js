const Career = require("../models/career.model");

// Create Career
exports.createCareer = async (req, res) => {
  try {
    const career = new Career(req.body);
    await career.save();
    res.status(201).json(career);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update Career
exports.updateCareerById = async (req, res) => {
  try {
    const { id } = req.params;
    const career = await Career.findByIdAndUpdate(id, req.body, { new: true });
    if (!career) {
      return res.status(404).json({ message: "Career not found" });
    }
    res.json(career);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Career
exports.deleteCareer = async (req, res) => {
  try {
    const { id } = req.params;
    const career = await Career.findByIdAndDelete(id);
    if (!career) {
      return res.status(404).json({ message: "Career not found" });
    }
    res.json({ message: "Career deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get Career by ID
exports.getCareerById = async (req, res) => {
  try {
    const { id } = req.params;
    const career = await Career.findById(id);
    if (!career) {
      return res.status(404).json({ message: "Career not found" });
    }
    res.json(career);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Careers
exports.getAllCareers = async (req, res) => {
  try {
    const { title, jobType, location } = req.query;
    let query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (jobType) {
      query.work_type = jobType;
    }

    if (location) {
      query.city = location;
    }

    const careers = await Career.find(query).sort({ updatedAt: -1 });
    res.json(careers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
