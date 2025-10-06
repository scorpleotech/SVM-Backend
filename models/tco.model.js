const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const tcoSchema = new Schema(
  {
    vehicle: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    vehicleClass: {
      type: String,
      required: true,
    },
    topSpeed: {
      type: Number,
      required: true,
    },
    acceleration: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: String,
      required: true,
    },
    battery_capacity: {
      type: String,
      required: true,
    },
    acquisition: {
      cost: {
        type: Number,
        required: true,
      },
      GST: {
        type: Number,
        required: true,
      },
      totalCost: {
        type: Number,
        required: true,
      },
    },
    financing: {
      totalCostInclGst: {
        type: Number,
        required: true,
      },
      downPayment: {
        type: Number,
        required: true,
      },
      residual: {
        type: Number,
        required: true,
      },
      amountToFinance: {
        type: Number,
        required: true,
      },
      annualPMT: {
        type: Number,
        required: true,
      },
    },
    operatingCosts: {
      range: {
        type: Number,
        required: true,
      },
      chargingTime: {
        type: Number,
        required: true,
      },
      kWhOrLitres: {
        type: Number,
        required: true,
      },
      fuel: {
        type: Number,
        required: true,
      },
      maintenance: {
        type: Number,
        required: true,
      },
      totalTCOpA: {
        type: Number,
        required: true,
      },
      totalTCO: {
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
const tco = mongoose.model("tco", tcoSchema);

module.exports = tco;
