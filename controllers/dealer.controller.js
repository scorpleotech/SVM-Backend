const Dealer = require("../models/dealer.model");
const ExcelJS = require("exceljs");
const nodemailer = require("nodemailer");
const Excel = require("exceljs");

// Create Dealer
exports.createDealer = async (req, res) => {
  try {
    const existing_dealer = await Dealer.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    });

    if (existing_dealer) {
      return res.status(409).json({ message: "Dealer already exists" });
    }
    const dealer = new Dealer(req.body);

    await dealer.save();

    if (!dealer) {
      return res.status(400).json({ message: "Dealer not created" });
    } else {
      // Save dealer data to Excel file
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Dealer Data");

      // worksheet.columns = [
      //   { header: "Name", key: "name", width: 20 },
      //   { header: "Phone", key: "phone", width: 15 },
      //   { header: "Email", key: "email", width: 25 },
      //   { header: "Gender", key: "gender", width: 10 },
      //   { header: "Age", key: "age", width: 10 },
      //   { header: "Education Details", key: "education_details", width: 25 },
      //   { header: "Address", key: "address", width: 25 },
      //   { header: "District", key: "district", width: 25 },
      //   { header: "State", key: "state", width: 25 },
      //   { header: "Dealership Place", key: "dealership_place", width: 25 },
      //   { header: "Existing Business", key: "existing_business", width: 25 },
      //   { header: "Nature Of Business", key: "nature_of_business", width: 25 },
      //   {
      //     header: "Years In Automotive Business",
      //     key: "years_in_automotive_business",
      //     width: 25,
      //   },
      //   {
      //     header: "Annual Average Sales Volume",
      //     key: "annual_average_sales_volume",
      //     width: 25,
      //   },
      //   {
      //     header: "Average Monthly Service Reporting",
      //     key: "average_monthly_service_reporting",
      //     width: 25,
      //   },
      //   {
      //     header: "Average Parts In Business",
      //     key: "average_parts_in_business",
      //     width: 25,
      //   },
      //   {
      //     header: "Investment Amount",
      //     key: "investment_amount",
      //     width: 25,
      //   },
      //   {
      //     header: "Source Of Investment",
      //     key: "source_of_investment",
      //     width: 25,
      //   },
      //   {
      //     header: "Existing Business Name",
      //     key: "existing_business_name",
      //     width: 25,
      //   },
      //   {
      //     header: "Place Of Business Unit",
      //     key: "place_of_business_unit",
      //     width: 25,
      //   },
      //   {
      //     header: "Products Dealing With",
      //     key: "products_dealing_with",
      //     width: 25,
      //   },
      //   {
      //     header: "Years In Current Business",
      //     key: "years_in_current_business",
      //     width: 25,
      //   },
      //   {
      //     header: "Annual Turnover",
      //     key: "annual_turnover",
      //     width: 25,
      //   },
      //   {
      //     header: "Existing Line Of Business",
      //     key: "existing_line_of_business",
      //     width: 25,
      //   },
      //   {
      //     header: "Percent Contribution For Capital",
      //     key: "percent_contribution_for_capital",
      //     width: 25,
      //   },
      //   {
      //     header: "Level Of Interest In Starting New Business",
      //     key: "level_of_interest_in_starting_new_business",
      //     width: 25,
      //   },
      //   {
      //     header: "Explain Why Dealership",
      //     key: "explain_why_dealership",
      //     width: 25,
      //   },
      //   {
      //     header: "Why Successful",
      //     key: "why_successful",
      //     width: 25,
      //   },
      //   {
      //     header: "Setup Dealership Timing",
      //     key: "setup_dealership_timing",
      //     width: 25,
      //   },
      //   {
      //     header: "Ready To Invest",
      //     key: "ready_to_invest",
      //     width: 25,
      //   },
      //   {
      //     header: "Suggestions Comments",
      //     key: "suggestions_comments",
      //     width: 25,
      //   },
      //   // Add more columns as needed
      // ];

      const dealers = await Dealer.find().sort({ createdAt: -1 });

      worksheet.columns = [
        { header: "Name", key: "name", width: 25 },
        { header: "Phone", key: "phone", width: 25 },
        { header: "Email", key: "email", width: 25 },
        { header: "Gender", key: "gender", width: 25 },
        { header: "Age", key: "age", width: 25 },
        { header: "Education Details", key: "education_details", width: 25 },
        { header: "Address", key: "address", width: 25 },
        { header: "District", key: "district", width: 25 },
        { header: "State", key: "state", width: 25 },
        { header: "Dealership Place", key: "dealership_place", width: 25 },
        { header: "Existing Business", key: "existing_business", width: 25 },
        { header: "Nature of Business", key: "nature_of_business", width: 25 },
        {
          header: "Years in Automotive Business",
          key: "years_in_automotive_business",
          width: 25,
        },
        {
          header: "Annual Average Sales Volume",
          key: "annual_average_sales_volume",
          width: 25,
        },
        {
          header: "Average Monthly Service Reporting",
          key: "average_monthly_service_reporting",
          width: 25,
        },
        {
          header: "Average Parts in Business",
          key: "average_parts_in_business",
          width: 25,
        },
        { header: "Investment Amount", key: "investment_amount", width: 25 },
        {
          header: "Source of Investment",
          key: "source_of_investment",
          width: 25,
        },
        {
          header: "Existing Business Name",
          key: "existing_business_name",
          width: 25,
        },
        {
          header: "Place of Business Unit",
          key: "place_of_business_unit",
          width: 25,
        },
        {
          header: "Products Dealing With",
          key: "products_dealing_with",
          width: 25,
        },
        {
          header: "Years in Current Business",
          key: "years_in_current_business",
          width: 25,
        },
        { header: "Annual Turnover", key: "annual_turnover", width: 25 },
        {
          header: "Existing Line of Business",
          key: "existing_line_of_business",
          width: 25,
        },
        {
          header: "Percent Contribution for Capital",
          key: "percent_contribution_for_capital",
          width: 25,
        },
        {
          header: "Level of Interest in Starting New Business",
          key: "level_of_interest_in_starting_new_business",
          width: 25,
        },
        {
          header: "Explain Why Dealership",
          key: "explain_why_dealership",
          width: 25,
        },
        { header: "Why Successful", key: "why_successful", width: 25 },
        {
          header: "Setup Dealership Timing",
          key: "setup_dealership_timing",
          width: 25,
        },
        { header: "Ready to Invest", key: "ready_to_invest", width: 25 },
        {
          header: "Suggestions Comments",
          key: "suggestions_comments",
          width: 25,
        },
        { header: "Created At", key: "createdAt", width: 25 },
        { header: "Updated At", key: "updatedAt", width: 25 },
      ];

      dealers.forEach((dealer) => {
        worksheet.addRow(dealer);
      });

      worksheet.addRow(req.body);
      const attachmentBuffer = await workbook.xlsx.writeBuffer();

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

      const createdDate = new Date(dealer.createdAt);
      const formattedDate = createdDate.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour12: false,
      });

      const mailOptions = {
        from: process.env.MAIL_USER,
        to: process.env.TO_MAIL_USER,
        // to: "sakthivel8725@gmail.com",
        // cc: ["projectsicore4@gmail.com", "rumeshvarmalliga@icore.net.in"],
        subject: "New Dealer Joined",
        text: `A New Dealer request has been received, please check the Excel file below to find the details. please find the submission Date ${formattedDate}. Thank you.`,
        attachments: [
          {
            filename: `${req.body.name}_dealer.xlsx`,
            content: attachmentBuffer,
            contentType:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ message: "Failed to send email" });
        }
        console.log("Email sent:", info.response);
      });

      res.status(201).json({ message: "Dealer added successfully", dealer });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update Dealer
exports.updateDealerById = async (req, res) => {
  try {
    const { id } = req.params;
    const dealer = await Dealer.findByIdAndUpdate(id, req.body, { new: true });
    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }
    res.json(dealer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Dealer
exports.deleteDealer = async (req, res) => {
  try {
    const { id } = req.params;
    const dealer = await Dealer.findByIdAndDelete(id);
    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }
    res.json({ message: "Dealer deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get Dealer by ID
exports.getDealerById = async (req, res) => {
  try {
    const { id } = req.params;
    const dealer = await Dealer.findById(id);
    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }
    res.json(dealer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Get All Dealer
exports.getAllDealer = async (req, res) => {
  try {
    const dealer = await Dealer.find().sort({ createdAt: -1 });
    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }
    res.json(dealer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.exportAllDealer = async (req, res) => {
  try {
    const dealers = await Dealer.find();

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Dealers");

    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Phone", key: "phone", width: 25 },
      { header: "Email", key: "email", width: 25 },
      { header: "Gender", key: "gender", width: 25 },
      { header: "Age", key: "age", width: 25 },
      { header: "Education Details", key: "education_details", width: 25 },
      { header: "Address", key: "address", width: 25 },
      { header: "District", key: "district", width: 25 },
      { header: "State", key: "state", width: 25 },
      { header: "Dealership Place", key: "dealership_place", width: 25 },
      { header: "Existing Business", key: "existing_business", width: 25 },
      { header: "Nature of Business", key: "nature_of_business", width: 25 },
      {
        header: "Years in Automotive Business",
        key: "years_in_automotive_business",
        width: 25,
      },
      {
        header: "Annual Average Sales Volume",
        key: "annual_average_sales_volume",
        width: 25,
      },
      {
        header: "Average Monthly Service Reporting",
        key: "average_monthly_service_reporting",
        width: 25,
      },
      {
        header: "Average Parts in Business",
        key: "average_parts_in_business",
        width: 25,
      },
      { header: "Investment Amount", key: "investment_amount", width: 25 },
      {
        header: "Source of Investment",
        key: "source_of_investment",
        width: 25,
      },
      {
        header: "Existing Business Name",
        key: "existing_business_name",
        width: 25,
      },
      {
        header: "Place of Business Unit",
        key: "place_of_business_unit",
        width: 25,
      },
      {
        header: "Products Dealing With",
        key: "products_dealing_with",
        width: 25,
      },
      {
        header: "Years in Current Business",
        key: "years_in_current_business",
        width: 25,
      },
      { header: "Annual Turnover", key: "annual_turnover", width: 25 },
      {
        header: "Existing Line of Business",
        key: "existing_line_of_business",
        width: 25,
      },
      {
        header: "Percent Contribution for Capital",
        key: "percent_contribution_for_capital",
        width: 25,
      },
      {
        header: "Level of Interest in Starting New Business",
        key: "level_of_interest_in_starting_new_business",
        width: 25,
      },
      {
        header: "Explain Why Dealership",
        key: "explain_why_dealership",
        width: 25,
      },
      { header: "Why Successful", key: "why_successful", width: 25 },
      {
        header: "Setup Dealership Timing",
        key: "setup_dealership_timing",
        width: 25,
      },
      { header: "Ready to Invest", key: "ready_to_invest", width: 25 },
      {
        header: "Suggestions Comments",
        key: "suggestions_comments",
        width: 25,
      },
      { header: "Created At", key: "createdAt", width: 25 },
      { header: "Updated At", key: "updatedAt", width: 25 },
    ];

    dealers.forEach((dealer) => {
      worksheet.addRow(dealer);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=dealers.xlsx");
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.exportAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find();

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Orders");

    worksheet.columns = [
      { header: "Order Number", key: "ordernumber", width: 25 },
      { header: "Model Name", key: "model_name", width: 25 },
      { header: "Customer Name", key: "customer_name", width: 25 },
      { header: "Phone", key: "phone", width: 25 },
      { header: "Email", key: "email", width: 25 },
      { header: "Address", key: "address", width: 25 },
      { header: "Model Booked Color", key: "model_booked_color", width: 25 },
      { header: "Coupon Code", key: "coupon_code", width: 25 },
      { header: "Dealer Hub", key: "dealer_hub", width: 25 },
      { header: "Booking Amount", key: "booking_amount", width: 25 },
      { header: "Price", key: "price", width: 25 },
      { header: "Agent Code", key: "agent_code", width: 25 },
      { header: "Agent Name Shop", key: "agent_name_shop", width: 25 },
      { header: "Booking Date", key: "booking_date", width: 25 },
      { header: "Order Status", key: "order_status", width: 25 },
    ];

    orders.forEach((order) => {
      worksheet.addRow(order);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
