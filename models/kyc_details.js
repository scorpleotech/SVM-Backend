const mongoose = require("mongoose");

const KYC_DETAILS = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  prefix: {
    type: String,
  },

  address_line_1: {
    type: String,
    default: "India",
  },
  address_line_2: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  postalcode: {
    type: String,
  },

  pan_number: {
    type: String,
    required: true,
  },
  aadhar_number: {
    type: String,
    required: true,
  },
  kyc_status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  verification_documents: {
    type: Array,
    required: false,
  },
  kyc_verified_at: {
    type: Date,
  },
  kyc_verified_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

const KYC_details = mongoose.model("KYCdetails", KYC_DETAILS);
module.exports = KYC_details;
