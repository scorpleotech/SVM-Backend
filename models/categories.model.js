const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoriesSchema = new Schema(
  {
    created_user: {
      required: true,
      type: Object,
    },
    Brands_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands",
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    modes: {
      type: String,
      required: true,
    },
    cluster: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    image: {
      type: String,
      required: true,
    },
    imageFront: {
      type: String,
      required: true,
    },
    imageSide: {
      type: String,
      required: true,
    },
    video: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    emi_price: {
      type: String,
      required: true,
    },
    torque: {
      type: String,
      required: true,
    },
    mileage: {
      type: String,
      required: true,
    },
    topSpeed: {
      type: String,
      required: true,
    },
    certified_range: {
      type: String,
    },
    charging_time: {
      type: String,
      required: true,
    },
    peek_power: {
      type: String,
      required: true,
    },
    key_type: {
      type: String,
      required: true,
    },
    features: {
      type: [Object],
      default: [],
    },
    battery_capacity: {
      type: String,
      required: true,
    },
  },
  {
    collection: "categories",
    timestamps: true,
  }
);

const Categories = mongoose.model("Categories", CategoriesSchema);

module.exports = Categories;
