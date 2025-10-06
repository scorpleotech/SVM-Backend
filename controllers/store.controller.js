const StoreLocator = require("../models/store.model");

// Get all StoreLocator
exports.getAllStoreLocator = async (req, res) => {
  try {
    const storeLocators = await StoreLocator.find().sort({ updatedAt: -1 });
    res.json(storeLocators);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all StoreLocator
exports.getAllStoreLocatorData = async (req, res) => {
  try {
    const { state, city, store_type, pincode } = req.query;

    let query = {};

    if (state) {
      query.state = state;
    }
    if (pincode) {
      query.pincode = pincode;
    }

    if (city) {
      query.city = city;
    }

    if (store_type) {
      query.store_type = store_type;
    }

    const storeLocators = await StoreLocator.find(query).sort({
      updatedAt: -1,
    });
    res.json(storeLocators);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getStoreLocatorById = async (req, res) => {
  const { id } = req.params; // Change from stateId to id

  try {
    const storeLocator = await StoreLocator.findById(id); // Change from stateId to id

    if (!storeLocator) {
      return res.status(404).json({ message: "Store locator not found" });
    }

    res.json(storeLocator);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create StoreLocator
exports.createStoreLocator = async (req, res) => {
  const {
    state,
    name,
    address,
    city,
    email,
    website,
    pincode,
    phone,
    map,
    store_type,
  } = req.body; // Updated to accept locations array

  try {
    const storeLocator = new StoreLocator({
      state,
      name,
      email,
      city,
      website,
      pincode,
      address,
      phone,
      map,
      store_type,
    });

    // Save the new store locator to the database
    const savedStoreLocator = await storeLocator.save();
    res.status(201).json(savedStoreLocator);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update StoreLocator by ID
exports.updateStoreLocatorById = async (req, res) => {
  const {
    state,
    name,
    email,
    website,
    city,
    pincode,
    address,
    phone,
    map,
    store_type,
  } = req.body; // Updated to accept locations array

  try {
    const updatedStoreLocator = await StoreLocator.findByIdAndUpdate(
      req.params.id,
      {
        state,
        name,
        email,
        website,
        pincode,
        city,
        address,
        phone,
        map,
        store_type,
      },
      {
        new: true,
      }
    );

    if (!updatedStoreLocator) {
      return res.status(404).json({ message: "Store Locator not found" });
    }

    res.json(updatedStoreLocator);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteStoreLocatorById = async (req, res) => {
  const { id } = req.params;

  try {
    const storeLocator = await StoreLocator.findByIdAndDelete(id);

    if (!storeLocator) {
      return res.status(404).json({ message: "Store locator not found" });
    }

    res.json({ message: "Store locator deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add a new controller function for searching store locators by city
exports.searchStoreLocatorByCity = async (req, res) => {
  const { city, store_type } = req.query; // Extract the city query parameter from the request

  try {
    // Use a regular expression to perform a case-insensitive search for cities starting with the provided query
    const regex = new RegExp(`^${city}`, "i");
    let query = {
      city: regex,
    };

    if (store_type) {
      query.store_type = store_type;
    }
    const storeLocators = await StoreLocator.find(query);

    res.json(storeLocators); // Return the matching store locators in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getCities = async (req, res) => {
  try {
    // Use the distinct() method to get an array of unique city values
    const cities = await StoreLocator.distinct("city");

    // Convert the array to a Set to remove duplicates
    const uniqueCities = [...new Set(cities)];

    res.json(uniqueCities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
