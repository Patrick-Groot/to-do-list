const router = require("express").Router();
const passport = require("passport");

router.get("/signup", (req, res, next) => {
  try {
    res.render("auth/signup");
  } catch (err) {
    console.error(err);
  }
});



module.exports = router;
