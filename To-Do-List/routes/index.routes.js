const router = require('express').Router();

/* GET home page */
router.get('/', (req, res, next) => {
  // res.render("index");
  // res.render('auth/login');
  res.render('auth/signup');
});

module.exports = router;