const mongoose = require("mongoose");

const { Schema } = mongoose;

const gallerySchema = new Schema(
  {
    title: {
      type: String,
    },
    file_type: {
      type: String,
      required: true,
    },
    file_name: {
      type: String,
      required: true,
    },
    url_type: {
      type: String,
    },
    file_url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
