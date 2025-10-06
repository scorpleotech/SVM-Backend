const router = require("express").Router();
const PranaClass = require("../models/pranaclass.model");
const nodemailer = require("nodemailer");
const Excel = require("exceljs");
const jwt = require("jsonwebtoken");
const User = require("../models/users.model");
const Agent = require("../models/agent.model");

// Create new PranaClass reservation
router.route("/reserve").post(async (req, res) => {
  try {
    console.log("✅ PranaClass reservation endpoint hit!");
    console.log("Received data:", req.body);
    
    const { name, email, mobile, color, colorName, price, created_user } = req.body;
    
    // Basic validation
    if (!name || !email || !mobile || !color || !colorName) {
      return res.status(400).json({
        message: "All fields are required",
        variant: "error"
      });
    }
    
    // Validate color values
    const validColors = ['#000000', '#1E90FF'];
    const validColorNames = ['Black', 'Blue'];
    
    if (!validColors.includes(color) || !validColorNames.includes(colorName)) {
      return res.status(400).json({
        message: "Invalid color selection",
        variant: "error"
      });
    }
    
    const newReservation = new PranaClass({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      model: 'PranaClass',
      color,
      colorName,
      price: price || 144900, // Default price
      created_user: created_user || { id: 'web-user', name: name }
    });
    
    const savedReservation = await newReservation.save();
    console.log("PranaClass reservation saved:", savedReservation);
    
    // If this is called from a form that should redirect to payment
    if (req.body.proceedToPayment === true) {
      return res.status(201).json({
        message: "PranaClass reservation created successfully",
        variant: "success",
        data: savedReservation,
        redirectUrl: `/payment/pranaclass/pay/${savedReservation._id}`
      });
    }
    
    // Default response for API calls
    res.status(201).json({
      message: "PranaClass reservation created successfully",
      variant: "success",
      data: savedReservation
    });
    
  } catch (error) {
    console.error('PranaClass reservation creation error:', error);
    res.status(500).json({
      message: "Error creating PranaClass reservation: " + error.message,
      variant: "error"
    });
  }
});

// Get all PranaClass reservations (admin)
router.route("/").get(async (req, res) => {
  try {
    const reservations = await PranaClass.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "PranaClass reservations retrieved successfully",
      data: reservations,
      count: reservations.length
    });
  } catch (error) {
    console.error('Error fetching PranaClass reservations:', error);
    res.status(500).json({
      message: "Error fetching reservations: " + error.message,
      variant: "error"
    });
  }
});

// Get single PranaClass reservation by ID
router.route("/:id").get(async (req, res) => {
  try {
    const reservation = await PranaClass.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        message: "PranaClass reservation not found",
        variant: "error"
      });
    }
    
    res.status(200).json({
      message: "PranaClass reservation retrieved successfully",
      data: reservation
    });
  } catch (error) {
    console.error('Error fetching PranaClass reservation:', error);
    res.status(500).json({
      message: "Error fetching reservation: " + error.message,
      variant: "error"
    });
  }
});

// Update PranaClass reservation status
router.route("/:id").put(async (req, res) => {
  try {
    const { order_status, payment_status, transactionId, payment_mode, notes } = req.body;
    
    const updateData = {};
    if (order_status) updateData.order_status = order_status;
    if (payment_status) updateData.payment_status = payment_status;
    if (transactionId) updateData.transactionId = transactionId;
    if (payment_mode) updateData.payment_mode = payment_mode;
    if (notes !== undefined) updateData.notes = notes;
    
    const updatedReservation = await PranaClass.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedReservation) {
      return res.status(404).json({
        message: "PranaClass reservation not found",
        variant: "error"
      });
    }
    
    res.status(200).json({
      message: "PranaClass reservation updated successfully",
      data: updatedReservation
    });
  } catch (error) {
    console.error('Error updating PranaClass reservation:', error);
    res.status(500).json({
      message: "Error updating reservation: " + error.message,
      variant: "error"
    });
  }
});

// Delete PranaClass reservation
router.route("/:id").delete(async (req, res) => {
  try {
    const deletedReservation = await PranaClass.findByIdAndDelete(req.params.id);
    
    if (!deletedReservation) {
      return res.status(404).json({
        message: "PranaClass reservation not found",
        variant: "error"
      });
    }
    
    res.status(200).json({
      message: "PranaClass reservation deleted successfully",
      data: deletedReservation
    });
  } catch (error) {
    console.error('Error deleting PranaClass reservation:', error);
    res.status(500).json({
      message: "Error deleting reservation: " + error.message,
      variant: "error"
    });
  }
});

// Get reservations by status
router.route("/status/:status").get(async (req, res) => {
  try {
    const { status } = req.params;
    const reservations = await PranaClass.find({ order_status: status }).sort({ createdAt: -1 });
    
    res.status(200).json({
      message: `PranaClass reservations with status '${status}' retrieved successfully`,
      data: reservations,
      count: reservations.length
    });
  } catch (error) {
    console.error('Error fetching PranaClass reservations by status:', error);
    res.status(500).json({
      message: "Error fetching reservations: " + error.message,
      variant: "error"
    });
  }
});

// Export PranaClass reservations to Excel
router.route("/export/order").get(async (req, res) => {
  try {
    let reservations;
    const accessToken = req.cookies.access_token;
    const decodedToken = jwt.verify(accessToken, process.env.PASPORTJS_KEY);
    const userId = decodedToken.sub;

    const user = await User.findById(userId);
    // Check if the request contains agent details
    if (user.isAgent) {
      const agent = await Agent.findOne({ user_id: user._id });
      console.log("agent", agent);
      reservations = await PranaClass.find({ agent_id: agent._id });
      console.log("agent reservations", reservations);
    } else {
      // Fetch all PranaClass reservations from the database
      reservations = await PranaClass.find();
    }

    // Create a new Excel workbook and worksheet
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("PranaClass Reservations");

    // Set up columns for the worksheet
    worksheet.columns = [
      { header: "Reservation Number", key: "reservation_number", width: 25 },
      { header: "Customer Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Mobile", key: "mobile", width: 15 },
      { header: "Model", key: "model", width: 15 },
      { header: "Color", key: "colorName", width: 15 },
      { header: "Price", key: "price", width: 15 },
      { header: "Order Status", key: "order_status", width: 15 },
      { header: "Payment Status", key: "payment_status", width: 15 },
      { header: "Transaction ID", key: "transactionId", width: 20 },
      { header: "Payment Mode", key: "payment_mode", width: 20 },
      { header: "Booking Date", key: "createdAt", width: 20 },
      { header: "Notes", key: "notes", width: 30 },
      { header: "Billing Address", key: "billing_address", width: 40 },
      { header: "Shipping Address", key: "shipping_address", width: 40 },
    ];

    // Add each reservation to the worksheet
    reservations.forEach((reservation) => {
      const flattenedReservation = {
        ...reservation._doc,
        createdAt: new Date(reservation.createdAt).toLocaleDateString(),
      };
      worksheet.addRow(flattenedReservation);
    });

    // Write the workbook to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set the response headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=pranaclass_reservations.xlsx");

    // Send the buffer as response
    return res.send(buffer);
  } catch (error) {
    // Handle any errors
    console.error('Error exporting PranaClass reservations:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
