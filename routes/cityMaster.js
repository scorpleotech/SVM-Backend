const router = require("express").Router();
const passport = require("passport");
const {
  createCity,
  createManyCity,
  getAllStates,
  getAllCities,
} = require("../controllers/cityMaster.controller");

const authenticate = passport.authenticate("jwt", { session: false });

router.post("/", createCity);
router.get("/:state", getAllCities);
router.post("/bulk", createManyCity);
router.get("/state/list", getAllStates);

module.exports = router;
