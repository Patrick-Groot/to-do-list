const router = require('express').Router();

/* GET home page */
router.get('/', (req, res, next) => {
  // res.render("index");
  // res.render('auth/login');
  console.log(req.session);
  if (req.session) {
    return res.redirect("/dashboard");
  }
  res.render('index');
});

module.exports = router;
