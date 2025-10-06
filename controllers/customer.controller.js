const passport = require("passport");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");

const Customer = require("../models/customer.model");
const Users = require("../models/users.model");
const Orders = require("../models/orders.model");
const otpService = require("../service/otp-service");
const BikeVarient = require("../models/bikevarient.model");
const Accessory = require("../models/accessories.model");
const Categories = require("../models/categories.model");
const Agent = require("../models/agent.model");
const Store = require("../models/store.model");
const axios = require("axios");
const fs = require("fs");
const chromium = require("chrome-aws-lambda");
const path = require("path");

const pdf = require("html-pdf-node");

const Excel = require("exceljs");

const roleTitle = "customers";

const HTML_TEMPLATE = require("../service/templates/order-template");
const INVOICE_HTML_TEMPLATE = require("../service/templates/invoice-pdf-template");
const HTML_IMAGE_TEMPLATE = require("../service/templates/order-image-template");
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

async function createAndSavePdf(htmlContent, orderId) {
  const invoicesFolder = path.join(__dirname, "..", "Invoices");
  const outputPath = path.join(invoicesFolder, `${orderId}.pdf`);

  try {
    if (!fs.existsSync(invoicesFolder)) {
      fs.mkdirSync(invoicesFolder);
    }

    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();

    // Set content and format for the PDF
    await page.setContent(htmlContent);
    await page.pdf({ path: outputPath, format: "A4" });

    await browser.close();

    return outputPath;
  } catch (err) {
    console.error("Error generating PDF:", err);
    throw err;
  }
}

exports.dummyPdfGnerate = async (req, res) => {
  const htmlContent = "<h1>Hello, world! From new Pdf</h1>";
  const orderId = Math.random().toString(36).substr(2, 9);

  try {
    const fileName = await createAndSavePdf(htmlContent, orderId);
    const pdfPath = path.join(__dirname, "..", "Invoices", `${orderId}.pdf`);

    // Read the PDF file
    fs.readFile(pdfPath, (err, data) => {
      if (err) {
        console.error("Error reading PDF file:", err);
        res.status(500).send({ error: "Error reading PDF file" });
      } else {
        res.setHeader("Content-Type", "application/pdf");
        res.send(data);
      }
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send({ error: "Error generating PDF" });
  }
};

exports.initiateLogin = async (req, res) => {
  try {
    let { phone } = req.body;
    phoneWithCountryCode = "91" + phone;

    // Check if the phone number already exists in the customers collection
    const existingCustomer = await Customer.findOne({ phone });

    let user, customer, order;

    if (!existingCustomer) {
      // If the customer doesn't exist, check if the user exists with this phone number
      user = await Users.findOne({ phone });

      if (!user) {
        // If the user doesn't exist, create a new user and customer
        user = new Users({
          phone,
          rolename: "Customer",
          isCustomer: true,
          lastLogin: Date.now(),
        });

        await user.save();

        customer = new Customer({
          phone,
          user_id: user._id,
        });

        await customer.save();
      } else {
        // If the user exists but not linked to a customer yet, add him to a new or existing customer
        customer = await Customer.findOneAndUpdate(
          { phone },
          { $set: { user_id: user._id } },
          { upsert: true, new: true }
        );
        sendNewCustomerPhone(phone);
      }
    } else {
      user = await Users.findOne({ _id: existingCustomer.user_id });
      order = await Orders.findOne({ customer_id: existingCustomer._id });
    }

    // Send email notification to admin

    // Generate an OTP for login
    const otp = otpService.generateOTP(phone);

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

      // const response = await fetch(url);
      // const data = await response.json();

      console.log("Fetching data...");

      const response = await axios.get(url);
      const data = response.data;

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
    res.status(500).json({
      Error: error.message,
      Message: "Internal Server Error",
    });
  }
};
exports.initiateSignup = async (req, res) => {
  try {
    const {
      phone,
      name,
      email,
      dealer_hub,
      coupon_code,
      state,
      city,
      category_id,
      bike_varient_id,
      amount,
    } = req.body;

    // Check if the phone number already exists in the database
    const existingCustomer = await Customer.findOne({
      $or: [{ phone }, { email }],
    });

    const AlreadyOrder = await Orders.findOne({
      customer_id: existingCustomer?._id,
      order_status: { $nin: ["Cancelled"] },
    });

    if (AlreadyOrder) {
      return res.status(400).json({
        message: "Customer already has an active order Please Check My Orders",
      });
    }

    // if (!existingCustomer) {
    //   return res.status(404).json({ message: "Customer not found" });
    // }
    if (existingCustomer) {
      // Find the order details based on the order ID
      // const existCustomer = await Customer.findOne({ user:  });
      existingCustomer.phone = phone;
      if (!existingCustomer.name && existingCustomer.name !== "" && name) {
        existingCustomer.name = name;
      }
      // existingCustomer.name =
      //   !existingCustomer.name && existingCustomer.name !== "" && name;
      existingCustomer.email = email;
      existingCustomer.dealer_hub = dealer_hub;
      existingCustomer.coupon_code = coupon_code;
      existingCustomer.state = state;
      existingCustomer.city = city;

      await existingCustomer.save();

      const user = await Users.findOne({ _id: existingCustomer.user_id });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.phone = phone;
      if (!user.name && user.name !== "" && name) {
        user.name = name;
      }
      // user.name = user.name = !user.name && user.name !== "" && name;
      user.email = email;

      await user.save();

      // const order = await Orders.findOne({ customer_id: existingCustomer._id });
      const order = await createOrders(
        existingCustomer?._id,
        bike_varient_id,
        coupon_code,
        amount,
        dealer_hub
      );

      // console.log("Girl order", order);
      // console.log("mail", process.env.MAIL_SECURE);
      // const maillerConfig = {
      //   // service: process.env.MAIL_SERVICE,
      //   host: process.env.MAIL_HOST,
      //   port: process.env.MAIL_PORT,
      //   // secure: process.env.MAIL_SECURE,
      //   secure: false,
      //   auth: {
      //     user: process.env.MAIL_USER,
      //     pass: process.env.MAIL_PASSWORD,
      //   },
      // };

      // const transporter = nodemailer.createTransport(maillerConfig);
      // // Create HTML email content with dynamic values

      // const dealerhub = await Store.findOne({ _id: dealer_hub });

      // const agent = await Users.findOne({
      //   username: coupon_code,
      // });

      // const bikeVarient = await BikeVarient.findOne({ _id: bike_varient_id });

      // const categories = await Categories.findOne({
      //   _id: bikeVarient.category_id,
      // });

      // const htmlContent = HTML_TEMPLATE(order, dealerhub, bikeVarient);

      // const template = await INVOICE_HTML_TEMPLATE(
      //   order,
      //   dealerhub,
      //   agent,
      //   bikeVarient,
      //   categories
      // );
      // const options = { format: "A4" };
      // const file = { content: template };

      // const pdfBuffer = await pdf.generatePdf(file, options);

      // const mailOptions1 = {
      //   to: `${order.email}`, // Email address for the second user (admin)
      //   from: `${process.env.MAIL_USER}`,
      //   subject: "Booking Summary",
      //   html: htmlContent,
      //   attachments: [
      //     {
      //       filename: "invoice.pdf",
      //       content: pdfBuffer,
      //       encoding: "base64",
      //     },
      //     {
      //       filename: "Terms_and_Conditions.pdf",
      //       path: path.resolve(
      //         __dirname,
      //         "../service/templates/General_Terms_and_Conditions.pdf"
      //       ),
      //       contentType: "application/pdf",
      //     },
      //   ],
      // };
      // const mailOptions2 = {
      //   // to: `${req.body.email}`,
      //   to: `${process.env.TO_MAIL_USER}`,
      //   from: `${process.env.MAIL_USER}`,
      //   subject: "New Booking",
      //   html: htmlContent, // Use HTML content here
      //   attachments: [
      //     {
      //       filename: "invoice.pdf",
      //       content: pdfBuffer,
      //       encoding: "base64",
      //     },
      //     {
      //       filename: "Terms_and_Conditions.pdf",
      //       path: path.resolve(
      //         __dirname,
      //         "../service/templates/General_Terms_and_Conditions.pdf"
      //       ),
      //       contentType: "application/pdf",
      //     },
      //   ],
      // };

      // // Send the first email
      // transporter.sendMail(mailOptions1, (err1, response1) => {
      //   if (err1) {
      //     console.error("Error sending email to user:", err1);
      //   } else {
      //     console.log("Email sent to user:", response1);
      //     // Send the second email after the first email is sent
      //     transporter.sendMail(mailOptions2, (err2, response2) => {
      //       if (err2) {
      //         console.error("Error sending email to admin:", err2);
      //       } else {
      //         console.log("Email sent to admin:", response2);
      //         // res.status(200).json("Both emails sent successfully");
      //       }
      //     });
      //   }
      // });

      if (!order) {
        return res.status(500).json({ error: "Failed to create order" });
      } else {
        return res.status(200).json({
          phone: phone,
          customer: existingCustomer,
          order: order,
          message: "Order Created successfully",
        });
      }
    } else {
      // Check if the phone number already exists in the Users model
      let user = await Users.findOne({ phone });

      if (!user) {
        // If the user doesn't exist, create a new user
        user = new Users({
          name,
          email,
          phone,
          rolename: "Customer",
          isCustomer: true,
        });

        await user.save();
      }

      // If the phone number doesn't exist, store new customer details and send OTP
      const customer = new Customer({
        name,
        email,
        phone,
        state,
        city,
        dealer_hub,
        user_id: user?._id,
        category_id,
        bike_varient_id,
      });
      await customer.save();

      // Create an order for the new customer
      const order = await createOrders(
        customer?._id,
        bike_varient_id,
        coupon_code,
        amount,
        dealer_hub
      );
      let accessories;
      if (coupon_code !== null && coupon_code !== undefined) {
        accessories = await Accessory.findOne({
          couponCode: coupon_code,
        });
      }

      // const dealerhub = await Store.findOne({ _id: dealer_hub });

      // const agent = await Users.findOne({
      //   username: coupon_code,
      // });

      // const bikeVarient = await BikeVarient.findOne({ _id: bike_varient_id });
      // const categories = await Categories.findOne({
      //   _id: bikeVarient.category_id,
      // });

      // const template = await INVOICE_HTML_TEMPLATE(
      //   order,
      //   dealerhub,
      //   agent,
      //   bikeVarient,
      //   categories
      // );
      // const options = { format: "A4" };
      // const file = { content: template };

      // const pdfBuffer = await pdf.generatePdf(file, options);

      // console.log("boy order", order);

      // const maillerConfig = {
      //   service: process.env.MAIL_SERVICE,
      //   host: "smtp.gmail.com",
      //   port: 587,
      //   secure: false,
      //   auth: {
      //     user: process.env.MAIL_USER,
      //     pass: process.env.MAIL_PASSWORD,
      //   },
      // };

      // Send email notification to admin
      // sendNewCustomerPhone(customer.phone);

      // const maillerConfig = {
      //   // service: process.env.MAIL_SERVICE,
      //   host: process.env.MAIL_HOST,
      //   port: process.env.MAIL_PORT,
      //   // secure: process.env.MAIL_SECURE,
      //   secure: false,
      //   auth: {
      //     user: process.env.MAIL_USER,
      //     pass: process.env.MAIL_PASSWORD,
      //   },
      // };

      // const transporter = nodemailer.createTransport(maillerConfig);
      // // Create HTML email content with dynamic values
      // const htmlContent = HTML_TEMPLATE(order, dealerhub, bikeVarient);

      // // Define mail options for the second email
      // const mailOptions1 = {
      //   to: `${order.email}`, // Email address for the second user (admin)
      //   from: `${process.env.MAIL_USER}`,
      //   // cc: ["projectsicore4@gmail.com", "rumeshvarmalliga@icore.net.in"],
      //   subject: "Booking Summary",
      //   html: htmlContent, // Use HTML content here
      //   attachments: [
      //     {
      //       filename: "invoice.pdf",
      //       content: pdfBuffer,
      //       encoding: "base64",
      //     },
      //     {
      //       filename: "Terms_and_Conditions.pdf",
      //       path: path.resolve(
      //         __dirname,
      //         "../service/templates/General_Terms_and_Conditions.pdf"
      //       ),
      //       contentType: "application/pdf",
      //     },
      //   ],
      // };
      // const mailOptions2 = {
      //   // to: `${req.body.email}`,
      //   to: `${process.env.TO_MAIL_USER}`,
      //   from: `${process.env.MAIL_USER}`,
      //   subject: "New Booking",
      //   html: htmlContent, // Use HTML content here
      //   attachments: [
      //     {
      //       filename: "invoice.pdf",
      //       content: pdfBuffer,
      //       encoding: "base64",
      //     },
      //     {
      //       filename: "Terms_and_Conditions.pdf",
      //       path: path.resolve(
      //         __dirname,
      //         "../service/templates/General_Terms_and_Conditions.pdf"
      //       ),
      //       contentType: "application/pdf",
      //     },
      //   ],
      // };

      // // Send the first email
      // transporter.sendMail(mailOptions1, (err1, response1) => {
      //   if (err1) {
      //     console.error("Error sending email to user:", err1);
      //   } else {
      //     // console.log("Email sent to user:", response1);
      //     // Send the second email after the first email is sent
      //     transporter.sendMail(mailOptions2, (err2, response2) => {
      //       if (err2) {
      //         console.error("Error sending email to admin:", err2);
      //       } else {
      //         // console.log("Email sent to admin:", response2);
      //         res.status(200).json("Both emails sent successfully");
      //       }
      //     });
      //   }
      // });

      if (!order) {
        return res.status(500).json({ error: "Failed to create order" });
      } else {
        return res.status(200).json({
          phone: phone,
          order: order,
          customer: customer,
          accessories: accessories,
          message: "Order Created successfully",
        });
      }
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};

exports.checkout = async (req, res) => {
  let { phone } = req.body;

  const existingCustomer = await Customer.findOne({ phone });

  if (!existingCustomer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  const otp = otpService.generateOTP(phone);
  // console.log(otp);
  phone = "91" + phone;
  if (otp) {
    // Construct the message
    // const message = `SrivaruMotors: Use OTP :${otp} to log in to your account. DO NOT disclose it to anyone.
    // www.srivarumotors.com`;

    // Make request to Textlocal API
    // console.log("Message:", message);
    // console.log("Sending OTP:", process.env.TEXTLOCAL_API_KEY);
    try {
      const placeholders = JSON.stringify({ text: otp });
      const params = new URLSearchParams({
        apikey: process.env.TEXTLOCAL_API_KEY,
        numbers: phone,
        template_id: "1007198070315207233",
        message: `SrivaruMotors: Use OTP :${otp} to log in to your account. DO NOT disclose it to anyone. \nwww.srivarumotors.com`,
        sender: "SVMPLT",
        placeholder: placeholders,
      });
      const url = `https://api.textlocal.in/send/?${params.toString()}`;
      const response = await axios.get(url);

      // const data = await response.json();

      if (response.data.status === "success") {
        req.session.otp = otp;
        req.session.phone = phone;
        return res
          .status(200)
          .json({ otp: otp, message: "OTP sent successfully" });
      } else {
        return res.status(500).json({ error: "Failed to send OTP" });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      return res.status(500).json({ error: "Failed to send OTP" });
    }
  } else {
    return res.status(500).json({ error: "Failed to generate OTP" });
  }
};

exports.verifySignup = async (req, res) => {
  try {
    const { otp, phone, type } = req.body;

    console.log(otp, phone, type);

    if (otp === req.session.otp) {
      const customer = await Customer.findOne({ phone });
      // console.log("customer", customer);
      const user = await Users.findOne({ _id: customer?.user_id });
      // console.log("user", user);
      // const order = await Orders.findOne({ customer_id: customer?._id });

      user.lastLogin = Date.now();
      user.save();

      // console.log("user", user);

      const token = signToken(customer._id);
      res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: true,
      });

      delete req.session.otp;
      delete req.session.phone;

      const order = await Orders.findOne({
        customer_id: customer._id,
        order_status: "Pending",
      });

      if (type === "order" && order.booking_amount === 0) {
        const customer = await Customer.findOne({ phone });
        console.log("Print inside condition");

        // const maillerConfig = {
        //   host: process.env.MAIL_HOST,
        //   port: process.env.MAIL_PORT,
        //   secure: false,
        //   // auth: {},
        //   auth: {
        //     user: process.env.MAIL_USER,
        //     pass: process.env.MAIL_PASSWORD,
        //   },
        //   // tls: {
        //   //   rejectUnauthorized: false,
        //   // },
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

        const dealerhub = await Store.findOne({ _id: order.dealer_hub });

        const agent = await Users.findOne({
          username: order.agent_code,
        });

        const bikeVarient = await BikeVarient.findOne({
          _id: order.model_id,
        });

        const categories = await Categories.findOne({
          _id: bikeVarient.category_id,
        });

        const htmlContent = await HTML_TEMPLATE(order, dealerhub, bikeVarient);

        const template = await INVOICE_HTML_TEMPLATE(
          order,
          dealerhub,
          agent,
          bikeVarient,
          categories
        );

        console.log("template", template);
        const options = { format: "A4" };
        const file = { content: template };
        let pdfFile, pdfPath;

        try {
          // const pdfBuffer = await generatePDF(template, options);
          pdfPath = await createAndSavePdf(template, order._id);
          pdfFile = path.join(__dirname, "..", "Invoices", `${order._id}.pdf`);
          console.log("pdfFile", pdfFile);
        } catch (err) {
          console.log(err);
        }

        const mailOptions1 = {
          to: `${order.email}`,
          from: `${process.env.MAIL_USER}`,
          subject: "Booking Summary - SrivaruMotors",
          html: htmlContent,
          attachments: [
            {
              filename: "invoice.pdf",
              path: path.resolve(pdfPath),
              contentType: "application/pdf",
            },
            {
              filename: "Terms_and_Conditions.pdf",
              path: path.resolve(
                __dirname,
                "../service/templates/General_Terms_and_Conditions.pdf"
              ),
              contentType: "application/pdf",
            },
          ],
        };
        const mailOptions2 = {
          to: `${process.env.TO_MAIL_USER}`,
          from: `${process.env.MAIL_USER}`,
          subject: "New Booking - SrivaruMotors",
          html: htmlContent,
          attachments: [
            {
              filename: "invoice.pdf",
              path: path.resolve(pdfPath),
              contentType: "application/pdf",
            },
            {
              filename: "Terms_and_Conditions.pdf",
              path: path.resolve(
                __dirname,
                "../service/templates/General_Terms_and_Conditions.pdf"
              ),
              contentType: "application/pdf",
            },
          ],
        };

        transporter.sendMail(mailOptions1, (err1, response1) => {
          if (err1) {
            console.error("Error sending email to user:", err1);
          } else {
            console.log("Email sent to user:", response1);
            transporter.sendMail(mailOptions2, (err2, response2) => {
              if (err2) {
                console.error("Error sending email to admin:", err2);
              } else {
                console.log("Email sent to admin:", response2);
              }
            });
          }
        });
        res
          .status(200)
          .json({ customer, user, order, message: "Signup successful" });
      } else {
        return res.status(200).json({
          phone: phone,
          customer: customer,
          order: order,
          user: user,
        });
      }
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

// BKINGE591171800141;
// BKINGG591171800141;

// Function to create an order
async function createOrders(
  customer_id,
  model_id,
  coupon_code,
  amount,
  dealer_hub
) {
  // Check if there are any pending orders for the customer
  const pendingOrders = await Orders.find({
    customer_id: customer_id,
    order_status: "Pending", // Assuming "Booked" is the status for pending orders
  });

  // If there are pending orders, delete them
  if (pendingOrders.length > 0) {
    await Orders.deleteMany({
      customer_id: customer_id,
      order_status: "Pending",
    });
  }

  const customer = await Customer.findById(customer_id);

  // console.log("customer", customer);

  if (!customer) {
    throw new Error("Customer not found");
  }

  const model = await BikeVarient.findById(model_id).populate("category_id");

  // console.log("model", model);

  if (!model) {
    throw new Error("Model not found");
  }

  // Determine the prefix based on the category
  let prefix = "";
  if (model.category_id.title === "Elite") {
    prefix = "E";
  } else if (model.category_id.title === "Grand") {
    prefix = "G";
  } else {
    prefix = "E";
  }

  const user = await Users.findOne({
    $and: [{ username: coupon_code }, { username: { $ne: null } }],
  });

  let agent;
  if (user) {
    agent = await Agent.findOne({ user_id: user._id });
  }

  const dealerhub = await Store.findOne({ _id: dealer_hub });

  if (!dealerhub) {
    throw new Error("Dealerhub not found");
  }

  const address = {
    city: customer.city,
    state: customer.state,
  };

  // Create a new order
  const newOrder = new Orders({
    customer_id: customer._id,
    invoice_number: await generateInvoiceNumber(),
    customer_name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: address,
    model_id: model_id,
    model_name: model.name,
    model_category: model.category_id.title,
    model_booked_color: model.colorName,
    price: model.price,
    booking_amount: amount,
    coupon_code: coupon_code,
    dealer_hub: dealerhub?._id,
    agent_id: agent ? agent._id : null,
    agent_code: user ? user.username : null,
    agent_shop_name: agent ? agent.shop_details.shop_name : null,
    booking_date: new Date(),
    ordernumber: generateOrderNumber(prefix), // Generate order number with prefix
  });
  // console.log("newOrder", newOrder);
  await newOrder.save();
  return newOrder;
}

// Function to generate order number
function generateOrderNumber(prefix) {
  //generate random number 12 digit
  const number = Math.floor(Math.random() * 10000000000).toString();
  return `B${prefix}${number}`;
}

async function generateInvoiceNumber() {
  const order = await Orders.find().countDocuments();
  // Convert order number to a three-digit string
  let paddedOrderNumber = String(order).padStart(6, "0");

  // Generate the invoice number
  let invoiceNumber = `SVM${paddedOrderNumber}`;
  console.log("invoiceNumber", invoiceNumber);
  return invoiceNumber;
}

exports.createOrder = async (req, res) => {
  try {
    const { customer_id, model_id, coupon_code } = req.body;

    // Check if there are any pending orders for the customer
    const pendingOrders = await Orders.find({
      customer_id: customer_id,
      order_status: "Pending", // Assuming "Booked" is the status for pending orders
    });

    // If there are pending orders, delete them
    if (pendingOrders.length > 0) {
      await Orders.deleteMany({
        customer_id: customer_id,
        order_status: "Pending",
      });
    }

    const customer = await Customer.findById(customer_id);

    // console.log("customer", customer);

    if (!customer) {
      throw new Error("Customer not found");
    }

    const model = await BikeVarient.findById(model_id).populate("category_id");

    // console.log("model", model);

    if (!model) {
      throw new Error("Bike variant not found");
    }

    // Determine the prefix based on the category
    let prefix = "";
    if (model.category_id.title === "Lite") {
      prefix = "E";
    } else if (model.category_id.title === "Grand") {
      prefix = "G";
    } else {
      prefix = "E";
    }

    const user = await Users.findOne({ username: coupon_code });

    // if (!user) {
    //   return res.status(404).json({ error: "User not found" });
    // }
    const agent = await Agent.findOne({ user_id: user._id });

    // if (!agent) {
    //   return res.status(404).json({ error: "Agent not found" });
    // }
    // console.log("user", user);
    // console.log("Agent", agent);

    // if (!Agent) {
    //   return res.status(404).json({ error: "Agent not found" });
    // }

    // Assuming `customer` and `Agent` are defined earlier in your code
    const address = {
      city: customer.city,
      state: customer.state,
    };

    // Create a new order
    const newOrder = new Orders({
      customer_id: customer._id,
      customer_name: customer.name, // Assuming customer name is stored in the `name` field
      email: customer.email,
      phone: customer.phone, // Assuming mobile number is stored in the `mobile` field
      address: address,
      model_id: model_id,
      model_name: model.name,
      model_category: model.category_id.title,
      model_booked_color: model.colorName,
      price: model.price,
      coupon_code: coupon_code,
      agent_id: agent._id,
      agent_code: user.username,
      agent_shop_name: agent.shop_details.shop_name,
      booking_date: new Date(),
      ordernumber: generateOrderNumber(prefix), // Generate order number with prefix
    });
    // console.log("newOrder", newOrder);
    await newOrder.save();

    return newOrder;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
};

exports.saveAddress = async (req, res) => {
  try {
    const { customer_id, order_id, delivery_address, billing_address } =
      req.body;
    // Find the customer document by its customer_id
    const customer = await Customer.findById(customer_id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Update the customer's delivery_address and billing_address fields
    if (delivery_address) {
      customer.delivery_address = delivery_address;
    }
    if (order_id) {
      customer.order_id = order_id;
    }
    if (billing_address) {
      customer.billing_address = billing_address;
    }

    // Save the updated customer document
    await customer.save();

    res.status(200).json({ message: "Address saved successfully", customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const rolesControl = req.user.role;

    if (rolesControl[roleTitle + "/list"]) {
      // Check if the user has permission to list customers
      const customers = await Users.find(
        { isCustomer: true }, // Query to find customers where isCustomer is true
        {
          isActive: 1,
          name: 1,
          email: 1,
          _id: 1,
          isCustomer: 1,
          address: 1,
          phone: 1,
          prefix: 1,
          lastLogin: 1,
          createdAt: 1,
        }
      );

      res.json(customers); // Send the list of customers
    } else if (rolesControl[roleTitle + "onlyyou"]) {
      // Check if the user has permission to view only their own customers
      const customers = await Users.find({
        $and: [{ isCustomer: true }, { "created_user.id": `${req.user._id}` }],
      });

      res.json(customers); // Send the list of customers
    } else {
      // If user doesn't have permission, send a 403 Forbidden status
      res.status(403).json({
        message: {
          message: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  } catch (error) {
    // If any error occurs, send an error response
    res.status(500).json({
      message: "Error: " + error,
      variant: "error",
    });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customerId = mongoose.Types.ObjectId(req.params.id);

    const user = await Users.findById(customerId);

    // Find the customer to be deleted
    const customer = await Customer.findOne({ user_id: user._id });
    if (customer) {
      await Customer.findByIdAndDelete(customer._id);
      // return res.status(404).json({ message: "Customer not found" });
    }

    // Delete the corresponding user record
    await Users.findByIdAndDelete(user._id);

    // Delete the customer record

    res.json({ message: "Customer and user deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const updatedData = req.body; // This should contain the fields you want to update

    // Update the corresponding user record
    await Users.findByIdAndUpdate(customer.customer_id, updatedData);

    // Update the customer record
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      updatedData,
      { new: true }
    );

    res.json({
      message: "Customer and user updated successfully",
      updatedCustomer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.changeActiveStatus = async (req, res) => {
  try {
    const customerId = req.params.id;
    const { isActive } = req.body;

    // Find the customer to update
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Update the isActive field of the customer
    customer.isActive = isActive;
    await customer.save();

    // Update the corresponding user's isActive field
    const user = await Users.findById(customer.customer_id);
    if (!user) {
      return res.status(404).json({ message: "Associated user not found" });
    }
    user.isActive = isActive;
    await user.save();

    res.json({ message: "Active status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrderbyCustomerId = async (req, res) => {
  try {
    const userId = req.params.id;
    const { type } = req.query;

    // Find the customer details based on the user ID
    const customer = await Customer.findById(userId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Find the order details based on the order ID
    let order;

    if (type === true || type === "true") {
      const existorder = await Orders.find({
        customer_id: customer._id,
        order_status: "Booked",
      })
        .sort({ updatedAt: -1 })
        .limit(1);
      order = existorder[0];
    } else {
      order = await Orders.findOne({
        customer_id: customer._id,
        order_status: "Pending",
      });
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Retrieve the model ID from the order details
    const modelId = order.model_id;

    if (!modelId) {
      return res
        .status(404)
        .json({ message: "Model ID not found in the order" });
    }

    // Find the bike variant details based on the model ID
    const bikeVariantDetails = await BikeVarient.findById(modelId);

    if (!bikeVariantDetails) {
      return res
        .status(404)
        .json({ message: "Bike variant details not found" });
    }

    const categoriesDetails = await Categories.findById(
      bikeVariantDetails.category_id
    );

    const dealerhub = await Store.findOne({ _id: customer.dealer_hub });

    // Return the combined details as the response
    return res.status(200).json({
      customerDetails: customer,
      bikeVariantDetails,
      order,
      categoriesDetails,
      dealer_hub: dealerhub?.name,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};

function sendNewCustomerPhone(customerPhone) {
  // const maillerConfig = {
  //   host: process.env.MAIL_HOST,
  //   port: process.env.MAIL_PORT,
  //   // secure: process.env.MAIL_SECURE,
  //   secure: false,
  //   auth: {
  //     user: process.env.MAIL_USER,
  //     pass: process.env.MAIL_PASSWORD,
  //   },
  // };

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

  const mailOptions = {
    to: `${process.env.TO_MAIL_USER}`,
    from: `${process.env.MAIL_USER}`,
    // cc: ["projectsicore4@gmail.com", "rumeshvarmalliga@icore.net.in"],
    subject: "New Customer Signup",
    text: `A New Customer tried to signin, please find the customer's phone number "${customerPhone}". Thank you`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

exports.customerTableClear = async (req, res) => {
  try {
    const deleteCustomer = await Customer.deleteMany({});
    if (deleteCustomer) {
      res.json({ message: "Customer deleted successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.exportAllCustomer = async (req, res) => {
  try {
    const customers = await Customer.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          name: "$name",
          email: "$email",
          phone: "$phone",
          createdAt: "$user.createdAt",
          updatedAt: "$user.updatedAt",
          state: "$state",
          city: "$city",
        },
      },
    ]);
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Customers");

    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 25 },
      { header: "Phone", key: "phone", width: 25 },
      { header: "City", key: "city", width: 25 },
      { header: "State", key: "state", width: 25 },
      { header: "Created At", key: "createdAt", width: 25 },
      { header: "Updated At", key: "updatedAt", width: 25 },
    ];

    customers.forEach((customer) => {
      worksheet.addRow(customer);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=customers.xlsx");
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

async function generatePDF(htmlContent, options) {
  const __dirname = require("../Invoices");
  const pdfBuffer = await pdf.generatePdf({ content: htmlContent }, options);
  const filePath = path.join(__dirname, "booking_summary.pdf");

  // Write PDF to file
  fs.writeFileSync(filePath, pdfBuffer);
  console.log(`PDF saved to ${filePath}`);

  return filePath;
}
exports.customerCompleteOrderSummary = async (req, res) => {
  try {
    const customer = await Customer.findOne({ user_id: req.params.id });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const orders = await Orders.find({
      customer_id: customer._id,
      order_status: { $in: ["Completed", "Booked", "Pending"] }, // Filter orders with status "Completed"
    });

    const orderSummaries = await Promise.all(
      orders.map(async (order) => {
        const bikeVarient = await BikeVarient.findById(order.model_id);
        const dealer_hub = await Store.findOne({ _id: order.dealer_hub });
        return {
          _id:order._id,
          orderNo: order.ordernumber,
          createdAt: order.booking_date,
          name: customer.name,
          mobile: customer.phone,
          email: customer.email,
          hub: dealer_hub.name,
          status: order.order_status,
          city: order.address.city,
          state: order.address.state,
          coupon: order.coupon_code,
          bookingAmount: order.booking_amount,
          unitPrice: bikeVarient.price,
          model: order.model_name,
          category: order.model_category,
          color: order.model_booked_color,
          image: bikeVarient.image,
        };
      })
    );

    return res.status(200).json(orderSummaries);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error });
  }
};
