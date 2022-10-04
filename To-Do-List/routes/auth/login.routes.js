app.post(
  "/auth/login",
  passport.authenticate(local - login, { session: false }),
  (req, res, next) => {
    // login
    res.json({
      user: req.user,
    });
  }
);
