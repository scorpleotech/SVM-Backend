const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const agentSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    street_name: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    aadhar_number: {
      type: String,
      required: true,
      unique: true,
    },
    pan_number: {
      type: String,
      required: true,
      unique: true,
    },
    kyc_verified: {
      type: Boolean,
      default: false,
    },
    select_service: {
      type: String,
    },
    experience_in_automobile: {
      type: String,
    },
    own_shop: {
      type: String,
    },
    others_service: {
      type: String,
    },

    shop_details: {
      shop_name: String,
      street_name: String,
      city: String,
      state: String,
      pincode: String,
      shop_registration_number: String,
      add_location_coordinates: String,
      select_bank: String,
      ifsc_code: String,
      bank_account_number: String,
      branch: String,
    },
  },
  {
    timestamps: true,
  }
);

const Agent = mongoose.model("Agent", agentSchema);

module.exports = Agent;
