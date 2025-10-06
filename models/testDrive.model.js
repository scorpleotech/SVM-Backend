const mongoose = require("mongoose");

const { Schema } = mongoose;

const testDriveSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    dealer_name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "store",
      required: true,
    },
    pincode: {
      type: Number,
    },
    booking_date: {
      type: Date,
    },
    booking_time: {
      type: String,
    },
    // refer to the bike varient table
    model: {
      type: Schema.Types.ObjectId,
      ref: "bike-varient",
    },
  },
  {
    timestamps: true,
  }
);

const TestDrive = mongoose.model("test_drive", testDriveSchema);

module.exports = TestDrive;
