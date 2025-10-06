const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UsersSchema = new mongoose.Schema(
  {
    created_user: {
      // required: true,
      type: Object,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: true,
    },
    isStaff: {
      type: Boolean,
      required: true,
      default: false,
    },
    isAgent: {
      type: Boolean,
      required: true,
      default: false,
    },
    isCustomer: {
      type: Boolean,
      required: true,
      default: true,
    },
    isStaff: {
      type: Boolean,
      required: true,
      default: false,
    },
    name: {
      type: String,
    },

    email: {
      type: String,
      // required: true,
      // unique: true,
    },
    username: {
      type: String,
      // required: true,
      min: 6,
      max: 15,
      // unique: true,
    },
    agent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
    },
    password: {
      type: String,
      // required: true,
      trim: true,
    },
    rolename: {
      type: String,
      enum: [
        "Admin",
        "Manager",
        "Sales_Agent",
        "Accounts_Manager",
        "Service_Agent",
        "MD",
        "Customer",
        "ASM",
        "Head_of_Department_Business",
      ],
      default: "Sales_Agent", // Set the default role as "Sales" or another suitable default
    },
    role: {
      type: Object,
      default: {
        staffonlyyou: false,
        "staff/add": false,
        "staff/id": false,
        "staff/list": false,
        staffdelete: false,
        staffview: false,

        categoriesonlyyou: false,
        "categories/add": false,
        "categories/id": false,
        "categories/list": false,
        "categories/delete": false,
        categoriesview: false,

        incentiveonlyyou: false,
        "incentive/add": false,
        "incentive/id": false,
        "incentive/list": false,
        "incentive/delete": false,
        incentiveview: false,

        bikevarientonlyyou: false,
        "bikevarient/add": false,
        "bikevarient/id": false,
        "bikevarient/list": false,
        "bikevarient/delete": false,
        bikevarientview: false,

        uploadcontentonlyyou: false,
        "uploadcontent/add": false,
        "uploadcontent/id": false,
        "uploadcontent/list": false,
        "uploadcontent/delete": false,
        uploadcontentview: false,

        testimonialonlyyou: false,
        "testimonial/add": false,
        "testimonial/id": false,
        "testimonial/list": false,
        "testimonial/delete": false,
        testimonialview: false,

        banneronlyyou: false,
        "banner/add": false,
        "banner/id": false,
        "banner/list": false,
        "banner/delete": false,
        bannerview: false,

        partneronlyyou: false,
        "partner/add": false,
        "partner/id": false,
        "partner/list": false,
        "partner/delete": false,
        partnerview: false,

        ordersview: false,
        "orders/list": false,
        ordersonlyyou: false,
        "orders/add": false,
        "orders/id": false,

        aboutusonlyyou: false,
        "aboutus/add": false,
        "aboutus/id": false,
        "aboutus/list": false,
        "aboutus/delete": false,
        aboutusview: false,

        productbanneronlyyou: false,
        "productbanner/add": false,
        "productbanner/id": false,
        "productbanner/list": false,
        "productbanner/delete": false,
        productbannerview: false,

        faqonlyyou: false,
        "faq/add": false,
        "faq/id": false,
        "faq/list": false,
        "faq/delete": false,
        faqview: false,

        storeonlyyou: false,
        "store/add": false,
        "store/id": false,
        "store/list": false,
        "store/delete": false,
        storeview: false,

        accessoriesonlyyou: false,
        "accessories/add": false,
        "accessories/id": false,
        "accessories/list": false,
        "accessories/delete": false,
        accessoriesview: false,

        visitusonlyyou: false,
        "visitus/add": false,
        "visitus/id": false,
        "visitus/list": false,
        "visitus/delete": false,
        visitusview: false,

        demoonlyyou: false,
        "demo/add": false,
        "demo/id": false,
        "demo/list": false,
        "demo/delete": false,
        demoview: false,

        blogsonlyyou: false,
        "blogs/add": false,
        "blogs/id": false,
        "blogs/list": false,
        "blogs/delete": false,
        blogsview: false,

        eventonlyyou: false,
        "event/add": false,
        "event/id": false,
        "event/list": false,
        "event/delete": false,
        eventview: false,

        newsonlyyou: false,
        "news/add": false,
        "news/id": false,
        "news/list": false,
        "news/delete": false,
        newsview: false,

        enquiryonlyyou: false,
        "enquiry/add": false,
        "enquiry/id": false,
        "enquiry/list": false,
        "enquiry/delete": false,
        enquiryview: false,

        customersonlyyou: false,
        "customers/add": false,
        "customers/id": false,
        "customers/list": false,
        "customers/delete": false,
        customersview: false,

        dealeronlyyou: false,
        "dealer/add": false,
        "dealer/id": false,
        "dealer/list": false,
        "dealer/delete": false,
        dealerview: false,

        "tco/add": false,
        "tco/delete": false,
        "tco/id": false,
        "tco/list": false,
        tcoonlyyou: false,
        tcoview: false,

        "application/add": false,
        "application/delete": false,
        "application/id": false,
        "application/list": false,
        applicationonlyyou: false,
        applicationview: false,

        "career/add": false,
        "career/delete": false,
        "career/id": false,
        "career/list": false,
        careeronlyyou: false,
        careerview: false,

        "values/add": false,
        "values/delete": false,
        "values/id": false,
        "values/list": false,
        valuesonlyyou: false,
        valuesview: false,

        homeview: false,
        aboutview: false,
        pranaview: false,
        careerapplicationview: false,
      },
    },

    image: {
      type: String,
    },

    phone: {
      type: String,
    },
    prefix: {
      type: String,
    },

    // for future use
    email_two_fa: {
      type: Boolean,
      default: false,
    },
    two_fa: {
      type: Boolean,
      default: false,
    },
    otp_verified: {
      type: Boolean,
      default: false,
    },
    otp_base32: {
      type: String,
    },
    otp_auth_url: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
      default: "asdasdasdas--example--6yhjkoıu7654esxcvbhythbvfde45ty",
    },
    resetPasswordExpires: {
      type: Date,
      default: Date.now(),
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

UsersSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    this.password = passwordHash;
    next();
  });
});

UsersSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);
    else {
      if (!isMatch) return cb(null, isMatch);
      return cb(null, this);
    }
  });
};

const Users = mongoose.model("Users", UsersSchema);
module.exports = Users;
