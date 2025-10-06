const express = require("express");
const Paytm = require("paytmchecksum");
const puppeteer = require("puppeteer");
const router = express.Router();
let Orders = require("../models/orders.model");
let Customer = require("../models/customer.model");
const crypto = require("crypto");
var https = require("https");
const { log } = require("util");
var http = require("http"),
  fs = require("fs"),
  qs = require("querystring");
const chromium = require("chrome-aws-lambda");
const path = require("path");
const Users = require("../models/users.model");
const BikeVarient = require("../models/bikevarient.model");
const Accessory = require("../models/accessories.model");
const Categories = require("../models/categories.model");
const Agent = require("../models/agent.model");
const Store = require("../models/store.model");
const axios = require("axios");
const HTML_TEMPLATE = require("../service/templates/order-template");
const INVOICE_HTML_TEMPLATE = require("../service/templates/invoice-pdf-template");
const HTML_IMAGE_TEMPLATE = require("../service/templates/order-image-template");
const nodemailer = require("nodemailer");

const pdf = require("html-pdf-node");

const Excel = require("exceljs");

const MERCHANT_ID = "3567715";
const ACCESS_CODE = "AVFR91LF42AH28RFHA";
const WORKING_KEY = "47CF98CD9936CB662663115FFF7AF5DC";
const REDIRECT_URL = "https://api.srivarumotors.com/payment/response";

function hextobin(hex) {
  return Buffer.from(hex, "hex");
}

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

function encrypt(plainText, key) {
  const md5Key = crypto.createHash("md5").update(key).digest("hex");
  const keyBuffer = hextobin(md5Key);
  const initVector = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]);
  const cipher = crypto.createCipheriv("aes-128-cbc", keyBuffer, initVector);
  let encryptedText = cipher.update(plainText, "utf8", "hex");
  encryptedText += cipher.final("hex");
  return encryptedText;
}

function decrypt(encryptedText, key) {
  const md5Key = crypto.createHash("md5").update(key).digest("hex");
  const keyBuffer = hextobin(md5Key);
  const initVector = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]);
  const encryptedBuffer = hextobin(encryptedText);
  const decipher = crypto.createDecipheriv(
    "aes-128-cbc",
    keyBuffer,
    initVector
  );
  let decryptedText = decipher.update(encryptedBuffer, "hex", "utf8");
  decryptedText += decipher.final("utf8");
  return decryptedText;
}

// Route to initiate payment
router.post("/pay/:id", async (req, res) => {
  const order = await Orders.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const customer = await Customer.findById(order.customer_id);

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  const currency = "INR";

  // Construct the data string
  let data = `merchant_id=${MERCHANT_ID}&order_id=${order._id}&amount=${order.booking_amount}&currency=${currency}&redirect_url=${REDIRECT_URL}&cancel_url=${REDIRECT_URL}&language=EN&billing_name=${customer.name}&billing_city=${order.address.city}&billing_state=${order.address.state}&delivery_tel=${order.phone}&billing_email=${order.email}&billing_tel=${order.phone}`;

  // Encrypt the data
  const encRequest = encrypt(data, WORKING_KEY);

  // Construct the form to be submitted
  const formBody = `
      <form id="nonseamless" method="post" name="redirect" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction">
          <input type="hidden" id="encRequest" name="encRequest" value="${encRequest}">
          <input type="hidden" name="access_code" id="access_code" value="${ACCESS_CODE}">
          <script language="javascript">document.redirect.submit();</script>
      </form>
  `;

  // Send the form to the client
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(formBody);
  res.end();
});

// Route to handle CCAvenue response
router.post("/response", async (req, res) => {
  let ccavEncResponse = "";
  let ccavResponse = "";
  let ccavPOST = "";

  console.log("Request body:", req.body); // Log the request body for debugging

  ccavEncResponse += req.body;
  ccavPOST = qs.parse(ccavEncResponse);
  const encryption = req.body.encResp;

  // Check if the encResp field is present
  if (!encryption) {
    console.error("encResp field is missing in the request body");
    return res.status(400).send("Bad Request: encResp field is missing");
  }

  try {
    ccavResponse = decrypt(encryption, WORKING_KEY); // Ensure decrypt is a valid function

    let pData = "";
    pData = "<table border=1 cellspacing=2 cellpadding=2><tr><td>";
    pData += ccavResponse.replace(/=/gi, "</td><td>");
    pData = pData.replace(/&/gi, "</td></tr><tr><td>");
    pData += "</td></tr></table>";

    const htmlcode = `
      <html>
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <title>Response Handler</title>
        </head>
        <body>
          <center>
            <font size="4" color="blue"><b>Response Page</b></font><br>
            ${pData}
          </center><br>
        </body>
      </html>`;

    const parsedObject = qs.parse(
      ccavResponse.replace(/%26/g, "&").replace(/%3D/g, "=")
    );

    console.log(parsedObject);

    const order = await Orders.findById(parsedObject.order_id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (parsedObject.order_status === "Success") {
      try {
        order.order_status = "Booked";
        const customer = await Customer.findOne({
          phone: parsedObject.billing_tel,
        });
        console.log("customer", customer);

        // const maillerConfig = {
        //   host: process.env.MAIL_HOST,
        //   port: process.env.MAIL_PORT,
        //   secure: true,
        //   auth: {},
        //   // auth: {
        //   //   user: process.env.MAIL_USER,
        //   //   pass: process.env.MAIL_PASSWORD,
        //   // },
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

        const htmlContent = await HTML_TEMPLATE(
          order,
          dealerhub,
          bikeVarient,
          parsedObject
        );

        const template = await INVOICE_HTML_TEMPLATE(
          order,
          dealerhub,
          agent,
          bikeVarient,
          categories,
          parsedObject
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
          cc: `srivarumotorsprana@gmail.com`,
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
      } catch (err) {
        console.log(err);
      }
    } else {
      order.order_status = "Canceled";
      order.payment_mode = parsedObject.payment_mode;
    }
    order.payment_mode = parsedObject.payment_mode;
    order.transactionId = parsedObject.tracking_id;
    await order.save();

    res.cookie("ccavResponse", JSON.stringify(parsedObject));
    res.redirect(
      `https://srivarumotors.com/order-summary?order_id=${parsedObject.order_id}&status=${parsedObject.order_status}`
    );
    // res.status(200).send(htmlcode);
  } catch (error) {
    console.error("Error during decryption:", error);
    res.status(500).send("Internal Server Error");
  }
});

async function generatePDF(htmlContent, options) {
  const __dirname = require("../Invoices");
  const pdfBuffer = await pdf.generatePdf({ content: htmlContent }, options);
  const filePath = path.join(__dirname, "booking_summary.pdf");

  // Write PDF to file
  fs.writeFileSync(filePath, pdfBuffer);
  console.log(`PDF saved to ${filePath}`);

  return filePath;
}

module.exports = router;
