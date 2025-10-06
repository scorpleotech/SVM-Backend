const mongoose = require("mongoose");

const videoGallerySchema = new mongoose.Schema(
  {
    video: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const VideoGallery = mongoose.model("videogallery", videoGallerySchema);

module.exports = VideoGallery;
