const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cityMasterSchema = new Schema(
  {
    id: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  {
    collection: "cities",
    timestamps: true,
  }
);

const Cities = mongoose.model("cities", cityMasterSchema);

module.exports = Cities;
