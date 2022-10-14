const router = require('express').Router();
const List = require('../../models/List.model');
const User = require('../../models/User.model');
const Item = require('../../models/Item.model');

// Notes from Rico, maybe still useful
// JS "Window location" to hide params
// req.session.whatever = data + redirect

// POST got to list
router.post('/:id', async (req, res, next) => {
  const list = await List.findById(req.params.id);
  await list.populate('items');
  console.log(list.items);
  req.session.list = list;
  console.log('POST SESSION----------->', req.session);
  res.redirect('/list');
});

// GET go to list
router.get('/list', async (req, res, next) => {
  //console.log('GET SESSION----------->', req.session);
  sortedList = JSON.parse(JSON.stringify(req.session.list));
  sortedList.items.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  //console.log(sortedList)
  res.render('user/myList', { list: sortedList });
});

// POST new list item
router.post('/:id/newitem', async (req, res, next) => {
  const nameForNewItem = req.sanitize(req.body.itemName);
  const deadlineForNewItem = req.sanitize(req.body.itemDeadline);
  const newItem = await Item.create({ name: nameForNewItem, deadline: deadlineForNewItem, done: false });
  console.log('reqBodyitemDeadline: ', req.body.itemDeadline);
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

// POST delete list item
router.post('/:listId/:itemId/delete', async (req, res, next) => {
  const listWithItemToDelete = await List.findByIdAndUpdate(
    req.params.listId,
    {
      $pull: { items: req.params.itemId },
    },
    { new: true }
  );
  // console.log(listWithItemToDelete);
  await Item.findByIdAndDelete(req.params.itemId);
  await listWithItemToDelete.populate('items');
  req.session.list = listWithItemToDelete;
  res.redirect('/list');
});

// POST mark item as "done" or "undone"
router.post('/:listId/:itemId/done', async (req, res, next) => {
  const itemToMark = await Item.findById(req.params.itemId);
  console.log(itemToMark);
  if (itemToMark.done === false) {
    await Item.findByIdAndUpdate(req.params.itemId, { done: true });
  } else await Item.findByIdAndUpdate(req.params.itemId, { done: false });
  const list = await List.findById(req.params.listId);
  await list.populate('items');
  req.session.list = list;
  res.redirect('/list');
});

// POST edit list item
router.post('/:listId/:itemId/edit', async (req, res, next) => {
  const newNameForItem = req.sanitize(req.body.name);
  const newDeadlineForItem = req.sanitize(req.body.deadline);

  const listWithItemToEdit = await List.findById(req.params.listId);

  await Item.findByIdAndUpdate(
    req.params.itemId,
    {
      name: newNameForItem,
      deadline: newDeadlineForItem,
    },
    { new: true }
  );

  await listWithItemToEdit.populate('items');
  req.session.list = listWithItemToEdit;
  // console.log('itemID: ', req.params.itemId);
  // console.log('Req Ses List: ', req.session.list.items[0].id);
  res.redirect('/list');
});

module.exports = router;
