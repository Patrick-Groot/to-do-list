const router = require("express").Router();

router.get("/protected", (req, res, next) => {
  try {
    res.render("auth/protected");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
