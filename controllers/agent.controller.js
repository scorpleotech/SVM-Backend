const Agent = require("../models/agent.model");
const User = require("../models/users.model");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const HTML_TEMPLATE = require("../service/templates/agent-register-template");
const PASSWORD_RESET_HTML_TEMPLATE = require("../service/templates/agent-password-reset-template");
const PASSWORD_RESET_HTML_ADMIN_TEMPLATE = require("../service/templates/agent-password-reset-admin-template");
const ADMIN_HTML_TEMPLATE = require("../service/templates/agent-register-admin-template");
const Incentive = require("../models/incentive.model");
const Order = require("../models/orders.model");
const Excel = require("exceljs");
const axios = require("axios");

const otpService = require("../service/otp-service");

exports.createAgent = async (req, res) => {
  let user;
  try {
    // Generate random username
    const username =
      "SVMGC" + Math.random().toString(36).slice(-5).toUpperCase();

    // Generate random password
    const password = Math.random().toString(36).slice(-8);

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Check if agent role is empty
    let role = req.body.role;
    if (!role || Object.keys(role).length === 0) {
      // Set the default role object with desired permissions
      role = {
        staffonlyyou: false,
        "staff/add": false,
        "staff/id": false,
        "staff/list": false,
        staffdelete: false,
        staffview: false,

        categoriesonlyyou: false,
        "categories/add": false,
        "categories/id": false,
        "categories/list": false,
        "categories/delete": false,
        categoriesview: false,

        incentiveonlyyou: true,
        "incentive/add": false,
        "incentive/id": false,
        "incentive/list": false,
        "incentive/delete": false,
        incentiveview: true,

        bikevarientonlyyou: false,
        "bikevarient/add": false,
        "bikevarient/id": false,
        "bikevarient/list": false,
        "bikevarient/delete": false,
        bikevarientview: false,

        uploadcontentonlyyou: false,
        "uploadcontent/add": false,
        "uploadcontent/id": false,
        "uploadcontent/list": false,
        "uploadcontent/delete": false,
        uploadcontentview: false,

        testimonialonlyyou: false,
        "testimonial/add": false,
        "testimonial/id": false,
        "testimonial/list": false,
        "testimonial/delete": false,
        testimonialview: false,

        banneronlyyou: false,
        "banner/add": false,
        "banner/id": false,
        "banner/list": false,
        "banner/delete": false,
        bannerview: false,

        partneronlyyou: false,
        "partner/add": false,
        "partner/id": false,
        "partner/list": false,
        "partner/delete": false,
        partnerview: false,

        ordersview: true,
        "orders/list": false,
        ordersonlyyou: true,
        "orders/add": false,
        "orders/id": false,

        aboutusonlyyou: false,
        "aboutus/add": false,
        "aboutus/id": false,
        "aboutus/list": false,
        "aboutus/delete": false,
        aboutusview: false,

        productbanneronlyyou: false,
        "productbanner/add": false,
        "productbanner/id": false,
        "productbanner/list": false,
        "productbanner/delete": false,
        productbannerview: false,

        faqonlyyou: false,
        "faq/add": false,
        "faq/id": false,
        "faq/list": false,
        "faq/delete": false,
        faqview: false,

        storeonlyyou: false,
        "store/add": false,
        "store/id": false,
        "store/list": false,
        "store/delete": false,
        storeview: false,

        accessoriesonlyyou: false,
        "accessories/add": false,
        "accessories/id": false,
        "accessories/list": false,
        "accessories/delete": false,
        accessoriesview: false,

        visitusonlyyou: false,
        "visitus/add": false,
        "visitus/id": false,
        "visitus/list": false,
        "visitus/delete": false,
        visitusview: false,

        demoonlyyou: false,
        "demo/add": false,
        "demo/id": false,
        "demo/list": false,
        "demo/delete": false,
        demoview: false,

        blogsonlyyou: false,
        "blogs/add": false,
        "blogs/id": false,
        "blogs/list": false,
        "blogs/delete": false,
        blogsview: false,

        eventonlyyou: false,
        "event/add": false,
        "event/id": false,
        "event/list": false,
        "event/delete": false,
        eventview: false,

        newsonlyyou: false,
        "news/add": false,
        "news/id": false,
        "news/list": false,
        "news/delete": false,
        newsview: false,

        enquiryonlyyou: false,
        "enquiry/add": false,
        "enquiry/id": false,
        "enquiry/list": false,
        "enquiry/delete": false,
        enquiryview: false,

        customersonlyyou: false,
        "customers/add": false,
        "customers/id": false,
        "customers/list": false,
        "customers/delete": false,
        customersview: false,
      };
    }
    // Create user entry
    user = new User({
      created_user: req.body.created_user,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.mobile, // Assuming mobile number is the phone
      image: req.body.image,
      role: role,
      isCustomer: false,
      isAgent: true, // Set isAgent to true
      isActive: true,
      isVerified: true,
      username: username,
      password: password,
    });

    // Save user entry
    await user.save();

    // Create agent entry
    const agent = new Agent({
      user_id: user._id,
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      state: req.body.state,
      city: req.body.city,
      street_name: req.body.street_name,
      pincode: req.body.pincode,
      aadhar_number: req.body.aadhar_number,
      pan_number: req.body.pan_number,
      kyc_verified: req.body.kyc_verified,
      select_service: req.body.select_service,
      experience_in_automobile: req.body.experience_in_automobile,
      own_shop: req.body.own_shop,
      others_service: req.body.others_service,
      isActive: true,
      isVerified: true,
      shop_details: req.body.shop_details,
    });

    // Save agent entry
    await agent.save();

    // Update agent_id in the user table
    await User.findByIdAndUpdate(user._id, { agent_id: agent._id });

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
    const htmlContent = HTML_TEMPLATE(username, password);

    const adminHtmlContent = ADMIN_HTML_TEMPLATE(agent);

    // Define mail options for the first email
    const mailOptions1 = {
      to: `${req.body.email}`, // Email address for the first user
      from: `${process.env.MAIL_USER}`,
      // cc: ["projectsicore4@gmail.com", "rumeshvarmalliga@icore.net.in"],
      subject: "You are Registered as an Agent",
      html: htmlContent,
    };
    // Define mail options for the second email
    const mailOptions2 = {
      to: `${process.env.TO_MAIL_USER}`, // Email address for the second user (admin)
      from: `${process.env.MAIL_USER}`,
      subject: "New Agent Registered",
      html: adminHtmlContent,
    };

    // Send the first email
    transporter.sendMail(mailOptions1, (err1, response1) => {
      if (err1) {
        console.error("Error sending email to user:", err1);
      } else {
        // console.log("Email sent to user:", response1);
        // Send the second email after the first email is sent
        transporter.sendMail(mailOptions2, (err2, response2) => {
          if (err2) {
            console.error("Error sending email to admin:", err2);
          } else {
            console.log("Email sent to admin:", response2);
            // res.status(200).json("Both emails sent successfully");
          }
        });
      }
    });

    res.status(201).json({ message: "Agent registered successfully" });
  } catch (error) {
    if (user) {
      await User.findByIdAndDelete(user._id);
    }
    if (error.code === 11000) {
      const duplicateKey = Object.keys(error.keyPattern)[0];
      const duplicateValue = error.keyValue[duplicateKey];
      res.status(400).json({
        message: `${duplicateKey} '${duplicateValue}' is already registered.`,
      });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

exports.aadharVerify = async (req, res) => {
  try {
    const phone = req.body.phone;
    const data = JSON.stringify({
      uid: req.body.aadhaarNumber,
    });
    // console.log("pprocess.enc", process.env.SIGNZY_TOKEN);
    const response = await axios.post(
      "https://api.signzy.app/api/v3/aadhaar/verify",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.SIGNZY_TOKEN}`,
        },
      }
    );

    if (
      response.status === 400 ||
      response.status === 401 ||
      response.status === 409
    ) {
      res.status(response.status).json({
        error: response.error?.message
          ? response.error?.message
          : response.message,
      });
    } else {
      const aadharPhone = response.data.result.mobileNumber;
      const aadharLastThreeDigits = aadharPhone.slice(-3);
      const phoneLastThreeDigits = phone.slice(-3);
      if (aadharLastThreeDigits === phoneLastThreeDigits) {
        const otp = otpService.generateOTP(phone);

        const phoneWithCountryCode = `+91${phone}`;

        if (otp) {
          // Store OTP session variables and send OTP via SMS
          req.session.otp = otp;
          req.session.phone = phone;

          const placeholders = JSON.stringify({ text: otp });
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

          if (response.data.status !== "success") {
            return res.status(500).json({ error: "Failed to send OTP" });
          }

          return res
            .status(200)
            .json({ otp: otp, message: "OTP sent successfully" });
        } else {
          return res.status(500).json({ error: "Failed to generate OTP" });
        }
      } else {
        res
          .status(400)
          .json({ error: "Aadhaar Registered with different number" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.aadhaarVerifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const { phone } = req.session;

    if (otp === req.session.otp) {
      delete req.session.otp;
      delete req.session.phone;

      res.status(200).json({
        message: "OTP verified successfully",
      });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const { phone } = req.session;

    if (otp === req.session.otp) {
      const user = await User.findOne({ phone: phone });

      const password = Math.random().toString(36).slice(-8);

      user.password = password;
      await user.save();

      delete req.session.otp;
      delete req.session.phone;

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
      const htmlContent = PASSWORD_RESET_HTML_TEMPLATE(user.username, password);

      const adminHtmlContent = PASSWORD_RESET_HTML_ADMIN_TEMPLATE(
        user.username,
        password
      );

      // Define mail options for the first email
      const mailOptions1 = {
        to: `${user.email}`, // Email address for the first user
        from: `${process.env.MAIL_USER}`,
        // cc: ["projectsicore4@gmail.com", "rumeshvarmalliga@icore.net.in"],
        subject: "Password Reset Successfully",
        html: htmlContent,
      };

      // Define mail options for the second email
      const mailOptions2 = {
        to: `${process.env.TO_MAIL_USER}`, // Email address for the second user (admin)
        from: `${process.env.MAIL_USER}`,
        // cc: ["projectsicore4@gmail.com", "rumeshvarmalliga@icore.net.in"],
        subject: "Agent Reset his Password",
        html: adminHtmlContent,
      };

      // Send the first email
      transporter.sendMail(mailOptions1, (err1, response1) => {
        if (err1) {
          console.error("Error sending email to user:", err1);
        } else {
          // console.log("Email sent to user:", response1);
          // Send the second email after the first email is sent
          transporter.sendMail(mailOptions2, (err2, response2) => {
            if (err2) {
              console.error("Error sending email to admin:", err2);
            } else {
              console.log("Email sent to admin:", response2);
              // res.status(200).json("Both emails sent successfully");
            }
          });
        }
      });

      res.status(200).json({
        message: "Password Reset successfully successfully",
      });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};

// Get all agents
exports.getAllAgents = async (req, res) => {
  try {
    // const agents = await Agent.find().sort({ createdAt: -1 });

    const agents = await Agent.aggregate([
      {
        $lookup: {
          from: "users", // Name of the User collection
          localField: "user_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails", // Unwind the array created by lookup
      },
      {
        $project: {
          name: "$name",
          email: "$email",
          mobile: "$mobile",
          state: "$state",
          city: "$city",
          street_name: "$street_name",
          pincode: "$pincode",
          aadhar_number: "$aadhar_number",
          pan_number: "$pan_number",
          kyc_verified: "$kyc_verified",
          select_service: "$select_service",
          others_service: "$others_service",
          shop_details: "$shop_details",
          isActive: "$isActive",
          isVerified: "$isVerified",
          created_at: "$createdAt",
          updated_at: "$updatedAt",
          lastLogin: "$userDetails.lastLogin", // Include lastLogin from the UserDetails
          createdAt: "$userDetails.createdAt", // Include createdBy from the UserDetails
          updatedAt: "$userDetails.updatedAt", // Include updatedAt from the UserDetails
        },
      },
    ]);

    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAgentById = async (req, res) => {
  try {
    const agentId = req.params.id;

    // Aggregate query to fetch agent details along with user details
    const agent = await Agent.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(agentId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          name: 1,
          email: 1,
          mobile: 1,
          state: 1,
          city: 1,
          street_name: 1,
          pincode: 1,
          aadhar_number: 1,
          pan_number: 1,
          kyc_verified: 1,
          select_service: 1,
          shop_details: 1,
          others_service: 1,
          own_shop: 1,
          experience_in_automobile: 1,
          createdAt: 1,
          updatedAt: 1,
          isActive: 1,
          isVerified: 1,
          role: "$user.role",
          two_fa: "$user.two_fa",
          email_two_fa: "$user.email_two_fa",
          username: "$user.username",
          password: "$user.password",
          user_id: "$user._id",
        },
      },
    ]);

    if (!agent || agent.length === 0) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json(agent[0]); // Assuming you want to return the first matching agent
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // Update user details
    await User.findByIdAndUpdate(agent.user_id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.mobile,
      image: req.body.image,
      role: req.body.role,
    });

    res.json(agent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an agent
exports.deleteAgent = async (req, res) => {
  try {
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ message: "Agent deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changeActiveStatus = async (req, res) => {
  try {
    const agentId = req.params.id;
    const { isActive, isVerified } = req.body;

    // Find the agent to update
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Update the isActive field of the agent
    agent.isActive = isActive;
    agent.isVerified = isVerified;
    await agent.save();

    // Update the corresponding user's isActive field
    const user = await User.findById(agent.user_id);
    if (!user) {
      return res.status(404).json({ message: "Associated user not found" });
    }
    user.isActive = isActive;
    user.isVerified = isVerified;
    await user.save();

    res.json({ agent, message: "Active status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAgentByUserId = async (req, res) => {
  try {
    // console.log("Request received with ID:", req.params.id);

    const id = mongoose.Types.ObjectId(req.params.id);

    // console.log("Searching for agent with user ID:", id);

    const agent = await Agent.findOne({ user_id: id }).lean();

    // console.log("Found agent:", agent);

    if (!agent) {
      // console.log("Agent not found");
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json(agent);
  } catch (error) {
    console.error("Error fetching agent:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get total orders by agent ID
exports.getTotalOrdersByAgentId = async (req, res) => {
  try {
    const agentId = req.params.id;

    // Assuming your order schema has a field for agent_id
    const totalOrders = await Order.countDocuments({ agent_id: agentId });

    res.json(totalOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get monthly orders by agent ID
exports.getMonthlyOrdersByAgentId = async (req, res) => {
  try {
    const agentId = req.params.id;

    // Get the current month and year
    const currentMonth = new Date().getMonth() + 1; // Month is zero-based, so we add 1
    const currentYear = new Date().getFullYear();

    // Get the first and last day of the current month
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0); // Day 0 represents the last day of the previous month

    // Query to find orders for the current month by agent ID
    const monthlyOrders = await Order.countDocuments({
      agent_id: agentId,
      createdAt: {
        $gte: firstDayOfMonth,
        $lt: lastDayOfMonth,
      },
    });

    res.json(monthlyOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get incentive by agent ID
exports.getIncentiveByAgentId = async (req, res) => {
  try {
    const agentId = req.params.id;

    // Query to find incentives by agent ID
    const incentives = await Incentive.find({ agent_id: agentId });

    res.json(incentives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get incentive count by agent ID
exports.getTotalIncentiveByAgentId = async (req, res) => {
  try {
    const agentId = req.params.id;

    // Query to find incentives for the current month by agent ID
    const monthlyIncentives = await Incentive.find({
      agent_id: agentId,
    });

    // Calculate total incentive amount
    let totalIncentiveAmount = 0;
    monthlyIncentives.forEach((incentive) => {
      totalIncentiveAmount += incentive.incentive_amount;
    });

    res.json(totalIncentiveAmount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get total monthly incentive by agent ID
exports.getTotalMonthlyIncentiveByAgentId = async (req, res) => {
  try {
    const agentId = req.params.id;

    // Get the current month and year
    const currentMonth = new Date().getMonth() + 1; // Month is zero-based, so we add 1
    const currentYear = new Date().getFullYear();

    // Get the first and last day of the current month
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0); // Day 0 represents the last day of the previous month

    // Query to find incentives for the current month by agent ID
    const monthlyIncentives = await Incentive.find({
      agent_id: agentId,
      createdAt: {
        $gte: firstDayOfMonth,
        $lt: lastDayOfMonth,
      },
    });

    // Calculate total incentive amount
    let totalIncentiveAmount = 0;
    monthlyIncentives.forEach((incentive) => {
      totalIncentiveAmount += incentive.incentive_amount;
    });

    res.json(totalIncentiveAmount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exportAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Agents");

    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 25 },
      { header: "Phone", key: "mobile", width: 25 },
      { header: "City", key: "city", width: 25 },
      { header: "State", key: "state", width: 25 },
      { header: "Street Name", key: "street_name", width: 25 },
      { header: "Pincode", key: "pincode", width: 25 },
      { header: "Aadhar Number", key: "aadhar_number", width: 25 },
      { header: "Pan Number", key: "pan_number", width: 25 },
      { header: "KYC Verified", key: "kyc_verified", width: 25 },
      { header: "Select Service", key: "select_service", width: 25 },
      { header: "Others Service", key: "others_service", width: 25 },
      { header: "Shop Name", key: "shop_name", width: 25 },
      {
        header: "Shop Street Name",
        key: "shop_details.street_name",
        width: 25,
      },
      { header: "Shop City", key: "shop_details.city", width: 25 },
      { header: "Shop State", key: "shop_details.state", width: 25 },
      { header: "Shop Pincode", key: "shop_details.pincode", width: 25 },
      {
        header: "Shop Registration Number",
        key: "shop_details.shop_registration_number",
        width: 25,
      },
      { header: "Shop Bank", key: "shop_details.select_bank", width: 25 },
      { header: "Shop IFSC Code", key: "shop_details.ifsc_code", width: 25 },
      {
        header: "Shop Bank Account Number",
        key: "shop_details.bank_account_number",
        width: 25,
      },
      { header: "Shop Branch", key: "shop_details.branch", width: 25 },
      {
        header: "Shop Location Coordinates",
        key: "shop_details.add_location_coordinates",
        width: 25,
      },
      { header: "Created At", key: "createdAt", width: 25 },
      { header: "Updated At", key: "updatedAt", width: 25 },
    ];

    agents.forEach((agent) => {
      const row = {
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,
        city: agent.city,
        state: agent.state,
        street_name: agent.street_name,
        pincode: agent.pincode,
        aadhar_number: agent.aadhar_number,
        pan_number: agent.pan_number,
        kyc_verified: agent.kyc_verified,
        select_service: agent.select_service,
        others_service: agent.others_service,
        shop_name: agent.shop_details.shop_name,
        "shop_details.street_name": agent.shop_details.street_name,
        "shop_details.city": agent.shop_details.city,
        "shop_details.state": agent.shop_details.state,
        "shop_details.pincode": agent.shop_details.pincode,
        "shop_details.shop_registration_number":
          agent.shop_details.shop_registration_number,
        "shop_details.select_bank": agent.shop_details.select_bank,
        "shop_details.ifsc_code": agent.shop_details.ifsc_code,
        "shop_details.bank_account_number":
          agent.shop_details.bank_account_number,
        "shop_details.branch": agent.shop_details.branch,
        "shop_details.add_location_coordinates":
          agent.shop_details.add_location_coordinates,
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt,
      };
      worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=agents.xlsx");
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
