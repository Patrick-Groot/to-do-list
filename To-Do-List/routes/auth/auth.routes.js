const User = require('../../models/User.model');

const express = require('express');
const mongoose = require('mongoose');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const bcryptjs = require('bcryptjs');
const router = require('express').Router();

const saltRounds = 10;

passport.use(
  new LocalStrategy(function verify(username, password, cb) {
    User.findOne({ username: username }).then((existingUser) => {
      if (!existingUser) {
        console.log('No user with this username');
        return res.render('auth/login', {
          error: 'No user with this username found. Please try again or sign-up first',
        });
      }
      const correctPassword = bcryptjs.compare(password, existingUser.password);

      if (!correctPassword) {
        console.log("Username and password don't match");
        return res.render('auth/login', {
          error: "Username and password don't match. Please try again or sign-up first",
        });
      }
    });
  })
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

router.get('/login', (req, res, next) => {
  try {
    res.render('auth/login');
  } catch (err) {
    console.error(err);
  }
});

router.post(
  '/login',
  passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
    failureMessage: true,
  })
);

router.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.get('/signup', (req, res, next) => {
  try {
    res.render('auth/signup');
  } catch (err) {
    console.error(err);
  }
});

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);
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
    res.redirect('protected');
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

// router.post("/login", async (req, res, next) => {
//   console.log(req.body);
//   try {
//     const existingUser = await User.findOne({ username: req.body.username });
//     if (!existingUser) {
//       console.log("No user with this username");
//       return res.render("auth/login", {
//         error:
//           "No user with this username found. Please try again or sign-up first",
//       });
//     }
//     const correctPassword = await bcryptjs.compare(
//       req.body.password,
//       existingUser.password
//     );
//     if (!correctPassword) {
//       console.log("Username and password don't match");
//       return res.render("auth/login", {
//         error:
//           "Username and password don't match. Please try again or sign-up first",
//       });
//     }
//     console.log("Match!");
//     req.session.currentUser = { username: existingUser.username };
//     res.redirect("/protected");
//   } catch (err) {
//     console.error(err);
//   }
// });

module.exports = router;
