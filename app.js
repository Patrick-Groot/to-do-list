// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

const app = express();

const passport = require('passport');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

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

// Routes for Signup & Login
const authRouter = require('./routes/auth/auth.routes');
app.use('/', authRouter);

// Routes for Dashboard
const dashboardRouter = require('./routes/user/dashboard.routes');
app.use('/', dashboardRouter);

// Routes for toDoLists
const listRouter = require('./routes/user/list.routes');
app.use('/', listRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
