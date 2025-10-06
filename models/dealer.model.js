const mongoose = require("mongoose");

const dealerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["MALE", "FEMALE", "PREFER_NOT_TO_SAY"],
    },
    age: {
      type: Number,
      required: true,
      default: 0,
    },
    education_details: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    dealership_place: {
      type: String,
      required: true,
    },
    existing_business: {
      type: String,
      required: true,
    },
    nature_of_business: {
      type: String,
    },
    years_in_automotive_business: {
      type: String,
    },
    annual_average_sales_volume: {
      type: Number,
    },
    average_monthly_service_reporting: {
      type: Number,
    },
    average_parts_in_business: {
      type: Number,
    },
    investment_amount: {
      type: String,
    },
    source_of_investment: {
      type: String,
    },
    existing_business_name: {
      type: String,
    },
    place_of_business_unit: {
      type: String,
    },
    products_dealing_with: {
      type: String,
    },
    years_in_current_business: {
      type: String,
    },
    annual_turnover: {
      type: Number,
    },
    existing_line_of_business: {
      type: String,
    },
    percent_contribution_for_capital: {
      type: Number,
    },
    level_of_interest_in_starting_new_business: {
      type: String,
    },
    explain_why_dealership: {
      type: String,
    },
    why_successful: {
      type: String,
    },
    setup_dealership_timing: {
      type: String,
    },
    ready_to_invest: {
      type: String,
    },
    suggestions_comments: {
      type: String,
    },
  },
  { timestamps: true }
);

const Dealer = mongoose.model("dealer", dealerSchema);

module.exports = Dealer;
