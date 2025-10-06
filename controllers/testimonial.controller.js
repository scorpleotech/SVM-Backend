const Testimonial = require("../models/testimonials.model");

// Get all Testimonialss
exports.getAllTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.find().sort({ updatedAt: -1 });
    // console.log(Testimonialss);
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Testimonials by ID
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonials not found" });
    }
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create Testimonials
exports.createTestimonial = async (req, res) => {
  try {
    // Extract data from the request body
    const { name, image, designation, gender, message, title } = req.body;

    // Create a new Testimonials instance
    const newTestimonial = new Testimonial({
      name,
      image,
      designation,
      gender,
      title,
      message,
    });

    // Save the new Testimonials to the database
    const savedTestimonial = await newTestimonial.save();

    // Respond with the newly created Testimonials
    res.status(201).json(savedTestimonial);
  } catch (error) {
    // If any error occurs during creation, respond with a 400 status and error message
    res
      .status(400)
      .json({ message: "Invalid data provided", error: error.message });
  }
};

// Update Testimonials by ID
exports.updateTestimonialById = async (req, res) => {
  try {
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedTestimonial) {
      return res.status(404).json({ message: "Testimonials not found" });
    }
    res.json(updatedTestimonial);
  } catch (error) {
    res.status(400).json({ message: "Invalid data provided" });
  }
};

// Delete Testimonials by ID
exports.deleteTestimonialById = async (req, res) => {
  try {
    const deleteTestimonial = await Testimonial.findByIdAndDelete(
      req.params.id
    );
    if (!deleteTestimonial) {
      return res.status(404).json({ message: "Testimonials not found" });
    }
    res.json({ message: "Testimonials deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
