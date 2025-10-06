const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const Users = require("../models/users.model");
const Agent = require("../models/agent.model");
const KYC_details = require("../models/kyc_details.js");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
// const { WEBSITE_URL, maillerConfig } = require("../../config");
const OTPAuth = require("otpauth");
const { encode } = require("hi-base32");
const mongoose = require("mongoose");
const Order = require("../models/orders.model");
const moment = require("moment");

const otpService = require("../service/otp-service");
const axios = require("axios");

require("dotenv").config();

const BCRYPT_SALT_ROUNDS = 10;
const roleTitle = "staff";

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

router.post(
  "/loginuser",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const {
        username,

        _id,
        name,
        surname,
        company,
        isCustomer,
        address,
        image,
        isActive,
        prefix,
        phone,
        two_fa,
      } = req.user;
      const token = signToken(_id);
      res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: true,
      });
      res.status(200).json({
        isAuthenticated: true,
        user: {
          username,
          id: _id,
          name: name,
          surname,
          company,
          isCustomer,
          image,
          address,
          isActive,
          prefix,
          phone,
          two_fa,
        },
      });
    }
  }
);

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  async (req, res) => {
    try {
      // Check if two-factor authentication is enabled for the user
      const {
        _id,
        email,
        username,
        role,
        name,
        isCustomer,
        rolename,
        image,
        phone,
        two_fa,
        isVerified,
        agent_id,
        isAgent,
      } = req.user;
      const token = signToken(_id);
      if (!isVerified) {
        // throw new Error("Your email is not verified!");
        return res.status(401).json({
          isAuthenticated: false,
          isVerified: false,
          status: "error",
          message: "User is not verified. Login not allowed.",
        });
      }

      if (two_fa) {
        // If 2FA is enabled, return a response indicating that 2FA is required
        res.status(200).json({
          isAuthenticated: false,
          twoFaRequired: true,
          access_token: token,
          user: {
            email,
            username,
            rolename,
            role,
            id: _id,
            name: name,
            two_fa: two_fa,
            image: image,
            phone: phone,
            isCustomer: isCustomer,
            isAgent: isAgent,
            agent_id: agent_id,
          },
        });
      } else {
        // If 2FA is not enabled, proceed with the regular login response
        const token = signToken(_id);
        res.cookie("access_token", token, {
          httpOnly: true,
          sameSite: true,
        });
        res.status(200).json({
          isAuthenticated: true,
          twoFaRequired: false,
          access_token: token,
          user: {
            email,
            username,
            rolename,
            role,
            id: _id,
            name: name,
            two_fa: two_fa,
            image: image,
            phone: phone,
            isCustomer: isCustomer,
            isAgent: isAgent,
            agent_id: agent_id,
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

//is verified

// update active data by id

router
  .route("/active/:id")
  .post(passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
      const rolesControl = req.user.role;

      if (rolesControl[roleTitle + "/id"]) {
        // console.log("Data coming from params");
        // console.log("id from params", req.params.id);
        // console.log("Data coming from the client", req.body);
        const user = await Users.findOneAndUpdate(
          {
            _id: req.params.id,
          },
          {
            isVerified: req.body.isVerified,
          }
        );

        if (!user.isVerified) {
          const kyc = await KYC_details.findOneAndUpdate(
            {
              username: mongoose.Types.ObjectId(req.params.id),
            },
            {
              kyc_status: "Approved",
              kyc_verified_at: new Date(),
              kyc_verified_by: req.body.verified_by,
            }
          );
        } else {
          const kyc = await KYC_details.findOneAndUpdate(
            {
              username: req.params.id,
            },
            {
              kyc_status: "Rejected",
              // how to delete this two fields
              kyc_verified_at: new Date(),
              kyc_verified_by: req.body.verified_by,
            }
          );
        }

        res.json({
          messagge: title + " Update",
          variant: "success",
        });
      } else {
        res.status(403).json({
          message: {
            messagge: "You are not authorized, go away!",
            variant: "error",
          },
        });
      }
    } catch (err) {
      res.json({
        messagge: "Error: " + err,
        variant: "error",
      });
    }
  });

// router
//   .route("/active/:id")
//   .post(passport.authenticate("jwt", { session: false }), (req, res) => {
//     const rolesControl = req.user.role;
//     if (rolesControl[roleTitle + "/id"]) {
//       Users.findByIdAndUpdate(req.params.id, req.body)
//         .then(() =>
//           res.json({
//             messagge: title + " Update",
//             variant: "success",
//           })
//         )
//         .catch((err) =>
//           res.json({
//             messagge: "Error: " + err,
//             variant: "error",
//           })
//         );
//     } else {
//       res.status(403).json({
//         message: {
//           messagge: "You are not authorized, go away!",
//           variant: "error",
//         },
//       });
//     }
//   });

router.post("/otp/validate", async (req, res) => {
  try {
    const { email, token } = req.body;
    const user = await Users.findOne({ email: email });

    const message = "Token is invalid or user doesn't exist";
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message,
      });
    }
    let totp = new OTPAuth.TOTP({
      issuer: "svm.apps.org.in",
      label: "sri varu motors",
      algorithm: "SHA1",
      digits: 6,
      secret: user.otp_base32,
    });

    let delta = totp.validate({ token, window: 1 });

    if (delta === null) {
      return res.status(401).json({
        status: "fail",
        message,
      });
    }

    const authToken = signToken(user._id);
    res.cookie("access_token", authToken, {
      httpOnly: true,
      sameSite: true,
    });

    user.lastLogin = new Date();
    await user.save();
    res.status(200).json({
      isAuthenticated: true,
      twoFaRequired: true,
      user: {
        username: user.email,
        role: user.role,
        id: user._id,
        name: user.name,
        company: user.company,
        isCustomer: user.isCustomer,
        two_fa: user.two_fa,
        image: user.image,
        phone: user.phone,
        email: user.email,
        isAgent: user.isAgent,
        agent_id: user.agent_id,
        isCustomer: user.isCustomer,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// router.post(
//   "/otp/validate",
//   passport.authenticate("local", { session: false }),
//   async (req, res) => {
//     try {
//       console.log("validate req.body", req.body);
//       const { email, token } = req.body;
//       const user = await Users.findOne({ email: email });

//       const message = "Token is invalid or user doesn't exist";
//       if (!user) {
//         return res.status(401).json({
//           status: "fail",
//           message,
//         });
//       }
//       let totp = new OTPAuth.TOTP({
//         issuer: "svm.apps.org.in",
//         label: "sri varu motors",
//         algorithm: "SHA1",
//         digits: 6,
//         secret: user.otp_base32,
//       });

//       let delta = totp.validate({ token, window: 1 });

//       if (delta === null) {
//         return res.status(401).json({
//           status: "fail",
//           message,
//         });
//       }

//       res.status(200).json({
//         isAuthenticated: true,
//         twoFaRequired: false,
//         user: {
//           username: email,
//           role,
//           id: _id,
//           name: name + " " + surname,
//           company: company,
//           isCustomer: isCustomer,
//           two_fa: two_fa,
//           image: image,
//           phone: phone,
//         },
//       });
//     } catch (error) {
//       res.status(500).json({
//         status: "error",
//         message: error.message,
//       });
//     }
//   }
// );

// router.post(
//   "/login",
//   passport.authenticate("local", { session: false }),
//   (req, res) => {
//     console.log("req.user", req);
//     if (req.isAuthenticated()) {
//       const {
//         _id,
//         email,
//         role,
//         name,
//         surname,
//         company,
//         isCustomer,
//         image,
//         phone,
//         two_fa,
//       } = req.user;
//       const token = signToken(_id);
//       res.cookie("access_token", token, {
//         httpOnly: true,
//         sameSite: true,
//       });
//       res.status(200).json({
//         isAuthenticated: true,
//         user: {
//           username: email,
//           role,
//           id: _id,
//           name: name + " " + surname,
//           company: company,
//           isCustomer: isCustomer,
//           two_fa: two_fa,
//           image: image,
//           phone: phone,
//         },
//       });
//     }
//   }
// );

// router.post(
//   "/login",
//   passport.authenticate("local", { session: false }),
//   async (req, res) => {
//     try {
//       console.log("Api hitted here");
//       console.log("req.user", req.user);
//       if (req.isAuthenticated()) {
//         const {
//           _id,
//           email,
//           role,
//           name,
//           surname,
//           company,
//           isCustomer,
//           image,
//           phone,
//         } = req.user;

//         const token = signToken(_id);

//         res.cookie("access_token", token, {
//           httpOnly: true,
//           sameSite: true,
//         });

//         res.status(200).json({
//           isAuthenticated: true,
//           user: {
//             email,
//             role,
//             id: _id,
//             name: `${name} ${surname}`,
//             company,
//             isCustomer,
//             image,
//             phone,
//           },
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// );

router.put("/updatePasswordViaEmail", (req, res) => {
  Users.findOne({
    username: req.body.username,
    resetPasswordToken: req.body.resetPasswordToken,
    resetPasswordExpires: { $gte: Date.now() },
  }).then((user) => {
    if (user == null) {
      //console.error({message:"password reset link is invalid or has expired"});
      res
        .status(200)
        .send({ message: "password reset link is invalid or has expired" });
    } else if (user != null) {
      bcrypt
        .hash(req.body.password, BCRYPT_SALT_ROUNDS)
        .then((hashedPassword) => {
          Users.findOneAndUpdate(
            {
              username: req.body.username,
            },
            {
              password: hashedPassword,
              resetPasswordToken: null,
              resetPasswordExpires: null,
            }
          )
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        })
        .then(() => {
          console.log("password updated");
          res.status(200).send({ message: "password updated" });
        });
    } else {
      // console.error({message:"no user exists in db to update"});
      res.status(200).send({ message: "no user exists in db to update" });
    }
  });
});

router.post("/register", (req, res) => {
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
});
router.post("/register", (req, res) => {
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
});

router.get("/reset", (req, res) => {
  Users.findOne({
    resetPasswordToken: req.query.resetPasswordToken,
    resetPasswordExpires: { $gte: Date.now() },
  }).then((user) => {
    if (user == null) {
      console.error("password reset link is invalid or has expired");
      res.status(403).send("password reset link is invalid or has expired");
    } else {
      res.status(200).send({
        username: user.username,
        message: "password reset link a-ok",
      });
    }
  });
});

router.post("/forgotPassword", async (req, res) => {
  const phone = req.body.phone;
  console.log("phone", phone);

  try {
    const user = await Users.findOne({ phone: phone });

    if (user === null) {
      res.status(404).send("phone not found in db");
      return;
    }

    const otp = otpService.generateOTP(phone);

    if (otp) {
      // Store OTP session variables and send OTP via SMS
      req.session.otp = otp;
      req.session.phone = phone;

      const placeholders = JSON.stringify({ text: otp });
      const phoneWithCountryCode = "91" + phone; // Add your country code here
      const params = new URLSearchParams({
        apikey: process.env.TEXTLOCAL_API_KEY,
        numbers: phoneWithCountryCode,
        template_id: "1007198070315207233",
        message: `SrivaruMotors: Use OTP :${otp} to log in to your account. DO NOT disclose it to anyone. \nwww.srivarumotors.com`,
        sender: "SVMPLT",
        placeholder: placeholders,
      });

      const url = `https://api.textlocal.in/send/?${params.toString()}`;

      const response = await axios.get(url);
      // const data = await response.json();

      if (data.status !== "success") {
        return res.status(500).json({ error: "Failed to send OTP" });
      }

      return res
        .status(200)
        .json({ otp: otp, message: "OTP sent successfully" });
    } else {
      return res.status(500).json({ error: "Failed to generate OTP" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/forgotpasswordcustomer", (req, res) => {
  if (req.body.username === "") {
    res.status(400).send("email required");
  }

  Users.findOne({ username: req.body.username }).then((user) => {
    if (user === null) {
      res.send("email not in db");
    } else {
      const token = crypto.randomBytes(20).toString("hex");
      Users.updateOne(
        {
          username: req.body.username,
        },
        {
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 3600000,
        }
      )
        .then((res) => console.log(res + " added"))
        .catch((err) => console.log(err));

      const transporter = nodemailer.createTransport(maillerConfig);

      const mailOptions = {
        to: `${req.body.username}`,
        from: `${maillerConfig.auth.user}`,
        subject: "Link To Reset Password",
        text:
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
          `${WEBSITE_URL}/resetpassword/?token=${token}\n\n` +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n",
      };

      console.log("sending mail password" + req.body.username);

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.error("there was an error: ", err);
        } else {
          console.log("here is the res: ", response);
          res.status(200).json("recovery email sent");
        }
      });
    }
  });
});

// two factor authentication using google-authenticator or authenticator
const generateRandomBase32 = () => {
  const buffer = crypto.randomBytes(15);
  const base32 = encode(buffer).replace(/=/g, "").substring(0, 24);
  return base32;
};

router.post("/generateOTP", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "No user with that email exists",
      });
    }
    const base32_secret = generateRandomBase32();

    let totp = new OTPAuth.TOTP({
      issuer: "svm.apps.org.in",
      label: "sri varu motors",
      algorithm: "SHA1",
      digits: 6,
      secret: base32_secret,
    });
    let otpauth_url = totp.toString();

    const otp = await Users.findOneAndUpdate(
      { email: email },
      {
        otp_auth_url: otpauth_url,
        otp_base32: base32_secret,
      }
    );

    res.status(200).json({
      base32: base32_secret,
      otpauth_url,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/otp/verify", async (req, res) => {
  try {
    const { email, token } = req.body;

    const message = "Token is invalid or user doesn't exist";
    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message,
      });
    }

    let totp = new OTPAuth.TOTP({
      issuer: "svm.apps.org.in",
      label: "sri varu motors",
      algorithm: "SHA1",
      digits: 6,
      secret: user.otp_base32,
    });

    let delta = totp.validate({ token });

    if (delta === null) {
      return res.status(401).json({
        status: "fail",
        message,
      });
    }

    const updatedUser = await Users.findOneAndUpdate(
      { email: email },
      {
        two_fa: true,
        otp_verified: true,
      }
    );

    res.status(200).json({
      otp_verified: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        otp_enabled: updatedUser.otp_enabled,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/otp/disable", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "User doesn't exist",
      });
    }

    const updatedUser = await Users.findOneAndUpdate(
      { email: email },
      {
        two_fa: false,
        otp_verified: false,
        otp_auth_url: "",
        otp_base32: "",
      }
    );

    res.status(200).json({
      otp_disabled: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        otp_enabled: updatedUser.otp_verified,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.clearCookie("access_token");
    res.json({
      user: {
        username: "",
        role: "",
        id: "",
        name: "",
        company: "",
        isCustomer: "",
        phone: "",
      },
      success: true,
    });
  }
);

router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.Users.role === "admin") {
      res.status(200).json({
        message: { msgBody: "You are an admin", msgError: false },
      });
    } else {
      res.status(403).json({
        message: {
          msgBody: "You're not an admin,go away",
          msgError: true,
        },
      });
    }
  }
);

router.get(
  "/authenticateduser",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const {
      username,
      _id,
      name,
      surname,
      company,
      isCustomer,
      address,
      image,
      isActive,
      prefix,
      phone,
    } = req.user;

    res.status(200).json({
      isAuthenticated: true,
      user: {
        username,
        id: _id,
        name: name + " " + surname,
        company,
        isCustomer,
        image,
        address,
        isActive,
        prefix,
        phone,
      },
    });
  }
);

router.get(
  "/authenticated",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const data = req.user;
    const {
      email,
      username,
      role,
      _id,
      name,
      surname,
      company,
      isCustomer,
      isVerified,
      rolename,
      isStaff,
      isAgent,
      image,
      prefix,
      phone,
      agent_id,
      two_fa,
    } = req.user;
    let salesCount;
    if (rolename === "Service_Agent" || rolename === "Sales_Agent") {
      const startOfMonth = moment().startOf("month");
      const endOfMonth = moment().endOf("month");

      Order.aggregate([
        {
          $match: {
            agent_id: _id,
            status: "completed",
            createdAt: {
              $gte: startOfMonth.toDate(),
              $lte: endOfMonth.toDate(),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 },
          },
        },
      ])
        .then((result) => {
          console.log("Orders completed by the agent this month:", result);
          // Extracting sales count for the current month
          salesCount = result.reduce((acc, curr) => acc + curr.count, 0);
          console.log(
            "Number of orders completed by the agent this month:",
            salesCount
          );
        })
        .catch((error) => {
          console.error(error);
        });
      res.status(200).json({
        isAuthenticated: true,
        user: {
          username,
          email,
          rolename,
          role,
          id: _id,
          name: name,
          surname,
          two_fa,
          isCustomer: isCustomer,
          isVerified: isVerified,
          isStaff: isStaff,
          isAgent: isAgent,
          image: image,
          prefix: prefix,
          phone: phone,
          agent_id: agent_id,
          sales: salesCount ? salesCount : 0,
        },
      });
      return;
    }

    res.status(200).json({
      isAuthenticated: true,
      user: {
        username,
        email,
        rolename,
        role,
        id: _id,
        name: name,
        surname,
        two_fa,
        isCustomer: isCustomer,
        isVerified: isVerified,
        isStaff: isStaff,
        isAgent: isAgent,
        image: image,
        prefix: prefix,
        phone: phone,
        agent_id: agent_id,
      },
    });
  }
);

module.exports = router;
