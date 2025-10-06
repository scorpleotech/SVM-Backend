const express = require("express");
const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const Users = require("../models/users.model");
const GreenChampion = require("../models/greenchampions.model");
const KYC_DETAILS = require("../models/kyc_details.js");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { WEBSITE_URL, maillerConfig } = require("../../config");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const data = req.body;

    const email = data.email;
    // Check for existing username
    const existingUser = await GreenChampion.findOne({ email });
    if (existingUser) {
      return res.status(201).json({
        message: "Username is already taken",
        error: true,
      });
    }

    // Generate unique ID
    const id = crypto.randomBytes(6).toString("hex");

    const existingUniqueId = await GreenChampion.findOne({ id });
    if (existingUniqueId) {
      return res.status(201).json({
        message: "Unique ID is already taken",
        error: true,
      });
    }

    const gcData = {
      username: id,
      email: data.email,
      password: data.password,
      profile: {
        name: data.name,
        address: data.address,
        prefix: data.prefix,
        phone: data.phone,
        passport_size_photo: data.image,
      },

      created_user: { name: "register" },
    };

    // Create new user
    const newUser = new GreenChampion(gcData);
    await newUser.save();
    const kyc_deatails_data = {
      first_name: data.firstname,
      last_name: data.lastname,
      gender: data.gender,
      dob: data.dob,
      phone_number: data.phone,
      permanent_address: [
        {
          address1: data.address1,
          address2: data.address2,
          state: data.city_id,
          country: data.country_id,
          postal_code: data.postal_code,
        },
      ],
      pan_number: data.pan_number,
      aadhar_number: data.aadhar_number,
    };
    const kyc_details = new KYC_DETAILS(kyc_deatails_data);
    await kyc_details.save();

    const users = new Users({
      username: id,
      name: data.name,
      image: data.image,
      prefix: data.prefix,
      phone: data.phone,
      email: data.email,
      password: data.password,
      created_user: { name: "register" },
    });

    await users.save();

    res.status(201).json({
      message: "Account successfully created",
      error: false,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error has occurred: " + err.message,
      error: true,
    });
  }
});

module.exports = router;
