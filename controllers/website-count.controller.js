const websiteCount = require("../models/website-count.model");

exports.storeWebsiteCount = async (req, res) => {
  try {
    const { count_id } = req.body;

    // Check if the count_id already exists
    const existingCount = await websiteCount.findOne({ count_id });

    if (existingCount) {
      // If count_id exists, return the document co
      const totalCount = await websiteCount.countDocuments();
      res.status(200).json({ count: totalCount });
      return;
    }

    // If count_id doesn't exist, save it
    const websiteCountData = new websiteCount({ count_id });
    await websiteCountData.save();

    // Get the total count of documents after saving
    const totalCount = await websiteCount.countDocuments();

    // Return the saved document count
    res.status(201).json({ count: totalCount });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getWebsiteCount = async (req, res) => {
  try {
    // Get the total count of documents in the websiteCount collection
    const totalCount = await websiteCount.countDocuments();

    // Return the total count
    res.status(200).json({ count: totalCount });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
