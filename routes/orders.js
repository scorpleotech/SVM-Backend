const router = require("express").Router();
const passport = require("passport");
let Orders = require("../models/orders.model");
let Customers = require("../models/customer.model");
let Users = require("../models/users.model");
const Incentive = require("../models/incentive.model");
const Excel = require("exceljs");
const jwt = require("jsonwebtoken");
const User = require("../models/users.model");
const Agent = require("../models/agent.model");

const title = "Orders";
const roleTitle = "orders";

// get all items
router
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl[roleTitle + "/list"]) {
      // console.log("User Id 1", req.user);
      Orders.find()
        .sort({ updatedAt: -1 })
        .then((data) => {
          res.json(data);
        })
        .catch((err) =>
          res.json({
            messagge: "Error: " + err,
            variant: "error",
          })
        );
    } else if (rolesControl[roleTitle + "onlyyou"]) {
      // console.log("User Id 2 ", req.user);
      Orders.find({
        agent_id: `${req.user.agent_id}`,
      })
        .sort({ updatedAt: -1 })
        .then((data) => {
          res.json(data);
        })
        .catch((err) =>
          res.json({
            messagge: "Error: " + err,
            variant: "error",
          })
        );
    } else if (req.user._id) {
      // console.log("User Id 3", req.user);
      Orders.find({
        customer_id: `${req.user._id}`,
      })
        .sort({ updatedAt: -1 })
        .then((data) => {
          res.json(data);
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
router
  .route("/add")
  .post(passport.authenticate("jwt", { session: false }), (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl[roleTitle + "/add"]) {
      new Orders(req.body)
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
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  });

// fetch data by id
router
  .route("/counts/")
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    Orders.countDocuments()
      .then((data) => res.json(data))
      .catch((err) =>
        res.status(400).json({
          messagge: "Error: " + err,
          variant: "error",
        })
      );
  });

// fetch data by id
router
  .route("/:id")
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl[roleTitle + "/list"]) {
      Orders.findById(req.params.id)
        .then((data) => res.json(data))
        .catch((err) =>
          res.status(400).json({
            messagge: "Error: " + err,
            variant: "error",
          })
        );
    } else if (rolesControl[roleTitle + "onlyyou"]) {
      Orders.findOne({
        _id: req.params.id,
        agent_id: `${req.user.agent_id}`,
      })
        .then((data) => {
          if (data) {
            res.json(data);
          } else {
            res.status(403).json({
              message: {
                messagge: "You are not authorized, go away!",
                variant: "error",
              },
            });
          }
        })
        .catch((err) =>
          res.status(400).json({
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

router.route("/deleteMany").delete(async (req, res) => {
  try {
    const deleteOrders = await Orders.deleteMany({});
    if (deleteOrders) {
      res.json({
        messagge: " Deleted",
        variant: "success",
      });
    }
  } catch (err) {
    res.status(400).json({
      messagge: "Error: " + err,
      variant: "error",
    });
  }
});

router.route("/customer-delete").delete(async (req, res) => {
  try {
    const deleteCustomer = await Customers.deleteMany({});
    const user = await Users.deleteMany({
      isCustomer: true,
    });
    if (deleteCustomer) {
      res.json({ message: "Customer deleted successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});

// fetch data by id
router
  .route("/status/:id")
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl[roleTitle + "/list"]) {
      Orders.find({ orderstatus_id: req.params.id })
        .then((data) => res.json(data))
        .catch((err) =>
          res.status(400).json({
            messagge: "Error: " + err,
            variant: "error",
          })
        );
    } else if (rolesControl[roleTitle + "onlyyou"]) {
      Orders.find({
        orderstatus_id: req.params.id,
        "created_user.id": `${req.user._id}`,
      })
        .then((data) => res.json(data))
        .catch((err) =>
          res.status(400).json({
            messagge: "Error: " + err,
            variant: "error",
          })
        );
    } else if (req.user._id) {
      Orders.find({
        orderstatus_id: req.params.id,
        customer_id: `${req.user._id}`,
      })
        .then((data) => res.json(data))
        .catch((err) =>
          res.status(400).json({
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

// delete data by id
router
  .route("/:id")
  .delete(passport.authenticate("jwt", { session: false }), (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl[roleTitle + "delete"]) {
      Orders.findByIdAndDelete(req.params.id)
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
    } else if (rolesControl[roleTitle + "onlyyou"]) {
      Orders.deleteOne({
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
              message: {
                messagge: "You are not authorized, go away!",
                variant: "error",
              },
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

// update data by id
router
  .route("/:id")
  .post(passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
      const rolesControl = req.user.role;
      const orderId = req.params.id;

      if (rolesControl[roleTitle + "/id"]) {
        // Check if order exists
        const order = await Orders.findById(orderId);
        if (!order) {
          return res.status(404).json({ message: "Order not found" });
        }
        // console.log("Request", req.body);
        const updatedOrder = await Orders.findByIdAndUpdate(orderId, req.body);

        const getOrder = await Orders.findById(orderId);

        // Only initiate incentive if the order is completed and there's an agent_id
        if (getOrder.order_status === "Completed" && getOrder.agent_id) {
          // Check if incentive already exists for this order
          const existingIncentive = await Incentive.findOne({
            order_id: orderId,
          });
          if (existingIncentive) {
            return res.json({
              message: "Incentive already provided for this order",
              variant: "info",
            });
          }

          // Assuming incentive_amount is defined
          const incentive_amount = 5000;

          // Create and save new incentive
          const newIncentive = new Incentive({
            order_id: orderId,
            agent_id: order.agent_id,
            incentive_amount: incentive_amount,
            incentive_status: "Under_Process",
          });

          const savedIncentive = await newIncentive.save();
          return res.json({
            message:
              "Order updated successfully & Incentive initiated successfully",
            variant: "success",
            savedIncentive,
            updatedOrder,
          });
        }

        return res.json({
          message: "Order updated successfully",
          variant: "success",
          updatedOrder,
        });
      } else {
        res.status(403).json({
          message: {
            messagge: "You are not authorized, go away!",
            variant: "error",
          },
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.route("/export/order").get(async (req, res) => {
  try {
    let orders;
    const accessToken = req.cookies.access_token;
    const decodedToken = jwt.verify(accessToken, process.env.PASPORTJS_KEY);
    const userId = decodedToken.sub;

    const user = await User.findById(userId);
    // Check if the request contains agent details
    if (user.isAgent) {
      const agent = await Agent.findOne({ user_id: user._id });
      console.log("agent", agent);
      orders = await Orders.find({ agent_id: agent._id });
      console.log("agent", orders);
    } else {
      // Fetch all orders from the database
      orders = await Orders.find();
    }

    // Create a new Excel workbook and worksheet
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Orders");

    // Set up columns for the worksheet
    worksheet.columns = [
      { header: "Order Number", key: "ordernumber", width: 25 },
      { header: "Model Name", key: "model_name", width: 25 },
      { header: "Model Category", key: "model_category", width: 25 },
      { header: "Customer Name", key: "customer_name", width: 25 },
      { header: "Phone", key: "phone", width: 25 },
      { header: "Email", key: "email", width: 25 },
      { header: "City", key: "city", width: 25 },
      { header: "State", key: "state", width: 25 },
      { header: "Model Booked Color", key: "model_booked_color", width: 25 },
      { header: "Coupon Code", key: "coupon_code", width: 25 },
      { header: "Agent ID", key: "agent_id", width: 25 },
      { header: "Dealer Hub", key: "dealer_hub", width: 25 },
      { header: "Booking Amount", key: "booking_amount", width: 25 },
      { header: "Price", key: "price", width: 25 },
      { header: "Agent Code", key: "agent_code", width: 25 },
      { header: "Booking Date", key: "booking_date", width: 25 },
      { header: "Order Status", key: "order_status", width: 25 },
    ];

    // Add each order to the worksheet
    orders.forEach((order) => {
      // worksheet.addRow(order);
      // Flatten the address object
      const flattenedOrder = {
        ...order._doc,
        city: order.address.city,
        state: order.address.state,
      };
      // Remove the nested address property
      delete flattenedOrder.address;
      worksheet.addRow(flattenedOrder);
    });

    // Write the workbook to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set the response headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");

    // Send the buffer as response
    return res.send(buffer);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: error.message });
  }
});

// update data by id
// router
// .route("/:id")
// .post(passport.authenticate("jwt", { session: false }), (req, res) => {
//   const rolesControl = req.user.role;
//   if (rolesControl[roleTitle + "/id"]) {
//     Orders.findByIdAndUpdate(req.params.id, req.body)
//       .then(() =>
//         res.json({
//           messagge: title + " Update",
//           variant: "success",
//         })
//       )
//       .catch((err) =>
//         res.json({
//           messagge: "Error: " + err,
//           variant: "error",
//         })
//       );
//   } else if (rolesControl[roleTitle + "onlyyou"]) {
//     Orders.findOneAndUpdate(
//       {
//         _id: req.params.id,
//         "created_user.id": `${req.user._id}`,
//       },
//       req.body
//     )
//       .then((resdata) => {
//         if (resdata) {
//           res.json({
//             messagge: title + " Update",
//             variant: "success",
//           });
//         } else {
//           res.json({
//             messagge: " You are not authorized, go away!",
//             variant: "error",
//           });
//         }
//       })
//       .catch((err) =>
//         res.json({
//           messagge: "Error: " + err,
//           variant: "error",
//         })
//       );
//   } else {
//     res.status(403).json({
//       message: {
//         messagge: "You are not authorized, go away!",
//         variant: "error",
//       },
//     });
//   }
// });

module.exports = router;
