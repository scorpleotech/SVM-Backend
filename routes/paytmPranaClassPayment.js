const express = require("express");
const router = express.Router();
const PranaClass = require("../models/pranaclass.model");
const crypto = require("crypto");
const qs = require("querystring");
const path = require("path");
const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer");
const fs = require("fs");

// Import templates
const HTML_TEMPLATE = require("../service/templates/order-template");
const INVOICE_HTML_TEMPLATE = require("../service/templates/invoice-pdf-template");
const PRANACLASS_EMAIL_TEMPLATE = require("../service/templates/pranaclass-email-template");
const PRANACLASS_INVOICE_HTML_TEMPLATE = require("../service/templates/pranaclass-invoice-pdf-template");

// PranaClass-specific constants (Production ICICI Gateway)
const MERCHANT_ID = "3567715";
const ACCESS_CODE = "AVFR91LF42AH28RFHA"; 
const WORKING_KEY = "47CF98CD9936CB662663115FFF7AF5DC";
const REDIRECT_URL = "https://api.srivarumotors.com/payment/pranaclass/response";

// Utility functions
function hextobin(hex) {
  return Buffer.from(hex, "hex");
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
  const decipher = crypto.createDecipheriv("aes-128-cbc", keyBuffer, initVector);
  let decryptedText = decipher.update(encryptedBuffer, null, "utf8");
  decryptedText += decipher.final("utf8");
  return decryptedText;
}

// Email configuration (matching alive setup)
const maillerConfig = {
  host: "localhost",
  port: 25,
  secure: false,
  tls: {
    rejectUnauthorized: false
  }
};

console.log("🔧 PranaClass Email config being used:", JSON.stringify(maillerConfig, null, 2));

// PDF generation function
async function createAndSavePdf(htmlContent, orderId) {
  const invoicesFolder = path.join(__dirname, "..", "Invoices");
  const outputPath = path.join(invoicesFolder, `PranaClass_${orderId}.pdf`);

  try {
    if (!fs.existsSync(invoicesFolder)) {
      fs.mkdirSync(invoicesFolder);
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();
    console.log(`PDF created successfully: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Error creating PDF:', error);
    throw error;
  }
}

// Route to initiate PranaClass payment (GET for browser navigation)
router.get("/pay/:id", async (req, res) => {
  try {
    const pranaClassOrder = await PranaClass.findById(req.params.id);
    
    if (!pranaClassOrder) {
      return res.status(404).json({ message: "PranaClass reservation not found" });
    }

    const orderId = `PRC${Date.now()}`;
    const amount = pranaClassOrder.price;

    const paymentData = {
      merchant_id: MERCHANT_ID,
      order_id: orderId,
      amount: amount,
      currency: "INR",
      redirect_url: REDIRECT_URL,
      cancel_url: REDIRECT_URL,
      billing_name: pranaClassOrder.name,
      billing_email: pranaClassOrder.email,
      billing_tel: pranaClassOrder.mobile,
      billing_address: pranaClassOrder.billing_address || "Coimbatore",
      billing_city: "Coimbatore",
      billing_state: "Tamil Nadu",
      billing_zip: "641001",
      billing_country: "India",
      delivery_name: pranaClassOrder.name,
      delivery_address: pranaClassOrder.shipping_address || "Coimbatore",
      delivery_city: "Coimbatore",
      delivery_state: "Tamil Nadu",
      delivery_zip: "641001",
      delivery_country: "India",
      delivery_tel: pranaClassOrder.mobile,
      merchant_param1: pranaClassOrder._id.toString(),
      merchant_param2: "PranaClass",
      merchant_param3: pranaClassOrder.colorName,
      merchant_param4: pranaClassOrder.model,
      merchant_param5: pranaClassOrder.reservation_number,
    };

    const dataString = qs.stringify(paymentData);
    const encryptedData = encrypt(dataString, WORKING_KEY);

    const paymentForm = `
<html>
<head>
    <title>PranaClass Payment - Srivaru Motors</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #1976d2, #1565c0); color: white; }
        .container { background: rgba(255,255,255,0.1); padding: 40px; border-radius: 15px; }
        .loading { font-size: 20px; margin-bottom: 30px; }
        .manual-btn { background: #fff; color: #1976d2; padding: 15px 30px; border: none; border-radius: 25px; font-size: 16px; cursor: pointer; margin-top: 20px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
       <div class="loading">PranaClass Electric Motorcycle Payment...</div>
        <div>Redirecting to secure payment gateway...</div>
        
        <form id="pranaClassPaymentForm" method="post" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction">
            <input type="hidden" name="encRequest" value="${encryptedData}">
            <input type="hidden" name="access_code" value="${ACCESS_CODE}">
            <button type="submit" class="manual-btn">Continue to Payment</button>
        </form>
        
        <script>
            setTimeout(function() {
                document.getElementById('pranaClassPaymentForm').submit();
            }, 2000);
        </script>
    </div>
</body>
</html>`;

    res.setHeader('Content-Security-Policy', 
      "default-src 'self'; script-src 'self' 'unsafe-inline'; form-action 'self' https://secure.ccavenue.com; style-src 'self' 'unsafe-inline'"
    );
    
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(paymentForm);
    res.end();
  } catch (error) {
    console.error("Payment initiation error:", error);
    res.status(500).send(`
      <html>
        <head><title>Payment Error</title></head>
        <body style="text-align: center; padding: 50px; font-family: Arial;">
          <h1 style="color: #f44336;">Payment Initiation Failed</h1>
          <p>Error: ${error.message}</p>
          <a href="https://srivarumotors.com/class" style="background: white; color: #1976d2; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; display: inline-block;">Try Again</a>
        </body>
      </html>
    `);
  }
});

// Route to initiate PranaClass payment (POST for API calls)
router.post("/pay/:id", async (req, res) => {
  try {
    const pranaClassOrder = await PranaClass.findById(req.params.id);
    
    if (!pranaClassOrder) {
      return res.status(404).json({ message: "PranaClass reservation not found" });
    }

    const orderId = `PRC${Date.now()}`;
    const amount = pranaClassOrder.price;

    const paymentData = {
      merchant_id: MERCHANT_ID,
      order_id: orderId,
      amount: amount,
      currency: "INR",
      redirect_url: REDIRECT_URL,
      cancel_url: REDIRECT_URL,
      billing_name: pranaClassOrder.name,
      billing_email: pranaClassOrder.email,
      billing_tel: pranaClassOrder.mobile,
      billing_address: pranaClassOrder.billing_address || "Coimbatore",
      billing_city: "Coimbatore",
      billing_state: "Tamil Nadu",
      billing_zip: "641001",
      billing_country: "India",
      delivery_name: pranaClassOrder.name,
      delivery_address: pranaClassOrder.shipping_address || "Coimbatore",
      delivery_city: "Coimbatore",
      delivery_state: "Tamil Nadu",
      delivery_zip: "641001",
      delivery_country: "India",
      delivery_tel: pranaClassOrder.mobile,
      merchant_param1: pranaClassOrder._id.toString(),
      merchant_param2: "PranaClass",
      merchant_param3: pranaClassOrder.colorName,
      merchant_param4: pranaClassOrder.model,
      merchant_param5: pranaClassOrder.reservation_number,
    };

    const dataString = qs.stringify(paymentData);
    const encryptedData = encrypt(dataString, WORKING_KEY);

    const paymentForm = `
      <html>
        <head><title>Processing Payment...</title></head>
        <body onload="document.forms[0].submit();">
          <form method="post" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction">
            <input type="hidden" name="encRequest" value="${encryptedData}">
            <input type="hidden" name="access_code" value="${ACCESS_CODE}">
            <p>Redirecting to payment gateway...</p>
          </form>
        </body>
      </html>
    `;

    res.send(paymentForm);
  } catch (error) {
    console.error("Payment initiation error:", error);
    res.status(500).json({ message: "Payment initiation failed" });
  }
});

// Payment response handler
router.post("/response", async (req, res) => {
  try {
    const encResponse = req.body.encResp;
    const decryptedData = decrypt(encResponse, WORKING_KEY);
    const responseData = qs.parse(decryptedData);

    console.log("Payment response data:", responseData);

    const pranaClassId = responseData.merchant_param1;
    const pranaClassOrder = await PranaClass.findById(pranaClassId);

    if (!pranaClassOrder) {
      return res.status(404).send("PranaClass reservation not found");
    }

    // Update payment status
    if (responseData.order_status === "Success") {
      pranaClassOrder.payment_status = "Success";
      pranaClassOrder.order_status = "Booked";
      pranaClassOrder.transactionId = responseData.tracking_id;
      pranaClassOrder.payment_mode = responseData.payment_mode;
      
      await pranaClassOrder.save();

      // Generate PDF invoice
      const invoiceHtml = PRANACLASS_INVOICE_HTML_TEMPLATE(
        pranaClassOrder,
        { name: "Srivaru Motors - PranaClass Division" },
        pranaClassOrder,
        null,
        null,
        responseData
      );

      const pdfPath = await createAndSavePdf(invoiceHtml, pranaClassOrder._id);

      // Send confirmation email
      console.log("📧 Sending PranaClass confirmation email...");
      console.log("✅ PranaClass Transporter created successfully");
      
      const transporter = nodemailer.createTransport(maillerConfig);
      const emailHtml = PRANACLASS_EMAIL_TEMPLATE(pranaClassOrder, responseData);
      
      const mailOptions = {
        from: "info@srivarumotors.com",
        to: pranaClassOrder.email,
        cc: "srivarumotorsprana@gmail.com",
        subject: `PranaClass Booking Confirmed - ${pranaClassOrder.reservation_number}`,
        html: emailHtml,
        attachments: [
          {
            filename: `PranaClass_Invoice_${pranaClassOrder.reservation_number}.pdf`,
            path: pdfPath,
          },
        ],
      };

      console.log("📤 Attempting to send PranaClass customer email to:", pranaClassOrder.email);
      console.log("📋 PranaClass Mail options:", JSON.stringify({
        to: mailOptions.to,
        from: mailOptions.from,
        subject: mailOptions.subject,
        hasAttachments: mailOptions.attachments ? mailOptions.attachments.length : 0
      }, null, 2));

      await transporter.sendMail(mailOptions);
      console.log("✅ PranaClass confirmation email sent!");
      
      // Send admin notification
      const adminMailOptions = {
        ...mailOptions,
        to: "srivarumotorsprana@gmail.com",
        cc: undefined,
        subject: `New PranaClass Electric Motorcycle Booking - ${pranaClassOrder.reservation_number}`
      };
      
      console.log("📤 Attempting to send PranaClass admin email to:", adminMailOptions.to);
      await transporter.sendMail(adminMailOptions);
      console.log("✅ PranaClass admin notification sent!");

      // Success response
      res.send(`
        <html>
          <head><title>Payment Successful</title></head>
          <body>
            <div style="text-align: center; padding: 50px;">
              <h1 style="color: #4CAF50;">🎉 Payment Successful!</h1>
              <h2>PranaClass Booking Confirmed</h2>
              <p><strong>Booking ID:</strong> ${pranaClassOrder.reservation_number}</p>
              <p><strong>Transaction ID:</strong> ${responseData.tracking_id}</p>
              <p><strong>Amount:</strong> ₹${pranaClassOrder.price}</p>
              <p>A confirmation email has been sent to ${pranaClassOrder.email}</p>
              <a href="https://srivarumotors.com/" style="background: white; color: #4CAF50; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; display: inline-block;">Go to Homepage</a>
            </div>
          </body>
        </html>
      `);
    } else {
      // Payment failed
      pranaClassOrder.payment_status = "Failed";
      await pranaClassOrder.save();

      res.send(`
        <html>
          <head><title>Payment Failed</title></head>
          <body>
            <div style="text-align: center; padding: 50px;">
              <h1 style="color: #f44336;">❌ Payment Failed</h1>
              <p><strong>Booking ID:</strong> ${pranaClassOrder.reservation_number}</p>
              <p><strong>Status:</strong> ${responseData.order_status}</p>
              <p>Please try again or contact support.</p>
              <a href="https://srivarumotors.com/class" style="background: white; color: #f44336; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; display: inline-block;">Try Again</a>
            </div>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error("❌ PranaClass payment response processing error:", error);
    console.error("❌ PranaClass Error code:", error.code);
    console.error("❌ PranaClass Error response:", error.response);
    console.error("❌ PranaClass Error responseCode:", error.responseCode);
    console.error("❌ PranaClass Error command:", error.command);
    console.error("❌ PranaClass Full error details:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    res.status(500).send("Payment processing error");
  }
});

// Get payment status
router.get("/status/:id", async (req, res) => {
  try {
    const pranaClassOrder = await PranaClass.findById(req.params.id);
    
    if (!pranaClassOrder) {
      return res.status(404).json({ message: "PranaClass reservation not found" });
    }

    res.json({
      reservation_number: pranaClassOrder.reservation_number,
      payment_status: pranaClassOrder.payment_status,
      order_status: pranaClassOrder.order_status,
      transactionId: pranaClassOrder.transactionId,
      amount: pranaClassOrder.price
    });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    res.status(500).json({ message: "Error fetching payment status" });
  }
});

module.exports = router;
