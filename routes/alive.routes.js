const router = require("express").Router();
const alive = require("../models/alive.model");
const nodemailer = require("nodemailer");
const Excel = require("exceljs");
const jwt = require("jsonwebtoken");
const User = require("../models/users.model");
const Agent = require("../models/agent.model");

// Get all alive reservations (admin)
router.route("/").get(async (req, res) => {
  try {
    const reservations = await alive.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "alive reservations retrieved successfully",
      data: reservations,
      count: reservations.length
    });
  } catch (error) {
    console.error('Error fetching alive reservations:', error);
    res.status(500).json({
      message: "Error fetching reservations: " + error.message,
      variant: "error"
    });
  }
});

// Get single alive reservation by ID
router.route("/:id").get(async (req, res) => {
  try {
    const reservation = await alive.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        message: "alive reservation not found",
        variant: "error"
      });
    }
    
    res.status(200).json({
      message: "alive reservation retrieved successfully",
      data: reservation
    });
  } catch (error) {
    console.error('Error fetching alive reservation:', error);
    res.status(500).json({
      message: "Error fetching reservation: " + error.message,
      variant: "error"
    });
  }
});

// Update alive reservation status
router.route("/:id").put(async (req, res) => {
  try {
    const { order_status, payment_status, transactionId, payment_mode, notes } = req.body;
    
    const updateData = {};
    if (order_status) updateData.order_status = order_status;
    if (payment_status) updateData.payment_status = payment_status;
    if (transactionId) updateData.transactionId = transactionId;
    if (payment_mode) updateData.payment_mode = payment_mode;
    if (notes !== undefined) updateData.notes = notes;
    
    const updatedReservation = await alive.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedReservation) {
      return res.status(404).json({
        message: "alive reservation not found",
        variant: "error"
      });
    }
    
    res.status(200).json({
      message: "alive reservation updated successfully",
      data: updatedReservation
    });
  } catch (error) {
    console.error('Error updating alive reservation:', error);
    res.status(500).json({
      message: "Error updating reservation: " + error.message,
      variant: "error"
    });
  }
});

// Delete alive reservation
router.route("/:id").delete(async (req, res) => {
  try {
    const deletedReservation = await alive.findByIdAndDelete(req.params.id);
    
    if (!deletedReservation) {
      return res.status(404).json({
        message: "alive reservation not found",
        variant: "error"
      });
    }
    
    res.status(200).json({
      message: "alive reservation deleted successfully",
      data: deletedReservation
    });
  } catch (error) {
    console.error('Error deleting alive reservation:', error);
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
    const reservations = await alive.find({ order_status: status }).sort({ createdAt: -1 });
    
    res.status(200).json({
      message: `alive reservations with status '${status}' retrieved successfully`,
      data: reservations,
      count: reservations.length
    });
  } catch (error) {
    console.error('Error fetching alive reservations by status:', error);
    res.status(500).json({
      message: "Error fetching reservations: " + error.message,
      variant: "error"
    });
  }
});

// Create new reservation
router.route("/reserve").post(async (req, res) => {
  try {
    console.log("✅ alive reservation endpoint hit!");
    console.log("Received data:", req.body);
    
    const { name, email, mobile, model, color, colorName, price, created_user } = req.body;
    
    // Basic validation
    if (!name || !email || !mobile || !model || !color || !colorName || !price) {
      return res.status(400).json({
        message: "All fields are required",
        variant: "error"
      });
    }
    
    const newReservation = new alive({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      model,
      color,
      colorName,
      price,
      created_user: created_user || { id: 'web-user', name: name }
    });
    
    const savedReservation = await newReservation.save();
    console.log("Reservation saved:", savedReservation);
    
    // ✅ ADD THIS: Redirect to payment after successful reservation
    if (req.body.proceedToPayment === true) {
      // If this is called from a form that should redirect to payment
      return res.status(201).json({
        message: "Reservation created successfully",
        variant: "success",
        data: savedReservation,
        redirectUrl: `/payment/alive/pay/${savedReservation._id}` // ⭐ ADD THIS
      });
    }
    
    // Default response for API calls
    res.status(201).json({
      message: "Reservation created successfully",
      variant: "success",
      data: savedReservation
    });
    
  } catch (error) {
    console.error('Reservation creation error:', error);
    res.status(500).json({
      message: "Error creating reservation: " + error.message,
      variant: "error"
    });
  }
});

// Export alive reservations to Excel
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
      reservations = await alive.find({ agent_id: agent._id });
      console.log("agent reservations", reservations);
    } else {
      // Fetch all alive reservations from the database
      reservations = await alive.find();
    }

    // Create a new Excel workbook and worksheet
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Alive Reservations");

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
    res.setHeader("Content-Disposition", "attachment; filename=alive_reservations.xlsx");

    // Send the buffer as response
    return res.send(buffer);
  } catch (error) {
    // Handle any errors
    console.error('Error exporting alive reservations:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
