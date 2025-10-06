const mongoose = require("mongoose");

const { Schema } = mongoose;

const newsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    short_description: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    readingTime: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    publishedBy: {
      type: String,
    },
    published_date: {
      type: Date,
      default: Date.now,
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
    categories: {
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

const News = mongoose.model("news", newsSchema);

module.exports = News;
