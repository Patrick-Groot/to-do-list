const User = require("../../models/User.model");
const router = require("express").Router();

router.get("/signup", (req, res, next) => {  
  try {
    res.render("auth/signup");
  } catch (err) {
    console.error(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    console.log("req.body: ", req.body)
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();
    res.redirect("/protected");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
