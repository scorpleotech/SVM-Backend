const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EnquirySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    enquiry: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.model("Enquiry", EnquirySchema);

module.exports = Enquiry;
