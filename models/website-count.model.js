// schame for website count
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const websiteCountSchema = new Schema(
  {
    count_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WebsiteCount", websiteCountSchema);
