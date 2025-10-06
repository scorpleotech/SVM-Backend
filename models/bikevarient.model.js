const mongoose = require("mongoose");

const varientSchema = new mongoose.Schema({
  name: {
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
  colorName: {
    type: String,
    required: true,
  },
  colorCode: {
    type: String,
    required: true,
  },
  modes: {
    type: String,
    required: true,
  },
  cluster: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  emi_price: {
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
  torque: {
    type: String,
    required: true,
  },
  charging_time: {
    type: String,
    required: true,
  },
  mileage: {
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

  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    required: true,
  },
});

const BikeVarient = mongoose.model("bike-varient", varientSchema);

module.exports = BikeVarient;
