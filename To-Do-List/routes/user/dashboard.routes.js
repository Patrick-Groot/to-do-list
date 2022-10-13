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

// POST New list
router.post('/newlist', async (req, res, next) => {
  const nameForNewList = req.sanitize(req.body.listName);

  const newList = await List.create({ name: nameForNewList });
  console.log('New list: ', newList);
  await User.findByIdAndUpdate(
    req.user.id,
    {
      $push: { lists: newList._id },
    },
    { new: true }
  );
  res.redirect('/dashboard');
});

// POST edit list name
router.post('/:listId/edit', async (req, res, next) => {
  const newNameForList = req.sanitize(req.body.name);

  await List.findByIdAndUpdate(
    req.params.listId,
    {
      name: newNameForList,
    },
    { new: true }
  );
  res.redirect('/dashboard');
});

// Post delete list
router.post('/:listId/delete', async (req, res, next) => {
  const foundListToDelete = await List.findById(req.params.listId);
  if (foundListToDelete.items) {
    foundListToDelete.items.forEach(async (elem) => {
      console.log(elem);
      await Item.findByIdAndDelete(elem);
    });
  }
  await List.findByIdAndDelete(req.params.listId);
  res.redirect('/dashboard');
});

module.exports = router;
