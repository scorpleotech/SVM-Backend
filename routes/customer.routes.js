const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
  createOrder,
  getAllCustomers,
  saveAddress,
  initiateLogin,
  initiateSignup,
  verifySignup,
  deleteCustomer,
  updateCustomer,
  getOrderbyCustomerId,
  changeActiveStatus,
  checkout,
  customerLogin,
  exportAllCustomer,
  customerCompleteOrderSummary,
  customerTableClear,
  dummyPdfGnerate,
} = require("../controllers/customer.controller");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

router.post("/signup", initiateSignup);
router.post("/signup/checkout", checkout);
router.post("/login", initiateLogin);
router.post("/signup/verify", verifySignup);
router.get("/dummyPdf", dummyPdfGnerate);
router.post("/create-order", authenticate, createOrder);
router.put("/address", authenticate, saveAddress);
router.get("/", authenticate, getAllCustomers);
router.put("/:id", authenticate, updateCustomer);
router.put("/active/:id", authenticate, changeActiveStatus);
router.delete("/:id", authenticate, deleteCustomer);
router.get("/orders/:id", getOrderbyCustomerId);
router.get("/summary/:id", customerCompleteOrderSummary);
router.delete("/customer-clear", customerTableClear);

router.get("/export-all-customer", exportAllCustomer);

module.exports = router;
