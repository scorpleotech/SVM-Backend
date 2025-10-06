const express = require("express");
const router = express.Router();
const {
  getAllStoreLocator,
  createStoreLocator,
  updateStoreLocatorById,
  getStoreLocatorById,
  deleteStoreLocatorById,
  getAllStoreLocatorData,
  searchStoreLocatorByCity,
  getCities,
} = require("../controllers/store.controller");
const passport = require("passport");

// Middleware function for passport authentication
const authenticate = passport.authenticate("jwt", { session: false });

// Route for getting all StoreLocator
router.get("/", getAllStoreLocator);

// Route for getting all StoreLocator
router.get("/data", getAllStoreLocatorData);

// Route for creating a new StoreLocator
router.post("/", authenticate, createStoreLocator);

// Route for updating a StoreLocator by ID
router.put("/:id", authenticate, updateStoreLocatorById);

// Route for getting a StoreLocator by ID
router.get("/:id", getStoreLocatorById);

// Route for deleting a StoreLocator by ID
router.delete("/:id", authenticate, deleteStoreLocatorById);

// Define a route for searching store locators by city
router.get("/locator/search", searchStoreLocatorByCity);

router.get("/data/cities", getCities);

module.exports = router;
