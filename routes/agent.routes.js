const express = require("express");
const router = express.Router();
const {
  changeActiveStatus,
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  getAgentByUserId,
  getIncentiveByAgentId,
  getTotalIncentiveByAgentId,
  getMonthlyOrdersByAgentId,
  getTotalMonthlyIncentiveByAgentId,
  getTotalOrdersByAgentId,
  exportAllAgents,
  verifyOTP,
  aadharVerify,
  aadhaarVerifyOTP,
} = require("../controllers/agent.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });
// Create a new agent
router.post("/", createAgent);

router.post("/aadhaar/verify", aadharVerify);

// Get all agents
router.get("/", authenticate, getAllAgents);

// Get a single agent by ID
router.get("/:id", authenticate, getAgentById);

// Update an agent
router.put("/:id", authenticate, updateAgent);

// Delete an agent
router.delete("/:id", authenticate, deleteAgent);

router.post("/active/:id", authenticate, changeActiveStatus);

router.get("/user/:id", authenticate, getAgentByUserId);

// router.get("/orders/:id", authenticate, getOrderByAgentId);

router.get("/totalorders/:id", authenticate, getTotalOrdersByAgentId);

router.get("/monthlyorders/:id", authenticate, getMonthlyOrdersByAgentId);

router.get("/incentive/:id", authenticate, getTotalIncentiveByAgentId);
router.get("/export/all-agent", exportAllAgents);

router.post("/verify/otp", verifyOTP);
router.post("/aadhaar/verify/otp", aadhaarVerifyOTP);

router.get(
  "/monthlyincentive/:id",
  authenticate,
  getTotalMonthlyIncentiveByAgentId
);

module.exports = router;
