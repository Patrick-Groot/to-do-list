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

// Returns 10/10/22
hbs.registerHelper('toLocaleString', function (number) {
  const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
  return number.toLocaleString('en-us', options);
});

// Returns 2022-10-10
// hbs.registerHelper('toLocaleString', function (number) {
//   return number.toISOString().split('T')[0];
// });

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

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
