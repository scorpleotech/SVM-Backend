const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PranaClassSchema = new Schema(
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
    
    // Bike Selection - PranaClass has only one model but two colors
    model: {
      type: String,
      required: true,
      default: 'PranaClass',
    },
    color: {
      type: String,
      required: true,
      enum: ['#000000', '#1E90FF'], // Black and Blue hex codes
    },
    colorName: {
      type: String,
      required: true,
      enum: ['Black', 'Blue'],
    },
    price: {
      type: Number,
      required: true,
      default: 144900, // Base price for PranaClass
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
        return 'PRC' + Date.now().toString().slice(-8);
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
    
    // PranaClass specific fields
    specifications: {
      battery_capacity: {
        type: String,
        default: '3.5', // 3.5 Kwh
      },
      certified_range: {
        type: String,
        default: '170', // 170 Km
      },
      top_speed: {
        type: String,
        default: '85', // 85 Kmph
      },
      vehicle_type: {
        type: String,
        default: 'Electric Motorcycle',
      }
    }
  },
  {
    collection: "pranaclass",
    timestamps: true,
  }
);

const PranaClass = mongoose.model("PranaClass", PranaClassSchema);

module.exports = PranaClass;
