const mongoose = require("mongoose");

// Define the schema for the faq
const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create the Testimonial model using the schema
const FAQ = mongoose.model("faq", faqSchema);

module.exports = FAQ;
