const mongoose = require("mongoose");

const storeLocatorSchema = new mongoose.Schema(
  {
    state: String,
    name: String,
    city: String,
    email: String,
    website: String,
    pincode: Number,
    address: String,
    phone: String,
    map: String,
    store_type: String,
  },
  {
    timestamps: true,
  }
);

const StoreLocator = mongoose.model("store", storeLocatorSchema);

module.exports = StoreLocator;
