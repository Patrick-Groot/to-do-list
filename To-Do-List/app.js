// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

const passport = require('passport');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

// use session here:
require('./config/session.config')(app);

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config')(app);

// default value for title local
const capitalized = require('./utils/capitalized');
const projectName = 'To-Do-List';

app.locals.appTitle = `${capitalized(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const index = require('./routes/index.routes');
app.use('/', index);

const authRouter = require('./routes/auth/auth.routes');
app.use('/', authRouter);

const protectedRouter = require('./routes/protected.routes');
app.use('/', protectedRouter);

const listRouter = require('./routes/list/list.routes');
app.use('/', listRouter);

app.post('/login', passport.authenticate('local-login', { session: false }), (req, res, next) => {
  // login
  /* jwt.sign(
      { user: req.user },
      "secretKey",
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          return res.json({
            message: "Failed to login",
            token: null,
          });
        } */
  res.json({
    user: req.user,
  });
});

app.post('/signup', passport.authenticate('local-signup', { session: false }), (req, res, next) => {
  // sign up
  res.json({
    user: req.user,
  });
});

app.get(
  '/protected',
  /* passport.authenticate("jwt", { session: false }), */
  (req, res, next) => {
    res.json({ user: req.user });
  }
);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
