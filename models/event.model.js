const mongoose = require("mongoose");

const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    readingTime: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },
    link: {
      type: String,
    },
    topic: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("event", eventSchema);

module.exports = Event;
