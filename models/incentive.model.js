const mongoose = require("mongoose");

const incentiveSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
      default: null,
    },
    agent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
    },
    incentive_amount: {
      type: Number,
      default: 0,
    },
    incentive_status: {
      type: String,
      default: "Under_Process",
      enum: [
        "NA_Incentive",
        "Under_Process",
        "Waiting_for_Approval",
        "Approved",
        "Rejected",
        "Processed",
      ],
    },
    trn_id: {
      type: String,
    },
    trn_utr_number: {
      type: String,
    },
    txn_details: {
      type: String,
    },
    trndate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Incentive = mongoose.model("incentive", incentiveSchema);

module.exports = Incentive;
