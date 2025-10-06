const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BrowchersSchema = new Schema(
  {
    file_type: {
      type: String,
      required: true,
    },
    file_url: {
      type: String,
    },
    title: {
      type: String,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    collection: "browchers",
    timestamps: true,
  }
);

const Browchers = mongoose.model("browchers", BrowchersSchema);

module.exports = Browchers;
