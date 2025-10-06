const TestDrive = require("../models/testDrive.model");
const Store = require("../models/store.model");
const Dealer = require("../models/dealer.model");
const Category = require("../models/categories.model");
const HTML_TEMPLATE = require("../service/templates/testdrive-template");
const nodemailer = require("nodemailer");

// Get all TestDrive
exports.getAllTestDrive = async (req, res) => {
  try {
    const testDrives = await TestDrive.find()
      .sort({ createdAt: -1 })
      .populate("dealer_name", "name");

    // Map the results to project the desired structure
    const projectedTestDrives = testDrives.map((testDrive) => ({
      _id: testDrive._id,
      name: testDrive.name,
      email: testDrive.email,
      phone: testDrive.phone,
      state: testDrive.state,
      city: testDrive.city,
      dealer_name: testDrive.dealer_name ? testDrive.dealer_name.name : null,
      pincode: testDrive.pincode,
      booking_date: testDrive.booking_date,
      booking_time: testDrive.booking_time,
      model: testDrive.model,
      createdAt: testDrive.createdAt,
      updatedAt: testDrive.updatedAt,
    }));

    res.json(projectedTestDrives);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get TestDrive by ID
exports.getTestDriveById = async (req, res) => {
  try {
    const testDrive = await TestDrive.findById(req.params.id).populate(
      "dealer_name",
      "name"
    );
    if (!testDrive) {
      return res.status(404).json({ message: "TestDrive not found" });
    }

    // Project the desired structure directly from the returned document
    const projectedTestDrive = {
      _id: testDrive._id,
      name: testDrive.name,
      email: testDrive.email,
      phone: testDrive.phone,
      state: testDrive.state,
      city: testDrive.city,
      dealer_name: testDrive.dealer_name ? testDrive.dealer_name.name : null,
      pincode: testDrive.pincode,
      booking_date: testDrive.booking_date,
      booking_time: testDrive.booking_time,
      model: testDrive.model,
      createdAt: testDrive.createdAt,
      updatedAt: testDrive.updatedAt,
    };

    res.json(projectedTestDrive);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// create a TestDrive
exports.createTestDrive = async (req, res) => {
  try {
    let {
      name,
      email,
      phone,
      state,
      city,
      dealer_name,
      booking_date,
      booking_time,
      model,
    } = req.body;
    // Create a new TestDrive instance
    const newTestDrive = new TestDrive(req.body);

    const dealer = await Store.findById(dealer_name);

    const category = await Category.findOne({ _id: model });

    dealer_name = dealer?.name;
    model = category?.title;

    // Save the new test drive entry to the database
    const savedTestDrive = await newTestDrive.save();

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
    // Prepare transporter
    const transporter = nodemailer.createTransport(maillerConfig);
    // 05/04/2024 12:00 AM booking date and timne comingn like this

    booking_date = new Date(booking_date).toLocaleDateString();
    booking_time = new Date(booking_time).toLocaleTimeString();
    // Create HTML email content with dynamic values
    const htmlContent = HTML_TEMPLATE(
      name,
      email,
      phone,
      state,
      city,
      dealer_name,
      booking_date,
      booking_time,
      model
    );

    const mailOptions = {
      to: process.env.TO_MAIL_USER,
      from: process.env.MAIL_USER,
      // cc: ["projectsicore4@gmail.com", "rumeshvarmalliga@icore.net.in"],
      subject: "New Test Drive Booking Received",
      html: htmlContent, // Use HTML content here
    };

    // Send email
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error("Error sending email: ", err);
      } else {
        console.log("Email sent successfully: ", response);
      }
    });

    // Respond with the newly created test drive entry
    res.status(201).json(savedTestDrive);
  } catch (error) {
    // If any error occurs during creation, respond with a 400 status and error message
    res
      .status(400)
      .json({ message: "Invalid data provided", error: error.message });
  }
};

// Update TestDrive by ID
exports.updateTestDriveById = async (req, res) => {
  try {
    const updatedTestDrive = await TestDrive.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedTestDrive) {
      return res.status(404).json({ message: "TestDrive not found" });
    }
    res.json(updatedTestDrive);
  } catch (error) {
    res.status(400).json({ message: "Invalid data provided" });
  }
};

// Delete TestDrive by ID
exports.deleteTestDriveById = async (req, res) => {
  try {
    const deletedTestDrive = await TestDrive.findByIdAndDelete(req.params.id);
    if (!deletedTestDrive) {
      return res.status(404).json({ message: "TestDrive not found" });
    }
    res.json({ message: "TestDrive deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
