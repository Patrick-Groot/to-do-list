const router = require("express").Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

router.get("/login", (req, res, next) => {
  try {
    res.render("login");
  } catch (err) {
    console.error(err);
  }
});



module.exports = router;
