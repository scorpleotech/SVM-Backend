const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const FinancialInputSchema = new Schema(
  {
    finanace_cost: {
      down_payment: {
        type: Number,
        required: true,
      },
      cost_per_annual: {
        type: Number,
        required: true,
      },
      residual_value: {
        type: Number,
        required: true,
      },
      lease_terms: {
        type: Number,
        required: true,
      },
    },
    operating_costs_INR: {
      petrol_per_liter: {
        type: Number,
        required: true,
      },
      kWh: {
        type: Number,
        required: true,
      },
      maintenance_EV_per_annum: {
        type: Number,
        required: true,
      },
      maintenance_ICE_per_annum: {
        type: Number,
        required: true,
      },
    },
    taxes: {
      GST_EV: {
        type: Number,
        required: true,
      },
      GST_ICE: {
        type: Number,
        required: true,
      },
    },
    other_inputs: {
      FX_rate_INR_to_USD: {
        type: Number,
        required: true,
      },
      conversion_factor_KM_to_Miles: {
        type: Number,
        required: true,
      },
      annual_KM_driven: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create model
const FinancialInput = mongoose.model("financial-input", FinancialInputSchema);

module.exports = FinancialInput;
