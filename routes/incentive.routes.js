const express = require("express");
const router = express.Router();
const {
  createIncentive,
  deleteIncentive,
  getAllIncentives,
  getIncentiveById,
  updateIncentive,
  getIncentivesByAgentId,
} = require("../controllers/incentive.controller");

const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

router.post("/", createIncentive);

router.get("/", authenticate, getAllIncentives);

router.get("/agent/:id", authenticate, getIncentivesByAgentId);

router.get("/:id", authenticate, getIncentiveById);

router.put("/:id", authenticate, updateIncentive);

router.delete("/:id", authenticate, deleteIncentive);

module.exports = router;
