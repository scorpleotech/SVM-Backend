const FAQ = require("../models/faq.model");

// Get all Testimonialss
exports.getAllFAQ = async (req, res) => {
  try {
    const faq = await FAQ.find().sort({ createdAt: -1 });
    // console.log(Testimonialss);
    res.json(faq);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Testimonials by ID
exports.getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    res.json(faq);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create FAQ
exports.createFAQ = async (req, res) => {
  try {
    // Extract data from the request body
    const { question, answer } = req.body;

    // Create a new FAQ instance
    const newFAQ = new FAQ({
      question,
      answer,
    });

    // Save the new FAQ to the database
    const savedFAQ = await newFAQ.save();

    // Respond with the newly created FAQ
    res.status(201).json(savedFAQ);
  } catch (error) {
    // If any error occurs during creation, respond with a 400 status and error message
    res
      .status(400)
      .json({ message: "Invalid data provided", error: error.message });
  }
};

// Update FAQ by ID
exports.updateFAQById = async (req, res) => {
  try {
    const updatedFAQ = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedFAQ) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    res.json(updatedFAQ);
  } catch (error) {
    res.status(400).json({ message: "Invalid data provided" });
  }
};

// Delete FAQ by ID
exports.deleteFAQById = async (req, res) => {
  try {
    const deleteFAQ = await FAQ.findByIdAndDelete(req.params.id);
    if (!deleteFAQ) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    res.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
