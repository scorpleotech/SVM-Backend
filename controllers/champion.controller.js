const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const Users = require("../models/users.model");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { WEBSITE_URL, maillerConfig } = require("../../config");

require("dotenv").config();

const BCRYPT_SALT_ROUNDS = 10;

const nodemailer = require("nodemailer");

const signToken = (userID) => {
  return JWT.sign(
    {
      iss: process.env.PASPORTJS_KEY,
      sub: userID,
    },
    process.env.PASPORTJS_KEY,
    { expiresIn: "30 days" }
  );
};

const championRegister = async (req, res) => {
  const { username, password, name, surname, prefix, phone } = req.body;

  Users.findOne({ username }).then((user) => {
    if (user)
      res.status(201).json({
        messagge: "E-mail is already taken",
        error: true,
      });
    else {
      new Users({
        username,
        password,
        name,
        surname,
        prefix,
        phone,
        isCustomer: true,
        created_user: { name: "register" },
      }).save((err) => {
        if (err)
          res.status(500).json({
            messagge: "Error has occured " + err,
            error: true,
          });
        else
          res.status(201).json({
            messagge: "Account successfully created",
            error: false,
          });
      });
    }
  });
};

module.exports = { championRegister };
