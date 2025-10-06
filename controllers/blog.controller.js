const Blog = require("../models/blog.model");
const Subscribers = require("../models/subscricriber.model");
const HTML_TEMPLATE = require("../service/templates/newsTemplate");
const nodemailer = require("nodemailer");

// Get all blogs
exports.getAllBlogs = async (req, res) => {
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
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    // console.log(blogs);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const newsSlug = await Blog.findOne({ slug: req.params.id });

    let blog;
    if (newsSlug) {
      blog = newsSlug;
    } else {
      // If newsSlug is null, try finding by _id
      blog = await Blog.findById(req.params.id);
    }
    // const blog = await Blog.findOne({ slug: req.params.id });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create blog
exports.createBlog = async (req, res) => {
  try {
    // Extract userId from the authenticated user's request
    const userId = req.user.id;
    const profilePic = req.user.image;
    const name = req.user.name;

    // Extract data from the request body
    const {
      title,
      description,
      short_description,
      image,
      nLikes,
      numComments,
      categories,
      tags,
      topic,
      slug,
      readingTime,
      metaTitle,
      metaDescription,
    } = req.body;

    // Calculate reading time (Assuming average reading speed is 200 words per minute)
    const wordsPerMinute = 200;
    const words = description.split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(words / wordsPerMinute);

    // Create a new Blog instance
    const newBlog = new Blog({
      title: title,
      description: description,
      short_description: short_description,
      image: image,
      nLikes: nLikes,
      numComments: numComments,
      categories,
      metaTitle: metaTitle,
      metaDescription: metaDescription,
      slug: slug,
      readingTime: readingTimeMinutes,
      topic,
      tags,
      author: {
        userId: userId,
        profilePic: profilePic,
        name: name,
      },
    });

    // Save the new blog to the database
    const savedBlog = await newBlog.save();

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
    const htmlContent = HTML_TEMPLATE(savedBlog, "blogs");

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

    // Respond with the newly created blog
    res.status(201).json(savedBlog);
  } catch (error) {
    // If any error occurs during creation, respond with a 400 status and error message
    res
      .status(400)
      .json({ message: "Invalid data provided", error: error.message });
  }
};

// Update blog by ID
exports.updateBlogById = async (req, res) => {
  try {
    const { description } = req.body;

    // Calculate reading time (Assuming average reading speed is 200 words per minute)
    const wordsPerMinute = 200;
    const words = description.split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(words / wordsPerMinute);

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        readingTime: readingTimeMinutes, // Updating reading time
      },
      {
        new: true,
      }
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: "Invalid data provided" });
  }
};

// Delete blog by ID
exports.deleteBlogById = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all blogs of a user by user ID
exports.getAllBlogsByUserId = async (req, res) => {
  try {
    // Extract the user ID from the request parameters
    const userId = req.params.id;

    // Find all blogs that belong to the specified user ID
    const blogs = await Blog.find({ "author.userId": userId });

    // Check if there are no blogs found
    if (blogs.length === 0) {
      return res
        .status(404)
        .json({ message: "No blogs found for the specified user" });
    }

    // Respond with the blogs belonging to the specified user
    res.json(blogs);
  } catch (error) {
    // If any error occurs during retrieval, respond with a 500 status and error message
    res.status(500).json({ message: "Internal Server Error" });
  }
};
