const router = require("express").Router();

router.get("/signup", (req, res, next) => {
  try {
    res.render("auth/signup");
  } catch (err) {
    console.error(err);
  }
});



module.exports = router;
