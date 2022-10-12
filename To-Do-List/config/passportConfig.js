// const User = require('..models/User.model');

// const express = require('express');
// const passport = require('passport');
// const LocalStrategy = require('passport-local');
// const crypto = require('crypto');
// const db = require('../db');

// passport.use(new LocalStrategy(function verify(username, password, cb) {
//   User.findOne({username}) {

//   }
//   db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, row) {
//     if (err) { return cb(err); }
//     if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

//     crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
//       if (err) { return cb(err); }
//       if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
//         return cb(null, false, { message: 'Incorrect username or password.' });
//       }
//       return cb(null, row);
//     });
//   });
// }));

// passport.use(
//   'local-login',
//   new LocalStrategy(
//     {
//       usernameField: 'email',
//       passwordField: 'password',
//     },
//     async (email, password, done) => {
//       try {
//         const user = await User.findOne({ email: email });
//         if (!user) return done(null, false);
//         const isMatch = await user.matchPassword(password);
//         if (!isMatch) return done(null, false);
//         // if passwords match return user
//         return done(null, user);
//       } catch (error) {
//         console.log(error);
//         return done(error, false);
//       }
//     }
//   )
// );

// module.exports = (passport) => {
//   passport.use(
//     'local-signup',
//     new LocalStrategy(
//       {
//         usernameField: 'email',
//         passwordField: 'password',
//       },
//       async (email, password, done) => {
//         try {
//           // check if user exists
//           const userExists = await User.findOne({ email: email });
//           if (userExists) {
//             return done(null, false);
//           }
//           // Create a new user with the user data provided
//           const user = await User.create({ email, password });
//           return done(null, user);
//         } catch (error) {
//           done(error);
//         }
//       }
//     )
//   );

//   /* passport.use(
//     new JwtStrategy(
//       {
//         jwtFromRequest: ExtractJwt.fromHeader("authorization"),
//         secretOrKey: "secretKey",
//       },
//       async (jwtPayload, done) => {
//         try {
//           // Extract user
//           const user = jwtPayload.user;
//           done(null, user);
//         } catch (error) {
//           done(error, false);
//         }
//       }
//     )
//   ); */
// };
