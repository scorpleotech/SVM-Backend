const mongoose = require("mongoose");

// Define the schema for the testimonial
const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    designation: {
      type: String,
    },
    gender: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create the Testimonial model using the schema
const Testimonial = mongoose.model("testimonial", testimonialSchema);

module.exports = Testimonial;
