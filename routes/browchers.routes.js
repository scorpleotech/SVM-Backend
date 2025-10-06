const express = require("express");
const router = express.Router();
const {
  createBroucher,
  getAllBroucher,
  getBroucherById,
  updateBroucherById,
  deleteBroucherById,
  getBroucherByType,
} = require("../controllers/broucher.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

router.post("/", createBroucher);

router.get("/", getAllBroucher);

router.get("/url/:type", getBroucherByType);

router.get("/:id", getBroucherById);

router.put("/:id", updateBroucherById);

router.delete("/:id", deleteBroucherById);

module.exports = router;
