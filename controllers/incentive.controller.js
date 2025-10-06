const Incentive = require("../models/incentive.model");
const Orders = require("../models/orders.model");
const Agent = require("../models/agent.model");
const HTML_TEMPLATE = require("../service/templates/incentive-processed-template");
const nodemailer = require("nodemailer");

// const title = "Incentive";
const roleTitle = "incentive";

// const getAllIncentives = async (req, res) => {
//   try {
//     const rolesControl = req.user.role;
//     if (rolesControl[roleTitle + "/list"]) {
//       const incentives = await Incentive.find().sort({ createdAt: -1 });

//       const order = await Orders.findOne({ _id: incentives[0].order_id });

//       res.json(incentives);
//     } else if (rolesControl[roleTitle + "onlyyou"]) {
//       const incentives = await Incentive.find({
//         agent_id: req.user.agent_id,
//       }).sort({ createdAt: -1 });
//       res.json(incentives);
//     } else {
//       res.status(403).json({
//         message: {
//           messagge: "You are not authorized, go away!",
//           variant: "error",
//         },
//       });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getAllIncentives = async (req, res) => {
  try {
    const rolesControl = req.user.role;
    const roleName = req.user.rolename;
    console.log(roleName);
    let pipeline = [];

    if (rolesControl[roleTitle + "/list"]) {
      pipeline = [
        {
          $lookup: {
            from: "orders",
            localField: "order_id",
            foreignField: "_id",
            as: "orderData",
          },
        },
        {
          $lookup: {
            from: "agents",
            localField: "agent_id",
            foreignField: "_id",
            as: "agents",
          },
        },
        {
          $project: {
            _id: 1,
            name: { $arrayElemAt: ["$agents.name", 0] },
            model: { $arrayElemAt: ["$orderData.model_category", 0] },
            category: { $arrayElemAt: ["$orderData.model_name", 0] },
            incentive_amount: 1,
            incentive_status: 1,
            updatedAt: 1,
          },
        },
      ];
    } else if (rolesControl[roleTitle + "onlyyou"]) {
      pipeline = [
        {
          $match: { agent_id: req.user.agent_id },
        },
        {
          $lookup: {
            from: "orders",
            localField: "order_id",
            foreignField: "_id",
            as: "orderData",
          },
        },
        {
          $lookup: {
            from: "agents",
            localField: "agent_id",
            foreignField: "_id",
            as: "agents",
          },
        },
        {
          $project: {
            _id: 1,
            name: { $arrayElemAt: ["$agents.name", 0] },
            model: { $arrayElemAt: ["$orderData.model_category", 0] },
            category: { $arrayElemAt: ["$orderData.model_name", 0] },
            incentive_amount: 1,
            incentive_status: 1,
          },
        },
      ];
    } else {
      return res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }

    const incentives = await Incentive.aggregate(pipeline);
    let FilteredList;
    if (roleName === "ASM") {
      FilteredList = await incentives.filter(
        (incentive) => incentive.incentive_status === "Under_Process"
      );
    } else if (roleName === "Head_of_Department_Business") {
      FilteredList = await incentives.filter(
        (incentive) =>
          incentive.incentive_status === "Reviewed" ||
          incentive.incentive_status === "Revised"
      );
    } else if (roleName === "MD") {
      FilteredList = await incentives.filter(
        (incentive) => incentive.incentive_status === "Waiting_for_Approval"
      );
    } else if (roleName === "Accounts_Manager") {
      FilteredList = await incentives.filter(
        (incentive) => incentive.incentive_status === "Approved"
      );
    } else {
      FilteredList = [...incentives];
    }
    res.json(FilteredList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createIncentive = async (req, res) => {
  try {
    const { order_id, agent_id, incentive_amount, incentive_status } = req.body;

    const newIncentive = new Incentive({
      order_id,
      agent_id,
      incentive_amount,
      incentive_status,
    });

    const savedIncentive = await newIncentive.save();

    res.status(201).json(savedIncentive);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getIncentiveById = async (req, res) => {
  try {
    const incentiveId = req.params.id;
    const incentive = await Incentive.findById(incentiveId);
    const order = await Orders.findOne({ _id: incentive.order_id });
    const agent = await Agent.findOne({ _id: incentive.agent_id });
    // console.log({ incentive, order, agent });
    if (!incentive) {
      return res.status(404).json({ message: "Incentive not found" });
    }
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Extracting necessary details from the incentives and orders
    const formattedData = {
      ordernumber: order.ordernumber,
      customer_name: order.customer_name,
      model: order.model_name,
      category: order.model_category,
      incentive_amount: incentive.incentive_amount,
      incentive_status: incentive.incentive_status,
      trndate: incentive.trndate,
      trn_utr_number: incentive.trn_utr_number,
      trn_id: incentive.trn_id,
      createdAt: incentive.createdAt,
      updatedAt: incentive.updatedAt,
      model_booking_date: order.booking_date,
      txn_details: incentive.txn_details,
    };

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateIncentive = async (req, res) => {
  try {
    const incentiveId = req.params.id;
    // console.log("request.body", req.body);
    const updatedIncentive = await Incentive.findByIdAndUpdate(
      incentiveId,
      req.body,
      { new: true }
    );

    if (!updatedIncentive) {
      return res.status(404).json({ message: "Incentive not found" });
    }

    if (updatedIncentive.incentive_status === "Processed") {
      const order = await Orders.findOne({ _id: updatedIncentive.order_id });
      const agent = await Agent.findOne({ _id: updatedIncentive.agent_id });

      const formattedData = {
        ordernumber: order.ordernumber,
        customer_name: order.customer_name,
        model: order.model_name,
        category: order.model_category,
        incentive_amount: updatedIncentive.incentive_amount,
        incentive_status: updatedIncentive.incentive_status,
        trndate: updatedIncentive.trndate,
        trn_utr_number: updatedIncentive.trn_utr_number,
        trn_id: updatedIncentive.trn_id,
        createdAt: updatedIncentive.createdAt,
        updatedAt: updatedIncentive.updatedAt,
        model_booking_date: order.booking_date,
        txn_details: updatedIncentive.txn_details,
      };

      // const maillerConfig = {
      //   host: process.env.MAIL_HOST,
      //   port: process.env.MAIL_PORT,
      //   secure: false,
      //   auth: {
      //     user: process.env.MAIL_USER,
      //     pass: process.env.MAIL_PASSWORD,
      //   },
      //   tls: {
      //     rejectUnauthorized: false,
      //   },
      // };

      const maillerConfig = {
        service: "",
        host: "localhost",
        port: 25,
        secure: false,
        tls: {
          rejectUnauthorized: false,
        },
      };

      const transporter = nodemailer.createTransport(maillerConfig);
      // Create HTML email content with dynamic values
      const htmlContent = HTML_TEMPLATE(formattedData);

      const mailOptions = {
        // to: `${req.body.email}`,
        to: `${agent.email}`,
        from: `${process.env.MAIL_USER}`,
        subject: "Incentive Processed Successfully",
        html: htmlContent,
      };

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.error("there was an error: ", err);
        } else {
          console.log("here is the res: ", response);
          // res.status(200).json("recovery email sent");
        }
      });
    }

    res.json(updatedIncentive);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteIncentive = async (req, res) => {
  try {
    const incentiveId = req.params.id;
    const deletedIncentive = await Incentive.findByIdAndDelete(incentiveId);

    if (!deletedIncentive) {
      return res.status(404).json({ message: "Incentive not found" });
    }

    res.json({ message: "Incentive deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIncentivesByAgentId = async (req, res) => {
  try {
    const agentId = req.params.id; // Assuming the agent ID is passed as a parameter in the request

    // Replace the following logic with your actual implementation
    const incentives = await Incentive.find({ agent_id: agentId });

    if (!incentives || incentives.length === 0) {
      return res
        .status(404)
        .json({ message: "No incentives found for the specified agent ID" });
    }

    res.json(incentives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createIncentive,
  getAllIncentives,
  getIncentiveById,
  updateIncentive,
  deleteIncentive,
  getIncentivesByAgentId,
};
