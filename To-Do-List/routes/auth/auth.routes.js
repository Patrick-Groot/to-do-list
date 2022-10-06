const User = require('../../models/User.model');

const express = require('express');
const mongoose = require('mongoose');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const bcryptjs = require('bcryptjs');
const router = require('express').Router();

const saltRounds = 10;

// This is not working...
// passport.use(
//   new LocalStrategy(function verify(username, password, cb) {
//     User.findOne({ username }).then((user) => {
//       if (!user) {
//         console.log('No user with this username');
//         return res.render('auth/login', {
//           errorMessage: 'No user with this username found. Please try again or sign-up first.',
//         });
//       } else if (bcryptjs.compareSync(password, user.passwordHash)) {
//         res.redirect('/userProfile');
//         if (!correctPassword) {
//           console.log("Username and password don't match");
//           return res.render('auth/login', {
//             errorMessage: "Username and password don't match. Please try again or sign-up first.",
//           });
//         }
//       }
//     });
//   })
// );

// Trying to make this callback-nonsense work here...
// passport.use(

//   new LocalStrategy(function verify(username, password, cb) {

//     User.findOne({ username }).then((user) => {

//         if (err) { return cb(err); }

//         if (!user) { return cb(null, false, { errorMessage: 'Incorrect username or password.' })
//       } else if (bcryptjs.compareSync(password, user.passwordHash)) {
//       if (err) { return cb(err); }
//         if (!correctPassword) {
//           console.log("Username and password don't match");
//           return cb(null, false, { errorMessage: 'Incorrect username or password.' });
//         }
//         return cb(null, user);
//       }
// ##################################################
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
      // Check if user and password is valid
      let user = await User.findOne({ username });
      let passwordValid = user && bcryptjs.compareSync(password, user.passwordHash);

      // If password valid call done and serialize user.id to req.user property
      if (passwordValid) {
        console.log('Logged in');
        return done(null, {
          id: user.id,
        });
      }
      // If invalid call done with false and flash message
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

router.get('/login', function (req, res, next) {
  res.render('auth/login');
});

router.post(
  '/login',
  passport.authenticate('local-login', {
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
