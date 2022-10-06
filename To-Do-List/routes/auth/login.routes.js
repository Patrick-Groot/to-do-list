const User = require("../../models/User.model");
const bcryptjs = require("bcryptjs");
const router = require("express").Router();

router.get("/login", (req, res, next) => {
  try {
    res.render("auth/login");
  } catch (err) {
    console.error(err);
  }
});

router.post("/login", async (req, res, next) => {
  console.log(req.body);
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (!existingUser) {
      console.log("No user with this username");
      return res.render("auth/login", {
        error:
          "No user with this username found. Please try again or sign-up first",
      });
    }
    const correctPassword = await bcryptjs.compare(
      req.body.password,
      existingUser.password
    );
    if (!correctPassword) {
      console.log("Username and password don't match");
      return res.render("auth/login", {
        error:
          "Username and password don't match. Please try again or sign-up first",
      });
    }
    console.log("Match!");
    req.session.currentUser = { username: existingUser.username };
    res.redirect("/protected");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
