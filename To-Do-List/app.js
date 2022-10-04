// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// Import jsonwebtoken
const jsonwebtoken = require("jsonwebtoken");

// default value for title local
const capitalized = require("./utils/capitalized");
const projectName = "To-Do-List";

app.locals.appTitle = `${capitalized(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

const loginRouter = require("./routes/auth/login.routes");
app.use("/", loginRouter);

const signupRouter = require("./routes/auth/signup.routes");
app.use("/", signupRouter);

app.post(
  "/auth/login",
  passport.authenticate("local-login", { session: false }),
  (req, res, next) => {
    // login
    jwt.sign(
      { user: req.user },
      "secretKey",
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          return res.json({
            message: "Failed to login",
            token: null,
          });
        }
        res.json({
          token,
        });
      }
    );
  }
);

app.post(
  "/auth/signup",
  passport.authenticate("local-signup", { session: false }),
  (req, res, next) => {
    // sign up
    res.json({
      user: req.user,
    });
  }
);

app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({ user: req.user });
  }
);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
