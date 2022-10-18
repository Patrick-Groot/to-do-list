const router = require('express').Router();
const User = require("../models/User.model");

/* GET home page */
router.get('/', async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.user.id);
    const darkmode = {};
    if (!foundUser.settings.darkmode) {
      return res.render("index");
    }
    return res.render("index", { darkmode });
  } catch (err) {
    console.error("Sorry, there was an error: ", err);
    res.render("error");
  }
});

module.exports = router;
