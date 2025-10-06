const mongoose = require("mongoose");
const moment = require("moment");

const Schema = mongoose.Schema;

const OrdersSchema = new Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
    ordernumber: {
      type: String,
      required: true,
    },
    invoice_number: {
      type: String,
    },
    model_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bike-varient",
      default: null,
    },
    model_name: {
      type: String,
    },
    model_category: {
      type: String,
    },
    // Add booking details
    customer_name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    alternative_mobile: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },

    model_booked_color: {
      type: String,
    },
    coupon_code: {
      type: String,
    },
    // mode_of_purchase: {
    //   type: String,
    //   enum: ["Finance", "Cash"],
    // },
    agent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
    },
    dealer_hub: {
      type: String,
    },
    booking_amount: {
      type: Number,
    },
    price: {
      type: Number,
    },
    agent_code: {
      type: String,
    },
    agent_name_shop: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    payment_mode: {
      type: String,
    },
    booking_date: {
      type: Date,
      default: Date.now,
    },
    order_status: {
      type: String,
      enum: [
        "Pending",
        "Booked",
        "In_Progress",
        "Loan_Process",
        "RTO_Process",
        "Completed",
        "Canceled",
      ],
      default: "Pending",
    },
  },
  {
    collection: "orders",
    timestamps: true,
  }
);

OrdersSchema.pre("save", function (next) {
  let number = moment().unix().toString() + moment().milliseconds().toString();
  if (number.length == 12) {
    number = number + "0";
  }
  if (number.length == 11) {
    number = number + "00";
  }
  this.booking_order_number = `BKING${number}`;
  next();
});

const Orders = mongoose.model("Orders", OrdersSchema);

module.exports = Orders;
