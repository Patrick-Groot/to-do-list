const router = require('express').Router();
const List = require('../../models/List.model');
const User = require('../../models/User.model');
const Item = require('../../models/Item.model');

router.post('/newlist', async (req, res, next) => {
  const newList = await List.create({ name: req.body.listName });
  console.log('New list: ', newList);
  const foundUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      $push: { lists: newList._id },
    },
    { new: true }
  );
  res.redirect('/dashboard');
});

router.post('/:listId/delete', async (req, res, next) => {
  console.log(req.user);
  const foundListToDelete = await List.findById(req.params.listId);
  if (foundListToDelete.items) {
    foundListToDelete.items.forEach(async (elem) => {
      console.log(elem);
      await Item.findByIdAndDelete(elem);
    });
  }
  const listToDelete = await List.findByIdAndDelete(req.params.listId);
  res.redirect('/dashboard');
});

// JS "Window location" to hide params
// req.session.whatever = data + redirect
// TODO: fix url
router.post('/:id', async (req, res, next) => {
  const list = await List.findById(req.params.id);
  await list.populate('items');
  req.session.list = list;
  console.log('POST SESSION----------->', req.session);
  res.redirect('/list');
  // res.render('myList', { list });
});

router.get('/list', async (req, res, next) => {
  console.log('GET SESSION----------->', req.session);
  res.render('myList', { list: req.session.list });
});

// ####

router.post('/:id/newitem', async (req, res, next) => {
  const newItem = await Item.create({ name: req.body.itemName, deadline: req.body.itemDeadline });
  console.log('New item: ', newItem);

  const foundList = await List.findByIdAndUpdate(
    req.params.id,
    {
      $push: { items: newItem._id },
    },
    { new: true }
  );
  await foundList.populate('items');
  console.log(foundList);
  req.session.list = foundList;
  res.redirect('/list');
});

router.post('/:listId/:itemId/delete', async (req, res, next) => {
  const listWithItemToDelete = await List.findByIdAndUpdate(
    req.params.listId,
    {
      $pull: { items: req.params.itemId },
    },
    { new: true }
  );
  console.log(listWithItemToDelete);
  const itemToDelete = await Item.findByIdAndDelete(req.params.itemId);
  await listWithItemToDelete.populate('items');
  req.session.list = listWithItemToDelete;
  res.redirect('/list');
});

router.post('/:listId/:itemId/edit', async (req, res, next) => {
  const listWithItemToEdit = await List.findById(req.params.listId);
  const itemToUpdate = await Item.findByIdAndUpdate(
    req.params.itemId,
    {
      name: req.body.name,
      deadline: req.body.deadline,
    },
    { new: true }
  );
  await listWithItemToEdit.populate('items');
  req.session.list = listWithItemToEdit;
  console.log("itemID: ", req.params.itemId);
  console.log("Req Ses List: ", req.session.list.items[0].id);
  res.redirect('/list');
});

router.post('/:listId/edit', async (req, res, next) => {
  const listToEdit = await List.findByIdAndUpdate(
    req.params.listId,
    {
      name: req.body.name,
    },
    { new: true }
  );
 /*  console.log('List to edit: ', listToEdit);
  console.log('Req Body: ', req.body);
  const foundUser = await User.findById(req.user.id);
  await foundUser.populate('lists'); */
  res.redirect('/dashboard');
});

module.exports = router;
