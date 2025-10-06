const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  first_name: String,
  last_name: String,
  mobile: String,
  email: String,
  address_line_1: String,
  address_line_2: String,
  pincode: String,
  state: String,
});

const customerSchema = new Schema(
  {
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    prefix: {
      type: String,
    },
    phone: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      // required: true,
      // unique: true,
    },
    password: {
      type: String,
    },
    state: {
      type: String,
      // required: true,
    },
    city: {
      type: String,
      // required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      default: null,
    },
    bike_varient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bike-varient",
      default: null,
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
    dealer_hub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "store",
      default: null,
    },
    // billing_address: [addressSchema],
    // delivery_address: [addressSchema],
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("customer", customerSchema);

module.exports = Customer;
