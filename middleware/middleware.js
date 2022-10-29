// middleware/route-guard.js
const User = require('../models/User.model');

// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated() == false) {
    return res.redirect('/login');
  }
  next();
};

// if an already logged in user tries to access the login page it
// redirects the user to the home page
const isLoggedOut = (req, res, next) => {
  if (req.isAuthenticated() == true) {
    return res.redirect('/');
  }
  next();
};

// Checks if user has enables darkmode
const isDarkmode = async (req, res, next) => {
  if (req.isAuthenticated()) {
    const user = await User.findById(req.session.passport.user.id);
    if (!user.darkmode) req.darkmode = false;
    if (user.darkmode) req.darkmode = true;
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
  isDarkmode,
};
