const mongoose = require("mongoose");

const { Schema } = mongoose;

const footerSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Footer = mongoose.model("Footer", footerSchema);

module.exports = Footer;
