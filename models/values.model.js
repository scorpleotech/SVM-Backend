const mongoose = require("mongoose");

const { Schema } = mongoose;

const valuesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Value = mongoose.model("Value", valuesSchema);

module.exports = Value;
