const router = require('express').Router();

/* GET home page */
router.get('/', (req, res, next) => {
  // if (req.isAuthenticated()) {
  //   return res.redirect('/dashboard');
  // }
  res.render('index');
});

module.exports = router;
