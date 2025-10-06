const express = require("express");
const router = express.Router();
const Users = require("../models/users.model");
const KYC_details = require("../models/kyc_details.js");
const passport = require("passport");

const bcrypt = require("bcryptjs");
const BCRYPT_SALT_ROUNDS = 10;

const title = "Staff";

// get all items
router
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    const rolesControl = req.user.role;

    let query = {};

    if (rolesControl["superadmin"]) {
      query = {
        $and: [
          { role: { $exists: true } },
          { "role.superadmin": { $ne: true } },
          { isStaff: true },
        ],
      };
    } else if (rolesControl["staff/list"]) {
      query = {
        $and: [
          { role: { $exists: true } },
          { isStaff: true },
          { "role.superadmin": { $exists: false } },
        ],
      };
    } else if (rolesControl["staffonlyyou"]) {
      query = {
        $or: [
          { _id: req.user._id },
          { isStaff: true },
          { "created_user.id": `${req.user._id}` },
        ],
      };
    } else {
      return res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }

    Users.find(query)
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .then((data) => {
        res.json(data);
      })
      .catch((err) =>
        res.json({ messagge: "Error: " + err, variant: "error" })
      );
  });

// post new items
// router
//   .route("/add")
//   .post(passport.authenticate("jwt", { session: false }), (req, res) => {
//     const rolesControl = req.user.role;

//     rolesControl["superadmin"] = false;
//     const data = req.body;

//     console.log("data", data);
//     if (rolesControl["staff/add"]) {
//       console.log("Data coming from the client", req.body);
//       new Users(req.body)
//         .save()
//         .then((data) =>
//           res.json({
//             messagge: title + " Added",
//             variant: "success",
//             data: data,
//           })
//         )
//         .catch((err) =>
//           res.json({ messagge: " Error: " + err, variant: "error" })
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

router
  .route("/add")
  .post(passport.authenticate("jwt", { session: false }), (req, res) => {
    const rolesControl = req.user.role;
    rolesControl["superadmin"] = false;
    const data = req.body;

    console.log("data", data);
    if (rolesControl["staff/add"]) {
      // console.log("Data coming from the client", req.body);
      new Users(req.body)
        .save()
        .then((data) =>
          res.json({
            messagge: title + " Added",
            variant: "success",
            data: data,
          })
        )
        .catch((err) => {
          if (err.code === 11000) {
            // Duplicate key error
            const duplicateField = Object.keys(err.keyValue)[0];
            const duplicateValue = err.keyValue[duplicateField];
            res.json({
              messagge: `The ${duplicateField} '${duplicateValue}' already exists.`,
              variant: "error",
            });
          } else {
            // Other errors
            res.json({
              messagge: "Error: " + err,
              variant: "error",
            });
          }
        });
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  });

// router
//   .route("/add")
//   .post(passport.authenticate("jwt", { session: false }), async (req, res) => {
//     try {
//       const rolesControl = req.user.role;
//       rolesControl["superadmin"] = false;
//       const data = req.body;

//       if (rolesControl["staff/add"]) {
//         const newData = await new Users(req.body).save();
//         const kyc_deatails_data = {
//           username: newData._id,
//           firstname: data.firstname,
//           lastname: data.lastname,
//           gender: data.gender,
//           dob: data.dob,
//           phone: data.phone,
//           prefix: data.prefix,
//           address_line_1: data.address_line_1,
//           address_line_2: data.address_line_2,
//           state: data.state,
//           country: data.country,
//           postalcode: data.postalcode,
//           pan_number: data.pan_number,
//           aadhar_number: data.aadhar_number,
//         };
//         const KYCData = await new KYC_details(kyc_deatails_data).save();
//         res.json({
//           messagge: title + " Added",
//           variant: "success",
//           data: newData,
//         });
//       } else {
//         res.status(403).json({
//           message: {
//             messagge: "You are not authorized, go away!",
//             variant: "error",
//           },
//         });
//       }
//     } catch (err) {
//       res.status(500).json({ messagge: " Error: " + err, variant: "error" });
//     }
//   });

// fetch data by id
router
  .route("/:id")
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["staff/list"]) {
      Users.findById(req.params.id)
        .then((data) => {
          console.log("data for staff", data);
          res.json(data);
        })
        .catch((err) =>
          res.status(400).json({ messagge: "Error: " + err, variant: "error" })
        );
    } else if (rolesControl["staffonlyyou"]) {
      Users.findById(req.params.id)
        .then((data) => {
          if (data) {
            res.json(data);
          } else {
            res.status(403).json({
              message: {
                messagge: "Bro You are not authorized, go away!",
                variant: "error",
              },
            });
          }
        })
        .catch((err) =>
          res.status(400).json({ messagge: "Error: " + err, variant: "error" })
        );
    } else {
      res.status(403).json({
        message: {
          messagge: "Man You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  });

// router
//   .route("/:id")
//   .get(passport.authenticate("jwt", { session: false }), async (req, res) => {
//     try {
//       const rolesControl = req.user.role;

//       if (rolesControl["superadmin"] && !rolesControl["staffonlyyou"]) {
//         const data = await Users.findById(req.params.id);

//         res.json(data);
//       } else if (!rolesControl["superadmin"] && rolesControl["staffonlyyou"]) {
//         const user = await Users.findById(req.params.id);
//         const kyc = await KYC_details.findOne({ username: req.params.id });

//         const data = {
//           ...user._doc,
//           ...kyc._doc,
//         };

//         if (data) {
//           res.json(data);
//         } else {
//           res.status(403).json({
//             message: {
//               messagge: "Bro You are not authorized, go away!",
//               variant: "error",
//             },
//           });
//         }
//       } else {
//         res.status(403).json({
//           message: {
//             messagge: "Man You are not authorized, go away!",
//             variant: "error",
//           },
//         });
//       }
//     } catch (err) {
//       res.status(400).json({
//         messagge: "Error: " + err,
//         variant: "error",
//       });
//     }
//   });

// delete data by id
router
  .route("/:id")
  .delete(passport.authenticate("jwt", { session: false }), (req, res) => {
    const rolesControl = req.user.role;

    if (req.params.id == req.user._id) {
      return res.json({
        messagge: " Can not delete yourself.",
        variant: "error",
      });
    }

    if (rolesControl["staffdelete"]) {
      Users.findByIdAndDelete(req.params.id)
        .then(() =>
          res.json({
            messagge: title + " Deleted",
            variant: "info",
          })
        )
        .catch((err) =>
          res.json({
            messagge: "Error: " + err,
            variant: "error",
          })
        );
    } else if (rolesControl["staffonlyyou"]) {
      Users.deleteOne({
        _id: req.params.id,
        "created_user.id": `${req.user._id}`,
      })
        .then((resdata) => {
          if (resdata.deletedCount > 0) {
            res.json({
              messagge: title + " delete",
              variant: "success",
            });
          } else {
            res.status(403).json({
              messagge: "You are not authorized, go away!",
              variant: "error",
            });
          }
        })
        .catch((err) =>
          res.json({
            messagge: "Error: " + err,
            variant: "error",
          })
        );
    } else {
      res.status(403).json({
        messagge: "You are not authorized, go away!",
        variant: "error",
      });
    }
  });

router.post(
  "/updatePasswordSuperadmin",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["superadmin"] || req.body._id == req.user._id) {
      Users.findOne({
        _id: req.body._id,
      }).then((users) => {
        if (users != null) {
          console.log("user exists in db");
          bcrypt
            .hash(req.body.password, BCRYPT_SALT_ROUNDS)
            .then((hashedPassword) => {
              Users.findOneAndUpdate(
                {
                  _id: req.body._id,
                },
                {
                  password: hashedPassword,
                }
              )
                .then(() => {
                  res.json({
                    messagge: title + " Password Update",
                    variant: "success",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.json({
                    messagge: "Error: " + err,
                    variant: "error",
                  });
                });
            });
        } else {
          console.error("no user exists in db to update");
          res.status(401).json("no user exists in db to update");
        }
      });
    } else {
      res.json({
        messagge: " You are not authorized, go away!",
        variant: "error",
      });
    }
  }
);

/// Update password customer
router.post(
  "/updatePasswordCustomer",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["customers/id"] || req.body._id == req.user._id) {
      Users.findOne({
        $and: [{ _id: req.body._id }, { isCustomer: true }],
      }).then((users) => {
        if (users != null) {
          console.log("user exists in db");
          bcrypt
            .hash(req.body.password, BCRYPT_SALT_ROUNDS)
            .then((hashedPassword) => {
              Users.findOneAndUpdate(
                {
                  _id: req.body._id,
                },
                {
                  password: hashedPassword,
                }
              )
                .then(() => {
                  res.json({
                    messagge: title + " Password Update",
                    variant: "success",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.json({
                    messagge: "Error: " + err,
                    variant: "error",
                  });
                });
            });
        } else {
          console.error("no user exists in db to update");
          res.status(401).json("no user exists in db to update");
        }
      });
    } else {
      res.json({
        messagge: " You are not authorized, go away!",
        variant: "error",
      });
    }
  }
);

// update data by id
router
  .route("/:id")
  .post(passport.authenticate("jwt", { session: false }), (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["staff/id"]) {
      Users.findByIdAndUpdate(req.params.id, req.body)
        .then(() =>
          res.json({
            messagge: title + " Update",
            variant: "success",
          })
        )
        .catch((err) =>
          res.json({
            messagge: "Error: " + err,
            variant: "error",
          })
        );
    } else if (rolesControl["staffonlyyou"]) {
      Users.findOneAndUpdate(
        {
          _id: req.params.id,
          "created_user.id": `${req.user._id}`,
        },
        req.body
      )
        .then((resdata) => {
          if (resdata) {
            res.json({
              messagge: title + " Update",
              variant: "success",
            });
          } else {
            res.json({
              messagge: " You are not authorized, go away!",
              variant: "error",
            });
          }
        })
        .catch((err) =>
          res.json({
            messagge: "Error: " + err,
            variant: "error",
          })
        );
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  });

// post new items
router.route("/add/register1231223123123").post((req, res) => {
  new Users(req.body)
    .save()

    .then(() =>
      res.json({
        messagge: title + " Added",
        variant: "success",
      })
    )
    .catch((err) =>
      res.json({
        messagge: " Error: " + err,
        variant: "error",
      })
    );
});

module.exports = router;
