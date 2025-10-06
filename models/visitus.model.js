const mongoose = require("mongoose");

const { Schema } = mongoose;

const visitusSchema = new Schema(
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
    description: {
      type: String,
      required: true,
    },
    // state: {
    //   type: String,
    //   required: true,
    // },
    // city: {
    //   type: String,
    // },
    // dealer_name: {
    //   type: String,
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

const VisitUs = mongoose.model("visitus", visitusSchema);

module.exports = VisitUs;
