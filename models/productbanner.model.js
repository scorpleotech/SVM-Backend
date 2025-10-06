const mongoose = require("mongoose");

const productBannerSchema = new mongoose.Schema(
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

const ProductBanner = mongoose.model("product_banner", productBannerSchema);

module.exports = ProductBanner;
