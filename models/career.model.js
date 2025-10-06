const mongoose = require("mongoose");

const { Schema } = mongoose;

const careerSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    work_type: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    short_description: {
      type: String,
    },
    isRemote: {
      type: Boolean,
    },
    postTime: {
      type: Date,
      default: Date.now,
    },
    salary_range: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Career = mongoose.model("career", careerSchema);

module.exports = Career;
