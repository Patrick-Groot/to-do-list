const { isDarkmode } = require('../middleware/middleware.js');

module.exports = (app) => {
  app.use(isDarkmode, (req, res, next) => {
    const darkmode = req.darkmode;
    // this middleware runs whenever requested page is not available
    res.status(404).render('not-found', { darkmode });
  });

  app.use(isDarkmode, (err, req, res, next) => {
    const darkmode = req.darkmode;
    // whenever you call next(err), this middleware will handle the error
    // always logs the error
    console.error('ERROR', req.method, req.path, err);

    // only render if the error ocurred before sending the response
    if (!res.headersSent) {
      res.status(500).render('error', { darkmode });
    }
  });
};
