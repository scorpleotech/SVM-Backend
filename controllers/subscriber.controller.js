const Subscriber = require("../models/subscricriber.model");
const nodemailer = require("nodemailer");

exports.createSubscriber = async (req, res) => {
  try {
    // Extract email from the request body
    const { email } = req.body;

    // Check if the subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      return res.status(409).json({ message: "Subscriber already exists" });
    }

    // Create a new subscriber instance
    const newSubscriber = new Subscriber({ email });

    // Save the new subscriber to the database
    const savedSubscriber = await newSubscriber.save();

    // Send email notification to admin
    sendNewSubscriberEmail(savedSubscriber.email);

    return res.status(201).json({
      message: "Subscriber created successfully",
      subscriber: savedSubscriber,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Function to send email notification to admin
function sendNewSubscriberEmail(subscriberEmail) {
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
    subject: "New Subscriber Joined",
    text: `A new subscriber with Email ID "${subscriberEmail}" has joined.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

// A New Customer tried to signin, please find the customer's phone number "${phone}". Thank you
