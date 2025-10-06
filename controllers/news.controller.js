const News = require("../models/news.model");
const Subscribers = require("../models/subscricriber.model");
const HTML_TEMPLATE = require("../service/templates/newsTemplate");
const nodemailer = require("nodemailer");

// Get all news
exports.getAllNews = async (req, res) => {
  try {
    let filter = {};
    if (req.query.categories) {
      filter.categories = { $in: req.query.categories.split(",") };
    }
    if (req.query.tags) {
      filter.tags = { $in: req.query.tags.split(",") };
    }
    if (req.query.topic) {
      filter.topic = { $in: req.query.topic.split(",") };
    }
    const news = await News.find(filter).sort({ published_date: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get news by ID
exports.getNewsById = async (req, res) => {
  try {
    const newsSlug = await News.findOne({ slug: req.params.id });

    let news;
    if (newsSlug) {
      news = newsSlug;
    } else {
      // If newsSlug is null, try finding by _id
      news = await News.findById(req.params.id);
    }
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create news
exports.createNews = async (req, res) => {
  try {
    const { description } = req.body;

    // Calculate reading time (Assuming average reading speed is 200 words per minute)
    const wordsPerMinute = 200;
    const words = description.split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(words / wordsPerMinute);
    const newNews = new News({
      ...req.body,
      readingTime: readingTimeMinutes, // Adding reading time to the news object
    });

    const savedNews = await newNews.save();

    // const maillerConfig = {
    //   host: process.env.MAIL_HOST,
    //   port: process.env.MAIL_PORT,
    //   secure: false,
    //   auth: {
    //     user: process.env.MAIL_USER,
    //     pass: process.env.MAIL_PASSWORD,
    //   },
    //   // tls: {
    //   //   rejectUnauthorized: false,
    //   // },
    // };

    const maillerConfig = {
      service: "",
      host: "localhost",
      port: 25,
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
    };

    const transporter = nodemailer.createTransport(maillerConfig);
    // Create HTML email content with dynamic values
    const htmlContent = HTML_TEMPLATE(savedNews, "news");

    const uniqueEmails = await Subscribers.distinct("email");

    // Define mail options for the first email
    const mailOptions1 = {
      to: `${process.env.TO_MAIL_USER}`, // Email address for the first user
      from: `${process.env.MAIL_USER}`,
      // cc: ["projectsicore4@gmail.com", "rumeshvarmalliga@icore.net.in"],
      bcc: uniqueEmails.join(","),
      subject: `New News has been added`,
      html: htmlContent,
    };

    // Send the first email
    transporter.sendMail(mailOptions1, (err1, response1) => {
      if (err1) {
        console.error("Error sending email to user:", err1);
      }
    });

    res.status(201).json(savedNews);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid data provided", error: error.message });
  }
};

// Update news by ID
exports.updateNewsById = async (req, res) => {
  try {
    const { description } = req.body;

    // Calculate reading time (Assuming average reading speed is 200 words per minute)
    const wordsPerMinute = 200;
    const words = description.split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(words / wordsPerMinute);

    // Update news with new reading time
    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        readingTime: readingTimeMinutes, // Updating reading time
      },
      { new: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ message: "News not found" });
    }

    res.json(updatedNews);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid data provided", error: error.message });
  }
};

// Delete news by ID
exports.deleteNewsById = async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
