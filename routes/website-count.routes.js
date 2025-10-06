const express = require("express");
const router = express.Router();
const {
  getWebsiteCount,
  storeWebsiteCount,
} = require("../controllers/website-count.controller");

router.post("/", storeWebsiteCount);

// Route for getting a specific testdrive by ID
router.get("/", getWebsiteCount);

module.exports = router;
