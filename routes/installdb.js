const router = require("express").Router();

// let Users = require("../models/users.model");
// let usersData = require("../db.json/nextly.users.json");
let Users = require("../models/users.model");
let TCO = require("../models/tco.model");
let tcoData = require("../db.json/tcos.json");

router.route("/").get((req, res) => {
  // Users.find().then((val) => {
  //   if (val.length > 0) {
  //     console.log("have Users  ");
  //   } else {
  //     const strReplace = JSON.stringify(usersData)
  //       .replaceAll(/\\"/g, "")
  //       .replaceAll("ObjectId(", "")
  //       .replaceAll(')"', '"');

  //     Users.insertMany(JSON.parse(strReplace), function (err) {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         console.log("add Users  data");
  //       }
  //     });
  //   }
  // });

  TCO.find().then((val) => {
    if (val.length > 0) {
      console.log("Already have TCO");
    } else {
      const strReplace = JSON.stringify(tcoData)
        .replaceAll(/\\"/g, "")
        .replaceAll("ObjectId(", "")
        .replaceAll(')"', '"');

      TCO.insertMany(JSON.parse(strReplace), function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("add TCO data");
        }
      });
    }
  });
  res.json("Done");
});

router.route("/:id").put((req, res) => {
  const user = Users.findById(req.params.id);
  if (!user) {
    res.status(404).send("User not found");
  } else {
    user.updateOne({ $set: req.body }).then((data) => res.json(data));
  }
});

router.route("/").post(async (req, res) => {
  try {
    const user = await Users.findOne({
      email: req.body.email,
      username: req.body.username,
    });
    if (user) {
      res.status(400).send("User already exists");
    } else {
      const newUser = new Users(req.body);
      await newUser.save();
      res.status(201).json(newUser);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
