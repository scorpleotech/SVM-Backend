const Enquiry = require("../models/enquiry.model");
const { Workbook } = require("exceljs");

const HTML_TEMPLATE = require("../service/templates/enquiry-template");
const nodemailer = require("nodemailer");

const sendmail = require("sendmail")();

// Get all Enquiry
exports.getAllEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Enquiry by ID
exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// create a Enquiry
exports.createEnquiry = async (req, res) => {
  try {
    const { name, email, mobile, enquiry } = req.body;
    // Create a new Enquiry instance
    const newEnquiry = new Enquiry(req.body);

    // Save the new test drive entry to the database
    const savedEnquiry = await newEnquiry.save();

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
    const htmlContent = HTML_TEMPLATE(name, email, mobile, enquiry);

    const mailOptions = {
      // to: `${req.body.email}`,
      to: `${process.env.TO_MAIL_USER}`,
      from: `${process.env.MAIL_USER}`,
      subject: "New Enquiry Deatils From Our Srivarumotors Website",
      html: htmlContent, // Use HTML content here
    };

    // console.log("sending mail password" + req.body.email);

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error("there was an error: ", err);
      } else {
        console.log("here is the res: ", response);
        // res.status(200).json("recovery email sent");
      }
    });

    // res.status(201).json({ message: "Agent registered successfully" });

    // Respond with the newly created test drive entry
    res.status(201).json(savedEnquiry);
  } catch (error) {
    // If any error occurs during creation, respond with a 400 status and error message
    res
      .status(400)
      .json({ message: "Invalid data provided", error: error.message });
  }
};

// Update Enquiry by ID
exports.updateEnquiryById = async (req, res) => {
  try {
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedEnquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.json(updatedEnquiry);
  } catch (error) {
    res.status(400).json({ message: "Invalid data provided" });
  }
};

// Delete Enquiry by ID
exports.deleteEnquiryById = async (req, res) => {
  try {
    const deletedEnquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!deletedEnquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.downloadExcel = async (req, res) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Property List");
  const userRecords = await Enquiry.aggregate([
    {
      $project: {
        name: 1,
        email: 1,
        mobile: 1,
        enquiry: 1,
        createdAt: 1,
      },
    },
  ]);
  const headers = ["Name", "Email", "Phone", "Message", "Created At"];
  worksheet.addRow(headers);

  userRecords.forEach((userRecord) => {
    const rowData = [
      userRecord.name || "", // If name is empty, use an empty string
      userRecord.email || "", // If email is empty, use an empty string
      userRecord.mobile || "", // If phone is empty, use an empty string
      userRecord.enquiry || "", // If enquiry is empty, use an empty string
      userRecord.createdAt || "", // If createdAt is empty, use an empty string
    ];
    worksheet.addRow(rowData);
  });
  const buffer = await workbook.xlsx.writeBuffer();
  res.setHeader("Content-Disposition", "attachment; filename=Enquiry.xlsx");
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.send(buffer);
};
