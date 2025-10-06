const CareerApplication = require("../models/career-application.model");
const Career = require("../models/career.model");
const CAREER_APPLICATION_HTML_TEMPLATE = require("../service/templates/application-template");
const path = require("path");
const nodemailer = require("nodemailer");

// Upload resume
exports.uploadResume = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const filePath = "/images/uploads/resume/" + req.file.filename;
  res.status(201).json({ filepath: filePath });
};

// Create a new career application
exports.createCareerApplication = async (req, res) => {
  try {
    const {
      name,
      currentJobTitle,
      yearsOfExperience,
      email,
      phone,
      linkedInUrl,
      career_id,
      resume,
      coverLetter,
    } = req.body;

    const careerApplication = new CareerApplication(req.body);

    await careerApplication.save();

    const career = await Career.findById(career_id);

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

    const data = {
      name,
      currentJobTitle,
      yearsOfExperience,
      email,
      phone,
      linkedInUrl,
    };

    let coverLetterPath;

    const resumePath = path.resolve(__dirname, "../../admin/public" + resume);

    let attachments = [
      {
        filename: "resume.pdf",
        content: resumePath,
        contentType: "application/pdf",
      },
    ];

    if (coverLetter) {
      coverLetterPath = path.resolve(
        __dirname,
        "../../admin/public" + coverLetter
      );
      attachments.push({
        filename: "coverletter.pdf",
        content: coverLetterPath,
        contentType: "application/pdf",
      });
    }

    const htmlContent = CAREER_APPLICATION_HTML_TEMPLATE(data, career);

    const mailOptions = {
      to: `${process.env.TO_MAIL_USER}`, // Email address for the first user
      from: `${process.env.MAIL_USER}`,
      // cc: ["sakthivel.icore@gmail.com", "rumeshvarmalliga@icore.net.in"],
      subject: "New Job Application for " + career.title,
      html: htmlContent,
      attachments: attachments,
    };

    // Send email
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error("Error sending email: ", err);
      } else {
        console.log("Email sent successfully: ", response);
      }
    });

    res.status(201).json(careerApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all career applications
exports.getAllCareerApplications = async (req, res) => {
  try {
    const careerApplications = await CareerApplication.find().sort({
      createdAt: -1,
    });
    res.json(careerApplications);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get career application by id
exports.getCareerApplicationById = async (req, res) => {
  try {
    const careerApplication = await CareerApplication.findById(req.params.id);
    if (!careerApplication) {
      return res.status(404).json({ message: "Career application not found" });
    }
    res.json(careerApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update career application by id
exports.updateCareerApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const careerApplication = await CareerApplication.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!careerApplication) {
      return res.status(404).json({ message: "Career application not found" });
    }

    res.json(careerApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete career application by id
exports.deleteCareerApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const careerApplication = await CareerApplication.findByIdAndDelete(id);
    if (!careerApplication) {
      return res.status(404).json({ message: "Career application not found" });
    }
    res.json({ message: "Career application deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
