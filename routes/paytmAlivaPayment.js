

const express = require("express");
const router = express.Router();
const alive = require("../models/alive.model");
const crypto = require("crypto");
const qs = require("querystring");
const path = require("path");
const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer");
const fs = require("fs");

// Import templates (keep only this section)
const HTML_TEMPLATE = require("../service/templates/order-template");
const INVOICE_HTML_TEMPLATE = require("../service/templates/invoice-pdf-template");
const alive_EMAIL_TEMPLATE = require("../service/templates/alive-email-template");
const alive_INVOICE_HTML_TEMPLATE = require("../service/templates/alive-invoice-pdf-template"); // ⭐ ADD THIS

// alive-specific constants
const MERCHANT_ID = "3567715";
const ACCESS_CODE = "AVFR91LF42AH28RFHA"; 
const WORKING_KEY = "47CF98CD9936CB662663115FFF7AF5DC";
const REDIRECT_URL = "https://api.srivarumotors.com/payment/alive/response";

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
  let decryptedText = decipher.update(encryptedBuffer, "hex", "utf8");
  decryptedText += decipher.final("utf8");
  return decryptedText;
}

async function createAndSavePdf(htmlContent, orderId) {
  const invoicesFolder = path.join(__dirname, "..", "Invoices");
  const outputPath = path.join(invoicesFolder, `alive_${orderId}.pdf`);

  try {
    if (!fs.existsSync(invoicesFolder)) {
      fs.mkdirSync(invoicesFolder);
    }

    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.pdf({ path: outputPath, format: "A4" });
    await browser.close();

    return outputPath;
  } catch (err) {
    console.error("Error generating alive PDF:", err);
    throw err;
  }
}

// Route to initiate alive payment
router.get("/pay/:id", async (req, res) => {
  try {
    console.log("🚗 alive payment initiation for ID:", req.params.id);
    
    const aliveOrder = await alive.findById(req.params.id);
    if (!aliveOrder) {
      return res.status(404).json({ message: "alive reservation not found" });
    }

    const currency = "INR";
    let data = `merchant_id=${MERCHANT_ID}&order_id=${aliveOrder._id}&amount=${aliveOrder.price}&currency=${currency}&redirect_url=${REDIRECT_URL}&cancel_url=${REDIRECT_URL}&language=EN&billing_name=${aliveOrder.name}&billing_email=${aliveOrder.email}&billing_tel=${aliveOrder.mobile}`;
    const encRequest = encrypt(data, WORKING_KEY);

    const formBody = `
<!DOCTYPE html>
<html>
<head>
    <title>alive Payment Processing...</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #4CAF50, #45a049); color: white; }
        .container { background: rgba(255,255,255,0.1); padding: 40px; border-radius: 15px; }
        .loading { font-size: 20px; margin-bottom: 30px; }
        .manual-btn { background: #fff; color: #4CAF50; padding: 15px 30px; border: none; border-radius: 25px; font-size: 16px; cursor: pointer; margin-top: 20px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="loading">Processing Your Alive Electric Scooter Payment...</div>
        <div>Redirecting to secure payment gateway...</div>
        
         <form id="alivePaymentForm" method="post" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction">
            <input type="hidden" name="encRequest" value="${encRequest}">
            <input type="hidden" name="access_code" value="${ACCESS_CODE}">
            <button type="submit" class="manual-btn">Continue to Payment</button>
        </form>
        
        <script>
            setTimeout(function() {
                document.getElementById('alivePaymentForm').submit();
            }, 2000);
        </script>
    </div>
</body>
</html>`;

    res.setHeader('Content-Security-Policy', 
      "default-src 'self'; script-src 'self' 'unsafe-inline'; form-action 'self' https://secure.ccavenue.com; style-src 'self' 'unsafe-inline'"
    );
    
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(formBody);
    res.end();
    
  } catch (error) {
    console.error("alive payment initiation error:", error);
    res.status(500).json({ 
      message: "Error processing alive payment: " + error.message 
    });
  }
});

// alive payment response handler
router.post("/response", async (req, res) => {
  console.log("🔔 alive payment response received");
  
  try {
    const encryption = req.body.encResp;
    if (!encryption) {
      return res.status(400).send("Bad Request: encResp field is missing");
    }

    const ccavResponse = decrypt(encryption, WORKING_KEY);
    const parsedObject = qs.parse(ccavResponse.replace(/%26/g, "&").replace(/%3D/g, "="));
    
    console.log("📊 alive payment data:", parsedObject);

    const aliveOrder = await alive.findById(parsedObject.order_id);
    if (!aliveOrder) {
      return res.status(404).json({ message: "alive reservation not found" });
    }

    if (parsedObject.order_status === "Success") {
      console.log("✅ alive payment successful!");
      
      // Update reservation status
      aliveOrder.order_status = "Booked";
      aliveOrder.payment_status = "Success";
      aliveOrder.payment_mode = parsedObject.payment_mode;
      aliveOrder.transactionId = parsedObject.tracking_id;
      await aliveOrder.save();

      // Send confirmation email with invoice
      await sendaliveConfirmationEmail(aliveOrder, parsedObject);
      
      // Redirect to success page
      // Success response (HTML instead of redirect)
      res.send(`
        <html>
          <head><title>Payment Successful</title></head>
          <body style="text-align: center; padding: 50px; font-family: Arial;">
            <div style="background: #4CAF50; color: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto;">
              <h2>✅ Payment Successful!</h2>
              <p><strong>Booking ID:</strong> ${aliveOrder.reservation_number}</p>
              <p><strong>Status:</strong> Confirmed</p>
              <p>Thank you for your Alive Electric Scooter booking!</p>
              <p>You will receive a confirmation email shortly.</p>
              <a href="https://srivarumotors.com/" style="background: white; color: #4CAF50; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; display: inline-block;">Go to Homepage</a>
            </div>
          </body>
        </html>
      `);
    } else {
      aliveOrder.order_status = "Cancelled";
      aliveOrder.payment_status = "Failed";
      await aliveOrder.save();
      
      // Failure response (HTML instead of redirect)
      res.send(`
        <html>
          <head><title>Payment Failed</title></head>
          <body style="text-align: center; padding: 50px; font-family: Arial;">
            <div style="background: #f44336; color: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto;">
              <h2>❌ Payment Failed</h2>
              <p><strong>Booking ID:</strong> ${aliveOrder.reservation_number}</p>
              <p><strong>Status:</strong> Failed</p>
              <p>Please try again or contact support.</p>
              <a href="https://srivarumotors.com/alive" style="background: white; color: #f44336; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; display: inline-block;">Try Again</a>
            </div>
          </body>
        </html>
      `);
    }
    
  } catch (error) {
    console.error("alive payment response error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Enhanced email sending function
async function sendaliveConfirmationEmail(aliveOrder, paymentData) {
  try {
    console.log("📧 Sending alive confirmation email...");

    // Email configuration
     const maillerConfig = {
       host: "localhost",
       port: 25,
       secure: false,
       tls: {
         rejectUnauthorized: false
       }
     };

    console.log("🔧 Email config being used:", JSON.stringify(maillerConfig, null, 2));
    
    const transporter = nodemailer.createTransport(maillerConfig);
    
    console.log("✅ Transporter created successfully");

    // Create proper data structure for templates
    const aliveStore = {
      name: "Srivaru Motors - alive Division",
      address: "Electronic City, Bangalore, Karnataka - 560100",
      phone: "080-22220869",
      email: "info@srivarumotors.com"
    };

    const aliveOrderForTemplate = {
      ...aliveOrder,
      booking_amount: aliveOrder.price,
      booking_id: aliveOrder.reservation_number,
      phone: aliveOrder.mobile,
      address: {
        city: paymentData.billing_city || "Coimbatore",
        state: paymentData.billing_state || "Tamil Nadu",
        zip: paymentData.billing_zip || "641302",
        street: paymentData.billing_address || "Customer Address"
      }
    };

    const aliveVariant = {
      title: `alive ${aliveOrder.model}`,
      price: aliveOrder.price,
      color: aliveOrder.colorName,
      model: aliveOrder.model
    };

    // ✅ Use the simple alive email template (matches original pattern)
    const htmlContent = alive_EMAIL_TEMPLATE(aliveOrder, paymentData);
    
    // Generate PDF invoice using existing template
    const invoiceTemplate = alive_INVOICE_HTML_TEMPLATE(
        aliveOrder,               // Direct alive order
        aliveStore,               // Store info
        null,                     // Customer (not needed)
        aliveVariant,             // Variant info
        { title: "Electric Vehicles" }, // Category
        paymentData               // Payment data
      );    
    let pdfPath;
    try {
      pdfPath = await createAndSavePdf(invoiceTemplate, aliveOrder._id);
      console.log("✅ alive PDF generated:", pdfPath);
    } catch (err) {
      console.log("❌ alive PDF generation failed:", err);
    }

    // Enhanced email options
    const mailOptions = {
      to: aliveOrder.email,
      from: "info@srivarumotors.com",
      cc: "srivarumotorsprana@gmail.com",
      subject: "alive Electric Scooter - Booking Confirmed!",
      html: htmlContent, // ⭐ Now uses dedicated alive template
      attachments: pdfPath ? [
        {
          filename: "alive_Invoice.pdf",
          path: path.resolve(pdfPath),
          contentType: "application/pdf",
        },
        {
          filename: "Terms_and_Conditions.pdf",
          path: path.resolve(__dirname, "../service/templates/General_Terms_and_Conditions.pdf"),
          contentType: "application/pdf",
        }
      ] : []
    };

    // Send customer email
    console.log("📤 Attempting to send customer email to:", aliveOrder.email);
    console.log("📋 Mail options:", JSON.stringify({
      to: mailOptions.to,
      from: mailOptions.from,
      subject: mailOptions.subject,
      hasAttachments: mailOptions.attachments ? mailOptions.attachments.length : 0
    }, null, 2));
    
    await transporter.sendMail(mailOptions);
    console.log("✅ alive confirmation email sent!");

    // Send admin notification  
    const adminMailOptions = {
      ...mailOptions,
      to: "srivarumotorsprana@gmail.com",
      cc: undefined,
      subject: "New alive Electric Scooter Booking"
    };
    
    console.log("📤 Attempting to send admin email to:", adminMailOptions.to);
    await transporter.sendMail(adminMailOptions);
    console.log("✅ alive admin notification sent!");

  } catch (error) {
    console.error("❌ alive email sending failed:", error);
    console.error("❌ Error code:", error.code);
    console.error("❌ Error response:", error.response);
    console.error("❌ Error responseCode:", error.responseCode);
    console.error("❌ Error command:", error.command);
    console.error("❌ Full error details:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
  }
}

module.exports = router;
