const mongoose = require("mongoose");

const imageGallerySchema = new mongoose.Schema(
  {
    image: {
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

const ImageGallery = mongoose.model("imagegallery", imageGallerySchema);

module.exports = ImageGallery;
