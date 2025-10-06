const VisitUs = require("../models/visitus.model");
const { Workbook } = require("exceljs");
const HTML_TEMPLATE = require("../service/templates/visitus-template");
const nodemailer = require("nodemailer");
// import VisitUs from "../models/visitus.model";
// Get all VisitUs
exports.getAllVisitUs = async (req, res) => {
  try {
    const visitUs = await VisitUs.find().sort({ createdAt: -1 });
    res.json(visitUs);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get VisitUs by ID
exports.getVisitUsById = async (req, res) => {
  try {
    const visitUs = await VisitUs.findById(req.params.id);
    if (!visitUs) {
      return res.status(404).json({ message: "VisitUs not found" });
    }
    res.json(visitUs);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// create a VisitUs
exports.createVisitUs = async (req, res) => {
  try {
    const { name, email, phone, description } = req.body;
    // Create a new VisitUs instance
    const newVisitUs = new VisitUs(req.body);

    // Save the new VisitUs entry to the database
    const savedVisitUs = await newVisitUs.save();

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
    const htmlContent = HTML_TEMPLATE(name, email, phone, description);

    const mailOptions = {
      // to: `${req.body.email}`,
      to: `${process.env.TO_MAIL_USER}`,
      from: `${process.env.MAIL_USER}`,
      // cc: ["projectsicore4@gmail.com", "rumeshvarmalliga@icore.net.in"],
      subject: "New Contact Us",
      html: htmlContent, // Use HTML content here
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error("there was an error: ", err);
      } else {
        console.log("here is the res: ", response);
      }
    });

    res.status(201).json(savedVisitUs);
  } catch (error) {
    // If any error occurs during creation, respond with a 400 status and error message
    res
      .status(400)
      .json({ message: "Invalid data provided", error: error.message });
  }
};

// Update VisitUs by ID
exports.updateVisitUsById = async (req, res) => {
  try {
    const updatedVisitUs = await VisitUs.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedVisitUs) {
      return res.status(404).json({ message: "VisitUs not found" });
    }
    res.json(updatedVisitUs);
  } catch (error) {
    res.status(400).json({ message: "Invalid data provided" });
  }
};

// Delete TestDrive by ID
exports.deleteVisitUsById = async (req, res) => {
  try {
    const deletedVisitUs = await VisitUs.findByIdAndDelete(req.params.id);
    if (!deletedVisitUs) {
      return res.status(404).json({ message: "VisitUs not found" });
    }
    res.json({ message: "VisitUs deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.downloadExcel = async (req, res) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Property List");
  const userRecords = await VisitUs.aggregate([
    {
      $lookup: {
        from: "stores",
        localField: "dealer_name",
        foreignField: "_id",
        as: "dealerInfo",
      },
    },
    {
      $addFields: {
        dealer_name: { $arrayElemAt: ["$dealerInfo.name", 0] },
      },
    },
    {
      $project: {
        name: 1,
        email: 1,
        phone: 1,
        city: 1,
        state: 1,
        description: 1,
        dealer_name: 1,
        createdAt: 1,
      },
    },
  ]);
  const headers = [
    "Name",
    "Email",
    "Phone",
    "City",
    "State",
    "Dealer Name",
    "Enquiry",
    "Created At",
  ];
  worksheet.addRow(headers);

  userRecords.forEach((userRecord) => {
    const rowData = [
      userRecord.name || "", // If name is empty, use an empty string
      userRecord.email || "", // If email is empty, use an empty string
      userRecord.phone || "", // If phone is empty, use an empty string
      userRecord.city || "", // If location is empty, use an empty string
      userRecord.state || "", // If status is empty, use an empty string
      userRecord.description || "", // If description is empty, use an empty string
      userRecord.dealer_name || "", // If dealer_name is empty, use an empty string
      userRecord.createdAt || "", // If createdAt is empty, use an empty string
    ];
    worksheet.addRow(rowData);
  });
  const buffer = await workbook.xlsx.writeBuffer();
  res.setHeader("Content-Disposition", "attachment; filename=Contact_us.xlsx");
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.send(buffer);
};
