const express = require("express");
const router = express.Router();
const {
  createPartner,
  deletePartner,
  getActivePartner,
  getAllPartner,
  getPartnerById,
  updatePartnerById,
  updateisActiveByPartnerId,
} = require("../controllers/partner.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all Partner
router.get("/", getAllPartner);

router.get("/active", getActivePartner);

// Route for getting a specific Partner by ID
router.get("/:id", getPartnerById);

// Route for creating a new Partner
router.post("/", authenticate, createPartner);

// Route for updating a Partner by ID
router.put("/:id", authenticate, updatePartnerById);

// Route for deleting a Partner by ID
router.delete("/:id", authenticate, deletePartner);

// Route for update Isactive a Partner by ID
router.post("/active/:id", authenticate, updateisActiveByPartnerId);

module.exports = router;
