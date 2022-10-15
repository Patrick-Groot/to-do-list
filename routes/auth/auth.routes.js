const User = require('../../models/User.model');

const express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

// require auth middleware
const { isLoggedIn, isLoggedOut } = require('../../middleware/route-guard.js');

// Passport stuff - should live somewhere else...
// https://github.com/howardmann/authentication
passport.use(
  'local-login',
  new LocalStrategy(
    {
      // Fields to accept
      usernameField: 'username', // default is username, override to accept email
      passwordField: 'password',
      passReqToCallback: true, // allows us to access req in the call back
    },
    async (req, username, password, done) => {
      username = req.sanitize(username);
      password = req.sanitize(password);
      // Check if user and password is valid
      let user = await User.findOne({ username });
      let passwordValid = user && bcryptjs.compareSync(password, user.passwordHash);

      console.log(user);

      // If password valid call done and serialize user.id to req.user property
      if (passwordValid) {
        console.log('Logged in');
        return done(null, {
          id: user.id,
          name: user.username,
        });
      }
      return done(null, false);
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// Login Routes
router.get('/login', isLoggedOut, function (req, res, next) {
  res.render('auth/login');
});

router.post(
  '/login',
  passport.authenticate('local-login', {
    successReturnToOrRedirect: '/dashboard',
    failureRedirect: '/login',
    failureMessage: true,
  })
);

// Signup Routes
router.get('/signup', isLoggedOut, (req, res, next) => {
  try {
    res.render('auth/signup');
  } catch (err) {
    console.error(err);
  }
});

router.post('/signup', async (req, res, next) => {
  const username = req.sanitize(req.body.username);
  const password = req.sanitize(req.body.password);

  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render('auth/signup', {
      errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.',
    });
    return;
  }

  try {
    const salt = await bcryptjs.genSalt(saltRounds);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const createdUser = await User.create({ username, passwordHash: hashedPassword });
    console.log('new user:', createdUser);
    res.redirect('/login');
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('auth/signup', { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render('auth/signup', {
        errorMessage: 'Username and email need to be unique. Either username or email is already used.',
      });
    } else {
      next(error);
    }
  }
});

// Logout Route
router.post('/logout', isLoggedIn, function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
