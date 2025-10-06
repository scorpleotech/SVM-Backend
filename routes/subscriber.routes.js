const express = require("express");
const router = express.Router();
const subscriberController = require("../controllers/subscriber.controller");

router.post("/", subscriberController.createSubscriber);

module.exports = router;
