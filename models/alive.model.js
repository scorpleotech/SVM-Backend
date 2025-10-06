const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const aliveSchema = new Schema(
  {
    created_user: {
      required: true,
      type: Object,
    },
    // Customer Details
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Bike Selection
    model: {
      type: String,
      required: true,
      enum: ['Lite', 'Plus', 'Elite'],
    },
    color: {
      type: String,
      required: true,
    },
    colorName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    
    // Order Status
    order_status: {
      type: String,
      enum: ['Reserved', 'Booked', 'Confirmed', 'Processing', 'Delivered', 'Cancelled'],
      default: 'Reserved',
    },
    
    // Payment Fields
    payment_status: {
      type: String,
      enum: ['Pending', 'Success', 'Failed', 'Cancelled'],
      default: 'Pending',
    },
    transactionId: {
      type: String,
      default: null,
    },
    payment_mode: {
      type: String,
      default: null,
    },
    
    // Reservation Details
    reservation_number: {
      type: String,
      unique: true,
      default: function() {
        return 'ALV' + Date.now().toString().slice(-8);
      }
    },
    
    // Additional Info
    notes: {
      type: String,
      default: '',
    },
    
    // Addresses (if needed later)
    shipping_address: {
      type: String,
      default: '',
    },
    billing_address: {
      type: String,
      default: '',
    },
  },
  {
    collection: "alive",
    timestamps: true,
  }
);

const alive = mongoose.model("alive", aliveSchema);

module.exports = alive;
