const mongoose = require("mongoose");

const { Schema } = mongoose;

const blogSchema = new Schema(
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
    },
    image: {
      type: String,
    },
    readingTime: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    postTime: {
      type: Date,
      default: Date.now,
    },
    nLikes: {
      type: Number,
      default: 0,
    },
    numComments: {
      type: Number,
      default: 0,
    },
    author: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      profilePic: {
        type: String,
      },
      name: {
        type: String,
      },
    },
    topic: [
      {
        type: String,
      },
    ],
    categories: [
      {
        type: String,
      },
    ],
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

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
