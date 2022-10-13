const router = require('express').Router();
const List = require('../../models/List.model');
const User = require('../../models/User.model');

// require auth middleware
const { isLoggedIn } = require('../../middleware/route-guard.js');

// GET Dashboard
router.get('/dashboard', isLoggedIn, async function (req, res, next) {
  const foundUser = await User.findById(req.user.id);
  console.log('Found User Name: ', foundUser.username);

  await foundUser.populate('lists');
  res.render('user/dashboard', { foundUser });
});

// POST edit list name
router.post('/:listId/edit', async (req, res, next) => {
  const listToEdit = await List.findByIdAndUpdate(
    req.params.listId,
    {
      name: req.body.name,
    },
    { new: true }
  );
  res.redirect('/dashboard');
});

module.exports = router;
