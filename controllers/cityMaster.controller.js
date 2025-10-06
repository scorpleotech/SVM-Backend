const City = require("../models/cityMaster.model");

// Create aboutus
exports.createCity = async (req, res) => {
  try {
    const city = new City(req.body);
    await city.save();
    res.status(201).json(city);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createManyCity = async (req, res) => {
  try {
    console.log(req.body[0]);
    const city = await City.insertMany(req.body);
    res.status(201).json(city);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllStates = async (req, res) => {
  try {
    const states = await City.distinct("state");
    // console.log("Unique states:", states);
    res.status(200).json(states);
  } catch (error) {
    console.error("Error fetching unique states:", error);
  }
};

exports.getAllCities = async (req, res) => {
  try {
    const state = req.params.state;
    const cities = await City.find({ state: state });
    // console.log("Cities in state:", state, cities);
    res.status(200).json(cities);
    return cities;
  } catch (error) {
    console.error("Error fetching cities by state:", error);
  }
};
