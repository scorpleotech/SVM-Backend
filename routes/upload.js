const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const passport = require("passport");
var exec = require("child_process").execFile;
const upload = multer({ dest: "uploads/" });

var fun = function () {
  console.log("fun() start");
  exec("./sync_files.sh", function (err, data) {
    console.log("fun() end and triggers on server");
    console.log(err);
    console.log(data.toString());
  });
};

const uploadImage = async (req, res, next) => {
  try {
    if (req.body[0]) {
      // to declare some path to store your converted image
      const path =
        "../admin/public/images/uploads/staff/" + Date.now() + ".png";

      const imgdata = req.body[0].thumbUrl;
      if (!imgdata) {
        return res.send("../admin/public");
      }

      // to convert base64 format into random filename
      const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, "");

      fs.writeFileSync(path, base64Data, { encoding: "base64" });

      return res.send(path);
    } else {
      return res.send("../admin/public");
    }
  } catch (e) {
    next(e);
  }
};

router.post(
  "/uploadstaffavatar",
  passport.authenticate("jwt", { session: false }),
  uploadImage,
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["staff/add"]) {
      if (req.file) return res.json({ msg: "image successfully uploaded" });
      fun();
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deletestaffavatar",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["staff/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

// green champion image

const uploadImageChampion = async (req, res, next) => {
  try {
    if (req.body[0]) {
      // to declare some path to store your converted image
      const path =
        "../admin/public/images/uploads/champion/" + Date.now() + ".png";

      const imgdata = req.body[0].thumbUrl;
      if (!imgdata) {
        return res.send("../admin/public");
      }

      // to convert base64 format into random filename
      const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, "");

      fs.writeFileSync(path, base64Data, { encoding: "base64" });
      fun();
      return res.send(path);
    } else {
      return res.send("../admin/public");
    }
  } catch (e) {
    next(e);
  }
};

router.post("/uploadchampionavatar", uploadImageChampion, (req, res) => {
  if (req.file) return res.json({ msg: "image successfully uploaded" });
  res.send("Image upload failed");
});

const uploadImageCustomer = async (req, res, next) => {
  try {
    if (req.body[0]) {
      // to declare some path to store your converted image
      const path =
        "../admin/public/images/uploads/customers/" + Date.now() + ".png";

      const imgdata = req.body[0].thumbUrl;
      if (!imgdata) {
        return res.send("../admin/public");
      }

      // to convert base64 format into random filename
      const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, "");

      fs.writeFileSync(path, base64Data, { encoding: "base64" });
      return res.send(path);
    } else {
      return res.send("../admin/public");
    }
  } catch (e) {
    next(e);
  }
};

router.post(
  "/uploadcustomersavatar",
  passport.authenticate("jwt", { session: false }),
  uploadImageCustomer,
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["customers/add"]) {
      if (req.file) return res.json({ msg: "image successfully uploaded" });
      fun();
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deletecustomersavatar",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["customers/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

// path converter
function transformWindowsPathToUnix(path) {
  return path.replace(/\\/g, "/").replace(/^.*?\/admin/, "../admin");
}

const storageProduct = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterProduct = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/GIF",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadproductimage = multer({
  storage: storageProduct,
  fileFilter: fileFilterProduct,
});

router.post(
  "/uploadproductimage",
  passport.authenticate("jwt", { session: false }),
  uploadproductimage.single("image"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["productimages/add"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          msg: "image successfully uploaded",
          path: unixPath,
        });
      }
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deleteproductimage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["productimages/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

//cargo image manage

const storageCargo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/cargoes");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterCargo = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/GIF",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadimagecargo = multer({
  storage: storageCargo,
  fileFilter: fileFilterCargo,
});

router.post(
  "/uploadcargoimage",
  passport.authenticate("jwt", { session: false }),
  uploadimagecargo.single("image"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["cargoes/add"]) {
      console.log(req.file);
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          msg: "image successfully uploaded",
          path: unixPath,
        });
      }
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deletecargoimage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["cargoes/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

//orderstatus image manage

const storageOrderstatus = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/orderstatus");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterOrderstatus = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/GIF",
    "image/webp",
    "image/svg+xml",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadimageorderstatus = multer({
  storage: storageOrderstatus,
  fileFilter: fileFilterOrderstatus,
});

router.post(
  "/uploadorderstatusimage",
  passport.authenticate("jwt", { session: false }),
  uploadimageorderstatus.single("image"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["orderstatus/add"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          msg: "image successfully uploaded",
          path: unixPath,
        });
      }
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deleteorderstatusimage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["orderstatus/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

//payment methods image manage

const storagePaymentmethods = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/paymentmethods");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterPaymentmethods = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/GIF",
    "image/webp",
    "image/svg+xml",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadimagepaymentmethods = multer({
  storage: storagePaymentmethods,
  fileFilter: fileFilterPaymentmethods,
});

router.post(
  "/uploadpaymentmethodsimage",
  passport.authenticate("jwt", { session: false }),
  uploadimagepaymentmethods.single("image"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["paymentmethods/add"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          msg: "image successfully uploaded",
          path: unixPath,
        });
      }
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deletepaymentmethodsimage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["paymentmethods/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

//brands image manage

const storageBrands = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/brands");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterBrands = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/GIF",
    "image/webp",
    "image/svg+xml",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadimageBrands = multer({
  storage: storageBrands,
  fileFilter: fileFilterBrands,
});

router.post(
  "/uploadbrandsimage",
  passport.authenticate("jwt", { session: false }),
  uploadimageBrands.single("image"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["brands/add"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          msg: "image successfully uploaded",
          path: unixPath,
        });
      }
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deletebrandsimage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["brands/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

//Blog image manage

const storageBlogs = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/blogs");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterBlogs = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/GIF",
    "image/webp",
    "image/svg+xml",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadimageBlogs = multer({
  storage: storageBlogs,
  fileFilter: fileFilterBlogs,
});

router.post(
  "/uploadblogsimage",
  passport.authenticate("jwt", { session: false }),
  uploadimageBlogs.single("image"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["blogs/add"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          msg: "Blog image successfully uploaded",
          path: unixPath,
        });
      }
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deleteblogsimage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["blogs/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

//Event image manage

const storageEvent = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/event");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterEvent = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/GIF",
    "image/webp",
    "image/svg+xml",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadimageEvent = multer({
  storage: storageEvent,
  fileFilter: fileFilterEvent,
});

router.post(
  "/uploadeventimage",
  passport.authenticate("jwt", { session: false }),
  uploadimageEvent.single("image"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["event/add"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          messagge: "Event image successfully uploaded",
          variant: "success",
          path: unixPath,
        });
      }
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deleteeventimage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["event/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

//News image manage

const storageNews = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/news");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterNews = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/GIF",
    "image/webp",
    "image/svg+xml",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadimageNews = multer({
  storage: storageNews,
  fileFilter: fileFilterNews,
});

router.post(
  "/uploadnewsimage",
  passport.authenticate("jwt", { session: false }),
  uploadimageNews.single("image"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["news/add"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          messagge: "News image successfully uploaded",
          variant: "success",
          path: unixPath,
        });
      }
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deletenewsimage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["news/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

// Accessories image manage

const storageAccessories = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/accessories");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterAccessories = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/GIF",
    "image/webp",
    "image/svg+xml",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadimageAccessories = multer({
  storage: storageAccessories,
  fileFilter: fileFilterAccessories,
});

router.post(
  "/uploadaccessoriesimage",
  passport.authenticate("jwt", { session: false }),
  uploadimageAccessories.single("image"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["accessories/add"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          messagge: "Accessories image successfully uploaded",
          variant: "success",
          path: unixPath,
        });
      }
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deleteaccessoriesimage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["accessories/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

// Agent image manage

const storageAgent = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/agent");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterAgent = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/GIF",
    "image/webp",
    "image/svg+xml",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadimageAgent = multer({
  storage: storageAgent,
  fileFilter: fileFilterAgent,
});

router.post(
  "/uploadagentimage",
  passport.authenticate("jwt", { session: false }),
  uploadimageAgent.single("image"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["agent/add"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          messagge: "Agent image successfully uploaded",
          variant: "success",
          path: unixPath,
        });
      }
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deleteagentimage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["agent/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

//testimonials image manage

const storageTestimonial = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/testimonial");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterTestimonial = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/GIF",
    "image/webp",
    "image/svg+xml",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadimageTestimonial = multer({
  storage: storageTestimonial,
  fileFilter: fileFilterTestimonial,
});

router.post(
  "/uploadtestimonialimage",
  passport.authenticate("jwt", { session: false }),
  uploadimageTestimonial.single("image"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["testimonial/add"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          msg: "Testimonials image successfully uploaded",
          path: unixPath,
        });
      }
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deletetestimonialimage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["testimonial/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

//banner image manage

const storageBanner = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/banner");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterBanner = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/GIF",
    "image/webp",
    "image/svg+xml",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadimageBanner = multer({
  storage: storageBanner,
  fileFilter: fileFilterBanner,
});

router.post(
  "/uploadbannerimage",
  passport.authenticate("jwt", { session: false }),
  uploadimageBanner.single("image"),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["banner/add"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          msg: "Banner image successfully uploaded",
          path: unixPath,
        });
      }
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deletebannerimage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["banner/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

//varient image manage

const storageVarient = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/varient");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterVarient = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/GIF",
    "image/webp",
    "image/svg+xml",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadimageVarient = multer({
  storage: storageVarient,
  fileFilter: fileFilterVarient,
});

router.post(
  "/uploadbikevarientimage",
  passport.authenticate("jwt", { session: false }),
  uploadimageVarient.single("image"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["bikevarient/add"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          msg: "Varient image successfully uploaded",
          path: unixPath,
        });
      }
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deletebikevarientimage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["bikevarient/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

const fileFilterVideos = (req, file, cb) => {
  const allowedFileTypes = [
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    // Add more mime types for video formats you want to allow
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const storageBikeVarientVideos = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/varient/videos");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

let uploadVideo = multer({
  storage: storageBikeVarientVideos,
  fileFilter: fileFilterVideos,
});

router.post(
  "/uploadbikevarientvideo",
  passport.authenticate("jwt", { session: false }),
  uploadVideo.single("video"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["bikevarient/add"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          msg: "Video successfully uploaded",
          path: unixPath,
        });
      }
      res.send("Video upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deletebikevarientvideo",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["bikevarient/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not video");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

// categories video

const storageCategoriesVideos = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/categories/videos");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

let uploadCategoryVideo = multer({
  storage: storageCategoriesVideos,
  fileFilter: fileFilterVideos,
});

router.post(
  "/uploadcategoriesvideo",
  passport.authenticate("jwt", { session: false }),
  uploadCategoryVideo.single("video"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["categories/add"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          msg: "Video successfully uploaded",
          path: unixPath,
        });
      }
      res.send("Video upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deletecategoriesvideo",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["categories/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not video");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

//partner image manage

const storagePartner = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/partner");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterPartner = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/GIF",
    "image/webp",
    "image/svg+xml",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadimagePartner = multer({
  storage: storagePartner,
  fileFilter: fileFilterPartner,
});

router.post(
  "/uploadpartnerimage",
  passport.authenticate("jwt", { session: false }),
  uploadimagePartner.single("image"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["partner/add"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          msg: "Partner image successfully uploaded",
          path: unixPath,
        });
      }
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deletePartnerimage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["partner/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

//aboutus image manage

const storageAboutus = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/aboutus");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterAboutus = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/GIF",
    "image/webp",
    "image/svg+xml",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadimageAboutus = multer({
  storage: storageAboutus,
  fileFilter: fileFilterAboutus,
});

router.post(
  "/uploadaboutusimage",
  passport.authenticate("jwt", { session: false }),
  uploadimageAboutus.single("image"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["aboutus/add"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          msg: "Categories image successfully uploaded",
          path: unixPath,
        });
      }
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deleteaboutusimage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["aboutus/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

//productbanner image manage

const storageProductBanner = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/productbanner");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterProductBanner = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/GIF",
    "image/webp",
    "image/svg+xml",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadimageProductBanner = multer({
  storage: storageProductBanner,
  fileFilter: fileFilterProductBanner,
});

router.post(
  "/uploadproductbannerimage",
  passport.authenticate("jwt", { session: false }),
  uploadimageProductBanner.single("image"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["productbanner/add"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          msg: "Product Banner image successfully uploaded",
          path: unixPath,
        });
      }
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deleteproductbannerimage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["productbanner/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

//categories image manage

const storageCategories = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/categories");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterCategories = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/GIF",
    "image/webp",
    "image/svg+xml",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadimageCategories = multer({
  storage: storageCategories,
  fileFilter: fileFilterCategories,
});

router.post(
  "/uploadcategoriesimage",
  passport.authenticate("jwt", { session: false }),
  uploadimageCategories.single("image"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["categories/add"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          msg: "Categories image successfully uploaded",
          path: unixPath,
        });
      }
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deletecategoriesimage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["categories/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

//homeslider image manage

const storagehomeslider = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/homeslider");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterhomeslider = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/GIF",
    "image/webp",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadimagehomeslider = multer({
  storage: storagehomeslider,
  fileFilter: fileFilterhomeslider,
});

router.post(
  "/uploadhomesliderimage",
  passport.authenticate("jwt", { session: false }),
  uploadimagehomeslider.single("image"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["homeslider/add"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          msg: "image successfully uploaded",
          path: unixPath,
        });
      }
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deletehomesliderimage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["homeslider/id"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

//Logo image manage

const storageLogo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../admin/public/images/uploads/logo");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterLogo = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/GIF",
    "image/webp",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadimagelogo = multer({
  storage: storageLogo,
  fileFilter: fileFilterLogo,
});

router.post(
  "/uploadlogoimage",
  passport.authenticate("jwt", { session: false }),
  uploadimagelogo.single("image"),
  (req, res) => {
    const rolesControl = req.user.role;

    if (rolesControl["superadmin"]) {
      if (req.file) {
        const unixPath = transformWindowsPathToUnix(req.file.path);
        fun();
        return res.json({
          msg: "image successfully uploaded",
          path: unixPath,
        });
      }
      res.send("Image upload failed");
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

router.post(
  "/deletelogoimage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const rolesControl = req.user.role;
    if (rolesControl["superadmin"]) {
      try {
        fs.unlinkSync("../admin/public" + req.body.path);
      } catch (e) {
        console.log("not image");
      }
    } else {
      res.status(403).json({
        message: {
          messagge: "You are not authorized, go away!",
          variant: "error",
        },
      });
    }
  }
);

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const storageFiles = multer.diskStorage({
  destination: function (req, file, cb) {
    ensureDirectoryExists("../admin/public/images/uploads");
    cb(null, "../admin/public/images/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilterImage = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/GIF",
    "image/webp",
    "image/svg+xml",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let uploadimage = multer({
  storage: storageFiles,
  fileFilter: fileFilterImage,
});

router.post("/uploadFile", uploadimage.single("image"), (req, res) => {
  if (req.file) {
    const unixPath = transformWindowsPathToUnix(req.file.path);
    fun();
    return res.json({
      msg: "image successfully uploaded",
      path: unixPath,
    });
  }
  res.send("Image upload failed");
});

let uploadBroucher = multer({
  storage: storageFiles,
});

router.post("/uploadBroucher", uploadBroucher.single("image"), (req, res) => {
  if (req.file) {
    const unixPath = transformWindowsPathToUnix(req.file.path);
    fun();
    return res.json({
      msg: "image successfully uploaded",
      path: unixPath,
    });
  }
  res.send("Image upload failed");
});

module.exports = router;
