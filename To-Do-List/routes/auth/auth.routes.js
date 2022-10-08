const User = require('../../models/User.model');

const express = require('express');
const mongoose = require('mongoose');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const bcryptjs = require('bcryptjs');
const router = require('express').Router();

const saltRounds = 10;

// require auth middleware
const { isLoggedIn, isLoggedOut } = require('../../middleware/route-guard.js');

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

      console.log(user);

      // If password valid call done and serialize user.id to req.user property
      if (passwordValid) {
        console.log('Logged in');
        return done(null, {
          id: user.id,
          name: user.username,
        });
      }
      // If invalid call done with false and flash message
      return done(null, false);
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    // console.log('serializeUser: ', user); // Trying to see if/how sessions are working here...
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    // console.log('deserializeUser: ', user); // Trying to see if/how sessions are working here...
    return cb(null, user);
  });
});

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

router.get('/dashboard', isLoggedIn, async function (req, res, next) {
  const foundUser = await User.findById(req.user.id);
  console.log('Found User Name: ', foundUser.username);
  // const { username } = foundUser.username;
  // console.log({ username })
  await foundUser.populate('lists');
  res.render('dashboard', { foundUser });
});

// Not logging out yet... Or maybe it does ;D
// It does log out!
router.post('/logout', isLoggedIn, function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.get('/signup', isLoggedOut, (req, res, next) => {
  try {
    res.render('auth/signup');
  } catch (err) {
    console.error(err);
  }
});

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body;
  // console.log(username, password);

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
    res.redirect('/dashboard');
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

// Signup von passport/Github

/* POST /signup
 *
 * This route creates a new user account.
 *
 * A desired username and password are submitted to this route via an HTML form,
 * which was rendered by the `GET /signup` route.  The password is hashed and
 * then a new user record is inserted into the database.  If the record is
 * successfully created, the user is logged in.
 */
router.post('/signup', function (req, res, next) {
  var salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
    if (err) {
      return next(err);
    }
    db.run('INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [req.body.username, hashedPassword, salt], function (err) {
      if (err) {
        return next(err);
      }
      var user = {
        id: this.lastID,
        username: req.body.username,
      };
      req.login(user, function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
});

module.exports = router;