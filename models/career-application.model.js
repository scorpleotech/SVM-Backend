const mongoose = require("mongoose");

const { Schema } = mongoose;

const careerApplicationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
      required: true,
    },
    currentJobTitle: {
      type: String,
    },
    yearsOfExperience: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    linkedInUrl: {
      type: String,
    },
    coverLetter: {
      type: String,
    },
    career_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Career",
    },
  },
  {
    timestamps: true,
  }
);

const CareerApplication = mongoose.model(
  "CareerApplication",
  careerApplicationSchema
);

module.exports = CareerApplication;
