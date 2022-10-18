const { isDarkmode } = require('../middleware/route-guard');

const router = require('express').Router();

/* GET home page */
router.get('/', isDarkmode, (req, res, next) => {
  const darkmode = req.darkmode;
  res.render('index', { darkmode });
});

module.exports = router;
