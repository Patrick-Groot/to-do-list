const router = require("express").Router();


router.get("/login", (req, res, next) => {
  try {
    res.render("login");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
