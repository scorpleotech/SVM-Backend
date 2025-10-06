const Event = require("../models/event.model");

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    let filter = {};
    if (req.query.tags) {
      filter.tags = { $in: req.query.tags.split(",") };
    }
    if (req.query.topic) {
      filter.topic = { $in: req.query.topic.split(",") };
    }
    const events = await Event.find(filter).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create event
exports.createEvent = async (req, res) => {
  try {
    const { description } = req.body;

    // Calculate reading time (Assuming average reading speed is 200 words per minute)
    const wordsPerMinute = 200;
    const words = description.split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(words / wordsPerMinute);

    const newEvent = new Event({
      ...req.body,
      readingTime: readingTimeMinutes, // Adding reading time to the news object
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid data provided", error: error.message });
  }
};

// Update event by ID
exports.updateEventById = async (req, res) => {
  try {
    const { description } = req.body;

    // Calculate reading time (Assuming average reading speed is 200 words per minute)
    const wordsPerMinute = 200;
    const words = description.split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(words / wordsPerMinute);

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        readingTime: readingTimeMinutes, // Adding reading time to the news object
      },
      {
        new: true,
      }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: "Invalid data provided" });
  }
};

// Delete event by ID
exports.deleteEventById = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
