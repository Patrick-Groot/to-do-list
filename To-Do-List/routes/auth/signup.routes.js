app.post(
    "/auth/signup",
    passport.authenticate(local - signup, { session: false }),
    (req, res, next) => {
      // sign up
      res.json({
        user: req.user,
      });
    }
  );